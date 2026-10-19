import { BalconyLogoSvg } from '@/components/porch/balcony-logo'
import { BeachBalconyLogoSvg } from '@/components/porch/beach-balcony-logo'
import { BreezewayLogoSvg } from '@/components/porch/breezeway-logo'
import { PorchLogoSvg } from '@/components/porch/porch-logo'
import type { PorchEdition } from '@/lib/porch-editions'

/** The drawn logo above an edition's masthead name, or nothing if it has none. */
export function EditionLogo({ ed, width }: { ed: Pick<PorchEdition, 'logo' | 'name'>; width: number }) {
	if (ed.logo === 'porch') return <PorchLogoSvg width={width} title={ed.name} />
	if (ed.logo === 'balcony') return <BalconyLogoSvg width={width} title={ed.name} />
	// The Miami Beach balcony is drawn a touch larger, so it renders ~9% narrower.
	if (ed.logo === 'beach-balcony') return <BeachBalconyLogoSvg width={Math.round(width * 0.91)} title={ed.name} />
	if (ed.logo === 'breezeway') return <BreezewayLogoSvg width={width} title={ed.name} />
	return null
}
