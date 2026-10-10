# The Orlando Balcony — daily articles

One JSON file per article: `YYYY-MM-DD--<slug>.json`. Each becomes a static page
at `/orlando-balcony/<slug>`, appears on `/orlando-balcony`, `/orlando-balcony/archive`,
the RSS feed (`/orlando-balcony/feed.xml`) and the sitemap automatically. Copy an
existing file as the template. Run `npm run porch:check` before every push — it must pass.

## Who it is for
**Homeowners in the City of Orlando** (College Park, Thornton Park, Lake Eola Heights,
Colonialtown, Audubon Park, Baldwin Park, Delaney Park, Lake Nona, SoDo, Conway-area
city neighborhoods, etc.). Orange County news belongs here only when it lands on
Orlando homes (county tax rate, county elections, OCAlert). Not Winter Park,
Maitland, Kissimmee, Winter Garden or other cities. Every article must help them
with their house, their bills, their taxes, their safety, or their neighborhood.
No gossip, crime, celebrity, theme-park or opinion pieces.

## The rules (non-negotiable)
1. **Every fact has a source.** At least 2 sources, `https://`, from primary or
   local-news outlets: orlando.gov, ocfl.net, ocpafl.org, octaxcol.com,
   voteorangefl.gov (NOT ocvote.gov — that is California), ouc.com, sjrwmd.com,
   flsenate.gov, floridadep.gov, myfloridalicense.com, nhc.noaa.gov, fema.gov,
   Spectrum News 13, WFTV, WKMG, WESH, Fox 35, Orlando Sentinel, Central Florida
   Public Media. If a fact cannot be verified today, leave it out. Never invent
   numbers, dates, quotes or names.
2. **Useful, not filler.** 450+ words of body (aim 700–1,100), at least 2 `h2`
   subheads, a "what to do" section with concrete steps, and a 3–5 question
   `faq` that answers what people actually type into Google.
3. **One search intent per article.** Put "Orlando" and the topic in `seoTitle`
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
   Permits & rules · Home care · Condos & HOAs · Around town · Orlando history.
9. **City limits matter.** Many "Orlando" addresses are unincorporated Orange
   County with different trash, permit and code rules. Say which one a fact
   applies to.

## Never mix with the Porches
The Vero Porch, The Sebastian Porch and The PSL Porch are separate papers for the
Treasure Coast. If a statewide story runs in more than one, the Orlando article is
written for Orlando (its own numbers, offices, streets), with its own title and
slug. Never copy across. (There is also a separate Miami Beach paper planned at
/balcony — it is not this one.)
