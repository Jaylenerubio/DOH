/* =========================================================================
   Shared accessibility helpers. Load this BEFORE any page script that gates a
   footer "Continue" button.

   Gated buttons — instead of the native `disabled` attribute (which drops the
   control out of the tab order and gives keyboard / screen-reader users no way
   to discover it or learn why they can't proceed), a gated button is marked
   `aria-disabled="true"` and keeps a visible, focusable presence. While it's
   gated it points at a visually-hidden hint via aria-describedby (e.g. "Select
   an option to continue"), so a screen-reader user who lands on it hears the
   reason. Activation (mouse + keyboard) is blocked by a single capture-phase
   guard below, so pages don't each have to re-implement the block.

   Usage in a page script:
     A11y.setDisabled(continueBtn, isBlocked);   // toggle the gated state
     if (A11y.isDisabled(continueBtn)) return;   // guard inside a click handler

   Markup contract for a gated button:
     <button id="continueBtn" aria-disabled="true"
             aria-describedby="continueHint" data-hint="continueHint">Continue</button>
     <span class="sr-only" id="continueHint">Select an option to continue</span>
   ========================================================================= */
(function () {
  'use strict';

  var A11y = {
    setDisabled: function (btn, disabled) {
      if (!btn) return;
      if (disabled) {
        btn.setAttribute('aria-disabled', 'true');
        var hint = btn.getAttribute('data-hint');
        if (hint) btn.setAttribute('aria-describedby', hint);
      } else {
        btn.removeAttribute('aria-disabled');
        // The hint only applies while blocked; drop it so an enabled button
        // isn't described as "…to continue".
        if (btn.getAttribute('data-hint')) btn.removeAttribute('aria-describedby');
      }
    },
    isDisabled: function (btn) {
      return !!btn && btn.getAttribute('aria-disabled') === 'true';
    },
    // Announce a transient message to screen readers via a shared polite live
    // region (created on first use). Use for state changes that have no natural
    // focus move — "Copied", "Application started", etc.
    announce: function (message) {
      var region = document.getElementById('a11y-live-region');
      if (!region) {
        region = document.createElement('div');
        region.id = 'a11y-live-region';
        region.className = 'sr-only';
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', 'polite');
        document.body.appendChild(region);
      }
      // Clear first so re-announcing the same text still fires.
      region.textContent = '';
      window.setTimeout(function () { region.textContent = message; }, 60);
    },

    /* ---- Always-enabled validation feedback -----------------------------
       The gated "Continue" buttons are never disabled. When a single-choice
       step is incomplete, the page calls stepError() instead of navigating:
       reveal the visible message (role="alert"), announce it, and move focus
       to the offending control — so the block is explained, not silent. */
    /* ---- Error pattern ------------------------------------------------
       Every error is: triangle-alert icon + short text in --color-error-dark.
       stepError()  — one message for a whole page (list pages: the pillar hub,
                      the eviction situations). Scrolls into view, animates
                      once (fade-drop + a single nudge; none under
                      reduced-motion) and takes focus.
       groupError() — "Required" / "Selection required" under one control or
                      choice group; marks inputs/tiles invalid (red border).
       ------------------------------------------------------------------- */
    ERROR_ICON: '<svg class="error-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 9v4M12 17h.01M21.73 18 13.73 4a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    setErrorText: function (el, message) {
      el.innerHTML = this.ERROR_ICON;
      el.appendChild(document.createTextNode(message));
    },
    stepError: function (msgEl, message, focusEl) {
      if (msgEl) {
        if (message != null) this.setErrorText(msgEl, message);
        msgEl.hidden = false;
        if (!msgEl.hasAttribute('tabindex')) msgEl.setAttribute('tabindex', '-1');
        // Re-trigger the attention animation each time it fires.
        msgEl.classList.remove('is-attention'); void msgEl.offsetWidth; msgEl.classList.add('is-attention');
        try { msgEl.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { msgEl.scrollIntoView(); }
      }
      var target = focusEl || msgEl;
      if (target && target.focus) target.focus({ preventScroll: true });
    },
    clearStepError: function (msgEl) { if (msgEl) { msgEl.hidden = true; msgEl.classList.remove('is-attention'); } },

    /* Group / control level. `control` is the element to mark (input, select,
       tile, or a choice group); `anchor` (optional) is where the message goes
       after — defaults to the control. Returns the message element. */
    groupError: function (control, message, anchor) {
      if (!control) return null;
      var host = anchor || control;
      var msg = host.nextElementSibling;
      if (!(msg && msg.classList && msg.classList.contains('field__error') && msg.getAttribute('data-for') === (control.id || 'x'))) {
        msg = document.createElement('p');
        msg.className = 'field__error';
        msg.setAttribute('data-for', control.id || 'x');
        msg.id = (control.id || 'ctl') + '-error';
        host.insertAdjacentElement('afterend', msg);
      }
      this.setErrorText(msg, message || 'Required');
      msg.hidden = false;
      control.classList.add('is-invalid');
      if (control.tagName === 'INPUT' || control.tagName === 'SELECT' || control.tagName === 'TEXTAREA') control.setAttribute('aria-invalid', 'true');
      control.setAttribute('aria-describedby', msg.id);
      // Clear as soon as the control is answered (typed, changed, or a chip/tile tapped).
      if (!control.getAttribute('data-error-bound')) {
        control.setAttribute('data-error-bound', '1');
        var self = this;
        ['input', 'change', 'click'].forEach(function (ev) {
          control.addEventListener(ev, function () { window.setTimeout(function () { self.clearGroupError(control, anchor); }, 0); });
        });
      }
      return msg;
    },
    clearGroupError: function (control, anchor) {
      if (!control) return;
      var host = anchor || control;
      var msg = host.nextElementSibling;
      if (msg && msg.classList && msg.classList.contains('field__error') && msg.getAttribute('data-for') === (control.id || 'x')) msg.hidden = true;
      control.classList.remove('is-invalid');
      control.removeAttribute('aria-invalid');
      if (msg && control.getAttribute('aria-describedby') === msg.id) control.removeAttribute('aria-describedby');
    },

    /* Field-level error for the multi-field form (inline validation). */
    fieldError: function (input, msgEl, message) {
      if (input) { input.setAttribute('aria-invalid', 'true'); input.classList.add('is-invalid'); }
      if (msgEl) {
        if (!msgEl.querySelector('.error-icon')) this.setErrorText(msgEl, message || msgEl.textContent.trim() || 'Required');
        else if (message) this.setErrorText(msgEl, message);
        msgEl.hidden = false;
        if (input && msgEl.id) input.setAttribute('aria-describedby', msgEl.id);
      }
    },
    clearFieldError: function (input, msgEl) {
      if (input) { input.removeAttribute('aria-invalid'); input.classList.remove('is-invalid'); }
      if (msgEl) msgEl.hidden = true;
      if (input && msgEl && msgEl.id && input.getAttribute('aria-describedby') === msgEl.id) input.removeAttribute('aria-describedby');
    }
  };

  // One capture-phase guard blocks activation of any aria-disabled control,
  // for both pointer clicks and keyboard (Enter/Space dispatch a click).
  document.addEventListener('click', function (e) {
    var target = e.target && e.target.closest ? e.target.closest('[aria-disabled="true"]') : null;
    if (target) {
      e.preventDefault();
      e.stopImmediatePropagation();   // also stops the page's own bubble handler
    }
  }, true);

  window.A11y = A11y;
})();

/* Arrow-key movement inside chip radio groups (buttons with role="radio"
   inside role="radiogroup"). Left/Up and Right/Down move and select, like
   native radios. Applied automatically on every page that loads a11y.js. */
(function () {
  'use strict';
  function radiogroupKeys() {
    document.addEventListener('keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) === -1) return;
      var t = e.target; if (!t || t.getAttribute('role') !== 'radio') return;
      var g = t.closest('[role="radiogroup"]'); if (!g) return;
      var items = Array.prototype.slice.call(g.querySelectorAll('[role="radio"]'));
      var i = items.indexOf(t); if (i < 0) return;
      var next = (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? (i - 1 + items.length) % items.length : (i + 1) % items.length;
      e.preventDefault(); items[next].focus(); items[next].click();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', radiogroupKeys); else radiogroupKeys();
})();
