/* SNAP — "What's next" (terminal). Shows the steps for what they picked
   (apply / enroll / renew). Marks SNAP screened and returns to the dashboard. */
(function () {
  'use strict';
  function init() {
    var need = window.SNAPStore ? SNAPStore.get('need') : '';
    if (['apply', 'enroll', 'renew'].indexOf(need) === -1) need = 'apply';
    Array.prototype.forEach.call(document.querySelectorAll('[data-variant]'), function (v) { v.hidden = v.getAttribute('data-variant') !== need; });
    var T = { apply: 'Frontdoor Benefits can help you get started with SNAP', enroll: 'Frontdoor Benefits can help you get your SNAP benefits', renew: 'Frontdoor Benefits can help you keep your SNAP benefits' };
    document.getElementById('snapTitle').textContent = T[need];
    if (window.Pillars) { Pillars.markOutcome('snap', ''); Pillars.wireHandoff('snap'); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
