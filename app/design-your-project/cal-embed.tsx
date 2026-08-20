'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { track } from '@vercel/analytics'
import { useEffect, useState } from 'react'

import { siteConfig } from '@/content/site'

/**
 * Inline Cal.com booking calendar for the project designer's results screen.
 *
 * WHY THE OFFICIAL PACKAGE AND NOT A <script> TAG.
 * Cal's embed.js does NOT define `window.Cal` by itself — it drains a queue
 * that Cal's inline snippet has to create first. Loading the script and then
 * calling `Cal(...)` looks correct, compiles, and fails silently in the
 * browser with `window.Cal` undefined. This was verified by hand against the
 * real script before this file was written. `@calcom/embed-react` owns that
 * bootstrap, so it cannot be got wrong here.
 *
 * DEGRADES ON PURPOSE. This is the highest-intent screen on the site; a third
 * party being slow or down must never leave a finished brief with no way to
 * reach us. Anything other than a successful embed falls back to the phone
 * number, which is also what renders when `siteConfig.booking.calLink` is
 * empty. That makes an unset or wrong link a no-op rather than a broken page.
 */

const LOAD_TIMEOUT_MS = 9000

export function CalEmbed({ calLink }: { calLink: string }) {
	const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>(
		calLink ? 'loading' : 'failed'
	)

	useEffect(() => {
		if (!calLink) return

		let cancelled = false

		const timeout = window.setTimeout(() => {
			if (!cancelled) setStatus('failed')
		}, LOAD_TIMEOUT_MS)

		;(async () => {
			try {
				const api = await getCalApi()
				if (cancelled) return
				api('on', {
					action: 'linkReady',
					callback: () => {
						if (cancelled) return
						window.clearTimeout(timeout)
						setStatus('ready')
					},
				})
				api('on', {
					action: 'bookingSuccessful',
					callback: () => track('design_book_walkthrough'),
				})
			} catch {
				if (!cancelled) setStatus('failed')
			}
		})()

		return () => {
			cancelled = true
			window.clearTimeout(timeout)
		}
	}, [calLink])

	if (!calLink || status === 'failed') {
		return (
			<div className="mt-6 flex flex-wrap items-center gap-4">
				{calLink ? (
					<a
						href={`https://cal.com/${calLink}`}
						target="_blank"
						rel="noopener noreferrer"
						className="btn-primary"
						onClick={() => track('design_book_walkthrough')}
					>
						Book my walkthrough
					</a>
				) : null}
				<a
					href={siteConfig.phones.sr.href}
					className={calLink ? 'link-underline' : 'btn-primary'}
					onClick={() => track('design_book_walkthrough')}
				>
					Call {siteConfig.phones.sr.display}
				</a>
				<span className="font-sans text-sm text-stone-muted">
					{calLink
						? 'Whichever is easier.'
						: `Or wait for us — ${siteConfig.responseExpectation.toLowerCase()}`}
				</span>
			</div>
		)
	}

	return (
		<div className="mt-6">
			<div className="overflow-hidden border border-navy/10 bg-white">
				<Cal
					calLink={calLink}
					style={{ width: '100%', height: '100%', minHeight: 420, overflow: 'scroll' }}
					config={{ layout: 'month_view' }}
				/>
			</div>
			{status === 'loading' ? (
				<p className="mt-3 font-sans text-sm text-stone-muted" role="status">
					Loading available times…
				</p>
			) : null}
			<p className="mt-4 font-sans text-sm text-stone-muted">
				Prefer to talk first? Call{' '}
				<a
					className="text-navy underline underline-offset-4"
					href={siteConfig.phones.sr.href}
				>
					{siteConfig.phones.sr.display}
				</a>
				.
			</p>
		</div>
	)
}
