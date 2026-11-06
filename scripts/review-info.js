/* Self-service — "Check your information" (step 3 of 4). The last chance to
   edit personal details: after the phone number is verified the record is
   created and the profile is read-only. Fields two-way bound to
   sessionStorage 'nyc.contact'. Continue → verify.html. */
(function () {
  'use strict';
  var FIELDS = ['firstName', 'lastName', 'dob', 'zip', 'phone', 'email'];
  var LABELS = { firstName: 'First name', lastName: 'Last name', dob: 'Date of birth', zip: 'ZIP code', phone: 'Phone number', email: 'Email' };
  function contact() { try { return JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) { return {}; } }
  function init() {
    var c = contact();
    FIELDS.forEach(function (id) {
      var el = document.getElementById(id); if (!el) return;
      el.value = c[id] || '';
      el.addEventListener('input', function () { var d = contact(); d[id] = el.value; try { sessionStorage.setItem('nyc.contact', JSON.stringify(d)); } catch (e) {} });
    });
    var lang = document.getElementById('lang');   /* preferred language, set on step 1; editable here */
    if (lang) {
      try { lang.value = sessionStorage.getItem('nyc.language') || 'en'; } catch (e) {}
      if (!lang.value) lang.value = 'en';
      lang.addEventListener('change', function () { try { sessionStorage.setItem('nyc.language', lang.value); } catch (e) {} });
    }
    var back = document.getElementById('backBtn');
    if (back) back.addEventListener('click', function () { if (history.length > 1) history.back(); else window.location.href = 'contact.html'; });
    var cont = document.getElementById('continueBtn'), errorEl = document.getElementById('stepError');
    if (cont) cont.addEventListener('click', function () {
      if (cont.getAttribute('aria-disabled') === 'true') return;   /* a card is still being edited */
      var missing = FIELDS.filter(function (id) { var el = document.getElementById(id); return id !== 'email' && el && !el.value.trim(); });   /* email is optional */
      FIELDS.forEach(function (id) { var el = document.getElementById(id); if (el) A11y.clearGroupError(el); });
      if (missing.length) {
        missing.forEach(function (id) { A11y.groupError(document.getElementById(id), LABELS[id] + ' required'); });
        document.getElementById(missing[0]).focus(); return;
      }
      A11y.clearStepError(errorEl);
      window.location.href = 'verify.html';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
