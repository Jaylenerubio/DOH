/* Financial resources — review (step 2 of 3). Every answer is editable in
   place and two-way bound to EAPStore; rows follow the same branching as the
   screener (EAP: programs; EEAP: household + income). Continue → consent. */
(function () {
  'use strict';
  var THRESHOLD = { 1: 113400, 2: 129600, 3: 145800, 4: 162000, 5: 175000, 6: 188000, 7: 200900, 8: 213900 };
  function money(n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function init() {
    var store = window.EAPStore;
    var errorEl = document.getElementById('stepError');
    if (!store) return;
    var rows = {
      assistance: document.getElementById('rvRowAssistance'),
      programs:   document.getElementById('rvRowPrograms'),
      household:  document.getElementById('rvRowHousehold'),
      income:     document.getElementById('rvRowIncome')
    };
    function arr(k) { var v = store.get(k); return Array.isArray(v) ? v : []; }

    // Utility: the multi-select answer collapses into one select option
    // (values joined with a comma, in ORDER) and expands back on change.
    var selUtil = document.getElementById('rvUtility');
    var UTIL_ORDER = ['coned', 'national-grid', 'neither'];
    function utilKey() { var u = arr('utility'); return UTIL_ORDER.filter(function (k) { return u.indexOf(k) !== -1; }).join(','); }
    selUtil.addEventListener('change', function () {
      var u = selUtil.value ? selUtil.value.split(',') : [];
      store.set('utility', u);
      if (u.indexOf('neither') !== -1) { store.set('assistance', ''); store.set('programs', []); }
      render(true);
    });

    // Assistance / income selects, household number
    var selAssist = document.getElementById('rvAssistance');
    var selIncome = document.getElementById('rvIncome');
    var inHH = document.getElementById('rvHousehold');
    selAssist.addEventListener('change', function () { store.set('assistance', selAssist.value); if (selAssist.value === 'no') store.set('programs', []); render(true); });
    selIncome.addEventListener('change', function () { store.set('income', selIncome.value); });
    inHH.addEventListener('input', function () {
      var n = Math.min(8, Math.max(0, parseInt(inHH.value, 10) || 0));
      store.set('household', n ? String(n) : ''); store.set('income', ''); render(true);
    });

    // Programs (checkbox list)
    var progList = document.getElementById('programList');
    var progBoxes = Array.prototype.slice.call(progList.querySelectorAll('.checkbox__input'));
    function renderProgs() { var p = arr('programs'); progBoxes.forEach(function (b) { b.checked = p.indexOf(b.getAttribute('data-value')) !== -1; }); }
    progBoxes.forEach(function (b) {
      b.addEventListener('change', function () {
        store.set('programs', progBoxes.filter(function (x) { return x.checked; }).map(function (x) { return x.getAttribute('data-value'); }));
        render(true);
      });
    });

    // Option A: when an edit reveals a row that now needs an answer, say so
    // immediately (not just on Submit) so the rearrangement is explained.
    function needsAnswer(control, anchor) { A11y.groupError(control, 'Needs an answer', anchor); }

    function render(userEdit) {
      renderProgs();
      var u = arr('utility'), neither = u.indexOf('neither') !== -1, hasUtil = u.length > 0 && !neither;
      selUtil.value = utilKey();
      var a = store.get('assistance');
      var p = arr('programs');
      var onlyOther = p.length > 0 && p.every(function (k) { return k === 'other'; });
      var incomeRoute = neither || (hasUtil && a === 'no') || (hasUtil && a === 'yes' && onlyOther);
      rows.assistance.hidden = !hasUtil;
      rows.programs.hidden = !(hasUtil && a === 'yes');
      var hh = Math.min(8, Math.max(0, parseInt(store.get('household') || '0', 10) || 0));
      rows.household.hidden = !incomeRoute;
      rows.income.hidden = !(incomeRoute && hh >= 1);     // appears once household ≥ 1
      store.set('path', incomeRoute ? 'eeap' : (hasUtil && a === 'yes' && p.length ? 'eap' : ''));
      selAssist.value = a || '';
      if (document.activeElement !== inHH) inHH.value = incomeRoute && hh ? hh : '';
      document.getElementById('rvIncomeLabel').textContent = 'Do you make less than ' + money(THRESHOLD[hh] || THRESHOLD[1]) + ' per year?';
      selIncome.value = store.get('income') || '';
      if (userEdit) {
        if (!rows.assistance.hidden && !a) needsAnswer(selAssist);
        if (!rows.programs.hidden && !p.length) needsAnswer(progList);
        if (!rows.household.hidden && !hh) needsAnswer(inHH);
        if (!rows.income.hidden && !store.get('income')) needsAnswer(selIncome);
      }
    }
    renderProgs(); render();

    var edit = document.getElementById('editEap');

    var back = document.getElementById('backBtn');
    if (back) back.addEventListener('click', function () { if (history.length > 1) history.back(); else window.location.href = 'eap.html'; });
    var cont = document.getElementById('continueBtn');
    if (cont) cont.addEventListener('click', function () {
      [selUtil, progList, inHH, selIncome, selAssist].forEach(function (el) { if (el) A11y.clearGroupError(el); });
      if (!arr('utility').length) { A11y.groupError(selUtil, 'Selection required'); selUtil.focus(); return; }
      var path = store.get('path');
      if (!path && store.get('assistance') === 'yes') { A11y.groupError(progList, 'Selection required'); progBoxes[0].focus(); return; }
      if (path === 'eeap' && !store.get('household')) { A11y.groupError(inHH, 'Required'); inHH.focus(); return; }
      if (path === 'eeap' && !store.get('income')) { A11y.groupError(selIncome, 'Selection required'); selIncome.focus(); return; }
      if (!path) { A11y.groupError(selAssist, 'Selection required'); selAssist.focus(); return; }
      A11y.clearStepError(errorEl);
      // Over the income limit → not eligible (no consent step).
      window.location.href = (path === 'eeap' && store.get('income') === 'no') ? 'eap-ineligible.html' : 'eeap-next.html';   /* Submit → handoff */
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
