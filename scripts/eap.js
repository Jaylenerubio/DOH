/* Financial resources — EAP screener (step 1 of 3).
   Branching:
     Con Edison and/or National Grid (multi; "Neither" exclusive) → "Enrolled in government assistance?"
       Yes → multi-select program combobox   → path 'eap'
             ("Other / not listed" on its own → household + income → 'eeap')
       No  → household size → income question → path 'eeap'
     Neither → household size → income question → path 'eeap'
   Household starts at 0 (unanswered); the income question appears once it is
   1–8 and its threshold = ConEd & National Grid NYC column for that size. */
(function () {
  'use strict';
  var THRESHOLD = { 1: 113400, 2: 129600, 3: 145800, 4: 162000, 5: 175000, 6: 188000, 7: 200900, 8: 213900 };
  function money(n) { return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function init() {
    var store = window.EAPStore;
    var errorEl = document.getElementById('stepError');
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var qAssist = document.getElementById('qAssistance');
    var qProg = document.getElementById('qPrograms');
    var qHH = document.getElementById('qHousehold');
    var qInc = document.getElementById('qIncome');
    var hhVal = document.getElementById('hhVal');
    var thresholdEl = document.getElementById('incomeThreshold');
    if (!store || !cont) return;

    function cardsIn(id) { return Array.prototype.slice.call(document.querySelectorAll('#' + id + ' .choice-card')); }
    function checked(list) { return list.filter(function (c) { return c.getAttribute('aria-checked') === 'true'; }).map(function (c) { return c.getAttribute('data-value'); }); }
    function setChecked(list, values) { list.forEach(function (c) { c.setAttribute('aria-checked', values.indexOf(c.getAttribute('data-value')) !== -1 ? 'true' : 'false'); }); }

    // ---- Q1 utility (single-select; "Both" stores both utilities) ------------
    var utilCards = cardsIn('qUtility');
    function utilToChip(arr) { var a = arr || []; if (a.indexOf('coned') !== -1 && a.indexOf('national-grid') !== -1) return 'both'; return a[0] || ''; }
    function chipToUtil(v) { return v === 'both' ? ['coned', 'national-grid'] : (v ? [v] : []); }
    utilCards.forEach(function (c) {
      c.addEventListener('click', function () {
        var v = c.getAttribute('data-value');
        setChecked(utilCards, [v]);
        store.set('utility', chipToUtil(v));
        if (v === 'neither') { store.set('assistance', ''); store.set('programs', []); }
        A11y.clearStepError(errorEl);
        render();
      });
    });

    // ---- Q2 assistance (single) --------------------------------------------
    var assistCards = cardsIn('qAssistance');
    assistCards.forEach(function (c) {
      c.addEventListener('click', function () {
        setChecked(assistCards, [c.getAttribute('data-value')]);
        store.set('assistance', c.getAttribute('data-value'));
        if (c.getAttribute('data-value') === 'no') store.set('programs', []);
        A11y.clearStepError(errorEl);
        render();
      });
    });

    // ---- Q2b programs (checkbox list) ---------------------------------------
    var progList = document.getElementById('programList');
    var progBoxes = progList ? Array.prototype.slice.call(progList.querySelectorAll('.checkbox__input')) : [];
    function progs() { var p = store.get('programs'); return Array.isArray(p) ? p : []; }
    function renderProgs() { var p = progs(); progBoxes.forEach(function (b) { b.checked = p.indexOf(b.getAttribute('data-value')) !== -1; }); }
    progBoxes.forEach(function (b) {
      b.addEventListener('change', function () {
        store.set('programs', progBoxes.filter(function (x) { return x.checked; }).map(function (x) { return x.getAttribute('data-value'); }));
        render();
        A11y.clearGroupError(progList);
      });
    });

    // ---- Q3 household / Q4 income ------------------------------------------
    function hh() { return Math.min(8, Math.max(0, parseInt(store.get('household') || '0', 10) || 0)); }
    function renderHH() {
      if (hhVal) hhVal.textContent = hh();
      if (thresholdEl) thresholdEl.textContent = money(THRESHOLD[hh()] || THRESHOLD[1]);
      if (dec) dec.disabled = hh() <= 0;
      if (inc) inc.disabled = hh() >= 8;
    }
    var dec = document.getElementById('hhDec'), inc = document.getElementById('hhInc');
    function setHH(n) {
      n = Math.min(8, Math.max(0, n));
      store.set('household', n ? String(n) : '');
      store.set('income', '');                       // threshold changed → re-ask
      setChecked(incCards, []);
      renderHH(); render();
    }
    if (dec) dec.addEventListener('click', function () { setHH(hh() - 1); });
    if (inc) inc.addEventListener('click', function () { setHH(hh() + 1); });
    var incCards = cardsIn('qIncome');
    incCards.forEach(function (c) {
      c.addEventListener('click', function () {
        setChecked(incCards, [c.getAttribute('data-value')]);
        store.set('income', c.getAttribute('data-value'));
        A11y.clearStepError(errorEl);
      });
    });

    // ---- Reveal logic --------------------------------------------------------
    function render() {
      var u = store.get('utility'); u = Array.isArray(u) ? u : [];
      var neither = u.indexOf('neither') !== -1;
      var hasUtil = u.length > 0 && !neither;
      var a = store.get('assistance');
      qAssist.hidden = !hasUtil;
      qProg.hidden = !(hasUtil && a === 'yes');
      var p = progs();
      var onlyOther = p.length > 0 && p.every(function (k) { return k === 'other'; });
      var incomeRoute = neither || (hasUtil && a === 'no') || (hasUtil && a === 'yes' && onlyOther);
      qHH.hidden = !incomeRoute;
      qInc.hidden = !(incomeRoute && hh() >= 1);        // appears once household ≥ 1
      store.set('path', incomeRoute ? 'eeap' : (hasUtil && a === 'yes' && p.length ? 'eap' : ''));
      renderHH();
    }
    function restore() {
      var u = store.get('utility'); setChecked(utilCards, [utilToChip(Array.isArray(u) ? u : [])]);
      setChecked(assistCards, store.get('assistance') ? [store.get('assistance')] : []);
      setChecked(incCards, store.get('income') ? [store.get('income')] : []);
      renderProgs();
      render();
    }
    restore();
    window.addEventListener('pageshow', restore);

    // ---- Continue ------------------------------------------------------------
    cont.addEventListener('click', function () {
      var uList = document.querySelector('#qUtility .qgroup__chips'), aList = document.querySelector('#qAssistance .qgroup__row'), iList = document.querySelector('#qIncome .qgroup__row'), hStep = document.querySelector('#qHousehold .eap-stepper');
      [uList, aList, iList, hStep].forEach(function (el) { A11y.clearGroupError(el); }); A11y.clearGroupError(progList);
      if (!checked(utilCards).length) { A11y.groupError(uList, 'Selection required'); utilCards[0].focus(); return; }
      var path = store.get('path');
      if (path === 'eap') {
        if (!progs().length) { A11y.groupError(progList, 'Selection required'); progBoxes[0].focus(); return; }
      } else if (path === 'eeap') {
        if (hh() < 1) { A11y.groupError(hStep, 'Required'); inc.focus(); return; }
        if (!store.get('income')) { A11y.groupError(iList, 'Selection required'); incCards[0].focus(); return; }
      } else {
        if (store.get('assistance') === 'yes') { A11y.groupError(progList, 'Selection required'); progBoxes[0].focus(); }
        else { A11y.groupError(aList, 'Selection required'); assistCards[0].focus(); }
        return;
      }
      A11y.clearStepError(errorEl);
      window.location.href = 'eap-review.html';
    });
    if (back) back.addEventListener('click', function () {
      if (history.length > 1) history.back(); else window.location.href = 'dashboard.html';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
