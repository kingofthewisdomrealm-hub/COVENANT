import { z } from 'zod'

import type { Photo } from './vision'

/**
 * Server-side photo checks. The browser already shrinks every photo and
 * re-draws it on a canvas (which drops EXIF, including GPS location), but the
 * server never trusts the browser: it checks count, size, and the real file
 * signature again here.
 */

export const MAX_PHOTOS = 5
export const MAX_PHOTO_BYTES = 1_500_000
/** Vercel rejects request bodies over 4.5 MB; stay under it. */
export const MAX_TOTAL_BYTES = 3_900_000

export const photoInputSchema = z
	.array(
		z.object({
			data: z.string().max(2_100_000),
			mediaType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
		})
	)
	.min(1, 'Add at least one photo')
	.max(MAX_PHOTOS, `Up to ${MAX_PHOTOS} photos`)

function sniff(bytes: Buffer): Photo['mediaType'] | null {
	if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
	if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
	if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp'
	return null
}

/** True when a JPEG still carries an EXIF (APP1) block. */
function hasExif(bytes: Buffer) {
	if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return false
	let i = 2
	while (i + 4 < bytes.length && bytes[i] === 0xff) {
		const marker = bytes[i + 1]
		const len = bytes.readUInt16BE(i + 2)
		if (marker === 0xe1 && bytes.subarray(i + 4, i + 8).toString('ascii') === 'Exif') return true
		if (marker === 0xda) break
		i += 2 + len
	}
	return false
}

export type CheckedPhotos = { ok: true; photos: (Photo & { bytes: Buffer })[] } | { ok: false; error: string }

export function checkPhotos(input: z.infer<typeof photoInputSchema>): CheckedPhotos {
	let total = 0
	const out: (Photo & { bytes: Buffer })[] = []
	for (const p of input) {
		const bytes = Buffer.from(p.data, 'base64')
		total += bytes.length
		if (!bytes.length || bytes.length > MAX_PHOTO_BYTES) return { ok: false, error: 'One of the photos is too large. Try again — the page shrinks them automatically.' }
		const real = sniff(bytes)
		if (!real || real !== p.mediaType) return { ok: false, error: 'One of the files is not a photo we can read (JPG, PNG, or WEBP).' }
		if (real === 'image/jpeg' && hasExif(bytes)) return { ok: false, error: 'Photo still carries location data. Refresh the page and add it again.' }
		out.push({ data: p.data, mediaType: real, bytes })
	}
	if (total > MAX_TOTAL_BYTES) return { ok: false, error: 'Those photos are too large together. Try fewer photos.' }
	return { ok: true, photos: out }
}

export function clientIp(headers: Headers) {
	return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}
