import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  ensureNoteSlug,
  normalizeMarkdownSource,
  resolveNoteCategoryFolder,
  serializeNoteDocument,
  type NoteImportPayload,
} from "../../../../lib/note-import";
import { getAllPublishedTopics } from "../../../../lib/topics";

export const runtime = "nodejs";

const NOTES_ROOT = path.join(process.cwd(), "content", "notes");

type SaveNotePayload = Partial<NoteImportPayload> & {
  originalSlug?: string;
};

function importFeatureDisabled() {
  return process.env.NODE_ENV !== "development";
}

function assertNonEmptyString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} 不能为空。`);
  }

  return value.trim();
}

function assertStringArray(value: unknown, field: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${field} 必须是字符串数组。`);
  }

  return value
    .map((item) => {
      if (typeof item !== "string") {
        throw new Error(`${field} 必须是字符串数组。`);
      }

      return item.trim();
    })
    .filter(Boolean);
}

function assertBoolean(value: unknown, field: string) {
  if (typeof value !== "boolean") {
    throw new Error(`${field} 必须是布尔值。`);
  }

  return value;
}

function assertStatus(value: unknown) {
  if (value === "draft" || value === "published") {
    return value;
  }

  throw new Error("status 仅支持 draft 或 published。");
}

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

function findExistingNotePathBySlug(slug: string) {
  return getAllNoteFilePaths(NOTES_ROOT).find((filePath) => path.basename(filePath, ".mdx") === slug) ?? null;
}

export async function POST(request: Request) {
  if (importFeatureDisabled()) {
    return NextResponse.json({ error: "导入保存仅在本地开发环境开放。" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as SaveNotePayload;
    const title = assertNonEmptyString(body.title, "标题");
    const rawSlug = assertNonEmptyString(body.slug, "slug");
    const originalSlug = typeof body.originalSlug === "string" ? body.originalSlug.trim() : "";
    const summary = assertNonEmptyString(body.summary, "摘要");
    const category = assertNonEmptyString(body.category, "分类");
    const tags = assertStringArray(body.tags ?? [], "标签");
    const topicSlugs = assertStringArray(body.topicSlugs ?? [], "专题");
    const publishedAt = assertNonEmptyString(body.publishedAt, "发布时间");
    const updatedAt = assertNonEmptyString(body.updatedAt, "更新时间");
    const isOriginal = assertBoolean(body.isOriginal, "原创标记");
    const status = assertStatus(body.status);
    const content = normalizeMarkdownSource(assertNonEmptyString(body.content, "正文"));
    const slug = ensureNoteSlug(rawSlug);

    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new Error("slug 只能包含英文小写、数字和连字符。");
    }

    await compileMDX({ source: content });

    const folder = resolveNoteCategoryFolder(category);
    if (!folder) {
      throw new Error("未识别的分类，请重新选择。");
    }

    const validTopicSlugs = new Set(getAllPublishedTopics().map((topic) => topic.slug));
    const invalidTopicSlugs = topicSlugs.filter((topicSlug) => !validTopicSlugs.has(topicSlug));

    if (invalidTopicSlugs.length > 0) {
      throw new Error(`以下专题不存在或未发布：${invalidTopicSlugs.join(", ")}`);
    }

    const targetDir = path.join(NOTES_ROOT, folder);
    const filePath = path.join(targetDir, `${slug}.mdx`);
    const existingTargetPath = findExistingNotePathBySlug(slug);
    const originalPath = originalSlug ? findExistingNotePathBySlug(originalSlug) : null;

    if (existingTargetPath && existingTargetPath !== originalPath) {
      return NextResponse.json(
        {
          error: `同名 slug 已存在：${slug}。请修改 slug 后重新保存，避免覆盖现有笔记。`,
        },
        { status: 409 },
      );
    }

    fs.mkdirSync(targetDir, { recursive: true });

    const document = serializeNoteDocument({
      title,
      slug,
      summary,
      category,
      tags,
      topicSlugs,
      publishedAt,
      updatedAt,
      isOriginal,
      status,
      content,
    });

    if (originalPath && originalPath !== filePath && fs.existsSync(originalPath)) {
      fs.rmSync(originalPath, { force: true });
    }

    fs.writeFileSync(filePath, document, "utf8");

    return NextResponse.json({
      message:
        status === "draft"
          ? originalSlug
            ? "草稿已更新。确认内容无误后，再把 frontmatter 中的 status 改成 published。"
            : "已生成 draft 笔记文件。确认内容无误后，再把 frontmatter 中的 status 改成 published。"
          : "已生成 published 笔记文件，本地开发环境下可以继续访问详情页确认效果。",
      savedPath: path.relative(process.cwd(), filePath).replace(/\\/g, "/"),
      noteUrl: `/notes/${slug}`,
      status,
      slug,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "导入失败，请稍后重试。",
      },
      { status: 400 },
    );
  }
}