-- M4 money rules: commission charged once, payments and adjustments move the
-- balance, and only the owner may record money.
-- Requires the local stack running with seed data (supabase db reset).
--
-- Run: docker exec -i supabase_db_dashboard psql -U postgres -d postgres \
--        -v ON_ERROR_STOP=1 < supabase/tests/money_test.sql

\set ON_ERROR_STOP on
begin;

-- A dispatched trip with a real commission (the owner's role in SQL).
insert into trips (family_phone, pickup_place_id, dest_text, distance_km,
                   ambulance_type, fare, commission, status, created_by, dispatched_at)
select '+8801800000077', p.id, 'Natore', 25, 'non_ac', 1200, 300,
       'dispatching', '11111111-1111-1111-1111-111111111111', now()
from places p where p.is_default_pickup limit 1;

-- Driver One takes it and completes it. The id is captured before switching
-- roles: drivers cannot read the trips table itself (RLS by design).
select id as trip_id from trips where family_phone = '+8801800000077'
\gset
set role authenticated;
set request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select accept_trip(:'trip_id');
select set_trip_status(:'trip_id', 'on_the_way');
select set_trip_status(:'trip_id', 'arrived');
select set_trip_status(:'trip_id', 'onboard');
select set_trip_status(:'trip_id', 'completed');

-- A second update of the completed trip must not charge again (the trigger
-- fires but the transition guard and the unique constraint both hold).
reset role;
update trips set status = 'completed' where family_phone = '+8801800000077';

do $$
declare
  rows integer;
  total integer;
begin
  select count(*), coalesce(sum(amount),0) into rows, total
  from ledger l
  join trips t on t.id = l.trip_id
  where t.family_phone = '+8801800000077' and l.kind = 'commission';

  if rows <> 1 then raise exception 'FAIL: expected exactly 1 commission row, got %', rows; end if;
  if total <> 300 then raise exception 'FAIL: expected commission 300, got %', total; end if;

  if (select balance from driver_balance
      where driver_id = (select driver_id from trips where family_phone = '+8801800000077')) <> 300 then
    raise exception 'FAIL: balance should be 300 after completion';
  end if;
end $$;

-- Owner records a 200 payment: balance drops to 100.
set role authenticated;
set request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select record_payment('22222222-2222-2222-2222-222222222222', 200, 'bkash', 'TXN-TEST');

do $$
begin
  if (select balance from driver_balance
      where driver_id = '22222222-2222-2222-2222-222222222222') <> 100 then
    raise exception 'FAIL: balance should be 100 after the payment';
  end if;
end $$;

-- A driver must not be able to record money.
set request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
do $$
begin
  begin
    perform record_payment('22222222-2222-2222-2222-222222222222', 50, 'cash');
    raise exception 'FAIL: driver was allowed to record a payment';
  exception
    when sqlstate 'P0001' then
      if sqlerrm like 'FAIL:%' then raise; end if;
  end;
end $$;

-- Adjustment with a note changes the balance too.
set request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select add_adjustment('22222222-2222-2222-2222-222222222222', 50, 'disputed fare');

do $$
begin
  if (select balance from driver_balance
      where driver_id = '22222222-2222-2222-2222-222222222222') <> 150 then
    raise exception 'FAIL: balance should be 150 after the adjustment';
  end if;
end $$;

reset role;
rollback;
select 'money tests passed' as result;
