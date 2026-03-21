import Link from "next/link";
import { PageContainer } from "./PageContainer";
import { complianceInfo, siteLinks, siteProfile } from "../../lib/site-config";

const primaryLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/topics", label: "Topics" },
  { href: "/downloads", label: "Downloads" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
];

const complianceLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/copyright", label: "Copyright" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function SiteFooter() {
  const hasPublicSecurityNumber = complianceInfo.publicSecurityNumber.trim().length > 0;

  return (
    <footer className="site-footer">
      <PageContainer>
        <div className="site-footer__inner">
          <div>
            <strong>{siteProfile.siteTitle}</strong>
            <p className="site-footer__meta">
              这是一个以 Projects 为主入口、以 Notes 为长期积累栏目的个人静态站点。Topics 和 Downloads 作为二级内容入口继续保留。
            </p>
          </div>

          <div className="footer-links" aria-label="主导航链接">
            {primaryLinks.map((item) => (
              <Link key={item.href} href={item.href} className="footer-link">
                {item.label}
              </Link>
            ))}
            <a href={siteLinks.github} target="_blank" rel="noreferrer" className="footer-link">
              GitHub
            </a>
          </div>

          <div className="footer-links" aria-label="合规链接">
            {complianceLinks.map((item) => (
              <Link key={item.href} href={item.href} className="footer-link">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="site-footer__meta">
            <div>
              ICP 备案号：
              <a className="footer-link footer-link--inline" href={complianceInfo.icpUrl} target="_blank" rel="noreferrer">
                {complianceInfo.icpNumber}
              </a>
            </div>
            {hasPublicSecurityNumber ? (
              <div>
                公安网备：
                <a
                  className="footer-link footer-link--inline"
                  href={complianceInfo.publicSecurityUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {complianceInfo.publicSecurityNumber}
                </a>
              </div>
            ) : null}
            <div>
              Copyright {new Date().getFullYear()} {siteProfile.siteTitle}. All rights reserved.
            </div>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
