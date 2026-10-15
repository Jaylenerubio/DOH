/* =========================================================================
   Reusable combobox (ARIA 1.2 combobox + listbox pattern).
   Two flavours share one controller:
   - select-only  : trigger keeps focus; active option via aria-activedescendant.
   - searchable   : a text <input> is injected into the trigger; typing filters
                    the options (case-insensitive "contains"); ↓/↑ move through
                    the visible ones; Enter/click selects; Esc closes.
   - multi        : options toggle; the list stays open; aria-selected is owned
                    by the caller (via onChange) — the controller only reports.
   Listbox is portaled to <body>, position:fixed, flips above when needed.
   API:  var c = Combobox.create(rootEl, {
            onChange: function (value, label) {},
            searchable: true|false, multi: true|false });
         c.close(); c.value(); c.selectByValue(v); c.setPlaceholder(text)
   ========================================================================= */
(function () {
  'use strict';

  function create(root, opts) {
    opts = opts || {};
    var trigger = root.querySelector('.combobox__trigger');
    var listbox = root.querySelector('.listbox');
    var valueEl = root.querySelector('.combobox__value');
    var options = Array.prototype.slice.call(listbox.querySelectorAll('[role="option"]'));
    var placeholder = valueEl ? valueEl.textContent.trim() : '';
    var searchable = !!opts.searchable;
    var multi = !!opts.multi;
    var input = null;

    // Searchable: swap the static value span for a real text input and move
    // the combobox role onto it (the input is what the user types into).
    if (searchable) {
      input = document.createElement('input');
      input.type = 'text';
      input.className = 'combobox__input';
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-haspopup', 'listbox');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');
      input.placeholder = placeholder;
      ['aria-controls', 'aria-labelledby', 'aria-label'].forEach(function (a) {
        if (trigger.hasAttribute(a)) { input.setAttribute(a, trigger.getAttribute(a)); }
      });
      if (valueEl && valueEl.id) input.id = valueEl.id;
      trigger.removeAttribute('role');
      trigger.removeAttribute('tabindex');
      trigger.removeAttribute('aria-haspopup');
      trigger.removeAttribute('aria-controls');
      trigger.removeAttribute('aria-activedescendant');
      trigger.removeAttribute('aria-expanded');
      trigger.classList.add('combobox__trigger--search');
      if (valueEl) valueEl.parentNode.replaceChild(input, valueEl);
      valueEl = null;
    }
    var control = input || trigger;             // element that owns focus + ARIA state

    if (listbox.parentNode !== document.body) document.body.appendChild(listbox);
    var open = false;
    var activeIndex = -1;                        // index into `visible`
    var selectedIndex = -1;                      // single-select only
    var visible = options.slice();
    var typeBuf = '', typeTimer = null;

    function labelOf(o) { return o.getAttribute('data-label') || o.firstChild.textContent.trim(); }

    function position() {
      listbox.style.maxHeight = '';
      var r = trigger.getBoundingClientRect();
      var gap = 6, margin = 8;
      var natural = listbox.offsetHeight;
      var below = window.innerHeight - r.bottom - gap - margin;
      var above = r.top - gap - margin;
      var flipUp = below < Math.min(natural, 160) && above > below;
      var avail = Math.max(0, flipUp ? above : below);
      var hh = Math.min(natural, avail);
      listbox.style.maxHeight = hh + 'px';
      listbox.style.width = r.width + 'px';
      listbox.style.left = r.left + 'px';
      listbox.style.top = (flipUp ? (r.top - gap - hh) : (r.bottom + gap)) + 'px';
      listbox.classList.toggle('listbox--up', flipUp);
    }

    function setActive(i) {
      if (i < 0 || i >= visible.length) return;
      if (activeIndex >= 0 && visible[activeIndex]) visible[activeIndex].classList.remove('is-active');
      activeIndex = i;
      visible[i].classList.add('is-active');
      control.setAttribute('aria-activedescendant', visible[i].id);
      visible[i].scrollIntoView({ block: 'nearest' });
    }
    function clearActive() {
      options.forEach(function (o) { o.classList.remove('is-active'); });
      activeIndex = -1;
      control.removeAttribute('aria-activedescendant');
    }

    // Filter (searchable only). Empty query shows everything.
    function filter(q) {
      q = (q || '').trim().toLowerCase();
      visible = [];
      options.forEach(function (o) {
        var hit = !q || labelOf(o).toLowerCase().indexOf(q) !== -1;
        o.hidden = !hit;
        if (hit) visible.push(o);
      });
      clearActive();
      if (open) { position(); if (visible.length) setActive(0); }
    }

    function openList() {
      if (open) return;
      open = true;
      listbox.classList.add('is-open');
      control.setAttribute('aria-expanded', 'true');
      trigger.setAttribute('data-open', 'true');
      position();
      var start = 0;
      if (!multi && selectedIndex >= 0) start = Math.max(0, visible.indexOf(options[selectedIndex]));
      if (visible.length) setActive(start);
      document.addEventListener('click', onDocPointer, true);
      window.addEventListener('resize', position);
      window.addEventListener('scroll', onScroll, true);
    }
    function closeList(focusControl) {
      if (!open) return;
      open = false;
      listbox.classList.remove('is-open');
      control.setAttribute('aria-expanded', 'false');
      trigger.removeAttribute('data-open');
      clearActive();
      document.removeEventListener('click', onDocPointer, true);
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', onScroll, true);
      if (focusControl) control.focus();
    }
    function toggle() { open ? closeList(true) : openList(); }

    function applySelection(i) {                 // single-select visual state
      if (i < 0 || i >= options.length) return;
      if (selectedIndex >= 0) options[selectedIndex].setAttribute('aria-selected', 'false');
      selectedIndex = i;
      options[i].setAttribute('aria-selected', 'true');
      if (input) {
        input.value = labelOf(options[i]);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      else if (valueEl) { valueEl.textContent = labelOf(options[i]); }
      trigger.classList.remove('is-placeholder');
    }
    function select(o) {
      if (!o) return;
      var i = options.indexOf(o);
      if (multi) {
        // Caller owns aria-selected; we just report the toggle and stay open.
        if (opts.onChange) opts.onChange(o.getAttribute('data-value'), labelOf(o));
        if (input) { input.value = ''; filter(''); }
        return;
      }
      applySelection(i);
      closeList(true);
      if (opts.onChange) opts.onChange(options[i].getAttribute('data-value'), labelOf(options[i]));
    }

    function onDocPointer(e) {
      if (!root.contains(e.target) && !listbox.contains(e.target)) closeList(false);
    }
    function onScroll(e) { if (e.target === listbox) return; position(); }

    function typeahead(ch) {                     // select-only first-letter jump
      window.clearTimeout(typeTimer);
      typeBuf += ch.toLowerCase();
      typeTimer = window.setTimeout(function () { typeBuf = ''; }, 500);
      var start = Math.max(0, activeIndex);
      for (var n = 0; n < visible.length; n++) {
        var idx = (start + n) % visible.length;
        if (labelOf(visible[idx]).toLowerCase().indexOf(typeBuf) === 0) {
          if (!open) openList();
          setActive(idx);
          return;
        }
      }
    }

    // ---- wiring -----------------------------------------------------------
    if (input) {
      trigger.addEventListener('click', function (e) {
        if (e.target !== input) { input.focus(); }
        if (!open) openList();
      });
      input.addEventListener('focus', function () { if (!open) openList(); });
      input.addEventListener('input', function () {
        if (!open) openList();
        filter(input.value);
        trigger.classList.toggle('is-placeholder', !input.value);
      });
    } else {
      trigger.addEventListener('click', toggle);
    }

    control.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open) openList(); else setActive(Math.min(activeIndex + 1, visible.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!open) openList(); else setActive(Math.max(activeIndex - 1, 0));
          break;
        case 'Home': if (open && !input) { e.preventDefault(); setActive(0); } break;
        case 'End':  if (open && !input) { e.preventDefault(); setActive(visible.length - 1); } break;
        case 'Enter':
          e.preventDefault();
          if (open && activeIndex >= 0) select(visible[activeIndex]); else openList();
          break;
        case ' ':
          if (!input) { e.preventDefault(); if (open && activeIndex >= 0) select(visible[activeIndex]); else openList(); }
          break;
        case 'Escape':
          if (open) { e.preventDefault(); e.stopPropagation(); closeList(true); }
          else if (input && input.value) { input.value = ''; filter(''); }
          break;
        case 'Tab':
          if (open) closeList(false);
          break;
        default:
          if (!input && e.key.length === 1 && /\S/.test(e.key)) { e.preventDefault(); typeahead(e.key); }
      }
    });

    options.forEach(function (opt) {
      opt.addEventListener('mousedown', function (e) { e.preventDefault(); });   // keep input focus
      opt.addEventListener('click', function () { select(opt); });
      opt.addEventListener('mousemove', function () {
        var i = visible.indexOf(opt);
        if (i !== -1 && activeIndex !== i) setActive(i);
      });
    });

    return {
      close: function () { closeList(false); },
      value: function () { return selectedIndex >= 0 ? options[selectedIndex].getAttribute('data-value') : null; },
      selectByValue: function (value) {
        for (var i = 0; i < options.length; i++) {
          if (options[i].getAttribute('data-value') === value) { applySelection(i); return true; }
        }
        return false;
      },
      setPlaceholder: function (text) {
        if (input) input.placeholder = text;
        else if (valueEl) valueEl.textContent = text;
      },
      input: input
    };
  }

  window.Combobox = { create: create };
})();
