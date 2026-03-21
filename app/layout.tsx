import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Personal Knowledge Hub | Backend / Full-stack Portfolio + Notes",
    template: "%s | Personal Knowledge Hub",
  },
  description:
    "一个面向求职展示的个人静态站点，集中呈现主打项目、后端 / 全栈方向定位，以及长期积累的知识笔记与工程总结。",
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