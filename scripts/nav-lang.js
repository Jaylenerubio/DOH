/* =========================================================================
   Header translate button → language menu. Same options and storage key
   ('nyc.language') as the language page, so a change here matches a change
   there. Prototype only: the choice is stored and announced, not applied.
   ========================================================================= */
(function () {
  'use strict';
  var LANGS = [['en','English'],['es','Spanish'],['zh','Chinese (Traditional)'],['ru','Russian'],['bn','Bengali'],['ht','Haitian Creole'],['ko','Korean'],['ar','Arabic'],['ur','Urdu'],['fr','French'],['pl','Polish']];
  var CHECK = '<svg class="listbox__check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12 L10 17 L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function current() { try { return sessionStorage.getItem('nyc.language') || ''; } catch (e) { return ''; } }
  function init() {
    var btn = document.querySelector('.site-nav__translate');
    if (!btn) return;
    var self = false; try { self = sessionStorage.getItem('nyc.channel') === 'self'; } catch (e) {}
    if (self) return;   /* self-service header: language panel lives in banner.js */
    // Build the menu once, portaled to <body> (position: fixed like .listbox).
    var list = document.createElement('ul');
    list.className = 'listbox listbox--menu';
    list.id = 'navLangList';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Language');
    list.tabIndex = -1;
    LANGS.forEach(function (l) {
      var li = document.createElement('li');
      li.className = 'listbox__option'; li.setAttribute('role', 'option'); li.id = 'navLang-' + l[0];
      li.setAttribute('data-value', l[0]); li.setAttribute('aria-selected', current() === l[0] ? 'true' : 'false');
      li.innerHTML = l[1] + CHECK;
      li.addEventListener('mousedown', function (e) { e.preventDefault(); });
      li.addEventListener('click', function () { choose(l[0], l[1]); });
      list.appendChild(li);
    });
    document.body.appendChild(list);
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', list.id);

    var open = false, active = -1;
    var opts = Array.prototype.slice.call(list.children);
    function position() {
      var r = btn.getBoundingClientRect();
      list.style.width = '240px';
      list.style.top = (r.bottom + 6) + 'px';
      list.style.left = Math.max(8, Math.min(r.right - 240, window.innerWidth - 248)) + 'px';
    }
    function setActive(i) {
      opts.forEach(function (o) { o.classList.remove('is-active'); });
      active = i; if (i >= 0) { opts[i].classList.add('is-active'); list.setAttribute('aria-activedescendant', opts[i].id); opts[i].scrollIntoView({ block: 'nearest' }); }
    }
    function openList() {
      if (open) return; open = true;
      position(); list.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true');
      var cur = opts.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; });
      setActive(cur >= 0 ? cur : 0); list.focus();
      document.addEventListener('click', onDoc, true); window.addEventListener('resize', position);
    }
    function closeList(focusBtn) {
      if (!open) return; open = false;
      list.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); setActive(-1);
      document.removeEventListener('click', onDoc, true); window.removeEventListener('resize', position);
      if (focusBtn) btn.focus();
    }
    function onDoc(e) { if (!list.contains(e.target) && !btn.contains(e.target)) closeList(false); }
    function choose(code, label) {
      try { sessionStorage.setItem('nyc.language', code); } catch (e) {}
      opts.forEach(function (o) { o.setAttribute('aria-selected', o.getAttribute('data-value') === code ? 'true' : 'false'); });
      if (window.I18n) I18n.apply();
      btn.setAttribute('aria-label', label + (window.I18n ? I18n.t('translate_suffix') : ', translate this page'));
      if (window.A11y) A11y.announce('Language set to ' + label);
      closeList(true);
    }
    btn.addEventListener('click', function () { open ? closeList(true) : openList(); });
    list.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(active + 1, opts.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (active >= 0) opts[active].click(); }
      else if (e.key === 'Escape') { e.preventDefault(); closeList(true); }
      else if (e.key === 'Tab') closeList(false);
    });
    var cur = LANGS.filter(function (l) { return l[0] === current(); })[0];
    if (cur) btn.setAttribute('aria-label', cur[1] + (window.I18n ? I18n.t('translate_suffix') : ', translate this page'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
