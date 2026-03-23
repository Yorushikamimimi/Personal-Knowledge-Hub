#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-personal-knowledge-hub}"
APP_BASE="${APP_BASE:-/srv/sites/${APP_NAME}}"
APP_DIR="${APP_DIR:-${APP_BASE}/app}"
DOMAIN="${DOMAIN:-yoruming.cn}"
BUNDLE_FILE="${1:-}"
BRANCH="${2:-main}"
INTERNAL_PORT="${INTERNAL_PORT:-3001}"

usage() {
  cat <<'EOF'
Usage:
  bash scripts/ops/deploy-bundle.sh <bundle-file> [branch]

Example:
  bash scripts/ops/deploy-bundle.sh ./pkh-main-20260324.bundle main

Description:
  Deploy using a local git bundle file only (no GitHub fetch).
EOF
}

if [[ -z "${BUNDLE_FILE}" ]]; then
  usage
  exit 1
fi

cd "${APP_DIR}"

if [[ ! -f "${BUNDLE_FILE}" ]]; then
  echo "Error: bundle file not found: ${BUNDLE_FILE}"
  exit 1
fi

echo "[1/8] Import bundle -> FETCH_HEAD"
git fetch "${BUNDLE_FILE}" "${BRANCH}"

echo "[2/8] Reset to fetched commit"
git reset --hard FETCH_HEAD

echo "[3/8] Clean untracked files"
git clean -fd

echo "[4/8] Stop app before cleaning build artifacts"
if pm2 describe pkh-web >/dev/null 2>&1; then
  pm2 stop pkh-web || true
fi

echo "[5/8] Rebuild from clean state"
rm -rf .next
npm run build

echo "[6/8] Start app"
if pm2 describe pkh-web >/dev/null 2>&1; then
  pm2 restart pkh-web --update-env
else
  pm2 start ecosystem.config.cjs --env production
fi
pm2 save

echo "[7/8] Health checks"
curl -fsSI "http://127.0.0.1:${INTERNAL_PORT}" >/dev/null
curl -fsSI "https://${DOMAIN}" >/dev/null

echo "[8/8] Done"
echo "HEAD: $(git rev-parse --short HEAD)"
echo "Deploy success for ${DOMAIN}"
