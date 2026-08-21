'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { z } from 'zod'

import { siteConfig } from '@/content/site'
import {
	STORM_CHECK_DISCLAIMER,
	STORM_INSURANCE_NOTICE,
	bandCopy,
	scoreStormCheck,
} from '@/content/storm-check'
import { createCrmLead } from '@/lib/crm'
import { checkRateLimit } from '@/lib/rate-limit'
import { actionClient } from '@/lib/safe-action'

/**
 * A SIBLING of submitLead and submitProjectDesign — same rate limiter, same
 * honeypot, same CRM-then-email ordering, same sequential Resend sends.
 * See app/actions/design.ts for why the pipes are kept separate.
 */

const stormSchema = z.object({
	zip: z.string().trim().regex(/^\d{5}$/, 'Please enter a 5-digit ZIP code'),
	property: z.string().trim().min(1, 'Please choose an option').max(120),
	noticed: z.string().trim().min(1, 'Please choose an option').max(120),
	signs: z.array(z.string().trim().max(120)).min(1).max(20),
	roofAge: z.string().trim().min(1).max(60),
	roofType: z.string().trim().min(1).max(60),
	looked: z.string().trim().min(1).max(120),
	goal: z.string().trim().min(1).max(120),
	name: z.string().trim().min(2, 'Please enter your name').max(100),
	email: z.string().trim().email('Please enter a valid email').max(200),
	phone: z.string().trim().min(7, 'Please enter a phone number').max(40),
	projectAddress: z
		.string()
		.trim()
		.min(5, 'Please enter the property address')
		.max(300),
	notes: z.string().trim().max(4000).optional(),
	website: z.string().max(0).optional(),
})

export const submitStormCheck = actionClient
	.schema(stormSchema)
	.action(async ({ parsedInput }) => {
		if (parsedInput.website) {
			return { ok: true as const }
		}

		const headerStore = headers()
		const forwarded = headerStore.get('x-forwarded-for')
		const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
		const rate = checkRateLimit({
			key: `storm:${ip}`,
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
			console.error('Storm check: Resend not configured')
			throw new Error(
				'The storm check is temporarily unavailable. Please call or email us directly.'
			)
		}

		const { score, band, events } = scoreStormCheck(parsedInput)
		const bandLabel =
			band === 'likely' ? 'LIKELY' : band === 'possible' ? 'POSSIBLE' : 'LOW'

		const eventLines = events.length
			? events.map((event) => `- ${event.label}: ${event.detail} (${event.source})`)
			: ['- No recorded event on file for this ZIP']

		const summary = [
			`Storm check result: ${bandLabel} (${score}/100)`,
			'',
			`ZIP: ${parsedInput.zip}`,
			`Property: ${parsedInput.property}`,
			`Noticed: ${parsedInput.noticed}`,
			`Signs: ${parsedInput.signs.join(' · ')}`,
			`Roof age: ${parsedInput.roofAge}`,
			`Roof type: ${parsedInput.roofType}`,
			`Who has looked: ${parsedInput.looked}`,
			`Goal: ${parsedInput.goal}`,
			parsedInput.notes ? `Notes: ${parsedInput.notes}` : '',
			'',
			'Recorded events for this ZIP:',
			...eventLines,
		]
			.filter((line) => line !== undefined)
			.join('\n')

		let crmProjectId: string | null = null
		let crmFailed = false

		try {
			crmProjectId = await createCrmLead({
				name: parsedInput.name,
				email: parsedInput.email,
				phone: parsedInput.phone,
				projectAddress: parsedInput.projectAddress,
				projectType: 'storm-restoration',
				message: `[STORM CHECK — ${bandLabel}]\n${summary}`,
			})
		} catch (crmError) {
			crmFailed = true
			console.error('CRM storm-check write failed:', crmError)
		}

		const flags = [crmFailed ? '[NOT IN CRM]' : '', `[STORM CHECK ${bandLabel}]`]
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
			subject: `${flags} ${parsedInput.name} — ${parsedInput.zip}`,
			text: [
				'New storm check from covenantbuilders.org/storm-check',
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

		const copy = bandCopy[band]

		const clientPayload = {
			from: fromEmail,
			to: [parsedInput.email],
			replyTo: siteConfig.emails.estimating,
			subject: 'Your storm check — Covenant Builders',
			text: [
				`Hi ${parsedInput.name.split(' ')[0]},`,
				'',
				copy.title,
				'',
				copy.body,
				'',
				'----------------------------------------',
				summary,
				'----------------------------------------',
				'',
				`If you would like us to come look at the roof, call ${siteConfig.phones.sr.display}. The inspection is free and you get a written answer either way.`,
				'',
				STORM_INSURANCE_NOTICE,
				'',
				siteConfig.responseExpectation,
				'',
				'Josias Andujar',
				`Covenant Builders · Florida Certified Building Contractor ${siteConfig.license.number}`,
				'',
				STORM_CHECK_DISCLAIMER,
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
			console.error('STORM LEAD LOST — no CRM row and no email:', parsedInput.email)
			throw new Error(
				'We could not send your results. Please call or email us directly.'
			)
		}
		if (!internalSent) {
			console.error(`Storm notification failed but lead is in CRM: ${crmProjectId}`)
		}
		if (!clientSent) {
			console.error(`Storm client copy failed to send to: ${parsedInput.email}`)
		}

		return { ok: true as const, score, band }
	})
