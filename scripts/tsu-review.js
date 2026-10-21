/* =========================================================================
   TSU intake — "Review and submit".
   - Top card ("Your information") is read-only, from the initial intake
     (sessionStorage 'nyc.contact'); missing values show "<Selection>".
   - Bottom card ("Anti-eviction services") is editable in place: the triage
     situations rendered as checkboxes, checked to match what the user picked
     and writing straight back to the shared TSU store, so an edit here shows
     on the triage screen (and vice-versa).
   ========================================================================= */
(function () {
  'use strict';

  var store = window.TSUStore;
  var PLACEHOLDER = '<Selection>';

  // Flag a program's real flow as started, so the dashboard shows it as an
  // in-progress card (persists across visits, newest first).
  function markStarted(key) {
    var started = [];
    try { started = JSON.parse(sessionStorage.getItem('nyc.started') || '[]'); } catch (e) {}
    if (started.indexOf(key) === -1) {
      started.unshift(key);
      try { sessionStorage.setItem('nyc.started', JSON.stringify(started)); } catch (e) {}
    }
    // Record recency so the dashboard leads with the most recently touched card.
    var act = [];
    try { act = JSON.parse(sessionStorage.getItem('nyc.activity') || '[]'); } catch (e) {}
    act = act.filter(function (k) { return k !== key; });
    act.unshift(key);
    try { sessionStorage.setItem('nyc.activity', JSON.stringify(act)); } catch (e) {}
  }

  // The triage options (mirrors the triage screen). "none" is exclusive; if
  // it's chosen — or nothing is chosen — the applicant is not eligible for TSU
  // and Save and continue routes to the 311 referral instead.
  var OPTIONS = [
    { id: 'notice', label: 'Your landlord gave you a notice that they<br>are starting eviction proceedings' },
    { id: 'court', label: 'You have an eviction case in Housing Court' },
    { id: 'utilities', label: 'Your landlord shut off your utilities to force you out' },
    { id: 'lock', label: 'Your landlord changed or removed your apartment<br>lock without a court order' },
    { id: 'belongings', label: 'Your landlord threw out your belongings without a court order' },
    { id: 'none', label: 'None of the above (I have a different housing issue)' }
  ];
  var CHECK = '<svg class="checkbox__check" viewBox="0 0 24 24" fill="none"><path d="M5 12 L10 17 L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  // Plain check for the read-only view (the checkbox__check class is hidden
  // until its input is checked, which doesn't apply here).
  var VIEW_CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12 L10 17 L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function fillInfo() {
    var contact = {};
    try { contact = JSON.parse(sessionStorage.getItem('nyc.contact') || '{}'); } catch (e) {}
    var name = [contact.firstName, contact.lastName].filter(Boolean).join(' ').trim();
    var values = { name: name, email: contact.email, phone: contact.phone, zip: contact.zip };
    Object.keys(values).forEach(function (k) {
      var el = document.querySelector('[data-info="' + k + '"]');
      if (el) el.textContent = values[k] ? values[k] : PLACEHOLDER;
    });
  }

  function renderAnswers() {
    var host = document.getElementById('tsuAnswers');
    if (!host) return;
    var selected = store ? store.get() : [];
    host.innerHTML = '';
    OPTIONS.forEach(function (opt) {
      var label = document.createElement('label');
      label.className = 'checkbox';
      label.innerHTML =
        '<input type="checkbox" class="checkbox__input" value="' + opt.id + '"' +
          (selected.indexOf(opt.id) !== -1 ? ' checked' : '') + '>' +
        '<span class="checkbox__box" aria-hidden="true">' + CHECK + '</span>' +
        '<span class="checkbox__label">' + opt.label + '</span>';
      host.appendChild(label);
    });

    host.addEventListener('change', function (e) {
      var changed = e.target;
      var inputs = Array.prototype.slice.call(host.querySelectorAll('.checkbox__input'));
      // "None of the above" is exclusive, exactly like the triage screen.
      if (changed && changed.classList.contains('checkbox__input') && changed.checked) {
        if (changed.value === 'none') {
          inputs.forEach(function (b) { if (b.value !== 'none') b.checked = false; });
        } else {
          inputs.forEach(function (b) { if (b.value === 'none') b.checked = false; });
        }
      }
      if (store) store.set(inputs.filter(function (b) { return b.checked; }).map(function (b) { return b.value; }));
    });
  }

  // Eligible = at least one real eviction situation selected (not "none",
  // not empty).
  function isEligible() {
    var ids = store ? store.get() : [];
    return ids.some(function (id) { return id !== 'none'; });
  }

  // Read-only summary of a submitted application: the chosen situations shown
  // as a locked list — no editing.
  function renderReadOnly() {
    var host = document.getElementById('tsuAnswers');
    if (!host) return;
    var selected = store ? store.get() : [];
    host.innerHTML = '';
    OPTIONS.filter(function (o) { return o.id !== 'none' && selected.indexOf(o.id) !== -1; })
      .forEach(function (o) {
        var item = document.createElement('div');
        item.className = 'tsu-view-item';
        item.innerHTML = '<span class="tsu-view-item__check">' + VIEW_CHECK + '</span>' +
          '<span class="tsu-view-item__label"><span class="sr-only">Selected: </span>' + o.label + '</span>';
        host.appendChild(item);
      });
  }

  function setupView() {
    var title = document.querySelector('.step__title');
    var text = document.querySelector('.step__text');
    var progress = document.querySelector('.step__progress');
    var prompt = document.querySelector('.tsu-review__prompt');
    var save = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var actions = document.querySelector('.step__actions');

    // Mark the page as the read-only view so its body regains the top padding
    // the (now hidden) progress bar would have contributed — keeping the title
    // at the same Y as every other page.
    var root = document.querySelector('.tsu-review');
    if (root) root.classList.add('is-view');

    // This page arrives via "View application"; the title/content are rewritten
    // here after load. Move focus to the (updated) heading so the SR announces
    // the read-only summary rather than silently swapping the title underneath.
    if (title) {
      title.textContent = 'Your application';
      title.setAttribute('tabindex', '-1');
      title.focus();
    }
    if (text) text.innerHTML = 'You submitted this application. A tenant specialist <br class="br-tablet">will contact you in 2-3 business days.';
    if (progress) progress.hidden = true;
    if (prompt) prompt.textContent = 'Your situation';
    renderReadOnly();

    if (save) save.hidden = true;
    if (actions) actions.classList.add('is-single');   // single full-width action
    if (back) {
      back.textContent = 'Back to programs';
      back.addEventListener('click', function () { window.location.href = 'dashboard.html'; });
    }
  }

  function init() {
    fillInfo();

    if (/[?&]mode=view\b/.test(location.search)) { setupView(); return; }

    renderAnswers();

    // Answers are live checkboxes by default (no edit mode).

    var back = document.getElementById('backBtn');
    if (back) {
      back.addEventListener('click', function () {
        if (history.length > 1) history.back();
        else window.location.href = 'tsu.html';
      });
    }
    var cont = document.getElementById('continueBtn');
    if (cont) {
      cont.addEventListener('click', function () {
        if (isEligible()) {
          markStarted('anti-eviction');               /* show as in-progress on the dashboard */
          window.location.href = 'tsu-connected.html'; /* Submit → handoff */
        } else {
          /* "None of the above" / nothing selected → not eligible. The 311
             page clears anti-eviction from the dashboard's in-progress cards. */
          window.location.href = 'tsu-311.html';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
