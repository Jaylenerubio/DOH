/* Locked out after 5 wrong codes: sign-in paused for 1 hour. The lock lives in
   sessionStorage ('nyc.lockedUntil') for the prototype; in production it must be
   enforced server-side per phone/email. Live countdown (m:ss), not a live region. */
(function () {
  'use strict';
  function init() {
    var until = 0; try { until = parseInt(sessionStorage.getItem('nyc.lockedUntil') || '0', 10); } catch (e) {}
    if (!until) until = Date.now() + 60 * 60 * 1000;   /* opened directly: show a full hour */
    var time = document.getElementById('lockTime'), text = document.getElementById('lockText'), btn = document.getElementById('homeBtn');
    function fmt(ms) { var n = Math.max(0, Math.floor((ms - 1) / 1000)); return Math.floor(n / 60) + ':' + ('0' + (n % 60)).slice(-2); }
    var t;
    function tick() {
      var left = until - Date.now();
      if (left <= 0) {
        clearInterval(t);
        try { sessionStorage.removeItem('nyc.lockedUntil'); sessionStorage.removeItem('nyc.otpFails'); } catch (e) {}
        text.textContent = 'You can try again now.'; btn.textContent = 'Try again'; btn.setAttribute('data-ready', '1');
        return;
      }
      time.textContent = fmt(left);
    }
    t = setInterval(tick, 1000); tick();
    btn.addEventListener('click', function () { window.location.href = btn.getAttribute('data-ready') ? 'verify.html' : 'home.html'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
