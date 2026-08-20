'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { siteConfig } from '@/content/site'

/**
 * A deliberately small floor-plan sketcher for the project designer.
 *
 * TWO MODES, ONE DATA MODEL. Free-hand dragging on a grid is the nicer
 * experience with a mouse and close to unusable with a thumb, so large screens
 * get a drag-to-draw canvas and phones get a room-by-room form that lays the
 * same plan out automatically. Both produce identical `Room[]` data, so
 * everything downstream — the preview, the PNG, the summary — is shared. The
 * visitor can switch modes by hand if the guess is wrong.
 *
 * ONE GRID UNIT IS ONE FOOT. Keeping the model in feet rather than pixels is
 * what makes the square-footage total honest and the export resolution-free.
 *
 * This is not CAD and should not grow into it. No angles, no curves, no
 * layers, no doors or windows. Rectangles a homeowner can push around in
 * thirty seconds, because the point is a conversation starter for the
 * walkthrough, not a construction document.
 */

export interface Room {
	id: string
	name: string
	/** Position and size in FEET, snapped to whole feet. */
	x: number
	y: number
	w: number
	h: number
}

const PLAN_WIDTH_FT = 44
const PLAN_HEIGHT_FT = 30
const MIN_SIDE_FT = 3

const ROOM_PRESETS = [
	'Kitchen',
	'Living room',
	'Primary bedroom',
	'Bedroom',
	'Primary bath',
	'Bathroom',
	'Dining',
	'Office',
	'Garage',
	'Lanai / porch',
	'Laundry',
	'Hallway',
] as const

let idCounter = 0
const nextId = () => `room-${(idCounter += 1)}`

export function totalSquareFeet(rooms: readonly Room[]) {
	return rooms.reduce((sum, room) => sum + room.w * room.h, 0)
}

export function planSummary(rooms: readonly Room[]) {
	if (!rooms.length) return ''
	const lines = rooms.map(
		(room) => `${room.name || 'Room'}: ${room.w} x ${room.h} ft (${room.w * room.h} sq ft)`
	)
	lines.push(`Total: ${totalSquareFeet(rooms)} sq ft across ${rooms.length} spaces`)
	return lines.join('\n')
}

/**
 * Redraws the plan onto a plain canvas for export.
 *
 * Deliberately NOT a serialisation of the on-screen SVG. Turning SVG into a
 * raster goes through an Image and a data URL, where missing fonts and
 * tainted canvases are easy to hit and hard to debug. Drawing the same room
 * data a second time with canvas primitives is a few more lines and cannot
 * fail in those ways.
 */
