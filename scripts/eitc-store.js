/* Tax credits — shared store ('nyc.eitc'). Fields: filed, income, children. */
window.EITCStore = (function () {
  'use strict';
  var KEY = 'nyc.eitc';
  function all() { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function get(k) { var v = all()[k]; return v == null ? '' : v; }
  function set(k, v) { var o = all(); if (v == null || v === '') delete o[k]; else o[k] = v; try { sessionStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function eligible() { var o = all(); return !(o.children === 'none' && o.income === 'no'); }
  return { get: get, set: set, all: all, eligible: eligible };
})();
