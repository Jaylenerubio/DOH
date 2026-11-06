/* Welcome back (de-duplication). The phone entered on contact.html matches an
   existing record, so a code opens it. Same code behavior as verify.js.
   "Not you? Create an account" and Back return to contact.html with the form
   cleared; nyc.dedupSeen then blocks the same number (contact.js shows an
   inline error). */
(function () {
  'use strict';
  function init() {
    var code = document.getElementById('code'), err = document.getElementById('codeError');
    var LOCK = 60 * 60 * 1000, MAX = 5;
    try { var lu = parseInt(sessionStorage.getItem('nyc.lockedUntil') || '0', 10); if (lu > Date.now()) { window.location.replace('locked.html'); return; } } catch (e) {}
    var c = {}; try { c = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    var via = 'text', sentTo = document.getElementById('sentTo'), alt = document.getElementById('viaAlt');
    var resend = document.getElementById('resend'), wait = document.getElementById('resendWait'), secs = document.getElementById('secs');
    var sending = document.getElementById('sending'), banner = document.getElementById('resentMsg'), bannerText = document.getElementById('resentText'), timer = null;
    c.email = c.email || Mask.DEMO.email; var hasEmail = true;   /* the matched record's email */
    function lastFour() { var d = String(c.phone || '').replace(/\D/g, ''); return d.slice(-4); }
    var sentAt = Date.now(), EXPIRES = 5 * 60 * 1000;   /* codes expire after 5 minutes */
    function fmt(n) { return Math.floor(n / 60) + ':' + ('0' + (n % 60)).slice(-2); }
    function startCooldown() {
      var n = 30; clearInterval(timer); sentAt = Date.now(); secs.textContent = fmt(n); wait.hidden = false; resend.hidden = true;
      timer = setInterval(function () { n--; secs.textContent = fmt(n); if (n <= 0) { clearInterval(timer); wait.hidden = true; resend.hidden = false; } }, 1000);
    }
    function render() {
      if (via === 'text') sentTo.innerHTML = 'the number ending in <strong>' + lastFour() + '</strong>';
      else { sentTo.textContent = ''; var st = document.createElement('strong'); st.style.whiteSpace = 'nowrap'; st.textContent = window.Mask ? Mask.email(c.email || '') : (c.email || ''); sentTo.appendChild(st); }
      alt.textContent = via === 'text' ? 'Get a code by email instead' : 'Get a code by text instead';
      alt.hidden = via === 'text' && !hasEmail;
      var tr = document.querySelector('.signin__support'); if (tr) tr.firstChild.nodeValue = via === 'text' ? 'Changed numbers? Email ' : 'Changed email? Email ';
    }
    var busy = false;
    /* Prototype only: pause ~0.9s so a resend feels real before the banner appears. */
    var sent = function () {
      if (busy) return; busy = true;
      banner.hidden = true; clearInterval(timer); wait.hidden = true; resend.hidden = true; sending.hidden = false;
      A11y.clearStepError(err); code.value = '';
      setTimeout(function () {
        sending.hidden = true;
        banner.hidden = false; code.focus(); startCooldown(); busy = false;
      }, 900);
    }
    /* Demo: a phone number ending in 0000 fails to send (text mode only). */
    function sendFails() { return via === 'text' && lastFour() === '0000'; }
    var okSend = sent;
    sent = function () {
      if (!sendFails()) { okSend(); return; }
      if (busy) return; busy = true; banner.hidden = true; clearInterval(timer); wait.hidden = true; resend.hidden = true; sending.hidden = false; code.value = '';
      setTimeout(function () { sending.hidden = true; busy = false; A11y.stepError(err, 'Code didn\u2019t send. Check your number or try again.'); resend.hidden = false; }, 900);
    };
    render();
    if (sendFails()) { A11y.stepError(err, 'Code didn\u2019t send. Check your number or try again.'); resend.hidden = false; wait.hidden = true; } else startCooldown();
    alt.addEventListener('click', function () { via = via === 'text' ? 'email' : 'text'; render(); sent(); });
    code.focus();
    function startOver() { try { sessionStorage.setItem('nyc.dedupSeen', '1'); sessionStorage.removeItem('nyc.contact'); } catch (e) {} }
    try { sessionStorage.setItem('nyc.dedupSeen', '1'); } catch (e) {}
    document.getElementById('notMe').addEventListener('click', startOver);
    code.addEventListener('input', function () { code.value = code.value.replace(/\D/g, '').slice(0, 6); A11y.clearStepError(err); });
    resend.addEventListener('click', sent);
    document.getElementById('backBtn').addEventListener('click', function () { startOver(); window.location.href = 'contact.html'; });
    document.getElementById('continueBtn').addEventListener('click', function () {
      if (!/^\d{6}$/.test(code.value.trim())) { A11y.stepError(err, 'Enter the 6-digit code we sent you'); code.focus(); return; }
      function fail(msg) { banner.hidden = true; A11y.stepError(err, msg); code.focus(); }
      if (Date.now() - sentAt > EXPIRES) {
        /* Expired: the 30-second wait is long over, so Resend is available at once. */
        fail('Code expired.');
        clearInterval(timer); wait.hidden = true; resend.hidden = false;
        return;
      }
      if (code.value.trim() === '000000') {   /* demo: 000000 is always a wrong code */
        var fails = 0; try { fails = parseInt(sessionStorage.getItem('nyc.otpFails') || '0', 10) + 1; sessionStorage.setItem('nyc.otpFails', String(fails)); } catch (e) {}
        if (fails >= MAX) { try { sessionStorage.setItem('nyc.lockedUntil', String(Date.now() + LOCK)); } catch (e) {} window.location.href = 'locked.html'; return; }
        var left = MAX - fails; code.value = ''; fail('Wrong code. ' + left + (left === 1 ? ' try left.' : ' tries left.'));
        return;
      }
      try { sessionStorage.removeItem('nyc.otpFails'); } catch (e) {}
      DemoRecord.seed();
      window.location.href = 'welcome-back.html';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
