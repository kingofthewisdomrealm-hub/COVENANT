'use client'

/**
 * ONE function for every conversion event. It fans out to whatever is
 * installed — GTM dataLayer, GA4 (gtag), Meta Pixel, Vercel Analytics — so a
 * component never needs to know which tools are live.
 *
 * Event names (GA4 recommended names where one exists):
 *   phone_click · email_click · sms_click · booking_click · booking_complete
 *   generate_lead (any form) · estimate_request · contact_form_submit
 *   membership_inquiry · social_click
 */
import { track as vercelTrack } from '@vercel/analytics'

import { getAttribution } from './client'

type Params = Record<string, string | number | boolean | null | undefined>

declare global {
	interface Window {
		dataLayer?: unknown[]
		gtag?: (...args: unknown[]) => void
		fbq?: (...args: unknown[]) => void
		posthog?: { capture: (e: string, p?: object) => void; register: (p: object) => void }
	}
}

/** Meta's standard events for the ones that map cleanly. */
const META_STANDARD: Record<string, string> = {
	generate_lead: 'Lead',
	estimate_request: 'Lead',
	contact_form_submit: 'Lead',
	phone_click: 'Contact',
	email_click: 'Contact',
	sms_click: 'Contact',
	booking_complete: 'Schedule',
	membership_inquiry: 'Lead',
}

export function trackConversion(event: string, params: Params = {}) {
	if (typeof window === 'undefined') return
	const a = getAttribution()
	const enriched: Params = {
		...params,
		channel: a?.lastTouch.channel,
		first_channel: a?.firstTouch.channel,
		campaign: a?.lastTouch.campaign ?? undefined,
		rep: a?.rep ?? undefined,
		ref: a?.ref ?? undefined,
	}
	try {
		window.dataLayer = window.dataLayer || []
		window.dataLayer.push({ event, ...enriched })
	} catch {}
	try {
		window.gtag?.('event', event, enriched)
	} catch {}
	try {
		const std = META_STANDARD[event]
		if (window.fbq) {
			if (std) window.fbq('track', std, { content_name: event, ...params })
			else window.fbq('trackCustom', event, params)
		}
	} catch {}
	try {
		window.posthog?.capture(event, enriched)
	} catch {}
	try {
		const flat: Record<string, string | number | boolean | null> = {}
		for (const [k, v] of Object.entries(enriched)) if (v !== undefined) flat[k] = v
		vercelTrack(event, flat)
	} catch {}
}
