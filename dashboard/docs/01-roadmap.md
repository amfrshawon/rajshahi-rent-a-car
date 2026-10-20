# Roadmap

Three phases. Each one is useful on its own, and each builds on the one
before it.

## Phase A — Ambulance dispatch (build first)

**Why first:** the owner already gets many ambulance calls, mostly from around
Rajshahi Medical College Hospital (RMCH). Most are 10–20 km trips, with some
long trips to Dhaka. Every call that turns into a partner's trip earns a
commission, so this phase starts paying for itself immediately.

**Delivers:**

- Every call to the business number is logged automatically, and missed calls
  are flagged for a callback.
- A 20-second "new trip" form with the fare filled in from distance bands.
- The trip goes to every free driver of the right type at once, and the first
  to accept gets it.
- The driver app marks a trip as on the way, arrived (with the location
  recorded) and completed.
- Commission is recorded per driver, payments are recorded, and a driver whose
  unpaid commission passes the limit stops getting trips automatically.
- Daily reports: calls, missed calls, trips, commission earned and commission
  still owed.

Plan: [06-ambulance-build-plan.md](06-ambulance-build-plan.md).

## Phase B — Car-rental price bidding

Car rentals are planned trips, not emergencies, so drivers have time to quote.

- Leads come from the website booking form, or are entered by the owner for
  WhatsApp enquiries.
- The owner shares the trip details with partner car owners and drivers,
  without the customer's identity.
- Drivers quote a price and choose which of their cars they'd use.
- The customer gets a link, compares the quotes (price, car photos, rating)
  and chooses one.

Outline: [08-later-phases.md](08-later-phases.md).

## Phase C — Customer payments and verified pickup

Shared by both services once the payment gateway and SMS package are bought.

- Advance payment by bKash or Nagad (through SSLCommerz or bKash's payment
  gateway).
- The customer's details are released to the driver only after the advance is
  paid.
- A 4-digit PIN that the customer reads to the driver to start the trip.
- Automatic SMS at each step.
- Customer ratings for drivers.

## What is not in scope (for now)

- Live GPS tracking during the trip. Only the arrival location is recorded.
- WhatsApp Business API integration.
- Call recording.
- An app for customers.
- ICU/CCU and freezer ambulances. The data model allows adding them later.
