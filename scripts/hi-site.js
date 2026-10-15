/* Health insurance — enrollment site step. Auto-matched by ZIP; picker overrides. */
(function () {
  'use strict';
  function init() {
    var store = window.HIStore, sites = window.HISites;
    var contact = {}; try { contact = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    var matched = sites.matchByZip(contact.zip);
    var nameEl = document.getElementById('siteName'), addrEl = document.getElementById('siteAddr');
    var comboRoot = document.getElementById('siteCombo');
    Array.prototype.forEach.call(comboRoot.querySelectorAll('.listbox__option'), function (o) {
      var k = o.getAttribute('data-value'), s = sites.get(k);
      var label = o.firstChild.textContent.trim() + (k === matched ? ' \u2013 closest to you' : '');
      var wrap = document.createElement('span'); wrap.className = 'site-option';
      wrap.innerHTML = '<span>' + label + '</span><span class="site-option__addr">' + s.addr + ', ' + s.city + '</span>';
      o.setAttribute('data-label', label);
      o.replaceChild(wrap, o.firstChild);
    });
    function apply(key) {
      var s = sites.get(key);
      nameEl.textContent = s.name; addrEl.innerHTML = s.addr + '<br>' + s.city;
      store.set('site', key);
    }
    var current = store.get('site') || matched;
    var combo = Combobox.create(comboRoot, { onChange: function (v) { apply(v); A11y.announce('Enrollment site changed to ' + sites.get(v).name); } });
    combo.selectByValue(current); apply(current);
    document.getElementById('continueBtn').addEventListener('click', function () { window.location.href = 'hi-next.html'; });
    document.getElementById('backBtn').addEventListener('click', function () { if (history.length > 1) history.back(); else window.location.href = 'hi-review.html'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
