/* =========================================================================
   Select language step (tablet-first, responsive). No bottom sheet — the
   picker is an inline combobox on a full page.
   - Continue enables once a language is chosen.
   - Selection persists and restores on load AND back/bfcache pageshow.
   ========================================================================= */
(function () {
  'use strict';

  var KEY = 'nyc.language';

  function init() {
    var comboRoot = document.getElementById('langCombo');
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var errorEl = document.getElementById('stepError');
    if (!comboRoot || !cont || !window.Combobox) return;
    var trigger = comboRoot.querySelector('.combobox__trigger');   /* aria-invalid lives on the frame */

    var combo = window.Combobox.create(comboRoot, {
      searchable: true,
      onChange: function (value) {
        trigger.removeAttribute('aria-invalid'); A11y.clearStepError(errorEl);   // Continue is always enabled
        if (trigger) trigger.removeAttribute('aria-invalid');
        try { sessionStorage.setItem(KEY, value); } catch (e) {}
      }
    });

    // Reflect a previously chosen language (restores on load + back/bfcache),
    // syncing the combobox controller so a reopen highlights the right row.
    function restore() {
      var v = null;
      try { v = sessionStorage.getItem(KEY); } catch (e) {}
      if (v && combo.selectByValue(v)) trigger.removeAttribute('aria-invalid'); A11y.clearStepError(errorEl);
    }
    restore();
    window.addEventListener('pageshow', restore);

    cont.addEventListener('click', function () {
      if (!combo.value()) {
        if (trigger) trigger.setAttribute('aria-invalid', 'true');
        trigger.setAttribute('aria-invalid', 'true'); A11y.stepError(errorEl, 'Selection required', trigger);
        return;
      }
      trigger.removeAttribute('aria-invalid'); A11y.clearStepError(errorEl);
      window.location.href = 'privacy.html';   /* language → consent (step 1) */
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
