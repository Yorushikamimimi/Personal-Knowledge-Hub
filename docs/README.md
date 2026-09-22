# 项目文档

本文档目录以当前代码、脚本和可复现验证为优先；没有自动同步线上状态的保证。

| 目录 | 用途 |
| --- | --- |
| [`product/`](./product/) | 信息架构、页面字段与内容模型 |
| [`architecture/`](./architecture/) | 路由、MDX、SEO 与技术选择 |
| [`content/`](./content/) | 标签、分类与下载资源台账 |
| [`quality/`](./quality/) | 构建、响应式与上线前检查 |
| [`operations/`](./operations/) | 部署、Nginx、PM2、健康检查与回滚 |
| [`archive/`](./archive/) | 2026-03 的规划和执行历史；仅作证据，不作当前待办 |

根目录的 `README.md` 是新开发者入口。需要判断当前行为时，先读代码、`package.json`、`scripts/ops/` 和 CI，再把本目录中的历史说明当作辅助材料。
