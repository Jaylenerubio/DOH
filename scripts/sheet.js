/* =========================================================================
   Reusable bottom-sheet controller (modal dialog).
   Accessibility baked in:
     - role="dialog" aria-modal="true", labelled/-described by title + subtitle
     - focus moves into the sheet on open; focus is TRAPPED (Tab wraps)
     - Escape closes; focus RETURNS to the trigger on close
     - background page marked `inert` + aria-hidden so screen readers and
       pointer/tab can't reach it while the sheet is open
     - background scroll locked (body overflow hidden)
   API:  var s = Sheet.create(sheetEl, { background:[el,…], onOpen, onClose });
         s.open(triggerEl);  s.close();  s.isOpen();
   ========================================================================= */
(function () {
  'use strict';

  var FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function visibleFocusables(el) {
    return Array.prototype.slice.call(el.querySelectorAll(FOCUSABLE))
      .filter(function (n) {
        return !n.hasAttribute('inert') &&
               n.getClientRects().length > 0;   // rendered (not display:none/hidden)
      });
  }

  function create(sheetEl, opts) {
    opts = opts || {};
    var scrim = document.querySelector('[data-scrim-for="' + sheetEl.id + '"]');
    var background = opts.background || [];
    var lastTrigger = null;
    var isOpen = false;

    function onKeydown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      var f = visibleFocusables(sheetEl);
      if (!f.length) { e.preventDefault(); sheetEl.focus(); return; }
      var first = f[0], last = f[f.length - 1];
      // If focus somehow escaped the sheet, pull it back.
      if (!sheetEl.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    function open(trigger) {
      if (isOpen) return;
      isOpen = true;
      lastTrigger = trigger || null;

      background.forEach(function (el) {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      });
      if (scrim) scrim.classList.add('is-open');
      sheetEl.classList.add('is-open');
      sheetEl.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeydown, true);

      // Move focus to the dialog itself (tabindex="-1") so the screen reader
      // announces the dialog name/description before the first control.
      requestAnimationFrame(function () { sheetEl.focus(); });

      if (opts.onOpen) opts.onOpen();
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;

      sheetEl.classList.remove('is-open');
      sheetEl.setAttribute('aria-hidden', 'true');
      if (scrim) scrim.classList.remove('is-open');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown, true);
      background.forEach(function (el) {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      });

      if (opts.onClose) opts.onClose();
      if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
    }

    if (scrim) scrim.addEventListener('click', close);
    // Wire EVERY close control (a sheet may have more than one, e.g. an X and
    // a "Close" button).
    Array.prototype.forEach.call(sheetEl.querySelectorAll('[data-sheet-close]'), function (btn) {
      btn.addEventListener('click', close);
    });

    return { open: open, close: close, isOpen: function () { return isOpen; } };
  }

  window.Sheet = { create: create };
})();
