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
