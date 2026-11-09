/* Health insurance — screener (step 1 of 3). Three required single-select
   groups; answers persist to HIStore; Continue → review. */
(function () {
  'use strict';
  function init() {
    var groups = Array.prototype.slice.call(document.querySelectorAll('.qgroup'));
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var errorEl = document.getElementById('stepError');
    var store = window.EITCStore;
    if (!groups.length || !cont) return;

    groups.forEach(function (g) {
      var field = g.getAttribute('data-field');
      var cards = Array.prototype.slice.call(g.querySelectorAll('.choice-card'));
      cards.forEach(function (c) {
        c.addEventListener('click', function () {
          cards.forEach(function (x) { x.setAttribute('aria-checked', x === c ? 'true' : 'false'); });
          store.set(field, c.getAttribute('data-value'));
          if (field === 'filed') sync();
          A11y.clearGroupError(g.querySelector('.qgroup__chips, .qgroup__row, .qgroup__list'));
        });
      });
    });

    /* "Yes, I filed every year" skips the income and children questions. */
    function sync() {
      var skip = store.get('filed') === 'every';
      groups.forEach(function (g) {
        var f = g.getAttribute('data-field');
        if (f === 'income' || f === 'children') g.hidden = skip;
      });
    }
    function restore() {
      groups.forEach(function (g) {
        var v = store.get(g.getAttribute('data-field'));
        Array.prototype.forEach.call(g.querySelectorAll('.choice-card'), function (c) {
          c.setAttribute('aria-checked', v && c.getAttribute('data-value') === v ? 'true' : 'false');
        });
      });
    }
    restore(); sync();
    window.addEventListener('pageshow', function () { restore(); sync(); });

    cont.addEventListener('click', function () {
      var first = null;
      groups.forEach(function (g) {
        if (g.hidden) return;
        var list = g.querySelector('.qgroup__chips, .qgroup__row, .qgroup__list');
        if (!store.get(g.getAttribute('data-field'))) { A11y.groupError(list, 'Selection required'); if (!first) first = list.querySelector('.choice-card'); }
        else A11y.clearGroupError(list);
      });
      if (first) { first.focus(); return; }
      window.location.href = store.get('filed') === 'every' ? 'eitc-claimed.html' : 'eitc-review.html';
    });
    if (back) back.addEventListener('click', function () {
      if (history.length > 1) history.back(); else window.location.href = (sessionStorage.getItem('nyc.channel') === 'self') ? 'dashboard.html' : 'dashboard.html';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
