import Link from "next/link";
import { PageContainer } from "../components/layout/PageContainer";
import { formatNoteDate, getAllPublishedNotes, type NoteListItem } from "../lib/notes";
import { getFeaturedProjects } from "../lib/projects";
import { siteLinks } from "../lib/site-config";

const secondaryEntries = [
  {
    title: "Topics",
    description: "按主题组织技术内容，适合快速定位某个后端问题域。",
    href: "/topics",
  },
  {
    title: "Downloads",
    description: "沉淀可复用模板与检查清单，作为项目交付的补充材料。",
    href: "/downloads",
  },
];

const externalEntries = [
  {
    title: "GitHub",
    description: "查看源码、提交记录与分支演进。",
    href: siteLinks.github,
    external: true,
  },
  {
    title: "About",
    description: "了解我的工程关注点与协作方式。",
    href: "/about",
    external: false,
  },
] as const;

const capabilityCards = [
  {
    title: "RAG Retrieval Chain",
    detail: "多源注入 + pgvector 召回 + SSE 流式输出。",
  },
  {
    title: "Async Scheduling",
    detail: "Worker 协作 + SKIP LOCKED 并发认领。",
  },
  {
    title: "Business Workflow",
    detail: "门诊流程 + RBAC 权限 + 库存一致性控制。",
  },
  {
    title: "Deploy Baseline",
    detail: "Nginx + PM2 + HTTPS + 回滚脚本。",
  },
] as const;

const projectCopy: Record<string, { elevator: string; highlight: string }> = {
  "rag-nexus": {
    elevator: "面向知识库问答场景的 RAG 项目，支持多源内容注入与可追踪检索链路。",
    highlight: "基于 pgvector 构建召回链路，并用 SSE 实现流式回答输出。",
  },
  "nautilus-media-cloud": {
    elevator: "面向媒体处理场景的异步任务系统，覆盖任务创建、调度与执行回传。",
    highlight: "采用 Worker 消费模型与 SKIP LOCKED 机制提升并发吞吐和任务一致性。",
  },
  "nautilus-clinic": {
    elevator: "门诊业务系统原型，覆盖患者、就诊、处方与库存协同的核心流程。",
    highlight: "围绕 RBAC 与库存一致性约束实现私有化可落地的后端方案。",
  },
};

const technicalKeywords = [
  "postgresql",
  "pgvector",
  "skip locked",
  "spring",
  "docker",
  "rag",
  "sse",
  "concurrency",
  "thread",
  "backend",
  "transaction",
  "consistency",
  "调度",
  "检索",
  "部署",
  "架构",
  "并发",
];

const deprioritizedKeywords = ["workflow", "prompt", "sop", "自我介绍", "面试话术", "template"];

function getTechnicalNoteScore(note: NoteListItem): number {
  const normalized = `${note.title} ${note.summary} ${note.category} ${note.tags.join(" ")}`.toLowerCase();

  let score = 0;

  if (note.category.includes("java") || note.category.includes("backend")) {
    score += 4;
  }

  for (const keyword of technicalKeywords) {
    if (normalized.includes(keyword)) {
      score += 2;
    }
  }

  for (const keyword of deprioritizedKeywords) {
    if (normalized.includes(keyword)) {
      score -= 3;
    }
  }

  return score;
}

function getHomeNotes(): NoteListItem[] {
  return getAllPublishedNotes()
    .map((note) => ({ note, score: getTechnicalNoteScore(note) }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return new Date(b.note.updatedAt).getTime() - new Date(a.note.updatedAt).getTime();
    })
    .map((entry) => entry.note)
    .slice(0, 3);
}

