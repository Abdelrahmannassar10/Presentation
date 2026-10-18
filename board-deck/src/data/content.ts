// All figures come from the data folder: IT_Call_Center_4-Year_Achievement_Report.md, achievement2.xlsx,
// readme.md and Financial_Data_Request_EN-AR.docx (amounts filled in by the IT & Call Center Manager). Nothing here is invented.
import regJson from "./register.json";

export type Reg = { id: string; q: string; th: string; a: string; i: string; n: string; p: boolean; c: string[] };
export const REG = regJson as Reg[];

// every count in the deck is derived from the register, so slides and notes can never disagree
export const TOTAL = REG.length;
export const PROG = REG.filter((r) => r.p).length;
export const DONE = TOTAL - PROG;
const QS = ["2023", "2024", "2025", "2026"].flatMap((y) => [1, 2, 3, 4].map((q) => `${y} Q${q}`));
export const Q = QS.map((q) => REG.filter((r) => r.q === q).length);
export const QP = QS.map((q) => REG.filter((r) => r.q === q && r.p).length);
const yearTotal = (y: string) => REG.filter((r) => r.q.startsWith(y)).length;

export type Sev = "Critical" | "High" | "Medium";
export const SEV_AR: Record<Sev, string> = { Critical: "حرج", High: "مرتفع", Medium: "متوسط" };

// [en, ar, severity, en risk, ar risk, audit refs]
export const DOMAINS: [string, string, Sev, string, string, string][] = [
  ["Business continuity", "استمرارية الأعمال", "Critical", "One cable, router or server fault stops invoicing, dispatch and the call center at once.", "عطل واحد في كابل أو راوتر أو خادم يوقف الفوترة والتوزيع ومركز الاتصال معاً.", "1 · 6 · 7 · 9 · 36 · 37"],
  ["Data protection", "حماية البيانات", "Critical", "No database or Azure backups: any failure means permanent loss.", "لا نسخ احتياطية لقواعد البيانات ولا لخوادم Azure: أي عطل يعني فقداناً دائماً.", "8 · 15"],
  ["Cyber security", "الأمن السيبراني", "Critical", "Misconfigured firewall, every AX user an administrator, no SSL, e-commerce under attack.", "جدار ناري غير مضبوط، وجميع مستخدمي AX بصلاحية مدير، وبدون SSL، والمتجر الإلكتروني تحت الهجوم.", "10 · 18 · 22–25 · 27 · 29"],
  ["Network architecture", "بنية الشبكة", "High", "One flat network, layer-2 switches, no core switch: one infected PC reaches everything.", "شبكة واحدة مسطحة بدون سويتش رئيسي: جهاز مصاب واحد يصل إلى كل شيء.", "16 · 17 · 33 · 34"],
  ["ERP and sales systems", "ERP وأنظمة المبيعات", "High", "AX 2012 run by a freelancer, modules inactive, sales data errors, no test server.", "نظام AX يديره مستقل خارجي، ووحدات غير مفعلة، وأخطاء في بيانات المبيعات، وبدون خادم اختبار.", "4 · 5 · 30 · 31 · 35"],
  ["Customer service", "خدمة العملاء", "High", "Personal mobiles, no queues, no recording, customers in Excel.", "هواتف شخصية، بلا قوائم انتظار ولا تسجيل، والعملاء في ملفات Excel.", "12 · 13 · 14 · 19 · 32"],
  ["People and capability", "الأفراد والقدرات", "High", "Two people. No one for applications, development, security or ERP work.", "شخصان فقط، ولا أحد للتطبيقات أو التطوير أو الأمن أو تشغيل ERP.", "20 · 21"],
  ["Back-office governance", "الحوكمة الإدارية", "Medium", "No HR system, IT assets on paper, legacy devices, no device management.", "لا نظام للموارد البشرية، والأصول على الورق، وأجهزة قديمة، وبدون إدارة للأجهزة المحمولة.", "2 · 3 · 11 · 26 · 38 · 39"],
];
// audit numbers 1–39; number 28 is absent in the source sheet → 38 findings
export const FINDINGS = Array.from({ length: 39 }, (_, i) => i + 1).filter((n) => n !== 28);

