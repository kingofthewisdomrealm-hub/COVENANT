'use client'

import { track } from '@vercel/analytics'
import { useAction } from 'next-safe-action/hooks'
import { useRef, useState } from 'react'

import { CalEmbed } from './cal-embed'
import { submitProjectDesign } from '@/app/actions/design'
import {
	BRIEF_DISCLAIMER,
	STORM_INSURANCE_NOTICE,
	boardStages,
	budgetBands,
	finishLevels,
	projectBranches,
	timelineOptions,
	type BranchKey,
} from '@/content/design-your-project'
import { siteConfig } from '@/content/site'

/**
 * The guided project designer.
 *
 * Six steps, branching on the step-1 answer. Two rules drive the whole shape
 * and should survive any redesign:
 *
 * 1. CONTACT DETAILS COME LAST. Every study that shows multi-step forms losing
 *    to single-page forms involved asking for identifying information early.
 * 2. STEP 1 IS ONE CLICK, NO TYPING. The cheap first commitment is what makes
 *    people finish the expensive later ones.
 *
 * State is hand-rolled useState rather than a form library — the repo has no
 * react-hook-form and the programs explorer sets the precedent for doing this
 * with plain state.
 */

const TOTAL_STEPS = 6

const CITY_OPTIONS = [...siteConfig.serviceCities, 'Somewhere else'] as const

const fieldClass =
	'w-full border border-navy/15 bg-stone px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2'

const labelClass =
	'font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy'

interface Answers {
	projectType: BranchKey | ''
	property: string
	city: string
	scope: string[]
	size: string
	finishLevel: string
	boardStage: string
	timeline: string
	budgetBand: string
	name: string
	email: string
	phone: string
	projectAddress: string
	notes: string
}

const EMPTY: Answers = {
	projectType: '',
	property: '',
	city: '',
	scope: [],
	size: '',
	finishLevel: '',
	boardStage: '',
	timeline: '',
	budgetBand: '',
	name: '',
	email: '',
	phone: '',
	projectAddress: '',
	notes: '',
}

