/* Health insurance — "What's next" (terminal). Shows the site chosen on
   hi-site.html with its two numbers; chains (CHW) or returns to the
   dashboard (self-service) via Pillars.wireHandoff. */
(function () {
  'use strict';
  function init() {
    var store = window.HIStore, sites = window.HISites;
    var contact = {}; try { contact = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    var key = (store && store.get('site')) || sites.matchByZip(contact.zip);
    var s = sites.get(key);
    Array.prototype.forEach.call(document.querySelectorAll('[data-site-name]'), function (el) { el.textContent = s.name; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-site-hours]'), function (el) { el.textContent = s.hours.replace(/\.$/, '') + '.'; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-site-addr]'), function (el) { el.innerHTML = s.addr + '<br>' + s.city; });
    var p1 = document.getElementById('sitePhone'), p2 = document.getElementById('sitePhone2');
    p1.textContent = s.phone; p1.setAttribute('data-copy', s.phone);
    p2.textContent = s.phone2; p2.setAttribute('data-copy', s.phone2);
    [[p1, 'callBtn1', ''], [p2, 'callBtn2', ' (second number)']].forEach(function (x) {
      var a = document.getElementById(x[1]), digits = x[0].textContent.replace(/\D/g, '');
      a.setAttribute('href', 'tel:' + digits);
      a.setAttribute('aria-label', 'Call ' + x[0].textContent + x[2]);
    });
    if (window.Pillars) Pillars.wireHandoff('medicaid');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
