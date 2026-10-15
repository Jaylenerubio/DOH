/* Returning client (self-service de-duplication). Shown when the contact
   details entered match an existing record. Shows only the masked phone
   (or email) — nothing else from the record — and sends them to the code
   screen. "Continue as a new client" skips the check for this session. */
(function () {
  'use strict';
  function init() {
    var c = {}; try { c = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    var via = 'phone';
    var idEl = document.getElementById('matchId'), how = document.getElementById('howText'), swap = document.getElementById('swap');
    var textEl = idEl.parentNode;
    function render() {
      if (via === 'phone') {
        textEl.innerHTML = 'We found a record that uses the phone number <span class="returning__id" id="matchId">' + Mask.phone(c.phone || Mask.DEMO.phone) + '</span>.';
        how.textContent = 'We\u2019ll text you a 6-digit code to open it. The programs you just picked will be added to your record.';
        swap.textContent = 'Verify another way';
      } else {
        textEl.innerHTML = 'We found a record that uses the email <span class="returning__id" id="matchId">' + Mask.email(c.email || Mask.DEMO.email) + '</span>.';
        how.textContent = 'We\u2019ll email you a 6-digit code to open it. The programs you just picked will be added to your record.';
        swap.textContent = 'Verify by text instead';
      }
    }
    swap.addEventListener('click', function () { via = via === 'phone' ? 'email' : 'phone'; render(); A11y.announce && A11y.announce(how.textContent); });
    document.getElementById('continueBtn').addEventListener('click', function () {
      try { sessionStorage.setItem('nyc.returning', 'pending'); } catch (e) {}
      window.location.href = 'signin.html?stage=code&via=' + via;
    });
    document.getElementById('notMe').addEventListener('click', function (e) {
      e.preventDefault();
      try { sessionStorage.setItem('nyc.returning', 'new'); } catch (e2) {}
      window.location.href = 'contact-method.html';
    });
    var back = document.getElementById('backBtn');
    if (back) back.addEventListener('click', function () { window.location.href = 'contact.html'; });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
