import {
	PORCH_NAME,
	PORCH_SPONSOR,
	PORCH_TAGLINE,
	currentPorchIssue,
	type PorchIssue,
} from '@/content/porch'
import {
	SEBASTIAN_PORCH_NAME,
	SEBASTIAN_PORCH_SPONSOR,
	SEBASTIAN_PORCH_TAGLINE,
	currentSebastianPorchIssue,
} from '@/content/sebastian-porch'
import {
	PSL_PORCH_NAME,
	PSL_PORCH_SPONSOR,
	PSL_PORCH_TAGLINE,
	currentPslPorchIssue,
} from '@/content/psl-porch'
import {
	ORLANDO_BALCONY_NAME,
	ORLANDO_BALCONY_SPONSOR,
	ORLANDO_BALCONY_TAGLINE,
	currentOrlandoBalconyIssue,
} from '@/content/orlando-balcony'
import {
	MIAMI_BALCONY_NAME,
	MIAMI_BALCONY_SPONSOR,
	MIAMI_BALCONY_TAGLINE,
	currentMiamiBalconyIssue,
} from '@/content/miami-balcony'
import {
	BREEZEWAY_NAME,
	BREEZEWAY_SPONSOR,
	BREEZEWAY_TAGLINE,
	currentBreezewayIssue,
} from '@/content/breezeway'
import type { PorchEditionKey } from '@/lib/porch-articles'

/**
 * Every Porch paper Covenant publishes. Each edition is its own paper for its
 * own town: its own issue, its own article folder, its own URL. The pages in
 * components/porch/ render any edition; the app/ routes are thin wrappers.
 */
export interface PorchEdition {
	key: PorchEditionKey
	name: string
	tagline: string
	sponsor: string
	/** URL path of the front page, e.g. /porch */
	basePath: string
	/** The town, for copy like "Neighborhood news for ___" */
	town: string
	issue: PorchIssue
	/** <meta description> for the front page */
	frontDescription: string
	archiveTitle: string
	archiveDescription: string
	/** Optional drawn logo above the masthead name. 'porch' = the front-porch drawing, 'balcony' = the Orlando balcony drawing, 'beach-balcony' = the Miami Beach balcony drawing, 'breezeway' = the condo-building drawing. */
	logo?: 'porch' | 'balcony' | 'beach-balcony' | 'breezeway'
	/** What the paper calls itself in running copy ("More from the ___"). Defaults to "the Porch". */
	nickname?: string
	/** Short town label for the private traffic report. */
	reportLabel: string
	/** Which single sponsor box the paper carries. Default: the Roof Report Card. */
	sponsorBox?: 'report-card' | 'board-guide'
	/** The calendar sidebar. Defaults: "Around town" / "What's on". */
	eventsKicker?: string
	eventsTitle?: string
	eventsNote?: string
	/** The reader-tips box at the bottom of the front page. */
	newsBox?: { title: string; body: string }
}

