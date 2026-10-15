/* Financial resources — "What's next" (terminal). Shows the EAP steps for the
   program-enrolled path or the EEAP steps for the income path, then chains
   to the next selected pillar. */
(function () {
  'use strict';
  function init() {
    var store = window.EAPStore;
    var eeap = store && store.get('path') === 'eeap';
    var title = document.getElementById('nextTitle');
    if (title && eeap) title.textContent = "You're eligible for the Enhanced Energy Affordability Program (EEAP).";
    var a = document.getElementById('stepsEap'), b = document.getElementById('stepsEeap');
    if (a) a.hidden = eeap; if (b) b.hidden = !eeap;
    if (window.Pillars) Pillars.wireHandoff('financial-help');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
