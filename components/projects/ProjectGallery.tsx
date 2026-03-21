"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectScreenshot } from "../../lib/projects";

type ProjectGalleryProps = {
  title: string;
  screenshots: ProjectScreenshot[];
};

function getSafeNextIndex(currentIndex: number | null, screenshotsLength: number, direction: "prev" | "next") {
  if (screenshotsLength <= 0) {
    return null;
  }

  const fallback = currentIndex == null ? 0 : currentIndex;
  if (direction === "prev") {
    return (fallback - 1 + screenshotsLength) % screenshotsLength;
  }

  return (fallback + 1) % screenshotsLength;
}

export function ProjectGallery({ title, screenshots }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  const activeScreenshot = useMemo(() => {
    if (activeIndex == null) {
      return null;
    }

    return screenshots[activeIndex] ?? null;
  }, [activeIndex, screenshots]);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    if (activeIndex == null || screenshots.length <= 0) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => getSafeNextIndex(current, screenshots.length, "next"));
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => getSafeNextIndex(current, screenshots.length, "prev"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, screenshots.length]);

  useEffect(() => {
    if (activeIndex == null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex]);

  const lightboxNode =
    activeScreenshot && portalRoot
      ? createPortal(
          <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${title} 截图预览`}>
            <button
              type="button"
              className="gallery-lightbox__backdrop"
              aria-label="关闭预览"
              onClick={() => setActiveIndex(null)}
            />

            <div className="gallery-lightbox__panel" onClick={(event) => event.stopPropagation()}>
              <div className="gallery-lightbox__toolbar">
                <div>
                  <strong>{activeScreenshot.alt}</strong>
                  <span>
                    {(activeIndex ?? 0) + 1} / {screenshots.length}
                  </span>
                </div>

                <div className="gallery-lightbox__actions">
                  {screenshots.length > 1 ? (
                    <>
                      <button
                        type="button"
                        className="gallery-lightbox__control"
                        onClick={() => setActiveIndex((current) => getSafeNextIndex(current, screenshots.length, "prev"))}
                      >
                        上一张
                      </button>
                      <button
                        type="button"
                        className="gallery-lightbox__control"
                        onClick={() => setActiveIndex((current) => getSafeNextIndex(current, screenshots.length, "next"))}
                      >
                        下一张
                      </button>
                    </>
                  ) : null}
                  <button type="button" className="gallery-lightbox__control" onClick={() => setActiveIndex(null)}>
                    关闭
                  </button>
                </div>
              </div>

              <div className="gallery-lightbox__content">
                <img src={activeScreenshot.src} alt={activeScreenshot.alt} className="gallery-lightbox__image" />
              </div>

              <p className="gallery-lightbox__description">{activeScreenshot.caption}</p>

              {screenshots.length > 1 ? (
                <div className="gallery-lightbox__thumbs" aria-label={`${title} 缩略图切换`}>
                  {screenshots.map((screenshot, index) => {
                    const active = index === activeIndex;
                    const className = active
                      ? "gallery-lightbox__thumb gallery-lightbox__thumb--active"
                      : "gallery-lightbox__thumb";

                    return (
                      <button
                        key={screenshot.src}
                        type="button"
                        className={className}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`切换到：${screenshot.alt}`}
                      >
                        <img src={screenshot.src} alt="" className="gallery-lightbox__thumb-image" loading="lazy" />
                        <span className="gallery-lightbox__thumb-label">{screenshot.alt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>,
          portalRoot,
        )
      : null;

  return (
    <>
      <div className="project-shot-grid" aria-label={`${title} 截图列表`}>
        {screenshots.map((screenshot, index) => (
          <button
            key={screenshot.src}
            type="button"
            className="project-shot-card"
            onClick={() => setActiveIndex(index)}
            aria-label={`查看大图：${screenshot.alt}`}
          >
            <img src={screenshot.src} alt={screenshot.alt} className="project-shot-card__image" loading="lazy" />
            <span className="project-shot-card__hint">点击查看大图</span>
            <span className="project-shot-card__caption">
              <strong>{screenshot.alt}</strong>
              <span>{screenshot.caption}</span>
            </span>
          </button>
        ))}
      </div>
      {lightboxNode}
    </>
  );
}
