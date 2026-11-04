import { motion, AnimatePresence } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useT } from "../i18n";
import { CountUp, EASE, Flares, Photo, Rise, useTicker } from "../fx";
import { IMG } from "../assets/img";
import { BI_AREAS, CC_FLOW, CC_ROAD, CC_SUPER, CC_TESTS, EX_FLOW, EX_NUMS, EX_TRUST } from "../data/content";
import type { SlideProps } from "./types";

/* Three scenes built from real product screens. Every screen uses sample or hidden data, and says so. */

const GLOW = "0 40px 90px -30px rgba(0,0,0,.85), 0 0 60px -18px rgba(95,227,214,.28)";

function Shot({ src, alt, style, delay = 0.25 }: { src: string; alt: string; style?: CSSProperties; delay?: number }) {
  return (
    <motion.img src={src} alt={alt} initial={{ opacity: 0, y: 34, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay, ease: EASE }}
      style={{ display: "block", width: "100%", borderRadius: 14, border: "1px solid rgba(255,240,215,.2)", boxShadow: GLOW, ...style }} />
  );
}

function Stage({ step, head, children }: { step: number; head: ReactNode; children: ReactNode }) {
  return (
    <>
      <div style={{ position: "relative", height: 178, marginTop: 20 }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} style={{ position: "absolute", inset: 0 }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.5 }}>{head}</motion.div>
        </AnimatePresence>
      </div>
      <div style={{ position: "relative", height: 650, marginTop: 14 }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} style={{ position: "absolute", inset: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 0.45 }}>{children}</motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

function Two({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "600px 1fr", gap: 64, alignItems: "start" }}>{children}</div>;
}

function Note({ en, ar }: { en: string; ar: string }) {
  const t = useT();
  return <div className="label" style={{ marginTop: 14, fontSize: 13 }}>{t(en, ar)}</div>;
}

function Stat({ to, prefix = "", suffix = "", en, ar, show, delay, color = "var(--gold)" }: { to: number; prefix?: string; suffix?: string; en: string; ar: string; show: boolean; delay: number; color?: string }) {
  const t = useT();
  return (
    <Rise delay={delay - 0.15} y={18}>
      <div className="card" style={{ padding: "16px 20px", borderTop: `3px solid ${color}`, height: "100%" }}>
        <div className="serif ltr" style={{ fontSize: 56, lineHeight: 1, color }}><CountUp to={to} prefix={prefix} suffix={suffix} show={show} delay={delay} /></div>
        <div style={{ fontSize: 18, marginTop: 8, color: "#d4d9de", lineHeight: 1.3 }}>{t(en, ar)}</div>
      </div>
    </Rise>
  );
}

