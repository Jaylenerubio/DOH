/* =========================================================================
   Select language step (tablet-first, responsive). No bottom sheet — the
   picker is an inline combobox on a full page.
   - Continue enables once a language is chosen.
   - Selection persists and restores on load AND back/bfcache pageshow.
   ========================================================================= */
(function () {
  'use strict';

  var KEY = 'nyc.language';
  var TRANSLATED = ['en', 'es', 'zh', 'ar', 'ur', 'fr', 'pl'];   /* languages the prototype actually has */
  var NOT_TRANSLATED = ['ru', 'bn', 'ht', 'ko'];                  /* listed, but fall back to English: prototype note */

  /* The public landing page links here with ?lang=<its language code>. Applied
     once, then removed from the URL so a later Back never overrides a new choice. */
  function applyLandingLanguage() {
    var q = '';
    try { q = new URLSearchParams(window.location.search).get('lang') || ''; } catch (e) {}
    if (!q) return;
    if (q === 'zh-Hant') q = 'zh';
    if (TRANSLATED.indexOf(q) === -1 && NOT_TRANSLATED.indexOf(q) === -1) q = '';
    if (q) { try { sessionStorage.setItem(KEY, q); } catch (e) {} }   /* untranslated ones still preselect; the tool then shows English */
    try { history.replaceState(null, '', window.location.pathname); } catch (e) {}
  }
  applyLandingLanguage();

  function init() {
    var comboRoot = document.getElementById('langCombo');
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var errorEl = document.getElementById('stepError');
    if (!comboRoot || !cont || !window.Combobox) return;
    var trigger = comboRoot.querySelector('.combobox__trigger');   /* aria-invalid lives on the frame */
    var noteEl = document.getElementById('langNote');
    function updateNote(v) { if (noteEl) noteEl.hidden = NOT_TRANSLATED.indexOf(v) === -1; }

    var combo = window.Combobox.create(comboRoot, {
      searchable: true,
      inline: true,   /* list under the field in the page flow: never covers the field, even with the phone keyboard open */
      onChange: function (value) {
        trigger.removeAttribute('aria-invalid'); A11y.clearStepError(errorEl);   // Continue is always enabled
        if (trigger) trigger.removeAttribute('aria-invalid');
        try { sessionStorage.setItem(KEY, value); } catch (e) {}
        updateNote(value);
      }
    });

    // Reflect a previously chosen language (restores on load + back/bfcache),
    // syncing the combobox controller so a reopen highlights the right row.
    function restore() {
      var v = null;
      try { v = sessionStorage.getItem(KEY); } catch (e) {}
      if (v && combo.selectByValue(v)) trigger.removeAttribute('aria-invalid'); A11y.clearStepError(errorEl);
      updateNote(v);
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
        else window.location.href = 'home.html';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
