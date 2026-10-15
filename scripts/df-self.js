/* =========================================================================
   Dollar For intake — "Tell us about yourself or the patient".
   - Household-size stepper (− / value / +, clamped at 0).
   - Yes / No / Not sure single-select (radiogroup).
   - Helper text is always shown in full.
   - Back returns to the previous step; "Save and continue" is a placeholder
     until the next step is built.
   ========================================================================= */
(function () {
  'use strict';

  var store = window.DFStore;

  function initStepper() {
    var value = document.getElementById('householdValue');
    var btns = Array.prototype.slice.call(document.querySelectorAll('.df-stepper__btn'));
    if (!value || !btns.length) return;
    var n = store ? (parseInt(store.get('household'), 10) || 0) : 0;
    function sync() {
      value.textContent = String(n);
      btns.forEach(function (b) {
        if (parseInt(b.getAttribute('data-step'), 10) < 0) b.disabled = n <= 0;
      });
      if (store) store.set('household', n ? String(n) : '');
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        n = Math.max(0, n + parseInt(b.getAttribute('data-step'), 10));
        sync();
      });
    });
    sync();
  }

  function initChoices() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.choice-row .choice-card'));
    var saved = store ? store.get('insurance') : '';
    cards.forEach(function (c) {
      if (saved && c.getAttribute('data-value') === saved) c.setAttribute('aria-checked', 'true');
      c.addEventListener('click', function () {
        cards.forEach(function (o) { o.setAttribute('aria-checked', o === c ? 'true' : 'false'); });
        if (store) store.set('insurance', c.getAttribute('data-value'));
      });
    });
  }

  // Income input persists to the shared store.
  function initFields() {
    if (!store) return;
    [['income', 'input']].forEach(function (pair) {
      var elm = document.getElementById(pair[0]);
      if (!elm) return;
      elm.value = store.get(pair[0]);
      elm.addEventListener(pair[1], function () { store.set(pair[0], elm.value); });
    });
  }


  function init() {
    initStepper();
    initChoices();
    initFields();

    var back = document.getElementById('backBtn');
    if (back) {
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else window.location.href = 'df-bill.html';
      });
    }
    var cont = document.getElementById('continueBtn');
    if (cont) {
      cont.addEventListener('click', function () {
        var first = null;
        var stepper = document.querySelector('.df-stepper');
        var hhNow = parseInt((document.getElementById('householdValue') || {}).textContent || '0', 10) || 0;
        if (hhNow < 1) { A11y.groupError(stepper, 'Required'); first = first || document.querySelector('.df-stepper__btn'); } else A11y.clearGroupError(stepper);
        var inc = document.getElementById('income');
        var incAnchor = inc.closest('.df-money') || null;
        if (!inc.value.trim()) { A11y.groupError(inc, 'Required', incAnchor); first = first || inc; } else A11y.clearGroupError(inc, incAnchor);
        var insList = document.querySelector('#insuranceLabel') ? document.querySelector('#insuranceLabel').parentElement.querySelector('.choice-row, [role="radiogroup"]') : null;
        var insChecked = insList && insList.querySelector('[aria-checked="true"], input:checked');
        if (insList && !insChecked) { A11y.groupError(insList, 'Selection required'); first = first || insList.querySelector('button, input'); } else if (insList) A11y.clearGroupError(insList);
        if (first) { first.focus(); return; }
        window.location.href = 'df-review.html';   /* → Review and submit */
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
