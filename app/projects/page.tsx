import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { getAllPublishedProjects } from "../../lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "集中展示主打项目、技术栈、职责边界和工程亮点。",
};

export default function ProjectsPage() {
  const projects = getAllPublishedProjects();
  const [leadProject, ...otherProjects] = projects;

  return (
    <PageContainer>
      <div className="page-stack page-stack--projects">
        <section className="page-hero page-hero--projects glass-panel glass-panel--hero">
          <span className="section-kicker">Projects</span>
          <h1 className="page-title">主打项目</h1>
          <p className="page-lead">
            这里优先回答两个问题：我做过什么，以及我更适合解决哪类问题。列表页只负责建立判断，细节收进详情页，避免把 README 摊平成导航页。
          </p>
        </section>

        {leadProject ? (
          <section className="project-list-shell" aria-label="主打项目总览">
            <article className="project-lead-card glass-panel glass-panel--project-lead">
              <div className="project-lead-card__eyebrow">
                <span className="project-badge project-badge--primary">Primary Project</span>
                <span className="project-meta-inline">优先查看</span>
              </div>

              <div className="project-lead-card__grid">
                <div className="project-lead-card__main">
                  <div className="note-meta">
                    <span>{leadProject.role}</span>
                    <span>{leadProject.techStack.length} 项核心技术</span>
                  </div>

                  <h2 className="project-card__title project-card__title--lead">{leadProject.title}</h2>
                  <p className="project-card__summary project-card__summary--lead">{leadProject.summary}</p>
                  <p className="project-lead-card__subtitle">
                    <strong>推荐先看理由：</strong>
                    {leadProject.highlights[0]}
                  </p>

                  <div className="tag-list" aria-label={`${leadProject.title} 技术栈`}>
                    {leadProject.techStack.slice(0, 6).map((item) => (
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
                      GitHub →
                    </a>
                  </div>
                </div>

                <div className="project-lead-card__side glass-panel glass-panel--subtle">
                  <h3>先看这三个判断点</h3>
                  <div className="project-highlight-grid project-highlight-grid--list">
                    {leadProject.highlights.slice(0, 3).map((item, index) => (
                      <article key={item} className="project-highlight-card project-highlight-card--compact glass-chip-panel">
                        <span className="project-highlight-card__index">0{index + 1}</span>
                        <p>{item}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <aside className="detail-panel project-list-aside glass-panel glass-panel--aside">
              <span className="section-kicker">Browse</span>
              <h2>浏览建议</h2>
              <ul className="list-clean">
                <li>先看代表作，再决定是否继续深挖其余方向。</li>
                <li>详情页优先给出角色、技术栈、核心亮点和外链，不让你先翻长文案。</li>
                <li>Notes 保留为知识沉淀入口，项目页只聚焦求职展示。</li>
              </ul>
            </aside>
          </section>
        ) : null}

        {otherProjects.length ? (
          <section className="project-mini-grid" aria-label="补充项目列表">
            {otherProjects.map((project) => (
              <article key={project.slug} className="project-compact-card project-compact-card--minimal glass-panel glass-panel--project-card">
                <div className="project-compact-card__head">
                  <span className="project-badge">Supporting Project</span>
                  <span className="project-meta-inline">补充方向</span>
                </div>

                <h2 className="project-card__title">{project.title}</h2>
                <p className="project-compact-card__reason">{project.highlights[0]}</p>

                <div className="project-compact-card__footer">
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
                      GitHub →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </PageContainer>
  );
}