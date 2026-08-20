'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { z } from 'zod'

import {
	BRIEF_DISCLAIMER,
	projectBranches,
	type BranchKey,
} from '@/content/design-your-project'
import { siteConfig } from '@/content/site'
import { createCrmLead } from '@/lib/crm'
import { branchFor, formatDesignBrief } from '@/lib/design-brief'
import { checkRateLimit } from '@/lib/rate-limit'
import { actionClient } from '@/lib/safe-action'

/**
 * Deliberately a SIBLING of submitLead, not an extension of it.
 *
 * The contact form works and carries real leads. Widening its schema to fit a
 * seven-field wizard would put a working pipe at risk for no gain, and the
 * privacy page enumerates the contact form's fields specifically. Everything
 * shared — the rate limiter, the honeypot pattern, the CRM-then-email ordering
 * — is reused by import.
 */

const branchKeys = projectBranches.map((branch) => branch.key) as [
	BranchKey,
	...BranchKey[],
]

const designSchema = z.object({
	projectType: z.enum(branchKeys, {
		errorMap: () => ({ message: 'Please choose a project type' }),
	}),
	property: z.string().trim().min(1, 'Please choose an option').max(120),
	city: z.string().trim().min(1, 'Please choose a city').max(120),
	scope: z
		.array(z.string().trim().max(120))
		.min(1, 'Please choose at least one item')
		.max(30),
	size: z.string().trim().max(120).optional(),
	finishLevel: z.string().trim().max(120).optional(),
	boardStage: z.string().trim().max(120).optional(),
	timeline: z.string().trim().min(1, 'Please choose a timeline').max(120),
	budgetBand: z.string().trim().min(1, 'Please choose a range').max(120),
	name: z.string().trim().min(2, 'Please enter your name').max(100),
	email: z.string().trim().email('Please enter a valid email').max(200),
	phone: z.string().trim().min(7, 'Please enter a phone number').max(40),
	projectAddress: z
		.string()
		.trim()
		.min(5, 'Please enter the project address')
		.max(300),
	notes: z.string().trim().max(4000).optional(),
	website: z.string().max(0).optional(),
})

export const submitProjectDesign = actionClient
	.schema(designSchema)
	.action(async ({ parsedInput }) => {
		if (parsedInput.website) {
			return { ok: true as const }
		}

		const headerStore = headers()
		const forwarded = headerStore.get('x-forwarded-for')
		const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
		const rate = checkRateLimit({
			key: `design:${ip}`,
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

		if (!apiKey) {
			console.error('RESEND_API_KEY is not configured')
			throw new Error(
				'The project designer is temporarily unavailable. Please call or email us directly.'
			)
		}

		if (toEmails.length === 0) {
			console.error('LEAD_TO_EMAIL resolved to no valid recipients')
			throw new Error(
				'The project designer is temporarily unavailable. Please call or email us directly.'
			)
		}

		const branch = branchFor(parsedInput.projectType)
		const brief = formatDesignBrief(parsedInput)

		/**
		 * Phase 1 CRM handoff: flatten into the existing submit_website_lead RPC.
		 *
		 * p_category has to be one of the six job_category enum values or the RPC
		 * rejects the row, so condo/association work rides in as 'commercial' for
		 * now. The full structured handoff — a project_designs table, a
		 * condo-association enum value, and a seeded draft estimate — is Phase 2
		 * and needs a Supabase migration. Until then the whole brief travels in
		 * the message body, which loses nothing a human estimator needs.
		 *
		 * As in lead.ts: write the CRM first, but never let it block the email.
		 * A database hiccup must not cost a lead.
		 */
		let crmProjectId: string | null = null
		let crmFailed = false

		try {
			crmProjectId = await createCrmLead({
				name: parsedInput.name,
				email: parsedInput.email,
				phone: parsedInput.phone,
				projectAddress: parsedInput.projectAddress,
				projectType: branch?.crmCategory || 'other',
				message: brief,
			})
		} catch (crmError) {
			crmFailed = true
			console.error('CRM design-lead write failed:', crmError)
		}

		/**
		 * Condo and association jobs are the largest tickets this site produces.
		 * Flagging the subject line means they can be filtered and answered first
		 * without anyone reading the body.
		 */
		const flags = [
			crmFailed ? '[NOT IN CRM]' : '',
			parsedInput.projectType === 'condo' ? '[CONDO/ASSOCIATION]' : '',
		]
			.filter(Boolean)
			.join(' ')

		const subject =
			`${flags} New project design — ${parsedInput.name} — ${branch?.label || parsedInput.projectType}`.trim()

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
			subject,
			text: [
				'New project design from covenantbuilders.org',
				'',
				`Name: ${parsedInput.name}`,
				`Email: ${parsedInput.email}`,
				`Phone: ${parsedInput.phone}`,
				`Project address: ${parsedInput.projectAddress}`,
				'',
				brief,
				'',
				crmLine,
			].join('\n'),
		}

		const clientPayload = {
			from: fromEmail,
			to: [parsedInput.email],
			replyTo: siteConfig.emails.estimating,
			subject: 'Your project brief — Covenant Builders',
			text: [
				`Hi ${parsedInput.name.split(' ')[0]},`,
				'',
				'Here is the project brief you just built. Everything you selected is below.',
				'',
				'You do not owe us anything for it. Take it to another builder if you want to — you will get better bids because of it.',
				'',
				'----------------------------------------',
				brief,
				'----------------------------------------',
				'',
				`If you would like us to come look at the property, call ${siteConfig.phones.sr.display}. Usually under an hour. No charge, no pitch.`,
				'',
				siteConfig.responseExpectation,
				'',
				'Josias Andujar',
				`Covenant Builders · ${siteConfig.license.number}`,
				'',
				BRIEF_DISCLAIMER,
			].join('\n'),
		}

		/**
		 * SEND SEQUENTIALLY. NEVER IN PARALLEL.
		 *
		 * Resend rate-limits at roughly two requests per second. An earlier
		 * version built both emails with `resend.emails.send(...)` and awaited
		 * them together, which fired both API calls in the same tick — enough
		 * for Resend to reject one, which made this action throw and showed the
		 * visitor a red error on a submission that had otherwise worked
		 * perfectly. The contact form never hit this because it only ever sends
		 * one email. One retry after a pause covers the transient case.
		 */
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
		// A gap so the client's copy cannot collide with the notification.
		await new Promise((resolve) => setTimeout(resolve, 700))
		const clientSent = await sendWithRetry('client copy', clientPayload)

		/**
		 * Only fail the visitor when NOTHING captured the lead.
		 *
		 * If the CRM row was written, the job exists in the system of record and
		 * the submission genuinely succeeded. Telling the visitor otherwise
		 * throws away a finished brief and the trust that came with it, and
		 * invites them to submit again — which produces duplicate CRM rows and
		 * more rate-limited sends. An email that did not go out is an operations
		 * problem, not the visitor's problem: log it loudly, let them through.
		 */
		if (!internalSent && !crmProjectId) {
			console.error(
				'LEAD LOST — no CRM row and no notification email:',
				parsedInput.email
			)
			throw new Error(
				'We could not send your brief. Please call or email us directly.'
			)
		}

		if (!internalSent) {
			console.error(
				`NOTIFICATION EMAIL FAILED but the lead is safe in the CRM: ${crmProjectId}`
			)
		}

		if (!clientSent) {
			console.error(
				`Client copy of the brief failed to send to: ${parsedInput.email}`
			)
		}

		return { ok: true as const }
	})
