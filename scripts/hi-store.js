/* Shared store for the HI answers — one JSON object in sessionStorage
   ('nyc.hi'). Fields: need, disability, vision, medicare, time. Same shape as DFStore. */
window.HIStore = (function () {
  'use strict';
  var KEY = 'nyc.hi';
  function all() { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function get(k) { var v = all()[k]; return v == null ? '' : v; }
  function set(k, v) {
    var o = all();
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) delete o[k]; else o[k] = v;
    try { sessionStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  return { all: all, get: get, set: set };
})();
