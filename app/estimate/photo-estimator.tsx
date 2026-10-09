'use client'

import { track } from '@vercel/analytics'
import { useEffect, useRef, useState } from 'react'

import { CalEmbed } from '@/app/design-your-project/cal-embed'
import { categories, tierCopy, type Question } from '@/content/estimator/catalog'
import {
	AI_NOTICE,
	contactMethods,
	intents,
	MARKETING_CONSENT,
	PRELIMINARY_NOTICE,
	ROOFING_SUB_NOTICE,
	STORM_INSURANCE_NOTICE,
	timelines,
	type Intent,
} from '@/content/estimator/copy'
import { siteConfig } from '@/content/site'
import { getAttribution } from '@/lib/attribution/client'
import { trackConversion } from '@/lib/attribution/events'
import type { EstimateResult } from '@/lib/estimator/engine'
import type { Findings } from '@/lib/estimator/vision'

/**
 * /estimate — five steps: UPLOAD → IDENTIFY → CLARIFY → ESTIMATE → CONNECT.
 *
 * Photos are shrunk and re-drawn on a canvas in the browser before they are
 * sent. Re-drawing keeps only the pixels, so EXIF data — including the GPS
 * location phones stamp on photos — never leaves the customer's phone.
 */

type PreparedPhoto = { id: string; url: string; data: string; mediaType: 'image/jpeg' }
type Step = 1 | 2 | 3 | 4 | 5

const MAX_PHOTOS = 5
const MAX_EDGE = 1600
const STEPS = ['Upload', 'Identify', 'Clarify', 'Estimate', 'Connect']

const enabled = categories.filter((c) => c.enabled)

async function preparePhoto(file: File): Promise<PreparedPhoto> {
	if (!file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(file.name)) throw new Error(`"${file.name}" is not a photo.`)
	if (file.size > 30_000_000) throw new Error(`"${file.name}" is too large.`)
	let bitmap: ImageBitmap
	try {
		bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
	} catch {
		throw new Error(`We could not open "${file.name}". If it is a HEIC photo, try taking it with the camera button instead.`)
	}
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
	const canvas = document.createElement('canvas')
	canvas.width = Math.round(bitmap.width * scale)
	canvas.height = Math.round(bitmap.height * scale)
	canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
	bitmap.close()
	let quality = 0.82
	let dataUrl = canvas.toDataURL('image/jpeg', quality)
	while (dataUrl.length > 1_400_000 && quality > 0.5) {
		quality -= 0.1
		dataUrl = canvas.toDataURL('image/jpeg', quality)
	}
	return { id: Math.random().toString(36).slice(2), url: dataUrl, data: dataUrl.split(',')[1], mediaType: 'image/jpeg' }
}

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
const rng = (m: { low: number; high: number }) => (m.low === m.high ? fmt(m.low) : `${fmt(m.low)} – ${fmt(m.high)}`)

const card = 'rounded-3xl border border-navy/10 bg-white p-6 shadow-[0_30px_80px_-50px_rgba(12,17,32,0.45)] sm:p-10'
const label = 'block font-sans text-sm font-semibold text-navy'
const input =
	'mt-2 block w-full rounded-2xl border border-navy/15 bg-white px-4 py-3.5 font-sans text-base text-navy placeholder:text-navy/35 focus:border-navy focus:outline-none focus:ring-2 focus:ring-sand/40'
const primary =
	'inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-navy px-7 font-sans text-base font-semibold text-white transition hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-40'
const ghost = 'inline-flex min-h-[3rem] items-center justify-center rounded-full px-5 font-sans text-base font-medium text-navy/70 hover:text-navy'
const pill = (on: boolean) =>
	`rounded-full border px-4 py-2.5 font-sans text-sm transition ${on ? 'border-navy bg-navy text-white' : 'border-navy/15 bg-white text-navy hover:border-navy/40'}`

