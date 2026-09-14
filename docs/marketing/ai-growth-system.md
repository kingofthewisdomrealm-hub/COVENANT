# Covenant Builders AI Growth System

**Status:** implementation strategy; no features described here should be treated as live.

**Purpose:** turn market intelligence and completed construction work into a repeatable system for earning attention, capturing homeowner intent, converting inspections, and using each finished job to acquire the next one.
**Primary service area:** Vero Beach and the Treasure Coast. Expand geography only when operations can serve it reliably.

---

## Executive model

The system follows one closed loop:

```text
competitor intelligence
  -> swipe file
  -> outlier discovery
  -> scripts and content production
  -> interactive roof tool
  -> qualified homeowner lead
  -> CRM follow-up
  -> inspection, estimate, and job
  -> job photos, proof, and testimonial
  -> new content and neighborhood campaign
  -> repeat
```

The operating principle is simple: **every construction job should create evidence that helps Covenant Builders earn the next construction job.** The neighborhood extension is equally important: **one roof should launch one neighborhood acquisition campaign, not end as one isolated customer.**

This plan complements the existing [CRM lead workflow](../crm-lead-workflow.md), [automation plan](../automation-plan.md), and [marketing drafts](./README.md). It does not replace them.

## Guardrails

- Use only Covenant's real job photos, inspections, customer questions, and approved testimonials.
- Never imply that a preliminary tool result is a professional inspection, insurance determination, engineering opinion, or guaranteed price.
- Do not promise claim approval or instruct homeowners to file a claim based only on an automated score.
- Obtain written permission before publishing a customer's name, quote, address, or identifiable property images.
- Remove EXIF location data when precise location is unnecessary; use city or neighborhood-level proof by default.
- Keep licenses, service areas, pricing assumptions, incentives, and weather data current.
- Follow platform terms and use public or licensed data sources. Do not build prohibited scrapers.
- AI drafts; a named Covenant owner approves anything public-facing.

---

## 1. Competitor intelligence

### Objective

Build a weekly view of what roofing, restoration, construction, public-adjusting, and roof-adjacent companies are testing in Covenant's markets. Study durable patterns; do not copy competitors' words, creative, branding, or claims.

### Monitor

- Local roofers, restoration companies, and general contractors
- Storm-damage and insurance-focused advertisers
- Public adjusters and solar companies that advertise roofing offers
- Larger regional and national operators for category-level patterns
- Meta and Google ads, organic short-form video, landing pages, offers, calls to action, reviews, mailers, and door hangers

### Intelligence record

Create one record per observed asset:

| Field | Example |
|---|---|
| Competitor | Example Roofing Co. |
| Market | Vero Beach |
| Channel / format | Meta / homeowner testimonial |
| First and last seen | 2026-08-01 / 2026-09-14 |
| Hook | Insurance education |
| Problem | Damage not visible from the ground |
| Offer | No-cost inspection |
| Proof | Before/after plus customer story |
| CTA | Schedule an inspection |
| Destination | Landing-page URL |
| Compliance note | Claim language needs review |
| Covenant test | Educational inspection video |
| Status | Observed / shortlisted / tested / retired |

Time in market is a useful signal, not proof of profitability. Prioritize assets that remain active, recur across competitors, or generate visible engagement, then validate them through Covenant's own controlled tests.

### Weekly operating rhythm

1. A marketing owner captures 10–20 new assets.
2. AI extracts the fields above and clusters recurring hooks, offers, and proof types.
3. The owner selects no more than three hypotheses for the next content sprint.
4. Results are recorded against the originating hypothesis.

### Output and KPI

- Output: one-page weekly brief with top patterns, three recommended tests, and claims to avoid.
- KPI: percentage of recommended tests shipped; qualified-lead rate by tested angle.

---

## 2. Covenant swipe file

### Objective

Create a searchable library of patterns that prevents every campaign from starting with a blank page.

Save strong ads, Reels, landing pages, mailers, door hangers, emails, headlines, sales explanations, and Covenant's own top-performing work. Store the source URL, capture date, and attribution with every external example.

### Taxonomy

Tag each item by:

- **Hook:** opening line or visual device
- **Problem:** leak, storm exposure, roof age, contractor risk, delay, property value
- **Promise:** inspection, clarity, estimate, plan, or convenience
- **Proof:** job footage, before/after, documented finding, credential, process, approved testimonial
- **CTA:** call, book, upload photos, check roof health, request estimate
- **Angle:** education, risk, insurance, convenience, trust, storm, transformation, neighborhood proof
- **Audience:** homeowner, property manager, commercial owner, insurance-related lead
- **Funnel stage:** awareness, consideration, inspection, estimate, close, referral
- **Performance:** unknown, benchmark, test winner, test loser

