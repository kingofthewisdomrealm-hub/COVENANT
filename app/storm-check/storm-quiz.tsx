'use client'

import { track } from '@vercel/analytics'
import { useAction } from 'next-safe-action/hooks'
import { useRef, useState } from 'react'

import { submitStormCheck } from '@/app/actions/storm-check'
import { CalEmbed } from '@/app/design-your-project/cal-embed'
import { siteConfig } from '@/content/site'
import {
	COUNTY_NAMES,
	STORM_CHECK_DISCLAIMER,
	STORM_INSURANCE_NOTICE,
	bandCopy,
	countyForZip,
	damageSigns,
	eventsForZip,
	goalOptions,
	lookedOptions,
	noticedOptions,
	propertyOptions,
	roofAgeOptions,
	roofTypeOptions,
	scoreStormCheck,
} from '@/content/storm-check'

/**
 * The hail & wind storm check — a quiz funnel.
 *
 * Same two rules as the project designer:
 * 1. CONTACT DETAILS COME LAST. The visitor sees the event match and builds
 *    up their own answer before anyone asks for a phone number.
 * 2. STEP 1 IS CHEAP. Five digits, then an immediate, honest payoff: "a
 *    recorded hail event covers your county" — or "nothing on file", said
 *    plainly. That first answer is what earns the next six.
 */

const TOTAL_STEPS = 7

const fieldClass =
	'w-full border border-navy/15 bg-stone px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2'
const labelClass =
	'font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy'
const linkButton =
	'inline-flex min-h-[44px] items-center font-sans text-sm text-stone-muted underline underline-offset-4 hover:text-navy'

interface Answers {
	zip: string
	property: string
	noticed: string
	signs: string[]
	roofAge: string
	roofType: string
	looked: string
	goal: string
	name: string
	email: string
	phone: string
	projectAddress: string
	notes: string
}

const EMPTY: Answers = {
	zip: '',
	property: '',
	noticed: '',
	signs: [],
	roofAge: '',
	roofType: '',
	looked: '',
	goal: '',
	name: '',
	email: '',
	phone: '',
	projectAddress: '',
	notes: '',
}

const NOTHING_YET = 'Nothing yet — I have not looked closely'

