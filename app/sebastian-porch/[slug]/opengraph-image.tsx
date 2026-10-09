import { porchArticleParams } from '@/components/porch/article-page'
import { porchOgImage, porchOgSize } from '@/lib/porch-og'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

const ed = PORCH_EDITIONS.sebastian

export const alt = 'The Sebastian Porch — neighborhood news for Sebastian'
export const size = porchOgSize
export const contentType = 'image/png'

export function generateStaticParams() {
	return porchArticleParams(ed)
}

export default function SebastianPorchArticleOgImage({ params }: { params: { slug: string } }) {
	return porchOgImage(ed, params.slug)
}
