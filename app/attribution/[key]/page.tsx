/**
 * PRIVATE attribution page on the website.
 *
 *   covenantbuilders.org/attribution/<ATTRIBUTION_SECRET>
 *
 * No login, no password box. The key in the address IS the lock: the page
 * 404s for any other key, robots are told to stay away, nothing links here,
 * and search engines never see it. Share the link only with people who may
 * see revenue.
 *
 * Data comes from one call to the CRM's `attribution_report` function
 * (crm-patch/attribution/attribution_step2.sql), which checks the same key
 * server-side, so the site's anon key alone can read nothing.
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

import { channels, reps, type ChannelId } from '@/content/attribution'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
	title: 'Attribution',
	robots: { index: false, follow: false, nocache: true },
}

type Row = { channel: string; leads: number; appointments: number; contracts: number; revenue: number }
type Report = {
	generated_at: string
	days: number
	funnel: Row[]
	by_rep: (Row & { rep: string; name: string | null })[]
	by_campaign: (Row & { campaign: string | null; qr: string | null })[]
	by_referral: { ref: string; name: string | null; leads: number; contracts: number; revenue: number }[]
	recent: {
		at: string
		name: string
		status: string
		channel: string | null
		last_channel: string | null
		campaign: string | null
		rep: string | null
		ref: string | null
	}[]
	web: {
		views_by_channel: { channel: string; views: number; visitors: number }[]
		clicks_by_event: { event: string; clicks: number }[]
		clicks_by_channel: { channel: string; event: string; clicks: number }[]
		top_pages: { page: string; views: number }[]
		top_clicked: { page: string; label: string | null; event: string; clicks: number }[]
		daily: { day: string; views: number; clicks: number; leads: number }[]
	}
}

const RANGES = [
	{ key: '30', label: '30 days', days: 30 },
	{ key: '90', label: '90 days', days: 90 },
	{ key: '365', label: '12 months', days: 365 },
	{ key: 'all', label: 'All time', days: 0 },
]

const EVENT_LABELS: Record<string, string> = {
	phone_click: 'Phone taps',
	email_click: 'Email clicks',
	sms_click: 'Text clicks',
	booking_click: 'Booking clicks',
	booking_complete: 'Walkthroughs booked',
	generate_lead: 'Forms sent',
	estimate_request: 'Estimate requests',
	contact_form_submit: 'Contact forms',
	social_click: 'Social clicks',
	membership_inquiry: 'Membership inquiries',
}

const chLabel = (c: string | null | undefined) =>
	(c && channels[c as ChannelId]?.label) || (c ? c.replace(/_/g, ' ') : 'Unknown')
const repName = (slug: string | null | undefined, fallback?: string | null) =>
	fallback || reps.find((r) => r.slug === slug)?.name || slug || '—'
const money = (n: number) =>
	Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : '—')
const n = (v: number | string | null | undefined) => Number(v ?? 0) || 0

async function loadReport(secret: string, days: number): Promise<Report | { error: string }> {
	const url = process.env.SUPABASE_URL
	const key = process.env.SUPABASE_PUBLISHABLE_KEY
	if (!url || !key) return { error: 'The CRM connection is not configured on this site.' }
	const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
	const { data, error } = await supabase.rpc('attribution_report', { p_secret: secret, p_days: days })
	if (error) {
		return {
			error: /attribution_report|does not exist/i.test(error.message)
				? 'Step 2 SQL has not been run in the CRM yet (crm-patch\\attribution\\attribution_step2.sql).'
				: /unauthorized/i.test(error.message)
					? 'The key in Vercel (ATTRIBUTION_SECRET) does not match the key stored in the CRM.'
					: error.message,
		}
	}
	return data as Report
}

export default async function AttributionPage({
	params,
	searchParams,
}: {
	params: { key: string }
	searchParams: { range?: string }
}) {
	const secret = process.env.ATTRIBUTION_SECRET?.trim()
	if (!secret || secret.length < 12 || params.key !== secret) notFound()

	const range = RANGES.find((r) => r.key === searchParams.range) ?? RANGES[1]
	const report = await loadReport(secret, range.days)

	if ('error' in report) {
		return (
			<div className="section-shell py-16">
				<h1 className="display-title">Attribution</h1>
				<p className="mt-4 border border-red-200 bg-red-50 p-4 font-sans text-sm text-red-800">{report.error}</p>
			</div>
		)
	}

	const totals = report.funnel.reduce(
		(t, r) => ({
			leads: t.leads + n(r.leads),
			appts: t.appts + n(r.appointments),
			contracts: t.contracts + n(r.contracts),
			revenue: t.revenue + n(r.revenue),
		}),
		{ leads: 0, appts: 0, contracts: 0, revenue: 0 }
	)
	const best = report.funnel.find((r) => n(r.revenue) > 0)
	const views = report.web.views_by_channel.reduce((s, r) => s + n(r.views), 0)
	const visitors = report.web.views_by_channel.reduce((s, r) => s + n(r.visitors), 0)
	const clicks = report.web.clicks_by_event.reduce((s, r) => s + n(r.clicks), 0)
	const maxDaily = Math.max(1, ...report.web.daily.map((d) => n(d.views)))
	const base = `/attribution/${secret}`

	return (
		<div className="bg-stone">
			{/* Money band */}
			<section className="bg-navy pb-14 pt-36 text-white">
				<div className="section-shell">
					<div className="flex flex-wrap items-end justify-between gap-4">
						<div>
							<p className="eyebrow !text-sand">Private · {range.label}</p>
							<h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">Where the money comes from</h1>
							<p className="mt-3 max-w-2xl font-sans text-white/75">
								{best
									? `${chLabel(best.channel)} has produced the most signed revenue: ${money(n(best.revenue))} from ${n(best.leads)} lead${n(best.leads) === 1 ? '' : 's'}.`
									: 'No signed revenue in this window yet.'}
							</p>
						</div>
						<nav className="flex gap-1 bg-white/10 p-1" aria-label="Time range">
							{RANGES.map((r) => (
								<a
									key={r.key}
									href={`${base}?range=${r.key}`}
									className={`px-3 py-1.5 font-sans text-sm ${r.key === range.key ? 'bg-sand font-semibold text-navy' : 'text-white/80 hover:bg-white/10'}`}
								>
									{r.label}
								</a>
							))}
						</nav>
					</div>
					<dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
						<Tile label="Leads" value={String(totals.leads)} />
						<Tile label="Appointments" value={String(totals.appts)} sub={`${pct(totals.appts, totals.leads)} of leads`} />
						<Tile label="Contracts" value={String(totals.contracts)} sub={`${pct(totals.contracts, totals.leads)} of leads`} />
						<Tile label="Revenue" value={money(totals.revenue)} sub={totals.leads ? `${money(totals.revenue / totals.leads)} per lead` : undefined} />
					</dl>
				</div>
			</section>

			<div className="section-shell space-y-14 py-12">
				{/* Funnel by channel */}
				<Funnel title="By channel" rows={report.funnel.map((r) => ({ ...r, name: chLabel(r.channel) }))} />

				{/* Website traffic and clicks */}
				<section>
					<p className="eyebrow">What people do on the website</p>
					<h2 className="mt-2 font-display text-3xl text-navy">Visits and clicks</h2>
					{views === 0 && clicks === 0 ? (
						<p className="mt-3 body-copy">
							No website events recorded yet in this window. Counting starts the moment the collector ships; give it a day.
						</p>
					) : null}
					<dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
						<Stat label="Page views" value={String(views)} />
						<Stat label="Visitors" value={String(visitors)} />
						<Stat label="Clicks that matter" value={String(clicks)} sub="phone, email, text, booking, forms" />
						<Stat label="Click rate" value={pct(clicks, views)} sub="clicks per page view" />
					</dl>

					{report.web.daily.length > 0 ? (
						<div className="mt-8 border border-navy/10 bg-white p-4">
							<p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">Last 60 days · page views (bars), forms sent (gold)</p>
							<div className="mt-3 flex h-28 items-end gap-[2px]" role="img" aria-label="Daily page views">
								{report.web.daily.map((d) => (
									<div key={d.day} className="relative flex-1" title={`${d.day}: ${d.views} views · ${d.clicks} clicks · ${d.leads} forms`}>
										<div className="bg-navy/70" style={{ height: `${Math.max(2, (n(d.views) / maxDaily) * 112)}px` }} />
										{n(d.leads) > 0 ? <div className="absolute inset-x-0 bottom-0 h-1.5 bg-sand" /> : null}
									</div>
								))}
							</div>
						</div>
					) : null}

					<div className="mt-8 grid gap-6 lg:grid-cols-2">
						<Table
							title="Visits by source"
							head={['Source', 'Views', 'Visitors']}
							rows={report.web.views_by_channel.map((r) => [chLabel(r.channel), String(r.views), String(r.visitors)])}
						/>
						<Table
							title="What gets clicked"
							head={['Action', 'Clicks']}
							rows={report.web.clicks_by_event.map((r) => [EVENT_LABELS[r.event] ?? r.event.replace(/_/g, ' '), String(r.clicks)])}
						/>
						<Table
							title="Most viewed pages"
							head={['Page', 'Views']}
							rows={report.web.top_pages.map((r) => [r.page ?? '—', String(r.views)])}
						/>
						<Table
							title="Most clicked things"
							head={['Page', 'Action', 'What', 'Clicks']}
							rows={report.web.top_clicked.map((r) => [
								r.page ?? '—',
								EVENT_LABELS[r.event] ?? r.event,
								r.label ?? '—',
								String(r.clicks),
							])}
						/>
					</div>
					{report.web.clicks_by_channel.length > 0 ? (
						<div className="mt-6">
							<Table
								title="Clicks by source"
								head={['Source', 'Action', 'Clicks']}
								rows={report.web.clicks_by_channel.map((r) => [chLabel(r.channel), EVENT_LABELS[r.event] ?? r.event, String(r.clicks)])}
							/>
						</div>
					) : null}
				</section>

				{/* Reps / campaigns / referrals */}
				{report.by_rep.length > 0 ? (
					<Funnel title="By rep / canvasser" rows={report.by_rep.map((r) => ({ ...r, name: repName(r.rep, r.name) }))} />
				) : null}
				{report.by_campaign.length > 0 ? (
					<Funnel
						title="By campaign / QR code"
						rows={report.by_campaign.map((r) => ({
							...r,
							name: `${r.campaign ?? (r.qr ? `QR ${r.qr}` : 'untagged')} · ${chLabel(r.channel)}`,
						}))}
					/>
				) : null}
				{report.by_referral.length > 0 ? (
					<Funnel
						title="By referral partner"
						rows={report.by_referral.map((r) => ({ ...r, appointments: 0, name: r.name ?? r.ref }))}
						hideAppts
					/>
				) : null}

				{/* Recent leads */}
				<section>
					<p className="eyebrow">Latest 25</p>
					<h2 className="mt-2 font-display text-3xl text-navy">Leads and where they came from</h2>
					<div className="mt-6 overflow-x-auto border border-navy/10 bg-white">
						<table className="w-full font-sans text-sm">
							<thead className="bg-stone text-left text-xs uppercase tracking-[0.14em] text-stone-muted">
								<tr>
									{['Date', 'Job', 'First touch', 'Last touch', 'Campaign', 'Rep / referral', 'Status'].map((h) => (
										<th key={h} className="px-4 py-2 font-semibold">
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{report.recent.map((r, i) => (
									<tr key={i} className="border-t border-navy/10">
										<td className="whitespace-nowrap px-4 py-2">{new Date(r.at).toLocaleDateString('en-US')}</td>
										<td className="px-4 py-2">{r.name}</td>
										<td className="px-4 py-2">{chLabel(r.channel)}</td>
										<td className="px-4 py-2">{r.last_channel ? chLabel(r.last_channel) : '—'}</td>
										<td className="px-4 py-2">{r.campaign ?? '—'}</td>
										<td className="px-4 py-2">{[r.rep && repName(r.rep), r.ref && `ref: ${r.ref}`].filter(Boolean).join(' · ') || '—'}</td>
										<td className="px-4 py-2 capitalize">{r.status.replace(/_/g, ' ')}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				<p className="font-sans text-xs text-stone-muted">
					Appointment = walkthrough booked or job moved past Lead. Contract = approved, completed, invoiced or closed. Revenue = contract
					value of contracts. Older jobs entered by hand use the CRM&apos;s source field. Generated{' '}
					{new Date(report.generated_at).toLocaleString('en-US')}. This page is private — anyone with this exact link can see it.
				</p>
			</div>
		</div>
	)
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
	return (
		<div className="bg-white/10 p-4">
			<dt className="font-sans text-xs uppercase tracking-[0.16em] text-white/70">{label}</dt>
			<dd className="mt-1 font-display text-3xl">{value}</dd>
			{sub ? <dd className="font-sans text-xs text-sand">{sub}</dd> : null}
		</div>
	)
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
	return (
		<div className="border border-navy/10 bg-white p-4">
			<dt className="font-sans text-xs uppercase tracking-[0.16em] text-stone-muted">{label}</dt>
			<dd className="mt-1 font-display text-3xl text-navy">{value}</dd>
			{sub ? <dd className="font-sans text-xs text-stone-muted">{sub}</dd> : null}
		</div>
	)
}

function Funnel({
	title,
	rows,
	hideAppts,
}: {
	title: string
	rows: { name: string; leads: number; appointments: number; contracts: number; revenue: number }[]
	hideAppts?: boolean
}) {
	const maxLeads = Math.max(1, ...rows.map((r) => n(r.leads)))
	const maxRevenue = Math.max(1, ...rows.map((r) => n(r.revenue)))
	return (
		<section>
			<p className="eyebrow">Source → leads → appointments → contracts → revenue</p>
			<h2 className="mt-2 font-display text-3xl text-navy">{title}</h2>
			<div className="mt-6 space-y-3">
				{rows.length === 0 ? <p className="body-copy">Nothing in this window yet.</p> : null}
				{rows.map((r) => {
					const leads = n(r.leads)
					const appts = n(r.appointments)
					const contracts = n(r.contracts)
					const revenue = n(r.revenue)
					return (
						<div key={r.name} className="border border-navy/10 bg-white p-4">
							<div className="flex flex-wrap items-baseline justify-between gap-2">
								<h3 className="font-display text-xl text-navy">{r.name}</h3>
								<p className="font-sans text-sm text-stone-muted">
									<b className="text-ink">{leads}</b> leads →{' '}
									{hideAppts ? null : (
										<>
											<b className="text-ink">{appts}</b> appts →{' '}
										</>
									)}
									<b className="text-ink">{contracts}</b> jobs → <b className="text-ink">{money(revenue)}</b>
								</p>
							</div>
							<div className="mt-3 h-4 w-full bg-stone-warm" title="Leads → appointments → contracts">
								<div className="relative h-4 bg-navy/20" style={{ width: `${(leads / maxLeads) * 100}%` }}>
									{hideAppts ? null : (
										<div className="absolute inset-y-0 left-0 bg-navy/50" style={{ width: `${leads ? (appts / leads) * 100 : 0}%` }} />
									)}
									<div className="absolute inset-y-0 left-0 bg-navy" style={{ width: `${leads ? (contracts / leads) * 100 : 0}%` }} />
								</div>
							</div>
							<div className="mt-1.5 h-2 w-full bg-stone-warm" title="Revenue">
								<div className="h-2 bg-sand" style={{ width: `${(revenue / maxRevenue) * 100}%` }} />
							</div>
							<p className="mt-2 flex flex-wrap gap-x-5 font-sans text-xs text-stone-muted">
								{hideAppts ? null : <span>Book rate {pct(appts, leads)}</span>}
								<span>Close rate {pct(contracts, leads)}</span>
								<span>{leads ? money(revenue / leads) : '—'} per lead</span>
							</p>
						</div>
					)
				})}
			</div>
			<p className="mt-3 flex flex-wrap gap-4 font-sans text-xs text-stone-muted">
				<Legend className="bg-navy/20" text="Leads" />
				{hideAppts ? null : <Legend className="bg-navy/50" text="Appointments" />}
				<Legend className="bg-navy" text="Contracts" />
				<Legend className="bg-sand" text="Revenue" />
			</p>
		</section>
	)
}

function Legend({ className, text }: { className: string; text: string }) {
	return (
		<span className="inline-flex items-center gap-1.5">
			<span className={`inline-block h-2.5 w-4 ${className}`} /> {text}
		</span>
	)
}

function Table({ title, head, rows }: { title: string; head: string[]; rows: string[][] }) {
	return (
		<div className="border border-navy/10 bg-white">
			<h3 className="border-b border-navy/10 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">{title}</h3>
			<table className="w-full font-sans text-sm">
				<thead className="text-left text-xs text-stone-muted">
					<tr>
						{head.map((h) => (
							<th key={h} className="px-4 py-1.5 font-semibold">
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.length === 0 ? (
						<tr>
							<td className="px-4 py-3 text-stone-muted" colSpan={head.length}>
								Nothing yet.
							</td>
						</tr>
					) : null}
					{rows.map((r, i) => (
						<tr key={i} className="border-t border-navy/10">
							{r.map((c, j) => (
								<td key={j} className={`px-4 py-1.5 ${j === r.length - 1 ? 'text-right tabular-nums' : ''}`}>
									{c}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
