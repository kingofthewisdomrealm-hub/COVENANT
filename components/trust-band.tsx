import { siteConfig } from '@/content/site'

export function TrustBand() {
	const years = new Date().getFullYear() - siteConfig.license.licensedYear

	const items = [
		{
			label: 'Florida license',
			value: siteConfig.license.number,
		},
		{
			label: 'Classification',
			value: siteConfig.license.classification,
		},
		{
			label: 'Licensed since',
			value: `${siteConfig.license.licensedYear} · ${years}+ years`,
		},
		{
			label: 'Status',
			value: `${siteConfig.license.status} through ${siteConfig.license.expires}`,
		},
	]

	return (
		<section
			aria-label="Licensing credentials"
			className="border-y border-navy/10 bg-navy text-white"
		>
			<div className="section-shell grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
				{items.map((item) => (
					<div key={item.label} className="space-y-2">
						<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-sand">
							{item.label}
						</p>
						<p className="font-display text-xl text-white sm:text-2xl">
							{item.value}
						</p>
					</div>
				))}
			</div>
			<div className="section-shell pb-6">
				<a
					href={siteConfig.license.dbprLookupUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="font-sans text-xs text-white/60 underline-offset-4 transition hover:text-sand hover:underline"
				>
					Verify via Florida DBPR license lookup
				</a>
			</div>
		</section>
	)
}
