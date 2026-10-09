import { NextResponse, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

import { categories } from '@/content/estimator/catalog'
import { contactMethods, intents, PRELIMINARY_NOTICE, ROOFING_SUB_NOTICE, STORM_INSURANCE_NOTICE, timelines } from '@/content/estimator/copy'
import { siteConfig } from '@/content/site'
import { attributionEmailLines, attributionSchema } from '@/lib/attribution/shared'
import { createCrmLead } from '@/lib/crm'
import { estimate, showDraftPrices } from '@/lib/estimator/engine'
import { answerLines, estimateLines, findingsLines, scopeLabel } from '@/lib/estimator/format'
import { checkPhotos, clientIp, photoInputSchema } from '@/lib/estimator/photos'
import { cleanFindings } from '@/lib/estimator/vision'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * The lead. Same rules as every other form on the site (see
 * app/actions/design.ts and the resend-sending notes):
 *   1. CRM first, then email. A failed email never costs a captured lead.
 *   2. Resend sends one at a time, ~700 ms apart, retry once.
 *   3. The price is RECOMPUTED here from the answers. The browser's numbers
 *      are never trusted.
 *
 * The photos travel as attachments on the internal email only. They are not
 * written to any storage bucket in Phase 1 — retention = the estimates@
 * mailbox. (Phase 2 moves them to a private Supabase bucket with a deletion
 * schedule.)
 */

const intentKeys = Object.keys(intents) as [keyof typeof intents, ...(keyof typeof intents)[]]
const enumOf = <T extends readonly { value: string }[]>(items: T) => items.map((i) => i.value) as [string, ...string[]]

const bodySchema = z.object({
	intent: z.enum(intentKeys),
	categoryId: z.string().max(40),
	scopeId: z.string().max(40),
	zip: z.string().trim().regex(/^\d{5}$/, 'Please enter a 5-digit ZIP code'),
	answers: z.record(z.string().max(40), z.union([z.string().max(60), z.number()])).refine((a) => Object.keys(a).length <= 20),
	aiConfidence: z.enum(['high', 'medium', 'low', 'none']),
	findings: z.unknown().optional(),
	photos: photoInputSchema,
	name: z.string().trim().min(2, 'Please enter your name').max(100),
	phone: z.string().trim().min(7, 'Please enter a phone number').max(40),
	email: z.string().trim().email('Please enter a valid email').max(200),
	address: z.string().trim().max(300).optional(),
	description: z.string().trim().max(2000).optional(),
	timeline: z.enum(enumOf(timelines)),
	contactMethod: z.enum(enumOf(contactMethods)),
	marketingConsent: z.boolean(),
	website: z.string().max(0).optional(),
	attribution: attributionSchema,
})

export async function POST(req: NextRequest) {
	const parsed = bodySchema.safeParse(await req.json().catch(() => null))
	if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || 'Please check the form.' }, { status: 400 })
	const d = parsed.data
	if (d.website) return NextResponse.json({ ok: true })

	const ip = clientIp(req.headers)
	if (!checkRateLimit({ key: `est-lead:${ip}`, limit: 4, windowMs: 600_000 }).allowed) {
		return NextResponse.json({ ok: false, error: 'Too many requests. Please wait a few minutes or call us.' }, { status: 429 })
	}

	const checked = checkPhotos(d.photos)
	if (!checked.ok) return NextResponse.json({ ok: false, error: checked.error }, { status: 400 })

	const result = estimate({
		categoryId: d.categoryId,
		scopeId: d.scopeId,
		zip: d.zip,
		answers: d.answers,
		aiConfidence: d.aiConfidence,
		previewPrices: showDraftPrices(),
	})
	let findings = null
	try {
		findings = d.findings ? cleanFindings(d.findings) : null
	} catch {
		findings = null
	}

	const roof = categories.find((c) => c.id === d.categoryId)?.roofAd
	const project = scopeLabel(d.categoryId, d.scopeId)
	const intent = intents[d.intent]
	const timeline = timelines.find((t) => t.value === d.timeline)?.label
	const method = contactMethods.find((m) => m.value === d.contactMethod)?.label

	const summary = [
		`Project: ${project}`,
		`ZIP: ${d.zip}${d.address ? ` · Address: ${d.address}` : ''}`,
		`Customer wants: ${intent.short}`,
		`Timeline: ${timeline} · Prefers: ${method}`,
		`Marketing consent: ${d.marketingConsent ? 'YES (checked the box)' : 'no'}`,
		...(d.description ? [`Customer description: ${d.description}`] : []),
		'',
		'Customer answers:',
		...answerLines(d.categoryId, d.scopeId, d.answers).map((l) => `- ${l}`),
		'',
		...findingsLines(findings),
		'',
		'ORIGINAL AUTOMATED ESTIMATE (keep for accuracy tracking):',
		...estimateLines(result),
	]
		.filter((l) => l !== null)
		.join('\n')

	let crmProjectId: string | null = null
	let crmFailed = false
	try {
		crmProjectId = await createCrmLead({
			formName: 'photo_estimate',
			attribution: d.attribution,
			name: d.name,
			email: d.email,
			phone: d.phone,
			projectAddress: d.address || `ZIP ${d.zip}`,
			projectType: 'remodel',
			message: `[PHOTO ESTIMATE — NEEDS REVIEW]\n${summary}`,
		})
	} catch (error) {
		crmFailed = true
		console.error('CRM photo-estimate write failed:', error)
	}

	const apiKey = process.env.RESEND_API_KEY
	const toEmails = (process.env.LEAD_TO_EMAIL || siteConfig.emails.estimating).split(',').map((a) => a.trim()).filter(Boolean)
	const fromEmail = process.env.LEAD_FROM_EMAIL || 'Covenant Builders <onboarding@resend.dev>'

	let internalSent = false
	let clientSent = false
	if (apiKey && toEmails.length) {
		const resend = new Resend(apiKey)
		const send = async (label: string, payload: Parameters<typeof resend.emails.send>[0]) => {
			for (let attempt = 1; attempt <= 2; attempt++) {
				try {
					const { error } = await resend.emails.send(payload)
					if (!error) return true
					console.error(`Resend error (${label}, attempt ${attempt}):`, error)
				} catch (thrown) {
					console.error(`Resend threw (${label}, attempt ${attempt}):`, thrown)
				}
				if (attempt === 1) await new Promise((r) => setTimeout(r, 1200))
			}
			return false
		}

		const flags = [crmFailed ? '[NOT IN CRM]' : '', '[PHOTO ESTIMATE]', result.kind === 'priced' && result.draftPrices ? '[DRAFT PRICES]' : ''].filter(Boolean).join(' ')
		const crmLine = crmFailed
			? 'WARNING: this lead could not be saved to the CRM. Please add it manually.'
			: crmProjectId
				? `CRM job: ${siteConfig.crmUrl}/projects/${crmProjectId}`
				: 'CRM: not configured — this lead was not saved.'

		internalSent = await send('internal', {
			from: fromEmail,
			to: toEmails,
			replyTo: d.email,
			subject: `${flags} ${intent.short} — ${d.name} — ${project}`,
			text: [
				'New photo estimate from covenantbuilders.org/estimate',
				'Status: NEEDS REVIEW. Nothing has been promised to the customer beyond the preliminary range below.',
				'',
				`Name: ${d.name}`,
				`Phone: ${d.phone}`,
				`Email: ${d.email}`,
				'',
				summary,
				'',
				`${checked.photos.length} photo(s) attached (location data removed).`,
				crmLine,
				...attributionEmailLines(d.attribution),
			].join('\n'),
			attachments: checked.photos.map((p, i) => ({ filename: `photo-${i + 1}.jpg`, content: p.data, contentType: p.mediaType })),
		})

		if (d.intent === 'send') {
			await new Promise((r) => setTimeout(r, 700))
			clientSent = await send('client copy', {
				from: fromEmail,
				to: [d.email],
				replyTo: siteConfig.emails.estimating,
				subject: 'Your preliminary project estimate — Covenant Builders',
				text: [
					`Hi ${d.name.split(' ')[0]},`,
					'',
					'Here is the preliminary estimate you asked for.',
					'',
					`Project: ${project}`,
					'',
					...(result.kind === 'priced'
						? estimateLines(result).filter((l) => !l.startsWith('***'))
						: [result.message]),
					'',
					...(roof ? [ROOFING_SUB_NOTICE, STORM_INSURANCE_NOTICE, ''] : []),
					`Want an official quote? Reply to this email or call ${siteConfig.phones.sr.display}.`,
					siteConfig.responseExpectation,
					'',
					'Josias Andujar',
					`Covenant Builders · Florida Certified Building Contractor ${siteConfig.license.number}`,
					'',
					PRELIMINARY_NOTICE,
				].join('\n'),
			})
		}
	} else {
		console.error('Photo estimate: Resend not configured')
	}

	if (!internalSent && !crmProjectId) {
		console.error('PHOTO ESTIMATE LEAD LOST — no CRM row and no email:', d.email)
		return NextResponse.json({ ok: false, error: `We could not send your request. Please call ${siteConfig.phones.sr.display}.` }, { status: 502 })
	}
	return NextResponse.json({ ok: true, clientSent, intent: d.intent })
}
