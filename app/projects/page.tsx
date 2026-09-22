import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { getAllPublishedProjects } from "../../lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "集中展示工程项目的技术栈、职责边界、验证结果与长期维护线索。",
};

export default function ProjectsPage() {
  const projectGridItems = getAllPublishedProjects();

  return (
    <PageContainer>
      <div className="page-stack page-stack--projects">
        <section className="page-hero page-hero--projects glass-panel glass-panel--hero">
          <span className="section-kicker">Projects</span>
          <h1 className="page-title">项目作品集</h1>
          <p className="page-lead">
            从文档智能、RAG 工程化到 Java 业务系统，这里保留技术取舍、职责范围和可核对的结果；补充项目用于展示不同工程约束下的实现方式。
          </p>
        </section>

        <section className="project-mini-grid project-mini-grid--uniform" aria-label="项目列表">
          {projectGridItems.map((project) => (
            <article
              key={project.slug}
              className="project-compact-card project-compact-card--minimal project-compact-card--uniform glass-panel glass-panel--project-card"
            >
              <div className="project-compact-card__head">
                <span className="project-badge">{project.featured ? "Featured Project" : "Supporting Project"}</span>
                <span className="project-meta-inline">{project.role}</span>
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
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
                      GitHub →
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </PageContainer>
  );
}
