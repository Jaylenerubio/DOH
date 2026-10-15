/* Dollar For intake — "What's next" (terminal step).
   - Fills [HOSPITAL NAME] from the shared store.
   - Chains to the next selected pillar (Pillars.wireHandoff).
   - "Open client record" has no destination yet. */
(function () {
  'use strict';
  function init() {
    var hospital = window.DFStore ? DFStore.get('hospital') : '';
    if (hospital) Array.prototype.forEach.call(document.querySelectorAll('[data-hospital]'), function (el) { el.textContent = hospital; });
    if (window.Pillars) Pillars.wireHandoff('hospital-bills');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
