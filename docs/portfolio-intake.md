# Portfolio intake — founder notes

One block per photo currently on the site. Fill in what you know, leave the rest
blank, and send it back — the drafts get turned into published stories.

**Why this sheet exists:** the `storyDraft` text in `content/site.ts` is a
placeholder and does **not** appear on the website. Only `story` renders
publicly, and it should contain confirmed facts. We removed fabricated
testimonials and inflated stats from the old site; invented square footage would
be the same problem in a new outfit.

**Target shape:** *"We built a 2,400 sq ft custom home in Sebastian, finished on
schedule."* — one or two sentences, concrete, verifiable.

---

## Photo 1 — `project-01.jpg` · "Block shell and roof framing"
*Block shell complete, trusses going up, corner lot.*

- City / area:
- Square footage:
- Beds / baths (optional):
- Anything notable (corner lot, hurricane rating, tight schedule):
- Finished on time? Under budget?
- OK to name the neighborhood?

**Current draft:** `We built a SQFT sq ft custom home on a corner lot in CITY, from slab through final walkthrough.`

---

## Photo 2 — `project-02.jpg` · "Truss set by crane"
*Crane setting trusses across a long block wall run.*

- City / area:
- Square footage:
- Roof span or truss count (optional):
- Notable (wind load rating, single-day set):
- Same job as Photo 1? (yes/no):

**Current draft:** `We set the roof structure on a SQFT sq ft build in CITY, engineered for Florida wind load.`

---

## Photo 3 — `project-03.jpg` · "Framing and garage structure"
*Gable framing, garage, roof underlayment going on.*

- City / area:
- Square footage:
- Garage size (2-car / 3-car):
- Notable:

**Current draft:** `We framed and dried in a SQFT sq ft home with a GARAGE_SIZE-car garage in CITY.`

---

## Photo 4 — `project-04.jpg` · "Crew on site during dry-in"
*Windows in, underlayment down, trades working inside.*

- City / area:
- Square footage:
- Roughly how many trades on site:
- Notable (schedule pressure, weather window):

**Current draft:** `We coordinated NUMBER trades through dry-in on a SQFT sq ft build in CITY, keeping the schedule on track.`

---

## Photo 5 — `project-05.jpg` · "Stucco and exterior finish"
*Stucco done, windows and trim set, roof prepped.*

- City / area:
- Square footage:
- Finish details worth naming (stucco texture, window package):
- Notable:

**Current draft:** `We completed the exterior envelope — stucco, windows, and roof — on a SQFT sq ft home in CITY.`

---

## Photo 6 — `project-06.jpg` · "Exterior nearing completion"
*Finished stucco, trimmed windows, doors hung, interior staged.*

- City / area:
- Square footage:
- Completed on schedule? Any figure you can stand behind:
- OK to name client? (yes/no):

**Current draft:** `We delivered a SQFT sq ft custom home in CITY, finished TIMELINE_OR_CONSTRAINT.`

---

## Ground rules for publishing

- **Only confirmed facts.** If the square footage is a guess, leave it out — "a
  custom home in Sebastian" beats a wrong number.
- **Client names need permission.** Without a yes, use the city only.
- **No outcome claims you can't defend.** "Finished on schedule" is great if
  true; skip it if the job ran long.
- **Photos may share a job.** If several are the same build, say so and they can
  be grouped into one richer story instead of six thin ones.

## What happens next

Send this back filled in. Each answer moves from `storyDraft` to `story` in
`content/site.ts`, which is what publishes to the site.
