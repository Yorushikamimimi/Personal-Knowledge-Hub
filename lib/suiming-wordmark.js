// 碎鸣像素字标 · 碎落动效。由 tools/build_wordmark.py 生成，不要手改。
// 用法：mountWordmark(容器元素, { theme: "light" | "dark", scale: 2 })
// 静止时显示 SVG；鼠标移到 hoverTarget（默认是最近的 <a>，没有就是容器）上时，
// 两个字从左往右碎开往下掉，停一下，再飞回来拼好，最后碎块落下。
// 系统开了"减弱动态效果"时不播。返回一个清理函数。
const DATA = {"w":25,"h":12,"pixels":[[8,0,"X"],[20,0,"X"],[0,1,"X"],[1,1,"X"],[2,1,"X"],[3,1,"X"],[4,1,"X"],[6,1,"X"],[7,1,"X"],[8,1,"X"],[9,1,"X"],[10,1,"X"],[11,1,"X"],[19,1,"X"],[3,2,"X"],[18,2,"X"],[19,2,"X"],[20,2,"X"],[21,2,"X"],[22,2,"X"],[2,3,"X"],[7,3,"X"],[10,3,"X"],[13,3,"X"],[14,3,"X"],[15,3,"X"],[18,3,"X"],[22,3,"X"],[1,4,"X"],[2,4,"X"],[3,4,"X"],[4,4,"X"],[6,4,"X"],[9,4,"X"],[13,4,"X"],[15,4,"X"],[18,4,"X"],[20,4,"X"],[22,4,"X"],[0,5,"X"],[1,5,"X"],[4,5,"X"],[13,5,"X"],[15,5,"X"],[18,5,"X"],[19,5,"X"],[20,5,"X"],[21,5,"X"],[22,5,"X"],[23,5,"X"],[24,5,"X"],[1,6,"X"],[4,6,"X"],[6,6,"X"],[7,6,"X"],[8,6,"X"],[9,6,"X"],[10,6,"X"],[11,6,"X"],[13,6,"X"],[14,6,"X"],[15,6,"X"],[24,6,"X"],[1,7,"X"],[2,7,"X"],[3,7,"X"],[4,7,"X"],[8,7,"X"],[17,7,"X"],[18,7,"X"],[19,7,"X"],[20,7,"X"],[21,7,"X"],[22,7,"X"],[24,7,"X"],[8,8,"X"],[24,8,"X"],[23,9,"X"],[7,10,"f"],[21,10,"X"],[22,10,"X"]],"fragAttach":[8,9],"colors":{"dark":{"body":"#F3E5AB","accent":"#FFD166"},"light":{"body":"#14182E","accent":"#E69138"}},"svg":{"dark":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 25 12\" shape-rendering=\"crispEdges\" role=\"img\" aria-label=\"碎鸣\"><path fill=\"#F3E5AB\" d=\"M8 0h1v1h-1zM20 0h1v1h-1zM0 1h5v1h-5zM6 1h6v1h-6zM19 1h1v1h-1zM3 2h1v1h-1zM18 2h5v1h-5zM2 3h1v1h-1zM7 3h1v1h-1zM10 3h1v1h-1zM13 3h3v1h-3zM18 3h1v1h-1zM22 3h1v1h-1zM1 4h4v1h-4zM6 4h1v1h-1zM9 4h1v1h-1zM13 4h1v1h-1zM15 4h1v1h-1zM18 4h1v1h-1zM20 4h1v1h-1zM22 4h1v1h-1zM0 5h2v1h-2zM4 5h1v1h-1zM13 5h1v1h-1zM15 5h1v1h-1zM18 5h7v1h-7zM1 6h1v1h-1zM4 6h1v1h-1zM6 6h6v1h-6zM13 6h3v1h-3zM24 6h1v1h-1zM1 7h4v1h-4zM8 7h1v1h-1zM17 7h6v1h-6zM24 7h1v1h-1zM8 8h1v1h-1zM24 8h1v1h-1zM23 9h1v1h-1zM21 10h2v1h-2z\"/><path fill=\"#FFD166\" d=\"M7 10h1v1h-1z\"/></svg>","light":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 25 12\" shape-rendering=\"crispEdges\" role=\"img\" aria-label=\"碎鸣\"><path fill=\"#14182E\" d=\"M8 0h1v1h-1zM20 0h1v1h-1zM0 1h5v1h-5zM6 1h6v1h-6zM19 1h1v1h-1zM3 2h1v1h-1zM18 2h5v1h-5zM2 3h1v1h-1zM7 3h1v1h-1zM10 3h1v1h-1zM13 3h3v1h-3zM18 3h1v1h-1zM22 3h1v1h-1zM1 4h4v1h-4zM6 4h1v1h-1zM9 4h1v1h-1zM13 4h1v1h-1zM15 4h1v1h-1zM18 4h1v1h-1zM20 4h1v1h-1zM22 4h1v1h-1zM0 5h2v1h-2zM4 5h1v1h-1zM13 5h1v1h-1zM15 5h1v1h-1zM18 5h7v1h-7zM1 6h1v1h-1zM4 6h1v1h-1zM6 6h6v1h-6zM13 6h3v1h-3zM24 6h1v1h-1zM1 7h4v1h-4zM8 7h1v1h-1zM17 7h6v1h-6zM24 7h1v1h-1zM8 8h1v1h-1zM24 8h1v1h-1zM23 9h1v1h-1zM21 10h2v1h-2z\"/><path fill=\"#E69138\" d=\"M7 10h1v1h-1z\"/></svg>"}};