### Quality rule

Every shortlisted item must answer three questions:

1. Why might this earn attention or action?
2. What principle can Covenant adapt in its own voice?
3. What must Covenant not copy or claim?

### Output and KPI

- Output: a reviewed collection of 50 useful patterns before automation is expanded.
- KPI: reuse rate, test-win rate, and time from brief to approved script.

---

## 3. Outlier discovery

### Objective

Find roofing and restoration content that performs far above a creator's normal baseline, then adapt the structure—not the expression—to Covenant's market.

### Detection method

For each account, compare a post's views or meaningful engagement with the median of its previous 20 comparable posts:

```text
outlier score = post performance / median comparable-post performance
```

Shortlist posts above 5x baseline, while recording account size, format, age, paid-versus-organic uncertainty, and local relevance. A small creator's 50,000-view inspection video can be more instructive than a celebrity's million-view post.

### Analysis template

- Opening visual and first spoken line
- Curiosity gap or homeowner fear addressed
- Specificity: number, location, object, deadline, or mistake
- Story structure and proof moment
- Editing pace and duration
- CTA and comments that reveal intent
- Covenant version using a real job, original wording, and a locally accurate claim

Example adaptation:

```text
Observed structure: "Three things your roofer hopes you don't notice."
Covenant angle: "Three things to check before signing a roofing contract."
Required proof: actual contract clauses or process criteria reviewed by Covenant.
```

### Output and KPI

- Output: five outlier breakdowns and two original Covenant briefs per week.
- KPI: three-second hold, completion rate, saves/shares, profile visits, and qualified inquiries—not raw views alone.

---

## 4. Content machine

### Objective

Turn normal job documentation into a reliable publishing pipeline. One job should produce at least 15 usable assets without disrupting field work.

### Capture once

For each approved job, collect:

- Establishing shot and city/neighborhood label
- Ground-level and roof-level inspection footage
- Close-ups of documented conditions
- Estimator explanation and one homeowner question
- Before, progress, crew/process, and final photos
- Final walkthrough, approved testimonial, and lessons learned

Mobile camera-first capture is the dependency. It also supports the existing CRM, portfolio, client updates, training, and supplement workflows described in the [automation plan](../automation-plan.md).

### Repurpose many times

One job can become:

- 1 inspection story
- 1 before/after Reel
- 3 educational clips
- 1 homeowner-question clip
- 1 estimator explainer
- 1 transformation carousel
- 1 approved testimonial asset
- 2 crew/process posts
- 2 Google Business Profile posts
- 2 email or nurture sections
- 1 neighborhood landing-page case study

### Production state

```text
captured -> uploaded -> permission checked -> tagged -> scripted
-> edited -> technical review -> approved -> scheduled -> published -> measured
```

Assign a single owner to each state. Keep the content queue separate from private project records; only approved, public-safe fields may reach the website.

### Output and KPI

- Output: a two-week rolling content queue and a per-job asset checklist.
- KPI: percentage of jobs documented, assets published per job, publishing lead time, and inspections attributed to content.

---

## 5. Script engine

### Objective

Generate fast, consistent first drafts grounded in Covenant's proof and service area.

### Required inputs

- Audience and funnel stage
- City or neighborhood
- Real job fact, homeowner question, or approved swipe-file pattern
- Offer and CTA
- Available proof asset
- Channel and target duration
- Claims that require human verification

### Script formula

```text
hook -> homeowner relevance -> real observation -> explanation/proof
-> next best action -> one clear CTA
```

### Core templates

**Storm hook**

> A storm moved through this neighborhood, but roof damage is not always visible from the ground. Here is what we check during an inspection.

**Homeowner mistake**

> A common mistake after a storm is assuming that no active leak means no roof damage. Here is why those are different questions.

**Inspection reveal**

> From the ground, this Vero Beach roof looked normal. Up close, we documented this condition—and here is what it means.

**Before and after**

> This homeowner was not shopping for a roof when the process began. Here is what prompted the inspection and how the project progressed.

**Authority**

> Here are three things our team checks in the first five minutes of a roof inspection.

### Approval checklist

- Factually supported by the referenced job or source
- No invented urgency, pricing, damage, coverage, result, or testimonial
- Clear distinction between education and professional/insurance determination
- One CTA and one audience
- Customer/location permissions recorded
- Natural spoken language; no generic AI filler

### Output and KPI

