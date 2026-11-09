"use client";

import { useEffect, useRef } from "react";
import { mountWordmark } from "../../lib/suiming-wordmark.js";

// 碎鸣像素字标：静止时是 SVG，鼠标移到品牌链接上时播碎落动效（减弱动态效果时不播）。
// 只用整数倍缩放；先占好 50×24，避免水合前后跳动。
export function Wordmark({ theme = "light" }: { theme?: "light" | "dark" }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return mountWordmark(ref.current, { theme, scale: 2 });
  }, [theme]);
  return <span ref={ref} className="hm-brand__wordmark" role="img" aria-label="碎鸣" />;
}
