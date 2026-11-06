/* Verify your phone number — self-service step 3 of 3. Texts a 6-digit code to
   the number entered on contact.html. Prototype: any 6 digits work.
   Verifying creates the record (and so the profile), then goes to
   profile-created → the first chosen program's screener.
   The CHW channel never reaches this page (it uses contact-method → review). */
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
    var signin = false; try { signin = sessionStorage.getItem('nyc.signin') === '1'; } catch (e) {}   /* arrived from Sign in */
    var hasEmail = signin || !!(c.email && String(c.email).trim());
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
      document.getElementById('lostText').textContent = via === 'text' ? 'No longer have this number?' : 'No longer have this email?';
    }
    function seedReturningUser() {
      /* The matched record. Programs picked this visit are merged in. */
      var picked = []; try { picked = JSON.parse(sessionStorage.getItem('nyc.programs') || '[]'); } catch (e) {}
      var existing = ['hospital-bills', 'financial-help'];
      var merged = existing.slice(); picked.forEach(function (k) { if (merged.indexOf(k) === -1) merged.push(k); });
      var c = {
        firstName: 'Ana', lastName: 'Lopez', dob: Mask.DEMO.dob, zip: Mask.DEMO.zip,
        phone: '917-555-2222', email: Mask.DEMO.email
      };
      try {
        sessionStorage.setItem('nyc.contact', JSON.stringify(c));
        if (!sessionStorage.getItem('nyc.contactMethod')) sessionStorage.setItem('nyc.contactMethod', 'text');
        sessionStorage.setItem('nyc.recordId', 'NYC-2026-104877');
        sessionStorage.setItem('nyc.programs', JSON.stringify(merged));
        sessionStorage.setItem('nyc.completed', JSON.stringify(['hospital-bills']));
        sessionStorage.setItem('nyc.df', JSON.stringify({ hospital: 'NYC Health + Hospitals/Bellevue', billMonth: 'August', billYear: '2026', amount: '3,240', household: '3', state: 'New York', city: 'New York' }));
        sessionStorage.setItem('nyc.returning', 'verified');
      } catch (e) {}
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
    code.addEventListener('input', function () { code.value = code.value.replace(/\D/g, '').slice(0, 6); A11y.clearStepError(err); });
    resend.addEventListener('click', sent);
    document.getElementById('backBtn').addEventListener('click', function () { if (signin) window.location.href = 'signin.html'; else if (history.length > 1) history.back(); else window.location.href = 'review-info.html'; });
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
      if (signin) { seedReturningUser(); try { sessionStorage.removeItem('nyc.signin'); } catch (e) {} window.location.href = 'welcome-back.html'; return; }
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
