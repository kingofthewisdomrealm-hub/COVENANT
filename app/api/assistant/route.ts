import Anthropic from '@anthropic-ai/sdk'
import { NextResponse, type NextRequest } from 'next/server'

import { assistantSecret, db } from '@/lib/assistant/db'
import { assistantRules } from '@/lib/assistant/rules'
import { tools, type Card, type ToolContext } from '@/lib/assistant/tools'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * The agent loop, server-side.
 *
 *   POST /api/assistant   { key, messages:[{role, content}], proposed?:string[] }
 *
 * Streams newline-delimited JSON events the page renders live:
 *   {type:'phase', phase}                       think | pick | act | look | done
 *   {type:'tool', id, name, label, moon, status:'start'|'ok'|'error', card?, error?}
 *   {type:'text', text}                         the WHOLE answer so far
 *   {type:'done', text, tools:[...]}
 *   {type:'error', message}
 *
 * The key in the body must equal ASSISTANT_SECRET (same lock as the page URL).
 * Claude's key lives only here (ANTHROPIC_API_KEY); the browser never sees it.
 */

type Turn = { role: 'user' | 'assistant'; content: string }
const MODEL = process.env.ASSISTANT_MODEL || 'claude-sonnet-5'
const MAX_ROUNDS = 8

export async function POST(req: NextRequest) {
	const secret = assistantSecret()
	const body = (await req.json().catch(() => null)) as { key?: string; messages?: Turn[]; proposed?: string[] } | null
	if (!secret || !body || body.key !== secret) return NextResponse.json({ error: 'not found' }, { status: 404 })
	if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not set in Vercel.' }, { status: 500 })

	const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
	const rate = checkRateLimit({ key: `assistant:${ip}`, limit: 30, windowMs: 60_000 })
	if (!rate.allowed) return NextResponse.json({ error: 'Too many requests. Wait a minute.' }, { status: 429 })

	const turns = (body.messages ?? []).filter((t) => t && (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string').slice(-16)
	if (!turns.length || turns[turns.length - 1].role !== 'user') return NextResponse.json({ error: 'Send a user message.' }, { status: 400 })

	const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
	const ctx: ToolContext = { key: secret, proposed: new Set(body.proposed ?? []) }
	const encoder = new TextEncoder()

	const stream = new ReadableStream({
		async start(controller) {
			const emit = (e: Record<string, unknown>) => controller.enqueue(encoder.encode(JSON.stringify(e) + '\n'))
			const messages: Anthropic.MessageParam[] = turns.map((t) => ({ role: t.role, content: t.content }))
			const used: string[] = []
			let finalText = ''
			try {
				for (let round = 0; round < MAX_ROUNDS; round++) {
					emit({ type: 'phase', phase: round === 0 ? 'think' : 'look' })
					let text = ''
					const s = client.messages.stream({
						model: MODEL,
						max_tokens: 2048,
						system: assistantRules(),
						tools: tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.input_schema })),
						messages,
					})
					s.on('text', (delta) => {
						text += delta
						emit({ type: 'text', text })
					})
					const msg = await s.finalMessage()
					finalText = text
					const calls = msg.content.filter((c): c is Anthropic.ToolUseBlock => c.type === 'tool_use')
					if (msg.stop_reason !== 'tool_use' || !calls.length) break

					messages.push({ role: 'assistant', content: msg.content })
					const results: Anthropic.ToolResultBlockParam[] = []
					for (const call of calls) {
						const tool = tools.find((t) => t.name === call.name)
						emit({ type: 'phase', phase: 'pick' })
						emit({ type: 'tool', id: call.id, name: call.name, label: `${call.name}…`, moon: tool ? '' : '', status: 'start' })
						emit({ type: 'phase', phase: 'act' })
						if (!tool) {
							results.push({ type: 'tool_result', tool_use_id: call.id, content: `Unknown tool ${call.name}`, is_error: true })
							emit({ type: 'tool', id: call.id, name: call.name, label: `unknown tool ${call.name}`, status: 'error' })
							continue
						}
						try {
							const out = await tool.execute((call.input ?? {}) as Record<string, unknown>, ctx)
							used.push(call.name)
							results.push({ type: 'tool_result', tool_use_id: call.id, content: JSON.stringify(out.result).slice(0, 60_000) })
							emit({ type: 'tool', id: call.id, name: call.name, label: out.label, moon: out.moon, status: 'ok', card: out.card as Card | undefined })
						} catch (err) {
							const message = err instanceof Error ? err.message : String(err)
							results.push({ type: 'tool_result', tool_use_id: call.id, content: `Error: ${message}`, is_error: true })
							emit({ type: 'tool', id: call.id, name: call.name, label: message, status: 'error', error: message })
						}
					}
					messages.push({ role: 'user', content: results })
				}
				emit({ type: 'phase', phase: 'done' })
				emit({ type: 'done', text: finalText, tools: used, proposed: Array.from(ctx.proposed) })
				const goal = turns[turns.length - 1].content
				await db.logRun(secret, goal.slice(0, 500), finalText.slice(0, 4000), used)
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err)
				emit({ type: 'error', message })
			} finally {
				controller.close()
			}
		},
	})

	return new Response(stream, { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' } })
}