/** the ordered path of a call or an exam, lighting up one stop at a time */
function Path({ items, active, color = "var(--teal)" }: { items: [string, string, string, string][]; active: boolean; color?: string }) {
  const t = useT();
  const lit = useTicker(active, 620, items.length);
  return (
    <div style={{ display: "grid" }}>
      {items.map(([en, ar, den, dar], i) => (
        <motion.div key={en} animate={{ opacity: lit >= i + 1 ? 1 : 0.28 }} transition={{ duration: 0.45 }}
          style={{ display: "grid", gridTemplateColumns: "46px 1fr", padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
          <motion.span className="mono ltr" animate={{ color: lit >= i + 1 ? color : "#7a8692" }} style={{ fontSize: 19, paddingTop: 3, justifySelf: "start" }}>{String(i + 1).padStart(2, "0")}</motion.span>
          <div>
            <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25 }}>{t(en, ar)}</div>
            <div style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.35 }}>{t(den, dar)}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* =============== 07 · The call center inside Odoo =============== */
export function OdooCalls({ step, active }: SlideProps) {
  const t = useT();
  const size = t("70px", "54px");
  return (
    <div className="slide">
      <Photo src={IMG.headset} dim={0.9} saturate={0.4} from={{ s: 1.16 }} to={{ s: 1.05, x: 20 }} duration={36} gradient="linear-gradient(90deg, rgba(15,26,38,.97) 0%, rgba(15,26,38,.9) 60%, rgba(15,26,38,.82) 100%)" />
      <div className="pad" style={{ paddingTop: 100 }}>
        <Rise><div className="kicker">{t("Chapter 07 · The call center inside Odoo", "الفصل 07 · مركز الاتصال داخل Odoo")}</div></Rise>
        <Stage step={step} head={<>
          {step === 0 && <h2 className="h2" style={{ fontSize: size }}>{t("Every call now arrives", "كل مكالمة تصل الآن")}<br /><span className="it teal">{t("with the customer's whole story.", "ومعها قصة العميل كاملة.")}</span></h2>}
          {step === 1 && <h2 className="h2" style={{ fontSize: size }}>{t("Supervisors see every queue,", "المشرفون يرون كل قائمة انتظار")}<br /><span className="it gold">{t("live, and can step in.", "مباشرة، ويمكنهم التدخل.")}</span></h2>}
          {step >= 2 && <h2 className="h2" style={{ fontSize: size }}>{t("Built and tested.", "بُني واختُبر.")}<br /><span className="it gold">{t("Real-call testing comes next.", "الخطوة التالية: الاختبار بمكالمات حقيقية.")}</span></h2>}
        </>}>
          {step === 0 && (
            <Two>
              <Path items={CC_FLOW} active={active && step === 0} />
              <div>
                <Shot src={IMG.ccPop} alt={t("Screen pop with the caller's tickets, invoices and recent calls", "شاشة بيانات المتصل وتذاكره وفواتيره ومكالماته الأخيرة")} style={{ width: "88%" }} />
                <Shot src={IMG.ccWrap} alt={t("Wrap-up form", "نموذج إنهاء المكالمة")} delay={0.8} style={{ width: "50%", marginTop: -66, marginInlineStart: "auto", position: "relative" }} />
                <Note en="Design screens · sample names and figures" ar="شاشات تصميم · الأسماء والأرقام نموذجية" />
              </div>
            </Two>
          )}
          {step === 1 && (
            <Two>
              <div style={{ display: "grid", gap: 0 }}>
                {CC_SUPER.map(([en, ar, den, dar], i) => (
                  <Rise key={en} delay={0.15 + i * 0.14} y={18}>
                    <div style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                      <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25 }}><span className="gold" style={{ marginInlineEnd: 12 }}>→</span>{t(en, ar)}</div>
                      <div style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.35 }}>{t(den, dar)}</div>
                    </div>
                  </Rise>
                ))}
              </div>
              <div>
                <Shot src={IMG.ccWall} alt={t("Live supervisor wallboard", "لوحة المشرف المباشرة")} style={{ width: "86%" }} />
                <Shot src={IMG.ccReports} alt={t("Manager reports", "تقارير المدير")} delay={0.8} style={{ width: "42%", marginTop: -250, marginInlineStart: "auto", position: "relative" }} />
                <Note en="Design screens · sample names and figures" ar="شاشات تصميم · الأسماء والأرقام نموذجية" />
              </div>
            </Two>
          )}
          {step >= 2 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                {CC_TESTS.map(([v, suf, en, ar], i) => <Stat key={en} to={v} suffix={suf} en={en} ar={ar} show={active && step >= 2} delay={0.3 + i * 0.15} color={i % 2 ? "var(--teal)" : "var(--gold)"} />)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 44, position: "relative" }}>
                <motion.div style={{ position: "absolute", top: 12, insetInlineStart: 0, height: 2, background: "linear-gradient(90deg, var(--teal), var(--gold))" }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.8, delay: 0.7, ease: EASE }} />
                {CC_ROAD.map(([en, ar, den, dar, done], i) => (
                  <Rise key={en} delay={0.8 + i * 0.25}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: done ? "var(--teal)" : "var(--ink)", border: `3px solid ${done ? "var(--teal)" : "var(--gold)"}`, position: "relative", marginBottom: 16 }} />
                    <div style={{ fontSize: 26, fontWeight: 600 }}>{t(en, ar)}</div>
                    <div style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.35, marginTop: 4 }}>{t(den, dar)}</div>
                  </Rise>
                ))}
              </div>
              <Rise delay={1.9}>
                <div className="card" style={{ marginTop: 40, padding: "18px 26px", borderInlineStart: "3px solid var(--teal)", fontSize: 21, color: "#dde1e5" }}>
                  {t("Safe by design: if the module is ever switched off, agents keep working on Odoo Phone and Issabel as before. Calls never depend on it.", "آمن بالتصميم: إذا أوقفنا الوحدة في أي وقت يواصل الموظفون العمل على Odoo Phone وIssabel كما كانوا. فالمكالمات لا تعتمد عليها.")}
                </div>
              </Rise>
            </div>
          )}
        </Stage>
      </div>
    </div>
  );
}

