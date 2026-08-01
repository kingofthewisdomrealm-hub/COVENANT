# Process template — new home builds (Florida baseline)

**Status:** redlined against founder input 2026-07-31. Still needs a read-through.
**Date:** 2026-07-31

Confirmed by founder:

- Plans come from **either side** — design-build or client-supplied. Stage 2 branches.
- **Covenant self-performs carpentry, trim, and cabinetry. Everything else is subbed.**
- **Invoicing happens at the end of each phase**, so billing attaches to stages.
- **Permitting is handled in-house.** No expediter.
- **Work comes by referral**, not canvassing. No solicitation-cancellation
  requirement — that applies only to storm restoration.
- **Finish selections are locked before permit submittal.**
- Statewide Florida baseline; municipality detail is a per-job overlay.
- Public page stays client-friendly; the full checklist is internal only.

---

## What the redline changed

Four answers moved this a long way from the first draft.

**1. This is a verification SOP, not a production SOP.** Covenant subs out
nearly everything. So the checklist's job is not "how to pour a slab" — it's
*what to confirm before, during, and after someone else pours it*. Every subbed
stage is now hold points and QC, not work steps. Millwork is the one place with
real production content.

**2. Selections move to stage 2 and become a gate.** Locking finishes before
permit submittal is the single strongest schedule protection a builder has, and
it was buried in stage 6 in the first draft. It's now a hard exit condition on
design — the job does not advance until selections are signed.

**3. Permitting is in-house, so stage 3 is fully owned.** No third-party
handoff and no ambiguity about who records the Notice of Commencement — it's
Covenant. That removes the most common gap in permitting, and it means plan
review comments come back to someone who can actually answer them. The tradeoff
is that submittal quality is entirely on you: an incomplete package is a delay
with no one else to chase.

**4. Subcontractor lien exposure is the biggest financial risk in the file.**
When you self-perform almost nothing, nearly every dollar flows through people
who can lien the property. Release tracking is no longer a stage-7 formality —
it runs the whole job. Broken out as a cross-cutting protocol below.

---

## Cross-cutting: subcontractor management

Runs continuously. Not a stage.

**Before any sub starts:**
- Signed subcontract with defined scope and price
- **Current certificate of insurance** — general liability and workers' comp,
  Covenant named as certificate holder
- License verified active with DBPR where the trade requires one
- W-9 on file

**During:**
- Log every **Notice to Owner** received from subs and suppliers. NTOs are how
  parties preserve lien rights; each one is a party you'll need a release from
- Partial lien release collected with every progress payment — **never pay
  without one**
- Schedule confirmed before the trade mobilizes; no trade starts before the
  preceding inspection passes

**At completion of each sub's scope:**
- Final lien release for that sub
- Punch complete and verified before final payment

**Why this sits above the stages:** § 713.06 requires a contractor's final
payment affidavit stating all lienors have been paid. If one sub was never
released, that exposure surfaces at closeout — the most expensive possible
moment to discover it.

---

## Why base + overlay is the right split

The **Florida Building Code is adopted statewide** — a slab inspection in Vero
Beach is the same slab inspection in Naples. So is the lien law, the termite
requirement, the product-approval system, and the energy code.

What varies by municipality is **administrative, not technical**:

| Statewide — write once | Local — fill per job |
|---|---|
| Florida Building Code requirements | Plan review turnaround |
| Inspection types and sequence | Impact fee amounts |
| Ch. 713 lien law (NOC, releases, affidavit) | Submittal portal and format |
| Ch. 489 licensing obligations | Inspection scheduling and lead time |
| Termite soil treatment + certificate | Local FBC amendments |
| Product approval / NOA documentation | Zoning, setbacks, tree ordinances |
| Energy code, blower door, duct leakage | Flood elevation per local FIRM |
| Certificate of Occupancy | Utility provider and connection process |

Roughly 80% of the SOP is statewide. The fifth municipality costs a checklist,
not a rewrite.

---

## The architecture

```
content/processes/new-home-builds.ts      ← Florida baseline, 7 stages
content/jurisdictions/*.ts                 ← thin overlays, added as needed
        │
        ├── /process/new-home-builds       public, 6 stages, plain language
        ├── /process/new-home-builds/sop   internal, noindex, full checklist
        └── CRM milestone template          seeds a project's timeline
```

**The CRM payoff is the real reason to do this.** The audit found 2 milestones
and 0 budget lines across 6 projects — nobody hand-enters eight phases per job.
Process as structured data means "new project from template" fills the timeline
in one click. The marketing page is a byproduct.

### Data shape

