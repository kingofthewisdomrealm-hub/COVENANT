import type {
	NeedValue,
	ProgramMatch,
	PropertyValue,
} from '@/app/homeowner-programs/eligibility-options'

/**
 * Which homeowner programs LIKELY fit — shared by the /homeowner-programs
 * eligibility form (app/actions/programs.ts) and the Covenant Assistant.
 *
 * Deliberately honest: it says which programs likely fit, never "you
 * qualify" — final eligibility always belongs to the program. Moved here
 * unchanged from app/actions/programs.ts so a 'use server' module is not the
 * only place the logic lives.
 */
export function matchPrograms(
	need: NeedValue,
	property: PropertyValue,
	countyName: string | null
): ProgramMatch[] {
	if (need === 'storm-proof') {
		if (property === 'condo-unit' || property === 'condo-association') {
			return [
				{
					name: 'My Safe Florida Condo (state pilot)',
					pays: 'State-funded inspections and grant match for condo hardening',
					note: 'Applications run through the association — we help boards put the packet together.',
				},
			]
		}
		if (property === 'rental-commercial') {
			return [
				{
					name: 'Wind-mitigation insurance credits',
					pays: 'Premium discounts your insurer must offer for documented hardening',
					note: 'The state grant itself targets homesteaded homes, but a wind-mitigation inspection can still cut the insurance bill on this property.',
				},
			]
		}
		return [
			{
				name: 'My Safe Florida Home',
				pays: 'A free wind inspection, then up to $10,000 — $2 of state money for every $1 you spend on impact windows, doors, and roof hardening',
				note: 'Homesteaded single-family homes. We handle the paperwork with you and build to the program spec.',
			},
			{
				name: 'Wind-mitigation insurance credits',
				pays: 'Premium discounts on top of the grant once the work is documented',
				note: 'Same inspection, second payoff — most owners never file the form.',
			},
		]
	}

	if (need === 'claim') {
		return [
			{
				name: 'DFS free claim mediation',
				pays: 'A state-run mediator sits you and the insurer at one table — free to you',
				note: 'Florida law also gives you the Homeowner Claims Bill of Rights and, in many policies, an appraisal clause. We can document the damage either way.',
			},
		]
	}

	if (need === 'repair-money') {
		const countyLine = countyName
			? `${countyName} runs a SHIP program`
			: 'Your county likely runs a SHIP program'
		return [
			{
				name: 'County SHIP repair assistance',
				pays: `${countyLine} — state housing money for owner-occupied repairs`,
				note: 'Income limits apply and funding opens in waves; we check the current status with you.',
			},
			{
				name: 'USDA Section 504 repair loans & grants',
				pays: 'Low-interest repair loans, and grants for qualifying owners 62+, in eligible areas',
				note: 'Rural-designated addresses only — much of the Treasure Coast outside city cores qualifies.',
			},
		]
	}

	return [
		{
			name: 'Property-tax relief',
			pays: 'Homestead exemption, portability, and refunds for storm-damaged property',
			note: 'Filed with your county property appraiser — we point you at the right forms for your situation.',
		},
	]
}

/** Loose words → the form's need value. Used by the assistant only. */
export function needFromWords(text: string): NeedValue {
	const t = text.toLowerCase()
	if (/storm|harden|proof|wind|mitig|impact/.test(t)) return 'storm-proof'
	if (/claim|insur|dispute|adjust|denied|carrier/.test(t)) return 'claim'
	if (/repair|money|fund|loan|grant|fix|afford/.test(t)) return 'repair-money'
	return 'taxes'
}

/** Loose words → the form's property value. Used by the assistant only. */
export function propertyFromWords(text: string): PropertyValue {
	const t = text.toLowerCase()
	if (/association|board|hoa/.test(t)) return 'condo-association'
	if (/condo|townhouse|unit/.test(t)) return 'condo-unit'
	if (/rental|commercial|invest|tenant/.test(t)) return 'rental-commercial'
	return 'single-family'
}
