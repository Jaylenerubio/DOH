/* =========================================================================
   Contact / personalization step.
   - Light input masks (DOB, zip, phone) so values match the placeholders.
   - Values persist to sessionStorage and restore on load AND on the
     back/bfcache pageshow, so returning to this step keeps entries and
     Continue's enabled state in sync (never filled-but-disabled).
   - Continue enables once every field has a value.
   ========================================================================= */
(function () {
  'use strict';

  var KEY = 'nyc.contact';
  var FIELDS = ['firstName', 'lastName', 'dob', 'zip', 'phone', 'email'];
  var OPTIONAL = ['apt'];

  // ---- masks ----------------------------------------------------------
  function maskDob(v) {
    var d = v.replace(/\D/g, '').slice(0, 8);
    if (d.length > 4) return d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
    if (d.length > 2) return d.slice(0, 2) + '/' + d.slice(2);
    return d;
  }
  function maskZip(v) { return v.replace(/\D/g, '').slice(0, 5); }
  function maskPhone(v) {
    var d = v.replace(/\D/g, '').slice(0, 10);
    if (d.length > 6) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);
    if (d.length > 3) return d.slice(0, 3) + '-' + d.slice(3);
    return d;
  }
  var MASKS = { dob: maskDob, zip: maskZip, phone: maskPhone };
  var MESSAGES = {
    firstName: 'Enter your first name',
    lastName: 'Enter your last name',
    dob: 'Enter your date of birth',
    zip: 'Enter your zip code',
    phone: 'Enter your phone number',
    email: 'Enter your email'
  };

  function init() {
    // City: searchable picker seeded with NYC mailing cities; any typed value
    // is accepted (clients may live in NJ, Westchester, etc.).
    var cityRoot = document.getElementById('cityCombo');
    if (cityRoot && window.Combobox) Combobox.create(cityRoot, { searchable: true });
    var inputs = {}, errEls = {};
    FIELDS.forEach(function (id) {
      inputs[id] = document.getElementById(id);
      errEls[id] = document.getElementById('err-' + id);
    });
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    if (!inputs.firstName || !cont) return;

    function valid(id) { return OPTIONAL.indexOf(id) !== -1 || (inputs[id] && inputs[id].value.trim() !== ''); }
    function showError(id) {
      A11y.fieldError(inputs[id], errEls[id]);
      if (id === 'city') { var trg = document.querySelector('#cityCombo .combobox__trigger'); if (trg) trg.classList.add('is-invalid'); }
    }
    function clearError(id) {
      A11y.clearFieldError(inputs[id], errEls[id]);
      if (id === 'city') { var trg = document.querySelector('#cityCombo .combobox__trigger'); if (trg) trg.classList.remove('is-invalid'); }
    }

    function save() {
      var data = {};
      FIELDS.forEach(function (id) { data[id] = inputs[id] ? inputs[id].value : ''; });
      try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    }
    function restore() {
      try {
        var data = JSON.parse(sessionStorage.getItem(KEY) || '{}');
        FIELDS.forEach(function (id) { if (inputs[id] && data[id] != null) inputs[id].value = data[id]; });
      } catch (e) {}
    }

    // Inline / real-time validation: the button is always enabled. A field is
    // flagged when it's left empty (blur) and the flag clears the instant it
    // becomes valid (input) — so errors surface and resolve field-by-field.
    FIELDS.forEach(function (id) {
      inputs[id].addEventListener('input', function () {
        if (MASKS[id]) inputs[id].value = MASKS[id](inputs[id].value);
        save();
        if (valid(id)) clearError(id);
      });
      inputs[id].addEventListener('blur', function () {
        if (!valid(id)) showError(id);
      });
    });

    restore();
    window.addEventListener('pageshow', restore);

    cont.addEventListener('click', function () {
      var firstInvalid = null;
      FIELDS.forEach(function (id) {
        if (valid(id)) { clearError(id); }
        else { showError(id); if (!firstInvalid) firstInvalid = inputs[id]; }
      });
      if (firstInvalid) { firstInvalid.focus(); return; }   // stop + focus the first gap
      /* Self-service de-duplication: phone (or email) + ZIP + DOB match an
         existing record → verify with a code instead of creating a second one.
         'nyc.returning' = 'new' means they already said "not me". */
      var self = false, decided = '';
      try { self = sessionStorage.getItem('nyc.channel') === 'self'; decided = sessionStorage.getItem('nyc.returning') || ''; } catch (e) {}
      var data = {}; FIELDS.forEach(function (id) { data[id] = inputs[id] ? inputs[id].value : ''; });
      if (self && decided !== 'new' && window.Mask && Mask.isReturning(data)) { window.location.href = 'returning.html'; return; }
      window.location.href = 'contact-method.html';
    });

    if (back) {
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else window.location.href = 'language.html';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