// [area en, area ar, before en, before ar, after en, after ar]
export const BA: [string, string, string, string, string, string][] = [
  ["Internet", "الإنترنت", "One line, no failover", "خط واحد بدون بديل", "Dual lines, 4G failover, static IPs, factory at 100 Mbps", "خطان، و4G احتياطي، وعناوين ثابتة، والمصنع بسرعة 100 ميجابت"],
  ["Network", "الشبكة", "One flat network for every user, server and device", "شبكة واحدة لكل المستخدمين والخوادم والأجهزة", "Isolated server network, VLANs, factory DMZ, distributors isolated", "شبكة خوادم معزولة، وVLANs، وDMZ للمصنع، وعزل الموزعين"],
  ["Servers", "الخوادم", "Idle hardware, no virtualization, no test server", "أجهزة خاملة بلا خوادم افتراضية أو اختبار", "Proxmox virtualization with test and staging environments", "خوادم افتراضية على Proxmox مع بيئات اختبار"],
  ["Backups", "النسخ الاحتياطي", "None", "لا يوجد", "Daily automated backups, local and cloud", "نسخ احتياطي يومي آلي محلياً وسحابياً"],
  ["Security", "الأمن", "Misconfigured firewall, everyone an administrator", "جدار ناري غير مضبوط والجميع بصلاحية مدير", "Fortigate, VLANs, web filtering, central antivirus, 196 IP cameras", "Fortigate وVLANs وفلترة الويب ومضاد فيروسات مركزي و196 كاميرا IP"],
  ["Call center", "مركز الاتصال", "Personal mobiles and a busy tone", "هواتف شخصية ونغمة انشغال", "Issabel, 32 SIP channels, queues, recording, CRM logging", "Issabel و32 قناة وقوائم انتظار وتسجيل وربط مع CRM"],
  ["Business systems", "أنظمة الأعمال", "No CRM, no HR system, freelancer-run ERP", "بدون CRM أو نظام موارد بشرية، وERP يديره مستقل", "Odoo CRM, Mago HR, in-house AX, SalesBuzz 5.15", "Odoo CRM وMago HR وتشغيل AX داخلياً وSalesBuzz 5.15"],
  ["Reporting", "التقارير", "Manual spreadsheets", "جداول يدوية", "72 Power BI reports · 45 SalesBuzz reports built or reworked · ~30 views", "72 تقرير Power BI · 45 تقرير SalesBuzz جديد أو مطوَّر · حوالي 30 عرض بيانات"],
  ["IT assets and devices", "الأصول والأجهزة", "Paper records, unmanaged handhelds", "سجلات ورقية وأجهزة محمولة بلا إدارة", "Snipe-IT custody, MDM on every handheld, service desk", "عهدة Snipe-IT وإدارة كل الأجهزة المحمولة ومكتب دعم فني"],
  ["Team", "الفريق", "Two people, limited experience", "شخصان بخبرة محدودة", "Three people, all at senior level", "ثلاثة أشخاص جميعهم بمستوى خبير"],
];

