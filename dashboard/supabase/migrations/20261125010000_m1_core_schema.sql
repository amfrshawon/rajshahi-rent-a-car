-- M1: core schema, row-level security and seed defaults.
-- Source: dashboard/docs/04-data-model.md (confirmed in the 2026-11-25
-- design review). Money is whole taka in integer; all times are timestamptz.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type user_role as enum ('owner', 'driver');
create type profile_status as enum ('pending', 'active', 'suspended');
create type vehicle_service as enum ('ambulance', 'car');
create type ambulance_type as enum ('non_ac', 'ac');
create type call_direction as enum ('incoming', 'outgoing', 'missed', 'rejected');
create type call_source as enum ('macrodroid', 'call_logger', 'manual');
create type trip_status as enum (
  'draft', 'dispatching', 'accepted', 'on_the_way', 'arrived', 'onboard',
  'completed', 'cancelled', 'unassigned'
);
create type ledger_kind as enum ('commission', 'payment', 'adjustment');

create sequence trip_code_seq start 1000;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'driver',
  full_name text not null,
  phone text not null unique,
  status profile_status not null default 'pending',
  on_duty boolean not null default false,
  push_token text,
  nid_number text,
  license_number text,
  created_at timestamptz not null default now()
);

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references profiles (id) on delete cascade,
  service vehicle_service not null default 'ambulance',
  ambulance_type ambulance_type,
  reg_number text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint ambulance_type_required check (service <> 'ambulance' or ambulance_type is not null)
);

create index vehicles_driver_idx on vehicles (driver_id);

create table calls (
  id uuid primary key default gen_random_uuid(),
  caller_number text not null,
  direction call_direction not null,
  started_at timestamptz not null,
  duration_sec integer not null default 0,
  sim_slot smallint,
  source call_source not null,
  handled boolean not null default false,
  outcome_note text,
  created_at timestamptz not null default now(),
  unique (caller_number, started_at)
);

create index calls_started_at_idx on calls (started_at desc);

create table places (
  id uuid primary key default gen_random_uuid(),
  name_bn text not null,
  name_en text not null,
  km_from_rmch numeric,
  lat numeric,
  lng numeric,
  is_default_pickup boolean not null default false,
  created_at timestamptz not null default now()
);

create table fare_bands (
  id uuid primary key default gen_random_uuid(),
  ambulance_type ambulance_type not null,
  min_km numeric not null,
  max_km numeric,
  fare integer not null,
  commission integer not null,
  active boolean not null default true,
  -- "set these" marker for seeded placeholder bands (M1 review: the owner
  -- supplies the real amounts).
  note text,
  created_at timestamptz not null default now(),
  constraint band_range check (max_km is null or max_km > min_km),
  constraint money_non_negative check (fare >= 0 and commission >= 0)
);

create table trips (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('A-' || nextval('trip_code_seq')),
  service vehicle_service not null default 'ambulance',
  call_id uuid references calls (id),
  family_name text,
  family_phone text not null,
  pickup_place_id uuid references places (id),
  pickup_text text,
  dest_place_id uuid references places (id),
  dest_text text,
  distance_km numeric not null,
  ambulance_type ambulance_type not null,
  patient_note text,
  fare integer not null,
  commission integer not null,
  fare_overridden boolean not null default false,
  status trip_status not null default 'draft',
  driver_id uuid references profiles (id),
  dispatched_at timestamptz,
  accepted_at timestamptz,
  arrived_at timestamptz,
  onboard_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  arrived_lat numeric,
  arrived_lng numeric,
  cancel_reason text,
  created_by uuid not null references profiles (id),
  created_at timestamptz not null default now(),
  constraint pickup_present check (pickup_place_id is not null or pickup_text is not null),
  constraint dest_present check (dest_place_id is not null or dest_text is not null)
);

create index trips_status_idx on trips (status);
create index trips_driver_idx on trips (driver_id);
create index trips_call_idx on trips (call_id);

create table trip_events (
  id bigint generated always as identity primary key,
  trip_id uuid not null references trips (id) on delete cascade,
  actor_id uuid references profiles (id),
  event text not null,
  data jsonb not null default '{}'::jsonb,
  at timestamptz not null default now()
);

