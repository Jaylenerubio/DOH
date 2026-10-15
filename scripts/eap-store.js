/* Shared store for the EAP answers — one JSON object in sessionStorage
   ('nyc.eap'). Fields: utility[], assistance, programs[], household, income, path. Same shape as DFStore. */
window.EAPStore = (function () {
  'use strict';
  var KEY = 'nyc.eap';
  function all() { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function get(k) { var v = all()[k]; return v == null ? '' : v; }
  function set(k, v) {
    var o = all();
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) delete o[k]; else o[k] = v;
    try { sessionStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  return { all: all, get: get, set: set };
})();
