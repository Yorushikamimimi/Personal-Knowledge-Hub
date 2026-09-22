import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";

const siteDescription =
  "一个记录 AI 应用与 Java 工程实践的公开站点，集中呈现项目边界、技术取舍与可复用的知识笔记。";

const siteTitle = "Personal Knowledge Hub | AI Engineering / Java Projects";

export const metadata: Metadata = {
  metadataBase: new URL("https://yoruming.cn"),
  title: {
    default: siteTitle,
    template: "%s | Personal Knowledge Hub",
  },
  description: siteDescription,
  applicationName: "Personal Knowledge Hub",
  keywords: [
    "AI Engineering Portfolio",
    "Java Full-stack Portfolio",
    "Java",
    "Spring Boot",
    "Python",
    "FastAPI",
    "LLM",
    "OCR",
    "RAG",
    "PostgreSQL",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Personal Knowledge Hub",
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
