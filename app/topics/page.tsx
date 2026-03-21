import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "../../components/layout/PageContainer";
import { getAllPublishedTopics } from "../../lib/topics";

export const metadata: Metadata = {
  title: "专题",
  description: "查看当前已发布的专题，并浏览每个专题下推荐的 Note 与 DownloadResource。",
};

export default function TopicsPage() {
  const topics = getAllPublishedTopics();

  return (
    <PageContainer>
      <div className="page-stack page-stack--topics">
        <section className="page-hero page-hero--topics glass-panel glass-panel--hero">
          <span className="section-kicker">Topics</span>
          <h1 className="page-title">专题</h1>
          <p className="page-lead">
            这里用于按主题组织当前站点的已发布内容。当前只做最小聚合展示：列出专题、说明摘要，并展示关联的笔记和下载资源入口。
          </p>
        </section>

        <section className="content-panel topics-summary-panel glass-panel glass-panel--section">
          <h2>当前已发布 {topics.length} 个专题</h2>
          <p>专题页不做复杂聚合算法，只基于预先配置好的关联 slug 展示代表内容。</p>
        </section>

        <section className="topic-list" aria-label="专题列表">
          {topics.map((topic) => (
            <article key={topic.slug} className="topic-card glass-panel glass-panel--topic-card">
              <div className="note-meta">
                <span>专题标识：{topic.slug}</span>
                <span>排序：{topic.order}</span>
              </div>

              <h2 className="note-card__title">{topic.title}</h2>
              <p className="note-card__summary">{topic.summary}</p>

              <div className="topic-section">
                <h3>推荐笔记</h3>
                <ul className="topic-link-list">
                  {topic.featuredNotes.map((note) => (
                    <li key={note.slug}>
                      <Link href={`/notes/${note.slug}`}>{note.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="topic-section">
                <h3>推荐资源</h3>
                <ul className="topic-link-list">
                  {topic.featuredDownloads.map((download) => (
                    <li key={download.slug}>
                      <Link href={`/downloads/${download.slug}`}>{download.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      </div>
    </PageContainer>
  );
}