```ts
export type ProcessStage = {
	number: number
	slug: string
	title: string
	summary: string
	duration: { minWeeks: number; maxWeeks: number }
	weHandle: string[]
	youProvide: string[]
	/** Invoice raised at end of stage. */
	billing?: string
	/** Must be true before the next stage starts. Internal. */
	exitCriteria?: string[]
	/** NEVER renders publicly. */
	internalSteps: string[]
	/** FBC-driven. Same in every Florida jurisdiction. */
	inspections?: string[]
	/** Statute or code section behind the step. */
	authority?: string[]
	/** 'covenant' where self-performed, otherwise the trade. */
	performedBy?: 'covenant' | 'subcontractor' | 'mixed'
}
```

`exitCriteria` is new, and it's what makes selections enforceable. `performedBy`
is what lets the SOP render production detail for millwork and QC detail for
everything else.

---

## Florida baseline — redlined

Statutory items are drafted from Florida statute and the FBC and should still be
confirmed against the current edition. Sequencing and division of labour now
reflect founder input.

### Stage 1 — Contract and deposit
*1–2 weeks* · `performedBy: covenant`

**Public summary:** We agree on scope, price, and schedule, then put it in writing.

| Client-facing | |
|---|---|
| We handle | Site visit and feasibility review · written scope · contract and schedule · billing terms |
| You provide | Signed contract · deposit · lot information · lender contact if financed |

**Billing:** Deposit due at signing.

**Internal checklist:**
- Confirm lot is buildable — zoning, setbacks, flood zone, utility availability
- Pull property appraiser record and legal description
- Confirm septic vs sewer, well vs municipal water
- Written scope with allowances stated per line, not lump sum
- **Construction lien law disclosure in the contract** — Ch. 713
- **Homeowner's Construction Recovery Fund notice** — § 489.1425
- **State the selections deadline in the contract** — selections are due before
  permit submittal, and the contract should say so in writing
- Record client in CRM; create project from this template
- Set variant: design-build or client-plans

**Exit criteria:** signed contract · deposit received · variant set

**Authority:** Ch. 713 · § 489.1425

---

### Stage 2A — Design, engineering, and selections *(design-build)*
*10–16 weeks* · `performedBy: mixed`

*Longer than the original draft — selections now happen here, not later.*

**Public summary:** We take your ideas to stamped drawings and lock every finish before we submit for permit.

| Client-facing | |
|---|---|
| We handle | Schematic design · plan revisions · structural and truss engineering · energy calculations · selections guidance |
| You provide | Feedback at each revision · **all finish selections, signed off** · sign-off on final plans |

**Billing:** Invoice at end of stage.

