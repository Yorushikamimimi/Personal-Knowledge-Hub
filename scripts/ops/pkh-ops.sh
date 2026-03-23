#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-personal-knowledge-hub}"
APP_BASE="${APP_BASE:-/srv/sites/${APP_NAME}}"
APP_DIR="${APP_DIR:-${APP_BASE}/app}"
DOMAIN="${DOMAIN:-yoruming.cn}"

usage() {
  cat <<'EOF'
Usage:
  bash scripts/ops/pkh-ops.sh <command>

Commands:
  start                 Start pkh-web via PM2
  stop                  Stop pkh-web
  restart               Restart pkh-web with updated env
  status                Show PM2 process status
  logs                  Show recent PM2 logs
  verify                Verify main and music domains
  deploy-bundle         Deploy from local git bundle (single stable path)

Optional env:
  APP_DIR=/srv/sites/personal-knowledge-hub/app
  DOMAIN=yoruming.cn
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

COMMAND="$1"
cd "${APP_DIR}"

case "${COMMAND}" in
  start)
    if pm2 describe pkh-web >/dev/null 2>&1; then
      pm2 start pkh-web || true
    else
      pm2 start ecosystem.config.cjs --env production
    fi
    pm2 save
    ;;
  stop)
    pm2 stop pkh-web
    pm2 save
    ;;
  restart)
    pm2 restart pkh-web --update-env
    pm2 save
    ;;
  status)
    pm2 ls
    pm2 describe pkh-web
    ;;
  logs)
    pm2 logs pkh-web --lines 200
    ;;
  verify)
    curl -I "https://${DOMAIN}"
    curl -I "https://music.${DOMAIN#www.}"
    curl -I "http://127.0.0.1:3001"
    ;;
  deploy-bundle)
    BUNDLE_FILE="${2:-}"
    BRANCH="${3:-main}"
    if [[ -z "${BUNDLE_FILE}" ]]; then
      echo "Usage: bash scripts/ops/pkh-ops.sh deploy-bundle <bundle-file> [branch]"
      exit 1
    fi
    bash scripts/ops/deploy-bundle.sh "${BUNDLE_FILE}" "${BRANCH}"
    ;;
  deploy-notes-online)
    echo "Deprecated: use deploy-bundle only."
    echo "Run: bash scripts/ops/pkh-ops.sh deploy-bundle <bundle-file> [branch]"
    exit 1
    ;;
  deploy-notes-offline)
    echo "Deprecated: use deploy-bundle only."
    echo "Run: bash scripts/ops/pkh-ops.sh deploy-bundle <bundle-file> [branch]"
    exit 1
    ;;
  deploy-feature-online)
    echo "Deprecated: use deploy-bundle only."
    echo "Run: bash scripts/ops/pkh-ops.sh deploy-bundle <bundle-file> [branch]"
    exit 1
    ;;
  deploy-feature-offline)
    echo "Deprecated: use deploy-bundle only."
    echo "Run: bash scripts/ops/pkh-ops.sh deploy-bundle <bundle-file> [branch]"
    exit 1
    ;;
  *)
    usage
    exit 1
    ;;
esac

echo "Done: ${COMMAND}"
