export const siteConfig = {
	name: 'Covenant Builders',
	tagline: 'We Deliver.',
	url: 'https://covenantbuilders.org',
	description:
		'Custom home builder in Vero Beach and the Treasure Coast. Licensed Florida CBC1253676 since 2005 — homes, kitchens, commercial projects, and remodels.',
	serviceArea: 'Vero Beach and the Treasure Coast, Florida',
	serviceCities: [
		'Vero Beach',
		'Sebastian',
		'Fort Pierce',
		'Port St. Lucie',
		'Fellsmere',
	] as const,
	address: {
		street: '876 47th Avenue',
		city: 'Vero Beach',
		state: 'FL',
		zip: '32966',
		full: '876 47th Avenue, Vero Beach, FL 32966',
		mapsUrl:
			'https://www.google.com/maps/search/?api=1&query=876+47th+Avenue+Vero+Beach+FL+32966',
		/**
		 * Relocation in progress from the previous address (5400 85th St).
		 * Remove this note once the move is complete and Google Business Profile,
		 * directories, and print collateral all show the new address.
		 * See docs/address-change-plan.md
		 */
		relocationNote:
			'We are relocating from our previous address at 5400 85th St. Please use the address above.',
	},
	emails: {
		info: 'info@covenantbuilders.org',
		estimating: 'estimating@covenantbuilders.org',
		josias: 'josias@covenantbuilders.org',
	},
	phones: {
		sr: {
			name: 'Josias Andujar Sr',
			role: 'President & Founder',
			display: '(772) 473-7115',
			href: 'tel:+17724737115',
		},
		// Josias Jr's line — (772) 473-7914 — is intentionally not published for now.
		// Restore here and in app/contact/page.tsx if it becomes a public contact again.
	},
	hours: [
		{ day: 'Monday', time: '9:00 AM – 5:00 PM' },
		{ day: 'Tuesday', time: '9:00 AM – 5:00 PM' },
		{ day: 'Wednesday', time: '9:00 AM – 5:00 PM' },
		{ day: 'Thursday', time: '9:00 AM – 5:00 PM' },
		{ day: 'Friday', time: '9:00 AM – 5:00 PM' },
		{ day: 'Saturday', time: 'Closed' },
		{ day: 'Sunday', time: 'Closed' },
	],
	license: {
		number: 'CBC1253676',
		classification: 'Certified Building Contractor',
		licensedSince: 'December 8, 2005',
		licensedYear: 2005,
		status: 'Active',
		expires: 'August 31, 2028',
		dba: 'Interior Specialties Inc',
		dbprLookupUrl: 'https://www.myfloridalicense.com/wl11.asp',
	},
	bilingualNote: 'Bilingual company. Hablamos español.',
	responseExpectation:
		'We typically respond to estimate requests within one business day.',
} as const

export const navLinks = [
	{ href: '/', label: 'Home' },
	{ href: '/services', label: 'Services' },
	{ href: '/portfolio', label: 'Portfolio' },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact' },
	{ href: '/investors', label: 'Investors' },
] as const

