# Job submittal SOP — roofing

**Covenant Builders · internal**
Rewritten 2026-08-01 from the previous How To. Platform-neutral: every step now
refers to the Covenant Builders CRM.

---

## Job approval checklist

Before submitting a job for approval, make sure every required document is
uploaded to the job in the CRM. When it's complete, send it for review from the
job's Documents section.

### Required documents

**Financial worksheet** — all fields completed accurately.

**Photos** — roof and property only. **Do not put checks in the photos folder.**

**Roofing agreement (final contract)** — signed by both the project manager and
the homeowner. Type the information; avoid handwriting wherever possible.

**Signed NOC and permit documents** — a Notice of Commencement is *always*
required. Permit documents are not always needed. Request whatever is missing
from the office.

**Eagle View report** — order the **premium** report; it's what material orders
are built from. Order reports for the primary structure **and any detached
structures**.

**Job submittal form** — every field completed.

**Insurance paperwork** — insurance claims only. Does not apply to retail jobs.

**Check submittal** — upload both a scanned copy of the check and a check
submittal form. Attach the scanned check to the check submittal record, and put
both in the job's Documents section.

---

## Job submittal form — field guide

Complete this from the template in the CRM. Do not handwrite responses.

**Steep slope, low slope, pitch**
- *Steep slope squares* — any roof section with a pitch of 3/12 or greater
- *Low slope squares* — under 3/12; treated as flat and needs rolled roofing, not shingles
- *Pitch* — the primary slope, found on page 1 of the Eagle View

**Roof covering, brand, profile, colour**
- *Covering* — shingles, metal, tile, etc.
- *Brand* — shingles: IKO, GAF, CertainTeed, Owens Corning · tile: Eagle
- *Profile* — the product line, e.g. Timberline (GAF), Dynasty (IKO), Duration (Owens Corning)
- *Colour* — as chosen by the homeowner

**Underlayment, valleys, drip edge**
- *Underlayment* — standard for shingles is Resisto peel-and-stick; name anything different
- *Valleys* — state whether valley metal or Resisto
- *Drip edge* — colour. Default white; say so if brown, black or other

**Flat areas** — this is the low slope squares. Give material and colour, or
"match shingle colour". Example: CertainTeed Flintlastic Weathered Wood.

**Attic ventilation**
- *Ridge vent* — total feet required
- *Off-ridge vent (ORV)* — number of pieces and colour, e.g. "4, Brown"

**Pipe jacks and goosenecks** — leave blank or enter 0 if none.

**Skylights** — we primarily use Kennedy and Velux. Give brand, glass type
(tempered or high impact), curb size (2" or 4"), mounting (self-flashing or
curb-mounted), dimensions and quantity.
Example: *3 Kennedy skylights, self-flashing, high impact glass, 2" curb.*

**Electrical intake, satellite dish, chimney, chimney cricket** — leave blank or
enter "no/0" if none. If a satellite dish is being discarded, write "trash" here
or in Notes.

**Known leaks, problems, bad wood** — be specific so the crew can find and fix
it. If extra plywood is needed, give a quantity.

**Existing gutters** — blank means the existing gutters stay. If replacing, say
whether it's a full wrap or partial (name the areas), and give the colour.

**Paver driveway** — yes or no.

**Dumpster location** — where the homeowner wants it placed.

**Gate code** — required for crew access, deliveries and inspections. **Without
it an inspection can fail.**

**Solar** — whether panels are present, and whether they're to be removed and
reinstalled or discarded.

**Flashing** — blank means none will be ordered. "Replace any bad flashing"
orders one piece; give a quantity if more is needed.

**Total structures** — matters for permitting. State whether there is one main
residence or multiple detached structures, make sure all appear on the Eagle
View, and flag if a separate material order is needed.

**Notes and instructions** — anything that didn't fit above, or anything worth
emphasising. Example: *"We are using GAF UHDZ, not just HDZ"* or *"Order 5 total
plywood."*

---

## Check handling

### Create a check submittal
1. Open the job in the CRM
2. Go to **Documents**
3. Add a document into the **Job Paperwork** folder
4. Choose **Check submittal**
5. Save

For 10% draws, send a note to the office rather than submitting directly.

### Upload a check from the field
1. Open the job on your phone
2. Go to **Documents**
3. Add a document and scan it
4. Name it clearly, then save

### Attach a check to an existing check submittal
1. Open the job → **Documents**
2. Open the check submittal
3. Edit, add document, choose the scanned check from the job's documents
4. Save

---

## Notes for the CRM build

The submittal form above is a real specification and the CRM does not support it
yet. Building it would mean:

- A `job_submittals` table carrying these fields, one per job
- The roofing spec fields as structured data rather than free text, so material
  orders can be generated instead of retyped
- A completeness check driving a "ready to submit" state
- The required-documents list as a checklist on the job, each item satisfied by
  an uploaded document

That last one is the cheapest and most useful: it turns this SOP from a document
someone has to remember into a checklist the job itself enforces.
