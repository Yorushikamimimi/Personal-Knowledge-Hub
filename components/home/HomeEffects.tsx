"use client";

import { useEffect } from "react";

/** 首页滚动效果：进入视口淡入、色块从圆角卡片展开到满屏、截图轻微视差，以及从截图取色。 */
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

    const swatchHost = document.getElementById("hm-ysw");
    const img = new window.Image();
    img.onload = () => {
      if (!swatchHost) return;
      try {
        const canvas = document.createElement("canvas");
        const w = 40;
        const h = 20;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, img.width * 0.13, img.height * 0.38, img.width * 0.52, img.height * 0.38, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        const points: [number, number, number][] = [];
        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max - min > 60 && max > 90) points.push([r, g, b]);
        }
        if (points.length < 6) return;
        const hue = ([r, g, b]: [number, number, number]) => Math.atan2(g - b, r - g);
        points.sort((a, b) => hue(a) - hue(b));
        swatchHost.replaceChildren(
          ...Array.from({ length: 6 }, (_, k) => {
            const p = points[Math.floor(((k + 0.5) / 6) * points.length)];
            const chip = document.createElement("i");
            chip.style.background = `rgb(${p.join(",")})`;
            chip.style.transitionDelay = `${k * 0.08}s`;
            return chip;
          }),
        );
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => swatchHost.classList.add("is-in")));
      } catch {
        // 取色失败时不显示色块，不影响页面其余部分。
      }
    };
    img.src = "/images/home/yoru-workbench.jpg";

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
