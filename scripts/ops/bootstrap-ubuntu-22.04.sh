#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-personal-knowledge-hub}"
APP_BASE="${APP_BASE:-/srv/sites/${APP_NAME}}"
APP_DIR="${APP_DIR:-${APP_BASE}/app}"
LOG_DIR="${LOG_DIR:-${APP_BASE}/logs}"
BACKUP_DIR="${BACKUP_DIR:-${APP_BASE}/backups}"

echo "[1/5] Install Node.js 20 + npm"
sudo apt update
sudo apt install -y curl ca-certificates gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
  | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
  | sudo tee /etc/apt/sources.list.d/nodesource.list >/dev/null
sudo apt update
sudo apt install -y nodejs git

echo "[2/5] Install PM2"
sudo npm i -g pm2

echo "[3/5] Prepare unified operation directories"
sudo mkdir -p "${APP_DIR}" "${LOG_DIR}" "${BACKUP_DIR}"
sudo chown -R "$(whoami)":"$(whoami)" "${APP_BASE}"

echo "[4/5] Print versions"
node -v
npm -v
pm2 -v
nginx -v

echo "[5/5] Verify Nginx status"
sudo systemctl status nginx --no-pager -l | sed -n '1,18p'

echo "Bootstrap done. Next: run ./scripts/ops/deploy.sh"
