"use client";

import Image from "next/image";
import { useState } from "react";

const rows = [
  { file: "IMG_2048.HEIC", to: "图片截图 / 手机照片", why: "HEIC 格式，按名字判断是手机拍的" },
  { file: "微信图片_20261102.jpg", to: "图片截图 / 微信图片", why: "文件名以「微信图片」开头" },
  { file: "Docker.dmg", to: "安装包 / Mac", why: "DMG 安装包" },
  { file: "数据结构期末复习.pdf", to: "文档资料 / 学校课程", why: "名字里有课程相关的词" },
  { file: "%E6%8A%A5%E5%91%8A.zip", to: "压缩包 / ZIP", why: "网页编码的名字，显示为「报告」，不改名" },
];

type Phase = "preview" | "moving" | "done" | "undoing";

function delay(ms: number) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return new Promise((resolve) => setTimeout(resolve, reduce ? 0 : ms));
}

export function FileDemo() {
  const [moved, setMoved] = useState(0);
  const [phase, setPhase] = useState<Phase>("preview");

  async function confirm() {
    setPhase("moving");
    for (let i = 1; i <= rows.length; i += 1) {
      setMoved(i);
      await delay(260);
    }
    setPhase("done");
  }

  async function undo() {
    setPhase("undoing");
    for (let i = rows.length - 1; i >= 0; i -= 1) {
      setMoved(i);
      await delay(180);
    }
    setPhase("preview");
  }

  const message = {
    preview: moved === 0 ? "文件名是虚构的。还没动任何文件。" : "已撤销，文件都回到原来的位置。",
    moving: "正在移动…",
    done: "整理完了。这次的记录已保存，可以撤销。",
    undoing: "正在放回原处…",
  }[phase];

  return (
    <div className="hm-fd">
      <div className="hm-fd__h">
        <Image src="/images/home/doc-icon.png" alt="" width={26} height={26} />
        <span>下载</span>
        <span className="hm-fd__pg">
          <i style={{ width: `${(moved / rows.length) * 100}%` }} />
        </span>
        <span>{phase === "moving" || phase === "done" ? `已移动 ${moved} / ${rows.length}` : `预览 ${rows.length} 个文件`}</span>
      </div>
      <ul className="hm-fd__list">
        {rows.map((row, index) => (
          <li key={row.file} className={index < moved ? "is-done" : undefined}>
            <span className="hm-fd__f">{row.file}</span>
            <span className="hm-fd__mv" aria-hidden="true">
              →
            </span>
            <span className="hm-fd__to">
              <b>{row.to}</b>
              <small>{row.why}</small>
            </span>
          </li>
        ))}
      </ul>
      <div className="hm-fd__f-bar">
        <span className="hm-fd__msg" aria-live="polite">
          {message}
        </span>
        <button type="button" onClick={undo} disabled={phase !== "done"}>
          撤销
        </button>
        <button type="button" className="is-pri" onClick={confirm} disabled={phase !== "preview"}>
          确认整理
        </button>
      </div>
    </div>
  );
}
