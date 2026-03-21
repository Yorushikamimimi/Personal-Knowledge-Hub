import type { Metadata } from "next";
import { PageContainer } from "../../components/layout/PageContainer";

export const metadata: Metadata = {
  title: "版权说明",
  description: "Personal Knowledge Hub 的版权说明，明确原创内容、引用转载与下载资源说明文本的使用边界。",
};

export default function CopyrightPage() {
  return (
    <PageContainer>
      <div className="page-stack page-stack--policy">
        <section className="page-hero page-hero--policy glass-panel glass-panel--hero">
          <span className="section-kicker">Copyright</span>
          <h1 className="page-title">版权说明</h1>
          <p className="page-lead">本页用于说明站点原创内容、专题说明、资源介绍文案以及后续转载引用的基本边界。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>1. 原创内容归属</h2>
          <p>站点中的知识笔记、专题说明、页面文案、资源介绍和相关原创整理内容，默认归 Personal Knowledge Hub 作者所有。若引用了公开资料、官方文档或第三方观点，会尽量在正文中说明来源。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>2. 引用与转载</h2>
          <p>欢迎在合理范围内引用本站内容，但应保留原意，不应断章取义，也不应移除来源标识。若需转载完整文章、专题说明或成体系内容，建议先取得明确授权。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>3. 下载资源相关说明</h2>
          <p>下载资源页面中的介绍文案、说明结构和整理方式同样属于站点内容的一部分。资源实体文件若有额外授权范围、使用限制或更新说明，将在对应资源详情页单独标注。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>4. 侵权处理</h2>
          <p>如果你认为本站内容侵犯了你的合法权益，可在后续公开联系渠道后提交说明。站点会在核实后及时处理，包括补充来源、修改内容或下线相关页面。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>5. 说明更新</h2>
          <p>版权说明会随着站点内容范围和资源类型变化进行调整。后续若增加更明确的转载规则、授权方式或引用格式要求，本页会同步更新。</p>
        </section>
      </div>
    </PageContainer>
  );
}