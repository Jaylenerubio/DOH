/* =========================================================================
   Page translation for the prototype (PLACEHOLDER translations).
   Looks up every visible English string in scripts/i18n-strings.js
   (window.I18N_DICT: { "English text": { es, ar, zh } }) and swaps it for the
   client's language. Runs on load and watches for text the page's own
   scripts add later (errors, review values, sheets).
   - Matches whole strings after collapsing white space. A string with inline
     markup (links, bold) is matched as one phrase so word order can change.
   - "{x}" in a dictionary key matches any text and is carried into the
     translation (e.g. "Step {n} of {total}").
   - Skips: elements with data-i18n*, data-no-i18n, or their own lang
     attribute; script/style/svg. Strings not in the dictionary stay English.
   - Production: replace with real localization (message keys + locale files).
   ========================================================================= */
window.I18nDom = (function () {
  'use strict';
  var INLINE = { A: 1, STRONG: 1, EM: 1, B: 1, I: 1, SPAN: 1, BR: 1, BDI: 1, U: 1, SMALL: 1, SUP: 1, SUB: 1, CODE: 1, ABBR: 1 };
  var SKIP = { SCRIPT: 1, STYLE: 1, SVG: 1, NOSCRIPT: 1, TEXTAREA: 1, TITLE: 1 };
  var ATTRS = ['aria-label', 'placeholder', 'title', 'alt'];
  var LETTER = /[A-Za-zÀ-ɏ]/;
  var D = window.I18N_DICT || {}, templates = null, obs = null, missed = {};

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  function lang() { return window.I18n ? I18n.lang() : 'en'; }
  function skipEl(el) {
    return !el || el.nodeType !== 1 || SKIP[el.tagName.toUpperCase()] || el.hasAttribute('data-i18n') || el.hasAttribute('data-i18n-html') ||
      el.hasAttribute('data-no-i18n') || (el.hasAttribute('lang') && el !== document.documentElement);
  }
  /* Phrase key: innerHTML with attributes and inline icons removed, so keys stay short:
     'Start your <a>application<svg/></a>'. The original tags are kept and put back, in order, after translating. */
  function skeleton(html) {
    var by = {};
    var key = html.replace(/<svg[\s\S]*?<\/svg>/gi, function (m) { (by.svg = by.svg || []).push(m); return '<svg/>'; })
      .replace(/<(\/?)([a-z0-9]+)([^>]*)>/gi, function (m, close, name) {
        name = name.toLowerCase();
        if (close || name === 'svg') return close ? '</' + name + '>' : m;
        (by[name] = by[name] || []).push(m); return '<' + name + '>';
      });
    return { key: norm(key), by: by };
  }
  function rebuild(t, by) {
    var used = {};
    return t.replace(/<svg\/>|<([a-z0-9]+)>/gi, function (m, name) {
      name = (name || 'svg').toLowerCase(); var i = used[name] || 0; used[name] = i + 1;
      return by[name] && by[name][i] != null ? by[name][i] : m;
    });
  }
  function isPhrase(el) {
    var text = false, elems = 0, i, n;
    for (i = 0; i < el.childNodes.length; i++) {
      n = el.childNodes[i];
      if (n.nodeType === 3 && LETTER.test(n.nodeValue)) text = true;
      else if (n.nodeType === 1) { if (!INLINE[n.tagName.toUpperCase()]) return false; elems++; }
    }
    return text && elems > 0;
  }
  /* visitor: { text(node, key), phrase(el, key), attr(el, name, key) } */
  function walk(el, v) {
    if (skipEl(el)) return;
    ATTRS.forEach(function (a) { if (el.hasAttribute(a) && LETTER.test(el.getAttribute(a))) v.attr(el, a, norm(el.getAttribute(a))); });
    if (isPhrase(el)) { v.phrase(el, skeleton(el.innerHTML)); return; }
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3) { if (LETTER.test(n.nodeValue)) v.text(n, norm(n.nodeValue)); }
      else if (n.nodeType === 1) walk(n, v);
    }
  }

  function buildTemplates() {
    templates = [];
    Object.keys(D).forEach(function (k) {
      if (k.indexOf('{') < 0) return;
      var names = [], re = '^' + k.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{(\w+)\}/g, function (m, n) { names.push(n); return '(.+?)'; }) + '$';
      templates.push({ key: k, re: new RegExp(re), names: names });
    });
  }
  /* Brand names never break across lines in translated text. */
  var BRANDS = ['Dollar For', 'NYC Health', 'Con Edison', 'National Grid'];
  function glue(t) { BRANDS.forEach(function (b) { t = t.split(b).join(b.replace(' ', '\u00A0')); }); return t; }
  function lookup(key) { var t = lookupRaw(key); return t == null ? null : glue(t); }
  function lookupRaw(key) {
    var L = lang(), e = D[key];
    if (e && e[L]) return e[L];
    if (!templates) buildTemplates();
    for (var i = 0; i < templates.length; i++) {
      var m = key.match(templates[i].re), t = templates[i], ent = D[t.key];
      if (m && ent && ent[L]) {
        var out = ent[L];
        t.names.forEach(function (n, j) { out = out.split('{' + n + '}').join(translateValue(m[j + 1])); });
        return out;
      }
    }
    return null;
  }
  /* A captured value may itself be a known string (e.g. a program name). */
  function translateValue(v) {
    var L = lang(), e = D[v], out = e && e[L] ? e[L] : (v.indexOf('<') < 0 ? lookupRaw(v) : null);
    if (out == null) {
      out = v;
      /* Latin names inside Arabic sentences are isolated so punctuation and dashes don't jump around. */
      if (L === 'ar' && v.indexOf('<') < 0 && /[A-Za-z]/.test(v) && !/[\u0600-\u06FF]/.test(v)) out = '\u2068' + v + '\u2069';
    }
    return out;
  }

  var visitor = {
    text: function (node, key) {
      var o = node.__i18n; if (o && node.nodeValue === o.out) return;
      var t = lookup(key); if (t == null) { missed[key] = 1; return; }
      var src = node.nodeValue, lead = /^\s*/.exec(src)[0], trail = /\s*$/.exec(src)[0];
      var out = lead + t + trail; node.__i18n = { src: src, out: out }; node.nodeValue = out;
    },
    phrase: function (el, sk) {
      var o = el.__i18n; if (o && el.innerHTML === o.out) return;
      var t = lookup(sk.key); if (t == null) { missed[sk.key] = 1; return; }
      el.innerHTML = rebuild(t, sk.by); el.__i18n = { out: el.innerHTML };
    },
    attr: function (el, name, key) {
      el.__i18nA = el.__i18nA || {}; if (el.__i18nA[name] === el.getAttribute(name)) return;
      var t = lookup(key); if (t == null) { missed[key] = 1; return; }
      el.setAttribute(name, t); el.__i18nA[name] = t;
    }
  };

  function run(root) {
    if (lang() === 'en') return;
    if (obs) obs.disconnect();
    try {
      if (root.nodeType === 3) { if (LETTER.test(root.nodeValue) && !skipEl(root.parentNode)) visitor.text(root, norm(root.nodeValue)); }
      else if (root.nodeType === 1 || root.nodeType === 9) walk(root.nodeType === 9 ? root.documentElement : root, visitor);
      if (root.nodeType === 9 || root === document.documentElement || root === document.body) {
        var t = lookup(norm(document.title)); if (t) document.title = t;
      }
    } finally { if (obs) observe(); }
  }
  function observe() { obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS }); }
  function start() {
    if (lang() === 'en') return;
    run(document);
    obs = new MutationObserver(function (recs) {
      obs.disconnect();
      var seen = [];
      recs.forEach(function (r) {
        var t = r.target;
        if (r.type === 'childList') {
          if (t.nodeType === 1 && isPhraseTarget(t)) seen.push(t);
          r.addedNodes.forEach(function (n) { seen.push(n); });
        } else if (r.type === 'characterData') seen.push(t.parentNode && isPhraseTarget(t.parentNode) ? t.parentNode : t);
        else seen.push(t);
      });
      seen.forEach(function (n) { if (n && document.documentElement.contains(n)) { if (n.nodeType === 3 || n.nodeType === 1) { try { runOne(n); } catch (e) {} } } });
      observe();
    });
    observe();
  }
  function isPhraseTarget(el) { return el.nodeType === 1 && isPhrase(el); }
  function runOne(n) {
    if (n.nodeType === 3) { var p = n.parentNode; if (isPhraseTarget(p) && !skipEl(p)) visitor.phrase(p, skeleton(p.innerHTML)); else if (LETTER.test(n.nodeValue) && !skipEl(p)) visitor.text(n, norm(n.nodeValue)); }
    else walk(n, visitor);
  }
  /* collect(root): every English string the walker would try to translate (used to build the dictionary). */
  function collect(root) {
    var out = {};
    walk(root || document.documentElement, { text: function (n, k) { out[k] = 1; }, phrase: function (e, sk) { out[sk.key] = 1; }, attr: function (e, a, k) { out[k] = 1; } });
    return Object.keys(out);
  }
  if (window.I18n) I18n.onChange(function () {});   /* language changes reload the page */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  return { collect: collect, run: run, lookup: lookup, missed: function () { return Object.keys(missed); } };
})();
