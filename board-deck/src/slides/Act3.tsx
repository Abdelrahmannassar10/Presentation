import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useT, useLang } from "../i18n";
import { CountUp, EASE, EASE_IN_OUT, Flares, Letterbox, Photo, Rise, Words, useTicker } from "../fx";
import ParticleText from "../fx/ParticleText";
import { IMG } from "../assets/img";
import { CONTRACTS, HUB, NEXTA, NEXTB, PEOPLE, Q, QHEAD, QTH, REG, TEAMS, VALUES, YEARS } from "../data/content";
import type { SlideProps } from "./types";

/* =============== 13 · Business systems in orbit =============== */
const SYS: { n: string; ring: 0 | 1; en: string; ar: string; y: string }[] = [
  { n: "Odoo CRM", ring: 0, y: "2023 →", en: "Launched v14 in 2023, rebuilt on v15 in 2024. Complaints, call logging, REST and Swagger APIs. Odoo 19 + Issabel integration next.", ar: "إطلاق الإصدار 14 في 2023 وإعادة البناء على 15 في 2024. الشكاوى وتوثيق المكالمات وواجهات REST وSwagger. ربط Odoo 19 مع Issabel قادم." },
  { n: "SalesBuzz", ring: 0, y: "v4.58 → 5.15", en: "Two major upgrades, each rehearsed on a test copy. 15+ reports, credit controls at order entry, isolated DMS and DS servers.", ar: "ترقيتان كبيرتان، كل منهما مجربة على نسخة اختبار. أكثر من 15 تقريراً، وضوابط ائتمان عند إدخال الطلب، وخوادم DMS وDS معزولة." },
  { n: "AX 2012", ring: 0, y: "in-house", en: "From freelancer support to in-house operation. Roles reset, fiscal years closed, full manufacturing cycle with BOM, quality and cost.", ar: "من دعم مستقل خارجي إلى تشغيل داخلي. إعادة ضبط الصلاحيات، وإقفال السنوات المالية، ودورة تصنيع كاملة بالجودة والتكاليف." },
  { n: "Mago HR", ring: 0, y: "2024 live", en: "From no HR system to live HR with employee self-service, attendance machines, and factory and warehouse users.", ar: "من غياب نظام الموارد البشرية إلى نظام يعمل بالخدمة الذاتية وأجهزة الحضور ومستخدمي المصنع والمستودعات." },
  { n: "Issabel", ring: 0, y: "32 channels", en: "Company-owned call-center platform: 32 SIP channels, queues, recording, multi-brand IVR.", ar: "منصة مركز اتصال تملكها الشركة: 32 قناة SIP وقوائم انتظار وتسجيل ورد صوتي لعدة علامات." },
  { n: "Power BI", ring: 1, y: "~15 reports", en: "About 15 reports published in 2025, plus ELA, distributor and aging dashboards on live data.", ar: "حوالي 15 تقريراً منشوراً في 2025، إضافة للوحات ELA والموزعين وأعمار الديون." },
  { n: "Snipe-IT", ring: 1, y: "2023", en: "First auditable asset register: asset codes and legal custody forms tied to employee ID.", ar: "أول سجل أصول قابل للتدقيق: أكواد الأصول ونماذج عهدة قانونية مرتبطة برقم الموظف." },
  { n: "ManageEngine", ring: 1, y: "2024 live", en: "Service desk live since 2024 Q1 — every IT request tracked, run by a trained colleague.", ar: "مكتب الدعم يعمل منذ الربع الأول 2024 — كل طلب موثق، ويديره زميل مدرَّب." },
  { n: "Scalefusion", ring: 1, y: "2026", en: "Device management on every handheld; replaced SOTI on best value and cost.", ar: "إدارة كل الأجهزة المحمولة؛ حل محل SOTI بأفضل قيمة وتكلفة." },
  { n: "Proxmox", ring: 1, y: "2023", en: "Virtualization on existing hardware — test and staging on demand, no hypervisor licence.", ar: "خوادم افتراضية على الأجهزة الحالية — بيئات اختبار عند الطلب وبدون ترخيص." },
  { n: "Kaspersky", ring: 1, y: "2026", en: "Central protection for clients and servers, following GravityZone; IT team trained on the console.", ar: "حماية مركزية للأجهزة والخوادم بعد GravityZone، مع تدريب الفريق على لوحة الإدارة." },
  { n: "Fortigate", ring: 1, y: "2025", en: "Old firewall replaced with a modern, supported perimeter.", ar: "استبدال الجدار الناري القديم بحماية حديثة مدعومة." },
  { n: "Azure", ring: 1, y: "2023 →", en: "Mago HR, DMS and DS servers in the cloud — port-secured and automatically backed up.", ar: "Mago HR وخوادم DMS وDS على السحابة — بمنافذ مؤمنة ونسخ احتياطي آلي." },
];
export function Systems({ active }: SlideProps) {
  const t = useT();
  const rtl = useLang() === "ar";
  const tick = useTicker(active, 2600, 10000);
  const [hover, setHover] = useState<number | null>(null);
  const sel = hover ?? tick % SYS.length;
  const cx = 470, cy = 470;
  return (
    <div className="slide">
      <Photo src={IMG.chip} dim={0.85} saturate={0.5} from={{ s: 1.2 }} to={{ s: 1.06 }} duration={40} gradient="linear-gradient(90deg, rgba(5,8,12,.97) 0%, rgba(5,8,12,.82) 50%, rgba(5,8,12,.7) 100%)" />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 09 · Business systems", "الفصل 09 · أنظمة الأعمال")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, maxWidth: 820, fontSize: t("80px", "60px") }}>
          <Words text={t("A digital backbone", "عمود فقري رقمي")} show={active} delay={0.2} /> <Words className="it gold" text={t("the business owns.", "تملكه الشركة.")} show={active} delay={0.45} />
        </h2>
        <Rise delay={0.7}><p className="lede" style={{ marginTop: 26, maxWidth: 760, fontSize: 24 }}>{t("Built from zero: CRM, HR, asset register, service desk, device management, BI, virtualization, file server and automated backups — operated in-house, not by freelancers.", "بُني من الصفر: CRM والموارد البشرية وسجل الأصول ومكتب الدعم وإدارة الأجهزة وBI والخوادم الافتراضية وخادم الملفات والنسخ الآلي — يُدار داخلياً وليس عبر مستقلين.")}</p></Rise>
        <div style={{ width: 760, marginTop: 44, minHeight: 230 }}>
          <AnimatePresence mode="wait">
            <motion.div key={sel} className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }} style={{ padding: "26px 30px", borderInlineStart: `3px solid ${SYS[sel].ring ? "var(--teal)" : "var(--gold)"}` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <span className="h3 ltr">{SYS[sel].n}</span>
                <span className="label ltr" style={{ color: SYS[sel].ring ? "var(--teal)" : "var(--gold)" }}>{SYS[sel].y}</span>
              </div>
              <div style={{ fontSize: 21, color: "#c8cdd1", marginTop: 12, lineHeight: 1.5 }}>{t(SYS[sel].en, SYS[sel].ar)}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="ltr" style={{ position: "absolute", [rtl ? "left" : "right"]: 80, top: 70, width: 940, height: 940 }}>
        <svg width={940} height={940} style={{ position: "absolute", inset: 0 }}>
          <motion.circle cx={cx} cy={cy} r={200} fill="none" stroke="var(--gold)" strokeOpacity={0.35} strokeDasharray="2 8" initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ duration: 1.6 }} />
          <motion.circle cx={cx} cy={cy} r={380} fill="none" stroke="var(--teal)" strokeOpacity={0.3} strokeDasharray="2 8" initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ duration: 2, delay: 0.3 }} />
          <circle cx={cx} cy={cy} r={110} fill="rgba(230,179,90,.07)" stroke="var(--gold)" strokeOpacity={0.5} />
        </svg>
        <motion.div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", textAlign: "center" }} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1, ease: EASE }}>
          <div className="serif gold" style={{ fontSize: 62, lineHeight: 1 }}>GID</div>
          <div className="label" style={{ fontSize: 11, marginTop: 6 }}>{t("Owned in-house", "مملوك داخلياً")}</div>
        </motion.div>
        {[0, 1].map((ring) => {
          const items = SYS.map((s, i) => ({ ...s, i })).filter((s) => s.ring === ring);
          const r = ring ? 380 : 200, dur = ring ? 160 : 110, dirn = ring ? -1 : 1;
          return (
            <motion.div key={ring} style={{ position: "absolute", inset: 0 }} animate={{ rotate: 360 * dirn }} transition={{ duration: dur, repeat: Infinity, ease: "linear" }}>
              {items.map((s, k) => {
                const a = (k / items.length) * Math.PI * 2 - Math.PI / 2;
                const on = sel === s.i;
                return (
                  <div key={s.n} style={{ position: "absolute", left: cx + Math.cos(a) * r, top: cy + Math.sin(a) * r, width: 0, height: 0 }}>
                    <motion.button
                      onPointerEnter={() => setHover(s.i)} onPointerLeave={() => setHover(null)}
                      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: on ? 1.18 : 1, rotate: -360 * dirn }}
                      transition={{ opacity: { delay: 0.8 + s.i * 0.08 }, scale: { duration: 0.4 }, rotate: { duration: dur, repeat: Infinity, ease: "linear" } }}
                      style={{ position: "absolute", left: 0, top: 0, translateX: "-50%", translateY: "-50%", whiteSpace: "nowrap", padding: "11px 18px", borderRadius: 999, fontSize: 18, fontWeight: 600,
                        background: on ? (ring ? "var(--teal)" : "var(--gold)") : "rgba(11,18,25,.9)", color: on ? "#081014" : "var(--fg)", border: `1px solid ${ring ? "rgba(79,209,197,.45)" : "rgba(230,179,90,.5)"}`, boxShadow: on ? `0 0 40px ${ring ? "rgba(79,209,197,.6)" : "rgba(230,179,90,.6)"}` : "none" }}>
                      {s.n}
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* =============== 14 · Group expansion =============== */
export function Expansion({ active }: SlideProps) {
  const t = useT();
  const cx = 470, cy = 430;
  return (
    <div className="slide">
      <Photo src={IMG.riyadh} dim={0.55} saturate={1} from={{ s: 1.25, y: 20 }} to={{ s: 1.08, y: -20, x: 0 }} duration={40} gradient="linear-gradient(90deg, rgba(5,8,12,.96) 0%, rgba(5,8,12,.75) 45%, rgba(5,8,12,.45) 100%)" />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 10 · Group growth", "الفصل 10 · نمو المجموعة")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, maxWidth: 780, fontSize: t("80px", "60px") }}>
          <Words text={t("New businesses joined", "الشركات الجديدة انضمت")} show={active} delay={0.2} /> <Words className="it gold" text={t("platforms already built.", "إلى منصات قائمة بالفعل.")} show={active} delay={0.5} />
        </h2>
        <Rise delay={0.8}><p className="lede" style={{ marginTop: 30, maxWidth: 700, fontSize: 24 }}>{t("Instead of buying separate systems for each company, related businesses, distributors and new brands were brought onto shared platforms run by the same team — from Egypt to the Saudi web presence.", "بدلاً من شراء أنظمة منفصلة لكل شركة، انضمت الشركات التابعة والموزعون والعلامات الجديدة إلى منصات مشتركة يديرها نفس الفريق — من مصر إلى الحضور الرقمي في السعودية.")}</p></Rise>
      </div>
      <div style={{ position: "absolute", insetInlineEnd: 60, top: 120, width: 940, height: 860 }}>
        <svg width={940} height={860} style={{ position: "absolute", inset: 0 }}>
          {HUB.map((_, i) => {
            const a = (i / HUB.length) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(a) * 340, y = cy + Math.sin(a) * 300;
            const d = `M ${cx} ${cy} L ${x} ${y}`;
            return (
              <g key={i}>
                <motion.path d={d} stroke="var(--gold)" strokeOpacity={0.5} strokeWidth={1.5} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: active ? 1 : 0 }} transition={{ delay: 0.8 + i * 0.18, duration: 0.8 }} />
                {active && <circle r={4} fill="var(--gold)" style={{ filter: "drop-shadow(0 0 6px #E6B35A)" }}><animateMotion dur="2.2s" begin={`${1.6 + i * 0.25}s`} repeatCount="indefinite" path={d} /></circle>}
              </g>
            );
          })}
          <motion.circle cx={cx} cy={cy} r={95} fill="rgba(5,8,12,.85)" stroke="var(--gold)" strokeWidth={1.5} initial={{ scale: 0 }} animate={{ scale: active ? 1 : 0 }} transition={{ duration: 0.8, ease: EASE }} style={{ transformOrigin: `${cx}px ${cy}px` }} />
          <motion.circle cx={cx} cy={cy} r={95} fill="none" stroke="var(--gold)" initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 2.6, repeat: Infinity }} style={{ transformOrigin: `${cx}px ${cy}px` }} />
        </svg>
        <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", textAlign: "center", width: 180 }}>
          <div className="serif gold" style={{ fontSize: 44, lineHeight: 1 }}>GID</div>
          <div className="label" style={{ fontSize: 11, marginTop: 6 }}>{t("Shared platforms", "منصات مشتركة")}</div>
        </div>
        {HUB.map(([en, ar, sen, sar], i) => {
          const a = (i / HUB.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <motion.div key={en} className="card" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.7 }} transition={{ delay: 1.2 + i * 0.18, duration: 0.6, ease: EASE }}
              style={{ position: "absolute", left: cx + Math.cos(a) * 340, top: cy + Math.sin(a) * 300, width: 230, marginLeft: -115, marginTop: -44, padding: "13px 16px", textAlign: "center" }}>
              <div style={{ fontWeight: 600, fontSize: 19 }}>{t(en, ar)}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 3, lineHeight: 1.35 }}>{t(sen, sar)}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* =============== 15 · People =============== */
function Person({ on, delay, gold }: { on: boolean; delay: number; gold?: boolean }) {
  const c = gold ? "var(--gold)" : "var(--teal)";
  return (
    <motion.svg width={120} height={170} viewBox="0 0 120 170" initial={{ opacity: 0, y: 30 }} animate={{ opacity: on ? 1 : 0.1, y: on ? 0 : 30 }} transition={{ delay, duration: 0.9, ease: EASE }}>
      <circle cx={60} cy={44} r={30} fill="none" stroke={c} strokeWidth={3} />
      <path d="M 10 165 C 10 110, 110 110, 110 165" fill="none" stroke={c} strokeWidth={3} />
      <motion.circle cx={60} cy={44} r={30} fill={c} initial={{ opacity: 0 }} animate={{ opacity: on ? [0, 0.25, 0.1] : 0 }} transition={{ delay: delay + 0.6, duration: 1.4 }} />
    </motion.svg>
  );
}
export function People({ step, active }: SlideProps) {
  const t = useT();
  return (
    <div className="slide">
      <Photo src={IMG.team} dim={0.78} saturate={0.5} from={{ s: 1.2 }} to={{ s: 1.06, x: -30 }} duration={36} gradient="linear-gradient(90deg, rgba(5,8,12,.97) 0%, rgba(5,8,12,.85) 55%, rgba(5,8,12,.6) 100%)" />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 11 · People", "الفصل 11 · الأفراد")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, fontSize: t("84px", "64px") }}>
          <Words text={t("Two people, then three.", "شخصان، ثم ثلاثة.")} show={active} delay={0.2} /> <Words className="it gold" text={t("All senior today.", "وجميعهم اليوم خبراء.")} show={active} delay={0.5} />
        </h2>
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="a" exit={{ opacity: 0, y: -20 }} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, marginTop: 80 }}>
              {[
                ["2023 – 2024", "2023 – 2024", 2, "The two-person team recorded in the audit", "الفريق المكوَّن من شخصين كما ورد في التقييم", "Coached daily; took ownership of service desk, device management and endpoint protection.", "تدريب يومي؛ وتسلّم مكتب الدعم وإدارة الأجهزة وحماية الأجهزة."],
                ["2025 – 2026", "2025 – 2026", 3, "One more IT employee added", "انضمام موظف ثالث", "Brought up to speed through hands-on work on live projects.", "اكتسب الخبرة من خلال العمل المباشر على المشروعات."],
                ["Today", "اليوم", 3, "All team members at senior level", "جميع الأعضاء بمستوى خبير", "Platforms and daily operations run independently — delivery no longer depends on one person.", "تشغيل الأنظمة والعمل اليومي باستقلالية — ولم يعد الإنجاز يعتمد على شخص واحد."],
              ].map(([w, wa, n, en, ar, den, dar], i) => (
                <Rise key={i} delay={0.6 + i * 0.5}>
                  <div className="label gold">{t(w as string, wa as string)}</div>
                  <div style={{ display: "flex", gap: 6, margin: "22px 0 18px" }}>
                    {[0, 1, 2].map((k) => <Person key={k} on={k < (n as number)} delay={0.9 + i * 0.5 + k * 0.15} gold={i === 2} />)}
                  </div>
                  <div style={{ fontSize: 25, fontWeight: 600 }}>{t(en as string, ar as string)}</div>
                  <div style={{ fontSize: 19, color: "#b2b9bf", marginTop: 8 }}>{t(den as string, dar as string)}</div>
                </Rise>
              ))}
            </motion.div>
          ) : (
            <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 50 }}>
              <div className="label">{t("Capability built outside IT · 9 named colleagues and 6 teams own platforms", "قدرات بُنيت خارج تقنية المعلومات · 9 زملاء و6 فرق يديرون الأنظمة")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 26 }}>
                {PEOPLE.map(([n, en, ar, w], i) => (
                  <motion.div key={n} className="card" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE }} style={{ padding: "22px 24px", display: "flex", gap: 18, alignItems: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1.5px solid var(--gold)", display: "grid", placeItems: "center", color: "var(--gold)", fontFamily: "var(--serif)", fontSize: 22, flex: "none" }}>{n[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><b style={{ fontWeight: 600, fontSize: 23 }} className="ltr">{n}</b><span className="mono ltr" style={{ fontSize: 13, color: "var(--dim)" }}>{w}</span></div>
                      <div style={{ fontSize: 18, color: "var(--muted)", marginTop: 2 }}>{t(en, ar)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
                {TEAMS.map(([en, ar], i) => (
                  <motion.span key={en} className="chip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.08 }}><span className="dot" />{t(en, ar)} {t("team", "")}</motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* =============== 16 · Value =============== */
export function Value({ active }: SlideProps) {
  const t = useT();
  return (
    <div className="slide">
      <Photo src={IMG.towers} dim={0.8} saturate={0.4} from={{ s: 1.25 }} to={{ s: 1.06, y: 30, x: 0 }} duration={40} gradient="linear-gradient(180deg, rgba(5,8,12,.75), rgba(5,8,12,.94))" />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 12 · Financial and risk value", "الفصل 12 · القيمة المالية وتقليل المخاطر")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, fontSize: t("80px", "62px") }}>
          <Words text={t("Five kinds of value.", "خمسة أنواع من القيمة.")} show={active} delay={0.2} /> <Words className="it gold" text={t("Never double-counted.", "دون احتساب أي بند مرتين.")} show={active} delay={0.5} />
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18, marginTop: 56 }}>
          {VALUES.map(([en, ar, ien, iar, ben, bar, c], i) => (
            <motion.div key={en} className="card" initial={{ opacity: 0, y: 80, rotateX: 25 }} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 80, rotateX: 0 }} transition={{ delay: 0.6 + i * 0.14, duration: 1, ease: EASE }}
              style={{ padding: "28px 26px", height: 450, display: "flex", flexDirection: "column", transformPerspective: 1200, borderTop: `3px solid ${c}` }}>
              <div className="mono" style={{ fontSize: 15, color: c }}>{String(i + 1).padStart(2, "0")}</div>
              <div className="h3" style={{ fontSize: t("40px", "34px"), marginTop: 14 }}>{t(en, ar)}</div>
              <div style={{ fontSize: 19, color: "#bcc2c7", marginTop: 18, lineHeight: 1.5 }}>{t(ien, iar)}</div>
              <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                <span className="label" style={{ color: c, fontSize: 13 }}>{t(ben, bar)}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <Rise delay={1.6} show={active}>
          <div style={{ display: "flex", gap: 14, marginTop: 28, alignItems: "center", flexWrap: "wrap" }}>
            {CONTRACTS.map(([k, en, ar]) => (
              <span key={en} className="chip" style={{ fontSize: 17 }}><b className="gold ltr" style={{ fontWeight: 600 }}>{k}</b>{t(en, ar)}</span>
            ))}
          </div>
          <div style={{ fontSize: 17, color: "var(--muted)", marginTop: 18 }}>
            {t("Amounts appear only where a signed contract or documented comparison exists. Risk exposure avoided is shown as risk reduction — never as a cash saving.", "لا تظهر مبالغ إلا بعقد موقع أو مقارنة موثقة. والمخاطر التي تم تجنبها تظهر كتقليل للمخاطر — وليست وفراً نقدياً أبداً.")}
          </div>
        </Rise>
      </div>
    </div>
  );
}

/* =============== 17 · Timeline film strip =============== */
export function Timeline({ step, active }: SlideProps) {
  const t = useT();
  const ar = useLang() === "ar";
  const CW = 372, GAP = 22, YW = 4 * (CW + GAP) + 60;
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 50% 120%, #10202c 0%, var(--ink) 60%)" }}>
      <Flares o={0.08} />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 13 · Quarter by quarter", "الفصل 13 · ربعاً بربع")}</div></Rise>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginTop: 20 }}>
          <h2 className="h2" style={{ fontSize: t("80px", "62px") }}>
            <AnimatePresence mode="wait">
              <motion.span key={step} style={{ display: "inline-block" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
                <span className="ltr">{YEARS[step][0]}</span> · <span className="it gold">{t(YEARS[step][2], YEARS[step][3])}</span>
              </motion.span>
            </AnimatePresence>
          </h2>
          <div className="serif ltr" style={{ fontSize: 80, lineHeight: 1 }}>
            <span className="gold"><CountUp key={step} to={YEARS[step][1]} show={active} duration={1.2} /></span>
            <span className="label" style={{ marginInlineStart: 14 }}>{t("deliverables", "إنجازاً")}</span>
          </div>
        </div>
      </div>
      <div className="ltr" style={{ position: "absolute", left: 140, right: 0, top: 380, height: 560, overflow: "hidden", maskImage: "linear-gradient(90deg, #000 85%, transparent)" }}>
        {/* ghost years parallax */}
        <motion.div style={{ position: "absolute", top: -40, left: 0, display: "flex" }} animate={{ x: -step * YW * 0.55 }} transition={{ duration: 1.6, ease: EASE_IN_OUT }}>
          {YEARS.map(([y]) => <div key={y} className="serif" style={{ width: YW * 0.55, fontSize: 380, lineHeight: 1, color: "transparent", WebkitTextStroke: "1.5px rgba(230,179,90,.16)" }}>{y}</div>)}
        </motion.div>
        <motion.div style={{ position: "absolute", top: 70, left: 0, display: "flex", gap: GAP }} animate={{ x: -step * YW }} transition={{ duration: 1.6, ease: EASE_IN_OUT }}>
          {Q.map((v, i) => {
            const yi = Math.floor(i / 4), cur = yi === step, prog = i === 15;
            return (
              <motion.div key={i} className="card" animate={{ opacity: cur ? 1 : 0.28, scale: cur ? 1 : 0.94 }} transition={{ duration: 0.8 }}
                style={{ width: CW, flex: "none", height: 440, padding: "26px 28px", marginRight: i % 4 === 3 ? 60 : 0, display: "flex", flexDirection: "column", borderColor: prog ? "rgba(243,164,59,.5)" : undefined, borderStyle: prog ? "dashed" : "solid" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="label gold">{2023 + yi} · Q{(i % 4) + 1}</span>
                  {prog && <span className="label" style={{ color: "var(--amber)", fontSize: 12 }}>{t("In progress", "قيد التنفيذ")}</span>}
                </div>
                <div className="serif" style={{ fontSize: 96, lineHeight: 1, marginTop: 14 }}>{v}</div>
                <div className={ar ? "" : "serif it"} style={{ fontSize: ar ? 26 : 30, fontWeight: ar ? 700 : 400, marginTop: 10, color: "var(--fg)", lineHeight: 1.2, direction: ar ? "rtl" : "ltr" }}>{t(...QTH[i])}</div>
                <div style={{ fontSize: 16, color: "#aab1b7", marginTop: "auto", lineHeight: 1.5, direction: ar ? "rtl" : "ltr" }}>{t(...QHEAD[i])}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {/* year rail */}
      <div className="ltr" style={{ position: "absolute", left: 140, right: 140, bottom: 108, display: "flex", gap: 10 }}>
        {YEARS.map(([y], i) => (
          <div key={y} style={{ flex: 1 }}>
            <div style={{ height: 3, background: "var(--line)", borderRadius: 2, overflow: "hidden" }}>
              <motion.div style={{ height: "100%", background: "var(--gold)" }} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 1.2, ease: EASE }} />
            </div>
            <div className="mono" style={{ fontSize: 14, marginTop: 8, color: i === step ? "var(--gold)" : "var(--dim)" }}>{y}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =============== 18 · Next 12 months =============== */
export function Next({ step, active }: SlideProps) {
  const t = useT();
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 80% 20%, #10202c 0%, var(--ink) 60%)" }}>
      <Flares o={0.1} />
      <div className="pad">
        <Rise><div className="kicker">{t("Chapter 14 · The next twelve months", "الفصل 14 · الاثنا عشر شهراً القادمة")}</div></Rise>
        <h2 className="h2" style={{ marginTop: 24, fontSize: t("80px", "62px") }}>
          <Words text={t("Finish what is in progress.", "استكمال ما بدأ.")} show={active} delay={0.2} /><br />
          <Words className="it gold" text={t("Strengthen what is built.", "وتعزيز ما تم بناؤه.")} show={active} delay={0.5} />
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 70, marginTop: 56 }}>
          <div>
            <div className="label teal">{t("In progress · from the 2026 Q4 log", "قيد التنفيذ · من سجل الربع الرابع 2026")}</div>
            <div style={{ display: "grid", gap: 0, marginTop: 14 }}>
              {NEXTA.map(([en, ar, den, dar], i) => (
                <Rise key={en} delay={0.6 + i * 0.1} y={18}>
                  <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
                    <motion.span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--teal)", marginTop: 8 }} animate={{ boxShadow: ["0 0 0 0 rgba(79,209,197,.6)", "0 0 0 10px rgba(79,209,197,0)"] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }} />
                    <div><div style={{ fontSize: 24, fontWeight: 600 }}>{t(en, ar)}</div><div style={{ fontSize: 18, color: "var(--muted)" }}>{t(den, dar)}</div></div>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
          <motion.div initial={false} animate={{ opacity: step >= 1 ? 1 : 0.12, filter: step >= 1 ? "blur(0px)" : "blur(6px)" }} transition={{ duration: 0.9 }}>
            <div className="label gold">{t("Recommended strengthening · for Board approval", "تعزيزات مقترحة · لموافقة مجلس الإدارة")}</div>
            <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
              {NEXTB.map(([en, ar], i) => (
                <motion.div key={en} className="card" initial={false} animate={{ x: step >= 1 ? 0 : 30, opacity: step >= 1 ? 1 : 0.4 }} transition={{ delay: step >= 1 ? 0.15 + i * 0.12 : 0, duration: 0.7, ease: EASE }}
                  style={{ padding: "20px 24px", display: "flex", gap: 20, alignItems: "center" }}>
                  <span className="serif gold" style={{ fontSize: 40, lineHeight: 1 }}>{i + 1}</span>
                  <span style={{ fontSize: 22 }}>{t(en, ar)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* =============== 19 · Finale + credits =============== */
const YEAR_HEAD: Record<string, [string, string]> = {
  "2023": ["2023 · Foundations", "2023 · بناء الأساس"], "2024": ["2024 · Go-live and industrialisation", "2024 · التشغيل والتصنيع"],
  "2025": ["2025 · Growth and modernisation", "2025 · النمو والتحديث"], "2026": ["2026 · Hardening, isolation and integration", "2026 · التحصين والعزل والتكامل"],
};
function Credits({ active }: { active: boolean }) {
  const t = useT();
  const ROW = 46;
  const rows: ({ h: string } | { r: (typeof REG)[number] })[] = [];
  let y = "";
  REG.forEach((r) => { const yy = r.q.slice(0, 4); if (yy !== y) { y = yy; rows.push({ h: yy }); } rows.push({ r }); });
  const total = rows.length * ROW + 1400;
  const [done, setDone] = useState(false);
  useEffect(() => { setDone(false); }, [active]);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", maskImage: "linear-gradient(180deg, transparent 12%, #000 26%, #000 74%, transparent 88%)" }}>
      <motion.div className="ltr" initial={{ y: 1080 }} animate={{ y: active ? -total + 1080 : 1080 }} transition={{ duration: total / 150, ease: "linear" }} onAnimationComplete={() => setDone(true)}
        style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div className="kicker">{t("The complete register", "السجل الكامل")}</div>
          <div className="serif" style={{ fontSize: 72, marginTop: 14 }}>{t("279 deliverables", "279 إنجازاً")}</div>
        </div>
        {rows.map((x, i) =>
          "h" in x ? (
            <div key={i} style={{ height: ROW * 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="serif gold" style={{ fontSize: 40 }}>{t(...YEAR_HEAD[x.h])}</span>
            </div>
          ) : (
            <div key={i} style={{ height: ROW, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center" }}>
              <div className="mono" style={{ textAlign: "right", fontSize: 15, color: "var(--muted)", letterSpacing: ".12em" }}>{x.r.id}{x.r.p ? " · IN PROGRESS" : ""}</div>
              <div style={{ fontSize: 20, color: "#e3e0d9", maxWidth: 760, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.r.a}</div>
            </div>
          ),
        )}
      </motion.div>
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div>
              <div className="serif" style={{ fontSize: 140 }}>{t("Thank you.", "شكراً لكم.")}</div>
              <div className="label" style={{ marginTop: 20 }}>{t("Questions and discussion", "الأسئلة والنقاش")}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export function Finale({ step, active }: SlideProps) {
  const t = useT();
  return (
    <div className="slide" style={{ background: "#020304" }}>
      <Letterbox on={active} />
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div key="a" style={{ position: "absolute", inset: 0 }} exit={{ opacity: 0, transition: { duration: 1 } }}>
            <Photo src={IMG.earth} dim={0.6} saturate={0.9} from={{ s: 1.1 }} to={{ s: 1.25, x: 0, y: 0 }} duration={50} gradient="radial-gradient(ellipse at 50% 40%, rgba(2,3,4,.3), rgba(2,3,4,.92) 75%)" />
            <div style={{ position: "absolute", left: 260, top: 196, width: 1400, height: 330 }}>
              <ParticleText words={[t("fragile", "هشّة"), t("resilient", "مرنة")]} hold={2600} active={active} width={1400} height={340} count={3000} gap={5} dotSize={1.8}
                font={t('italic 400 {s}px "Instrument Serif"', '700 {s}px "IBM Plex Sans Arabic"')} colors={["#FF5A4E", "#E6B35A"]} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center" }}>
              <Rise delay={3.4}><div className="kicker">{t("Four years · built in-house", "أربع سنوات · بُنيت داخلياً")}</div></Rise>
              <div style={{ display: "flex", justifyContent: "center", gap: 120, marginTop: 44 }}>
                {[[279, "Deliverables", "إنجازاً"], [0, "Ransomware or wiper incidents", "حوادث فدية أو مسح"], [3, "IT specialists, all senior", "متخصصين جميعهم خبراء"]].map(([v, en, ar], i) => (
                  <Rise key={i} delay={3.8 + i * 0.25}>
                    <div className="serif gold" style={{ fontSize: 110, lineHeight: 1 }}><CountUp to={v as number} show={active} delay={3.8 + i * 0.25} /></div>
                    <div className="label" style={{ marginTop: 10 }}>{t(en as string, ar as string)}</div>
                  </Rise>
                ))}
              </div>
              <Rise delay={4.8}>
                <div style={{ marginTop: 60, fontSize: 22, color: "#c6cacd" }}>
                  <b style={{ color: "var(--fg)", fontWeight: 600 }}>Mohamed M. Nashaat</b> · {t("IT & Call Center Manager", "مدير تقنية المعلومات ومركز الاتصال")} · Global Industrial &amp; Development
                </div>
              </Rise>
            </div>
          </motion.div>
        ) : (
          <motion.div key="b" style={{ position: "absolute", inset: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <Credits active={active && step >= 1} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
