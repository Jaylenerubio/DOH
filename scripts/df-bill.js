/* =========================================================================
   Dollar For intake — "Tell us about the bill".
   - Helper text is always shown in full.
   - Back returns to the previous step; "Save and continue" is a placeholder
     until the next step is built.
   ========================================================================= */
(function () {
  'use strict';

  // Flag a program's real flow as started, so the dashboard shows it as an
  // in-progress card (persists across visits, newest first).
  function markStarted(key) {
    var started = [];
    try { started = JSON.parse(sessionStorage.getItem('nyc.started') || '[]'); } catch (e) {}
    if (started.indexOf(key) === -1) {
      started.unshift(key);
      try { sessionStorage.setItem('nyc.started', JSON.stringify(started)); } catch (e) {}
    }
    // Record recency so the dashboard leads with the most recently touched card.
    var act = [];
    try { act = JSON.parse(sessionStorage.getItem('nyc.activity') || '[]'); } catch (e) {}
    act = act.filter(function (k) { return k !== key; });
    act.unshift(key);
    try { sessionStorage.setItem('nyc.activity', JSON.stringify(act)); } catch (e) {}
  }


  // Cities available per state. The user picks the state first, which narrows
  // the city list; skipping the state shows every city we support.
  var CITIES_BY_STATE = {
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Yonkers'],
    'New Jersey': ['Newark', 'Jersey City', 'Trenton'],
    'Connecticut': ['Hartford', 'New Haven', 'Bridgeport'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown']
  };
  function allCities() {
    var seen = {}, out = [];
    Object.keys(CITIES_BY_STATE).forEach(function (st) {
      CITIES_BY_STATE[st].forEach(function (c) { if (!seen[c]) { seen[c] = 1; out.push(c); } });
    });
    return out;
  }
  // Rebuild the city <select> for the given state (all cities if none), keeping
  // `desired` selected when it's still offered.
  function populateCities(state, desired) {
    var citySel = document.getElementById('city');
    if (!citySel) return;
    var list = (state && CITIES_BY_STATE[state]) ? CITIES_BY_STATE[state] : allCities();
    citySel.innerHTML = '<option value="" disabled selected>Select city</option>';
    list.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c; o.textContent = c;
      citySel.appendChild(o);
    });
    citySel.value = (desired && list.indexOf(desired) !== -1) ? desired : '';
  }

  // Persist every field to the shared store, and restore it on load /
  // bfcache so edits made on the Review screen show here too.
  function initFields() {
    if (!window.DFStore) return;
    var map = {
      state: 'state', city: 'city', hospital: 'hospital',
      billMonth: 'billMonth', billYear: 'billYear', amount: 'amount'
    };
    var stateSel = document.getElementById('state');
    var citySel = document.getElementById('city');

    function restore() {
      Object.keys(map).forEach(function (id) {
        if (id === 'city') return;                 // city is set after its list is built
        var elm = document.getElementById(id);
        if (elm) elm.value = DFStore.get(map[id]);
      });
      // Build the city list from the restored state, then restore the city.
      populateCities(stateSel ? stateSel.value : '', DFStore.get('city'));
    }

    // Changing the state rebuilds the city list; a city no longer offered is
    // cleared from the store.
    if (stateSel && citySel) {
      stateSel.addEventListener('change', function () {
        DFStore.set('state', stateSel.value);
        populateCities(stateSel.value, DFStore.get('city'));
        DFStore.set('city', citySel.value);        // '' if the previous city isn't in this state
      });
    }

    Object.keys(map).forEach(function (id) {
      if (id === 'state') return;                  // handled above
      var elm = document.getElementById(id);
      if (!elm) return;
      var evt = elm.tagName === 'SELECT' ? 'change' : 'input';
      elm.addEventListener(evt, function () { DFStore.set(map[id], elm.value); });
    });

    restore();
    window.addEventListener('pageshow', restore);
  }

  function init() {
    initFields();

    var back = document.getElementById('backBtn');
    if (back) {
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else window.location.href = 'dollarfor.html';
      });
    }

    var cont = document.getElementById('continueBtn');
    if (cont) {
      cont.addEventListener('click', function () {
        markStarted('hospital-bills');            /* show as in-progress on the dashboard */
        var first = null;
        function need(id, msg, anchor) { var el = document.getElementById(id); if (!el) return; if (!el.value || !String(el.value).trim()) { A11y.groupError(el, msg, anchor); if (!first) first = el; } else A11y.clearGroupError(el, anchor); }
        need('state', 'Selection required'); need('city', 'Selection required'); need('hospital', 'Selection required');
        var pair = document.querySelector('.df-daterow');
        var m = document.getElementById('billMonth'), yr = document.getElementById('billYear');
        if (!m.value || !yr.value) { A11y.groupError(pair, 'Selection required'); if (!first) first = m.value ? yr : m; } else A11y.clearGroupError(pair);
        need('amount', 'Required', document.getElementById('amount').closest('.df-money') || null);
        if (first) { first.focus(); return; }
        window.location.href = 'df-self.html';    /* → Tell us about yourself */
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
