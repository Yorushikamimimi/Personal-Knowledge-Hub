import type { Metadata } from "next";
import { PageContainer } from "../../components/layout/PageContainer";

export const metadata: Metadata = {
  title: "免责声明",
  description: "Personal Knowledge Hub 的免责声明，说明知识分享用途、资源使用边界与风险提示。",
};

export default function DisclaimerPage() {
  return (
    <PageContainer>
      <div className="page-stack page-stack--policy">
        <section className="page-hero page-hero--policy glass-panel glass-panel--hero">
          <span className="section-kicker">Disclaimer</span>
          <h1 className="page-title">免责声明</h1>
          <p className="page-lead">本页用于说明站点内容的知识分享属性、下载资源的使用边界，以及读者在使用相关信息时需要自行判断的范围。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>1. 知识分享属性</h2>
          <p>站点内容主要基于个人学习、项目实践和复盘整理形成，目标是分享思路、经验和方法，而不是提供任何形式的官方结论、商业承诺或专业认证意见。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>2. 使用边界</h2>
          <p>读者应结合自己的实际业务场景、技术栈、项目约束和风险要求独立判断是否采用站点中的观点、方案或资料。内容适用边界会尽量说明，但不能覆盖所有场景。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>3. 下载资源说明</h2>
          <p>下载资源仅作为学习参考、整理辅助或效率工具使用。资源中可能包含时效性内容，站点会尽量维护更新，但不对所有版本持续兼容、适配或有效性做绝对保证。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>4. 风险提示</h2>
          <p>无论是笔记内容还是下载资源，都可能因时间、环境、版本变化而出现偏差。使用者应在自己的环境中进行验证，并自行承担基于该内容做出决策或实施后的结果。</p>
        </section>

        <section className="policy-section glass-panel glass-panel--section">
          <h2>5. 后续更新</h2>
          <p>本页会随着站点内容范围变化继续补充。如果后续新增资源类型、对外说明或联系渠道，会同步更新免责声明，保持边界清晰。</p>
        </section>
      </div>
    </PageContainer>
  );
}