export const QTH: [string, string][] = [
  ["Stabilise and secure", "تثبيت الاستقرار والتأمين"], ["Segment and digitise", "تقسيم الشبكة والتحول الرقمي"], ["Protect and connect", "الحماية والربط"], ["Platform build", "بناء المنصات"],
  ["Go-live", "التشغيل الفعلي"], ["Resilience", "المرونة"], ["Extend", "التوسع"], ["Manufacturing and control", "التصنيع والرقابة"],
  ["Growth", "النمو"], ["Modernise", "التحديث"], ["Control and incident response", "الرقابة والاستجابة"], ["Expand", "التوسع في الأعمال"],
  ["Harden sites", "تحصين المواقع"], ["Protect and isolate", "الحماية والعزل"], ["Integrate and optimise", "التكامل والتحسين"], ["Next generation", "الجيل التالي"],
];
export const QHEAD: [string, string][] = [
  ["Backup line and 4G · Proxmox · Snipe-IT · AX and SalesBuzz privileges reset · first database backups · factory firewall and VPN · Etisalat ~24%", "خط احتياطي و4G · Proxmox · Snipe-IT · إعادة ضبط صلاحيات AX وSalesBuzz · أول نسخ احتياطية · جدار ناري وVPN للمصنع · Etisalat حوالي 24%"],
  ["Server network isolated · VLANs · Odoo CRM v14 · call recording · SSL · SOTI MDM · complaints system", "عزل شبكة الخوادم · VLANs · Odoo CRM 14 · تسجيل المكالمات · SSL · SOTI · نظام الشكاوى"],
  ["GoIP gateway · GravityZone · daily automatic backups · factory DMZ · factory cameras · secure remote CRM · SalesBuzz test", "بوابة GoIP · GravityZone · نسخ يومي آلي · DMZ للمصنع · كاميرات المصنع · وصول آمن لـ CRM · بيئة اختبار SalesBuzz"],
  ["Issabel call center and 32 SIP channels · Mago on Azure · SalesBuzz v4.58 · MDM on all mobility · Power BI", "مركز اتصال Issabel و32 قناة · Mago على Azure · SalesBuzz 4.58 · إدارة كل الأجهزة · Power BI"],
  ["Mago live · SIP trunks live · service desk live · 8 servers licensed · static-IP 4G routers", "تشغيل Mago · تشغيل SIP · مكتب الدعم · ترخيص 8 خوادم · راوترات 4G بعناوين ثابتة"],
  ["Generator on UPS · CRM rebuilt to v15 · Issabel upgrade live · Mago self-service", "مولد على UPS · إعادة بناء CRM إلى 15 · ترقية Issabel · الخدمة الذاتية في Mago"],
  ["Alrayen on Odoo.sh · queues and time conditions · Raya project · factory IP upgrade, zero downtime · KSA website", "Alrayen على Odoo.sh · قوائم الانتظار والتوقيتات · مشروع Raya · ترقية عناوين المصنع دون توقف · الموقع السعودي"],
  ["AX manufacturing cycle, BOM, quality, cost · pallet tracking · mesh Wi-Fi · domain portfolio", "دورة التصنيع في AX والجودة والتكاليف · تتبع الطبليات · شبكة لاسلكية · محفظة النطاقات"],
  ["Alrayen live · ELA business unit · Almina engagement · file server · factory CCTV (~64 cameras)", "تشغيل Alrayen · وحدة ELA · دعم Almina · خادم ملفات · كاميرات المصنع (حوالي 64)"],
  ["Fortigate firewall · NVR and 32 cameras · Power BI live · NTRA issue solved · fingerprint devices · mesh Wi-Fi", "جدار Fortigate · NVR و32 كاميرا · تشغيل Power BI · حل مشكلة NTRA · أجهزة البصمة · شبكة لاسلكية"],
  ["Factory to 100 Mbps · KSA site · Sadeq e-invoicing · Odoo server replaced · firewall user policies", "المصنع 100 ميجابت · الموقع السعودي · فاتورة Sadeq الإلكترونية · خادم Odoo جديد · سياسات المستخدمين"],
  ["Shpramont warehouse · Mobinil IVR · Fawry and Paymob · .eg domains · static IPs · faster microwave WAN", "مستودع Shpramont · IVR موبينيل · Fawry وPaymob · نطاقات ‎.eg · عناوين ثابتة · ميكروويف أسرع"],
  ["Warehouse firewall, filter, cameras · HQ CCTV (~32) · DB disk failure resolved · new laptops and printers", "جدار ناري وفلترة وكاميرات للمستودع · كاميرات المقر (حوالي 32) · حل عطل القرص · أجهزة وطابعات جديدة"],
  ["Kaspersky · DMS servers · distributors isolated · SalesBuzz 5.15 · Proxmox + Hyper-V · HQ switches · ~200 devices", "Kaspersky · خوادم DMS · عزل الموزعين · SalesBuzz 5.15 · Proxmox وHyper-V · سويتشات المقر · 200 جهاز"],
  ["DS servers · new tax server · Scalefusion · SD-WAN at HQ · AX test server · warehouse UPS · Dynamics 365 kickoff", "خوادم DS · خادم ضرائب · Scalefusion · SD-WAN للمقر · خادم اختبار AX · UPS للمستودع · بدء Dynamics 365"],
  ["5th floor built · Issabel–Odoo 19 · delivery dashboard · six projects in flight: D365, MPLS, live factory", "الدور الخامس · ربط Issabel مع Odoo 19 · لوحة التوصيل · ستة مشروعات جارية: D365 وMPLS والمصنع المباشر"],
];
export const YEARS: [string, number, string, string][] = [["2023", yearTotal("2023"), "Foundations", "بناء الأساس"], ["2024", yearTotal("2024"), "Go-live and industrialisation", "التشغيل والتصنيع"], ["2025", yearTotal("2025"), "Growth and modernisation", "النمو والتحديث"], ["2026", yearTotal("2026"), "Hardening · to October", "التحصين · حتى أكتوبر"]];