- Output: three channel-specific script variants from one approved brief.
- KPI: approval-without-rewrite rate, production time, retention, and inquiry rate.

---

## 6. Interactive lead magnets

### Objective

Replace passive PDFs with tools that give a homeowner immediate, bounded value and produce structured information for follow-up.

### First product: “Does My Roof Need Attention?”

Collect only what is needed:

- ZIP code or service address
- Roof age and material
- Recent severe-weather awareness
- Leaks, missing shingles, or visible wear
- Optional photos
- Contact details after the user sees what the tool provides and consents to follow-up

Return:

- A plain-language attention level such as `monitor`, `inspection worth considering`, or `prompt inspection recommended`
- The homeowner's answers and the specific factors that influenced the result
- Safety guidance for urgent interior leaking or hazards
- A clear limitation: preliminary educational result, not a diagnosis, estimate, engineering opinion, or coverage decision
- One action: schedule a Covenant inspection

Avoid false precision such as “72/100” until Covenant has a documented, validated scoring method. Explainable factors will earn more trust than a decorative number wearing a lab coat.

### Lead handoff

On consent, send the normalized answers, source campaign, UTM fields, result, photo links, and requested follow-up into the existing lead workflow. Do not place sensitive customer data in marketing analytics.

### Output and KPI

- Output: mobile-first assessment, result page, confirmation email, and CRM record.
- KPI: completion rate, consent rate, booked-inspection rate, show rate, and qualified-lead rate.

---

## 7. Roof tools roadmap

Build tools in conversion-value order, not novelty order.

| Priority | Tool | Value | MVP input | MVP output | Key limitation |
|---|---|---|---|---|---|
| 1 | Roof Health Assessment | Converts high-intent homeowners | Age, type, symptoms, photos | Explainable concern summary | Not a diagnosis |
| 2 | Roof Life Calculator | Education and nurture | Type, age, location, maintenance | Broad planning range | No guarantee of remaining life |
| 3 | Replacement Range Estimator | Budget qualification | Approx. size, stories, material, complexity | Clearly dated planning range | Not a binding estimate |
| 4 | Storm Impact Checker | Timely local demand | Address/ZIP and date range | Verified weather context plus next step | Weather event does not prove property damage |
| 5 | Contractor Comparison Tool | Sales enablement | User-entered estimate features | Neutral comparison checklist | No unsupported competitor claims |
| 6 | Claim Readiness Assessment | Process education | Documentation and timeline questions | Missing-document checklist | Not legal or coverage advice |
| 7 | Restoration Planner | Cross-service planning | Roof, gutters, water, windows, interiors | Recommended project sequence | Requires scope validation |

### Shared technical requirements

- Mobile-first, accessible forms with save-and-resume where justified
- Server-side validation, abuse controls, consent logging, and retention rules
- Versioned scoring/formula logic with an owner and review date
- Analytics events that exclude contact details, addresses, and uploaded photos
- Human review path for photos; do not market image analysis as definitive
- CRM source labels unique to each tool

Do not build all seven at once. Launch one, prove inspection conversion, and reuse the shared intake and result components.

---

## 8. CRM funnel

### Objective

Make every campaign measurable from first touch to won job without creating a second CRM.

Use the existing simple stages:

```text
New -> Contacted -> Estimate -> Won / Lost
```

Inspection scheduling and job operations can be tracked as activities or in the operations system; they do not require marketing to invent a second pipeline.

### Minimum lead record

- Name, email, phone, and project address
- Project type and homeowner notes
- Source, campaign, content/tool ID, and UTM fields
- Tool answers/result when applicable
- Consent timestamp and preferred contact method
- Owner, status, next action, and next-action date
- Inspection scheduled/completed timestamps
- Estimate value when appropriate
- Won/lost outcome and reason

### Response sequence

1. Immediately acknowledge the inquiry using the existing email plumbing when available.
2. Assign an owner and create a same-business-day follow-up task.
3. Use the tool result or content source to personalize the first conversation.
4. Confirm the inspection and send preparation guidance.
5. After the inspection, record the next action rather than leaving the lead in email.
6. At closeout, trigger the approved review, portfolio, and neighborhood workflows.

### Attribution

Use first-touch source for acquisition and last meaningful touch for conversion assistance. Report by source and campaign:

- Leads, qualified leads, appointments, inspections completed
- Estimates, won jobs, revenue when available
- Cost per qualified lead and cost per won job
- Speed to first human contact
- Stage conversion and loss reasons

### Output and KPI

- Output: one weekly funnel report with aging and next-action exceptions.
- KPI: response time, contact rate, inspection-booking rate, show rate, estimate-to-win rate, and cost per won job.

