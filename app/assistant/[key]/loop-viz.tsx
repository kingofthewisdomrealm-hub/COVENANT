'use client'

import { useEffect, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'

/**
 * The agent loop, live in 3D: a tilted ring (think → pick → act → look), a
 * galaxy of concept nodes that light up when the conversation mentions them,
 * seven moons (the tools) and a beam that fires at whichever moon is in use.
 * Ported from LLM-VISUAL/covenant.html. Purely decorative: the assistant
 * works with the canvas hidden or WebGL missing.
 */
export type Viz = {
	phase: (p: string) => void
	moon: (k: string | null) => void
	light: (text: string) => void
}

const WORDS = ['condo', 'milestone', 'deadline', 'board', 'inspection', 'lead', 'crm', 'vero beach', 'sebastian', 'sirs', 'contact', 'past due', 'stories', 'call', 'plan', 'report', 'storm', 'roof', 'hail', 'gutter', 'program', 'grant', 'ship', 'brief', 'kitchen', 'remodel', 'permit', 'balcony', 'waterproof']
type Moon = { t: string; a: number; c: number; s: string; pos?: THREE.Vector3; halo?: THREE.Sprite; ring?: THREE.Mesh; hot: number }
const MOONS: Record<string, Moon> = {
	knowledge: { t: 'PLAYBOOK', a: 0.1, c: 0xf0a1c8, s: '#f0a1c8', hot: 0 },
	buildings: { t: 'BUILDINGS', a: 0.24, c: 0xf0a1c8, s: '#f0a1c8', hot: 0 },
	storm: { t: 'STORM CHECK', a: 0.38, c: 0x7dd3fc, s: '#7dd3fc', hot: 0 },
	human: { t: 'YOU', a: 0.52, c: 0x8fd3a8, s: '#8fd3a8', hot: 0 },
	programs: { t: 'PROGRAMS', a: 0.66, c: 0x7dd3fc, s: '#7dd3fc', hot: 0 },
	design: { t: 'DESIGN', a: 0.78, c: 0x7dd3fc, s: '#7dd3fc', hot: 0 },
	crm: { t: 'CRM', a: 0.9, c: 0xf0a1c8, s: '#f0a1c8', hot: 0 },
}

export function LoopViz({ vizRef, onPhase }: { vizRef: MutableRefObject<Viz | null>; onPhase?: (p: string) => void }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const phaseCb = useRef(onPhase)
	phaseCb.current = onPhase

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
		let renderer: THREE.WebGLRenderer
		try {
			renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
		} catch {
			return
		}
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		renderer.setPixelRatio(dpr)
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setClearColor(0x0c1120, 1)
		const scene = new THREE.Scene()
		scene.fog = new THREE.FogExp2(0x0c1120, 0.0045)
		const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 900)

		const glowTex = () => {
			const c = document.createElement('canvas')
			c.width = c.height = 128
			const ctx = c.getContext('2d')!
			const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
			g.addColorStop(0, 'rgba(255,255,255,1)')
			g.addColorStop(0.3, 'rgba(255,255,255,0.55)')
			g.addColorStop(1, 'rgba(255,255,255,0)')
			ctx.fillStyle = g
			ctx.fillRect(0, 0, 128, 128)
			return new THREE.CanvasTexture(c)
		}
		const glow = glowTex()
		const sprite = (text: string, o: { px?: number; color?: string; glow?: string; scale?: number }) => {
			const px = o.px ?? 30
			const font = `600 ${px}px "JetBrains Mono", ui-monospace, monospace`
			const c = document.createElement('canvas')
			const ctx = c.getContext('2d')!
			ctx.font = font
			const w = Math.ceil(ctx.measureText(text).width + 20)
			const h = Math.ceil(px * 1.25 + 10)
			c.width = w * dpr
			c.height = h * dpr
			ctx.scale(dpr, dpr)
			ctx.font = font
			ctx.textBaseline = 'middle'
			ctx.textAlign = 'center'
			if (o.glow) {
				ctx.shadowColor = o.glow
				ctx.shadowBlur = 16
			}
			ctx.fillStyle = o.color ?? '#a79e8f'
			ctx.fillText(text, w / 2, h / 2 + 1)
			const tex = new THREE.CanvasTexture(c)
			tex.minFilter = THREE.LinearFilter
			const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }))
			const k = o.scale ?? 0.07
			s.scale.set(w * k, h * k, 1)
			return s
		}
		const mulberry = (seed: number) => () => {
			seed |= 0
			seed = (seed + 0x6d2b79f5) | 0
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296
		}
		const rng = mulberry(4242)

		// galaxy
		const N = 1800
		const gp = new Float32Array(N * 3)
		const gc = new Float32Array(N * 3)
		const cThread = new THREE.Color(0x55608f), cDim = new THREE.Color(0x3a4468), cSpark = new THREE.Color(0x7dd3fc), cSand = new THREE.Color(0xc4a574)
		for (let i = 0; i < N; i++) {
			const r = Math.pow(rng(), 0.55), th = rng() * Math.PI * 2, ph = Math.acos(rng() * 2 - 1)
			gp[i * 3] = r * 40 * Math.sin(ph) * Math.cos(th)
			gp[i * 3 + 1] = r * 16 * Math.cos(ph)
			gp[i * 3 + 2] = r * 40 * Math.sin(ph) * Math.sin(th)
			const col = (rng() < 0.06 ? cSpark : rng() < 0.5 ? cThread : cDim).clone().multiplyScalar(0.55 + rng() * 0.6)
			gc[i * 3] = col.r; gc[i * 3 + 1] = col.g; gc[i * 3 + 2] = col.b
		}
		const geo = new THREE.BufferGeometry()
		geo.setAttribute('position', new THREE.Float32BufferAttribute(gp, 3))
		geo.setAttribute('color', new THREE.Float32BufferAttribute(gc, 3))
		const gMat = new THREE.PointsMaterial({ size: 1.9, map: glow, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })
		const galaxy = new THREE.Points(geo, gMat)
		scene.add(galaxy)
		const gg = new THREE.Group()
		scene.add(gg)

		// concept nodes
		const nodes = WORDS.map((w, i) => {
			const ang = (i / WORDS.length) * Math.PI * 2, rr = 8 + (i % 3) * 7
			const g = new THREE.Group()
			g.position.set(Math.cos(ang) * rr, (i % 2 ? 4 : -4) + Math.sin(i) * 2, Math.sin(ang) * rr)
			const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0x3a4468, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }))
			dot.scale.set(2.2, 2.2, 1)
			g.add(dot)
			const l = sprite(w.toUpperCase(), { px: 28, color: '#f3f0ea', glow: 'rgba(212,188,150,0.9)', scale: 0.05 })
			l.position.set(0, 2.2, 0)
			l.material.opacity = 0
			g.add(l)
			gg.add(g)
			return { w, dot, label: l, lit: 0, target: 0 }
		})

		// loop ring
		const TILT = 0.42, R = 64
		const loopPt = (f: number) => {
			const a = f * Math.PI * 2 - Math.PI / 2
			return new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R * Math.sin(TILT), Math.sin(a) * R * Math.cos(TILT))
		}
		const tube = new THREE.Mesh(new THREE.TorusGeometry(R, 0.45, 10, 160), new THREE.MeshBasicMaterial({ color: 0xc4a574, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }))
		tube.rotation.x = Math.PI / 2 - TILT
		scene.add(tube)
		const STEPS: Record<string, number> = { think: 0, pick: 0.25, act: 0.5, look: 0.75 }
		Object.keys(STEPS).forEach((k) => {
			const l = sprite(k.toUpperCase(), { px: 34, color: '#d4bc96', glow: 'rgba(212,188,150,0.8)', scale: 0.08 })
			l.position.copy(loopPt(STEPS[k])).add(new THREE.Vector3(0, 5, 0))
			scene.add(l)
		})
		const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xd4bc96, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }))
		dot.scale.set(7, 7, 1)
		dot.position.copy(loopPt(0))
		scene.add(dot)
		const doneRing = new THREE.Mesh(new THREE.TorusGeometry(7, 0.5, 10, 40), new THREE.MeshBasicMaterial({ color: 0x8fd3a8, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }))
		doneRing.position.copy(loopPt(0.875))
		scene.add(doneRing)
		const doneLabel = sprite('DONE', { px: 28, color: '#8fd3a8', scale: 0.06 })
		doneLabel.position.copy(loopPt(0.875)).add(new THREE.Vector3(0, 10, 0))
		scene.add(doneLabel)

		// moons
		const OR = 86
		const moons: Record<string, Moon> = {}
		Object.keys(MOONS).forEach((k) => {
			const m: Moon = { ...MOONS[k], hot: 0 }
			const ma = m.a * Math.PI * 2 - Math.PI / 2
			const p = new THREE.Vector3(Math.cos(ma) * OR, Math.sin(ma) * OR * Math.sin(TILT) + 6, Math.sin(ma) * OR * Math.cos(TILT))
			m.pos = p
			m.halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: m.c, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending }))
			m.halo.scale.set(20, 20, 1)
			m.halo.position.copy(p)
			scene.add(m.halo)
			m.ring = new THREE.Mesh(new THREE.TorusGeometry(5, 0.35, 10, 40), new THREE.MeshBasicMaterial({ color: m.c, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }))
			m.ring.position.copy(p)
			scene.add(m.ring)
			const label = sprite(m.t, { px: 30, color: m.s, scale: 0.07 })
			label.position.copy(p).add(new THREE.Vector3(0, -8.5, 0))
			scene.add(label)
			moons[k] = m
		})
		const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0xc4a574, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
		scene.add(beam)
		const packet = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xf0a1c8, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
		packet.scale.set(5, 5, 1)
		scene.add(packet)
		const placeBeam = (a: THREE.Vector3, b: THREE.Vector3, r: number) => {
			const d = new THREE.Vector3().subVectors(b, a)
			const len = d.length()
			beam.position.copy(a).add(d.clone().multiplyScalar(0.5))
			beam.scale.set(r, len, r)
			beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize())
		}

		const state = { phase: 'idle', targetF: 0, curF: 0, moon: null as string | null, moonT: 0 }
		vizRef.current = {
			phase(p) {
				state.phase = p
				state.targetF = p === 'pick' ? 0.25 : p === 'act' ? 0.5 : p === 'look' ? 0.75 : p === 'done' ? 0.875 : 0
				phaseCb.current?.(p)
			},
			moon(k) {
				state.moon = k
				state.moonT = 0
			},
			light(text) {
				const t = text.toLowerCase()
				nodes.forEach((n) => { n.target = t.includes(n.w) ? 1 : n.target * 0.6 })
			},
		}

		let mouseX = 0, mouseY = 0
		const onMove = (e: MouseEvent) => { mouseX = (e.clientX / window.innerWidth - 0.5) * 2; mouseY = (e.clientY / window.innerHeight - 0.5) * 2 }
		const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight) }
		window.addEventListener('mousemove', onMove)
		window.addEventListener('resize', onResize)
		const clock = new THREE.Clock()
		let raf = 0
		const frame = () => {
			const time = clock.getElapsedTime(), dt = Math.min(0.05, clock.getDelta() || 0.016)
			const wide = window.innerWidth > 720
			const cp = new THREE.Vector3(wide ? -52 : 0, 132, 205), cl = new THREE.Vector3(wide ? -52 : 0, 0, 0)
			if (!reduced) { cp.x += Math.sin(time * 0.2) * 2 + mouseX * 5; cp.y += Math.cos(time * 0.17) * 1.2 - mouseY * 3 }
			camera.position.copy(cp)
			camera.lookAt(cl)
			if (!reduced) { galaxy.rotation.y = time * 0.03; gg.rotation.y = galaxy.rotation.y }
			let diff = state.targetF - state.curF
			if (diff < -0.5) diff += 1
			if (diff > 0.5) diff -= 1
			state.curF = (state.curF + diff * Math.min(1, dt * 3) + 1) % 1
			dot.position.copy(loopPt(state.curF))
			dot.material.opacity = state.phase === 'idle' ? 0.45 : 0.95
			const busy = state.phase !== 'idle'
			tube.material.opacity = busy ? 0.65 : 0.4
			gMat.opacity = busy ? 1 : 0.8
			nodes.forEach((n) => {
				n.lit += (n.target - n.lit) * Math.min(1, dt * 2.5)
				n.dot.material.color.copy(cDim).lerp(cSand, n.lit)
				n.dot.material.opacity = 0.5 + 0.5 * n.lit
				const sz = 2.2 + 3.2 * n.lit
				n.dot.scale.set(sz, sz, 1)
				n.label.material.opacity = n.lit
			})
			Object.keys(moons).forEach((k) => {
				const m = moons[k]
				const want = state.moon === k ? 1 : 0
				m.hot += (want - m.hot) * Math.min(1, dt * 4)
				;(m.halo!.material as THREE.SpriteMaterial).opacity = 0.12 + 0.6 * m.hot * (0.6 + 0.4 * Math.sin(time * 5))
				m.ring!.scale.setScalar(1 + 0.25 * m.hot)
			})
			if (state.moon && moons[state.moon]) {
				const m = moons[state.moon]
				state.moonT = Math.min(1, state.moonT + dt * 0.8)
				placeBeam(new THREE.Vector3(0, 0, 0), m.pos!, 1 + 0.4 * Math.sin(time * 4))
				;(beam.material as THREE.MeshBasicMaterial).opacity = 0.8
				const tp = state.moonT < 0.5 ? state.moonT * 2 : 1 - (state.moonT - 0.5) * 2
				packet.position.copy(new THREE.Vector3(0, 0, 0).lerp(m.pos!, tp))
				packet.material.opacity = 1
				if (state.moonT >= 1) state.moonT = 0
			} else {
				;(beam.material as THREE.MeshBasicMaterial).opacity *= 0.9
				packet.material.opacity *= 0.9
			}
			;(doneRing.material as THREE.MeshBasicMaterial).opacity = 0.5 + (state.phase === 'done' ? 0.5 * (0.5 + 0.5 * Math.sin(time * 6)) : 0)
			renderer.render(scene, camera)
			raf = requestAnimationFrame(frame)
		}
		frame()
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('mousemove', onMove)
			window.removeEventListener('resize', onResize)
			renderer.dispose()
			vizRef.current = null
		}
	}, [vizRef])

	return <canvas ref={canvasRef} className="cva-scene" aria-hidden="true" />
}