export function renderPlanToPng(rooms: readonly Room[]): string | null {
	if (typeof document === 'undefined' || !rooms.length) return null

	const scale = 22
	const pad = 48
	const footer = 56

	const maxX = Math.max(...rooms.map((r) => r.x + r.w))
	const maxY = Math.max(...rooms.map((r) => r.y + r.h))
	const minX = Math.min(...rooms.map((r) => r.x))
	const minY = Math.min(...rooms.map((r) => r.y))

	const totalLine = `${totalSquareFeet(rooms)} sq ft across ${rooms.length} ${rooms.length === 1 ? 'space' : 'spaces'}`
	const legalLine = `Sketch only — not a construction document. Covenant Builders · ${siteConfig.license.number}`

	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	if (!ctx) return null

	/**
	 * Size the canvas to the WIDER of the plan and the footer text.
	 *
	 * A narrow plan — one small room — used to clip the footer mid-word, which
	 * truncated the licence number. That is not cosmetic: F.S. 489.119(5)(b)
	 * requires the certification number on an offer of services in any medium,
	 * and this image is attached to an email. Measure the text, then commit to
	 * a width. (Setting canvas.width resets the context, so measure first.)
	 */
	ctx.font = '600 16px system-ui, -apple-system, Segoe UI, sans-serif'
	const totalWidth = ctx.measureText(totalLine).width
	ctx.font = '12px system-ui, -apple-system, Segoe UI, sans-serif'
	const legalWidth = ctx.measureText(legalLine).width

	canvas.width = Math.ceil(
		Math.max((maxX - minX) * scale, totalWidth, legalWidth) + pad * 2
	)
	canvas.height = (maxY - minY) * scale + pad * 2 + footer

	ctx.fillStyle = '#FFFFFF'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	const ox = pad - minX * scale
	const oy = pad - minY * scale

	// Grid, one line per foot, heavier every five.
	ctx.lineWidth = 1
	for (let ft = 0; ft <= maxX - minX; ft += 1) {
		ctx.strokeStyle = ft % 5 === 0 ? 'rgba(18,24,43,0.16)' : 'rgba(18,24,43,0.06)'
		ctx.beginPath()
		ctx.moveTo(pad + ft * scale, pad)
		ctx.lineTo(pad + ft * scale, pad + (maxY - minY) * scale)
		ctx.stroke()
	}
	for (let ft = 0; ft <= maxY - minY; ft += 1) {
		ctx.strokeStyle = ft % 5 === 0 ? 'rgba(18,24,43,0.16)' : 'rgba(18,24,43,0.06)'
		ctx.beginPath()
		ctx.moveTo(pad, pad + ft * scale)
		ctx.lineTo(pad + (maxX - minX) * scale, pad + ft * scale)
		ctx.stroke()
	}

	for (const room of rooms) {
		const x = ox + room.x * scale
		const y = oy + room.y * scale
		const w = room.w * scale
		const h = room.h * scale

		ctx.fillStyle = 'rgba(196,165,116,0.20)'
		ctx.fillRect(x, y, w, h)
		ctx.strokeStyle = '#12182B'
		ctx.lineWidth = 2
		ctx.strokeRect(x, y, w, h)

		ctx.fillStyle = '#12182B'
		ctx.textAlign = 'center'
		ctx.font = '600 15px system-ui, -apple-system, Segoe UI, sans-serif'
		ctx.fillText(room.name || 'Room', x + w / 2, y + h / 2 - 2, w - 8)
		ctx.fillStyle = '#6B655C'
		ctx.font = '13px system-ui, -apple-system, Segoe UI, sans-serif'
		ctx.fillText(`${room.w} × ${room.h} ft`, x + w / 2, y + h / 2 + 16, w - 8)
	}

	const baseline = canvas.height - footer + 22
	ctx.textAlign = 'left'
	ctx.fillStyle = '#12182B'
	ctx.font = '600 16px system-ui, -apple-system, Segoe UI, sans-serif'
	ctx.fillText(totalLine, pad, baseline)
	ctx.fillStyle = '#6B655C'
	ctx.font = '12px system-ui, -apple-system, Segoe UI, sans-serif'
	ctx.fillText(legalLine, pad, baseline + 20)

	return canvas.toDataURL('image/png')
}

/**
 * Label size that fits inside the room.
 *
 * Width and height alone are not enough: "Primary bath" in an 8ft-wide box
 * overflows its own rectangle at any size that reads well, so the name length
 * has to be part of the calculation.
 */
function labelSize(room: Room, cap: number) {
	const chars = Math.max((room.name || 'Room').length, 6)
	return Math.min(cap, room.w / 6, room.h / 2, (room.w * 1.7) / chars)
}

