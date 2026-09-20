import { NextResponse, type NextRequest } from 'next/server'

import { assistantSecret, db } from '@/lib/assistant/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 *   POST /api/assistant/state   { key }                    → counts + leads
 *   POST /api/assistant/state   { key, load:{rows, replace} } → paste-from-Excel loader
 *
 * `rows` is the array the page parsed from the clipboard (see the LOAD
 * drawer). It is written through assistant_upsert_buildings, which checks the
 * key first.
 */
export async function POST(req: NextRequest) {
	const secret = assistantSecret()
	const body = (await req.json().catch(() => null)) as { key?: string; load?: { rows: unknown[]; replace: boolean } } | null
	if (!secret || !body || body.key !== secret) return NextResponse.json({ error: 'not found' }, { status: 404 })
	try {
		let loaded: number | null = null
		if (body.load && Array.isArray(body.load.rows)) {
			loaded = await db.upsertBuildings(secret, body.load.rows.slice(0, 2000), Boolean(body.load.replace))
		}
		const [buildings, programs, leads] = await Promise.all([db.buildings(secret), db.programs(secret), db.leads(secret)])
		const counts = buildings.reduce<Record<string, number>>((m, b) => ((m[b.status] = (m[b.status] ?? 0) + 1), m), {})
		return NextResponse.json({ ok: true, loaded, buildings: buildings.length, by_status: counts, programs: programs.length, leads })
	} catch (err) {
		return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
	}
}
