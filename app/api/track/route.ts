/**
 * Website click + page-view collector. The browser sends one small beacon
 * per event; this route forwards it to the CRM's `record_web_event` function
 * (the anon key never leaves the server). Always answers 204 — a tracking
 * failure must never surface to a visitor.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

import { checkRateLimit } from '@/lib/rate-limit'

const s = (max: number) => z.string().max(max).optional().nullable()
const schema = z.object({
	event: z.string().regex(/^[a-z_]{3,40}$/),
	page: s(300),
	label: s(120),
	channel: s(40),
	first_channel: s(40),
	campaign: s(120),
	rep: s(60),
	ref: s(60),
	visitor_id: s(64),
	session_id: s(64),
})

export async function POST(req: Request) {
	const url = process.env.SUPABASE_URL
	const key = process.env.SUPABASE_PUBLISHABLE_KEY
	if (!url || !key) return new NextResponse(null, { status: 204 })

	const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
	if (!checkRateLimit({ key: `track:${ip}`, limit: 120, windowMs: 60_000 }).allowed) {
		return new NextResponse(null, { status: 204 })
	}

	let parsed: z.infer<typeof schema>
	try {
		parsed = schema.parse(await req.json())
	} catch {
		return new NextResponse(null, { status: 204 })
	}

	try {
		const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
		const { error } = await supabase.rpc('record_web_event', { p_payload: parsed })
		if (error) console.warn('record_web_event:', error.message)
	} catch (e) {
		console.warn('track failed:', e)
	}
	return new NextResponse(null, { status: 204 })
}