/** Read-only rendering, used on the results screen. */
export function PlanPreview({ rooms }: { rooms: readonly Room[] }) {
	if (!rooms.length) return null
	const maxX = Math.max(...rooms.map((r) => r.x + r.w))
	const maxY = Math.max(...rooms.map((r) => r.y + r.h))

	return (
		<figure className="mt-4">
			<svg
				viewBox={`-1 -1 ${maxX + 2} ${maxY + 2}`}
				className="h-auto w-full border border-navy/10 bg-white"
				role="img"
				aria-label={`Floor plan sketch totalling ${totalSquareFeet(rooms)} square feet`}
			>
				{rooms.map((room) => (
					<g key={room.id}>
						<rect
							x={room.x}
							y={room.y}
							width={room.w}
							height={room.h}
							fill="rgba(196,165,116,0.2)"
							stroke="#12182B"
							strokeWidth={0.2}
						/>
						<text
							x={room.x + room.w / 2}
							y={room.y + room.h / 2}
							textAnchor="middle"
							fontSize={labelSize(room, 1.6)}
							fill="#12182B"
						>
							{room.name || 'Room'}
						</text>
						<text
							x={room.x + room.w / 2}
							y={room.y + room.h / 2 + 1.6}
							textAnchor="middle"
							fontSize={Math.min(1.2, room.w / 8, room.h / 3)}
							fill="#6B655C"
						>
							{room.w} × {room.h} ft
						</text>
					</g>
				))}
			</svg>
			<figcaption className="mt-2 font-sans text-sm text-stone-muted">
				{totalSquareFeet(rooms)} sq ft across {rooms.length}{' '}
				{rooms.length === 1 ? 'space' : 'spaces'} — a sketch, not a construction
				document.
			</figcaption>
		</figure>
	)
}

interface SketcherProps {
	rooms: Room[]
	onChange: (rooms: Room[]) => void
}

export function PlanSketcher({ rooms, onChange }: SketcherProps) {
	const [mode, setMode] = useState<'draw' | 'list'>('list')
	const [decided, setDecided] = useState(false)

	// Guess once on mount. A coarse pointer or a narrow screen means a thumb.
	useEffect(() => {
		const fine = window.matchMedia('(pointer: fine)').matches
		const wide = window.matchMedia('(min-width: 1024px)').matches
		setMode(fine && wide ? 'draw' : 'list')
		setDecided(true)
	}, [])

	if (!decided) {
		return <div className="mt-4 h-64 border border-navy/10 bg-stone" aria-hidden />
	}

	return (
		<div>
			<div className="mb-4 flex flex-wrap items-center gap-3">
				<div className="inline-flex border border-navy/15">
					{(['draw', 'list'] as const).map((option) => (
						<button
							key={option}
							type="button"
							onClick={() => setMode(option)}
							aria-pressed={mode === option}
							className={`min-h-[44px] px-4 font-sans text-sm transition ${
								mode === option
									? 'bg-navy text-white'
									: 'bg-white text-navy hover:border-sand'
							}`}
						>
							{option === 'draw' ? 'Draw it' : 'Type the sizes'}
						</button>
					))}
				</div>
				{rooms.length > 0 ? (
					<button
						type="button"
						onClick={() => onChange([])}
						className="inline-flex min-h-[44px] items-center font-sans text-sm text-stone-muted underline underline-offset-4 hover:text-navy"
					>
						Clear all
					</button>
				) : null}
				<span className="ml-auto font-sans text-sm text-stone-muted">
					{rooms.length
						? `${totalSquareFeet(rooms)} sq ft · ${rooms.length} ${rooms.length === 1 ? 'space' : 'spaces'}`
						: 'Nothing drawn yet'}
				</span>
			</div>

			{mode === 'draw' ? (
				<DrawCanvas rooms={rooms} onChange={onChange} />
			) : (
				<RoomList rooms={rooms} onChange={onChange} />
			)}
		</div>
	)
}

/* ------------------------------------------------------------------ draw -- */

