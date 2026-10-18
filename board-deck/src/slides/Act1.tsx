import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useT, useLang } from "../i18n";
import { CountUp, EASE, Flares, Letterbox, Photo, Rise, Typer, Words } from "../fx";
import ParticleText from "../fx/ParticleText";
import { IMG } from "../assets/img";
import { DOMAINS, FINDINGS, SEV_AR } from "../data/content";
import type { SlideProps } from "./types";

/* =============== 01 · Cold open =============== */
export function ColdOpen({ step, active }: SlideProps) {
  const t = useT();
  const lines: [string, string, string, string][] = [
    ["Two people.", "شخصان.", "The entire IT team", "كل فريق تقنية المعلومات"],
    ["One internet line.", "خط إنترنت واحد.", "No failover", "بلا أي بديل"],
    ["One flat network.", "شبكة واحدة مسطحة.", "Every user, server and device together", "كل المستخدمين والخوادم والأجهزة معاً"],
    ["No backups.", "بلا نسخ احتياطية.", "For any database", "لأي قاعدة بيانات"],
  ];
  return (
    <div className="slide" style={{ background: "#020304" }}>
      <AnimatePresence>
        {step >= 1 && (
          <motion.div key="ph" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} style={{ position: "absolute", inset: 0 }}>
            <Photo src={IMG.factory} dim={0.72} saturate={0.2} from={{ s: 1.15 }} to={{ s: 1.04, x: 0, y: 0 }} duration={30} gradient="radial-gradient(ellipse at 50% 50%, rgba(2,3,4,.2), rgba(2,3,4,.85))" />
          </motion.div>
        )}
      </AnimatePresence>
      <Flares a="var(--red)" b="#1b3550" o={0.1} />
      <Letterbox on={active} />

      <div className="pad" style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 170 }}>
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="a" exit={{ opacity: 0, filter: "blur(14px)", transition: { duration: 0.8 } }}>
              <div className="kicker" style={{ marginBottom: 44, minHeight: 22 }}>
                <Typer text={t("GID · Baseline audit · January 2023", "GID · التقييم الأولي · يناير 2023")} show={active} delay={0.9} />
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {lines.map(([en, ar, sen, sar], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 36 }}>
                    <Words className="h1" text={t(en, ar)} show={active} delay={2 + i * 0.9} style={{ fontSize: t("118px", "92px") }} />
                    <motion.span className="label" style={{ color: "var(--red)", fontSize: 17 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: active ? 1 : 0, x: 0 }} transition={{ delay: 2.6 + i * 0.9, duration: 0.8 }}>
                      — {t(sen, sar)}
                    </motion.span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="b" style={{ maxWidth: 1450, margin: "0 auto", textAlign: "center" }}>
              <p className="h2 it" style={{ fontSize: t("76px", "58px"), lineHeight: 1.18 }}>
                <Words text={t("Think of a factory building with one entrance, no walls between rooms, no fire alarm —", "تخيّل مبنى مصنع له مدخل واحد، بلا جدران بين الغرف، وبلا جهاز إنذار للحريق —")} delay={0.4} stagger={0.07} />{" "}
                <Words className="gold" text={t("and the only copy of the ledgers on the shelf next to the stove.", "والنسخة الوحيدة من الدفاتر على رف بجوار الموقد.")} delay={1.6} stagger={0.07} />
              </p>
              <Rise delay={3.4}>
                <div className="label" style={{ marginTop: 56 }}>{t("That was the company's technology in January 2023.", "هكذا كانت تقنية المعلومات في الشركة في يناير 2023.")}</div>
              </Rise>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* =============== 02 · Title =============== */
export function Title({ active }: SlideProps) {
  const t = useT();
  const rtl = useLang() === "ar";
  return (
    <div className="slide">
      <Photo src={IMG.earth} dim={0.35} from={{ s: 1.25, x: 40 }} to={{ s: 1.08, x: -40, y: -20 }} duration={40} saturate={1} gradient="linear-gradient(90deg, rgba(5,8,12,.95) 0%, rgba(5,8,12,.7) 42%, rgba(5,8,12,.15) 100%)" />
      <div style={{ position: "absolute", insetInlineEnd: 60, top: 200, width: 1000, height: 560 }}>
        <ParticleText words={["2023", "2026"]} hold={3200} active={active} width={1000} height={560} count={3200} gap={6} dotSize={2.6} colors={["#FF5A4E", "#E6B35A"]} />
      </div>
      <motion.div className="label ltr" style={{ position: "absolute", [rtl ? "left" : "right"]: 290, top: 790, color: "var(--muted)" }} initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 4.5, duration: 1.2 }}>
        {t("Jan 2023 — Oct 2026 · 16 quarters", "يناير 2023 — أكتوبر 2026 · 16 ربعاً")}
      </motion.div>
      <div className="pad" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Rise delay={0.3}><div className="kicker">{t("IT & Call Center · Four-year achievement report", "تقنية المعلومات ومركز الاتصال · تقرير إنجازات أربع سنوات")}</div></Rise>
        <h1 className="h1" style={{ fontSize: t("168px", "128px"), margin: "40px 0 46px", maxWidth: 900 }}>
          <Words text={t("From fragile", "من الهشاشة")} delay={0.6} />
          <br />
          <Words className="it gold" text={t("to resilient.", "إلى المرونة.")} delay={1.0} />
        </h1>
        <Rise delay={1.8}>
          <div style={{ display: "grid", gap: 12, fontSize: 24, color: "#c9cdd1" }}>
            <div><b style={{ color: "var(--fg)", fontWeight: 600 }}>Mohamed M. Nashaat</b> · {t("IT & Call Center Manager", "مدير تقنية المعلومات ومركز الاتصال")}</div>
            <div>Global Industrial &amp; Development (GID)</div>
            <div className="label" style={{ marginTop: 14 }}>{t("Presented to the Board of Directors · 17 October 2026 · Confidential", "مقدَّم إلى مجلس الإدارة · 17 أكتوبر 2026 · سري")}</div>
          </div>
        </Rise>
      </div>
    </div>
  );
}

