#!/usr/bin/env bash
# First-to-accept race (M3 done-when): 10 eligible drivers accept the same
# dispatching trip in parallel; exactly one wins, nine get "already_taken".
# Requires the local stack running with seed data (supabase db reset).

set -uo pipefail

PSQL=(docker exec -i supabase_db_dashboard psql -U postgres -d postgres -tA)

TRIP=$("${PSQL[@]}" -c "select id from trips where status = 'dispatching' limit 1")

if [ -z "$TRIP" ]; then
  echo "FAIL: no dispatching trip in the seed"
  exit 1
fi

# Nine extra eligible drivers (the seed already has one).
"${PSQL[@]}" >/dev/null <<'SQL'
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at)
select '00000000-0000-0000-0000-000000000000',
       ('aaaaaaaa-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
       'authenticated', 'authenticated',
       'race' || i || '@local.test', '', now(), now(), now()
from generate_series(2, 10) as i
on conflict (id) do nothing;

insert into profiles (id, role, full_name, phone, status, on_duty)
select ('aaaaaaaa-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
       'driver', 'Race Driver ' || i,
       '+8801700000' || lpad((100 + i)::text, 3, '0'),
       'active', true
from generate_series(2, 10) as i
on conflict (id) do nothing;

insert into vehicles (driver_id, ambulance_type, reg_number)
select ('aaaaaaaa-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
       'non_ac'::ambulance_type, 'RACE-' || i
from generate_series(2, 10) as i;
SQL

driver_uuid() {
  if [ "$1" -eq 1 ]; then
    echo "22222222-2222-2222-2222-222222222222"
  else
    printf 'aaaaaaaa-0000-0000-0000-%012d' "$1"
  fi
}

run_accept() {
  local driver
  driver=$(driver_uuid "$1")
  docker exec -i supabase_db_dashboard psql -U postgres -d postgres -tA -c "
    set role authenticated;
    set request.jwt.claims = '{\"sub\":\"$driver\",\"role\":\"authenticated\"}';
    select accept_trip('$TRIP');" 2>&1
}

rm -f /tmp/accept_*.out
for i in $(seq 1 10); do
  run_accept "$i" > "/tmp/accept_$i.out" 2>&1 &
done
wait

WIN=0
TAKEN=0
OTHER=0
for i in $(seq 1 10); do
  file="/tmp/accept_$i.out"
  if grep -q 'already_taken' "$file"; then
    TAKEN=$((TAKEN + 1))
  elif grep -q 'ERROR' "$file"; then
    OTHER=$((OTHER + 1))
  elif [ -s "$file" ]; then
    WIN=$((WIN + 1))
  fi
done

echo "wins=$WIN already_taken=$TAKEN other=$OTHER"
if [ "$WIN" -ne 1 ] || [ "$TAKEN" -ne 9 ] || [ "$OTHER" -ne 0 ]; then
  echo "FAIL: expected 1 win / 9 already_taken / 0 errors"
  head -3 /tmp/accept_*.out
  exit 1
fi

echo "accept race OK"
