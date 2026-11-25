-- M3: dispatch. RPC functions own every trip state change, a trigger writes
-- the audit log, and pg_cron runs the timeouts every 15 seconds.

-- ---------------------------------------------------------------------------
-- Audit log: every insert/update on trips writes trip_events.
-- ---------------------------------------------------------------------------

create function log_trip_event() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into trip_events (trip_id, actor_id, event, data)
    values (new.id, auth.uid(), 'created',
            jsonb_build_object('status', new.status, 'fare', new.fare));
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into trip_events (trip_id, actor_id, event, data)
    values (new.id, auth.uid(), 'status:' || new.status,
            jsonb_build_object(
              'from', old.status,
              'to', new.status,
              'driver_id', new.driver_id
            ));
  end if;

  if new.fare is distinct from old.fare
     or new.commission is distinct from old.commission
     or new.fare_overridden is distinct from old.fare_overridden then
    insert into trip_events (trip_id, actor_id, event, data)
    values (new.id, auth.uid(), 'fare_override',
            jsonb_build_object(
              'fare', new.fare,
              'commission', new.commission,
              'overridden', new.fare_overridden
            ));
  end if;

  return new;
end
$$;

create trigger trips_log
  after insert or update on trips
  for each row execute function log_trip_event();

-- ---------------------------------------------------------------------------
-- dispatch_trip: owner starts the alert round.
-- ---------------------------------------------------------------------------

create function dispatch_trip(p_trip uuid) returns trips
language plpgsql security definer set search_path = public as $$
declare t trips;
begin
  if not is_owner() then
    raise exception 'not_owner';
  end if;

  update trips
     set status = 'dispatching', dispatched_at = now()
   where id = p_trip and status in ('draft', 'unassigned')
  returning * into t;

  if t.id is null then
    raise exception 'not_dispatchable';
  end if;

  return t;
end
$$;

-- ---------------------------------------------------------------------------
-- accept_trip: first-to-accept. Only one UPDATE can match
-- status = 'dispatching', so concurrent accepts resolve to exactly one winner.
-- ---------------------------------------------------------------------------

create function accept_trip(p_trip uuid) returns trips
language plpgsql security definer set search_path = public as $$
declare t trips;
begin
  -- A trip that is no longer dispatching was taken (or re-assigned): say so
  -- before the eligibility check, which would otherwise report not_eligible.
  if not exists (select 1 from trips where id = p_trip) then
    raise exception 'not_found';
  end if;
  if exists (select 1 from trips where id = p_trip and status <> 'dispatching') then
    raise exception 'already_taken';
  end if;

  if not is_eligible(auth.uid(), p_trip) then
    raise exception 'not_eligible';
  end if;

  update trips
     set status = 'accepted', driver_id = auth.uid(), accepted_at = now()
   where id = p_trip and status = 'dispatching'
  returning * into t;

  if t.id is null then
    raise exception 'already_taken';
  end if;

  -- Belt and braces for a driver racing two different trips at once: the
  -- eligibility check above ran before either UPDATE grabbed a row lock.
  if exists (
    select 1 from trips other
    where other.driver_id = auth.uid()
      and other.id <> p_trip
      and other.status in ('accepted', 'on_the_way', 'arrived', 'onboard')
  ) then
    raise exception 'already_on_trip';
  end if;

  return t;
end
$$;

-- ---------------------------------------------------------------------------
-- set_trip_status: the assigned driver (or the owner) moves the trip forward,
-- one legal step at a time.
-- ---------------------------------------------------------------------------

create function set_trip_status(
  p_trip uuid,
  p_status trip_status,
  p_lat numeric default null,
  p_lng numeric default null
) returns trips
language plpgsql security definer set search_path = public as $$
declare t trips;
begin
  select * into t from trips where id = p_trip for update;
  if t.id is null then
    raise exception 'not_found';
  end if;
  if not (is_owner() or t.driver_id = auth.uid()) then
    raise exception 'not_allowed';
  end if;

  if not (
       (t.status = 'accepted' and p_status = 'on_the_way')
    or (t.status = 'on_the_way' and p_status = 'arrived')
    or (t.status = 'arrived' and p_status = 'onboard')
    or (t.status = 'onboard' and p_status = 'completed')
  ) then
    raise exception 'bad_transition';
  end if;

  update trips
     set status = p_status,
         arrived_at = case when p_status = 'arrived' then now() else arrived_at end,
         onboard_at = case when p_status = 'onboard' then now() else onboard_at end,
         completed_at = case when p_status = 'completed' then now() else completed_at end,
         arrived_lat = case when p_status = 'arrived' then p_lat else arrived_lat end,
         arrived_lng = case when p_status = 'arrived' then p_lng else arrived_lng end
   where id = p_trip
  returning * into t;

  return t;
