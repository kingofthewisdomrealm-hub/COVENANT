'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { z } from 'zod'

import { siteConfig, projectTypes } from '@/content/site'
import { createCrmLead } from '@/lib/crm'
import { checkRateLimit } from '@/lib/rate-limit'
import { actionClient } from '@/lib/safe-action'

const projectTypeValues = projectTypes.map((item) => item.value) as [
	string,
	...string[],
]

const leadSchema = z.object({
	name: z.string().trim().min(2, 'Please enter your name').max(100),
	email: z.string().trim().email('Please enter a valid email').max(200),
	phone: z.string().trim().min(7, 'Please enter a phone number').max(40),
	projectAddress: z
		.string()
		.trim()
		.min(5, 'Please enter the project address')
		.max(300),
	projectType: z.enum(projectTypeValues, {
		errorMap: () => ({ message: 'Please select a project type' }),
	}),
	message: z
		.string()
		.trim()
		.min(10, 'Please share a few details about your project')
		.max(4000),
	website: z.string().max(0).optional(),
})

export const submitLead = actionClient
	.schema(leadSchema)
	.action(async ({ parsedInput }) => {
		if (parsedInput.website) {
			return { ok: true as const }
		}

		const headerStore = headers()
		const forwarded = headerStore.get('x-forwarded-for')
		const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
		const rate = checkRateLimit({ key: `lead:${ip}`, limit: 5, windowMs: 60_000 })

		if (!rate.allowed) {
			throw new Error('Too many requests. Please wait a minute and try again.')
		}

		const apiKey = process.env.RESEND_API_KEY
		/**
		 * LEAD_TO_EMAIL accepts one address or a comma-separated list, so a lead
		 * can reach several inboxes at once — e.g.
		 *   kingofthewisdomrealm@gmail.com,pastorjosias@ymail.com
		 * Sending to multiple recipients directly is more reliable than Gmail
		 * forwarding rules, which add a hop and raise the spam risk.
		 * Note: Resend only delivers to arbitrary addresses once the sending
		 * domain is verified; until then it restricts to the account owner.
		 */
		const toEmails = (
			process.env.LEAD_TO_EMAIL || siteConfig.emails.estimating
		)
			.split(',')
			.map((address) => address.trim())
			.filter(Boolean)

		const fromEmail =
			process.env.LEAD_FROM_EMAIL ||
			'Covenant Builders <onboarding@resend.dev>'

		if (!apiKey) {
			console.error('RESEND_API_KEY is not configured')
			throw new Error(
				'Estimate form is temporarily unavailable. Please call or email us directly.'
			)
		}

		if (toEmails.length === 0) {
			console.error('LEAD_TO_EMAIL resolved to no valid recipients')
			throw new Error(
				'Estimate form is temporarily unavailable. Please call or email us directly.'
			)
		}

		const projectLabel =
			projectTypes.find((item) => item.value === parsedInput.projectType)
				?.label || parsedInput.projectType

		/**
		 * Write to the CRM first, but never let it block the email.
		 *
		 * The email is the safety net: if Supabase is unreachable, the lead still
		 * reaches a human inbox and can be entered by hand. Losing a lead to a
		 * database hiccup would be far worse than a duplicate.
		 *
		 * When the write fails the subject line is flagged so it is obvious the
		 * job is NOT in the CRM and needs adding manually.
		 */
		let crmProjectId: string | null = null
		let crmFailed = false

		try {
			crmProjectId = await createCrmLead(parsedInput)
		} catch (crmError) {
			crmFailed = true
			console.error('CRM lead write failed:', crmError)
		}

		const subject = crmFailed
			? `[NOT IN CRM] New estimate request — ${parsedInput.name}`
			: `New estimate request — ${parsedInput.name}`

		const crmLine = crmFailed
			? 'WARNING: this lead could not be saved to the CRM. Please add it manually.'
			: crmProjectId
				? `CRM job: ${siteConfig.crmUrl}/projects/${crmProjectId}`
				: 'CRM: not configured — this lead was not saved.'

		const resend = new Resend(apiKey)
		const { error } = await resend.emails.send({
			from: fromEmail,
			to: toEmails,
			replyTo: parsedInput.email,
			subject,
			text: [
				'New estimate request from covenantbuilders.org',
				'',
				`Name: ${parsedInput.name}`,
				`Email: ${parsedInput.email}`,
				`Phone: ${parsedInput.phone}`,
				`Project address: ${parsedInput.projectAddress}`,
				`Project type: ${projectLabel}`,
				'',
				'Message:',
				parsedInput.message,
				'',
				crmLine,
			].join('\n'),
		})

		if (error) {
			console.error('Resend error:', error)
			throw new Error(
				'We could not send your request. Please call or email us directly.'
			)
		}

		return { ok: true as const }
	})
