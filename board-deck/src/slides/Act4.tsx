import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useT, useLang } from "../i18n";
import { CountUp, EASE, Flares, Photo, Rise, Words, useTicker } from "../fx";
import { IMG } from "../assets/img";
import {
  ANNUAL, ANNUAL_AVOID, ANNUAL_SAVE, CONTROL, DONE, FX, MONEY, NEXTB, NOW, ONCE, PROG, REPORTS, REVENUE_PER_DAY, ROADMAP, ROADMAP_N, SUMMARY, TIME, TOTAL,
  egp, millions, money, short,
} from "../data/content";
import type { SlideProps } from "./types";

/** deterministic 0..1 noise, so illustrative charts and maps look the same on every run */
const rnd = (i: number, k = 0) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };

/* =============== 10 · Data and reporting =============== */
function MiniChart({ i, on, hot }: { i: number; on: boolean; hot: boolean }) {
  const kind = i % 3, c = i % 2 ? "#4FD1C5" : "#E6B35A";
  const vals = Array.from({ length: 7 }, (_, k) => 6 + rnd(i, k) * 30);
  return (
    <motion.div animate={{ opacity: on ? 1 : 0.06, borderColor: hot ? c : "rgba(242,238,230,.09)", boxShadow: hot ? `0 0 22px ${c}66` : "0 0 0 rgba(0,0,0,0)" }} transition={{ duration: 0.35 }}
      style={{ height: 62, borderRadius: 8, border: "1px solid", background: "rgba(11,18,25,.88)", padding: "7px 8px" }}>
      <div style={{ height: 3, width: `${30 + rnd(i, 9) * 50}%`, background: "rgba(242,238,230,.22)", borderRadius: 2 }} />
      <svg width="100%" height={40} viewBox="0 0 80 40" style={{ marginTop: 5, display: "block" }}>
        {kind === 0 && vals.slice(0, 6).map((h, k) => (
          <motion.rect key={k} x={k * 13 + 2} width={9} rx={1.5} fill={c} fillOpacity={0.8} initial={{ height: 0, y: 40 }} animate={{ height: on ? h : 0, y: on ? 40 - h : 40 }} transition={{ delay: k * 0.04, duration: 0.6, ease: EASE }} />
        ))}
        {kind === 1 && <motion.polyline points={vals.map((h, k) => `${k * 13 + 1},${40 - h}`).join(" ")} fill="none" stroke={c} strokeWidth={1.8} strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.8 }} />}
        {kind === 2 && <>
          <circle cx={40} cy={20} r={14} fill="none" stroke="rgba(242,238,230,.12)" strokeWidth={6} />
          <motion.circle cx={40} cy={20} r={14} fill="none" stroke={c} strokeWidth={6} initial={{ pathLength: 0 }} animate={{ pathLength: on ? 0.35 + rnd(i, 3) * 0.55 : 0 }} transition={{ duration: 0.9, ease: EASE }} style={{ rotate: -90, transformOrigin: "40px 20px" }} />
        </>}
      </svg>
    </motion.div>
  );
}
export function Reports({ active }: SlideProps) {
  const t = useT();
  const rtl = useLang() === "ar";
  const lit = useTicker(active, 38, 72);
  const [hot, setHot] = useState(-1);
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setHot(Math.floor(Math.random() * 72)), 420);
    return () => clearInterval(iv);
  }, [active]);
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 75% 40%, #0f2130 0%, var(--ink) 65%)" }}>
      <Flares o={0.09} />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 11 · Data and reporting", "الفصل 11 · البيانات والتقارير")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, maxWidth: 720, fontSize: t("76px", "58px") }}>
          <Words text={t("From hand-built spreadsheets", "من جداول تُعد يدوياً")} show={active} delay={0.2} /> <Words className="it gold" text={t("to 72 live reports.", "إلى 72 تقريراً مباشراً.")} show={active} delay={0.5} />
        </h2>
        <Rise delay={0.7}><p className="lede" style={{ marginTop: 22, maxWidth: 700, fontSize: 22 }}>{t("One sales report used to take two people 48 hours. Today management opens a dashboard and the numbers are already there.", "كان تقرير المبيعات الواحد يستغرق 48 ساعة من شخصين. اليوم تفتح الإدارة اللوحة فتجد الأرقام جاهزة.")}</p></Rise>
        <div style={{ display: "grid", gap: 0, marginTop: 30, width: 700 }}>
          {REPORTS.map(([v, en, ar, den, dar, c], i) => (
            <Rise key={en} delay={0.9 + i * 0.12} y={18}>
              <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <div className="serif" style={{ fontSize: 58, lineHeight: 1, color: c }}><CountUp to={v} show={active} delay={1 + i * 0.12} prefix={v === 30 ? "~" : ""} /></div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>{t(en, ar)}</div>
                  <div style={{ fontSize: 16, color: "var(--muted)" }}>{t(den, dar)}</div>
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
      <div className="ltr" style={{ position: "absolute", [rtl ? "left" : "right"]: 130, top: 236, width: 880 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 8 }}>
          {Array.from({ length: 72 }, (_, i) => <MiniChart key={i} i={i} on={lit > i} hot={hot === i} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
          <span className="label"><span className="gold">●</span> {t("72 Power BI reports", "72 تقرير Power BI")}</span>
          <span className="label">{t("Illustrative thumbnails", "صور توضيحية")}</span>
        </div>
      </div>
    </div>
  );
}

/* =============== 11 · Customer Location Enforcement =============== */
const PINS = Array.from({ length: 27 }, (_, i) => ({ x: 70 + rnd(i, 1) * 720, y: 140 + rnd(i, 2) * 530 }));
function Pin({ x, y, i, step, lost }: { x: number; y: number; i: number; step: number; lost: boolean }) {
  const locked = step >= 1;
  const c = locked ? "var(--teal)" : lost ? "var(--red)" : "var(--amber)";
  const dx = (rnd(i, 4) - 0.5) * 70, dy = (rnd(i, 5) - 0.5) * 70;
  return (
    <motion.g initial={false}
      animate={locked ? { x, y, opacity: 1 } : { x: [x, x + dx, x - dx * 0.4, x], y: [y, y + dy, y - dy * 0.5, y], opacity: lost ? 0.12 : 1 }}
      transition={locked ? { duration: 0.9, ease: EASE, delay: i * 0.02 } : { x: { duration: 4 + rnd(i, 6) * 2, repeat: Infinity }, y: { duration: 4 + rnd(i, 6) * 2, repeat: Infinity }, opacity: { duration: 0.6 } }}>
      {locked && <motion.circle r={14} fill="none" stroke="var(--teal)" initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 2.2, repeat: Infinity, delay: rnd(i, 7) * 2 }} />}
      <path d="M0,-30 C-11,-30 -17,-22 -17,-13 C-17,0 0,12 0,12 C0,12 17,0 17,-13 C17,-22 11,-30 0,-30 Z" fill={c} fillOpacity={0.9} style={{ filter: `drop-shadow(0 0 8px ${locked ? "#4FD1C5" : "#FF5A4E"})` }} />
      {locked
        ? <g transform="translate(0,-15)"><rect x={-5.5} y={-2} width={11} height={8} rx={1.5} fill="#05080c" /><path d="M-3.4,-2 V-5 A3.4,3.4 0 0 1 3.4,-5 V-2" fill="none" stroke="#05080c" strokeWidth={2} /></g>
        : <circle cy={-14} r={5} fill="#05080c" />}
      {lost && !locked && <text y={-40} textAnchor="middle" fill="var(--red)" style={{ font: "700 18px var(--mono)" }}>?</text>}
    </motion.g>
  );
}
export function Location({ step, active }: SlideProps) {
  const t = useT();
  const rtl = useLang() === "ar";
  // every 2.6 s another sales rep "leaves" and takes a third of the locations with them
  const tick = useTicker(active && step === 0, 2600, 1000);
  const rep = tick % 3;
  return (
    <div className="slide" style={{ background: step >= 1 ? "radial-gradient(ellipse at 70% 50%, #0d2226 0%, var(--ink) 65%)" : "radial-gradient(ellipse at 70% 50%, #1d1210 0%, var(--ink) 65%)", transition: "background 1.2s" }}>
      <Flares a={step >= 1 ? "var(--teal)" : "var(--red)"} b="#0f2233" o={0.08} />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 12 · Customer Location Enforcement", "الفصل 12 · تثبيت مواقع العملاء")}</div></Rise>
        <div style={{ position: "relative", height: 230, marginTop: 24, width: 820 }}>
          <AnimatePresence mode="wait">
            <motion.h2 key={step} className="h2" style={{ fontSize: t("76px", "58px"), position: "absolute" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
              {step === 0
                ? <>{t("Customer locations left", "مواقع العملاء كانت ترحل")}<br /><span className="it red">{t("with the sales reps.", "مع المندوبين.")}</span></>
                : <>{t("Now every location", "اليوم كل موقع")}<br /><span className="it teal">{t("belongs to the company.", "ملك للشركة.")}</span></>}
            </motion.h2>
          </AnimatePresence>
        </div>
        <div style={{ width: 760, position: "relative" }}>
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="c" exit={{ opacity: 0, x: -20 }}>
                <div className="label red">{t("Business challenge", "التحدي")}</div>
                <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
                  {[["Customer locations were not consistently captured by sales representatives.", "لم يكن المندوبون يسجلون مواقع العملاء بشكل منتظم."],
                    ["Customer data and locations were at risk of being lost when a sales representative left the company.", "كانت بيانات العملاء ومواقعهم معرضة للضياع عند مغادرة المندوب للشركة."],
                    ["Operations depended on individual sales representatives, which affected business continuity.", "اعتمد العمل على أفراد من المندوبين، مما أثّر على استمرارية الأعمال."]].map(([en, ar], i) => (
                    <Rise key={en} delay={0.5 + i * 0.15}><div style={{ fontSize: 24, display: "flex", gap: 16, borderBottom: "1px solid var(--line)", paddingBottom: 14 }}><span className="red mono" style={{ fontSize: 18, marginTop: 6 }}>✕</span>{t(en, ar)}</div></Rise>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="s" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <div className="label teal">{t("Implemented solution · rated critical", "الحل المنفذ · مصنف حرج")}</div>
                <div style={{ fontSize: 24, marginTop: 16, lineHeight: 1.45 }}>{t("A database trigger in SalesBuzz stops sales reps from changing a customer's coordinates once they are captured.", "مشغل في قاعدة بيانات SalesBuzz يمنع المندوب من تعديل إحداثيات العميل بعد تسجيلها.")}</div>
                <div className="card mono ltr" style={{ marginTop: 22, padding: "18px 22px", fontSize: 17, lineHeight: 1.7, color: "#cfd3d6" }}>
                  <div><span className="gold">TRIGGER</span> customer_location_lock</div>
                  <div><span className="gold">ON UPDATE</span> customer.latitude, customer.longitude</div>
                  <div><span className="gold">IF</span> user.role = <span className="teal">'Salesman'</span> <span className="gold">→ REJECT</span></div>
                  <div className="label" style={{ marginTop: 8, fontSize: 12 }}>{t("Illustrative logic", "منطق توضيحي")}</div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
                  {[["Locations survive staff turnover", "المواقع باقية مع تغير الموظفين"], ["No dependency on one rep", "لا اعتماد على مندوب واحد"], ["Business continuity protected", "حماية استمرارية الأعمال"]].map(([en, ar], i) => (
                    <motion.span key={en} className="chip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.12 }}><span className="dot" />{t(en, ar)}</motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="ltr" style={{ position: "absolute", [rtl ? "left" : "right"]: 120, top: 190, width: 860, height: 740 }}>
        <div className="card" style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 24 }}>
          <svg width={860} height={740} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 9 }, (_, k) => <path key={"h" + k} d={`M 0 ${40 + k * 85 + rnd(k, 11) * 30} C 300 ${20 + k * 85 + rnd(k, 12) * 60}, 560 ${60 + k * 85 - rnd(k, 13) * 60}, 860 ${40 + k * 85 + rnd(k, 14) * 30}`} stroke="rgba(242,238,230,.07)" strokeWidth={k % 3 ? 2 : 5} fill="none" />)}
            {Array.from({ length: 10 }, (_, k) => <path key={"v" + k} d={`M ${40 + k * 90 + rnd(k, 15) * 30} 0 L ${20 + k * 90 + rnd(k, 16) * 60} 740`} stroke="rgba(242,238,230,.06)" strokeWidth={k % 4 ? 2 : 5} fill="none" />)}
            <path d="M -20 520 C 200 470, 330 640, 560 560 S 820 470, 900 520" stroke="rgba(79,140,197,.18)" strokeWidth={26} fill="none" />
            {PINS.map((p, i) => <Pin key={i} i={i} x={p.x} y={p.y} step={step} lost={step === 0 && tick > 0 && i % 3 === rep} />)}
          </svg>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step === 0 ? "l" + rep : "ok"} className="chip" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ position: "absolute", left: 24, top: 24, background: "rgba(5,8,12,.85)", borderColor: step >= 1 ? "var(--teal)" : "var(--red)" }}>
            {step >= 1
              ? <><span className="dot" />{t("Locked by trigger · sales reps cannot move a customer", "مثبتة بالمشغل · لا يستطيع المندوب نقل أي عميل")}</>
              : tick > 0 ? <><span className="dot" style={{ background: "var(--red)", boxShadow: "0 0 12px var(--red)" }} />{t(`A sales rep leaves · ${Math.ceil(PINS.length / 3)} customer locations lost`, `مغادرة مندوب · ضياع ${Math.ceil(PINS.length / 3)} من مواقع العملاء`)}</>
                : <><span className="dot" style={{ background: "var(--amber)", boxShadow: "0 0 12px var(--amber)" }} />{t("Locations drift as reps edit them", "المواقع تتغير مع تعديلات المندوبين")}</>}
          </motion.div>
        </AnimatePresence>
        <div className="label" style={{ position: "absolute", right: 24, bottom: 18 }}>{t("Illustrative map", "خريطة توضيحية")}</div>
      </div>
    </div>
  );
}

/* =============== 14 · The money =============== */
export function Money({ step, active }: SlideProps) {
  const t = useT();
  const max = Math.max(ANNUAL_SAVE, ANNUAL_AVOID, ONCE);
  const pillars: [string, string, number, string, string, string, string][] = [
    ["Direct savings · every year", "وفر مباشر · كل عام", ANNUAL_SAVE, "Contracts renegotiated or replaced: mail licence, device management, Etisalat, printing.", "عقود أعيد التفاوض عليها أو استبدلت: ترخيص البريد وإدارة الأجهزة وEtisalat والطباعة.", "var(--gold)", "rgba(230,179,90,"],
    ["Cost avoidance · every year", "تجنب تكاليف · كل عام", ANNUAL_AVOID, "Built or run in-house instead of bought: home-delivery system, AX implementation and support, server licensing.", "بُني أو أُدير داخلياً بدلاً من الشراء: نظام التوصيل المنزلي وتنفيذ ودعم AX وتراخيص الخوادم.", "var(--teal)", "rgba(79,209,197,"],
    ["One-time · already banked", "لمرة واحدة · تحقق بالفعل", ONCE, "Call-center system not bought (EGP 750K), 196 cameras installed in-house, two firewalls for $0, GPS contract.", "نظام مركز اتصال لم يُشترَ (750 ألف جنيه)، و196 كاميرا بتركيب داخلي، وجداران ناريان بتكلفة 0، وعقد GPS.", "var(--amber)", "rgba(243,164,59,"],
  ];
  return (
    <div className="slide" style={{ background: "#020304" }}>
      <motion.div style={{ position: "absolute", inset: 0 }} animate={{ opacity: step >= 1 ? 0.55 : 1 }} transition={{ duration: 1.5 }}>
        <Photo src={IMG.towers} dim={0.78} saturate={0.5} from={{ s: 1.25 }} to={{ s: 1.08, x: 0, y: 20 }} duration={40} gradient="radial-gradient(ellipse at 50% 45%, rgba(2,3,4,.25) 0%, rgba(2,3,4,.95) 72%)" />
      </motion.div>
      <motion.div style={{ position: "absolute", left: "50%", top: "46%", width: 1200, height: 1200, marginLeft: -600, marginTop: -600, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,179,90,.2), transparent 60%)" }}
        animate={{ opacity: step === 0 ? [0.6, 1, 0.6] : 0.25 }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      <div className="pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Rise><div className="kicker">{t("Chapter 15 · The money", "الفصل 15 · المال")}</div></Rise>
        <motion.div initial={false} animate={{ scale: step >= 1 ? 0.56 : 1, y: step >= 1 ? -12 : 0 }} transition={{ duration: 1.1, ease: EASE }} style={{ transformOrigin: "50% 0%", marginTop: 40 }}>
          <p className="h2 it" style={{ fontSize: t("68px", "54px") }}>
            <Words text={t("IT did not only cost money.", "تقنية المعلومات لم تكن تكلفة فقط.")} show={active} delay={0.3} /> <Words className="gold" text={t("It saved it.", "بل وفّرت المال.")} show={active} delay={0.9} />
          </p>
          <motion.div initial={{ opacity: 0, scale: 1.3, filter: "blur(24px)" }} animate={{ opacity: active ? 1 : 0, scale: 1, filter: "blur(0px)" }} transition={{ delay: 1.5, duration: 1.4, ease: EASE }}
            style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 28, marginTop: 20 }} className="ltr">
            <span className="serif muted" style={{ fontSize: 110 }}>EGP</span>
            <span className="serif gold" style={{ fontSize: 330, lineHeight: 0.95, textShadow: "0 0 90px rgba(230,179,90,.45)" }}><CountUp to={millions(ANNUAL)} decimals={1} suffix="M" show={active} delay={1.6} duration={2.6} /></span>
          </motion.div>
          <Rise delay={2.6}><div className="h3" style={{ fontSize: t("46px", "40px"), marginTop: 6 }}>{t("saved or avoided every year — recurring", "وفر أو تكاليف متجنبة كل عام — بشكل متكرر")}</div></Rise>
          <Rise delay={3.1}><div className="chip" style={{ marginTop: 26, fontSize: 24, padding: "12px 24px" }}><b className="gold ltr" style={{ fontWeight: 600 }}>+ EGP {short(ONCE)}</b>{t("one-time, already banked", "لمرة واحدة، تحققت بالفعل")}</div></Rise>
        </motion.div>
      </div>

      <motion.div style={{ position: "absolute", left: 140, right: 140, top: 560, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} initial={false} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 50 }} transition={{ duration: 0.9, ease: EASE }}>
        {pillars.map(([en, ar, v, den, dar, c, rgba], i) => (
          <motion.div key={en} className="card" initial={false} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 40 }} transition={{ delay: step >= 1 ? 0.2 + i * 0.15 : 0, duration: 0.8, ease: EASE }}
            style={{ padding: "26px 30px", borderTop: `3px solid ${c}`, background: `linear-gradient(180deg, ${rgba}.08), rgba(14,22,30,.8))` }}>
            <div className="label" style={{ color: c }}>{t(en, ar)}</div>
            <div className="serif" style={{ fontSize: 92, lineHeight: 1, marginTop: 12 }}><span className="ltr" style={{ display: "inline-block" }}><span className="muted" style={{ fontSize: 40, marginInlineEnd: 10 }}>EGP</span><CountUp to={millions(v)} decimals={1} suffix="M" show={step >= 1} delay={0.4 + i * 0.15} /></span></div>
            <div style={{ height: 6, borderRadius: 3, background: "var(--line)", marginTop: 18, overflow: "hidden" }}>
              <motion.div style={{ height: "100%", background: c, borderRadius: 3 }} initial={{ width: 0 }} animate={{ width: step >= 1 ? `${(v / max) * 100}%` : 0 }} transition={{ delay: 0.6 + i * 0.15, duration: 1.4, ease: EASE }} />
            </div>
            <div style={{ fontSize: 18, color: "#bcc2c7", marginTop: 16, lineHeight: 1.45 }}>{t(den, dar)}</div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="label" style={{ position: "absolute", left: 140, right: 140, bottom: 92, textAlign: "center", textTransform: "none", letterSpacing: 0, fontSize: 15 }} animate={{ opacity: step >= 1 ? 1 : 0 }}>
        {t(`From signed contracts, vendor offers and quotes in the Financial Data Request. USD lines converted at EGP ${FX} per USD. Gross value — Finance is confirming actual IT spend to show the net figure.`,
          `من العقود الموقعة وعروض الموردين والأسعار في نموذج طلب البيانات المالية. البنود بالدولار محسوبة بسعر ${FX} جنيهاً للدولار. قيمة إجمالية — وتؤكد الإدارة المالية الإنفاق الفعلي لعرض صافي القيمة.`)}
      </motion.div>
    </div>
  );
}

