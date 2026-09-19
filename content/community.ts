/**
 * Content for the /community/[slug] pages.
 *
 * These are deliberately NOT sales pages. Per Josias (19 Sep 2026): community
 * pages exist to bring value to property owners and local businesses in each
 * service city — real local resources first, Covenant's own presence in that
 * city mentioned once, lightly, as context rather than a pitch. See the
 * research/plan doc: https://claude.ai/artifact/2U5gzHpW4AnbDCQ1xZf2oK
 *
 * ⚠️ ONLY ADD A CITY HERE ONCE IT HAS GENUINELY DIFFERENT, VERIFIED LOCAL
 * CONTENT — not the same paragraph with the city name swapped in. That is
 * the doorway-page trap the original SEO brief warned against, and it
 * applies just as hard to a "community" page as to a sales page. Vero Beach
 * is the only entry so far because it is the only one with real, checked
 * facts behind every line (see /docs/community-page-plan.md).
 *
 * Every program below has a source and a status. These open, close, and
 * refill on their own schedules — re-verify status before trusting anything
 * written here as still current, and update `verifiedAsOf` when you do.
 */

export interface CommunityProgram {
	name: string
	description: string
	status: string
	link: string
}

export interface CommunityCity {
	slug: string
	cityName: string
	county: string
	metaTitle: string
	metaDescription: string
	h1: string
	heroSupport: string
	intro: string
	verifiedAsOf: string
	programs: CommunityProgram[]
	permitOffice: {
		name: string
		note: string
		link: string
	}
	chamber: {
		name: string
		note: string
		link: string
	}
	ourWork: string
}

export const communityCities: CommunityCity[] = [
	{
		slug: 'vero-beach',
		cityName: 'Vero Beach',
		county: 'Indian River County',
		metaTitle: 'Vero Beach Community Resources | Covenant Builders',
		metaDescription:
			'Real, sourced help for Vero Beach property owners and small businesses — repair money, permits, storm prep, and the local chamber. Not a sales page.',
		h1: 'Vero Beach resources, not a sales pitch',
		heroSupport:
			"We're based here. This page is a place to point Vero Beach property owners and small businesses at real local resources — repair money, permits, storm prep — whether or not you ever call us.",
		intro:
			"Covenant Builders is headquartered at 876 47th Avenue in Vero Beach, so this is the city we know best. Below is what's actually available right now to property owners and small businesses here, sourced and linked, not a rewritten ad.",
		verifiedAsOf: '2026-09-19',
		programs: [
			{
				name: 'Indian River County SHIP (State Housing Initiatives Partnership)',
				description:
					"The county's state-funded homeowner assistance program, covering repairs for qualifying households.",
				status: 'Application windows open periodically — check current status before applying.',
				link: 'https://indianriver.gov/services/community_services/state_housing_initiative_partnership_program/index.php',
			},
			{
				name: 'Indian River Habitat for Humanity — Neighborhood Revitalization',
				description:
					'Affordable critical and minor home repair for qualifying homeowners — roofs, A/C, hot water heaters, wheelchair ramps, exterior painting. Income-based (HUD guidelines).',
				status: 'Contact Karyn Bryant, Neighborhood Revitalization Director, 772-562-9860 ext. 211.',
				link: 'https://www.irchabitat.org/home-repair/',
			},
			{
				name: 'Statewide money programs',
				description:
					'My Safe Florida Home (up to $10,000, 2:1 match, free wind-mitigation inspection), My Safe Florida Condo, weatherization assistance, and more — all Florida programs, not Vero Beach–specific.',
				status: 'See our full, sourced Money Map for current details.',
				link: '/homeowner-programs',
			},
		],
		permitOffice: {
			name: 'City of Vero Beach Building Department',
			note: "If your address is inside city limits, permits go through the city, not Indian River County — they're separate offices with separate forms. Confirm which one applies to you before you start.",
			link: 'https://www.covb.org/152/Building-Department',
		},
		chamber: {
			name: 'Indian River County Chamber of Commerce',
			note: 'The hub for local business connections, advocacy, and events in Vero Beach and the surrounding county.',
			link: 'https://www.indianriverchamber.com/',
		},
		ourWork:
			"We're from here. Josias came to the Treasure Coast in 2004 and built Covenant Builders in Vero Beach — this is home, not a market we expanded into. One example: a corner-lot residential build in our portfolio went from concrete block shell through roof framing right here in Vero Beach.",
	},
]

export function findCommunityCity(slug: string) {
	return communityCities.find((city) => city.slug === slug)
}