// [en, ar, detail en, detail ar, delivered]
export const LAYERS: [string, string, string, string, string][] = [
  ["Perimeter", "الحماية الخارجية", "Site firewalls, Fortigate, single-IP publishing", "جدران نارية للمواقع وFortigate ونشر عبر عنوان واحد", "2023 → 2026"],
  ["Segmentation", "تقسيم الشبكة", "VLANs, broadcast storms stopped, factory DMZ, distributors isolated", "VLANs وإيقاف البث العشوائي وDMZ للمصنع وعزل الموزعين", "2023 · 2026"],
  ["Identity and access", "الهوية والصلاحيات", "Least privilege in AX and SalesBuzz, port security", "أقل صلاحيات في AX وSalesBuzz وتأمين المنافذ", "2023 → 2026"],
  ["Endpoints", "حماية الأجهزة", "Antivirus system: GravityZone, then Kaspersky, centrally managed", "نظام مضاد فيروسات: GravityZone ثم Kaspersky بإدارة مركزية", "2023 · 2026"],
  ["Email and web", "البريد والمواقع", "Web filtering at every site, mail firewall and relay, SSL", "فلترة الويب في كل موقع وجدار وترحيل للبريد وSSL", "2023 → 2026"],
  ["Backup and recovery", "النسخ والاستعادة", "Backup plan for failures, daily automated backups, data secured in the cloud", "خطة نسخ للأعطال ونسخ يومي آلي وبيانات مؤمنة على السحابة", "2023 → 2026"],
  ["Secure remote access", "الوصول الآمن عن بعد", "Vendor VPN, secured CRM URL, Azure port security", "VPN للمورد ورابط CRM آمن وتأمين منافذ Azure", "2023 → 2025"],
  ["Physical security", "الأمن المادي", "196 IP cameras: factory, warehouse, management building", "196 كاميرا IP: المصنع والمستودع والمبنى الإداري", "2023 → 2026"],
  ["Devices and assets", "الأجهزة والأصول", "Snipe-IT custody, MDM on every handheld", "عهدة Snipe-IT وإدارة كل الأجهزة المحمولة", "2023 → 2026"],
  ["Skills", "المهارات", "Team trained on the security consoles", "تدريب الفريق على أنظمة الحماية", "2024 · 2026"],
];

// [when en, when ar, challenge en, challenge ar, result en, result ar]
export const CRISES: [string, string, string, string, string, string][] = [
  ["2024 Q1", "2024 ر1", "Azure Basic public-IP retirement", "إيقاف عناوين Azure الأساسية", "Replacement planned and executed; cloud endpoints preserved", "تخطيط وتنفيذ البديل والحفاظ على الخدمات السحابية"],
  ["2024 Q1", "2024 ر1", "Inbound calls misrouted by the provider", "توجيه خاطئ للمكالمات من المزود", "Resolved with the provider; routing corrected", "الحل مع المزود وتصحيح التوجيه"],
  ["2024 Q2", "2024 ر2", "BI Report Manager critical failure", "عطل حرج في مدير تقارير BI", "Diagnosed and fixed; reporting restored", "تشخيص وإصلاح واستعادة التقارير"],
  ["2024 Q2", "2024 ر2", "CRM too slow for agents to work", "بطء CRM يعطل الموظفين", "Server rebuilt from scratch on Odoo v15", "إعادة بناء الخادم بالكامل على Odoo 15"],
  ["2024 Q4", "2024 ر4", "CRM database performance", "أداء قاعدة بيانات CRM", "Database tuned; faster responses", "ضبط قاعدة البيانات وتسريع الاستجابة"],
  ["2025 Q2", "2025 ر2", "CRM critical memory issue", "مشكلة ذاكرة حرجة في CRM", "Root cause fixed; outage prevented", "إصلاح السبب الجذري ومنع التوقف"],
  ["2025 Q2", "2025 ر2", "Marketing-call blocking by the regulator (NTRA) · very critical", "حظر مكالمات التسويق من NTRA · حرج جداً", "Investigated and resolved; outbound calling restored", "التحقيق والحل واستعادة المكالمات الصادرة"],
  ["2026 Q1", "2026 ر1", "Database disk failure stopped the sales server", "عطل قرص أوقف خادم المبيعات", "Recovered, then RAM, CPU and disks upgraded", "الاستعادة ثم ترقية الذاكرة والمعالج والأقراص"],
  ["2026 Q1", "2026 ر1", "SOTI lost control of new handhelds", "فقدان SOTI السيطرة على الأجهزة الجديدة", "Replaced by Scalefusion at better value (2026 Q3)", "الاستبدال بـ Scalefusion بقيمة أفضل (2026 ر3)"],
];

