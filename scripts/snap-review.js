/* SNAP — review and submit (step 3 of 3). Editable selects two-way bound to
   SNAPStore. Submit → handoff (by need), or the not-a-fit page if text and
   online help doesn't work. */
(function () {
  'use strict';
  function init() {
    var store = window.SNAPStore, ids = ['need', 'fit'];
    ids.forEach(function (id) {
      var el = document.getElementById(id); if (!el) return;
      el.value = store.get(id);
      el.addEventListener('change', function () { store.set(id, el.value); });
    });
    var back = document.getElementById('backBtn');
    if (back) back.addEventListener('click', function () { if (history.length > 1) history.back(); else window.location.href = 'snap-fit.html'; });
    var cont = document.getElementById('continueBtn');
    if (cont) cont.addEventListener('click', function () {
      if (cont.getAttribute('aria-disabled') === 'true') return;   /* a card is being edited */
      var missing = ids.filter(function (id) { var el = document.getElementById(id); return el && !el.value; });
      ids.forEach(function (id) { A11y.clearGroupError(document.getElementById(id)); });
      if (missing.length) { missing.forEach(function (id) { A11y.groupError(document.getElementById(id), 'Selection required'); }); document.getElementById(missing[0]).focus(); return; }
      window.location.href = store.get('fit') === 'no' ? 'snap-notfit.html' : 'snap-next.html';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
