"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageContainer } from "./PageContainer";
import { siteLinks, siteProfile } from "../../lib/site-config";

const navItems = [
  { href: "/notes", label: "笔记" },
  { href: "/about", label: "关于" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="hm-header">
      <PageContainer>
        <div className="hm-header__inner">
          <Link href="/" className="hm-brand" aria-label={`${siteProfile.ownerLabel} 首页`}>
            <span className="hm-brand__mark" aria-hidden="true" />
            <span>{siteProfile.ownerLabel}</span>
          </Link>

          <nav className="hm-nav" aria-label="主导航">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            <a href={siteLinks.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </nav>
        </div>
      </PageContainer>
    </header>
  );
}
