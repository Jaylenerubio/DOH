/* Shared enrollment-site directory (stand-in data) + ZIP match rule. */
window.HISites = (function () {
  'use strict';
  var SITES = {
    'east-harlem':  { name: 'Insurance Enrollment Site \u2014 East Harlem',  addr: '158 East 115th Street', city: 'New York, NY 10029', phone: '(212) 555-0141', phone2: '(212) 555-0142', hours: 'Monday to Friday, 9 a.m.\u20134 p.m.' },
    'morrisania':   { name: 'Insurance Enrollment Site \u2014 Morrisania',   addr: '1309 Fulton Avenue',     city: 'Bronx, NY 10456',    phone: '(718) 555-0182', phone2: '(718) 555-0183', hours: 'Monday to Friday, 9 a.m.\u20134 p.m.' },
    'east-tremont': { name: 'Insurance Enrollment Site \u2014 East Tremont', addr: '1826 Arthur Avenue',     city: 'Bronx, NY 10457',    phone: '(718) 555-0164', phone2: '(718) 555-0165', hours: 'Monday to Friday, 9 a.m.\u20134 p.m.' },
    'corona':       { name: 'Insurance Enrollment Site \u2014 Corona',       addr: '34-33 Junction Boulevard', city: 'Jackson Heights, NY 11372', phone: '(718) 555-0119', phone2: '(718) 555-0120', hours: 'Monday to Friday, 9 a.m.\u20134 p.m.' },
    'ohis':         { name: 'OHIS Triage Team',                         addr: '42-09 28th Street',      city: 'Long Island City, NY 11101', phone: '(212) 555-0100', phone2: '(212) 555-0101', hours: 'Monday to Friday, 9 a.m.\u20134 p.m.' }
  };
  function matchByZip(zip) {
    var z = parseInt(String(zip || '').replace(/\D/g, '').slice(0, 5), 10);
    if (!z) return 'ohis';
    if (z >= 10001 && z <= 10299) return 'east-harlem';
    if (z >= 10451 && z <= 10460) return 'morrisania';
    if (z >= 10461 && z <= 10475) return 'east-tremont';
    if ((z >= 11101 && z <= 11499) || (z >= 11601 && z <= 11699)) return 'corona';
    return 'ohis';
  }
  function get(key) { return SITES[key] || SITES.ohis; }
  return { SITES: SITES, matchByZip: matchByZip, get: get };
})();
