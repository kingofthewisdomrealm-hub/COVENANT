import { porchArticleParams } from '@/components/porch/article-page'
import { porchOgImage, porchOgSize } from '@/lib/porch-og'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

const ed = PORCH_EDITIONS.miami

export const alt = 'The Miami Balcony — neighborhood news for Miami Beach homeowners'
export const size = porchOgSize
export const contentType = 'image/png'

export function generateStaticParams() {
	return porchArticleParams(ed)
}

export default function MiamiBalconyArticleOgImage({ params }: { params: { slug: string } }) {
	return porchOgImage(ed, params.slug)
}
