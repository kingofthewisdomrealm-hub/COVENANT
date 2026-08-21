'use client'

import { track } from '@vercel/analytics'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { buildLevels, type BuildLevel } from '@/content/build-order'

/**
 * The build-order game. Cards arrive shuffled; the player drags (or taps)
 * them onto the drawing in the real order. A wrong card costs points and
 * makes the drawing drip. Each correct card reveals one drawing layer and,
 * where a real inspection happens, stamps PASS.
 *
 * State is deliberately tiny: which level, how many steps are done, how
 * many leaks, the score, the last message, and the shuffled tray. Nothing
 * is stored anywhere — refresh and it is a fresh roof.
 */

function shuffle<T>(list: T[]): T[] {
	const copy = list.slice()
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[copy[i], copy[j]] = [copy[j], copy[i]]
	}
	return copy
}

type Message = { tone: 'neutral' | 'good' | 'bad'; html: string }

export function BuildGame() {
	const [level, setLevel] = useState<BuildLevel>(buildLevels[0])
	const [done, setDone] = useState(0)
	const [leaks, setLeaks] = useState(0)
	const [score, setScore] = useState(0)
	const [leaking, setLeaking] = useState(0)
	const [shake, setShake] = useState(false)
	const [over, setOver] = useState(false)
	const [message, setMessage] = useState<Message>({
		tone: 'neutral',
		html: buildLevels[0].firstHint,
	})
	// Unshuffled on the server so the HTML matches on hydration; shuffled once
	// the component is on the client.
	const [trayOrder, setTrayOrder] = useState<string[]>(() =>
		buildLevels[0].steps.map((s) => s.id),
	)
	useEffect(() => {
		setTrayOrder(shuffle(buildLevels[0].steps.map((s) => s.id)))
	}, [])

	const load = useCallback((next: BuildLevel) => {
		setLevel(next)
		setDone(0)
		setLeaks(0)
		setScore(0)
		setOver(false)
		setMessage({ tone: 'neutral', html: next.firstHint })
		setTrayOrder(shuffle(next.steps.map((s) => s.id)))
		track('play_start', { level: next.key })
	}, [])

	const place = useCallback(
		(id: string) => {
			if (over) return
			const want = level.steps[done]
			if (!want) return
			if (id !== want.id) {
				const tried = level.steps.find((s) => s.id === id)
				if (!tried) return
				setLeaks((n) => n + 1)
				setScore((s) => Math.max(0, s - 50))
				setMessage({
					tone: 'bad',
					html: `<strong>Leak!</strong> You tried “${tried.title}” too early. ${want.leakLine}`,
				})
				setLeaking((n) => n + 1)
				setShake(true)
				window.setTimeout(() => setShake(false), 350)
				return
			}
			setScore((s) => s + 100 + (want.inspection ? 50 : 0))
			setMessage({ tone: 'good', html: `<strong>Nice.</strong> ${want.detail}` })
			const nextDone = done + 1
			setDone(nextDone)
			if (nextDone >= level.steps.length) {
				setOver(true)
				track('play_complete', { level: level.key, leaks })
			} else {
				setTrayOrder(shuffle(level.steps.slice(nextDone).map((s) => s.id)))
			}
		},
		[done, leaks, level, over],
	)

	const revealed = useMemo(
		() => new Set(level.steps.slice(0, done).map((s) => s.layer).filter(Boolean)),
		[done, level],
	)
	const stars = leaks === 0 ? 3 : leaks < 3 ? 2 : 1
	const levelIndex = buildLevels.indexOf(level)
	const nextLevel = buildLevels[levelIndex + 1]

	const onDrop = (event: React.DragEvent) => {
		event.preventDefault()
		place(event.dataTransfer.getData('text/plain'))
	}
	const allowDrop = (event: React.DragEvent) => event.preventDefault()

	return (
		<div className="text-white">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="eyebrow text-sand">Build it in the right order</p>
					<h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
						{level.name}
					</h1>
					<p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-white/75">
						{level.intro}
					</p>
				</div>
				<dl className="flex gap-6 font-sans text-xs uppercase tracking-[0.16em] text-white/60">
					<div>
						<dt>Leaks</dt>
						<dd className="font-display text-3xl tabular-nums text-sand">{leaks}</dd>
					</div>
					<div>
						<dt>Score</dt>
						<dd className="font-display text-3xl tabular-nums text-sand">{score}</dd>
					</div>
				</dl>
			</div>

			<div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Level">
				{buildLevels.map((item, index) => {
					const active = item === level
					return (
						<button
							key={item.key}
							type="button"
							role="tab"
							aria-selected={active}
							onClick={() => load(item)}
							className={`inline-flex min-h-[44px] items-center gap-2 border px-4 font-sans text-sm transition ${
								active
									? 'border-sand bg-sand/15 text-white'
									: 'border-white/20 text-white/80 hover:border-sand/60'
							}`}
						>
							<span className="text-[11px] uppercase tracking-[0.16em] text-white/50">
								Level {index + 1}
							</span>
							{item.pickLabel}
							<span className="text-[11px] text-white/50">{item.steps.length} steps</span>
						</button>
					)
				})}
			</div>

			<div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
				<section className="border border-white/10 bg-navy-soft p-4 sm:p-5">
					<p className="font-sans text-xs uppercase tracking-[0.16em] text-white/50">
						{level.sceneLabel}
					</p>
					<div
						className={`mt-3 ${leaking ? 'is-leaking' : ''}`}
						key={`${level.key}-${leaking}`}
						onDragOver={allowDrop}
						onDrop={onDrop}
					>
						{level.key === 'roof' ? (
							<RoofScene revealed={revealed} />
						) : (
							<HouseScene revealed={revealed} />
						)}
					</div>
					<div
						onDragOver={allowDrop}
						onDrop={onDrop}
						className={`mt-3 border-2 border-dashed px-4 py-4 text-center font-sans text-sm text-white/60 transition ${
							shake ? 'animate-shake border-red-400' : 'border-white/20'
						}`}
					>
						{over ? `${level.sceneLabel.replace('Your ', '')} complete` : 'Drop the next step here'}
					</div>
					<div
						className={`mt-3 min-h-[56px] border-l-4 bg-navy px-4 py-3 font-sans text-sm leading-relaxed text-white/85 ${
							message.tone === 'bad'
								? 'border-red-400'
								: message.tone === 'good'
									? 'border-emerald-400'
									: 'border-white/30'
						}`}
						aria-live="polite"
						dangerouslySetInnerHTML={{ __html: message.html }}
					/>
				</section>

				<section className="border border-white/10 bg-navy-soft p-4 sm:p-5">
					<p className="font-sans text-xs uppercase tracking-[0.16em] text-white/50">
						Steps (in the wrong order, on purpose)
					</p>
					<ul className="mt-3 grid gap-2">
						{trayOrder.map((id) => {
							const step = level.steps.find((s) => s.id === id)
							if (!step || level.steps.indexOf(step) < done) return null
							return (
								<li key={id}>
									<button
										type="button"
										draggable
										onDragStart={(event) =>
											event.dataTransfer.setData('text/plain', id)
										}
										onClick={() => place(id)}
										className="flex w-full items-center gap-3 border border-white/15 bg-navy px-3 py-2.5 text-left transition hover:border-sand hover:translate-x-0.5 focus-visible:border-sand focus-visible:outline-none"
									>
										<span className="grid h-9 w-9 flex-none place-items-center border border-white/15 font-display text-lg text-sand">
											?
										</span>
										<span>
											<span className="block font-sans text-sm font-semibold">
												{step.title}
											</span>
											<span className="block font-sans text-xs text-white/60">
												{step.detail}
											</span>
										</span>
									</button>
								</li>
							)
						})}
					</ul>

					<p className="mt-5 font-sans text-xs uppercase tracking-[0.16em] text-white/50">
						Built so far
					</p>
					<ol className="mt-3 flex flex-col-reverse gap-1.5">
						{level.steps.slice(0, done).flatMap((step) => {
							const rows = [
								<li
									key={step.id}
									className="flex items-center justify-between border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 font-sans text-sm"
								>
									<span>{step.title}</span>
									<span className="text-emerald-300">✓</span>
								</li>,
							]
							if (step.inspection) {
								rows.push(
									<li
										key={`${step.id}-insp`}
										className="flex items-center justify-between border border-sand/50 bg-sand/10 px-3 py-1.5 font-sans text-sm"
									>
										<span>{step.inspection}</span>
										<span className="text-xs font-semibold tracking-[0.16em] text-sand">
											PASS
										</span>
									</li>,
								)
							}
							return rows
						})}
					</ol>
				</section>
			</div>

			{over ? (
				<div className="mt-6 border border-sand/40 bg-navy-soft p-6 sm:p-8">
					<p className="font-display text-3xl tracking-[0.2em] text-sand" aria-label={`${stars} of 3 stars`}>
						{'★'.repeat(stars)}
						{'☆'.repeat(3 - stars)}
					</p>
					<h3 className="mt-2 font-display text-3xl tracking-tight">
						{level.winTitles[3 - stars]}
					</h3>
					<p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-white/75">
						{level.winBody}
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						<Link
							href="/design-your-project"
							className="btn-primary"
							onClick={() => track('play_cta', { level: level.key })}
						>
							{level.ctaLabel}
						</Link>
						{nextLevel ? (
							<button type="button" className="btn-secondary" onClick={() => load(nextLevel)}>
								Next level: {nextLevel.pickLabel}
							</button>
						) : null}
						<button type="button" className="btn-secondary" onClick={() => load(level)}>
							Play again
						</button>
					</div>
				</div>
			) : null}

			<p className="mt-6 font-sans text-xs leading-relaxed text-white/50">{level.footnote}</p>

			<style jsx global>{`
				.build-layer {
					opacity: 0;
					transition: opacity 0.5s ease;
				}
				.build-layer.on {
					opacity: 1;
				}
				.build-drip {
					fill: #5cb8ff;
					opacity: 0;
				}
				.is-leaking .build-drip {
					animation: build-drip 1.1s ease-in 2;
				}
				@keyframes build-drip {
					0% { transform: translateY(0); opacity: 0; }
					15% { opacity: 1; }
					100% { transform: translateY(70px); opacity: 0; }
				}
				@keyframes build-shake {
					25% { transform: translateX(-5px); }
					75% { transform: translateX(5px); }
				}
				.animate-shake {
					animation: build-shake 0.3s;
				}
				@media (prefers-reduced-motion: reduce) {
					.is-leaking .build-drip { animation: none; opacity: 1; }
					.animate-shake { animation: none; }
				}
			`}</style>
		</div>
	)
}

