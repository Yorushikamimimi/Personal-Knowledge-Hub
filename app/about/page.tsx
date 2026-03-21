import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { heroKeywords, siteLinks, siteProfile } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: "了解当前求职方向、技术栈、工程关注点以及这个站点的内容定位。",
};

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="page-stack page-stack--about">
        <section className="page-hero page-hero--about glass-panel glass-panel--hero">
          <span className="section-kicker">About</span>
          <h1 className="page-title">关于我</h1>
          <p className="page-lead">
            当前定位是 {siteProfile.roleHeadline}。这个站点既承载 Projects 展示，也承载 Notes 的长期积累，目标是让访问者在短时间内看懂我做过什么、擅长什么、如何思考工程实现。
          </p>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <span className="section-kicker">Background</span>
          <h2>背景简介</h2>
          <p>
            我更关注能够稳定落地的工程实现，而不是只停留在技术名词层面。相比单点技巧，我更重视项目交付、系统边界、结构清晰和后续维护成本。这个站点就是把这些内容沉淀下来，既服务于求职展示，也服务于长期复盘。
          </p>
        </section>

        <section className="info-grid info-grid--two">
          <article className="placeholder-card glass-panel glass-panel--subtle">
            <span className="section-kicker">Focus</span>
            <h3>求职方向</h3>
            <p>以后端开发为主，兼顾具备工程约束的全栈实现。重点展示 Java / Spring Boot 为核心的工程能力，以及必要的前台页面承载能力。</p>
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