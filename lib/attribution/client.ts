'use client'

/**
 * Browser-side capture. Called on every page view by <AttributionTracker />.
 *
 * Rules (the standard "first touch + last non-direct touch" model):
 *  - FIRST touch is written once and kept for ATTRIBUTION_WINDOW_DAYS.
 *  - LAST touch is replaced whenever the visitor arrives with a real marketing
 *    signal (tags, a rep/ref link, a click id, an outside referrer). A plain
 *    direct revisit does NOT overwrite it — otherwise every bookmark visit
 *    would erase the Facebook ad that actually won them.
 *  - Tags survive navigation because they are stored, not read from the URL
 *    at submit time.
 *
 * Storage: localStorage, mirrored to a first-party cookie so it survives if one
 * is cleared. If both are blocked the form still submits — just without
 * attribution (the email says so).
 */
import { ATTRIBUTION_WINDOW_DAYS } from '@/content/attribution'

import { isMeaningfulTouch, touchFromUrl, type Attribution, type Touch } from './shared'

const KEY = 'cb_attr'
const SESSION_KEY = 'cb_attr_session'
let memory: Attribution | null = null

function readCookie(): string | null {
	const match = document.cookie.match(/(?:^|; )cb_attr=([^;]*)/)
	return match ? decodeURIComponent(match[1]) : null
}

function load(): Attribution | null {
	try {
		const raw = window.localStorage.getItem(KEY) ?? readCookie()
		if (!raw) return memory
		const parsed = JSON.parse(raw) as Attribution
		if (parsed?.v !== 1) return null
		const ageDays = (Date.now() - Date.parse(parsed.firstTouch.at)) / 86_400_000
		if (!(ageDays <= ATTRIBUTION_WINDOW_DAYS)) return null
		return parsed
	} catch {
		return memory
	}
}

function save(a: Attribution) {
	memory = a
	const json = JSON.stringify(a)
	try {
		window.localStorage.setItem(KEY, json)
	} catch {
		/* private mode */
	}
	try {
		// Cookie is capped ~4KB; attribution is well under 2KB with caps in shared.ts.
		document.cookie = `${KEY}=${encodeURIComponent(json)}; Max-Age=${
			ATTRIBUTION_WINDOW_DAYS * 86400
		}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
	} catch {
		/* cookies blocked */
	}
}

function newVisitorId() {
	try {
		return crypto.randomUUID()
	} catch {
		return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
	}
}

/** Is this page view the first of a browser session? */
function isSessionStart() {
	try {
		if (window.sessionStorage.getItem(SESSION_KEY)) return false
		window.sessionStorage.setItem(SESSION_KEY, newVisitorId())
		return true
	} catch {
		return true
	}
}

/** Per-tab session id (for counting visits, not people). */
export function getSessionId(): string | undefined {
	try {
		return window.sessionStorage.getItem(SESSION_KEY) || undefined
	} catch {
		return undefined
	}
}

/**
 * Record a page view. Returns the stored attribution (or null if storage is
 * unusable). Safe to call on every client-side navigation.
 */
export function captureAttribution(): Attribution | null {
	if (typeof window === 'undefined') return null
	const sessionStart = isSessionStart()
	const url = new URL(window.location.href)
	// document.referrer only describes how the visitor reached the FIRST page
	// of a session; on later soft navigations it is stale, so ignore it.
	const touch: Touch = touchFromUrl(
		url,
		sessionStart ? document.referrer || null : null,
		url.hostname.replace(/^www\./, '')
	)
	const existing = load()

	if (!existing) {
		const fresh: Attribution = {
			v: 1,
			visitorId: newVisitorId(),
			firstTouch: touch,
			lastTouch: touch,
			firstPage: touch.landingPage,
			pagesViewed: 1,
			rep: touch.rep,
			ref: touch.ref,
		}
		save(fresh)
		return fresh
	}

	const meaningful = isMeaningfulTouch(touch)
	const next: Attribution = {
		...existing,
		lastTouch: meaningful ? touch : existing.lastTouch,
		pagesViewed: existing.pagesViewed + 1,
		rep: touch.rep ?? existing.rep,
		ref: touch.ref ?? existing.ref,
	}
	save(next)
	return next
}

/** What forms attach to a submission. Never throws. */
export function getAttribution(): Attribution | undefined {
	if (typeof window === 'undefined') return undefined
	return load() ?? undefined
}
