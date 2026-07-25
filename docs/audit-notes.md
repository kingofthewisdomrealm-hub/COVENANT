# Live-site audit notes (pre-rebuild)

Reviewed: Home, Services, Portfolio, About, Contact, and public WordPress endpoints (July 2026).

## P0

- `/wp-admin/` served a public WordPress database-upgrade screen
- Placeholder residue: fake testimonials (“John Doe”, etc.), `0+` counters, dummy phone `+1234-567-890`

## P1 content / conversion

- Home service cards mismatched (Commercial described kitchens; Industrial described commercial buildings)
- Services page also had swapped descriptions across New Home Builds / Custom Kitchens / Commercial
- Duplicate “We Create Unique” block on Home; duplicate Josias biography on About
- Stray closing quote on consultation CTA; “qoute” typo on Contact form
- Contact emails mixed Gmail + domain; address inconsistently “Ave” vs “st”
- Portfolio lacked project names, locations, scope, and alt text; some stock filenames
- No Florida contractor license number or years-licensed proof on the site

## P1 platform

- WordPress REST API exposed stack details (Astra, Elementor, Yoast, GoDaddy tooling, author `admin`)
- Sitemap endpoints returned HTTP 500 during review

## Rebuild responses shipped in this repo

- Next.js rebuild with truthful service copy
- Trust band: CBC1253676, licensed since 2005, active through 2028
- Role-based `@covenantbuilders.org` emails only on the public site
- Honest portfolio scaffold with captions/alts + “more coming” note
- Resend-powered estimate form → `estimating@`
- Ops docs for email + WordPress cutover
