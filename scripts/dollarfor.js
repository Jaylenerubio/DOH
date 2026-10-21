/* =========================================================================
   Dollar For intake — step 1 ("Do you have an unaffordable hospital bill?").
   Single-select Yes/No (radiogroup). Continue enables once a choice is made.
   Back returns to the dashboard. The next step is not built yet, so Continue
   is a no-op placeholder for now.
   ========================================================================= */
(function () {
  'use strict';

  function init() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.choice-card'));
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var errorEl = document.getElementById('stepError');
    if (!cards.length || !cont) return;

    var store = window.DFStore;
    // Any answer clears the error; "No" routes to the medical-bill handoff on Continue.
    function apply(value, animate) {
      A11y.clearStepError(errorEl); A11y.clearGroupError(document.querySelector('.choice-list'));   // Continue is always enabled
    }

    function select(card) {
      cards.forEach(function (c) { c.setAttribute('aria-checked', c === card ? 'true' : 'false'); });
      var value = card.getAttribute('data-value');
      if (store) store.set('hospitalBill', value);
      apply(value, true);
    }
    function restore() {
      var v = store ? store.get('hospitalBill') : '';
      if (!v) return;
      cards.forEach(function (c) {
        c.setAttribute('aria-checked', c.getAttribute('data-value') === v ? 'true' : 'false');
      });
      apply(v, false);   // no entry animation on reload/back
    }

    cards.forEach(function (c) {
      c.addEventListener('click', function () { select(c); });
    });
    restore();
    window.addEventListener('pageshow', restore);

    cont.addEventListener('click', function () {
      var v = store ? store.get('hospitalBill') : '';
      if (!v) { A11y.stepError(errorEl, 'Select an answer to continue', cards[0]); return; }
      A11y.clearStepError(errorEl); A11y.clearGroupError(document.querySelector('.choice-list'));
      if (v === 'no') { window.location.href = 'df-ineligible.html'; return; }   /* → Need to resolve a medical bill? */
      try { sessionStorage.removeItem('nyc.outcome.hospital-bills'); } catch (e) {}   /* a Yes clears an earlier Not eligible */
      window.location.href = 'df-bill.html';   /* → Tell us about the bill */
    });

    if (back) {
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else window.location.href = 'dashboard.html';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