function layerClass(revealed: Set<string | undefined>, id: string) {
	return `build-layer${revealed.has(id) ? ' on' : ''}`
}

function Drips({ y }: { y: number }) {
	return (
		<g>
			<circle className="build-drip" cx="200" cy={y} r="4" />
			<circle className="build-drip" cx="260" cy={y} r="4" style={{ animationDelay: '.2s' }} />
			<circle className="build-drip" cx="330" cy={y} r="4" style={{ animationDelay: '.4s' }} />
		</g>
	)
}

function RoofScene({ revealed }: { revealed: Set<string | undefined> }) {
	const on = (id: string) => layerClass(revealed, id)
	return (
		<svg viewBox="0 0 520 300" className="block h-auto w-full" role="img" aria-label="Cross-section of a gable roof being re-roofed">
			<rect width="520" height="300" fill="#0C1120" />
			<rect x="110" y="170" width="300" height="120" fill="#1C2438" />
			<rect x="240" y="215" width="40" height="75" fill="#12182B" />
			{/* old roof — hidden once torn off */}
			<g style={{ opacity: revealed.has('tearoff') ? 0 : 1, transition: 'opacity .5s' }}>
				<polygon points="90,180 260,70 430,180" fill="#5E4A3A" />
				<polygon points="110,178 260,82 410,178" fill="#4A3A2E" />
			</g>
			<polygon points="100,176 260,72 420,176 420,186 260,84 100,186" fill="#6B5A45" />
			<g className={on('deck')}>
				<polygon points="96,174 260,66 424,174 424,182 260,76 96,182" fill="#D4BC96" />
				<g fill="#C9D1D9">
					{[130, 160, 190, 220, 300, 330, 360, 390].map((cx, i) => (
						<circle key={cx} cx={cx} cy={i < 4 ? 156 - i * 20 : 96 + (i - 4) * 20} r="2.2" />
					))}
				</g>
			</g>
			<g className={on('eave')} fill="#C9D1D9">
				<rect x="86" y="170" width="14" height="16" rx="1" />
				<rect x="420" y="170" width="14" height="16" rx="1" />
			</g>
			<g className={on('barrier')}>
				<polygon points="92,171 260,60 428,171 428,177 260,68 92,177" fill="#2C2C32" />
				<polygon points="92,171 260,60 428,171 428,173 260,63 92,173" fill="#3E3E46" />
			</g>
			<g className={on('flashing')}>
				<rect x="244" y="76" width="32" height="10" fill="#C9D1D9" />
				<rect x="256" y="40" width="12" height="40" fill="#8E9AA5" />
				<rect x="252" y="38" width="20" height="5" fill="#C9D1D9" />
			</g>
			<g className={on('shingles')} stroke="#12182B" strokeWidth="1">
				<polygon points="90,170 260,56 430,170 430,164 260,48 90,164" fill="#4F6B8A" />
				<polygon points="104,160 260,58 416,160 416,154 260,50 104,154" fill="#5A7897" />
				<polygon points="134,142 260,60 386,142 386,136 260,52 134,136" fill="#4F6B8A" />
				<polygon points="164,124 260,62 356,124 356,118 260,54 164,118" fill="#5A7897" />
				<polygon points="194,106 260,64 326,106 326,100 260,56 194,100" fill="#4F6B8A" />
			</g>
			<g className={on('ridge')}>
				<rect x="238" y="40" width="44" height="10" rx="3" fill="#C4A574" />
				<text x="260" y="30" textAnchor="middle" fontSize="11" fill="#6FD39B" fontFamily="monospace">
					PASSED FINAL
				</text>
			</g>
			<Drips y={190} />
			<rect y="290" width="520" height="10" fill="#0A0E1A" />
		</svg>
	)
}

