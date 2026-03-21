import Link from "next/link";
import { PageContainer } from "../components/layout/PageContainer";
import { formatNoteDate, getAllPublishedNotes } from "../lib/notes";
import { getAllPublishedTopics } from "../lib/topics";
import { getAllPublishedDownloads } from "../lib/downloads";
import { getFeaturedProjects } from "../lib/projects";
import { heroKeywords, siteLinks, siteProfile } from "../lib/site-config";

const secondaryEntries = [
  {
    title: "Topics",
    description: "按主题组织笔记和下载资源，帮助访问者快速理解知识地图和内容归属。",
    href: "/topics",
  },
  {
    title: "Downloads",
    description: "保留资料包、清单和模板等资源入口，适合作为项目和笔记的补充材料。",
    href: "/downloads",
  },
];

const externalEntries = [
  {
    title: "GitHub",
    description: "查看代码仓库、提交历史和更多公开项目。",
    href: siteLinks.github,
    external: true,
  },
  {
    title: "Resume",
    description: "当前先保留静态入口，后续会替换为正式简历链接或 PDF 下载。",
    href: siteLinks.resume,
    external: false,
  },
  {
    title: "About",
    description: "集中说明方向定位、技术栈和工程关注点。",
    href: "/about",
    external: false,
  },
] as const;

export default function HomePage() {
  const featuredProjects = getFeaturedProjects(3);
  const [leadProject, ...otherProjects] = featuredProjects;
  const latestNotes = getAllPublishedNotes().slice(0, 3);
  const topics = getAllPublishedTopics();
  const downloads = getAllPublishedDownloads();

  return (
    <PageContainer>
      <div className="page-stack">
        <section className="hero-panel hero-panel--portfolio hero-panel--portfolio-refined">
          <div className="page-stack page-stack--compact">
            <span className="hero-kicker">Portfolio + Notes</span>
            <h1 className="hero-title">后端 / 全栈方向的项目作品与知识总结</h1>
            <p className="hero-description">
              {siteProfile.intro} 当前重点展示主打项目、技术方向、工程关注点，以及可持续更新的知识总结内容。
            </p>
          </div>

          <div className="tag-list" aria-label="技术关键词">
            {heroKeywords.map((keyword) => (
              <span key={keyword} className="tag-chip">
                {keyword}
              </span>
            ))}
          </div>

          <div className="hero-actions hero-actions--portfolio">
            <Link href="/projects" className="button-link">
              查看 Projects
            </Link>
            <Link href="/notes" className="button-link button-link--secondary">
              查看 Notes
            </Link>
          </div>

          <div className="hero-link-row" aria-label="辅助入口">
            <a href={siteLinks.github} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
              GitHub ↗
            </a>
            <Link href={siteLinks.resume} className="project-inline-link project-inline-link--external">
              Resume →
            </Link>
            <Link href="/about" className="project-inline-link project-inline-link--external">
              About →
            </Link>
          </div>

          <div className="hero-metrics" aria-label="站点摘要">
            <div className="hero-metric">
              <strong>{featuredProjects.length}</strong>
              <span>精选 Projects</span>
            </div>
            <div className="hero-metric">
              <strong>{latestNotes.length}</strong>
              <span>Latest Notes</span>
            </div>
            <div className="hero-metric">
              <strong>{topics.length}</strong>
              <span>Topics</span>
            </div>
            <div className="hero-metric">
              <strong>{downloads.length}</strong>
              <span>Downloads</span>
            </div>
          </div>
        </section>

        <section className="page-stack project-home-section">
          <div className="project-home-section__intro">
            <span className="section-kicker">Project Focus</span>
            <p className="muted-text">从首页先建立代表作印象，再进入项目页看完整证据链。</p>
          </div>

          <div className="section-header">
            <div>
              <span className="section-kicker">Featured Projects</span>
              <h2>先看代表作，再决定是否继续深挖</h2>
              <p className="muted-text">首页只建立项目印象，不把详情页内容再压成卡片墙。</p>
            </div>
            <Link href="/projects" className="section-header__link">
              查看全部 Projects
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {leadProject ? (
            <div className="project-home-shell">
              <article className="project-lead-card project-lead-card--home">
                <div className="project-lead-card__eyebrow">
                  <span className="project-badge project-badge--primary">Primary Project</span>
                  <span className="project-meta-inline">代表作</span>
                </div>

                <div className="project-lead-card__main">
                  <div className="note-meta">
                    <span>{leadProject.role}</span>
                    <span>{leadProject.techStack.length} 项核心技术</span>
                  </div>
                  <h3 className="project-card__title project-card__title--lead">{leadProject.title}</h3>
                  <p className="project-card__summary project-card__summary--lead">{leadProject.summary}</p>
                  <p className="project-home-lead__reason">
                    <strong>为什么先看：</strong>
                    {leadProject.highlights[0]}
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
                    <a href={leadProject.githubUrl} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
                      GitHub ↗
                    </a>
                  </div>
                </div>
              </article>

              {otherProjects.length ? (
                <div className="project-home-mini-grid" aria-label="补充项目预览">
                  {otherProjects.map((project) => (
                    <article key={project.slug} className="project-compact-card project-compact-card--minimal">
                      <div className="project-compact-card__head">
                        <span className="project-badge">Supporting Project</span>
                        <span className="project-meta-inline">补充方向</span>
                      </div>
                      <h3 className="project-card__title">{project.title}</h3>
                      <p className="project-compact-card__reason">{project.highlights[0]}</p>
                      <div className="tag-list tag-list--compact" aria-label={`${project.title} 技术栈预览`}>
                        {project.techStack.slice(0, 3).map((item) => (
                          <span key={item} className="tag-chip">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="project-link-row project-link-row--compact">
                        <Link href={`/projects/${project.slug}`} className="project-inline-link">
                          查看详情 →
                        </Link>
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
                          GitHub ↗
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="page-stack">
          <div className="section-header">
            <div>
              <span className="section-kicker">Latest Notes</span>
              <h2>保留知识站属性，持续沉淀长期内容</h2>
            </div>
            <Link href="/notes" className="section-header__link">
              查看全部 Notes
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="notes-grid" aria-label="首页最新笔记">
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
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="info-grid info-grid--two" aria-label="二级内容入口">
          {secondaryEntries.map((entry) => (
            <article key={entry.href} className="feature-card">
              <span className="section-kicker">Secondary Entry</span>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <Link href={entry.href} className="entry-link">
                进入 {entry.title}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>

        <section className="page-stack">
          <div className="section-header">
            <div>
              <span className="section-kicker">External Links</span>
              <h2>外链与补充入口</h2>
            </div>
          </div>

          <div className="info-grid info-grid--three" aria-label="外链区">
            {externalEntries.map((entry) => (
              <article key={entry.title} className="feature-card">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                {entry.external ? (
                  <a href={entry.href} target="_blank" rel="noreferrer" className="entry-link entry-link--subtle">
                    前往 {entry.title}
                    <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <Link href={entry.href} className="entry-link entry-link--subtle">
                    前往 {entry.title}
                    <span aria-hidden="true">→</span>
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