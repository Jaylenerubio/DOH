/* Energy discounts — not eligible (terminal). Reached from the review
   when the client answers "No" to the income threshold. Marks the pillar
   screened and chains to the next selected pillar. */
(function () {
  'use strict';
  function init() {
    if (window.Pillars) { Pillars.markOutcome('financial-help', 'ineligible'); Pillars.wireHandoff('financial-help'); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
