-- Seed: the assistant playbook (plain-text knowledge Claude reads before it speaks).
-- Safe to re-run (upsert).
insert into public.assistant_knowledge (topic, body, source) values
('build-order', 'BUILD ORDER (from covenantbuilders.org/play, the build-order game). The right order of steps for a real Treasure Coast job. Skip a step and it leaks.

LEVEL: Roof Raiser (Put on a roof). Step order reflects Florida Building Code re-roof practice and Indian River County inspection checkpoints (sheathing → dry-in → flashing → in-progress → final). A game, not a permit.
1. Pull the permit - The county needs to know. No permit means no inspections, and your insurer will want to see those. (if skipped: No permit, no inspections. Now the roof has to come back off to prove the nailing.)
2. Tear off the old roof - Down to bare wood. Never roof over rotten material. (if skipped: You buried bad wood under new shingles. It rots from the inside. Surprise.)
3. Re-nail the deck - 8d ring-shank nails every 6 inches. Inspection 1: sheathing. (if skipped: The deck is not nailed to code. A hurricane peels plywood like a banana.)
4. Drip edge at the eaves - A metal lip so water drops off instead of wicking back into the wood. (if skipped: Water wicks back under the edge and rots the fascia. Your gutter guy hates you.)
5. Peel-and-stick water barrier - Self-adhered membrane over the whole deck. Inspection 2: dry-in. (if skipped: No secondary water barrier. Shingles blow off, rain pours straight in.)
6. Flash pipes, valleys and walls - Metal at every hole and every joint. Inspection 3: flashing. (if skipped: Every pipe and wall joint is now an open faucet into your attic.)
7. Shingles — six nails each - Florida wants six, not four. Inspection 4: in-progress. (if skipped: Nothing on top yet. That membrane is not rated to sit in the sun.)
8. Ridge vent and clean-up - Let the attic breathe, pick up every nail. Inspection 5: final. (if skipped: The attic cannot breathe and the yard is full of nails. Final fails.)

LEVEL: House Raiser (Build a house). Step order reflects Florida Building Code required inspections (foundation → framing and sheathing → dry-in → rough-ins → final) and standard Treasure Coast concrete-block construction. A game, not a permit.
1. Plans, survey and permit - Engineered plans, a lot survey, and the county sign-off. (if skipped: You built on a guess. No permit, no inspections, and the county makes you tear it out.)
2. Dig and pour the footers - Trenches, rebar, concrete. Inspection 1: foundation. (if skipped: Nothing to stand on yet. The walls sink into the sand like a beach umbrella.)
3. Under-slab plumbing, termite treatment, pour the slab - Pipes go in the dirt first. Then the concrete seals everything. (if skipped: You poured the slab with no pipes under it. Jackhammer time.)
4. Lay the block walls - Concrete block with rebar and poured cells. Florida’s favorite. (if skipped: Walls need a slab to sit on. Block on dirt is a very expensive pile.)
5. Pour the tie beam - A concrete beam that locks the walls together and holds the roof down. (if skipped: No tie beam means the trusses have nothing to strap to. First storm, the roof goes flying.)
6. Set trusses and sheathing - Crane day. Straps, sheathing, nailed to code. Inspection 2: framing. (if skipped: Trusses straight onto block? No — the tie beam is what they strap to.)
7. Dry-in, windows and doors - Roof membrane, impact windows, exterior doors. Now it is watertight. Inspection 3. (if skipped: The house is not closed in yet. Rain on drywall makes papier-mâché.)
8. Rough-ins: electric, plumbing, A/C - Wires, pipes and ducts while the walls are still open. Inspection 4. (if skipped: The inspector needs to see every wire and pipe before anything gets covered.)
9. Insulation and drywall - Now the walls can close. Mud, tape, texture. (if skipped: You just hid the wires before the inspector saw them. Cut it all open again.)
10. Finishes, final, Certificate of Occupancy - Roof covering, paint, cabinets, floors, sod. Inspection 5: final. Keys. (if skipped: Pretty finishes on an unfinished house. Nobody can live in it yet.)
', 'covenantbuilders.org'),
('design', 'DESIGN YOUR PROJECT (from covenantbuilders.org/design-your-project). A guided designer that turns a homeowner''s or board''s idea into a project brief.
Branches and their questions:
- new-home "Build a new home": Where would it go? (Land I already own / Land I''m buying / Still looking for land / Tearing down and rebuilding). Scope: Design/architectural plans, Site work & clearing, Foundation, Shell & framing, Roof, Impact windows & doors, Full interior finish, Kitchen & cabinetry, Pool/outdoor living, Dock or seawall. Size: Under 1,500 / 1,500-2,500 / 2,500-4,000 / 4,000-6,000 / 6,000+ sq ft / not sure. Uses a finish level.
- remodel "Remodel or add on": Property: Single-family home / Condo or townhouse unit / Waterfront or barrier-island property / Investment or rental property. Scope: Kitchen, Primary bath, Additional baths, Whole-house refresh, Room addition, Second-storey addition, Flooring, Impact windows & doors, Roof, Opening up walls / layout change, Aging-in-place (curbless shower, wider doors, ramp). Size: Under 500 / 500-1,500 / 1,500-2,500 / 2,500-4,000 / 4,000+ sq ft / not sure. Uses a finish level.
- kitchen "Kitchen & cabinetry": same property options. Scope: Cabinetry, Countertops, Appliances, Island/layout change, Flooring, Lighting & electrical, Plumbing relocation, Wall removal. Size: Galley or small / Standard / Large or open-plan / Kitchen plus adjoining rooms / not sure. Uses a finish level.
- commercial "Commercial space": What kind of space? Retail / Office / Restaurant or hospitality / Warehouse or light industrial / Multi-family. Scope: Ground-up build, Interior build-out, Tenant improvement, ADA upgrades, Impact/storefront glazing, Roof, MEP upgrades. Size: Under 1,500 / 1,500-5,000 / 5,000-15,000 / 15,000+ sq ft / not sure. Uses a finish level.
- condo "Condo or association building" (milestone, SIRS, structural repair): Building size: 10-30 units / 30-100 units / 100+ units / not sure yet. Scope: Milestone Phase 1 findings, Milestone Phase 2 repairs, SIRS-identified work, Spalled concrete repair, Balcony restoration, Waterproofing & coatings, Railings, Roof, Impact window/door replacement, Common-area interior. No finish level; instead the BOARD STAGE: Gathering information / Engineer''s report in hand / Budgeting the assessment / Ready to bid / Under a compliance deadline.
- storm "Storm damage repair": Property: Single-family home / Condo unit / Association building / Commercial building. Scope: Roof, Windows & doors, Water intrusion / interior, Structural, Soffit & fascia, Full rebuild. No finish level. This branch is a legal document: never mention filing, handling, helping with or maximizing a claim; never "no out-of-pocket"; never "we work with all insurance companies". Only sentence allowed about insurance: "We provide repair estimates. For questions about your coverage or your deductible, contact your insurance carrier directly."
- unsure "Not sure yet": residential property options; scope: Kitchen, Bathrooms, Room addition, Whole-house refresh, Impact windows & doors, Roof, Storm or water damage, Something structural, I really don''t know yet.
Finish levels: Practical (durable, code-plus, sensible materials; built to last, not to impress). Refined (where most Vero Beach homes land; better cabinetry, tile, fixtures). Custom (bespoke millwork, specified finishes, architectural detail).
Timeline options: As soon as possible / 1-3 months / 3-6 months / 6-12 months / Just planning for now.
Budget: the site does NOT publish price ranges (planning ranges are switched off on purpose; publishing prices is advertising under Rule 61G4-12.011(3) F.A.C.). Never state a price, a cost range, or a square-foot cost. If asked, say pricing needs a site visit and a written scope.
Every brief must end with the licence (CBC1253676) and this DISCLAIMER: "This project brief is a planning document, not a quote, bid, offer, or contract. Any figures shown are non-binding planning ranges based on typical regional costs and do not account for site conditions, permits, allowances, or change orders. Pricing requires a site visit and a written scope. Using this tool does not create a contract."
The call to action is always the same words: "Design your project". Next step after a brief: a free walkthrough, booked by phone (772) 473-7115 or the booking calendar.
', 'covenantbuilders.org'),
('faqs', 'FAQS (from covenantbuilders.org). Answer these in these words; do not add numbers that are not here.

--- services ---
Q: Is Covenant Builders licensed in Florida?
A: Yes. Covenant Builders holds Florida Certified Building Contractor licence CBC1253676, active since December 8, 2005. You can verify it yourself on the Florida DBPR licence lookup before you ever call us.
Q: What areas do you build in?
A: Vero Beach, Sebastian, Fort Pierce, Port St. Lucie, Fellsmere and the surrounding Treasure Coast. Office hours are Monday through Friday, 9:00 AM to 5:00 PM. If you are not sure whether your address is in range, ask us.
Q: Do you pull your own permits?
A: Yes. We handle permit submittal and plan review ourselves and record the notice of commencement, rather than leaving that to you or handing it off to someone else.
Q: How long does a project take?
A: Every service on this page publishes its full stage list with honest durations. On a new home, design, engineering and selections run 8 to 16 weeks, permitting 4 to 12 weeks, and structure and dry-in 8 to 14 weeks. A kitchen moves faster: consultation and feasibility 1 to 2 weeks, design and selections 3 to 8 weeks, cabinetry and finishes 4 to 10 weeks.
Q: Do you build your own cabinets?
A: Yes. Cabinetry is built in our own shop rather than ordered from a catalogue, which is why our shop capacity, not a supplier queue, sets the kitchen schedule.
Q: Do you handle storm damage and insurance restoration?
A: Yes. Our storm restoration process starts with inspection and documentation, then contract and claim coordination, an adjuster meeting to agree the scope, permitting and mobilisation, reconstruction, and closeout.
Q: What do I get before I sign anything?
A: A written scope before work starts, and the step-by-step process for your service with honest durations, so you can read what happens and when before you commit to anything.
Q: Do you speak Spanish?
A: Yes. Covenant Builders is a bilingual company. Hablamos español.

--- programs ---
Q: How much money can I get from My Safe Florida Home?
A: Up to $10,000 toward approved wind-hardening upgrades, after a free state wind-mitigation inspection. Most property owners get a 2-to-1 match, meaning the state pays $2 for every $1 you spend, and low-income owners can qualify with no match required. The 2026 state budget put roughly $378 million back into the program and the application portal is open for the 2026-27 year.
Q: Can a condo association get grant money for wind hardening?
A: Yes, through the My Safe Florida Condo pilot, which covers buildings three habitable stories and up. The association applies, not individual unit owners, and grants fund common elements such as roofs and openings. The pilot continues with about $27 million in fresh 2026 funding.
Q: Do you charge to help me find programs?
A: No. Applying is free and we never charge for pointing the way. If you would rather not do the homework yourself, the eligibility check on this page takes about 60 seconds and we will tell you which programs likely fit your property.
Q: My insurance claim was denied or underpaid. What can I do?
A: Florida runs a free residential property mediation program through the Department of Financial Services. The insurance company pays the entire cost, a neutral mediator is usually assigned within about three weeks, and if you reach a settlement you still have three business days to change your mind. Call the DFS consumer helpline at 1-877-693-5236.
Q: Is Elevate Florida still taking applications?
A: No. Elevate Florida has been closed to new applications since April 2025, with existing awards delayed in federal review. If you already applied, check your status at 877-353-8835. If you did not, My Safe Florida Home is the live hardening option.
Q: Do I have to hire Covenant Builders to use these programs?
A: No. When a grant or program funds hardening or repairs, you still choose your own licensed contractor. We provide the quotes, wind-mitigation documentation and licensed work that programs like My Safe Florida Home require, but you apply directly and the choice of builder stays yours.
Q: Which counties does this guide cover?
A: Indian River, St. Lucie and Martin on the Treasure Coast, Brevard on the Space Coast, and Orange, Osceola, Seminole and Lake in the Orlando area, plus every statewide program.
Q: How current is this information?
A: Program details, funding and deadlines change with each legislative session. Statuses on this page were verified in August 2026. Always confirm current terms on the official program sites linked above. Covenant Builders is not affiliated with these programs; applications are made directly by the property owner or association.
', 'covenantbuilders.org'),
('milestone-law', 'Florida milestone inspections, in plain words (F.S. 553.899): condo and co-op buildings three stories or taller must get a structural ''milestone'' inspection by a licensed architect or engineer. Phase 1 is a visual check for substantial structural deterioration; if it finds any, Phase 2 is a deeper look that can include testing. The first inspection is generally due by December 31 of the year the building turns 30 (local governments may set 25 years for buildings near the coast), then every 10 years. Buildings that were already past that age got a catch-up deadline of December 31, 2024. Separately, associations must keep a Structural Integrity Reserve Study (SIRS) that funds the big structural items. Boards must give owners the inspection summary. Always confirm the current statute and the county''s own deadlines before quoting a date to a board — laws and local rules change.', 'covenantbuilders.org'),
('outreach', 'How we talk to condo boards: three sentences, plain words. (1) Name the deadline or the inspection they are facing, with the date. (2) Offer something free and specific — a walk-through, a second read of the engineer''s report, a rough budget range. (3) Ask for fifteen minutes with the board president or property manager, and name the day. No jargon, no pressure, no fake urgency. If they''ve already had the inspection, ask what the report flagged. Log every call in the CRM with the next step and the date.', 'covenantbuilders.org'),
('services', 'Covenant Builders is a state-certified building contractor in Vero Beach, Florida, serving the Treasure Coast. Core work: condo milestone/SIRS repairs — spalled concrete, balcony restoration, waterproofing, post-inspection structural repairs; storm restoration; remodels; wind-mitigation work (impact windows and doors, roof-to-wall connections). We write reports boards can forward straight to unit owners, in plain language. CRM lives at app.covenantbuilders.org. The owner''s background: 25 years of volunteer community service alongside the cabinet-making trade before becoming a general contractor — lead with service and plain talk, not the sales pitch.', 'covenantbuilders.org'),
('site', 'SITE FACTS (from covenantbuilders.org). Covenant Builders. Tagline: "We Deliver." Florida Certified Building Contractor, licence CBC1253676, licensed since December 8, 2005, status Active, expires August 31, 2028, DBA Interior Specialties Inc. Verify at myfloridalicense.com. Service area: Vero Beach and the Treasure Coast: Vero Beach, Sebastian, Fort Pierce, Port St. Lucie, Fellsmere. Office: 876 47th Avenue, Vero Beach, FL 32966 (relocated from 5400 85th St; use the new address). Email: estimates@covenantbuilders.org. Phone: Josias Andujar Sr, President & Founder, (772) 473-7115. Hours: Monday-Friday 9:00 AM-5:00 PM, closed Saturday and Sunday. Bilingual company. Hablamos espanol. We typically respond to estimate requests within one business day. Social: Facebook facebook.com/covenantbuildersorg, Instagram instagram.com/covenantbuildersorgs. Website: covenantbuilders.org. CRM: app.covenantbuilders.org. Booking calendar: cal.com/joe-andujar-tw8nn2/30min.
Pages: /services, /portfolio, /about, /contact, /design-your-project, /homeowner-programs, /storm-check, /play.
Voice rules: no invented numbers (no square footages, budgets, timelines, project counts or testimonials that cannot be verified). The customer is the hero; the licence number does the bragging. Never write like a marketer.
', 'covenantbuilders.org'),
('storm-check', 'STORM CHECK (from covenantbuilders.org/storm-check). A screening quiz: does a storm look like it touched this roof?
How it scores: each ground-level sign the owner checked adds points (gutter/downspout dents 20; AC fin dents 20; screen/mailbox/trim dings 15; granules piling in gutters 10; missing/lifted/creased shingles 20; cracked or slipped tiles 20; ceiling stains, drips or a leak 25; dents in fence/siding/pool cage 10; "nothing yet" 0). If a recorded storm event matches the ZIP''s county, +15. Roof age 15-20 or over 20 years, +10. If the owner noticed it after a specific storm (not "not sure"), +5. Score capped at 100.
Bands: 50 or more = LIKELY damage worth inspecting now. 25-49 = POSSIBLE, worth a look. Under 25 = LOW.
Recorded events (official sources only): May 5, 2025 hailstorm (St. Lucie, Palm Beach): 2-inch hail near Lawnwood Stadium, Fort Pierce; quarter-size hail with 52 mph gusts in Wellington (NWS Melbourne via Storm Prediction Center). Hurricane Milton, Oct 9, 2024 (Indian River, St. Lucie, Martin, Palm Beach, Okeechobee, Brevard): tornadoes and hurricane-force gusts across the Treasure Coast (NWS Melbourne).
Soft metals (gutters, AC fins, screens) show hail marks long before a roof does from the street.
The honest next step for LIKELY or POSSIBLE: a licensed contractor on the roof, a free visit, a written answer either way.
COMPLIANCE (Florida): this is a roof advertisement. Never encourage anyone to file, handle, help with, or maximize an insurance claim. Never offer a rebate, gift, coupon, deductible waiver or "no out-of-pocket" promise with an inspection. Never state a dollar figure for repairs or claims. Never ask about the deductible or claim amount. The ONLY insurance sentence allowed: "We provide repair estimates. For questions about your coverage or your deductible, contact your insurance carrier directly."
DISCLAIMER that must travel with every storm-check result: "This storm check is an informational screening based on what you told us, not an inspection, quote, bid, offer or contract. It does not determine whether damage exists or what caused it. Only an on-site inspection by a licensed contractor can do that. Using this tool does not create a contract."
', 'covenantbuilders.org')
on conflict (topic) do update set body=excluded.body, source=excluded.source, updated_at=now();
