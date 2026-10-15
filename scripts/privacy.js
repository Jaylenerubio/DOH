/* =========================================================================
   "Before we begin" / privacy step.
   Continue is disabled until the consent checkbox is checked.
   ========================================================================= */
(function () {
  'use strict';

  function init() {
    var consent = document.getElementById('consent');
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var errorEl = document.getElementById('stepError');
    if (!consent || !cont) return;

    var KEY = 'nyc.consent';

    // Invariant: Continue is enabled iff the box is checked — enforced on
    // every entry point (load, change, and back/bfcache restore).
    // Continue is always enabled; checking the box just clears any shown error.
    function sync() { if (consent.checked) A11y.clearStepError(errorEl); A11y.clearGroupError(consent.closest('.consent-tile, .checkbox') || consent); }

    // Restore the acknowledgement from session storage, then sync. Runs on
    // load AND on pageshow, so coming BACK from a later step re-checks the box
    // and re-enables Continue (a checked box is never left with it disabled).
    function restore() {
      try {
        var saved = sessionStorage.getItem(KEY);
        if (saved !== null) consent.checked = (saved === 'true');
      } catch (e) {}
      sync();
    }

    consent.addEventListener('change', function () {
      try { sessionStorage.setItem(KEY, String(consent.checked)); } catch (e) {}
      sync();
    });

    restore();
    // pageshow fires on the back-forward cache restore, where init() does not
    // re-run — this closes the "checked box, disabled button" gap.
    window.addEventListener('pageshow', restore);

    // Continue → contact step (privacy is step 2, after program selection).
    cont.addEventListener('click', function () {
      if (!consent.checked) {
        A11y.groupError(consent.closest('.consent-tile, .checkbox') || consent, 'Required');
        A11y.clearStepError(errorEl);
        consent.focus();
        return;
      }
      A11y.clearStepError(errorEl); A11y.clearGroupError(consent.closest('.consent-tile, .checkbox') || consent);
      window.location.href = 'contact.html';
    });

    // Back → previous screen.
    if (back) {
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else window.location.href = (sessionStorage.getItem('nyc.channel') === 'self') ? 'programs.html' : 'language.html';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
