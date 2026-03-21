import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getAllPublishedDownloads, type DownloadListItem } from "./downloads";
import { getAllPublishedNotes, type NoteListItem } from "./notes";

const TOPICS_ROOT = path.join(process.cwd(), "content", "topics");

type TopicStatus = "draft" | "published";

export type TopicFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  order: number;
  featuredNoteSlugs: string[];
  featuredDownloadSlugs: string[];
  status: TopicStatus;
};

export type TopicItem = TopicFrontmatter & {
  sourcePath: string;
};

export type TopicWithRelations = TopicItem & {
  featuredNotes: NoteListItem[];
  featuredDownloads: DownloadListItem[];
};

function getAllTopicFilePaths(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getAllTopicFilePaths(fullPath);
    }

    return entry.isFile() && fullPath.endsWith(".mdx") ? [fullPath] : [];
  });
}

function assertString(value: unknown, field: string, filePath: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid topic frontmatter: ${field} is required in ${filePath}`);
  }

  return value.trim();
}

function assertStringArray(value: unknown, field: string, filePath: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`Invalid topic frontmatter: ${field} must be a string array in ${filePath}`);
  }

  return value.map((item) => item.trim());
}

function assertOrder(value: unknown, filePath: string) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Invalid topic frontmatter: order must be a number in ${filePath}`);
  }

  return value;
}

function assertStatus(value: unknown, filePath: string): TopicStatus {
  if (value === "draft" || value === "published") {
    return value;
  }

  throw new Error(`Invalid topic frontmatter: status must be draft or published in ${filePath}`);
}

function assertSlug(value: string, filePath: string) {
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error(`Invalid topic frontmatter: slug must be kebab-case in ${filePath}`);
  }

  const fileSlug = path.basename(filePath, ".mdx");
  if (fileSlug !== value) {
    throw new Error(`Invalid topic frontmatter: slug must match file name in ${filePath}`);
  }

  return value;
}

function parseTopicFile(filePath: string): TopicItem {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);

  return {
    title: assertString(data.title, "title", filePath),
    slug: assertSlug(assertString(data.slug, "slug", filePath), filePath),
    summary: assertString(data.summary, "summary", filePath),
    order: assertOrder(data.order, filePath),
    featuredNoteSlugs: assertStringArray(data.featuredNoteSlugs, "featuredNoteSlugs", filePath),
    featuredDownloadSlugs: assertStringArray(data.featuredDownloadSlugs, "featuredDownloadSlugs", filePath),
    status: assertStatus(data.status, filePath),
    sourcePath: filePath,
  };
}

function attachRelations(topic: TopicItem): TopicWithRelations {
  const noteMap = new Map(getAllPublishedNotes().map((note) => [note.slug, note]));
  const downloadMap = new Map(getAllPublishedDownloads().map((download) => [download.slug, download]));

  const featuredNotes = topic.featuredNoteSlugs
    .map((slug) => noteMap.get(slug))
    .filter((note): note is NoteListItem => Boolean(note));

  const featuredDownloads = topic.featuredDownloadSlugs
    .map((slug) => downloadMap.get(slug))
    .filter((download): download is DownloadListItem => Boolean(download));

  return {
    ...topic,
    featuredNotes,
    featuredDownloads,
  };
}

export function getAllPublishedTopics(): TopicWithRelations[] {
  return getAllTopicFilePaths(TOPICS_ROOT)
    .map((filePath) => parseTopicFile(filePath))
    .filter((topic) => topic.status === "published")
    .sort((a, b) => a.order - b.order)
    .map((topic) => attachRelations(topic));
}

export function getPublishedTopicSlugs(): string[] {
  return getAllPublishedTopics().map((topic) => topic.slug);
}

export function getPublishedTopicBySlug(slug: string): TopicWithRelations | null {
  return getAllPublishedTopics().find((topic) => topic.slug === slug) ?? null;
}