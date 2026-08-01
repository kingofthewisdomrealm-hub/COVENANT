# Services page — cut it back

**Status:** plan only.
**Date:** 2026-08-01

**Assumption:** "the 5 main points" = the five services. Say if you meant five
selling points instead — it changes the layout but not the approach.

---

## The problem, measured

`/services` today:

| | |
|---|---|
| Services listed | 5 |
| Process stages rendered inline | **32** |
| Body copy | **~1,033 words** |
| Time to scan | 4–5 minutes |

A homeowner deciding whether to call you does not read 1,000 words. They scan
for "do they do my thing" and "how do I contact them." Everything else is
friction.

The process timelines are good content in the wrong place. They answer a
question someone asks *after* they're interested — not before.

---

## The fix

**One page becomes six.**

### `/services` — the scan page

Five cards. Nothing else competing.

Each card:
- Service name
- One line — what it is
- Three bullets, maximum
- **"See how it works →"**

Then one call to action, repeated at top and bottom.

Target: **under 250 words**, scannable in 30 seconds, everything above the fold
on a laptop.

### `/services/[slug]` — the detail pages

Everything currently crammed inline moves here, one service per page:

- Full description
- The differentiator line (selections locked before permit, in-house cabinetry, etc.)
- The process timeline — all 6–7 stages
- Related portfolio work
- Call to action

Someone who clicks through has already qualified themselves. They'll read it.

---

## Why separate pages beat an accordion

An accordion is less work. Separate pages are better:

- **SEO.** "storm restoration vero beach" gets its own URL and its own title tag,
  instead of one page diluted across five services. This is the single biggest
  reason.
- **Shareable.** You can text a homeowner a link to exactly the service they
  asked about.
- **Faster.** The scan page stops shipping 1,000 words to every visitor.
- **Analytics.** You find out which service people actually care about.

The cost is five thin routes — cheap, since `content/site.ts` already holds all
the data and `ProcessTimeline` is already a component.

---

## Call to action

Currently the page ends with "Need something specific?" and two links. Weak.

Every service card and every detail page gets the same clear action:
**Request an estimate** — with the phone number beside it for people who'd
rather call. One primary action, one alternative, nothing else.

The estimate form now writes straight into the CRM, so this is also the moment
that feeds the pipeline.

---

## Build order

| # | Step | Effort |
|---|---|---|
| 1 | Add `/services/[slug]` route rendering existing data | Small |
| 2 | Rewrite `/services` as five cards + CTA | Small |
| 3 | Move timelines and notes to the detail pages | Trivial |
| 4 | Per-service metadata and canonical URLs | Small |
| 5 | Link portfolio items to their service | Medium — optional |

Steps 1–3 are one sitting. No new content needed — everything already exists in
`content/site.ts`.

---

## Worth checking next

The homepage almost certainly has the same problem. Once this lands, worth
measuring it the same way rather than assuming.
