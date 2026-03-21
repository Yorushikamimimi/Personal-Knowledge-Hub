import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { formatNoteDate, getAllPublishedNotes } from "../../lib/notes";

export const metadata: Metadata = {
  title: "知识笔记",
  description: "查看已发布的知识笔记，内容聚焦 Java 后端、面试知识与项目复盘等主题。",
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
            这里展示当前已发布的 Note 内容。页面只读取 <span className="inline-code">status=published</span> 的文章，并按更新时间倒序排列。
          </p>
        </section>

        <section className="content-panel notes-summary-panel glass-panel glass-panel--section">
          <h2>当前已发布 {notes.length} 篇文章</h2>
          <p>内容会优先覆盖 Java 后端、面试知识和项目复盘等方向，逐步形成稳定的阅读索引。</p>
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