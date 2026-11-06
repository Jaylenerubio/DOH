/* My profile (v1.3). "Your information" is read-only (the HART employee entered
   it); "Language" is shown read-only ('nyc.language'); contact method is no longer collected. "Request account deletion" is a
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
    var NAMES = { en: 'English', es: 'Spanish', zh: 'Chinese (Traditional)', ru: 'Russian', bn: 'Bengali', ht: 'Haitian Creole', ko: 'Korean', ar: 'Arabic', ur: 'Urdu', fr: 'French', pl: 'Polish' };
    var l = document.querySelector('[data-field="language"]');   /* read-only: chosen on step 1, last editable on Check your information */
    if (l) { var code = 'en'; try { code = sessionStorage.getItem('nyc.language') || 'en'; } catch (e) {} l.textContent = NAMES[code] || NAMES.en; }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
