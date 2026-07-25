'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { z } from 'zod'

import { siteConfig, projectTypes } from '@/content/site'
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
		const toEmail = process.env.LEAD_TO_EMAIL || siteConfig.emails.estimating
		const fromEmail =
			process.env.LEAD_FROM_EMAIL ||
			'Covenant Builders <onboarding@resend.dev>'

		if (!apiKey) {
			console.error('RESEND_API_KEY is not configured')
			throw new Error(
				'Estimate form is temporarily unavailable. Please call or email us directly.'
			)
		}

		const projectLabel =
			projectTypes.find((item) => item.value === parsedInput.projectType)
				?.label || parsedInput.projectType

		const resend = new Resend(apiKey)
		const { error } = await resend.emails.send({
			from: fromEmail,
			to: [toEmail],
			replyTo: parsedInput.email,
			subject: `New estimate request — ${parsedInput.name}`,
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
