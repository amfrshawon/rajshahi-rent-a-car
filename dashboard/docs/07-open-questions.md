# Open questions for the owner

Answer these before or during the milestone shown. Until then, the build uses
the assumed default, so no milestone is blocked.

| # | Question | Needed by | Assumed default |
|---|---|---|---|
| 1 | The fare and commission for each distance band, Non-AC and AC (e.g. 0–10 km, 10–20 km, 20–50 km, Dhaka) | M1 | Placeholder bands marked "set these" |
| 2 | Preset destinations and their distances from RMCH (city hospitals, clinics, Natore, Chapainawabganj, Naogaon, Dhaka, …) | M1 | RMCH only. Other destinations typed in. |
| 3 | The unpaid-commission limit after which a driver stops getting trips | M4 | ৳2,000 |
| 4 | How long to wait for an accept before alerting you | M3 | 2 minutes |
| 5 | How long a driver can take to mark "On the way" after accepting | M3 | 5 minutes |
| 6 | How long the driver can still see the family's number after the trip | M3 | 24 hours |
| 7 | Does a driver who cancels after accepting get a penalty (a fee, or paused for a while)? | M3 | No penalty. Cancellations are counted in reports. |
| 8 | Dashboard language: Bangla only, or Bangla with English? | M1 | Bangla with English where clearer |
| 9 | Which documents to collect from each driver (NID, license, fitness certificate, ambulance photos, owner papers) | M1 | NID, license, 2 vehicle photos |
| 10 | How many partner ambulances at launch, and which phone brands the drivers use | M5 | Test on Xiaomi, Samsung and Realme |
| 11 | Do families ever pay you directly instead of the driver? (If so, the ledger also needs "owner owes driver" entries.) | M4 | No. Families always pay the driver. |
| 12 | Can the website's "within 15 minutes" response promise and the "licensed and insured" claim be backed by partner ambulances? | Before launch | Check with partners |
| 13 | Domain for the dashboard | M3 deploy | `dashboard.rajshahirentacar.bd` |

## Accounts the owner needs to create

| Account | Needed by | Cost |
|---|---|---|
| Supabase (owner's email) | M0 | Free tier to start |
| Vercel or another Node host | M3 | Free tier to start |
| Firebase project (for driver push alerts) | M5 | Free |
| BD SMS gateway | After M4, optional | Pay per SMS |
| Google Play developer account (for publishing the driver app) | Optional, after the pilot | USD 25 one-time |
