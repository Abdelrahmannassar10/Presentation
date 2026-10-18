import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DECK } from "./deck";
import { LangCtx, type Lang } from "./i18n";
import { EASE, Grain } from "./fx";
import { CATS, REG } from "./data/content";

/* ---------- persistence and the presenter bus ---------- */
const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
type Msg = { type: "state"; idx: number; step: number; lang: Lang } | { type: "cmd"; cmd: "next" | "prev" | "lang"; } | { type: "goto"; idx: number } | { type: "hello" };
function useBus(onMsg: (m: Msg) => void) {
  const cb = useRef(onMsg);
  cb.current = onMsg;
  const chRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    // created inside the effect so StrictMode's mount/unmount/mount never reuses a closed channel
    let ch: BroadcastChannel | null = null;
    try { ch = new BroadcastChannel("gid-deck"); } catch { /* unsupported */ }
    chRef.current = ch;
    if (ch) ch.onmessage = (e) => cb.current(e.data);
    // storage events are the fallback when BroadcastChannel is unavailable (some file:// contexts)
    const onStorage = (e: StorageEvent) => { if (e.key === "gid-deck-msg" && e.newValue) { try { cb.current(JSON.parse(e.newValue).m); } catch { /* ignore */ } } };
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener("storage", onStorage); chRef.current = null; ch?.close(); };
  }, []);
  return useCallback((m: Msg) => {
    try { chRef.current?.postMessage(m); } catch { /* channel closing */ }
    store.set("gid-deck-msg", JSON.stringify({ m, t: Date.now() }));
  }, []);
}

