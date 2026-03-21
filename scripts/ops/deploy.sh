#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-personal-knowledge-hub}"
APP_BASE="${APP_BASE:-/srv/sites/${APP_NAME}}"
APP_DIR="${APP_DIR:-${APP_BASE}/app}"
LOG_DIR="${LOG_DIR:-${APP_BASE}/logs}"
BACKUP_DIR="${BACKUP_DIR:-${APP_BASE}/backups}"
REPO_URL="${REPO_URL:-https://github.com/Yorushikamimimi/Personal-Knowledge-Hub.git}"
BRANCH="${BRANCH:-main}"
HEALTH_PATH="${HEALTH_PATH:-/}"
INTERNAL_PORT="${INTERNAL_PORT:-3001}"

echo "[1/6] Ensure base directories"
sudo mkdir -p "${APP_DIR}" "${LOG_DIR}" "${BACKUP_DIR}"

echo "[2/6] Clone or update repository"
if [[ -d "${APP_DIR}/.git" ]]; then
  git -C "${APP_DIR}" fetch origin "${BRANCH}"
  git -C "${APP_DIR}" checkout "${BRANCH}"
  git -C "${APP_DIR}" pull --ff-only origin "${BRANCH}"
else
  if [[ -n "$(ls -A "${APP_DIR}" 2>/dev/null)" ]]; then
    echo "Error: ${APP_DIR} exists and is not empty, but not a git repository."
    exit 1
  fi
  git clone -b "${BRANCH}" "${REPO_URL}" "${APP_DIR}"
fi

echo "[3/6] Save rollback marker"
if git -C "${APP_DIR}" rev-parse HEAD >/dev/null 2>&1; then
  mkdir -p "${BACKUP_DIR}"
  git -C "${APP_DIR}" rev-parse HEAD > "${BACKUP_DIR}/last_success_commit.txt" || true
fi

echo "[4/6] Install dependencies and build"
cd "${APP_DIR}"
npm ci
npm run build

echo "[5/6] Start or reload PM2 process"
if pm2 describe pkh-web >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs --env production
fi
pm2 save

echo "[6/6] Health check"
sleep 2
curl -fsS "http://127.0.0.1:${INTERNAL_PORT}${HEALTH_PATH}" >/dev/null
echo "Deploy success: http://127.0.0.1:${INTERNAL_PORT}${HEALTH_PATH}"
