/**
 * Google Tag Manager, GA4 and Meta Pixel — each turns on only when its ID is
 * set in Vercel → Settings → Environment Variables. With nothing set, nothing
 * loads and the page is byte-for-byte as fast as before.
 *
 *   NEXT_PUBLIC_GTM_ID          GTM-XXXXXXX
 *   NEXT_PUBLIC_GA4_ID          G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID   15-16 digit number
 *   NEXT_PUBLIC_POSTHOG_KEY     phc_… (PostHog project API key — heatmaps,
 *                               click maps, scroll maps, session replay)
 *   NEXT_PUBLIC_POSTHOG_HOST    optional, default https://us.i.posthog.com
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
const POSTHOG = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com'

const safeId = (id: string | undefined, pattern: RegExp) => (id && pattern.test(id) ? id : undefined)
const gtmId = safeId(GTM, /^GTM-[A-Z0-9]+$/)
const ga4Id = safeId(GA4, /^G-[A-Z0-9]+$/)
const pixelId = safeId(PIXEL, /^\d{8,20}$/)
const posthogKey = safeId(POSTHOG, /^phc_[A-Za-z0-9]+$/)
const posthogHost = /^https:\/\/[a-z0-9.-]+$/.test(POSTHOG_HOST) ? POSTHOG_HOST : 'https://us.i.posthog.com'

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
			{posthogKey ? (
				/*
				 * PostHog (open source, MIT) — the "see what people click" layer.
				 * autocapture + heatmaps give click maps, scroll maps and rage
				 * clicks on every page; session replay shows real visits. Form
				 * fields are masked by default. The attribution tracker tags every
				 * visitor with channel / campaign / rep so heatmaps can be split
				 * by where people came from.
				 */
				<Script id="posthog" strategy="afterInteractive">
					{`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${posthogKey}',{api_host:'${posthogHost}',defaults:'2026-05-30',person_profiles:'identified_only',autocapture:true,capture_pageview:'history_change',capture_pageleave:true,enable_heatmaps:true,session_recording:{maskAllInputs:true}});`}
				</Script>
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
