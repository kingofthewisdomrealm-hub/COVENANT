# The PSL Porch — daily articles

One JSON file per article: `YYYY-MM-DD--<slug>.json`. Each becomes a static page
at `/psl-porch/<slug>`, appears on `/psl-porch`, `/psl-porch/archive`, the RSS feed
(`/psl-porch/feed.xml`) and the sitemap automatically. Copy an existing file as the
template. Run `npm run porch:check` before every push — it must pass.

## Who it is for
**St. Lucie County homeowners only: Port St. Lucie, Fort Pierce, and unincorporated
St. Lucie County** (Lakewood Park, White City, Hutchinson Island in St. Lucie County,
etc.). Not Vero Beach, not Sebastian, not Stuart / Martin County. State news belongs
here only when it lands on St. Lucie County homes. Every article must help them with
their house, their bills, their taxes, their safety, or their neighborhood.
No gossip, crime, celebrity, or opinion pieces.

## The rules (non-negotiable)
1. **Every fact has a source.** At least 2 sources, `https://`, from primary or
   local-news outlets: cityofpsl.com, cityoffortpierce.com, stlucieco.gov,
   paslc.gov, stlucievotes.gov, fpua.com, floridadep.gov, flsenate.gov,
   myfloridalicense.com, mysafeflhome.com, nhc.noaa.gov, fema.gov, WQCS, TCPalm,
   WPTV, WFLX, CBS12, Hometown News. If a fact cannot be verified today, leave it
   out. Never invent numbers, dates, quotes or names.
2. **Useful, not filler.** 450+ words of body (aim 700–1,100), at least 2 `h2`
   subheads, a "what to do" section with concrete steps, and a 3–5 question
   `faq` that answers what people actually type into Google.
3. **One search intent per article.** Put the place name (Port St. Lucie,
   Fort Pierce or St. Lucie County) and the topic in `seoTitle` (≤ 60 chars) and
   `description` (110–160 chars). Never reuse a title or a near-duplicate topic.
4. **Roof and insurance copy (F.S. §489.147).** Never encourage anyone to file,
   handle or maximise an insurance claim; no rebates, gifts, coupons, "free
   roof" or deductible talk.
5. **Ballot measures and politics:** facts, dates and where to learn more only.
   Never tell readers how to vote.
6. **Covenant is the sponsor, not the subject.** Do not mention Covenant's
   services inside the article text.
7. **Dates:** `publishedAt` = the day it goes live (America/New_York) and must
   match the file name. When you correct an old article, add `updatedAt`.
8. Categories: Bills & utilities · Taxes & money · Storms & safety ·
   Permits & rules · Home care · Condos & HOAs · Around town · PSL history.

## Never mix with the other Porches
The Vero Porch and The Sebastian Porch are separate papers. If a statewide story
runs in more than one, the PSL article is written for St. Lucie County (its own
numbers, offices, streets), with its own title and slug. Never copy across.
