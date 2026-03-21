"use client";

import Link from "next/link";
import { useState } from "react";

type DraftNoteActionsProps = {
  slug: string;
  sourcePath: string;
};

export function DraftNoteActions({ slug, sourcePath }: DraftNoteActionsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(sourcePath);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="draft-actions">
      <button type="button" className="import-button import-button--secondary" onClick={handleCopy}>
        {copied ? "已复制路径" : "复制文件路径"}
      </button>
      <Link href={`/import-notes?draft=${slug}`} className="import-button import-button--ghost">
        继续编辑
      </Link>
    </div>
  );
}