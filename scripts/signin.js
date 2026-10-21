/* Resume your session (v1.3 Save & Continue) — phone + ZIP + date of birth,
   then a 6-digit code. A HART employee (CHW) already started the record in the
   Blooming Health CRM; the client finishes at home.

   Prototype: the demo record is phone 917-555-2222, ZIP 10457, DOB 03/15/1988
   (Mask.DEMO). Anything else shows "We couldn't find your account". Any
   6 digits work as the code. Code expiry (5 minutes) is an unconfirmed
   placeholder. "Verify another way" appears on the code step only when an
   email is on file; the email is masked, never typed.
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
    var phone = document.getElementById('phone'), zip = document.getElementById('zip'), dob = document.getElementById('dob'), code = document.getElementById('code');
    var s1 = document.getElementById('stepContact'), s2 = document.getElementById('stepCode'), s3 = document.getElementById('stepNotFound');
    var cont = document.getElementById('continueBtn'), back = document.getElementById('backBtn');
    var err1 = document.getElementById('stepError'), err2 = document.getElementById('codeError');
    var verifyAlt = document.getElementById('verifyAlt'), altSep = document.getElementById('altSep');
    var stage = 'contact', mode = 'phone';
    try { sessionStorage.setItem('nyc.channel', 'self'); } catch (e) {}

    function hasEmailOnFile() { return !!Mask.DEMO.email; }   /* demo record has an email */
    function target() { return mode === 'phone' ? Mask.phone(Mask.DEMO.phone) : Mask.email(Mask.DEMO.email); }
    function show(which) {
      s1.hidden = which !== 'contact'; s2.hidden = which !== 'code'; s3.hidden = which !== 'notfound';
      stage = which;
    }
    function toCode() {
      show('code');
      document.querySelector('#stepCode .step__text').innerHTML = 'We sent a 6-digit code to <strong id="sentTo" style="white-space:nowrap">' + target() + '</strong>. It expires in 5 minutes.';
      var canAlt = hasEmailOnFile();
      verifyAlt.hidden = !canAlt; altSep.hidden = !canAlt;
      verifyAlt.textContent = mode === 'phone' ? 'Verify another way' : 'Verify by text instead';
      cont.textContent = 'Verify'; code.value = ''; code.focus();
    }
    function toContact() { show('contact'); cont.textContent = 'Send code'; phone.focus(); }
    function toNotFound() {
      show('notfound'); cont.textContent = 'Try again';
      var h = s3.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
    }

    function seedReturningUser() {
      /* The matched record, as started by the HART employee. */
      var c = {
        firstName: 'Ana', lastName: 'Lopez', dob: Mask.DEMO.dob, zip: Mask.DEMO.zip,
        phone: '917-555-2222', email: Mask.DEMO.email
      };
      try {
        sessionStorage.setItem('nyc.contact', JSON.stringify(c));
        if (!sessionStorage.getItem('nyc.contactMethod')) sessionStorage.setItem('nyc.contactMethod', 'text');
        sessionStorage.setItem('nyc.recordId', 'NYC-2026-104877');
        /* Results from the HART employee's visit (demo): three referrals, one no-match. */
        var done = ['hospital-bills', 'medicaid', 'financial-help', 'tax-credits'];
        sessionStorage.setItem('nyc.programs', JSON.stringify(done));
        sessionStorage.setItem('nyc.completed', JSON.stringify(done));
        ['hospital-bills', 'medicaid', 'financial-help', 'tax-credits'].forEach(function (k, i) {
          sessionStorage.setItem('nyc.completed.' + k, new Date(2026, 9, 12 + i).toISOString());
        });
        sessionStorage.setItem('nyc.outcome.tax-credits', 'ineligible');
        sessionStorage.setItem('nyc.df', JSON.stringify({ hospital: 'NYC Health + Hospitals/Bellevue', billMonth: 'August', billYear: '2026', amount: '3,240', household: '3', state: 'New York', city: 'New York' }));
        sessionStorage.setItem('nyc.returning', 'verified');
      } catch (e) {}
    }

    cont.addEventListener('click', function () {
      if (stage === 'notfound') { toContact(); return; }
      if (stage === 'contact') {
        var v = phone.value.trim(), z = zip.value.trim(), d = dob.value.trim();
        if (!/^\d{3}-?\d{3}-?\d{4}$/.test(v)) { A11y.stepError(err1, 'Enter your phone number'); phone.focus(); return; }
        if (!/^\d{5}$/.test(z)) { A11y.stepError(err1, 'Enter your 5-digit zip code'); zip.focus(); return; }
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(d)) { A11y.stepError(err1, 'Enter your date of birth as MM/DD/YYYY'); dob.focus(); return; }
        A11y.clearStepError(err1);
        if (!Mask.isReturning({ phone: v, zip: z, dob: d })) { toNotFound(); return; }
        mode = 'phone'; toCode();
      } else {
        if (!/^\d{6}$/.test(code.value.trim())) { A11y.stepError(err2, 'Enter the 6-digit code we sent you'); code.focus(); return; }
        seedReturningUser();
        window.location.href = 'welcome-back.html';
      }
    });
    back.addEventListener('click', function () {
      if (stage === 'code' || stage === 'notfound') toContact(); else window.location.href = 'home.html';
    });
    document.getElementById('resend').addEventListener('click', function () { A11y.clearStepError(err2); code.value = ''; code.focus(); });
    verifyAlt.addEventListener('click', function () { mode = mode === 'phone' ? 'email' : 'phone'; A11y.clearStepError(err2); toCode(); });
    [phone, zip, dob].forEach(function (el) { el.addEventListener('input', function () { A11y.clearStepError(err1); }); });
    dob.addEventListener('input', function () { dob.value = maskDob(dob.value); });
    phone.addEventListener('input', function () {
      var d = phone.value.replace(/\D/g, '').slice(0, 10);
      phone.value = d.length > 6 ? d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6) : d.length > 3 ? d.slice(0, 3) + '-' + d.slice(3) : d;
    });
    code.addEventListener('input', function () { code.value = code.value.replace(/\D/g, '').slice(0, 6); A11y.clearStepError(err2); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
