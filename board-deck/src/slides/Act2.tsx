import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useT, useLang } from "../i18n";
import { CountUp, EASE, EASE_IN_OUT, Flares, Photo, Rise, Words, useTicker } from "../fx";
import { IMG } from "../assets/img";
import { BA, CRISES, KPIS, LAYERS, PROG, Q, QP, QTH, TOTAL, YEARS } from "../data/content";
import type { SlideProps } from "./types";

/* =============== 06 · Delivery rhythm =============== */
export function Rhythm({ step, active }: SlideProps) {
  const t = useT();
  const [hover, setHover] = useState<number | null>(null);
  const H = 400, max = Math.max(...Q);
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 70% 0%, #10202c 0%, var(--ink) 65%)" }}>
      <Flares o={0.1} />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 02 · Delivery", "الفصل 02 · الإنجاز")}</div></Rise>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginTop: 24 }}>
          <h2 className="h2">
            <Words text={t(`${TOTAL} deliverables.`, `${TOTAL} إنجازاً.`)} show={active} delay={0.2} /><br />
            <Words className="it muted" text={t("Sixteen quarters. No pause.", "ستة عشر ربعاً. بلا توقف.")} show={active} delay={0.45} />
          </h2>
          <div style={{ width: 700, minHeight: 150 }}>
            <AnimatePresence mode="wait">
              {hover !== null ? (
                <motion.div key={hover} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="label gold">{2023 + Math.floor(hover / 4)} Q{(hover % 4) + 1} · {Q[hover]} {t("deliverables", "إنجازاً")}</div>
                  <div className="h3" style={{ marginTop: 8 }}>{t(...QTH[hover])}</div>
                </motion.div>
              ) : step >= 1 ? (
                <motion.div key="n" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <div className="label gold">{t("Foundation first, then scale", "الأساس أولاً، ثم التوسع")}</div>
                  <div style={{ fontSize: 21, marginTop: 8, color: "#d3d7da", lineHeight: 1.45 }}>
                    {t(`2023 built the foundation: ${YEARS[0][1]} items. Then fewer but larger projects — manufacturing in the ERP, distributor servers, in 2025–2026 a full network and camera refresh, and 2026 Q3's 25 AX customisations. Hatched: ${PROG} projects in progress now.`,
                      `عام 2023 بنى الأساس: ${YEARS[0][1]} إنجازاً. ثم مشروعات أقل عدداً وأكبر حجماً: التصنيع في ERP وخوادم الموزعين، وفي 2025–2026 تحديث كامل للشبكات والكاميرات، و25 تطويراً في AX في الربع الثالث 2026. المظلل: ${PROG} مشروعات قيد التنفيذ الآن.`)}
                  </div>
                </motion.div>
              ) : (
                <motion.p key="l" className="lede" style={{ fontSize: 23 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {t("Delivered by a team of two, then three. Point at any quarter to see its theme.", "أنجزها فريق من شخصين ثم ثلاثة. أشر إلى أي ربع لترى محوره.")}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="ltr" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 56, marginTop: 50, position: "relative" }}>
          {YEARS.map(([y, total, en, ar], yi) => (
            <div key={y}>
              <div style={{ display: "flex", alignItems: "end", gap: 12, height: H, borderBottom: "1px solid var(--line2)" }}>
                {Q.slice(yi * 4, yi * 4 + 4).map((v, qi) => {
                  const i = yi * 4 + qi, pv = QP[i];
                  return (
                    <div key={i} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "end", cursor: "default" }} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
                      <motion.div className="mono num" style={{ textAlign: "center", fontSize: 20, marginBottom: 8, color: hover === i ? "var(--gold)" : "var(--muted)" }} initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 0.9 + i * 0.07 }}>{v}</motion.div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: active ? (v / max) * (H - 50) : 0 }}
                        transition={{ delay: 0.6 + i * 0.07, duration: 1.1, ease: EASE }}
                        style={{
                          borderRadius: "8px 8px 2px 2px", overflow: "hidden", display: "flex", flexDirection: "column",
                          background: hover === i ? "var(--gold)" : yi === 0 ? "linear-gradient(180deg, var(--gold), rgba(230,179,90,.35))" : "linear-gradient(180deg, var(--teal), rgba(79,209,197,.25))",
                          boxShadow: hover === i ? "0 0 30px rgba(230,179,90,.5)" : "none",
                        }}
                      >
                        {/* projects still in progress sit hatched on top of the delivered part */}
                        {pv > 0 && <div style={{ height: `${(pv / v) * 100}%`, flex: "none", background: "repeating-linear-gradient(135deg, rgba(243,164,59,.85) 0 6px, #0b1219 6px 12px)", borderBottom: "1px dashed var(--amber)" }} />}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                {[1, 2, 3, 4].map((q) => <div key={q} className="mono" style={{ flex: 1, textAlign: "center", fontSize: 14, color: "var(--dim)" }}>Q{q}</div>)}
              </div>
              <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", gap: 16 }}>
                <span className="serif" style={{ fontSize: 64, lineHeight: 1 }}>{y}</span>
                <span className="serif gold" style={{ fontSize: 44 }}><CountUp to={total} show={active} delay={1 + yi * 0.2} /></span>
              </div>
              <div className="label" style={{ marginTop: 6 }}>{t(en, ar)}</div>
            </div>
          ))}
        </div>
        <motion.div className="label" style={{ marginTop: 26, textTransform: "none", letterSpacing: 0, fontSize: 15 }} animate={{ opacity: step >= 1 ? 1 : 0 }}>
          {t("2026 Q4 runs to October. Its five planned items are delivered; the hatched part is work in progress.", "الربع الرابع 2026 حتى أكتوبر. بنوده الخمسة المخططة اكتملت، والجزء المظلل أعمال قيد التنفيذ.")}
        </motion.div>
      </div>
    </div>
  );
}

