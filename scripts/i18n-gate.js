/* =========================================================================
   Translation gate (prototype). Loads in <head>, before the page paints.
   When the client's language is one the prototype translates, the page stays
   hidden until scripts/i18n-dom.js has swapped the text in (and the language's
   font has loaded), so there is no flash of English or jump to right-to-left.
   Failsafe: the page always shows after 2.5 seconds.
   Production: server-render the page in the client's language instead.
   ========================================================================= */
(function () {
  'use strict';
  var TRANSLATED = ['es', 'ar', 'zh', 'ur', 'fr', 'pl'];
  var l = '';
  try { l = sessionStorage.getItem('nyc.language') || ''; } catch (e) {}
  if (TRANSLATED.indexOf(l) === -1) { window.I18nGate = { reveal: function () {} }; return; }

  var root = document.documentElement, done = false;
  root.classList.add('i18n-pending');
  var s = document.createElement('style');
  s.textContent = 'html.i18n-pending body{visibility:hidden}';
  document.head.appendChild(s);

  function show() { if (done) return; done = true; root.classList.remove('i18n-pending'); }
  /* Called by i18n-dom.js once the text is swapped: wait a frame (so the language's font starts loading), then for fonts. */
  function reveal() {
    requestAnimationFrame(function () {
      var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      Promise.race([ready, new Promise(function (r) { setTimeout(r, 800); })]).then(show, show);
    });
  }
  window.I18nGate = { reveal: reveal };
  setTimeout(show, 2500);
})();
