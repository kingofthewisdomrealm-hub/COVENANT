# Launch runbook — Covenant Builders

Execute in order. Do not flip DNS until steps 1–3 are green.

## 0. Prerequisites (you provide)

| Item | Needed for |
|---|---|
| GitHub (or Git) remote for this repo | Vercel deploy from git |
| Vercel account access | Hosting + env vars |
| Resend account + API key | Contact form delivery |
| Google Workspace admin (or approval to buy) | `@covenantbuilders.org` mailboxes |
| Domain DNS login (likely GoDaddy) | MX + web records |
| WordPress / hosting login | Backup + secure/retire WP |

---

## 1. Resend + Vercel env vars

### 1a. Resend

1. Create account at [resend.com](https://resend.com)
2. Add and verify domain `covenantbuilders.org` (Resend will give DNS records: SPF/DKIM — add these in DNS alongside Workspace later)
3. Create API key → copy once
4. Until the domain is verified, you may send from `onboarding@resend.dev` for tests only

### 1b. Deploy Next.js to Vercel

```bash
# from repo root
npm i -g vercel
vercel login
vercel link          # create / link project
vercel env add RESEND_API_KEY production
vercel env add LEAD_TO_EMAIL production
vercel env add LEAD_FROM_EMAIL production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod
```

Suggested values:

```bash
RESEND_API_KEY=re_xxxxxxxx
LEAD_TO_EMAIL=estimating@covenantbuilders.org
# temporary until Workspace exists:
# LEAD_TO_EMAIL=your-working-inbox@example.com
LEAD_FROM_EMAIL=Covenant Builders <onboarding@resend.dev>
# after Resend domain verify:
# LEAD_FROM_EMAIL=Covenant Builders <noreply@covenantbuilders.org>
NEXT_PUBLIC_SITE_URL=https://covenantbuilders.org
```

### 1c. Verify before DNS flip

- Open the `*.vercel.app` URL
- Spot-check Home / Services / Portfolio / About / Contact / Privacy
- Submit a test estimate; confirm email arrives at `LEAD_TO_EMAIL`
- Check `/sitemap.xml` and `/robots.txt`

---

## 2. Google Workspace (`docs/email-cutover.md`)

1. Confirm registrar/DNS host (see live probe notes in this file’s appendix when filled)
2. Start Google Workspace for `covenantbuilders.org`
3. Create mailboxes:
   - `info@covenantbuilders.org`
   - `estimating@covenantbuilders.org`
   - `josias@covenantbuilders.org`
   - optional Jr mailbox
4. Add Google MX + SPF + DKIM (+ DMARC) in DNS — **do not remove** Resend domain verification records; merge SPF carefully into one TXT if both send
5. Forward old Gmail (`Joeandujar@gmail.com`, `Uberandujar@gmail.com`) during transition
6. Set Vercel `LEAD_TO_EMAIL=estimating@covenantbuilders.org`
7. Update Google Business Profile, signatures, proposals

SPF merge example (adjust includes to match providers):

```txt
v=spf1 include:_spf.google.com include:amazonses.com ~all
```

(Resend’s current include may differ — use the exact value from the Resend dashboard.)

---

## 3. Secure / retire WordPress (`docs/wordpress-cutover.md`)

**P0:** `/wp-admin/` must not stay on a public database-upgrade screen.

1. Log into the current host (GoDaddy / WP admin)
2. **Backup** files + database
3. Choose one:
   - **A.** Complete DB update privately, then immediately lock admin, **or**
   - **B.** Put site in maintenance / take offline until DNS points to Vercel
4. Restrict `/wp-admin` and `/wp-login.php` (IP allowlist, Basic Auth, or disable after cutover)
5. After Vercel is live on the domain, cancel or park the old WordPress hosting so the upgrade screen cannot resurface

Do **not** click “Update WordPress Database” on a public shared computer without a backup.

---

## 4. Flip DNS (only after 1–3)

In the DNS host for `covenantbuilders.org`:

### Web (Vercel)

Use values from the Vercel project → Domains:

| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` (confirm in Vercel UI) |
| CNAME | `www` | `cname.vercel-dns.com` (confirm in Vercel UI) |

### Mail (keep separate)

- Leave Google Workspace MX records intact
- Do not point MX at Vercel

### After flip

1. Wait for propagation; confirm `dig A covenantbuilders.org` → Vercel
2. HTTPS certificate valid on apex + www
3. Spot-check all pages on the real domain
4. Send another test estimate
5. Retire WordPress hosting
6. Update Google Business Profile URL if needed

---

## Abort criteria

Stop before DNS flip if any are true:

- [ ] No successful test lead email from the Vercel deployment
- [ ] WordPress `/wp-admin` still publicly showing DB upgrade and you have no backup
- [ ] Workspace MX not ready but you already removed old mail routing with no forward in place

---

## Appendix — live probe (2026-07-25)

| Fact | Value |
|---|---|
| Registrar | GoDaddy.com, LLC |
| Name servers | `ns31.domaincontrol.com`, `ns32.domaincontrol.com` |
| Apex A | `160.153.0.81` (current WP/GoDaddy host) |
| MX | **none configured** |
| CDN | Cloudflare in front of origin |
| `/wp-admin/` | **302 → `upgrade.php` — public “Database Update Required”** |
| Domain expiry | 2026-08-12 |

Implication: Google Workspace setup is net-new DNS (no MX to preserve). Web cutover is GoDaddy DNS A/CNAME → Vercel. WordPress P0 is still live and must be handled from GoDaddy/WP access before or during cutover.