export const HUB: [string, string, string, string][] = [
  ["Alrayen", "Alrayen", "Odoo live · 2025 Q1", "تشغيل Odoo · 2025 ر1"],
  ["Sadeq · sister company", "Sadeq · شركة شقيقة", "Odoo e-invoicing · 2025 Q3", "الفاتورة الإلكترونية على Odoo · 2025 ر3"],
  ["Almina Trading", "Almina Trading", "Mria sales-force automation · Odoo · board memo", "نظام Mria لأتمتة المبيعات · Odoo · مذكرة المجلس"],
  ["ELA business unit", "وحدة ELA", "Full distributor cycle · daily dashboard", "دورة توزيع كاملة · لوحة يومية"],
  ["Distributors", "الموزعون", "Isolated DMS and DS servers on Azure", "خوادم DMS وDS معزولة على Azure"],
  ["Lumea and Abrar", "Lumea وAbrar", "IVR · barcodes · websites", "IVR · باركود · مواقع"],
  ["KSA", "السعودية", "Website under company control · social accounts", "الموقع تحت سيطرة الشركة · حسابات التواصل"],
  ["Raya", "Raya", "Outsourced call center, managed", "إدارة مركز الاتصال الخارجي"],
];

// [name, owns en, owns ar, when]
export const PEOPLE: [string, string, string, string][] = [
  ["Samar & agents", "Scripts, etiquette, CRM", "النصوص وآداب المكالمات وCRM", "2023"],
  ["Ahmed Soufy", "SalesBuzz operations, reports, PHP", "تشغيل SalesBuzz والتقارير وPHP", "2023–24"],
  ["Esraa", "SOTI, ManageEngine, security console", "SOTI وManageEngine ولوحة الأمن", "2023–24"],
  ["Ahmed Youssef", "Call-center improvement, routes", "تطوير مركز الاتصال والمسارات", "2023–24"],
  ["Eslam", "Full AX manufacturing cycle", "دورة التصنيع الكاملة في AX", "2024"],
  ["Hossam Hassanen", "Indirect cost, cost management", "التكاليف غير المباشرة وإدارة التكلفة", "2024"],
  ["Yassen", "SOTI, SalesBuzz, Snipe-IT", "SOTI وSalesBuzz وSnipe-IT", "2025"],
  ["Abdelrahman Adam", "Odoo development, Azure", "تطوير Odoo وخدمات Azure", "2025"],
  ["Ahmed Mogawer", "Issabel call-center platform", "منصة Issabel لمركز الاتصال", "2026"],
];
export const TEAMS: [string, string][] = [["Call center", "مركز الاتصال"], ["HR", "الموارد البشرية"], ["IT", "تقنية المعلومات"], ["RTL", "RTL"], ["ELA sales", "مبيعات ELA"], ["Customer finance", "مالية العملاء"]];

