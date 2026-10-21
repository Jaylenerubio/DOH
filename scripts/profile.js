/* My profile (v1.3). "Your information" is read-only (the HART employee entered
   it); "Preferred contact method" (Text me / Call me) is editable and saved to
   sessionStorage 'nyc.contactMethod'. "Request account deletion" is a
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
    var m = document.getElementById('method');
    if (m) {
      try { m.value = sessionStorage.getItem('nyc.contactMethod') || 'text'; } catch (e) {}
      if (!m.value) m.value = 'text';
      m.addEventListener('change', function () { try { sessionStorage.setItem('nyc.contactMethod', m.value); } catch (e) {} });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