export function StormQuiz() {
	const [step, setStep] = useState(1)
	const [answers, setAnswers] = useState<Answers>(EMPTY)
	const [isSuccess, setIsSuccess] = useState(false)
	const [showErrors, setShowErrors] = useState(false)
	const topRef = useRef<HTMLDivElement>(null)

	const { execute, isExecuting, result } = useAction(submitStormCheck, {
		onSuccess: ({ data }) => {
			if (data?.ok) {
				setIsSuccess(true)
				track('storm_submit', { band: data.band })
			}
		},
	})

	const fieldErrors = result.validationErrors?.fieldErrors
	const serverError = result.serverError

	const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
		setAnswers((current) => ({ ...current, [key]: value }))

	const toggleSign = (option: string) =>
		setAnswers((current) => {
			if (option === NOTHING_YET) {
				return { ...current, signs: current.signs.includes(option) ? [] : [option] }
			}
			const without = current.signs.filter((item) => item !== NOTHING_YET)
			return {
				...current,
				signs: without.includes(option)
					? without.filter((item) => item !== option)
					: [...without, option],
			}
		})

	const goTo = (next: number) => {
		setStep(next)
		requestAnimationFrame(() => {
			topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		})
	}

	const advance = () => {
		if (step === 1) track('storm_start', { zip: answers.zip })
		track('storm_step_complete', { step })
		goTo(step + 1)
	}

	const zipValid = /^\d{5}$/.test(answers.zip)
	const county = zipValid ? countyForZip(answers.zip) : null
	const events = zipValid ? eventsForZip(answers.zip) : []

	const canAdvance =
		step === 1
			? zipValid && Boolean(answers.property)
			: step === 2
				? Boolean(answers.noticed)
				: step === 3
					? answers.signs.length > 0
					: step === 4
						? Boolean(answers.roofAge && answers.roofType)
						: step === 5
							? Boolean(answers.looked)
							: step === 6
								? Boolean(answers.goal)
								: true

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setShowErrors(true)
		execute({
			zip: answers.zip,
			property: answers.property,
			noticed: answers.noticed,
			signs: answers.signs,
			roofAge: answers.roofAge,
			roofType: answers.roofType,
			looked: answers.looked,
			goal: answers.goal,
			name: answers.name,
			email: answers.email,
			phone: answers.phone,
			projectAddress: answers.projectAddress,
			notes: answers.notes || undefined,
			website: '',
		})
	}

	const restart = () => {
		setAnswers(EMPTY)
		setIsSuccess(false)
		setShowErrors(false)
		setStep(1)
	}

	return (
		<div ref={topRef} className="scroll-mt-24">
			<div className="border border-navy/10 bg-white shadow-[0_24px_60px_-40px_rgba(12,17,32,0.5)]">
				<Progress step={isSuccess ? TOTAL_STEPS : step} done={isSuccess} />

				<div className="px-6 py-8 sm:px-10 sm:py-10">
					{isSuccess ? (
						<Results answers={answers} onRestart={restart} />
					) : (
						<>
							{step === 1 ? (
								<>
									<Question
										title="Was your area hit?"
										help="Enter your ZIP code. We check it against recorded storm reports for the Treasure Coast."
									/>
									<div className="grid gap-5 sm:grid-cols-[12rem_1fr]">
										<Field
											label="ZIP code"
											name="zip"
											inputMode="numeric"
											autoComplete="postal-code"
											value={answers.zip}
											onChange={(value) => set('zip', value.replace(/\D/g, '').slice(0, 5))}
										/>
										<div className="self-end">
											{zipValid ? <ZipVerdict zip={answers.zip} /> : null}
										</div>
									</div>
									<div className="mt-8">
										<p className={labelClass}>What kind of property?</p>
										<div className="mt-3">
											<ChipRow
												options={propertyOptions}
												selected={answers.property ? [answers.property] : []}
												onToggle={(value) => set('property', value)}
											/>
										</div>
									</div>
									<Reassurance>
										Six short questions after this. No phone number until the end,
										and nobody calls unless you ask.
									</Reassurance>
								</>
							) : null}

							{step === 2 ? (
								<>
									<Question
										title="When did you start wondering about it?"
										help="Pick the closest one. Guessing is fine."
									/>
									<TileGrid
										options={noticedOptions}
										selected={answers.noticed}
										onSelect={(value) => set('noticed', value)}
									/>
								</>
							) : null}

							{step === 3 ? (
								<>
									<Question
										title="What have you noticed around the house?"
										help="Check everything you have seen. Hail marks the soft metals — gutters, AC fins, screens — long before the roof shows it from the street."
									/>
									<ChipRow
										options={damageSigns.map((sign) => sign.label)}
										selected={answers.signs}
										onToggle={toggleSign}
										multi
									/>
									<InsuranceNotice />
								</>
							) : null}

							{step === 4 ? (
								<>
									<Question
										title="Tell us about the roof."
										help="Rough is fine. We confirm it on site."
									/>
									<p className={labelClass}>How old is it?</p>
									<div className="mt-3">
										<ChipRow
											options={roofAgeOptions}
											selected={answers.roofAge ? [answers.roofAge] : []}
											onToggle={(value) => set('roofAge', value)}
										/>
									</div>
									<p className={`${labelClass} mt-8`}>What is it made of?</p>
									<div className="mt-3">
										<ChipRow
											options={roofTypeOptions}
											selected={answers.roofType ? [answers.roofType] : []}
											onToggle={(value) => set('roofType', value)}
										/>
									</div>
								</>
							) : null}

							{step === 5 ? (
								<>
									<Question
										title="Has anyone looked at it yet?"
										help="There is no wrong answer. It tells us where to start."
									/>
									<TileGrid
										options={lookedOptions}
										selected={answers.looked}
										onSelect={(value) => set('looked', value)}
									/>
								</>
							) : null}

							{step === 6 ? (
								<>
									<Question title="What would be most useful to you right now?" />
									<TileGrid
										options={goalOptions}
										selected={answers.goal}
										onSelect={(value) => set('goal', value)}
									/>
									<Reassurance>
										If the honest answer is “nothing is wrong with your roof”, that
										is what you will hear. We would rather tell you that than sell
										you a repair you do not need.
									</Reassurance>
								</>
							) : null}

							{step === 7 ? (
								<form onSubmit={handleSubmit} noValidate>
									<Question
										title="Where should we send your results?"
										help="Last step. Your storm check is written up and emailed to you."
									/>

									<div
										aria-hidden="true"
										className="absolute left-[-9999px] h-px w-px overflow-hidden"
									>
										<label>
											Leave this field empty
											<input
												type="text"
												tabIndex={-1}
												autoComplete="off"
												value=""
												onChange={() => undefined}
											/>
										</label>
									</div>

									<div className="grid gap-5 sm:grid-cols-2">
										<Field
											label="Your name"
											name="name"
											autoComplete="name"
											value={answers.name}
											onChange={(value) => set('name', value)}
											error={showErrors ? fieldErrors?.name?.[0] : undefined}
										/>
										<Field
											label="Email"
											name="email"
											type="email"
											autoComplete="email"
											value={answers.email}
											onChange={(value) => set('email', value)}
											error={showErrors ? fieldErrors?.email?.[0] : undefined}
										/>
										<Field
											label="Phone"
											name="phone"
											type="tel"
											autoComplete="tel"
											value={answers.phone}
											onChange={(value) => set('phone', value)}
											error={showErrors ? fieldErrors?.phone?.[0] : undefined}
										/>
										<Field
											label="Property address"
											name="projectAddress"
											autoComplete="street-address"
											value={answers.projectAddress}
											onChange={(value) => set('projectAddress', value)}
											error={showErrors ? fieldErrors?.projectAddress?.[0] : undefined}
										/>
										<label className="block space-y-2 sm:col-span-2">
											<span className={labelClass}>
												Anything else we should know? (optional)
											</span>
											<textarea
												rows={3}
												value={answers.notes}
												onChange={(event) => set('notes', event.target.value)}
												className={fieldClass}
											/>
										</label>
									</div>

									<Reassurance>
										<strong className="text-navy">What happens next:</strong> your
										results arrive by email right away. If they point to damage, you
										can book a free roof inspection on the next screen.{' '}
										{siteConfig.responseExpectation}
									</Reassurance>

									{serverError ? (
										<p
											role="alert"
											className="mt-5 border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
										>
											{serverError}
										</p>
									) : null}

									<div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-navy/10 pt-6">
										<button type="button" onClick={() => goTo(6)} className={linkButton}>
											Back
										</button>
										<button
											type="submit"
											disabled={isExecuting}
											className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
										>
											{isExecuting ? 'Checking…' : 'Show me my results'}
										</button>
									</div>

									<p className="mt-4 font-sans text-sm text-stone-muted">
										No newsletter. No drip campaign. We do not sell your information
										to anyone.
									</p>
								</form>
							) : null}

							{step < 7 ? (
								<div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-navy/10 pt-6">
									{step > 1 ? (
										<button type="button" onClick={() => goTo(step - 1)} className={linkButton}>
											Back
										</button>
									) : (
										<span />
									)}
									<button
										type="button"
										onClick={advance}
										disabled={!canAdvance}
										className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
									>
										Continue
									</button>
								</div>
							) : null}
						</>
					)}
				</div>
			</div>
		</div>
	)

	function ZipVerdict({ zip }: { zip: string }) {
		if (!county) {
			return (
				<p className="border border-navy/10 bg-stone px-4 py-3 font-sans text-sm text-stone-muted">
					{zip} is outside the counties we track. You can still finish the check —
					we just cannot match a recorded storm to it.
				</p>
			)
		}
		if (events.length === 0) {
			return (
				<p className="border border-navy/10 bg-stone px-4 py-3 font-sans text-sm text-stone-muted">
					{COUNTY_NAMES[county]}. No recorded hail or wind event on file for your
					county yet.
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
}

function Progress({ step, done }: { step: number; done: boolean }) {
	return (
		<div className="bg-navy px-6 py-5 text-white sm:px-10">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="font-sans text-sm font-semibold">
					{done ? 'Your storm check' : `Question ${step} of ${TOTAL_STEPS}`}
					{done ? null : (
						<span className="ml-2 font-normal text-white/60">
							about {Math.max(10, (TOTAL_STEPS + 1 - step) * 10)} seconds left
						</span>
					)}
				</p>
				<p className="font-sans text-xs uppercase tracking-[0.16em] text-sand">
					{siteConfig.license.number}
				</p>
			</div>
			<div
				className="mt-4 flex gap-1.5"
				role="progressbar"
				aria-valuenow={step}
				aria-valuemin={1}
				aria-valuemax={TOTAL_STEPS}
				aria-label="Storm check progress"
			>
				{Array.from({ length: TOTAL_STEPS }).map((_, index) => (
					<span
						key={index}
						className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
							index < step ? 'bg-sand' : 'bg-white/20'
						}`}
					/>
				))}
			</div>
		</div>
	)
}

function Question({ title, help }: { title: string; help?: string }) {
	return (
		<div className="mb-7">
			<h2 className="font-display text-2xl tracking-tight text-navy sm:text-3xl">
				{title}
			</h2>
			{help ? (
				<p className="mt-2 font-sans text-base text-stone-muted">{help}</p>
			) : null}
		</div>
	)
}

function TileGrid({
	options,
	selected,
	onSelect,
}: {
	options: readonly string[]
	selected: string
	onSelect: (value: string) => void
}) {
	return (
		<div className="grid gap-3 sm:grid-cols-2">
			{options.map((option) => (
				<button
					key={option}
					type="button"
					onClick={() => onSelect(option)}
					aria-pressed={selected === option}
					className={`h-full border p-5 text-left font-sans text-base font-semibold leading-snug transition duration-200 ${
						selected === option
							? 'border-navy bg-navy text-white'
							: 'border-navy/15 bg-white text-navy hover:border-sand'
					}`}
				>
					{option}
				</button>
			))}
		</div>
	)
}

function ChipRow({
	options,
	selected,
	onToggle,
	multi,
}: {
	options: readonly string[]
	selected: readonly string[]
	onToggle: (value: string) => void
	multi?: boolean
}) {
	return (
		<div className="flex flex-wrap gap-2.5">
			{options.map((option) => {
				const isOn = selected.includes(option)
				return (
					<button
						key={option}
						type="button"
						onClick={() => onToggle(option)}
						aria-pressed={multi ? isOn : undefined}
						className={`rounded-full border px-4 py-2 font-sans text-sm transition duration-200 ${
							isOn
								? 'border-navy bg-navy text-white'
								: 'border-navy/15 bg-white text-navy hover:border-sand'
						}`}
					>
						{option}
					</button>
				)
			})}
		</div>
	)
}

function Reassurance({ children }: { children: React.ReactNode }) {
	return (
		<p className="mt-7 border-l-2 border-sand bg-stone px-4 py-3 font-sans text-sm leading-relaxed text-stone-muted">
			{children}
		</p>
	)
}

/** The only insurance sentence permitted on this page. See content/storm-check.ts. */
function InsuranceNotice() {
	return (
		<p className="mt-7 border border-sand-dark/40 bg-sand/10 px-4 py-3 font-sans text-sm leading-relaxed text-navy">
			{STORM_INSURANCE_NOTICE}
		</p>
	)
}

function Field({
	label,
	name,
	value,
	onChange,
	type = 'text',
	inputMode,
	autoComplete,
	error,
}: {
	label: string
	name: string
	value: string
	onChange: (value: string) => void
	type?: string
	inputMode?: 'numeric' | 'text'
	autoComplete?: string
	error?: string
}) {
	return (
		<label className="block space-y-2">
			<span className={labelClass}>{label}</span>
			<input
				name={name}
				type={type}
				inputMode={inputMode}
				autoComplete={autoComplete}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				aria-invalid={Boolean(error)}
				className={fieldClass}
			/>
			{error ? <span className="block text-sm text-red-700">{error}</span> : null}
		</label>
	)
}

function Results({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
	const { score, band, events } = scoreStormCheck(answers)
	const copy = bandCopy[band]
	const tone =
		band === 'likely'
			? 'border-red-300 bg-red-50 text-red-900'
			: band === 'possible'
				? 'border-sand-dark/50 bg-sand/15 text-navy'
				: 'border-emerald-300 bg-emerald-50 text-emerald-900'
	const bandLabel =
		band === 'likely' ? 'Likely' : band === 'possible' ? 'Possible' : 'Low'

	return (
		<div role="status" aria-live="polite">
			<div className={`border px-5 py-4 ${tone}`}>
				<p className="font-sans text-xs font-semibold uppercase tracking-[0.16em]">
					Storm damage likelihood: {bandLabel} · {score}/100
				</p>
				<h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
					{copy.title}
				</h2>
				<p className="mt-3 font-sans text-base leading-relaxed">{copy.body}</p>
			</div>

			<dl className="mt-6 border border-navy/10 bg-stone p-6">
				{(
					[
						['ZIP', answers.zip],
						['Recorded events', events.length ? events.map((e) => e.label).join(' · ') : 'None on file'],
						['Signs you noticed', answers.signs.join(' · ')],
						['Roof', `${answers.roofType}, ${answers.roofAge}`],
						['Who has looked', answers.looked],
					] as [string, string][]
				).map(([label, value]) => (
					<div
						key={label}
						className="grid gap-1 border-b border-navy/10 py-3 last:border-0 sm:grid-cols-[10rem_1fr] sm:gap-4"
					>
						<dt className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-muted">
							{label}
						</dt>
						<dd className="font-sans text-base text-ink">{value}</dd>
					</div>
				))}
			</dl>

			<InsuranceNotice />

			<div className="mt-10 border-t border-navy/10 pt-8">
				<h3 className="font-display text-2xl tracking-tight text-navy">
					{band === 'low'
						? 'Want a second set of eyes anyway?'
						: 'Next step: a free roof inspection.'}
				</h3>
				<p className="mt-3 body-copy">
					A licensed contractor gets on the roof, photographs what is there, and
					gives you a written answer. Usually under an hour. No charge, nothing
					attached to it. Pick a time that suits you.
				</p>
				<CalEmbed calLink={siteConfig.booking.calLink} />
			</div>

			<p className="mt-10 border-t border-navy/10 pt-5 font-sans text-xs leading-relaxed text-stone-muted">
				<strong className="text-navy">
					Covenant Builders · Florida Certified Building Contractor{' '}
					{siteConfig.license.number}
				</strong>
				<br />
				{STORM_CHECK_DISCLAIMER}
			</p>

			<button type="button" onClick={onRestart} className={`${linkButton} mt-6`}>
				Check another property
			</button>
		</div>
	)
}
