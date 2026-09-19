# Lead-source attribution

Every lead answers one question: **where did this person come from?**

## How it works (one paragraph)
On every page view, `components/attribution-tracker.tsx` reads the URL tags
(utm_*, gclid, fbclid, rep, ref, qr) and the referring site, decides a
**channel** (`lib/attribution/shared.ts → classifyChannel`) and stores a
**first touch** (kept 180 days) and a **last touch** (replaced only by a real
marketing arrival, never by a plain direct revisit) in localStorage + a
first-party cookie. All four lead forms (contact, project designer, storm
check, homeowner programs) send that record with the lead. The server action
writes the lead exactly as before, then calls `record_lead_attribution` in the
CRM, and adds a "Where this lead came from" block to the lead email. If any
attribution step fails, the lead still goes through.

## The one file to edit: `content/attribution.ts`
Channels, UTM aliases, reps, referral partners, QR codes, tracking numbers.

## Link recipes
| Use | Link |
|---|---|
| Rep / canvasser | `covenantbuilders.org/r/josias` or `covenantbuilders.org/josias` or `?rep=josias` on any page |
| Referral | `covenantbuilders.org/ref/john-smith` or `?ref=customer123` |
| QR / offline (short) | `covenantbuilders.org/go/vb-roof` — defined in `qrCodes` |
| QR / offline (long) | `covenantbuilders.org/?utm_source=doorhanger&utm_medium=offline&utm_campaign=vero_beach_roofing` |
| Canvasser's own QR | add `rep: 'josias'` to a `qrCodes` entry, or `/r/josias?utm_source=doorhanger&utm_campaign=sebastian_sept` |
| Facebook Marketplace post | `?utm_source=marketplace&utm_medium=social&utm_campaign=<name>&utm_content=<ad-variation>` |
| Craigslist / Nextdoor | `utm_source=craigslist` / `utm_source=nextdoor` |
| Email / SMS blast | `utm_source=email&utm_medium=email&utm_campaign=<name>` / `utm_source=sms&utm_medium=sms` |
| Google Business Profile website button | `?utm_source=gbp&utm_medium=organic&utm_campaign=gbp_listing` |
| Networking event | `utm_source=event&utm_medium=offline&utm_campaign=rotary_vero_oct` |

Google Ads: turn on auto-tagging (gclid) — it is detected automatically.

## Conversion events (sent to GTM dataLayer, GA4, Meta Pixel, Vercel)
`phone_click`, `email_click`, `sms_click`, `booking_click`, `booking_complete`,
`contact_form_submit`, `estimate_request`, `generate_lead`, `social_click`,
`membership_inquiry`. Any element can fire one with `data-track="event_name"`
(no membership page exists yet — put `data-track="membership_inquiry"` on its button).

## Environment variables (Vercel → Settings → Environment Variables)
| Name | Turns on |
|---|---|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager |
| `NEXT_PUBLIC_GA4_ID` | GA4 direct (skip if GA4 lives inside GTM — never both) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag verification |
| `CALL_WEBHOOK_SECRET` | `/api/calls/webhook` (also store it in the CRM: `insert into app_config values ('call_webhook_secret','<same value>')`) |

## Call tracking
Buy tracking numbers that forward to (772) 473-7115. Add each to
`trackingNumbers` in `content/attribution.ts` (with the channel it advertises)
and to the CRM `tracking_numbers` table. Visitors from that channel then see
that number (dynamic number insertion), and the provider's webhook posts each
call to `/api/calls/webhook`, which lands in `call_events`, auto-linked to the
job whose contact has the caller's number.

## CRM side
SQL: `attribution_step1.sql` (tables `lead_attribution`, `marketing_reps`,
`referral_partners`, `tracking_numbers`, `call_events`; views
`attribution_funnel`, `attribution_by_rep`, `attribution_by_campaign`,
`lead_source_facts`). Funnel definitions: appointment = `appointment_at` set or
status past Lead; contract = approved/completed/invoiced/closed (same as
`project_signed`); revenue = `contract_value` of contracts. Hand-entered canvass
leads count too: they fall back to `projects.source` and the assigned rep.
