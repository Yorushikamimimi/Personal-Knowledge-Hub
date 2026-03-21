# 运维脚本说明

## 目标

在不改动现有宿主机端口策略的前提下，把 `Personal Knowledge Hub` 固化为统一目录和固定部署流程。

## 统一目录

默认目录（可通过环境变量覆盖）：

- `/srv/sites/personal-knowledge-hub/app`：项目代码与构建产物
- `/srv/sites/personal-knowledge-hub/logs`：运行日志
- `/srv/sites/personal-knowledge-hub/backups`：回滚标记

## 脚本列表

- `bootstrap-ubuntu-22.04.sh`：安装 Node.js 20 / PM2，并初始化目录
- `deploy.sh`：拉取代码、构建、PM2 启动/重载、健康检查
- `rollback.sh <commit-sha>`：回滚到指定提交并重载
- `healthcheck.sh [domain]`：本地端口与公网域名探活
- `nginx-site.conf.example`：Nginx 站点示例配置

## 推荐执行顺序

1. `bash scripts/ops/bootstrap-ubuntu-22.04.sh`
2. `bash scripts/ops/deploy.sh`
3. 配置 Nginx（参考 `nginx-site.conf.example`）并 reload
4. `bash scripts/ops/healthcheck.sh yoruming.cn`
