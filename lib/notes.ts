import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

const NOTES_ROOT = path.join(process.cwd(), "content", "notes");

type NoteStatus = "draft" | "published";

export type NoteFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  topicSlugs: string[];
  publishedAt: string;
  updatedAt: string;
  isOriginal: boolean;
  status: NoteStatus;
};

export type NoteListItem = NoteFrontmatter & {
  sourcePath: string;
};

export type NoteDetail = NoteListItem & {
  content: ReactNode;
};

export type DraftNoteImportData = NoteListItem & {
  rawContent: string;
};

function getAllNoteFilePaths(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getAllNoteFilePaths(fullPath);
    }

    return entry.isFile() && fullPath.endsWith(".mdx") ? [fullPath] : [];
  });
}

function assertString(value: unknown, field: string, filePath: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid note frontmatter: ${field} is required in ${filePath}`);
  }

  return value.trim();
}

function assertStringArray(value: unknown, field: string, filePath: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`Invalid note frontmatter: ${field} must be a string array in ${filePath}`);
  }

  return value.map((item) => item.trim());
}

function assertBoolean(value: unknown, field: string, filePath: string) {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid note frontmatter: ${field} must be a boolean in ${filePath}`);
  }

  return value;
}

function assertDateString(value: unknown, field: string, filePath: string) {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  throw new Error(`Invalid note frontmatter: ${field} is required in ${filePath}`);
}

function assertStatus(value: unknown, filePath: string): NoteStatus {
  if (value === "draft" || value === "published") {
    return value;
  }

  throw new Error(`Invalid note frontmatter: status must be draft or published in ${filePath}`);
}

function assertSlug(value: string, filePath: string) {
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error(`Invalid note frontmatter: slug must be kebab-case in ${filePath}`);
  }

  const fileSlug = path.basename(filePath, ".mdx");
  if (fileSlug !== value) {
    throw new Error(`Invalid note frontmatter: slug must match file name in ${filePath}`);
  }

  return value;
}

function parseNoteFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const note: NoteListItem = {
    title: assertString(data.title, "title", filePath),
    slug: assertSlug(assertString(data.slug, "slug", filePath), filePath),
    summary: assertString(data.summary, "summary", filePath),
    category: assertString(data.category, "category", filePath),
    tags: assertStringArray(data.tags, "tags", filePath),
    topicSlugs: assertStringArray(data.topicSlugs, "topicSlugs", filePath),
    publishedAt: assertDateString(data.publishedAt, "publishedAt", filePath),
    updatedAt: assertDateString(data.updatedAt, "updatedAt", filePath),
    isOriginal: assertBoolean(data.isOriginal, "isOriginal", filePath),
    status: assertStatus(data.status, filePath),
    sourcePath: filePath,
  };

  return { note, content };
}

function getAllNotesWithSource() {
  return getAllNoteFilePaths(NOTES_ROOT).map((filePath) => parseNoteFile(filePath));
}

function getNoteSortTime(note: NoteListItem) {
  return new Date(note.updatedAt || note.publishedAt).getTime();
}

function getNotesByStatus(status: NoteStatus): NoteListItem[] {
  return getAllNotesWithSource()
    .map((entry) => entry.note)
    .filter((note) => note.status === status)
    .sort((a, b) => getNoteSortTime(b) - getNoteSortTime(a));
}

export function getAllPublishedNotes(): NoteListItem[] {
  return getNotesByStatus("published");
}

export function getAllDraftNotes(): NoteListItem[] {
  return getNotesByStatus("draft");
}

export function getPublishedNoteSlugs(): string[] {
  return getAllPublishedNotes().map((note) => note.slug);
}

export function getDraftNoteSlugs(): string[] {
  return getAllDraftNotes().map((note) => note.slug);
}

export function getPublishedNoteMetaBySlug(slug: string): NoteListItem | null {
  return getAllPublishedNotes().find((note) => note.slug === slug) ?? null;
}

export function getDraftNoteMetaBySlug(slug: string): NoteListItem | null {
  return getAllDraftNotes().find((note) => note.slug === slug) ?? null;
}

export function getDraftNoteImportDataBySlug(slug: string): DraftNoteImportData | null {
  const entry = getAllNotesWithSource().find((item) => item.note.slug === slug && item.note.status === "draft");

  if (!entry) {
    return null;
  }

  return {
    ...entry.note,
    rawContent: entry.content,
  };
}

export async function getPublishedNoteBySlug(slug: string): Promise<NoteDetail | null> {
  const entry = getAllNotesWithSource().find((item) => item.note.slug === slug && item.note.status === "published");

  if (!entry) {
    return null;
  }

  const compiled = await compileMDX({
    source: entry.content,
  });

  return {
    ...entry.note,
    content: compiled.content,
  };
}

export async function getDraftNoteBySlug(slug: string): Promise<NoteDetail | null> {
  const entry = getAllNotesWithSource().find((item) => item.note.slug === slug && item.note.status === "draft");

  if (!entry) {
    return null;
  }

  const compiled = await compileMDX({
    source: entry.content,
  });

  return {
    ...entry.note,
    content: compiled.content,
  };
}

export function formatNoteDate(dateString: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}