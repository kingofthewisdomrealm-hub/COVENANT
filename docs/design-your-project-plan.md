# /design-your-project — the project designer

Shipped 19–20 August 2026. This is the site's landing page: `/` serves a
temporary 307 to it.

## Why it exists

General contracting converts worse than almost any home-services category.
LocaliQ's 2025 benchmarks (3,211 US campaigns, April 2024 – March 2025) put
"Construction & Contractors (General)" at a **2.61% conversion rate and $165.67
cost per lead**, against a 7.33% / $90.92 home-services average. That gap is
what a big-ticket, long-consideration purchase looks like when it is asked to
convert on a "Contact Us" box.

No competitor on the Treasure Coast has a project designer, a calculator, or
even a multi-step form. The local ceiling is a gated PDF.

## Two rules that must survive any redesign

1. **Contact details come last.** Every study showing multi-step forms losing
   to single-page forms involved asking for identifying information early
   (KlientBoost measured −50%). This is not a stylistic preference.
2. **Step 1 is one click, no typing.** The cheap first commitment is what makes
   people finish the expensive later ones (Freedman & Fraser; 44% → 76%).

The progress bar starts pre-advanced for the same reason — Nunes & Drèze (2006)
took card completion from 19% to 34% with identical real effort.

## Shape

Seven steps, branching on the step-1 answer:

1. Project type — six tiles, plus a quiet "not sure yet"
2. Property / building
3. Scope (multi-select)
4. Size + finish level — **or** board decision stage for the condo branch
5. **Floor-plan sketch — optional, skippable**
6. Timeline + budget band
7. Contact

Then a results screen: their brief rendered back, the sketch, and a Cal.com
booking calendar.

## Files

| File | Role |
|---|---|
| `app/design-your-project/page.tsx` | StoryBrand sections, metadata |
| `app/design-your-project/project-designer.tsx` | The wizard state machine |
| `app/design-your-project/plan-sketcher.tsx` | Sketch step (draw / type modes, PNG export) |
| `app/design-your-project/cal-embed.tsx` | Booking calendar |
| `app/design-your-project/opengraph-image.tsx` | Share card |
| `app/actions/design.ts` | `submitProjectDesign` |
| `content/design-your-project.ts` | All questions, options, copy, compliance notes |
| `lib/design-brief.ts` | Brief formatter |

## Decisions worth not re-litigating

**`app/actions/design.ts` is a sibling of `submitLead`, not an extension.** The
contact form carries real leads; widening its schema for a fourteen-field
wizard risks a working pipe for no gain. Shared pieces — rate limiter,
honeypot, CRM-then-email ordering — are reused by import.

**Emails send sequentially, never in parallel.** Resend rate-limits at roughly
two requests per second. Building both emails and awaiting them together fired
both calls in the same tick, Resend rejected one, and the action threw — which
showed the visitor a red error on a submission that had otherwise worked. The
contact form never hit this because it only sends one email.

**An email failure must not cost a captured lead.** The CRM row is the system
of record. The action fails the visitor only when *nothing* recorded the lead.
Anything else is an operations problem, logged loudly and let through.

**`showPlanningRanges` is off.** Turning it on publishes price ranges, which is
advertising under Rule 61G4-12.011(3) F.A.C. Verify the bands against real
closed jobs first.

**The sketch is not CAD and must not grow into it.** Rectangles only. One grid
unit is one foot, which is what makes the square-footage total honest.

**Covenant gets the measurements, the visitor gets the picture.** Two briefs:
`briefForCovenant` (scope + room dimensions, to the internal email and the CRM
job) and `brief` (scope only, to the visitor). Both carry the PNG.

## Compliance

- **F.S. 489.119(5)(b)** and **Rule 61G4-12.011(3) F.A.C.** require CBC1253676
  on an offer of services in any medium. It appears on the results screen, the
  emailed brief, and the sketch PNG. The PNG's canvas is sized to the footer
  text on purpose — a narrow plan used to clip the licence number mid-word.
- **F.S. 489.147** — the storm branch never encourages an insurance claim,
  which avoids the 12-point disclosure trigger entirely rather than merely
  complying with it. Penalty is $10,000 per violation.
- **F.S. 626.854(16)** — no public-adjuster advertising or services. The only
  permitted insurance sentence on the page is the safe-harbour line in
  `content/design-your-project.ts`. Read the comment above it before editing
  that branch.

## Still open

- Six real portfolio photos for the step-1 tiles (they are typographic now).
- Phase 2 CRM handoff: a `submit_project_design` RPC, a `project_designs`
  table, a `condo-association` enum value, and draft-estimate seeding. Phase 1
  flattens into `submit_website_lead`, whose `p_category` must be one of the
  six existing `job_category` values, so condo work rides in as `commercial`.
- A/B the wizard against the contact form. MiroMind found single-page forms
  producing 80–180% *more* leads in their tests; the evidence is directional,
  not settled. Baseline the contact form first or there is nothing to compare.
- `app/page.tsx` is orphaned behind the root redirect.

## Sources

[LocaliQ 2025 home-services benchmarks](https://localiq.com/blog/home-services-search-advertising-benchmarks/) ·
[Nunes & Drèze, endowed progress](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=991962) ·
[F.S. 489.119](https://www.flsenate.gov/laws/statutes/2024/489.119) ·
[F.S. 489.147](https://www.flsenate.gov/Laws/Statutes/2025/489.147) ·
[F.S. 626.854](https://www.flsenate.gov/Laws/Statutes/2025/626.854)
