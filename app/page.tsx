import Image from "next/image";
import { FileDemo } from "../components/home/FileDemo";
import { HomeEffects } from "../components/home/HomeEffects";
import { VaultDemo } from "../components/home/VaultDemo";
import { siteLinks } from "../lib/site-config";

const gh = (repo: string) => `${siteLinks.github}/${repo}`;

const vaultTree: { name: string; note?: string }[] = [
  { name: "AI_CONTEXT.md", note: "← 每次从这开始" },
  { name: "00-Profile/" },
  { name: "10-Knowledge/" },
  { name: "20-Projects/", note: "← 只读用到的" },
  { name: "30-Career/" },
  { name: "50-Workflow/" },
];

const driftLines = [
  "AI_CONTEXT.md · SYSTEM_STATUS.md · 00-Profile/identity.md · 20-Projects/index.md · 50-Workflow/SYNC_RULES.md · 50-Workflow/daily-log.md ·",
  "10-Knowledge/backend · 30-Career/README.md · 50-Workflow/task-memory · 90-Inbox · AGENTS.md · CLAUDE.md ·",
  "50-Workflow/decision.md · 00-Profile/goals.md · 20-Projects/index.md · AI_CONTEXT.md · 50-Workflow/AI_USAGE.md ·",
  "SYSTEM_STATUS.md · 10-Knowledge/index.md · 50-Workflow/conversation-handoff.md · 30-Career/40-Growth ·",
  "AI_CONTEXT.md · 20-Projects/index.md · 00-Profile/working-style.md · 50-Workflow/logs ·",
  "50-Workflow/SYNC_RULES.md · 90-Inbox · 10-Knowledge/frontend · AGENTS.md ·",
];

const tools = [
  {
    name: "README 写作",
    repo: "readme-and-project-positioning",
    text: "让 AI 助手写出第一次来的人就看得懂的 README：用途、具体用法、从哪开始、真实限制。",
    date: "10-24",
    tone: "hm-tcard--readme",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M15 3v4h4M9 12h7M9 16h5" />
      </svg>
    ),
  },
  {
    name: "开源前检查",
    repo: "public-release-readiness",
    text: "仓库公开前，分开检查文件、Git 历史、截图和发布包里有没有隐私或密钥。",
    date: "10-24",
    tone: "hm-tcard--release",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </svg>
    ),
  },
];

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="hm-steps">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  );
}

