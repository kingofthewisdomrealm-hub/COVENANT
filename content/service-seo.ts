/**
 * SEO copy for the standalone /services/[slug] detail pages.
 *
 * Kept separate from the `services` array in `content/site.ts` on purpose:
 * `services` holds the verified operational facts (description, bullets,
 * process stages) that render in several places (the /services scan page,
 * these detail pages, the homepage offer catalog). This file holds only the
 * SEO-facing wrapper around that same, already-true content — page titles,
 * meta descriptions, H1s, and the secondary keyword phrases each page is
 * written to be relevant for. Nothing here states a new fact; it only
 * rephrases facts that already exist in `content/site.ts`.
 *
 * Keyed by each service's `seoSlug`. See docs/services-page-plan.md for why
 * these pages exist as their own routes instead of one long /services page.
 */

export interface ServiceSeo {
	/** <title> before the ' | Covenant Builders' template suffix. Kept short
	 * enough that title + suffix stays inside what Google typically renders. */
	metaTitle: string
	metaDescription: string
	/** On-page H1. Deliberately different wording from metaTitle — a page
	 * should not repeat its own title tag as its headline. */
	h1: string
	/** Secondary keyword phrases this page is relevant for. Not stuffed into
	 * copy — used only to sanity-check coverage and to feed JSON-LD `keywords`. */
	secondaryKeywords: string[]
	/** Questions (must exist verbatim in content/faqs.ts servicesFaqs) most
	 * relevant to this service, for the detail page's shorter FAQ block. */
	relevantFaqQuestions: string[]
}

export const serviceSeo: Record<string, ServiceSeo> = {
	'custom-home-builder': {
		metaTitle: 'Custom Home Builder in Vero Beach, FL',
		metaDescription:
			'Licensed Florida contractor CBC1253676, building since 2005. Covenant Builders plans and builds custom homes across Vero Beach and the Treasure Coast, with a written process and honest stage-by-stage timelines.',
		h1: 'A custom home builder who shows you the process before you sign',
		secondaryKeywords: [
			'home builder Vero Beach',
			'new home construction Treasure Coast',
			'design-build contractor Vero Beach',
			'licensed home builder Indian River County',
		],
		relevantFaqQuestions: [
			'Is Covenant Builders licensed in Florida?',
			'Do you pull your own permits?',
			'How long does a project take?',
			'What do I get before I sign anything?',
			'What areas do you build in?',
		],
	},
	'kitchen-remodeling-cabinetry': {
		metaTitle: 'Kitchen Remodeling & Custom Cabinetry',
		metaDescription:
			'Custom cabinetry built in our own shop, not ordered from a catalogue. Covenant Builders remodels kitchens across Vero Beach and the Treasure Coast under Florida license CBC1253676.',
		h1: 'Kitchen remodeling with cabinetry built in our own shop',
		secondaryKeywords: [
			'kitchen remodel contractor Vero Beach',
			'custom cabinets Vero Beach',
			'cabinet maker Vero Beach',
			'kitchen renovation Treasure Coast',
		],
		relevantFaqQuestions: [
			'Do you build your own cabinets?',
			'Is Covenant Builders licensed in Florida?',
			'How long does a project take?',
			'Do you pull your own permits?',
			'What do I get before I sign anything?',
		],
	},
	'commercial-construction': {
		metaTitle: 'Commercial Contractor in Vero Beach, FL',
		metaDescription:
			'Tenant improvements, build-outs and new commercial construction from a Florida Certified Building Contractor licensed since 2005. Code and accessibility exposure priced before you sign, not after.',
		h1: 'A commercial contractor who prices code and accessibility before you sign',
		secondaryKeywords: [
			'commercial contractor Vero Beach',
			'tenant improvement contractor',
			'commercial build out contractor',
			'office renovation contractor Treasure Coast',
		],
		relevantFaqQuestions: [
			'Is Covenant Builders licensed in Florida?',
			'Do you pull your own permits?',
			'What areas do you build in?',
			'What do I get before I sign anything?',
		],
	},
	'home-remodeling': {
		metaTitle: 'Home Remodeling Contractor in Vero Beach, FL',
		metaDescription:
			'Whole-home renovations, additions and room remodels from licensed Florida contractor CBC1253676. We open the walls before we price the job, so surprises get found while you can still decide.',
		h1: 'A remodeling contractor who opens the walls before pricing the job',
		secondaryKeywords: [
			'home renovation Vero Beach',
			'remodeling contractor near me',
			'whole house remodel Vero Beach',
			'renovation contractor Treasure Coast',
		],
		relevantFaqQuestions: [
			'Is Covenant Builders licensed in Florida?',
			'Do you pull your own permits?',
			'How long does a project take?',
			'What do I get before I sign anything?',
		],
	},
	'storm-restoration': {
		metaTitle: 'Storm Damage Restoration in Vero Beach, FL',
		metaDescription:
			'Hurricane and storm damage repair from a licensed Florida builder since 2005. We document the damage and rebuild to current code — we do not adjust claims or discount your deductible.',
		h1: 'Storm damage restoration, documented and rebuilt to current code',
		secondaryKeywords: [
			'storm damage contractor Vero Beach',
			'hurricane repair Treasure Coast',
			'wind damage repair contractor',
			'storm restoration Vero Beach',
		],
		relevantFaqQuestions: [
			'Do you handle storm damage and insurance restoration?',
			'Is Covenant Builders licensed in Florida?',
			'What do I get before I sign anything?',
			'What areas do you build in?',
		],
	},
}
