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
    },
    ur: {
      menu: 'مینو', close: 'بند کریں', my_profile: 'میری پروفائل', sign_out: 'سائن آؤٹ', account_menu: 'اکاؤنٹ مینو', account: 'اکاؤنٹ', choose_language: 'زبان منتخب کریں', language: 'زبان', current: ' (موجودہ)',
      gov_site: 'شہر نیویارک کی سرکاری ویب سائٹ',
      gov_h1: 'سرکاری ویب سائٹس .gov استعمال کرتی ہیں',
      gov_p1: 'ایک .gov ویب سائٹ ریاستہائے متحدہ کی کسی سرکاری تنظیم کی ہوتی ہے۔',
      gov_h2: 'محفوظ .gov ویب سائٹس HTTPS استعمال کرتی ہیں',
      gov_p2: 'تالا (' + LOCK.replace('LOCKED', 'مقفل') + ') یا https:// کا مطلب ہے کہ آپ محفوظ طریقے سے .gov ویب سائٹ سے جڑ گئے ہیں۔ حساس معلومات صرف سرکاری اور محفوظ ویب سائٹس پر شیئر کریں۔',
      home_aria: 'NYC Health — آپ کا ڈیش بورڈ',
      translate_suffix: '، اس صفحے کا ترجمہ کریں',
      welcome: 'خوش آمدید', welcome_name: 'خوش آمدید، {name}',
      hi_there: 'السلام علیکم', hi_name: 'السلام علیکم، {name}',
      dash_title: 'پروگرامز دریافت کریں', dash_title_muted: 'اور آپ کے لیے درخواستیں',
      'hospital-bills': 'ہسپتال کے بل', 'hospital-bills_desc': 'معلوم کریں کہ آیا آپ کا ہسپتال آپ کے بل کم یا معاف کرے گا۔',
      'medicaid': 'ہیلتھ انشورنس', 'medicaid_desc': 'مفت ہیلتھ انشورنس میں اندراج کروائیں یا اس کی تجدید کریں۔',
      'anti-eviction': 'بے دخلی', 'anti-eviction_desc': 'اپنے گھر میں رہنے کے لیے مدد حاصل کریں۔',
      'financial-help': 'توانائی پر رعایت', 'financial-help_desc': 'اپنے ماہانہ Con Edison اور National Grid کے بل کم کریں۔',
      'tax-credits': 'ٹیکس کریڈٹ', 'tax-credits_desc': 'زیادہ سے زیادہ 3 سال کے ٹیکس کریڈٹ اور نقد ادائیگیوں کا دعویٰ کریں۔',
      get_started: 'شروع کریں', referral_sent: 'ریفرل بھیج دیا گیا', sent_on: 'ریفرل {date} کو بھیجا گیا۔ ', no_match: 'کوئی مطابقت نہیں',
      start_app: 'اپنی درخواست شروع کریں', new_tab: ' (نئے ٹیب میں کھلتا ہے)', view_details: 'تفصیلات دیکھیں',
      msg_hospital: 'اپنا PIN #### استعمال کرتے ہوئے اپنی درخواست شروع کریں۔',
      msg_medicaid: 'اندراج کا کاؤنسلر تین کاروباری دنوں کے اندر آپ کو کال کرے گا۔',
      msg_eviction: 'کرایہ داروں کی معاونت کا ماہر 2–3 کاروباری دنوں میں آپ سے رابطہ کرے گا۔',
      msg_financial: 'اپنی درخواست شروع کریں۔ ہر بار سائن ان کرنے پر آپ کو ایک بار استعمال ہونے والا کوڈ ملے گا۔',
      msg_tax: '<bdi>GetYourRefund</bdi> کے ساتھ اپنی درخواست شروع کریں تاکہ اپنا ٹیکس ریٹرن فائل یا ترمیم کریں۔',
      support_pre: 'آپ ہم سے اس پر رابطہ کر کے مدد کی درخواست کر سکتے ہیں: ', support_post: '۔'
    },
    fr: {
      menu: 'Menu', close: 'Fermer', my_profile: 'Mon profil', sign_out: 'Se déconnecter', account_menu: 'Menu du compte', account: 'Compte', choose_language: 'Choisir une langue', language: 'Langue', current: ' (actuelle)',
      gov_site: 'Site Web officiel de la Ville de New York',
      gov_h1: 'Les sites officiels utilisent .gov',
      gov_p1: 'Un site Web .gov appartient à une organisation gouvernementale officielle des États-Unis.',
      gov_h2: 'Les sites .gov sécurisés utilisent HTTPS',
      gov_p2: 'Un cadenas (' + LOCK.replace('LOCKED', 'verrouillé') + ') ou https:// signifie que vous êtes connecté en toute sécurité à un site .gov. Ne communiquez des informations sensibles que sur des sites officiels et sécurisés.',
      home_aria: 'NYC Health — votre tableau de bord',
      translate_suffix: ', traduire cette page',
      welcome: 'Bon retour', welcome_name: 'Bon retour, {name}',
      hi_there: 'Bonjour', hi_name: 'Bonjour, {name}',
      dash_title: 'Découvrez les programmes', dash_title_muted: 'et demandes pour vous',
      'hospital-bills': 'Factures d’hôpital', 'hospital-bills_desc': 'Découvrez si votre hôpital réduira ou annulera vos factures.',
      'medicaid': 'Assurance maladie', 'medicaid_desc': 'Inscrivez-vous à une assurance maladie gratuite ou renouvelez-la.',
      'anti-eviction': 'Expulsion', 'anti-eviction_desc': 'Obtenez de l’aide pour rester dans votre logement.',
      'financial-help': 'Réductions d’énergie', 'financial-help_desc': 'Réduisez vos factures mensuelles de Con Edison et National Grid.',
      'tax-credits': 'Crédits d’impôt', 'tax-credits_desc': 'Réclamez jusqu’à 3 ans de crédits d’impôt et de paiements en espèces.',
      get_started: 'Commencer', referral_sent: 'Orientation envoyée', sent_on: 'Orientation envoyée le {date}. ', no_match: 'Aucune correspondance',
      start_app: 'Commencer votre demande', new_tab: ' (s’ouvre dans un nouvel onglet)', view_details: 'Voir les détails',
      msg_hospital: 'Commencez votre demande avec votre code PIN ####.',
      msg_medicaid: 'Un conseiller d’inscription vous appellera dans un délai de trois jours ouvrables.',
      msg_eviction: 'Un spécialiste de l’aide aux locataires vous contactera sous 2 à 3 jours ouvrables.',
      msg_financial: 'Commencez votre demande. Vous recevrez un code à usage unique à chaque connexion.',
      msg_tax: 'Commencez votre demande avec <bdi>GetYourRefund</bdi> pour déclarer ou modifier votre déclaration d’impôts.',
      support_pre: 'Vous pouvez demander de l’aide en nous contactant à ', support_post: '.'
    },
    pl: {
      menu: 'Menu', close: 'Zamknij', my_profile: 'Mój profil', sign_out: 'Wyloguj się', account_menu: 'Menu konta', account: 'Konto', choose_language: 'Wybierz język', language: 'Język', current: ' (bieżący)',
      gov_site: 'Oficjalna strona internetowa miasta Nowy Jork',
      gov_h1: 'Oficjalne strony używają domeny .gov',
      gov_p1: 'Strona z domeną .gov należy do oficjalnej organizacji rządowej w Stanach Zjednoczonych.',
      gov_h2: 'Bezpieczne strony .gov używają protokołu HTTPS',
      gov_p2: 'Kłódka (' + LOCK.replace('LOCKED', 'zamknięta') + ') lub https:// oznacza, że połączono się bezpiecznie ze stroną .gov. Poufne informacje podawaj tylko na oficjalnych, bezpiecznych stronach.',
      home_aria: 'NYC Health — Twój panel',
      translate_suffix: ', przetłumacz tę stronę',
      welcome: 'Witamy ponownie', welcome_name: 'Witamy ponownie, {name}',
      hi_there: 'Cześć', hi_name: 'Cześć, {name}',
      dash_title: 'Poznaj programy', dash_title_muted: 'i wnioski dla Ciebie',
      'hospital-bills': 'Rachunki szpitalne', 'hospital-bills_desc': 'Sprawdź, czy Twój szpital obniży lub umorzy Twoje rachunki.',
      'medicaid': 'Ubezpieczenie zdrowotne', 'medicaid_desc': 'Zapisz się na bezpłatne ubezpieczenie zdrowotne lub odnów je.',
      'anti-eviction': 'Eksmisja', 'anti-eviction_desc': 'Uzyskaj pomoc, aby zostać w swoim domu.',
      'financial-help': 'Zniżki na energię', 'financial-help_desc': 'Obniż swoje miesięczne rachunki od Con Edison i National Grid.',
      'tax-credits': 'Ulgi podatkowe', 'tax-credits_desc': 'Odbierz ulgi podatkowe i wypłaty gotówkowe za maksymalnie 3 lata.',
      get_started: 'Zacznij', referral_sent: 'Skierowanie wysłane', sent_on: 'Skierowanie wysłane {date}. ', no_match: 'Brak dopasowania',
      start_app: 'Rozpocznij wniosek', new_tab: ' (otwiera się w nowej karcie)', view_details: 'Zobacz szczegóły',
      msg_hospital: 'Rozpocznij wniosek, używając swojego kodu PIN ####.',
      msg_medicaid: 'Doradca ds. rejestracji zadzwoni do Ciebie w ciągu trzech dni roboczych.',
      msg_eviction: 'Specjalista ds. wsparcia najemców skontaktuje się z Tobą w ciągu 2–3 dni roboczych.',
      msg_financial: 'Rozpocznij wniosek. Przy każdym logowaniu otrzymasz jednorazowy kod.',
      msg_tax: 'Rozpocznij wniosek w <bdi>GetYourRefund</bdi>, aby złożyć lub poprawić zeznanie podatkowe.',
      support_pre: 'Możesz poprosić o pomoc, kontaktując się z nami pod adresem ', support_post: '.'
    }
  };
  var RTL = { ar: 1, ur: 1, yi: 1, he: 1 };
  var LOCALE = { en: 'en-US', es: 'es-US', ar: 'ar-u-nu-latn', zh: 'zh-TW', ur: 'ur-PK-u-nu-latn', fr: 'fr-FR', pl: 'pl-PL' };
  var FONTS = { ar: 'Noto+Sans+Arabic:wght@400;600', ur: 'Noto+Sans+Arabic:wght@400;600', zh: 'Noto+Sans+TC:wght@400;600' };
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
