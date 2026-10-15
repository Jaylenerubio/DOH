/* Tax credits — results pages. Eligible: "Apply" opens GetYourRefund and
   marks the pillar applied. Ineligible: records the outcome. */
(function () {
  'use strict';
  function init() {
    var key = 'tax-credits';
    var inel = /eitc-ineligible/.test(location.pathname);
    Pillars.markCompleted(key); Pillars.markOutcome(key, inel ? 'ineligible' : 'eligible');
    var self = Pillars.isSelf();
    var home = self ? 'dashboard.html' : 'programs.html';
    var btn = document.getElementById('nextPillarBtn'), rec = document.getElementById('recordBtn');
    if (inel) { btn.addEventListener('click', function () { window.location.href = home; }); return; }
    btn.addEventListener('click', function () { Pillars.markApplied(key); window.open(Pillars.applyUrl(key), '_blank', 'noopener'); window.location.href = home; });
    if (rec) rec.addEventListener('click', function () { window.location.href = home; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
