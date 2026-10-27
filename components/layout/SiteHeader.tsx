"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageContainer } from "./PageContainer";
import { siteLinks, siteProfile } from "../../lib/site-config";

type NavItem = {
  href: string;
  label: string;
  external?: true;
};

const navItems: NavItem[] = [
  { href: "/projects", label: "项目" },
  { href: "/notes", label: "笔记" },
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "关于" },
  { href: siteLinks.github, label: "GitHub ↗", external: true },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <PageContainer>
        <div className="site-header__inner">
          <Link href="/" className="site-brand" aria-label={`${siteProfile.siteTitle} 首页`}>
            <span className="site-brand__mark" aria-hidden="true">Y</span>
            <span className="site-brand__title">{siteProfile.siteTitle}</span>
          </Link>

          <nav className="c2-nav" aria-label="主导航">
            {navItems.map((item) => {
              if (item.external) {
                return (
                  <a key={item.href} href={item.href} className="c2-nav__link" target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                );
              }

              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "c2-nav__link c2-nav__link--active" : "c2-nav__link"}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link href={siteLinks.resume} className="c2-cv">
            简历
          </Link>
        </div>
      </PageContainer>
    </header>
  );
}
