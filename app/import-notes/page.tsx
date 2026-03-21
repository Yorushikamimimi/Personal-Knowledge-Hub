import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { getDraftNoteImportDataBySlug } from "../../lib/notes";
import { getAllPublishedTopics } from "../../lib/topics";
import { NoteImportForm } from "./NoteImportForm";

export const metadata: Metadata = {
  title: "本地笔记导入",
  description: "本地维护入口，用于把 Markdown 文件快速导入为知识站 Note。",
};

type ImportNotesPageProps = {
  searchParams?: {
    draft?: string;
  };
};

export default function ImportNotesPage({ searchParams }: ImportNotesPageProps) {
  const topicOptions = getAllPublishedTopics().map((topic) => ({
    slug: topic.slug,
    title: topic.title,
    summary: topic.summary,
  }));

  const importEnabled = process.env.NODE_ENV === "development";
  const draftSlug = searchParams?.draft?.trim() || "";
  const initialDraft = importEnabled && draftSlug ? getDraftNoteImportDataBySlug(draftSlug) : null;

  return (
    <PageContainer>
      <div className="page-stack">
        <section className="page-hero">
          <span className="section-kicker">Local Import</span>
          <h1 className="page-title">Markdown 笔记导入</h1>
          <p className="page-lead">
            这是一个不进入公开导航的本地维护入口，用于把现成的 Markdown 文件快速转换为知识站可识别的 Note 内容。
          </p>
        </section>

        {!importEnabled ? (
          <section className="content-panel">
            <h2>当前环境不可用</h2>
            <p>
              导入功能默认只在 <span className="inline-code">npm run dev</span> 的开发环境下开放，避免公开站点暴露文件写入入口。
            </p>
            <p>你可以在本地开发环境访问此页面，完成导入后再执行构建和上线流程。</p>
            <Link href="/notes" className="entry-link">
              返回知识笔记
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        ) : (
          <NoteImportForm topicOptions={topicOptions} initialDraft={initialDraft} />
        )}
      </div>
    </PageContainer>
  );
}