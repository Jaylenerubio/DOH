/* =========================================================================
   Pillar chaining + completion.
   - 'nyc.programs'  : programs with a result (seeded at sign-in)
   - 'nyc.completed' : pillar keys whose handoff screen has been reached
   Terminal ("What's next") screens call Pillars.wireHandoff(currentKey):
   marks it screened and wires the primary CTA (partner application link, or
   Return to dashboard).
   ========================================================================= */
window.Pillars = (function () {
  'use strict';
  /* Program keys. 'financial-help' (the "Financial resources" pillar on the
     selection page) expands to two programs: Energy discounts (EAP flow,
     keeps the key) and Tax credits (EITC flow). */
  var ORDER = ['hospital-bills', 'medicaid', 'anti-eviction', 'financial-help', 'tax-credits'];
  var META = {
    'hospital-bills': { label: 'Hospital bills',   entry: 'dollarfor.html', desc: 'Find out if your hospital will reduce or forgive your bills.' },
    'medicaid':       { label: 'Health insurance', entry: 'hi.html',        desc: 'Enroll in or renew free health insurance.' },
    'anti-eviction':  { label: 'Eviction',         entry: 'tsu.html',       desc: 'Get help staying in your home.' },
    'financial-help': { label: 'Energy discounts', entry: 'eap.html',       desc: 'Lower your monthly Con Edison and National Grid bills.' },
    'tax-credits':    { label: 'Tax credits',      entry: 'eitc.html',      desc: 'Claim up to 3 years of tax credits and cash payments.' }
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
  /* Partner applications. Vendor: the EAP url is a placeholder for the BEA
     partner intake link (e.g. staging.nyc-bea.navateam.com/partner-intake-demo). */
  var APPLY = {
    'hospital-bills': { label: 'Start your application', url: 'https://dollarfor.org/', partner: 'Dollar For' },
    'financial-help': { label: 'Start your application', url: '#bea-partner-intake-placeholder', partner: 'the Energy Affordability Program', eeapUrl: 'https://nyeeap.com/program' },
    'tax-credits':    { label: 'Start your application', url: 'https://www.getyourrefund.org/en', partner: 'GetYourRefund' }
  };
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
    var app = outcome(currentKey) === 'ineligible' ? null : APPLY[currentKey];   /* not eligible: no application to start */
    if (btn) {
      if (app) {
        btn.innerHTML = app.label + '<span class="sr-only"> (opens in new tab)</span>';
        btn.addEventListener('click', function () { var u = applyUrl(currentKey); if (u.charAt(0) !== '#') window.open(u, '_blank', 'noopener'); });
      } else {
        btn.textContent = 'Return to dashboard';
        btn.addEventListener('click', function () { window.location.href = 'dashboard.html'; });
      }
    }
    if (rec) {
      if (app) { rec.textContent = 'Return to dashboard'; rec.addEventListener('click', function () { window.location.href = 'dashboard.html'; }); }
      else rec.hidden = true;
    }
  }
  return { ORDER: ORDER, META: META, selected: selected, completed: completed, isCompleted: isCompleted,
           markCompleted: markCompleted, pending: pending, first: first, nextAfter: nextAfter,
           entryFor: entryFor, labelFor: labelFor, wireHandoff: wireHandoff,
           isSelf: isSelf, APPLY: APPLY,
           outcome: outcome, markOutcome: markOutcome, applyUrl: applyUrl };
})();
