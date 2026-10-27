import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionToc } from "../../../components/c2/SectionToc";
import { ProjectGallery } from "../../../components/projects/ProjectGallery";
import { PageContainer } from "../../../components/layout/PageContainer";
import {
  getAllPublishedProjects,
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
  const hasScreenshots = project.screenshots.length > 0;
  const topHighlights = project.highlights.slice(0, 3);

  const allProjects = getAllPublishedProjects();
  const index = allProjects.findIndex((item) => item.slug === project.slug);
  const previous = index > 0 ? allProjects[index - 1] : null;
  const next = index >= 0 && index < allProjects.length - 1 ? allProjects[index + 1] : null;

  const sections = [
    project.metrics.length ? { id: "results", label: "可验证结果" } : null,
    project.goals.length ? { id: "context", label: "背景与目标" } : null,
    project.responsibilities.length ? { id: "ownership", label: "我的职责" } : null,
    hasScreenshots ? { id: "evidence", label: "页面与证据" } : null,
    { id: "engineering", label: "工程实现与后续" },
    project.boundaries.length ? { id: "boundary", label: "项目边界" } : null,
  ].filter((item): item is { id: string; label: string } => item !== null);

  return (
    <PageContainer>
      <Link href="/projects" className="c2-back">
        ← 全部项目
      </Link>

      <section className="c2-stage c2-stage--project">
        <span className="c2-eyebrow">Project</span>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <div className="c2-project-meta">
          <span className="c2-chip c2-chip--solid">{project.role}</span>
          {project.techStack.map((item) => (
            <span key={item} className="c2-chip">{item}</span>
          ))}
          <div className="c2-actions">
            {hasGithub ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="c2-btn c2-btn--primary">
                GitHub ↗
              </a>
            ) : null}
            {hasDemo ? (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="c2-btn">
                Demo ↗
              </a>
            ) : null}
            {hasDistinctReadme ? (
              <a href={project.readmeUrl} target="_blank" rel="noreferrer" className="c2-btn">
                README ↗
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {topHighlights.length ? (
        <div className="c2-three">
          {topHighlights.map((item, highlightIndex) => (
            <div key={item} className="c2-card">
              <span>0{highlightIndex + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="c2-body">
        <SectionToc items={sections} />

        <article className="c2-article">
          {project.metrics.length ? (
            <section id="results">
              <h2><small>Results</small>可验证结果</h2>
              <p>这里不写虚高的性能数字，只保留公开项目材料和页面中可以核验且边界清楚的结果。</p>
              <div className="c2-metrics">
                {project.metrics.map((metric) => (
                  <div key={`${metric.value}-${metric.label}`} className="c2-card">
                    <strong>{metric.value}</strong>
                    <h3>{metric.label}</h3>
                    <p>{metric.note}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {project.goals.length ? (
            <section id="context">
              <h2><small>Context</small>背景与目标</h2>
              <ul>
                {project.goals.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {project.responsibilities.length ? (
            <section id="ownership">
              <h2><small>Ownership</small>我的职责</h2>
              <ul>
                {project.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {hasScreenshots ? (
            <section id="evidence">
              <h2><small>Evidence</small>关键页面与交付证据</h2>
              <p>{project.screenshotNote}</p>
              <ProjectGallery title={project.title} screenshots={project.screenshots} />
            </section>
          ) : null}

          <section id="engineering">
            <h2><small>Engineering Notes</small>工程实现与后续方向</h2>
            <div className="project-detail-prose c2-prose">{project.content}</div>
          </section>

          {project.boundaries.length ? (
            <section id="boundary" className="c2-boundary">
              <h2>项目边界说明</h2>
              <ul>
                {project.boundaries.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {previous || next ? (
            <nav className="c2-pager" aria-label="相邻项目">
              {previous ? (
                <Link href={`/projects/${previous.slug}`} className="c2-card">
                  <small>← 上一个</small>
                  <strong>{previous.title}</strong>
                </Link>
              ) : null}
              {next ? (
                <Link href={`/projects/${next.slug}`} className="c2-card c2-card--next">
                  <small>下一个 →</small>
                  <strong>{next.title}</strong>
                </Link>
              ) : null}
            </nav>
          ) : null}
        </article>
      </div>
    </PageContainer>
  );
}
