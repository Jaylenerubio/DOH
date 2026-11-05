/* Verify your phone number — self-service step 3 of 3. Texts a 6-digit code to
   the number entered on contact.html. Prototype: any 6 digits work.
   Verifying creates the record (and so the profile), then goes to
   profile-created → the first chosen program's screener.
   The CHW channel never reaches this page (it uses contact-method → review). */
(function () {
  'use strict';
  function init() {
    var code = document.getElementById('code'), err = document.getElementById('codeError');
    var c = {}; try { c = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    var via = 'text', sentTo = document.getElementById('sentTo'), alt = document.getElementById('viaAlt');
    var resend = document.getElementById('resend'), wait = document.getElementById('resendWait'), secs = document.getElementById('secs');
    var sending = document.getElementById('sending'), banner = document.getElementById('resentMsg'), bannerText = document.getElementById('resentText'), timer = null;
    var hasEmail = !!(c.email && String(c.email).trim());
    function lastFour() { var d = String(c.phone || '').replace(/\D/g, ''); return d.slice(-4); }
    var sentAt = Date.now(), EXPIRES = 5 * 60 * 1000;   /* codes expire after 5 minutes */
    function fmt(n) { return Math.floor(n / 60) + ':' + ('0' + (n % 60)).slice(-2); }
    function startCooldown() {
      var n = 30; clearInterval(timer); sentAt = Date.now(); secs.textContent = fmt(n); wait.hidden = false; resend.hidden = true;
      timer = setInterval(function () { n--; secs.textContent = fmt(n); if (n <= 0) { clearInterval(timer); wait.hidden = true; resend.hidden = false; } }, 1000);
    }
    function render() {
      sentTo.textContent = via === 'text' ? 'the number ending in ' + lastFour() : (window.Mask ? Mask.email(c.email || '') : (c.email || ''));
      alt.textContent = via === 'text' ? 'Get a code by email instead' : 'Get a code by text instead';
      alt.hidden = via === 'text' && !hasEmail;
      document.getElementById('lostText').textContent = via === 'text' ? 'No longer have this number?' : 'No longer have this email?';
    }
    var busy = false;
    /* Prototype only: pause ~0.9s so a resend feels real before the banner appears. */
    function sent() {
      if (busy) return; busy = true;
      banner.hidden = true; clearInterval(timer); wait.hidden = true; resend.hidden = true; sending.hidden = false;
      A11y.clearStepError(err); code.value = '';
      setTimeout(function () {
        sending.hidden = true;
        banner.hidden = false; code.focus(); startCooldown(); busy = false;
      }, 900);
    }
    render(); startCooldown();
    alt.addEventListener('click', function () { via = via === 'text' ? 'email' : 'text'; render(); sent(); });
    code.focus();
    code.addEventListener('input', function () { code.value = code.value.replace(/\D/g, '').slice(0, 6); A11y.clearStepError(err); });
    resend.addEventListener('click', sent);
    document.getElementById('backBtn').addEventListener('click', function () { if (history.length > 1) history.back(); else window.location.href = 'review-info.html'; });
    document.getElementById('continueBtn').addEventListener('click', function () {
      if (!/^\d{6}$/.test(code.value.trim())) { A11y.stepError(err, 'Enter the 6-digit code we sent you'); code.focus(); return; }
      if (Date.now() - sentAt > EXPIRES) {
        /* Expired: the 30-second wait is long over, so Resend is available at once. */
        A11y.stepError(err, 'Code expired.'); code.focus();
        clearInterval(timer); wait.hidden = true; resend.hidden = false;
        return;
      }
      try {
        if (!sessionStorage.getItem('nyc.recordId')) sessionStorage.setItem('nyc.recordId', 'NYC-2026-' + String(100000 + Math.floor(Math.random() * 900000)));
        /* No contact-method step: texts are the default until they change it on their profile. */
        if (!sessionStorage.getItem('nyc.contactMethod')) sessionStorage.setItem('nyc.contactMethod', 'text');
      } catch (e) {}
      window.location.href = 'profile-created.html';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
