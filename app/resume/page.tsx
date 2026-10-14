import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { getAllPublishedProjects } from "../../lib/projects";
import { heroKeywords, siteLinks, siteProfile } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "Resume",
  description: "网页简历摘要页，用于快速了解方向定位、技术栈、代表项目和外链入口。",
};

const focusAreas = [
  "AI 应用开发与文档智能",
  "Java 后端业务开发与全栈联调",
  "RAG / 知识库问答链路工程化",
  "Docker、Nginx 与 Linux 部署排障",
];

const deliveryStyle = [
  "先把系统链路跑通，再持续补测试、文档和边界说明。",
  "重视可维护性、模块职责和对外表达，不把项目写成功能堆砌的 README。",
  "可以借助 AI 辅助，但最终目标是把方案、取舍和实现逻辑讲清楚。",
];

const resumeVariants = [
  {
    label: "AI 应用版",
    role: "AI 应用开发 / LLM 应用研发",
    description: "适用于 AI、LLM、RAG 与 Agent 相关岗位。",
    href: "/files/resume/羊鸣天_重邮_AI应用.pdf?v=20260915-bddbe73e5918",
    fileName: "羊鸣天_重邮_AI应用.pdf",
  },
  {
    label: "Java 后端版",
    role: "Java 后端开发 / 应用研发",
    description: "适用于 Java 后端、应用研发、金融科技与传统软件岗位。",
    href: "/files/resume/羊鸣天_重邮_Java后端.pdf?v=20260915-2e1592f01ebb",
    fileName: "羊鸣天_重邮_Java后端.pdf",
  },
] as const;

export default function ResumePage() {
  const projectSlugs = ["my-knowledge-base", "nautilus-clinic", "nautilus-media-cloud"];
  const projects = projectSlugs.flatMap((slug) => getAllPublishedProjects().filter((project) => project.slug === slug));

  return (
    <PageContainer>
      <div className="page-stack page-stack--resume">
        <section className="page-hero page-hero--resume glass-panel glass-panel--hero">
          <span className="section-kicker">Resume</span>
          <h1 className="page-title">网页简历摘要</h1>
          <p className="page-lead">
            当前方向为 AI 应用开发 / Java 后端。两份正式 PDF 均为 2026 年 9 月 15 日终稿，项目经历包括本地 RAG 知识库、门诊业务平台与 Pull 型任务调度原型；智能标书经历归入实习。
          </p>
          <p className="resume-note">附件保留终稿原文。项目页按 2026 年 10 月 2 日公开仓库核对当前进度，后续实现调整以对应项目说明为准。</p>
          <div className="info-grid info-grid--two" aria-label="正式 PDF 简历版本">
            {resumeVariants.map((variant) => (
              <article key={variant.href} className="placeholder-card glass-panel glass-panel--subtle">
                <span className="section-kicker">PDF Resume</span>
                <h2>{variant.label}</h2>
                <p>{variant.role}</p>
                <p>{variant.description}</p>
                <div className="project-link-row">
                  <a href={variant.href} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
                    打开 {variant.label} PDF
                  </a>
                  <a href={variant.href} download={variant.fileName} className="project-inline-link">
                    下载 {variant.label} PDF
                  </a>
                </div>
              </article>
            ))}
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
              <p>与正式简历对应的三个项目：本地 RAG、门诊业务一致性与数据库任务认领。</p>
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
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
                      GitHub →
                    </a>
                  ) : null}
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
          <p className="resume-note">正式 PDF 简历提供 AI 应用版与 Java 后端版，请按目标岗位选择对应版本。</p>
        </section>
      </div>
    </PageContainer>
  );
}
