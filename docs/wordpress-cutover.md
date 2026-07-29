# WordPress cutover checklist

The previous site at [covenantbuilders.org](https://covenantbuilders.org/) is WordPress (Astra + Elementor). During audit, `/wp-admin/` publicly exposed a **database upgrade** screen. Do not leave that state live.

## Before DNS flip

1. **Backup** files + database from the current host (GoDaddy hosting / Managed WordPress).
2. Either:
   - Complete the WordPress database update from a controlled admin session after backup, **or**
   - Take the WordPress site offline / put up maintenance while preparing cutover.
3. Restrict admin access (`/wp-admin`, `/wp-login.php`) with host firewall, IP allowlist, or disable after migration.
   - Live probe 2026-07-29: `/wp-login.php` → **200**, `/wp-admin/` → **302 → upgrade.php**. This must not stay public.
4. Export any final media you still need (logo and project photos already salvaged into `public/images`).
5. Deploy this Next.js site to Vercel (or preferred host) and confirm:
   - All pages render (including `/investors` noindex)
   - Contact form delivers with `RESEND_API_KEY`
   - Metadata / sitemap / robots respond
6. Point the domain DNS:
   - Apex / `www` → Vercel
   - Keep/email MX records separate (see `docs/email-cutover.md`)
7. **Purge** Cloudflare / GoDaddy CDN cache after the flip so WordPress HTML does not stick.

## After DNS flip

1. Confirm HTTPS certificate is valid.
2. Spot-check Home, Services, Portfolio, About, Contact, Privacy.
3. Submit a test estimate and verify delivery to `estimating@`.
4. Retire or lock down the old WordPress host so `/wp-admin` is not publicly reachable.
5. Update Google Business Profile website URL if needed.

## Do not

- Leave a public “Update WordPress Database” screen on the live domain
- Point DNS before the Next.js env vars are set
- Keep placeholder Gmail addresses on the public site after Workspace is live
