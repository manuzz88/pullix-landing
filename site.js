(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll(
    '.intro-text, .specs-row, .video-frame, .machine, .ph, .feat, .audience-card, .specs-table, ' +
    '.cta-section h2, .cta-section .cta-sub, .cta-section .cta-actions'
  );

  var perParent = {};
  targets.forEach(function (el) {
    el.classList.add('reveal');
    var key = el.parentNode;
    var i = (perParent.set = perParent.set || new Map()).get(key) || 0;
    perParent.set.set(key, i + 1);
    el.style.transitionDelay = Math.min(i * 60, 360) + 'ms';
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();

/* Google Analytics — si attiva solo dopo il consenso */
(function () {
  var GA_ID = 'G-D70J3L8M24';
  var KEY = 'pullix-consent';

  function loadGA() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === 'yes') { loadGA(); return; }
  if (choice === 'no') return;

  var en = document.documentElement.lang === 'en';
  var bar = document.createElement('div');
  bar.className = 'cookie-bar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', en ? 'Cookie consent' : 'Consenso cookie');
  bar.innerHTML =
    '<p>' + (en
      ? 'We use cookies for anonymous visit statistics (Google Analytics) — only if you accept. <a href="/en/privacy/">More info</a>'
      : 'Usiamo i cookie per statistiche anonime sulle visite (Google Analytics) — solo se accetti. <a href="/privacy/">Maggiori info</a>') + '</p>' +
    '<div class="cookie-actions">' +
    '<button class="ck-yes">' + (en ? 'Accept' : 'Accetta') + '</button>' +
    '<button class="ck-no">' + (en ? 'Decline' : 'Rifiuta') + '</button>' +
    '</div>';
  document.body.appendChild(bar);

  function done(val) {
    try { localStorage.setItem(KEY, val); } catch (e) {}
    bar.remove();
    if (val === 'yes') loadGA();
  }
  bar.querySelector('.ck-yes').addEventListener('click', function () { done('yes'); });
  bar.querySelector('.ck-no').addEventListener('click', function () { done('no'); });
})();
