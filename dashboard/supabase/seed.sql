-- Local-only seed for RLS tests. `supabase db reset` runs this locally; it is
-- never applied to the remote project (remote ran only the migrations).
-- Passwords below are throwaway local credentials.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000000',
   '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated',
   'owner@local.test', extensions.crypt('owner-pass-123', extensions.gen_salt('bf')),
   now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000',
   '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated',
   'driver1@local.test', extensions.crypt('driver-pass-123', extensions.gen_salt('bf')),
   now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000',
   '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated',
   'driver2@local.test', extensions.crypt('driver-pass-123', extensions.gen_salt('bf')),
   now(), now(), now())
on conflict (id) do nothing;

insert into profiles (id, role, full_name, phone, status, on_duty, nid_number, license_number)
values
  ('11111111-1111-1111-1111-111111111111', 'owner', 'Local Owner',
   '+8801700000001', 'active', false, null, null),
  ('22222222-2222-2222-2222-222222222222', 'driver', 'Driver One',
   '+8801700000002', 'active', true, 'NID-1', 'LIC-1'),
  ('33333333-3333-3333-3333-333333333333', 'driver', 'Driver Two',
   '+8801700000003', 'active', true, 'NID-2', 'LIC-2')
on conflict (id) do nothing;

insert into vehicles (driver_id, ambulance_type, reg_number)
select v.driver_id, v.ambulance_type, v.reg_number
from (
  values
    ('22222222-2222-2222-2222-222222222222'::uuid, 'non_ac'::ambulance_type,
     'রাজশাহী মেট্রো-ছ ১১-০০০১'),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'ac'::ambulance_type,
     'রাজশাহী মেট্রো-ছ ১১-০০০২')
) as v (driver_id, ambulance_type, reg_number)
where not exists (select 1 from vehicles);

insert into trips (family_phone, pickup_place_id, dest_text, distance_km,
                   ambulance_type, fare, commission, status, created_by,
                   dispatched_at)
select '+8801800000001',
       (select id from places where is_default_pickup limit 1),
       'Natore', 35, 'non_ac'::ambulance_type, 0, 0,
       'dispatching'::trip_status, '11111111-1111-1111-1111-111111111111'::uuid, now()
where not exists (select 1 from trips);

-- Driver Two is over the ৳2,000 due limit, so is_eligible must be false.
insert into ledger (driver_id, kind, amount, note, created_by)
select '33333333-3333-3333-3333-333333333333'::uuid, 'adjustment'::ledger_kind,
       2500, 'seed: over the due limit', '11111111-1111-1111-1111-111111111111'::uuid
where not exists (select 1 from ledger);
