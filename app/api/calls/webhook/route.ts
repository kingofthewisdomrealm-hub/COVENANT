/**
 * CALL TRACKING WEBHOOK — ready for when tracking numbers are bought.
 *
 * Point your call-tracking provider's "call completed" webhook here:
 *   POST https://covenantbuilders.org/api/calls/webhook
 *   Header:  x-webhook-secret: <CALL_WEBHOOK_SECRET>
 *   JSON:    { tracking_number, caller_number, started_at?, duration_seconds?,
 *              recording_url?, call_id?, provider? }
 * (Most providers let you map their fields to these names; CallRail's
 * `trackingnum` / `customer_phone_number` / `duration` / `recording` / `id` are
 * accepted too.)
 *
 * The route looks the tracking number up in content/attribution.ts to learn
 * its channel + campaign, then writes one row to the CRM's call_events table
 * through the `record_call` database function. Returns 503 until
 * CALL_WEBHOOK_SECRET is set, so it is inert today.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import { trackingNumbers } from '@/content/attribution'

const digits = (v: unknown) => (typeof v === 'string' || typeof v === 'number' ? String(v).replace(/\D/g, '') : '')
const e164 = (v: unknown) => {
	const d = digits(v)
	if (d.length === 10) return `+1${d}`
	if (d.length === 11 && d.startsWith('1')) return `+${d}`
	return d ? `+${d}` : ''
}
const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.slice(0, max) : v == null ? null : String(v).slice(0, max))

export async function POST(req: Request) {
	const secret = process.env.CALL_WEBHOOK_SECRET
	const url = process.env.SUPABASE_URL
	const key = process.env.SUPABASE_PUBLISHABLE_KEY
	if (!secret || !url || !key) {
		return NextResponse.json({ ok: false, error: 'call tracking not configured' }, { status: 503 })
	}
	if (req.headers.get('x-webhook-secret') !== secret) {
		return NextResponse.json({ ok: false }, { status: 401 })
	}

	let body: Record<string, unknown>
	try {
		const type = req.headers.get('content-type') || ''
		body = type.includes('application/json')
			? await req.json()
			: Object.fromEntries((await req.formData()).entries())
	} catch {
		return NextResponse.json({ ok: false, error: 'bad body' }, { status: 400 })
	}

	const trackingNumber = e164(body.tracking_number ?? body.trackingnum ?? body.To ?? body.to)
	const caller = e164(body.caller_number ?? body.customer_phone_number ?? body.From ?? body.from)
	if (!trackingNumber) {
		return NextResponse.json({ ok: false, error: 'tracking_number required' }, { status: 400 })
	}
	const registered = trackingNumbers.find((n) => e164(n.number) === trackingNumber)

	const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
	const { error } = await supabase.rpc('record_call', {
		p_secret: secret,
		p_tracking_number: trackingNumber,
		p_caller_number: caller || null,
		p_channel: registered?.channel ?? null,
		p_campaign: registered?.campaign ?? null,
		p_started_at: str(body.started_at ?? body.start_time, 40),
		p_duration_seconds: Number(body.duration_seconds ?? body.duration ?? body.CallDuration) || null,
		p_recording_url: str(body.recording_url ?? body.recording ?? body.RecordingUrl),
		p_provider: str(body.provider, 40),
		p_provider_call_id: str(body.call_id ?? body.id ?? body.CallSid, 120),
	})
	if (error) {
		console.error('record_call failed:', error.message)
		return NextResponse.json({ ok: false }, { status: 500 })
	}
	return NextResponse.json({ ok: true })
}
