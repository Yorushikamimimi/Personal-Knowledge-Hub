export const siteProfile = {
  siteTitle: "Personal Knowledge Hub",
  siteSubtitle: "AI Engineering Projects + Notes",
  ownerLabel: "Yorushikamimimi",
  tagline: "AI 应用 / Java 工程实践 + 开源 Skills",
  roleHeadline: "2027 届重庆邮电大学计算机专业本科生，方向为 Java 后端与 AI 应用开发，关注订单与库存一致性、异步消息、LLM 工具调用与文档解析。",
  intro:
    "站点展示项目、工程笔记与开源 Skills；正式简历和公开仓库分别保留对应版本的证据与边界。",
} as const;

export const siteLinks = {
  github: "https://github.com/Yorushikamimimi",
  resume: "/resume",
} as const;

export const complianceInfo = {
  icpNumber: "蜀ICP备2026007917号",
  icpUrl: "https://beian.miit.gov.cn/",
  publicSecurityNumber: "",
  publicSecurityUrl: "https://beian.mps.gov.cn/#/query/webSearch",
} as const;

export const heroKeywords = ["Java", "Spring Boot / MyBatis", "MySQL / PostgreSQL", "Redis / RabbitMQ", "Spring AI / LLM API", "Python", "Codex Skills"] as const;

export const publicSkills = [
  {
    slug: "codex-thread-handoff",
    title: "Codex Thread Handoff",
    summary: "把长对话接到一个干净的新任务中，让新任务从项目文档和必要增量恢复当前进度。",
    capabilities: [
      "优先读取权威资料，只补充资料中缺失的近期决定与未完成事项。",
      "提供资料恢复、单份交接文档和严格验证三条路径，按证据与风险选择。",
      "恢复默认只读；新建、验收、改名和归档分别确认，保留旧任务作为回溯入口。",
    ],
    boundary: "公开包已按仓库记录通过 Skill 结构验证；不保证每条聊天细节、隐含假设和互动体验都无损转移。",
    repository: "https://github.com/Yorushikamimimi/codex-thread-handoff",
    installUrl: "https://github.com/Yorushikamimimi/codex-thread-handoff#install",
    installSummary: "下载公开仓库，将 skill/codex-thread-handoff 目录按 README 放入 Codex 的 Skill 目录。",
    license: "MIT",
  },
  {
    slug: "word-enhanced",
    title: "Word Enhanced / docdoc",
    summary: "已有 Word 只需改一小处时，先定位目标，再修改副本，并检查是否影响了其他内容。",
    capabilities: [
      "按文档结构选择 OOXML 精确修改、Documents、Word 原生或界面操作中的一条主路线。",
      "提供 DOCX 检查、前后结构比较、精确替换与任务范围验证四个 MCP 工具。",
      "目标不唯一、原值不符或出现非目标变化时停止；可能影响排版时补充前后视觉核验。",
    ],
    boundary: "聚焦已有 DOCX 的修改与模板填写；公开说明列有文字格式、单元格、目录字段及书签、浮动图片等验证场景。实验材料未公开，不保证任意 Word 对象都能无损修改。",
    repository: "https://github.com/Yorushikamimimi/docdoc",
    installUrl: "https://github.com/Yorushikamimimi/docdoc#怎么安装",
    installSummary: "按公开 README 安装 Skill 与 MCP；需要 git、uv、Python 3.10+，Word 路线还需要本机 Microsoft Word。",
    license: "MIT",
  },
] as const;
