/* Health insurance — enrollment site step. Auto-matched by ZIP. The "Prefer a
   different site?" picker was removed for v1.3; site changes return later,
   bundled with editing client information. */
(function () {
  'use strict';
  function init() {
    var store = window.HIStore, sites = window.HISites;
    var contact = {}; try { contact = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    var key = sites.matchByZip(contact.zip);
    var s = sites.get(key);
    document.getElementById('siteName').textContent = s.name;
    document.getElementById('siteAddr').innerHTML = s.addr + '<br>' + s.city;
    store.set('site', key);
    document.getElementById('continueBtn').addEventListener('click', function () { window.location.href = 'hi-next.html'; });
    document.getElementById('backBtn').addEventListener('click', function () { if (history.length > 1) history.back(); else window.location.href = 'hi-review.html'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
