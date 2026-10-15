/* Gov banner disclosure: "Official website of the City of New York" toggles
   the .gov / HTTPS explainer. One per page; state is not persisted. */
(function () {
  'use strict';
  function init() {
    var btn = document.querySelector('.top-banner__toggle');
    var panel = document.getElementById('govPanel');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.hidden = open;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* =========================================================================
   Self-service header. On the client side (nyc.channel = 'self'):
   - English and Menu are plain icon + label buttons. Both open the same
     full-screen panel below the header (every breakpoint). While a panel is
     open, every other nav item hides and the active button reads "Close".
   - Menu panel: My profile, Sign out. Language panel: native name · English,
     current language tinted with a check.
   - Desktop (1024px and up): My profile and Sign out are text links in the
     nav and the hamburger is hidden.
   - Hamburger (.menu-toggle, three spans) morphs into an X on .is-active;
     the translate icon crossfades to an X. The panel fades/slides in on the
     same 0.3s cubic-bezier(0.4,0,0.2,1) curve so icon and panel finish
     together. Esc, Close, a link, or a click on the panel's empty area
     closes it. aria-expanded on the button.
   - Logo → dashboard once a record exists, home before that.
   - Sign out clears the session and goes to home.html.
   - Self-service intake has three steps; the CHW flow's fourth segment is
     dropped here.
   ========================================================================= */
(function selfNav() {
  'use strict';
  var CLOSE = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 13.4L7.10005 18.3C6.91672 18.4833 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4833 5.70005 18.3C5.51672 18.1167 5.42505 17.8833 5.42505 17.6C5.42505 17.3167 5.51672 17.0833 5.70005 16.9L10.6 12L5.70005 7.09999C5.51672 6.91665 5.42505 6.68332 5.42505 6.39999C5.42505 6.11665 5.51672 5.88332 5.70005 5.69999C5.88338 5.51665 6.11672 5.42499 6.40005 5.42499C6.68338 5.42499 6.91672 5.51665 7.10005 5.69999L12 10.6L16.9 5.69999C17.0834 5.51665 17.3167 5.42499 17.6 5.42499C17.8834 5.42499 18.1167 5.51665 18.3 5.69999C18.4834 5.88332 18.575 6.11665 18.575 6.39999C18.575 6.68332 18.4834 6.91665 18.3 7.09999L13.4 12L18.3 16.9C18.4834 17.0833 18.575 17.3167 18.575 17.6C18.575 17.8833 18.4834 18.1167 18.3 18.3C18.1167 18.4833 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4833 16.9 18.3L12 13.4Z" fill="currentColor"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12 L10 17 L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /* code, native name, English name */
  var LANGS = [['en','English',''],['es','Español','Spanish'],['zh','繁體中文','Chinese (Traditional)'],['ru','Русский','Russian'],['bn','বাংলা','Bengali'],['ht','Kreyòl Ayisyen','Haitian Creole'],['ko','한국어','Korean'],['ar','العربية','Arabic'],['ur','اردو','Urdu'],['fr','Français','French'],['pl','Polski','Polish']];

  function get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function signOut() { try { sessionStorage.clear(); } catch (e) {} window.location.href = 'home.html'; }

  function apply() {
    var nav = document.querySelector('.site-nav'); if (!nav) return;
    if (get('nyc.channel') !== 'self') return;
    nav.classList.add('is-self');
    var hasRecord = !!get('nyc.recordId');

    var logo = nav.querySelector('.site-nav__inner > a');
    if (logo) { logo.setAttribute('href', hasRecord ? 'dashboard.html' : 'home.html'); logo.setAttribute('aria-label', hasRecord ? 'NYC Health — your dashboard' : 'NYC Health — home'); }

    var prog = document.querySelector('.progress[aria-valuemax="4"]');
    if (prog && !document.body.querySelector('.intake-review')) {
      var segs = prog.querySelectorAll('.progress__seg'); if (segs.length === 4) prog.removeChild(segs[3]);
      prog.setAttribute('aria-valuemax', '3'); prog.setAttribute('aria-label', 'Step ' + prog.getAttribute('aria-valuenow') + ' of 3');
    }

    var actions = nav.querySelector('.site-nav__actions'); if (!actions) return;
    var langBtn = nav.querySelector('.site-nav__translate');
    var langLabel = langBtn && langBtn.querySelector('.site-nav__translate-label');
    /* Translate icon and X share one slot so they can crossfade. */
    var langIcon = langBtn && langBtn.querySelector('svg');
    if (langIcon) { var wrap = document.createElement('span'); wrap.className = 'icon-swap'; wrap.setAttribute('aria-hidden', 'true'); langIcon.parentNode.insertBefore(wrap, langIcon); langIcon.classList.add('icon-swap__lang'); wrap.appendChild(langIcon); wrap.insertAdjacentHTML('beforeend', CLOSE.replace('<svg ', '<svg class="icon-swap__close" ')); }

    /* Desktop text links + hamburger (record only) */
    var menuBtn = null;
    if (hasRecord) {
      var links = document.createElement('div'); links.className = 'site-nav__links';
      links.innerHTML = '<a class="site-nav__link" href="profile.html">My profile</a><a class="site-nav__link" href="home.html" data-signout>Sign out</a>';
      actions.insertBefore(links, langBtn || null);
      menuBtn = document.createElement('button'); menuBtn.type = 'button'; menuBtn.className = 'site-nav__menu menu-toggle';
      menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-controls', 'siteMenuPanel');
      menuBtn.innerHTML = '<span class="burger" aria-hidden="true"><span></span><span></span><span></span></span><span class="site-nav__menu-label">Menu</span>';
      actions.appendChild(menuBtn);
    }
    if (langBtn) { langBtn.setAttribute('aria-expanded', 'false'); langBtn.setAttribute('aria-controls', 'siteLangPanel'); langBtn.setAttribute('aria-haspopup', 'true'); }

    /* Panels */
    function panel(id, label) { var p = document.createElement('div'); p.className = 'site-panel'; p.id = id; p.hidden = true; p.setAttribute('role', 'dialog'); p.setAttribute('aria-modal', 'true'); p.setAttribute('aria-label', label); nav.appendChild(p); return p; }
    var menuPanel = null;
    if (hasRecord) {
      menuPanel = panel('siteMenuPanel', 'Account menu');
      menuPanel.innerHTML = '<nav class="site-panel__inner" aria-label="Account"><a class="site-panel__item" href="profile.html">My profile</a><a class="site-panel__item" href="home.html" data-signout>Sign out</a></nav>';
    }
    var langPanel = null;
    if (langBtn) {
      langPanel = panel('siteLangPanel', 'Choose a language');
      var cur = get('nyc.language') || 'en';
      var rows = LANGS.map(function (l) {
        var sel = l[0] === cur;
        return '<button class="site-panel__lang' + (sel ? ' is-selected' : '') + '" type="button" role="option" aria-selected="' + sel + '" data-lang="' + l[0] + '">' +
          '<span class="site-panel__lang-name"><span lang="' + l[0] + '"' + (l[0] === 'ar' || l[0] === 'ur' ? ' dir="rtl"' : '') + '>' + l[1] + '</span>' + (l[2] ? '<span class="site-panel__dot" aria-hidden="true"></span><span class="site-panel__lang-en">' + l[2] + '</span>' : '') + '</span>' +
          (sel ? '<span class="site-panel__check">' + CHECK + '<span class="sr-only"> (current)</span></span>' : '') + '</button>';
      }).join('');
      langPanel.innerHTML = '<div class="site-panel__inner" role="listbox" aria-label="Language">' + rows + '</div>';
    }

    var openPanel = null, openBtn = null, scrollY = 0;
    function place() { document.documentElement.style.setProperty('--menu-top', nav.getBoundingClientRect().bottom + 'px'); }
    function labelOf(btn) { return btn === menuBtn ? btn.querySelector('.site-nav__menu-label') : langLabel; }
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* Fade the label out, swap the word, fade back in. */
    function swapLabel(el, text) {
      if (!el) return;
      if (reduced) { el.textContent = text; return; }
      el.classList.add('is-swapping');
      window.setTimeout(function () { el.textContent = text; el.classList.remove('is-swapping'); }, 150);
    }
    /* Everything outside the header is inert while a panel is open, so swipe
       navigation and Tab can't leave the dialog. */
    function outside() { return Array.prototype.filter.call(document.querySelectorAll('main, .step__footer, .top-banner, footer'), function (el) { return !nav.contains(el); }); }
    function setInert(v) { outside().forEach(function (el) { if (v) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); } else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); } }); }
    /* Scroll lock that also holds on iOS Safari: pin the body at the current
       offset, restore it on close. */
    function lockScroll(v) {
      if (v) { scrollY = window.pageYOffset || 0; document.body.style.top = -scrollY + 'px'; document.body.classList.add('menu-open'); }
      else { document.body.classList.remove('menu-open'); document.body.style.top = ''; window.scrollTo(0, scrollY); }
    }
    function setOpen(btn, p, v, instant) {
      place();
      if (v) {
        openPanel = p; openBtn = btn; nav.classList.add('nav-open'); btn.classList.add('is-active'); lockScroll(true); setInert(true);
        btn.setAttribute('aria-expanded', 'true'); swapLabel(labelOf(btn), 'Close');
        p.hidden = false; void p.offsetWidth; p.classList.add('is-open');
        var first = p.querySelector('.site-panel__item, .is-selected, .site-panel__lang'); if (first) window.setTimeout(function () { first.focus(); }, 80);
      } else {
        p.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); swapLabel(labelOf(btn), btn === menuBtn ? 'Menu' : 'English');
        if (instant) p.hidden = true; else window.setTimeout(function () { p.hidden = true; }, 300);
        nav.classList.remove('nav-open'); btn.classList.remove('is-active'); lockScroll(false); setInert(false);
        openPanel = null; openBtn = null; if (!instant) btn.focus();
      }
    }
    function toggle(btn, p) { if (openPanel === p) setOpen(btn, p, false); else if (!openPanel) setOpen(btn, p, true); }
    if (menuBtn) menuBtn.addEventListener('click', function () { toggle(menuBtn, menuPanel); });
    if (langBtn) langBtn.addEventListener('click', function (e) { e.preventDefault(); toggle(langBtn, langPanel); });
    document.addEventListener('keydown', function (e) {
      if (!openPanel) return;
      if (e.key === 'Escape') { setOpen(openBtn, openPanel, false); return; }
      if (e.key === 'Tab') {
        var items = [openBtn].concat(Array.prototype.slice.call(openPanel.querySelectorAll('a, button')));
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    [menuPanel, langPanel].forEach(function (p) {
      if (!p) return;
      p.addEventListener('click', function (e) { if (e.target === p || e.target.classList.contains('site-panel__inner')) setOpen(openBtn, p, false); });
      p.querySelectorAll('.site-panel__item').forEach(function (a) { a.addEventListener('click', function () { if (!a.hasAttribute('data-signout')) setOpen(openBtn, p, false); }); });
    });
    nav.querySelectorAll('[data-signout]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); signOut(); }); });
    if (langPanel) langPanel.querySelectorAll('.site-panel__lang').forEach(function (b) {
      b.addEventListener('click', function () {
        var code = b.getAttribute('data-lang'), l = LANGS.filter(function (x) { return x[0] === code; })[0];
        try { sessionStorage.setItem('nyc.language', code); } catch (e) {}
        langPanel.querySelectorAll('.site-panel__lang').forEach(function (o) { o.classList.remove('is-selected'); o.setAttribute('aria-selected', 'false'); var c = o.querySelector('.site-panel__check'); if (c) c.remove(); });
        b.classList.add('is-selected'); b.setAttribute('aria-selected', 'true'); b.insertAdjacentHTML('beforeend', '<span class="site-panel__check">' + CHECK + '<span class="sr-only"> (current)</span></span>');
        if (window.A11y && A11y.announce) A11y.announce('Language set to ' + (l[2] || l[1]));
        setOpen(langBtn, langPanel, false);
      });
    });
    window.addEventListener('resize', function () {
      if (!openPanel) return;
      place();
      /* Crossing 1024px hides the hamburger, so its panel can't be closed from the header. */
      if (openPanel === menuPanel && window.innerWidth >= 1024) setOpen(menuBtn, menuPanel, false, true);
    });
    /* Back/forward cache can restore the page mid-open; reset without animation. */
    window.addEventListener('pageshow', function (e) { if (e.persisted && openPanel) setOpen(openBtn, openPanel, false, true); });
    /* Mark so nav-lang.js leaves this header alone. */
    nav.setAttribute('data-nav-ready', 'self');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
