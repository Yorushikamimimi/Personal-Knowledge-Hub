import type { Metadata } from "next";
import { PageContainer } from "../../components/layout/PageContainer";
import { publicSkills } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "开源 Skills",
  description: "Codex Thread Handoff 与 Word Enhanced：用途、实现能力、验证边界与公开安装入口。",
};

export default function SkillsPage() {
  return (
    <PageContainer>
      <div className="page-stack">
        <section className="page-hero glass-panel glass-panel--hero">
          <span className="section-kicker">Open-source Skills</span>
          <h1 className="page-title">交接与 Word 编辑工具</h1>
          <p className="page-lead">把真实工作中的重复判断整理成 Codex 可复用的流程：长任务如何可靠续接，已有文档如何只改目标位置。</p>
          <p>公开资料核对：2026 年 10 月 2 日。两项工具均按 MIT 开放，使用方式与依赖以各自仓库 README 为准。</p>
        </section>
        {publicSkills.map((skill) => (
          <section key={skill.slug} id={skill.slug} className="content-panel glass-panel glass-panel--section">
            <span className="section-kicker">{skill.license} · Codex Skill</span>
            <h2>{skill.title}</h2>
            <p>{skill.summary}</p>
            <h3>解决的问题与实际能力</h3>
            <ul className="list-clean">
              {skill.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
            </ul>
            <h3>验证与使用边界</h3>
            <p>{skill.boundary}</p>
            <h3>如何开始使用</h3>
            <p>{skill.installSummary}</p>
            <div className="project-link-row">
              <a href={skill.repository} target="_blank" rel="noreferrer" className="project-inline-link">公开源码与说明 ↗</a>
              <a href={skill.installUrl} target="_blank" rel="noreferrer" className="project-inline-link">安装步骤 ↗</a>
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
