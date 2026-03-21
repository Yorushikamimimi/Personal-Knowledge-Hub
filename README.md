# Personal Knowledge Hub

## 当前定位

Personal Knowledge Hub 当前已经从“个人知识总结静态网站”升级为“作品集主站 + 知识总结栏目”的个人静态网站。

站点目标：
- 用 `Projects` 集中展示主打项目
- 用 `Notes` 保留长期积累的知识总结 / 学习笔记
- 用 `About / Resume / GitHub` 快速建立求职展示入口
- 保持全站静态化，不引入数据库、后台 CMS、登录、评论或搜索

## 当前版本

- 当前版本：`V0.5-beta`
- 当前状态：可本地运行、可构建、可作为个人作品集主站预览
- 当前重点：作品集主站信息架构已完成，Projects 详情页和首页已按招聘视角收口

## 当前站点结构

### 主导航
- `Projects`
- `Notes`
- `Resume`
- `GitHub`
- `About`

### 二级入口
- `Topics`
- `Downloads`
- `Privacy`
- `Copyright`
- `Disclaimer`

### 本地维护入口
- `/import-notes`：本地 Markdown 导入页，仅开发环境使用
- `/draft-notes`：本地 draft 笔记列表页，仅开发环境使用

## 技术栈

- `Next.js App Router`：Next.js 的 App 路由体系
- `TypeScript`：类型安全的 JavaScript 超集
- `MDX`：可带 frontmatter 的 Markdown 内容格式
- `public` 静态资源目录：用于下载文件和截图等静态资源

## 内容目录

- `content/notes`：知识笔记
- `content/downloads`：下载资源元数据
- `content/topics`：专题聚合元数据
- `content/projects`：项目作品内容

## 运行方式

```bash
npm install
npm run dev
```

生产构建验证：

```bash
npm run build
npm run start
```

## 当前已完成的关键能力

- 作品集主站化信息架构
- `Projects / Notes / Resume / GitHub / About` 主导航收口
- `Projects` 列表页与统一详情页模板
- 3 个真实项目条目接入：`rag-nexus`、`nautilus-media-cloud`、`nautilus-clinic`
- 首页 `Featured Projects` / `Latest Notes` 联动展示
- 项目详情页截图预览、缩略图切换、边界说明与面试追问区
- `Notes / Downloads / Topics` 内容闭环
- 本地 Markdown 导入与 draft 管理能力

## 下一步建议

- 补项目量化结果：把“做了什么”进一步补成“带来了什么”
- 补正式 `Resume` 链接或 PDF
- 继续做上线前验收与内容校对
- 视求职目标继续微调首页与项目详情页表达重点