create index trip_events_trip_idx on trip_events (trip_id, at);

create table ledger (
  id bigint generated always as identity primary key,
  driver_id uuid not null references profiles (id),
  trip_id uuid references trips (id),
  kind ledger_kind not null,
  amount integer not null,
  method text,
  reference text,
  note text,
  created_by uuid references profiles (id),
  at timestamptz not null default now(),
  -- commission is charged once per trip; payments and adjustments carry no
  -- trip_id, and NULLs do not conflict in a unique constraint
  constraint commission_once unique (trip_id, kind)
);

create index ledger_driver_idx on ledger (driver_id);

create table settings (
  id boolean primary key default true check (id),
  due_limit integer not null default 2000,
  accept_timeout_sec integer not null default 120,
  start_timeout_sec integer not null default 300,
  phone_hide_after_hours integer not null default 24
);

-- ---------------------------------------------------------------------------
-- Helper functions (defined before the views that use them)
-- ---------------------------------------------------------------------------

create function is_owner() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'owner'
  )
$$;

-- Eligibility: active, on duty, a matching ambulance, no trip in progress,
-- unpaid commission at or below the limit. Used by the open-trips view and
-- (from M3) by accept_trip.
create function is_eligible(p_driver uuid, p_trip uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from profiles p
    join vehicles v
      on v.driver_id = p.id and v.active and v.service = 'ambulance'
    join trips t
      on t.id = p_trip and t.status = 'dispatching'
     and t.ambulance_type = v.ambulance_type
    where p.id = p_driver
      and p.status = 'active'
      and p.on_duty
      and not exists (
        select 1 from trips busy
        where busy.driver_id = p.id
          and busy.status in ('accepted', 'on_the_way', 'arrived', 'onboard')
      )
      and coalesce((select sum(amount) from ledger where driver_id = p.id), 0)
          <= (select due_limit from settings)
  )
$$;

-- Drivers may update only on_duty and push_token on their own profile; the
-- owner may change anything. RLS cannot restrict columns, so this trigger
-- enforces it.
create function protect_profile_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() = old.id and not is_owner() then
    if new.role <> old.role
       or new.status <> old.status
       or new.full_name <> old.full_name
       or new.phone <> old.phone
       or new.nid_number is distinct from old.nid_number
       or new.license_number is distinct from old.license_number then
      raise exception 'only on_duty and push_token may be changed by the driver';
    end if;
  end if;
  return new;
end
$$;

create trigger profiles_protect_columns
  before update on profiles
  for each row execute function protect_profile_columns();

-- ---------------------------------------------------------------------------
-- Views
-- ---------------------------------------------------------------------------

-- Sum of ledger entries per driver. Positive = the driver owes more. The
-- owner sees every driver; a driver sees only their own row.
create view driver_balance as
select
  p.id as driver_id,
  coalesce(sum(l.amount), 0)::integer as balance
from profiles p
left join ledger l on l.driver_id = p.id
where p.role = 'driver'
  and (is_owner() or p.id = auth.uid())
group by p.id;

-- Dispatching trips this driver may accept. Deliberately leaves out
-- family_phone and family_name: the family's identity is revealed only
-- after accepting (requirements: "Keeping customers with the owner").
create view open_trips_for_driver as
select
  t.id, t.code, t.ambulance_type, t.distance_km, t.fare, t.patient_note,
  t.pickup_place_id, t.pickup_text, t.dest_place_id, t.dest_text,
  t.dispatched_at, t.created_at
from trips t
where t.status = 'dispatching'
  and is_eligible(auth.uid(), t.id);

-- The driver's own trips. The family's number disappears
-- phone_hide_after_hours after completion.
create view my_trips as
select
  t.id, t.code, t.service, t.family_name,
  case
    when t.status = 'completed'
      and t.completed_at < now() - make_interval(hours => (select phone_hide_after_hours from settings))
    then null
    else t.family_phone
  end as family_phone,
  t.pickup_place_id, t.pickup_text, t.dest_place_id, t.dest_text,
  t.distance_km, t.ambulance_type, t.patient_note, t.fare, t.commission,
  t.status, t.dispatched_at, t.accepted_at, t.arrived_at, t.onboard_at,
  t.completed_at, t.cancelled_at, t.cancel_reason, t.created_at
