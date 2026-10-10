#!/usr/bin/env node
/**
 * Validates every Porch article folder. Run: npm run porch:check
 *   content/porch-articles/            The Vero Porch
 *   content/sebastian-porch-articles/  The Sebastian Porch
 *   content/psl-porch-articles/        The PSL Porch
 *   content/orlando-balcony-articles/  The Orlando Balcony
 * Exits non-zero on any problem so a bad article never ships.
 */
import fs from 'node:fs'
import path from 'node:path'

const FILE_RE = /^(\d{4}-\d{2}-\d{2})--([a-z0-9-]+)\.json$/
const SHARED = ['Bills & utilities', 'Taxes & money', 'Storms & safety', 'Permits & rules', 'Home care', 'Condos & HOAs', 'Around town']
const EDITIONS = [
	{ name: 'Vero Porch', dir: 'porch-articles', categories: [...SHARED, 'Vero history'] },
	{ name: 'Sebastian Porch', dir: 'sebastian-porch-articles', categories: [...SHARED, 'Sebastian history'] },
	{ name: 'PSL Porch', dir: 'psl-porch-articles', categories: [...SHARED, 'PSL history'] },
	{ name: 'Orlando Balcony', dir: 'orlando-balcony-articles', categories: [...SHARED, 'Orlando history'] },
]
const BLOCK_TYPES = ['p', 'h2', 'ul', 'ol', 'callout']
// F.S. 489.147 — never encourage contacting us about an insurance claim.
const BANNED = [/file (a|your) claim/i, /insurance claim/i, /deductible/i, /free roof/i, /we work with (all )?insurance/i, /gift card/i, /rebate/i]

const errors = []
const counts = []
for (const ed of EDITIONS) {
const DIR = path.join(process.cwd(), 'content', ed.dir)
const CATEGORIES = ed.categories
const slugs = new Map()
const titles = new Map()
const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.json')) : []
counts.push(`${files.length} ${ed.name}`)

for (const f of files) {
	const where = `content/${ed.dir}/${f}`
	const m = FILE_RE.exec(f)
	if (!m) {
		errors.push(`${where}: file name must be YYYY-MM-DD--slug.json`)
		continue
	}
	let a
	try {
		a = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))
	} catch (e) {
		errors.push(`${where}: invalid JSON (${e.message})`)
		continue
	}
	const need = (cond, msg) => cond || errors.push(`${where}: ${msg}`)
	need(a.slug === m[2], `slug must equal the file name part "${m[2]}"`)
	need(a.publishedAt === m[1], `publishedAt must equal the file date ${m[1]}`)
	need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug ?? ''), 'slug: lowercase words joined by hyphens')
	need(typeof a.title === 'string' && a.title.length >= 20 && a.title.length <= 110, 'title: 20–110 characters')
	need(!a.seoTitle || a.seoTitle.length <= 60, 'seoTitle: at most 60 characters')
	need(typeof a.description === 'string' && a.description.length >= 110 && a.description.length <= 160, `description: 110–160 characters (has ${a.description?.length})`)
	need(typeof a.dek === 'string' && a.dek.length >= 30, 'dek: one full sentence')
	need(CATEGORIES.includes(a.category), `category must be one of: ${CATEGORIES.join(' | ')}`)
	need(Array.isArray(a.places) && a.places.length > 0, 'places: at least one')
	need(Array.isArray(a.keywords) && a.keywords.length >= 3, 'keywords: at least 3')
	need(Array.isArray(a.sources) && a.sources.length >= 2, 'sources: at least 2')
	for (const s of a.sources ?? []) need(/^https:\/\//.test(s.url) && s.label, `source needs https url + label: ${JSON.stringify(s)}`)
	need(Array.isArray(a.body) && a.body.length >= 5, 'body: at least 5 blocks')
	let words = 0
	let h2 = 0
	for (const b of a.body ?? []) {
		need(BLOCK_TYPES.includes(b.type), `unknown block type ${b.type}`)
		const text = b.items ? b.items.join(' ') : `${b.title ?? ''} ${b.text ?? ''}`
		words += text.split(/\s+/).filter(Boolean).length
		if (b.type === 'h2') h2++
	}
	need(words >= 450, `body too thin: ${words} words (min 450)`)
	need(h2 >= 2, 'body: at least 2 h2 subheads')
	const all = JSON.stringify(a)
	for (const re of BANNED) need(!re.test(all), `banned phrase (F.S. 489.147 / promo): ${re}`)
	need(!/lorem|TODO|TBD|\[YOUR/i.test(all), 'placeholder text found')
	if (slugs.has(a.slug)) errors.push(`${where}: duplicate slug, also in ${slugs.get(a.slug)}`)
	slugs.set(a.slug, f)
	const t = (a.title ?? '').toLowerCase()
	if (titles.has(t)) errors.push(`${where}: duplicate title, also in ${titles.get(t)}`)
	titles.set(t, f)
}
}

if (errors.length) {
	console.error(`✖ ${errors.length} problem(s):\n- ` + errors.join('\n- '))
	process.exit(1)
}
console.log(`✔ articles OK: ${counts.join(', ')}`)
