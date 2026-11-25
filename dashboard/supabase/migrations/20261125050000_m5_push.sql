-- M5: push notifications. The push function needs the list of eligible
-- drivers (with tokens) for a trip; only the service role may call it.

create function eligible_drivers(p_trip uuid)
returns table (driver_id uuid, push_token text)
language sql stable security definer set search_path = public as $$
  select p.id, p.push_token
  from profiles p
  where p.push_token is not null
    and is_eligible(p.id, p_trip)
$$;

revoke execute on function eligible_drivers(uuid) from public;
revoke execute on function eligible_drivers(uuid) from authenticated;
grant execute on function eligible_drivers(uuid) to service_role;
