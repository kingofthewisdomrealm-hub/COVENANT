import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { estimate } from '@/lib/estimator/engine'
import { clientIp } from '@/lib/estimator/photos'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 *   POST /api/estimate/price  { categoryId, scopeId, zip, answers, aiConfidence }
 *
 * Runs the pricing engine on the server so the pricebook (Covenant's rates)
 * never ships to the browser. No photos, no AI — just arithmetic.
 */

const bodySchema = z.object({
	categoryId: z.string().max(40),
	scopeId: z.string().max(40),
	zip: z.string().trim().max(10),
	answers: z.record(z.string().max(40), z.union([z.string().max(60), z.number()])).refine((a) => Object.keys(a).length <= 20),
	aiConfidence: z.enum(['high', 'medium', 'low', 'none']),
})

export async function POST(req: NextRequest) {
	const parsed = bodySchema.safeParse(await req.json().catch(() => null))
	if (!parsed.success) return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })
	if (!checkRateLimit({ key: `est-price:${clientIp(req.headers)}`, limit: 30, windowMs: 60_000 }).allowed) {
		return NextResponse.json({ ok: false, error: 'Too many requests.' }, { status: 429 })
	}
	const result = estimate({ ...parsed.data, previewPrices: process.env.ESTIMATOR_PREVIEW_PRICES === '1' })
	return NextResponse.json({ ok: true, result })
}
