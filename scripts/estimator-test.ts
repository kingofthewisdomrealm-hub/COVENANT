/**
 * Run: npx tsx scripts/estimator-test.ts
 * Checks the pricing engine against the four sample jobs and the guard rails.
 * Prints every number so a human can eyeball it. Exits 1 on any failed check.
 */
import { estimate } from '../lib/estimator/engine'

let failed = 0
const check = (name: string, ok: boolean, detail = '') => {
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`)
	if (!ok) failed++
}
const usd = (n: number) => '$' + n.toLocaleString('en-US')

const samples = [
	{ name: 'Roofing: replace, 1,850 sq ft 1-story + 2-car garage', categoryId: 'roofing', scopeId: 'roof-replace', answers: { homeSqft: 1850, stories: '1', pitch: 'standard', garageBays: '2' } },
	{ name: 'Roofing: repair 2 spots, 2-story', categoryId: 'roofing', scopeId: 'roof-repair', answers: { repairAreas: 2, stories: '2', pitch: 'standard' } },
	{ name: 'Drywall: 2 small + 1 medium, textured, paint', categoryId: 'drywall', scopeId: 'drywall-patch', answers: { smallHoles: 2, mediumHoles: 1, largeHoles: 0, texture: 'textured', paintTouchup: 'yes' } },
	{ name: 'Drywall: new 12×14 room, 8 ft, with ceiling', categoryId: 'drywall', scopeId: 'drywall-install', answers: { length: 12, width: 14, height: 8, includeCeiling: 'yes', removeOld: 'yes' } },
	{ name: 'Painting: 3 interior rooms 12×12, 8 ft, ceilings + trim', categoryId: 'painting', scopeId: 'paint-interior', answers: { rooms: 3, length: 12, width: 12, height: 8, includeCeilings: 'yes', includeTrim: 'yes' } },
	{ name: 'Painting: exterior 2,000 sq ft 1-story stucco', categoryId: 'painting', scopeId: 'paint-exterior', answers: { homeSqft: 2000, stories: '1', surface: 'stucco' } },
	{ name: 'Flooring: 600 sq ft vinyl over carpet', categoryId: 'flooring', scopeId: 'flooring', answers: { floorType: 'vinyl', area: 600, remove: 'carpet' } },
	{ name: 'Flooring: 400 sq ft tile over tile', categoryId: 'flooring', scopeId: 'flooring', answers: { floorType: 'tile', area: 400, remove: 'tile' } },
]

for (const s of samples) {
	const r = estimate({ ...s, zip: '32960', aiConfidence: 'high', previewPrices: true })
	console.log(`\n■ ${s.name}`)
	if (r.kind !== 'priced') {
		check(s.name + ' priced', false, r.message)
		continue
	}
	r.quantities.forEach((q) => console.log(`   ${q.label}: ${q.value.toLocaleString()} ${q.unit}`))
	for (const t of r.tiers) {
		console.log(`   ${t.tier.padEnd(8)} mat ${usd(t.materials.low)}–${usd(t.materials.high)} | labor ${usd(t.labor.low)}–${usd(t.labor.high)} | other ${usd(t.other.low)}–${usd(t.other.high)} | O&P ${usd(t.overheadProfit.low)}–${usd(t.overheadProfit.high)} | TOTAL ${usd(t.total.low)}–${usd(t.total.high)}${t.minimumApplied ? ' (min)' : ''}`)
	}
	const [b, st, p] = r.tiers
	check('tiers ordered budget ≤ standard ≤ premium', b.total.low <= st.total.low && st.total.low <= p.total.low)
	check('every low ≤ high', r.tiers.every((t) => t.total.low <= t.total.high))
	check('draft flag set', r.draftPrices === true)
	const again = estimate({ ...s, zip: '32960', aiConfidence: 'high', previewPrices: true })
	check('deterministic (same input → same output)', JSON.stringify(again) === JSON.stringify(r))
}

console.log('\n■ Guard rails')
const base = { categoryId: 'flooring', scopeId: 'flooring', answers: { floorType: 'vinyl', area: 600, remove: 'none' }, aiConfidence: 'high' as const }
check('draft prices hidden on the public site', estimate({ ...base, zip: '32960' }).kind === 'inspection')
check('out-of-area ZIP → no price', (() => { const r = estimate({ ...base, zip: '90210', previewPrices: true }); return r.kind === 'inspection' && r.reason === 'out-of-area' })())
check('missing measurement → asks, never guesses', (() => { const r = estimate({ ...base, answers: { floorType: 'vinyl', remove: 'none' }, zip: '32960', previewPrices: true }); return r.kind === 'inspection' && r.reason === 'missing-info' && !!r.missing?.length })())
check('unpriced category (fencing) → inspection', estimate({ categoryId: 'fencing', scopeId: 'fence', answers: {}, zip: '32960', aiConfidence: 'high', previewPrices: true }).kind === 'inspection')
check('zero drywall patches → asks', estimate({ categoryId: 'drywall', scopeId: 'drywall-patch', answers: { smallHoles: 0, mediumHoles: 0, largeHoles: 0, texture: 'smooth', paintTouchup: 'no' }, zip: '32960', aiConfidence: 'high', previewPrices: true }).kind === 'inspection')
const hi = estimate({ ...base, zip: '32960', previewPrices: true })
const lo = estimate({ ...base, zip: '32960', previewPrices: true, aiConfidence: 'low' })
check('low AI confidence → wider "budget indication" range', hi.kind === 'priced' && lo.kind === 'priced' && lo.budgetIndication && lo.tiers[1].total.high > hi.tiers[1].total.high && lo.tiers[1].total.low < hi.tiers[1].total.low)
const tiny = estimate({ categoryId: 'drywall', scopeId: 'drywall-patch', answers: { smallHoles: 1, mediumHoles: 0, largeHoles: 0, texture: 'smooth', paintTouchup: 'no' }, zip: '34950', aiConfidence: 'high', previewPrices: true })
check('minimum job charge applied to a tiny job', tiny.kind === 'priced' && tiny.tiers[0].total.low >= 300 && tiny.tiers[0].minimumApplied)

console.log(failed ? `\n${failed} FAILED` : '\nALL CHECKS PASSED')
process.exit(failed ? 1 : 0)