function HouseScene({ revealed }: { revealed: Set<string | undefined> }) {
	const on = (id: string) => layerClass(revealed, id)
	const Window = ({ x }: { x: number }) => (
		<rect x={x} y="170" width="40" height="44" fill="#5cb8ff" opacity=".6" stroke="#C9D1D9" strokeWidth="3" />
	)
	const Door = () => (
		<rect x="244" y="180" width="32" height="60" fill="#6B5A45" stroke="#C9D1D9" strokeWidth="3" />
	)
	return (
		<svg viewBox="0 0 520 300" className="block h-auto w-full" role="img" aria-label="Cross-section of a concrete block house being built">
			<rect width="520" height="300" fill="#0C1120" />
			<rect y="262" width="520" height="38" fill="#3A2F22" />
			<g className={on('lot')}>
				<rect x="40" y="250" width="440" height="12" fill="#5C4A34" />
				<rect x="60" y="236" width="6" height="14" fill="#C4A574" />
				<rect x="454" y="236" width="6" height="14" fill="#C4A574" />
			</g>
			<g className={on('footers')} fill="#8E9AA5">
				<rect x="96" y="252" width="40" height="14" />
				<rect x="384" y="252" width="40" height="14" />
			</g>
			<g className={on('slab')}>
				<rect x="96" y="240" width="328" height="12" fill="#C9D1D9" />
				<rect x="250" y="232" width="8" height="8" fill="#5cb8ff" />
			</g>
			<g className={on('block')}>
				<rect x="122" y="140" width="276" height="100" fill="#1C2438" />
				<g fill="#A59C8E" stroke="#0C1120" strokeWidth="1">
					<rect x="100" y="140" width="22" height="100" />
					<rect x="398" y="140" width="22" height="100" />
					{[160, 180, 200, 220].map((y) => (
						<g key={y}>
							<line x1="100" y1={y} x2="122" y2={y} />
							<line x1="398" y1={y} x2="420" y2={y} />
						</g>
					))}
				</g>
			</g>
			<g className={on('beam')}>
				<rect x="96" y="128" width="328" height="12" fill="#7C8894" />
			</g>
			<g className={on('trusses')} fill="none" stroke="#D4BC96" strokeWidth="5">
				<polyline points="96,128 260,40 424,128" />
				<line x1="96" y1="128" x2="424" y2="128" />
				<line x1="180" y1="128" x2="260" y2="40" />
				<line x1="340" y1="128" x2="260" y2="40" />
				<line x1="180" y1="128" x2="200" y2="72" />
				<line x1="340" y1="128" x2="320" y2="72" />
			</g>
			<g className={on('dryin')}>
				<polygon points="86,134 260,28 434,134 434,126 260,18 86,126" fill="#3E3E46" />
				<Window x={150} />
				<Window x={330} />
				<Door />
			</g>
			<g className={on('rough')} strokeWidth="3" fill="none">
				<polyline points="130,150 130,230" stroke="#FFD166" />
				<polyline points="390,150 390,230" stroke="#FFD166" />
				<polyline points="250,240 250,160 300,160" stroke="#5cb8ff" />
				<rect x="200" y="132" width="120" height="10" fill="#C9D1D9" stroke="none" />
			</g>
			<g className={on('drywall')}>
				<rect x="122" y="140" width="276" height="100" fill="#E8E2D6" opacity=".9" />
				<Window x={150} />
				<Door />
				<Window x={330} />
			</g>
			<g className={on('co')}>
				<polygon points="86,134 260,28 434,134 434,126 260,18 86,126" fill="#4F6B8A" />
				<polygon points="120,112 260,30 400,112 400,106 260,22 120,106" fill="#5A7897" />
				<polygon points="160,88 260,32 360,88 360,82 260,24 160,82" fill="#4F6B8A" />
				<rect x="238" y="14" width="44" height="10" rx="3" fill="#C4A574" />
				<text x="260" y="10" textAnchor="middle" fontSize="10" fill="#6FD39B" fontFamily="monospace">
					CERTIFICATE OF OCCUPANCY
				</text>
				<rect x="100" y="246" width="320" height="6" fill="#4A6A3A" />
			</g>
			<Drips y={150} />
		</svg>
	)
}