export const services = [
	{
		slug: 'new-home-builds',
		title: 'New Home Builds',
		shortTitle: 'Residential',
		summary:
			'Custom homes planned and built with clear communication from design through final walkthrough.',
		description:
			'Building the home of your dreams starts with listening. Our team works with you from planning and design through construction, keeping the schedule and budget visible every step of the way.',
		bullets: [
			'Design-build collaboration',
			'Permit coordination',
			'Quality-focused craftsmanship',
			'On-site communication you can trust',
		],
	},
	{
		slug: 'custom-kitchens',
		title: 'Custom Kitchens & Cabinetry',
		shortTitle: 'Kitchens',
		summary:
			'Kitchen renovations and custom cabinetry rooted in Josias’s cabinetmaking workshop beginnings.',
		description:
			'Your kitchen is the heart of the home. We specialize in renovations and high-quality custom cabinetry that balance style, storage, and everyday function.',
		bullets: [
			'Custom cabinetry',
			'Full kitchen renovations',
			'Material and finish guidance',
			'Detail-driven millwork',
		],
	},
	{
		slug: 'commercial-projects',
		title: 'Commercial Projects',
		shortTitle: 'Commercial',
		summary:
			'Functional, modern commercial spaces designed to support how your business actually operates.',
		description:
			'We help businesses grow with custom-built commercial properties that are functional, durable, and tailored to your operations—from planning through completion.',
		bullets: [
			'Tenant improvements',
			'New commercial builds',
			'Code-aware planning',
			'Efficient project delivery',
		],
	},
	{
		slug: 'remodels',
		title: 'Remodels & Renovations',
		shortTitle: 'Remodels',
		summary:
			'Thoughtful renovations that upgrade living and working spaces without losing what already works.',
		description:
			'From targeted remodels to larger renovations, we improve existing spaces with the same care we bring to new construction—clear scope, clean execution, and respect for your timeline.',
		bullets: [
			'Whole-home and room remodels',
			'Scope clarity before work begins',
			'Phased work when needed',
			'Finish-level craftsmanship',
		],
	},
] as const

export const whyChooseUs = [
	{
		title: 'Licensed & accountable',
		description:
			'Florida Certified Building Contractor CBC1253676—active, verified, and accountable for the work we put our name on.',
	},
	{
		title: 'Full-service construction',
		description:
			'From design and permits to construction and finishing touches, we keep the process coordinated so you are not chasing details alone.',
	},
	{
		title: 'Craftsmanship first',
		description:
			'Our founder started as a cabinetmaker. That eye for detail still shapes how we build homes, kitchens, and commercial spaces.',
	},
	{
		title: 'Clear communication',
		description:
			'We deliver excellent communication throughout the process, quality second to none, and a goal to exceed expectations.',
	},
] as const

export type ProjectCategory = 'residential' | 'commercial' | 'remodel'

export interface PortfolioProject {
	id: string
	title: string
	category: ProjectCategory
	location: string
	scope: string
	image: string
	alt: string
	status: 'featured' | 'coming-soon'
	/**
	 * Founder-verified story. RENDERS PUBLICLY — only ever put confirmed facts
	 * here (real city, real scope, real outcome). Never invent square footage,
	 * timelines, budgets, or client names.
	 */
	story?: string
	/**
	 * Draft placeholder shown ONLY in the repo, never on the site. Use it to
	 * sketch the shape of a story before the real details are confirmed, then
	 * move the finished text into `story`.
	 * Fill the CAPITALISED blanks from docs/portfolio-intake.md.
	 */
	storyDraft?: string
}

/**
 * Real Covenant Builders job-site photography (added 2026-07-30).
 * Descriptions cover only what is visibly happening in each frame — no invented
 * client names, square footage, budgets, or timelines. If the founder supplies
 * verified project details, extend `story` rather than embellishing `scope`.
 */
