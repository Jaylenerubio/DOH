/* SNAP — shared store ('nyc.snap'). Fields: need (apply | enroll | renew), fit (yes | no). */
window.SNAPStore = (function () {
  'use strict';
  var KEY = 'nyc.snap';
  function all() { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function get(k) { var v = all()[k]; return v == null ? '' : v; }
  function set(k, v) { var o = all(); if (v == null || v === '') delete o[k]; else o[k] = v; try { sessionStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  return { get: get, set: set, all: all };
})();
