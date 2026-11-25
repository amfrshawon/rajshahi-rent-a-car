-- M4: commission, payments and adjustments. The ledger is insert-only;
-- money screens read it, and a trigger charges commission exactly once.

-- Commission is charged when a trip becomes completed. The unique
-- (trip_id, kind) constraint makes a double charge impossible.
create function add_commission_on_complete() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'completed'
     and old.status is distinct from 'completed'
     and new.driver_id is not null then
    insert into ledger (driver_id, trip_id, kind, amount, created_by)
    values (new.driver_id, new.id, 'commission', new.commission, auth.uid())
    on conflict (trip_id, kind) do nothing;
  end if;
  return new;
end
$$;

create trigger trips_add_commission
  after update of status on trips
  for each row execute function add_commission_on_complete();

-- The owner records a payment received from a driver (bKash/cash/bank).
create function record_payment(
  p_driver uuid,
  p_amount integer,
  p_method text,
  p_reference text default null,
  p_note text default null
) returns ledger
language plpgsql security definer set search_path = public as $$
declare l ledger;
begin
  if not is_owner() then
    raise exception 'not_owner';
  end if;
  if p_amount <= 0 then
    raise exception 'amount_positive';
  end if;

  insert into ledger (driver_id, kind, amount, method, reference, note, created_by)
  values (p_driver, 'payment', -p_amount, p_method, p_reference, p_note, auth.uid())
  returning * into l;

  return l;
end
$$;

-- Manual adjustment, positive (driver owes more) or negative (credit).
create function add_adjustment(
  p_driver uuid,
  p_amount integer,
  p_note text
) returns ledger
language plpgsql security definer set search_path = public as $$
declare l ledger;
begin
  if not is_owner() then
    raise exception 'not_owner';
  end if;
  if p_amount = 0 then
    raise exception 'amount_nonzero';
  end if;
  if p_note is null or length(trim(p_note)) = 0 then
    raise exception 'note_required';
  end if;

  insert into ledger (driver_id, kind, amount, note, created_by)
  values (p_driver, 'adjustment', p_amount, p_note, auth.uid())
  returning * into l;

  return l;
end
$$;

-- Drivers need the due limit to explain "you owe X; pay to get trips again".
create function current_due_limit() returns integer
language sql stable security definer set search_path = public as $$
  select due_limit from settings where id
$$;

grant execute on function record_payment(uuid, integer, text, text, text) to authenticated;
grant execute on function add_adjustment(uuid, integer, text) to authenticated;
grant execute on function current_due_limit() to authenticated;
