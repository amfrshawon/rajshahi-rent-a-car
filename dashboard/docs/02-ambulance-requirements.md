# Ambulance dispatch — requirements

Recorded from the owner's answers on 2026-10-20. "Owner said" items are
decisions; "Assumed" items are reasonable defaults the owner has not yet
confirmed. Those are listed in [07-open-questions.md](07-open-questions.md).

## People

| Role | Who | Uses |
|---|---|---|
| **Owner / dispatcher** | The business owner. Owner said: answers every call alone. | The dashboard (laptop or phone browser) |
| **Partner driver** | Ambulance owners and drivers in the network, including the owner's own ambulance. Owner said: all have Android phones with data. | The driver app |
| **Family / caller** | The patient's relative, usually calling from near RMCH. | Nothing. They only make a phone call. |

## The flow

1. **A call comes in** to `+8801714424241` on the owner's Android phone. The
   call logger sends it to the dashboard: number, time, answered or missed,
   and duration ([05-call-logging.md](05-call-logging.md)).
2. **A returning caller is recognised.** If the number has called before, the
   dashboard shows the past trips.
3. **The owner creates a trip** from the call in about 20 seconds:
   - pickup point (RMCH is the default)
   - destination, picked from a preset list or typed
   - distance in km (filled in for preset destinations)
   - ambulance type: Non-AC or AC
   - optional patient note, e.g. "oxygen needed" or "on a stretcher"

   The family's fare and the commission fill in from the fare bands. The
   owner can override the fare, and the override is logged.
4. **The owner taps Dispatch.** Every eligible driver (see below) gets a loud
   alert at the same moment.
5. **The first driver to tap Accept gets the trip.** Everyone else's alert
   closes with "Taken". Two drivers can never both get the same trip; this is
   enforced in the database.
6. **If nobody accepts within 2 minutes** (assumed), the owner gets an alert
   and can re-dispatch, widen the type (send to AC drivers too), or assign a
   driver by hand.
7. **The driver reaches the family.** The family's phone number is shown only
   after the driver accepts.
8. **The driver updates the trip:** On the way, then Arrived (the location is
   recorded), Patient on board, Completed. Each step is timestamped.
9. **When the trip is completed:**
   - The commission is added to that driver's unpaid balance.
   - Once SMS is switched on (Phase C), the family gets: *"রাজশাহী রেন্ট এ
     কার — পরের বার ২৪/৭ অ্যাম্বুলেন্সের জন্য কল করুন ০১৭১৪-৪২৪২৪১"*. Until
     then, the driver hands over a printed card.
10. **Cancellation:** the owner or the driver can cancel with a reason. If a
    driver cancels after accepting, the trip goes back to dispatch and the
    cancellation counts against that driver.

## Rules

### Eligibility: who gets the alert

A driver is alerted only if all of these are true:

- the account is **active** (approved by the owner)
- the driver is **on duty** (a switch in the driver app)
- the driver has **no trip in progress**
- their ambulance's **type matches** the trip
- their **unpaid commission is at or below the limit** (assumed ৳2,000)

Owner said: the owner's own ambulance is treated like any other partner, with
no head start.

### Money

- **Fares are set by the owner** in distance bands per ambulance type, for
  example Non-AC 0–10 km, 10–20 km, 20–50 km, and Dhaka at a fixed fare. The
  amounts are set in the dashboard, not in code.
- **Commission is a fixed amount per trip** (owner said), set for each band.
- **The family pays the driver in cash**, or by the driver's own bKash.
- **Drivers pay their commission to the owner** by bKash or cash. The owner
  records each payment in the dashboard. The driver's balance is commission
  owed minus payments made.
- **No commission on cancelled trips.** The owner can add a manual adjustment
  (positive or negative) with a note, for example for a disputed fare.

### Tracking

- Every call is logged, including missed calls and calls that never become a
  trip.
- Every change to a trip is logged with who made it and when.
- Nothing is deleted. Wrong entries are cancelled or corrected, and the
  correction is logged.

### Keeping customers with the owner

- Families always hear the owner's number first, from the website, the
  ambulance itself and the printed card.
- The family's number is shown to the driver only after they accept. In the
  driver app it is hidden again 24 hours after the trip is completed (assumed).
- Repeated "family called me directly" trips that bypass the owner are a
  business problem, not something the software can fully prevent. Reports
  that show a driver's trip count dropping help the owner notice it.

## Language

- The driver app and the alerts are in **Bangla**.
- The owner dashboard is in Bangla with English labels where clearer (assumed
  — confirm).
- Numbers in the driver app use Bangla digits; phone numbers stay tappable.

## Done means

- A call made to the business number appears on the dashboard within
  5 seconds.
- A dispatched trip rings on every eligible driver's phone within 5 seconds,
  even when the phone is locked or on silent.
- Exactly one driver can accept a trip, even when several tap at the same
  moment.
- At any time, the owner can see each driver's unpaid commission and every
  trip behind it.
