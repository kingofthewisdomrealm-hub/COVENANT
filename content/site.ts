export const siteConfig = {
	name: 'Covenant Builders',
	tagline: 'We Deliver.',
	url: 'https://covenantbuilders.org',
	description:
		'Florida residential and commercial builder serving Vero Beach and the Treasure Coast. Custom homes, kitchens, remodels, and commercial projects.',
	serviceArea: 'Vero Beach and the Treasure Coast, Florida',
	address: {
		street: '5400 85th Ave',
		city: 'Vero Beach',
		state: 'FL',
		zip: '32967',
		full: '5400 85th Ave, Vero Beach, FL 32967',
		mapsUrl:
			'https://www.google.com/maps/search/?api=1&query=5400+85th+Ave+Vero+Beach+FL+32967',
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
		jr: {
			name: 'Josias Andujar Jr',
			role: 'Project Contact',
			display: '(772) 473-7914',
			href: 'tel:+17724737914',
		},
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
}

export const portfolioProjects: PortfolioProject[] = [
	{
		id: 'project-01',
		title: 'Custom residential build',
		category: 'residential',
		location: 'Treasure Coast, FL',
		scope: 'New construction craftsmanship on a residential project.',
		image: '/images/portfolio/project-01.jpg',
		alt: 'Finished residential construction detail from a Covenant Builders project',
		status: 'featured',
	},
	{
		id: 'project-02',
		title: 'Interior finish work',
		category: 'remodel',
		location: 'Treasure Coast, FL',
		scope: 'Interior renovation and finish detailing.',
		image: '/images/portfolio/project-02.jpg',
		alt: 'Interior renovation finishes on a Covenant Builders remodel',
		status: 'featured',
	},
	{
		id: 'project-03',
		title: 'Kitchen & cabinetry focus',
		category: 'remodel',
		location: 'Treasure Coast, FL',
		scope: 'Kitchen-focused renovation and custom cabinetry work.',
		image: '/images/portfolio/project-03.jpg',
		alt: 'Kitchen cabinetry and renovation work by Covenant Builders',
		status: 'featured',
	},
	{
		id: 'project-04',
		title: 'Residential exterior progress',
		category: 'residential',
		location: 'Treasure Coast, FL',
		scope: 'Residential construction progress and exterior detailing.',
		image: '/images/portfolio/project-04.jpg',
		alt: 'Residential exterior construction progress by Covenant Builders',
		status: 'featured',
	},
	{
		id: 'project-05',
		title: 'Site work & structure',
		category: 'commercial',
		location: 'Treasure Coast, FL',
		scope: 'Structural and site construction phase documentation.',
		image: '/images/portfolio/project-05.jpg',
		alt: 'Construction site structural work by Covenant Builders',
		status: 'featured',
	},
	{
		id: 'project-06',
		title: 'Build craftsmanship detail',
		category: 'residential',
		location: 'Treasure Coast, FL',
		scope: 'Close-up craftsmanship from an active build.',
		image: '/images/portfolio/project-06.jpg',
		alt: 'Close-up construction craftsmanship from a Covenant Builders job site',
		status: 'featured',
	},
]

export const founderBio = {
	name: 'Josias Andujar',
	title: 'President and Founder',
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
