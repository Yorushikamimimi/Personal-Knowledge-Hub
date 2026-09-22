import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectGallery } from "../../../components/projects/ProjectGallery";
import { PageContainer } from "../../../components/layout/PageContainer";
import {
  getPublishedProjectBySlug,
  getPublishedProjectMetaBySlug,
  getPublishedProjectSlugs,
} from "../../../lib/projects";

export function generateStaticParams() {
  return getPublishedProjectSlugs().map((slug) => ({ slug }));
}

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function stripHash(url: string) {
  return url.replace(/#.*$/, "");
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublishedProjectMetaBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const hasDemo = Boolean(project.demoUrl);
  const hasGithub = Boolean(project.githubUrl);
  const hasDistinctReadme = Boolean(project.readmeUrl) && (!hasGithub || stripHash(project.readmeUrl) !== stripHash(project.githubUrl));
  const hasExternalLinks = hasGithub || hasDemo || hasDistinctReadme;
  const hasScreenshots = project.screenshots.length > 0;
  const topHighlights = project.highlights.slice(0, 3);
  const techStackPreview = project.techStack.slice(0, 5);
  const extraTechCount = Math.max(project.techStack.length - techStackPreview.length, 0);

  return (
    <PageContainer>
      <div className="page-stack page-stack--project-detail">
        <div>
          <Link href="/projects" className="back-link">
            <span aria-hidden="true">←</span>
            返回项目列表
          </Link>
        </div>

        <section className="project-overview-shell project-overview-shell--refined">
          <article className="detail-panel project-overview-main glass-panel glass-panel--hero">
            <span className="section-kicker">Project Overview</span>
            <h1 className="page-title project-page-title">{project.title}</h1>
            <p className="page-lead project-overview-main__lead">{project.summary}</p>

            {hasExternalLinks ? (
              <div className="project-link-row project-link-row--top">
                {hasGithub ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
                    GitHub →
                  </a>
                ) : null}
                {hasDemo ? (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
                    Demo →
                  </a>
                ) : null}
                {hasDistinctReadme ? (
                  <a href={project.readmeUrl} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
                    README →
                  </a>
                ) : null}
              </div>
            ) : null}

            <div className="project-highlight-grid">
              {topHighlights.map((item, index) => (
                <article key={item} className="project-highlight-card glass-chip-panel">
                  <span className="project-highlight-card__index">0{index + 1}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </article>

          <aside className="detail-panel project-overview-side project-overview-side--compact glass-panel glass-panel--aside">
            <span className="section-kicker">Quick Facts</span>
            <h2>项目概览</h2>
            <p className="project-overview-side__intro">快速了解项目角色、核心实现与技术边界，再进入完整说明。</p>

            <div className="project-fact-list project-fact-list--compact">
              <div className="project-fact-item project-fact-item--compact">
                <span>角色</span>
                <strong>{project.role}</strong>
              </div>
              <div className="project-fact-item project-fact-item--compact">
                <span>关键实现</span>
                <p>{project.highlights[0]}</p>
              </div>
              <div className="project-fact-item project-fact-item--compact">
                <span>核心技术</span>
                <div className="tag-list tag-list--compact" aria-label={`${project.title} 技术栈预览`}>
                  {techStackPreview.map((item) => (
                    <span key={item} className="tag-chip">
                      {item}
                    </span>
                  ))}
                  {extraTechCount > 0 ? <span className="tag-chip tag-chip--muted">+{extraTechCount}</span> : null}
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="content-panel project-metric-shell glass-panel glass-panel--section">
          <div className="section-header">
            <div>
              <span className="section-kicker">Verified Outcomes</span>
              <h2>可验证结果</h2>
              <p>这里不写虚高的性能数字，只保留公开项目材料和页面中可以核验且边界清楚的结果。</p>
            </div>
          </div>

          <div className="project-metric-grid" aria-label={`${project.title} 可验证结果`}>
            {project.metrics.map((metric) => (
              <article key={`${metric.value}-${metric.label}`} className="project-metric-card glass-chip-panel">
                <span className="project-metric-card__value">{metric.value}</span>
                <h3 className="project-metric-card__label">{metric.label}</h3>
                <p className="project-metric-card__note">{metric.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="project-detail-grid project-detail-grid--weighted">
          <article className="detail-panel project-section project-section--primary glass-panel glass-panel--section">
            <span className="section-kicker">Context</span>
            <h2>项目背景 / 目标</h2>
            <ul className="list-clean">
              {project.goals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="detail-panel project-section glass-panel glass-panel--section">
            <span className="section-kicker">Ownership</span>
            <h2>我的职责</h2>
            <ul className="list-clean">
              {project.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        {hasScreenshots ? (
          <section className="content-panel content-panel--visual glass-panel glass-panel--section">
            <div className="section-header">
              <div>
                <span className="section-kicker">Evidence</span>
                <h2>关键页面与交付证据</h2>
                <p>{project.screenshotNote}</p>
              </div>
            </div>

            <ProjectGallery title={project.title} screenshots={project.screenshots} />
          </section>
        ) : null}

        <section className="project-detail-grid project-detail-grid--tail">
          <article className="detail-panel project-section project-section--notes glass-panel glass-panel--section">
            <span className="section-kicker">Engineering Notes</span>
            <h2>工程实现与后续方向</h2>
            <p className="project-section__intro">
              这部分不重复上面的总览结论，只保留值得继续讨论的工程判断、技术取舍和后续迭代方向。
            </p>
            <div className="project-detail-prose">{project.content}</div>
          </article>

          <article className="detail-panel project-section project-section--boundary glass-panel glass-panel--subtle">
            <span className="section-kicker">Boundary</span>
            <h2>项目边界说明</h2>
            <ul className="list-clean">
              {project.boundaries.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </PageContainer>
  );
}
