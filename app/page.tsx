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


const projectCopy: Record<string, { elevator: string; highlight: string }> = {
  "ai-zhaobiao": {
    elevator: "面向政府采购招投标文件的智能解析系统，覆盖多格式文档解析、评审锚点抽取与证据定位。",
    highlight: "参与 LLM-first 信息抽取链路、OCR / PageIndex 证据定位、评测体系与真实客户交付收口。",
  },
  "my-knowledge-base": {
    elevator: "面向私域文档问答的 AI 知识库平台，覆盖上传、异步入库、向量检索、RAG 问答与来源展示。",
    highlight: "以 Spring Boot 承接业务后端、FastAPI 承接本地 RAG，并用 PostgreSQL / pgvector 完成检索链路。",
  },
  "nautilus-clinic": {
    elevator: "后端主导的门诊业务管理平台，覆盖患者、处方发药、药房库存与收费结算。",
    highlight: "用 PostgreSQL JSONB + GIN、原子写入、Redis 锁与事务回滚处理检索和一致性问题。",
  },
};

function getHomeNotes(): NoteListItem[] {
  return getAllPublishedNotes().slice(0, 3);
}

export default function HomePage() {
  const featuredProjects = getFeaturedProjects(3);
  const latestNotes = getHomeNotes();

  return (
    <PageContainer>
      <div className="page-stack">
        <section className="hero-panel hero-panel--portfolio hero-panel--portfolio-refined">
          <div className="page-stack page-stack--compact">
            <span className="hero-kicker">AI Engineering / Java Full-stack Portfolio</span>
            <h1 className="hero-title">AI 应用 / Java 全栈项目作品集</h1>
            <h2 className="page-title" style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)", marginTop: 0 }}>
              聚焦文档智能、RAG 工程化与业务一致性
            </h2>
            <p className="hero-description">
              这里优先展示当前简历中的 3 个代表项目：智能标书锚点解析系统、My Knowledge Base 与门诊患者-处方-库存管理平台。
              Notes 作为工程方法与长期积累的补充材料，不与项目主线竞争首页注意力。
            </p>
          </div>

          <div className="hero-actions hero-actions--portfolio">
            <Link href="/projects" className="button-link">
              查看主打 Projects
            </Link>
            <Link href="/notes" className="button-link button-link--secondary">
              查看全部 Notes
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

          {featuredProjects.length ? (
            <div className="project-home-grid" aria-label="首页项目预览">
              {featuredProjects.map((project) => {
                const copy = projectCopy[project.slug] ?? {
                  elevator: project.summary,
                  highlight: project.highlights[0],
                };

                return (
                  <article key={project.slug} className="project-compact-card project-compact-card--minimal project-compact-card--uniform">
                    <div className="project-compact-card__head">
                      <span className="project-badge">Featured Project</span>
                      <span className="project-meta-inline">{project.role}</span>
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
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="project-inline-link project-inline-link--external"
                        >
                          GitHub
                          <span aria-hidden="true"> →</span>
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="page-stack">
          <div className="section-header">
            <div>
              <span className="section-kicker">Recent Notes</span>
              <h2>项目技术笔记（补充阅读）</h2>
              <p className="muted-text">从三个代表项目中拆出架构取舍、验证口径与失败边界，避免重复项目页的功能介绍。</p>
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
