import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./theme-c2.css";
import "./theme-home.css";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";

const siteDescription =
  "Yorushikamimimi 给自己做、自己在用的开源小作品：AI 助手的 Markdown 档案模板、macOS 文件整理助手、夜鹿视觉工房，以及几篇工程笔记。";

const siteTitle = "Yorushikamimimi · 自己用的东西";

export const metadata: Metadata = {
  metadataBase: new URL("https://yoruming.cn"),
  title: {
    default: siteTitle,
    template: "%s | Yorushikamimimi",
  },
  description: siteDescription,
  applicationName: "Yorushikamimimi",
  keywords: ["AI Context Vault", "文件整理助手", "夜鹿视觉工房", "Claude Code", "Codex", "Agent Skill", "Obsidian"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Yorushikamimimi",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="site-shell">
          <SiteHeader />
          <main className="site-main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
