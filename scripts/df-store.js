/* =========================================================================
   Shared store for the Dollar For intake answers. A single JSON object in
   sessionStorage ('nyc.df') keyed by field name, so every step of the flow —
   and the Review & submit screen — reads and writes the same source of truth.
   Fields: hospitalBill, state, city, hospital, billMonth, billYear, amount,
           relationship, household, income, insurance.
   ========================================================================= */
window.DFStore = (function () {
  'use strict';
  var KEY = 'nyc.df';
  function all() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function get(k) { var v = all()[k]; return v == null ? '' : v; }
  function set(k, v) {
    var o = all();
    if (v == null || v === '') delete o[k]; else o[k] = v;
    try { sessionStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  return { all: all, get: get, set: set };
})();
