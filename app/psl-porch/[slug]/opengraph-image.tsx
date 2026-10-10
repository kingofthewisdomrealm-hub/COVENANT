import { porchArticleParams } from '@/components/porch/article-page'
import { porchOgImage, porchOgSize } from '@/lib/porch-og'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

const ed = PORCH_EDITIONS.psl

export const alt = 'The PSL Porch — neighborhood news for Port St. Lucie & Fort Pierce'
export const size = porchOgSize
export const contentType = 'image/png'

export function generateStaticParams() {
	return porchArticleParams(ed)
}

export default function PslPorchArticleOgImage({ params }: { params: { slug: string } }) {
	return porchOgImage(ed, params.slug)
}
