import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "../../../components/layout/PageContainer";
import {
  formatNoteDate,
  getPublishedNoteBySlug,
  getPublishedNoteMetaBySlug,
  getPublishedNoteSlugs,
} from "../../../lib/notes";

type NoteDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getPublishedNoteSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: NoteDetailPageProps): Metadata {
  const note = getPublishedNoteMetaBySlug(params.slug);

  if (!note) {
    return {
      title: "笔记不存在",
    };
  }

  return {
    title: note.title,
    description: note.summary,
  };
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const note = await getPublishedNoteBySlug(params.slug);

  if (!note) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="page-stack page-stack--note-detail">
        <div>
          <Link href="/notes" className="back-link">
            <span aria-hidden="true">←</span>
            返回笔记列表
          </Link>
        </div>

        <section className="page-hero page-hero--notes glass-panel glass-panel--hero">
          <span className="section-kicker">Note Detail</span>
          <h1 className="page-title">{note.title}</h1>
          <p className="page-lead">{note.summary}</p>
        </section>

        <section className="content-panel note-meta-panel glass-panel glass-panel--section">
          <div className="note-meta note-meta--detail">
            <span>分类：{note.category}</span>
            <span>发布时间：{formatNoteDate(note.publishedAt)}</span>
            <span>更新：{formatNoteDate(note.updatedAt)}</span>
            <span>{note.isOriginal ? "原创内容" : "整理内容"}</span>
          </div>

          <div className="tag-list" aria-label={`${note.title} 标签`}>
            {note.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <article className="note-prose glass-panel glass-panel--note-prose">{note.content}</article>
      </div>
    </PageContainer>
  );
}