import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { formatNoteDate, getAllDraftNotes } from "../../lib/notes";
import { DraftNoteActions } from "./DraftNoteActions";

export const metadata: Metadata = {
  title: "Draft Notes",
  description: "本地维护用的草稿笔记列表页。",
};

export default function DraftNotesPage() {
  const draftNotes = getAllDraftNotes();
  const importEnabled = process.env.NODE_ENV === "development";

  return (
    <PageContainer>
      <div className="page-stack">
        <section className="page-hero">
          <span className="section-kicker">Draft Notes</span>
          <h1 className="page-title">草稿笔记</h1>
          <p className="page-lead">
            这是一个本地维护用的隐藏页面，用来查看当前保存为 <span className="inline-code">status=draft</span> 的笔记。
          </p>
        </section>

        {!importEnabled ? (
          <section className="content-panel">
            <h2>当前环境不可用</h2>
            <p>草稿页只在本地开发环境开放，避免生产环境暴露未发布内容。</p>
          </section>
        ) : (
          <>
            <section className="content-panel">
              <div className="section-header">
                <div>
                  <h2>当前共有 {draftNotes.length} 篇草稿</h2>
                  <p>如果导入页刷新后表单清空，可以来这里继续查看已保存的 draft 文件。</p>
                </div>
                <Link href="/import-notes" className="section-header__link">
                  继续导入
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </section>

            <section className="notes-grid" aria-label="草稿笔记列表">
              {draftNotes.length === 0 ? (
                <article className="placeholder-card">
                  <h3>还没有草稿</h3>
                  <p>你可以先去隐藏导入页上传 Markdown，系统会先把内容保存成 draft 文件。</p>
                </article>
              ) : (
                draftNotes.map((note) => (
                  <article key={note.slug} className="note-card">
                    <div className="note-meta">
                      <span>分类：{note.category}</span>
                      <span>发布时间：{formatNoteDate(note.publishedAt)}</span>
                      <span>更新：{formatNoteDate(note.updatedAt)}</span>
                      <span>状态：draft</span>
                    </div>

                    <h2 className="note-card__title">{note.title}</h2>
                    <p className="note-card__summary">{note.summary}</p>

                    <div className="tag-list" aria-label={`${note.title} 标签`}>
                      {note.tags.map((tag) => (
                        <span key={tag} className="tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="draft-source-path">
                      文件位置：
                      <span className="inline-code">{note.sourcePath.replace(process.cwd(), ".")}</span>
                    </p>

                    <DraftNoteActions slug={note.slug} sourcePath={note.sourcePath} />

                    <Link href={`/draft-notes/${note.slug}`} className="note-link">
                      查看草稿详情
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))
              )}
            </section>
          </>
        )}
      </div>
    </PageContainer>
  );
}