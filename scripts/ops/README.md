# Ops Scripts

## Goal

Keep deployment reproducible with the existing host port strategy:
- Main site via Nginx (`yoruming.cn`, `www.yoruming.cn`)
- Music subdomain via Nginx (`music.yoruming.cn`)

## Default directories

- `/srv/sites/personal-knowledge-hub/app`: source code and build output
- `/srv/sites/personal-knowledge-hub/logs`: runtime logs
- `/srv/sites/personal-knowledge-hub/backups`: rollback markers

## Scripts

- `bootstrap-ubuntu-22.04.sh`: install Node.js 20 / PM2 and initialize directories
- `deploy.sh`: sync code, build, reload PM2, and run health check
- `rollback.sh <commit-sha>`: rollback to a commit and restart
- `healthcheck.sh [domain]`: local and public endpoint checks
- `nginx-site.conf.example`: main site Nginx example (`yoruming.cn`)
- `nginx-music-site.conf.example`: music site Nginx example (`music.yoruming.cn`)

## Recommended flow

```bash
bash scripts/ops/bootstrap-ubuntu-22.04.sh
bash scripts/ops/deploy.sh
# configure nginx and reload
bash scripts/ops/healthcheck.sh yoruming.cn
```

## Emergency deploy (network restricted)

If the server cannot reach GitHub/NPM but local code is already the target version:

```bash
cd /srv/sites/personal-knowledge-hub/app
SKIP_GIT_SYNC=1 SKIP_NPM_CI=1 bash scripts/ops/deploy.sh
```

If GitHub is unreachable but NPM is reachable:

```bash
SKIP_GIT_SYNC=1 bash scripts/ops/deploy.sh
```
