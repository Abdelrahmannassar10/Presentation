// All figures come from IT_Call_Center_4-Year_Achievement_Report.md (data folder). Nothing here is invented.
import regJson from "./register.json";

export type Reg = { id: string; q: string; th: string; a: string; i: string; n: string; p: boolean; c: string[] };
export const REG = regJson as Reg[];

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
  ["Security", "الأمن", "Misconfigured firewall, everyone an administrator", "جدار ناري غير مضبوط والجميع بصلاحية مدير", "Fortigate, segmentation, least privilege, central endpoint protection", "Fortigate وتقسيم الشبكة وأقل صلاحيات وحماية مركزية للأجهزة"],
  ["Call center", "مركز الاتصال", "Personal mobiles and a busy tone", "هواتف شخصية ونغمة انشغال", "Issabel, 32 SIP channels, queues, recording, CRM logging", "Issabel و32 قناة وقوائم انتظار وتسجيل وربط مع CRM"],
  ["Business systems", "أنظمة الأعمال", "No CRM, no HR system, freelancer-run ERP", "بدون CRM أو نظام موارد بشرية، وERP يديره مستقل", "Odoo CRM, Mago HR, in-house AX, SalesBuzz 5.15", "Odoo CRM وMago HR وتشغيل AX داخلياً وSalesBuzz 5.15"],
  ["Reporting", "التقارير", "Manual spreadsheets", "جداول يدوية", "15+ SalesBuzz reports, ~15 Power BI reports, live dashboards", "أكثر من 15 تقرير SalesBuzz وحوالي 15 تقرير Power BI ولوحات مباشرة"],
  ["IT assets and devices", "الأصول والأجهزة", "Paper records, unmanaged handhelds", "سجلات ورقية وأجهزة محمولة بلا إدارة", "Snipe-IT custody, MDM on every handheld, service desk", "عهدة Snipe-IT وإدارة كل الأجهزة المحمولة ومكتب دعم فني"],
  ["Team", "الفريق", "Two people, limited experience", "شخصان بخبرة محدودة", "Three people, all at senior level", "ثلاثة أشخاص جميعهم بمستوى خبير"],
];

export const Q = [26, 29, 28, 27, 24, 8, 17, 16, 14, 12, 8, 19, 16, 16, 13, 5];
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
  ["Alrayen live · ELA business unit · Almina engagement · file server with backup", "تشغيل Alrayen · وحدة ELA · دعم Almina · خادم ملفات بنسخ احتياطي"],
  ["Fortigate firewall · NVR and 32 cameras · ~15 Power BI reports · NTRA issue solved", "جدار Fortigate · NVR و32 كاميرا · حوالي 15 تقرير Power BI · حل مشكلة NTRA"],
  ["Factory to 100 Mbps · KSA site under company control · web-incident report · ELA dashboard", "المصنع 100 ميجابت · الموقع السعودي تحت سيطرة الشركة · تقرير الحادثة · لوحة ELA"],
  ["Shpramont warehouse · Mobinil IVR · Fawry and Paymob · .eg domains · static IPs on both lines", "مستودع Shpramont · IVR موبينيل · Fawry وPaymob · نطاقات ‎.eg · عناوين ثابتة للخطين"],
  ["Warehouse firewall, filter, cameras · DB disk failure resolved · mail relay · social accounts taken over", "جدار ناري وفلترة وكاميرات للمستودع · حل عطل القرص · خادم ترحيل البريد · استلام حسابات التواصل"],
  ["Kaspersky · DMS servers on Azure · distributors isolated · SalesBuzz v5.15 · Arabic handheld printers", "Kaspersky · خوادم DMS على Azure · عزل الموزعين · SalesBuzz 5.15 · طابعات عربية"],
  ["DS servers with backups · new tax server · Scalefusion · Odoo REST APIs · Dynamics 365 kickoff", "خوادم DS بنسخ احتياطي · خادم ضرائب جديد · Scalefusion · واجهات Odoo · بدء Dynamics 365"],
  ["5th-floor network and surveillance · Issabel–Odoo 19 · home-delivery smart dashboard", "شبكة وكاميرات الدور الخامس · ربط Issabel مع Odoo 19 · لوحة التوصيل المنزلي"],
];
export const YEARS: [string, number, string, string][] = [["2023", 110, "Foundations", "بناء الأساس"], ["2024", 65, "Go-live and industrialisation", "التشغيل والتصنيع"], ["2025", 54, "Growth and modernisation", "النمو والتحديث"], ["2026", 50, "Hardening · to October", "التحصين · حتى أكتوبر"]];