export function PhotoEstimator() {
	const [step, setStep] = useState<Step>(1)
	const [photos, setPhotos] = useState<PreparedPhoto[]>([])
	const [note, setNote] = useState('')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [findings, setFindings] = useState<Findings | null>(null)
	const [aiWhy, setAiWhy] = useState<string | null>(null)
	const [categoryId, setCategoryId] = useState('')
	const [scopeId, setScopeId] = useState('')
	const [answers, setAnswers] = useState<Record<string, string>>({})
	const [zip, setZip] = useState('')
	const [result, setResult] = useState<EstimateResult | null>(null)
	const [intent, setIntent] = useState<Intent | null>(null)
	const [contact, setContact] = useState({ name: '', phone: '', email: '', address: '', description: '', timeline: '', contactMethod: 'call', marketingConsent: false })
	const [done, setDone] = useState<{ intent: Intent; clientSent: boolean } | null>(null)
	const honeypot = useRef<HTMLInputElement>(null)
	const top = useRef<HTMLDivElement>(null)
	const fileInput = useRef<HTMLInputElement>(null)
	const cameraInput = useRef<HTMLInputElement>(null)

	const category = enabled.find((c) => c.id === categoryId)
	const scope = category?.scopes.find((s) => s.id === scopeId)
	const roof = Boolean(category?.roofAd)
	const aiConfidence = findings && findings.categoryId === categoryId ? findings.confidence : 'none'

	useEffect(() => {
		top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}, [step, done])

	const go = (s: Step) => {
		setError(null)
		setStep(s)
		track('estimate_step', { step: STEPS[s - 1] })
	}

	async function addFiles(list: FileList | null) {
		if (!list?.length) return
		setError(null)
		const room = MAX_PHOTOS - photos.length
		const files = Array.from(list).slice(0, room)
		if (list.length > room) setError(`Up to ${MAX_PHOTOS} photos — we kept the first ${room}.`)
		setBusy(true)
		for (const f of files) {
			try {
				const p = await preparePhoto(f)
				setPhotos((prev) => [...prev, p].slice(0, MAX_PHOTOS))
			} catch (e) {
				setError((e as Error).message)
			}
		}
		setBusy(false)
		if (fileInput.current) fileInput.current.value = ''
		if (cameraInput.current) cameraInput.current.value = ''
	}

	function applyFindings(f: Findings | null) {
		setFindings(f)
		if (!f || f.categoryId === 'unknown') return
		setCategoryId(f.categoryId)
		const cat = enabled.find((c) => c.id === f.categoryId)
		setScopeId(f.scopeId !== 'unknown' ? f.scopeId : cat?.scopes.length === 1 ? cat.scopes[0].id : '')
		// Pre-fill only what was plainly visible. The customer still confirms it.
		const pre: Record<string, string> = {}
		if (f.observed.stories) pre.stories = f.observed.stories
		if (f.observed.wallTexture) pre.texture = f.observed.wallTexture
		if (f.observed.exteriorSurface) pre.surface = f.observed.exteriorSurface
		if (f.observed.currentFloor) pre.remove = f.observed.currentFloor
		setAnswers((a) => ({ ...pre, ...a }))
	}

	async function analyze() {
		setBusy(true)
		setError(null)
		trackConversion('estimate_photos_submitted', { photos: photos.length })
		try {
			const res = await fetch('/api/estimate/analyze', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ photos: photos.map(({ data, mediaType }) => ({ data, mediaType })), note, website: honeypot.current?.value || undefined }),
			})
			const json = await res.json()
			if (!json.ok) throw new Error(json.error || 'Something went wrong.')
			setAiWhy(json.findings ? null : json.why)
			applyFindings(json.findings)
			go(2)
		} catch (e) {
			setError((e as Error).message)
		} finally {
			setBusy(false)
		}
	}

	async function price() {
		setBusy(true)
		setError(null)
		try {
			const res = await fetch('/api/estimate/price', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ categoryId, scopeId, zip, answers, aiConfidence }),
			})
			const json = await res.json()
			if (!json.ok) throw new Error(json.error || 'Something went wrong.')
			setResult(json.result)
			trackConversion('estimate_viewed', { category: categoryId, priced: json.result.kind === 'priced' })
			go(4)
		} catch (e) {
			setError((e as Error).message)
		} finally {
			setBusy(false)
		}
	}

	async function submit() {
		if (!intent) return
		setBusy(true)
		setError(null)
		try {
			const res = await fetch('/api/estimate/submit', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					intent,
					categoryId: categoryId || 'remodel',
					scopeId: scopeId || 'remodel',
					zip,
					answers,
					aiConfidence,
					findings,
					photos: photos.map(({ data, mediaType }) => ({ data, mediaType })),
					...contact,
					website: honeypot.current?.value || undefined,
					attribution: getAttribution(),
				}),
			})
			const json = await res.json()
			if (!json.ok) throw new Error(json.error || 'Something went wrong.')
			trackConversion('estimate_lead', { intent, category: categoryId })
			setDone({ intent, clientSent: Boolean(json.clientSent) })
		} catch (e) {
			setError((e as Error).message)
		} finally {
			setBusy(false)
		}
	}

	const questions = scope?.questions ?? []
	const clarifyReady = /^\d{5}$/.test(zip) && questions.filter((q) => q.required).every((q) => (answers[q.id] ?? '') !== '')
	const contactReady =
		intent && contact.name.trim().length > 1 && contact.phone.trim().length > 6 && /\S+@\S+\.\S+/.test(contact.email) && contact.timeline

	return (
		<div ref={top} className="scroll-mt-28">
			<Progress step={done ? 6 : step} />

			{error && (
				<p role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-sans text-sm text-red-800">
					{error}
				</p>
			)}

			<input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden" />

			{done ? (
				<Done done={done} />
			) : step === 1 ? (
				<section className={card} aria-labelledby="s1">
					<h2 id="s1" className="font-display text-3xl text-navy sm:text-4xl">Show us the project</h2>
					<p className="mt-3 max-w-xl font-sans text-base text-navy/70">One photo works. Two or three from different angles work better — one close-up, one from farther back.</p>

					<div
						className="mt-8 rounded-3xl border-2 border-dashed border-navy/15 bg-stone/40 p-6 text-center sm:p-10"
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							e.preventDefault()
							addFiles(e.dataTransfer.files)
						}}
					>
						<div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
							<button type="button" className={primary} onClick={() => cameraInput.current?.click()} disabled={busy || photos.length >= MAX_PHOTOS}>
								<CameraIcon /> Take a photo
							</button>
							<button
								type="button"
								className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-navy/20 bg-white px-7 font-sans text-base font-semibold text-navy hover:border-navy disabled:opacity-40"
								onClick={() => fileInput.current?.click()}
								disabled={busy || photos.length >= MAX_PHOTOS}
							>
								Choose from library
							</button>
						</div>
						<p className="mt-4 font-sans text-xs text-navy/50">Up to {MAX_PHOTOS} photos. Location data is removed on your phone before upload.</p>
						<input ref={cameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => addFiles(e.target.files)} />
						<input ref={fileInput} type="file" accept="image/*,.heic,.heif" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} data-testid="file-input" />
					</div>

					{photos.length > 0 && (
						<ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
							{photos.map((p) => (
								<li key={p.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-stone">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={p.url} alt="Your project photo" className="h-full w-full object-cover" />
									<button
										type="button"
										aria-label="Remove photo"
										onClick={() => setPhotos((prev) => prev.filter((x) => x.id !== p.id))}
										className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-navy/80 text-lg leading-none text-white"
									>
										×
									</button>
								</li>
							))}
						</ul>
					)}

					<label className="mt-8 block">
						<span className={label}>Anything we should know? <span className="font-normal text-navy/50">(optional)</span></span>
						<textarea className={input} rows={2} maxLength={600} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Leak over the kitchen after the last storm" />
					</label>

					<div className="mt-8 flex flex-wrap items-center justify-between gap-3">
						<button type="button" className={ghost} onClick={() => { setAiWhy('manual'); setFindings(null); go(2) }}>
							No photo? Pick the project type
						</button>
						<button type="button" className={primary} disabled={!photos.length || busy} onClick={analyze}>
							{busy ? 'Looking at your photos…' : 'Analyze my photos →'}
						</button>
					</div>
					<p className="mt-6 font-sans text-xs leading-relaxed text-navy/45">{AI_NOTICE}</p>
				</section>
			) : step === 2 ? (
				<section className={card} aria-labelledby="s2">
					{findings && findings.categoryId !== 'unknown' ? (
						<>
							<p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sand-dark">What we see</p>
							<h2 id="s2" className="mt-2 font-display text-3xl text-navy sm:text-4xl">{findings.component || category?.label}</h2>
							<ConfidencePill level={findings.confidence} />
							<dl className="mt-6 grid gap-4 sm:grid-cols-2">
								<Fact k="Likely material" v={findings.probableMaterial} />
								<Fact k="Visible condition" v={findings.visibleCondition} />
								<Fact k="Likely work" v={findings.recommendedScope} wide />
							</dl>
							{findings.possibleHiddenIssues.length > 0 && (
								<div className="mt-6 rounded-2xl bg-stone/60 p-5">
									<p className="font-sans text-sm font-semibold text-navy">Things a photo can&apos;t show — we check these in person</p>
									<ul className="mt-2 list-disc space-y-1 pl-5 font-sans text-sm text-navy/75">
										{findings.possibleHiddenIssues.map((h) => <li key={h}>{h}</li>)}
									</ul>
								</div>
							)}
							{(findings.imageQuality === 'unclear' || findings.morePhotosNeeded.length > 0) && (
								<div className="mt-4 rounded-2xl border border-sand/50 bg-sand/10 p-5 font-sans text-sm text-navy">
									<p className="font-semibold">A better photo would help</p>
									{findings.morePhotosNeeded.length > 0 && <ul className="mt-1 list-disc pl-5">{findings.morePhotosNeeded.map((m) => <li key={m}>{m}</li>)}</ul>}
									<button type="button" className="mt-3 font-semibold underline" onClick={() => go(1)}>Add photos</button>
								</div>
							)}
							<p className="mt-8 font-sans text-sm font-semibold text-navy">Is this right? Change it if not.</p>
						</>
					) : (
						<>
							<h2 id="s2" className="font-display text-3xl text-navy sm:text-4xl">What kind of project is it?</h2>
							<p className="mt-3 font-sans text-base text-navy/70">
								{aiWhy === 'manual'
									? 'Pick the closest match.'
									: findings && !findings.isConstructionPhoto
										? 'We couldn’t find a building project in those photos. Pick the closest match, or go back and add a clearer photo.'
										: 'We couldn’t read the photos clearly enough to say. Pick the closest match — your photos still come with your request.'}
							</p>
						</>
					)}

					<div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Project type">
						{enabled.map((c) => (
							<button key={c.id} type="button" role="radio" aria-checked={categoryId === c.id} className={pill(categoryId === c.id)} onClick={() => { setCategoryId(c.id); setScopeId(c.scopes.length === 1 ? c.scopes[0].id : '') }}>
								{c.label}
							</button>
						))}
					</div>
					{category && category.scopes.length > 1 && (
						<div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Type of work">
							{category.scopes.map((s) => (
								<button key={s.id} type="button" role="radio" aria-checked={scopeId === s.id} className={pill(scopeId === s.id)} onClick={() => setScopeId(s.id)}>
									{s.label}
								</button>
							))}
						</div>
					)}

					<Nav back={() => go(1)} next={() => go(3)} nextDisabled={!scope} nextLabel="Looks right →" />
				</section>
			) : step === 3 ? (
				<section className={card} aria-labelledby="s3">
					<h2 id="s3" className="font-display text-3xl text-navy sm:text-4xl">A few quick questions</h2>
					<p className="mt-3 font-sans text-base text-navy/70">Photos can&apos;t measure. Your best guess is fine — we confirm everything in person.</p>
					<div className="mt-8 space-y-7">
						{questions.map((q) => (
							<QuestionField key={q.id} q={q} value={answers[q.id] ?? ''} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
						))}
						<label className="block max-w-xs">
							<span className={label}>Project ZIP code</span>
							<input className={input} inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} placeholder="32960" />
						</label>
					</div>
					<Nav back={() => go(2)} next={price} nextDisabled={!clarifyReady || busy} nextLabel={busy ? 'Calculating…' : 'See my estimate →'} />
				</section>
			) : step === 4 && result ? (
				<section aria-labelledby="s4">
					<Estimate result={result} roof={roof} />
					<div className="mt-8 flex flex-wrap items-center justify-between gap-3">
						<button type="button" className={ghost} onClick={() => go(3)}>← Change answers</button>
						<button type="button" className={primary} onClick={() => go(5)}>Next: talk to a person →</button>
					</div>
				</section>
			) : (
				<section className={card} aria-labelledby="s5">
					<h2 id="s5" className="font-display text-3xl text-navy sm:text-4xl">What would you like to do?</h2>
					<div className="mt-6 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Next step">
						{(Object.keys(intents) as Intent[]).map((k) => (
							<button
								key={k}
								type="button"
								role="radio"
								aria-checked={intent === k}
								onClick={() => setIntent(k)}
								className={`min-h-[4.5rem] rounded-2xl border px-5 py-4 text-left font-sans text-base font-semibold transition ${intent === k ? 'border-navy bg-navy text-white' : 'border-navy/15 text-navy hover:border-navy/40'}`}
							>
								{intents[k].label}
							</button>
						))}
					</div>

					{intent && (
						<div className="mt-8 grid gap-5 sm:grid-cols-2">
							<Field l="Your name" v={contact.name} set={(v) => setContact({ ...contact, name: v })} auto="name" />
							<Field l="Phone" v={contact.phone} set={(v) => setContact({ ...contact, phone: v })} auto="tel" type="tel" />
							<Field l="Email" v={contact.email} set={(v) => setContact({ ...contact, email: v })} auto="email" type="email" />
							<Field l="Project address (optional)" v={contact.address} set={(v) => setContact({ ...contact, address: v })} auto="street-address" />
							<label className="block">
								<span className={label}>When do you want this done?</span>
								<select className={input} value={contact.timeline} onChange={(e) => setContact({ ...contact, timeline: e.target.value })}>
									<option value="">Choose one</option>
									{timelines.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
								</select>
							</label>
							<label className="block">
								<span className={label}>Best way to reach you</span>
								<select className={input} value={contact.contactMethod} onChange={(e) => setContact({ ...contact, contactMethod: e.target.value })}>
									{contactMethods.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
								</select>
							</label>
							<label className="block sm:col-span-2">
								<span className={label}>Anything else? <span className="font-normal text-navy/50">(optional)</span></span>
								<textarea className={input} rows={3} maxLength={2000} value={contact.description} onChange={(e) => setContact({ ...contact, description: e.target.value })} />
							</label>
							<label className="flex items-start gap-3 sm:col-span-2">
								<input type="checkbox" className="mt-1 h-5 w-5 rounded border-navy/30 accent-navy" checked={contact.marketingConsent} onChange={(e) => setContact({ ...contact, marketingConsent: e.target.checked })} />
								<span className="font-sans text-sm text-navy/70">{MARKETING_CONSENT}</span>
							</label>
						</div>
					)}

					<p className="mt-6 font-sans text-xs leading-relaxed text-navy/50">
						We use your information only to answer this request. Your photos go to our team with your request. See our <a className="underline" href="/privacy">privacy policy</a>.
					</p>
					<Nav back={() => go(4)} next={submit} nextDisabled={!contactReady || busy} nextLabel={busy ? 'Sending…' : intent ? `${intents[intent].label} →` : 'Choose an option'} />
				</section>
			)}
		</div>
	)
}

