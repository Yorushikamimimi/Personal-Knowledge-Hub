# Personal Knowledge Hub

一个以 MDX 内容为源、由 Next.js 构建的个人工程知识站点。它公开项目说明、技术笔记和可下载的模板；不依赖数据库、CMS、登录或运行时内容写入。

线上入口：<https://yoruming.cn/>
当前仓库版本：`0.1.0`（`package.json` 是唯一版本来源）

## 站点做什么

- **Projects**：用项目页面说明目标、技术取舍、可验证结果与明确边界。
- **Notes**：把可公开的工程经验整理为带 frontmatter 的 MDX 笔记。
- **Topics / Downloads**：提供专题入口和版本化的静态资源。
- **Resume / About**：只提供公开资料的导航，不承担帐号、招聘流程或数据收集功能。

内容从 `content/**` 的 MDX 文件进入读取层（`lib/**`），再由 App Router 页面渲染。公开路由只读取 `published` 内容；`draft` 内容和导入工具只用于开发维护。

## 架构与内容流

```text
content/**/*.mdx + public/files
            │
            ▼
     lib/{projects,notes,downloads,topics}.ts
            │  frontmatter 校验、published 过滤、排序
            ▼
       app/** 页面与静态路由
            │
            ▼
      Next.js build → production server
```

`/import-notes` 与 `/draft-notes` 是本地内容维护入口，生产构建不应暴露它们。公开资料的真实性边界、历史版本和运维操作见 [`docs/`](./docs/README.md)。

## 本地运行

需要 Node.js 20 LTS 或更高版本，以及 npm。

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。若 3000 已被占用，可自行添加 `-- --port <port>`。

## 验证

```bash
npm run lint
npm run typecheck
npm run content:check
npm run check
```

它们分别执行 Next.js / TypeScript ESLint 规则、严格类型检查、MDX frontmatter 与站内内容链接检查，以及上述检查加构建。`npm run build && npm run start` 用于生产构建的本地验收。CI 会在推送和 pull request 时运行相同的质量检查与构建。

## 部署

生产服务使用 Next.js 构建产物，由 PM2 运行并经 Nginx 反向代理。部署步骤、健康检查和回滚约束在 [`docs/operations/`](./docs/operations/)；它们是面向现有服务器的操作说明，不表示任何分支会自动部署。

## 真实边界

- 这是静态内容站，不是项目源代码、在线 RAG 服务或生产业务系统的镜像。
- 项目页只陈述能够公开和核对的范围；没有公开证据的指标、客户数据与内部链接不会放入站点。
- 作者原创的站点代码按 [MIT License](./LICENSE) 开放复用；适用路径和例外见 [许可适用范围](./LICENSE-SCOPE.md)。简历、项目文章、笔记、下载资料和站点素材不随代码一并开放授权。

## 文档

开发、内容、质量和运维资料已归并到 [`docs/`](./docs/README.md)。`docs/archive/` 中的 2026-03 文档仅保留历史决策和执行证据，不能替代当前代码、脚本或线上运行状态。