/* =============== 07 · Before / after wipe =============== */
export function BeforeAfter({ step, active }: SlideProps) {
  const t = useT();
  const rtl = useLang() === "ar";
  const p = useMotionValue(100); // % of the comparison area still showing 2023
  const region = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    const target = step >= 1 ? 0 : 100;
    const c = animate(p, target, { duration: step >= 1 ? 3.2 : 0.8, ease: EASE_IN_OUT });
    return () => c.stop();
  }, [step, p]);

  const beforeClip = useTransform(p, (v) => (rtl ? `inset(0 0 0 ${100 - v}%)` : `inset(0 ${100 - v}% 0 0)`));
  const afterClip = useTransform(p, (v) => (rtl ? `inset(0 ${v}% 0 0)` : `inset(0 0 0 ${v}%)`));
  const lineX = useTransform(p, (v) => `${rtl ? 100 - v : v}%`);

  const setFrom = (clientX: number) => {
    const r = region.current!.getBoundingClientRect();
    let v = ((clientX - r.left) / r.width) * 100;
    if (rtl) v = 100 - v;
    p.set(Math.max(0, Math.min(100, v)));
  };

  return (
    <div className="slide" style={{ background: "var(--ink)" }}>
      <Flares a="var(--red)" b="var(--teal)" o={0.09} />
      <div className="pad" style={{ paddingTop: 110 }}>
        <Rise><div className="kicker">{t("Chapter 03 · Before and after", "الفصل 03 · قبل وبعد")}</div></Rise>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 20 }}>
          <h2 className="h2" style={{ fontSize: t("80px", "64px") }}>
            <Words text={t("Same company.", "الشركة نفسها.")} show={active} delay={0.2} /> <Words className="it gold" text={t("Different foundation.", "أساس مختلف.")} show={active} delay={0.45} />
          </h2>
          <div className="label">{t("Drag across the table to compare", "اسحب عبر الجدول للمقارنة")}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gridTemplateRows: `44px repeat(${BA.length}, 64px)`, marginTop: 40, position: "relative" }}>
          <div />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <span className="label red">● 2023 · {t("January", "يناير")}</span>
            <span className="label teal">2026 · {t("October", "أكتوبر")} ●</span>
          </div>
          {BA.map(([en, ar], i) => [
            <motion.div key={en} initial={{ opacity: 0, x: -16 }} animate={{ opacity: active ? 1 : 0, x: 0 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.7 }}
              style={{ display: "flex", alignItems: "center", borderTop: "1px solid var(--line)", fontWeight: 600, fontSize: 22 }}>{t(en, ar)}</motion.div>,
            <div key={en + "b"} style={{ borderTop: "1px solid var(--line)" }} />,
          ])}
          {/* the comparison layers sit over the second column */}
          <div
            ref={region}
            onPointerDown={(e) => { setDrag(true); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setFrom(e.clientX); }}
            onPointerMove={(e) => drag && setFrom(e.clientX)}
            onPointerUp={() => setDrag(false)}
            style={{ position: "absolute", insetInlineStart: 260, insetInlineEnd: 0, top: 44, height: BA.length * 64, cursor: "ew-resize", touchAction: "none" }}
          >
            {[0, 1].map((layer) => (
              <motion.div key={layer} style={{ position: "absolute", inset: 0, clipPath: layer === 0 ? beforeClip : afterClip, display: "grid", gridTemplateRows: `repeat(${BA.length}, 1fr)` }}>
                {BA.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 0.4 + i * 0.06 }}
                    style={{ display: "flex", alignItems: "center", paddingInline: 24, fontSize: 22, background: layer === 0 ? "linear-gradient(90deg, rgba(255,90,78,.07), rgba(255,90,78,.02))" : "linear-gradient(90deg, rgba(79,209,197,.03), rgba(79,209,197,.09))", color: layer === 0 ? "#ffb9b2" : "#c9f3ee" }}>
                    <span style={{ marginInlineEnd: 14, opacity: 0.8 }}>{layer === 0 ? "✕" : "✓"}</span>
                    {layer === 0 ? t(r[2], r[3]) : t(r[4], r[5])}
                  </motion.div>
                ))}
              </motion.div>
            ))}
            <motion.div style={{ position: "absolute", top: -8, bottom: -8, left: lineX, width: 2, marginLeft: -1, background: "var(--gold)", boxShadow: "0 0 24px var(--gold), 0 0 60px rgba(230,179,90,.6)" }}>
              <div style={{ position: "absolute", top: "50%", left: -22, width: 46, height: 46, marginTop: -23, borderRadius: "50%", background: "var(--ink)", border: "2px solid var(--gold)", display: "grid", placeItems: "center", color: "var(--gold)", fontSize: 18 }}>⇆</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== 08 · Security layers =============== */
function Threat({ angle, rStop, delay }: { angle: number; rStop: number; delay: number }) {
  const cx = 420, cy = 420, a = (angle * Math.PI) / 180;
  const x0 = cx + Math.cos(a) * 520, y0 = cy + Math.sin(a) * 520;
  const x1 = cx + Math.cos(a) * rStop, y1 = cy + Math.sin(a) * rStop;
  return (
    <g>
      <motion.circle r={5} fill="var(--red)" style={{ filter: "drop-shadow(0 0 8px #ff5a4e)" }} initial={{ cx: x0, cy: y0, opacity: 0 }}
        animate={{ cx: [x0, x1], cy: [y0, y1], opacity: [0, 1, 1, 0] }} transition={{ duration: 2.6, delay, repeat: Infinity, repeatDelay: 1.4, ease: "easeIn", times: [0, 0.15, 0.95, 1] } as never} />
      <motion.circle cx={x1} cy={y1} fill="none" stroke="var(--red)" strokeWidth={1.5} initial={{ r: 0, opacity: 0 }}
        animate={{ r: [0, 26], opacity: [0.9, 0] }} transition={{ duration: 0.9, delay: delay + 2.5, repeat: Infinity, repeatDelay: 3.1 }} />
    </g>
  );
}

