-- M2: the call inbox needs a device key, caller history and live updates.

-- The key MacroDroid sends with every call event. Generated once; the owner
-- can rotate it from the Settings screen.
alter table settings
  add column call_logger_key text not null
  default encode(extensions.gen_random_bytes(16), 'hex');

-- "N past trips" per caller number.
create index trips_family_phone_idx on trips (family_phone);

create view caller_trip_counts as
select
  t.family_phone as caller_number,
  count(*)::integer as trips
from trips t
group by t.family_phone;

grant select on caller_trip_counts to authenticated;

-- The Calls screen listens for new rows over Realtime.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'calls'
  ) then
    alter publication supabase_realtime add table calls;
  end if;
end
$$;
