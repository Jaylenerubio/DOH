/* =========================================================================
   TSU intake — "Get connected" (completion). "Return to dashboard" goes home.
   ========================================================================= */
(function () {
  'use strict';
  function init() {
    // Completed application: show it as a "Submitted" card on the dashboard.
    if (window.submitProgram) window.submitProgram('anti-eviction');

    if (window.Pillars) Pillars.wireHandoff('anti-eviction');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
