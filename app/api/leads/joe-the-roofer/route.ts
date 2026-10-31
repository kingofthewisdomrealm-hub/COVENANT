/**
 * Inbox for roof-inspection requests from joetherooferllc.com.
 *
 * Joe's site posts its form here (server to server, JSON). This route reuses
 * Covenant's own CRM connection and Resend key, so Joe's Vercel project needs
 * no secrets: only LEAD_WEBHOOK_URL pointing at this address.
 *
 * Same rules as the contact form (app/actions/lead.ts):
 *  - Write to the CRM first, but never let a CRM failure cost the lead.
 *  - The email is the safety net; a failed CRM write flags the subject.
 *  - Answer 200 if EITHER the CRM or the email captured the lead.
 */
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

import { siteConfig } from '@/content/site'
import { createCrmLead } from '@/lib/crm'
import { checkRateLimit } from '@/lib/rate-limit'

const schema = z.object({
	name: z.string().trim().min(2).max(100),
	phone: z.string().trim().min(7).max(40),
	email: z.string().trim().email().max(200),
	address: z.string().trim().min(5).max(300),
	message: z.string().trim().min(4).max(4000),
	submittedAt: z.string().max(40).optional(),
})

export async function POST(req: Request) {
	const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
	if (!checkRateLimit({ key: `joe-lead:${ip}`, limit: 10, windowMs: 60_000 }).allowed) {
		return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
	}

	let lead: z.infer<typeof schema>
	try {
		lead = schema.parse(await req.json())
	} catch {
		return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
	}

	let crmProjectId: string | null = null
	let crmFailed = false
	try {
		crmProjectId = await createCrmLead({
			name: lead.name,
			email: lead.email,
			phone: lead.phone,
			projectAddress: lead.address,
			projectType: 'storm-restoration',
			message: `[Joe the Roofer website] ${lead.message}`,
			formName: 'joe_the_roofer',
		})
	} catch (error) {
		crmFailed = true
		console.error('Joe the Roofer lead: CRM write failed:', error)
	}

	const apiKey = process.env.RESEND_API_KEY
	const toEmails = (process.env.LEAD_TO_EMAIL || siteConfig.emails.estimating)
		.split(',')
		.map((address) => address.trim())
		.filter(Boolean)
	const fromEmail = process.env.LEAD_FROM_EMAIL || 'Covenant Builders <onboarding@resend.dev>'

	let emailSent = false
	if (apiKey && toEmails.length) {
		const crmLine = crmFailed
			? 'WARNING: this lead could not be saved to the CRM. Please add it manually.'
			: crmProjectId
				? `CRM job: ${siteConfig.crmUrl}/projects/${crmProjectId}`
				: 'CRM: not configured. This lead was not saved.'

		const { error } = await new Resend(apiKey).emails.send({
			from: fromEmail,
			to: toEmails,
			replyTo: lead.email,
			subject: `${crmFailed ? '[NOT IN CRM] ' : ''}Roof inspection request (Joe the Roofer) — ${lead.name}`,
			text: [
				'New roof inspection request from joetherooferllc.com',
				'',
				`Name: ${lead.name}`,
				`Phone: ${lead.phone}`,
				`Email: ${lead.email}`,
				`Property address: ${lead.address}`,
				'',
				'What is going on:',
				lead.message,
				'',
				crmLine,
				lead.submittedAt ? `Submitted: ${lead.submittedAt}` : '',
			].join('\n'),
		})
		if (error) console.error('Joe the Roofer lead: email failed:', error)
		else emailSent = true
	} else {
		console.error('Joe the Roofer lead: RESEND_API_KEY or LEAD_TO_EMAIL missing')
	}

	if (!crmProjectId && !emailSent) {
		return NextResponse.json({ ok: false, error: 'not_captured' }, { status: 502 })
	}
	return NextResponse.json({ ok: true })
}
