import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "../../../components/layout/PageContainer";
import {
  formatDownloadDate,
  getPublishedDownloadBySlug,
  getPublishedDownloadMetaBySlug,
  getPublishedDownloadSlugs,
} from "../../../lib/downloads";

type DownloadDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getPublishedDownloadSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: DownloadDetailPageProps): Metadata {
  const download = getPublishedDownloadMetaBySlug(params.slug);

  if (!download) {
    return {
      title: "资源不存在",
    };
  }

  return {
    title: download.title,
    description: download.summary,
  };
}

export default async function DownloadDetailPage({ params }: DownloadDetailPageProps) {
  const download = await getPublishedDownloadBySlug(params.slug);

  if (!download) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="page-stack page-stack--download-detail">
        <div>
          <Link href="/downloads" className="back-link">
            <span aria-hidden="true">←</span>
            返回资源列表
          </Link>
        </div>

        <section className="page-hero page-hero--downloads glass-panel glass-panel--hero">
          <span className="section-kicker">Download Detail</span>
          <h1 className="page-title">{download.title}</h1>
          <p className="page-lead">{download.summary}</p>
        </section>

        <section className="content-panel download-meta-panel glass-panel glass-panel--section">
          <div className="note-meta note-meta--detail">
            <span>文件类型：{download.fileType}</span>
            <span>版本：{download.version}</span>
            <span>大小：{download.size}</span>
            <span>更新：{formatDownloadDate(download.updatedAt)}</span>
          </div>

          <div className="tag-list" aria-label={`${download.title} 标签`}>
            {download.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <div className="spec-grid">
            <div>
              <h2>适用对象</h2>
              <ul className="list-clean">
                {download.audience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2>资源包含</h2>
              <ul className="list-clean">
                {download.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="content-panel glass-panel glass-panel--section">
          <h2>使用说明</h2>
          <ul className="list-clean">
            {download.notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <article className="note-prose glass-panel glass-panel--download-prose">{download.content}</article>

        <section className="content-panel download-actions glass-panel glass-panel--section glass-panel--download-action">
          <h2>下载入口</h2>
          <p>下载文件位于站点静态目录中，不做鉴权、统计或二次跳转。</p>
          <a href={download.downloadPath} className="download-button" download>
            立即下载
            <span aria-hidden="true">→</span>
          </a>
        </section>
      </div>
    </PageContainer>
  );
}