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
- `deploy-notes.sh [online|offline]`: note content publish helper
- `pkh-ops.sh <command>`: unified ops wrapper (start/stop/restart/deploy/verify)
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

## Notes publish quick start

```bash
cd /srv/sites/personal-knowledge-hub/app
bash scripts/ops/deploy-notes.sh online
```

## Unified ops wrapper

```bash
cd /srv/sites/personal-knowledge-hub/app
bash scripts/ops/pkh-ops.sh status
bash scripts/ops/pkh-ops.sh deploy-notes-online
bash scripts/ops/pkh-ops.sh deploy-feature-online
```

## Docs

- `06_部署运维/运维命令手册.md`
- `06_部署运维/笔记更新发布流程.md`
- `06_部署运维/项目进度更新（2026-03-21 二次）.md`