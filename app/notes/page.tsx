import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { formatNoteDate, getAllPublishedNotes } from "../../lib/notes";

export const metadata: Metadata = {
  title: "知识笔记",
  description: "从真实项目中提炼文档智能、RAG 工程化与 Java 业务一致性的技术笔记。",
};

export default function NotesPage() {
  const notes = getAllPublishedNotes();

  return (
    <PageContainer>
      <div className="page-stack page-stack--notes">
        <section className="page-hero page-hero--notes glass-panel glass-panel--hero">
          <span className="section-kicker">Notes</span>
          <h1 className="page-title">知识笔记</h1>
          <p className="page-lead">
            从当前三个代表项目中提炼可复用的工程判断：为什么这样拆、如何验证，以及哪些结论不能越过证据边界。
          </p>
        </section>

        <section className="content-panel notes-summary-panel glass-panel glass-panel--section">
          <h2>当前已发布 {notes.length} 篇文章</h2>
          <p>当前专题对应文档智能、本地 RAG 和门诊业务一致性，作为项目详情页之外的技术补充。</p>
        </section>

        <section className="notes-grid" aria-label="知识笔记列表">
          {notes.map((note) => (
            <article key={note.slug} className="note-card glass-panel glass-panel--note-card">
              <div className="note-meta">
                <span>分类：{note.category}</span>
                <span>发布时间：{formatNoteDate(note.publishedAt)}</span>
                <span>更新：{formatNoteDate(note.updatedAt)}</span>
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

              <Link href={`/notes/${note.slug}`} className="note-link">
                阅读全文
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </PageContainer>
  );
}
