import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";

const siteDescription =
  "面向求职展示的 AI 应用 / Java 全栈作品集，集中呈现智能标书解析、知识库 RAG 与门诊处方库存系统的工程实践。";

const siteTitle = "Personal Knowledge Hub | AI Engineering / Java Full-stack Portfolio";

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
