/* SNAP — "What's next" (terminal). Shows the steps for what they picked
   (apply / enroll / renew). Marks SNAP screened and returns to the dashboard. */
(function () {
  'use strict';
  function init() {
    var need = window.SNAPStore ? SNAPStore.get('need') : '';
    if (['apply', 'enroll', 'renew'].indexOf(need) === -1) need = 'apply';
    Array.prototype.forEach.call(document.querySelectorAll('[data-variant]'), function (v) { v.hidden = v.getAttribute('data-variant') !== need; });
    if (window.Pillars) { Pillars.markOutcome('snap', ''); Pillars.wireHandoff('snap'); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
