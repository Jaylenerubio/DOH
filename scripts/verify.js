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
    var via = 'text', sentTo = document.getElementById('sentTo'), viaWord = document.getElementById('viaWord'), alt = document.getElementById('viaAlt');
    var hasEmail = !!(c.email && String(c.email).trim());
    function render() {
      sentTo.textContent = via === 'text' ? (window.Mask ? Mask.phone(c.phone || '') : (c.phone || '')) : (window.Mask ? Mask.email(c.email || '') : (c.email || ''));
      viaWord.textContent = via;
      alt.textContent = via === 'text' ? 'Get a code by email' : 'Get a code by text';
      alt.hidden = via === 'text' && !hasEmail;
    }
    render();
    alt.addEventListener('click', function () {
      via = via === 'text' ? 'email' : 'text'; render(); A11y.clearStepError(err); code.value = '';
      A11y.announce && A11y.announce('We sent a new code by ' + via + '.'); code.focus();
    });
    code.focus();
    code.addEventListener('input', function () { code.value = code.value.replace(/\D/g, '').slice(0, 6); A11y.clearStepError(err); });
    document.getElementById('resend').addEventListener('click', function () { A11y.clearStepError(err); code.value = ''; code.focus(); A11y.announce && A11y.announce('We sent you a new code.'); });
    document.getElementById('backBtn').addEventListener('click', function () { if (history.length > 1) history.back(); else window.location.href = 'review-info.html'; });
    document.getElementById('continueBtn').addEventListener('click', function () {
      if (!/^\d{6}$/.test(code.value.trim())) { A11y.stepError(err, 'Enter the 6-digit code we sent you'); code.focus(); return; }
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
