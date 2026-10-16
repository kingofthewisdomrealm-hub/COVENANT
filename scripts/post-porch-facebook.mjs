#!/usr/bin/env node
/**
 * Posts Vero Porch and Sebastian Porch articles to the Covenant Builders
 * Facebook Page, each with its UTM-tagged link (so the traffic shows up on the
 * private attribution page). Run by .github/workflows/porch-facebook.yml.
 *
 * Each article JSON can carry:
 *   "facebook":   the post text (1–2 sentences, no link — the link is added)
 *   "facebookAt": when to post, America/New_York, "YYYY-MM-DDTHH:MM"
 * Defaults: text = dek; time = publish day 11:30 (Vero) / 17:30 (Sebastian).
 *
 * Times more than 10 minutes out become Facebook *scheduled* posts (Facebook
 * allows up to 30 days ahead; later ones are picked up by a later run). Times
 * already due are posted right away, if no more than LOOKBACK_DAYS late.
 *
 * Needs GitHub Actions secrets (without them it does nothing):
 *   FB_PAGE_ID     numeric id of the Facebook Page
 *   FB_PAGE_TOKEN  Page access token (pages_manage_posts, pages_read_engagement)
 *
 * Safe to run again and again: it reads the Page's recent and scheduled posts
 * first and skips any article whose link is already there. It only posts or
 * schedules once the article page is live (returns 200).
 *
 * Optional env: SLUG=<slug> (only this one, ignores lateness), DRY_RUN=1,
 * LOOKBACK_DAYS=2, WAIT_LIVE_MIN=8
 */
import fs from 'node:fs'
import path from 'node:path'

const SITE = 'https://covenantbuilders.org'
const GRAPH = 'https://graph.facebook.com/v21.0'
const EDITIONS = [
	{ key: 'vero', dir: 'porch-articles', base: '/porch', campaign: 'porch', defaultTime: '11:30' },
	{ key: 'sebastian', dir: 'sebastian-porch-articles', base: '/sebastian-porch', campaign: 'sebastian-porch', defaultTime: '17:30' },
]
const FILE_RE = /^(\d{4}-\d{2}-\d{2})--([a-z0-9-]+)\.json$/
const MIN_AHEAD = 10 * 60 * 1000
const MAX_AHEAD = 29 * 24 * 3600 * 1000

const { FB_PAGE_ID, FB_PAGE_TOKEN, SLUG } = process.env
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'
const LOOKBACK_DAYS = Number(process.env.LOOKBACK_DAYS || 2)
const WAIT_LIVE_MIN = Number(process.env.WAIT_LIVE_MIN ?? 8)
const HAVE_FB = Boolean(FB_PAGE_ID && FB_PAGE_TOKEN)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** "2026-10-16T11:30" in America/New_York → epoch ms */
function nyToEpoch(local) {
	const [d, t] = local.split('T')
	const [y, mo, da] = d.split('-').map(Number)
	const [h, mi] = t.split(':').map(Number)
	const guess = Date.UTC(y, mo - 1, da, h, mi)
	const name = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'shortOffset' })
		.formatToParts(new Date(guess))
		.find((p) => p.type === 'timeZoneName').value // e.g. GMT-4
	const off = Number(name.replace('GMT', '') || 0)
	return guess - off * 3600 * 1000
}
const fmt = (ms) =>
	new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' }).format(ms) + ' ET'

if (!DRY_RUN && !HAVE_FB) {
	console.log('::notice::FB_PAGE_ID / FB_PAGE_TOKEN secrets are not set — skipping Facebook posting.')
	process.exit(0)
}

const now = Date.now()