/* =============== 11 · NASHAAT report redesign =============== */
export function BiRedesign({ step, active }: SlideProps) {
  const t = useT();
  const size = t("70px", "54px");
  const pages = BI_AREAS.reduce((a, x) => a + x[2], 0);
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 70% 40%, #12283a 0%, var(--ink) 66%)" }}>
      <Flares o={0.09} />
      <div className="pad" style={{ paddingTop: 100 }}>
        <Rise><div className="kicker">{t("Chapter 11 · NASHAAT reports redesigned", "الفصل 11 · إعادة تصميم تقارير NASHAAT")}</div></Rise>
        <Stage step={step} head={<>
          {step === 0 && <h2 className="h2" style={{ fontSize: size }}>{t("One front door", "مدخل واحد")}<br /><span className="it gold">{t("for every number.", "لكل رقم.")}</span></h2>}
          {step >= 1 && <h2 className="h2" style={{ fontSize: size }}>{t("Customer debt,", "ديون العملاء")}<br /><span className="it teal">{t("seen at a glance.", "في نظرة واحدة.")}</span></h2>}
        </>}>
          {step === 0 && (
            <Two>
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                  <Stat to={pages} en="report pages" ar="صفحة تقارير" show={active && step === 0} delay={0.3} />
                  <Stat to={BI_AREAS.length} en="clear areas" ar="مجالات واضحة" show={active && step === 0} delay={0.45} color="var(--teal)" />
                  <Stat to={384} en="navigation buttons" ar="زر تنقل" show={active && step === 0} delay={0.6} />
                </div>
                <Rise delay={0.8}><p className="lede" style={{ fontSize: 23, marginTop: 28 }}>{t("The Nashaat report was rebuilt around an executive Home page. Managers see the headline numbers first, then go to any report in one click. Filters for date, channel and product group drive the whole page.", "أُعيد بناء تقرير Nashaat حول صفحة رئيسية تنفيذية. يرى المديرون الأرقام الرئيسية أولاً، ثم يصلون إلى أي تقرير بنقرة واحدة. وتتحكم فلاتر التاريخ والقناة ومجموعة المنتجات في الصفحة كلها.")}</p></Rise>
                <Rise delay={1}><p style={{ fontSize: 19, color: "var(--muted)", marginTop: 16 }}>{t("Nothing was lost: no page or data table was deleted, and the original file is kept.", "لم يُفقد شيء: لم تُحذف أي صفحة أو جدول بيانات، والملف الأصلي محفوظ.")}</p></Rise>
              </div>
              <div>
                <Shot src={IMG.biHome} alt={t("NASHAAT executive Home page", "الصفحة الرئيسية التنفيذية لتقارير NASHAAT")} style={{ width: "84%", marginInlineStart: "auto" }} />
                <div style={{ width: "84%", marginInlineStart: "auto" }}><Note en="Report design · figures hidden on this public link" ar="تصميم التقرير · الأرقام مخفية في هذا الرابط العام" /></div>
              </div>
            </Two>
          )}
          {step >= 1 && (
            <Two>
              <div style={{ display: "grid" }}>
                {BI_AREAS.map(([en, ar, n, den, dar], i) => (
                  <Rise key={en} delay={0.15 + i * 0.12} y={16}>
                    <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", alignItems: "baseline", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                      <div className="serif gold ltr" style={{ fontSize: 40, lineHeight: 1, justifySelf: "start" }}>{n}</div>
                      <div>
                        <div style={{ fontSize: 23, fontWeight: 600, lineHeight: 1.25 }}>{t(en, ar)}</div>
                        <div style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.35 }}>{t(den, dar)}</div>
                      </div>
                    </div>
                  </Rise>
                ))}
                <Rise delay={1}><p style={{ fontSize: 19, color: "#d4d9de", marginTop: 14 }}>{t("New: an Aging overview that shows what is due, by channel and by age, down to the customer.", "جديد: صفحة نظرة عامة على أعمار الديون تعرض المستحقات حسب القناة والعمر وحتى مستوى العميل.")}</p></Rise>
              </div>
              <div>
                <Shot src={IMG.biAging} alt={t("Aging overview page", "صفحة نظرة عامة على أعمار الديون")} />
                <Note en="Report design · names, amounts and bar sizes replaced on this public link" ar="تصميم التقرير · استُبدلت الأسماء والمبالغ وأحجام الأعمدة في هذا الرابط العام" />
              </div>
            </Two>
          )}
        </Stage>
      </div>
    </div>
  );
}