function readHash(): [number, number] {
  const m = location.hash.match(/#\/(\d+)(?:\/(\d+))?/);
  if (!m) return [0, 0];
  const i = Math.min(DECK.length - 1, Math.max(0, +m[1] - 1));
  return [i, Math.min(DECK[i].steps - 1, +(m[2] ?? 0))];
}

/* ---------- scale the 1920x1080 stage to the window ---------- */
function useScale() {
  const [s, setS] = useState(1);
  useEffect(() => {
    const f = () => setS(Math.min(innerWidth / 1920, innerHeight / 1080));
    f();
    addEventListener("resize", f);
    return () => removeEventListener("resize", f);
  }, []);
  return s;
}

const T = (lang: Lang, pair: [string, string]) => (lang === "ar" ? pair[1] : pair[0]);

export default function App() {
  if (new URLSearchParams(location.search).has("presenter")) return <Presenter />;
  return <Deck />;
}

/* =================================================================== */
function Deck() {
  const [[idx, step], setPos] = useState<[number, number]>(readHash);
  const [dir, setDir] = useState(1);
  const [lang, setLang] = useState<Lang>(() => (store.get("gid-lang") === "ar" ? "ar" : "en"));
  const [grain, setGrain] = useState(true);
  const [overlay, setOverlay] = useState<null | "overview" | "help" | "register">(null);
  const [notes, setNotes] = useState(false);
  const [black, setBlack] = useState(false);
  const [idle, setIdle] = useState(false);
  const [hint, setHint] = useState(true);
  const scale = useScale();
  const slide = DECK[idx];

  const go = useCallback((d: 1 | -1) => {
    setDir(d);
    setPos(([i, s]) => {
      if (d > 0) {
        if (s < DECK[i].steps - 1) return [i, s + 1];
        if (i < DECK.length - 1) return [i + 1, 0];
        return [i, s];
      }
      if (s > 0) return [i, s - 1];
      if (i > 0) return [i - 1, DECK[i - 1].steps - 1];
      return [i, s];
    });
  }, []);
  const jump = useCallback((i: number, s = 0) => { setDir(i >= idx ? 1 : -1); setPos([Math.max(0, Math.min(DECK.length - 1, i)), s]); }, [idx]);

  const send = useBus((m) => {
    if (m.type === "cmd") { if (m.cmd === "next") go(1); else if (m.cmd === "prev") go(-1); else setLang((l) => (l === "en" ? "ar" : "en")); }
    else if (m.type === "goto") jump(m.idx);
    else if (m.type === "hello") send({ type: "state", idx, step, lang });
  });
  useEffect(() => {
    history.replaceState(null, "", `#/${idx + 1}${step ? "/" + step : ""}`);
    send({ type: "state", idx, step, lang });
  }, [idx, step, lang, send]);
  useEffect(() => { store.set("gid-lang", lang); }, [lang]);
  useEffect(() => { const to = setTimeout(() => setHint(false), 6000); return () => clearTimeout(to); }, []);

  /* keyboard: arrows, space and PageUp/PageDown (presentation clickers) */
  const digits = useRef("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) { if (e.key === "Escape") setOverlay(null); return; }
      // while the register is open, typing must never trigger deck shortcuts
      if (overlay === "register") {
        if (e.key === "Escape") setOverlay(null);
        else if (e.key.length === 1) document.querySelector<HTMLInputElement>(".reg-search")?.focus();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (/^\d$/.test(k)) { digits.current += k; return; }
      if (k === "Enter" && digits.current) { jump(+digits.current - 1); digits.current = ""; return; }
      digits.current = "";
      if (overlay && k === "Escape") { setOverlay(null); return; }
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); if (black) setBlack(false); else go(1); }
      else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); go(-1); }
      else if (k === "Home") jump(0);
      else if (k === "End") jump(DECK.length - 1);
      else if (k === "f" || k === "F5") { e.preventDefault(); document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
      else if (k === "o" || k === "Escape") setOverlay((o) => (o === "overview" ? null : "overview"));
      else if (k === "r") { e.preventDefault(); setOverlay((o) => (o === "register" ? null : "register")); }
      else if (k === "?" || k === "h") setOverlay((o) => (o === "help" ? null : "help"));
      else if (k === "l") setLang((l) => (l === "en" ? "ar" : "en"));
      else if (k === "n") setNotes((v) => !v);
      else if (k === "g") setGrain((v) => !v);
      else if (k === "b" || k === ".") setBlack((v) => !v);
      else if (k === "p") window.open(location.pathname + "?presenter" + location.hash, "gid-presenter", "width=1280,height=800");
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [go, jump, overlay, black]);

  /* wheel and swipe */
  const wheelLock = useRef(0);
  const onWheel = (e: React.WheelEvent) => {
    if (overlay) return;
    const now = Date.now();
    if (now < wheelLock.current || Math.abs(e.deltaY) < 30) return;
    wheelLock.current = now + 900;
    go(e.deltaY > 0 ? 1 : -1);
  };
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => { touch.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: React.PointerEvent) => {
    const t0 = touch.current;
    touch.current = null;
    if (!t0 || overlay) return;
    if ((e.target as HTMLElement).closest("button, input, [data-interactive]")) return;
    const dx = e.clientX - t0.x, dy = e.clientY - t0.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? (lang === "ar" ? -1 : 1) : (lang === "ar" ? 1 : -1));
    else if (Math.abs(dx) < 6 && Math.abs(dy) < 6 && e.pointerType === "mouse" && e.button === 0) go(e.clientX < innerWidth * 0.25 ? -1 : 1);
  };

  /* hide the cursor when idle, like a video player */
  useEffect(() => {
    let to: ReturnType<typeof setTimeout>;
    const wake = () => { setIdle(false); clearTimeout(to); to = setTimeout(() => setIdle(true), 2500); };
    addEventListener("pointermove", wake);
    wake();
    return () => { removeEventListener("pointermove", wake); clearTimeout(to); };
  }, []);

  const progress = (idx + (step + 1) / slide.steps) / DECK.length;
  const C = slide.C;
  const showChrome = slide.chrome !== false;

  return (
    <LangCtx.Provider value={lang}>
      <div className={`viewport ${idle && !overlay ? "cursor-hide" : ""}`} onWheel={onWheel} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className="stage" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} style={{ transform: `scale(${scale})`, transformOrigin: "center", marginLeft: -960, marginTop: -540 }}>
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={idx}
              className="slide"
              custom={dir}
              initial={{ opacity: 0, scale: 1.06, filter: "blur(16px)", x: dir * 40 }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", x: 0, transition: { duration: 0.9, ease: EASE } }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(10px)", x: dir * -40, transition: { duration: 0.45, ease: [0.4, 0, 1, 1] } }}
            >
              <C step={step} active />
            </motion.div>
          </AnimatePresence>

          <div className="vignette" />
          <Grain on={grain} />

          <AnimatePresence>
            {showChrome && (
              <motion.div key="chrome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
                <div className="chrome tl"><span className="mark">G</span><span>GID · {T(lang, ["IT & Call Center", "تقنية المعلومات ومركز الاتصال"])}</span></div>
                <div className="chrome tr">
                  <AnimatePresence mode="wait">
                    <motion.span key={idx + lang} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4 }}>{T(lang, slide.chapter)}</motion.span>
                  </AnimatePresence>
                </div>
                <div className="chrome bl"><span>{T(lang, ["Confidential · Board of Directors · October 2026", "سري · مجلس الإدارة · أكتوبر 2026"])}</span></div>
                <div className="chrome br">
                  {slide.steps > 1 && <span className="stepdots">{Array.from({ length: slide.steps }, (_, i) => <i key={i} className={i <= step ? "on" : ""} />)}</span>}
                  <span className="ltr">{String(idx + 1).padStart(2, "0")} <span style={{ opacity: 0.5 }}>/ {DECK.length}</span></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div className="progress" animate={{ scaleX: progress }} transition={{ duration: 0.8, ease: EASE }} style={{ width: "100%" }} />
        </div>

        <div className="hint" style={{ opacity: hint && !overlay ? 1 : 0 }}>→ / SPACE · F FULLSCREEN · ? HELP</div>
      </div>

      {notes && (
        <div className="notes" dir={lang === "ar" ? "rtl" : "ltr"}>
          <span className="label">{T(lang, ["Speaker notes", "ملاحظات المتحدث"])} · {idx + 1}/{DECK.length} · {T(lang, ["step", "خطوة"])} {step + 1}/{slide.steps}</span>
          {T(lang, slide.notes)}
        </div>
      )}
      {black && <div className="blackout" onClick={() => setBlack(false)} />}

      <AnimatePresence>
        {overlay && (
          <motion.div key={overlay} className="overlay" dir={lang === "ar" ? "rtl" : "ltr"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {overlay === "overview" && <Overview lang={lang} idx={idx} onPick={(i) => { jump(i); setOverlay(null); }} onClose={() => setOverlay(null)} />}
            {overlay === "help" && <Help lang={lang} onClose={() => setOverlay(null)} />}
            {overlay === "register" && <Register lang={lang} onClose={() => setOverlay(null)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </LangCtx.Provider>
  );
}

/* ---------- overlays ---------- */
function Overview({ lang, idx, onPick, onClose }: { lang: Lang; idx: number; onPick: (i: number) => void; onClose: () => void }) {
  return (
    <div className="ov-in">
      <div className="ov-head">
        <h2>{T(lang, ["All scenes", "جميع المشاهد"])}</h2>
        <span className="label">{T(lang, ["Click a scene to jump · O or Esc to close", "اختر مشهداً للانتقال · O أو Esc للإغلاق"])}</span>
        <button className="ov-close" onClick={onClose}>{T(lang, ["Close", "إغلاق"])}</button>
      </div>
      <div className="thumbs">
        {DECK.map((s, i) => (
          <motion.button key={s.id} className={`thumb ${i === idx ? "on" : ""}`} onClick={() => onPick(i)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}>
            <div className="ph" style={{ backgroundImage: `url(${s.thumb})` }}><b>{String(i + 1).padStart(2, "0")}</b></div>
            <div className="tt"><div className="label" style={{ fontSize: 11 }}>{T(lang, s.chapter)}</div>{T(lang, s.title)}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Help({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const rows: [string, string, string][] = [
    ["→  Space  PgDn", "Next step or scene (clickers work)", "الخطوة أو المشهد التالي (يعمل مع أجهزة التحكم)"],
    ["←  PgUp", "Previous", "السابق"],
    ["F", "Fullscreen", "ملء الشاشة"],
    ["P", "Open presenter window (notes, timer, next scene)", "نافذة المقدم (ملاحظات ومؤقت والمشهد التالي)"],
    ["N", "Speaker notes on this screen", "ملاحظات المتحدث على هذه الشاشة"],
    ["O  Esc", "Scene overview", "عرض كل المشاهد"],
    ["R", "Searchable register of all 279 deliverables", "سجل الإنجازات الـ 279 القابل للبحث"],
    ["L", "English / العربية", "English / العربية"],
    ["B", "Black screen (pause)", "شاشة سوداء (إيقاف مؤقت)"],
    ["G", "Film grain on / off", "تشغيل أو إيقاف تأثير الفيلم"],
    ["1 2 … Enter", "Jump to scene number", "الانتقال إلى مشهد برقمه"],
    ["Home  End", "First / last scene", "المشهد الأول / الأخير"],
  ];
  return (
    <div className="ov-in" style={{ maxWidth: 1000 }}>
      <div className="ov-head">
        <h2>{T(lang, ["Presenter controls", "أدوات التحكم"])}</h2>
        <button className="ov-close" onClick={onClose}>{T(lang, ["Close", "إغلاق"])}</button>
      </div>
      <div className="keys">{rows.map(([k, en, ar]) => <div key={k}><kbd className="ltr">{k}</kbd><span>{T(lang, [en, ar])}</span></div>)}</div>
      <p className="muted" style={{ marginTop: 26 }}>{T(lang, ["Click the right three-quarters of the screen to advance, the left quarter to go back. Swipe on touch screens.", "انقر على يمين الشاشة للتقدم وعلى ربعها الأيسر للرجوع، أو اسحب على الشاشات اللمسية."])}</p>
    </div>
  );
}

function Register({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [year, setYear] = useState("all");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return REG.filter((r) => (year === "all" || r.q.startsWith(year)) && (cat === "all" || r.c.includes(cat)) && (!s || `${r.id} ${r.a} ${r.i} ${r.n} ${r.th}`.toLowerCase().includes(s)));
  }, [q, year, cat]);
  return (
    <div className="ov-in">
      <div className="ov-head">
        <h2>{T(lang, ["Achievement register", "سجل الإنجازات"])}</h2>
        <span className="label">{list.length} / 279</span>
        <button className="ov-close" onClick={onClose}>{T(lang, ["Close", "إغلاق"])}</button>
      </div>
      <div className="reg-tools">
        <input className="reg-search" autoFocus placeholder={T(lang, ["Search any system, site or colleague…", "ابحث عن نظام أو موقع أو زميل…"])} value={q} onChange={(e) => setQ(e.target.value)} />
        {["all", "2023", "2024", "2025", "2026"].map((y) => <button key={y} className={`pill ${year === y ? "on" : ""}`} onClick={() => setYear(y)}>{y === "all" ? T(lang, ["All years", "كل السنوات"]) : y}</button>)}
      </div>
      <div className="reg-tools">
        {CATS.map(([k, en, ar]) => <button key={k} className={`pill ${cat === k ? "on" : ""}`} onClick={() => setCat(k)}>{T(lang, [en, ar])}</button>)}
      </div>
      {lang === "ar" && <p className="muted" style={{ marginBottom: 12 }}>نص السجل باللغة الإنجليزية كما ورد في التقرير.</p>}
      <div dir="ltr">
        {list.map((r) => (
          <div key={r.id} className="reg-row">
            <button onClick={() => setOpen(open === r.id ? null : r.id)}>
              <span className="reg-id">{r.id}</span>
              <span>{r.a}{r.p && <span className="prog-tag">IN PROGRESS</span>}</span>
              <span className="reg-q">{r.q} · {r.th}</span>
            </button>
            {open === r.id && (
              <div className="reg-more">
                <div><b className="teal">Impact</b>{r.i}</div>
                <div><b style={{ color: "var(--amber)" }}>If not delivered</b>{r.n}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- presenter window ---------- */
function Presenter() {
  const [st, setSt] = useState<{ idx: number; step: number; lang: Lang }>({ idx: 0, step: 0, lang: "en" });
  const [t0, setT0] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const send = useBus((m) => { if (m.type === "state") setSt({ idx: m.idx, step: m.step, lang: m.lang }); });
  useEffect(() => { send({ type: "hello" }); const iv = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(iv); }, [send]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); send({ type: "cmd", cmd: "next" }); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); send({ type: "cmd", cmd: "prev" }); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [send]);
  const s = DECK[st.idx], nx = DECK[st.idx + 1];
  const el = Math.floor((now - t0) / 1000);
  const C = s.C;
  return (
    <LangCtx.Provider value={st.lang}>
      <div className="presenter">
        <div className="pane" style={{ display: "flex", alignItems: "center", gap: 28, gridColumn: "1 / -1" }}>
          <div className="timer ltr">{String(Math.floor(el / 60)).padStart(2, "0")}:{String(el % 60).padStart(2, "0")}</div>
          <button className="ov-close" style={{ marginInlineStart: 0 }} onClick={() => setT0(Date.now())}>Reset timer</button>
          <div className="label">{new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
          <div className="btns" style={{ marginInlineStart: "auto" }}>
            <button onClick={() => send({ type: "cmd", cmd: "prev" })}>← Prev</button>
            <button onClick={() => send({ type: "cmd", cmd: "next" })} style={{ background: "var(--gold)", color: "#111", borderColor: "var(--gold)" }}>Next →</button>
            <button onClick={() => send({ type: "cmd", cmd: "lang" })}>EN / ع</button>
          </div>
        </div>
        <div className="pane" style={{ padding: 0, overflow: "hidden", position: "relative" }}>
          <PreviewStage><C step={st.step} active /></PreviewStage>
        </div>
        <div className="pane" style={{ display: "grid", gridTemplateRows: "auto 1fr auto", gap: 16 }}>
          <div>
            <div className="label">{st.idx + 1} / {DECK.length} · step {st.step + 1} / {s.steps} · {T(st.lang, s.chapter)}</div>
            <h3>{T(st.lang, s.title)}</h3>
          </div>
          <div className="nt" dir={st.lang === "ar" ? "rtl" : "ltr"}>{T(st.lang, s.notes)}</div>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
            <div className="label">Up next</div>
            <div style={{ fontSize: 20, marginTop: 4 }}>{st.step < s.steps - 1 ? `Step ${st.step + 2} of this scene` : nx ? T(st.lang, nx.title) : "End of deck"}</div>
          </div>
        </div>
        <div className="pane" style={{ gridColumn: "1 / -1", display: "flex", gap: 8, overflowX: "auto", padding: 12 }}>
          {DECK.map((d, i) => (
            <button key={d.id} onClick={() => send({ type: "goto", idx: i })} style={{ flex: "none", width: 120, borderRadius: 10, overflow: "hidden", border: `1px solid ${i === st.idx ? "var(--gold)" : "var(--line)"}`, textAlign: "start" }}>
              <div style={{ height: 60, backgroundImage: `url(${d.thumb})`, backgroundSize: "cover", filter: "brightness(.5)" }} />
              <div style={{ fontSize: 11, padding: "4px 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i + 1}. {T(st.lang, d.title)}</div>
            </button>
          ))}
        </div>
      </div>
    </LangCtx.Provider>
  );
}
function PreviewStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.4);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setS(Math.min(e.contentRect.width / 1920, e.contentRect.height / 1080)));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div className="stage" style={{ position: "relative", left: 0, top: 0, transform: `scale(${s})`, transformOrigin: "center", flex: "none", margin: `${(-1080 * (1 - s)) / 2}px ${(-1920 * (1 - s)) / 2}px` }}>
        {children}
      </div>
    </div>
  );
}
