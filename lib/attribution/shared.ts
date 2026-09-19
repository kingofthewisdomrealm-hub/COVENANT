/**
 * Attribution types + the channel classifier. Runs in the browser, the
 * middleware (edge) and server actions, so it imports nothing heavier than zod
 * and the registry.
 */
import { z } from 'zod'

import {
	channels,
	mediumAliases,
	referralPartners,
	referrerRules,
	reps,
	sourceAliases,
	type ChannelId,
} from '@/content/attribution'

export const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'] as const
export const UTM_KEYS = [
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_content',
	'utm_term',
] as const

/** One arrival: the clues present when a visitor landed. */
export type Touch = {
	channel: ChannelId
	source: string | null
	medium: string | null
	campaign: string | null
	content: string | null
	term: string | null
	landingPage: string
	referrer: string | null
	clickIds: Partial<Record<(typeof CLICK_ID_KEYS)[number], string>>
	rep: string | null
	ref: string | null
	qr: string | null
	at: string
}

/** What the browser keeps and every form sends. */
export type Attribution = {
	v: 1
	visitorId: string
	firstTouch: Touch
	lastTouch: Touch
	firstPage: string
	pagesViewed: number
	/** Rep credited: most recent rep link seen, else the first. */
	rep: string | null
	/** Referral code credited, same rule. */
	ref: string | null
}

const clean = (value: string | null | undefined, max = 200) => {
	if (!value) return null
	const trimmed = value.trim().slice(0, max)
	return trimmed.length ? trimmed : null
}

const slug = (value: string | null | undefined) => {
	const v = clean(value, 60)?.toLowerCase().replace(/[^a-z0-9_-]/g, '')
	return v || null
}

/**
 * Decide the channel for one arrival. Order matters and is deliberate:
 *   1. Paid click ids beat everything (gclid = Google Ads, fbclid+paid = FB ads).
 *   2. Explicit utm_source we recognise.
 *   3. utm_medium we recognise.
 *   4. Any utm_source at all → other_campaign (kept raw, never lost).
 *   5. A rep link / referral code with no tags.
 *   6. The referring website.
 *   7. Nothing → direct.
 */
export function classifyChannel(input: {
	source: string | null
	medium: string | null
	clickIds: Touch['clickIds']
	referrer: string | null
	rep: string | null
	ref: string | null
	siteHost?: string
}): ChannelId {
	const source = input.source?.toLowerCase() ?? null
	const medium = input.medium?.toLowerCase() ?? null
	const paidMedium = medium ? /^(cpc|ppc|paid|paid_search|paidsearch)$/.test(medium) : false

	if (input.clickIds.gclid || input.clickIds.gbraid || input.clickIds.wbraid) return 'google_ads'

	if (source) {
		const mapped = sourceAliases[source]
		if (mapped === 'google_organic' && paidMedium) return 'google_ads'
		if (mapped) return mapped
	}
	if (medium && mediumAliases[medium]) return mediumAliases[medium]
	if (source) return 'other_campaign'

	if (input.ref) return 'referral'
	if (input.rep) {
		return reps.find((r) => r.slug === input.rep)?.defaultChannel ?? 'door_to_door'
	}

	if (input.referrer) {
		try {
			const host = new URL(input.referrer).hostname.toLowerCase()
			if (input.siteHost && (host === input.siteHost || host.endsWith(`.${input.siteHost}`))) {
				return 'direct'
			}
			for (const rule of referrerRules) if (rule.match.test(host)) return rule.channel
			return 'other_website'
		} catch {
			/* malformed referrer — fall through */
		}
	}
	if (input.clickIds.fbclid) return 'facebook'
	return 'direct'
}

