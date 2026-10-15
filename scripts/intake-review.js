/* Intake — review (step 4 of 4). Editable fields two-way bound to
   sessionStorage 'nyc.contact' + 'nyc.contactMethod'. Continue → creating. */
(function () {
  'use strict';
  var FIELDS = ['firstName', 'lastName', 'dob', 'zip', 'phone', 'email'];
  var OPTIONAL = ['apt'];
  function contact() { try { return JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) { return {}; } }
  function init() {
    var c = contact();
    FIELDS.forEach(function (id) {
      var el = document.getElementById(id); if (!el) return;
      el.value = c[id] || '';
      el.addEventListener('input', function () { var d = contact(); d[id] = el.value; try { sessionStorage.setItem('nyc.contact', JSON.stringify(d)); } catch (e) {} });
    });
    var m = document.getElementById('method');
    if (m) {
      try { m.value = sessionStorage.getItem('nyc.contactMethod') || ''; } catch (e) {}
      m.addEventListener('change', function () { try { sessionStorage.setItem('nyc.contactMethod', m.value); } catch (e) {} });
    }
    var ei = document.getElementById('editInfo'), em = document.getElementById('editMethod');

    var back = document.getElementById('backBtn');
    if (back) back.addEventListener('click', function () { if (history.length > 1) history.back(); else window.location.href = 'contact-method.html'; });
    var cont = document.getElementById('continueBtn'), errorEl = document.getElementById('stepError');
    if (cont) cont.addEventListener('click', function () {
      var missing = FIELDS.filter(function (id) { var el = document.getElementById(id); return el && OPTIONAL.indexOf(id) === -1 && !el.value.trim(); });
      FIELDS.forEach(function (id) { var el = document.getElementById(id); if (el) A11y.clearGroupError(el); });
      if (m) A11y.clearGroupError(m);
      if (missing.length) {
        var LABELS = { firstName: 'First name', lastName: 'Last name', dob: 'Date of birth', zip: 'Zip code', phone: 'Phone number', email: 'Email' };
        missing.forEach(function (id) { var el = document.getElementById(id); A11y.groupError(el, (LABELS[id] || 'Field') + ' required'); });
        document.getElementById(missing[0]).focus(); return;
      }
      if (m && !m.value) { A11y.groupError(m, 'Selection required'); m.focus(); return; }
      A11y.clearStepError(errorEl);
      window.location.href = (sessionStorage.getItem('nyc.channel') === 'self') ? 'dashboard.html' : 'creating.html';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
