# Data model (draft)

This is a first draft, to be confirmed in the Milestone 1 design review.
Postgres via Supabase. All times are `timestamptz`. Money is whole taka in
`integer`.

## Tables

### `profiles`

One row per signed-in user, linked to `auth.users`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `role` | enum `owner`, `driver` | |
| `full_name` | text | |
| `phone` | text | BD mobile, normalised to `+8801…` |
| `status` | enum `pending`, `active`, `suspended` | Only `active` drivers get trips |
| `on_duty` | boolean | Driver's duty switch |
| `push_token` | text null | FCM token from the Android app |
| `nid_number`, `license_number` | text null | Verification. Document photos go in Storage. |
| `created_at` | timestamptz | |

### `vehicles`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `driver_id` | uuid → profiles | One active vehicle per driver for now |
| `service` | enum `ambulance`, `car` | `car` is for Phase B |
| `ambulance_type` | enum `non_ac`, `ac` | Can be extended later (`icu`, `freezer`) |
| `reg_number` | text | e.g. "রাজশাহী মেট্রো-ছ ১১-…" |
| `active` | boolean | |

### `calls`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `caller_number` | text | Normalised |
| `direction` | enum `incoming`, `outgoing`, `missed`, `rejected` | |
| `started_at` | timestamptz | The real call time from the phone |
| `duration_sec` | integer | 0 for missed calls |
| `sim_slot` | smallint null | |
| `source` | enum `macrodroid`, `call_logger`, `manual` | |
| `handled` | boolean | False until the call becomes a trip or is marked "no trip" |
| `outcome_note` | text null | e.g. "wanted price only", "wrong number" |
| `created_at` | timestamptz | When it reached the server |

Unique `(caller_number, started_at)` so a re-sent event is never stored
twice.

### `places`

Preset pickups and destinations.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name_bn`, `name_en` | text | e.g. রাজশাহী মেডিকেল কলেজ হাসপাতাল |
| `km_from_rmch` | numeric null | Owner-confirmed distance |
| `lat`, `lng` | numeric null | For a future map |
| `is_default_pickup` | boolean | RMCH = true |

### `fare_bands`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `ambulance_type` | enum | |
| `min_km`, `max_km` | numeric | `max_km` null = open-ended |
| `fare` | integer | What the family pays |
| `commission` | integer | What the driver owes the owner |
| `active` | boolean | Old bands are kept so past trips stay explainable |

### `trips`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `code` | text unique | Short, human-readable, e.g. `A-1042` |
| `service` | enum | `ambulance` for Phase A |
| `call_id` | uuid null → calls | |
| `family_name` | text null | |
| `family_phone` | text | Visible to the assigned driver only |
| `pickup_place_id` / `pickup_text` | | One or the other |
| `dest_place_id` / `dest_text` | | |
| `distance_km` | numeric | |
| `ambulance_type` | enum | |
| `patient_note` | text null | |
| `fare` | integer | Copied from the band when the trip is created |
| `commission` | integer | Copied from the band; may be overridden |
| `fare_overridden` | boolean | |
| `status` | enum (see below) | |
| `driver_id` | uuid null → profiles | Set by `accept_trip()` |
| `dispatched_at`, `accepted_at`, `arrived_at`, `onboard_at`, `completed_at`, `cancelled_at` | timestamptz null | |
| `arrived_lat`, `arrived_lng` | numeric null | From the driver's phone |
| `cancel_reason` | text null | |
| `created_by` | uuid → profiles | |

**Status flow:**

```
draft → dispatching → accepted → on_the_way → arrived → onboard → completed
           │  ▲           │
           │  └───────────┘  driver cancels → back to dispatching
           └─→ unassigned (2-minute timeout, owner alerted)
any state before completed → cancelled
```

### `trip_events`

The audit log. Insert only, never changed.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint identity PK | |
| `trip_id` | uuid → trips | |
| `actor_id` | uuid null → profiles | null = system (timeout, cron) |
| `event` | text | `created`, `dispatched`, `accepted`, `status:arrived`, `fare_override`, `cancelled`, … |
| `data` | jsonb | Old and new values, location, reason |
| `at` | timestamptz | |

A trigger on `trips` writes these rows, so no code path can skip the log.

### `ledger`

The driver's money. Insert only.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint identity PK | |
| `driver_id` | uuid → profiles | |
| `trip_id` | uuid null → trips | Set for commission entries |
| `kind` | enum `commission`, `payment`, `adjustment` | |
| `amount` | integer | Positive = driver owes more. A payment is negative. |
| `method` | text null | `bkash`, `cash`, … for payments |
| `reference` | text null | bKash transaction ID |
| `note` | text null | |
| `created_by` | uuid → profiles | |
| `at` | timestamptz | |

The view `driver_balance` = `sum(amount)` per driver. A trigger adds the
`commission` row when a trip becomes `completed`, and a unique
`(trip_id, kind)` stops it being charged twice.

### `settings`

A single row: `due_limit` (৳2,000), `accept_timeout_sec` (120),
`start_timeout_sec` (300), `phone_hide_after_hours` (24).

## First-to-accept (the important part)

```sql
create function accept_trip(p_trip uuid) returns trips
language plpgsql security definer as $$
declare t trips;
begin
  -- eligibility check: active, on duty, type match, no trip in progress, under due limit
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
  return t;
end $$;
```

Only one `UPDATE` can match `status = 'dispatching'`, so concurrent accepts
resolve to exactly one winner. This needs a test that fires 10 accepts in
parallel and checks that exactly one succeeds.

## Row-level security (summary)

| Table | Owner | Driver |
|---|---|---|
| `profiles` | all | own row; may update `on_duty` and `push_token` only |
| `vehicles` | all | own rows (read) |
| `calls`, `places`, `fare_bands`, `settings` | all | `places` and `fare_bands` read only; `calls` none |
| `trips` | all | Read: open `dispatching` trips they are eligible for, through the view `open_trips_for_driver`, which **leaves out `family_phone` and `family_name`**. Their own assigned trips are read in full, with the phone hidden after `phone_hide_after_hours`. Status changes go through RPC functions only. |
| `trip_events` | all | events of their own trips |
| `ledger` | all | own rows (read) |

Drivers never write to tables directly. Every change goes through a
`security definer` function (`accept_trip`, `set_trip_status`, `cancel_trip`)
that checks the current state, so a driver can't jump from `accepted` to
`completed`.
