'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { navLinks, siteConfig } from '@/content/site'

export function SiteHeader() {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)
	const isLightPage = pathname === '/privacy'

	const handleToggle = () => setIsOpen((current) => !current)
	const handleClose = () => setIsOpen(false)

	return (
		<header
			className={
				isLightPage
					? 'sticky top-0 z-50 bg-navy'
					: 'absolute inset-x-0 top-0 z-50'
			}
		>
			<div className="section-shell flex items-center justify-between gap-6 py-5">
				<Link
					href="/"
					className="relative z-10 block w-[180px] sm:w-[220px]"
					aria-label={`${siteConfig.name} home`}
					onClick={handleClose}
				>
					<Image
						src="/images/logo.png"
						alt={siteConfig.name}
						width={440}
						height={110}
						priority
						className="h-auto w-full brightness-0 invert"
					/>
				</Link>

				<nav
					className="hidden items-center gap-8 lg:flex"
					aria-label="Primary"
				>
					{navLinks.map((link) => {
						const isActive = pathname === link.href
						return (
							<Link
								key={link.href}
								href={link.href}
								className={`font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
									isActive
										? 'text-sand'
										: 'text-white/90 hover:text-sand'
								}`}
								aria-current={isActive ? 'page' : undefined}
							>
								{link.label}
							</Link>
						)
					})}
					<Link href="/contact" className="btn-primary">
						Free consultation
					</Link>
				</nav>

				<button
					type="button"
					className="relative z-10 inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-white/40 text-white lg:hidden"
					aria-expanded={isOpen}
					aria-controls="mobile-nav"
					aria-label={isOpen ? 'Close menu' : 'Open menu'}
					onClick={handleToggle}
				>
					<span className="sr-only">Menu</span>
					<span
						aria-hidden="true"
						className={`block h-0.5 w-5 bg-current transition ${
							isOpen ? 'translate-y-2 rotate-45' : ''
						}`}
					/>
					<span
						aria-hidden="true"
						className={`block h-0.5 w-5 bg-current transition ${
							isOpen ? 'opacity-0' : ''
						}`}
					/>
					<span
						aria-hidden="true"
						className={`block h-0.5 w-5 bg-current transition ${
							isOpen ? '-translate-y-2 -rotate-45' : ''
						}`}
					/>
				</button>
			</div>

			<div
				id="mobile-nav"
				className={`fixed inset-0 bg-navy/95 px-5 pt-28 transition lg:hidden ${
					isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
				}`}
			>
				<nav className="flex flex-col gap-6" aria-label="Mobile">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={handleClose}
							className="font-display text-3xl text-white"
						>
							{link.label}
						</Link>
					))}
					<Link
						href="/contact"
						onClick={handleClose}
						className="btn-primary mt-4 w-fit"
					>
						Free consultation
					</Link>
				</nav>
			</div>
		</header>
	)
}
