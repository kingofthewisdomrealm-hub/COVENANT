/**
 * Waiting Room Editions — a short, hand-picked issue of each Porch paper for
 * the waiting rooms of local medical and dental offices. Each specialty gets
 * the stories that fit the people sitting in its chairs. Pages render at
 * /<paper>/waiting-room/<specialty>; the printed one-pager carries a QR code
 * back to that page (utm_medium=print).
 *
 * Only published articles show (future-dated slugs are skipped until their
 * date), so a list can name an upcoming article ahead of time.
 */
import type { PorchEditionKey } from '@/lib/porch-articles'

export type WaitingRoomKey = 'dental' | 'dermatology' | 'family-care' | 'eye-chiro-pt'

export const WAITING_ROOM_KEYS: WaitingRoomKey[] = ['dental', 'dermatology', 'family-care', 'eye-chiro-pt']

export const WAITING_ROOM_SPECIALTIES: Record<WaitingRoomKey, { label: string; offices: string }> = {
	dental: { label: 'Dental & Orthodontic', offices: 'dental and orthodontic offices' },
	dermatology: { label: 'Dermatology', offices: 'dermatology offices' },
	'family-care': { label: 'Family & Primary Care', offices: 'family, primary care and pediatric offices' },
	'eye-chiro-pt': { label: 'Eye Care, Chiropractic & Therapy', offices: 'eye care, chiropractic and physical therapy offices' },
}

export type WaitingRoomPaper = Extract<PorchEditionKey, 'vero' | 'sebastian' | 'psl'>

export interface WaitingRoomEdition {
	/** One or two sentences under the masthead, written to the person in the chair. */
	intro: string
	/** Article slugs in reading order. */
	slugs: string[]
}

