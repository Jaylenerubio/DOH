/* =========================================================================
   Program selection (hub). Multi-select option cards (aria-pressed).
   - Screened pillars (Pillars.completed) are greyed, inert, badged "Screened".
   - Continue → starting.html for the first selected, unscreened pillar.
   - When every pillar is screened, Continue is removed.
   ========================================================================= */
(function () {
  'use strict';
  var KEY = 'nyc.programs';
  function init() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.option-card'));
    var cont = document.getElementById('continueBtn');
    var back = document.getElementById('backBtn');
    var errorEl = document.getElementById('stepError');
    if (!cards.length || !cont) return;

    function keyOf(c) { return c.getAttribute('data-program'); }
    function live() { return cards.filter(function (c) { return !c.classList.contains('is-screened'); }); }
    function anySelected() { return live().some(function (c) { return c.getAttribute('aria-pressed') === 'true'; }); }

    function save() {
      var progs = [];
      cards.forEach(function (c) {
        if (c.getAttribute('aria-pressed') === 'true' && progs.indexOf(keyOf(c)) === -1) progs.push(keyOf(c));
      });
      try { sessionStorage.setItem(KEY, JSON.stringify(progs)); } catch (e) {}
    }
    function restore() {
      var progs = []; try { progs = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) {}
      cards.forEach(function (c) {
        var screened = window.Pillars && Pillars.isCompleted(keyOf(c));
        c.setAttribute('aria-pressed', progs.indexOf(keyOf(c)) !== -1 ? 'true' : 'false');
        c.classList.toggle('is-screened', !!screened);
        c.disabled = !!screened;
        c.setAttribute('aria-disabled', screened ? 'true' : 'false');
        var title = c.querySelector('.option-card__title');
        var badge = c.querySelector('.option-card__badge');
        if (screened && !badge && title) {
          badge = document.createElement('span'); badge.className = 'option-card__badge'; badge.textContent = 'Screened';
          title.insertAdjacentElement('afterend', badge);
        } else if (!screened && badge) badge.remove();
      });
      var allScreened = live().length === 0;
      cont.hidden = allScreened;
    }

    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        if (c.classList.contains('is-screened')) return;
        c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        save();
        if (anySelected()) A11y.clearStepError(errorEl);
      });
    });
    restore();
    window.addEventListener('pageshow', restore);

    cont.addEventListener('click', function () {
      if (!anySelected()) {
        A11y.stepError(errorEl, 'Selection required');
        return;
      }
      A11y.clearStepError(errorEl);
      if (sessionStorage.getItem('nyc.channel') === 'self') {
        var has = false; try { has = !!JSON.parse(sessionStorage.getItem('nyc.contact') || '{}').firstName; } catch (e) {}
        window.location.href = has ? 'dashboard.html' : 'privacy.html';
        return;
      }
      var first = Pillars.first();
      window.location.href = first ? Pillars.startUrl(first) : 'programs.html';
    });
    if (back) back.addEventListener('click', function () {
      if (history.length > 1) history.back(); else window.location.href = (sessionStorage.getItem('nyc.channel') === 'self') ? 'home.html' : 'allset.html';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
