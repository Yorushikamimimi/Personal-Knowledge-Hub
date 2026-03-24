import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { getFeaturedProjects } from "../../lib/projects";
import { heroKeywords, siteLinks, siteProfile } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "Resume",
  description: "网页简历摘要页，用于快速了解方向定位、技术栈、代表项目和外链入口。",
};

const focusAreas = [
  "后端系统设计与实现",
  "全栈项目收口与交付",
  "工程结构、边界和可解释性",
  "基于真实项目的长期复盘与沉淀",
];

const deliveryStyle = [
  "先把系统链路跑通，再持续补测试、文档和边界说明。",
  "重视可维护性、模块职责和对外表达，不把项目写成功能堆砌的 README。",
  "可以借助 AI 辅助，但最终目标是把方案、取舍和实现逻辑讲清楚。",
];

export default function ResumePage() {
  const projects = getFeaturedProjects(3);
  const resumePdfUrl = "/files/resume/yang-mingtian-resume.pdf";

  return (
    <PageContainer>
      <div className="page-stack page-stack--resume">
        <section className="page-hero page-hero--resume glass-panel glass-panel--hero">
          <span className="section-kicker">Resume</span>
          <h1 className="page-title">网页简历摘要</h1>
          <p className="page-lead">
            这页用于快速说明我的方向定位、技术栈、代表项目和工程关注点。PDF 简历已经挂载，可直接打开或下载。
          </p>
          <div className="project-link-row">
            <a href={resumePdfUrl} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
              打开 PDF 简历
            </a>
            <a href={resumePdfUrl} download className="project-inline-link">
              下载 PDF 简历
            </a>
          </div>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <span className="section-kicker">Profile</span>
          <h2>方向定位</h2>
          <p>{siteProfile.roleHeadline}</p>
          <p>{siteProfile.intro}</p>
        </section>

        <section className="info-grid info-grid--two">
          <article className="placeholder-card glass-panel glass-panel--subtle">
            <span className="section-kicker">Focus</span>
            <h3>当前求职方向</h3>
            <ul className="list-clean">
              {focusAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="placeholder-card glass-panel glass-panel--subtle">
            <span className="section-kicker">Stack</span>
            <h3>技术关键词</h3>
            <div className="tag-list" aria-label="技术关键词">
              {heroKeywords.map((keyword) => (
                <span key={keyword} className="tag-chip">
                  {keyword}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <div className="section-header">
            <div>
              <span className="section-kicker">Selected Projects</span>
              <h2>代表项目</h2>
              <p>下面这 3 个项目基本覆盖了我当前最想展示的技术方向和工程实践。</p>
            </div>
            <Link href="/projects" className="section-header__link">
              查看完整 Projects
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="project-grid resume-project-grid" aria-label="代表项目列表">
            {projects.map((project) => (
              <article key={project.slug} className="project-compact-card project-compact-card--minimal glass-panel glass-panel--project-card">
                <div className="project-compact-card__head">
                  <span className="project-badge">Representative</span>
                  <span className="project-meta-inline">{project.role}</span>
                </div>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-compact-card__reason">{project.highlights[0]}</p>
                <div className="tag-list tag-list--compact" aria-label={`${project.title} 技术栈预览`}>
                  {project.techStack.slice(0, 4).map((item) => (
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
              </article>
            ))}
          </div>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <span className="section-kicker">Work Style</span>
          <h2>工程风格</h2>
          <ul className="list-clean">
            {deliveryStyle.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <span className="section-kicker">Links</span>
          <h2>进一步查看</h2>
          <div className="project-link-row">
            <a href={siteLinks.github} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
              GitHub →
            </a>
            <Link href="/projects" className="project-inline-link">
              Projects →
            </Link>
            <Link href="/about" className="project-inline-link project-inline-link--external">
              About →
            </Link>
          </div>
          <p className="resume-note">PDF 简历路径：<span className="inline-code">{resumePdfUrl}</span></p>
        </section>
      </div>
    </PageContainer>
  );
}
