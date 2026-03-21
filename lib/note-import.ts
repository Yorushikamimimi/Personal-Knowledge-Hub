export type NoteImportStatus = "draft" | "published";

export type NoteCategoryOption = {
  value: string;
  label: string;
  folder: string;
  description: string;
};

export type NoteTopicOption = {
  slug: string;
  title: string;
  summary: string;
};

export type NoteImportPayload = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  topicSlugs: string[];
  publishedAt: string;
  updatedAt: string;
  isOriginal: boolean;
  status: NoteImportStatus;
  content: string;
};

export const NOTE_CATEGORY_OPTIONS: NoteCategoryOption[] = [
  {
    value: "java-backend",
    label: "Java Backend",
    folder: "java",
    description: "Java, Spring, concurrency, and backend engineering notes.",
  },
  {
    value: "redis",
    label: "Redis",
    folder: "redis",
    description: "Caching, distributed lock, and Redis internals notes.",
  },
  {
    value: "interview",
    label: "Interview",
    folder: "interview",
    description: "Interview prep, expression structure, and review notes.",
  },
  {
    value: "project-review",
    label: "Project Review",
    folder: "project",
    description: "Project retro, incident review, and process summary notes.",
  },
  {
    value: "product-engineering",
    label: "Product Engineering",
    folder: "product",
    description: "Product engineering and requirement-to-implementation notes.",
  },
];

const CATEGORY_FOLDER_MAP = new Map(NOTE_CATEGORY_OPTIONS.map((item) => [item.value, item.folder]));

export function resolveNoteCategoryFolder(category: string) {
  return CATEGORY_FOLDER_MAP.get(category) ?? null;
}

export function splitOptionalFrontmatter(raw: string) {
  const normalized = raw.replace(/^\uFEFF/, "");
  const match = normalized.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n)?/);

  if (!match) {
    return {
      frontmatter: "",
      body: normalized,
    };
  }

  return {
    frontmatter: match[0],
    body: normalized.slice(match[0].length),
  };
}

export function normalizeMarkdownSource(raw: string) {
  return splitOptionalFrontmatter(raw).body.replace(/\r\n/g, "\n").replace(/^\uFEFF/, "").trim();
}

function cleanInlineMarkdown(text: string) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/[*_~>#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractFirstMarkdownHeading(source: string) {
  const match = normalizeMarkdownSource(source).match(/^#\s+(.+)$/m);
  return match ? cleanInlineMarkdown(match[1]) : "";
}

export function inferTitleFromMarkdown(source: string, fileName = "") {
  const heading = extractFirstMarkdownHeading(source);
  if (heading) {
    return heading;
  }

  return fileName.replace(/\.(md|mdx)$/i, "").replace(/[-_]+/g, " ").trim();
}

export function inferSummaryFromMarkdown(source: string) {
  const normalized = normalizeMarkdownSource(source);
  const blocks = normalized.split(/\n\s*\n/);

  for (const block of blocks) {
    const plain = cleanInlineMarkdown(block);
    if (!plain) {
      continue;
    }

    if (/^(#{1,6}\s|```|~~~|[-*+]\s|\d+\.\s)/.test(block.trim())) {
      continue;
    }

    return plain.slice(0, 120);
  }

  return "Summary pending";
}

export function slugifyTitle(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/["'`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildFallbackSlug() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
  return `note-${date}-${time.toLowerCase()}`;
}

export function ensureNoteSlug(input: string) {
  const slug = slugifyTitle(input);
  return slug || buildFallbackSlug();
}

export function todayDateString() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

function toYamlString(value: string) {
  return JSON.stringify(value.replace(/\r?\n/g, " ").trim());
}

export function serializeNoteDocument(payload: NoteImportPayload) {
  const lines = [
    "---",
    `title: ${toYamlString(payload.title)}`,
    `slug: ${toYamlString(payload.slug)}`,
    `summary: ${toYamlString(payload.summary)}`,
    `category: ${toYamlString(payload.category)}`,
    payload.tags.length > 0 ? "tags:" : "tags: []",
    ...payload.tags.map((tag) => `  - ${toYamlString(tag)}`),
    payload.topicSlugs.length > 0 ? "topicSlugs:" : "topicSlugs: []",
    ...payload.topicSlugs.map((topicSlug) => `  - ${toYamlString(topicSlug)}`),
    `publishedAt: ${toYamlString(payload.publishedAt)}`,
    `updatedAt: ${toYamlString(payload.updatedAt)}`,
    `isOriginal: ${payload.isOriginal ? "true" : "false"}`,
    `status: ${toYamlString(payload.status)}`,
    "---",
    "",
    normalizeMarkdownSource(payload.content),
    "",
  ];

  return lines.join("\n");
}

export function parseTagInput(value: string) {
  return value
    .split(/[\u002C\uFF0C\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}