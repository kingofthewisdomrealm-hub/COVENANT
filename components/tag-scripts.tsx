/**
 * Google Tag Manager, GA4 and Meta Pixel — each turns on only when its ID is
 * set in Vercel → Settings → Environment Variables. With nothing set, nothing
 * loads and the page is byte-for-byte as fast as before.
 *
 *   NEXT_PUBLIC_GTM_ID          GTM-XXXXXXX
 *   NEXT_PUBLIC_GA4_ID          G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID   15-16 digit number
 *
 * ⚠️ Pick ONE home for GA4: either set NEXT_PUBLIC_GA4_ID here, OR add the GA4
 * tag inside GTM — not both, or every page view counts twice.
 *
 * Google Search Console needs no script: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
 * (already wired in app/layout.tsx).
 */
import Script from 'next/script'

const GTM = process.env.NEXT_PUBLIC_GTM_ID?.trim()
const GA4 = process.env.NEXT_PUBLIC_GA4_ID?.trim()
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()

const safeId = (id: string | undefined, pattern: RegExp) => (id && pattern.test(id) ? id : undefined)
const gtmId = safeId(GTM, /^GTM-[A-Z0-9]+$/)
const ga4Id = safeId(GA4, /^G-[A-Z0-9]+$/)
const pixelId = safeId(PIXEL, /^\d{8,20}$/)

export function TagScripts() {
	return (
		<>
			{gtmId ? (
				<Script id="gtm" strategy="afterInteractive">
					{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
				</Script>
			) : null}
			{ga4Id ? (
				<>
					<Script
						id="ga4-src"
						src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
						strategy="afterInteractive"
					/>
					<Script id="ga4" strategy="afterInteractive">
						{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4Id}');`}
					</Script>
				</>
			) : null}
			{pixelId ? (
				<Script id="meta-pixel" strategy="afterInteractive">
					{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
				</Script>
			) : null}
		</>
	)
}

/** GTM's no-JS fallback, placed first inside <body>. */
export function TagNoScript() {
	if (!gtmId) return null
	return (
		<noscript>
			<iframe
				src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
				height="0"
				width="0"
				style={{ display: 'none', visibility: 'hidden' }}
				title="gtm"
			/>
		</noscript>
	)
}
