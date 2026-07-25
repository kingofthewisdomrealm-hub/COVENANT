# Professional email cutover (`@covenantbuilders.org`)

Your domain already exists. Attach email hosting, create mailboxes, then point DNS.

## 1. Find where the domain/DNS lives

Check who registered `covenantbuilders.org` (historically the live site used GoDaddy tooling). Confirm:

- Domain registrar
- DNS host (may differ from the web host)
- Current website host (WordPress)

## 2. Choose an email provider

**Recommended for contracting firms:** Google Workspace (~$6–7/user/month)

- Gmail interface
- Strong deliverability
- Reliable for large-bid communication

**Budget route:** email bundled with your web host (often free or ~$1–2/month). Fine for basics; weaker long-term for chasing larger contracts.

## 3. Create mailboxes

| Address | Purpose |
|---|---|
| `info@covenantbuilders.org` | General inbox |
| `estimating@covenantbuilders.org` | Project inquiries / contact form destination |
| `josias@covenantbuilders.org` | Owner |
| Optional second personal mailbox | Josias Jr |

`bids@` can alias to `estimating@` if preferred.

## 4. Set DNS records

Your provider will give you records to paste into DNS:

- **MX** — where mail is delivered
- **SPF** — which servers may send as your domain
- **DKIM** — cryptographic signing
- **DMARC** (recommended) — policy for spoofing protection

Wait for DNS propagation (often minutes to a few hours; sometimes up to 48h).

## 5. Migrate / forward from old Gmail

During transition:

1. Forward `Joeandujar@gmail.com` / `Uberandujar@gmail.com` into the new inboxes (or check both)
2. Update the website env `LEAD_TO_EMAIL=estimating@covenantbuilders.org`
3. Update Google Business Profile, business cards, proposals, and signatures
4. Stop publishing personal Gmail addresses on the public site

## 6. Website env checklist

On Vercel (or host):

```bash
RESEND_API_KEY=...
LEAD_TO_EMAIL=estimating@covenantbuilders.org
LEAD_FROM_EMAIL=Covenant Builders <noreply@covenantbuilders.org>
```

Verify the From domain in Resend (SPF/DKIM for the sending domain as well).

## Recommendation

Use **Google Workspace**. A `@covenantbuilders.org` address in Gmail is the sweet spot of professional and reliable for a firm chasing larger contracts.
