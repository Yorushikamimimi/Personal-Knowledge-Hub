import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";

const siteDescription =
  "一个面向求职展示的个人静态站点，集中呈现主打项目、后端 / 全栈方向定位，以及长期积累的知识笔记与工程总结。";

export const metadata: Metadata = {
  metadataBase: new URL("https://yoruming.cn"),
  title: {
    default: "Personal Knowledge Hub | Backend / Full-stack Portfolio + Notes",
    template: "%s | Personal Knowledge Hub",
  },
  description: siteDescription,
  applicationName: "Personal Knowledge Hub",
  keywords: [
    "Backend Portfolio",
    "Full-stack Portfolio",
    "Java",
    "Spring Boot",
    "Vue",
    "PostgreSQL",
    "Personal Notes",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Personal Knowledge Hub",
    title: "Personal Knowledge Hub | Backend / Full-stack Portfolio + Notes",
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: "Personal Knowledge Hub | Backend / Full-stack Portfolio + Notes",
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
