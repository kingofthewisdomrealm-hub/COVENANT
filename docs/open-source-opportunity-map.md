# Open Source Opportunity Map — COVENANT

**Scanned:** 2026-09-12 at commit 1533a055  
**Canon copy:** [ORGANIZATION](https://github.com/kingofthewisdomrealm-hub/ORGANIZATION/blob/main/project-command-center/OPEN-SOURCE-OPPORTUNITY-MAP-COVENANT.md)  
**Sister repo:** [STORM-MAP](https://github.com/kingofthewisdomrealm-hub/STORM-MAP) owns the map/weather blocks if we grow past a ZIP table.

## Decision

**COMBINE** official storm data into `/storm-check`.  
**LEAVE** the rest of this site.

This repo is the licensed-contractor funnel. Open source should feed it data and (optionally) a map. It should not replace the quiz, sketcher, game, Cal.com embed, Resend path, or `submit_website_lead` RPC.

## Map

| Capability | Current | Move | Candidate |
| --- | --- | --- | --- |
| Lead capture | Forms → CRM RPC + Resend | Leave | `lib/crm.ts` |
| CRM admin | convenantbuilderscrm | Modify *that* repo | Atomic CRM (MIT + Supabase) |
| Storm events | 2 hand-entered events + ZIP table | Combine | NWS/SPC via IEM |
| Recent weather | None | Use | Open-Meteo API |
| Address → map | Text field | Optional / STORM-MAP | MapLibre + PMTiles |
| Booking | Hosted Cal.com | Leave | `@calcom/embed-react` |
| Analytics | Vercel Analytics | Leave | — |
| Rate limit | In-memory Map | Use shared store | Upstash or Vercel KV |
| Sketcher /play / programs | Custom | Leave | — |

## Storm-check blueprint (only if we expand)

```
Existing quiz (KEEP — Florida advertising-law copy)
  → ZIP / address
  → optional geocode
  → Open-Meteo + IEM / NWS report for that county
  → existing scoreStormCheck() with a sourced-event bonus only
  → existing createCrmLead() + Resend
```

Do not invent storms. Every displayed event needs a cited official source, same rule as `content/storm-check.ts`.

Do not self-host Cal.com (AGPL + ops). Do not put `SUPABASE_SERVICE_ROLE_KEY` on this public site.
