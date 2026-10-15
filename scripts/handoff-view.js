/* =========================================================================
   Handoff pages opened from the dashboard ("View details").
   Same page as the end of screening, with:
   - "Back to dashboard" above the title; no bottom "Return to dashboard".
   - Intro text in #191919.
   - Partner-application programs (Hospital bills, Energy discounts, Tax
     credits): before applying → primary "Start your application";
     after → dated sentence, step 1 checked ("You started…"), Important note
     hidden, program-name title (EAP/EEAP), primary "Finish your application"
     / "Finish your return".
   - Referral programs (Health insurance, Eviction): dated referral sentence,
     no footer.
   Runs after the page's own script and Pillars.wireHandoff. Trigger:
   ?from=dashboard. The page names its program on the .step element:
   data-handoff="hospital-bills" etc.
   ========================================================================= */
(function () {
  'use strict';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.825 10.9999H19C19.2833 10.9999 19.5208 11.0957 19.7125 11.2874C19.9042 11.4791 20 11.7166 20 11.9999C20 12.2832 19.9042 12.5207 19.7125 12.7124C19.5208 12.9041 19.2833 12.9999 19 12.9999H7.825L12.725 17.8999C12.925 18.0999 13.0208 18.3332 13.0125 18.5999C13.0042 18.8666 12.9 19.0999 12.7 19.2999C12.5 19.4832 12.2667 19.5791 12 19.5874C11.7333 19.5957 11.5 19.4999 11.3 19.2999L4.7 12.6999C4.6 12.5999 4.52917 12.4916 4.4875 12.3749C4.44583 12.2582 4.425 12.1332 4.425 11.9999C4.425 11.8666 4.44583 11.7416 4.4875 11.6249C4.52917 11.5082 4.6 11.3999 4.7 11.2999L11.3 4.69989C11.4833 4.51656 11.7125 4.42489 11.9875 4.42489C12.2625 4.42489 12.5 4.51656 12.7 4.69989C12.9 4.89989 13 5.13739 13 5.41239C13 5.68739 12.9 5.92489 12.7 6.12489L7.825 10.9999Z" fill="currentColor"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12 L10 17 L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function q(name) { var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search); return m ? decodeURIComponent(m[1]) : ''; }
  function read(k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function raw(k) { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function fmt(iso, withYear) {
    var d = iso ? new Date(iso) : new Date();
    if (isNaN(d.getTime())) d = new Date();
    return d.toLocaleDateString('en-US', withYear ? { month: 'long', day: 'numeric', year: 'numeric' } : { month: 'long', day: 'numeric' });
  }
  function b(s) { return '<span class="handoff__em">' + s + '</span>'; }

  var UTIL = { coned: 'Con Edison', 'national-grid': 'National Grid', both: 'Con Edison and National Grid', neither: 'utility' };
  var TSU = { notice: 'landlord gave notice of eviction proceedings', court: 'eviction case in Housing Court', utilities: 'landlord shut off utilities', lock: 'lock changed or removed without court order', belongings: 'belongings removed without court order', none: 'a different housing issue' };
  var HI_NEED = { enroll: 'enrolling in health insurance', renew: 'renewing your health insurance', info: 'your health insurance options' };
  var HI_TIME = { morning: 'in the morning', evening: 'in the evening', anytime: 'anytime' };

  /* Per-program content for the dashboard-opened view. */
  var CONFIG = {
    'hospital-bills': {
      intro: function (d, date) {
        var bill = d.amount ? 'your ' + b('$' + d.amount) + ' bill' : 'your bill';
        return 'You started your Dollar For application for ' + bill + (d.hospital ? ' from ' + d.hospital : '') + ' on ' + b(date) + '.';
      },
      step1: function (date) { return 'You started Dollar For’s simplified application on ' + date + '.'; },
      submittedIntro: function (d, date) {
        var bill = d.amount ? 'your ' + b('$' + d.amount) + ' bill' : 'your bill';
        return 'Dollar For received your application for ' + bill + (d.hospital ? ' from ' + d.hospital : '') + ' on ' + b(date) + '.';
      },
      submittedStep1: function (date) { return 'You submitted Dollar For\u2019s simplified application on ' + date + '.'; },
      note: '.df-note', finish: 'Finish your application'
    },
    'financial-help': {
      title: function (d) { return d.path === 'eeap' ? 'Enhanced Energy Affordability Program (EEAP)' : 'Energy Affordability Program (EAP)'; },
      list: function (d) { return d.path === 'eeap' ? '#stepsEeap' : '#stepsEap'; },
      intro: function (d, date) {
        var u = Array.isArray(d.utility) ? d.utility[0] : d.utility;
        return 'You started your ' + (d.path === 'eeap' ? 'EEAP' : 'EAP') + ' application for your ' + b(UTIL[u] || 'utility') + ' account on ' + b(date) + '.';
      },
      step1: function (date, d) { return d.path === 'eeap' ? 'You started your EEAP application on ' + date + '.' : 'You started your Benefits Enrollment Assistant application on ' + date + '.'; },
      finish: 'Finish your application'
    },
    'tax-credits': {
      intro: function (d, date) { return 'You started your GetYourRefund return on ' + b(date) + '.'; },
      step1: function (date) { return 'You started your return on GetYourRefund on ' + date + '.'; },
      finish: 'Finish your return'
    },
    'medicaid': {
      referral: function (d, date) {
        var site = document.querySelector('[data-site-name]'); var name = site ? site.textContent : 'your enrollment site';
        return 'We asked an enrollment counselor at ' + name + ' to call you ' + (HI_TIME[d.time] || 'during the day') + ' about ' + (HI_NEED[d.need] || 'health insurance') + '. Sent ' + b(date) + '. Expect a call within ' + b('three business days (72 hours).');
      },
      note: 'We\u2019ll also email you this site information so you can find it later.'
    },
    'anti-eviction': {
      referral: function (d, date) {
        var arr = Array.isArray(d) ? d : (d.situations || []);
        var what = arr.length ? ' (' + b(arr.map(function (k) { return TSU[k] || k; }).join('; ')) + ')' : '';
        return 'We sent your situation' + what + ' to the NYC Tenant Support Unit on ' + b(date) + '. A tenant support specialist will contact you in 2–3 business days.';
      }
    }
  };
  var STORE = { 'hospital-bills': 'nyc.df', 'medicaid': 'nyc.hi', 'anti-eviction': 'nyc.tsu', 'financial-help': 'nyc.eap', 'tax-credits': 'nyc.eitc' };

  function init() {
    if (q('from') !== 'dashboard') return;
    var root = document.querySelector('[data-handoff]'); if (!root) return;
    var key = root.getAttribute('data-handoff'), cfg = CONFIG[key]; if (!cfg) return;
    var P = window.Pillars;
    var d = read(STORE[key]) || {};
    var applied = P && P.isApplied(key);
    var submitted = P && P.isSubmitted && P.isSubmitted(key) && cfg.submittedIntro;
    var appliedAt = raw('nyc.applied.' + key), completedAt = raw('nyc.completed.' + key), submittedAt = raw('nyc.submitted.' + key);

    root.classList.add('handoff-view');

    /* Back to dashboard above the title */
    var h1 = root.querySelector('.step__title');
    var back = document.createElement('a');
    back.className = 'handoff__back'; back.href = 'dashboard.html'; back.innerHTML = ARROW + 'Back to dashboard';
    if (h1) h1.parentNode.insertBefore(back, h1);

    var intro = root.querySelector('main .step__text');
    var btn = document.getElementById('nextPillarBtn'), rec = document.getElementById('recordBtn'), footer = root.querySelector('.step__footer');
    if (rec) rec.hidden = true;

    /* Not-eligible pages: back link on top, no footer. */
    if (root.hasAttribute('data-ineligible')) { if (footer) footer.hidden = true; return; }

    if (cfg.referral) {
      /* Referral programs: dated sentence, no footer. */
      var html = cfg.referral(d, fmt(completedAt, true));
      if (intro) intro.innerHTML = html; else if (h1) { var p = document.createElement('p'); p.className = 'step__text'; p.innerHTML = html; h1.parentNode.insertBefore(p, h1.nextSibling); }
      if (cfg.note && !root.querySelector('.handoff-note')) {
        var main = root.querySelector('main');
        var nb = document.createElement('div'); nb.className = 'handoff-note';
        nb.innerHTML = '<p class="handoff-note__title">Important note</p><p class="handoff-note__body">' + cfg.note + '</p>';
        main.appendChild(nb);
      }
      if (footer) footer.hidden = true;
      return;
    }

    if (!applied) {
      if (btn) btn.innerHTML = 'Start your application<span class="sr-only"> (opens in new tab)</span>';
      return;
    }

    /* Applied: dated intro, step 1 done, note hidden, program-name title, Finish CTA.
       Submitted (partner confirmed, demo): same, with received wording and no CTA. */
    var when = submitted ? submittedAt : appliedAt;
    var date = fmt(when, false), dateYear = fmt(when, true);
    if (cfg.title && h1) {
      var t = h1.querySelector('#nextTitle'); if (t) t.textContent = cfg.title(d);
    }
    var introHtml = submitted ? cfg.submittedIntro(d, dateYear) : cfg.intro(d, dateYear);
    if (intro) intro.innerHTML = introHtml;
    else if (h1) { var ip = document.createElement('p'); ip.className = 'step__text'; ip.innerHTML = introHtml; h1.parentNode.insertBefore(ip, h1.nextSibling); }
    var list = root.querySelector(cfg.list ? cfg.list(d) : '.nsteps');
    var first = list && list.querySelector('.nstep');
    if (first) {
      var num = first.querySelector('.nstep__num');
      if (num) { num.className = 'nstep__num nstep__num--done'; num.removeAttribute('aria-hidden'); num.innerHTML = CHECK + '<span class="sr-only">Done: </span>'; }
      var body = first.querySelector('.nstep__body');
      if (body) body.innerHTML = '<h2 class="nstep__title">' + (submitted ? cfg.submittedStep1(date, d) : cfg.step1(date, d)) + '</h2>';
    }
    if (cfg.note) { var n = root.querySelector(cfg.note); if (n) n.hidden = true; }
    if (submitted) { if (footer) footer.hidden = true; return; }
    if (btn) {
      var fresh = btn.cloneNode(false); fresh.innerHTML = cfg.finish + '<span class="sr-only"> (opens in new tab)</span>'; btn.parentNode.replaceChild(fresh, btn);
      fresh.addEventListener('click', function () {
        var u = P ? P.applyUrl(key) : '#';
        if (u.charAt(0) !== '#') window.open(u, '_blank', 'noopener');
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { window.setTimeout(init, 0); }); else window.setTimeout(init, 0);
})();
