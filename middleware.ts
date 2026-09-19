/**
 * Short marketing links → the real site, with attribution tags attached.
 *
 *   /r/<rep>          → rep link             (?rep=<rep>)
 *   /<rep>            → same, vanity form    (only for reps listed in content/attribution.ts)
 *   /ref/<code>       → referral link        (?ref=<code>&utm_source=referral&utm_medium=referral)
 *   /go/<qr-code>     → QR / offline code    (full UTM set from the registry)
 *
 * Extra query params on the short link are kept (so /r/josias?utm_campaign=x
 * works). Redirects are 307 (temporary) on purpose — a code can be repointed
 * later without browsers having cached the old destination.
 *
 * The browser-side tracker reads the tags from the landing URL; nothing is
 * stored here.
 */
import { NextResponse, type NextRequest } from 'next/server'

import { qrCodes, reps, reservedTopLevelPaths } from '@/content/attribution'

const DEFAULT_LANDING = '/design-your-project'
const SLUG = /^[a-z0-9][a-z0-9_-]{0,59}$/

function go(req: NextRequest, path: string, tags: Record<string, string | undefined>) {
	const url = req.nextUrl.clone()
	url.pathname = path
	// Tags from the short link win over nothing, but an explicit param already on
	// the short link (e.g. ?utm_campaign=) wins over the registry default.
	for (const [k, v] of Object.entries(tags)) {
		if (v && !url.searchParams.has(k)) url.searchParams.set(k, v)
	}
	return NextResponse.redirect(url, 307)
}

export function middleware(req: NextRequest) {
	const parts = req.nextUrl.pathname.split('/').filter(Boolean)
	const first = parts[0]?.toLowerCase()
	const second = parts[1]?.toLowerCase()

	if (parts.length === 2 && first === 'r' && second && SLUG.test(second)) {
		return go(req, DEFAULT_LANDING, { rep: second })
	}

	if (parts.length === 2 && first === 'ref' && second && SLUG.test(second)) {
		return go(req, DEFAULT_LANDING, {
			ref: second,
			utm_source: 'referral',
			utm_medium: 'referral',
		})
	}

	if (parts.length === 2 && first === 'go' && second) {
		const qr = qrCodes.find((q) => q.code === second)
		if (!qr) return go(req, DEFAULT_LANDING, { qr: SLUG.test(second) ? second : undefined, utm_medium: 'offline' })
		return go(req, qr.to || DEFAULT_LANDING, {
			qr: qr.code,
			utm_source: qr.source,
			utm_medium: qr.medium,
			utm_campaign: qr.campaign,
			utm_content: qr.content ?? qr.placement,
			rep: qr.rep,
			ref: qr.ref,
		})
	}

	if (parts.length === 1 && first && !reservedTopLevelPaths.has(first)) {
		if (reps.some((r) => r.slug === first)) return go(req, DEFAULT_LANDING, { rep: first })
	}

	return NextResponse.next()
}

export const config = {
	// Skip static files and Next internals — middleware only needs page paths.
	matcher: ['/((?!_next/|api/|.*\\..*).*)'],
}
