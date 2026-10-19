import { PorchArticleView, porchArticleMetadata, porchArticleParams } from '@/components/porch/article-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

const ed = PORCH_EDITIONS.miami

export const dynamicParams = false

export function generateStaticParams() {
	return porchArticleParams(ed)
}

export function generateMetadata({ params }: { params: { slug: string } }) {
	return porchArticleMetadata(ed, params.slug)
}

export default function MiamiBalconyArticlePage({ params }: { params: { slug: string } }) {
	return <PorchArticleView edition={ed} slug={params.slug} />
}