/* =============== 14b · The ledger =============== */
function LedgerRow({ m, i, max, show }: { m: (typeof MONEY)[number]; i: number; max: number; show: boolean }) {
  const t = useT();
  const v = egp(m), c = m.once ? "var(--amber)" : m.kind === "save" ? "var(--gold)" : "var(--teal)";
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14 }} transition={{ delay: 0.5 + i * 0.07, duration: 0.6, ease: EASE }}
      style={{ display: "grid", gridTemplateColumns: m.once ? "1fr 150px" : "1fr 250px 230px", gap: 20, alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--line)" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>{t(m.en, m.ar)}</span>
          <span className="mono ltr" style={{ fontSize: 12, color: "var(--dim)", whiteSpace: "nowrap" }}>{m.when}</span>
        </div>
        <div style={{ fontSize: 15, color: "var(--muted)", marginTop: 2 }}>{t(m.ben, m.bar)}</div>
      </div>
      {!m.once && <div className="mono ltr" style={{ fontSize: 15, color: "#aab1b7", textAlign: "end" }}>{money(m.cur, m.was)} <span className="gold">→</span> {money(m.cur, m.now)}</div>}
      <div>
        <div className="serif ltr" style={{ fontSize: 32, lineHeight: 1, color: c, textAlign: "end" }}>{short(v)}</div>
        <div style={{ height: 4, borderRadius: 2, background: "var(--line)", marginTop: 7, overflow: "hidden", direction: "ltr" }}>
          <motion.div style={{ height: "100%", background: c }} initial={{ width: 0 }} animate={{ width: show ? `${(v / max) * 100}%` : 0 }} transition={{ delay: 0.8 + i * 0.07, duration: 1.2, ease: EASE }} />
        </div>
      </div>
    </motion.div>
  );
}
export function Ledger({ active }: SlideProps) {
  const t = useT();
  const yearly = MONEY.filter((m) => !m.once).sort((a, b) => egp(b) - egp(a));
  const once = MONEY.filter((m) => m.once).sort((a, b) => egp(b) - egp(a));
  const max = Math.max(...MONEY.map(egp));
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 20% 0%, #1a160c 0%, var(--ink) 60%)" }}>
      <Flares o={0.08} />
      <div className="pad" style={{ paddingTop: 110 }}>
        <Rise><div className="kicker">{t("Chapter 15 · Line by line", "الفصل 15 · بنداً بنداً")}</div></Rise>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 18 }}>
          <h2 className="h2" style={{ fontSize: t("70px", "54px") }}>
            <Words text={t("Twelve lines.", "اثنا عشر بنداً.")} show={active} delay={0.2} /> <Words className="it gold" text={t("Each with a document behind it.", "ولكل بند مستند.")} show={active} delay={0.45} />
          </h2>
          <div style={{ display: "flex", gap: 18 }}>
            {[["var(--gold)", "Direct saving", "وفر مباشر"], ["var(--teal)", "Cost avoidance", "تجنب تكاليف"], ["var(--amber)", "One-time", "لمرة واحدة"]].map(([c, en, ar]) => (
              <span key={en} className="label" style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{t(en, ar)}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.75fr 1fr", gap: 56, marginTop: 30 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }} className="label">
              <span>{t("Every year · recurring", "كل عام · متكرر")}</span><span className="gold ltr">EGP {short(ANNUAL)}</span>
            </div>
            <div style={{ marginTop: 6 }}>{yearly.map((m, i) => <LedgerRow key={m.en} m={m} i={i} max={max} show={active} />)}</div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }} className="label">
              <span>{t("One-time", "لمرة واحدة")}</span><span className="ltr" style={{ color: "var(--amber)" }}>EGP {short(ONCE)}</span>
            </div>
            <div style={{ marginTop: 6 }}>{once.map((m, i) => <LedgerRow key={m.en} m={m} i={i + yearly.length} max={max} show={active} />)}</div>
            <Rise delay={1.8} show={active}>
              <div className="card" style={{ marginTop: 26, padding: "22px 26px", borderInlineStart: "3px solid var(--gold)" }}>
                <div className="label gold">{t("In total", "الإجمالي")}</div>
                <div className="serif" style={{ fontSize: 56, lineHeight: 1.05, marginTop: 8 }}><span className="ltr">EGP {short(ANNUAL)}</span> <span className="muted" style={{ fontSize: 26 }}>{t("a year", "سنوياً")}</span></div>
                <div className="serif" style={{ fontSize: 36, lineHeight: 1.1, color: "var(--amber)" }}><span className="ltr">+ EGP {short(ONCE)}</span> <span className="muted" style={{ fontSize: 22 }}>{t("one-time", "لمرة واحدة")}</span></div>
                <div style={{ fontSize: 15, color: "var(--muted)", marginTop: 12 }}>{t(`USD at EGP ${FX}. The recurring lines repeat every year the contracts and in-house systems stay in place.`, `الدولار بسعر ${FX} جنيهاً. والبنود المتكررة تتكرر كل عام طالما بقيت العقود والأنظمة الداخلية.`)}</div>
              </div>
            </Rise>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== 15 · Value beyond cash =============== */
export function Beyond({ active }: SlideProps) {
  const t = useT();
  return (
    <div className="slide">
      <Photo src={IMG.servers} dim={0.86} saturate={0.4} from={{ s: 1.2 }} to={{ s: 1.06, x: -30 }} duration={40} gradient="linear-gradient(180deg, rgba(5,8,12,.8), rgba(5,8,12,.95))" />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 16 · Value beyond cash", "الفصل 16 · قيمة تتجاوز النقد")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, fontSize: t("76px", "58px") }}>
          <Words text={t("And the value", "والقيمة التي")} show={active} delay={0.2} /> <Words className="it gold" text={t("the cash total does not count.", "لا يحسبها الرقم النقدي.")} show={active} delay={0.45} />
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", gap: 24, marginTop: 50 }}>
          <motion.div className="card" initial={{ opacity: 0, y: 60 }} animate={{ opacity: active ? 1 : 0, y: 0 }} transition={{ delay: 0.6, duration: 0.9, ease: EASE }} style={{ padding: "28px 30px", borderTop: "3px solid var(--amber)", height: 560, display: "flex", flexDirection: "column" }}>
            <div className="label" style={{ color: "var(--amber)" }}>{t("Revenue at risk, protected", "إيرادات محمية من المخاطر")}</div>
            <div className="serif" style={{ fontSize: 104, lineHeight: 1, marginTop: 18 }}><span className="ltr" style={{ display: "inline-block" }}><span className="muted" style={{ fontSize: 40, marginInlineEnd: 10 }}>EGP</span><CountUp to={REVENUE_PER_DAY / 1e6} suffix="M" show={active} delay={0.9} /></span></div>
            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 10 }}>{t("of sales run through these systems every working day", "من المبيعات تمر عبر هذه الأنظمة كل يوم عمل")}</div>
            <div style={{ fontSize: 18, color: "#b6bcc2", marginTop: 14, lineHeight: 1.5 }}>{t("Every outage day avoided protects it. Zero ransomware or wiper incidents in four years; the 2026 database disk failure was recovered the same way — from backups that did not exist in 2023.", "كل يوم توقف يتم تجنبه يحمي هذا الرقم. صفر حوادث فدية أو مسح خلال أربع سنوات، وعطل قرص قاعدة البيانات في 2026 تمت استعادته من نسخ احتياطية لم تكن موجودة في 2023.")}</div>
            <div className="label" style={{ marginTop: "auto", fontSize: 13 }}>{t("Risk reduction · never counted as cash", "تقليل مخاطر · لا يُحتسب نقداً أبداً")}</div>
          </motion.div>
          <motion.div className="card" initial={{ opacity: 0, y: 60 }} animate={{ opacity: active ? 1 : 0, y: 0 }} transition={{ delay: 0.75, duration: 0.9, ease: EASE }} style={{ padding: "28px 30px", borderTop: "3px solid var(--teal)", height: 560, display: "flex", flexDirection: "column" }}>
            <div className="label teal">{t("Time released", "وقت تم توفيره")}</div>
            <div style={{ display: "grid", gap: 0, marginTop: 12 }}>
              {TIME.map(([v, en, ar, den, dar], i) => (
                <Rise key={en} delay={1 + i * 0.12} y={14}>
                  <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 16, alignItems: "center", padding: "13px 0", borderBottom: "1px solid var(--line)" }}>
                    <span className="serif teal ltr" style={{ fontSize: 46, lineHeight: 1 }}>{v}</span>
                    <div><div style={{ fontSize: 20, fontWeight: 600 }}>{t(en, ar)}</div><div style={{ fontSize: 16, color: "var(--muted)" }}>{t(den, dar)}</div></div>
                  </div>
                </Rise>
              ))}
            </div>
            <div className="label" style={{ marginTop: "auto", fontSize: 13 }}>{t("Productivity · capacity, not cash", "الإنتاجية · وقت وليس نقداً")}</div>
          </motion.div>
          <motion.div className="card" initial={{ opacity: 0, y: 60 }} animate={{ opacity: active ? 1 : 0, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: EASE }} style={{ padding: "28px 30px", borderTop: "3px solid var(--gold)", height: 560, display: "flex", flexDirection: "column" }}>
            <div className="label gold">{t("Commercial control", "الرقابة التجارية")}</div>
            <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
              {CONTROL.map(([en, ar], i) => (
                <Rise key={en} delay={1.1 + i * 0.1} y={14}><div style={{ fontSize: 21, display: "flex", gap: 14, borderBottom: "1px solid var(--line)", paddingBottom: 12 }}><span className="gold">✓</span>{t(en, ar)}</div></Rise>
              ))}
            </div>
            <div className="label" style={{ marginTop: "auto", fontSize: 13 }}>{t("Revenue protection · shown apart from savings", "حماية الإيرادات · منفصلة عن الوفر")}</div>
          </motion.div>
        </div>
        <Rise delay={1.8} show={active}>
          <div style={{ fontSize: 17, color: "var(--muted)", marginTop: 22 }}>
            {t("Savings, cost avoidance, revenue protection, productivity and risk reduction are kept apart and never double-counted.", "الوفر وتجنب التكاليف وحماية الإيرادات والإنتاجية وتقليل المخاطر منفصلة ولا يُحتسب أي منها مرتين.")}
          </div>
        </Rise>
      </div>
    </div>
  );
}

