# Covenant Builders

Next.js rebuild of [covenantbuilders.org](https://covenantbuilders.org/) — Florida residential and commercial construction (Vero Beach / Treasure Coast).

**Vercel (pre-DNS):** https://covenant-builders-ten.vercel.app · [project](https://vercel.com/josias7/covenant-builders)

## Stack

- Next.js 14 App Router
- TypeScript + Tailwind CSS
- Zod + next-safe-action
- Resend (estimate form delivery)
- Vercel Analytics

## Develop

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required env vars are documented in `.env.example`.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run dns:verify` — inventory / verify DNS + WP admin exposure

## Cutover status

Live production is still WordPress on GoDaddy. This Next.js app is the cutover target.

1. Complete [GoDaddy Phase 0](docs/launch-runbook.md#0a-godaddy-phase-0--do-this-week-p0) (renew by **2026-08-12**, backup/secure WP)
2. Deploy to Vercel + set env from `.env.example` (see [launch runbook](docs/launch-runbook.md))
3. Google Workspace + Resend DNS ([email cutover](docs/email-cutover.md))
4. Flip A/CNAME → Vercel; retire WP hosting
5. Search Console: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and submit `/sitemap.xml`

DNS snapshot: [docs/dns-inventory-2026-07-29.txt](docs/dns-inventory-2026-07-29.txt)
- `npm run dns:verify` — live DNS / WHOIS / WP-admin probe
- `bash scripts/post-cutover-check.sh` — after DNS flip to Vercel

## Ops docs

- [Rebuild plan](docs/rebuild-plan.md) — full rebuild/redesign plan and status
- [Investor package](docs/investors/README.md) — angel/VC one-pager, pitch narrative, ask sheet, data room
- [Launch runbook](docs/launch-runbook.md) — Vercel, Workspace, WP, DNS cutover order
- [Email cutover](docs/email-cutover.md) — Google Workspace + DNS
- [WordPress cutover](docs/wordpress-cutover.md) — secure old site before DNS flip
- [DNS inventory 2026-07-29](docs/dns-inventory-2026-07-29.txt) — pre-cutover snapshot
- [Review request template](docs/review-request-template.md) — Google review ask (highest local SEO lever)
- [Lead reply templates](docs/lead-reply-templates.md) — fast estimate responses
- [Marketing drafts](docs/marketing/README.md) — GBP posts + social captions (Phase 3)
- [GoDaddy cancel checklist](docs/godaddy-product-cancel-checklist.md) — drop Clientes / marketing add-ons (Phase 4)
- [CRM lead workflow](docs/crm-lead-workflow.md) — website estimate → Covenant Builders CRM
- [Portfolio intake](docs/portfolio-intake.md) — founder notes for real project stories
- [Audit notes](docs/audit-notes.md) — findings that drove the rebuild

## Investor materials

Public page: `/investors` (noindex — inbound only)

Internal package:

- `docs/investors/one-pager.md`
- `docs/investors/pitch-narrative.md`
- `docs/investors/ask-sheet.md` (**complete before sharing numbers**)
- `docs/investors/data-room-checklist.md`

## Trust facts on the site

- FL Certified Building Contractor **CBC1253676**
- Licensed since **December 8, 2005**
- Active through **August 31, 2028**
- License DBA: Interior Specialties Inc → operating as Covenant Builders
