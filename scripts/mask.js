/* Masked identifiers for verification screens. Never show a full phone or
   email on sign-in / returning-client / code screens:
     phone '917-555-2222'   → '(•••) •••-2222'
     email 'ana@example.com' → '••na@example.com' (last two letters + domain) */
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
    return DOT + DOT + local.slice(-2) + domain;
  }
  /* Demo returning clients: each email + phone + ZIP + DOB combination has a record.
     lang = the client's preferred language (the whole post-login experience uses it). */
  var CLIENTS = [
    { firstName: 'Ana',    lastName: 'Lopez',   email: 'ana@example.com',   phone: '9175552222', zip: '10457', dob: '03/15/1988', lang: 'en' },
    { firstName: 'Sof\u00eda', lastName: 'Ram\u00edrez', email: 'sofia@example.com', phone: '9175554444', zip: '10029', dob: '11/04/1985', lang: 'es' },
    { firstName: '\u0644\u064a\u0644\u0649', lastName: '\u062d\u062f\u0627\u062f', email: 'layla@example.com', phone: '9175553333', zip: '11201', dob: '07/22/1990', lang: 'ar' },
    { firstName: '\u7f8e\u73b2', lastName: '\u9673', email: 'mei@example.com', phone: '9175555555', zip: '11354', dob: '02/09/1979', lang: 'zh' }
  ];
  var DEMO = CLIENTS[0];
  function match(c) {
    if (!c) return null;
    var d = String(c.phone || '').replace(/\D/g, ''), e = String(c.email || '').trim().toLowerCase();
    for (var i = 0; i < CLIENTS.length; i++) {
      var k = CLIENTS[i];
      if (d === k.phone && e === k.email && String(c.zip || '').trim() === k.zip && String(c.dob || '').trim() === k.dob) return k;
    }
    return null;
  }
  function isReturning(c) { return !!match(c); }
  window.Mask = { phone: phone, email: email, isReturning: isReturning, match: match, CLIENTS: CLIENTS, DEMO: DEMO };
})();