export function mountWordmark(el, opts = {}) {
  const theme = opts.theme === "dark" ? "dark" : "light";
  const scale = Math.max(1, Math.round(opts.scale || 2));
  const pal = opts.colors || DATA.colors[theme];
  const { w: W, h: H } = DATA;
  const M = { l: 4, r: 4, t: 4, b: 18 }; // 画布四周给碎片留的余量（格）

  el.style.position = el.style.position || "relative";
  el.style.display = el.style.display || "inline-block";
  el.style.width = W * scale + "px";
  el.style.height = H * scale + "px";
  el.innerHTML = DATA.svg[theme];
  const still = el.firstElementChild;
  still.style.width = "100%"; still.style.height = "100%"; still.style.display = "block";

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return () => {};

  const dpr = window.devicePixelRatio || 1;
  const cw = (W + M.l + M.r) * scale, ch = (H + M.t + M.b) * scale;
  const cv = document.createElement("canvas");
  cv.width = cw * dpr; cv.height = ch * dpr;
  Object.assign(cv.style, { position: "absolute", left: -M.l * scale + "px", top: -M.t * scale + "px",
    width: cw + "px", height: ch + "px", pointerEvents: "none", visibility: "hidden" });
  cv.setAttribute("aria-hidden", "true");
  el.appendChild(cv);
  const ctx = cv.getContext("2d");
  ctx.scale(dpr, dpr);

  // 固定随机：每次播放一样
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const PIX = DATA.pixels.map(([x, y, k]) => ({ x, y, frag: k === "f", r1: rnd(), r2: rnd(), r3: rnd() }));

  const SPREAD = 0.9, CRUMBLE = 1.0, GAP = 0.45, BSPREAD = 0.8, BACK = 1.0, DROP = 0.35;
  const BACK_START = SPREAD + CRUMBLE + GAP, ASSEMBLED = BACK_START + BSPREAD + BACK;
  const END = ASSEMBLED + DROP + 0.3;
  const ease = (u) => 1 - Math.pow(1 - u, 3);

  function spread(p, s) { // 0 = 在原位，1 = 完全掉落
    const order = (p.x / W) * 0.85 + p.r3 * 0.15;
    const t0 = order * SPREAD;
    if (s < t0) return 0;
    if (s < BACK_START) return Math.min(1, (s - t0) / CRUMBLE);
    const b0 = BACK_START + order * BSPREAD;
    if (s < b0) return 1;
    return 1 - ease(Math.min(1, (s - b0) / BACK));
  }
  function draw(s) {
    ctx.clearRect(0, 0, cw, ch);
    for (const p of PIX) {
      let hx = p.x, hy = p.y;
      if (p.frag && s > SPREAD + CRUMBLE && s < ASSEMBLED + DROP) [hx, hy] = DATA.fragAttach;
      const t = spread(p, s);
      const vx = (p.r1 - 0.5) * 5, pop = -(1 + p.r2 * 2);
      const x = hx + vx * t, y = hy + pop * t + 16 * t * t;
      const a = t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45;
      if (a <= 0.02) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = p.frag ? pal.accent : pal.body;
      ctx.fillRect(Math.round((x + M.l) * scale), Math.round((y + M.t) * scale), scale, scale);
    }
    ctx.globalAlpha = 1;
  }

  let raf = 0, t0 = 0;
  function frame(ts) {
    if (!t0) t0 = ts;
    const s = (ts - t0) / 1000;
    if (s >= END) { stop(); return; }
    draw(s);
    raf = requestAnimationFrame(frame);
  }
  function play() {
    if (raf) return; // 正在播就不打断
    t0 = 0; still.style.visibility = "hidden"; cv.style.visibility = "visible";
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf); raf = 0;
    cv.style.visibility = "hidden"; still.style.visibility = "visible";
  }
  const target = opts.hoverTarget || el.closest("a") || el;
  target.addEventListener("mouseenter", play);
  return () => { stop(); target.removeEventListener("mouseenter", play); cv.remove(); };
}
