# GoDaddy products — keep vs cancel (Phase 4)

**Principle:** Pay GoDaddy for plumbing (domain, and hosting only until Vercel cutover).  
Do labor yourself (SEO, content, marketing copy, customer data).  
**Do not pay for GoDaddy Clientes / Marketing / Airo-style SEO add-ons.**

Venture: https://dashboard.godaddy.com/venture?ventureId=f7425698-c1b1-4d70-88c9-9fecc58004ff

---

## Cancel / do not renew (replace with this repo + CRM)

| GoDaddy product | Replace with | When to cancel |
|---|---|---|
| **Clientes** (contacts / CRM) | Covenant Builders CRM + [crm-lead-workflow.md](./crm-lead-workflow.md) | **Now** — export contacts first if any exist |
| Airo Site Optimizer / SEO tools | Phase 1 titles/schema (Next.js) | Now or at next renewal |
| Marketing / social scheduling add-ons | [docs/marketing/](./marketing/README.md) drafts you paste | Now or at next renewal |
| Website Builder (if billed separately from WP) | Next.js on Vercel | After DNS cutover confirmed |
| Paid “email marketing” extras you don’t use | Lead reply + review templates | Now |

### Clientes export (before cancel)

1. Open GoDaddy → Clientes / Contacts  
2. Export CSV (all contacts) if the UI offers it  
3. Save to a private folder (not this git repo)  
4. Import into Covenant Builders CRM (or spreadsheet interim — see workflow)  
5. Cancel Clientes / turn off auto-renew  
6. Confirm next invoice no longer includes Clientes  

---

## Keep (for now)

| Product | Why | Notes |
|---|---|---|
| **Domain** `covenantbuilders.org` | Registrar | Renew before **2026-08-12** + auto-renew |
| **DNS** (domaincontrol NS) | Where you edit A/MX/TXT | Keep until you intentionally move DNS |
| **SSL / CDN** (if bundled) | Fine while WP is live | Vercel issues SSL after cutover |
| **Managed WordPress hosting** | Live site origin today | **Cancel only after** DNS → Vercel is green and `post-cutover-check.sh` passes |

---

## Keep — but not at GoDaddy (preferred)

| Need | Preferred provider |
|---|---|
| Website hosting | **Vercel** (already deployed) |
| Professional email | **Google Workspace** (`docs/email-cutover.md`) |
| Transactional form mail | **Resend** |
| Customer / project CRM | **Covenant Builders CRM** (not GoDaddy Clientes) |

---

## After cutover checklist (billing cleanup)

- [ ] Domain renewed + auto-renew on  
- [ ] Clientes cancelled; contacts exported  
- [ ] Marketing / Airo / unused SEO add-ons cancelled  
- [ ] DNS points to Vercel; site + form verified  
- [ ] WordPress hosting cancelled or parked  
- [ ] Next GoDaddy invoice reviewed line-by-line  

---

## What “Phase 4 done” means

You are **not** paying GoDaddy for a contact list.  
Website leads go to `estimating@` (Resend) → you log them in the Covenant Builders CRM using the workflow doc.  
Customer history lives in your CRM/operations tool — not Clientes.
