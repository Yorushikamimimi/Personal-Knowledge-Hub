#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-personal-knowledge-hub}"
APP_BASE="${APP_BASE:-/srv/sites/${APP_NAME}}"
APP_DIR="${APP_DIR:-${APP_BASE}/app}"
DOMAIN="${DOMAIN:-yoruming.cn}"
BRANCH="${BRANCH:-main}"
MODE="${1:-online}" # online | offline
VERIFY_PATTERN="${VERIFY_PATTERN:-}"

usage() {
  cat <<'EOF'
Usage:
  bash scripts/ops/deploy-notes.sh [online|offline]

Modes:
  online   Pull latest code from origin/main, then build and restart.
  offline  Skip git sync, use current server files, then build and restart.

Optional env:
  DOMAIN=yoruming.cn
  BRANCH=main
  VERIFY_PATTERN='codex-gpt-sop|md-github|prompt-ai'
  APP_DIR=/srv/sites/personal-knowledge-hub/app
EOF
}

if [[ "${MODE}" != "online" && "${MODE}" != "offline" ]]; then
  usage
  exit 1
fi

echo "[1/6] Enter app directory"
cd "${APP_DIR}"

echo "[2/6] Sync code (${MODE})"
if [[ "${MODE}" == "online" ]]; then
  if [[ -n "$(git status --porcelain)" ]]; then
    STASH_LABEL="notes-auto-stash-$(date +%F-%H%M%S)"
    git stash push -u -m "${STASH_LABEL}" >/dev/null || true
    echo "Stashed local changes: ${STASH_LABEL}"
  fi

  git fetch origin "${BRANCH}"
  git checkout "${BRANCH}"
  git pull --ff-only origin "${BRANCH}"
else
  echo "Skip git sync in offline mode."
fi

echo "[3/6] Check published frontmatter"
PUBLISHED_COUNT="$(grep -R -E '^[[:space:]]*status:[[:space:]]*"?published"?$' content/notes --include='*.mdx' | wc -l || true)"
echo "Published entries: ${PUBLISHED_COUNT}"

echo "[4/6] Build"
npm run build

echo "[5/6] Restart PM2"
if pm2 describe pkh-web >/dev/null 2>&1; then
  pm2 restart pkh-web --update-env
else
  pm2 start ecosystem.config.cjs --env production
fi
pm2 save

echo "[6/6] Verify"
bash scripts/ops/healthcheck.sh "${DOMAIN}" || true

if [[ -n "${VERIFY_PATTERN}" ]]; then
  echo "Check notes page with pattern: ${VERIFY_PATTERN}"
  if curl -fsS "https://${DOMAIN}/notes?t=$(date +%s)" | grep -E "${VERIFY_PATTERN}" >/dev/null; then
    echo "Pattern matched on notes page."
  else
    echo "Warning: Pattern not found on notes page."
  fi
fi

echo "Done."
