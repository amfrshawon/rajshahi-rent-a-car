-- RLS acceptance tests (M1 "Done when"). Local only: relies on the test
-- users from supabase/seed.sql.
--
-- Run: docker exec -i supabase_db_dashboard psql -U postgres -d postgres \
--        -v ON_ERROR_STOP=1 < supabase/tests/rls_test.sql

\set ON_ERROR_STOP on

-- --------------------------------------------------------------------------
-- Driver One (eligible): cannot read calls or others' money, sees the open
-- trip without family details, and cannot change protected profile columns.
-- --------------------------------------------------------------------------
set role authenticated;
set request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

do $$
begin
  if (select count(*) from calls) <> 0 then
    raise exception 'FAIL: driver can read calls';
  end if;
  if (select count(*) from open_trips_for_driver) <> 1 then
    raise exception 'FAIL: expected 1 open trip for the eligible driver';
  end if;
  if (select count(*) from my_trips) <> 0 then
    raise exception 'FAIL: driver sees trips not assigned to them';
  end if;
  if (select count(*) from ledger) <> 0 then
    raise exception 'FAIL: driver can read ledger rows that are not theirs';
  end if;
  if (select count(*) from driver_balance) <> 1 then
    raise exception 'FAIL: driver_balance should show only the own row';
  end if;
  if (select count(*) from fare_bands) <> 8 then
    raise exception 'FAIL: driver should read the fare bands';
  end if;
  if (select count(*) from places) < 1 then
    raise exception 'FAIL: driver should read places';
  end if;
end $$;

do $$
begin
  begin
    update profiles set status = 'suspended'
    where id = '22222222-2222-2222-2222-222222222222';
    raise exception 'FAIL: driver changed their own status';
  exception
    when sqlstate 'P0001' then
      if sqlerrm like 'FAIL:%' then
        raise;
      end if;
      -- the trigger's exception is expected
  end;
end $$;

do $$
begin
  update profiles set on_duty = false
  where id = '22222222-2222-2222-2222-222222222222';
  if (select on_duty from profiles
      where id = '22222222-2222-2222-2222-222222222222') then
    raise exception 'FAIL: driver could not change on_duty';
  end if;
end $$;

-- --------------------------------------------------------------------------
-- Driver Two (over the due limit): gets no open trips.
-- --------------------------------------------------------------------------
reset role;
set role authenticated;
set request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}';

do $$
begin
  if (select count(*) from open_trips_for_driver) <> 0 then
    raise exception 'FAIL: over-limit driver still sees open trips';
  end if;
end $$;

-- --------------------------------------------------------------------------
-- Owner: sees everything.
-- --------------------------------------------------------------------------
reset role;
set role authenticated;
set request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

do $$
begin
  if (select count(*) from trips) <> 1 then
    raise exception 'FAIL: owner cannot see the seeded trip';
  end if;
  if (select count(*) from ledger) <> 1 then
    raise exception 'FAIL: owner cannot see the ledger';
  end if;
  if (select count(*) from driver_balance) <> 2 then
    raise exception 'FAIL: owner should see two driver balances';
  end if;
  if (select count(*) from settings) <> 1 then
    raise exception 'FAIL: owner cannot read settings';
  end if;
end $$;

reset role;

select 'RLS tests passed' as result;
