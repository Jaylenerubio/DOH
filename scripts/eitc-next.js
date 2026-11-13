/* Tax credits — results pages. Eligible / maybe / claimed: "File now" opens GetYourRefund (a link in the
   page). Ineligible: records the outcome. */
(function () {
  'use strict';
  function init() {
    var key = 'tax-credits';
    var inel = /eitc-ineligible/.test(location.pathname);
    Pillars.markCompleted(key); Pillars.markOutcome(key, inel ? 'ineligible' : 'eligible');
    var home = 'dashboard.html';
    Array.prototype.forEach.call(document.querySelectorAll('#nextPillarBtn, #recordBtn'), function (b) {
      b.addEventListener('click', function () { window.location.href = home; });
    });
    /* "File now" is the footer's one button; "Back to dashboard" moves above the title (see Pillars.addBackLink). */
    var rec = document.getElementById('recordBtn');
    if (rec && !inel && Pillars.addBackLink) { rec.hidden = true; Pillars.addBackLink(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
