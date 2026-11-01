/* ux-plus.js — site-wide UX polish. Load AFTER main.js on every page. */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 2 · Nav hides on scroll down, shows on scroll up */
  (function () {
    const nav = document.getElementById('nav'); if (!nav || reduce) return;
    let last = window.scrollY, ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY, menuOpen = document.getElementById('mobileNav')?.classList.contains('open');
        if (!menuOpen) nav.classList.toggle('nav-hidden', y > last && y > 240);
        last = y; ticking = false;
      });
    }, { passive: true });
    nav.addEventListener('focusin', () => nav.classList.remove('nav-hidden'));
  })();

  /* 3 · Pointer spotlight on cards */
  if (window.matchMedia('(pointer:fine)').matches && !reduce) {
    document.addEventListener('pointermove', e => {
      const c = e.target.closest && e.target.closest('.project-card, .widget-card'); if (!c) return;
      const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    /* 4 · Gentle magnetic buttons */
    document.querySelectorAll('.btn-primary').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .08) + 'px,' + ((e.clientY - r.top - r.height / 2) * .18) + 'px)'; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* 5 · Alt+T jumps to the terminal on the About page */
  document.addEventListener('keydown', e => {
    if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 't') { const t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return; e.preventDefault(); if (document.getElementById('terminal')) { document.getElementById('terminal').scrollIntoView({ behavior: 'smooth' }); document.getElementById('termInput')?.focus({ preventScroll: true }); } else location.href = 'about.html#terminal'; }
  });
})();
