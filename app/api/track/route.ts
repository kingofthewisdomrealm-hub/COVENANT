/**
 * Website click + page-view collector. The browser sends one small beacon
 * per event; this route forwards it to the CRM's `record_web_event` function
 * (the anon key never leaves the server). Always answers 204 — a tracking
 * failure must never surface to a visitor.
 *
 * WHERE + WHO (added step 3):
 *  - city / state / country come from Vercel's edge headers, free, no lookup.
 *  - ip_hash = sha256(salt + ip): the same visitor gives the same fingerprint,
 *    so we can count people and filter bots, but nobody can turn it back into
 *    an address. Salt = IP_HASH_SALT, else ATTRIBUTION_SECRET.
 *  - the RAW ip is sent only when the visitor is in Florida; the database
 *    keeps it 30 days, then wipes it (see attribution_step3.sql).
 *  - "don't count me": a visit to any page with ?notrack=1 sets a flag in that
 *    browser and the tracker stops sending. ?notrack=0 turns it back on.
 */
import { createHash } from 'node:crypto'

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

	const dec = (v: string | null) => {
		if (!v) return undefined
		try {
			return decodeURIComponent(v).slice(0, 80)
		} catch {
			return v.slice(0, 80)
		}
	}
	const country = req.headers.get('x-vercel-ip-country')?.toUpperCase().slice(0, 2)
	const region = req.headers.get('x-vercel-ip-country-region')?.toUpperCase().slice(0, 10)
	const city = dec(req.headers.get('x-vercel-ip-city'))
	const salt = process.env.IP_HASH_SALT || process.env.ATTRIBUTION_SECRET || ''
	const ipHash = ip !== 'unknown' && salt ? createHash('sha256').update(`${salt}|${ip}`).digest('hex').slice(0, 32) : undefined
	const rawIp = ip !== 'unknown' && country === 'US' && region === 'FL' ? ip.slice(0, 45) : undefined

	try {
		const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
		const { error } = await supabase.rpc('record_web_event', {
			p_payload: { ...parsed, city, region, country, ip_hash: ipHash, ip: rawIp },
		})
		if (error) console.warn('record_web_event:', error.message)
	} catch (e) {
		console.warn('track failed:', e)
	}
	return new NextResponse(null, { status: 204 })
}