/* =============== 17 · In progress now =============== */
function LiveFeed({ active }: { active: boolean }) {
  const t = useT();
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [active]);
  const clock = `14:${String(32 + Math.floor(sec / 60) % 28).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  return (
    <div className="ltr" style={{ position: "relative", height: 330, borderRadius: 16, overflow: "hidden", border: "1px solid var(--line2)" }}>
      <Photo src={IMG.factory} dim={0.35} saturate={0} from={{ s: 1.15, x: 20 }} to={{ s: 1.05, x: -20 }} duration={24} gradient="linear-gradient(180deg, rgba(5,8,12,.1), rgba(5,8,12,.75))" />
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 2px, transparent 2px 4px)" }} />
      <div style={{ position: "absolute", left: 18, top: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <motion.span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--red)" }} animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
        <span className="mono" style={{ fontSize: 14, letterSpacing: ".18em" }}>LIVE · FACTORY · LINE 1</span>
      </div>
      <span className="mono" style={{ position: "absolute", right: 18, top: 16, fontSize: 14, color: "#cfe" }}>{clock}</span>
      {/* two-way voice */}
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <span className="chip" style={{ fontSize: 15, padding: "7px 14px", background: "rgba(5,8,12,.75)" }}><span className="dot" />{t("Voice on", "الصوت مفعل")}</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center", height: 40, flex: 1 }}>
          {Array.from({ length: 46 }, (_, i) => (
            <motion.div key={i} style={{ width: 4, borderRadius: 2, background: "var(--teal)" }} animate={{ height: active ? [4, 6 + rnd(i, 1) * 32, 4 + rnd(i, 2) * 12, 4] : 4 }} transition={{ duration: 1.1 + rnd(i, 3) * 0.6, repeat: Infinity, delay: rnd(i, 4) }} />
          ))}
        </div>
        <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>CLOUD ⇄ HQ</span>
      </div>
    </div>
  );
}
export function Now({ active }: SlideProps) {
  const t = useT();
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 30% 30%, #10202c 0%, var(--ink) 62%)" }}>
      <Flares o={0.09} />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 18 · In progress now", "الفصل 18 · قيد التنفيذ الآن")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, fontSize: t("80px", "62px") }}>
          <Words text={t(`${PROG} projects`, `${PROG} مشروعات`)} show={active} delay={0.2} /> <Words className="it gold" text={t("in flight right now.", "قيد التنفيذ الآن.")} show={active} delay={0.45} />
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56, marginTop: 50 }}>
          <Rise delay={0.6}>
            <div className="card" style={{ padding: 26, borderTop: "3px solid var(--gold)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="label gold">{t("Featured · important", "مميز · مهم")}</span>
                <span className="label" style={{ color: "var(--amber)" }}>{t("In progress", "قيد التنفيذ")}</span>
              </div>
              <div className="h3" style={{ fontSize: t("42px", "36px"), margin: "12px 0 8px" }}>{t("Smart live interaction with the factory", "تفاعل ذكي مباشر مع المصنع")}</div>
              <div style={{ fontSize: 19, color: "#bfc4c9", marginBottom: 18 }}>{t("Cameras and two-way voice on the cloud — management sees and speaks to the factory floor in real time, from anywhere.", "كاميرات وصوت في الاتجاهين عبر السحابة — ترى الإدارة أرض المصنع وتتحدث إليها مباشرة من أي مكان.")}</div>
              <LiveFeed active={active} />
              <div className="label" style={{ marginTop: 12, fontSize: 12 }}>{t("Illustrative view", "عرض توضيحي")}</div>
            </div>
          </Rise>
          <div style={{ display: "grid", alignContent: "start" }}>
            {NOW.map(([en, ar, den, dar], i) => (
              <Rise key={en} delay={0.8 + i * 0.12} y={18}>
                <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", padding: "20px 0", borderBottom: "1px solid var(--line)" }}>
                  <motion.span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--teal)", marginTop: 8 }} animate={{ boxShadow: ["0 0 0 0 rgba(79,209,197,.6)", "0 0 0 12px rgba(79,209,197,0)"] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }} />
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 600 }}>{t(en, ar)}</div>
                    <div style={{ fontSize: 18, color: "var(--muted)", marginTop: 2 }}>{t(den, dar)}</div>
                    <div style={{ height: 3, borderRadius: 2, background: "var(--line)", marginTop: 12, overflow: "hidden", position: "relative" }}>
                      <motion.div style={{ position: "absolute", top: 0, bottom: 0, width: "30%", background: "linear-gradient(90deg, transparent, var(--teal), transparent)" }} animate={{ left: ["-30%", "100%"] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }} />
                    </div>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== 18 · Next quarter =============== */
type GN = { k: string; x: number; y: number; t: [string, string]; c: string };
const GRAPH: GN[] = [
  { k: "odoo", x: 240, y: 90, t: ["Odoo 20 + CRM helpdesk", "Odoo 20 ومكتب دعم CRM"], c: "var(--gold)" },
  { k: "sb", x: 580, y: 230, t: ["New SalesBuzz", "SalesBuzz الجديد"], c: "var(--gold)" },
  { k: "d365", x: 890, y: 90, t: ["Dynamics 365", "Dynamics 365"], c: "var(--gold)" },
  { k: "web", x: 240, y: 370, t: ["Puvana app and websites", "تطبيق ومواقع Puvana"], c: "var(--teal)" },
  { k: "ai", x: 160, y: 520, t: ["Meta chatbot · agentic AI", "روبوت Meta · وكلاء ذكاء"], c: "var(--amber)" },
  { k: "dw", x: 780, y: 400, t: ["Data warehouse", "مستودع البيانات"], c: "#b9a7ff" },
  { k: "locus", x: 880, y: 540, t: ["LOCUS · sister company", "LOCUS · الشركة الشقيقة"], c: "#b9a7ff" },
];
const EDGES: [string, string, boolean?][] = [["odoo", "sb"], ["sb", "d365"], ["web", "sb"], ["web", "odoo"], ["ai", "web"], ["odoo", "dw", true], ["sb", "dw", true], ["d365", "dw", true]];
export function Roadmap({ step, active }: SlideProps) {
  const t = useT();
  const at = (k: string) => GRAPH.find((g) => g.k === k)!;
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 80% 20%, #10202c 0%, var(--ink) 60%)" }}>
      <Flares o={0.1} />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 19 · Next quarter", "الفصل 19 · الربع القادم")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, fontSize: t("80px", "62px") }}>
          <Words text={t(`${ROADMAP_N} projects next quarter.`, `${ROADMAP_N} مشروعاً في الربع القادم.`)} show={active} delay={0.2} /> <Words className="it gold" text={t("One connected group.", "مجموعة واحدة مترابطة.")} show={active} delay={0.5} />
        </h2>
        <div style={{ position: "relative", marginTop: 50 }}>
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="lanes" exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }} style={{ display: "grid", gridTemplateColumns: "1.15fr 1.15fr 0.85fr 0.85fr", gap: 22 }}>
                {ROADMAP.map(([en, ar, c, items], li) => (
                  <motion.div key={en} className="card" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + li * 0.14, duration: 0.8, ease: EASE }} style={{ padding: "24px 26px", borderTop: `3px solid ${c}`, minHeight: 420 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span className="label" style={{ color: c }}>{t(en, ar)}</span>
                      <span className="serif ltr" style={{ fontSize: 40, lineHeight: 1, color: c }}>{items.length}</span>
                    </div>
                    <div style={{ display: "grid", gap: 0, marginTop: 14 }}>
                      {items.map(([ien, iar], i) => (
                        <motion.div key={ien} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + li * 0.14 + i * 0.08 }} style={{ fontSize: 23, padding: "15px 0", borderBottom: "1px solid var(--line)", lineHeight: 1.35 }}>{t(ien, iar)}</motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ display: "grid", gridTemplateColumns: "1fr 560px", gap: 40 }}>
                <div className="ltr" style={{ position: "relative", height: 600 }}>
                  <svg width={1040} height={600} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                    {EDGES.map(([a, b, dash], i) => {
                      const A = at(a), B = at(b), d = `M ${A.x} ${A.y} C ${(A.x + B.x) / 2} ${A.y}, ${(A.x + B.x) / 2} ${B.y}, ${B.x} ${B.y}`;
                      return (
                        <g key={i}>
                          <motion.path d={d} fill="none" stroke={dash ? "#b9a7ff" : "var(--teal)"} strokeWidth={2} strokeDasharray={dash ? "6 8" : undefined} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ delay: 0.3 + i * 0.12, duration: 1, ease: EASE }} />
                          <circle r={5} fill={dash ? "#b9a7ff" : "var(--teal)"} style={{ filter: "drop-shadow(0 0 6px #4FD1C5)" }}><animateMotion dur="2.6s" begin={`${1.2 + i * 0.2}s`} repeatCount="indefinite" path={d} /></circle>
                        </g>
                      );
                    })}
                  </svg>
                  {GRAPH.map((g, i) => (
                    <motion.div key={g.k} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: EASE }}
                      style={{ position: "absolute", left: g.x, top: g.y, translateX: "-50%", translateY: "-50%", padding: "13px 20px", borderRadius: 14, background: "rgba(11,18,25,.94)", border: `1px solid ${g.c}`, boxShadow: `0 0 30px ${g.c}33`, whiteSpace: "nowrap", fontSize: 19, fontWeight: 600, color: g.c }}>
                      {t(...g.t)}
                    </motion.div>
                  ))}
                </div>
                <div>
                  <div className="label gold">{t("Recommended strengthening · for Board approval", "تعزيزات مقترحة · لموافقة مجلس الإدارة")}</div>
                  <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                    {NEXTB.map(([en, ar], i) => (
                      <motion.div key={en} className="card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12, duration: 0.7, ease: EASE }} style={{ padding: "16px 22px", display: "flex", gap: 18, alignItems: "center" }}>
                        <span className="serif gold" style={{ fontSize: 36, lineHeight: 1 }}>{i + 1}</span>
                        <span style={{ fontSize: 20 }}>{t(en, ar)}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* =============== 19 · Summary =============== */
export function Summary({ step, active }: SlideProps) {
  const t = useT();
  const stats: [number, number, string, string, string, string, string, string][] = [
    [TOTAL, 0, "", "", "Deliverables", "إنجازاً", `${DONE} done · ${PROG} in progress`, `${DONE} مكتمل · ${PROG} قيد التنفيذ`],
    [millions(ANNUAL), 1, "EGP ", "M", "Saved every year", "وفر سنوي", "Recurring", "متكرر"],
    [millions(ONCE), 1, "EGP ", "M", "One-time value", "قيمة لمرة واحدة", "Already banked", "تحقق بالفعل"],
    [ROADMAP_N, 0, "", "", "Projects next quarter", "مشروعاً في الربع القادم", "Odoo 20 · AI · e-commerce · LOCUS", "Odoo 20 · ذكاء اصطناعي · تجارة إلكترونية · LOCUS"],
  ];
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 50% 0%, #131d26 0%, var(--ink) 62%)" }}>
      <Flares o={0.08} />
      <div className="pad" style={{ paddingTop: 110 }}>
        <Rise><div className="kicker">{t("Chapter 20 · Summary", "الفصل 20 · الملخص")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 20, fontSize: t("76px", "58px") }}>
          <Words text={t("Four years,", "أربع سنوات،")} show={active} delay={0.2} /> <Words className="it gold" text={t("on one page.", "في صفحة واحدة.")} show={active} delay={0.4} />
        </h2>
        <motion.div initial={false} animate={{ y: step >= 1 ? -6 : 0 }} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 40 }}>
          {SUMMARY.map(([en, ar, c, items], ci) => (
            <motion.div key={en} className="card" initial={{ opacity: 0, y: 50 }} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 50 }} transition={{ delay: 0.5 + ci * 0.14, duration: 0.8, ease: EASE }} style={{ padding: "22px 24px", borderTop: `3px solid ${c}`, height: step >= 1 ? 420 : 560, transition: "height .8s cubic-bezier(.16,1,.3,1)", overflow: "hidden" }}>
              <div className="label" style={{ color: c }}>{t(en, ar)}</div>
              <div style={{ display: "grid", gap: 0, marginTop: 10 }}>
                {items.map(([ien, iar], i) => (
                  <motion.div key={ien} initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 0.8 + ci * 0.14 + i * 0.07 }} style={{ display: "flex", gap: 12, fontSize: 19, padding: "11px 0", borderBottom: "1px solid var(--line)", lineHeight: 1.35 }}>
                    <span style={{ color: c }}>✓</span><span>{t(ien, iar)}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div initial={false} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 40 }} transition={{ duration: 0.9, ease: EASE }} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 20 }}>
          {stats.map(([v, d, pre, suf, en, ar, sen, sar], i) => (
            <div key={en} className="card" style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 18, background: i === 1 ? "linear-gradient(180deg, rgba(230,179,90,.12), rgba(14,22,30,.8))" : undefined }}>
              <span className="serif gold ltr" style={{ fontSize: 58, lineHeight: 1, whiteSpace: "nowrap" }}><CountUp to={v} decimals={d} prefix={pre} suffix={suf} show={step >= 1} delay={0.3 + i * 0.12} /></span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 19, fontWeight: 600 }}>{t(en, ar)}</div>
                <div style={{ fontSize: 14, color: "var(--muted)" }}>{t(sen, sar)}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
