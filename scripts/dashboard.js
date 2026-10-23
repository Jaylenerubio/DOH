/* =========================================================================
   Client dashboard (v1.3 Save & Continue). The client started with a HART
   employee (CHW) in the Blooming Health CRM; the outcome per program comes
   from that record (nyc.outcome.<key>). Three states per program:
     none       → no chip, description, "Get started"
     referral   → "Referral sent" chip + "Referral sent <date>. <message>"
                  + "Start your application" where a partner application
                  exists (Dollar For, Energy/BEA, Tax credits) + "View details"
     nomatch    → "No match" chip + description + "View details"
   Programs with an outcome come first, then the rest, under "Explore
   programs & applications for you". SNAP is hidden for now.
   Clicking a partner link does not change state.
   ========================================================================= */
(function () {
  'use strict';
  var ICONS = {"hospital-bills": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M4 9C3.46957 9 2.96086 9.21071 2.58579 9.58579C2.21071 9.96086 2 10.4696 2 11V13C2 13.5304 2.21071 14.0391 2.58579 14.4142C2.96086 14.7893 3.46957 15 4 15H8C8.26522 15 8.51957 15.1054 8.70711 15.2929C8.89464 15.4804 9 15.7348 9 16V20C9 20.5304 9.21071 21.0391 9.58579 21.4142C9.96086 21.7893 10.4696 22 11 22H13C13.5304 22 14.0391 21.7893 14.4142 21.4142C14.7893 21.0391 15 20.5304 15 20V16C15 15.7348 15.1054 15.4804 15.2929 15.2929C15.4804 15.1054 15.7348 15 16 15H20C20.5304 15 21.0391 14.7893 21.4142 14.4142C21.7893 14.0391 22 13.5304 22 13V11C22 10.4696 21.7893 9.96086 21.4142 9.58579C21.0391 9.21071 20.5304 9 20 9H16C15.7348 9 15.4804 8.89464 15.2929 8.70711C15.1054 8.51957 15 8.26522 15 8V4C15 3.46957 14.7893 2.96086 14.4142 2.58579C14.0391 2.21071 13.5304 2 13 2H11C10.4696 2 9.96086 2.21071 9.58579 2.58579C9.21071 2.96086 9 3.46957 9 4V8C9 8.26522 8.89464 8.51957 8.70711 8.70711C8.51957 8.89464 8.26522 9 8 9H4Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "medicaid": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M11 2V4M5 2V4M5 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V9C2 10.5913 2.63214 12.1174 3.75736 13.2426C4.88258 14.3679 6.4087 15 8 15M8 15C9.5913 15 11.1174 14.3679 12.2426 13.2426C13.3679 12.1174 14 10.5913 14 9V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3H11M8 15C8 16.5913 8.63214 18.1174 9.75736 19.2426C10.8826 20.3679 12.4087 21 14 21C15.5913 21 17.1174 20.3679 18.2426 19.2426C19.3679 18.1174 20 16.5913 20 15V12M20 12C21.1046 12 22 11.1046 22 10C22 8.89543 21.1046 8 20 8C18.8954 8 18 8.89543 18 10C18 11.1046 18.8954 12 20 12Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "anti-eviction": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M15 21.0005V13.0005C15 12.7353 14.8946 12.4809 14.7071 12.2934C14.5196 12.1058 14.2652 12.0005 14 12.0005H10C9.73478 12.0005 9.48043 12.1058 9.29289 12.2934C9.10536 12.4809 9 12.7353 9 13.0005V21.0005M3 10.0005C2.99993 9.70955 3.06333 9.4221 3.18579 9.1582C3.30824 8.89429 3.4868 8.66028 3.709 8.47248L10.709 2.47248C11.07 2.16739 11.5274 2 12 2C12.4726 2 12.93 2.16739 13.291 2.47248L20.291 8.47248C20.5132 8.66028 20.6918 8.89429 20.8142 9.1582C20.9367 9.4221 21.0001 9.70955 21 10.0005V19.0005C21 19.5309 20.7893 20.0396 20.4142 20.4147C20.0391 20.7898 19.5304 21.0005 19 21.0005H5C4.46957 21.0005 3.96086 20.7898 3.58579 20.4147C3.21071 20.0396 3 19.5309 3 19.0005V10.0005Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "financial-help": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M9 2.5V7M15 2.5V7M6.5 7h11v2.5a5.5 5.5 0 0 1-11 0V7ZM12 15v6.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "tax-credits": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8 M12 17.5v-11\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>"};
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12 L10 17 L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEVRON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5 L16 12 L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var NEXT   = { 'hospital-bills': 'df-next.html', 'medicaid': 'hi-next.html', 'anti-eviction': 'tsu-connected.html', 'financial-help': 'eeap-next.html', 'tax-credits': 'eitc-eligible.html' };
  var INEL   = { 'hospital-bills': 'df-ineligible.html', 'financial-help': 'eap-ineligible.html', 'tax-credits': 'eitc-ineligible.html' };
  var NEXT   = { 'hospital-bills': 'df-next.html', 'medicaid': 'hi-next.html', 'anti-eviction': 'tsu-connected.html', 'financial-help': 'eeap-next.html', 'tax-credits': 'eitc-eligible.html' };
  var INEL   = { 'hospital-bills': 'df-ineligible.html', 'financial-help': 'eap-ineligible.html', 'tax-credits': 'eitc-ineligible.html' };
  /* Granular message after "Referral sent <date>." (from the handoff pages).
     PLACEHOLDER: the Dollar For PIN is "####" until BH supplies it. */
  var MSG = { 'hospital-bills': 'msg_hospital', 'medicaid': 'msg_medicaid', 'anti-eviction': 'msg_eviction', 'financial-help': 'msg_financial', 'tax-credits': 'msg_tax' };
  var T = function (k, v) { return window.I18n ? I18n.t(k, v) : k; };

  function read(k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function raw(k) { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function stateFor(key) {
    var o = Pillars.outcome(key);
    return o === 'eligible' ? 'referral' : o === 'ineligible' ? 'nomatch' : 'none';
  }
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function head(key) {
    var m = Pillars.META[key];
    return '<span class="app-card__head"><span class="app-card__icon">' + ICONS[key] + '</span><h2 class="app-card__title">' + T(key) + '</h2></span><hr class="app-card__rule">';
  }
  /* Full date: "October 12, 2026" */
  function fmt(iso) { var d = iso ? new Date(iso) : new Date(); if (isNaN(d.getTime())) d = new Date(); return I18n.date(d); }
  function status(text) { return '<p class="app-card__status">' + text + '</p>'; }
  function card(key) {
    var m = Pillars.META[key], st = stateFor(key);
    var c = el('article', 'app-card'); c.setAttribute('data-key', key); c.setAttribute('data-state', st);
    var html = '', details = NEXT[key] + '?from=dashboard';
    if (st === 'none') {
      html = head(key) + '<p class="app-card__desc">' + T(key + '_desc') + '</p>' +
        '<div class="app-card__cta"><a class="btn btn--outline" href="' + m.entry + '">' + T('get_started') + '</a></div>';
    } else if (st === 'referral') {
      c.classList.add('is-in-progress');
      html = '<span class="app-card__chip app-card__chip--done">' + T('referral_sent') + '</span>' + head(key) +
        status(T('sent_on', { date: fmt(raw('nyc.completed.' + key)) }) + T(MSG[key])) +
        '<div class="app-card__cta">' +
        (Pillars.APPLY[key] ? '<a class="btn btn--primary" href="' + Pillars.applyUrl(key) + '" target="_blank" rel="noopener">' + T('start_app') + '<span class="sr-only">' + T('new_tab') + '</span></a>' : '') +
        '<a class="btn btn--outline" href="' + details + '">' + T('view_details') + '</a></div>';
    } else {
      c.classList.add('is-in-progress');
      html = '<span class="app-card__chip app-card__chip--ineligible">' + T('no_match') + '</span>' + head(key) +
        '<p class="app-card__desc">' + T(key + '_desc') + '</p>' +
        '<div class="app-card__cta"><a class="btn btn--outline" href="' + (INEL[key] || NEXT[key]) + '?from=dashboard">' + T('view_details') + '</a></div>';
    }
    c.innerHTML = html;
    return c;
  }
  function init() {
    var c = read('nyc.contact') || {};
    var g = document.getElementById('greeting');
    if (c.firstName) { g.setAttribute('data-i18n', 'hi_name'); g.setAttribute('data-i18n-name', c.firstName); g.textContent = T('hi_name', { name: c.firstName }); }
    /* Every program shows "Get started" until a screener is finished (in
       production the CHW's in-person results come from the record). Programs
       with a result float to the top. SNAP is hidden for now. */
    var all = Pillars.ORDER.filter(function (k) { return k !== 'snap'; });
    var done = all.filter(function (k) { return stateFor(k) !== 'none'; });
    var rest = all.filter(function (k) { return stateFor(k) === 'none'; });
    var stack = document.getElementById('appStack');
    stack.innerHTML = '';
    done.concat(rest).forEach(function (k) { stack.appendChild(card(k)); });
  }
  if (window.I18n) I18n.onChange(init);   /* header language menu: re-render in the new language */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
