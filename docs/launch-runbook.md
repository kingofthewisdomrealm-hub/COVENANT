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

## 0a. GoDaddy Phase 0 — do this week (P0)

Venture: [GoDaddy dashboard](https://dashboard.godaddy.com/venture?ventureId=f7425698-c1b1-4d70-88c9-9fecc58004ff)

| Step | Action | Done when |
|---|---|---|
| 1 | **Renew** `covenantbuilders.org` (expires **2026-08-12**) | Expiry date moves forward |
| 2 | Enable **auto-renew** | Toggle on in domain settings |
| 3 | Confirm **domain lock** + WHOIS privacy | Lock statuses remain; privacy on |
| 4 | Inventory venture products (WP hosting, email, SSL, SEO/Marketing) | List written; cancel candidates noted for after cutover |
| 5 | **Screenshot / export all DNS** (A, CNAME, TXT, MX) | Saved for rollback |
| 6 | **Backup** WordPress files + database from GoDaddy hosting | Backup download confirmed |
| 7 | **Secure WP**: maintenance mode or restrict `/wp-admin` + `/wp-login.php` | Login/upgrade no longer public |
| 8 | Do **not** buy Site Builder / marketing upsells for the WP site | Spend goes to Vercel + Workspace |

Verify inventory anytime:

```bash
npm run dns:verify
```

**Agent completed (2026-07-29/30):** DNS/WHOIS inventory saved to `docs/dns-inventory-2026-07-29.txt`; Phase 0 checklist written; Venture dashboard opened. **You still must click in GoDaddy:** renew + auto-renew, screenshot DNS in UI, WP backup, lock `/wp-admin`/`/wp-login.php`.

---

## 1. Resend + Vercel env vars

### 1a. Resend

1. Create account at [resend.com](https://resend.com)
2. Add and verify domain `covenantbuilders.org` (Resend will give DNS records: SPF/DKIM — add these in DNS alongside Workspace later)
3. Create API key → copy once
4. Until the domain is verified, you may send from `onboarding@resend.dev` for tests only

### 1b. Deploy Next.js to Vercel

**Live project (2026-07-29):** [josias7/covenant-builders](https://vercel.com/josias7/covenant-builders)  
**Production alias:** https://covenant-builders-ten.vercel.app  
GitHub repo connected. Set env vars below, then add custom domain `covenantbuilders.org` in Vercel → Domains after GoDaddy DNS flip.

```bash
# from repo root (requires interactive login once)
npx vercel login
npx vercel link   # josias7/covenant-builders
npx vercel env add RESEND_API_KEY production
npx vercel env add LEAD_TO_EMAIL production
npx vercel env add LEAD_FROM_EMAIL production
npx vercel env add NEXT_PUBLIC_SITE_URL production
# optional after Search Console setup:
# npx vercel env add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION production
npx vercel --prod
```

Or set the same env vars in Project → Settings → Environment Variables.

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

1. Wait for propagation; run `bash scripts/post-cutover-check.sh`
2. HTTPS certificate valid on apex + www
3. Spot-check all pages on the real domain (incl. `/investors` noindex)
4. Send another test estimate
5. Purge Cloudflare / GoDaddy CDN cache
6. Retire WordPress hosting; cancel redundant GoDaddy Site Builder / SEO add-ons
7. Update Google Business Profile URL + NAP to match `content/site.ts`
8. Submit `https://covenantbuilders.org/sitemap.xml` in Google Search Console / Bing

---

## Abort criteria

Stop before DNS flip if any are true:

- [ ] No successful test lead email from the Vercel deployment
- [ ] WordPress `/wp-admin` still publicly showing DB upgrade and you have no backup
- [ ] Workspace MX not ready but you already removed old mail routing with no forward in place

---

## Appendix — live probe (2026-07-29)

| Fact | Value |
|---|---|
| Registrar | GoDaddy.com, LLC |
| Name servers | `ns31.domaincontrol.com`, `ns32.domaincontrol.com` |
| Apex A | `160.153.0.81` → `*.host.secureserver.net` (GoDaddy WP host) |
| www | CNAME → apex |
| MX | **none** |
| TXT / SPF / DKIM / DMARC | **none** |
| DNSSEC | unsigned |
| CDN | Cloudflare in front (`server: cloudflare`) |
| Domain lock (EPP) | clientDelete/Transfer/Update/RenewProhibited present |
| `/wp-login.php` | **HTTP 200** (login form public) |
| `/wp-admin/` | **302 → `upgrade.php`** (public DB upgrade) |
| Domain expiry | **2026-08-12T01:17:09Z** |
| Target after cutover | A `@` → Vercel; CNAME `www` → Vercel; MX/TXT → Workspace + Resend |

Implication: Google Workspace is net-new DNS (no MX to preserve). Web cutover is GoDaddy DNS A/CNAME → Vercel. WordPress P0 is still live — backup and lock admin before or during cutover. After flip, purge Cloudflare/GoDaddy cache and cancel WP hosting.

### Post-cutover DNS verify targets

```bash
# Expect Vercel apex (confirm IP in Vercel Domains UI — often 76.76.21.21)
dig +short A covenantbuilders.org
dig +short CNAME www.covenantbuilders.org
dig +short MX covenantbuilders.org
dig +short TXT covenantbuilders.org
```
