/* =========================================================================
   TSU intake — "Call 311 for housing support" (referral).
   Copy buttons put the number on the clipboard (with a brief check-mark);
   "Return to dashboard" goes home.
   ========================================================================= */
(function () {
  'use strict';

  function init() {
    // Terminal referral: drop anti-eviction from the dashboard's program cards
    // and queue the explanatory toast (shared with any future dead-end).
    if (window.closeIneligibleProgram) window.closeIneligibleProgram('anti-eviction', 'Anti-eviction services');

    Array.prototype.forEach.call(document.querySelectorAll('.copy-field'), function (field) {
      var text = field.querySelector('.copy-field__text');
      var btn = field.querySelector('.copy-field__btn');
      if (!text || !btn) return;
      var value = text.getAttribute('data-copy') || text.textContent;
      var resetTimer = null;
      btn.addEventListener('click', function () {
        function done() {
          // Label swaps to "copied" (green) for a moment, then back to "copy".
          // Keep aria-label in step so the accessible name always contains the
          // visible text (label-in-name), and announce via a live region.
          btn.textContent = 'Copied';
          btn.classList.add('is-copied');
          btn.setAttribute('aria-label', 'Copied');
          if (window.A11y) A11y.announce(value + ' copied');
          window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('is-copied');
            btn.setAttribute('aria-label', 'Copy ' + value);
          }, 1400);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done, done);
        } else {
          done();
        }
      });
    });

    if (window.Pillars) Pillars.wireHandoff('anti-eviction');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
