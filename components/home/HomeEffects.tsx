"use client";

import { useEffect } from "react";

/** 首页滚动效果：进入视口淡入、色块从圆角卡片展开到满屏、截图轻微视差。 */
export function HomeEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".hm-reveal"));
    let observer: IntersectionObserver | null = null;
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-in"));
    } else {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.15 },
      );
      reveals.forEach((el) => observer?.observe(el));
    }

    const panels = Array.from(document.querySelectorAll<HTMLElement>(".hm-panel"));
    const shot = document.getElementById("hm-yshot");
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const side = window.innerWidth > 860 ? Math.min(48, window.innerWidth * 0.04) : 12;
      for (const panel of panels) {
        const top = panel.getBoundingClientRect().top;
        const t = Math.min(1, Math.max(0, (vh - top) / (vh * 0.7)));
        const e = 1 - t * t * (3 - 2 * t);
        panel.style.setProperty("--hm-ins", `0px ${(e * side).toFixed(1)}px`);
        panel.style.setProperty("--hm-rad", `${(8 + e * 24).toFixed(1)}px`);
      }
      if (shot) {
        const r = shot.getBoundingClientRect();
        shot.style.transform = `translateY(${((r.top + r.height / 2 - vh / 2) * -0.06).toFixed(1)}px)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    if (!reduce) {
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
