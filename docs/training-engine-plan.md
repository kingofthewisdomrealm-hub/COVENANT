# Training engine — canvasser onboarding

**Status:** plan only. Nothing built.
**Date:** 2026-08-01

Confirmed:

- **Audience:** new canvassers, little experience
- **Priority gaps:** door-to-door conversion, and compliance discipline
- **Delivery:** interactive modules inside the CRM, built as a reusable engine

---

## Why an engine, not a course

The obvious build is "a training page with some content on it." That solves this
month and nothing after it.

The same machinery — lessons, branching scenarios, scoring, a pass threshold,
recorded completion — runs sales training, customer service, submittal-form
accuracy, and safety induction. Build the engine once, and every future training
need is content entry rather than a project.

So: **`courses → modules → attempts`**, with content as data. The canvasser
curriculum is the first course, not the whole system.

---

## The insight that shapes the whole design

For a new canvasser, the risk isn't that they fail to sell. **It's what they say
while trying to.**

Florida prohibits a contractor from offering to waive, absorb or rebate an
insurance deductible — including in conversation at a door. Public adjusting is
separately licensed, so promising to "handle the claim" or "get it approved"
crosses a line an untrained rep won't see. A door-signed contract carries a
three-day cancellation right that has to be given in writing.

A new rep who wants the sale will reach for exactly these phrases, because they
work. **Reading a rule once does not stop that. Being corrected in the moment,
repeatedly, does.**

That's why this is a scenario engine and not a document library.

---

## Engine design

### Data model

```sql
courses        (id, slug, title, description, audience, sort_order, published)
modules        (id, course_id, title, summary, sort_order,
                kind,              -- 'lesson' | 'scenario' | 'quiz'
                content jsonb,     -- shape depends on kind
                pass_threshold int,-- percent, null for lessons
                is_gate bool)      -- must pass before the course completes
enrollments    (id, user_id, course_id, started_at, completed_at)
attempts       (id, user_id, module_id, answers jsonb, score int,
                passed bool, compliance_failure bool, started_at, completed_at)
certifications (id, user_id, course_id, passed_at, expires_at, revoked_at)
```

RLS follows the pattern already in the app: authenticated read; writes gated on
`can_edit()` for authoring, but a user may always insert **their own** attempts.
A user must never be able to write their own `certifications` row — that gets
created by a trigger when a gated course is passed, or the certificate means
nothing.

### Module kinds

**Lesson** — short explanation, images, a few bullets. Read and continue. Keep
these under two minutes; they exist to set up the scenario, not to teach on
their own.

**Scenario** — the core of the engine. A branching conversation:

```jsonc
{
  "setting": "Front door, two days after the storm. Homeowner is wary.",
  "nodes": [
    {
      "id": "open",
      "says": "We've already had three roofers here today.",
      "options": [
        { "text": "I'm not here to sell you anything — I'm documenting damage on this street and can show you what I find, free.",
          "verdict": "good", "feedback": "Lowers the guard and offers value before asking for anything.", "next": "inspect" },
        { "text": "None of them are licensed like we are. We'll get your claim approved.",
          "verdict": "violation", "compliance": "claim_approval",
          "feedback": "You cannot promise a claim outcome. You don't decide it — the carrier does. This ends the scenario." },
        { "text": "Don't worry about your deductible, we take care of that.",
          "verdict": "violation", "compliance": "deductible",
          "feedback": "Illegal in Florida. Offering to waive or absorb a deductible is prohibited, including verbally." }
      ]
    }
  ]
}
```

- `verdict: good | weak | violation`
- A **violation ends the scenario immediately** with the explanation. That
  abruptness is the teaching — it's the same instinct you want at a real door.
- `weak` continues but costs score, with feedback on what would have been better.

**Quiz** — multiple choice with an explanation shown after every answer, right or
wrong. Explanations on correct answers matter as much as on wrong ones.

### Progression rules

