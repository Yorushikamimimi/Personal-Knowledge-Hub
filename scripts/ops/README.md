# Ops Scripts（固定上线路径）

## 唯一上线方法（Single Path）

从 2026-03-24 起，主站与笔记统一使用 **Bundle 离线发布**，不再使用服务器 `git pull/fetch origin`。

原因：
- 服务器到 GitHub 网络不稳定，容易超时。
- 服务器历史上存在手工改动与 untracked 文件，容易阻塞 `pull --ff-only`。
- 固定单一路径后，发布可重复、可回放、可排错。

## 固定流程

1. 本地打包并上传：

```bash
cd "D:/Workspace/Personal Knowledge Hub"
git bundle create pkh-main-$(Get-Date -Format yyyyMMdd-HHmmss).bundle main
scp "pkh-main-<timestamp>.bundle" root@81.68.72.245:/srv/sites/personal-knowledge-hub/app/
```

2. 服务器部署（唯一入口）：

```bash
cd /srv/sites/personal-knowledge-hub/app
bash scripts/ops/deploy-bundle.sh ./pkh-main-<timestamp>.bundle main
```

## 脚本说明

- `deploy-bundle.sh`: **唯一推荐** 的上线脚本（Bundle 导入 -> reset -> clean -> build -> PM2 重启 -> 健康检查）
- `pkh-ops.sh deploy-bundle`: `deploy-bundle.sh` 的统一入口封装

## 禁用项（不再作为发布方法）

- `git pull --ff-only origin main`
- `git fetch origin main`
- 服务器手工 `scp` 单文件后直接 build
- 运行中删除 `.next` 后不重启 PM2

以上操作不是绝对禁止执行，但不再作为 SOP（标准操作流程），避免再次引入不一致状态。
