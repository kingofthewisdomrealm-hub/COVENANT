import { PorchFrontPage, porchFrontMetadata } from '@/components/porch/front-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

export const metadata = porchFrontMetadata(PORCH_EDITIONS.orlando)

export default function OrlandoBalconyPage() {
	return <PorchFrontPage edition={PORCH_EDITIONS.orlando} />
}
