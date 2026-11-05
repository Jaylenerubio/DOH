/* SNAP — question 2 of 2 (does text and online help work). "No" goes straight to the not-a-fit page. Required single-select; answer persists to SNAPStore. */
(function () {
  'use strict';
  function init() {
    var g = document.querySelector('.qgroup'), cont = document.getElementById('continueBtn'), back = document.getElementById('backBtn'), store = window.SNAPStore;
    if (!g || !cont) return;
    var field = g.getAttribute('data-field'), list = g.querySelector('.qgroup__list');
    var cards = Array.prototype.slice.call(g.querySelectorAll('.choice-card'));
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        cards.forEach(function (x) { x.setAttribute('aria-checked', x === c ? 'true' : 'false'); });
        store.set(field, c.getAttribute('data-value'));
        A11y.clearGroupError(list);
      });
    });
    function restore() { var v = store.get(field); cards.forEach(function (c) { c.setAttribute('aria-checked', v && c.getAttribute('data-value') === v ? 'true' : 'false'); }); }
    restore(); window.addEventListener('pageshow', restore);
    cont.addEventListener('click', function () {
      if (!store.get(field)) { A11y.groupError(list, 'Selection required'); cards[0].focus(); return; }
      A11y.clearGroupError(list);
      window.location.href = store.get('fit') === 'no' ? 'snap-notfit.html' : 'snap-review.html';
    });
    if (back) back.addEventListener('click', function () { if (history.length > 1) history.back(); else window.location.href = 'snap.html'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
