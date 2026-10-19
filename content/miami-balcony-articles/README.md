# The Miami Balcony — daily articles

One JSON file per article: `YYYY-MM-DD--<slug>.json`. Each becomes a static page
at `/balcony/<slug>`, appears on `/balcony`, `/balcony/archive`, the RSS feed
(`/balcony/feed.xml`) and the sitemap automatically. Copy an existing file as the
template. Run `npm run porch:check` before every push — it must pass.

## Who it is for
**Homeowners and condo owners in the City of Miami Beach** (South Beach, South of
Fifth, Flamingo Park, West Avenue, Sunset Harbour, Mid-Beach, Nautilus, La Gorce,
the Venetian and Sunset islands, North Beach, Normandy Isle, North Shore, Biscayne
Point, Altos del Mar, etc.). Miami-Dade County news belongs here only when it
lands on Miami Beach homes (county tax bill, county elections, evacuation orders).
Not the City of Miami, North Miami Beach, Surfside, Bal Harbour or other cities.
Every article must help them with their home, their bills, their taxes, their
safety, or their neighborhood. No gossip, crime, celebrity, nightlife or opinion
pieces.

## The rules (non-negotiable)
1. **Every fact has a source.** At least 2 sources, `https://`, from primary or
   local-news outlets: miamibeachfl.gov, mbrisingabove.com, miamidade.gov,
   miamidadepa.gov, mdctaxcollector.gov, flsenate.gov, floridadep.gov,
   sfwmd.gov, myfloridalicense.com, nhc.noaa.gov, fema.gov, NBC 6, WPLG Local 10,
   WSVN 7, CBS Miami, WLRN, Miami Herald. If a fact cannot be verified today, leave it out. Never invent
   numbers, dates, quotes or names.
2. **Useful, not filler.** 450+ words of body (aim 700–1,100), at least 2 `h2`
   subheads, a "what to do" section with concrete steps, and a 3–5 question
   `faq` that answers what people actually type into Google.
3. **One search intent per article.** Put "Miami Beach" and the topic in `seoTitle`
   (≤ 60 chars) and `description` (110–160 chars). Never reuse a title or a
   near-duplicate topic.
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
   Permits & rules · Home care · Condos & HOAs · Around town · Miami Beach history.
9. **City limits matter.** Miami Beach is its own city. The City of Miami,
   North Miami Beach, Surfside and Bal Harbour have different rules, offices and
   rates. Say which government a fact comes from (city or Miami-Dade County).

## Never mix with the other papers
The Vero Porch, The Sebastian Porch, The PSL Porch and The Orlando Balcony are
separate papers. If a statewide story runs in more than one, the Miami Beach
article is written for Miami Beach (its own numbers, offices, streets), with its
own title and slug. Never copy across.
