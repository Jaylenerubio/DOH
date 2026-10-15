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
  var ICONS = {"hospital-bills": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M4 9C3.46957 9 2.96086 9.21071 2.58579 9.58579C2.21071 9.96086 2 10.4696 2 11V13C2 13.5304 2.21071 14.0391 2.58579 14.4142C2.96086 14.7893 3.46957 15 4 15H8C8.26522 15 8.51957 15.1054 8.70711 15.2929C8.89464 15.4804 9 15.7348 9 16V20C9 20.5304 9.21071 21.0391 9.58579 21.4142C9.96086 21.7893 10.4696 22 11 22H13C13.5304 22 14.0391 21.7893 14.4142 21.4142C14.7893 21.0391 15 20.5304 15 20V16C15 15.7348 15.1054 15.4804 15.2929 15.2929C15.4804 15.1054 15.7348 15 16 15H20C20.5304 15 21.0391 14.7893 21.4142 14.4142C21.7893 14.0391 22 13.5304 22 13V11C22 10.4696 21.7893 9.96086 21.4142 9.58579C21.0391 9.21071 20.5304 9 20 9H16C15.7348 9 15.4804 8.89464 15.2929 8.70711C15.1054 8.51957 15 8.26522 15 8V4C15 3.46957 14.7893 2.96086 14.4142 2.58579C14.0391 2.21071 13.5304 2 13 2H11C10.4696 2 9.96086 2.21071 9.58579 2.58579C9.21071 2.96086 9 3.46957 9 4V8C9 8.26522 8.89464 8.51957 8.70711 8.70711C8.51957 8.89464 8.26522 9 8 9H4Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "medicaid": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M11 2V4M5 2V4M5 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V9C2 10.5913 2.63214 12.1174 3.75736 13.2426C4.88258 14.3679 6.4087 15 8 15M8 15C9.5913 15 11.1174 14.3679 12.2426 13.2426C13.3679 12.1174 14 10.5913 14 9V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3H11M8 15C8 16.5913 8.63214 18.1174 9.75736 19.2426C10.8826 20.3679 12.4087 21 14 21C15.5913 21 17.1174 20.3679 18.2426 19.2426C19.3679 18.1174 20 16.5913 20 15V12M20 12C21.1046 12 22 11.1046 22 10C22 8.89543 21.1046 8 20 8C18.8954 8 18 8.89543 18 10C18 11.1046 18.8954 12 20 12Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "anti-eviction": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M15 21.0005V13.0005C15 12.7353 14.8946 12.4809 14.7071 12.2934C14.5196 12.1058 14.2652 12.0005 14 12.0005H10C9.73478 12.0005 9.48043 12.1058 9.29289 12.2934C9.10536 12.4809 9 12.7353 9 13.0005V21.0005M3 10.0005C2.99993 9.70955 3.06333 9.4221 3.18579 9.1582C3.30824 8.89429 3.4868 8.66028 3.709 8.47248L10.709 2.47248C11.07 2.16739 11.5274 2 12 2C12.4726 2 12.93 2.16739 13.291 2.47248L20.291 8.47248C20.5132 8.66028 20.6918 8.89429 20.8142 9.1582C20.9367 9.4221 21.0001 9.70955 21 10.0005V19.0005C21 19.5309 20.7893 20.0396 20.4142 20.4147C20.0391 20.7898 19.5304 21.0005 19 21.0005H5C4.46957 21.0005 3.96086 20.7898 3.58579 20.4147C3.21071 20.0396 3 19.5309 3 19.0005V10.0005Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "financial-help": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M9 2.5V7M15 2.5V7M6.5 7h11v2.5a5.5 5.5 0 0 1-11 0V7ZM12 15v6.5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "tax-credits": "<svg viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8 M12 17.5v-11\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>"};
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12 L10 17 L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEVRON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5 L16 12 L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var STORE  = { 'hospital-bills': 'nyc.df', 'medicaid': 'nyc.hi', 'anti-eviction': 'nyc.tsu', 'financial-help': 'nyc.eap', 'tax-credits': 'nyc.eitc' };
  var REVIEW = { 'hospital-bills': 'df-review.html', 'medicaid': 'hi-review.html', 'anti-eviction': 'tsu-review.html', 'financial-help': 'eap-review.html', 'tax-credits': 'eitc-review.html' };
  var NEXT   = { 'hospital-bills': 'df-next.html', 'medicaid': 'hi-next.html', 'anti-eviction': 'tsu-connected.html', 'financial-help': 'eeap-next.html', 'tax-credits': 'eitc-eligible.html' };
  var INEL   = { 'hospital-bills': 'df-ineligible.html', 'financial-help': 'eap-ineligible.html', 'tax-credits': 'eitc-ineligible.html' };
  var PARTNER = { 'hospital-bills': 'Dollar For', 'medicaid': 'NYC Health enrollment counselor', 'anti-eviction': 'Tenant Support Unit', 'financial-help': 'Energy Affordability Program', 'tax-credits': 'GetYourRefund' };
  var NOTE = { 'medicaid': 'An enrollment counselor will call you within three business days.', 'anti-eviction': 'A tenant support specialist will contact you in 2\u20133 business days.', 'hospital-bills': 'Most hospitals reply within 3\u20138 weeks.', 'financial-help': 'Discounts appear within two billing cycles after approval.', 'tax-credits': 'GetYourRefund will follow up about your return.' };

  function read(k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function hasAnswers(v) {
    if (!v) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).some(function (k) { var x = v[k]; return Array.isArray(x) ? x.length : (x !== '' && x != null); });
    return !!v;
  }
  function stateFor(key) {
    if (Pillars.outcome(key) === 'ineligible') return 'ineligible';
    if (Pillars.isSubmitted(key)) return 'submitted';
    if (Pillars.isApplied(key)) return 'awaiting';
    if (Pillars.isCompleted(key)) return Pillars.APPLY[key] ? 'screened' : 'awaiting';
    return hasAnswers(read(STORE[key])) ? 'progress' : 'none';
  }
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function head(key) {
    var m = Pillars.META[key];
    return '<span class="app-card__head"><span class="app-card__icon">' + ICONS[key] + '</span><h3 class="app-card__title">' + m.label + '</h3></span><hr class="app-card__rule">';
  }
  function fmt(iso) { var d = iso ? new Date(iso) : new Date(); if (isNaN(d.getTime())) d = new Date(); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  function raw(k) { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function status(text) { return '<p class="app-card__status">' + text + '</p>'; }
  function card(key) {
    var m = Pillars.META[key], st = stateFor(key);
    var c = el('article', 'app-card'); c.setAttribute('data-key', key); c.setAttribute('data-state', st);
    var html = '', details = NEXT[key] + '?from=dashboard';
    if (st === 'none') {
      html = head(key) + '<p class="app-card__desc">' + m.desc + '</p>' +
        '<div class="app-card__cta"><a class="btn btn--outline" href="' + m.entry + '">Get started</a></div>';
    } else if (st === 'progress') {
      c.classList.add('is-in-progress');
      html = '<span class="app-card__chip">In progress</span>' + head(key) +
        status('Screening started. Pick up where you left off.') +
        '<div class="app-card__cta"><a class="btn btn--primary" href="' + REVIEW[key] + '">Continue</a></div>';
    } else if (st === 'screened') {
      c.classList.add('is-in-progress');
      html = '<span class="app-card__chip app-card__chip--done">Screened</span>' + head(key) +
        status('Screening submitted ' + fmt(raw('nyc.completed.' + key)) + '.') +
        '<div class="app-card__cta"><a class="btn btn--primary" href="' + Pillars.applyUrl(key) + '" target="_blank" rel="noopener" data-apply="' + key + '">Start your application</a>' +
        '<a class="btn btn--outline" href="' + details + '">View details</a></div>';
    } else if (st === 'submitted') {
      c.classList.add('is-in-progress', 'is-submitted');
      html = '<span class="app-card__chip app-card__chip--done">Submitted</span>' + head(key) +
        status((PARTNER[key] || m.label) + ' received your application on ' + fmt(Pillars.submittedAt(key)) + '.') +
        '<div class="app-card__cta"><a class="btn btn--outline" href="' + details + '">View details</a></div>';
    } else if (st === 'awaiting') {
      c.classList.add('is-in-progress', 'is-submitted');
      var applied = Pillars.isApplied(key);
      html = '<span class="app-card__chip app-card__chip--applied">Awaiting response</span>' + head(key) +
        status(applied ? 'Application started ' + fmt(raw('nyc.applied.' + key)) + '.' : 'Submitted ' + fmt(raw('nyc.completed.' + key)) + '.') +
        '<div class="app-card__cta"><a class="btn btn--outline" href="' + details + '">View details</a></div>';
    } else {
      c.classList.add('is-in-progress');
      html = '<span class="app-card__chip app-card__chip--ineligible">Not eligible</span>' + head(key) +
        '<p class="app-card__desc">You don\u2019t qualify for this program right now. If your situation changes, you can screen again.</p>' +
        '<div class="app-card__cta"><a class="btn btn--outline" href="' + (INEL[key] || NEXT[key]) + '?from=dashboard">View details</a></div>';
    }
    c.innerHTML = html;
    return c;
  }
  function row(key) {
    var m = Pillars.META[key];
    var r = el('a', 'featured-row'); r.href = m.entry;
    r.innerHTML = '<span class="featured-row__body"><span class="featured-row__head"><span class="featured-row__icon">' + ICONS[key] + '</span><span class="featured-row__title">' + m.label + '</span></span><span class="featured-row__desc">' + m.desc + '</span></span><span class="featured-row__chevron" aria-hidden="true">' + CHEVRON + '</span>';
    return r;
  }
  function init() {
    /* Demo flag: ?demo=submitted marks Hospital bills as received by Dollar For. */
    if (/[?&]demo=submitted/.test(location.search)) {
      try {
        var a = read('nyc.applied') || []; if (a.indexOf('hospital-bills') === -1) a.push('hospital-bills');
        var cpl = read('nyc.completed') || []; if (cpl.indexOf('hospital-bills') === -1) cpl.push('hospital-bills');
        sessionStorage.setItem('nyc.applied', JSON.stringify(a)); sessionStorage.setItem('nyc.completed', JSON.stringify(cpl));
        if (!sessionStorage.getItem('nyc.applied.hospital-bills')) sessionStorage.setItem('nyc.applied.hospital-bills', new Date().toISOString());
        sessionStorage.setItem('nyc.submitted.hospital-bills', new Date().toISOString());
      } catch (e) {}
    }
    var c = read('nyc.contact') || {};
    if (c.firstName) document.getElementById('greeting').textContent = 'Hi, ' + c.firstName;
    var selected = Pillars.selected();
    /* Anything started or finished from a featured row joins the top. */
    Pillars.ORDER.forEach(function (k) { if (selected.indexOf(k) === -1 && stateFor(k) !== 'none') selected.push(k); });
    selected = Pillars.ORDER.filter(function (k) { return selected.indexOf(k) !== -1; });
    var stack = document.getElementById('appStack'), list = document.getElementById('featuredList');
    selected.forEach(function (k) { stack.appendChild(card(k)); });
    var rest = Pillars.ORDER.filter(function (k) { return selected.indexOf(k) === -1; });
    rest.forEach(function (k) { list.appendChild(row(k)); });
    document.getElementById('featuredSection').hidden = rest.length === 0;
    stack.addEventListener('click', function (e) { var a = e.target.closest('[data-apply]'); if (a) { Pillars.markApplied(a.getAttribute('data-apply')); window.setTimeout(function () { location.reload(); }, 300); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
