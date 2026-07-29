# Professional email cutover (`@covenantbuilders.org`)

Your domain already exists. Attach email hosting, create mailboxes, then point DNS in **GoDaddy DNS** (NS: `ns31`/`ns32.domaincontrol.com` as of 2026-07-29).

## 1. Find where the domain/DNS lives

Confirmed live probe:

- **Registrar:** GoDaddy.com, LLC
- **DNS host:** GoDaddy (`domaincontrol` NS)
- **Current website host:** GoDaddy WordPress (`160.153.0.81`) behind Cloudflare

## 2. Choose an email provider

**Recommended for contracting firms:** Google Workspace (~$6–7/user/month)

- Gmail interface
- Strong deliverability
- Reliable for large-bid communication

**Budget route:** email bundled with your web host (often free or ~$1–2/month). Fine for basics; weaker long-term for chasing larger contracts.

**Decision for this cutover:** Google Workspace (not GoDaddy Email).

Start: [Google Workspace](https://workspace.google.com/) → add domain `covenantbuilders.org`.

## 3. Create mailboxes

| Address | Purpose |
|---|---|
| `info@covenantbuilders.org` | General inbox |
| `estimating@covenantbuilders.org` | Project inquiries / contact form destination |
| `josias@covenantbuilders.org` | Owner |
| Optional second personal mailbox | Josias Jr |

`bids@` can alias to `estimating@` if preferred.

## 4. Set DNS records (GoDaddy)

Paste these into GoDaddy DNS for `covenantbuilders.org`. Values marked **confirm in provider UI** must match the live dashboard.

### 4a. Google Workspace MX (replace any existing MX)

Priority / host / value (Google’s current defaults — confirm in Workspace Admin → Domains):

| Type | Name | Priority | Value |
|---|---|---|---|
| MX | `@` | 1 | `ASPMX.L.GOOGLE.COM` |
| MX | `@` | 5 | `ALT1.ASPMX.L.GOOGLE.COM` |
| MX | `@` | 5 | `ALT2.ASPMX.L.GOOGLE.COM` |
| MX | `@` | 10 | `ALT3.ASPMX.L.GOOGLE.COM` |
| MX | `@` | 10 | `ALT4.ASPMX.L.GOOGLE.COM` |

Also add Google’s domain verification TXT if Workspace asks for it.

### 4b. Google DKIM

In Workspace Admin → Gmail → Authenticate email → generate DKIM → add the TXT (or CNAME) record Google shows (usually `google._domainkey`).

### 4c. Resend (transactional — contact form)

In [Resend Domains](https://resend.com/domains) add `covenantbuilders.org` and copy **every** record Resend shows (SPF include, DKIM CNAMEs, optional MX for inbound). Do not delete them when adding Workspace.

### 4d. Merged SPF (one TXT on `@`)

Only one SPF TXT is allowed. Merge Google + Resend (and SES if Resend still uses it):

```txt
v=spf1 include:_spf.google.com include:amazonses.com ~all
```

Replace `include:amazonses.com` with whatever Resend currently lists in its domain setup UI.

### 4e. DMARC (start monitoring)

| Type | Name | Value |
|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:josias@covenantbuilders.org; pct=100` |

After 2–4 weeks of clean reports, tighten to `p=quarantine`.

Wait for DNS propagation (often minutes to a few hours; sometimes up to 48h). Verify with:

```bash
npm run dns:verify
```

## 5. Migrate / forward from old Gmail

During transition:

1. Forward `Joeandujar@gmail.com` / `Uberandujar@gmail.com` into the new inboxes (or check both)
2. Update the website env `LEAD_TO_EMAIL=estimating@covenantbuilders.org`
3. Update Google Business Profile, business cards, proposals, and signatures
4. Stop publishing personal Gmail addresses on the public site (Next.js rebuild already uses domain emails only)

## 6. Website env checklist

On Vercel (or host):

```bash
RESEND_API_KEY=...
LEAD_TO_EMAIL=estimating@covenantbuilders.org
LEAD_FROM_EMAIL=Covenant Builders <noreply@covenantbuilders.org>
NEXT_PUBLIC_SITE_URL=https://covenantbuilders.org
```

Verify the From domain in Resend (SPF/DKIM for the sending domain as well).

## Recommendation

Use **Google Workspace**. A `@covenantbuilders.org` address in Gmail is the sweet spot of professional and reliable for a firm chasing larger contracts.
