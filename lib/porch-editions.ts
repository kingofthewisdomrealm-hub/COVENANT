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
	/** Optional drawn logo above the masthead name. 'porch' = the front-porch drawing, 'balcony' = the balcony drawing. */
	logo?: 'porch' | 'balcony'
	/** What the paper calls itself in running copy ("More from the ___"). Defaults to "the Porch". */
	nickname?: string
	/** Short town label for the private traffic report. */
	reportLabel: string
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
}

export const ALL_PORCH_EDITIONS = Object.values(PORCH_EDITIONS)
