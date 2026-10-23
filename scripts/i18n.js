/* =========================================================================
   Prototype translations (v1.3). PLACEHOLDER: drafted for layout review only,
   NOT reviewed by a professional translator. Production strings come from the
   translation vendor.
   How it works (vendor reference):
   - Every visible string has a key. Markup uses data-i18n="key" (text),
     data-i18n-html="key" (text with markup), data-i18n-aria="key" (aria-label).
     Strings with a value use {name}, {date}.
   - The language is nyc.language (set from the client's preferred language at
     sign-in, or from the header menu). Unknown/untranslated languages fall back
     to English.
   - <html lang> and <html dir> follow the language (Arabic = rtl).
   - Names, email addresses, codes and numbers stay left-to-right inside
     right-to-left text (<bdi>).
   Covered screens: welcome back, dashboard. Others are still English.
   ========================================================================= */
window.I18n = (function () {
  'use strict';
  var LOCK = '<span aria-label="LOCKED">&#128274;</span>';
  var S = {
    en: {
      menu: 'Menu', close: 'Close', my_profile: 'My profile', sign_out: 'Sign out', account_menu: 'Account menu', account: 'Account', choose_language: 'Choose a language', language: 'Language', current: ' (current)',
      gov_site: 'Official website of the City of New York',
      gov_h1: 'Official websites use .gov',
      gov_p1: 'A .gov website belongs to an official government organization in the United States.',
      gov_h2: 'Secure .gov websites use HTTPS',
      gov_p2: 'A lock (' + LOCK.replace('LOCKED', 'locked') + ') or https:// means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.',
      home_aria: 'NYC Health — your dashboard',
      translate_suffix: ', translate this page',
      welcome: 'Welcome back', welcome_name: 'Welcome back, {name}',
      hi_there: 'Hi there', hi_name: 'Hi, {name}',
      dash_title: 'Explore programs', dash_title_muted: '& applications for you',
      'hospital-bills': 'Hospital bills', 'hospital-bills_desc': 'Find out if your hospital will reduce or forgive your bills.',
      'medicaid': 'Health insurance', 'medicaid_desc': 'Enroll in or renew free health insurance.',
      'anti-eviction': 'Eviction', 'anti-eviction_desc': 'Get help staying in your home.',
      'financial-help': 'Energy discounts', 'financial-help_desc': 'Lower your monthly Con Edison and National Grid bills.',
      'tax-credits': 'Tax credits', 'tax-credits_desc': 'Claim up to 3 years of tax credits and cash payments.',
      get_started: 'Get started', referral_sent: 'Referral sent', sent_on: 'Referral sent {date}. ', no_match: 'No match',
      start_app: 'Start your application', new_tab: ' (opens in new tab)', view_details: 'View details',
      msg_hospital: 'Start your application using your PIN ####.',
      msg_medicaid: 'An enrollment counselor will call you within three business days.',
      msg_eviction: 'A tenant support specialist will contact you in 2–3 business days.',
      msg_financial: 'Start your application. You’ll get a one-time code each time you sign in.',
      msg_tax: 'Start your application with GetYourRefund to file or amend your return.',
      support_pre: 'You can request help by contacting us at ', support_post: '.'
    },
    es: {
      menu: 'Men\u00fa', close: 'Cerrar', my_profile: 'Mi perfil', sign_out: 'Cerrar sesi\u00f3n', account_menu: 'Men\u00fa de la cuenta', account: 'Cuenta', choose_language: 'Elija un idioma', language: 'Idioma', current: ' (actual)',
      gov_site: 'Sitio web oficial de la Ciudad de Nueva York',
      gov_h1: 'Los sitios web oficiales usan .gov',
      gov_p1: 'Un sitio web .gov pertenece a una organización gubernamental oficial de los Estados Unidos.',
      gov_h2: 'Los sitios web .gov seguros usan HTTPS',
      gov_p2: 'Un candado (' + LOCK.replace('LOCKED', 'candado') + ') o https:// significa que se ha conectado de forma segura a un sitio web .gov. Comparta información confidencial solo en sitios web oficiales y seguros.',
      home_aria: 'NYC Health — su panel',
      translate_suffix: ', traducir esta página',
      welcome: 'Le damos la bienvenida de nuevo', welcome_name: 'Le damos la bienvenida de nuevo, {name}',
      hi_there: 'Hola', hi_name: 'Hola, {name}',
      dash_title: 'Explore programas', dash_title_muted: 'y solicitudes para usted',
      'hospital-bills': 'Facturas del hospital', 'hospital-bills_desc': 'Averigüe si su hospital reducirá o perdonará sus facturas.',
      'medicaid': 'Seguro médico', 'medicaid_desc': 'Inscríbase o renueve su seguro médico gratuito.',
      'anti-eviction': 'Desalojo', 'anti-eviction_desc': 'Obtenga ayuda para quedarse en su hogar.',
      'financial-help': 'Descuentos de energía', 'financial-help_desc': 'Reduzca sus facturas mensuales de Con Edison y National Grid.',
      'tax-credits': 'Créditos tributarios', 'tax-credits_desc': 'Reclame hasta 3 años de créditos tributarios y pagos en efectivo.',
      get_started: 'Comenzar', referral_sent: 'Derivación enviada', sent_on: 'Derivación enviada el {date}. ', no_match: 'Sin coincidencia',
      start_app: 'Iniciar su solicitud', new_tab: ' (se abre en una pestaña nueva)', view_details: 'Ver detalles',
      msg_hospital: 'Inicie su solicitud con su PIN ####.',
      msg_medicaid: 'Un consejero de inscripción le llamará dentro de tres días hábiles.',
      msg_eviction: 'Un especialista de apoyo a inquilinos se comunicará con usted en 2 a 3 días hábiles.',
      msg_financial: 'Inicie su solicitud. Recibirá un código de un solo uso cada vez que inicie sesión.',
      msg_tax: 'Inicie su solicitud con GetYourRefund para presentar o enmendar su declaración.',
      support_pre: 'Puede solicitar ayuda comunicándose con nosotros en ', support_post: '.'
    },
    ar: {
      menu: '\u0627\u0644\u0642\u0627\u0626\u0645\u0629', close: '\u0625\u063a\u0644\u0627\u0642', my_profile: '\u0645\u0644\u0641\u064a \u0627\u0644\u0634\u062e\u0635\u064a', sign_out: '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c', account_menu: '\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062d\u0633\u0627\u0628', account: '\u0627\u0644\u062d\u0633\u0627\u0628', choose_language: '\u0627\u062e\u062a\u0631 \u0644\u063a\u0629', language: '\u0627\u0644\u0644\u063a\u0629', current: ' (\u0627\u0644\u062d\u0627\u0644\u064a\u0629)',
      gov_site: 'الموقع الرسمي لمدينة نيويورك',
      gov_h1: 'المواقع الرسمية تستخدم النطاق .gov',
      gov_p1: 'يتبع موقع .gov منظمة حكومية رسمية في الولايات المتحدة.',
      gov_h2: 'مواقع .gov الآمنة تستخدم HTTPS',
      gov_p2: 'يشير القفل (' + LOCK.replace('LOCKED', 'مقفل') + ') أو https:// إلى أنك متصل بأمان بموقع .gov. شارك المعلومات الحساسة فقط على المواقع الرسمية الآمنة.',
      home_aria: 'NYC Health — لوحتك',
      translate_suffix: '، ترجمة هذه الصفحة',
      welcome: 'مرحباً بعودتك', welcome_name: 'مرحباً بعودتك، {name}',
      hi_there: 'مرحباً', hi_name: 'مرحباً، {name}',
      dash_title: 'استكشف البرامج', dash_title_muted: 'والطلبات المناسبة لك',
      'hospital-bills': 'فواتير المستشفى', 'hospital-bills_desc': 'اعرف ما إذا كان مستشفاك سيخفّض فواتيرك أو يعفيك منها.',
      'medicaid': 'التأمين الصحي', 'medicaid_desc': 'سجّل في تأمين صحي مجاني أو جدّده.',
      'anti-eviction': 'الإخلاء', 'anti-eviction_desc': 'احصل على مساعدة للبقاء في منزلك.',
      'financial-help': 'خصومات الطاقة', 'financial-help_desc': 'خفّض فواتيرك الشهرية لدى <bdi>Con Edison</bdi> و <bdi>National Grid</bdi>.',
      'tax-credits': 'الائتمانات الضريبية', 'tax-credits_desc': 'اطلب ما يصل إلى 3 سنوات من الائتمانات الضريبية والمدفوعات النقدية.',
      get_started: 'ابدأ', referral_sent: 'تم إرسال الإحالة', sent_on: 'تم إرسال الإحالة في {date}. ', no_match: 'لا توجد مطابقة',
      start_app: 'ابدأ طلبك', new_tab: ' (يفتح في علامة تبويب جديدة)', view_details: 'عرض التفاصيل',
      msg_hospital: 'ابدأ طلبك باستخدام رقم PIN الخاص بك ####.',
      msg_medicaid: 'سيتصل بك مستشار التسجيل خلال ثلاثة أيام عمل.',
      msg_eviction: 'سيتواصل معك أخصائي دعم المستأجرين خلال 2–3 أيام عمل.',
      msg_financial: 'ابدأ طلبك. ستتلقى رمزاً لمرة واحدة في كل مرة تسجّل فيها الدخول.',
      msg_tax: 'ابدأ طلبك مع <bdi>GetYourRefund</bdi> لتقديم إقرارك الضريبي أو تعديله.',
      support_pre: 'يمكنك طلب المساعدة عن طريق التواصل معنا على ', support_post: '.'
    },
    zh: {
      menu: '\u9078\u55ae', close: '\u95dc\u9589', my_profile: '\u6211\u7684\u500b\u4eba\u8cc7\u6599', sign_out: '\u767b\u51fa', account_menu: '\u5e33\u6236\u9078\u55ae', account: '\u5e33\u6236', choose_language: '\u9078\u64c7\u8a9e\u8a00', language: '\u8a9e\u8a00', current: '\uff08\u76ee\u524d\uff09',
      gov_site: '紐約市官方網站',
      gov_h1: '官方網站使用 .gov',
      gov_p1: '.gov 網站屬於美國的官方政府機構。',
      gov_h2: '安全的 .gov 網站使用 HTTPS',
      gov_p2: '鎖頭圖示（' + LOCK.replace('LOCKED', '已鎖定') + '）或 https:// 表示您已安全連線至 .gov 網站。請僅在官方的安全網站上分享敏感資訊。',
      home_aria: 'NYC Health — 您的儀表板',
      translate_suffix: '，翻譯此頁面',
      welcome: '歡迎回來', welcome_name: '歡迎回來，{name}',
      hi_there: '您好', hi_name: '您好，{name}',
      dash_title: '探索計劃', dash_title_muted: '與適合您的申請',
      'hospital-bills': '醫院帳單', 'hospital-bills_desc': '了解您的醫院是否會減免或免除您的帳單。',
      'medicaid': '健康保險', 'medicaid_desc': '加入或續保免費健康保險。',
      'anti-eviction': '驅逐', 'anti-eviction_desc': '獲得協助，繼續住在您的家中。',
      'financial-help': '能源折扣', 'financial-help_desc': '降低您每月的 Con Edison 和 National Grid 帳單。',
      'tax-credits': '稅收抵免', 'tax-credits_desc': '申請最多 3 年的稅收抵免和現金給付。',
      get_started: '開始', referral_sent: '已發送轉介', sent_on: '轉介已於 {date} 發送。', no_match: '無符合項目',
      start_app: '開始申請', new_tab: '（在新分頁開啟）', view_details: '查看詳情',
      msg_hospital: '請使用您的 PIN ####開始申請。',
      msg_medicaid: '註冊顧問將在三個工作天內致電給您。',
      msg_eviction: '租戶支援專員將在 2–3 個工作天內與您聯絡。',
      msg_financial: '開始申請。每次登入時，您都會收到一次性驗證碼。',
      msg_tax: '透過 GetYourRefund 開始申請，以報稅或修改報稅表。',
      support_pre: '您可以透過 ', support_post: ' 聯絡我們以尋求協助。'
    }
  };
  var RTL = { ar: 1, ur: 1, yi: 1, he: 1 };
  var LOCALE = { en: 'en-US', es: 'es-US', ar: 'ar-u-nu-latn', zh: 'zh-TW' };
  var FONTS = { ar: 'Noto+Sans+Arabic:wght@400;600', zh: 'Noto+Sans+TC:wght@400;600' };
  var listeners = [];

  function lang() { var l = ''; try { l = sessionStorage.getItem('nyc.language') || ''; } catch (e) {} return S[l] ? l : 'en'; }
  function t(key, vars) {
    var s = (S[lang()] && S[lang()][key] != null) ? S[lang()][key] : S.en[key];
    if (s == null) return key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }
  /* Long date in the active language: "October 12, 2026" / "12 de octubre de 2026". */
  function date(d) { try { return d.toLocaleDateString(LOCALE[lang()] || 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }); } catch (e) { return d.toDateString(); } }
  function loadFont(l) {
    if (!FONTS[l] || document.getElementById('i18n-font')) return;
    var link = document.createElement('link'); link.id = 'i18n-font'; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + FONTS[l] + '&display=swap';
    document.head.appendChild(link);
  }
  function apply() {
    var l = lang(), root = document.documentElement;
    root.setAttribute('lang', l); root.setAttribute('dir', RTL[l] ? 'rtl' : 'ltr'); loadFont(l);
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (n) {
      var name = n.getAttribute('data-i18n-name');
      n.textContent = t(n.getAttribute('data-i18n'), name ? { name: name } : null);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-html]'), function (n) { n.innerHTML = t(n.getAttribute('data-i18n-html')); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-aria]'), function (n) { n.setAttribute('aria-label', t(n.getAttribute('data-i18n-aria'))); });
    listeners.forEach(function (f) { f(l); });
  }
  function onChange(f) { listeners.push(f); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
  return { t: t, has: function (c) { return !!S[c]; }, lang: lang, date: date, apply: apply, onChange: onChange, isRtl: function () { return !!RTL[lang()]; } };
})();
