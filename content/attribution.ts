/**
 * ATTRIBUTION REGISTRY — the one file to edit when marketing changes.
 *
 * Every lead on this site answers one question: "Where did this person come
 * from?" This file is the dictionary that turns raw clues (a UTM tag, a
 * referring website, a rep's link, a QR code) into a clean channel name the
 * CRM can count and put money against.
 *
 * TO ADD…
 *  - a salesperson / canvasser → add a line to `reps`. Their links then work:
 *        covenantbuilders.org/r/<slug>      (always works)
 *        covenantbuilders.org/<slug>        (vanity form, if the slug is free)
 *        covenantbuilders.org/?rep=<slug>   (works on any page)
 *  - a referral partner or customer → add a line to `referralPartners`.
 *        covenantbuilders.org/ref/<slug>  or  ?ref=<slug>
 *    (Unlisted ref codes are still captured as typed — the list only adds a
 *    display name and partner type.)
 *  - a QR code / flyer / truck / yard sign → add a line to `qrCodes`.
 *        covenantbuilders.org/go/<code>  — short URL = a smaller, easier-to-scan QR.
 *  - a brand-new channel → add it to `channels`, then teach `sourceAliases`
 *    which utm_source values mean that channel.
 *  - a call-tracking number → add it to `trackingNumbers` (see comment there).
 *
 * Nothing here is secret. It ships to the browser.
 */

export type ChannelId =
	| 'google_organic'
	| 'google_ads'
	| 'google_business_profile'
	| 'facebook'
	| 'facebook_marketplace'
	| 'instagram'
	| 'craigslist'
	| 'nextdoor'
	| 'email'
	| 'sms'
	| 'door_to_door'
	| 'flyer_qr'
	| 'referral'
	| 'networking_event'
	| 'other_search'
	| 'other_website'
	| 'direct'
	| 'other_campaign'

export const channels: Record<ChannelId, { label: string; group: string }> = {
	google_organic: { label: 'Google Organic', group: 'Search' },
	google_ads: { label: 'Google Ads', group: 'Paid' },
	google_business_profile: { label: 'Google Business Profile', group: 'Search' },
	facebook: { label: 'Facebook', group: 'Social' },
	facebook_marketplace: { label: 'Facebook Marketplace', group: 'Social' },
	instagram: { label: 'Instagram', group: 'Social' },
	craigslist: { label: 'Craigslist', group: 'Classifieds' },
	nextdoor: { label: 'Nextdoor', group: 'Social' },
	email: { label: 'Email campaign', group: 'Owned' },
	sms: { label: 'SMS campaign', group: 'Owned' },
	door_to_door: { label: 'Door-to-door canvassing', group: 'Field' },
	flyer_qr: { label: 'Flyer / QR code', group: 'Field' },
	referral: { label: 'Referral', group: 'Referral' },
	networking_event: { label: 'Networking event', group: 'Field' },
	other_search: { label: 'Other search engine', group: 'Search' },
	other_website: { label: 'Other website', group: 'Referral' },
	direct: { label: 'Direct', group: 'Direct' },
	other_campaign: { label: 'Other campaign', group: 'Other' },
}

/**
 * utm_source (lower-cased) → channel. Put the tag you print on the link on the
 * left. Anything not listed falls back on utm_medium (see `mediumAliases`),
 * then to `other_campaign` — it is never lost, just filed under "other" with
 * its raw source kept.
 */
export const sourceAliases: Record<string, ChannelId> = {
	google: 'google_organic', // becomes google_ads when medium is cpc/ppc/paid or a gclid is present
	gbp: 'google_business_profile',
	gmb: 'google_business_profile',
	google_business: 'google_business_profile',
	googlebusiness: 'google_business_profile',
	facebook: 'facebook',
	fb: 'facebook',
	meta: 'facebook',
	marketplace: 'facebook_marketplace',
	fb_marketplace: 'facebook_marketplace',
	facebook_marketplace: 'facebook_marketplace',
	instagram: 'instagram',
	ig: 'instagram',
	craigslist: 'craigslist',
	cl: 'craigslist',
	nextdoor: 'nextdoor',
	email: 'email',
	newsletter: 'email',
	gmail: 'email',
	sms: 'sms',
	text: 'sms',
	doorhanger: 'door_to_door',
	door: 'door_to_door',
	canvass: 'door_to_door',
	knock: 'door_to_door',
	flyer: 'flyer_qr',
	qr: 'flyer_qr',
	truck: 'flyer_qr',
	yardsign: 'flyer_qr',
	yard_sign: 'flyer_qr',
	postcard: 'flyer_qr',
	mailer: 'flyer_qr',
	referral: 'referral',
	partner: 'referral',
	event: 'networking_event',
	networking: 'networking_event',
	rotary: 'networking_event',
	chamber: 'networking_event',
}

