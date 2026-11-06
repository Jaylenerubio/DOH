/* Masked identifiers for verification screens. Never show a full phone or
   email on sign-in / returning-client / code screens:
     phone '917-555-2222'   → '(•••) •••-2222'
     email 'ana@example.com' → 'a••@example.com' (first letter + domain) */
(function () {
  'use strict';
  var DOT = '•';
  function phone(v) {
    var d = String(v || '').replace(/\D/g, '');
    var last = d.slice(-4) || '0000';
    return '(' + DOT + DOT + DOT + ') ' + DOT + DOT + DOT + '-' + last;
  }
  function email(v) {
    var s = String(v || '').trim(), at = s.indexOf('@');
    if (at < 0) return DOT + DOT;
    var local = s.slice(0, at), domain = s.slice(at);
    return local.charAt(0) + DOT + DOT + domain;
  }
  /* Demo returning client: this phone number has a record. */
  var DEMO = { phone: '9175552222', zip: '10457', dob: '03/15/1988', email: 'ana@example.com' };
  function isReturning(c) {
    if (!c) return false;
    return String(c.phone || '').replace(/\D/g, '') === DEMO.phone;   /* phone alone matches (email is optional) */
  }
  window.Mask = { phone: phone, email: email, isReturning: isReturning, DEMO: DEMO };
})();
