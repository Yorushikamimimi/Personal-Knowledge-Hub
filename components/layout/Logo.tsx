"use client";

import { useEffect, useRef } from "react";
import { mountLogo } from "../../lib/suiming-logo.js";

// 碎鸣 logo：静止时是 SVG，鼠标移到品牌链接上时播「碎块归位」（和字标碎落一起动；减弱动态效果时不播）。
// 只按 16 的整数倍显示；先占好 32×32，避免水合前后跳动。
export function Logo({ theme = "light" }: { theme?: "light" | "dark" }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return mountLogo(ref.current, { theme, scale: 2 });
  }, [theme]);
  return <span ref={ref} className="hm-brand__mark" aria-hidden="true" />;
}
