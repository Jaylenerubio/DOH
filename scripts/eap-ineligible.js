/* Financial resources — not eligible (terminal). Reached from the review
   when the client answers "No" to the income threshold. Marks the pillar
   screened and chains to the next selected pillar. */
(function () {
  'use strict';
  function init() {
    if (window.Pillars) { Pillars.markOutcome('financial-help', 'ineligible'); Pillars.wireHandoff('financial-help'); }
    var copy = document.getElementById('copyBtn');
    if (copy) copy.addEventListener('click', function () {
      var t = document.querySelector('.copy-field__text');
      var v = t ? (t.getAttribute('data-copy') || t.textContent) : '';
      if (navigator.clipboard && v) navigator.clipboard.writeText(v).catch(function () {});
      copy.textContent = 'Copied'; A11y.announce('Copied');
      window.setTimeout(function () { copy.textContent = 'Copy'; }, 1500);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