/* ---------- the money · Financial_Data_Request_EN-AR.docx, sections A and B, plus readme.md ---------- */
/** EGP per USD used to show one total. Every USD line keeps its own amount; change this once Finance confirms the rate. */
export const FX = 50;
export type Money = {
  en: string; ar: string; when: string; cur: "EGP" | "USD";
  /** the alternative price per year (or once): the old contract, the vendor offer, the quote not bought */
  was: number;
  /** what the company pays now, per year (or once) */
  now: number;
  kind: "save" | "avoid";
  once?: boolean;
  ben: string; bar: string;
};
export const MONEY: Money[] = [
  { en: "Mail service licence", ar: "ترخيص خدمة البريد", when: "2026 Q2", cur: "USD", was: 54720, now: 4000, kind: "save", ben: "500 users × $8 a month + 14% tax → $4,000 a year", bar: "500 مستخدم × 8 دولار شهرياً + 14% ضريبة ← 4,000 دولار سنوياً" },
  { en: "Device management: SOTI → Scalefusion", ar: "إدارة الأجهزة: من SOTI إلى Scalefusion", when: "2026 Q3", cur: "USD", was: 43200, now: 25200, kind: "save", ben: "300 devices · $12 → $7 per device a month", bar: "300 جهاز · من 12 إلى 7 دولار للجهاز شهرياً" },
  { en: "Etisalat telecom contract", ar: "عقد اتصالات Etisalat", when: "2023 Q1", cur: "EGP", was: 300000, now: 228000, kind: "save", ben: "EGP 25,000 a month · up to 24% discount", bar: "25,000 جنيه شهرياً · خصم حتى 24%" },
  { en: "Printing: Docucom contract", ar: "الطباعة: عقد Docucom", when: "2025 Q2", cur: "EGP", was: 20000, now: 8000, kind: "save", ben: "EGP 20,000 → 8,000 a year", bar: "من 20,000 إلى 8,000 جنيه سنوياً" },
  { en: "Home-delivery system", ar: "نظام التوصيل المنزلي", when: "2023 Q4", cur: "USD", was: 28800, now: 0, kind: "avoid", ben: "Vendor offer $2,400 a month · delivered in-house", bar: "عرض المورد 2,400 دولار شهرياً · تم داخلياً" },
  { en: "AX 2012 implementation (BI proposal)", ar: "تنفيذ AX 2012 (عرض BI)", when: "2023 Q2", cur: "USD", was: 12000, now: 0, kind: "avoid", ben: "$12,000 a year proposal · done in-house", bar: "عرض 12,000 دولار سنوياً · تم داخلياً" },
  { en: "Microsoft licensing · 8 servers", ar: "تراخيص Microsoft · 8 خوادم", when: "2024 Q1", cur: "USD", was: 10500, now: 0, kind: "avoid", ben: "Partnership quote $10,500 a year · paid $0", bar: "عرض الشراكة 10,500 دولار سنوياً · المدفوع 0" },
  { en: "AX 2012 freelancer support", ar: "دعم AX 2012 عبر مستقل", when: "2023 →", cur: "USD", was: 7000, now: 0, kind: "avoid", ben: "$7,000 a year · now run in-house", bar: "7,000 دولار سنوياً · يُدار الآن داخلياً" },
  { en: "Call-center system (BI Technology offer)", ar: "نظام مركز الاتصال (عرض BI Technology)", when: "2023 Q4", cur: "EGP", was: 750000, now: 0, kind: "avoid", once: true, ben: "Vendor offer EGP 750,000 · Issabel built in-house for EGP 0", bar: "عرض المورد 750,000 جنيه · Issabel بُني داخلياً بتكلفة 0" },
  { en: "196 IP cameras installed by the IT team", ar: "تركيب 196 كاميرا IP بفريق تقنية المعلومات", when: "2025 → 2026", cur: "EGP", was: 200000, now: 0, kind: "avoid", once: true, ben: "Installation done in-house instead of by a contractor", bar: "التركيب داخلياً بدلاً من مقاول" },
  { en: "Two firewalls", ar: "جداران ناريان", when: "2025 → 2026", cur: "USD", was: 5000, now: 0, kind: "avoid", once: true, ben: "$2,500 each · installed for $0", bar: "2,500 دولار لكل منهما · التركيب بتكلفة 0" },
  { en: "GPS trackers · 45 vehicles", ar: "أجهزة GPS · 45 مركبة", when: "2025 Q2", cur: "EGP", was: 292500, now: 202500, kind: "save", once: true, ben: "Lowest other quote EGP 6,500 → contracted 4,500 per device", bar: "أقل عرض آخر 6,500 جنيه ← التعاقد بـ 4,500 للجهاز" },
];
/** value of one line in EGP */
export const egp = (m: Money) => (m.was - m.now) * (m.cur === "USD" ? FX : 1);
const sum = (f: (m: Money) => boolean) => MONEY.filter(f).reduce((a, m) => a + egp(m), 0);
export const ANNUAL = sum((m) => !m.once);
export const ONCE = sum((m) => !!m.once);
export const ANNUAL_SAVE = sum((m) => !m.once && m.kind === "save");
export const ANNUAL_AVOID = sum((m) => !m.once && m.kind === "avoid");
/** 6435000 → "6.4M", 750000 → "750K" */
export const short = (n: number) => (n >= 1e6 ? `${(Math.round(n / 1e5) / 10).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : String(n));
export const money = (cur: string, n: number) => (cur === "USD" ? `$${n.toLocaleString("en-US")}` : `EGP ${n.toLocaleString("en-US")}`);
/** millions with one decimal, for count-ups */
export const millions = (n: number) => Math.round(n / 1e5) / 10;

/* value that is real but never added to the cash total (form sections C, D, E) */
export const REVENUE_PER_DAY = 3_000_000;
// [figure, en, ar, detail en, detail ar]
export const TIME: [string, string, string, string, string][] = [
  ["160 h", "One asset count, by hand", "جرد أصول واحد يدوياً", "Now live in Snipe-IT, tied to each employee's custody", "الآن مباشر في Snipe-IT ومرتبط بعهدة كل موظف"],
  ["48 h", "To build one sales report, 2 people", "لإعداد تقرير مبيعات واحد بشخصين", "Now automatic in SalesBuzz and Power BI", "الآن آلي في SalesBuzz وPower BI"],
  ["5 → 1", "People on HR leave and attendance", "موظفون على الإجازات والحضور", "80 hours a month released by Mago HR self-service", "توفير 80 ساعة شهرياً بالخدمة الذاتية في Mago"],
  ["200", "IT tickets a month, every one tracked", "تذكرة دعم شهرياً، كلها موثقة", "ManageEngine service desk instead of verbal requests", "مكتب ManageEngine بدلاً من الطلبات الشفهية"],
];
export const CONTROL: [string, string][] = [
  ["Credit limits and ceilings enforced at order entry", "حدود الائتمان والسقف مطبقة عند إدخال الطلب"],
  ["Cash payment disabled for credit customers", "إيقاف الدفع النقدي لعملاء الآجل"],
  ["Customer locations locked to the company", "مواقع العملاء مثبتة باسم الشركة"],
  ["Fake e-commerce orders closed off", "إغلاق ثغرة الطلبات الوهمية"],
  ["Least privilege in AX and SalesBuzz", "أقل صلاحيات في AX وSalesBuzz"],
];

/* call center today · Issabel queue log and Odoo CRM (form section F) */
// [value, prefix, suffix, en, ar, detail en, detail ar]
export const KPIS: [number, string, string, string, string, string, string][] = [
  [3000, "", "", "Calls a day", "مكالمة يومياً", "1,000 inbound · 2,000 outbound", "1,000 واردة · 2,000 صادرة"],
  [1, "~", " min", "To answer", "زمن الرد", "Average speed of answer", "متوسط سرعة الرد"],
  [2, "~", " min", "Per call", "مدة المكالمة", "Average handling time", "متوسط مدة المعالجة"],
  [100, "", "%", "Complaints closed", "من الشكاوى مغلقة", "About 12 logged a month in the CRM", "حوالي 12 شكوى شهرياً في CRM"],
];

/* data and reporting · readme.md */
// [value, en, ar, detail en, detail ar, color]
export const REPORTS: [number, string, string, string, string, string][] = [
  [72, "Power BI reports", "تقرير Power BI", "Sales, aging, distributors, ELA and DMS dashboards", "لوحات المبيعات وأعمار الديون والموزعين وELA وDMS", "var(--gold)"],
  [13, "New SalesBuzz static reports", "تقرير SalesBuzz ثابت جديد", "Built from scratch on the sales database", "مبنية من الصفر على قاعدة بيانات المبيعات", "var(--teal)"],
  [32, "SalesBuzz reports reworked", "تقرير SalesBuzz مطوَّر", "Fixed, extended and rebuilt after upgrades", "تصحيح وتوسيع وإعادة بناء بعد الترقيات", "var(--teal)"],
  [30, "SalesBuzz database views", "عرض بيانات في SalesBuzz", "The layer the reports read from", "الطبقة التي تقرأ منها التقارير", "var(--fg)"],
  [3, "Database triggers", "مشغلات قاعدة بيانات", "Performance and control · one critical", "للأداء والرقابة · أحدها حرج", "var(--red)"],
];

/* in progress now · readme.md (the live-factory project is featured on its own card) */
// [en, ar, detail en, detail ar]
export const NOW: [string, string, string, string][] = [
  ["Global distribution company on AX 2012", "شركة التوزيع العالمية على AX 2012", "New company set up on the group ERP", "تأسيس الشركة الجديدة على نظام ERP للمجموعة"],
  ["Dynamics 365 implementation", "تنفيذ Dynamics 365", "The next ERP generation for the group", "الجيل التالي من ERP للمجموعة"],
  ["Issabel integration with Odoo", "ربط Issabel مع Odoo", "Every call and customer in one record", "كل مكالمة وكل عميل في سجل واحد"],
  ["MPLS links for disaster recovery", "روابط MPLS للتعافي من الكوارث", "Factory, warehouse and management building on private links", "المصنع والمستودع والمبنى الإداري على روابط خاصة"],
  ["HQ network migration", "نقل شبكة المقر", "HQ moved onto the new network design", "نقل المقر إلى تصميم الشبكة الجديد"],
];

/* next quarter · readme.md */
// [lane en, lane ar, color, items [en, ar][]]
export const ROADMAP: [string, string, string, [string, string][]][] = [
  ["Core systems", "الأنظمة الأساسية", "var(--gold)", [
    ["Odoo 20 implementation with CRM helpdesk", "تنفيذ Odoo 20 مع مكتب دعم CRM"],
    ["Launch of the new SalesBuzz system", "إطلاق نظام SalesBuzz الجديد"],
    ["Odoo ↔ SalesBuzz integration", "ربط Odoo مع SalesBuzz"],
    ["SalesBuzz ↔ Dynamics 365 integration", "ربط SalesBuzz مع Dynamics 365"],
  ]],
  ["Digital commerce", "التجارة الرقمية", "var(--teal)", [
    ["Puvana mobile app and e-commerce sites: Puvana Egypt, Global for GID, Puvana KSA", "تطبيق Puvana ومواقع التجارة الإلكترونية: Puvana مصر وGlobal لـ GID وPuvana السعودية"],
    ["Websites ↔ SalesBuzz integration", "ربط المواقع مع SalesBuzz"],
    ["Websites ↔ Odoo integration", "ربط المواقع مع Odoo"],
  ]],
  ["AI", "الذكاء الاصطناعي", "var(--amber)", [
    ["Chatbot on Meta", "روبوت محادثة على Meta"],
    ["Agentic AI on Meta and the websites", "وكلاء ذكاء اصطناعي على Meta والمواقع"],
  ]],
  ["Data and group", "البيانات والمجموعة", "#b9a7ff", [
    ["Data-warehouse server", "خادم مستودع البيانات"],
    ["LOCUS logistics system for the sister company, built from scratch", "نظام LOCUS اللوجستي للشركة الشقيقة من الصفر"],
  ]],
];
export const ROADMAP_N = ROADMAP.reduce((a, l) => a + l[3].length, 0);

/* summary · readme.md */
// [title en, title ar, color, items [en, ar][]]
export const SUMMARY: [string, string, string, [string, string][]][] = [
  ["Built from scratch", "بُني من الصفر", "var(--gold)", [
    ["Odoo CRM and helpdesk", "Odoo CRM ومكتب الدعم"], ["Issabel call center", "مركز اتصال Issabel"], ["ManageEngine service desk", "مكتب دعم ManageEngine"],
    ["Snipe-IT asset register", "سجل أصول Snipe-IT"], ["Alrayen system on Odoo", "نظام Alrayen على Odoo"],
  ]],
  ["Reporting and data", "التقارير والبيانات", "var(--teal)", [
    ["72 Power BI reports", "72 تقرير Power BI"], ["13 new SalesBuzz static reports", "13 تقرير SalesBuzz ثابت جديد"], ["32 SalesBuzz reports reworked", "32 تقرير SalesBuzz مطوَّر"],
    ["About 30 SalesBuzz views", "حوالي 30 عرض بيانات في SalesBuzz"], ["3 triggers · one stops reps changing customer coordinates", "3 مشغلات · أحدها يمنع المندوب من تعديل إحداثيات العملاء"],
  ]],
  ["Network and security", "الشبكة والأمن", "var(--amber)", [
    ["2 firewalls ($2,500 each) installed for $0", "جداران ناريان (2,500 دولار لكل منهما) بتكلفة 0"], ["VLANs · broadcast storms stopped", "VLANs · إيقاف البث العشوائي"], ["Web filtering · antivirus system", "فلترة الويب · نظام مضاد فيروسات"],
    ["Data secured in the cloud · backup plan for failures", "بيانات مؤمنة على السحابة · خطة نسخ للأعطال"], ["UPS installed", "تركيب أجهزة UPS"],
  ]],
  ["Physical security", "الأمن المادي", "var(--red)", [
    ["196 IP cameras", "196 كاميرا IP"], ["122 in the factory", "122 في المصنع"], ["74 in the warehouse and management building", "74 في المستودع والمبنى الإداري"],
    ["Installed by the team · about EGP 200,000 saved", "التركيب بالفريق · وفر حوالي 200,000 جنيه"],
  ]],
];

export const NEXTB: [string, string][] = [
  ["Formal disaster-recovery and restore-test schedule", "جدول رسمي للتعافي من الكوارث واختبار الاستعادة"],
  ["Multi-factor authentication on critical systems", "التحقق متعدد العوامل على الأنظمة الحرجة"],
  ["Centralised logging and alerting", "تسجيل مركزي للأحداث والتنبيهات"],
  ["Written information-security policy and annual access review", "سياسة أمن معلومات مكتوبة ومراجعة سنوية للصلاحيات"],
  ["Runbooks so every platform owner has a trained backup", "أدلة تشغيل ليكون لكل مسؤول بديل مُدرَّب"],
];
export const CATS: [string, string, string][] = [["all", "All", "الكل"], ["security", "Security", "الأمن"], ["network", "Network", "الشبكة"], ["callcenter", "Call center", "مركز الاتصال"], ["erp", "ERP / AX", "ERP"], ["sales", "SalesBuzz", "المبيعات"], ["crm", "Odoo / CRM", "Odoo"], ["hr", "HR", "الموارد البشرية"], ["data", "Servers / data", "الخوادم والبيانات"], ["web", "Web / mail", "المواقع والبريد"], ["people", "People", "الأفراد"]];
