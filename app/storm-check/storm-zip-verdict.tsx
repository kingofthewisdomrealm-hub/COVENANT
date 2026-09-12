'use client'

import { useEffect, useState } from 'react'

import {
	COUNTY_NAMES,
	type StormEvent,
	countyForZip,
	eventsForZip,
} from '@/content/storm-check'

/**
 * ZIP payoff on step 1. Talks to /api/storm-reports so the first answer
 * is a live NWS Local Storm Report, not only the two-event hand table.
 * Falls back to the curated table if the feed is empty or down.
 */
export function StormZipVerdict({ zip }: { zip: string }) {
	const county = countyForZip(zip)
	const curated = eventsForZip(zip)
	const [live, setLive] = useState<StormEvent[] | null>(null)
	const [status, setStatus] = useState<'loading' | 'ready'>('loading')

	useEffect(() => {
		let cancelled = false
		setStatus('loading')
		fetch(`/api/storm-reports?zip=${zip}`)
			.then((response) => response.json())
			.then((payload: { events?: StormEvent[] }) => {
				if (cancelled) return
				setLive(payload.events || [])
				setStatus('ready')
			})
			.catch(() => {
				if (cancelled) return
				setLive([])
				setStatus('ready')
			})
		return () => {
			cancelled = true
		}
	}, [zip])

	if (!county) {
		return (
			<p className="border border-navy/10 bg-stone px-4 py-3 font-sans text-sm text-stone-muted">
				{zip} is outside the counties we track. You can still finish the check —
				we just cannot match a recorded storm to it.
			</p>
		)
	}

	if (status === 'loading') {
		return (
			<p className="border border-navy/10 bg-stone px-4 py-3 font-sans text-sm text-stone-muted">
				{COUNTY_NAMES[county]}. Checking official National Weather Service storm
				reports…
			</p>
		)
	}

	const events = live && live.length ? live : curated
	if (events.length === 0) {
		return (
			<p className="border border-navy/10 bg-stone px-4 py-3 font-sans text-sm text-stone-muted">
				{COUNTY_NAMES[county]}. No recorded hail, wind or tornado report on file
				for your county in the last two years.
			</p>
		)
	}

	const latest = events[0]
	return (
		<p className="border border-sand-dark/40 bg-sand/10 px-4 py-3 font-sans text-sm leading-relaxed text-navy">
			<strong>{COUNTY_NAMES[county]} — yes.</strong> {latest.label}: {latest.detail}
			{events.length > 1 ? ` Plus ${events.length - 1} more on record.` : ''}
		</p>
	)
}