export default function HomePage() {
  const featuredProjects = getFeaturedProjects(3);
  const [leadProject, ...otherProjects] = featuredProjects;
  const latestNotes = getHomeNotes();

  return (
    <PageContainer>
      <div className="page-stack">
        <section className="hero-panel hero-panel--portfolio hero-panel--portfolio-refined">
          <div className="page-stack page-stack--compact">
            <span className="hero-kicker">Backend / Full-stack Portfolio</span>
            <h1 className="hero-title">后端 / 全栈项目作品集入口</h1>
            <h2 className="page-title" style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)", marginTop: 0 }}>
              聚焦业务系统交付、数据一致性与可上线运维
            </h2>
            <p className="hero-description">
              这里优先展示 3 个主打项目的工程实现与取舍过程，覆盖 RAG 检索链路、异步任务调度和门诊业务系统。
              Notes 仅作为项目技术支撑材料，不与项目主线竞争首页注意力。
            </p>
          </div>

          <div className="hero-actions hero-actions--portfolio">
            <Link href="/projects" className="button-link">
              查看主打 Projects
            </Link>
            <Link href="/notes" className="button-link button-link--secondary">
              查看技术型 Notes
            </Link>
          </div>

          <div className="hero-link-row" aria-label="辅助入口">
            <a
              href={siteLinks.github}
              target="_blank"
              rel="noreferrer"
              className="project-inline-link project-inline-link--external"
            >
              前往 GitHub
              <span aria-hidden="true"> →</span>
            </a>
            <Link href="/about" className="project-inline-link project-inline-link--external">
              了解 About
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          <div className="hero-metrics" aria-label="能力与交付基线">
            {capabilityCards.map((item) => (
              <div key={item.title} className="hero-metric">
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="page-stack project-home-section">
          <div className="section-header">
            <div>
              <span className="section-kicker">Featured Projects</span>
              <h2>先看代表项目，再进入细节证据</h2>
              <p className="muted-text">首页只保留招聘视角所需信息：项目定位、核心亮点和跳转入口。</p>
            </div>
            <Link href="/projects" className="section-header__link">
              查看全部 Projects
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          {leadProject ? (
            <div className="project-home-shell">
              <article className="project-lead-card project-lead-card--home">
                <div className="project-lead-card__eyebrow">
                  <span className="project-badge project-badge--primary">Primary Project</span>
                  <span className="project-meta-inline">重点评估入口</span>
                </div>

                <div className="project-lead-card__main">
                  <div className="note-meta">
                    <span>{leadProject.role}</span>
                    <span>{leadProject.techStack.length} 项核心技术</span>
                  </div>
                  <h3 className="project-card__title project-card__title--lead">{leadProject.title}</h3>
                  <p className="project-card__summary project-card__summary--lead">
                    {(projectCopy[leadProject.slug] ?? { elevator: leadProject.summary }).elevator}
                  </p>
                  <p className="project-home-lead__reason">
                    <strong>核心亮点：</strong>
                    {(projectCopy[leadProject.slug] ?? { highlight: leadProject.highlights[0] }).highlight}
                  </p>
                  <div className="tag-list" aria-label={`${leadProject.title} 技术栈预览`}>
                    {leadProject.techStack.slice(0, 5).map((item) => (
                      <span key={item} className="tag-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="project-link-row project-link-row--lead">
                    <Link href={`/projects/${leadProject.slug}`} className="button-link">
                      查看项目详情
                    </Link>
                    <a
                      href={leadProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="project-inline-link project-inline-link--external"
                    >
                      GitHub
                      <span aria-hidden="true"> →</span>
                    </a>
                  </div>
                </div>
              </article>

              {otherProjects.length ? (
                <div className="project-home-mini-grid" aria-label="补充项目预览">
                  {otherProjects.map((project) => {
                    const copy = projectCopy[project.slug] ?? {
                      elevator: project.summary,
                      highlight: project.highlights[0],
                    };

                    return (
                      <article key={project.slug} className="project-compact-card project-compact-card--minimal">
                        <div className="project-compact-card__head">
                          <span className="project-badge">Supporting Project</span>
                          <span className="project-meta-inline">补充方向</span>
                        </div>
                        <h3 className="project-card__title">{project.title}</h3>
                        <p className="project-card__summary">{copy.elevator}</p>
                        <p className="project-compact-card__reason">
                          <strong>核心亮点：</strong>
                          {copy.highlight}
                        </p>
                        <div className="tag-list tag-list--compact" aria-label={`${project.title} 技术栈预览`}>
                          {project.techStack.slice(0, 3).map((item) => (
                            <span key={item} className="tag-chip">
                              {item}
                            </span>
                          ))}
                        </div>
                        <div className="project-link-row project-link-row--compact">
                          <Link href={`/projects/${project.slug}`} className="project-inline-link">
                            查看详情
                            <span aria-hidden="true"> →</span>
                          </Link>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="project-inline-link project-inline-link--external"
                          >
                            GitHub
                            <span aria-hidden="true"> →</span>
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="page-stack">
          <div className="section-header">
            <div>
              <span className="section-kicker">Project Notes</span>
              <h2>技术支撑笔记（弱化展示）</h2>
              <p className="muted-text">首页仅展示与主打项目相关度更高的技术型内容，减少 workflow/prompt 类干扰。</p>
            </div>
            <Link href="/notes" className="section-header__link">
              查看全部 Notes
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          <div className="notes-grid" aria-label="首页技术笔记">
            {latestNotes.map((note) => (
              <article key={note.slug} className="note-card">
                <div className="note-meta">
                  <span>分类：{note.category}</span>
                  <span>更新：{formatNoteDate(note.updatedAt)}</span>
                </div>
                <h3 className="note-card__title">{note.title}</h3>
                <p className="note-card__summary">{note.summary}</p>
                <div className="tag-list" aria-label={`${note.title} 标签`}>
                  {note.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/notes/${note.slug}`} className="note-link">
                  阅读全文
                  <span aria-hidden="true"> →</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="info-grid info-grid--two" aria-label="辅助入口">
          {secondaryEntries.map((entry) => (
            <article key={entry.href} className="feature-card">
              <span className="section-kicker">Supporting Entry</span>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <Link href={entry.href} className="entry-link">
                进入 {entry.title}
                <span aria-hidden="true"> →</span>
              </Link>
            </article>
          ))}
        </section>

        <section className="page-stack">
          <div className="section-header">
            <div>
              <span className="section-kicker">External Links</span>
              <h2>补充入口</h2>
            </div>
          </div>

          <div className="info-grid info-grid--two" aria-label="外链区">
            {externalEntries.map((entry) => (
              <article key={entry.title} className="feature-card">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                {entry.external ? (
                  <a href={entry.href} target="_blank" rel="noreferrer" className="entry-link entry-link--subtle">
                    前往 {entry.title}
                    <span aria-hidden="true"> →</span>
                  </a>
                ) : (
                  <Link href={entry.href} className="entry-link entry-link--subtle">
                    前往 {entry.title}
                    <span aria-hidden="true"> →</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

