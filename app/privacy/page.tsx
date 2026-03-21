import type { Metadata } from "next";
import { PageContainer } from "../../components/layout/PageContainer";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "Personal Knowledge Hub 的隐私政策，说明站点访问、下载链路与后续联系相关的基础隐私处理原则。",
};

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="page-stack page-stack--policy">
        <section className="page-hero page-hero--policy glass-panel glass-panel--hero">
          <span className="section-kicker">Privacy</span>
          <h1 className="page-title">隐私政策</h1>
          <p className="page-lead">本页用于说明 Personal Knowledge Hub 在页面访问、资源下载以及后续可能出现的联系场景中的基础隐私处理原则。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>1. 适用范围</h2>
          <p>本政策适用于当前站点的公开访问页面，包括首页、About、知识笔记、专题、下载资源以及相关合规页面。当前站点不提供注册、登录、评论、投稿或个人账户功能。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>2. 当前不会主动收集的内容</h2>
          <p>在当前版本中，站点不会围绕账户体系收集姓名、手机号、身份证号、组织信息等个人资料，也不会提供表单提交和用户生成内容入口。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>3. 访问与下载相关说明</h2>
          <p>页面浏览和资源下载以公开访问为前提。如果后续接入基础访问统计、错误监控或下载链路监测，这些信息仅用于站点维护、问题排查和内容优化，不用于建立用户画像。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>4. 第三方服务与资源</h2>
          <p>当前版本尽量保持轻量，不主动引入复杂第三方平台。如后续接入统计、监控或外部资源服务，本页会同步补充其用途、边界与更新说明。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>5. 政策更新</h2>
          <p>隐私政策会随站点能力变化而更新。若后续出现新的数据处理场景，例如公开联系方式、访问统计或资源分发方式调整，会先更新说明，再上线相关能力。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>6. 联系方式预留</h2>
          <p>当前暂未公开专门的隐私联系渠道；如未来需要提供反馈邮箱或说明入口，会在 About 页和本页同步补充。</p>
        </section>
      </div>
    </PageContainer>
  );
}