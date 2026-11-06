"use client";

import { useRef, useState } from "react";

type FileId = "ctx" | "proj" | "hist";

const files: { id?: FileId; name: string; dir?: boolean; indent?: boolean }[] = [
  { name: "AGENTS.md" },
  { name: "CLAUDE.md" },
  { id: "ctx", name: "AI_CONTEXT.md" },
  { name: "README.md" },
  { name: "20-Projects/", dir: true },
  { id: "proj", name: "image-helper.md", indent: true },
  { name: "50-Workflow/logs/", dir: true },
  { id: "hist", name: "example-history.md", indent: true },
];

const fileCount = files.filter((file) => !file.dir).length;

const questions: { label: string; read: FileId[]; answer: string[] }[] = [
  {
    label: "继续图片整理项目，现在停在哪？",
    read: ["ctx", "proj"],
    answer: [
      "停在：导出的文件怎么命名、同名文件怎么处理。",
      "第一版只支持 PNG，「支持多种格式」是以前的想法。",
      "记录里写了进度，但没有代码和测试证据，还不能算确认。",
    ],
  },
  {
    label: "为什么后来只做 PNG？",
    read: ["ctx", "proj", "hist"],
    answer: ["这次才去翻历史记录，找当初只做 PNG 的那条决定。", "回答时分清哪些是现在的决定，哪些是过去的想法。"],
  },
];

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function VaultDemo() {
  const [active, setActive] = useState<number | null>(null);
  const [read, setRead] = useState<FileId[]>([]);
  const [current, setCurrent] = useState<FileId | null>(null);
  const [done, setDone] = useState(false);
  const token = useRef(0);

  async function run(index: number) {
    const mine = ++token.current;
    const question = questions[index];
    setActive(index);
    setRead([]);
    setDone(false);

    for (const id of question.read) {
      setCurrent(id);
      setRead((prev) => [...prev, id]);
      await new Promise((resolve) => setTimeout(resolve, reducedMotion() ? 0 : 520));
      if (mine !== token.current) return;
    }

    setCurrent(null);
    setDone(true);
  }

  const question = active === null ? null : questions[active];
  const currentName = files.find((file) => file.id === current)?.name;

  return (
    <div className="hm-vd">
      <div className="hm-vd__q" role="group" aria-label="选一个请求">
        {questions.map((item, index) => (
          <button key={item.label} type="button" aria-pressed={active === index} onClick={() => run(index)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="hm-vd__body">
        <ul className={active === null ? "hm-vd__tree" : "hm-vd__tree is-running"}>
          {files.map((file) => {
            const isRead = file.id ? read.includes(file.id) : false;
            const classes = [file.indent ? "is-indent" : "", isRead ? "is-read" : "", file.id && file.id === current ? "is-now" : ""]
              .filter(Boolean)
              .join(" ");
            return (
              <li key={file.name} className={classes}>
                <span className="hm-vd__k" aria-hidden="true">
                  {file.dir ? "▾" : "·"}
                </span>
                {file.name}
              </li>
            );
          })}
        </ul>
        <div className="hm-vd__out" aria-live="polite">
          {question === null ? (
            <p className="hm-vd__ph">选上面一个请求，看 AI 会打开哪几个文件。</p>
          ) : (
            <>
              <div className="hm-vd__st">
                {done ? `读了 ${question.read.length} 个文件` : `读第 ${read.length} 个文件：${currentName ?? ""}`}
              </div>
              {done ? (
                <div className="hm-vd__ans">
                  {question.answer.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p className="hm-vd__skip">其余 {fileCount - question.read.length} 个没打开</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      <div className="hm-vd__note">按仓库 examples/first-recovery 的说明还原，是演示，不是实时运行。</div>
    </div>
  );
}
