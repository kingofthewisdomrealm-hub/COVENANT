'use client'

/**
 * Invisible. Mounted once in the root layout. Three jobs:
 *   1. Record every page view into first/last-touch attribution.
 *   2. Turn clicks on phone / email / SMS / booking links into conversion
 *      events — site-wide, with no per-link wiring. Any element can also opt
 *      in with data-track="event_name".
 *   3. Dynamic number insertion: if a call-tracking number is registered for
 *      the visitor's channel, show that number instead of the main line.
 *      (No-op while `trackingNumbers` in content/attribution.ts is empty.)
 */
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

import { trackingNumbers } from '@/content/attribution'
import { siteConfig } from '@/content/site'
import { captureAttribution } from '@/lib/attribution/client'
import { trackConversion } from '@/lib/attribution/events'

function eventForLink(anchor: HTMLAnchorElement): string | null {
	const href = anchor.getAttribute('href') || ''
	if (href.startsWith('tel:')) return 'phone_click'
	if (href.startsWith('mailto:')) return 'email_click'
	if (href.startsWith('sms:')) return 'sms_click'
	if (/^https?:\/\/(www\.)?cal\.com\//.test(href)) return 'booking_click'
	if (/facebook\.com|instagram\.com|nextdoor\.com|linkedin\.com|youtube\.com/.test(href)) {
		return 'social_click'
	}
	return null
}

function swapTrackingNumber(channel: string | undefined) {
	if (!channel || trackingNumbers.length === 0) return
	const match = trackingNumbers.find((n) => n.channel === channel)
	if (!match) return
	const main = siteConfig.phones.sr
	document.querySelectorAll<HTMLAnchorElement>(`a[href="${main.href}"]`).forEach((a) => {
		a.setAttribute('href', `tel:${match.number}`)
		a.dataset.trackingNumber = match.number
		if (a.textContent?.includes(main.display)) {
			a.textContent = a.textContent.replace(main.display, match.display)
		}
	})
}

function PageViewCapture() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const search = searchParams?.toString()

	useEffect(() => {
		const a = captureAttribution()
		const channel = a?.lastTouch.channel
		// Tag this visitor in PostHog so heatmaps/replays split by source.
		try {
			if (a) {
				window.posthog?.register({
					first_channel: a.firstTouch.channel,
					last_channel: a.lastTouch.channel,
					campaign: a.lastTouch.campaign ?? a.firstTouch.campaign,
					rep: a.rep,
					ref: a.ref,
				})
			}
		} catch {}
		swapTrackingNumber(channel)
		// Re-run once after late-rendering sections mount.
		const t = window.setTimeout(() => swapTrackingNumber(channel), 800)
		return () => window.clearTimeout(t)
	}, [pathname, search])

	return null
}

export function AttributionTracker() {
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			const target = e.target as Element | null
			if (!target?.closest) return
			const tagged = target.closest<HTMLElement>('[data-track]')
			if (tagged?.dataset.track) {
				trackConversion(tagged.dataset.track, {
					label: tagged.dataset.trackLabel || tagged.textContent?.trim().slice(0, 80),
					page: location.pathname,
				})
				return
			}
			const anchor = target.closest('a')
			if (!anchor) return
			const event = eventForLink(anchor)
			if (!event) return
			trackConversion(event, {
				link: anchor.getAttribute('href')?.slice(0, 120),
				label: anchor.textContent?.trim().slice(0, 80),
				page: location.pathname,
				tracking_number: anchor.dataset.trackingNumber,
			})
		}
		document.addEventListener('click', onClick, { capture: true })
		return () => document.removeEventListener('click', onClick, { capture: true })
	}, [])

	return (
		<Suspense fallback={null}>
			<PageViewCapture />
		</Suspense>
	)
}
