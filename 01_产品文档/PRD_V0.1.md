# PRD_V0.1

## 产品定位

Personal Knowledge Hub V0.1 当前定位为：`作品集主站 + 知识总结栏目`。

它不是在线业务系统，也不是内容社区，而是一个个人静态展示站。核心目标是让访问者快速理解：

- 我是谁
- 我的主打项目是什么
- 我的方向是后端 / 全栈
- 哪里可以看项目、笔记、GitHub 和简历

## 产品范围

### 主路径

- `/`：portfolio 首页
- `/projects`：项目列表页
- `/projects/[slug]`：项目详情页
- `/notes`：知识笔记列表页
- `/notes/[slug]`：知识笔记详情页
- `/about`：关于我
- `/resume`：简历入口预留页

### 二级入口

- `/topics`
- `/downloads`
- `/downloads/[slug]`
- `/privacy`
- `/copyright`
- `/disclaimer`

### 本地维护页

- `/import-notes`
- `/draft-notes`
- `/draft-notes/[slug]`

## 首页目标

首页需要同时承担两类职责：

1. 求职主站入口：先展示主打项目和个人方向
2. 知识站入口：继续保留 Notes 的长期积累属性

首页核心区块：

- Hero：一句话介绍、方向、技术关键词、主入口按钮
- Featured Projects：2~3 个主打项目
- Latest Notes：最新知识笔记
- Secondary Entries：Topics / Downloads 二级入口
- External Links：GitHub / Resume / About

## Projects 目标

Projects 用于集中展示项目案例，帮助访问者在短时间内建立对项目能力和工程思考的认知。

每个项目需至少说明：

- 项目名称
- 一句话定位
- 技术栈
- 我的角色
- 核心亮点
- 边界说明
- GitHub / README / Demo 入口

## About 目标

About 不再只是“关于本站”，而是：

- 背景简介
- 求职方向
- 技术栈
- 工程关注点
- 外链入口说明

## 非目标

V0.1 明确不做：

- 后端服务
- 数据库
- CMS
- 登录 / 评论 / 搜索
- 线上上传
- 下载统计