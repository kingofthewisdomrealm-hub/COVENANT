#!/usr/bin/env bash
# Run after DNS points to Vercel. Exit non-zero if still on WordPress origin.
set -euo pipefail

DOMAIN="${1:-covenantbuilders.org}"
VERCEL_HINT="${VERCEL_APEX_IP:-76.76.21.21}"

echo "=== Post-cutover check: ${DOMAIN} ==="
APEX="$(dig +short A "$DOMAIN" | head -1 || true)"
WWW="$(dig +short CNAME "www.${DOMAIN}" | head -1 || true)"
MX="$(dig +short MX "$DOMAIN" | head -1 || true)"

echo "A:     ${APEX:-none}"
echo "www:   ${WWW:-none}"
echo "MX:    ${MX:-none}"

FAIL=0

if [[ "$APEX" == "160.153.0.81" ]]; then
	echo "FAIL: apex still on GoDaddy WordPress (160.153.0.81)"
	FAIL=1
elif [[ -z "$APEX" ]]; then
	echo "FAIL: no A record"
	FAIL=1
else
	echo "OK: apex moved off WP host (confirm ${APEX} matches Vercel Domains; hint ${VERCEL_HINT})"
fi

if [[ -z "$MX" ]]; then
	echo "WARN: no MX — Workspace mail not configured yet"
else
	echo "OK: MX present"
fi

HTML="$(curl -sL --max-time 20 "https://${DOMAIN}/" | head -c 4000 || true)"
if echo "$HTML" | grep -qi 'wp-content\|Elementor\|wp-includes'; then
	echo "FAIL: HTML still looks like WordPress (purge CDN / check DNS)"
	FAIL=1
else
	echo "OK: HTML does not look like WordPress"
fi

if curl -sI --max-time 15 "https://${DOMAIN}/wp-admin/" | head -5 | grep -qi 'upgrade.php\|wordpress'; then
	echo "WARN: /wp-admin still reachable — retire GoDaddy WP hosting"
else
	echo "OK: /wp-admin not exposing WP upgrade path"
fi

for path in / /services /portfolio /about /contact /privacy /sitemap.xml /robots.txt; do
	CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "https://${DOMAIN}${path}" || echo 000)"
	echo "HTTP ${CODE}  ${path}"
	if [[ "$CODE" != "200" ]]; then
		FAIL=1
	fi
done

INV="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "https://${DOMAIN}/investors" || echo 000)"
echo "HTTP ${INV}  /investors (expect 200 after Next deploy)"

exit "$FAIL"
