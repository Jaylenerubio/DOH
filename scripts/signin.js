/* Sign in (returning client). First name, last name, DOB, ZIP and phone must all
   match a record; then a code is texted (verify.html in sign-in mode).
   Prototype record: Ana Lopez, 03/15/1988, 10457, 917-555-2222.
   A mismatch shows one generic error and does not say which field was wrong.
   Sets nyc.channel = 'self'. */
(function () {
  'use strict';
  function maskDob(v) {
    var d = v.replace(/\D/g, '').slice(0, 8);
    if (d.length > 4) return d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
    if (d.length > 2) return d.slice(0, 2) + '/' + d.slice(2);
    return d;
  }
  function init() {
    var fn = document.getElementById('firstName'), ln = document.getElementById('lastName'), dob = document.getElementById('dob'), zip = document.getElementById('zip'), phone = document.getElementById('phone');
    var err = document.getElementById('stepError');
    try { sessionStorage.setItem('nyc.channel', 'self'); } catch (e) {}
    function norm(v) { return String(v || '').trim().toLowerCase(); }
    document.getElementById('continueBtn').addEventListener('click', function () {
      if (!fn.value.trim()) { A11y.stepError(err, 'Enter your first name'); fn.focus(); return; }
      if (!ln.value.trim()) { A11y.stepError(err, 'Enter your last name'); ln.focus(); return; }
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob.value.trim())) { A11y.stepError(err, 'Enter your date of birth as MM/DD/YYYY'); dob.focus(); return; }
      if (!/^\d{5}$/.test(zip.value.trim())) { A11y.stepError(err, 'Enter your 5-digit ZIP code'); zip.focus(); return; }
      if (!/^\d{3}-?\d{3}-?\d{4}$/.test(phone.value.trim())) { A11y.stepError(err, 'Enter your phone number'); phone.focus(); return; }
      var D = Mask.DEMO;
      var ok = norm(fn.value) === 'ana' && norm(ln.value) === 'lopez' && dob.value.trim() === D.dob && zip.value.trim() === D.zip && phone.value.replace(/\D/g, '') === D.phone;
      if (!ok) { A11y.stepError(err, 'We couldn’t find an account with those details. Check them and try again.'); fn.focus(); return; }
      try {
        sessionStorage.setItem('nyc.signin', '1');
        sessionStorage.setItem('nyc.contact', JSON.stringify({ firstName: 'Ana', lastName: 'Lopez', dob: D.dob, zip: D.zip, phone: phone.value.trim(), email: D.email }));
      } catch (e) {}
      window.location.href = 'verify.html';
    });
    document.getElementById('backBtn').addEventListener('click', function () { window.location.href = 'home.html'; });
    [fn, ln, dob, zip, phone].forEach(function (el) { el.addEventListener('input', function () { A11y.clearStepError(err); }); });
    dob.addEventListener('input', function () { dob.value = maskDob(dob.value); });
    zip.addEventListener('input', function () { zip.value = zip.value.replace(/\D/g, '').slice(0, 5); });
    phone.addEventListener('input', function () {
      var d = phone.value.replace(/\D/g, '').slice(0, 10);
      phone.value = d.length > 6 ? d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6) : d.length > 3 ? d.slice(0, 3) + '-' + d.slice(3) : d;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