function DrawCanvas({ rooms, onChange }: SketcherProps) {
	const svgRef = useRef<SVGSVGElement>(null)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [draft, setDraft] = useState<Room | null>(null)
	const dragRef = useRef<
		| { kind: 'create'; startX: number; startY: number }
		| { kind: 'move'; id: string; dx: number; dy: number }
		| { kind: 'resize'; id: string }
		| null
	>(null)

	const toFeet = useCallback((event: React.PointerEvent) => {
		const svg = svgRef.current
		if (!svg) return { x: 0, y: 0 }
		const rect = svg.getBoundingClientRect()
		const scale = PLAN_WIDTH_FT / rect.width
		return {
			x: Math.round((event.clientX - rect.left) * scale),
			y: Math.round((event.clientY - rect.top) * scale),
		}
	}, [])

	const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value))

	const onPointerDown = (event: React.PointerEvent) => {
		const target = event.target as SVGElement
		const roomId = target.dataset.room
		const isHandle = target.dataset.handle === 'true'
		const point = toFeet(event)
		;(event.currentTarget as SVGSVGElement).setPointerCapture(event.pointerId)

		if (isHandle && roomId) {
			dragRef.current = { kind: 'resize', id: roomId }
			setSelectedId(roomId)
			return
		}
		if (roomId) {
			const room = rooms.find((r) => r.id === roomId)
			if (room) {
				dragRef.current = { kind: 'move', id: roomId, dx: point.x - room.x, dy: point.y - room.y }
				setSelectedId(roomId)
			}
			return
		}
		setSelectedId(null)
		dragRef.current = { kind: 'create', startX: point.x, startY: point.y }
	}

	const onPointerMove = (event: React.PointerEvent) => {
		const drag = dragRef.current
		if (!drag) return
		const point = toFeet(event)

		if (drag.kind === 'create') {
			setDraft({
				id: 'draft',
				name: '',
				x: Math.min(drag.startX, point.x),
				y: Math.min(drag.startY, point.y),
				w: Math.abs(point.x - drag.startX),
				h: Math.abs(point.y - drag.startY),
			})
			return
		}

		onChange(
			rooms.map((room) => {
				if (room.id !== drag.id) return room
				if (drag.kind === 'move') {
					return {
						...room,
						x: clamp(point.x - drag.dx, PLAN_WIDTH_FT - room.w),
						y: clamp(point.y - drag.dy, PLAN_HEIGHT_FT - room.h),
					}
				}
				return {
					...room,
					w: clamp(Math.max(MIN_SIDE_FT, point.x - room.x), PLAN_WIDTH_FT - room.x),
					h: clamp(Math.max(MIN_SIDE_FT, point.y - room.y), PLAN_HEIGHT_FT - room.y),
				}
			})
		)
	}

	const onPointerUp = () => {
		const drag = dragRef.current
		dragRef.current = null
		if (drag?.kind === 'create' && draft) {
			if (draft.w >= MIN_SIDE_FT && draft.h >= MIN_SIDE_FT) {
				const room: Room = { ...draft, id: nextId(), name: '' }
				onChange([...rooms, room])
				setSelectedId(room.id)
			}
			setDraft(null)
		}
	}

	const selected = rooms.find((room) => room.id === selectedId) || null
	const update = (patch: Partial<Room>) =>
		onChange(rooms.map((room) => (room.id === selectedId ? { ...room, ...patch } : room)))

	return (
		<div>
			<svg
				ref={svgRef}
				viewBox={`0 0 ${PLAN_WIDTH_FT} ${PLAN_HEIGHT_FT}`}
				className="w-full touch-none border border-navy/15 bg-white"
				style={{ cursor: 'crosshair' }}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
			>
				<defs>
					<pattern id="ft" width="1" height="1" patternUnits="userSpaceOnUse">
						<path d="M1 0 L0 0 0 1" fill="none" stroke="rgba(18,24,43,0.07)" strokeWidth="0.05" />
					</pattern>
					<pattern id="ft5" width="5" height="5" patternUnits="userSpaceOnUse">
						<path d="M5 0 L0 0 0 5" fill="none" stroke="rgba(18,24,43,0.16)" strokeWidth="0.07" />
					</pattern>
				</defs>
				<rect width={PLAN_WIDTH_FT} height={PLAN_HEIGHT_FT} fill="url(#ft)" />
				<rect width={PLAN_WIDTH_FT} height={PLAN_HEIGHT_FT} fill="url(#ft5)" />

				{rooms.map((room) => (
					<g key={room.id}>
						<rect
							data-room={room.id}
							x={room.x}
							y={room.y}
							width={room.w}
							height={room.h}
							fill={room.id === selectedId ? 'rgba(196,165,116,0.42)' : 'rgba(196,165,116,0.2)'}
							stroke="#12182B"
							strokeWidth={room.id === selectedId ? 0.28 : 0.18}
							style={{ cursor: 'move' }}
						/>
						<text
							data-room={room.id}
							x={room.x + room.w / 2}
							y={room.y + room.h / 2}
							textAnchor="middle"
							fontSize={labelSize(room, 1.5)}
							fill="#12182B"
							style={{ pointerEvents: 'none' }}
						>
							{room.name || 'Untitled'}
						</text>
						<text
							x={room.x + room.w / 2}
							y={room.y + room.h / 2 + 1.5}
							textAnchor="middle"
							fontSize={Math.min(1.1, room.w / 8, room.h / 3)}
							fill="#6B655C"
							style={{ pointerEvents: 'none' }}
						>
							{room.w} × {room.h}
						</text>
						<rect
							data-room={room.id}
							data-handle="true"
							x={room.x + room.w - 0.9}
							y={room.y + room.h - 0.9}
							width={0.9}
							height={0.9}
							fill="#12182B"
							style={{ cursor: 'nwse-resize' }}
						/>
					</g>
				))}

				{draft ? (
					<rect
						x={draft.x}
						y={draft.y}
						width={draft.w}
						height={draft.h}
						fill="rgba(196,165,116,0.25)"
						stroke="#A88A58"
						strokeWidth={0.18}
						strokeDasharray="0.5 0.4"
					/>
				) : null}
			</svg>

			<p className="mt-3 font-sans text-sm text-stone-muted">
				Drag on the grid to add a room. Drag a room to move it, or its corner to
				resize. Each square is one foot.
			</p>

			{selected ? (
				<div className="mt-4 flex flex-wrap items-end gap-3 border border-navy/10 bg-stone p-4">
					<label className="block">
						<span className="block font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
							Room name
						</span>
						<input
							value={selected.name}
							onChange={(event) => update({ name: event.target.value })}
							placeholder="Kitchen"
							className="mt-2 w-48 border border-navy/15 bg-white px-3 py-2 font-sans text-sm text-ink outline-none ring-sand focus:ring-2"
						/>
					</label>
					<NumberField
						label="Width (ft)"
						value={selected.w}
						onChange={(w) => update({ w: clamp(Math.max(MIN_SIDE_FT, w), PLAN_WIDTH_FT - selected.x) })}
					/>
					<NumberField
						label="Length (ft)"
						value={selected.h}
						onChange={(h) => update({ h: clamp(Math.max(MIN_SIDE_FT, h), PLAN_HEIGHT_FT - selected.y) })}
					/>
					<button
						type="button"
						onClick={() => {
							onChange(rooms.filter((room) => room.id !== selectedId))
							setSelectedId(null)
						}}
						className="inline-flex min-h-[44px] items-center font-sans text-sm text-stone-muted underline underline-offset-4 hover:text-navy"
					>
						Delete room
					</button>
					<div className="w-full">
						<PresetRow onPick={(name) => update({ name })} />
					</div>
				</div>
			) : null}
		</div>
	)
}

