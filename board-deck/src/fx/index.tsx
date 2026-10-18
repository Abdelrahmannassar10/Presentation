import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/* ---------- film grain: one noise tile generated once, jittered with CSS ---------- */
let grainUrl = "";
function noiseTile() {
  if (grainUrl) return grainUrl;
  const c = document.createElement("canvas");
  c.width = c.height = 220;
  const x = c.getContext("2d")!;
  const img = x.createImageData(220, 220);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  grainUrl = c.toDataURL("image/png");
  return grainUrl;
}
export function Grain({ on = true }: { on?: boolean }) {
  const url = useMemo(noiseTile, []);
  if (!on) return null;
  return <div className="grain" style={{ backgroundImage: `url(${url})` }} />;
}

/* ---------- graded photograph with a slow Ken Burns move ---------- */
type PhotoProps = {
  src: string;
  /** 0..1 darkness of the grade */
  dim?: number;
  from?: { x?: number; y?: number; s?: number };
  to?: { x?: number; y?: number; s?: number };
  duration?: number;
  tint?: string;
  saturate?: number;
  style?: CSSProperties;
  gradient?: string;
};
export function Photo({ src, dim = 0.55, from = {}, to = {}, duration = 22, tint, saturate = 0.85, style, gradient }: PhotoProps) {
  const reduce = useReducedMotion();
  return (
    <>
      <motion.div
        className="photo"
        style={{ backgroundImage: `url(${src})`, filter: `saturate(${saturate}) contrast(1.06)`, ...style }}
        initial={{ scale: from.s ?? 1.06, x: from.x ?? 0, y: from.y ?? 0, opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { scale: to.s ?? 1.16, x: to.x ?? -30, y: to.y ?? -10, opacity: 1 }}
        transition={{ duration, ease: "linear", opacity: { duration: 1.6, ease: "easeOut" } }}
      />
      <div className="grade" style={{ background: `rgba(5,8,12,${dim})` }} />
      {tint && <div className="grade" style={{ background: tint, mixBlendMode: "color" }} />}
      <div className="grade" style={{ background: gradient ?? "linear-gradient(90deg, rgba(5,8,12,.92) 0%, rgba(5,8,12,.55) 45%, rgba(5,8,12,.2) 100%)" }} />
    </>
  );
}

/* ---------- headline that rises word by word out of a mask ---------- */
export function Words({ text, show = true, delay = 0, stagger = 0.055, className, style }: { text: string; show?: boolean; delay?: number; stagger?: number; className?: string; style?: CSSProperties }) {
  const words = text.split(" ");
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="wmask">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: show ? "0%" : "110%" }}
              transition={{ duration: 1.05, ease: EASE, delay: show ? delay + i * stagger : 0 }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}

/* ---------- fade/rise for blocks ---------- */
export function Rise({ show = true, delay = 0, y = 34, children, className, style, blur = true }: { show?: boolean; delay?: number; y?: number; children: ReactNode; className?: string; style?: CSSProperties; blur?: boolean }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "none" }}
      animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y, filter: blur ? "blur(10px)" : "none" }}
      transition={{ duration: 0.95, ease: EASE, delay: show ? delay : 0 }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- number that counts up when shown ---------- */
export function CountUp({ to, show = true, duration = 2.2, delay = 0, decimals = 0, prefix = "", suffix = "" }: { to: number; show?: boolean; duration?: number; delay?: number; decimals?: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!show) { setV(0); return; }
    if (reduce) { setV(to); return; }
    let raf = 0;
    const t0 = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / (duration * 1000)));
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setV(to * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, show, duration, delay, reduce]);
  return <span className="num ltr">{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

/* ---------- typewriter for mono captions ---------- */
export function Typer({ text, show = true, delay = 0, speed = 38, caret = true }: { text: string; show?: boolean; delay?: number; speed?: number; caret?: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!show) { setN(0); return; }
    let i = 0;
    let iv: ReturnType<typeof setInterval>;
    const to = setTimeout(() => {
      iv = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(iv); }, speed);
    }, delay * 1000);
    return () => { clearTimeout(to); clearInterval(iv); };
  }, [text, show, delay, speed]);
  return (
    <span>
      {text.slice(0, n)}
      {caret && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: "var(--gold)" }}>▍</motion.span>}
    </span>
  );
}

/* ---------- soft light leaks ---------- */
export function Flares({ a = "var(--gold)", b = "var(--teal)", o = 0.18 }: { a?: string; b?: string; o?: number }) {
  return (
    <>
      <motion.div className="flare" style={{ width: 760, height: 760, background: a, opacity: o, left: -200, top: -260 }} animate={{ x: [0, 120, 0], y: [0, 60, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="flare" style={{ width: 680, height: 680, background: b, opacity: o * 0.8, right: -180, bottom: -240 }} animate={{ x: [0, -100, 0], y: [0, -50, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
    </>
  );
}

/* ---------- letterbox bars ---------- */
export function Letterbox({ on }: { on: boolean }) {
  return (
    <>
      <motion.div className="letterbox top" initial={{ scaleY: 0 }} animate={{ scaleY: on ? 1 : 0 }} transition={{ duration: 1.4, ease: EASE_IN_OUT }} />
      <motion.div className="letterbox bot" initial={{ scaleY: 0 }} animate={{ scaleY: on ? 1 : 0 }} transition={{ duration: 1.4, ease: EASE_IN_OUT }} />
    </>
  );
}

/* ---------- hook: elapsed seconds since a slide became active (for timed sequences) ---------- */
export function useTicker(active: boolean, interval: number, max: number) {
  const [i, setI] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    if (!active) { setI(0); return; }
    setI(0);
    ref.current = setInterval(() => setI((v) => (v >= max ? v : v + 1)), interval);
    return () => clearInterval(ref.current);
  }, [active, interval, max]);
  return i;
}
