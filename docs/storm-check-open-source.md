# Storm-check — open source feed (do not rebuild the quiz)

The quiz in `content/storm-check.ts` and `app/actions/storm-check.ts` is the product.
The part that will rot is the two-event table.

## Use

- [Open-Meteo](https://open-meteo.com) — recent conditions. Public API call. Do not self-host the AGPL server unless we have a reason.
- [Iowa Environmental Mesonet](https://mesonet.agron.iastate.edu/) — NWS / SPC local storm reports.
- ZIP → county stays ours until a geocoder is proven.

## Optional map (prefer STORM-MAP, not a third app)

- [MapLibre GL JS](https://maplibre.org) — renderer, BSD.
- [PMTiles](https://protomaps.com) — tiles on a CDN, no Google bill.
- Census geocoder or a policy-respecting Nominatim host — address to pin.

If the map becomes its own page, build it in [STORM-MAP](https://github.com/kingofthewisdomrealm-hub/STORM-MAP) and embed it here. Do not start another map repo.

## Compliance

F.S. §489.147 and §626.854 still apply. A live weather feed does not change the rule: no claim-filing language, no deductible talk, no invented event.