**Internal checklist:**
- Schematic → client review → design development → final construction set
- Structural engineering, sealed by a Florida-licensed engineer
- Truss engineering and layout, sealed
- **Energy code compliance — Form R405**
- Soil/geotech report if required by lender or site conditions
- **Product approvals assembled** — windows, doors, roofing. Florida Product
  Approval (FL#) or Miami-Dade NOA
- Elevation certificate if in a flood zone
- **Selections schedule issued to client with a hard date**
- **Selections signed off in writing** — cabinets, counters, flooring, tile,
  plumbing fixtures, electrical fixtures, paint, hardware, exterior finishes
- Millwork shop drawings started off signed selections
- Cap revision rounds in the contract; beyond that is a change order

**Exit criteria:** sealed plan set complete · **all selections signed** ·
allowances reconciled against real pricing

**Authority:** FBC Energy Conservation · FBC 1709 · Ch. 471 / 481

---

### Stage 2B — Plan review, takeoff, and selections *(client-supplied plans)*
*4–6 weeks* · `performedBy: mixed`

**Public summary:** We review your drawings, price the work, and lock selections before permitting.

| Client-facing | |
|---|---|
| We handle | Constructability review · quantity takeoff · value engineering · code-conflict flags · selections guidance |
| You provide | Complete sealed plan set · **all finish selections, signed off** · prior permit correspondence |

**Billing:** Invoice at end of stage.

**Internal checklist:**
- Confirm plans sealed by a Florida-licensed architect or engineer
- Confirm truss and structural engineering exist and match the set
- Verify energy calc and product approvals are current
- Flag missing sheets before submitting — a rejection costs weeks
- Written assumptions and exclusions accompany the estimate
- **Selections signed off in writing**, same list as 2A
- Millwork shop drawings started off signed selections

**Exit criteria:** plan set verified complete · **all selections signed** ·
estimate accepted

---

### Stage 3 — Permitting and notice of commencement
*Statewide typical 4–12 weeks* · `performedBy: covenant`

**Public summary:** We handle permitting ourselves — submittal, plan review, and getting the job legally cleared to start.

| Client-facing | |
|---|---|
| We handle | Permit application and submittal · responding to plan review comments · recording the NOC · scheduling first inspection |
| You provide | Owner signature where required · impact fee payment · lender draw setup |

**Billing:** Invoice at end of stage. Permit and impact fees pass through at cost.

**Internal checklist:**
- **Run the submittal checklist before filing** — incomplete packages are the
  single biggest delay, and in-house means there's no one else to chase.
  Verify: sealed plans, structural, truss, energy calc, product approvals,
  survey, site plan, owner signatures
- Submit to the building department; log the submittal date
- **Record the Notice of Commencement and post it on site before the first
  inspection** — § 713.13. An unrecorded or unposted NOC can void inspections
  and expose the owner to paying twice
- NOC expires in 1 year unless a later date is stated — watch it on long jobs
- Track plan review comments; turn corrections fast. Log each round with a date
  so the real turnaround becomes measurable
- Pay impact fees, confirm receipt
- Utility applications: power, water/sewer or well/septic
- Post the permit card on site
- Confirm builder's risk and general liability active before mobilizing
- **Collect COIs and signed subcontracts for site work and foundation trades**
  before they mobilize

**Exit criteria:** permit issued · **NOC recorded and posted** · first
inspection scheduled · foundation subs contracted and insured

**Authority:** § 713.13 · FBC 105

**Overlay fills:** turnaround, submittal portal, impact fee schedule, clerk of court for NOC recording.

---

### Stage 4 — Site work and foundation
*4–8 weeks* · `performedBy: subcontractor`

**Public summary:** Clearing, fill, and the slab your house sits on.

| Client-facing | |
|---|---|
| We handle | Sub coordination and scheduling · inspection of work in place · termite pretreatment documentation · inspection scheduling |
| You provide | Site access · decisions on grade or drainage changes |

**Billing:** Invoice at end of stage.

**QC hold points — verify before allowing the next step:**
- Erosion control installed before soil is disturbed
- Survey stakeout checked against permitted setbacks — **verify yourself, do not
  take the sub's word**; a setback error after the slab is poured is catastrophic
- Fill compacted; density test where required
- Underground plumbing roughed **and inspected** before pour
- **Termite soil treatment performed and certificate collected** — required at CO
- Form and steel checked against engineering before pour
- Slab finish and elevation verified

**Sub admin:** partial lien releases collected with payment · punch verified
before final payment to each sub

**Inspections:** footer / stem wall · underground plumbing · slab pre-pour

**Exit criteria:** slab inspection passed · termite certificate in file · lien
releases current

**Authority:** FBC 1816

---

### Stage 5 — Structure and dry-in
*8–14 weeks* · `performedBy: subcontractor`

**Public summary:** Walls, roof, windows and doors — the point the house stops being weather-dependent.

| Client-facing | |
|---|---|
| We handle | Sub coordination · QC at each hold point · product approval documentation · inspection scheduling |
| You provide | Nothing required — selections were locked in design |

**Billing:** Invoice at end of stage.

**QC hold points:**
- Wall layout verified against plan before cells are filled
- Steel placement and cell fill checked before tie beam pour
- Truss delivery inspected for damage; **bracing verified against engineering**
- Roof sheathing nailing pattern spot-checked before dry-in
- Dry-in flashing verified at penetrations and transitions
- Windows and exterior doors — **fastener schedule verified against the approval
  document**, not the installer's habit
- **Product approval / NOA documentation on site** — inspectors ask

**Sub admin:** COIs current for roofing, masonry, truss · lien releases with each payment

**Inspections:** tie beam · sheathing and nailing · dry-in · window and door buck

**Exit criteria:** dry-in inspection passed · building weathertight · approvals
filed on site

**Authority:** FBC 1609 · FBC 1709

---

### Stage 6 — Rough-ins, millwork, and finishes
*12–20 weeks* · `performedBy: mixed`

**Public summary:** Everything inside the walls, then everything you actually see — including cabinetry we build ourselves.

| Client-facing | |
|---|---|
| We handle | Trade sequencing and QC · **in-house cabinetry, trim, and finish carpentry** · energy testing coordination · progress photos |
| You provide | Walkthrough at drywall stage · access for measurements |

**Billing:** Invoice at end of stage. Allowance overages billed as incurred.

**Subbed — QC hold points:**
- Sequence trades so rough-ins pass **before** insulation covers anything
- Rough electrical, plumbing, mechanical inspected before cover
- Framing inspection after rough-ins
- Insulation verified to energy-calc spec, not to habit
- Drywall, then exterior stucco
- **Blower door and duct leakage testing** — FBC Energy Conservation
- Flooring, paint, fixtures, appliances, final trim-out by trade

**Self-performed — millwork production:**
- Shop drawings finalized against **field measurements**, not plan dimensions
- Material ordered against signed selections from stage 2
- Shop fabrication scheduled to land after drywall, before flooring
- Cabinet installation — level, scribe, hardware
- Interior trim, doors, casing, base
- Countertop template after cabinets set
- **Covenant punch on own work before client sees it**

**Sub admin:** lien releases current across every trade

**Inspections:** rough electrical · rough plumbing · rough mechanical · framing · insulation

**Exit criteria:** all rough and insulation inspections passed · energy testing
passed · millwork installed and punched

**Authority:** FBC Energy Conservation R402.4 / R403.3

---

### Stage 7 — Final inspections and certificate of occupancy
*2–4 weeks* · `performedBy: mixed`

**Public summary:** Every trade signs off, the county issues the CO, and we hand you the keys.

| Client-facing | |
|---|---|
| We handle | Punch list · final trade inspections · CO application · warranty documentation and handover |
| You provide | Walkthrough attendance · final payment · utility transfer |

**Billing:** Final invoice at CO, against complete lien release package.

**Internal checklist:**
- Internal punch **before** calling the client walkthrough
- Final electrical, plumbing, mechanical, building inspections
- Submit termite certificate, energy compliance, product approvals
- Final survey / as-built where required
- **Certificate of Occupancy issued** — FBC 111
- Client walkthrough and punch resolution
- Warranty package, manuals, subcontractor list
- **Reconcile every NTO received against a matching final lien release.** Any
  gap gets resolved before final payment goes out
- **Contractor's final payment affidavit** — § 713.06
- Utilities transferred to owner
- Request review and photo permission for the portfolio

**Inspections:** final electrical · final plumbing · final mechanical · final building → CO

**Exit criteria:** CO issued · **complete lien release package** · punch signed
off · final payment received

**Authority:** FBC 111 · § 713.06

---

## Jurisdiction overlay — the template to fill per municipality

Each overlay is one small file. Nothing repeats the base.

```
Jurisdiction name and authority (city or county)
Clerk of court for NOC recording
Submittal method — portal, in person, format required
Plan review turnaround — real numbers from past permits
Resubmittal turnaround
Inspection scheduling — method, cutoff time, lead time
Impact fees — amounts and when due
Local FBC amendments
Zoning specifics — setbacks, height, tree ordinance, architectural review
Flood zone and elevation requirements per local FIRM
Utility providers and connection process
Contractor registration required locally?
Known friction — what this department reliably delays on
```

**First overlay: Vero Beach.** Two departments — City of Vero Beach inside city
limits, Indian River County for unincorporated. Your address (32966) is county.
Build county first.

---

## Public page — what actually renders

Collapse to six stages by merging 2A/2B into one "Design and planning" card that
swaps copy by variant.

Per stage, publicly: number, title, summary, duration range, `weHandle`,
`youProvide`.

**Deliberately not public:** QC hold points, `internalSteps`, `exitCriteria`,
statute citations, sub admin, jurisdiction overlays, billing detail.

Two things **worth** making public, because they're competitive advantages
stated plainly:

- **Selections locked before permit.** Most builders let selections drift and
  then blame the client for delays. Saying you lock them up front signals you
  run a real schedule.
- **In-house cabinetry and trim.** It's the founder's origin story and a genuine
  differentiator against builders who sub 100% of the work.

---

## Build order

| # | Step | Effort | Notes |
|---|---|---|---|
| 1 | Founder read-through of this redline | — | Confirm before it becomes the SOP of record |
| 2 | `content/processes/` types + new-home-builds data | Small | One file, no UI |
| 3 | Public `/process/[slug]` page | Medium | Timeline component, reused by all five services |
| 4 | Internal `/process/[slug]/sop` | Small | Same data, full detail, `noindex`, print stylesheet |
| 5 | Sub management checklist as a standalone form | Small | COI + release tracking is the highest-value piece |
| 5b | Permit submittal checklist as a standalone form | Small | In-house permitting means submittal quality is entirely yours |
| 6 | Vero Beach overlay | Small | Real numbers from past permits |
| 7 | Remaining four services | Medium | Storm restoration next |
| 8 | CRM milestone template seeded from this data | Medium | The real payoff |

---

## Open items

1. **Real permit turnaround** — submittal-to-issued dates from your last few
   permits, plus how many correction rounds are typical.
2. **City or county** for most Vero Beach jobs.
3. **Allowance reconciliation.** Selections lock in stage 2, so allowance
   overages surface early. Confirm whether that's billed at stage 2 or carried.
4. **Millwork lead time.** Shop fabrication timing drives stage 6; the 12–20 week
   range should reflect your real shop capacity.
5. **Who owns the SOP.** A checklist nobody maintains rots.
6. **Verify citations** against the current FBC edition before treating this as
   authoritative.
