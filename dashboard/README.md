# Dispatch dashboard — handoff

A dispatch system for Rajshahi Rent A Car. The owner takes calls, partner
drivers take the trips, and the owner earns a fixed commission per trip.

**Status (2026-10-20): planning only.** No code exists yet. The detailed
design review (screens, edge cases) happens at the start of Milestone 1.

**Build order:** the ambulance service first, then car-rental price bidding,
then customer payments. Each is a separate phase with its own build plan.

## Read in this order

| # | Document | What it answers |
|---|---|---|
| 1 | [Roadmap](docs/01-roadmap.md) | The three phases and what each delivers |
| 2 | [Ambulance requirements](docs/02-ambulance-requirements.md) | The owner's decisions and the rules the system must follow |
| 3 | [Architecture](docs/03-architecture.md) | The parts of the system and how they talk to each other |
| 4 | [Data model](docs/04-data-model.md) | Tables, security rules and the first-to-accept logic |
| 5 | [Call logging](docs/05-call-logging.md) | How a phone call reaches the dashboard |
| 6 | [Ambulance build plan](docs/06-ambulance-build-plan.md) | Milestones, tasks and how to check each one is done |
| 7 | [Open questions](docs/07-open-questions.md) | What the owner still has to decide or supply |
| 8 | [Later phases](docs/08-later-phases.md) | Car bidding and customer payments, outlined |

## Decisions already made by the owner

- **Backend:** Supabase (open source; start on Supabase Cloud, self-host later
  if needed).
- **Hosting, SMS package and payment gateway:** decided later. The plan works
  without them and switches them on when they are ready.
- **Ambulance calls** all come to one Android phone, `+8801714424241`,
  answered by the owner.
- **Commission:** a fixed amount per trip. The owner sets the family's fare in
  distance bands.
- **Drivers:** all on Android smartphones with mobile data.
- **Ambulance types:** Non-AC (stretcher) and AC (stretcher + oxygen).
- **Dispatch:** every free driver of the right type is alerted at once,
  including the owner's own ambulance, and the first to accept gets the trip.
- **Family contact:** the driver sees the family's number after accepting.
  After the trip, the family is reminded to call the owner's number next time.

## Where the code will live

Everything for this system lives in this `dashboard/` folder, kept separate
from the public website in `src/`. The website stays a static export and does
not depend on the dashboard.

```
dashboard/
  docs/          ← these planning documents
  app/           ← Next.js web app: owner dashboard + driver screens   (M1)
  supabase/      ← database migrations, policies, edge functions       (M1)
  driver-android/← Capacitor wrapper of the driver screens             (M5)
  call-logger/   ← small Android app for the owner's phone             (M6)
```
