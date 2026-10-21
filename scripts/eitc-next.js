/* Tax credits — results pages. Eligible: "Apply" opens GetYourRefund. Ineligible: records the outcome. */
(function () {
  'use strict';
  function init() {
    var key = 'tax-credits';
    var inel = /eitc-ineligible/.test(location.pathname);
    Pillars.markCompleted(key); Pillars.markOutcome(key, inel ? 'ineligible' : 'eligible');
    var self = Pillars.isSelf();
    var home = self ? 'dashboard.html' : 'dashboard.html';
    var btn = document.getElementById('nextPillarBtn'), rec = document.getElementById('recordBtn');
    if (inel) { btn.addEventListener('click', function () { window.location.href = home; }); return; }
    btn.addEventListener('click', function () { window.open(Pillars.applyUrl(key), '_blank', 'noopener'); });
    if (rec) rec.addEventListener('click', function () { window.location.href = home; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
