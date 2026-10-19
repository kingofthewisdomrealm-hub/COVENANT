import { PorchFrontPage, porchFrontMetadata } from '@/components/porch/front-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

export const metadata = porchFrontMetadata(PORCH_EDITIONS.miami)

export default function MiamiBalconyPage() {
	return <PorchFrontPage edition={PORCH_EDITIONS.miami} />
}
