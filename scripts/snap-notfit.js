/* SNAP — not the right fit (they need in person or phone help). Records the
   outcome so the dashboard card reads "Not a fit", then returns to the dashboard. */
(function () {
  'use strict';
  function init() { if (window.Pillars) { Pillars.markOutcome('snap', 'notfit'); Pillars.wireHandoff('snap'); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
