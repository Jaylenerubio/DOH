/* Health insurance — review and submit (step 2 of 3). Editable selects are
   two-way bound to HIStore; Continue → consent. */
(function () {
  'use strict';
  function init() {
    var store = window.EITCStore;
    ['filed', 'income', 'children'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.value = store.get(id);
      el.addEventListener('change', function () { store.set(id, el.value); });
    });
    var edit = document.getElementById('editHi');

    var back = document.getElementById('backBtn');
    if (back) back.addEventListener('click', function () {
      if (history.length > 1) history.back(); else window.location.href = 'eitc.html';
    });
    var cont = document.getElementById('continueBtn');
    if (cont) cont.addEventListener('click', function () {
      var missing = ['filed', 'income', 'children'].filter(function (id) { var el = document.getElementById(id); return el && !el.value; });
      ['filed', 'income', 'children'].forEach(function (id) { A11y.clearGroupError(document.getElementById(id)); });
      if (missing.length) {
        missing.forEach(function (id) { var el = document.getElementById(id); A11y.groupError(el, 'Selection required'); });
        document.getElementById(missing[0]).focus(); return;
      }
      window.location.href = store.eligible() ? 'eitc-eligible.html' : 'eitc-ineligible.html';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
