import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { checkPhotos, clientIp, photoInputSchema } from '@/lib/estimator/photos'
import { aiAvailable, analyzePhotos } from '@/lib/estimator/vision'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 *   POST /api/estimate/analyze   { photos:[{data, mediaType}], note?, website? }
 *   → { ok:true, findings }            the AI read-out
 *   → { ok:true, findings:null, why }  AI off or failed — page lets the
 *                                       customer pick the project type by hand
 *   → { ok:false, error }              bad input or too many requests
 *
 * Photos are NOT stored here. They go to Claude for this one reading and are
 * dropped when the request ends.
 */

const bodySchema = z.object({
	photos: photoInputSchema,
	note: z.string().max(600).optional(),
	website: z.string().max(0).optional(),
})

export async function POST(req: NextRequest) {
	const parsed = bodySchema.safeParse(await req.json().catch(() => null))
	if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || 'Bad request' }, { status: 400 })
	if (parsed.data.website) return NextResponse.json({ ok: true, findings: null, why: 'manual' })

	const ip = clientIp(req.headers)
	const minute = checkRateLimit({ key: `est-ai:${ip}`, limit: 4, windowMs: 60_000 })
	const hour = checkRateLimit({ key: `est-ai-h:${ip}`, limit: 15, windowMs: 3_600_000 })
	if (!minute.allowed || !hour.allowed) return NextResponse.json({ ok: false, error: 'Too many photo checks. Please wait a few minutes.' }, { status: 429 })

	const checked = checkPhotos(parsed.data.photos)
	if (!checked.ok) return NextResponse.json({ ok: false, error: checked.error }, { status: 400 })

	if (!aiAvailable()) return NextResponse.json({ ok: true, findings: null, why: 'ai-off' })

	try {
		const findings = await analyzePhotos(checked.photos, parsed.data.note)
		return NextResponse.json({ ok: true, findings })
	} catch (error) {
		console.error('Estimator AI failed:', error)
		return NextResponse.json({ ok: true, findings: null, why: 'ai-error' })
	}
}
