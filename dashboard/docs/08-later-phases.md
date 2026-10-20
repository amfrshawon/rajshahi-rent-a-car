# Later phases (outline)

These phases get their own requirements and build plan when Phase A is in use.
They reuse Phase A's accounts, `trips`, `trip_events`, `ledger` and
`vehicles` (with `service = 'car'`).

## Phase B — Car-rental price bidding

**The flow**

1. **A lead comes in.**
   - Website booking form: `src/components/booking-form.tsx` posts to a new
     Supabase Edge Function in addition to WhatsApp.
   - WhatsApp enquiry: the owner enters it in the dashboard.
2. **The owner shares the trip.** Pickup, destination, date and time, car
   type, and number of days go to selected partners or to all who have that
   car type. The customer's name and phone are not shared.
3. **Partners quote** a price and pick one of their registered cars, which
   comes with its photos.
4. **The customer chooses.** They get a private link and compare the quotes:
   car, photos, rating and price.
5. **The quote is confirmed**, then the customer's details go to the chosen
   partner, after the advance is paid once Phase C exists.
6. **The trip runs** with the same status flow and log as ambulances. The
   commission is entered in the ledger.

**New pieces:** a `quotes` table (trip, partner, vehicle, price, status), the
customer quote page (no login; a signed, expiring link), car photos in
Supabase Storage, and a quote deadline per trip.

**Decisions for later:**

- Does the customer see the partner's price, or the price with the owner's
  margin added?
- Is the commission fixed or a percentage for cars?
- Is the shortlist the owner's choice or automatic?

## Phase C — Payments and verified pickup

- **Advance payment:** SSLCommerz or the bKash payment gateway (needs a trade
  licence and a merchant account). A `payments` table records each payment
  and its gateway reference, and the gateway's callback marks the trip as
  paid.
- **Customer details are released** to the driver only after the advance is
  paid.
- **PIN pickup:** a 4-digit PIN is sent to the customer by SMS. The driver
  enters it to move the trip to `onboard`, which proves the right driver
  picked up the right customer. For ambulances this stays optional, as
  emergencies come first.
- **Ratings:** the customer rates the driver by SMS link after the trip. The
  rating shows in partner quotes.
- **Automatic SMS** at each step, through the `send-sms` function from
  Phase A.
