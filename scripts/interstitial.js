/* Shared interstitial timing: fade in (200ms) → hold (~1s) → fade out (200ms)
   → navigate. Reduced-motion users get the hold with no fades. */
window.Interstitial = (function () {
  'use strict';
  var FADE = 200, HOLD = 1000;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show() {
    var el = document.querySelector('.interstitial');
    if (el) requestAnimationFrame(function () { el.classList.add('is-visible'); });
  }
  function go(url, hold) {
    var el = document.querySelector('.interstitial');
    window.setTimeout(function () {
      if (el) el.classList.add('is-leaving');
      window.setTimeout(function () { window.location.replace(url); }, reduce ? 0 : FADE);
    }, hold == null ? HOLD : hold);
  }
  return { show: show, go: go, FADE: FADE, HOLD: HOLD };
})();
