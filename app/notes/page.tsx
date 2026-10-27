import type { Metadata } from "next";
import { NoteFilter } from "../../components/c2/NoteFilter";
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
      <section className="c2-stage c2-stage--notes">
        <div>
          <span className="c2-eyebrow">Notes</span>
          <h1>知识笔记</h1>
          <p>从项目实践中提炼可复用的工程判断：为什么这样拆、如何验证，以及哪些结论不能越过证据边界。</p>
        </div>
        <div className="c2-count">
          <strong>{notes.length}</strong>篇已发布
        </div>
      </section>

      <NoteFilter
        notes={notes.map((note) => ({
          slug: note.slug,
          title: note.title,
          summary: note.summary,
          category: note.category,
          tags: note.tags,
          updatedLabel: formatNoteDate(note.updatedAt),
        }))}
      />
    </PageContainer>
  );
}
