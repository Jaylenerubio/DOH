/* =========================================================================
   Shared flow-outcome helpers, called from a flow's terminal page.

   closeIneligibleProgram(key, label) — a dead-end (e.g. the TSU 311 referral):
     drops the program out of the dashboard's program cards (removes it from
     nyc.programs and nyc.started) and, if it was demoted, queues a one-time
     dashboard toast (nyc.toast) explaining why.

   submitProgram(key) — a completed application: moves the program from the
     started set (nyc.started) to the submitted set (nyc.submitted), so the
     dashboard shows it as a "Submitted" status card.
   ========================================================================= */
window.submitProgram = function (key) {
  'use strict';
  var started = [];
  try { started = JSON.parse(sessionStorage.getItem('nyc.started') || '[]'); } catch (e) {}
  try { sessionStorage.setItem('nyc.started', JSON.stringify(started.filter(function (k) { return k !== key; }))); } catch (e) {}
  var submitted = [];
  try { submitted = JSON.parse(sessionStorage.getItem('nyc.submitted') || '[]'); } catch (e) {}
  if (submitted.indexOf(key) === -1) {
    submitted.unshift(key);
    try { sessionStorage.setItem('nyc.submitted', JSON.stringify(submitted)); } catch (e) {}
  }
  // Record recency so the dashboard leads with the most recently touched card.
  var act = [];
  try { act = JSON.parse(sessionStorage.getItem('nyc.activity') || '[]'); } catch (e) {}
  act = act.filter(function (k) { return k !== key; });
  act.unshift(key);
  try { sessionStorage.setItem('nyc.activity', JSON.stringify(act)); } catch (e) {}
};

window.closeIneligibleProgram = function (key, label) {
  'use strict';
  var demoted = false;
  ['nyc.started', 'nyc.programs'].forEach(function (storeKey) {
    var arr = [];
    try { arr = JSON.parse(sessionStorage.getItem(storeKey) || '[]'); } catch (e) {}
    if (arr.indexOf(key) !== -1) {
      demoted = true;
      try { sessionStorage.setItem(storeKey, JSON.stringify(arr.filter(function (x) { return x !== key; }))); } catch (e) {}
    }
  });
  if (demoted) {
    var text = 'Based on your answers, our ' + label.toLowerCase() +
      ' program isn’t available to you. You can return to it in Other featured programs.';
    try { sessionStorage.setItem('nyc.toast', JSON.stringify({ text: text })); } catch (e) {}
  }
};