from trips t
where t.driver_id = auth.uid();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table calls enable row level security;
alter table places enable row level security;
alter table fare_bands enable row level security;
alter table trips enable row level security;
alter table trip_events enable row level security;
alter table ledger enable row level security;
alter table settings enable row level security;

-- profiles: owner everything; driver reads own row. Updates are filtered by
-- protect_profile_columns above.
create policy profiles_owner_all on profiles
  for all using (is_owner()) with check (is_owner());
create policy profiles_self_read on profiles
  for select using (id = auth.uid());
create policy profiles_self_update on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- vehicles: owner everything; driver reads own rows.
create policy vehicles_owner_all on vehicles
  for all using (is_owner()) with check (is_owner());
create policy vehicles_self_read on vehicles
  for select using (driver_id = auth.uid());

-- calls: owner only (drivers have no policy).
create policy calls_owner_all on calls
  for all using (is_owner()) with check (is_owner());

-- places and fare_bands: owner writes; drivers read.
create policy places_owner_all on places
  for all using (is_owner()) with check (is_owner());
create policy places_driver_read on places
  for select using (true);
create policy fare_bands_owner_all on fare_bands
  for all using (is_owner()) with check (is_owner());
create policy fare_bands_driver_read on fare_bands
  for select using (true);

-- trips: owner manages. Drivers never select the table directly -- they use
-- open_trips_for_driver (no family details) and my_trips. Status changes go
-- through security-definer RPCs from M3.
create policy trips_owner_all on trips
  for all using (is_owner()) with check (is_owner());

-- trip_events: owner everything; driver reads events of own trips.
create policy trip_events_owner_all on trip_events
  for all using (is_owner()) with check (is_owner());
create policy trip_events_driver_read on trip_events
  for select using (
    exists (
      select 1 from trips t
      where t.id = trip_events.trip_id and t.driver_id = auth.uid()
    )
  );

-- ledger: owner everything; driver reads own rows.
create policy ledger_owner_all on ledger
  for all using (is_owner()) with check (is_owner());
create policy ledger_driver_read on ledger
  for select using (driver_id = auth.uid());

-- settings: owner only.
create policy settings_owner_all on settings
  for all using (is_owner()) with check (is_owner());

-- Views run with the definer's privileges and filter inside themselves.
grant select on driver_balance, open_trips_for_driver, my_trips to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: driver documents (NID, license, vehicle photos)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('driver-documents', 'driver-documents', false)
on conflict (id) do nothing;

create policy driver_docs_owner_all on storage.objects
  for all using (bucket_id = 'driver-documents' and is_owner())
  with check (bucket_id = 'driver-documents' and is_owner());

create policy driver_docs_self_read on storage.objects
  for select using (
    bucket_id = 'driver-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy driver_docs_self_write on storage.objects
  for insert with check (
    bucket_id = 'driver-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- Seed defaults
-- ---------------------------------------------------------------------------

-- RMCH is the default pickup; the owner adds the rest of the preset places.
insert into places (name_bn, name_en, km_from_rmch, is_default_pickup)
select 'রাজশাহী মেডিকেল কলেজ হাসপাতাল', 'Rajshahi Medical College Hospital', 0, true
where not exists (select 1 from places where is_default_pickup);

insert into settings (id) values (true)
on conflict (id) do nothing;

-- Placeholder fare bands, marked "set these" until the owner supplies the
-- real fares and commissions (open question 1).
insert into fare_bands (ambulance_type, min_km, max_km, fare, commission, note)
select b.ambulance_type, b.min_km, b.max_km, 0, 0, 'set these'
from (
  values
    ('non_ac'::ambulance_type, 0::numeric, 10::numeric),
    ('non_ac', 10, 20),
    ('non_ac', 20, 50),
    ('non_ac', 50, null),
    ('ac', 0, 10),
    ('ac', 10, 20),
    ('ac', 20, 50),
    ('ac', 50, null)
) as b (ambulance_type, min_km, max_km)
where not exists (select 1 from fare_bands f where f.note = 'set these');