export function ProjectDesigner() {
	const [step, setStep] = useState(1)
	const [answers, setAnswers] = useState<Answers>(EMPTY)
	const [isSuccess, setIsSuccess] = useState(false)
	const [showErrors, setShowErrors] = useState(false)
	const topRef = useRef<HTMLDivElement>(null)

	const { execute, isExecuting, result } = useAction(submitProjectDesign, {
		onSuccess: ({ data }) => {
			if (data?.ok) {
				setIsSuccess(true)
				track('design_submit', { branch: answers.projectType || 'unknown' })
			}
		},
	})

	const branch = projectBranches.find((item) => item.key === answers.projectType)
	const fieldErrors = result.validationErrors?.fieldErrors
	const serverError = result.serverError

	const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
		setAnswers((current) => ({ ...current, [key]: value }))

	const toggleScope = (option: string) =>
		setAnswers((current) => ({
			...current,
			scope: current.scope.includes(option)
				? current.scope.filter((item) => item !== option)
				: [...current.scope, option],
		}))

	const scrollToTop = () => {
		requestAnimationFrame(() => {
			topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		})
	}

	const goTo = (next: number) => {
		setStep(next)
		scrollToTop()
	}

	const advance = () => {
		track('design_step_complete', {
			step,
			branch: answers.projectType || 'unknown',
		})
		goTo(step + 1)
	}

	const chooseType = (key: BranchKey) => {
		// Changing branch invalidates every branch-specific answer below it.
		setAnswers({ ...EMPTY, projectType: key })
		track('design_start', { branch: key })
		goTo(2)
	}

	/** Step 4 is size + finish level, or board stage for association work. */
	const stepFourComplete = branch?.usesFinishLevel
		? Boolean(answers.size && answers.finishLevel)
		: Boolean(answers.boardStage)

	const canAdvance =
		step === 2
			? Boolean(answers.property && answers.city)
			: step === 3
				? answers.scope.length > 0
				: step === 4
					? stepFourComplete
					: step === 5
						? Boolean(answers.timeline && answers.budgetBand)
						: true

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setShowErrors(true)
		if (!answers.projectType) return
		execute({
			projectType: answers.projectType,
			property: answers.property,
			city: answers.city,
			scope: answers.scope,
			size: answers.size || undefined,
			finishLevel: answers.finishLevel || undefined,
			boardStage: answers.boardStage || undefined,
			timeline: answers.timeline,
			budgetBand: answers.budgetBand,
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
		scrollToTop()
	}

	return (
		<div ref={topRef} className="scroll-mt-24">
			<div className="border border-navy/10 bg-white shadow-[0_24px_60px_-40px_rgba(12,17,32,0.5)]">
				<Progress step={isSuccess ? TOTAL_STEPS : step} done={isSuccess} />

				<div className="px-6 py-8 sm:px-10 sm:py-10">
					{isSuccess ? (
						<Results answers={answers} branchLabel={branch?.label} onRestart={restart} />
					) : (
						<>
							{step === 1 ? (
								<StepOne onChoose={chooseType} />
							) : null}

							{step === 2 && branch ? (
								<>
									<Question
										title={branch.propertyQuestion}
										help={branch.propertyHelp}
									/>
									<TileGrid
										options={branch.propertyOptions}
										selected={answers.property}
										onSelect={(value) => set('property', value)}
									/>
									<div className="mt-8">
										<p className={labelClass}>Which city?</p>
										<div className="mt-3">
											<ChipRow
												options={CITY_OPTIONS}
												selected={answers.city ? [answers.city] : []}
												onToggle={(value) => set('city', value)}
											/>
										</div>
									</div>
									<Reassurance>
										If you are outside our service area we will tell you honestly
										rather than waste your time.
									</Reassurance>
								</>
							) : null}

							{step === 3 && branch ? (
								<>
									<Question title={branch.scopeQuestion} help={branch.scopeHelp} />
									<ChipRow
										options={branch.scopeOptions}
										selected={answers.scope}
										onToggle={toggleScope}
										multi
									/>
									{answers.projectType === 'storm' ? (
										<InsuranceNotice />
									) : (
										<Reassurance>
											Most people check more than they end up building. That is
											normal — this is the planning stage.
										</Reassurance>
									)}
								</>
							) : null}

							{step === 4 && branch ? (
								branch.usesFinishLevel ? (
									<>
										<Question
											title="Roughly how big?"
											help="A range is fine. We will measure it properly when we walk it."
										/>
										<ChipRow
											options={branch.sizeOptions}
											selected={answers.size ? [answers.size] : []}
											onToggle={(value) => set('size', value)}
										/>
										<div className="mt-10">
											<Question
												title="How finished do you want it?"
												help="This moves the number more than square footage does. Be honest with yourself here."
												small
											/>
											<div className="grid gap-3 sm:grid-cols-3">
												{finishLevels.map((level) => (
													<Tile
														key={level.value}
														label={level.value}
														blurb={level.description}
														selected={answers.finishLevel === level.value}
														onSelect={() => set('finishLevel', level.value)}
													/>
												))}
											</div>
										</div>
									</>
								) : (
									<>
										<Question
											title="Where is the board in its decision?"
											help="We work differently depending on where you are. There is no wrong answer."
										/>
										<TileGrid
											options={boardStages}
											selected={answers.boardStage}
											onSelect={(value) => set('boardStage', value)}
										/>
										<Reassurance>
											If you are under a deadline, say so on the last step and we
											will move accordingly.
										</Reassurance>
									</>
								)
							) : null}

							{step === 5 ? (
								<>
									<Question title="When would you like this done?" />
									<ChipRow
										options={timelineOptions}
										selected={answers.timeline ? [answers.timeline] : []}
										onToggle={(value) => set('timeline', value)}
									/>
									<div className="mt-10">
										<Question
											title="What range are you working with?"
											help="This is not a commitment. It tells us whether to show you one option or three."
											small
										/>
										<ChipRow
											options={budgetBands}
											selected={answers.budgetBand ? [answers.budgetBand] : []}
											onToggle={(value) => set('budgetBand', value)}
										/>
									</div>
									<Reassurance>
										Nobody has ever been talked into a bigger project by answering
										this honestly. It is here so we do not waste your time designing
										something outside your range.
									</Reassurance>
								</>
							) : null}

							{step === 6 ? (
								<form onSubmit={handleSubmit} noValidate>
									<Question
										title="Where should we send your brief?"
										help="Last step. Then it is yours."
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
											label="Project address"
											name="projectAddress"
											autoComplete="street-address"
											value={answers.projectAddress}
											onChange={(value) => set('projectAddress', value)}
											error={
												showErrors ? fieldErrors?.projectAddress?.[0] : undefined
											}
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
										<strong className="text-navy">What happens next:</strong> we
										email your project brief right away. Someone on our team reads
										it and gets back to you. {siteConfig.responseExpectation}
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
										<button
											type="button"
											onClick={() => goTo(5)}
											className="font-sans text-sm text-stone-muted underline underline-offset-4 hover:text-navy"
										>
											Back
										</button>
										<button
											type="submit"
											disabled={isExecuting}
											className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
										>
											{isExecuting ? 'Sending…' : 'Send me my project brief'}
										</button>
									</div>

									<p className="mt-4 font-sans text-sm text-stone-muted">
										No newsletter. No drip campaign. We do not sell your
										information to anyone.
									</p>
								</form>
							) : null}

							{step > 1 && step < 6 ? (
								<div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-navy/10 pt-6">
									<button
										type="button"
										onClick={() => goTo(step - 1)}
										className="font-sans text-sm text-stone-muted underline underline-offset-4 hover:text-navy"
									>
										Back
									</button>
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
}

function Progress({ step, done }: { step: number; done: boolean }) {
	return (
		<div className="bg-navy px-6 py-5 text-white sm:px-10">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="font-sans text-sm font-semibold">
					{done ? 'Your project brief' : `Step ${step} of ${TOTAL_STEPS}`}
					{done ? null : (
						<span className="ml-2 font-normal text-white/60">
							about {Math.max(15, (TOTAL_STEPS + 1 - step) * 15)} seconds left
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
				aria-label="Project designer progress"
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

function Question({
	title,
	help,
	small,
}: {
	title: string
	help?: string
	small?: boolean
}) {
	return (
		<div className="mb-7">
			<h2
				className={`font-display tracking-tight text-navy ${
					small ? 'text-2xl' : 'text-2xl sm:text-3xl'
				}`}
			>
				{title}
			</h2>
			{help ? (
				<p className="mt-2 font-sans text-base text-stone-muted">{help}</p>
			) : null}
		</div>
	)
}

function StepOne({ onChoose }: { onChoose: (key: BranchKey) => void }) {
	const visible = projectBranches.filter((item) => !item.hidden)
	const fallback = projectBranches.find((item) => item.hidden)

	return (
		<>
			<Question
				title="What are we building?"
				help="Pick the closest one. You can change it later."
			/>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{visible.map((item) => (
					<Tile
						key={item.key}
						label={item.label}
						blurb={item.blurb}
						selected={false}
						onSelect={() => onChoose(item.key)}
					/>
				))}
			</div>
			{fallback ? (
				<button
					type="button"
					onClick={() => onChoose(fallback.key)}
					className="mt-5 font-sans text-sm text-stone-muted underline underline-offset-4 hover:text-navy"
				>
					{fallback.label}
				</button>
			) : null}
			<Reassurance>
				Five questions after this one. Nobody calls unless you ask us to.
			</Reassurance>
		</>
	)
}

function Tile({
	label,
	blurb,
	selected,
	onSelect,
}: {
	label: string
	blurb?: string
	selected: boolean
	onSelect: () => void
}) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={selected}
			className={`h-full border p-5 text-left transition duration-200 ${
				selected
					? 'border-navy bg-navy text-white'
					: 'border-navy/15 bg-white text-navy hover:border-sand'
			}`}
		>
			<span className="block font-sans text-base font-semibold leading-snug">
				{label}
			</span>
			{blurb ? (
				<span
					className={`mt-1.5 block font-sans text-sm leading-snug ${
						selected ? 'text-white/70' : 'text-stone-muted'
					}`}
				>
					{blurb}
				</span>
			) : null}
		</button>
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
				<Tile
					key={option}
					label={option}
					selected={selected === option}
					onSelect={() => onSelect(option)}
				/>
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

/**
 * The only insurance sentence permitted anywhere on this page.
 * See the compliance comment in content/design-your-project.ts.
 */
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
	autoComplete,
	error,
}: {
	label: string
	name: string
	value: string
	onChange: (value: string) => void
	type?: string
	autoComplete?: string
	error?: string
}) {
	return (
		<label className="block space-y-2">
			<span className={labelClass}>{label}</span>
			<input
				name={name}
				type={type}
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

function Results({
	answers,
	branchLabel,
	onRestart,
}: {
	answers: Answers
	branchLabel?: string
	onRestart: () => void
}) {
	const rows: [string, string][] = [
		['Project type', branchLabel || ''],
		['Property', answers.property],
		['City', answers.city],
		['Scope', answers.scope.join(' · ')],
		['Size', answers.size],
		['Finish level', answers.finishLevel],
		['Board stage', answers.boardStage],
		['Timeline', answers.timeline],
		['Budget range', answers.budgetBand],
		['Project address', answers.projectAddress],
		['Notes', answers.notes],
	]

	return (
		<div role="status" aria-live="polite">
			<Question
				title="Here is your project."
				help="It is on its way to your inbox now — yours whether you hire us or not."
			/>

			<dl className="border border-navy/10 bg-stone p-6">
				{rows
					.filter(([, value]) => Boolean(value))
					.map(([label, value]) => (
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

			{answers.projectType === 'condo' ? (
				<p className="mt-6 border border-sand-dark/40 bg-sand/10 px-5 py-4 font-sans text-sm leading-relaxed text-navy">
					<strong>
						Association work is priced from the building, never from a table.
					</strong>{' '}
					There is no published benchmark for Florida structural repair
					construction, so we will not pretend to give you one. What we can tell
					you is that deferred structural work compounds — the longer a building
					waits, the larger the repair becomes. We would rather walk your building
					this month.
				</p>
			) : null}

			<div className="mt-10 border-t border-navy/10 pt-8">
				<h3 className="font-display text-2xl tracking-tight text-navy">
					One thing left: let us come look at it.
				</h3>
				<p className="mt-3 body-copy">
					Everything above is what you told us. What we do not know yet is what is
					behind your walls, under your slab, or how your lot drains. That is a
					walkthrough — usually under an hour, and there is no charge for
					it. Pick a time that suits you.
				</p>
				<CalEmbed calLink={siteConfig.booking.calLink} />
			</div>

			<p className="mt-10 border-t border-navy/10 pt-5 font-sans text-xs leading-relaxed text-stone-muted">
				<strong className="text-navy">
					Covenant Builders · Florida Certified Building Contractor{' '}
					{siteConfig.license.number}
				</strong>
				<br />
				{BRIEF_DISCLAIMER}
			</p>

			<button
				type="button"
				onClick={onRestart}
				className="mt-6 font-sans text-sm text-stone-muted underline underline-offset-4 hover:text-navy"
			>
				Design another project
			</button>
		</div>
	)
}
