/* =========================================================================
   Client dashboard — selected programs as app cards; the rest as featured rows.
   States per program (derived from the stores the flows already write):
     none       → "Get started"            (outline)
     progress   → In progress chip + status line + "Continue"
     screened   → Screened chip + status line + "Start your application" + "View details"
     awaiting   → Awaiting response chip + status line + "View details"
                  (submitted with no partner app, or application started)
   "View details" opens the program's handoff page with ?from=dashboard.
     ineligible → Not eligible chip + "View details"
   ========================================================================= */
(function () {
  'use strict';
  var ICONS = {"hospital-bills": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M4 9C3.46957 9 2.96086 9.21071 2.58579 9.58579C2.21071 9.96086 2 10.4696 2 11V13C2 13.5304 2.21071 14.0391 2.58579 14.4142C2.96086 14.7893 3.46957 15 4 15H8C8.26522 15 8.51957 15.1054 8.70711 15.2929C8.89464 15.4804 9 15.7348 9 16V20C9 20.5304 9.21071 21.0391 9.58579 21.4142C9.96086 21.7893 10.4696 22 11 22H13C13.5304 22 14.0391 21.7893 14.4142 21.4142C14.7893 21.0391 15 20.5304 15 20V16C15 15.7348 15.1054 15.4804 15.2929 15.2929C15.4804 15.1054 15.7348 15 16 15H20C20.5304 15 21.0391 14.7893 21.4142 14.4142C21.7893 14.0391 22 13.5304 22 13V11C22 10.4696 21.7893 9.96086 21.4142 9.58579C21.0391 9.21071 20.5304 9 20 9H16C15.7348 9 15.4804 8.89464 15.2929 8.70711C15.1054 8.51957 15 8.26522 15 8V4C15 3.46957 14.7893 2.96086 14.4142 2.58579C14.0391 2.21071 13.5304 2 13 2H11C10.4696 2 9.96086 2.21071 9.58579 2.58579C9.21071 2.96086 9 3.46957 9 4V8C9 8.26522 8.89464 8.51957 8.70711 8.70711C8.51957 8.89464 8.26522 9 8 9H4Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "medicaid": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M11 2V4M5 2V4M5 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V9C2 10.5913 2.63214 12.1174 3.75736 13.2426C4.88258 14.3679 6.4087 15 8 15M8 15C9.5913 15 11.1174 14.3679 12.2426 13.2426C13.3679 12.1174 14 10.5913 14 9V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3H11M8 15C8 16.5913 8.63214 18.1174 9.75736 19.2426C10.8826 20.3679 12.4087 21 14 21C15.5913 21 17.1174 20.3679 18.2426 19.2426C19.3679 18.1174 20 16.5913 20 15V12M20 12C21.1046 12 22 11.1046 22 10C22 8.89543 21.1046 8 20 8C18.8954 8 18 8.89543 18 10C18 11.1046 18.8954 12 20 12Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "anti-eviction": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M15 21.0005V13.0005C15 12.7353 14.8946 12.4809 14.7071 12.2934C14.5196 12.1058 14.2652 12.0005 14 12.0005H10C9.73478 12.0005 9.48043 12.1058 9.29289 12.2934C9.10536 12.4809 9 12.7353 9 13.0005V21.0005M3 10.0005C2.99993 9.70955 3.06333 9.4221 3.18579 9.1582C3.30824 8.89429 3.4868 8.66028 3.709 8.47248L10.709 2.47248C11.07 2.16739 11.5274 2 12 2C12.4726 2 12.93 2.16739 13.291 2.47248L20.291 8.47248C20.5132 8.66028 20.6918 8.89429 20.8142 9.1582C20.9367 9.4221 21.0001 9.70955 21 10.0005V19.0005C21 19.5309 20.7893 20.0396 20.4142 20.4147C20.0391 20.7898 19.5304 21.0005 19 21.0005H5C4.46957 21.0005 3.96086 20.7898 3.58579 20.4147C3.21071 20.0396 3 19.5309 3 19.0005V10.0005Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "financial-help": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M9 2.5V7M15 2.5V7M6.5 7h11v2.5a5.5 5.5 0 0 1-11 0V7ZM12 15v6.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "snap": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M6 8h12l1 13H5L6 8Z M9 8a3 3 0 0 1 6 0\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "tax-credits": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8 M12 17.5v-11\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>"};
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12 L10 17 L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEVRON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5 L16 12 L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /* Dashboard content (Nov 2026): every program is a card. A card is in one of
     three states: no chip (not started / still screening), "Referral sent",
     or "No match". Tax credits has no chip when eligible (nothing is sent).
     Health insurance never gets "No match": OHIS takes every referral. */
  var ORDER  = ['hospital-bills', 'medicaid', 'financial-help', 'tax-credits', 'anti-eviction', 'snap'];
  var TITLE  = { 'hospital-bills': 'Hospital bill forgiveness', 'medicaid': 'Health insurance', 'financial-help': 'Energy discounts', 'tax-credits': 'Tax credits', 'anti-eviction': 'Tenant support', 'snap': 'SNAP (food stamps)' };
  var DESC   = { 'hospital-bills': 'See if your hospital can lower or erase your medical bills.', 'medicaid': 'Sign up for or renew your coverage.', 'financial-help': 'Lower your monthly Con Edison and National Grid bills.', 'tax-credits': 'Get money back from up to 3 years of taxes.', 'anti-eviction': 'Get help staying in your home.', 'snap': 'Enroll or renew SNAP/EBT benefits.' };
  var ENTRY  = { 'hospital-bills': 'dollarfor.html', 'medicaid': 'hi.html', 'financial-help': 'eap.html', 'tax-credits': 'eitc.html', 'anti-eviction': 'tsu.html', 'snap': 'snap.html' };
  var NEXT   = { 'hospital-bills': 'df-next.html', 'medicaid': 'hi-next.html', 'anti-eviction': 'tsu-connected.html', 'financial-help': 'eeap-next.html', 'tax-credits': 'eitc-eligible.html', 'snap': 'snap-next.html' };
  var INEL   = { 'hospital-bills': 'df-ineligible.html', 'financial-help': 'eap-ineligible.html', 'tax-credits': 'eitc-ineligible.html', 'anti-eviction': 'tsu-311.html', 'snap': 'snap-notfit.html' };
  /* Referral-sent text after "We shared your info on <date>." */
  var SENT   = {
    'hospital-bills': function () { return Pillars.usesCss() ? 'A CSS health counselor will call you within two business days.' : 'You\u2019ll need PIN ' + pin() + ' to open your application.'; },
    'medicaid': function () { return 'A NYC Health Department counselor will call you within 3 business days.'; },
    'financial-help': function () { return 'Open your application with the Benefits Enrollment Assistant.'; },
    'anti-eviction': function () { return 'A tenant specialist will reach out within 3 business days.'; },
    'snap': function () { return 'Check your text messages for next steps.'; }
  };
  var NOMATCH = {
    'hospital-bills': 'We did not send your info to a hospital. You can still ask your hospital about lowering your bills.',
    'financial-help': 'We did not send your info to your utility provider. Call 311 for more information about energy assistance.',
    'tax-credits': 'Next time you file taxes, NYC Health partner GetYourRefund can help you for free.',
    'anti-eviction': 'We did not send your info to the Mayor\u2019s Tenant Support Unit. Call 311 for more information about housing assistance.',
    'snap': 'We did not send your info to NYC Health partner Frontdoor Benefits. Call 311 for more information about food assistance.'
  };

  function raw(k) { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function fmtLong(iso) { var d = iso ? new Date(iso) : new Date(); if (isNaN(d.getTime())) d = new Date(); return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  /* Demo PIN for the Dollar For application (real value comes from the partner). */
  function pin() {
    var v = raw('nyc.df.pin');
    if (!v) { v = String(1000 + Math.floor(Math.random() * 9000)); try { sessionStorage.setItem('nyc.df.pin', v); } catch (e) {} }
    return v;
  }
  /* Tax credits: which results page this client saw (claimed / likely / maybe). */
  function eitc() { try { return JSON.parse(sessionStorage.getItem('nyc.eitc') || '{}'); } catch (e) { return {}; } }
  function eitcPage() {
    var o = eitc();
    if (o.filed === 'every') return 'eitc-claimed.html';
    var kids = o.children === 'full' || o.children === 'part';
    return kids ? 'eitc-eligible.html' : 'eitc-maybe.html';
  }
  function stateFor(key) {
    var o = Pillars.outcome(key);
    if (key !== 'medicaid' && (o === 'ineligible' || o === 'notfit')) return 'nomatch';
    return Pillars.isCompleted(key) ? 'referral' : 'none';
  }
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function head(key) {
    return '<span class="app-card__head"><span class="app-card__icon">' + ICONS[key] + '</span><h3 class="app-card__title">' + TITLE[key] + '</h3></span><hr class="app-card__rule">';
  }
  function card(key) {
    var st = stateFor(key), c = el('article', 'app-card');
    c.setAttribute('data-key', key); c.setAttribute('data-state', st);
    var html = '', details = (key === 'hospital-bills' && Pillars.usesCss() ? 'df-css.html' : key === 'tax-credits' ? eitcPage() : NEXT[key]) + '?from=dashboard';
    if (st === 'none') {
      html = head(key) + '<p class="app-card__desc">' + DESC[key] + '</p>' +
        '<div class="app-card__cta"><a class="btn btn--outline" href="' + ENTRY[key] + '">Get started</a></div>';
    } else if (st === 'referral') {
      var applyBtn = (Pillars.APPLY[key] && !(key === 'hospital-bills' && Pillars.usesCss())) ? '<a class="btn btn--primary" href="' + Pillars.applyUrl(key) + '" target="_blank" rel="noopener" data-apply="' + key + '">Start application<span class="sr-only"> (opens in new tab)</span></a>' : '';
      if (key === 'tax-credits') {   /* nothing is sent: no chip */
        html = head(key) + '<p class="app-card__status">' + (eitc().filed === 'every' ? 'Check whether you claimed the Earned Income Tax Credit.' : 'Start your application with GetYourRefund, an NYC Health partner.') + '</p>';
        if (eitc().filed === 'every') applyBtn = '';
      } else {
        c.classList.add('is-in-progress');
        html = '<span class="app-card__chip app-card__chip--done">Referral sent</span>' + head(key) +
          '<p class="app-card__status">We shared your info on ' + fmtLong(raw('nyc.completed.' + key)) + '. ' + SENT[key]() + '</p>';
      }
      html += '<div class="app-card__cta">' + applyBtn + '<a class="btn btn--outline" href="' + details + '">View details</a></div>';
    } else {
      c.classList.add('is-in-progress');
      html = '<span class="app-card__chip app-card__chip--ineligible">No match</span>' + head(key) +
        '<p class="app-card__status">' + NOMATCH[key] + '</p>' +
        '<div class="app-card__cta"><a class="btn btn--outline" href="' + INEL[key] + '?from=dashboard">View details</a></div>';
    }
    c.innerHTML = html;
    return c;
  }
  function init() {
    /* Demo flag: ?demo=submitted marks Hospital bills as screened and sent. */
    if (/[?&]demo=submitted/.test(location.search)) {
      try {
        var cpl = JSON.parse(sessionStorage.getItem('nyc.completed') || '[]'); if (cpl.indexOf('hospital-bills') === -1) cpl.push('hospital-bills');
        sessionStorage.setItem('nyc.completed', JSON.stringify(cpl));
        if (!sessionStorage.getItem('nyc.completed.hospital-bills')) sessionStorage.setItem('nyc.completed.hospital-bills', new Date().toISOString());
      } catch (e) {}
    }
    var c = {}; try { c = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    if (c.firstName) document.getElementById('greeting').textContent = 'Hi, ' + c.firstName;
    var stack = document.getElementById('appStack');
    ORDER.forEach(function (k) { stack.appendChild(card(k)); });
    var fs = document.getElementById('featuredSection'); if (fs) fs.hidden = true;
    stack.addEventListener('click', function (e) { var a = e.target.closest('[data-apply]'); if (a) Pillars.markApplied(a.getAttribute('data-apply')); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