---

## 9. Neighborhood domination

### Objective

Turn each permission-cleared job into a coordinated, time-boxed campaign around nearby properties.

### Trigger and workflow

When a job reaches the appropriate operational milestone:

1. Define a privacy-safe target area around the job based on serviceability and property fit.
2. Create or update a neighborhood/city landing page using real project facts and approved images.
3. Publish “working in your area” content without exposing the customer's exact address.
4. Run a small geo-targeted ad test using the job's strongest proof asset.
5. Coordinate compliant door outreach and direct mail to the selected area.
6. Give the customer an easy, non-pushy referral introduction.
7. Publish the finished case study and approved testimonial.
8. Track every response with a campaign ID tied to the originating job.

### Campaign kit

- Landing-page module
- One before/after Reel and carousel
- Google Business Profile post
- Door script and leave-behind
- Neighbor mailer
- Referral message
- Follow-up email/SMS copy where consent permits
- QR code or short link with campaign attribution

### Stop rules

Pause a neighborhood campaign when leads are outside the service area, the job/customer lacks publication permission, complaints or opt-outs rise, unit economics fail, or field capacity cannot support appointments.

### Output and KPI

- Output: a campaign launched within seven days of the selected job milestone.
- KPI: neighboring leads, inspections, won jobs, referral introductions, campaign cost, and revenue per originating job.

---

## Implementation sequence

### Phase 0 — measurement and permissions (week 1)

- Name an executive owner, marketing operator, field capture owner, and CRM owner.
- Confirm content/photo release language and data-retention rules.
- Define campaign IDs, source fields, baseline funnel metrics, and the weekly scorecard.
- Create the swipe-file and intelligence-record schemas.

**Exit:** every new lead can be attributed and every published job asset has recorded permission.

### Phase 1 — manual learning loop (weeks 2–4)

- Capture 50 swipe examples and establish weekly competitor/outlier review.
- Run the 15-assets-per-job checklist on two jobs.
- Produce and publish six original scripts across two proven angles.
- Run one manual neighborhood campaign.

**Exit:** Covenant knows which hooks, formats, and field-capture steps work before automating them.

### Phase 2 — first interactive tool (weeks 5–8)

- Build the Roof Health Assessment with explainable results and disclaimers.
- Connect consented submissions to the existing CRM workflow.
- Add acknowledgment, owner assignment, and next-action enforcement.
- Measure completion through won-job outcome.

**Exit:** an end-to-end test lead can complete the tool, enter the CRM once, receive acknowledgment, book follow-up, and retain source attribution.

### Phase 3 — content and closeout automation (weeks 9–12)

- Connect approved project photos to the content queue and public portfolio boundary.
- Add script drafting from structured, permission-cleared job facts.
- Trigger review and neighborhood campaign checklists at closeout.
- Create the weekly intelligence and funnel reports.

**Exit:** a real closed job produces approved proof, reporting, and a neighborhood campaign without duplicate entry.

### Phase 4 — scale only proven modules

- Add the next roof tool based on observed homeowner demand.
- Expand channels and neighborhoods only when cost per won job and capacity support it.
- Retire weak angles, stale claims, and tools that generate curiosity but not qualified inspections.

---

## Weekly scorecard

| Layer | Leading indicator | Business outcome |
|---|---|---|
| Intelligence | Tests selected and shipped | Qualified leads by angle |
| Content | Jobs documented; assets published | Inspections influenced |
| Tool | Starts, completions, consent | Booked and completed inspections |
| CRM | Response time; overdue actions | Estimates and won jobs |
| Neighborhood | Campaigns launched; responses | Neighbor jobs and revenue |

The north-star measure is **profitable won jobs attributable to the system**. Views, swipe-file size, scripts generated, and tool completions matter only when they improve that outcome.

## First 30-day backlog

- [ ] Appoint the four owners and schedule a 30-minute weekly growth review.
- [ ] Approve job-media permission and privacy rules.
- [ ] Add source/campaign/tool identifiers to the CRM intake path.
- [ ] Create the competitor-intelligence table and swipe-file taxonomy.
- [ ] Capture the first 25 competitor assets and five outliers.
- [ ] Select two active jobs for the field content checklist.
- [ ] Draft, approve, and publish six scripts using real job evidence.
- [ ] Choose one completed job for the first neighborhood campaign.
- [ ] Write the Roof Health Assessment questions, result logic, disclaimers, and success criteria before development.
- [ ] Record baseline response, booking, show, estimate, win, and cost metrics.
