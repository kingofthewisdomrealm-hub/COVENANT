/**
 * PHOTO ESTIMATOR — CUSTOMER-FACING WORDS THAT CARRY LEGAL WEIGHT.
 * Change them here and they change on the page AND in both emails.
 *
 * Roofing copy is a roof advertisement under F.S. §489.147: no rebates, no
 * deductible talk, no encouraging a claim. The only insurance line allowed is
 * STORM_INSURANCE_NOTICE (shared with the project designer and storm check).
 */
export { STORM_INSURANCE_NOTICE } from '../design-your-project'

export const PRELIMINARY_NOTICE =
	'This is a preliminary, nonbinding estimate generated automatically from your photos and answers. It is not a quote or a contract. Photos cannot show exact measurements, hidden damage, or structural conditions. A Covenant Builders team member reviews every project and confirms scope and price in person before any official quote is issued.'

export const ROOFING_SUB_NOTICE = 'Roof work is performed by licensed roofing contractors under our supervision.'

export const AI_NOTICE =
	'Our software uses AI to look at your photos and suggest what the project is. The price math is done by fixed formulas from our pricebook — the AI does not set prices.'

export const intents = {
	quote: { label: 'Request my official quote', short: 'Official quote requested' },
	inspection: { label: 'Schedule an inspection', short: 'Inspection requested' },
	send: { label: 'Send my estimate', short: 'Estimate copy requested' },
} as const
export type Intent = keyof typeof intents

export const timelines = [
	{ value: 'asap', label: 'As soon as possible' },
	{ value: '1-3-months', label: 'In 1–3 months' },
	{ value: '3-plus-months', label: 'More than 3 months out' },
	{ value: 'researching', label: 'Just researching' },
] as const

export const contactMethods = [
	{ value: 'call', label: 'Phone call' },
	{ value: 'text', label: 'Text message' },
	{ value: 'email', label: 'Email' },
] as const

export const MARKETING_CONSENT =
	'Yes, Covenant Builders may send me occasional tips and offers by email or text. I can opt out anytime. (Not required.)'
