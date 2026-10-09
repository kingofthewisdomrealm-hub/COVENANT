# The Sebastian Porch — daily articles

One JSON file per article: `YYYY-MM-DD--<slug>.json`. Each becomes a static page
at `/sebastian-porch/<slug>`, appears on `/sebastian-porch`, `/sebastian-porch/archive`, the RSS feed
(`/sebastian-porch/feed.xml`) and the sitemap automatically. Copy an existing file as the
template. Run `npm run porch:check` before every push — it must pass.

## Who it is for
**City of Sebastian homeowners only.** Not Vero, not Fellsmere, not Barefoot Bay —
Sebastian. County or state news belongs here only when it lands on Sebastian
homes (e.g. county sewer, which serves Sebastian). Every article must help them
with their house, their bills, their taxes, their safety, or their neighborhood.
No gossip, crime, celebrity, or opinion pieces.

## The rules (non-negotiable)
1. **Every fact has a source.** At least 2 sources, `https://`, from primary or
   local-news outlets: cityofsebastian.org, indianriver.gov / ircgov.com, sebastianpd.org, floridadep.gov,
   flsenate.gov, myfloridalicense.com, mysafeflhome.com, nhc.noaa.gov,
   fema.gov, WQCS, Vero News, TCPalm, WPTV, Sebastian Daily, Hometown News, Indian River Guardian.
   If a fact cannot be verified today, leave it out. Never invent numbers,
   dates, quotes or names.
2. **Useful, not filler.** 450+ words of body (aim 700–1,100), at least 2 `h2`
   subheads, a "what to do" section with concrete steps, and a 3–5 question
   `faq` that answers what people actually type into Google.
3. **One search intent per article.** The title answers one question a Vero
   homeowner would search. Put the place name and the topic in `seoTitle`
   (≤ 60 chars) and `description` (110–160 chars). Never reuse a title or a
   near-duplicate topic — check the existing files first.
4. **Roof and insurance copy (F.S. §489.147).** Never encourage anyone to file,
   handle or maximise an insurance claim; no rebates, gifts, coupons, "free
   roof" or deductible talk. Informational facts about insurance are fine.
5. **Ballot measures and politics:** facts, dates and where to learn more only.
   Never tell readers how to vote.
6. **Covenant is the sponsor, not the subject.** Articles do not sell. The
   sponsor box is added by the page automatically. Do not mention Covenant's
   services inside the article text at all.
7. **Dates:** `publishedAt` = the day it goes live (America/New_York) and must
   match the file name. When you correct an old article, add `updatedAt`.
8. Categories: Bills & utilities · Taxes & money · Storms & safety ·
   Permits & rules · Home care · Condos & HOAs · Around town · Sebastian history.

## Picking today's topic
1. First look for **real news from the last 7 days** that affects Sebastian
   homeowners (Sebastian city council, county commission, utilities, taxes, storms,
   permits, roads, big local projects). News beats the backlog.
2. Otherwise take the next unchecked topic in `BACKLOG.md`, research it fresh,
   and tick it off.

## Never duplicate The Vero Porch
If the same county story runs in both papers, the Sebastian article must be
written for Sebastian (Sebastian numbers, Sebastian offices, Sebastian streets),
with its own title and slug. Never copy a Vero article.
