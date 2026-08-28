import type { ReactNode } from 'react'

/**
 * The Florida Money Map — the clickable version of the old static PNG.
 * Three doors, three cards each. Every card is a real link: tap it and you
 * land on the official program site (or dial the official phone line).
 * Layout and colors mirror /images/florida-money-map.png, which this replaces.
 */

type MapCard = {
	name: string
	summary: string
	href: string
	linkLabel: string
	external?: boolean
}

type MapColumn = {
	id: string
	heading: string
	headerClass: string
	cardClass: string
	linkClass: string
	cards: MapCard[]
}

const columns: MapColumn[] = [
	{
		id: 'harden-the-home',
		heading: 'Harden the home',
		headerClass: 'bg-sand-dark text-white',
		cardClass: 'border-sand-dark/50 hover:border-sand-dark hover:shadow-md',
		linkClass: 'text-sand-dark',
		cards: [
			{
				name: 'My Safe FL Home',
				summary:
					'Free wind inspection + up to a $10,000 grant (2:1 match; low-income: no match).',
				href: 'https://mysafeflhome.com',
				linkLabel: 'Apply at mysafeflhome.com',
				external: true,
			},
			{
				name: 'My Safe FL Condo',
				summary:
					'Pilot for buildings 3+ stories — the association board applies for common-element hardening.',
				href: 'https://mysafeflcondo.com',
				linkLabel: 'Apply at mysafeflcondo.com',
				external: true,
			},
			{
				name: 'Weatherization (WAP)',
				summary: 'Free energy repairs for income-qualified homes.',
				href: 'https://www.floridajobs.org/community-planning-and-development/community-services/weatherization-assistance-program',
				linkLabel: 'Find your local agency',
				external: true,
			},
		],
	},
	{
		id: 'dispute-a-claim',
		heading: 'Dispute a claim',
		headerClass: 'bg-navy text-white',
		cardClass: 'border-navy/40 hover:border-navy hover:shadow-md',
		linkClass: 'text-navy',
		cards: [
			{
				name: 'DFS Mediation',
				summary:
					'Free to the property owner — the insurer pays the $350; a neutral mediator in ~21 days.',
				href: 'https://www.myfloridacfo.com/division/consumers/mediation',
				linkLabel: 'Request mediation',
				external: true,
			},
			{
				name: 'DFS Consumer Help',
				summary:
					'Insurance questions, complaints, and the Homeowner Claims Bill of Rights.',
				href: 'https://www.myfloridacfo.com/division/consumers',
				linkLabel: 'Get help at myfloridacfo.com',
				external: true,
			},
			{
				name: 'Appraisal clause',
				summary:
					'In most policies — each side hires an appraiser, an umpire decides. Not sure it applies? Ask the state.',
				href: 'tel:1-877-693-5236',
				linkLabel: 'Call DFS free: 1-877-693-5236',
			},
		],
	},
	{
		id: 'repair-and-recover',
		heading: 'Repair & recover',
		headerClass: 'bg-emerald-700 text-white',
		cardClass: 'border-emerald-700/40 hover:border-emerald-700 hover:shadow-md',
		linkClass: 'text-emerald-800',
		cards: [
			{
				name: 'County SHIP (Indian River)',
				summary:
					'Owner-occupied rehab loans for income-qualified residents — every county runs its own office.',
				href: 'https://indianriver.gov/services/community_services/state_housing_initiative_partnership_program/index.php',
				linkLabel: 'indianriver.gov — SHIP',
				external: true,
			},
			{
				name: 'USDA Section 504',
				summary: 'Rural repair loans at ~1% + grants for owners 62+ who cannot repay.',
				href: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-repair-loans-grants',
				linkLabel: 'Start at rd.usda.gov',
				external: true,
			},
			{
				name: 'FEMA + SBA',
				summary:
					'After declared disasters: FEMA grants and SBA low-interest repair loans.',
				href: 'https://www.disasterassistance.gov',
				linkLabel: 'Apply at disasterassistance.gov',
				external: true,
			},
		],
	},
]

function MapCardLink({ card, column }: { card: MapCard; column: MapColumn }): ReactNode {
	return (
		<a
			href={card.href}
			target={card.external ? '_blank' : undefined}
			rel={card.external ? 'noopener noreferrer' : undefined}
			className={`group flex h-full flex-col justify-between gap-4 rounded-2xl border-2 bg-white p-6 transition-all ${column.cardClass}`}
		>
			<div className="space-y-2">
				<h3 className="font-display text-xl text-navy">{card.name}</h3>
				<p className="body-copy text-sm">{card.summary}</p>
			</div>
			<span
				className={`font-sans text-xs font-semibold uppercase tracking-[0.14em] underline decoration-2 underline-offset-4 group-hover:no-underline ${column.linkClass}`}
			>
				{card.linkLabel} →
			</span>
		</a>
	)
}

export function MoneyMap() {
	return (
		<div className="space-y-10">
			<div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
				{columns.map((column) => (
					<div key={column.id} className="space-y-4">
						<p
							className={`rounded-xl px-6 py-4 text-center font-sans text-sm font-semibold uppercase tracking-[0.18em] ${column.headerClass}`}
						>
							{column.heading}
						</p>
						<ul className="space-y-4">
							{column.cards.map((card) => (
								<li key={card.name}>
									<MapCardLink card={card} column={column} />
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
			<p className="body-copy text-center text-sm italic text-stone-muted">
				We help property owners find the door. You apply and stay in charge — we
				never take a fee for pointing the way.
			</p>
		</div>
	)
}
