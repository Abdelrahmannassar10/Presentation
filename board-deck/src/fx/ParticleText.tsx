import { useEffect, useRef } from "react";

type Props = {
  words: string[];
  /** ms each word holds before morphing to the next; 0 = stay on the last word */
  hold?: number;
  loop?: boolean;
  active: boolean;
  width?: number;
  height?: number;
  font?: string;
  colors?: string[];
  count?: number;
  /** index of the word to show; when set, the sequence is driven from outside */
  index?: number;
  gap?: number;
  dotSize?: number;
};

type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; s: number; a: number; seed: number };

function sample(word: string, w: number, h: number, font: string, gap: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  let size = h * 0.92;
  x.textAlign = "center";
  x.textBaseline = "middle";
  // shrink until the word fits the box
  do {
    x.font = font.replace("{s}", String(Math.round(size)));
    size *= 0.95;
  } while (x.measureText(word).width > w * 0.96 && size > 20);
  x.fillStyle = "#fff";
  x.fillText(word, w / 2, h / 2 + h * 0.04);
  const d = x.getImageData(0, 0, w, h).data;
  const pts: [number, number][] = [];
  for (let yy = 0; yy < h; yy += gap) for (let xx = 0; xx < w; xx += gap) if (d[(yy * w + xx) * 4 + 3] > 140) pts.push([xx, yy]);
  for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
  return pts;
}

export default function ParticleText({ words, hold = 2600, loop = false, active, width = 1920, height = 1080, font = '400 {s}px "Instrument Serif"', colors = ["#E6B35A", "#F2EEE6", "#4FD1C5"], count = 2800, index, gap = 7, dotSize = 2.1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const idxRef = useRef(index ?? 0);
  idxRef.current = index ?? idxRef.current;

  useEffect(() => {
    if (!active) return;
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let raf = 0, alive = true;
    let targets: [number, number][][] = [];
    const ps: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0, tx: width / 2, ty: height / 2,
      s: 0.6 + Math.random() * 1.1, a: 0.35 + Math.random() * 0.65, seed: Math.random() * 1000,
    }));
    let cur = -1, last = performance.now();
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * width;
      mouse.y = ((e.clientY - r.top) / r.height) * height;
    };
    window.addEventListener("pointermove", onMove);

    const go = (i: number) => {
      cur = i;
      const t = targets[i];
      if (!t || !t.length) return;
      ps.forEach((p, k) => {
        const [tx, ty] = t[k % t.length];
        p.tx = tx + (Math.random() - 0.5) * 1.4;
        p.ty = ty + (Math.random() - 0.5) * 1.4;
        // a burst so the morph reads as an explosion and reassembly
        p.vx += (Math.random() - 0.5) * 26;
        p.vy += (Math.random() - 0.5) * 26;
      });
    };

    document.fonts.load(font.replace("{s}", "200")).finally(() => {
      if (!alive) return;
      targets = words.map((w) => sample(w, width, height, font, gap));
      go(idxRef.current);
      last = performance.now();
    });

    const frame = (now: number) => {
      if (!alive) return;
      if (targets.length) {
        if (index === undefined && hold > 0 && now - last > hold) {
          const nx = cur + 1;
          if (nx < words.length) { go(nx); last = now; }
          else if (loop) { go(0); last = now; }
        }
        if (index !== undefined && idxRef.current !== cur) go(idxRef.current);
      }
      ctx.clearRect(0, 0, width, height);
      const t = now / 1000;
      const col = colors[Math.max(0, cur) % colors.length];
      for (const p of ps) {
        const dx = p.tx - p.x, dy = p.ty - p.y;
        p.vx = (p.vx + dx * 0.018) * 0.86;
        p.vy = (p.vy + dy * 0.018) * 0.86;
        // breathing shimmer
        p.vx += Math.sin(t * 1.3 + p.seed) * 0.05;
        p.vy += Math.cos(t * 1.1 + p.seed) * 0.05;
        const mx = p.x - mouse.x, my = p.y - mouse.y, md = mx * mx + my * my;
        if (md < 16000) { const f = (16000 - md) / 16000; p.vx += (mx / 40) * f; p.vy += (my / 40) * f; }
        p.x += p.vx;
        p.y += p.vy;
        const tw = 0.6 + 0.4 * Math.sin(t * 2.2 + p.seed);
        ctx.globalAlpha = p.a * tw;
        ctx.fillStyle = col;
        ctx.fillRect(p.x, p.y, dotSize * p.s, dotSize * p.s);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, words.join("|")]);

  return <canvas ref={ref} width={width} height={height} style={{ position: "absolute", inset: 0, width, height }} />;
}
