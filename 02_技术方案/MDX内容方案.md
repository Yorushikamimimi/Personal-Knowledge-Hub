# MDX 内容方案

## 当前内容目录

```text
content/
├─ notes/
├─ downloads/
├─ topics/
└─ projects/
```

## Project frontmatter 规范

```yaml
---
title: "项目名称"
slug: "project-slug"
summary: "一句话说明项目定位"
role: "我的角色"
techStack:
  - "Java"
highlights:
  - "核心亮点"
goals:
  - "项目背景 / 目标"
responsibilities:
  - "我的职责"
boundaries:
  - "边界说明"
screenshotNote: "截图位说明"
githubUrl: "https://..."
readmeUrl: ""
demoUrl: ""
featured: true
sortOrder: 1
status: "published"
---
```

## 统一约束

- `slug` 必须是 kebab-case（短横线命名）
- `slug` 必须与文件名一致
- `status=draft` 不进入列表页和静态参数
- `status=published` 才能出现在页面
- `Projects / Notes / Downloads / Topics` 均延续同一套静态内容驱动思路

## 维护建议

- `Projects` 中优先补真实项目文案，不要长期保留模板占位
- 项目截图后续可放在 `public` 目录，并在详情页替换 `screenshotNote` 占位区
- Notes 仍通过 `/import-notes` 或手动编辑 `content/notes` 维护