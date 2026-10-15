/* =========================================================================
   Shared store for the TSU (anti-eviction) intake. A single array in
   sessionStorage ('nyc.tsu') of the selected situation ids, so the triage
   screen and the Review & submit screen read/write the same source of truth.
   Ids: notice, court, utilities, lock, belongings, none.
   ========================================================================= */
window.TSUStore = (function () {
  'use strict';
  var KEY = 'nyc.tsu';
  function get() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function set(ids) {
    try { sessionStorage.setItem(KEY, JSON.stringify(ids || [])); } catch (e) {}
  }
  function has(id) { return get().indexOf(id) !== -1; }
  return { get: get, set: set, has: has };
})();
