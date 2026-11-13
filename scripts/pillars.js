/* =========================================================================
   Pillar chaining + completion.
   - 'nyc.programs'  : programs with a result (seeded at sign-in)
   - 'nyc.completed' : pillar keys whose handoff screen has been reached
   Terminal ("What's next") screens call Pillars.wireHandoff(currentKey):
   marks it screened and wires the primary CTA (partner application link, or
   Back to dashboard).
   ========================================================================= */
window.Pillars = (function () {
  'use strict';
  /* Program keys. 'financial-help' (the "Financial resources" pillar on the
     selection page) expands to two programs: Energy discounts (EAP flow,
     keeps the key) and Tax credits (EITC flow). */
  var ORDER = ['hospital-bills', 'medicaid', 'anti-eviction', 'financial-help', 'tax-credits', 'snap'];
  var META = {
    'hospital-bills': { label: 'Hospital bills',   entry: 'dollarfor.html', desc: 'Find out if your hospital will reduce or forgive your bills.' },
    'medicaid':       { label: 'Health insurance', entry: 'hi.html',        desc: 'Enroll in or renew free health insurance.' },
    'anti-eviction':  { label: 'Eviction',         entry: 'tsu.html',       desc: 'Get help staying in your home.' },
    'financial-help': { label: 'Energy discounts', entry: 'eap.html',       desc: 'Lower your monthly Con Edison and National Grid bills.' },
    'tax-credits':    { label: 'Tax credits',      entry: 'eitc.html',      desc: 'Claim up to 3 years of tax credits and cash payments.' },
    'snap':           { label: 'SNAP (food stamps)', entry: 'snap.html',    desc: 'Enroll or renew SNAP/EBT benefits.' }
  };
  function list(key) { try { return JSON.parse(sessionStorage.getItem(key) || '[]'); } catch (e) { return []; } }
  function selected()  {
    var p = list('nyc.programs');
    if (p.indexOf('financial-help') !== -1 && p.indexOf('tax-credits') === -1) p.push('tax-credits');   /* pillar → both programs */
    return ORDER.filter(function (k) { return p.indexOf(k) !== -1; });
  }
  /* Outcome recorded by terminal pages: 'eligible' | 'ineligible' */
  function outcome(key) {
    try {
      var o = sessionStorage.getItem('nyc.outcome.' + key) || '';
      if (!o && completed().indexOf(key) !== -1) o = 'eligible';   /* handoff reached with no result recorded = referral */
      return o;
    } catch (e) { return ''; }
  }
  function markOutcome(key, v) { try { sessionStorage.setItem('nyc.outcome.' + key, v); } catch (e) {} }
  function completed() { var c = list('nyc.completed'); return ORDER.filter(function (k) { return c.indexOf(k) !== -1; }); }
  function isCompleted(key) { return completed().indexOf(key) !== -1; }
  function markCompleted(key) {
    var c = list('nyc.completed');
    if (c.indexOf(key) === -1) c.push(key);
    try {
      sessionStorage.setItem('nyc.completed', JSON.stringify(c));
      if (!sessionStorage.getItem('nyc.completed.' + key)) sessionStorage.setItem('nyc.completed.' + key, new Date().toISOString());
    } catch (e) {}
  }
  function pending() { return selected().filter(function (k) { return !isCompleted(k); }); }
  function first() { var p = pending(); return p.length ? p[0] : null; }
  function nextAfter(key) {
    // Next unscreened selected pillar after this one in ORDER; wraps around so
    // an earlier pillar that hasn't been screened yet is still offered.
    var s = selected(), i = s.indexOf(key);
    for (var n = 1; n <= s.length; n++) {
      var k = s[(i + n) % s.length];
      if (k !== key && !isCompleted(k)) return k;
    }
    return null;
  }
  function entryFor(key) { return META[key] ? META[key].entry : 'dashboard.html'; }
  function labelFor(key) { return META[key] ? META[key].label : ''; }
  /* Partner applications open in a new tab; handoffs return to the dashboard. */
  /* Partner applications. The EAP url is the BEA (Benefits Enrollment Assistant)
     staging start link; the vendor swaps in the production link at launch. */
  var APPLY = {
    'hospital-bills': { label: 'Start your application', url: 'https://dollarfor.org/', partner: 'Dollar For' },
    'financial-help': { label: 'Start your application', url: 'https://staging.nyc-bea.navateam.com/start', partner: 'the Energy Affordability Program', eeapUrl: 'https://nyeeap.com/program' },
    'tax-credits':    { label: 'Start your application', url: 'https://getyourrefund.org/nychealth', partner: 'GetYourRefund' }
  };
  /* Hospital bills: clients whose preferred language is Urdu, Arabic, French or
     Polish are connected to a CSS health counselor instead of Dollar For. */
  var CSS_LANGS = ['ur', 'ar', 'fr', 'pl'];
  function usesCss() {
    var l = ''; try { l = sessionStorage.getItem('nyc.language') || ''; } catch (e) {}
    return CSS_LANGS.indexOf(l) !== -1;
  }
  function applyUrl(key) {
    var a = APPLY[key]; if (!a) return '#';
    if (key === 'financial-help') { try { var e = JSON.parse(sessionStorage.getItem('nyc.eap') || '{}'); if (e.path === 'eeap' && a.eeapUrl) return a.eeapUrl; } catch (x) {} }
    return a.url;
  }
  function isSelf() { try { return sessionStorage.getItem('nyc.channel') === 'self'; } catch (e) { return false; } }
  /* v1.3: no applied / submitted tracking. Clicking a partner link does not
     change any state; the dashboard shows only "Referral sent" or "No match". */
  function wireHandoff(currentKey) {
    markCompleted(currentKey);
    var btn = document.getElementById('nextPillarBtn');
    var rec = document.getElementById('recordBtn');
    var app = (outcome(currentKey) === 'ineligible' || (currentKey === 'hospital-bills' && usesCss())) ? null : APPLY[currentKey];   /* not eligible: no application to start */
    if (btn) {
      if (app) {
        btn.innerHTML = app.label + '<span class="sr-only"> (opens in new tab)</span>';
        btn.addEventListener('click', function () { var u = applyUrl(currentKey); if (u.charAt(0) !== '#') window.open(u, '_blank', 'noopener'); });
      } else {
        btn.textContent = 'Back to dashboard';
        btn.addEventListener('click', function () { window.location.href = 'dashboard.html'; });
      }
    }
    /* "Back to dashboard" sits above the title (the same link the dashboard view uses) so the footer
       is one button: on phones the pinned footer then takes a single row. */
    if (rec) {
      rec.hidden = true;
      if (app) addBackLink();
    }
  }
  var BACK_ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.825 10.9999H19C19.2833 10.9999 19.5208 11.0957 19.7125 11.2874C19.9042 11.4791 20 11.7166 20 11.9999C20 12.2832 19.9042 12.5207 19.7125 12.7124C19.5208 12.9041 19.2833 12.9999 19 12.9999H7.825L12.725 17.8999C12.925 18.0999 13.0208 18.3332 13.0125 18.5999C13.0042 18.8666 12.9 19.0999 12.7 19.2999C12.5 19.4832 12.2667 19.5791 12 19.5874C11.7333 19.5957 11.5 19.4999 11.3 19.2999L4.7 12.6999C4.6 12.5999 4.52917 12.4916 4.4875 12.3749C4.44583 12.2582 4.425 12.1332 4.425 11.9999C4.425 11.8666 4.44583 11.7416 4.4875 11.6249C4.52917 11.5082 4.6 11.3999 4.7 11.2999L11.3 4.69989C11.4833 4.51656 11.7125 4.42489 11.9875 4.42489C12.2625 4.42489 12.5 4.51656 12.7 4.69989C12.9 4.89989 13 5.13739 13 5.41239C13 5.68739 12.9 5.92489 12.7 6.12489L7.825 10.9999Z" fill="currentColor"/></svg>';
  function addBackLink() {
    var h1 = document.querySelector('.step__title');
    if (!h1 || document.querySelector('.handoff__back')) return;
    var a = document.createElement('a');
    a.className = 'handoff__back'; a.href = 'dashboard.html'; a.innerHTML = BACK_ARROW + 'Back to dashboard';
    h1.parentNode.insertBefore(a, h1);
  }
  return { ORDER: ORDER, META: META, selected: selected, completed: completed, isCompleted: isCompleted,
           markCompleted: markCompleted, pending: pending, first: first, nextAfter: nextAfter,
           entryFor: entryFor, labelFor: labelFor, wireHandoff: wireHandoff, addBackLink: addBackLink,
           isSelf: isSelf, APPLY: APPLY, usesCss: usesCss,
           outcome: outcome, markOutcome: markOutcome, applyUrl: applyUrl };
})();
