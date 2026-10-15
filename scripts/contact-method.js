/* =========================================================================
   Preferred contact method step. Single-select (native radios).
   - Both sub-labels show the phone entered on the previous step
     (from sessionStorage 'nyc.contact'), falling back to placeholders.
   - The selection persists and restores on load AND on back/bfcache pageshow,
     keeping Continue's enabled state in sync.
   ========================================================================= */
(function () {
  'use strict';

  var KEY = 'nyc.contactMethod';
  var PH_PHONE = '(000)-000-000';

  function fmtPhone(v) {
    var d = (v || '').replace(/\D/g, '');
    if (d.length < 10) return null;
    return '(' + d.slice(0, 3) + ')-' + d.slice(3, 6) + '-' + d.slice(6, 10);
  }

  function init() {
    var radios = Array.prototype.slice.call(document.querySelectorAll('input[name="method"]'));
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var errorEl = document.getElementById('stepError');
    var phoneEl = document.getElementById('methodPhone');
    var callEl = document.getElementById('methodCallPhone');
    if (!radios.length || !cont) return;

    function setValue(el, value, placeholder) {
      if (value) { el.textContent = value; el.classList.remove('is-placeholder'); }
      else { el.textContent = placeholder; el.classList.add('is-placeholder'); }
    }
    function populate() {
      var c = {};
      try { c = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
      setValue(phoneEl, fmtPhone(c.phone), PH_PHONE);
      setValue(callEl, fmtPhone(c.phone), PH_PHONE);
    }

    function selected() { return radios.some(function (r) { return r.checked; }); }
    // Continue is always enabled; a choice just clears any shown error.
    function sync() { if (selected()) A11y.clearStepError(errorEl); A11y.clearGroupError(document.querySelector('.method-list') || radios[0].closest('[role="radiogroup"]')); }

    function refresh() {
      populate();
      try {
        var v = sessionStorage.getItem(KEY);
        if (v) radios.forEach(function (r) { r.checked = (r.value === v); });
      } catch (e) {}
      sync();
    }

    radios.forEach(function (r) {
      r.addEventListener('change', function () {
        try { sessionStorage.setItem(KEY, r.value); } catch (e) {}
        sync();
      });
    });

    refresh();
    window.addEventListener('pageshow', refresh);

    cont.addEventListener('click', function () {
      if (!selected()) {
        A11y.groupError(document.querySelector('.method-list') || radios[0].closest('[role="radiogroup"]'), 'Selection required'); radios[0].focus();
        return;
      }
      A11y.clearStepError(errorEl); A11y.clearGroupError(document.querySelector('.method-list') || radios[0].closest('[role="radiogroup"]'));
      var self = false; try { self = sessionStorage.getItem('nyc.channel') === 'self'; } catch (e) {}
      if (self) {
        /* Self-service: this submit creates the record (no review step). */
        try { if (!sessionStorage.getItem('nyc.recordId')) sessionStorage.setItem('nyc.recordId', 'NYC-2026-' + String(100000 + Math.floor(Math.random() * 900000))); } catch (e) {}
        /* Straight into the screener for the first program they chose; the
           dashboard comes after its handoff. Nothing chosen → dashboard. */
        window.location.href = 'profile-created.html';   /* → first chosen program's screener */
        return;
      }
      window.location.href = 'intake-review.html';   /* CHW: step 3 → step 4 (review) */
    });

    if (back) {
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else window.location.href = 'contact.html';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