/* =============== 14 · GID Exams =============== */
export function GidExams({ step, active }: SlideProps) {
  const t = useT();
  const size = t("70px", "54px");
  return (
    <div className="slide" style={{ background: "radial-gradient(ellipse at 30% 30%, #1a2a44 0%, var(--ink) 66%)" }}>
      <Flares o={0.1} />
      <div className="pad" style={{ paddingTop: 100 }}>
        <Rise><div className="kicker">{t("Chapter 14 · GID Exams, built in-house", "الفصل 14 · GID Exams، بُني داخلياً")}</div></Rise>
        <Stage step={step} head={<>
          {step === 0 && <h2 className="h2" style={{ fontSize: size }}>{t("Hiring on proof,", "التوظيف بالدليل،")}<br /><span className="it gold">{t("not on promises.", "لا بالوعود.")}</span></h2>}
          {step === 1 && <h2 className="h2" style={{ fontSize: size }}>{t("Watched live.", "متابعة مباشرة.")}<br /><span className="it teal">{t("Decided on evidence.", "وقرار مبني على الأدلة.")}</span></h2>}
          {step >= 2 && <h2 className="h2" style={{ fontSize: size }}>{t("A fair exam needs", "الاختبار العادل يحتاج")}<br /><span className="it gold">{t("a system people can trust.", "إلى نظام موثوق.")}</span></h2>}
        </>}>
          {step === 0 && (
            <Two>
              <Path items={EX_FLOW} active={active && step === 0} color="var(--gold)" />
              <div>
                <Shot src={IMG.exExam} alt={t("Candidate exam screen", "شاشة اختبار المرشح")} />
                <Note en="Design screen · sample exam" ar="شاشة تصميم · اختبار نموذجي" />
              </div>
            </Two>
          )}
          {step === 1 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <div>
                  <Shot src={IMG.exLive} alt={t("Live exam monitor", "متابعة الاختبارات مباشرة")} />
                  <div style={{ fontSize: 23, fontWeight: 600, marginTop: 16 }}>{t("Live monitor", "متابعة مباشرة")}</div>
                  <div style={{ fontSize: 18, color: "var(--muted)" }}>{t("Progress, time left and integrity alerts: leaving the tab, exiting full screen, trying to copy.", "التقدم والوقت المتبقي وتنبيهات النزاهة: مغادرة الصفحة والخروج من ملء الشاشة ومحاولات النسخ.")}</div>
                </div>
                <div>
                  <Shot src={IMG.exReport} alt={t("Assessment report", "تقرير التقييم")} delay={0.55} />
                  <div style={{ fontSize: 23, fontWeight: 600, marginTop: 16 }}>{t("Assessment report", "تقرير التقييم")}</div>
                  <div style={{ fontSize: 18, color: "var(--muted)" }}>{t("Score, proven level in each field, strengths and weaknesses. The examiner makes the decision.", "الدرجة والمستوى المثبت في كل مجال ونقاط القوة والضعف. والقرار للمُختبِر.")}</div>
                </div>
              </div>
              <Note en="Design screens · sample names and figures" ar="شاشات تصميم · الأسماء والأرقام نموذجية" />
            </div>
          )}
          {step >= 2 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                {EX_NUMS.map(([v, pre, en, ar], i) => <Stat key={en} to={v} prefix={pre} en={en} ar={ar} show={active && step >= 2} delay={0.3 + i * 0.15} color={i % 2 ? "var(--teal)" : "var(--gold)"} />)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginTop: 24 }}>
                {EX_TRUST.map(([en, ar, den, dar], i) => (
                  <Rise key={en} delay={0.8 + i * 0.14} y={16}>
                    <div className="card" style={{ padding: "16px 24px", height: "100%" }}>
                      <div style={{ fontSize: 24, fontWeight: 600 }}>{t(en, ar)}</div>
                      <div style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.35, marginTop: 2 }}>{t(den, dar)}</div>
                    </div>
                  </Rise>
                ))}
              </div>
            </div>
          )}
        </Stage>
      </div>
    </div>
  );
}