export const PORCH_EDITIONS: Record<PorchEditionKey, PorchEdition> = {
	vero: {
		key: 'vero',
		name: PORCH_NAME,
		tagline: PORCH_TAGLINE,
		sponsor: PORCH_SPONSOR,
		basePath: '/porch',
		town: 'Vero Beach',
		reportLabel: 'Vero',
		issue: currentPorchIssue,
		frontDescription: `${PORCH_TAGLINE}. Why your water and sewer bill went up, the septic deadline, Amendment 3 forums, parking fines, storm-season checks and what is on around town.`,
		archiveTitle: `All articles | ${PORCH_NAME} — Vero Beach homeowner news`,
		archiveDescription:
			'Every Vero Porch article: Vero Beach and Indian River County news for homeowners — utility bills, property taxes, septic and sewer, permits, storms, condos and local history.',
	},
	sebastian: {
		key: 'sebastian',
		name: SEBASTIAN_PORCH_NAME,
		tagline: SEBASTIAN_PORCH_TAGLINE,
		sponsor: SEBASTIAN_PORCH_SPONSOR,
		basePath: '/sebastian-porch',
		town: 'Sebastian',
		reportLabel: 'Sebastian',
		issue: currentSebastianPorchIssue,
		frontDescription: `${SEBASTIAN_PORCH_TAGLINE}. The 2030 septic deadline, the city council election, the new city tax rate, Amendment 3, storm-season checks and what is on around town.`,
		archiveTitle: `All articles | ${SEBASTIAN_PORCH_NAME} — Sebastian homeowner news`,
		archiveDescription:
			'Every Sebastian Porch article: City of Sebastian news for homeowners — septic and sewer, property taxes, stormwater, permits, storms and local history.',
	},
	psl: {
		key: 'psl',
		name: PSL_PORCH_NAME,
		tagline: PSL_PORCH_TAGLINE,
		sponsor: PSL_PORCH_SPONSOR,
		basePath: '/psl-porch',
		town: 'Port St. Lucie & Fort Pierce',
		reportLabel: 'PSL',
		issue: currentPslPorchIssue,
		frontDescription: `${PSL_PORCH_TAGLINE}. Port St. Lucie's new tax rate, the trash fee and Waste Pro credit, early voting, the half-cent sales tax, storm-season checks and what is on around town.`,
		archiveTitle: `All articles | ${PSL_PORCH_NAME} — Port St. Lucie & Fort Pierce homeowner news`,
		archiveDescription:
			'Every PSL Porch article: Port St. Lucie, Fort Pierce and St. Lucie County news for homeowners — tax bills, utilities, trash, permits, storms and local history.',
		logo: 'porch',
	},
	orlando: {
		key: 'orlando',
		name: ORLANDO_BALCONY_NAME,
		tagline: ORLANDO_BALCONY_TAGLINE,
		sponsor: ORLANDO_BALCONY_SPONSOR,
		basePath: '/orlando-balcony',
		town: 'Orlando',
		reportLabel: 'Orlando',
		issue: currentOrlandoBalconyIssue,
		frontDescription: `${ORLANDO_BALCONY_TAGLINE}. Orlando's trash and sewer increases, the city tax rate, OUC's new demand charge, early voting, Amendment 3, storm-season checks and what is on around town.`,
		archiveTitle: `All articles | ${ORLANDO_BALCONY_NAME} — Orlando homeowner news`,
		archiveDescription:
			'Every Orlando Balcony article: City of Orlando and Orange County news for homeowners — tax bills, OUC and city utility fees, trash, permits, storms and local history.',
		logo: 'balcony',
		nickname: 'the Balcony',
	},
	miami: {
		key: 'miami',
		name: MIAMI_BALCONY_NAME,
		tagline: MIAMI_BALCONY_TAGLINE,
		sponsor: MIAMI_BALCONY_SPONSOR,
		basePath: '/balcony',
		town: 'Miami Beach',
		reportLabel: 'Miami Beach',
		issue: currentMiamiBalconyIssue,
		frontDescription: `${MIAMI_BALCONY_TAGLINE}. King tide flooding and free garage parking, Amendment 3, the Michigan Avenue lease vote, early voting, condo milestone inspections and storm-season balcony checks.`,
		archiveTitle: `All articles | ${MIAMI_BALCONY_NAME} — Miami Beach homeowner news`,
		archiveDescription:
			'Every Miami Balcony article: City of Miami Beach news for homeowners and condo owners — king tides and flooding, property taxes, condo inspections, permits, storms and local history.',
		logo: 'beach-balcony',
		nickname: 'the Balcony',
	},
	breezeway: {
		key: 'breezeway',
		name: BREEZEWAY_NAME,
		tagline: BREEZEWAY_TAGLINE,
		sponsor: BREEZEWAY_SPONSOR,
		basePath: '/breezeway',
		town: 'Florida condo owners & boards',
		reportLabel: 'Condos (FL)',
		issue: currentBreezewayIssue,
		frontDescription: `${BREEZEWAY_TAGLINE}. SIRS and reserves, milestone inspections, special assessments, condo loans, insurance, board rules and the deadlines your association cannot miss.`,
		archiveTitle: `All articles | ${BREEZEWAY_NAME} — Florida condo association news`,
		archiveDescription:
			'Every Breezeway article: Florida condo association news for owners and board members — SIRS, reserves, milestone inspections, assessments, loans, insurance and board rules.',
		logo: 'breezeway',
		nickname: 'the Breezeway',
		sponsorBox: 'board-guide',
		eventsKicker: 'Board calendar',
		eventsTitle: 'Dates that matter',
		eventsNote: 'Dates come from Florida law and the agencies that set them. Your association’s documents can add earlier deadlines.',
		newsBox: {
			title: 'Got a question for the board page?',
			body: 'A notice you don’t understand, a vote coming up, a rule you want explained. Text it to (772) 766-1917. We never print your name or your building without asking.',
		},
	},
}

export const ALL_PORCH_EDITIONS = Object.values(PORCH_EDITIONS)