end
$$;

-- ---------------------------------------------------------------------------
-- cancel_trip: the owner cancels; a driver who cancels after accepting sends
-- the trip back to dispatch (and the cancellation is in the event log).
-- ---------------------------------------------------------------------------

create function cancel_trip(p_trip uuid, p_reason text) returns trips
language plpgsql security definer set search_path = public as $$
declare t trips;
begin
  select * into t from trips where id = p_trip for update;
  if t.id is null then
    raise exception 'not_found';
  end if;

  if is_owner() then
    update trips
       set status = 'cancelled', cancelled_at = now(), cancel_reason = p_reason
     where id = p_trip
    returning * into t;
    return t;
  end if;

  if t.driver_id <> auth.uid() then
    raise exception 'not_allowed';
  end if;
  if t.status not in ('accepted', 'on_the_way', 'arrived', 'onboard') then
    raise exception 'bad_transition';
  end if;

  insert into trip_events (trip_id, actor_id, event, data)
  values (t.id, auth.uid(), 'driver_cancelled', jsonb_build_object('reason', p_reason));

  update trips
     set status = 'dispatching', driver_id = null, accepted_at = null,
         cancel_reason = p_reason
   where id = p_trip
  returning * into t;

  return t;
end
$$;

-- ---------------------------------------------------------------------------
-- assign_trip: manual assignment when the owner has called a driver directly.
-- ---------------------------------------------------------------------------

create function assign_trip(p_trip uuid, p_driver uuid) returns trips
language plpgsql security definer set search_path = public as $$
declare t trips;
begin
  if not is_owner() then
    raise exception 'not_owner';
  end if;

  update trips
     set status = 'accepted', driver_id = p_driver, accepted_at = now()
   where id = p_trip and status in ('dispatching', 'unassigned')
  returning * into t;

  if t.id is null then
    raise exception 'not_assignable';
  end if;

  return t;
end
$$;

-- ---------------------------------------------------------------------------
-- Timeouts, run every 15 seconds by pg_cron.
-- ---------------------------------------------------------------------------

create function run_dispatch_timeouts() returns void
language plpgsql security definer set search_path = public as $$
declare s settings;
begin
  select * into s from settings where id;

  -- Nobody accepted in time: back to the owner, trip marked unassigned.
  update trips
     set status = 'unassigned'
   where status = 'dispatching'
     and dispatched_at < now() - make_interval(secs => s.accept_timeout_sec);

  -- Accepted but never marked "on the way": alert the owner once.
  insert into trip_events (trip_id, actor_id, event, data)
  select t.id, null, 'timeout_start',
         jsonb_build_object('accepted_at', t.accepted_at, 'driver_id', t.driver_id)
  from trips t
  where t.status = 'accepted'
    and t.accepted_at < now() - make_interval(secs => s.start_timeout_sec)
    and not exists (
      select 1 from trip_events e
      where e.trip_id = t.id and e.event = 'timeout_start'
    );
end
$$;

revoke execute on function run_dispatch_timeouts() from public;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    if exists (select 1 from cron.job where jobname = 'dispatch_timeouts') then
      perform cron.unschedule('dispatch_timeouts');
    end if;
    perform cron.schedule(
      'dispatch_timeouts',
      '15 seconds',
      'select public.run_dispatch_timeouts()'
    );
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Grants: drivers call these RPCs; the guards inside decide what is allowed.
-- ---------------------------------------------------------------------------

grant execute on function dispatch_trip(uuid) to authenticated;
grant execute on function accept_trip(uuid) to authenticated;
grant execute on function set_trip_status(uuid, trip_status, numeric, numeric) to authenticated;
grant execute on function cancel_trip(uuid, text) to authenticated;
grant execute on function assign_trip(uuid, uuid) to authenticated;