/* =============== 03 · Baseline =============== */
export function Baseline({ step, active }: SlideProps) {
  const t = useT();
  const lang = useLang();
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 20% 30%, #1a0f10 0%, var(--ink) 60%)" }}>
      <Flares a="var(--red)" b="#0f2233" o={0.12} />
      <div className="pad">
        <Rise><div className="kicker" style={{ color: "var(--red)" }}>{t("Chapter 01 · Where we started", "الفصل 01 · نقطة البداية")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 22, fontSize: t("80px", "62px") }}>
          <Words text={t("38 findings.", "38 ملاحظة.")} show={active} delay={0.2} />
        </h2>
        <div className="h3 it muted" style={{ marginTop: 10 }}>
          <Words text={t("Seven of eight domains rated Critical or High.", "سبعة مجالات من ثمانية بدرجة حرج أو مرتفع.")} show={active} delay={0.5} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "470px 1fr", gap: 80, marginTop: 48 }}>
          {/* the 38 findings as a matrix of warning lights */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
              {FINDINGS.map((n, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={active ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1 + i * 0.045, duration: 0.5, ease: EASE }}
                  style={{ aspectRatio: "1", borderRadius: 12, border: "1px solid rgba(255,90,78,.45)", background: "rgba(255,90,78,.08)", display: "grid", placeItems: "center", font: "500 17px var(--mono)", color: "#ffb1aa", position: "relative" }}
                >
                  <motion.span style={{ position: "absolute", inset: 0, borderRadius: 12, boxShadow: "0 0 24px rgba(255,90,78,.55)" }} animate={{ opacity: [0, 0.9, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: (i % 7) * 0.3 + Math.floor(i / 7) * 0.2 }} />
                  {n}
                </motion.div>
              ))}
            </div>
            <Rise delay={3} show={active}>
              <div className="label" style={{ marginTop: 22 }}>{t("Audit references 1–39 · number 28 absent in the source sheet", "مراجع التقييم 1–39 · الرقم 28 غير موجود في المصدر")}</div>
            </Rise>
          </div>

          {/* grouped by business risk */}
          <div style={{ display: "grid", gap: 0, alignContent: "start" }}>
            {DOMAINS.map(([en, ar, sev, ren, rar, refs], i) => (
              <motion.div
                key={en}
                initial={{ opacity: 0, x: lang === "ar" ? -40 : 40 }}
                animate={step >= 1 ? { opacity: 1, x: 0 } : { opacity: 0.0, x: lang === "ar" ? -40 : 40 }}
                transition={{ delay: step >= 1 ? i * 0.09 : 0, duration: 0.8, ease: EASE }}
                style={{ display: "grid", gridTemplateColumns: "280px 120px 1fr", gap: 22, alignItems: "center", padding: "11px 0", borderBottom: "1px solid var(--line)" }}
              >
                <div style={{ fontSize: 22, fontWeight: 600 }}>{t(en, ar)}</div>
                <div><span className={`sev ${sev}`}>{lang === "ar" ? SEV_AR[sev] : sev}</span></div>
                <div style={{ fontSize: 18, color: "#b9bfc5", lineHeight: 1.38 }}>
                  {t(ren, rar)} <span className="mono ltr" style={{ color: "var(--dim)", fontSize: 14 }}>#{refs}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== 04 · The zero =============== */
function Roller({ show }: { show: boolean }) {
  // numbers spin down and land on zero
  const [n, setN] = useState(38);
  useEffect(() => {
    if (!show) { setN(38); return; }
    let v = 38;
    let iv: ReturnType<typeof setTimeout>;
    const tick = () => {
      v -= 1;
      setN(Math.max(0, v));
      if (v > 0) iv = setTimeout(tick, 20 + (38 - v) * 3.2);
    };
    iv = setTimeout(tick, 300);
    return () => clearTimeout(iv);
  }, [show]);
  return <span className="num ltr">{n}</span>;
}

export function Zero({ step, active }: SlideProps) {
  const t = useT();
  return (
    <div className="slide" style={{ background: "#020304" }}>
      <motion.div style={{ position: "absolute", inset: 0 }} animate={{ opacity: step >= 1 ? 1 : 0.35 }} transition={{ duration: 2 }}>
        <Photo src={IMG.circuit} dim={0.78} saturate={0.4} from={{ s: 1.3 }} to={{ s: 1.1, x: 0, y: 0 }} duration={40} gradient="radial-gradient(ellipse at 50% 50%, rgba(2,3,4,.25) 0%, rgba(2,3,4,.95) 70%)" />
      </motion.div>
      <motion.div
        style={{ position: "absolute", left: "50%", top: "50%", width: 1100, height: 1100, marginLeft: -550, marginTop: -550, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,179,90,.22), transparent 60%)" }}
        animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? [1, 1.06, 1] : 0.8 }}
        transition={{ duration: 4, repeat: step >= 1 ? Infinity : 0, ease: "easeInOut" }}
      />
      <div className="pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <motion.div animate={{ y: step >= 1 ? -40 : 0, opacity: step >= 1 ? 0.6 : 1, scale: step >= 1 ? 0.62 : 1 }} transition={{ duration: 1.2, ease: EASE }}>
          <p className="h2 it" style={{ fontSize: t("84px", "62px"), maxWidth: 1400 }}>
            <Words text={t("The result that matters most is the one that did not happen.", "أهم نتيجة هي النتيجة التي لم تحدث.")} show={active} delay={0.4} stagger={0.08} />
          </p>
        </motion.div>

        <AnimatePresence>
          {step >= 1 && (
            <motion.div key="z" initial={{ opacity: 0, scale: 1.4, filter: "blur(30px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.4, ease: EASE }} style={{ display: "flex", alignItems: "center", gap: 70, marginTop: -30 }}>
              <div className="serif gold" style={{ fontSize: 400, lineHeight: 0.9, textShadow: "0 0 80px rgba(230,179,90,.45)" }}><Roller show={step >= 1} /></div>
              <div style={{ textAlign: "start", display: "grid", gap: 18 }}>
                <div className="h3" style={{ fontSize: t("58px", "50px") }}>{t("ransomware incidents", "حوادث فدية")}</div>
                <div className="h3" style={{ fontSize: t("58px", "50px") }}>{t("wiper incidents", "حوادث مسح بيانات")}</div>
                <div className="label" style={{ fontSize: 18 }}>{t("Across 16 quarters and every site, server and cloud", "خلال 16 ربعاً وفي كل موقع وخادم وسحابة")}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={false} animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 30 }} transition={{ duration: 0.9, ease: EASE }} style={{ marginTop: 56, display: "grid", gap: 26, justifyItems: "center" }}>
          <div style={{ display: "flex", gap: 16 }}>
            {[["No outsourced security operations", "بدون مركز عمليات أمنية خارجي"], ["No security consultancy", "بدون شركة استشارات أمنية"], ["No SIEM, EDR or XDR purchase", "بدون شراء منصات SIEM أو EDR أو XDR"]].map(([en, ar], i) => (
              <motion.span key={en} className="chip" initial={{ opacity: 0, y: 14 }} animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 14 }} transition={{ delay: 0.2 + i * 0.15 }} style={{ fontSize: 22 }}>
                <span className="dot" style={{ background: "var(--gold)", boxShadow: "0 0 12px var(--gold)" }} /> {t(en, ar)}
              </motion.span>
            ))}
          </div>
          <div style={{ fontSize: 22, color: "#aeb4ba", maxWidth: 1250 }}>
            {t("Designed, built and run in-house — architecture, configuration, access discipline and recoverable data, on top of baseline firewall and endpoint protection. “Incidents” means incidents, not attempts.",
              "صُمم ونُفذ وأُدير داخلياً — بالتصميم والإعدادات وانضباط الصلاحيات والبيانات القابلة للاستعادة، فوق الحماية الأساسية للجدار الناري والأجهزة. والمقصود الحوادث الفعلية وليس محاولات الهجوم.")}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* =============== 05 · At a glance =============== */
export function Glance({ active }: SlideProps) {
  const t = useT();
  const tiles: { v: number; pre?: string; suf?: string; big?: string; en: string; ar: string; sen: string; sar: string; c?: string }[] = [
    { v: 279, en: "Documented deliverables", ar: "إنجازاً موثقاً", sen: "274 completed · 5 in progress", sar: "274 مكتمل · 5 قيد التنفيذ", c: "var(--gold)" },
    { v: 0, en: "Ransomware or wiper incidents", ar: "حوادث فدية أو مسح بيانات", sen: "In four years", sar: "خلال أربع سنوات", c: "var(--gold)" },
    { v: 32, en: "Concurrent call channels", ar: "قناة اتصال متزامنة", sen: "From personal mobile phones", sar: "بدلاً من الهواتف الشخصية", c: "var(--teal)" },
    { v: 24, pre: "~", suf: "%", en: "Etisalat contract discount", ar: "خصم على عقد Etisalat", sen: "Signed contract · 2023 Q1", sar: "عقد موقع · 2023 ر1", c: "var(--teal)" },
    { v: 8, suf: "/ 8", en: "Servers validly licensed", ar: "خوادم مرخصة", sen: "Without the partnership purchase route", sar: "دون مسار الشراء عبر الشراكة" },
    { v: 100, suf: " Mbps", en: "Factory link", ar: "سرعة اتصال المصنع", sen: "From a single insecure link", sar: "بدلاً من اتصال واحد غير آمن" },
    { v: 32, en: "Factory cameras + new NVR", ar: "كاميرا في المصنع مع NVR جديد", sen: "2025 · plus 2023 and 2026 installs", sar: "2025 · إضافة لتركيبات 2023 و2026" },
    { v: 15, pre: "~", en: "Power BI reports published", ar: "تقرير Power BI منشور", sen: "Plus 15+ SalesBuzz reports", sar: "إضافة لأكثر من 15 تقرير SalesBuzz" },
  ];
  return (
    <div className="slide">
      <Photo src={IMG.servers} dim={0.8} saturate={0.6} from={{ s: 1.2 }} to={{ s: 1.08, x: -60 }} duration={40} gradient="linear-gradient(180deg, rgba(5,8,12,.6), rgba(5,8,12,.92))" />
      <div className="pad">
        <Rise><div className="kicker">{t("Results at a glance", "النتائج في لمحة")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24 }}>
          <Words text={t("Four years,", "أربع سنوات،")} show={active} delay={0.2} /> <Words className="it gold" text={t("in eight numbers.", "في ثمانية أرقام.")} show={active} delay={0.4} />
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22, marginTop: 54 }}>
          {tiles.map((x, i) => (
            <Rise key={i} delay={0.5 + i * 0.12} show={active}>
              <div className="card" style={{ padding: "28px 32px 26px", height: 258, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                <motion.div style={{ position: "absolute", left: 0, top: 0, height: 3, background: x.c ?? "var(--line2)" }} initial={{ width: 0 }} animate={{ width: active ? "100%" : 0 }} transition={{ delay: 0.8 + i * 0.12, duration: 1.4, ease: EASE }} />
                <div className="serif ltr" style={{ fontSize: 100, lineHeight: 1, color: x.c ?? "var(--fg)", whiteSpace: "nowrap" }}>
                  <CountUp to={x.v} prefix={x.pre} show={active} delay={0.6 + i * 0.12} />
                  {x.suf && <span style={{ fontSize: 52, marginInlineStart: 6, opacity: 0.85 }}>{x.suf.trim()}</span>}
                </div>
                <div style={{ fontSize: 23, fontWeight: 600, marginTop: "auto" }}>{t(x.en, x.ar)}</div>
                <div style={{ fontSize: 17, color: "var(--muted)", marginTop: 6 }}>{t(x.sen, x.sar)}</div>
              </div>
            </Rise>
          ))}
        </div>
        <Rise delay={1.8} show={active}>
          <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
            {[["IT team: 2 → 3, all senior", "فريق IT: من 2 إلى 3، جميعهم خبراء"], ["9 colleagues and 6 teams trained", "تدريب 9 زملاء و6 فرق"], ["CRM · HR · asset register · service desk · MDM — from zero", "CRM · HR · سجل الأصول · مكتب الدعم · MDM — من الصفر"]].map(([en, ar]) => (
              <span key={en} className="chip"><span className="dot" />{t(en, ar)}</span>
            ))}
          </div>
        </Rise>
      </div>
    </div>
  );
}
