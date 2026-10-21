/* =========================================================================
   TSU intake — "Facing eviction?" triage.
   Multi-select checklist. "None of the above" is exclusive (it clears the
   others, and picking any other clears it). Continue enables once at least
   one option is selected; selections persist to the shared TSU store and
   restore on load (so edits made on the Review screen show here too).
   "None of the above" → 311 referral; any real option → Review & submit.
   ========================================================================= */
(function () {
  'use strict';

  var store = window.TSUStore;
  function idOf(box) { return box.id.replace(/^opt-/, ''); }

  function init() {
    var boxes = Array.prototype.slice.call(document.querySelectorAll('.tsu-options .checkbox__input'));
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var errorEl = document.getElementById('stepError');
    if (!boxes.length || !cont) return;

    var exclusive = document.querySelector('.tsu-options [data-exclusive]');

    // Continue is always enabled; a selection clears any shown error.
    function sync() {
      if (boxes.some(function (b) { return b.checked; })) A11y.clearStepError(errorEl);
    }
    function save() {
      if (store) store.set(boxes.filter(function (b) { return b.checked; }).map(idOf));
    }
    function restore() {
      if (!store) return;
      var ids = store.get();
      boxes.forEach(function (b) { b.checked = ids.indexOf(idOf(b)) !== -1; });
      sync();
    }

    boxes.forEach(function (b) {
      b.addEventListener('change', function () {
        if (b.checked) {
          if (b === exclusive) {
            boxes.forEach(function (o) { if (o !== exclusive) o.checked = false; });   // "None" clears the rest
          } else if (exclusive) {
            exclusive.checked = false;   // any real option clears "None"
          }
        }
        save();
        sync();
      });
    });

    restore();
    window.addEventListener('pageshow', restore);

    if (back) {
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else window.location.href = 'dashboard.html';
      });
    }
    cont.addEventListener('click', function () {
      if (!boxes.some(function (b) { return b.checked; })) {
        A11y.stepError(errorEl, 'Selection required');
        return;
      }
      A11y.clearStepError(errorEl);
      window.location.href = (exclusive && exclusive.checked) ? 'tsu-311.html' : 'tsu-review.html';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
