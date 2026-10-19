import { porchArticleParams } from '@/components/porch/article-page'
import { porchOgImage, porchOgSize } from '@/lib/porch-og'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

const ed = PORCH_EDITIONS.breezeway

export const alt = 'The Breezeway — news for Florida condo owners and boards'
export const size = porchOgSize
export const contentType = 'image/png'

export function generateStaticParams() {
	return porchArticleParams(ed)
}

export default function BreezewayArticleOgImage({ params }: { params: { slug: string } }) {
	return porchOgImage(ed, params.slug)
}