/* ── pieces ──────────────────────────────────────────────────────── */

function Progress({ step }: { step: number }) {
	return (
		<ol className="mb-6 flex items-center gap-2" aria-label="Progress">
			{STEPS.map((s, i) => {
				const n = i + 1
				const state = n < step ? 'done' : n === step ? 'now' : 'todo'
				return (
					<li key={s} className="flex-1" aria-current={state === 'now' ? 'step' : undefined}>
						<div className={`h-1.5 rounded-full ${state === 'todo' ? 'bg-navy/10' : state === 'now' ? 'bg-sand' : 'bg-navy'}`} />
						<p className={`mt-2 hidden font-sans text-xs sm:block ${state === 'todo' ? 'text-navy/40' : 'text-navy'}`}>{n}. {s}</p>
					</li>
				)
			})}
		</ol>
	)
}

function Nav({ back, next, nextDisabled, nextLabel }: { back: () => void; next: () => void; nextDisabled?: boolean; nextLabel: string }) {
	return (
		<div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 pt-6">
			<button type="button" className={ghost} onClick={back}>← Back</button>
			<button type="button" className={primary} onClick={next} disabled={nextDisabled}>{nextLabel}</button>
		</div>
	)
}

function Fact({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
	if (!v) return null
	return (
		<div className={wide ? 'sm:col-span-2' : ''}>
			<dt className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-navy/45">{k}</dt>
			<dd className="mt-1 font-sans text-base text-navy">{v}</dd>
		</div>
	)
}

function ConfidencePill({ level }: { level: 'high' | 'medium' | 'low' }) {
	const map = { high: ['Clear read', 'bg-emerald-50 text-emerald-800'], medium: ['Fairly sure', 'bg-amber-50 text-amber-800'], low: ['Not sure — please check', 'bg-red-50 text-red-800'] } as const
	return <span className={`mt-3 inline-block rounded-full px-3 py-1 font-sans text-xs font-semibold ${map[level][1]}`}>{map[level][0]}</span>
}

function QuestionField({ q, value, onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
	if (q.type === 'select') {
		return (
			<fieldset>
				<legend className={label}>{q.label}</legend>
				{q.help && <p className="mt-1 font-sans text-sm text-navy/55">{q.help}</p>}
				<div className="mt-3 flex flex-wrap gap-2">
					{q.options?.map((o) => (
						<button key={o.value} type="button" aria-pressed={value === o.value} className={pill(value === o.value)} onClick={() => onChange(o.value)}>
							{o.label}
						</button>
					))}
				</div>
			</fieldset>
		)
	}
	return (
		<label className="block max-w-xs">
			<span className={label}>{q.label}</span>
			{q.help && <span className="mt-1 block font-sans text-sm text-navy/55">{q.help}</span>}
			<div className="relative">
				<input className={input} inputMode="decimal" value={value} min={q.min} max={q.max} onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))} name={q.id} />
				{q.unit && <span className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 font-sans text-sm text-navy/45">{q.unit}</span>}
			</div>
		</label>
	)
}

