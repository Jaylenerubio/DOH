/* Hospital bills — no unaffordable hospital bill (terminal). Reached from
   the first Hospital bills question when the client answers "No". Marks the pillar
   screened and chains to the next selected pillar. */
(function () {
  'use strict';
  function init() {
    if (window.Pillars) { Pillars.markOutcome('hospital-bills', 'ineligible'); Pillars.wireHandoff('hospital-bills'); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
