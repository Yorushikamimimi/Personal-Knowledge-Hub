import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { heroKeywords, siteLinks, siteProfile } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "了解站点的工程关注点、内容边界和长期维护方式。",
};

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="page-stack page-stack--about">
        <section className="page-hero page-hero--about glass-panel glass-panel--hero">
          <span className="section-kicker">About</span>
          <h1 className="page-title">关于我</h1>
          <p className="page-lead">
            {siteProfile.roleHeadline}。这个站点同时承载 Projects 与 Notes，帮助访问者理解项目如何设计、如何验证，以及哪些结论仍受明确边界约束。
          </p>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <span className="section-kicker">Background</span>
          <h2>背景简介</h2>
          <p>
            我是 2027 届重庆邮电大学计算机专业本科生，方向为 AI 应用开发与 Java 后端。2026 年 4 月至 7 月在邮莱特参与智能标书锚点解析的概念验证、消费侧联调、回归与交付收口。个人项目围绕本地 RAG、门诊业务一致性与 Pull 型任务调度展开。
          </p>
          <p>近期将长任务交接经验整理为 Codex Thread Handoff，将已有 Word 的局部修改与验证流程整理为 Word Enhanced / docdoc。两项工具均有公开仓库和安装说明，能力与验证边界见 <Link href="/skills">Skills</Link>。</p>
        </section>

        <section className="info-grid info-grid--two">
          <article className="placeholder-card glass-panel glass-panel--subtle">
            <span className="section-kicker">Focus</span>
            <h3>工程范围</h3>
            <p>以 Java / Spring Boot 为核心，结合必要的前端与 AI 应用能力，关注在真实约束下如何实现、验证和维护系统。</p>
          </article>
          <article className="placeholder-card glass-panel glass-panel--subtle">
            <span className="section-kicker">Stack</span>
            <h3>技术栈</h3>
            <div className="tag-list" aria-label="技术栈标签">
              {heroKeywords.map((keyword) => (
                <span key={keyword} className="tag-chip">
                  {keyword}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <span className="section-kicker">Engineering Focus</span>
          <h2>我关注的工程点</h2>
          <div className="info-grid info-grid--two">
            <div>
              <h3>工程实现</h3>
              <p>关注分层是否清晰、接口是否稳定、代码是否易维护，而不是只关注能不能跑通。</p>
            </div>
            <div>
              <h3>项目交付</h3>
              <p>重视项目在协作、联调、验收和上线阶段的真实可交付性，不把项目理解成单机 demo。</p>
            </div>
            <div>
              <h3>系统边界</h3>
              <p>倾向于明确职责范围、输入输出和约束条件，避免夸大个人贡献或模糊系统边界。</p>
            </div>
            <div>
              <h3>可解释性</h3>
              <p>希望无论是项目还是笔记，都能讲清楚为什么这样做、适用什么边界、带来什么结果。</p>
            </div>
          </div>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <span className="section-kicker">Navigation</span>
          <h2>这个站点怎么读</h2>
          <ul className="list-clean">
            <li>如果你想快速了解项目能力，先看 Projects。</li>
            <li>如果你想了解技术积累和表达方式，继续看 Notes。</li>
            <li>如果你想使用长任务交接或 Word 修改工具，查看 Skills 中的公开安装入口。</li>
            <li>Topics 和 Downloads 作为二级入口，用于补充内容结构和资料资产。</li>
          </ul>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <span className="section-kicker">Links</span>
          <h2>进一步查看</h2>
          <div className="project-link-row">
            <a href={siteLinks.github} target="_blank" rel="noreferrer" className="project-inline-link project-inline-link--external">
              GitHub →
            </a>
            <Link href={siteLinks.resume} className="project-inline-link">
              Resume →
            </Link>
            <Link href="/projects" className="project-inline-link project-inline-link--external">
              Projects →
            </Link>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
