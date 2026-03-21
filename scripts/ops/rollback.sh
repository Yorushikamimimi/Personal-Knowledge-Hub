#!/usr/bin/env bash
set -euo pipefail

TARGET_COMMIT="${1:-}"
APP_NAME="${APP_NAME:-personal-knowledge-hub}"
APP_BASE="${APP_BASE:-/srv/sites/${APP_NAME}}"
APP_DIR="${APP_DIR:-${APP_BASE}/app}"
INTERNAL_PORT="${INTERNAL_PORT:-3001}"
HEALTH_PATH="${HEALTH_PATH:-/}"

if [[ -z "${TARGET_COMMIT}" ]]; then
  echo "Usage: ./scripts/ops/rollback.sh <commit-sha>"
  exit 1
fi

if [[ ! -d "${APP_DIR}/.git" ]]; then
  echo "Error: ${APP_DIR} is not a git repository."
  exit 1
fi

echo "[1/4] Checkout target commit: ${TARGET_COMMIT}"
git -C "${APP_DIR}" fetch --all --tags
git -C "${APP_DIR}" checkout "${TARGET_COMMIT}"

echo "[2/4] Reinstall dependencies and rebuild"
cd "${APP_DIR}"
npm ci
npm run build

echo "[3/4] Reload PM2 process"
pm2 reload ecosystem.config.cjs --update-env
pm2 save

echo "[4/4] Health check"
sleep 2
curl -fsS "http://127.0.0.1:${INTERNAL_PORT}${HEALTH_PATH}" >/dev/null
echo "Rollback success: ${TARGET_COMMIT}"
