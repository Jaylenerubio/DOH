/* Tax credits — shared store ('nyc.eitc'). Fields: filed, income, children. */
window.EITCStore = (function () {
  'use strict';
  var KEY = 'nyc.eitc';
  function all() { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function get(k) { var v = all()[k]; return v == null ? '' : v; }
  function set(k, v) { var o = all(); if (v == null || v === '') delete o[k]; else o[k] = v; try { sessionStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  /* Outcome per the content doc. 'claimed' = filed every year (check the return for the EITC).
     No income + children → 'likely' for now (copy to be decided). */
  function outcome() {
    var o = all();
    if (o.filed === 'every') return 'claimed';
    var income = o.income !== 'no';          /* "not sure" counts as yes */
    var kids = o.children === 'full' || o.children === 'part';
    if (!income && !kids) return 'none';
    if (kids) return 'likely';
    return 'maybe';
  }
  var PAGES = { claimed: 'eitc-claimed.html', likely: 'eitc-eligible.html', maybe: 'eitc-maybe.html', none: 'eitc-ineligible.html' };
  function page() { return PAGES[outcome()]; }
  function eligible() { return outcome() !== 'none'; }
  return { get: get, set: set, all: all, eligible: eligible, outcome: outcome, page: page };
})();
