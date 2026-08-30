'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { z } from 'zod'

import { siteConfig } from '@/content/site'
import { COUNTY_NAMES, countyForZip } from '@/content/storm-check'
import { createCrmLead } from '@/lib/crm'
import { checkRateLimit } from '@/lib/rate-limit'
import { actionClient } from '@/lib/safe-action'

import {
	NEED_OPTIONS,
	PROPERTY_OPTIONS,
	type NeedValue,
	type ProgramMatch,
	type PropertyValue,
} from '@/app/homeowner-programs/eligibility-options'

/**
 * The /homeowner-programs eligibility check — a SIBLING of submitLead,
 * submitProjectDesign, and submitStormCheck. Same rate limiter, same
 * honeypot, same CRM-then-email ordering, same sequential Resend sends.
 * See app/actions/design.ts for why the pipes are kept separate.
 *
 * The matching below is deliberately honest: it says which programs LIKELY
 * fit, never "you qualify" — final eligibility always belongs to the program.
 */

const needValues = NEED_OPTIONS.map((item) => item.value) as [
	NeedValue,
	...NeedValue[],
]
const propertyValues = PROPERTY_OPTIONS.map((item) => item.value) as [
	PropertyValue,
	...PropertyValue[],
]

const programsSchema = z.object({
	need: z.enum(needValues, {
		errorMap: () => ({ message: 'Please choose what your property needs' }),
	}),
	property: z.enum(propertyValues, {
		errorMap: () => ({ message: 'Please choose your property type' }),
	}),
	zip: z.string().trim().regex(/^\d{5}$/, 'Please enter a 5-digit ZIP code'),
	name: z.string().trim().min(2, 'Please enter your name').max(100),
	email: z.string().trim().email('Please enter a valid email').max(200),
	phone: z.string().trim().min(7, 'Please enter a phone number').max(40),
	projectAddress: z
		.string()
		.trim()
		.min(5, 'Please enter the property address')
		.max(300),
	notes: z.string().trim().max(2000).optional(),
	website: z.string().max(0).optional(),
})

