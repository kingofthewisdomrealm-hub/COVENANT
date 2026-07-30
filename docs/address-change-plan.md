# Address Change Plan — 5400 85th Ave → 876 47th Avenue

**Repo:** https://github.com/kingofthewisdomrealm-hub/COVENANT
**Suggested path:** `docs/address-change-plan.md`
**Status:** WordPress + Next.js repo updated · Google Business Profile, schema, directories still pending
**Date drafted:** 2026-07-30

---

## The addresses

| | Value |
|---|---|
| **Old** | 5400 85th Ave. (also written "85th St"), Vero Beach, FL **32967** |
| **New** | 876 47th Avenue, Vero Beach, FL **32966** |

Note the ZIP changes too (32967 → 32966) — easy to miss in find-and-replace.

Also worth knowing: the old address was written inconsistently on the legacy site
("85th Ave." in the footer, "85th st" on the Contact page). Don't reintroduce that —
pick **one** canonical string and use it byte-for-byte everywhere:

```
876 47th Avenue, Vero Beach, FL 32966
```

---

## Current state

### ✅ Done — WordPress (covenantbuilders.org, live)
- Footer address (sitewide template, Elementor template ID 455)
- Contact page address text
- Contact page Google Map embed
- Relocation notice added: *"Please note: we are relocating from our previous
  address at 5400 85th Ave. Please use the address above."*

### ⬜ Pending — everywhere else
1. ~~Next.js / Vercel site (this repo)~~ ✅ done 2026-07-30
2. Google Business Profile
3. Structured data / JSON-LD schema
4. Map links
5. Social profiles + directories
6. Print/collateral (business cards, proposals, signage, invoices)

---

## 1 · This repo (Next.js site)

Search for both the street and the old ZIP — they appear in more than the footer:

```bash
grep -rn "5400\|85th\|32967" --include="*.{ts,tsx,js,jsx,json,md,mdx}" .
```

Known locations to check:
- Footer component (address line + the Google Maps `?q=` link)
- Contact page
- **JSON-LD / structured data** — `streetAddress`, `postalCode`, `addressLocality`
- `opengraph-image` if the address is rendered into it
- Any `siteConfig` / constants file
- `docs/` references

**Recommended:** if the address is hard-coded in multiple files, centralize it into a
single exported constant (e.g. `lib/site-config.ts`) as part of this change. Next
time it's a one-line edit instead of a grep hunt — and it guarantees the site, schema,
and map link can never disagree with each other.

Add the same relocation notice to the Contact page while both addresses are in play.

---

## 2 · Google Business Profile — the highest-stakes item

**This matters more than the website.** Most people find a local builder through
Google Maps/Search, not by typing your domain. If GBP says 5400 85th Ave, customers
physically drive there — regardless of what your site says.

Steps:
1. Google Business Profile → **Edit profile → Location** → update address
2. Re-verify if prompted (Google may require postcard/phone/video verification —
   **this can take days**, so start it early)
3. Update the service-area if it's defined by radius from the address
4. Confirm the map pin lands on the right building after the change
5. Post a GBP update announcing the move (helps customers and signals activity)

**Sequencing:** GBP verification lag is the long pole. Begin it *before* you need the
change to be live, not on move day.

---

## 3 · Schema / structured data

Both the WordPress site (Yoast) and the Next.js site emit structured data. Update:

```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "876 47th Avenue",
  "addressLocality": "Vero Beach",
  "addressRegion": "FL",
  "postalCode": "32966",
  "addressCountry": "US"
}
```

- **WordPress:** Yoast SEO → Settings → Site representation (organization address)
- **Next.js:** the JSON-LD block in the layout/page components
- Validate afterward with Google's Rich Results Test

Schema mismatch is invisible to humans but Google reads it — inconsistent NAP data
across schema, GBP, and page text suppresses local ranking.

---

## 4 · Map links

Any hard-coded Google Maps URL needs the new query:

```
https://www.google.com/maps/search/?api=1&query=876+47th+Avenue+Vero+Beach+FL+32966
```

Check: WordPress footer, Next.js footer, Contact pages, email signatures.

---

## 5 · Everything else (easy to forget)

- [ ] Facebook, Instagram, LinkedIn, YouTube, TikTok, X — profile "about"/location
- [ ] Google Search Console (if address is referenced)
- [ ] Apple Maps / Bing Places listings
- [ ] Directory listings: Yelp, BBB, Angi, Houzz, HomeAdvisor, Nextdoor
- [ ] Florida DBPR license record (CBC1253676) — business address on file
- [ ] Insurance certificate + bonding paperwork
- [ ] Invoices, proposals, contract templates
- [ ] Email signatures
- [ ] Business cards, truck signage, yard signs
- [ ] Bank / merchant account records
- [ ] The CRM (Covenant Builders CRM) if the company address is stored there

---

## Recommended sequencing

Because the move is in progress rather than complete, the goal is **never having
customers arrive at an empty building**, in either direction.

**Phase 1 — now (both addresses valid)**
- Site shows the new address + relocation notice ✅ *(WordPress done)*
- Repo updated to match ✅ *(pending)*
- **Start GBP verification** — begin early because of the lag

**Phase 2 — on move day**
- GBP address goes live
- Mail forwarding started with USPS
- Social + directory listings updated
- Schema confirmed live on both sites

**Phase 3 — 2–4 weeks after**
- Remove the relocation notice from the site
- Re-audit: search `"Covenant Builders" 5400` and clean up stragglers
- Verify the GBP map pin and that reviews carried over
- Update print collateral as stock is reordered

---

## Verification

```bash
# repo
grep -rn "5400\|85th\|32967" .

# live sites
curl -s https://covenantbuilders.org/contact/ | grep -o "876 47th\|5400 85th"
curl -s https://covenant-builders-ten.vercel.app/contact | grep -o "876 47th\|5400 85th"
```

Then confirm manually: Google Maps search for "Covenant Builders Vero Beach" returns
the new location, and the Rich Results Test shows the updated `PostalAddress`.

---

## Related open item (not address, but same area)

The WordPress contact form currently delivers to **`pastorjosias@ymail.com`**
(confirmed staying, per decision on 2026-07-30). When the Covenant Workspace
mailboxes are created, this routing needs an explicit decision — otherwise leads
sit in a Yahoo inbox that isn't part of the new email setup. See
`docs/email-cutover.md`.
