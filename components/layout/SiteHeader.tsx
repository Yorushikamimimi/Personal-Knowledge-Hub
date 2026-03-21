"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageContainer } from "./PageContainer";
import { siteLinks, siteProfile } from "../../lib/site-config";

type InternalNavItem = {
  href: string;
  label: string;
};

type ExternalNavItem = {
  href: string;
  label: string;
  external: true;
};

const primaryNavItems: InternalNavItem[] = [
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
];

const utilityNavItems: Array<InternalNavItem | ExternalNavItem> = [
  { href: "/resume", label: "Resume" },
  { href: "/about", label: "About" },
  { href: siteLinks.github, label: "GitHub", external: true },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function renderInternalLink(item: InternalNavItem, pathname: string, variant: "primary" | "utility") {
  const active = isActive(pathname, item.href);
  const className = active
    ? `site-nav__link site-nav__link--${variant} site-nav__link--active`
    : `site-nav__link site-nav__link--${variant}`;

  return (
    <Link key={item.href} href={item.href} className={className}>
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <PageContainer>
        <div className="site-header__inner">
          <Link href="/" className="site-brand" aria-label={`${siteProfile.siteTitle} 首页`}>
            <span className="site-brand__title">{siteProfile.siteTitle}</span>
            <span className="site-brand__tagline">{siteProfile.tagline}</span>
          </Link>

          <div className="site-nav-shell">
            <nav className="site-nav site-nav--primary" aria-label="主导航">
              {primaryNavItems.map((item) => renderInternalLink(item, pathname, "primary"))}
            </nav>

            <span className="site-nav-shell__divider" aria-hidden="true" />

            <nav className="site-nav site-nav--utility" aria-label="辅助导航">
              {utilityNavItems.map((item) => {
                if ("external" in item) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="site-nav__link site-nav__link--utility site-nav__link--external"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  );
                }

                return renderInternalLink(item, pathname, "utility");
              })}
            </nav>
          </div>
        </div>
      </PageContainer>
    </header>
  );
}