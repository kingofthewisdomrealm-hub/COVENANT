# The Breezeway — daily articles

One JSON file per article: `YYYY-MM-DD--<slug>.json`. Each becomes a static page
at `/breezeway/<slug>`, appears on `/breezeway`, `/breezeway/archive`, the RSS
feed (`/breezeway/feed.xml`), the sitemap and the Facebook auto-poster
automatically. Copy an existing file as the template. Run `npm run porch:check`
before every push — it must pass.

## Who it is for
**Florida condominium unit owners and the volunteer board members who run their
associations** — statewide. Chapter 718 condos first; HOAs (Chapter 720) only
when a story clearly lands on them too, and say so. Every article must help a
reader understand a notice, a vote, a bill, a deadline or their building.
No gossip, no lawsuits about named people, no real-estate listings.

## The rules (non-negotiable)
1. **Every fact has a source.** At least 2 sources, `https://`, primary first:
   flsenate.gov (statute text), laws.flrules.org, myfloridalicense.com (DBPR
   Division of Condominiums), mysafeflcondo.com / myfloridacfo.com (DFS),
   floir.com, citizensfla.com, fanniemae.com / singlefamily.fanniemae.com,
   freddiemac.com, hud.gov, flgov.com; then Florida newsrooms. If a fact cannot
   be verified today, leave it out. Never invent numbers, dates or quotes.
   **Statute numbers must be checked against flsenate.gov the day you write.**
2. **Useful, not filler.** 450+ words (aim 700–1,100), 2+ `h2` subheads, a
   "what to do" section, and a 3–5 question `faq` written the way owners
   search ("can my condo board borrow money without a vote").
3. **Plain words.** Explain every term the first time (SIRS, milestone,
   "majority of the total voting interests", pooled reserves). Short sentences.
   A retired owner reading a board notice at the kitchen table is the reader.
4. **Not legal advice.** Describe what the law says and who to ask (the
   association attorney, the engineer, DBPR's ombudsman). Never tell a board
   what it must decide.
5. **Covenant is the sponsor, not the subject.** Never mention Covenant's
   services in an article. Never suggest Covenant does milestone/structural
   repair — the licence-scope question in content/breezeway.ts is open.
6. **Roof/insurance copy (F.S. §489.147):** no claim talk, rebates, gifts,
   "free roof" or deductible promises.
7. **Politics:** facts and dates only. Never tell readers how to vote.
8. **Dates:** `publishedAt` = go-live day (America/New_York), must match the
   file name. Corrections add `updatedAt`.
9. Categories: Reserves & SIRS · Inspections & repairs · Assessments & loans ·
   Condo insurance · Board rules · Taxes & money · Storms & safety · Condo history.
10. `places`: "Florida" plus any county/city the story is about.

## Never mix with the Porches
The Porches and Balconies are town papers for homeowners. The Breezeway is the
statewide condo paper. A condo story can run in a town paper too, but each is
written separately with its own title and slug. Never copy across.
