# Automation — ranked

**Status:** plan only.
**Date:** 2026-08-01

Filter applied, in order: **protect money already earned → compound into an
asset → eliminate typing.** At seven jobs, protecting revenue beats optimising
throughput.

---

## Tier 1 — protect money already earned

Each is a scheduled job plus an email. Days of work, not weeks.

**Supplement deadline alerts.** `supplement_deadline` exists on
`project_insurance` and nothing watches it. Email at 30, 14 and 7 days out, and
daily once overdue. Florida tightened supplemental claim deadlines; a late
supplement is simply lost. This is money evaporating on a calendar.

**Deductible-not-collected alerts.** The dashboard flags it, but nobody opens a
dashboard daily. Push it: any job at Approved or beyond with a deductible amount
and no collected date.

**Sub COI expiry.** A subcontractor mobilising with lapsed insurance is your
licence on the line, and the expiry date is knowable weeks ahead. Needs an
`expires_at` on the COI record — not currently stored.

---

## Tier 2 — compound into assets

**Review request at closeout.** Fires when a job hits Closed. Google reviews are
the highest-leverage local SEO lever available to a contractor and they never
stop working. The walkthrough is the highest-goodwill moment you get; right now
it passes unused.

**Portfolio auto-publish.** Mark a job "publish to website", it appears in the
site portfolio — photo, city, project type, short summary. Documenting a job
stops being marketing homework and becomes a side effect of running it.
Needs a `published` flag and a narrow public read surface (published fields
only — never budgets, client names or contacts).

**Weekly client progress email.** The portal exists and clients don't know.
Push a weekly summary with any new photos instead of waiting for them to visit.
Fewer "how's it going" calls, which is the actual saving.

---

## Tier 3 — eliminate typing

**Carrier estimate → budget lines.** The TypTap estimate is ten line items with
quantities, unit prices, RCV, ACV and depreciation — structured data trapped in
a scan. Parse once, populate the budget, stop retyping. Carrier estimates follow
a small number of formats, so this generalises.

**Eagle View → material order.** Same principle against the measurement report.

**Instant lead acknowledgment.** Today the customer gets nothing when they
submit the form — only you get an email. Response time is the largest single
driver of inbound close rate, and an immediate "we've got it, here's what
happens next" costs one template.

---

## The dependency nobody has noticed

`project_photos` has **zero rows**.

Photos block four things at once: the client portal being worth sharing, the
portfolio auto-publish, the photo-scenario training module, and supplement
documentation.

**Mobile camera-first capture is not a feature — it is the input four
automations are starving for.** If any single build unlocks the most downstream
value, it's that one.

---

## Order

| # | Build | Effort | Unlocks |
|---|---|---|---|
| 1 | Supplement + deductible alerts | Small | Protects revenue now |
| 2 | Mobile photo capture | Medium | Portal, portfolio, training, supplements |
| 3 | Review request at closeout | Small | Compounding local SEO |
| 4 | Instant lead acknowledgment | Trivial | Inbound conversion |
| 5 | Portfolio auto-publish | Medium | Marketing becomes a byproduct |
| 6 | Carrier estimate parsing | Medium | Removes recurring typing |
| 7 | COI expiry tracking | Small | Needs a schema addition first |
| 8 | Weekly client email | Small | Fewer status calls |

Steps 1 and 4 could ship in a day between them.

---

## Shared plumbing

All of the above need one thing that doesn't exist yet: **a way to send email
from the CRM.** A Supabase edge function with the Resend key stored as a
Supabase secret — separate from the Vercel one. Build it once with a small
template layer and every alert above becomes content rather than a project.

That's the "build it once so it works forever" piece here.
