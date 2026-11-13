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
    ERROR_ICON: '<svg class="error-icon" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M11 15.583C11.2598 15.583 11.4775 15.4952 11.6532 15.3195C11.8289 15.1438 11.9167 14.9261 11.9167 14.6663C11.9167 14.4066 11.8289 14.1889 11.6532 14.0132C11.4775 13.8375 11.2598 13.7497 11 13.7497C10.7403 13.7497 10.5226 13.8375 10.3469 14.0132C10.1712 14.1889 10.0834 14.4066 10.0834 14.6663C10.0834 14.9261 10.1712 15.1438 10.3469 15.3195C10.5226 15.4952 10.7403 15.583 11 15.583ZM11 11.9163C11.2598 11.9163 11.4775 11.8285 11.6532 11.6528C11.8289 11.4771 11.9167 11.2594 11.9167 10.9997V7.33301C11.9167 7.07329 11.8289 6.85558 11.6532 6.67988C11.4775 6.50419 11.2598 6.41634 11 6.41634C10.7403 6.41634 10.5226 6.50419 10.3469 6.67988C10.1712 6.85558 10.0834 7.07329 10.0834 7.33301V10.9997C10.0834 11.2594 10.1712 11.4771 10.3469 11.6528C10.5226 11.8285 10.7403 11.9163 11 11.9163ZM11 20.1663C9.73199 20.1663 8.54032 19.9257 7.42504 19.4445C6.30976 18.9632 5.33962 18.3101 4.51462 17.4851C3.68962 16.6601 3.0365 15.69 2.55525 14.5747C2.074 13.4594 1.83337 12.2677 1.83337 10.9997C1.83337 9.73162 2.074 8.53995 2.55525 7.42467C3.0365 6.3094 3.68962 5.33926 4.51462 4.51426C5.33962 3.68926 6.30976 3.03613 7.42504 2.55488C8.54032 2.07363 9.73199 1.83301 11 1.83301C12.2681 1.83301 13.4598 2.07363 14.575 2.55488C15.6903 3.03613 16.6605 3.68926 17.4855 4.51426C18.3105 5.33926 18.9636 6.3094 19.4448 7.42467C19.9261 8.53995 20.1667 9.73162 20.1667 10.9997C20.1667 12.2677 19.9261 13.4594 19.4448 14.5747C18.9636 15.69 18.3105 16.6601 17.4855 17.4851C16.6605 18.3101 15.6903 18.9632 14.575 19.4445C13.4598 19.9257 12.2681 20.1663 11 20.1663ZM11 18.333C13.0473 18.333 14.7813 17.6226 16.2021 16.2018C17.623 14.7809 18.3334 13.0469 18.3334 10.9997C18.3334 8.95245 17.623 7.21842 16.2021 5.79759C14.7813 4.37676 13.0473 3.66634 11 3.66634C8.95282 3.66634 7.21879 4.37676 5.79796 5.79759C4.37712 7.21842 3.66671 8.95245 3.66671 10.9997C3.66671 13.0469 4.37712 14.7809 5.79796 16.2018C7.21879 17.6226 8.95282 18.333 11 18.333Z" fill="currentColor"/></svg>',
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
      this.queueErrorScroll();
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
    /* After a failed Continue: scroll the first control with an error (and its message) into the part of the
       screen not covered by the pinned footer, so the person sees what is required. One scroll per press, even
       when several controls report at once. Does nothing if it is already fully in view. */
    queueErrorScroll: function () {
      if (this._scrollQ) return;
      var self = this;
      this._scrollQ = window.setTimeout(function () {
        self._scrollQ = 0;
        var first = null, top = Infinity;
        Array.prototype.forEach.call(document.querySelectorAll('.is-invalid, [aria-invalid="true"]'), function (el) {
          var r = el.getBoundingClientRect();
          if (!r.width && !r.height) return;
          var t = r.top + window.pageYOffset;
          if (t < top) { top = t; first = el; }
        });
        if (!first) return;
        var footer = document.querySelector('.step__footer, .lang-page__footer');
        var visibleBottom = window.innerHeight - (footer ? footer.getBoundingClientRect().height : 0);
        var r = first.getBoundingClientRect(), bottom = r.bottom;
        var msg = first.nextElementSibling;
        if (msg && msg.classList && msg.classList.contains('field__error') && !msg.hidden) bottom = msg.getBoundingClientRect().bottom;
        if (r.top >= 0 && bottom <= visibleBottom) return;
        var offset = Math.max(16, (visibleBottom - (bottom - r.top)) / 2);
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        try { window.scrollTo({ top: Math.max(0, r.top + window.pageYOffset - offset), behavior: reduce ? 'auto' : 'smooth' }); }
        catch (e) { window.scrollTo(0, Math.max(0, r.top + window.pageYOffset - offset)); }
      }, 0);
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