/** Build a Touch from a URL + referrer. Pure; used by the browser capture. */
export function touchFromUrl(url: URL, referrer: string | null, siteHost: string): Touch {
	const p = url.searchParams
	const clickIds: Touch['clickIds'] = {}
	for (const key of CLICK_ID_KEYS) {
		const v = clean(p.get(key), 300)
		if (v) clickIds[key] = v
	}
	const source = clean(p.get('utm_source'))
	const medium = clean(p.get('utm_medium'))
	const rep = slug(p.get('rep'))
	const ref = slug(p.get('ref'))
	const externalReferrer = (() => {
		if (!referrer) return null
		try {
			const host = new URL(referrer).hostname.toLowerCase()
			return host === siteHost || host.endsWith(`.${siteHost}`) ? null : clean(referrer, 500)
		} catch {
			return null
		}
	})()

	return {
		channel: classifyChannel({ source, medium, clickIds, referrer: externalReferrer, rep, ref, siteHost }),
		source,
		medium,
		campaign: clean(p.get('utm_campaign')),
		content: clean(p.get('utm_content')),
		term: clean(p.get('utm_term')),
		landingPage: clean(url.pathname + url.search, 500) ?? '/',
		referrer: externalReferrer,
		clickIds,
		rep,
		ref,
		qr: slug(p.get('qr')),
		at: new Date().toISOString(),
	}
}

/** True when this arrival carries any marketing signal worth recording. */
export function isMeaningfulTouch(t: Touch) {
	return Boolean(
		t.source ||
			t.medium ||
			t.campaign ||
			t.rep ||
			t.ref ||
			t.qr ||
			t.referrer ||
			Object.keys(t.clickIds).length
	)
}

/* ---------------- server-side validation ---------------- */

const s = (max = 200) => z.string().max(max).nullable().optional()
const channelIds = Object.keys(channels) as [ChannelId, ...ChannelId[]]

const touchSchema = z.object({
	channel: z.enum(channelIds).catch('other_campaign'),
	source: s(),
	medium: s(),
	campaign: s(),
	content: s(),
	term: s(),
	landingPage: s(500),
	referrer: s(500),
	clickIds: z.record(z.string().max(300)).optional(),
	rep: s(60),
	ref: s(60),
	qr: s(60),
	at: s(40),
})

/**
 * Forms send attribution alongside the lead. `.catch(undefined)` means a
 * malformed or tampered payload is DROPPED, never allowed to reject the lead.
 */
export const attributionSchema = z
	.object({
		v: z.literal(1),
		visitorId: z.string().max(64),
		firstTouch: touchSchema,
		lastTouch: touchSchema,
		firstPage: z.string().max(500),
		pagesViewed: z.number().int().min(0).max(100000),
		rep: s(60),
		ref: s(60),
	})
	.optional()
	.catch(undefined)

export type ValidAttribution = NonNullable<z.infer<typeof attributionSchema>>

export const channelLabel = (id: string | null | undefined) =>
	(id && channels[id as ChannelId]?.label) || id || 'Unknown'

export const repName = (repSlug: string | null | undefined) =>
	(repSlug && reps.find((r) => r.slug === repSlug)?.name) || repSlug || null

export const referralName = (refSlug: string | null | undefined) =>
	(refSlug && referralPartners.find((r) => r.slug === refSlug)?.name) || refSlug || null

/** Plain-text block appended to every lead email. */
export function attributionEmailLines(a: ValidAttribution | undefined): string[] {
	if (!a) return ['', '--- Where this lead came from ---', 'Not captured (browser blocked storage or scripts).']
	const t = (x: z.infer<typeof touchSchema>) =>
		[
			channelLabel(x.channel),
			x.source && `source=${x.source}`,
			x.medium && `medium=${x.medium}`,
			x.campaign && `campaign=${x.campaign}`,
			x.content && `content=${x.content}`,
			x.term && `term=${x.term}`,
			x.qr && `qr=${x.qr}`,
		]
			.filter(Boolean)
			.join(' · ')
	return [
		'',
		'--- Where this lead came from ---',
		`First touch: ${t(a.firstTouch)}  (${a.firstTouch.at ?? '?'})`,
		`Last touch:  ${t(a.lastTouch)}  (${a.lastTouch.at ?? '?'})`,
		a.rep ? `Rep credited: ${repName(a.rep)}` : '',
		a.ref ? `Referred by: ${referralName(a.ref)}` : '',
		`Landing page: ${a.firstTouch.landingPage ?? '?'}`,
		a.firstTouch.referrer ? `Referring URL: ${a.firstTouch.referrer}` : '',
		`Pages viewed before submitting: ${a.pagesViewed}`,
	].filter((line) => line !== '')
}
