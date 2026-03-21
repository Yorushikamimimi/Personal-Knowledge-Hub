#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-yoruming.cn}"
INTERNAL_PORT="${INTERNAL_PORT:-3001}"
HEALTH_PATH="${HEALTH_PATH:-/}"

echo "== Local check =="
curl -I "http://127.0.0.1:${INTERNAL_PORT}${HEALTH_PATH}"

echo
echo "== Public check =="
curl -I "http://${DOMAIN}${HEALTH_PATH}"
