import {
	type CountyKey,
	type StormEvent,
	countyForZip,
	eventsForZip,
} from '@/content/storm-check'

/**
 * Live NWS Local Storm Reports via Iowa Environmental Mesonet.
 *
 * This is a feed, not a guess. If IEM is down we fall back to the curated
 * table in content/storm-check.ts. We never invent an event.
 *
 * Cache for an hour. Filter to Treasure Coast counties + hail/wind/tornado.
 */

const IEM_URL = 'https://mesonet.agron.iastate.edu/geojson/lsr.geojson'
const USER_AGENT =
	'CovenantBuildersStormCheck/1.0 (https://covenantbuilders.org/storm-check)'
const LOOKBACK_MS = 1000 * 60 * 60 * 24 * 730
const MAX_EVENTS_PER_COUNTY = 5

const KEEP_TYPES = new Set([
	'HAIL',
	'TSTM WND GST',
	'TSTM WND DMG',
	'NON-TSTM WND GST',
	'NON-TSTM WND DMG',
	'TORNADO',
])

const COUNTY_ALIASES: Record<string, CountyKey> = {
	'indian river': 'indian-river',
	'st. lucie': 'st-lucie',
	'st lucie': 'st-lucie',
	'saint lucie': 'st-lucie',
	martin: 'martin',
	'palm beach': 'palm-beach',
	okeechobee: 'okeechobee',
	brevard: 'brevard',
}

type IemProperties = {
	valid?: string
	typetext?: string
	county?: string
	city?: string
	magnitude?: string | number | null
	magf?: number | null
	unit?: string | null
	remark?: string
	wfo?: string
	source?: string
	state?: string
}

function countyKeyFromIem(name: string | undefined): CountyKey | null {
	if (!name) return null
	return COUNTY_ALIASES[name.trim().toLowerCase()] ?? null
}

function kindFromType(typetext: string): StormEvent['kind'] {
	if (typetext === 'HAIL') return 'hail'
	if (typetext === 'TORNADO') return 'hurricane'
	return 'wind'
}

function formatDay(iso: string) {
	const date = new Date(iso)
	if (Number.isNaN(date.getTime())) return iso.slice(0, 10)
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(date)
}

function labelFor(typetext: string, iso: string) {
	const day = formatDay(iso)
	if (typetext === 'HAIL') return `${day} hail`
	if (typetext === 'TORNADO') return `${day} tornado`
	return `${day} wind`
}

function detailFor(props: IemProperties) {
	const city = props.city?.trim()
	const mag = props.magf ?? (props.magnitude ? Number(props.magnitude) : null)
	const unit = props.unit?.trim()
	const type = props.typetext || 'Storm report'
	const bits = [type.toLowerCase()]
	if (Number.isFinite(mag) && mag && mag > 0) {
		bits.push(`(${mag}${unit ? ` ${unit.toLowerCase()}` : ''})`)
	}
	if (city) bits.push(`near ${city}`)
	const remark = props.remark?.trim()
	if (remark) return `${bits.join(' ')}. ${remark}`.slice(0, 280)
	return `${bits.join(' ')}.`
}

function cluster(reports: IemProperties[]): StormEvent[] {
	const groups = new Map<string, IemProperties[]>()
	for (const report of reports) {
		const county = countyKeyFromIem(report.county)
		const day = (report.valid || '').slice(0, 10)
		const type = report.typetext || ''
		if (!county || !day || !type) continue
		const key = `${day}|${county}|${type}`
		const list = groups.get(key) || []
		list.push(report)
		groups.set(key, list)
	}

	const events: StormEvent[] = []
	for (const [key, list] of groups) {
		const county = key.split('|')[1] as CountyKey
		const best = list.slice().sort((a, b) => {
			const am = Number(a.magf ?? a.magnitude ?? 0)
			const bm = Number(b.magf ?? b.magnitude ?? 0)
			return bm - am
		})[0]
		const valid = best.valid || ''
		const typetext = best.typetext || 'HAIL'
		events.push({
			date: valid.slice(0, 10),
			label: labelFor(typetext, valid),
			kind: kindFromType(typetext),
			detail: detailFor(best),
			counties: [county],
			source: `National Weather Service Local Storm Report (${best.wfo || 'NWS'}) via Iowa Environmental Mesonet`,
		})
	}

	events.sort((a, b) => b.date.localeCompare(a.date))
	return events
}

async function fetchIemReports(): Promise<StormEvent[]> {
	const ets = new Date()
	const sts = new Date(ets.getTime() - LOOKBACK_MS)
	const params = new URLSearchParams({
		wfos: 'MLB,MFL',
		sts: sts.toISOString().replace(/\.\d{3}Z$/, 'Z'),
		ets: ets.toISOString().replace(/\.\d{3}Z$/, 'Z'),
	})

	const response = await fetch(`${IEM_URL}?${params.toString()}`, {
		headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
		next: { revalidate: 3600 },
	})

	if (!response.ok) {
		throw new Error(`IEM LSR ${response.status}`)
	}

	const body = (await response.json()) as {
		features?: Array<{ properties?: IemProperties }>
	}

	const raw: IemProperties[] = []
	for (const feature of body.features || []) {
		const props = feature.properties
		if (!props) continue
		if ((props.state || '').toUpperCase() !== 'FL') continue
		if (!KEEP_TYPES.has(props.typetext || '')) continue
		if (!countyKeyFromIem(props.county)) continue
		raw.push(props)
	}

	return cluster(raw)
}

let memory: { at: number; events: StormEvent[] } | null = null
const MEMORY_MS = 60 * 60 * 1000

export async function loadLiveStormEvents(): Promise<StormEvent[]> {
	if (memory && Date.now() - memory.at < MEMORY_MS) return memory.events
	try {
		const events = await fetchIemReports()
		memory = { at: Date.now(), events }
		return events
	} catch (error) {
		console.error('IEM storm-report fetch failed:', error)
		return []
	}
}

export function mergeStormEvents(
	curated: readonly StormEvent[],
	live: readonly StormEvent[]
): StormEvent[] {
	const seen = new Set<string>()
	const out: StormEvent[] = []
	for (const event of [...live, ...curated]) {
		const key = `${event.date}|${event.kind}|${event.counties.join(',')}`
		if (seen.has(key)) continue
		seen.add(key)
		out.push(event)
	}
	out.sort((a, b) => b.date.localeCompare(a.date))
	return out
}

export async function stormEventsForZip(zip: string): Promise<StormEvent[]> {
	const county = countyForZip(zip)
	const curated = eventsForZip(zip)
	if (!county) return curated
	const live = await loadLiveStormEvents()
	const forCounty = live.filter((event) => event.counties.includes(county))
	return mergeStormEvents(curated, forCounty).slice(0, MAX_EVENTS_PER_COUNTY)
}