/* ------------------------------------------------------------------ list -- */

function RoomList({ rooms, onChange }: SketcherProps) {
	const [name, setName] = useState('')
	const [width, setWidth] = useState(12)
	const [length, setLength] = useState(12)

	/**
	 * Shelf-packs rooms left to right, wrapping at the plan width, so someone
	 * typing sizes on a phone still gets a plan that looks laid out rather than
	 * a stack of boxes. It is not an architectural arrangement and does not
	 * pretend to be — the walkthrough settles the real layout.
	 */
	const place = (list: Omit<Room, 'x' | 'y'>[]): Room[] => {
		let cursorX = 0
		let cursorY = 0
		let shelfHeight = 0
		return list.map((room) => {
			if (cursorX + room.w > PLAN_WIDTH_FT) {
				cursorX = 0
				cursorY += shelfHeight
				shelfHeight = 0
			}
			const placed = { ...room, x: cursorX, y: cursorY }
			cursorX += room.w
			shelfHeight = Math.max(shelfHeight, room.h)
			return placed
		})
	}

	const add = () => {
		const w = Math.max(MIN_SIDE_FT, Math.min(PLAN_WIDTH_FT, Math.round(width) || MIN_SIDE_FT))
		const h = Math.max(MIN_SIDE_FT, Math.min(PLAN_HEIGHT_FT, Math.round(length) || MIN_SIDE_FT))
		const stripped = rooms.map(({ id, name: n, w: rw, h: rh }) => ({ id, name: n, w: rw, h: rh }))
		onChange(place([...stripped, { id: nextId(), name: name.trim(), w, h }]))
		setName('')
	}

	const remove = (id: string) => {
		const stripped = rooms
			.filter((room) => room.id !== id)
			.map(({ id: rid, name: n, w, h }) => ({ id: rid, name: n, w, h }))
		onChange(place(stripped))
	}

	return (
		<div>
			<div className="border border-navy/10 bg-stone p-4">
				<label className="block">
					<span className="block font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
						What room is it?
					</span>
					<input
						value={name}
						onChange={(event) => setName(event.target.value)}
						placeholder="Kitchen"
						className="mt-2 w-full border border-navy/15 bg-white px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2"
					/>
				</label>
				<div className="mt-3">
					<PresetRow onPick={setName} />
				</div>
				<div className="mt-4 flex flex-wrap items-end gap-3">
					<NumberField label="Width (ft)" value={width} onChange={setWidth} />
					<NumberField label="Length (ft)" value={length} onChange={setLength} />
					<button type="button" onClick={add} className="btn-primary min-h-[44px]">
						Add room
					</button>
				</div>
			</div>

			{rooms.length ? (
				<ul className="mt-4 divide-y divide-navy/10 border border-navy/10 bg-white">
					{rooms.map((room) => (
						<li key={room.id} className="flex items-center justify-between gap-4 px-4 py-3">
							<span className="font-sans text-sm text-ink">
								<strong className="text-navy">{room.name || 'Untitled room'}</strong>{' '}
								— {room.w} × {room.h} ft ({room.w * room.h} sq ft)
							</span>
							<button
								type="button"
								onClick={() => remove(room.id)}
								className="inline-flex min-h-[44px] items-center font-sans text-sm text-stone-muted underline underline-offset-4 hover:text-navy"
							>
								Remove
							</button>
						</li>
					))}
				</ul>
			) : null}

			<PlanPreview rooms={rooms} />
		</div>
	)
}

/* --------------------------------------------------------------- shared -- */

function PresetRow({ onPick }: { onPick: (name: string) => void }) {
	return (
		<div className="flex flex-wrap gap-2">
			{ROOM_PRESETS.map((preset) => (
				<button
					key={preset}
					type="button"
					onClick={() => onPick(preset)}
					className="inline-flex min-h-[44px] items-center rounded-full border border-navy/15 bg-white px-4 font-sans text-xs text-navy transition hover:border-sand"
				>
					{preset}
				</button>
			))}
		</div>
	)
}

function NumberField({
	label,
	value,
	onChange,
}: {
	label: string
	value: number
	onChange: (value: number) => void
}) {
	return (
		<label className="block">
			<span className="block font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
				{label}
			</span>
			<input
				type="number"
				inputMode="numeric"
				min={MIN_SIDE_FT}
				value={value}
				onChange={(event) => onChange(Number(event.target.value))}
				className="mt-2 w-24 border border-navy/15 bg-white px-3 py-2 font-sans text-sm text-ink outline-none ring-sand focus:ring-2"
			/>
		</label>
	)
}
