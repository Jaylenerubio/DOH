/* Return to your last session — phone (or email) + ZIP + date of birth, then
   a 6-digit code. Prototype: any 6 digits work. Sets nyc.channel = 'self'.
   Masked identifiers only on these screens (scripts/mask.js).

   ?stage=code&via=phone|email — arrive straight at the code step from the
   returning-client page (contact details already entered on contact.html).

   Prototype data: if no live session exists (no nyc.contact), verifying
   seeds the demo returning user so the dashboard has something to show. */
(function () {
  'use strict';
  function q(name) { var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search); return m ? decodeURIComponent(m[1]) : ''; }
  function maskDob(v) {
    var d = v.replace(/\D/g, '').slice(0, 8);
    if (d.length > 4) return d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
    if (d.length > 2) return d.slice(0, 2) + '/' + d.slice(2);
    return d;
  }
  function init() {
    var phone = document.getElementById('phone'), email = document.getElementById('email'), zip = document.getElementById('zip'), dob = document.getElementById('dob'), code = document.getElementById('code');
    var phoneField = document.getElementById('phoneField'), emailField = document.getElementById('emailField');
    var s1 = document.getElementById('stepContact'), s2 = document.getElementById('stepCode');
    var cont = document.getElementById('continueBtn'), back = document.getElementById('backBtn');
    var err1 = document.getElementById('stepError'), err2 = document.getElementById('codeError');
    var swap = document.getElementById('swap');
    var stage = 'contact', mode = 'phone';
    var returning = q('stage') === 'code';           /* came from returning.html */
    var stored = {}; try { stored = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    try { sessionStorage.setItem('nyc.channel', 'self'); } catch (e) {}

    function setMode(m) {
      mode = m;
      phoneField.hidden = m !== 'phone'; emailField.hidden = m !== 'email';
      swap.textContent = m === 'phone' ? 'Verify another way' : 'Verify by text instead';
      document.querySelector('#stepContact .step__text').textContent = m === 'phone'
        ? 'Enter the phone number, zip code, and date of birth you used before. We’ll text you a 6-digit code.'
        : 'Enter the email, zip code, and date of birth you used before. We’ll email you a 6-digit code.';
      A11y.clearStepError(err1);
      (m === 'phone' ? phone : email).focus();
    }
    swap.addEventListener('click', function () { setMode(mode === 'phone' ? 'email' : 'phone'); });

    function target() {
      /* Masked: last four of the phone, or last two letters + domain. */
      if (mode === 'phone') return Mask.phone(returning ? (stored.phone || Mask.DEMO.phone) : phone.value);
      return Mask.email(returning ? (stored.email || Mask.DEMO.email) : email.value);
    }
    function toCode() {
      stage = 'code'; s1.hidden = true; s2.hidden = false;
      document.querySelector('#stepCode .step__text').innerHTML = 'We sent a 6-digit code to <strong id="sentTo" style="white-space:nowrap">' + target() + '</strong>. It expires in 10 minutes.';
      document.getElementById('changeContact').textContent = mode === 'phone' ? 'Use a different number' : 'Use a different email';
      document.getElementById('changeContact').hidden = returning;
      var sep = document.getElementById('sep'); if (sep) sep.hidden = returning;
      cont.textContent = 'Verify'; code.value = ''; code.focus();
    }
    function toContact() { stage = 'contact'; s2.hidden = true; s1.hidden = false; cont.textContent = 'Send code'; (mode === 'phone' ? phone : email).focus(); }

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

    cont.addEventListener('click', function () {
      if (stage === 'contact') {
        var v = (mode === 'phone' ? phone : email).value.trim(), z = zip.value.trim(), d = dob.value.trim();
        var okContact = mode === 'phone' ? /^\d{3}-?\d{3}-?\d{4}$/.test(v) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        if (!okContact) { A11y.stepError(err1, mode === 'phone' ? 'Enter your phone number' : 'Enter a valid email address'); (mode === 'phone' ? phone : email).focus(); return; }
        if (!/^\d{5}$/.test(z)) { A11y.stepError(err1, 'Enter your 5-digit zip code'); zip.focus(); return; }
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(d)) { A11y.stepError(err1, 'Enter your date of birth as MM/DD/YYYY'); dob.focus(); return; }
        A11y.clearStepError(err1);
        toCode();
      } else {
        if (!/^\d{6}$/.test(code.value.trim())) { A11y.stepError(err2, 'Enter the 6-digit code we sent you'); code.focus(); return; }
        var hasRecord = false; try { hasRecord = !!sessionStorage.getItem('nyc.recordId'); } catch (e) {}
        if (returning || !hasRecord) seedReturningUser();
        window.location.href = 'welcome-back.html';
      }
    });
    back.addEventListener('click', function () {
      if (stage === 'code') { if (returning) { window.location.href = 'returning.html'; } else { toContact(); } }
      else { window.location.href = 'home.html'; }
    });
    document.getElementById('resend').addEventListener('click', function () { A11y.clearStepError(err2); code.value = ''; code.focus(); });
    document.getElementById('changeContact').addEventListener('click', toContact);
    [phone, email, zip, dob].forEach(function (el) { el.addEventListener('input', function () { A11y.clearStepError(err1); }); });
    dob.addEventListener('input', function () { dob.value = maskDob(dob.value); });
    phone.addEventListener('input', function () {
      var d = phone.value.replace(/\D/g, '').slice(0, 10);
      phone.value = d.length > 6 ? d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6) : d.length > 3 ? d.slice(0, 3) + '-' + d.slice(3) : d;
    });
    code.addEventListener('input', function () { code.value = code.value.replace(/\D/g, '').slice(0, 6); A11y.clearStepError(err2); });

    if (returning) { mode = q('via') === 'email' ? 'email' : 'phone'; toCode(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