export function Security({ step, active }: SlideProps) {
  const t = useT();
  const built = useTicker(active, 420, 10);
  const R = (k: number) => 88 + k * 32;
  const rStop = built === 0 ? 30 : R(built - 1) + 6;
  const threats = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ angle: (i * 360) / 14 + Math.random() * 14, delay: Math.random() * 3 })), []);
  return (
    <div className="slide">
      <Photo src={IMG.circuit} dim={0.86} saturate={0.3} from={{ s: 1.2 }} to={{ s: 1.05 }} duration={40} gradient="linear-gradient(90deg, rgba(5,8,12,.96) 0%, rgba(5,8,12,.75) 50%, rgba(5,8,12,.5) 100%)" />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 04 · Security", "الفصل 04 · الأمن")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, maxWidth: 900, fontSize: t("84px", "64px") }}>
          <Words text={t("Ten layers.", "عشر طبقات.")} show={active} delay={0.2} /><br />
          <Words className="it gold" text={t("Built in-house.", "بُنيت داخلياً.")} show={active} delay={0.45} />
        </h2>

        <div style={{ position: "relative", width: 800, marginTop: 40 }}>
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="l" exit={{ opacity: 0, x: -30, transition: { duration: 0.4 } }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 40px" }}>
                {LAYERS.map(([en, ar, den, dar, when], i) => (
                  <motion.div key={en} initial={{ opacity: 0.12 }} animate={{ opacity: built > i ? 1 : 0.12 }} transition={{ duration: 0.4 }} style={{ padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                      <span className="mono gold" style={{ fontSize: 15 }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ fontWeight: 600, fontSize: 21 }}>{t(en, ar)}</span>
                      <span className="mono ltr" style={{ marginInlineStart: "auto", fontSize: 13, color: "var(--dim)" }}>{when}</span>
                    </div>
                    <div style={{ fontSize: 16, color: "var(--muted)", marginTop: 3, paddingInlineStart: 34 }}>{t(den, dar)}</div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="e" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: EASE }} style={{ display: "grid", gap: 20 }}>
                <div className="label">{t("Transparency: security events did occur", "للشفافية: وقعت أحداث أمنية بالفعل")}</div>
                {[
                  ["Before 2023 · E-commerce", "قبل 2023 · المتجر الإلكتروني", "Site attacked with fake orders", "هجوم بطلبات وهمية على الموقع", "SSL, hosting and cPanel hardening; order-pricing exposure closed (2023)", "SSL وتحصين الاستضافة وcPanel وإغلاق ثغرة تسعير الطلبات (2023)"],
                  ["2025 Q3 · Websites", "2025 ر3 · المواقع", "Security incident from the Puvana website", "حادثة أمنية مصدرها موقع Puvana", "Investigated; impact report delivered; KSA site moved to a company server; mail ports secured", "تحقيق وتقرير بالأثر، ونقل الموقع السعودي لخادم الشركة، وتأمين منافذ البريد"],
                ].map(([k, ka, h, ha, r, ra]) => (
                  <div key={k} className="card" style={{ padding: "22px 26px", borderInlineStart: "3px solid var(--amber)" }}>
                    <div className="label" style={{ color: "var(--amber)" }}>{t(k, ka)}</div>
                    <div style={{ fontSize: 26, fontWeight: 600, margin: "6px 0 6px" }}>{t(h, ha)}</div>
                    <div style={{ fontSize: 19, color: "#bfc4c9" }}><b className="teal" style={{ fontWeight: 600 }}>{t("Response: ", "الاستجابة: ")}</b>{t(r, ra)}</div>
                  </div>
                ))}
                <div className="h3 it" style={{ fontSize: 40, marginTop: 6 }}>{t("Neither progressed to ransomware or wiper malware.", "لم يتطور أي منهما إلى فدية أو مسح بيانات.")}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* concentric defence rings */}
      <svg width={840} height={840} viewBox="0 0 840 840" style={{ position: "absolute", insetInlineEnd: 70, top: 150 }}>
        <defs>
          <radialGradient id="core"><stop offset="0%" stopColor="rgba(230,179,90,.5)" /><stop offset="100%" stopColor="rgba(230,179,90,0)" /></radialGradient>
        </defs>
        <circle cx={420} cy={420} r={86} fill="url(#core)" />
        {LAYERS.map((_, k) => (
          <g key={k}>
            <motion.circle cx={420} cy={420} r={R(k)} fill="none" stroke={k % 2 ? "var(--teal)" : "var(--gold)"} strokeWidth={k === built - 1 ? 3 : 1.6}
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: built > k ? 1 : 0, opacity: built > k ? (k === built - 1 ? 1 : 0.55) : 0 }}
              transition={{ duration: 0.9, ease: EASE }} style={{ rotate: -90, transformOrigin: "420px 420px" }} />
            <motion.circle cx={420} cy={420} r={R(k)} fill="none" stroke="#fff" strokeWidth={2.5} strokeDasharray={`18 ${2 * Math.PI * R(k)}`}
              animate={{ rotate: built > k ? 360 : 0, opacity: built > k ? 0.7 : 0 }} transition={{ rotate: { duration: 9 + k * 2.2, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.5 } }}
              style={{ transformOrigin: "420px 420px" }} />
            <motion.text x={420} y={420 - R(k) + 5} textAnchor="middle" fill={k % 2 ? "var(--teal)" : "var(--gold)"} style={{ font: "600 12px var(--mono)", paintOrder: "stroke", stroke: "#05080c", strokeWidth: 5 }}
              animate={{ opacity: built > k ? 1 : 0 }}>{String(k + 1).padStart(2, "0")}</motion.text>
          </g>
        ))}
        {threats.map((th, i) => <Threat key={i + "-" + built} angle={th.angle} rStop={rStop} delay={th.delay} />)}
        <text x={420} y={462} textAnchor="middle" fill="var(--fg)" style={{ font: "400 30px var(--serif)" }}>GID</text>
        <text x={420} y={490} textAnchor="middle" fill="var(--muted)" style={{ font: "500 11px var(--mono)", letterSpacing: "0.2em" }}>{t("THE BUSINESS", "الأعمال")}</text>
      </svg>
    </div>
  );
}

