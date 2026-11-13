/* Going back into a screener un-does its "finished" state.
   A hand-off or result page marks its program completed as soon as it loads. If the
   client then walks back through the screener (browser Back), they have left that
   flow, so the dashboard must read "Get started" again, not "Referral sent".
   Runs on screener pages only (never on hand-off pages or read-only views).
   Reloads, forward navigation and first visits are untouched. */
(function () {
  'use strict';
  var KEY = { 'dollarfor': 'hospital-bills', 'df-bill': 'hospital-bills', 'df-review': 'hospital-bills', 'df-self': 'hospital-bills',
              'hi': 'medicaid', 'hi-review': 'medicaid',
              'tsu': 'anti-eviction', 'tsu-review': 'anti-eviction',
              'eap': 'financial-help', 'eap-review': 'financial-help',
              'eitc': 'tax-credits', 'eitc-review': 'tax-credits',
              'snap': 'snap', 'snap-fit': 'snap', 'snap-review': 'snap' };
  var page = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
  var key = KEY[page];
  if (!key || /[?&](mode=view|from=dashboard)\b/.test(location.search)) return;
  function viaBack(e) {
    if (e && e.persisted) return true;
    try { var n = performance.getEntriesByType('navigation')[0]; return !!n && n.type === 'back_forward'; } catch (x) { return false; }
  }
  function reset() {
    try {
      var c = JSON.parse(sessionStorage.getItem('nyc.completed') || '[]').filter(function (k) { return k !== key; });
      sessionStorage.setItem('nyc.completed', JSON.stringify(c));
      ['nyc.completed.', 'nyc.outcome.', 'nyc.submitted.', 'nyc.applied.'].forEach(function (p) { sessionStorage.removeItem(p + key); });
    } catch (e) {}
  }
  if (viaBack()) reset();
  window.addEventListener('pageshow', function (e) { if (e.persisted) reset(); });
})();