// [en, ar, detail en, detail ar, delivered]
export const LAYERS: [string, string, string, string, string][] = [
  ["Perimeter", "الحماية الخارجية", "Site firewalls, Fortigate, single-IP publishing", "جدران نارية للمواقع وFortigate ونشر عبر عنوان واحد", "2023 → 2026"],
  ["Segmentation", "تقسيم الشبكة", "VLANs, factory DMZ, distributor isolation", "VLANs وDMZ للمصنع وعزل الموزعين", "2023 · 2026"],
  ["Identity and access", "الهوية والصلاحيات", "Least privilege in AX and SalesBuzz, port security", "أقل صلاحيات في AX وSalesBuzz وتأمين المنافذ", "2023 → 2026"],
  ["Endpoints", "حماية الأجهزة", "GravityZone, then Kaspersky, centrally managed", "GravityZone ثم Kaspersky بإدارة مركزية", "2023 · 2026"],
  ["Email and web", "البريد والمواقع", "Spam rejection, mail firewall and relay, SSL, filtering", "رفض الرسائل المزعجة وجدار للبريد وSSL وفلترة", "2023 → 2026"],
  ["Backup and recovery", "النسخ والاستعادة", "Daily automated backups, file server, cloud copies", "نسخ يومي آلي وخادم ملفات ونسخ سحابية", "2023 → 2026"],
  ["Secure remote access", "الوصول الآمن عن بعد", "Vendor VPN, secured CRM URL, Azure port security", "VPN للمورد ورابط CRM آمن وتأمين منافذ Azure", "2023 → 2025"],
  ["Physical security", "الأمن المادي", "CCTV at HQ, the factory and warehouses", "كاميرات في المقر والمصنع والمستودعات", "2023 → 2026"],
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
  ["Sadeq company", "شركة Sadeq", "Odoo e-invoicing · 2025", "الفاتورة الإلكترونية على Odoo · 2025"],
  ["Almina Trading", "Almina Trading", "Odoo support · IT hiring · board memo", "دعم Odoo · توظيف IT · مذكرة لمجلس الإدارة"],
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

// [type en, type ar, items en, items ar, basis en, basis ar, color]
export const VALUES: [string, string, string, string, string, string, string][] = [
  ["Direct saving", "وفر مباشر", "Etisalat contract (~24%) · Scalefusion replacing SOTI · printer and GPS contracts at best price", "عقد Etisalat (حوالي 24%) · Scalefusion بدل SOTI · عقود الطابعات وGPS بأفضل سعر", "Signed contracts", "عقود موقعة", "var(--teal)"],
  ["Cost avoidance", "تجنب تكاليف", "8 servers licensed without the partnership route · open-source platforms · AX in-house · no security consultancy", "ترخيص 8 خوادم دون مسار الشراكة · منصات مفتوحة المصدر · AX داخلياً · بدون استشارات أمنية", "Offers on file", "عروض موثقة", "var(--teal)"],
  ["Revenue protection", "حماية الإيرادات", "Credit controls at order entry · fake-order exposure closed · calls reach an agent", "ضوابط الائتمان عند إدخال الطلب · إغلاق الطلبات الوهمية · المكالمات تصل للموظف", "Qualitative", "نوعي", "var(--gold)"],
  ["Productivity", "الإنتاجية", "HR self-service · automated and Power BI reports · service desk · CRM history", "الخدمة الذاتية · التقارير الآلية وPower BI · مكتب الدعم · سجل العملاء", "Capacity, not cash", "وقت وليس نقداً", "var(--gold)"],
  ["Risk reduction", "تقليل المخاطر", "Ransomware and wiper loss · permanent data loss · single points of failure · unauthorized financial changes", "الفدية ومسح البيانات · فقدان البيانات الدائم · نقاط العطل الواحدة · التعديلات المالية غير المصرح بها", "Never counted as cash", "لا يُحتسب نقداً أبداً", "var(--amber)"],
];
export const CONTRACTS: [string, string, string][] = [
  ["~24%", "Etisalat contract renegotiated", "إعادة التفاوض على عقد Etisalat"],
  ["8 / 8", "Servers validly licensed", "خوادم مرخصة بشكل صحيح"],
  ["SOTI → Scalefusion", "Device management at better value", "إدارة الأجهزة بقيمة أفضل"],
  ["Static IPs", "Obtained from TE Data for both lines", "من TE Data للخطين"],
  ["IT cost", "Written into the ELA contract", "مضافة إلى عقد ELA"],
];
export const NEXTA: [string, string, string, string][] = [
  ["Issabel–Odoo 19 integration", "ربط Issabel مع Odoo 19", "Call history and CRM in one record · go-live next quarter", "سجل المكالمات والعملاء في مكان واحد · التشغيل الربع القادم"],
  ["5th-floor network and surveillance", "شبكة وكاميرات الدور الخامس", "New floor secured to the same standard", "تأمين الدور الجديد بنفس المعايير"],
  ["Home-delivery smart dashboard", "لوحة التوصيل المنزلي الذكية", "Live monitoring of delivery performance", "متابعة مباشرة لأداء التوصيل"],
  ["Dynamics 365 plan", "خطة Dynamics 365", "Offer received and kickoff held · next ERP generation", "تم استلام العرض والاجتماع الأول · الجيل التالي من ERP"],
  ["SMS invoicing with SalesBuzz", "إرسال الفواتير عبر SMS", "API key created · invoices sent to customers by SMS", "تم إنشاء مفتاح API · إرسال الفواتير للعملاء"],
  ["Website and mobile app", "الموقع وتطبيق الجوال", "Scope complete · WhatsApp, backend and dashboards", "النطاق مكتمل · واتساب ولوحات تحكم"],
];
export const NEXTB: [string, string][] = [
  ["Formal disaster-recovery and restore-test schedule", "جدول رسمي للتعافي من الكوارث واختبار الاستعادة"],
  ["Multi-factor authentication on critical systems", "التحقق متعدد العوامل على الأنظمة الحرجة"],
  ["Centralised logging and alerting", "تسجيل مركزي للأحداث والتنبيهات"],
  ["Written information-security policy and annual access review", "سياسة أمن معلومات مكتوبة ومراجعة سنوية للصلاحيات"],
  ["Runbooks so every platform owner has a trained backup", "أدلة تشغيل ليكون لكل مسؤول بديل مُدرَّب"],
];
export const CATS: [string, string, string][] = [["all", "All", "الكل"], ["security", "Security", "الأمن"], ["network", "Network", "الشبكة"], ["callcenter", "Call center", "مركز الاتصال"], ["erp", "ERP / AX", "ERP"], ["sales", "SalesBuzz", "المبيعات"], ["crm", "Odoo / CRM", "Odoo"], ["hr", "HR", "الموارد البشرية"], ["data", "Servers / data", "الخوادم والبيانات"], ["web", "Web / mail", "المواقع والبريد"], ["people", "People", "الأفراد"]];
