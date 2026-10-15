/* Dollar inputs: live thousands separators (20000 → 20,000). Digits only;
   the formatted string is what gets stored/displayed. Attaches to every
   .df-money__input and [data-money] on load, and re-formats on pageshow so
   restored values pick up commas too. */
window.Money = (function () {
  'use strict';
  function format(v) {
    var d = String(v || '').replace(/\D/g, '').replace(/^0+(?=\d)/, '');
    return d.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function attach(el) {
    if (!el || el.getAttribute('data-money-bound')) return;
    el.setAttribute('data-money-bound', '1');
    el.addEventListener('input', function () {
      var digitsBefore = el.value.slice(0, el.selectionStart || 0).replace(/\D/g, '').length;
      el.value = format(el.value);
      // Keep the caret after the same digit it followed before formatting.
      var pos = 0, seen = 0;
      while (pos < el.value.length && seen < digitsBefore) { if (/\d/.test(el.value[pos])) seen++; pos++; }
      try { el.setSelectionRange(pos, pos); } catch (e) {}
    });
    el.value = format(el.value);
  }
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.df-money__input, [data-money]'), attach);
  }
  function refresh() {
    Array.prototype.forEach.call(document.querySelectorAll('.df-money__input, [data-money]'), function (el) { el.value = format(el.value); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('pageshow', function () { window.setTimeout(refresh, 0); });
  return { format: format, attach: attach };
})();
