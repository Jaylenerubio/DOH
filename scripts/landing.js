/* =========================================================================
   Landing page — rotating hero word. Cycles the pillar phrases every ~2.4s.
   Decorative: the rotator is aria-hidden and a static "bills." is read by
   screen readers. Stops when the tab is hidden, and never runs under
   prefers-reduced-motion.
   ========================================================================= */
(function () {
  'use strict';
  var root = document.getElementById('rotator');
  if (!root) return;
  var words = Array.prototype.slice.call(root.querySelectorAll('.rotator__word'));
  if (words.length < 2) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var i = 0, timer = null;
  function next() {
    var cur = words[i];
    i = (i + 1) % words.length;
    var nxt = words[i];
    cur.classList.remove('is-in'); cur.classList.add('is-out');
    nxt.classList.remove('is-out'); nxt.classList.add('is-in');
    setTimeout(function () { cur.classList.remove('is-out'); }, 450);
  }
  function start() { if (!timer) timer = setInterval(next, 2400); }
  function stop()  { if (timer) { clearInterval(timer); timer = null; } }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  setTimeout(start, 1600);   /* let the entrance animation finish first */
})();