function matchPrograms(
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

export const submitProgramCheck = actionClient
	.schema(programsSchema)
	.action(async ({ parsedInput }) => {
		if (parsedInput.website) {
			return { ok: true as const, matches: [] as ProgramMatch[] }
		}

		const headerStore = headers()
		const forwarded = headerStore.get('x-forwarded-for')
		const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
		const rate = checkRateLimit({
			key: `programs:${ip}`,
			limit: 5,
			windowMs: 60_000,
		})

		if (!rate.allowed) {
			throw new Error('Too many requests. Please wait a minute and try again.')
		}

		const apiKey = process.env.RESEND_API_KEY
		const toEmails = (process.env.LEAD_TO_EMAIL || siteConfig.emails.estimating)
			.split(',')
			.map((address) => address.trim())
			.filter(Boolean)
		const fromEmail =
			process.env.LEAD_FROM_EMAIL || 'Covenant Builders <onboarding@resend.dev>'

		if (!apiKey || toEmails.length === 0) {
			console.error('Program check: Resend not configured')
			throw new Error(
				'The eligibility check is temporarily unavailable. Please call or email us directly.'
			)
		}

		const county = countyForZip(parsedInput.zip)
		const countyName = county ? COUNTY_NAMES[county] : null
		const matches = matchPrograms(
			parsedInput.need,
			parsedInput.property,
			countyName
		)

		const needLabel =
			NEED_OPTIONS.find((item) => item.value === parsedInput.need)?.label ||
			parsedInput.need
		const propertyLabel =
			PROPERTY_OPTIONS.find((item) => item.value === parsedInput.property)
				?.label || parsedInput.property

		const summary = [
			'[PROGRAMS PAGE — ELIGIBILITY CHECK]',
			'',
			`Needs: ${needLabel}`,
			`Property: ${propertyLabel}`,
			`ZIP: ${parsedInput.zip}${countyName ? ` (${countyName})` : ''}`,
			parsedInput.notes ? `Notes: ${parsedInput.notes}` : '',
			'',
			'Likely programs:',
			...matches.map((match) => `- ${match.name}: ${match.pays}`),
		]
			.filter((line) => line !== undefined)
			.join('\n')

		/**
		 * CRM job_category slug. Storm-proofing and claim trouble route to the
		 * storm-restoration division; repair money is remodel work; tax help is
		 * a relationship lead, not a job yet.
		 */
		const projectType =
			parsedInput.need === 'storm-proof' || parsedInput.need === 'claim'
				? 'storm-restoration'
				: parsedInput.need === 'repair-money'
					? 'remodel'
					: 'other'

		let crmProjectId: string | null = null
		let crmFailed = false

		try {
			crmProjectId = await createCrmLead({
				name: parsedInput.name,
				email: parsedInput.email,
				phone: parsedInput.phone,
				projectAddress: parsedInput.projectAddress,
				projectType,
				message: summary,
			})
		} catch (crmError) {
			crmFailed = true
			console.error('CRM program-check write failed:', crmError)
		}

		const flags = [crmFailed ? '[NOT IN CRM]' : '', '[PROGRAMS PAGE]']
			.filter(Boolean)
			.join(' ')

		const crmLine = crmFailed
			? 'WARNING: this lead could not be saved to the CRM. Please add it manually.'
			: crmProjectId
				? `CRM job: ${siteConfig.crmUrl}/projects/${crmProjectId}`
				: 'CRM: not configured — this lead was not saved.'

		const resend = new Resend(apiKey)

		const internalPayload = {
			from: fromEmail,
			to: toEmails,
			replyTo: parsedInput.email,
			subject: `${flags} ${parsedInput.name} — ${needLabel}`,
			text: [
				'New eligibility check from covenantbuilders.org/homeowner-programs',
				'',
				`Name: ${parsedInput.name}`,
				`Email: ${parsedInput.email}`,
				`Phone: ${parsedInput.phone}`,
				`Property address: ${parsedInput.projectAddress}`,
				'',
				summary,
				'',
				crmLine,
			].join('\n'),
		}

		const clientPayload = {
			from: fromEmail,
			to: [parsedInput.email],
			replyTo: siteConfig.emails.estimating,
			subject: 'Programs that likely fit your property — Covenant Builders',
			text: [
				`Hi ${parsedInput.name.split(' ')[0]},`,
				'',
				`Based on what you told us (${needLabel.toLowerCase()}, ${propertyLabel.toLowerCase()}${countyName ? `, ${countyName}` : ''}), here is what likely fits:`,
				'',
				...matches.flatMap((match) => [
					`• ${match.name}`,
					`  ${match.pays}.`,
					`  ${match.note}`,
					'',
				]),
				'"Likely" is the honest word — final eligibility is decided by each program, and funding opens and closes in waves. That is exactly the part we help with: we check the current status, do the paperwork with you, and never charge for pointing the way.',
				'',
				`We will reach out shortly. If you would rather talk now, call ${siteConfig.phones.sr.display}.`,
				'',
				siteConfig.responseExpectation,
				'',
				'Josias Andujar',
				`Covenant Builders · Florida Certified Building Contractor ${siteConfig.license.number}`,
				'',
				'Covenant Builders is not affiliated with these government programs; applications are made directly by the property owner or association.',
			].join('\n'),
		}

		/** SEND SEQUENTIALLY. See app/actions/design.ts for the Resend limit. */
		const sendWithRetry = async (
			label: string,
			payload: Parameters<typeof resend.emails.send>[0]
		) => {
			for (let attempt = 1; attempt <= 2; attempt += 1) {
				try {
					const { error } = await resend.emails.send(payload)
					if (!error) return true
					console.error(`Resend error (${label}, attempt ${attempt}):`, error)
				} catch (thrown) {
					console.error(`Resend threw (${label}, attempt ${attempt}):`, thrown)
				}
				if (attempt === 1) {
					await new Promise((resolve) => setTimeout(resolve, 1200))
				}
			}
			return false
		}

		const internalSent = await sendWithRetry('internal', internalPayload)
		await new Promise((resolve) => setTimeout(resolve, 700))
		const clientSent = await sendWithRetry('client copy', clientPayload)

		if (!internalSent && !crmProjectId) {
			console.error(
				'PROGRAM LEAD LOST — no CRM row and no email:',
				parsedInput.email
			)
			throw new Error(
				'We could not send your results. Please call or email us directly.'
			)
		}
		if (!internalSent) {
			console.error(`Program notification failed but lead is in CRM: ${crmProjectId}`)
		}
		if (!clientSent) {
			console.error(`Program client copy failed to send to: ${parsedInput.email}`)
		}

		return { ok: true as const, matches, countyName }
	})
