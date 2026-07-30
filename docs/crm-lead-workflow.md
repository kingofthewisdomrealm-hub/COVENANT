# Website lead → CRM workflow (replaces GoDaddy Clientes)

GoDaddy Clientes is a generic contact list. Covenant Builders needs
**construction leads**: project type, address, scope notes, follow-ups.

This workflow is the Phase 4 replacement. No new GoDaddy spend.

---

## Source of truth

| Data | Where it lives |
|---|---|
| New website estimates | Email to `estimating@covenantbuilders.org` via Resend (Vercel form) |
| Phone / walk-in leads | You create the CRM record manually |
| Active jobs / change orders / portal | Covenant Builders CRM / operations app |
| Marketing drafts | `docs/marketing/` (not a CRM) |

Until Workspace mailboxes exist, `LEAD_TO_EMAIL` may be a temporary inbox —  
still log every lead in the CRM the same day.

---

## When a website lead arrives

1. **Reply same business day** using [lead-reply-templates.md](./lead-reply-templates.md)  
2. **Create CRM contact + opportunity** (or project inquiry) with at least:

| Field | From the email |
|---|---|
| Name | Name |
| Email | Email (reply-to) |
| Phone | Phone |
| Project address | Project address |
| Project type | Project type |
| Notes | Message body |
| Source | `Website — covenantbuilders.org` |
| Status | `New` → `Contacted` after your reply |
| Owner | Josias Sr (or Jr if assigned) |

3. Set a **next action date** (call / site visit)  
4. Do **not** leave the lead only in the email inbox  

---

## Interim log (if CRM is down)

Use a private spreadsheet (not committed to git). Columns:

```text
date_received, name, email, phone, project_address, project_type, source, status, next_action, next_action_date, notes
```

Import into Covenant Builders CRM when available, then stop using the sheet.

---

## Weekly CRM hygiene (15 minutes)

- [ ] All `New` leads replied or closed  
- [ ] Overdue next actions cleared  
- [ ] Won jobs moved to active project  
- [ ] Lost / not-a-fit marked with reason (no ghost contacts)  
- [ ] After project close: send [review request](./review-request-template.md)  

---

## What not to do

- Do not renew GoDaddy Clientes “just in case”  
- Do not keep two CRMs forever (Clientes + Covenant) — export once, then one system  
- Do not store passwords or card data in lead notes  
- Do not invent pipeline stages you won’t use — keep: New → Contacted → Estimate → Won/Lost  

---

## Resend / form checklist (enables this workflow)

- [ ] `RESEND_API_KEY` set on Vercel  
- [ ] Test form on https://covenant-builders-ten.vercel.app/contact  
- [ ] Email arrives at `LEAD_TO_EMAIL`  
- [ ] After Workspace: `LEAD_TO_EMAIL=estimating@covenantbuilders.org`  
- [ ] Every test lead logged once in CRM (then delete test records)  

---

## Phase 4 definition of done

- [ ] Clientes exported (if any) and cancelled  
- [ ] This workflow posted where Josias Sr/Jr can see it (CRM wiki, Notes, or printed)  
- [ ] Next real lead answered with template **and** logged in Covenant Builders CRM  
