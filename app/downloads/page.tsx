import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { formatDownloadDate, getAllPublishedDownloads } from "../../lib/downloads";

export const metadata: Metadata = {
  title: "下载资源",
  description: "查看当前已发布的下载资源，包括清单、模板和配套资料。",
};

export default function DownloadsPage() {
  const downloads = getAllPublishedDownloads();

  return (
    <PageContainer>
      <div className="page-stack page-stack--downloads">
        <section className="page-hero page-hero--downloads glass-panel glass-panel--hero">
          <span className="section-kicker">Downloads</span>
          <h1 className="page-title">下载资源</h1>
          <p className="page-lead">
            这里提供工程清单与项目复盘模板。先查看资源说明，再选择下载；正式简历和开源 Skill 安装入口分别有独立页面。
          </p>
        </section>

        <section className="content-panel downloads-summary-panel glass-panel glass-panel--section">
          <h2>当前已发布 {downloads.length} 份资源</h2>
          <p>资源以轻量、可验证和可复用为优先，适合作为阅读配套材料或项目整理辅助。</p>
          <div className="project-link-row">
            <Link href="/resume" className="project-inline-link">两份正式 PDF 简历 →</Link>
            <Link href="/skills" className="project-inline-link">开源 Skills 与安装说明 →</Link>
          </div>
        </section>

        <section className="notes-grid" aria-label="下载资源列表">
          {downloads.map((download) => (
            <article key={download.slug} className="note-card glass-panel glass-panel--download-card">
              <div className="note-meta">
                <span>文件类型：{download.fileType}</span>
                <span>版本：{download.version}</span>
                <span>大小：{download.size}</span>
                <span>更新：{formatDownloadDate(download.updatedAt)}</span>
              </div>

              <h2 className="note-card__title">{download.title}</h2>
              <p className="note-card__summary">{download.summary}</p>

              <div className="tag-list" aria-label={`${download.title} 标签`}>
                {download.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>

              <Link href={`/downloads/${download.slug}`} className="note-link">
                查看详情
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </PageContainer>
  );
}
