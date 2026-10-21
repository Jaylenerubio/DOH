/* =========================================================================
   Handoff pages opened from the dashboard ("View details", ?from=dashboard).
   Static: the page's own content is unchanged.
   - "Back to dashboard" link above the title.
   - Not-eligible pages and referral programs (Health insurance, Eviction):
     no footer.
   - Application programs (Hospital bills, Energy discounts, Tax credits):
     primary "Start your application" opens the partner link in a new tab;
     no state changes.
   The page names its program on the .step element: data-handoff="...".
   Runs after the page's own script and Pillars.wireHandoff.
   ========================================================================= */
(function () {
  'use strict';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.825 10.9999H19C19.2833 10.9999 19.5208 11.0957 19.7125 11.2874C19.9042 11.4791 20 11.7166 20 11.9999C20 12.2832 19.9042 12.5207 19.7125 12.7124C19.5208 12.9041 19.2833 12.9999 19 12.9999H7.825L12.725 17.8999C12.925 18.0999 13.0208 18.3332 13.0125 18.5999C13.0042 18.8666 12.9 19.0999 12.7 19.2999C12.5 19.4832 12.2667 19.5791 12 19.5874C11.7333 19.5957 11.5 19.4999 11.3 19.2999L4.7 12.6999C4.6 12.5999 4.52917 12.4916 4.4875 12.3749C4.44583 12.2582 4.425 12.1332 4.425 11.9999C4.425 11.8666 4.44583 11.7416 4.4875 11.6249C4.52917 11.5082 4.6 11.3999 4.7 11.2999L11.3 4.69989C11.4833 4.51656 11.7125 4.42489 11.9875 4.42489C12.2625 4.42489 12.5 4.51656 12.7 4.69989C12.9 4.89989 13 5.13739 13 5.41239C13 5.68739 12.9 5.92489 12.7 6.12489L7.825 10.9999Z" fill="currentColor"/></svg>';

  var REFERRAL = { 'medicaid': 1, 'anti-eviction': 1 };

  function q(name) { var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search); return m ? decodeURIComponent(m[1]) : ''; }

  function init() {
    if (q('from') !== 'dashboard') return;
    var root = document.querySelector('[data-handoff]'); if (!root) return;
    var key = root.getAttribute('data-handoff');
    root.classList.add('handoff-view');

    var h1 = root.querySelector('.step__title');
    var back = document.createElement('a');
    back.className = 'handoff__back'; back.href = 'dashboard.html'; back.innerHTML = ARROW + 'Back to dashboard';
    if (h1) h1.parentNode.insertBefore(back, h1);

    var btn = document.getElementById('nextPillarBtn'), rec = document.getElementById('recordBtn'), footer = root.querySelector('.step__footer');
    if (rec) rec.hidden = true;
    if (root.hasAttribute('data-ineligible') || REFERRAL[key]) { if (footer) footer.hidden = true; return; }
    if (btn) {
      var fresh = btn.cloneNode(false);
      fresh.innerHTML = 'Start your application<span class="sr-only"> (opens in new tab)</span>';
      btn.parentNode.replaceChild(fresh, btn);
      fresh.addEventListener('click', function () {
        var u = window.Pillars ? window.Pillars.applyUrl(key) : '#';
        if (u.charAt(0) !== '#') window.open(u, '_blank', 'noopener');
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { window.setTimeout(init, 0); }); else window.setTimeout(init, 0);
})();
