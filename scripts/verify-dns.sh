#!/usr/bin/env bash
# Inventory / verify DNS for covenantbuilders.org cutover.
set -euo pipefail

DOMAIN="${1:-covenantbuilders.org}"

echo "=== DNS inventory: ${DOMAIN} ==="
echo
echo "NS:"
dig +short NS "$DOMAIN" || true
echo
echo "A (@):"
dig +short A "$DOMAIN" || true
echo
echo "CNAME (www):"
dig +short CNAME "www.${DOMAIN}" || true
echo
echo "MX:"
dig +short MX "$DOMAIN" || true
echo
echo "TXT:"
dig +short TXT "$DOMAIN" || true
echo
echo "=== WHOIS (expiry / registrar) ==="
whois "$DOMAIN" 2>/dev/null | grep -Ei 'Registrar:|Registry Expiry|Name Server|Domain Status|DNSSEC' || true
echo
echo "=== HTTP probes (WP admin exposure) ==="
curl -sI --max-time 15 "https://${DOMAIN}/wp-login.php" | head -8 || true
echo "---"
curl -sI --max-time 15 "https://${DOMAIN}/wp-admin/" | head -12 || true
echo
echo "=== Cutover expectations ==="
echo "Pre-cutover:  A -> GoDaddy WP (e.g. 160.153.0.81), MX empty"
echo "Post-cutover: A -> Vercel, www CNAME -> Vercel, MX/TXT -> Workspace+Resend"
echo "WP login/upgrade should stop resolving on this host after hosting is retired."
