"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageContainer } from "./PageContainer";
import { Wordmark } from "./Wordmark";
import { siteLinks } from "../../lib/site-config";

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
          <Link href="/" className="hm-brand" aria-label="碎鸣 首页">
            <Image className="hm-brand__mark" src="/brand/suiming-mark-on-light.svg" width={32} height={32} alt="" aria-hidden="true" unoptimized priority />
            <span className="hm-brand__text">
              <Wordmark theme="light" />
              <span className="hm-brand__sub">yoruming</span>
            </span>
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
