import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

const DOWNLOADS_ROOT = path.join(process.cwd(), "content", "downloads");
const PUBLIC_ROOT = path.join(process.cwd(), "public");

type DownloadStatus = "draft" | "published";

export type DownloadFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  fileType: string;
  version: string;
  size: string;
  tags: string[];
  updatedAt: string;
  downloadPath: string;
  status: DownloadStatus;
  audience: string[];
  includes: string[];
  notes: string[];
};

export type DownloadListItem = DownloadFrontmatter & {
  sourcePath: string;
};

export type DownloadDetail = DownloadListItem & {
  content: ReactNode;
};

function getAllDownloadFilePaths(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getAllDownloadFilePaths(fullPath);
    }

    return entry.isFile() && fullPath.endsWith(".mdx") ? [fullPath] : [];
  });
}

function assertString(value: unknown, field: string, filePath: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid download frontmatter: ${field} is required in ${filePath}`);
  }

  return value.trim();
}

function assertStringArray(value: unknown, field: string, filePath: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`Invalid download frontmatter: ${field} must be a string array in ${filePath}`);
  }

  return value.map((item) => item.trim());
}

function assertDateString(value: unknown, field: string, filePath: string) {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  throw new Error(`Invalid download frontmatter: ${field} is required in ${filePath}`);
}

function assertStatus(value: unknown, filePath: string): DownloadStatus {
  if (value === "draft" || value === "published") {
    return value;
  }

  throw new Error(`Invalid download frontmatter: status must be draft or published in ${filePath}`);
}

function assertSlug(value: string, filePath: string) {
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error(`Invalid download frontmatter: slug must be kebab-case in ${filePath}`);
  }

  const fileSlug = path.basename(filePath, ".mdx");
  if (fileSlug !== value) {
    throw new Error(`Invalid download frontmatter: slug must match file name in ${filePath}`);
  }

  return value;
}

function assertDownloadPath(value: unknown, filePath: string, status: DownloadStatus) {
  const downloadPath = assertString(value, "downloadPath", filePath);

  if (!downloadPath.startsWith("/files/downloads/")) {
    throw new Error(`Invalid download frontmatter: downloadPath must start with /files/downloads/ in ${filePath}`);
  }

  if (status === "published") {
    const relativePath = downloadPath.replace(/^\//, "");
    const absolutePath = path.join(PUBLIC_ROOT, relativePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Invalid download frontmatter: published resource file not found for ${filePath}`);
    }
  }

  return downloadPath;
}

function parseDownloadFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const status = assertStatus(data.status, filePath);

  const download: DownloadListItem = {
    title: assertString(data.title, "title", filePath),
    slug: assertSlug(assertString(data.slug, "slug", filePath), filePath),
    summary: assertString(data.summary, "summary", filePath),
    fileType: assertString(data.fileType, "fileType", filePath),
    version: assertString(data.version, "version", filePath),
    size: assertString(data.size, "size", filePath),
    tags: assertStringArray(data.tags, "tags", filePath),
    updatedAt: assertDateString(data.updatedAt, "updatedAt", filePath),
    downloadPath: assertDownloadPath(data.downloadPath, filePath, status),
    status,
    audience: assertStringArray(data.audience, "audience", filePath),
    includes: assertStringArray(data.includes, "includes", filePath),
    notes: assertStringArray(data.notes, "notes", filePath),
    sourcePath: filePath,
  };

  return { download, content };
}

function getAllDownloadsWithSource() {
  return getAllDownloadFilePaths(DOWNLOADS_ROOT).map((filePath) => parseDownloadFile(filePath));
}

function getDownloadSortTime(download: DownloadListItem) {
  return new Date(download.updatedAt).getTime();
}

export function getAllPublishedDownloads(): DownloadListItem[] {
  return getAllDownloadsWithSource()
    .map((entry) => entry.download)
    .filter((download) => download.status === "published")
    .sort((a, b) => getDownloadSortTime(b) - getDownloadSortTime(a));
}

export function getPublishedDownloadSlugs(): string[] {
  return getAllPublishedDownloads().map((download) => download.slug);
}

export function getPublishedDownloadMetaBySlug(slug: string): DownloadListItem | null {
  return getAllPublishedDownloads().find((download) => download.slug === slug) ?? null;
}

export async function getPublishedDownloadBySlug(slug: string): Promise<DownloadDetail | null> {
  const entry = getAllDownloadsWithSource().find(
    (item) => item.download.slug === slug && item.download.status === "published",
  );

  if (!entry) {
    return null;
  }

  const compiled = await compileMDX({
    source: entry.content,
  });

  return {
    ...entry.download,
    content: compiled.content,
  };
}

export function formatDownloadDate(dateString: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}