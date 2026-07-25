interface RateLimitEntry {
	count: number
	resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function checkRateLimit({
	key,
	limit = 5,
	windowMs = 60_000,
}: {
	key: string
	limit?: number
	windowMs?: number
}) {
	const now = Date.now()
	const existing = store.get(key)

	if (!existing || existing.resetAt <= now) {
		store.set(key, { count: 1, resetAt: now + windowMs })
		return { allowed: true, remaining: limit - 1 }
	}

	if (existing.count >= limit) {
		return { allowed: false, remaining: 0 }
	}

	existing.count += 1
	store.set(key, existing)
	return { allowed: true, remaining: limit - existing.count }
}
