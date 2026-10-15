/* =========================================================================
   Review cards — Edit mode (shared by every "Review and submit" page).
   Read mode: each field shows label + value as plain text (no disabled
   inputs). Edit → the card's controls appear; Done validates the card and
   returns to read mode with an "Updated" badge when something changed.
   - One card edits at a time: other Edit buttons and Submit are
     aria-disabled (still focusable, with a hint) while a card is editing.
   - Done is blocked by "Needs an answer" on any empty required field that
     is visible (dependent rows revealed by an edit included).
   - Answers cleared by a dependent edit are called out in a live note.
   Works on top of each page's own script: it never writes to the stores
   itself; it only shows/hides controls and reads their current values.
   ========================================================================= */
(function () {
  'use strict';
  var PENCIL = '<svg viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M4.58333 17.4167H5.88958L14.85 8.45625L13.5438 7.15L4.58333 16.1104V17.4167ZM3.66667 19.25C3.40694 19.25 3.18924 19.1622 3.01354 18.9865C2.83785 18.8108 2.75 18.5931 2.75 18.3333V16.1104C2.75 15.866 2.79583 15.633 2.8875 15.4115C2.97917 15.1899 3.10903 14.9951 3.27708 14.8271L14.85 3.27708C15.0333 3.10903 15.2358 2.97917 15.4573 2.8875C15.6788 2.79583 15.9118 2.75 16.1562 2.75C16.4007 2.75 16.6375 2.79583 16.8667 2.8875C17.0958 2.97917 17.2944 3.11667 17.4625 3.3L18.7229 4.58333C18.9063 4.75139 19.0399 4.95 19.124 5.17917C19.208 5.40833 19.25 5.6375 19.25 5.86667C19.25 6.11111 19.208 6.3441 19.124 6.56562C19.0399 6.78715 18.9063 6.98958 18.7229 7.17292L7.17292 18.7229C7.00486 18.891 6.81007 19.0208 6.58854 19.1125C6.36701 19.2042 6.13403 19.25 5.88958 19.25H3.66667ZM14.1854 7.81458L13.5438 7.15L14.85 8.45625L14.1854 7.81458Z" fill="currentColor"/></svg>';
  var CHECK = '<svg viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M8.75418 13.7012L16.4243 6.03108C16.6332 5.82217 16.881 5.71771 17.1678 5.71771C17.4546 5.71771 17.7025 5.82217 17.9114 6.03108C18.1203 6.23998 18.2247 6.48783 18.2247 6.77463C18.2247 7.06141 18.1203 7.30925 17.9114 7.51816L9.489 15.9405C9.28009 16.1494 9.03515 16.2539 8.75418 16.2539C8.4732 16.2539 8.22826 16.1494 8.01935 15.9405L4.08864 12.0098C3.87973 11.8009 3.77818 11.5531 3.78399 11.2663C3.78981 10.9795 3.89717 10.7317 4.10608 10.5227C4.31499 10.3138 4.56284 10.2094 4.84964 10.2094C5.13641 10.2094 5.38426 10.3138 5.59317 10.5227L8.75418 13.7012Z" fill="currentColor"/></svg>';
  var cards = [], editing = null, submit = null, hintEl = null;

  function text(el) { return (el && el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function visible(el) { return !!(el && !el.hidden && el.offsetParent !== null); }

  /* ---- value readers ------------------------------------------------------ */
  function fieldLabel(field) {
    var l = field.querySelector('.review-field__label, legend, .field__label');
    if (l) { var c = l.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('.field__optional'), function (o) { o.remove(); }); return text(c); }
    return '';
  }
  function fieldValue(field) {
    var boxes = field.querySelectorAll('input[type="checkbox"]');
    if (boxes.length) {
      var on = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).map(function (b) { var lab = b.closest('label'); return text(lab && (lab.querySelector('.checkbox__label') || lab)); });
      return on.join('; ');
    }
    var combo = field.querySelector('.combobox__trigger');
    if (combo) return combo.classList.contains('is-placeholder') ? '' : text(combo.querySelector('.combobox__value'));
    var ctrls = field.querySelectorAll('select, input:not([type="checkbox"]):not([type="radio"]), textarea');
    return Array.prototype.map.call(ctrls, function (c) {
      if (c.tagName === 'SELECT') { var o = c.options[c.selectedIndex]; return (c.value && o) ? text(o) : ''; }
      return (c.value || '').trim();
    }).filter(Boolean).join(' ');
  }
  function fieldRequired(field) {
    if (field.querySelector('.field__optional')) return false;
    var c = field.querySelector('select, input, textarea, .combobox__trigger');
    return !!c;
  }
  function fieldsOf(card) {
    var f = Array.prototype.slice.call(card.querySelectorAll('.review-field'));
    if (!f.length) { var g = card.querySelector('.tsu-review__answers, .review-group'); if (g) f = [g]; }
    return f;
  }

  /* ---- read views ---------------------------------------------------------- */
  function ensureRead(field, card) {
    var r = field.querySelector(':scope > .review-read');
    if (!r) {
      r = document.createElement('div'); r.className = 'review-read';
      r.innerHTML = '<span class="review-read__label"></span><span class="review-read__value"></span>';
      field.insertBefore(r, field.firstChild);
    }
    var lab = fieldLabel(field) || (field.classList.contains('tsu-review__answers') ? 'Your situation' : '');
    r.querySelector('.review-read__label').textContent = lab;
    var v = fieldValue(field);
    r.querySelector('.review-read__value').textContent = v || '—';
    r.classList.toggle('is-empty', !v);
  }
  var refreshing = false;
  function refresh(card) { if (refreshing) return; refreshing = true; try { fieldsOf(card).forEach(function (f) { ensureRead(f, card); }); } finally { refreshing = false; } }

  /* ---- lock / unlock -------------------------------------------------------- */
  function lock(active) {
    cards.forEach(function (c) { if (c !== active) c.btn.setAttribute('aria-disabled', 'true'); });
    if (submit) {
      submit.setAttribute('aria-disabled', 'true');
      if (!hintEl) { hintEl = document.createElement('p'); hintEl.className = 'review-edit__hint'; hintEl.id = 'reviewEditHint'; submit.parentNode.parentNode.insertBefore(hintEl, submit.parentNode); }
      hintEl.textContent = 'Finish editing to submit.'; hintEl.hidden = false;
      submit.setAttribute('aria-describedby', 'reviewEditHint');
    }
  }
  function unlock() {
    cards.forEach(function (c) { c.btn.removeAttribute('aria-disabled'); });
    if (submit) { submit.removeAttribute('aria-disabled'); submit.removeAttribute('aria-describedby'); if (hintEl) hintEl.hidden = true; }
  }

  /* ---- enter / done --------------------------------------------------------- */
  function snapshot(card) { var m = {}; fieldsOf(card).forEach(function (f, i) { m[i] = fieldValue(f); }); return m; }
  function enter(c) {
    if (editing && editing !== c) { editing.btn.focus(); return; }
    editing = c; c.snap = snapshot(c.card); c.touched = {};
    c.card.classList.remove('is-read'); c.card.classList.add('is-editing');
    c.badge.textContent = 'Editing'; c.badge.className = 'review-card__badge review-card__badge--editing'; c.badge.hidden = false;
    c.btn.innerHTML = 'Done' + CHECK; c.btn.className = 'review-card__edit review-card__edit--done';
    c.btn.setAttribute('aria-label', 'Done editing ' + c.name);
    if (c.note) { c.note.remove(); c.note = null; }
    lock(c);
    var first = c.card.querySelector('.review-field:not([hidden]) select, .review-field:not([hidden]) input, .review-field:not([hidden]) .combobox__trigger, .tsu-review__answers input');
    if (first) first.focus();
    A11y.announce('Editing ' + c.name + '. Press Done when you finish.');
  }
  function done(c) {
    var fields = fieldsOf(c.card), missing = [];
    fields.forEach(function (f) {
      if (!visible(f)) return;
      var ctrl = f.querySelector('select, input:not([type="checkbox"]), .combobox__trigger, .program-list, .tsu-review__answers') || f;
      A11y.clearGroupError(ctrl);
      if (fieldRequired(f) && !fieldValue(f)) missing.push({ f: f, ctrl: ctrl });
    });
    if (missing.length) {
      missing.forEach(function (m) { A11y.groupError(m.ctrl, 'Needs an answer'); });
      var focusEl = missing[0].f.querySelector('select, input, .combobox__trigger') || missing[0].ctrl;
      focusEl.focus(); A11y.announce(missing.length + (missing.length === 1 ? ' question needs an answer' : ' questions need an answer'));
      return;
    }
    var now = snapshot(c.card), changed = false, cleared = [];
    fields.forEach(function (f, i) {
      if (now[i] !== c.snap[i]) changed = true;
      if (c.snap[i] && !now[i] && !c.touched[i] && !visible(f)) cleared.push(fieldLabel(f));
    });
    refresh(c.card);
    c.card.classList.remove('is-editing'); c.card.classList.add('is-read');
    c.btn.innerHTML = 'Edit' + PENCIL; c.btn.className = 'review-card__edit'; c.btn.setAttribute('aria-label', 'Edit ' + c.name);
    if (changed) { c.badge.textContent = 'Updated'; c.badge.className = 'review-card__badge review-card__badge--updated'; c.badge.hidden = false; }
    else c.badge.hidden = true;
    if (cleared.length) {
      c.note = document.createElement('p'); c.note.className = 'review-card__note'; c.note.setAttribute('role', 'status');
      c.note.textContent = 'Some answers were cleared because you changed ' + c.changedLabel + '.';
      c.card.insertBefore(c.note, c.card.querySelector('.review-fields, .tsu-review__answers'));
    }
    editing = null; unlock(); c.btn.focus();
    A11y.announce(c.name + (changed ? ' updated.' : ' unchanged.') + (cleared.length ? ' Some answers were cleared.' : ''));
  }

  /* ---- setup ----------------------------------------------------------------- */
  function setup(card) {
    var head = card.querySelector('.review-card__head');
    if (!head) return;
    var hint = head.querySelector('.review-card__hint'); if (hint) hint.remove();
    var old = head.querySelector('.review-card__edit'); if (old) old.remove();
    var name = text(head.querySelector('.review-card__title')) || 'this section';
    var ctl = document.createElement('div'); ctl.className = 'review-card__ctl';
    var badge = document.createElement('span'); badge.className = 'review-card__badge'; badge.hidden = true;
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'review-card__edit';
    btn.innerHTML = 'Edit' + PENCIL; btn.setAttribute('aria-label', 'Edit ' + name);
    ctl.appendChild(badge); ctl.appendChild(btn); head.appendChild(ctl);
    var c = { card: card, btn: btn, badge: badge, name: name, snap: {}, touched: {}, note: null, changedLabel: 'an answer' };
    cards.push(c);
    card.classList.add('is-read');
    refresh(card);
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-disabled') === 'true') { A11y.announce('Finish editing ' + (editing ? editing.name : '') + ' first.'); if (editing) editing.btn.focus(); return; }
      if (editing === c) done(c); else enter(c);
    });
    card.addEventListener('input', onTouch); card.addEventListener('change', onTouch); card.addEventListener('click', onTouch);
    function onTouch(e) {
      if (editing !== c) return;
      var f = e.target.closest && e.target.closest('.review-field, .tsu-review__answers'); if (!f) return;
      var i = fieldsOf(card).indexOf(f); if (i !== -1) { c.touched[i] = true; c.changedLabel = fieldLabel(f) || 'an answer'; }
    }
    /* Keep read views in sync with page scripts that re-render rows. */
    if (window.MutationObserver) new MutationObserver(function (muts) {
      if (editing === c || refreshing) return;
      if (muts.every(function (m) { return m.target.closest && m.target.closest('.review-read'); })) return;   /* our own writes */
      refresh(card);
    }).observe(card, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.review-card'), setup);
    submit = document.getElementById('continueBtn');
    if (submit) submit.addEventListener('click', function (e) {
      if (editing) { e.preventDefault(); e.stopImmediatePropagation(); A11y.announce('Finish editing ' + editing.name + ' before you submit.'); editing.btn.focus(); }
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
