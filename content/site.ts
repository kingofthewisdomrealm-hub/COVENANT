export const siteConfig = {
	name: 'Covenant Builders',
	tagline: 'We Deliver.',
	url: 'https://covenantbuilders.org',
	/** Internal CRM. Used to deep-link estimate notification emails to the job. */
	crmUrl: 'https://app.covenantbuilders.org',
	/**
	 * Feeds every page's meta description and social preview. Leads with the
	 * verifiable licence, because that is the argument the site makes and it is
	 * what differentiates a search result from every other contractor listing.
	 */
	description:
		'Florida Certified Building Contractor CBC1253676, licensed since 2005 and verifiable with the state. Homes, kitchens, commercial projects, remodels and storm restoration across Vero Beach and the Treasure Coast.',
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
		info: 'estimates@covenantbuilders.org',
		estimating: 'estimates@covenantbuilders.org',
		josias: 'estimates@covenantbuilders.org',
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

/**
 * Main navigation. Investors deliberately lives in the footer only — this site's
 * job is converting homeowners, and an Investors tab raises a question most
 * visitors shouldn't be asking. See docs/website-copy-plan.md.
 */
export const navLinks = [
	{ href: '/', label: 'Home' },
	{ href: '/services', label: 'Services' },
	{ href: '/portfolio', label: 'Portfolio' },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact' },
] as const

/**
 * A single client-facing stage of a service's process.
 *
 * PUBLIC DATA ONLY. Internal SOP content — QC hold points, inspection
 * sequences, statute citations, subcontractor admin, billing detail — lives in
 * `docs/process-*.md` and must never be added here.
 *
 * Durations are ranges, never promises. Permit review in particular is outside
 * our control.
 */
export interface ProcessStage {
	title: string
	summary: string
	duration: string
}

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
		processNote:
			'We lock every finish selection before we submit for permit. It is the single biggest reason a build stays on schedule.',
		process: [
			{
				title: 'Contract and deposit',
				summary:
					'We walk the lot, confirm what is buildable, and put scope, price, and schedule in writing.',
				duration: '1–2 weeks',
			},
			{
				title: 'Design, engineering, and selections',
				summary:
					'Whether we draw it or you bring plans, this stage ends with sealed drawings and every finish chosen and signed off.',
				duration: '8–16 weeks',
			},
			{
				title: 'Permitting and notice of commencement',
				summary:
					'We handle submittal and plan review ourselves, record the notice of commencement, and schedule the first inspection.',
				duration: '4–12 weeks',
			},
			{
				title: 'Site work and foundation',
				summary:
					'Clearing, fill, underground plumbing, termite treatment, and the slab your house sits on.',
				duration: '4–8 weeks',
			},
			{
				title: 'Structure and dry-in',
				summary:
					'Walls, tie beam, trusses, roof, windows and doors — the point your home stops being weather-dependent.',
				duration: '8–14 weeks',
			},
			{
				title: 'Rough-ins, millwork, and finishes',
				summary:
					'Electrical, plumbing and air inside the walls, then drywall, stucco, and the cabinetry we build in our own shop.',
				duration: '12–20 weeks',
			},
			{
				title: 'Final inspections and certificate of occupancy',
				summary:
					'Every trade signs off, the county issues your certificate of occupancy, and we hand over the keys and the warranty.',
				duration: '2–4 weeks',
			},
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
		processNote:
			'Your cabinetry is built in our own shop, not ordered from a catalogue. Shop capacity — not a supplier’s queue — sets the schedule.',
		process: [
			{
				title: 'Consultation and feasibility',
				summary:
					'We walk the space, talk through how you actually cook and live in it, and give you an honest budget range.',
				duration: '1–2 weeks',
			},
			{
				title: 'Design and selections',
				summary:
					'Measured drawings, cabinet design, and every finish and appliance chosen before anything is ordered or built.',
				duration: '3–8 weeks',
			},
			{
				title: 'Contract and permitting',
				summary:
					'Scope in writing, and where moving plumbing or electrical requires a permit, we pull it ourselves.',
				duration: '2–6 weeks',
			},
			{
				title: 'Demolition and rough work',
				summary:
					'Dust containment and floor protection first, then demolition, any structural work, and rough-ins.',
				duration: '2–4 weeks',
			},
			{
				title: 'Cabinetry and finishes',
				summary:
					'Shop-built cabinets installed and scribed, countertops templated only after cabinets are set, then tile, paint, and fixtures.',
				duration: '4–10 weeks',
			},
			{
				title: 'Final inspection and handover',
				summary:
					'Inspections where permitted, our own punch before you see it, then walkthrough, warranty, and care instructions.',
				duration: '1–2 weeks',
			},
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
		processNote:
			'We analyse and price accessibility requirements before you sign, not after plan review. It is the most common budget surprise in commercial work, and it should not be a surprise.',
		process: [
			{
				title: 'Consultation and due diligence',
				summary:
					'We confirm occupancy classification, egress, and accessibility exposure up front — and read your lease if this is a tenant improvement.',
				duration: '2–4 weeks',
			},
			{
				title: 'Design, code analysis, and selections',
				summary:
					'Sealed drawings, a written code and accessibility analysis, systems design, and every selection locked before submittal.',
				duration: '8–20 weeks',
			},
			{
				title: 'Contract and permitting',
				summary:
					'We run building, fire marshal, and health review ourselves — in parallel where the jurisdiction allows, so nothing waits in line.',
				duration: '6–16 weeks',
			},
			{
				title: 'Demolition, site, and structural work',
				summary:
					'Containment and life-safety protection first, then demolition, structural work, and site work where the project is ground-up.',
				duration: '3–12 weeks',
			},
			{
				title: 'Systems and rough-ins',
				summary:
					'Electrical, plumbing, and mechanical rough-in, plus fire sprinkler and alarm — each with its own inspection.',
				duration: '4–12 weeks',
			},
			{
				title: 'Finishes and millwork',
				summary:
					'Rated assemblies built to the tested detail, then ceilings, flooring, paint, and casework from our own shop.',
				duration: '4–12 weeks',
			},
			{
				title: 'Inspections, certificate, and turnover',
				summary:
					'Building and fire marshal finals, your certificate of occupancy or completion, punch, and staff training on the systems you now operate.',
				duration: '2–6 weeks',
			},
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
		processNote:
			'We open walls before we price the job. A low number that turns into change orders helps nobody — we would rather find the surprise while you can still make decisions about it.',
		process: [
			{
				title: 'Consultation and feasibility',
				summary:
					'We walk the space, check the permit history, and tell you honestly what is possible in your budget.',
				duration: '1–2 weeks',
			},
			{
				title: 'Discovery and design',
				summary:
					'Exploratory openings to see what is actually behind the walls, then design to real conditions — and every selection signed off.',
				duration: '3–10 weeks',
			},
			{
				title: 'Contract and permitting',
				summary:
					'Scope, allowances, and a written change order process agreed before work starts. We pull the permit ourselves.',
				duration: '2–8 weeks',
			},
			{
				title: 'Demolition and rough work',
				summary:
					'Containment and protection first, then demolition, structural work, and rough-ins — with anything discovered documented and priced in writing.',
				duration: '2–8 weeks',
			},
			{
				title: 'Finishes and millwork',
				summary:
					'Drywall, flooring, tile, and paint, plus the trim and cabinetry we build ourselves.',
				duration: '3–12 weeks',
			},
			{
				title: 'Final inspection and handover',
				summary:
					'Final inspections, our own punch before you see it, then walkthrough, warranty, and a clean space back.',
				duration: '1–3 weeks',
			},
		],
	},
	{
		slug: 'storm-restoration',
		title: 'Storm Restoration',
		shortTitle: 'Storm',
		summary:
			'Repair and rebuild after hurricane and storm damage—from securing the structure through full restoration.',
		description:
			'Living on the Treasure Coast means building for weather that eventually arrives. We assess and document damage, secure the structure, and carry the work through roof, envelope, and interior rebuild—restoring the property to current Florida building code with the same licensed accountability we bring to new construction.',
		bullets: [
			'Damage assessment and written scope',
			'Roof, window, and envelope repair',
			'Structural and interior rebuild',
			'Rebuilt to current Florida code',
		],
		/**
		 * COMPLIANCE-SENSITIVE COPY. Do not soften or shorten without review.
		 *
		 * Florida law licenses public adjusting separately (§ 626.854) and
		 * prohibits a contractor from offering to pay, waive, or rebate an
		 * insurance deductible, including in advertising (§ 489.147).
		 *
		 * This paragraph exists to state both boundaries plainly. Never publish
		 * copy implying we adjust claims, negotiate settlements, "fight the
		 * insurance company," or help with the deductible.
		 * See docs/process-storm-restoration.md
		 */
		processNote:
			'A few things stated plainly: you file and own your claim — we document the damage and build the repair. We do not adjust claims or interpret your policy. Your deductible is your responsibility and is collected in full; Florida law does not allow us to waive or discount it. And our work is the rebuild — if you have active water damage, we will connect you with a mitigation company we trust.',
		process: [
			{
				title: 'Inspection and documentation',
				summary:
					'We photograph and measure everything, gather the mitigation company’s records, and write a documented scope of the repair.',
				duration: '2–5 days',
			},
			{
				title: 'Contract and claim coordination',
				summary:
					'You file with your carrier. We give you the documentation to support the rebuild, in writing, with the deductible stated up front.',
				duration: '3–7 days',
			},
			{
				title: 'Adjuster meeting and scope agreement',
				summary:
					'We meet your adjuster on site and walk them through what we documented, then compare their estimate against our scope line by line.',
				duration: '2–8 weeks',
			},
			{
				title: 'Permit and mobilization',
				summary:
					'We pull the permit, confirm the structure is dry and signed off, collect the deductible, and schedule the crew.',
				duration: '1–4 weeks',
			},
			{
				title: 'Reconstruction',
				summary:
					'The repair gets built and photographed at every step — including anything found once we open things up.',
				duration: '2–8 weeks',
			},
			{
				title: 'Completion and closeout',
				summary:
					'Final inspections and punch, then documentation for anything discovered during the work and the paperwork that releases your final payment.',
				duration: '3–14 weeks',
			},
		],
	},
] as const

/**
 * Five reasons — the COMPANY set. Renders on the homepage.
 *
 * Every point here must be verifiable. We removed fabricated testimonials from
 * the old site; unverifiable claims are the same problem wearing a suit.
 * See docs/selling-points-plan.md — founder and product sets live on About and
 * Services respectively.
 */
export const whyChooseUs = [
	{
		title: 'Licensed since 2005',
		description:
			'Florida Certified Building Contractor CBC1253676, active through 2028. Look it up on the state licence lookup before you call us — that is the point.',
	},
	{
		title: 'We pull our own permits',
		description:
			'Building, and on commercial work fire marshal and health too. Most contractors our size hand that to a third party and lose sight of it.',
	},
	{
		title: 'We are from here',
		description:
			'Based in Vero Beach, working the Treasure Coast. After a storm you can find us — we do not leave when the work does.',
	},
	{
		title: 'Hablamos español',
		description:
			'Bilingual from the first phone call through the final walkthrough, so nothing important gets lost in translation.',
	},
	{
		title: 'One contractor, start to finish',
		description:
			'New homes, kitchens, commercial, remodels and storm rebuilds under one licence — one point of accountability, not a chain of subcontracts you have to manage.',
	},
] as const

/**
 * Reference offer — stands in for reviews until real ones exist.
 *
 * Deliberately does NOT announce that reviews are missing. Naming the absence
 * makes a visitor think about it who wasn't, and reads apologetic for a firm
 * licensed 21 years. References are also the stronger signal for high-ticket
 * construction — a homeowner spending six figures would rather call two past
 * clients than read star ratings.
 *
 * REMOVE this section once real reviews exist. See docs/website-copy-plan.md.
 * Before publishing: confirm permission from any client we would name.
 */
export const referenceOffer = {
	eyebrow: 'References',
	title: "Don't take our word for it",
	lead: "Most contractors send you to a review page. We'll give you a phone number.",
	body: 'Ask and we will connect you with recent clients here on the Treasure Coast. Talk to them directly, and ask them whatever you want.',
} as const

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
	{ value: 'storm-restoration', label: 'Storm damage / restoration' },
	{ value: 'other', label: 'Other / not sure yet' },
] as const
