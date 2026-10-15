/* My profile — the client's own information and preferred contact method, in
   one review card with the shared Edit → Editing/Done mode (review-edit.js).
   Fields are two-way bound to sessionStorage 'nyc.contact' + 'nyc.contactMethod'. */
(function () {
  'use strict';
  var FIELDS = ['firstName', 'lastName', 'dob', 'zip', 'phone', 'email'];
  function contact() { try { return JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) { return {}; } }
  function init() {
    var c = contact();
    FIELDS.forEach(function (id) {
      var el = document.getElementById(id); if (!el) return;
      el.value = c[id] || '';
      el.addEventListener('input', function () { var d = contact(); d[id] = el.value; try { sessionStorage.setItem('nyc.contact', JSON.stringify(d)); } catch (e) {} });
    });
    var m = document.getElementById('method');
    if (m) {
      try { m.value = sessionStorage.getItem('nyc.contactMethod') || ''; } catch (e) {}
      m.addEventListener('change', function () { try { sessionStorage.setItem('nyc.contactMethod', m.value); } catch (e) {} });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