/* =============== 09 · Infrastructure diagram =============== */
type N = { x: number; y: number; w?: number; t: string; s?: string; c?: string };
function Node({ n, show, delay = 0 }: { n: N; show: boolean; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.85 }} transition={{ delay: show ? delay : 0, duration: 0.6, ease: EASE }}
      style={{ position: "absolute", left: n.x, top: n.y, width: n.w ?? 230, marginLeft: -(n.w ?? 230) / 2, marginTop: -38, padding: "14px 16px", borderRadius: 14, background: "rgba(11,18,25,.92)", border: `1px solid ${n.c ?? "var(--line2)"}`, boxShadow: n.c ? `0 0 30px ${n.c}33` : "none", textAlign: "center" }}>
      <div style={{ fontWeight: 600, fontSize: 19, color: n.c ?? "var(--fg)" }}>{n.t}</div>
      {n.s && <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 3, lineHeight: 1.35 }}>{n.s}</div>}
    </motion.div>
  );
}
function Link({ d, show, color = "var(--teal)", dash, delay = 0, packets = true, dur = 2.4 }: { d: string; show: boolean; color?: string; dash?: boolean; delay?: number; packets?: boolean; dur?: number }) {
  return (
    <g>
      <motion.path d={d} fill="none" stroke={color} strokeWidth={2} strokeDasharray={dash ? "6 8" : undefined} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: show ? 1 : 0, opacity: show ? 0.75 : 0 }} transition={{ delay: show ? delay : 0, duration: 1, ease: EASE }} />
      {show && packets && [0, 1].map((k) => (
        <circle key={k} r={4} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
          <animateMotion dur={`${dur}s`} begin={`${delay + 1 + k * dur / 2}s`} repeatCount="indefinite" path={d} />
        </circle>
      ))}
    </g>
  );
}

