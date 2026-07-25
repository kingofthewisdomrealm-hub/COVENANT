# Covenant Builders

Next.js rebuild of [covenantbuilders.org](https://covenantbuilders.org/) — Florida residential and commercial construction (Vero Beach / Treasure Coast).

## Stack

- Next.js 14 App Router
- TypeScript + Tailwind CSS
- Zod + next-safe-action
- Resend (estimate form delivery)

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

## Ops docs

- [Rebuild plan](docs/rebuild-plan.md) — full rebuild/redesign plan and status
- [Launch runbook](docs/launch-runbook.md) — Vercel, Workspace, WP, DNS cutover order
- [Email cutover](docs/email-cutover.md) — Google Workspace + DNS
- [WordPress cutover](docs/wordpress-cutover.md) — secure old site before DNS flip
- [Audit notes](docs/audit-notes.md) — findings that drove the rebuild

## Trust facts on the site

- FL Certified Building Contractor **CBC1253676**
- Licensed since **December 8, 2005**
- Active through **August 31, 2028**
- License DBA: Interior Specialties Inc → operating as Covenant Builders