function Meta({ items }: { items: string[] }) {
  return (
    <div className="hm-meta">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="hm">
      <HomeEffects />

      <div className="hm-wrap">
        <section className="hm-hero">
          <div>
            <h1>
              自己用的东西，
              <br />
              <em>做完就放这儿。</em>
            </h1>
            <p>三个主作品，加两个给 AI 编程助手用的小工具。都开源，下面每个都写了怎么用、能不能下载。</p>
            <div className="hm-chips">
              <a className="hm-chip hm-chip--vault" href="#vault">
                <i />
                AI Context Vault<small>11-05</small>
              </a>
              <a className="hm-chip hm-chip--doc" href="#doc">
                <i />
                文件整理助手<small>11-05</small>
              </a>
              <a className="hm-chip hm-chip--yoru" href="#yoru">
                <i />
                夜鹿视觉工房<small>11-03</small>
              </a>
            </div>
          </div>
          <div className="hm-fan" aria-label="三个作品">
            <a className="hm-fan__card hm-fan__card--vault" href="#vault">
              <span className="hm-fan__tree" aria-hidden="true">
                {vaultTree.map((line) => (
                  <span key={line.name} className={line.note ? "is-key" : undefined}>
                    {line.name}
                    {line.note ? <u>{line.note}</u> : null}
                  </span>
                ))}
              </span>
              <span className="hm-fan__lb">AI Context Vault</span>
            </a>
            <a className="hm-fan__card hm-fan__card--doc" href="#doc">
              <Image className="hm-fan__icon" src="/images/home/doc-icon.png" alt="" width={400} height={400} priority />
              <span className="hm-fan__lb">文件整理助手</span>
            </a>
            <a className="hm-fan__card hm-fan__card--yoru" href="#yoru">
              <Image src="/images/home/yoru-workbench.jpg" alt="" fill sizes="(max-width: 860px) 60vw, 360px" priority />
              <span className="hm-fan__lb">夜鹿视觉工房</span>
            </a>
          </div>
        </section>
      </div>

      <section className="hm-stage hm-stage--vault" id="vault">
        <div className="hm-panel">
          <div className="hm-drift" aria-hidden="true">
            {driftLines.map((line) => (
              <div key={line}>
                {line} {line}
              </div>
            ))}
          </div>
          <div className="hm-wrap hm-stage__inner">
            <div className="hm-txt">
              <span className="hm-kick">
                <i />
                Markdown 模板
              </span>
              <h2>AI Context Vault</h2>
              <p className="hm-what">
                一套档案模板。Claude Code、Codex 这些 AI 助手开新对话时，都从同一个入口文件开始，只读这次要用的那几份，不用你重新交代背景。
              </p>
              <Steps items={["把 vault/ 复制成你自己的私人文件夹", "只填你确实知道的内容", "在里面打开 AI 助手，让它先读 AI_CONTEXT.md"]} />
              <Meta items={["适用 Obsidian", "公开模板，不含真人资料"]} />
              <div className="hm-btns">
                <a className="hm-btn hm-btn--pri" href={gh("ai-context-vault")} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
                <a className="hm-btn" href={gh("ai-context-vault/tree/main/examples/first-recovery")} target="_blank" rel="noreferrer">
                  5 分钟试试看
                </a>
              </div>
            </div>
            <div className="hm-reveal">
              <VaultDemo />
            </div>
          </div>
        </div>
      </section>

      <section className="hm-stage hm-stage--doc" id="doc">
        <div className="hm-panel">
          <div className="hm-wrap hm-stage__inner">
            <div className="hm-txt">
              <Image className="hm-doc-ico" src="/images/home/doc-icon.png" alt="" width={56} height={56} />
              <span className="hm-kick">
                <i />
                macOS App
              </span>
              <h2>文件整理助手</h2>
              <p className="hm-what">下载文件夹乱了的时候用。先给你看每个文件会去哪、为什么，你点确认才真的移动；整理错了能一键撤销。</p>
              <Steps items={["选一个文件夹", "看预览：每个文件的去处和依据", "确认移动，不满意就撤销"]} />
              <Meta items={["Apple Silicon", "v0.2.0 预览版", "未经苹果公证"]} />
              <div className="hm-btns">
                <a className="hm-btn hm-btn--pri" href={gh("doc-selecter/releases/tag/v0.2.0")} target="_blank" rel="noreferrer">
                  下载 DMG
                </a>
                <a className="hm-btn" href={gh("doc-selecter")} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </div>
            </div>
            <div className="hm-reveal">
              <FileDemo />
            </div>
          </div>
        </div>
      </section>

      <section className="hm-stage hm-stage--yoru" id="yoru">
        <div className="hm-panel">
          <div className="hm-glow" aria-hidden="true" />
          <div className="hm-wrap hm-stage__inner">
            <div className="hm-txt">
              <span className="hm-kick">
                <i />
                本机网页工具
              </span>
              <h2>夜鹿视觉工房</h2>
              <p className="hm-what">
                从自己存的 ヨルシカ Live 和 MV 里挑画面，裁成电脑或手机壁纸导出。也能让 AI 助手帮忙选片、做头像和粉丝二创。
              </p>
              <Steps items={["告诉 AI 助手想加什么画面", "它选片、裁好，放进本机图库", "刷新网页，挑尺寸导出 PNG"]} />
              <Meta items={["在自己电脑上运行", "没有在线演示"]} />
              <div className="hm-btns">
                <a className="hm-btn hm-btn--pri" href={gh("Yorushika-Lyric-Card-Bot")} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </div>
            </div>
            <div className="hm-reveal">
              <div className="hm-shot" id="hm-yshot">
                <Image
                  src="/images/home/yoru-workbench.jpg"
                  alt="夜鹿视觉工房的壁纸工作台：左边是视频原帧，右边选择尺寸、取景并导出"
                  width={1800}
                  height={929}
                  sizes="(max-width: 860px) 100vw, 680px"
                />
              </div>
              <p className="hm-cap">壁纸工作台，截图来自项目 README。下面几个色块是从这张图里取的。</p>
              <div className="hm-swatches" id="hm-ysw" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <div className="hm-wrap">
        <section className="hm-tools">
          <h2>顺手做的小工具</h2>
          <p>给 Claude Code、Codex 这类 AI 编程助手装的 Skill。</p>
          <div className="hm-tgrid">
            {tools.map((tool) => (
              <a key={tool.repo} className={`hm-tcard ${tool.tone}`} href={gh(tool.repo)} target="_blank" rel="noreferrer">
                <b>{tool.name}</b>
                <span>{tool.text}</span>
                <small>{tool.date} 更新 · GitHub ↗</small>
                {tool.icon}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