// 1. Candidates.
const candidates = []
for (const ed of EDITIONS) {
	const dir = path.join(process.cwd(), 'content', ed.dir)
	if (!fs.existsSync(dir)) continue
	for (const f of fs.readdirSync(dir).sort()) {
		if (!FILE_RE.test(f)) continue
		const a = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
		if (SLUG && a.slug !== SLUG) continue
		const when = nyToEpoch(a.facebookAt || `${a.publishedAt}T${ed.defaultTime}`)
		if (!SLUG && when < now - LOOKBACK_DAYS * 86400000) continue // old, assumed handled
		if (when > now + MAX_AHEAD) continue // too far out for Facebook; a later run gets it
		const campaign = `${ed.campaign}-${a.slug}`
		const pageUrl = `${SITE}${ed.base}/${a.slug}`
		const link = `${pageUrl}?utm_source=facebook&utm_medium=social&utm_campaign=${campaign}`
		const text = ((typeof a.facebook === 'string' && a.facebook.trim()) || a.dek).trim()
		candidates.push({ edition: ed.key, slug: a.slug, campaign, pageUrl, link, when, message: `${text}\n\n${link}` })
	}
}
candidates.sort((x, y) => x.when - y.when)
if (!candidates.length) {
	console.log('No articles due to post or schedule right now.')
	process.exit(0)
}

// 2. What is already on the Page (published and scheduled)?
async function graph(pathAndQuery, init) {
	const res = await fetch(`${GRAPH}/${pathAndQuery}`, init)
	const body = await res.json().catch(() => ({}))
	if (!res.ok || body.error) throw new Error(`Graph API ${res.status}: ${JSON.stringify(body.error ?? body)}`)
	return body
}
const tok = `access_token=${encodeURIComponent(FB_PAGE_TOKEN ?? '')}`
let onPage = ''
let canSchedule = true
if (HAVE_FB) {
	const posts = await graph(`${FB_PAGE_ID}/posts?fields=message&limit=100&${tok}`)
	onPage += (posts.data ?? []).map((p) => p.message ?? '').join('\n')
	try {
		const sched = await graph(`${FB_PAGE_ID}/scheduled_posts?fields=message&limit=100&${tok}`)
		onPage += '\n' + (sched.data ?? []).map((p) => p.message ?? '').join('\n')
	} catch (e) {
		// Without the scheduled list we could double-schedule, so only post what is due now.
		canSchedule = false
		console.log(`::warning::Could not read scheduled posts (${e.message}). Only posting what is due now.`)
	}
}

// 3. Post or schedule.
async function isLive(url) {
	try {
		return (await fetch(url, { redirect: 'follow' })).status === 200
	} catch {
		return false
	}
}
let failed = 0
for (const c of candidates) {
	const label = `${c.edition}/${c.slug}`
	if (onPage.includes(`utm_campaign=${c.campaign}`)) {
		console.log(`✓ already on the Page (posted or scheduled): ${label}`)
		continue
	}
	const scheduleIt = c.when > Date.now() + MIN_AHEAD
	if (scheduleIt && !canSchedule) continue
	let live = await isLive(c.pageUrl)
	for (let waited = 0; !live && waited < WAIT_LIVE_MIN; waited++) {
		console.log(`… ${c.pageUrl} not live yet, waiting a minute`)
		await sleep(60000)
		live = await isLive(c.pageUrl)
	}
	if (!live) {
		console.log(`::warning::${c.pageUrl} is not live yet — the next run will try again.`)
		continue
	}
	const what = scheduleIt ? `schedule for ${fmt(c.when)}` : 'post now'
	if (DRY_RUN) {
		console.log(`[dry run] ${what}: ${label}\n${c.message}\n`)
		continue
	}
	try {
		const params = { message: c.message, link: c.link, access_token: FB_PAGE_TOKEN }
		if (scheduleIt) Object.assign(params, { published: 'false', scheduled_publish_time: String(Math.floor(c.when / 1000)) })
		const out = await graph(`${FB_PAGE_ID}/feed`, { method: 'POST', body: new URLSearchParams(params) })
		console.log(`✔ ${scheduleIt ? `scheduled for ${fmt(c.when)}` : 'posted'}: ${label} (post id ${out.id})`)
	} catch (e) {
		failed++
		console.log(`::error::Could not ${what} ${label}: ${e.message}`)
	}
}
process.exit(failed ? 1 : 0)
