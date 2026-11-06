/* My profile (v1.3). "Your information" is read-only (the HART employee entered
   it); "Preferred language" is editable ('nyc.language'); contact method is no longer collected. "Request account deletion" is a
   placeholder: no modal or destination yet. */
(function () {
  'use strict';
  var FIELDS = ['firstName', 'lastName', 'dob', 'zip', 'phone', 'email'];
  function contact() { try { return JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) { return {}; } }
  function init() {
    var c = contact();
    FIELDS.forEach(function (id) {
      var el = document.querySelector('[data-field="' + id + '"]');
      if (el && c[id]) el.textContent = c[id];
    });
    var l = document.getElementById('lang');
    if (l) {
      try { l.value = sessionStorage.getItem('nyc.language') || 'en'; } catch (e) {}
      if (!l.value) l.value = 'en';
      l.addEventListener('change', function () { try { sessionStorage.setItem('nyc.language', l.value); } catch (e) {} });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
