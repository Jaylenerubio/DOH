/* Resume your session (v1.3 Save & Continue) — email + phone + ZIP + date of birth,
   then a 6-digit code. A HART employee (CHW) already started the record in the
   Blooming Health CRM; the client finishes at home.

   Prototype: the demo record is email ana@example.com, phone 917-555-2222, ZIP 10457, DOB 03/15/1988
   (Mask.DEMO). Anything else shows "We couldn't find your account". Any
   6 digits work as the code. Code expiry (5 minutes) is an unconfirmed
   placeholder. Email is required for sign-in, so "Verify by email" / "Verify by text"
   is always offered on the code step; the email is masked, never re-typed.
   Masked identifiers only on these screens (scripts/mask.js). */
(function () {
  'use strict';
  function maskDob(v) {
    var d = v.replace(/\D/g, '').slice(0, 8);
    if (d.length > 4) return d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
    if (d.length > 2) return d.slice(0, 2) + '/' + d.slice(2);
    return d;
  }
  function init() {
    var email = document.getElementById('email'), phone = document.getElementById('phone'), zip = document.getElementById('zip'), dob = document.getElementById('dob'), code = document.getElementById('code');
    var s1 = document.getElementById('stepContact'), s2 = document.getElementById('stepCode'), s3 = document.getElementById('stepNotFound'), s4 = document.getElementById('stepPaused');
    var wrong = 0, MAX_WRONG = 5;   /* PLACEHOLDER: server enforces; demo treats 000000 as a wrong code */
    var cont = document.getElementById('continueBtn'), back = document.getElementById('backBtn');
    var err1 = document.getElementById('stepError'), err2 = document.getElementById('codeError');
    var verifyAlt = document.getElementById('verifyAlt');
    var stage = 'contact', mode = 'phone';
    try { sessionStorage.setItem('nyc.channel', 'self'); } catch (e) {}

    /* "We sent you a new code." alert (placeholder copy) sits under the
       "We sent a 6-digit code to …" text, which stays so the destination is
       always visible. The resend link counts down 30 seconds (placeholder)
       after each send. */
    var CHECK = '<svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="11" fill="currentColor"/><path d="M9.16675 12.2859L14.4874 6.96524C14.6847 6.76795 14.9278 6.66931 15.2167 6.66931C15.5057 6.66931 15.7488 6.76795 15.9461 6.96524C16.1434 7.16252 16.242 7.40654 16.242 7.69731C16.242 7.98809 16.1434 8.23212 15.9461 8.4294L9.90157 14.4794C9.69266 14.6883 9.44772 14.7928 9.16675 14.7928C8.88577 14.7928 8.64083 14.6883 8.43192 14.4794L6.04859 12.0961C5.85131 11.8988 5.75358 11.6548 5.7554 11.364C5.75723 11.0732 5.85679 10.8292 6.05407 10.6319C6.25135 10.4346 6.49538 10.336 6.78616 10.336C7.07693 10.336 7.32096 10.4346 7.51824 10.6319L9.16675 12.2859Z" fill="#E2F2D5"/></svg>';
    var resendBtn = document.getElementById('resend'), codeText = document.getElementById('codeText'), status = document.getElementById('resendStatus');
    var COOLDOWN = 30, timer = null;
    function clearAlert() { status.innerHTML = ''; }
    function showAlert() {
      status.innerHTML = '<div class="signin__alert">' + CHECK + '<span>We sent you a new code.</span></div>';
    }
    function startCooldown() {
      var left = COOLDOWN;
      clearInterval(timer);
      resendBtn.setAttribute('aria-disabled', 'true');
      function tick() {
        if (left <= 0) { clearInterval(timer); resendBtn.removeAttribute('aria-disabled'); resendBtn.textContent = 'Send a new code'; return; }
        resendBtn.textContent = 'Send a new code in ' + left + ' second' + (left === 1 ? '' : 's'); left--;
      }
      tick(); timer = setInterval(tick, 1000);
    }
    function hasEmailOnFile() { return true; }   /* email is required to sign in */
    var matched = Mask.DEMO;
    function target() { return mode === 'phone' ? Mask.phone(matched.phone) : Mask.email(matched.email); }
    function show(which) {
      s1.hidden = which !== 'contact'; s2.hidden = which !== 'code'; s3.hidden = which !== 'notfound'; s4.hidden = which !== 'paused';
      stage = which;
    }
    function toCode() {
      show('code');
      document.querySelector('#stepCode .step__text').innerHTML = 'We sent a 6-digit code to <strong id="sentTo" style="white-space:nowrap">' + target() + '</strong>. It expires in 5 minutes.';
      var canAlt = hasEmailOnFile();
      verifyAlt.hidden = !canAlt;
      verifyAlt.textContent = mode === 'phone' ? 'Verify by email' : 'Verify by text';
      clearAlert(); startCooldown();
      cont.textContent = 'Verify'; code.value = ''; code.focus();
    }
    function toContact() { clearInterval(timer); show('contact'); back.hidden = false; cont.textContent = 'Send code'; email.focus(); }
    function toNotFound() {
      show('notfound'); back.hidden = true; cont.textContent = 'Try again';   /* one button: Back would do the same thing */
      var h = s3.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
    }

    function seedReturningUser() {
      /* The matched record, as started by the HART employee. */
      var k = matched, p = k.phone;
      var c = {
        firstName: k.firstName, lastName: k.lastName, dob: k.dob, zip: k.zip,
        phone: p.slice(0, 3) + '-' + p.slice(3, 6) + '-' + p.slice(6), email: k.email
      };
      try {
        sessionStorage.setItem('nyc.contact', JSON.stringify(c));
        if (!sessionStorage.getItem('nyc.contactMethod')) sessionStorage.setItem('nyc.contactMethod', 'text');
        sessionStorage.setItem('nyc.recordId', 'NYC-2026-104877');
        sessionStorage.setItem('nyc.df', JSON.stringify({ hospital: 'NYC Health + Hospitals/Bellevue', billMonth: 'August', billYear: '2026', amount: '3,240', household: '3', state: 'New York', city: 'New York' }));
        sessionStorage.setItem('nyc.returning', 'verified');
        sessionStorage.setItem('nyc.language', k.lang);   /* preferred language: post-login screens render in it */
      } catch (e) {}
    }

    cont.addEventListener('click', function () {
      if (stage === 'paused') { window.location.href = 'home.html'; return; }
      if (stage === 'notfound') { toContact(); return; }
      if (stage === 'contact') {
        var em = email.value.trim(), v = phone.value.trim(), z = zip.value.trim(), d = dob.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { A11y.stepError(err1, 'Enter a valid email address'); email.focus(); return; }
        if (!/^\d{3}-?\d{3}-?\d{4}$/.test(v)) { A11y.stepError(err1, 'Enter your phone number'); phone.focus(); return; }
        if (!/^\d{5}$/.test(z)) { A11y.stepError(err1, 'Enter your 5-digit zip code'); zip.focus(); return; }
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(d)) { A11y.stepError(err1, 'Enter your date of birth as MM/DD/YYYY'); dob.focus(); return; }
        A11y.clearStepError(err1);
        matched = Mask.match({ email: em, phone: v, zip: z, dob: d });
        if (!matched) { matched = Mask.DEMO; toNotFound(); return; }
        mode = 'phone'; toCode();
      } else {
        if (!/^\d{6}$/.test(code.value.trim())) { A11y.stepError(err2, 'Enter the 6-digit code we sent you'); code.focus(); return; }
        if (code.value.trim() === '000000') {
          wrong++;
          if (wrong >= MAX_WRONG) { clearInterval(timer); show('paused'); back.hidden = true; cont.textContent = 'Back to home'; stage = 'paused'; return; }
          var left = MAX_WRONG - wrong;
          A11y.stepError(err2, 'Invalid code. You have ' + left + ' attempt' + (left === 1 ? '' : 's') + ' left.'); code.value = ''; code.focus(); return;
        }
        seedReturningUser();
        window.location.href = 'welcome-back.html';
      }
    });
    back.addEventListener('click', function () {
      if (stage === 'code' || stage === 'notfound') toContact(); else window.location.href = 'home.html';
    });
    resendBtn.addEventListener('click', function () {
      if (resendBtn.getAttribute('aria-disabled') === 'true') return;
      A11y.clearStepError(err2); code.value = ''; code.focus(); showAlert(); startCooldown();
    });
    verifyAlt.addEventListener('click', function () { mode = mode === 'phone' ? 'email' : 'phone'; A11y.clearStepError(err2); toCode(); });
    [email, phone, zip, dob].forEach(function (el) { el.addEventListener('input', function () { A11y.clearStepError(err1); }); });
    dob.addEventListener('input', function () { dob.value = maskDob(dob.value); });
    phone.addEventListener('input', function () {
      var d = phone.value.replace(/\D/g, '').slice(0, 10);
      phone.value = d.length > 6 ? d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6) : d.length > 3 ? d.slice(0, 3) + '-' + d.slice(3) : d;
    });
    code.addEventListener('input', function () { code.value = code.value.replace(/\D/g, '').slice(0, 6); A11y.clearStepError(err2); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
