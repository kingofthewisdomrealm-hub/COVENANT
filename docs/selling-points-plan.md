# Fifteen selling points — company, founder, product

**Status:** draft for red-line.
**Date:** 2026-08-01

Three sets of five. **Distributed across three pages, not stacked on one** —
fifteen points in a column is the same mistake as 32 process stages.

| Set | Lives on | Answers |
|---|---|---|
| Company | Home | Why this firm |
| Founder | About | Why this person |
| Product | Services | Why this work |

Rule for all fifteen: **verifiable, or it doesn't ship.** We removed fabricated
testimonials from the old site; puffery is the same problem wearing a suit.

---

## Company — five

1. **Licensed since 2005.** Florida Certified Building Contractor CBC1253676,
   active through 2028. Verify it yourself on the state licence lookup.
2. **We pull our own permits.** Building, and for commercial, fire and health
   too. Most contractors this size hand that to a third party and lose sight of
   it.
3. **We're from here.** Vero Beach based, working the Treasure Coast. After a
   storm you can find us — we don't leave when the work does.
4. **Hablamos español.** Bilingual from the first call to the final walkthrough.
5. **One contractor, start to finish.** New homes, kitchens, commercial,
   remodels, storm rebuilds — under one licence, one point of accountability.

*Point 3 is the sharpest.* Post-hurricane Florida is full of out-of-state storm
chasers. "We were here before the storm and we'll be here after" is true, easy
to verify, and the exact fear a homeowner has.

---

## Founder — five

1. **He started as a cabinetmaker.** Josias began in a cabinet shop. That's why
   the trim lines up.
2. **He came for the hurricanes.** Arrived on the Treasure Coast in 2004 with his
   family, just in time for the storms — and has been rebuilding since.
3. **He built this himself.** Not a franchise, not an acquisition. One licence,
   earned in 2005.
4. **He still walks the jobs.** You get the person whose name is on the licence,
   not a salesperson who hands you off.
5. **It's a family company.** Which is a way of saying the reputation isn't
   abstract to us.

*Needs your confirmation:* point 4. If Josias genuinely still walks every job,
say it plainly — it's the strongest of the five. If it's most jobs, we word it
accordingly. Don't claim it if it isn't reliably true.

---

## Product — five

1. **We lock selections before we pull the permit.** Most builders let choices
   drift and then blame the client for delays. Deciding up front is why a
   schedule holds.
2. **We open walls before we price.** On remodels, a low number that becomes
   change orders helps nobody. We find the surprise while you can still make
   decisions about it.
3. **The cabinetry is ours.** Built in our own shop, not ordered from a
   catalogue. Shop capacity sets the schedule, not a supplier's queue.
4. **Photographed at every stage.** Not for marketing — documentation is what
   justifies an insurance supplement and settles a question about what's behind
   a wall.
5. **You can watch it happen.** A private link showing milestones and job photos,
   so you don't have to phone to ask how it's going.

*Point 5 is live and unused.* The portal exists and works. Saying it publicly
costs nothing and almost no competitor at this size offers it.

---

## Where they go

**Home** — company five, high on the page, then one call to action. Replaces the
current four-item "why choose us", which is generic enough to belong to any
contractor.

**About** — founder five, alongside the portrait. The existing bio has this
material buried in prose; as five points it actually gets read.

**Services** — product five at the top, then the five service cards, then the
call to action. This is the page from `services-page-plan.md`; the product points
are the "how we work" that earns the click into a service.

---

## Build order

| # | Step | Effort |
|---|---|---|
| 1 | Founder red-line of the fifteen | — |
| 2 | Replace `whyChooseUs` in `site.ts` with the three sets | Small |
| 3 | Render company five on Home | Small |
| 4 | Render founder five on About | Small |
| 5 | Render product five on Services, above the cards | Small |

Steps 2–5 are one sitting once the wording is agreed.

---

## Open

1. **Point 4 under Founder** — does he walk every job, or most?
2. **"Family company"** — who else is involved? Jr is on the team but his number
   is deliberately unpublished. Worth knowing before saying it publicly.
3. **Years figure.** 2005 to 2026 is 21 years. Current site says "21+" — fine,
   but pick one form and use it everywhere.
