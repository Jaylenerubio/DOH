/* Prototype data: the existing client's record (Ana Lopez). Sign in and the
   Welcome back de-dup page both open it after a correct code. In production
   this is the vendor's record lookup. */
(function () {
  'use strict';
  function seed() {
    var D = window.Mask.DEMO;
    var c = { firstName: 'Ana', lastName: 'Lopez', dob: D.dob, zip: D.zip, phone: '917-555-2222', email: D.email };
    try {
      sessionStorage.setItem('nyc.contact', JSON.stringify(c));
      if (!sessionStorage.getItem('nyc.contactMethod')) sessionStorage.setItem('nyc.contactMethod', 'text');
      sessionStorage.setItem('nyc.recordId', 'NYC-2026-104877');
      sessionStorage.setItem('nyc.programs', JSON.stringify(['hospital-bills', 'financial-help']));
      sessionStorage.setItem('nyc.completed', JSON.stringify(['hospital-bills']));
      sessionStorage.setItem('nyc.df', JSON.stringify({ hospital: 'NYC Health + Hospitals/Bellevue', billMonth: 'August', billYear: '2026', amount: '3,240', household: '3', state: 'New York', city: 'New York' }));
    } catch (e) {}
  }
  window.DemoRecord = { seed: seed };
})();
