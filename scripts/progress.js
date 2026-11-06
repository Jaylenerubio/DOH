/* Intake progress bar. One place decides how many steps there are.
   Self-service has 5 steps (language, privacy, contact, review, code); the CHW
   flow has 4. A page declares its position in each flow:
     <div class="progress" data-self-step="2" data-chw-step="1"></div>
   A page used by only one flow declares only that attribute. The channel comes
   from sessionStorage 'nyc.channel' ('self' for self-service). Load this script
   immediately after the element so the bar never flashes the wrong count. */
(function () {
  'use strict';
  var TOTAL = { self: 5, chw: 4 };
  var bar = document.querySelector('.progress[data-self-step], .progress[data-chw-step]');
  if (!bar) return;
  var channel = 'chw';
  try { if (sessionStorage.getItem('nyc.channel') === 'self') channel = 'self'; } catch (e) {}
  var step = parseInt(bar.getAttribute('data-' + channel + '-step'), 10);
  if (isNaN(step)) step = parseInt(bar.getAttribute('data-' + (channel === 'self' ? 'chw' : 'self') + '-step'), 10) || 0;
  var total = TOTAL[bar.hasAttribute('data-' + channel + '-step') ? channel : (channel === 'self' ? 'chw' : 'self')];
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', String(total)); bar.setAttribute('aria-valuenow', String(step));
  bar.setAttribute('aria-label', 'Step ' + step + ' of ' + total);
  for (var i = 0; i < total; i++) {
    var seg = document.createElement('span');
    seg.className = 'progress__seg' + (i < step ? ' is-complete' : '');
    bar.appendChild(seg);
  }
})();