/** utm_medium fallback when utm_source is not recognised. */
export const mediumAliases: Record<string, ChannelId> = {
	cpc: 'google_ads',
	ppc: 'google_ads',
	paid_search: 'google_ads',
	email: 'email',
	sms: 'sms',
	text: 'sms',
	offline: 'flyer_qr',
	print: 'flyer_qr',
	qr: 'flyer_qr',
	canvass: 'door_to_door',
	door: 'door_to_door',
	referral: 'referral',
	event: 'networking_event',
	social: 'facebook',
}

/** Referring hostname fragment → channel, for visitors who arrive with no tags. */
export const referrerRules: { match: RegExp; channel: ChannelId }[] = [
	{ match: /(^|\.)business\.google\.com$/, channel: 'google_business_profile' },
	{ match: /(^|\.)(google)\.[a-z.]+$/, channel: 'google_organic' },
	{ match: /(^|\.)(bing|duckduckgo|yahoo|ecosia|brave)\.[a-z.]+$/, channel: 'other_search' },
	{ match: /(^|\.)(facebook|fb|messenger)\.com$|(^|\.)fb\.me$/, channel: 'facebook' },
	{ match: /(^|\.)instagram\.com$/, channel: 'instagram' },
	{ match: /(^|\.)craigslist\.org$/, channel: 'craigslist' },
	{ match: /(^|\.)nextdoor\.com$/, channel: 'nextdoor' },
	{ match: /(^|\.)(mail\.google|outlook\.live|mail\.yahoo)\.com$/, channel: 'email' },
]

/**
 * Salespeople and canvassers. `slug` is what goes in the link. Keep it short,
 * lower-case, letters/numbers/dashes. `defaultChannel` is what a lead from
 * their link counts as when the link carries no utm_source of its own.
 */
export const reps: { slug: string; name: string; defaultChannel: ChannelId }[] = [
	{ slug: 'josias', name: 'Josias Andujar', defaultChannel: 'door_to_door' },
]

/**
 * Referral partners and referring customers. Optional — any ?ref= code is
 * captured even if it is not listed. Listing adds a readable name and type.
 */
export const referralPartners: {
	slug: string
	name: string
	type: 'customer' | 'realtor' | 'insurance' | 'property_manager' | 'trade' | 'other'
}[] = []

/**
 * QR / offline codes. Each becomes covenantbuilders.org/go/<code> and expands
 * into full UTM tags server-side, so the printed QR stays small and you can
 * change where a code points without reprinting it.
 *
 * placement: neighborhood | canvasser | flyer | truck | yard_sign | event |
 *            referral_partner | doorhanger | postcard
 */
export const qrCodes: {
	code: string
	placement:
		| 'neighborhood'
		| 'canvasser'
		| 'flyer'
		| 'truck'
		| 'yard_sign'
		| 'event'
		| 'referral_partner'
		| 'doorhanger'
		| 'postcard'
	source: string
	medium: string
	campaign: string
	content?: string
	rep?: string
	ref?: string
	/** Page to land on. Defaults to the project designer. */
	to?: string
}[] = [
	{
		code: 'vb-roof',
		placement: 'doorhanger',
		source: 'doorhanger',
		medium: 'offline',
		campaign: 'vero_beach_roofing',
	},
	{
		code: 'truck',
		placement: 'truck',
		source: 'truck',
		medium: 'offline',
		campaign: 'truck_wrap',
	},
	{
		code: 'yard',
		placement: 'yard_sign',
		source: 'yard_sign',
		medium: 'offline',
		campaign: 'jobsite_yard_sign',
	},
]

/**
 * CALL TRACKING — ready, currently empty.
 *
 * When you buy tracking numbers (CallRail, Twilio, etc.), each one forwards to
 * the main line and is listed here against the channel it advertises. The site
 * then swaps the phone number it SHOWS to that channel's number for visitors
 * who arrived from that channel ("dynamic number insertion"), so the call
 * itself tells you the source. The CRM receives each call through
 * /api/calls/webhook (see docs/attribution.md).
 *
 * `number` is E.164 (+1772…). `display` is how it is printed.
 * Leave `channel` off for a number printed only on physical media (a truck, a
 * yard sign) — it is still recorded by the webhook, just never swapped in.
 */
export const trackingNumbers: {
	number: string
	display: string
	channel?: ChannelId
	campaign?: string
}[] = []

/** Paths the vanity form (/<rep-slug>) must never shadow. */
export const reservedTopLevelPaths = new Set([
	'about',
	'api',
	'community',
	'contact',
	'design-your-project',
	'go',
	'homeowner-programs',
	'investors',
	'play',
	'portfolio',
	'privacy',
	'r',
	'ref',
	'services',
	'storm-check',
	'sitemap.xml',
	'robots.txt',
	'_next',
])

/** How long a first touch is remembered (days). */
export const ATTRIBUTION_WINDOW_DAYS = 180