- Modules unlock in order
- A **gate** module must be passed at threshold before the course can complete
- Any compliance violation fails the attempt outright, regardless of other score
- Unlimited retries — the goal is competence, not a filter
- Certification recorded with a date and an expiry

---

## Course 1 — Storm canvassing

Seven modules. Realistic completion: 60–90 minutes, retries included.

| # | Module | Kind | Notes |
|---|---|---|---|
| 1 | Why we knock, and what we actually do | Lesson | Covenant rebuilds. We are not a mitigation company and we do not adjust claims |
| 2 | **What you may and may not say** | **Quiz — GATE, 100%** | Deductibles, claim outcomes, adjusting, the licence number. Nothing less than perfect passes |
| 3 | The knock | Scenario | Opening, handling "we've had three roofers already", earning the inspection |
| 4 | Reading the roof | Lesson + quiz | Hail vs wind vs age. What is claimable and what is not |
| 5 | The inspection agreement | Scenario | Getting the signature, and **giving the three-day cancellation notice** properly |
| 6 | Objections | Scenario | Price, "I'll wait", "my neighbour's guy", spouse not home, "is this free?" |
| 7 | What happens next | Lesson | Photos, measurements, what the office needs, why documentation decides supplements |

**Module 2 is a hard gate at 100%.** A rep who gets one of these wrong is a
licensing problem, not a training gap. Failing simply means retaking it.

### The four sentences that must never be said

Built as the spine of module 2, and as instant-fail options throughout every
scenario:

1. *"Don't worry about your deductible."* — prohibited, and it's the most natural
   thing an eager rep says
2. *"We'll get your claim approved."* — you don't decide that
3. *"We'll handle the insurance company for you."* — that's public adjusting
4. *"This won't cost you anything."* — the deductible always costs them something

Each paired with what to say instead. **Teaching the replacement matters more
than teaching the prohibition** — a rep needs something to reach for under
pressure.

---

## The part that is not training

Every gated pass writes a `certifications` row with a name, a date and a score.

If a homeowner ever complains that a rep promised to cover their deductible,
"we train on this and here is the record" is a materially different position from
"we told them not to." That record costs nothing to keep and is worth having.

---

## Build order

| # | Step | Effort | Notes |
|---|---|---|---|
| 1 | Schema + RLS + certification trigger | Small | Follows existing patterns |
| 2 | Quiz renderer + attempt scoring | Small | Module 2 ships on this alone |
| 3 | **Course 1 module 2 content** | Small | The compliance gate. Highest value per hour of anything in this plan |
| 4 | Scenario renderer with branching and instant-fail | Medium | The engine's real work |
| 5 | Modules 1, 3–7 content | Medium | Needs your voice — see below |
| 6 | Progress and certification views | Small | Rep sees their progress; admin sees the team |
| 7 | Author UI | Medium | Until then, content is seeded from code |

**Ship steps 1–3 first.** A single gated compliance quiz, taken before anyone
knocks a door, removes more risk than the entire rest of the curriculum.

---

## What I need from you

The compliance content I can draft from statute. **The selling content I cannot
invent** — scripts that don't sound like you will be ignored, and worse, they'll
be wrong about what actually works on a Treasure Coast doorstep.

1. **What do you actually say at the door?** Your opener, in your words.
2. **The three objections you hear most**, and what works on them.
3. **Who is doing this?** Kevin appears on the Hastings contract as salesperson —
   is he the model to build the scripts around?
4. **Is there a script today**, even informal?
5. **Do reps carry anything** — iPad, printed form, business card?

Give me a rough transcript of a good knock and I'll turn it into scenarios.
Precision matters less than authenticity here.

---

## Deliberately not in v1

- Video. Expensive to produce, painful to change, and the compliance rules will
  shift.
- Leaderboards. Fine for a floor of twenty; corrosive on a team of three.
- Certificates as PDFs. The database record is what matters.
- Spaced repetition. Right idea, wrong time — revisit once the first cohort is
  through and you can see what decays.