function Field({ l, v, set, auto, type = 'text' }: { l: string; v: string; set: (v: string) => void; auto: string; type?: string }) {
	return (
		<label className="block">
			<span className={label}>{l}</span>
			<input className={input} type={type} autoComplete={auto} value={v} onChange={(e) => set(e.target.value)} />
		</label>
	)
}

function Estimate({ result, roof }: { result: EstimateResult; roof: boolean }) {
	if (result.kind !== 'priced') {
		return (
			<div className={card}>
				<h2 id="s4" className="font-display text-3xl text-navy sm:text-4xl">Let&apos;s look at this one in person</h2>
				<p className="mt-4 max-w-xl font-sans text-base text-navy/75">{result.message}</p>
				{result.missing?.length ? <ul className="mt-3 list-disc pl-5 font-sans text-sm text-navy/70">{result.missing.map((m) => <li key={m}>{m}</li>)}</ul> : null}
				<p className="mt-4 font-sans text-sm text-navy/60">Your photos and answers come with your request, so the visit is short.</p>
				{roof && <RoofNotes />}
				<Fine />
			</div>
		)
	}
	return (
		<div className={card}>
			{result.draftPrices && (
				<p className="mb-6 rounded-2xl bg-red-600 px-5 py-3 text-center font-sans text-sm font-bold uppercase tracking-[0.14em] text-white">
					Draft prices — preview only, not approved
				</p>
			)}
			<p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sand-dark">
				{result.budgetIndication ? 'Budget indication' : 'Preliminary estimate'}
			</p>
			<h2 id="s4" className="mt-2 font-display text-3xl text-navy sm:text-4xl">
				Most projects like yours: {rng(result.tiers[1].total)}
			</h2>
			{result.budgetIndication && (
				<p className="mt-3 font-sans text-sm text-navy/65">We weren&apos;t fully sure from the photos and answers, so this range is wider than usual.</p>
			)}

			<div className="mt-8 grid gap-4 md:grid-cols-3">
				{result.tiers.map((t) => (
					<div key={t.tier} className={`rounded-3xl border p-6 ${t.tier === 'standard' ? 'border-navy ring-1 ring-navy' : 'border-navy/10'}`}>
						<p className="font-sans text-sm font-semibold text-navy">{tierCopy[t.tier].label}</p>
						<p className="mt-1 font-sans text-xs text-navy/55">{t.materialNote || tierCopy[t.tier].blurb}</p>
						<p className="mt-4 font-display text-2xl text-navy">{rng(t.total)}</p>
						<dl className="mt-4 space-y-1.5 font-sans text-sm">
							<Row k="Materials" v={rng(t.materials)} />
							<Row k="Labor" v={rng(t.labor)} />
							{(t.other.high > 0) && <Row k="Disposal, equipment, permits" v={rng(t.other)} />}
							<Row k="Overhead & profit" v={rng(t.overheadProfit)} />
						</dl>
					</div>
				))}
			</div>

			<details className="mt-6 rounded-2xl bg-stone/50 p-5 font-sans text-sm text-navy/75">
				<summary className="cursor-pointer font-semibold text-navy">How we got this number</summary>
				<ul className="mt-3 list-disc space-y-1 pl-5">
					{result.quantities.map((q) => <li key={q.label}>{q.label}: {q.value.toLocaleString('en-US')} {q.unit}</li>)}
					{result.assumptions.map((a) => <li key={a}>{a}</li>)}
					<li>Pricing as of {new Date(result.asOf + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</li>
				</ul>
			</details>
			{roof && <RoofNotes />}
			<Fine />
		</div>
	)
}

const Row = ({ k, v }: { k: string; v: string }) => (
	<div className="flex justify-between gap-3">
		<dt className="text-navy/55">{k}</dt>
		<dd className="text-right text-navy">{v}</dd>
	</div>
)

const RoofNotes = () => (
	<div className="mt-6 space-y-2 font-sans text-sm text-navy/70">
		<p>{ROOFING_SUB_NOTICE}</p>
		<p>{STORM_INSURANCE_NOTICE}</p>
	</div>
)

const Fine = () => (
	<p className="mt-6 border-t border-navy/10 pt-5 font-sans text-xs leading-relaxed text-navy/50">
		{PRELIMINARY_NOTICE} Covenant Builders · Florida Certified Building Contractor {siteConfig.license.number}.
	</p>
)

function Done({ done }: { done: { intent: Intent; clientSent: boolean } }) {
	return (
		<section className={card}>
			<p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sand-dark">Received</p>
			<h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
				{done.intent === 'inspection' ? 'Pick a time for your inspection' : 'You’re in good hands.'}
			</h2>
			<p className="mt-4 max-w-xl font-sans text-base text-navy/75">
				{done.intent === 'send'
					? done.clientSent
						? 'Your estimate is on its way to your inbox. A real person also reviews your photos and will reach out.'
						: 'We got your request. The email copy didn’t go through, but our team has everything and will reach out.'
					: `A real person reviews your photos and answers, then contacts you. ${siteConfig.responseExpectation}`}
			</p>
			{done.intent === 'inspection' && (
				<div className="mt-8">
					<CalEmbed calLink={siteConfig.booking.calLink} />
				</div>
			)}
			<p className="mt-8 font-sans text-sm text-navy/60">
				Questions now? Call <a className="font-semibold text-navy underline" href={siteConfig.phones.sr.href}>{siteConfig.phones.sr.display}</a>.
			</p>
		</section>
	)
}

const CameraIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
		<path d="M4 8h3l2-3h6l2 3h3v11H4z" strokeLinejoin="round" />
		<circle cx="12" cy="13" r="3.5" />
	</svg>
)