export const WAITING_ROOM_EDITIONS: Record<WaitingRoomPaper, Record<WaitingRoomKey, WaitingRoomEdition>> = {
	vero: {
		dental: {
			intro:
				'A few minutes in the chair is enough to save your family money this season. Four quick reads on your tax bill, your homestead, your storm plan and this month’s trash schedule.',
			slugs: [
				'indian-river-county-property-tax-bill-november-discount',
				'vero-beach-homestead-exemption-how-to-file',
				'vero-beach-hurricane-evacuation-zone-lookup',
				'vero-beach-trash-yard-waste-bulk-pickup-holiday-schedule',
			],
		},
		dermatology: {
			intro:
				'For everyone who spends time outside in the Vero sun: your new watering day, the fall lawn rules, a six-week storm check for your house, and how a wind inspection can trim your insurance bill.',
			slugs: [
				'vero-beach-watering-days-change-november-1',
				'vero-beach-fertilizer-rules-fall-lawn',
				'vero-beach-hurricane-season-ends-nov-30-house-check',
				'vero-beach-wind-mitigation-inspection-explained',
			],
		},
		'family-care': {
			intro:
				'Four stories every Vero household is asking about: where a third hospital could go, why the water bill went up, how to keep 4% on your tax bill, and how to check your flood zone.',
			slugs: [
				'proposed-third-hospital-sr-60-66th-avenue',
				'vero-beach-water-sewer-rate-increase-2026',
				'indian-river-county-property-tax-bill-november-discount',
				'vero-beach-flood-zone-lookup-city-or-county',
			],
		},
		'eye-chiro-pt': {
			intro:
				'Protect your home and your wallet: how to check a contractor’s license in five minutes, find the real age of your roof, file for homestead, and what a wind inspection can save you.',
			slugs: [
				'check-florida-contractor-license-vero-beach',
				'how-old-is-my-roof-vero-beach-permit-records',
				'vero-beach-homestead-exemption-how-to-file',
				'vero-beach-wind-mitigation-inspection-explained',
			],
		},
	},
	sebastian: {
		dental: {
			intro:
				'Quick reads for Sebastian families: what the new city tax rate means for your bill, your evacuation zone and shelters, who to call for what, and whether your street is getting repaved.',
			slugs: [
				'sebastian-city-tax-rate-2026-27-rollback',
				'sebastian-hurricane-evacuation-zone-shelters',
				'who-to-call-sebastian-city-vs-county',
				'sebastian-street-paving-list-2026-27',
			],
		},
		dermatology: {
			intro:
				'For Sebastian neighbors who love being outdoors: the man who saved Pelican Island, the rules for cutting a yard tree, a storm-season house check, and how to test a private well.',
			slugs: [
				'sebastian-history-paul-kroegel-pelican-island',
				'sebastian-tree-removal-permit-rules',
				'sebastian-windy-weekend-end-of-hurricane-season-house-check',
				'sebastian-well-water-testing-private-wells',
			],
		},
		'family-care': {
			intro:
				'Four things every Sebastian household should know: the septic hookup grant, the stormwater fee and your swale, your flood zone, and the Inlet District line on your tax bill.',
			slugs: [
				'sebastian-septic-sewer-hookup-grant-north-sebastian',
				'sebastian-stormwater-fee-swales-culverts',
				'sebastian-flood-zone-lookup-fema-map',
				'sebastian-inlet-district-tax-bill-line',
			],
		},
		'eye-chiro-pt': {
			intro:
				'Good reading for a few quiet minutes: how to find your roof’s real age, which home projects need a permit, how code enforcement works, and the 1715 Treasure Fleet that wrecked just south of the inlet.',
			slugs: [
				'how-old-is-my-roof-sebastian-permit-records',
				'sebastian-building-permit-common-home-projects',
				'sebastian-code-enforcement-common-violations',
				'sebastian-history-1715-treasure-fleet-mclarty-museum',
			],
		},
	},
	psl: {
		dental: {
			intro:
				'Quick reads for Port St. Lucie and Fort Pierce families: your city tax rate and trash credit, the Fort Pierce bill explained, which home projects need a permit, and septic and well water in older homes.',
			slugs: [
				'port-st-lucie-2026-27-tax-rate-trash-fee-credit',
				'fort-pierce-2026-27-tax-rate-budget-fpua-bill',
				'do-i-need-a-permit-port-st-lucie-fences-sheds-pools',
				'port-st-lucie-septic-sewer-well-water-older-homes',
			],
		},
		dermatology: {
			intro:
				'For St. Lucie County homeowners, snowbirds and retirees: the tax breaks for seniors, widows and veterans, storm season in a manufactured home, condo inspection deadlines, and the newer HOA laws.',
			slugs: [
				'st-lucie-county-senior-widow-veteran-property-tax-exemptions-march-1',
				'port-st-lucie-manufactured-home-hurricane-season-guide',
				'hutchinson-island-condo-milestone-inspections-sirs-deadlines',
				'port-st-lucie-hoa-owners-board-members-florida-hoa-laws',
			],
		},
		'family-care': {
			intro:
				'Four things every household here is asking about: Port St. Lucie’s tax rate and trash credit, your Fort Pierce bill, septic and well water, and the CDD line on Tradition tax bills.',
			slugs: [
				'port-st-lucie-2026-27-tax-rate-trash-fee-credit',
				'fort-pierce-2026-27-tax-rate-budget-fpua-bill',
				'port-st-lucie-septic-sewer-well-water-older-homes',
				'tradition-port-st-lucie-cdd-tax-bill-explained',
			],
		},
		'eye-chiro-pt': {
			intro:
				'Protect your home and your wallet: property tax breaks for seniors, widows and veterans, what Florida’s HOA laws now require, which projects need a permit, and storm season in a manufactured home.',
			slugs: [
				'st-lucie-county-senior-widow-veteran-property-tax-exemptions-march-1',
				'port-st-lucie-hoa-owners-board-members-florida-hoa-laws',
				'do-i-need-a-permit-port-st-lucie-fences-sheds-pools',
				'port-st-lucie-manufactured-home-hurricane-season-guide',
			],
		},
	},
}
