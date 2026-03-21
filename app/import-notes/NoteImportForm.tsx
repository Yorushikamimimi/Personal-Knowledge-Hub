"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import {
  ensureNoteSlug,
  inferSummaryFromMarkdown,
  inferTitleFromMarkdown,
  NOTE_CATEGORY_OPTIONS,
  normalizeMarkdownSource,
  parseTagInput,
  splitOptionalFrontmatter,
  todayDateString,
  type NoteImportStatus,
  type NoteTopicOption,
} from "../../lib/note-import";
import type { DraftNoteImportData } from "../../lib/notes";
import { MarkdownPreview } from "./MarkdownPreview";

type NoteImportFormProps = {
  topicOptions: NoteTopicOption[];
  initialDraft?: DraftNoteImportData | null;
};

type SaveResult = {
  ok: boolean;
  message: string;
  noteUrl?: string;
  savedPath?: string;
  status?: NoteImportStatus;
};

const INITIAL_DATE = todayDateString();

export function NoteImportForm({ topicOptions, initialDraft = null }: NoteImportFormProps) {
  const [fileName, setFileName] = useState("");
  const [source, setSource] = useState(initialDraft?.rawContent ?? "");
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [slug, setSlug] = useState(initialDraft?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialDraft));
  const [summary, setSummary] = useState(initialDraft?.summary ?? "");
  const [tagsInput, setTagsInput] = useState(initialDraft?.tags.join(", ") ?? "");
  const [category, setCategory] = useState(initialDraft?.category ?? (NOTE_CATEGORY_OPTIONS[0]?.value ?? "java-backend"));
  const [topicSlugs, setTopicSlugs] = useState<string[]>(initialDraft?.topicSlugs ?? []);
  const [isOriginal, setIsOriginal] = useState(initialDraft?.isOriginal ?? true);
  const [status, setStatus] = useState<NoteImportStatus>(initialDraft?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(initialDraft?.publishedAt ?? INITIAL_DATE);
  const [updatedAt, setUpdatedAt] = useState(initialDraft?.updatedAt ?? INITIAL_DATE);
  const [editingSlug, setEditingSlug] = useState(initialDraft?.slug ?? "");
  const [fileError, setFileError] = useState("");
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null);
  const [isSaving, startSaving] = useTransition();

  useEffect(() => {
    if (!initialDraft) {
      return;
    }

    setSource(initialDraft.rawContent);
    setTitle(initialDraft.title);
    setSlug(initialDraft.slug);
    setSlugTouched(true);
    setSummary(initialDraft.summary);
    setTagsInput(initialDraft.tags.join(", "));
    setCategory(initialDraft.category);
    setTopicSlugs(initialDraft.topicSlugs);
    setIsOriginal(initialDraft.isOriginal);
    setStatus(initialDraft.status);
    setPublishedAt(initialDraft.publishedAt);
    setUpdatedAt(initialDraft.updatedAt);
    setEditingSlug(initialDraft.slug);
    setSaveResult(null);
    setFileError("");
  }, [initialDraft]);

  const tags = useMemo(() => parseTagInput(tagsInput), [tagsInput]);
  const selectedCategory = useMemo(
    () => NOTE_CATEGORY_OPTIONS.find((item) => item.value === category) ?? NOTE_CATEGORY_OPTIONS[0],
    [category],
  );
  const selectedTopics = useMemo(
    () => topicOptions.filter((topic) => topicSlugs.includes(topic.slug)),
    [topicOptions, topicSlugs],
  );

  function syncAutoSlug(nextTitle: string, nextFileName = fileName) {
    if (!slugTouched) {
      setSlug(ensureNoteSlug(nextTitle || nextFileName));
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setSaveResult(null);
    setFileError("");

    if (!selectedFile) {
      return;
    }

    if (!/\.(md|mdx)$/i.test(selectedFile.name)) {
      setFileError("只支持导入 .md 或 .mdx 文件。");
      return;
    }

    const raw = await selectedFile.text();
    const cleaned = normalizeMarkdownSource(raw);

    if (!cleaned) {
      setFileError("文件内容为空，请检查 Markdown 文件后重新导入。");
      return;
    }

    const inferredTitle = inferTitleFromMarkdown(raw, selectedFile.name);
    const inferredSummary = inferSummaryFromMarkdown(raw);

    setFileName(selectedFile.name);
    setSource(cleaned);
    setTitle((current) => current || inferredTitle);
    setSummary((current) => current || inferredSummary);
    setUpdatedAt(INITIAL_DATE);
    syncAutoSlug(inferredTitle, selectedFile.name);
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(ensureNoteSlug(value));
  }

  function handleTopicToggle(topicSlug: string) {
    setTopicSlugs((current) =>
      current.includes(topicSlug) ? current.filter((item) => item !== topicSlug) : [...current, topicSlug],
    );
  }

  function handleReset() {
    setFileName("");
    setSource("");
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setSummary("");
    setTagsInput("");
    setCategory(NOTE_CATEGORY_OPTIONS[0]?.value ?? "java-backend");
    setTopicSlugs([]);
    setIsOriginal(true);
    setStatus("draft");
    setPublishedAt(INITIAL_DATE);
    setUpdatedAt(INITIAL_DATE);
    setEditingSlug("");
    setFileError("");
    setSaveResult(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setSaveResult({ ok: false, message: "标题不能为空，请先补充标题。" });
      return;
    }

    if (!slug.trim()) {
      setSaveResult({ ok: false, message: "slug 不能为空，请先确认链接标识。" });
      return;
    }

    if (!source.trim()) {
      setSaveResult({ ok: false, message: "正文不能为空，请先导入 Markdown 文件。" });
      return;
    }

    startSaving(() => {
      void (async () => {
        try {
          const nextUpdatedAt = todayDateString();
          const response = await fetch("/api/import-notes/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              slug,
              originalSlug: editingSlug || undefined,
              summary: summary.trim() || inferSummaryFromMarkdown(source),
              category,
              tags,
              topicSlugs,
              publishedAt,
              updatedAt: nextUpdatedAt,
              isOriginal,
              status,
              content: source,
            }),
          });

          const result = (await response.json()) as {
            error?: string;
            message?: string;
            noteUrl?: string;
            savedPath?: string;
            status?: NoteImportStatus;
            slug?: string;
          };

          if (!response.ok || !result.message) {
            throw new Error(result.error || "导入失败，请稍后重试。");
          }

          if (result.slug) {
            setEditingSlug(result.slug);
            setSlug(result.slug);
            setSlugTouched(true);
          }
          setUpdatedAt(nextUpdatedAt);
          setSaveResult({
            ok: true,
            message: result.message,
            noteUrl: result.noteUrl,
            savedPath: result.savedPath,
            status: result.status,
          });
        } catch (error) {
          setSaveResult({
            ok: false,
            message: error instanceof Error ? error.message : "导入失败，请稍后重试。",
          });
        }
      })();
    });
  }

  const canSubmit = Boolean(source.trim() && title.trim() && slug.trim());
  const editingMode = Boolean(editingSlug);

  return (
    <div className="import-layout">
      <section className="content-panel import-card">
        <div className="section-header">
          <div>
            <span className="section-kicker">Import Form</span>
            <h2>{editingMode ? "继续编辑草稿" : "导入 Markdown 文件"}</h2>
          </div>
          <span className="inline-code">默认建议先保存为 draft</span>
        </div>

        {editingMode ? (
          <div className="import-alert import-alert--success">
            <p>当前正在编辑已有草稿：{editingSlug}</p>
            <p>保存后会覆盖原草稿；如果你修改了 slug，系统会自动迁移到新文件名。</p>
          </div>
        ) : null}

        <form className="import-form" onSubmit={handleSubmit}>
          <div className="import-field">
            <label className="import-label" htmlFor="note-file">
              Markdown 文件
            </label>
            <input id="note-file" className="import-input" type="file" accept=".md,.mdx,text/markdown" onChange={handleFileChange} />
            <p className="import-helper">支持 .md / .mdx，正文会直接复用，不需要重新手敲。</p>
            {fileName ? <p className="import-helper">当前文件：{fileName}</p> : null}
            {fileError ? <p className="import-alert import-alert--error">{fileError}</p> : null}
          </div>

          <div className="import-grid">
            <div className="import-field">
              <label className="import-label" htmlFor="note-title">
                标题
              </label>
              <input
                id="note-title"
                className="import-input"
                value={title}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  setTitle(nextTitle);
                  syncAutoSlug(nextTitle);
                }}
                placeholder="例如：面试自我介绍表达笔记"
              />
            </div>

            <div className="import-field">
              <label className="import-label" htmlFor="note-slug">
                slug
              </label>
              <input
                id="note-slug"
                className="import-input"
                value={slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="例如：interview-self-introduction-notes"
              />
              <p className="import-helper">链接只支持英文、数字和连字符。若标题是中文，可先用自动值，再手动微调。</p>
            </div>
          </div>

          <div className="import-field">
            <label className="import-label" htmlFor="note-summary">
              摘要
            </label>
            <textarea
              id="note-summary"
              className="import-textarea import-textarea--sm"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="若不填写，系统会根据正文自动生成初版摘要。"
            />
          </div>

          <div className="import-grid">
            <div className="import-field">
              <label className="import-label" htmlFor="note-category">
                分类
              </label>
              <select id="note-category" className="import-input" value={category} onChange={(event) => setCategory(event.target.value)}>
                {NOTE_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedCategory ? <p className="import-helper">{selectedCategory.description}</p> : null}
            </div>

            <div className="import-field">
              <label className="import-label" htmlFor="note-tags">
                标签
              </label>
              <input
                id="note-tags"
                className="import-input"
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="用逗号分隔，例如：interview, communication, intro"
              />
            </div>
          </div>

          <div className="import-field">
            <span className="import-label">关联专题</span>
            <div className="import-topic-grid">
              {topicOptions.map((topic) => {
                const active = topicSlugs.includes(topic.slug);

                return (
                  <label key={topic.slug} className={`import-topic-card${active ? " import-topic-card--active" : ""}`}>
                    <input type="checkbox" checked={active} onChange={() => handleTopicToggle(topic.slug)} />
                    <span className="import-topic-card__title">{topic.title}</span>
                    <span className="import-topic-card__summary">{topic.summary}</span>
                  </label>
                );
              })}
            </div>
            <p className="import-helper">当前版本只允许选择已有 Topic，不在这里新建专题。</p>
          </div>

          <div className="import-grid">
            <div className="import-field">
              <label className="import-label" htmlFor="note-status">
                保存状态
              </label>
              <select id="note-status" className="import-input" value={status} onChange={(event) => setStatus(event.target.value as NoteImportStatus)}>
                <option value="draft">draft（推荐，先预览）</option>
                <option value="published">published（直接发布）</option>
              </select>
            </div>

            <div className="import-field import-field--checkboxes">
              <span className="import-label">内容属性</span>
              <label className="import-checkbox-row">
                <input type="checkbox" checked={isOriginal} onChange={(event) => setIsOriginal(event.target.checked)} />
                <span>标记为原创内容</span>
              </label>
              <p className="import-helper">发布时间：{publishedAt}</p>
              <p className="import-helper">最近更新时间：{updatedAt}</p>
            </div>
          </div>

          <div className="import-field">
            <label className="import-label" htmlFor="note-source">
              正文内容
            </label>
            <textarea
              id="note-source"
              className="import-textarea"
              value={source}
              onChange={(event) => {
                const nextSource = normalizeMarkdownSource(splitOptionalFrontmatter(event.target.value).body);
                setSource(nextSource);
                if (!summary.trim()) {
                  setSummary(inferSummaryFromMarkdown(nextSource));
                }
              }}
              placeholder="导入后可在这里做少量修正。"
            />
          </div>

          <div className="import-actions">
            <button type="submit" className="import-button" disabled={!canSubmit || isSaving}>
              {isSaving ? "保存中..." : editingMode ? "更新草稿文件" : "生成 Note 文件"}
            </button>
            <button type="button" className="import-button import-button--secondary" onClick={handleReset}>
              重新开始
            </button>
            <Link href={editingMode ? "/draft-notes" : "/notes"} className="import-button import-button--ghost">
              {editingMode ? "返回草稿列表" : "返回笔记列表"}
            </Link>
          </div>
        </form>

        {saveResult ? (
          <div className={`import-alert ${saveResult.ok ? "import-alert--success" : "import-alert--error"}`}>
            <p>{saveResult.message}</p>
            {saveResult.savedPath ? <p>保存位置：{saveResult.savedPath}</p> : null}
            {saveResult.ok && saveResult.status === "draft" ? (
              <p>当前文件默认不会出现在 /notes。确认内容无误后，再把 frontmatter 中的 status 改成 published 并重新构建。</p>
            ) : null}
            {saveResult.ok && saveResult.status === "published" && saveResult.noteUrl ? (
              <p>
                已写入发布状态，可前往
                <Link href={saveResult.noteUrl} className="entry-link">
                  文章详情页
                  <span aria-hidden="true">→</span>
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="content-panel import-card import-preview-shell">
        <div className="section-header">
          <div>
            <span className="section-kicker">Preview</span>
            <h2>导入预览</h2>
          </div>
          <span className="inline-code">本地即时渲染预览</span>
        </div>

        <div className="import-preview-meta">
          <h3>{title || "待填写标题"}</h3>
          <p>{summary || "这里会显示摘要预览，方便你在保存前确认内容定位。"}</p>
          <div className="note-meta">
            <span>分类：{selectedCategory?.label ?? "未选择"}</span>
            <span>状态：{status}</span>
            <span>发布时间：{publishedAt}</span>
            <span>更新：{updatedAt}</span>
            <span>{isOriginal ? "原创内容" : "整理内容"}</span>
          </div>

          <div className="tag-list" aria-label="预览标签">
            {(tags.length > 0 ? tags : ["未填写标签"]).map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>

          {selectedTopics.length > 0 ? (
            <div className="tag-list" aria-label="预览专题">
              {selectedTopics.map((topic) => (
                <span key={topic.slug} className="tag-chip">
                  Topic: {topic.title}
                </span>
              ))}
            </div>
          ) : (
            <p className="import-helper">当前还没有关联专题，后续可继续补充。</p>
          )}
        </div>

        {source.trim() ? (
          <MarkdownPreview source={source} />
        ) : (
          <div className="placeholder-card">
            <h3>等待预览内容</h3>
            <p>上传 Markdown 文件后，这里会渲染正文效果，用于确认标题层级、列表、代码块和强调文本是否正常。</p>
          </div>
        )}
      </section>
    </div>
  );
}