import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "../../../components/layout/PageContainer";
import {
  formatNoteDate,
  getDraftNoteBySlug,
  getDraftNoteMetaBySlug,
  getDraftNoteSlugs,
} from "../../../lib/notes";

type DraftNoteDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  if (process.env.NODE_ENV !== "development") {
    return [];
  }

  return getDraftNoteSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: DraftNoteDetailPageProps): Metadata {
  if (process.env.NODE_ENV !== "development") {
    return {
      title: "Draft Note",
    };
  }

  const note = getDraftNoteMetaBySlug(params.slug);

  if (!note) {
    return {
      title: "Draft Note",
    };
  }

  return {
    title: `${note.title} (Draft)`,
    description: note.summary,
  };
}

export default async function DraftNoteDetailPage({ params }: DraftNoteDetailPageProps) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const note = await getDraftNoteBySlug(params.slug);

  if (!note) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="page-stack">
        <div className="draft-nav-row">
          <Link href="/draft-notes" className="back-link">
            <span aria-hidden="true">←</span>
            返回草稿列表
          </Link>
          <Link href="/import-notes" className="back-link">
            <span aria-hidden="true">+</span>
            继续导入
          </Link>
        </div>

        <section className="page-hero">
          <span className="section-kicker">Draft Note</span>
          <h1 className="page-title">{note.title}</h1>
          <p className="page-lead">{note.summary}</p>
        </section>

        <section className="content-panel">
          <div className="note-meta note-meta--detail">
            <span>分类：{note.category}</span>
            <span>发布时间：{formatNoteDate(note.publishedAt)}</span>
            <span>更新：{formatNoteDate(note.updatedAt)}</span>
            <span>状态：draft</span>
            <span>{note.isOriginal ? "原创内容" : "整理内容"}</span>
          </div>

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
        </section>

        <article className="note-prose">{note.content}</article>
      </div>
    </PageContainer>
  );
}