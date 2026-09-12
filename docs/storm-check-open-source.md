# Storm-check — live official reports

Wired 2026-09-12.

The quiz copy and scoring stay in `content/storm-check.ts`.
Live events come from National Weather Service Local Storm Reports via Iowa Environmental Mesonet.

## What shipped

- `lib/storm-reports.ts` fetches MLB + MFL reports for the last ~24 months
- Keeps hail, thunderstorm wind, non-thunderstorm wind, and tornado only
- Clusters same day + county + type so 27 Brevard gusts become one line
- `/api/storm-reports?zip=34982` is the public JSON used by the ZIP verdict
- Submit path uses the same feed so the email matches what the homeowner saw
- If IEM is down, the curated Milton / May 2025 table is still used
- Cached one hour. Identifies the app in User-Agent.

## Still true

- No invented storms
- No claim-filing language (F.S. 489.147 / 626.854)
- Maps still belong in STORM-MAP if we add a pin later
