# Blog design handoff

Approved direction implemented 20 October 2026. Applies to all 13 articles in
both Bangla and English (26 pages), including future Markdown posts using the
same route template. The Varendra Museum guide is the reference article.

## Source of truth

- `src/components/article-page.tsx`: shared article layout and business sections.
- `src/app/globals.css`: `article-*` rules plus shared typography/design tokens.
- `src/lib/content.ts`: localized content and topic-based related articles.
- `src/config/site.ts`: fleet, daily prices, business phone and WhatsApp.
- `src/config/routes.ts`: translated service URLs; never hardcode new slugs.
- `src/content/posts/<slug>/index.md` and `bn.md`: English and Bangla copy.

Do not make separate page layouts for individual posts. Preserve every legacy
slug, canonical, hreflang pair and structured-data node.

## Layout and reading

Mobile comes first. Keep one column, 16px outer padding and wrapping text.
At desktop widths (`lg`, 1024px), use a flexible article column and 300px
sidebar inside a maximum 1280px container. The sidebar sticks below the site
header at `top-24`; on smaller screens it follows the article in normal flow.
The existing mobile call/book bar remains the persistent booking route.

The article header contains breadcrumbs, publisher label, one H1, a concise
excerpt, the actual modified date (falling back to publication date), and an
estimated reading duration. Do not update dates without changing the content.

Use a native collapsed `<details>` contents list before the body. Link H2/H3
headings with stable build-time anchors and a sticky-header scroll offset.
Do not add a JavaScript scrolling library. Body width stays at 70ch, with 17px
mobile / 18px desktop type; keep generous Bengali line height and zero heading
letter spacing. Noto Sans Bengali handles Bengali text/numerals; Anek Latin
handles Latin runs. Preserve readable dark-mode colors through shared tokens.

## Business sections required on article pages

1. A sidebar with a contextual WhatsApp enquiry, click-to-call number and
   booking-form link. The WhatsApp message includes the article title.
2. A booking checklist: date/time, pickup/destination, passengers/luggage.
3. A link to the dedicated airport/station pickup service.
4. A travel-information notice: confirm attraction policies and booking terms.
5. Three fleet choices with real existing photographs, seats, daily prices and
   vehicle-prefilled booking links. Read these values from `FLEET`, never copy
   prices into the template. State that final costs and inclusions need confirmation.
6. Three more articles, prioritizing shared categories and excluding the current
   post. Promotional posts are excluded from recommendations to avoid surfacing
   old discounts as current offers.

An enquiry is not a confirmed reservation. Do not promise live availability,
instant confirmation, free pickup, inclusive fuel, or discounts without an
explicit business decision. This is a daily-rental business; outstation fares
are quoted individually.

## Editorial rules

Use useful H2 sections and H3 subsections. Do not repeat the entire article
title as the first body heading. Write a short stand-alone excerpt rather than
an automatically truncated opening paragraph. Use lists for practical steps.

Keep Bangla and English facts consistent. Verify historical claims and link
primary sources. Avoid unverified opening hours, ticket prices, photography
permissions or accessibility promises. The museum article cites the University
of Rajshahi and replaces outdated car prices/discounts with quote guidance.
Other existing articles received the shared layout, not a full factual rewrite;
their older claims and promotions still require an editorial review. Bangla
`status: draft` is a review flag, not a publication gate.

Do not invent destination photographs, reviews, author credentials or ratings.
Use existing fleet photography in the vehicle section. New photos need suitable
rights and responsive derivatives through the image generation script.

## Verification and release

Run `npm run lint`, `npm run build`, and `npm run verify:blog`. The build also
checks all 54 legacy paths. `verify:blog` inspects every exported article in
both languages for the shared sections, a single H1, unique section anchors,
and working local page links. It does not replace visual QA.

Browser acceptance: inspect 320, 390, 768, 1024 and 1440px widths; light/dark
mode; keyboard focus; contents expansion and anchor jumps; phone/WhatsApp
links; vehicle prefilling. No horizontal overflow or obscured text. Do not
submit a real booking while testing. Confirm WhatsApp still requires the user
to send the message.

At handoff, local lint/build/export checks passed. Browser visual review was
blocked because Computer Use was not approved for Chrome; this remains open.

Pushing `main` runs the build workflow but does not automatically publish to
production. Production requires the existing manual `Build and deploy` dispatch
with target `production`. Never run WordPress cleanup as part of a design deploy.