export const portfolioProjects: PortfolioProject[] = [
	{
		id: 'project-01',
		title: 'Block shell and roof framing',
		category: 'residential',
		location: 'Vero Beach, FL',
		scope:
			'Concrete block shell complete and roof trusses going up on a corner-lot residential build — the stage where the footprint becomes a house.',
		image: '/images/portfolio/project-01.jpg',
		alt: 'Concrete block home under construction with roof trusses being installed in Vero Beach, Florida',
		status: 'featured',
		storyDraft:
			'We built a SQFT sq ft custom home on a corner lot in CITY, from slab through final walkthrough. TIMELINE_OR_CONSTRAINT.',
	},
	{
		id: 'project-02',
		title: 'Truss set by crane',
		category: 'residential',
		location: 'Treasure Coast, FL',
		scope:
			'Crane setting roof trusses across a long block wall line. Florida block construction built for wind load, braced and set section by section.',
		image: '/images/portfolio/project-02.jpg',
		alt: 'Crane lifting roof trusses onto a concrete block home under construction on the Treasure Coast',
		status: 'featured',
		storyDraft:
			'We set the roof structure on a SQFT sq ft build in CITY, engineered for Florida wind load. TIMELINE_OR_CONSTRAINT.',
	},
	{
		id: 'project-03',
		title: 'Framing and garage structure',
		category: 'residential',
		location: 'Treasure Coast, FL',
		scope:
			'Gable framing and garage structure taking shape over the block shell, with roof underlayment going on to dry the building in.',
		image: '/images/portfolio/project-03.jpg',
		alt: 'New home construction showing gable framing, garage structure, and roof underlayment',
		status: 'featured',
		storyDraft:
			'We framed and dried in a SQFT sq ft home with a GARAGE_SIZE-car garage in CITY. TIMELINE_OR_CONSTRAINT.',
	},
	{
		id: 'project-04',
		title: 'Crew on site during dry-in',
		category: 'residential',
		location: 'Treasure Coast, FL',
		scope:
			'Windows in, roof underlayment down, and trades working the interior. The coordination stage where scheduling keeps a job on track.',
		image: '/images/portfolio/project-04.jpg',
		alt: 'Covenant Builders crew working on a residential build during the dry-in phase',
		status: 'featured',
		storyDraft:
			'We coordinated NUMBER trades through dry-in on a SQFT sq ft build in CITY, keeping the schedule on track. TIMELINE_OR_CONSTRAINT.',
	},
	{
		id: 'project-05',
		title: 'Stucco and exterior finish',
		category: 'residential',
		location: 'Treasure Coast, FL',
		scope:
			'Stucco applied, windows and trim set, roof prepared for final covering — the point where the exterior starts reading as a finished home.',
		image: '/images/portfolio/project-05.jpg',
		alt: 'Residential home exterior with completed stucco, installed windows, and roof underlayment',
		status: 'featured',
		storyDraft:
			'We completed the exterior envelope — stucco, windows, and roof — on a SQFT sq ft home in CITY. TIMELINE_OR_CONSTRAINT.',
	},
	{
		id: 'project-06',
		title: 'Exterior nearing completion',
		category: 'residential',
		location: 'Treasure Coast, FL',
		scope:
			'Finished stucco, trimmed windows, and hung doors with materials staged for interior finish work.',
		image: '/images/portfolio/project-06.jpg',
		alt: 'Covenant Builders custom home exterior nearing completion with finished stucco and installed windows',
		status: 'featured',
		storyDraft:
			'We delivered a SQFT sq ft custom home in CITY, finished TIMELINE_OR_CONSTRAINT.',
	},
]

export const founderBio = {
	name: 'Josias Andujar',
	title: 'President and Founder',
	image: '/images/josias-andujar-founder.png',
	imageAlt:
		'Josias Andujar, President and Founder of Covenant Builders, Vero Beach Florida',
	paragraphs: [
		'Josias started his career as a cabinetmaker, coming out of vocational-technical school in high school. He had both a natural ability and a learned eye under the instruction of Larry Sittler.',
		'He quickly learned the trades through hands-on experience. His dedication and eye for the latest innovations earned him recognition for his work over the years.',
		'Coming to the Treasure Coast in 2004 and making a home here with his family—just in time for the hurricanes—allowed Josias to start his own company dedicated to new beach homes, design-build, remodels, and quality craftsmanship.',
		'Today he holds Florida Certified Building Contractor license CBC1253676 (originally licensed December 8, 2005; active through August 31, 2028). The license’s registered DBA is Interior Specialties Inc—the same licensed entity now operating as Covenant Builders.',
		'We deliver excellent communication throughout the process, quality second to none, and a goal to exceed expectations.',
	],
}

export const projectTypes = [
	{ value: 'new-home', label: 'New home build' },
	{ value: 'kitchen', label: 'Kitchen / cabinetry' },
	{ value: 'commercial', label: 'Commercial project' },
	{ value: 'remodel', label: 'Remodel / renovation' },
	{ value: 'other', label: 'Other / not sure yet' },
] as const
