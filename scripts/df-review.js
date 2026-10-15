/* =========================================================================
   Dollar For intake — "Review and submit".
   - Top card ("Your information") is read-only, populated from the initial
     intake (sessionStorage 'nyc.contact'); missing values show "<Selection>".
   - Bottom card ("Medical debt relief") is editable in place. Each control is
     seeded from the shared Dollar For store and writes straight back to it on
     change, so an edit here is reflected in the matching flow step.
   ========================================================================= */
(function () {
  'use strict';

  var store = window.DFStore;
  var PLACEHOLDER = '<Selection>';

  // ---- Top card: read-only, from the initial intake ------------------------
  function fillInfo() {
    var contact = {};
    try { contact = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    var name = [contact.firstName, contact.lastName].filter(Boolean).join(' ').trim();
    var values = { name: name, email: contact.email, phone: contact.phone, zip: contact.zip };
    Object.keys(values).forEach(function (k) {
      var el = document.querySelector('[data-info="' + k + '"]');
      if (el) el.textContent = values[k] ? values[k] : PLACEHOLDER;
    });
  }

  // ---- Bottom card: editable, two-way bound to the Dollar For store --------
  function bindFields() {
    if (!store) return;
    var ids = ['household', 'income', 'insurance', 'state', 'city', 'hospital', 'billMonth', 'billYear', 'amount'];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.value = store.get(id);                         // seed from stored answers
      var evt = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, function () { store.set(id, el.value); });   // write back
    });
  }

  var CITIES_BY_STATE = {
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Yonkers'],
    'New Jersey': ['Newark', 'Jersey City', 'Trenton'],
    'Connecticut': ['Hartford', 'New Haven', 'Bridgeport'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown']
  };
  function populateCities(state, desired) {
    var sel = document.getElementById('city'); if (!sel) return;
    var list = (state && CITIES_BY_STATE[state]) ? CITIES_BY_STATE[state] : [];
    sel.innerHTML = '<option value="" disabled selected>\u2014</option>' + list.map(function (c) { return '<option>' + c + '</option>'; }).join('');
    if (desired && list.indexOf(desired) !== -1) sel.value = desired;
  }
  function init() {
    var st = document.getElementById('state');
    if (st) {
      populateCities(DFStore.get('state'), DFStore.get('city'));
      st.addEventListener('change', function () {
        DFStore.set('city', ''); populateCities(st.value, '');
        A11y.groupError(document.getElementById('city'), 'Needs an answer');   // option A: explain the cleared field now
      });
    }
    fillInfo();
    bindFields();

    var edit = document.getElementById('editDebt');
    if (edit) {
      edit.addEventListener('click', function () {
        var first = document.getElementById('household');
        if (first) first.focus();
      });
    }

    var back = document.getElementById('backBtn');
    if (back) {
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else window.location.href = 'df-self.html';
      });
    }

    var cont = document.getElementById('continueBtn');
    if (cont) {
      cont.addEventListener('click', function () {
        window.location.href = 'df-next.html';      /* Submit → handoff */
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
