import Link from "next/link";
import { PageContainer } from "../components/layout/PageContainer";
import { formatNoteDate, getAllPublishedNotes } from "../lib/notes";
import { getAllPublishedProjects, getFeaturedProjects, type ProjectListItem } from "../lib/projects";
import { publicSkills, siteLinks } from "../lib/site-config";

const toolEntries = [
  { slug: "docdoc", title: "修改已有 Word 的一小处", description: "先定位目标，在副本上修改，再检查其他内容是否受到影响。", name: "docdoc", label: "改文档" },
  { slug: "codex-thread-handoff", title: "让新 Agent 接着旧项目做", description: "从项目资料和必要增量恢复进度，确认接续正确后再正式交接。", name: "Thread Handoff", label: "接项目" },
  { slug: "ai-context-vault", title: "搭建 AI 上下文目录", description: "用 Markdown 模板整理当前进度、任务记忆和读取边界。", name: "Context Vault", label: "搭目录" },
];

// Short labels for the project deck in the hero; other projects fall back to their first two techs.
const deckLabels: Record<string, { icon: string; line: string }> = {
  slotflow: { icon: "MQ", line: "防超卖下单 · 异步履约 · AI 工具调用" },
  "nautilus-clinic": { icon: "TX", line: "条件更新 + 事务保障结算发药一致" },
  "ai-zhaobiao": { icon: "DOC", line: "邮莱特实习 · 标书锚点解析与联调" },
  "my-knowledge-base": { icon: "RAG", line: "本地知识库问答 · 回答附来源" },
  "nautilus-media-cloud": { icon: "Q", line: "SKIP LOCKED 的 Pull 型调度" },
};

const tints = ["var(--c2-blue)", "var(--c2-green)", "var(--c2-amber)"];

function deckLabel(project: ProjectListItem) {
  return deckLabels[project.slug] ?? {
    icon: project.title.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "P",
    line: project.techStack.slice(0, 2).join(" · "),
  };
}

function ProjectLinks({ project }: { project: ProjectListItem }) {
  return (
    <div className="c2-links">
      <Link href={`/projects/${project.slug}`}>查看详情 →</Link>
      {project.githubUrl ? (
        <a href={project.githubUrl} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const featuredProjects = getFeaturedProjects(3);
  const [leadProject, ...otherFeatured] = featuredProjects;
  const featuredSlugs = new Set(featuredProjects.map((project) => project.slug));
  const moreProjects = getAllPublishedProjects().filter((project) => !featuredSlugs.has(project.slug));
  const notes = getAllPublishedNotes();

  return (
    <PageContainer>
      <section className="c2-stage c2-hero">
        <div>
          <span className="c2-eyebrow">AI Engineering / Java Full-stack Portfolio</span>
          <h1>
            把 AI 应用
            <br />
            做成<span className="c2-mark">跑得通</span>的工程。
          </h1>
          <p>
            限量预约的订单事务与 AI 工具调用、门诊业务一致性，以及邮莱特实习中的智能标书解析；每个都写清做了什么、验证到哪一步。另有{" "}
            {publicSkills.length} 个公开的 AI 工作流 Skills。
          </p>
          <div className="c2-actions">
            <Link href="#projects" className="c2-btn c2-btn--primary">看主线项目</Link>
            <Link href="/notes" className="c2-btn">技术笔记</Link>
            <a href={siteLinks.github} target="_blank" rel="noreferrer" className="c2-btn">
              GitHub ↗
            </a>
          </div>
          <div className="c2-proof">
            <div><strong>{featuredProjects.length}</strong>主线项目</div>
            <div><strong>{publicSkills.length}</strong>开源 Skills</div>
            <div><strong>{notes.length}</strong>篇技术笔记</div>
          </div>
        </div>

        <ul className="c2-deck" aria-label="主线项目速览">
          {featuredProjects.map((project, index) => {
            const label = deckLabel(project);
            return (
              <li key={project.slug}>
                <a href={`#project-${project.slug}`}>
                  <span className="c2-icon" style={{ width: 42, height: 42, background: tints[index % tints.length] }}>
                    {label.icon}
                  </span>
                  <span>
                    <strong>{project.title.split("｜")[0]}</strong>
                    <small>{label.line}</small>
                  </span>
                  <span className="c2-deck__go" aria-hidden="true">↓</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="c2-section-head" id="projects">
        <h2>主线项目</h2>
        <Link href="/projects">全部 {featuredProjects.length + moreProjects.length} 个项目 →</Link>
      </div>

      {leadProject ? (
        <div className="c2-bento">
          <article className="c2-card c2-card--feature" id={`project-${leadProject.slug}`}>
            <div className="c2-role">
              <span>{leadProject.role} · 主打</span>
              <span className="c2-icon" style={{ background: "#fff" }}>{deckLabel(leadProject).icon}</span>
            </div>
            <h3>{leadProject.title}</h3>
            <p>{leadProject.summary}</p>
            {leadProject.highlights[0] ? <div className="c2-highlight">{leadProject.highlights[0]}</div> : null}
            {leadProject.highlights.length > 1 ? (
              <ul className="c2-checks">
                {leadProject.highlights.slice(1, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {leadProject.metrics.length ? (
              <>
                <div className="c2-stats">
                  {leadProject.metrics.slice(0, 3).map((metric) => (
                    <div key={metric.label} title={metric.note}>
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
                <span className="c2-footnote">每个数字的口径与边界见详情页，不是整体效果指标。</span>
              </>
            ) : null}
            <div className="c2-chips">
              {leadProject.techStack.slice(0, 5).map((item) => (
                <span key={item} className="c2-chip">{item}</span>
              ))}
            </div>
            <ProjectLinks project={leadProject} />
          </article>

          {otherFeatured.map((project, index) => (
            <article
              key={project.slug}
              className="c2-card c2-card--tinted"
              id={`project-${project.slug}`}
              style={{ background: tints[(index + 1) % tints.length] }}
            >
              <div className="c2-role">
                <span>{project.role}</span>
                <span className="c2-icon" style={{ background: "#fff" }}>{deckLabel(project).icon}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="c2-chips">
                {project.techStack.slice(0, 3).map((item) => (
                  <span key={item} className="c2-chip">{item}</span>
                ))}
              </div>
              <ProjectLinks project={project} />
            </article>
          ))}
        </div>
      ) : null}

      {moreProjects.length ? (
        <div className="c2-more">
          更多项目：
          {moreProjects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              {project.title.split("｜")[0]}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="c2-section-head">
        <h2>你想做什么？</h2>
        <Link href="/skills">全部 Skills →</Link>
      </div>
      <div className="c2-tools">
        {toolEntries.map((tool) => (
          <Link key={tool.slug} href={`/projects/${tool.slug}`} className="c2-card">
            <small>{tool.label}</small>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <span className="c2-go">{tool.name} →</span>
          </Link>
        ))}
      </div>

      <div className="c2-section-head">
        <h2>技术笔记</h2>
        <Link href="/notes">全部笔记 →</Link>
      </div>
      <ul className="c2-note-rows">
        {notes.slice(0, 3).map((note) => (
          <li key={note.slug}>
            <Link href={`/notes/${note.slug}`}>
              <time dateTime={note.updatedAt}>{formatNoteDate(note.updatedAt)}</time>
              <strong>{note.title}</strong>
              <span>{note.category}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
