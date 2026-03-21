import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

const PROJECTS_ROOT = path.join(process.cwd(), "content", "projects");

type ProjectStatus = "draft" | "published";

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectMetric = {
  value: string;
  label: string;
  note: string;
};

export type ProjectFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  role: string;
  techStack: string[];
  highlights: string[];
  goals: string[];
  responsibilities: string[];
  boundaries: string[];
  metrics: ProjectMetric[];
  screenshotNote: string;
  screenshots: ProjectScreenshot[];
  githubUrl: string;
  readmeUrl: string;
  demoUrl: string;
  featured: boolean;
  sortOrder: number;
  status: ProjectStatus;
};

export type ProjectListItem = ProjectFrontmatter & {
  sourcePath: string;
};

export type ProjectDetail = ProjectListItem & {
  content: ReactNode;
};

function getAllProjectFilePaths(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getAllProjectFilePaths(fullPath);
    }

    return entry.isFile() && fullPath.endsWith(".mdx") ? [fullPath] : [];
  });
}

function assertString(value: unknown, field: string, filePath: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid project frontmatter: ${field} is required in ${filePath}`);
  }

  return value.trim();
}

function assertOptionalString(value: unknown, field: string, filePath: string) {
  if (value == null) {
    return "";
  }

  if (typeof value !== "string") {
    throw new Error(`Invalid project frontmatter: ${field} must be a string in ${filePath}`);
  }

  return value.trim();
}

function assertStringArray(value: unknown, field: string, filePath: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`Invalid project frontmatter: ${field} must be a string array in ${filePath}`);
  }

  return value.map((item) => item.trim());
}

function assertMetricArray(value: unknown, field: string, filePath: string): ProjectMetric[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid project frontmatter: ${field} must be an array in ${filePath}`);
  }

  return value.map((item, index) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`Invalid project frontmatter: ${field}[${index}] must be an object in ${filePath}`);
    }

    const metric = item as Record<string, unknown>;

    return {
      value: assertString(metric.value, `${field}[${index}].value`, filePath),
      label: assertString(metric.label, `${field}[${index}].label`, filePath),
      note: assertString(metric.note, `${field}[${index}].note`, filePath),
    };
  });
}

function assertScreenshotArray(value: unknown, field: string, filePath: string): ProjectScreenshot[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid project frontmatter: ${field} must be an array in ${filePath}`);
  }

  return value.map((item, index) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`Invalid project frontmatter: ${field}[${index}] must be an object in ${filePath}`);
    }

    const screenshot = item as Record<string, unknown>;

    return {
      src: assertString(screenshot.src, `${field}[${index}].src`, filePath),
      alt: assertString(screenshot.alt, `${field}[${index}].alt`, filePath),
      caption: assertString(screenshot.caption, `${field}[${index}].caption`, filePath),
    };
  });
}

function assertBoolean(value: unknown, field: string, filePath: string) {
  if (typeof value !== "boolean") {
    throw new Error(`Invalid project frontmatter: ${field} must be a boolean in ${filePath}`);
  }

  return value;
}

function assertNumber(value: unknown, field: string, filePath: string) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Invalid project frontmatter: ${field} must be a number in ${filePath}`);
  }

  return value;
}

function assertStatus(value: unknown, filePath: string): ProjectStatus {
  if (value === "draft" || value === "published") {
    return value;
  }

  throw new Error(`Invalid project frontmatter: status must be draft or published in ${filePath}`);
}

function assertSlug(value: string, filePath: string) {
  if (!/^[a-z0-9-]+$/.test(value)) {
    throw new Error(`Invalid project frontmatter: slug must be kebab-case in ${filePath}`);
  }

  const fileSlug = path.basename(filePath, ".mdx");
  if (fileSlug !== value) {
    throw new Error(`Invalid project frontmatter: slug must match file name in ${filePath}`);
  }

  return value;
}

function parseProjectFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const project: ProjectListItem = {
    title: assertString(data.title, "title", filePath),
    slug: assertSlug(assertString(data.slug, "slug", filePath), filePath),
    summary: assertString(data.summary, "summary", filePath),
    role: assertString(data.role, "role", filePath),
    techStack: assertStringArray(data.techStack, "techStack", filePath),
    highlights: assertStringArray(data.highlights, "highlights", filePath),
    goals: assertStringArray(data.goals, "goals", filePath),
    responsibilities: assertStringArray(data.responsibilities, "responsibilities", filePath),
    boundaries: assertStringArray(data.boundaries, "boundaries", filePath),
    metrics: assertMetricArray(data.metrics, "metrics", filePath),
    screenshotNote: assertString(data.screenshotNote, "screenshotNote", filePath),
    screenshots: assertScreenshotArray(data.screenshots, "screenshots", filePath),
    githubUrl: assertString(data.githubUrl, "githubUrl", filePath),
    readmeUrl: assertOptionalString(data.readmeUrl, "readmeUrl", filePath),
    demoUrl: assertOptionalString(data.demoUrl, "demoUrl", filePath),
    featured: assertBoolean(data.featured, "featured", filePath),
    sortOrder: assertNumber(data.sortOrder, "sortOrder", filePath),
    status: assertStatus(data.status, filePath),
    sourcePath: filePath,
  };

  return { project, content };
}

function getAllProjectsWithSource() {
  return getAllProjectFilePaths(PROJECTS_ROOT).map((filePath) => parseProjectFile(filePath));
}

export function getAllPublishedProjects(): ProjectListItem[] {
  return getAllProjectsWithSource()
    .map((entry) => entry.project)
    .filter((project) => project.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedProjects(limit = 3): ProjectListItem[] {
  return getAllPublishedProjects()
    .filter((project) => project.featured)
    .slice(0, limit);
}

export function getPublishedProjectSlugs(): string[] {
  return getAllPublishedProjects().map((project) => project.slug);
}

export function getPublishedProjectMetaBySlug(slug: string): ProjectListItem | null {
  return getAllPublishedProjects().find((project) => project.slug === slug) ?? null;
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const entry = getAllProjectsWithSource().find(
    (item) => item.project.slug === slug && item.project.status === "published",
  );

  if (!entry) {
    return null;
  }

  const compiled = await compileMDX({
    source: entry.content,
  });

  return {
    ...entry.project,
    content: compiled.content,
  };
}