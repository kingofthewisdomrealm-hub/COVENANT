# Training — contractor side

**Status:** plan only.
**Date:** 2026-08-01

Runs on the engine already built (`courses → modules_training → attempts →
certifications`). This is content plus one new module kind.

---

## The organising idea

Covenant self-performs carpentry, trim and cabinetry. **Everything else is
subbed.** So the production job isn't "how to pour a slab" — it's *what to
confirm before, during and after someone else pours it*.

That makes this a **verification** curriculum, and it gives it a natural gate:

> **Sales gate:** the four sentences you must never say.
> **Production gate:** the ten checks you cannot undo.

Both are about the irreversible moment. That's what makes them worth gating.

---

## The ten checks you cannot undo

Each one is invisible, unaffordable, or both, once the moment passes. This is
the gate module.

| # | Check | What it costs to miss |
|---|---|---|
| 1 | **NOC recorded and posted** before first inspection | § 713.13 — inspections can be voided and the owner can be made to pay twice |
| 2 | **Setback verified against the permit** before the slab pours | A misplaced house. Nothing recovers this |
| 3 | **Tear-off photographed before anything is covered** | Discovered damage is unpayable once it's under new material — this is the single biggest supplement killer |
| 4 | **Termite treatment certificate collected** | Required at CO. Chasing it months later is painful |
| 5 | **Product approval / NOA documentation on site** | Inspector asks, work stops |
| 6 | **Moisture verified dry before closing any wall** | Mould claim, callback, and the mitigation company is long gone |
| 7 | **Rough-ins inspected before insulation covers them** | Tear it back open |
| 8 | **COI and signed subcontract before a sub mobilises** | Uninsured trade on your job, under your licence |
| 9 | **Lien release collected with every payment** | § 713.06 — you swear all lienors are paid at closeout. Discovering a gap then is the worst possible timing |
| 10 | **Lead-safe practices on pre-1978 work** | Federal EPA RRP. Fines are per day |

Pass mark 100%, unlimited retries. A project manager who gets one of these wrong
costs more than a week of their salary.

---

## Course — Running a job

| # | Module | Kind | Notes |
|---|---|---|---|
| 1 | We verify, we don't do | Lesson | Why the role is QC and coordination, not production |
| 2 | **The ten checks you cannot undo** | **Quiz — GATE, 100%** | The list above |
| 3 | The inspection sequence | Lesson + quiz | Footer → slab → tie beam → sheathing → dry-in → rough-ins → framing → insulation → finals → CO. Which ones block which |
| 4 | Photograph like it's evidence | **Photo scenario** | New module kind — see below |
| 5 | Managing subs | Scenario | COI expired mid-job, sub wants payment without a release, trade arrives before the preceding inspection passed |
| 6 | Discovered conditions | Scenario | Open a wall, find something. Photograph, price, change order — before continuing |
| 7 | Closeout | Lesson + quiz | Punch, finals, CO, lien releases, warranty package, portal photos |

---

## New module kind: photo scenario

Show a job-site photo, ask what's wrong or what's missing. Multiple choice or
tap-the-area.

This is how you actually train an eye. Reading "check the nailing pattern"
teaches nothing; seeing a bad one twice does.

**Blocked on content.** `project_photos` has zero rows, so there is no library
to draw on. Worth flagging now because it changes what's worth building:

- If photos start flowing from jobs, this module becomes the most valuable in
  the curriculum
- Until then, modules 4 is a placeholder

That's an argument for the mobile photo capture we discussed — the training
depends on it.

---

## Roofing-specific track

Your Job Submittal SOP is already a specification. Turn it into a second course:

**Course — Roofing job submittal**

1. The eight required documents — what each is and who provides it
2. Steep vs low slope, pitch, and where to read it on the Eagle View
3. Materials — covering, brand, profile, colour, underlayment, valleys, drip edge
4. Ventilation, pipe jacks, skylights
5. The fields people get wrong — gate code, total structures, flashing quantity, solar
6. **Submittal accuracy quiz** — given a scenario, fill the form correctly

Module 5 is the highest value. Those four fields cause the most rework, and
three of them are blank-means-something-different traps: blank flashing means
none ordered, blank gutters means existing stay, blank gate code can fail an
inspection.

---

## Build order

| # | Step | Effort |
|---|---|---|
| 1 | Course + gate module content — the ten checks | Small |
| 2 | Modules 1, 3, 7 (lessons + quizzes) | Small |
| 3 | Scenario renderer | Medium — shared with the sales course |
| 4 | Modules 5, 6 scenarios | Medium |
| 5 | Roofing submittal course | Medium |
| 6 | Photo scenario kind | Medium — blocked on a photo library |

**Steps 1–2 ship without the scenario renderer**, same as the sales gate did.

---

## What I need from you

The compliance and code items I can write. The judgement calls I can't:

1. **Who is this for?** Josias Sr and Jr only, or crew leads too? Changes the
   depth considerably.
2. **What actually goes wrong most?** My ten are drawn from the process docs and
   statute. Yours would be drawn from jobs that cost you money — that list is
   better.
3. **Who verifies today?** If it's only Josias, this is a delegation tool. If
   others already check, it's a consistency tool.
4. **Is there a punch list or QC checklist in use now**, even on paper?

---

## Not in v1

- Safety and OSHA. Real, but a different curriculum with its own compliance
  regime — don't blur it into this.
- Equipment and tools.
- Estimating. Different audience.
