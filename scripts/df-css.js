/* Hospital bills — CSS health counselor handoff (terminal step).
   Shown instead of Dollar For when the preferred language is Urdu, Arabic,
   French or Polish (Pillars.CSS_LANGS). Chains to the next selected pillar. */
(function () {
  'use strict';
  function init() { if (window.Pillars) Pillars.wireHandoff('hospital-bills'); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