export function Infrastructure({ step, active }: SlideProps) {
  const t = useT();
  const s0 = active && step === 0, s1 = active && step >= 1;
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 60% 50%, #0d1a24 0%, var(--ink) 70%)" }}>
      <motion.div style={{ position: "absolute", inset: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 1.5 }}>
        <Photo src={IMG.power} dim={0.25} saturate={1} from={{ s: 1.15 }} to={{ s: 1.04, x: 0, y: 0 }} gradient="linear-gradient(0deg, rgba(5,8,12,.97) 24%, rgba(5,8,12,.35) 62%, rgba(5,8,12,.55) 100%)" />
      </motion.div>
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 05 · Infrastructure", "الفصل 05 · البنية التحتية")}</div></Rise>
        <div style={{ position: "relative", height: 110, marginTop: 20 }}>
          <AnimatePresence mode="wait">
            <motion.h2 key={Math.min(step, 2)} className="h2" style={{ fontSize: t("80px", "62px"), position: "absolute" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
              {step === 0 ? <>{t("2023: ", "2023: ")}<span className="it red">{t("one fault stops everything.", "عطل واحد يوقف كل شيء.")}</span></>
                : step === 1 ? <>{t("2026: ", "2026: ")}<span className="it teal">{t("redundant, segmented, contained.", "اتصال احتياطي وشبكة مقسمة ومعزولة.")}</span></>
                : <>{t("And when the power fails, ", "وعند انقطاع الكهرباء، ")}<span className="it gold">{t("the company keeps running.", "تستمر الشركة في العمل.")}</span></>}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      {/* diagram canvas: 1640 x 640 */}
      <motion.div className="ltr" style={{ position: "absolute", left: 140, top: 330, width: 1640, height: 640 }} animate={{ opacity: step >= 2 ? 0 : 1, scale: step >= 2 ? 0.94 : 1 }} transition={{ duration: 0.8 }}>
        <svg width={1640} height={640} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* 2023 */}
          <Link d="M 170 320 L 420 320" show={s0} color="var(--red)" packets={false} />
          <Link d="M 420 320 L 560 320" show={s0} color="var(--red)" packets={false} delay={0.2} />
          <motion.ellipse cx={1030} cy={320} rx={470} ry={270} fill="rgba(255,90,78,.05)" stroke="var(--red)" strokeDasharray="10 10" strokeWidth={2} initial={{ opacity: 0 }} animate={{ opacity: s0 ? 1 : 0 }} transition={{ delay: s0 ? 0.4 : 0 }} />
          {s0 && [0, 1, 2].map((k) => (
            <motion.circle key={k} cx={760} cy={250} fill="none" stroke="var(--red)" strokeWidth={2} initial={{ r: 0, opacity: 0 }} animate={{ r: [0, 560], opacity: [0.9, 0] }} transition={{ duration: 3.2, delay: 2 + k * 1.1, repeat: Infinity, repeatDelay: 0.3, ease: "easeOut" }} />
          ))}
          {/* 2026 */}
          <Link d="M 170 140 C 300 140, 300 320, 420 320" show={s1} delay={0.1} />
          <Link d="M 170 320 L 420 320" show={s1} delay={0.2} />
          <Link d="M 170 500 C 300 500, 300 320, 420 320" show={s1} delay={0.3} color="var(--gold)" dash />
          <Link d="M 420 320 L 650 320" show={s1} delay={0.5} />
          <Link d="M 650 320 C 760 320, 760 110, 900 110" show={s1} delay={0.7} />
          <Link d="M 650 320 L 900 320" show={s1} delay={0.75} />
          <Link d="M 650 320 C 760 320, 760 530, 900 530" show={s1} delay={0.8} />
          <Link d="M 420 320 C 560 40, 1150 -20, 1330 110" show={s1} delay={1} color="var(--gold)" />
          <Link d="M 1020 320 L 1330 320" show={s1} delay={1.1} dur={3} />
          <Link d="M 1020 530 L 1330 530" show={s1} delay={1.2} dur={3} />
          <motion.rect x={1210} y={10} width={420} height={210} rx={22} fill="none" stroke="var(--gold)" strokeDasharray="8 8" initial={{ opacity: 0 }} animate={{ opacity: s1 ? 0.6 : 0 }} transition={{ delay: s1 ? 1.4 : 0 }} />
        </svg>

        {/* 2023 nodes */}
        <Node n={{ x: 170, y: 320, w: 190, t: t("Internet", "الإنترنت"), s: t("one line", "خط واحد"), c: "var(--red)" }} show={s0} />
        <Node n={{ x: 490, y: 320, w: 170, t: t("Router", "راوتر"), s: t("misconfigured firewall", "جدار غير مضبوط") }} show={s0} delay={0.2} />
        {[
          [760, 250, t("Users", "المستخدمون")], [1000, 150, t("Servers · idle", "خوادم · خاملة")], [1260, 230, t("DC + DHCP", "DC وDHCP")], [1000, 330, t("Factory link · insecure", "اتصال المصنع · غير آمن")],
          [800, 430, t("Printers", "الطابعات")], [1250, 420, t("Warehouse · unstable", "المستودع · غير مستقر")], [1030, 500, t("No backups", "بلا نسخ احتياطية")],
        ].map(([x, y, l], i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: s0 ? 1 : 0 }} transition={{ delay: s0 ? 0.6 + i * 0.12 : 0 }}
            style={{ position: "absolute", left: x as number, top: y as number, transform: "translate(-50%,-50%)", padding: "9px 16px", borderRadius: 999, border: "1px solid rgba(255,90,78,.5)", color: "#ffc2bc", fontSize: 18, whiteSpace: "nowrap", background: "rgba(30,10,10,.7)" }}>{l}</motion.div>
        ))}
        <motion.div className="label red" style={{ position: "absolute", left: 1030, top: 610, transform: "translateX(-50%)", whiteSpace: "nowrap" }} animate={{ opacity: s0 ? 1 : 0 }} transition={{ delay: s0 ? 2 : 0 }}>
          {t("One flat network · one infected PC reaches everything", "شبكة واحدة مسطحة · جهاز مصاب واحد يصل إلى كل شيء")}
        </motion.div>

        {/* 2026 nodes */}
        <Node n={{ x: 170, y: 140, w: 210, t: t("Line A", "الخط الأول"), s: t("static IP · SD-WAN", "عنوان ثابت · SD-WAN"), c: "var(--teal)" }} show={s1} />
        <Node n={{ x: 170, y: 320, w: 210, t: t("Line B", "الخط الثاني"), s: t("static IP", "عنوان ثابت"), c: "var(--teal)" }} show={s1} delay={0.1} />
        <Node n={{ x: 170, y: 500, w: 210, t: t("4G failover", "4G احتياطي"), s: t("HQ · factory · warehouse", "المقر · المصنع · المستودع"), c: "var(--gold)" }} show={s1} delay={0.2} />
        <Node n={{ x: 420, y: 320, w: 190, t: "Fortigate", s: t("single-IP publishing", "نشر عبر عنوان واحد"), c: "var(--gold)" }} show={s1} delay={0.4} />
        <Node n={{ x: 650, y: 320, w: 170, t: t("Core · VLANs", "النواة · VLANs"), s: t("broadcast contained", "البث محصور") }} show={s1} delay={0.55} />
        <Node n={{ x: 960, y: 110, w: 250, t: t("Server zone", "منطقة الخوادم"), s: t("Proxmox · test & staging · file server · daily backups", "Proxmox · بيئات اختبار · خادم ملفات · نسخ يومي"), c: "var(--teal)" }} show={s1} delay={0.8} />
        <Node n={{ x: 960, y: 320, w: 250, t: t("User VLANs", "شبكات المستخدمين"), s: t("web filtering · least privilege", "فلترة الويب · أقل صلاحيات") }} show={s1} delay={0.9} />
        <Node n={{ x: 960, y: 530, w: 250, t: t("Factory", "المصنع"), s: t("firewall · DMZ · Sidel VPN · 100 Mbps", "جدار ناري · DMZ · VPN لـ Sidel · 100 ميجابت"), c: "var(--teal)" }} show={s1} delay={1} />
        <Node n={{ x: 1420, y: 110, w: 330, t: t("Azure cloud", "سحابة Azure"), s: t("Mago HR · DMS + DS servers · distributors isolated · auto-backups", "Mago HR · خوادم DMS وDS · عزل الموزعين · نسخ آلي"), c: "var(--gold)" }} show={s1} delay={1.3} />
        <Node n={{ x: 1420, y: 320, w: 300, t: t("Call center", "مركز الاتصال"), s: t("Issabel · 32 SIP channels · Odoo CRM", "Issabel · 32 قناة · Odoo CRM") }} show={s1} delay={1.4} />
        <Node n={{ x: 1420, y: 530, w: 300, t: t("Warehouses", "المستودعات"), s: t("Mansouria · Shpramont · firewall · filter · cameras", "Mansouria · Shpramont · جدار ناري · فلترة · كاميرات") }} show={s1} delay={1.5} />
      </motion.div>

      {/* step 2: power + Proxmox */}
      <motion.div style={{ position: "absolute", left: 140, right: 140, bottom: 120, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} initial={false} animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 40 }} transition={{ duration: 0.9, ease: EASE }}>
        {[
          ["2024 Q2 · 2026 Q3", "UPS with a generator behind it", "UPS ومولد احتياطي", "HQ on UPS and generator since 2024; the warehouse UPS project followed in 2026. Systems ride through long outages.", "المقر على UPS ومولد منذ 2024، ومشروع UPS للمستودع في 2026. تستمر الأنظمة أثناء الانقطاع الطويل."],
          ["2023 Q1 → 2026 Q2", "Proxmox and Hyper-V", "Proxmox وHyper-V", "Idle servers reused as a platform, then extended with Hyper-V — test copies before every upgrade, no hypervisor licence.", "إعادة استخدام الخوادم الخاملة كمنصة ثم إضافة Hyper-V — نسخ اختبار قبل كل ترقية وبدون رسوم ترخيص."],
          ["2024 Q3", "Factory IP upgrade, zero downtime", "ترقية عناوين المصنع دون توقف", "Firewall and Cisco router reconfigured with production running, plus 4G backup at the factory.", "إعادة ضبط الجدار الناري والراوتر أثناء الإنتاج، مع 4G احتياطي للمصنع."],
        ].map(([w, en, ar, den, dar], i) => (
          <motion.div key={en} className="card" style={{ padding: "26px 28px" }} initial={false} animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 30 }} transition={{ delay: step >= 2 ? 0.2 + i * 0.15 : 0, duration: 0.8 }}>
            <div className="label gold ltr">{w}</div>
            <div className="h3" style={{ fontSize: t("36px", "30px"), margin: "10px 0 10px" }}>{t(en, ar)}</div>
            <div style={{ fontSize: 19, color: "#bcc2c7" }}>{t(den, dar)}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* =============== 10 · Crises =============== */
export function Crises({ active }: SlideProps) {
  const t = useT();
  const n = useTicker(active, 380, CRISES.length + 3);
  return (
    <div className="slide">
      <Photo src={IMG.sparks} dim={0.7} saturate={0.9} from={{ s: 1.2, x: 30 }} to={{ s: 1.05, x: -30 }} duration={30} gradient="linear-gradient(180deg, rgba(5,8,12,.75), rgba(5,8,12,.93))" />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 06 · Under pressure", "الفصل 06 · تحت الضغط")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, fontSize: t("84px", "64px") }}>
          <Words text={t("Nine crises.", "تسع أزمات.")} show={active} delay={0.2} /> <Words className="it gold" text={t("Solved inside the company.", "حُلّت داخل الشركة.")} show={active} delay={0.45} />
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 50 }}>
          {CRISES.map(([w, wa, c, ca, r, ra], i) => (
            <motion.div key={i} className="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: n > i ? 1 : 0, y: n > i ? 0 : 30 }} transition={{ duration: 0.6, ease: EASE }} style={{ padding: "22px 24px", height: 196, position: "relative", overflow: "hidden" }}>
              <div className="label ltr" style={{ color: "var(--amber)" }}>{t(w, wa)}</div>
              <div style={{ fontSize: 22, fontWeight: 600, marginTop: 8, lineHeight: 1.3, maxWidth: "72%" }}>{t(c, ca)}</div>
              <div style={{ fontSize: 17, color: "#aab1b7", marginTop: 8, lineHeight: 1.4 }}>{t(r, ra)}</div>
              <motion.div initial={{ opacity: 0, scale: 2.4, rotate: -24 }} animate={n > i + 2 ? { opacity: 1, scale: 1, rotate: -12 } : { opacity: 0, scale: 2.4, rotate: -24 }} transition={{ duration: 0.35, ease: [0.2, 1.4, 0.4, 1] }}
                style={{ position: "absolute", insetInlineEnd: 16, top: 16, border: "2px solid var(--teal)", color: "var(--teal)", borderRadius: 8, padding: "4px 10px", font: "700 14px var(--mono)", letterSpacing: "0.18em" }}>
                {t("RESOLVED", "تم الحل")}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =============== 11 · Call center =============== */
function BusyPhone() {
  const t = useT();
  return (
    <div style={{ width: 400, height: 560, borderRadius: 54, border: "2px solid #2a3540", background: "linear-gradient(180deg, #0d141b, #070a0e)", padding: 28, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 40px 100px rgba(0,0,0,.6)" }}>
      <div style={{ width: 110, height: 8, borderRadius: 8, background: "#1c252e" }} />
      <div className="label" style={{ marginTop: 70 }}>{t("Calling customer service", "الاتصال بخدمة العملاء")}</div>
      <motion.div className="serif red" style={{ fontSize: 92, marginTop: 30 }} animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>{t("Busy", "مشغول")}</motion.div>
      <div style={{ display: "flex", gap: 7, alignItems: "center", height: 90, marginTop: 30 }}>
        {Array.from({ length: 18 }, (_, i) => (
          <motion.div key={i} style={{ width: 7, borderRadius: 4, background: "var(--red)" }} animate={{ height: [6, 16 + ((i * 37) % 60), 6, 6] }} transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.2, 0.45, 1], delay: 0 }} />
        ))}
      </div>
      <div style={{ marginTop: "auto", width: 86, height: 86, borderRadius: "50%", background: "var(--red)", display: "grid", placeItems: "center", fontSize: 34, color: "#fff" }}>✕</div>
    </div>
  );
}
function Channels({ active }: { active: boolean }) {
  const lit = useTicker(active, 70, 32);
  const [busy, setBusy] = useState<number[]>([]);
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setBusy(Array.from({ length: 32 }, (_, i) => i).filter(() => Math.random() < 0.62)), 1300);
    return () => clearInterval(iv);
  }, [active]);
  return (
    <div className="ltr" style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 12, width: 820 }}>
      {Array.from({ length: 32 }, (_, i) => {
        const on = lit > i, b = on && lit >= 32 && busy.includes(i);
        return (
          <motion.div key={i} animate={{ borderColor: on ? (b ? "rgba(79,209,197,.9)" : "rgba(79,209,197,.35)") : "rgba(242,238,230,.08)", background: b ? "rgba(79,209,197,.16)" : "rgba(255,255,255,.02)" }} transition={{ duration: 0.4 }}
            style={{ height: 96, borderRadius: 12, border: "1px solid", padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 13, color: on ? "var(--fg)" : "var(--dim)" }}>CH {String(i + 1).padStart(2, "0")}</span>
              <motion.span style={{ width: 9, height: 9, borderRadius: "50%" }} animate={{ background: on ? "#4FD1C5" : "#26313b", boxShadow: on ? "0 0 10px #4FD1C5" : "none" }} />
            </div>
            <div className="mono" style={{ fontSize: 12, color: b ? "var(--teal)" : "var(--dim)" }}>{b ? "● IN CALL" : on ? "READY" : "—"}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function CallCenter({ step, active }: SlideProps) {
  const t = useT();
  const phases: [string, string, string, string, string][] = [
    ["2023 Q1–Q2", "Stabilise", "تثبيت", "Scripts and etiquette · Odoo CRM v14 · call logging · recording · complaints", "النصوص وآداب المكالمات · Odoo CRM 14 · توثيق وتسجيل المكالمات · الشكاوى"],
    ["2023 Q3–Q4", "Build the platform", "بناء المنصة", "GoIP gateway · first KPIs · Issabel · SIP trunks · 32 channels", "بوابة GoIP · أول مؤشرات أداء · Issabel · خطوط SIP · 32 قناة"],
    ["2024", "Go live and optimise", "التشغيل والتحسين", "SIP live · reports and backups · queues · time conditions · Raya managed", "تشغيل SIP · التقارير والنسخ · قوائم الانتظار · التوقيتات · إدارة Raya"],
    ["2025–2026", "Scale and integrate", "التوسع والتكامل", "NTRA issue solved · Mobinil IVR for Lumea and Abrar · Issabel–Odoo 19", "حل مشكلة NTRA · IVR لعلامتي Lumea وAbrar · ربط Issabel مع Odoo 19"],
  ];
  return (
    <div className="slide">
      <Photo src={IMG.headset} dim={0.82} saturate={0.5} from={{ s: 1.2 }} to={{ s: 1.06, x: -20 }} duration={36} gradient="linear-gradient(90deg, rgba(5,8,12,.96) 0%, rgba(5,8,12,.8) 50%, rgba(5,8,12,.6) 100%)" />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 07 · Call center", "الفصل 07 · مركز الاتصال")}</div></Rise>
        <div style={{ position: "relative", height: 240, marginTop: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} style={{ position: "absolute", inset: 0 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6 }}>
              {step === 0 && <>
                <h2 className="h2" style={{ fontSize: t("84px", "64px") }}>{t("A busy tone was the", "نغمة الانشغال كانت")}<br /><span className="it red">{t("most common answer.", "الرد الأكثر شيوعاً.")}</span></h2>
              </>}
              {step === 1 && <h2 className="h2" style={{ fontSize: t("84px", "64px") }}>{t("Today: 32 channels.", "اليوم: 32 قناة.")}<br /><span className="it teal">{t("Every call queued and recorded.", "كل مكالمة في قائمة انتظار ومسجلة.")}</span></h2>}
              {step >= 2 && <h2 className="h2" style={{ fontSize: t("84px", "64px") }}>{t("Four phases.", "أربع مراحل.")}<br /><span className="it gold">{t("One platform the company owns.", "منصة واحدة تملكها الشركة.")}</span></h2>}
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ position: "relative", height: 600 }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="a" style={{ display: "flex", gap: 120, alignItems: "center" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }}>
                <div style={{ display: "grid", gap: 18, width: 720 }}>
                  {[["Personal mobile phones", "هواتف محمولة شخصية"], ["No queues — callers hit a busy tone", "بلا قوائم انتظار — المتصل يسمع نغمة الانشغال"], ["No recording — no evidence in disputes", "بلا تسجيل — بلا دليل عند الخلاف"], ["Customers kept in an Excel sheet", "بيانات العملاء في ملف Excel"], ["No KPI could be measured", "لا يمكن قياس أي مؤشر أداء"]].map(([en, ar], i) => (
                    <Rise key={en} delay={0.3 + i * 0.12}><div style={{ fontSize: 28, display: "flex", gap: 18, alignItems: "baseline", borderBottom: "1px solid var(--line)", paddingBottom: 14 }}><span className="red mono" style={{ fontSize: 18 }}>✕</span>{t(en, ar)}</div></Rise>
                  ))}
                </div>
                <Rise delay={0.5}><BusyPhone /></Rise>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="b" style={{ display: "flex", gap: 90, alignItems: "start" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: "grid", gap: 14, width: 640 }}>
                  {[["Issabel PBX, built and customized in-house", "منصة Issabel مبنية ومخصصة داخلياً"], ["GoIP GSM gateways and landlines", "بوابات GoIP وخطوط أرضية"], ["Queues, strategies, time conditions", "قوائم انتظار واستراتيجيات وتوقيتات"], ["Inbound and outbound recording, with backups", "تسجيل المكالمات الواردة والصادرة مع نسخ احتياطي"], ["Every call logged in Odoo CRM", "توثيق كل مكالمة في Odoo CRM"], ["Multi-brand IVR: Lumea and Abrar", "رد صوتي لعلامتي Lumea وAbrar"]].map(([en, ar], i) => (
                    <Rise key={en} delay={0.2 + i * 0.1}><div style={{ fontSize: 25, display: "flex", gap: 16, alignItems: "baseline", borderBottom: "1px solid var(--line)", paddingBottom: 12 }}><span className="teal mono" style={{ fontSize: 18 }}>✓</span>{t(en, ar)}</div></Rise>
                  ))}
                </div>
                <div>
                  <Channels active={active && step === 1} />
                  <div className="label" style={{ marginTop: 16 }}>{t("Illustrative channel activity · 32 concurrent SIP channels", "نشاط توضيحي للقنوات · 32 قناة SIP متزامنة")}</div>
                </div>
              </motion.div>
            )}
            {step >= 2 && (
              <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22, position: "relative" }}>
                  <motion.div style={{ position: "absolute", top: 33, insetInlineStart: 0, height: 2, background: "linear-gradient(90deg, var(--gold), var(--teal))" }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, ease: EASE }} />
                  {phases.map(([w, en, ar, den, dar], i) => (
                    <Rise key={en} delay={0.3 + i * 0.35}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--ink)", border: "3px solid var(--gold)", margin: "23px 0 26px" }} />
                      <div className="label gold ltr">{w}</div>
                      <div className="h3" style={{ margin: "10px 0 12px" }}>{t(en, ar)}</div>
                      <div style={{ fontSize: 19, color: "#b8bec4" }}>{t(den, dar)}</div>
                    </Rise>
                  ))}
                </div>
                <Rise delay={1.8}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 46 }}>
                    {KPIS.map(([v, pre, suf, en, ar, den, dar], i) => (
                      <div key={en} className="card" style={{ padding: "20px 24px", borderTop: "3px solid var(--teal)" }}>
                        <div className="serif teal ltr" style={{ fontSize: 64, lineHeight: 1 }}><CountUp to={v} prefix={pre} suffix={suf} show={active && step >= 2} delay={2 + i * 0.15} /></div>
                        <div style={{ fontSize: 21, fontWeight: 600, marginTop: 10 }}>{t(en, ar)}</div>
                        <div style={{ fontSize: 16, color: "var(--muted)", marginTop: 2 }}>{t(den, dar)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="label" style={{ marginTop: 16, textTransform: "none", letterSpacing: 0 }}>{t("Today's Issabel queue log and Odoo CRM. Before 2023 calls were not logged, so there is no older baseline to compare with.", "من سجل Issabel وOdoo CRM اليوم. قبل 2023 لم تكن المكالمات توثق، فلا يوجد خط أساس أقدم للمقارنة.")}</div>
                </Rise>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* =============== 12 · Factory =============== */
export function Factory({ step, active }: SlideProps) {
  const t = useT();
  const rtl = useLang() === "ar";
  const cams = useTicker(active && step === 0, 90, 32);
  const [glitch, setGlitch] = useState(-1);
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setGlitch(Math.floor(Math.random() * 32)), 900);
    return () => clearInterval(iv);
  }, [active]);
  const groups: [string, string, string, string][] = [
    ["Network", "الشبكة", "Firewall · Sidel vendor VPN · subnets and DMZ · 4G backup · 100 Mbps", "جدار ناري · VPN لمورد Sidel · شبكات فرعية وDMZ · 4G احتياطي · 100 ميجابت"],
    ["Manufacturing in AX", "التصنيع في AX", "Full cycle · BOM versions · quality module · indirect cost · named approvers", "الدورة الكاملة · قوائم المواد · الجودة · التكاليف غير المباشرة · اعتماد محدد"],
    ["Stock and pallets", "المخزون والطبليات", "Pallet workflow · item balances for factory, Mansouria and ELA · barcodes", "تتبع الطبليات · أرصدة المصنع وMansouria وELA · باركود"],
    ["People and assets", "الأفراد والأصول", "Mago HR users · fingerprint attendance · all site assets in Snipe-IT", "مستخدمو Mago HR · بصمة الحضور · كل الأصول في Snipe-IT"],
  ];
  return (
    <div className="slide">
      <AnimatePresence>
        <motion.div key={step >= 1 ? "w" : "f"} style={{ position: "absolute", inset: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }}>
          <Photo src={step >= 1 ? IMG.warehouse : IMG.factory} dim={step >= 1 ? 0.35 : 0.7} saturate={0.7} from={{ s: 1.18, x: 20 }} to={{ s: 1.05, x: -30 }} duration={30} gradient={step >= 1 ? "linear-gradient(90deg, rgba(5,8,12,.97) 0%, rgba(5,8,12,.9) 40%, rgba(5,8,12,.15) 75%, rgba(5,8,12,.3) 100%)" : "linear-gradient(90deg, rgba(5,8,12,.96) 0%, rgba(5,8,12,.8) 48%, rgba(5,8,12,.45) 100%)"} />
        </motion.div>
      </AnimatePresence>
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 08 · Factory and warehouses", "الفصل 08 · المصنع والمستودعات")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, maxWidth: 820, fontSize: t("76px", "58px") }}>
          <Words text={t("Where IT failure becomes", "حيث يتحول العطل التقني")} show={active} delay={0.2} /> <Words className="it gold" text={t("production failure.", "إلى توقف للإنتاج.")} show={active} delay={0.5} />
        </h2>
        <div style={{ width: 760, marginTop: 44, position: "relative" }}>
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="g" exit={{ opacity: 0 }} style={{ display: "grid", gap: 16 }}>
                {groups.map(([en, ar, den, dar], i) => (
                  <Rise key={en} delay={0.6 + i * 0.12}>
                    <div style={{ borderInlineStart: "2px solid var(--gold)", paddingInlineStart: 22 }}>
                      <div style={{ fontSize: 25, fontWeight: 600 }}>{t(en, ar)}</div>
                      <div style={{ fontSize: 19, color: "#b6bcc2", marginTop: 4 }}>{t(den, dar)}</div>
                    </div>
                  </Rise>
                ))}
              </motion.div>
            ) : (
              <motion.div key="w" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <div className="label teal">{t("Each warehouse brought to the same standard", "كل مستودع بنفس المعايير")}</div>
                <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                  {[["Mansouria · managerial-building network and access (2024 Q1)", "Mansouria · شبكة المبنى الإداري والوصول (2024 ر1)"], ["Shpramont · network, backups and external access (2025 Q4)", "Shpramont · شبكة ونسخ احتياطي ووصول خارجي (2025 ر4)"], ["Firewall, web filter, fingerprint device (2026 Q1) · UPS (2026 Q3)", "جدار ناري وفلترة وجهاز بصمة (2026 ر1) · UPS (2026 ر3)"], ["74 cameras across the warehouse and management building", "74 كاميرا في المستودع والمبنى الإداري"]].map(([en, ar]) => (
                    <div key={en} style={{ fontSize: 22, display: "flex", gap: 14 }}><span className="teal">✓</span>{t(en, ar)}</div>
                  ))}
                </div>
                <div className="label" style={{ marginTop: 34, color: "var(--amber)" }}>{t("If not delivered", "لو لم يتم ذلك")}</div>
                <div style={{ display: "grid", gap: 8, marginTop: 12, fontSize: 19, color: "#aeb5bb" }}>
                  {[["A production-network incident would have had no isolation or recovery path.", "حادث في شبكة الإنتاج بلا عزل أو طريق للتعافي."], ["Vendor access to line equipment over an insecure connection.", "وصول المورد لمعدات الخط عبر اتصال غير آمن."], ["Stock, cost and quality records manual or inside an unreliable ERP.", "سجلات المخزون والتكلفة والجودة يدوية أو في ERP غير موثوق."], ["No camera evidence after a fault or theft.", "لا دليل بالكاميرات بعد عطل أو سرقة."]].map(([en, ar]) => <div key={en}>— {t(en, ar)}</div>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CCTV wall */}
      <motion.div className="ltr" style={{ position: "absolute", [rtl ? "left" : "right"]: 120, top: 250, width: 900 }} animate={{ opacity: step === 0 ? 1 : 0, x: step === 0 ? 0 : rtl ? -60 : 60 }} transition={{ duration: 0.8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6 }}>
          {Array.from({ length: 32 }, (_, i) => {
            const on = cams > i;
            const src = [IMG.factory, IMG.warehouse, IMG.sparks, IMG.water][i % 4];
            return (
              <div key={i} style={{ aspectRatio: "4 / 3", position: "relative", overflow: "hidden", borderRadius: 4, background: "#06090c", border: "1px solid #18222b" }}>
                <motion.div style={{ position: "absolute", inset: 0, backgroundImage: `url(${src})`, backgroundSize: "520%", backgroundPosition: `${(i * 37) % 100}% ${(i * 53) % 100}%`, filter: "grayscale(1) contrast(1.3) brightness(.8)" }}
                  animate={{ opacity: on ? (glitch === i ? [1, 0.2, 1] : 1) : 0, x: glitch === i ? [0, 4, -3, 0] : 0 }} transition={{ duration: 0.3 }} />
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 4px)" }} />
                {on && <>
                  <span className="mono" style={{ position: "absolute", left: 5, top: 4, fontSize: 9, color: "#cfe" }}>CAM {String(i + 1).padStart(2, "0")}</span>
                  <motion.span style={{ position: "absolute", right: 5, top: 6, width: 6, height: 6, borderRadius: "50%", background: "var(--red)" }} animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.05 }} />
                </>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <span className="label"><span className="red">●</span> {t("122 factory cameras · 196 company-wide · installed in-house", "122 كاميرا بالمصنع · 196 في الشركة · تركيب داخلي")}</span>
          <span className="label">{t("Illustrative feeds", "مشاهد توضيحية")}</span>
        </div>
      </motion.div>
    </div>
  );
}
