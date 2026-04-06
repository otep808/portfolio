/* ================================================================
   main.js — Joseph S. Callos Portfolio
   Shared: theme toggle · cursor · nav · progress · reveal · skills
   Pages: index · projects · contact · games
   Easter eggs: Konami · Console art · Logo clicks
   ================================================================ */

/* ── THEME TOGGLE WITH CIRCULAR REVEAL (View Transitions API) ── */
(function () {
  const root  = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', saved);

  function updateLogos(theme) {
    document.querySelectorAll('.site-logo').forEach(img => {
      img.src = theme === 'dark' ? 'images/logo-dark.svg' : 'images/logo-light.svg';
    });
  }

  window.addEventListener('DOMContentLoaded', () => updateLogos(saved));

  function applyTheme(next, x, y) {
    localStorage.setItem('theme', next);
    if (!document.startViewTransition) {
      root.setAttribute('data-theme', next);
      updateLogos(next);
      return;
    }
    const transition = document.startViewTransition(() => {
      root.setAttribute('data-theme', next);
      updateLogos(next);
    });
    const maxR = Math.hypot(
      Math.max(x, window.innerWidth  - x),
      Math.max(y, window.innerHeight - y)
    );
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxR}px at ${x}px ${y}px)`] },
        { duration: 620, easing: 'cubic-bezier(0.4,0,0.2,1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }

  document.getElementById('navLogoBtn')?.addEventListener('click', e => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    const rect    = e.currentTarget.getBoundingClientRect();
    applyTheme(next, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
})();


/* ── PROGRESS BAR ─────────────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
  });
}


/* ── CUSTOM CURSOR ────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
if (cursor && window.matchMedia('(pointer:fine)').matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    cx += (mx - cx) * 0.16;
    cy += (my - cy) * 0.16;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.project-card,.highlight-box,.tool-card,.fact-card,.cert-card,.game-tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });
  document.addEventListener('mouseleave', () => cursor.classList.add('hide'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('hide'));
} else if (cursor) {
  cursor.style.display = 'none';
}


/* ── STICKY NAV ───────────────────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));
}


/* ── ACTIVE NAV LINK ──────────────────────────────────────────── */
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();


/* ── MOBILE NAV ───────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

function toggleMobile() {
  if (!hamburger || !mobileNav) return;
  const open = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMobile() {
  if (!hamburger || !mobileNav) return;
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}
if (hamburger) hamburger.addEventListener('click', toggleMobile);


/* ── PAGE TRANSITION ──────────────────────────────────────────── */
const cover = document.getElementById('page-cover');
if (cover) {
  cover.style.transition = 'transform .55s cubic-bezier(.76,0,.24,1)';
  cover.style.transform  = 'scaleY(1)';
  cover.style.transformOrigin = 'bottom';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    cover.style.transform = 'scaleY(0)';
  }));
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        link.hasAttribute('target')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      cover.style.transformOrigin = 'top';
      cover.style.transform = 'scaleY(1)';
      setTimeout(() => window.location.href = href, 480);
    });
  });
}


/* ── SCROLL REVEAL ────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => obs.observe(el));
}


/* ── SKILL BAR ANIMATION ──────────────────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');
if (skillFills.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animated'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(el => obs.observe(el));
}


/* ================================================================
   EASTER EGGS
   ================================================================ */

/* ── #1 CONSOLE ART ───────────────────────────────────────────── */
(function () {
  const art = [
    ' ██████╗ ████████╗███████╗██████╗ ',
    '██╔═══██╗╚══██╔══╝██╔════╝██╔══██╗',
    '██║   ██║   ██║   █████╗  ██████╔╝',
    '██║   ██║   ██║   ██╔══╝  ██╔═══╝ ',
    '╚██████╔╝   ██║   ███████╗██║     ',
    ' ╚═════╝    ╚═╝   ╚══════╝╚═╝     ',
    '         C O D E S  ·  2025       '
  ].join('\n');
  console.log(`%c${art}`, 'color:#4d7fe6;font-family:monospace;font-size:10px;line-height:1.4');
  console.log('%c👋  Hey there, fellow developer!', 'color:#c49a4a;font-size:14px;font-weight:bold');
  console.log('%c⏱   Time is Gold — even for inspecting source code 😄', 'color:#e8e4d8;font-size:12px');
  console.log('%c🎮  Psst: Try the Konami code on any page...  ⬆⬆⬇⬇⬅➡⬅➡BA', 'color:#7aa3f0;font-size:11px;font-style:italic');
  console.log('%c🎸  Also: click the logo 7 times for a surprise 🎵', 'color:#7aa3f0;font-size:11px;font-style:italic');
})();


/* ── #2 KONAMI CODE ───────────────────────────────────────────── */
(function () {
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;

  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[kIdx]) {
      kIdx++;
      if (kIdx === KONAMI.length) { kIdx = 0; launchKonami(); }
    } else {
      kIdx = e.key === KONAMI[0] ? 1 : 0;
    }
  });

  function launchKonami() {
    if (document.getElementById('konami-overlay')) return;
    const stars = Array.from({ length: 30 }, (_, i) => {
      const s = document.createElement('div');
      s.className = 'konami-star';
      const angle = (i / 30) * 360;
      const dist  = 80 + Math.random() * 180;
      s.style.setProperty('--angle', angle + 'deg');
      s.style.setProperty('--dist', dist + 'px');
      s.style.setProperty('--delay', (Math.random() * 0.4) + 's');
      s.style.setProperty('--col', Math.random() > 0.5 ? 'var(--blue)' : 'var(--gold)');
      return s.outerHTML;
    }).join('');
    const el = document.createElement('div');
    el.id = 'konami-overlay';
    el.innerHTML = `
      <div class="konami-bg"></div>
      <div class="konami-inner">
        <div class="konami-burst">${stars}</div>
        <p class="konami-badge">🕹️ SECRET UNLOCKED</p>
        <h2 class="konami-title">You Found <em>Otep's</em><br>Easter Egg!</h2>
        <p class="konami-seq">⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ 🅱 🅰</p>
        <p class="konami-quote"><em>"Time is Gold — and you just spent some on a<br>Konami Code. I respect that. <strong>A lot.</strong>"</em></p>
        <p class="konami-sig">— Joseph "Otep" Callos</p>
        <div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;margin-top:2rem;">
          <button class="btn btn-primary konami-close"><span>← Back to Portfolio</span></button>
          <a href="games.html" class="btn btn-outline">🎮 Play Mini Games</a>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    el.querySelector('.konami-close').addEventListener('click', () => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 500);
    });
    el.addEventListener('click', e => {
      if (e.target === el) { el.classList.remove('show'); setTimeout(() => el.remove(), 500); }
    });
  }
})();


/* ── #3 LOGO CLICK COUNTER ────────────────────────────────────── */
(function () {
  let clicks = 0, timer;
  document.getElementById('navLogoBtn')?.addEventListener('click', () => {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 2200);
    if (clicks >= 7) {
      clicks = 0;
      showToast('🎸  Otep\'s top 2: The Beatles & Jim Croce 🎵  "Time is Gold!"', 4500);
    }
  });
})();


/* ── TOAST UTILITY ────────────────────────────────────────────── */
function showToast(msg, duration = 3000) {
  document.querySelectorAll('.otep-toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'otep-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, duration);
}
window.showOtepToast = showToast;


/* ================================================================
   PAGE: INDEX — Canvas, Typewriter, Counters, Play Button
   ================================================================ */
(function () {
  /* ── CANVAS PARTICLES ─────────────────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouseX = -9999, mouseY = -9999;

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); init(); });

  function Particle() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.r  = Math.random() * 1.3 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
    this.a  = Math.random() * 0.4 + 0.06;
    this.blue = Math.random() > 0.5;
  }

  function init() {
    const n = Math.min(Math.floor(W * H / 8500), 130);
    particles = Array.from({ length: n }, () => new Particle());
  }
  init();

  document.getElementById('hero')?.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left; mouseY = e.clientY - r.top;
  });

  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          const col = isDark() ? `rgba(77,127,230,${0.14*(1-d/130)})` : `rgba(40,85,212,${0.09*(1-d/130)})`;
          ctx.beginPath(); ctx.strokeStyle = col; ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      const mdx = p.x - mouseX, mdy = p.y - mouseY;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 100) { p.vx += (mdx / md) * 0.08; p.vy += (mdy / md) * 0.08; }
      const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (sp > 1.2) { p.vx = (p.vx / sp) * 1.2; p.vy = (p.vy / sp) * 1.2; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const col = p.blue
        ? (isDark() ? `rgba(77,127,230,${p.a})`    : `rgba(40,85,212,${p.a * 0.7})`)
        : (isDark() ? `rgba(196,154,74,${p.a*0.7})` : `rgba(154,112,48,${p.a * 0.6})`);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();

  /* ── TYPEWRITER ─────────────────────────────────────────────── */
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    const phrases = ['Full-Stack Developer','GUI Designer','Problem Solver','BSIT Student @ PLV','Night Owl Coder','Otep Codes'];
    let pi = 0, ci = 0, del = false;
    function tick() {
      const p = phrases[pi];
      if (!del) {
        twEl.textContent = p.slice(0, ++ci);
        if (ci === p.length) { del = true; setTimeout(tick, 1900); return; }
        setTimeout(tick, 82);
      } else {
        twEl.textContent = p.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 380); return; }
        setTimeout(tick, 46);
      }
    }
    setTimeout(tick, 700);
  }

  /* ── ANIMATED COUNTERS ──────────────────────────────────────── */
  const counters = document.querySelectorAll('.count');
  if (counters.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const target = +e.target.dataset.target, step = target / 40;
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + step, target);
          e.target.textContent = Math.ceil(cur);
          if (cur >= target) clearInterval(t);
        }, 35);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  /* ── PLAY BUTTON ────────────────────────────────────────────── */
  document.getElementById('playBtn')?.addEventListener('click', () => {
    showToast('🎬 Demo reel coming soon — stay tuned!', 3200);
  });
})();


/* ================================================================
   PAGE: PROJECTS — Filter Tabs
   ================================================================ */
(function () {
  const tabs     = document.querySelectorAll('.filter-btn');
  if (!tabs.length) return;
  const cards    = document.querySelectorAll('#projectsGrid .project-card');
  const dividers = document.querySelectorAll('#projectsGrid .section-divider');
  const counter  = document.getElementById('proj-count');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      let v = 0;
      dividers.forEach(d => { d.style.display = (f === 'all') ? '' : 'none'; });
      cards.forEach(c => {
        const cats = (c.dataset.cat || '').split(' ');
        const show = f === 'all' || cats.includes(f);
        if (show) {
          c.classList.remove('hidden');
          c.style.animation = 'filterIn .4s var(--ease-out) both';
          v++;
        } else {
          c.classList.add('hidden');
        }
      });
      if (counter) counter.textContent = v;
    });
  });
})();


/* ================================================================
   PAGE: CONTACT — Char Counter + Form Validation
   ================================================================ */
(function () {
  const textarea = document.getElementById('fmsg');
  if (!textarea) return;

  const counter = document.getElementById('charCount');

  textarea.addEventListener('input', () => {
    const l = textarea.value.length;
    counter.textContent = l;
    counter.style.color = l > 480 ? 'var(--red)' : 'var(--text-faint)';
    if (l > 500) textarea.value = textarea.value.slice(0, 500);
  });

  function validate(id, errId, check) {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    const ok    = check(input.value.trim());
    input.classList.toggle('error', !ok);
    err.classList.toggle('show', !ok);
    return ok;
  }

  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const ok = [
      validate('fname',    'err-fname',    v => v.length > 0),
      validate('femail',   'err-femail',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
      validate('fsubject', 'err-fsubject', v => v.length > 0),
      validate('fmsg',     'err-fmsg',     v => v.length >= 10),
    ].every(Boolean);
    if (!ok) return;
    const btn = document.getElementById('submitBtn');
    const txt = document.getElementById('btnText');
    btn.disabled = true; txt.textContent = 'Sending…';
    setTimeout(() => {
      btn.disabled = false; txt.textContent = 'Send Message →';
      document.getElementById('formSuccess').classList.add('show');
      document.getElementById('contactForm').reset();
      counter.textContent = '0';
      setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 4000);
    }, 1500);
  });
})();


/* ================================================================
   PAGE: GAMES — All Game Logic
   ================================================================ */
(function () {
  if (!document.getElementById('gameTabs')) return;

  /* ── GAME TAB SWITCHER ──────────────────────────────────────── */
  const tabs   = document.querySelectorAll('.game-tab-btn');
  const panels = document.querySelectorAll('.game-panel');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('game-' + btn.dataset.game).classList.add('active');
    });
  });


  /* ================================================================
     GAME 1 — SNAKE
     ================================================================ */
  (function () {
    const canvas = document.getElementById('snakeCanvas');
    if (!canvas) return;
    const ctx   = canvas.getContext('2d');
    const CELL  = 20;
    const COLS  = canvas.width  / CELL;
    const ROWS  = canvas.height / CELL;

    let snake, dir, nextDir, food, score, highScore, level, speed, running, loop;
    highScore = +localStorage.getItem('snake_hs') || 0;
    document.getElementById('snakeHigh').textContent = highScore;

    function rand(max) { return Math.floor(Math.random() * max); }

    function spawnFood() {
      let pos;
      do { pos = { x: rand(COLS), y: rand(ROWS) }; }
      while (snake.some(s => s.x === pos.x && s.y === pos.y));
      return pos;
    }

    function init() {
      const mx = Math.floor(COLS / 2), my = Math.floor(ROWS / 2);
      snake = [{ x: mx, y: my }, { x: mx - 1, y: my }, { x: mx - 2, y: my }];
      dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 };
      food = spawnFood(); score = 0; level = 1; speed = 140; running = false;
      document.getElementById('snakeScore').textContent = 0;
      document.getElementById('snakeLevel').textContent = 1;
      document.getElementById('snakeMsg').textContent   = '';
      draw();
    }

    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    function draw() {
      const bg   = isDark() ? '#0d0e18' : '#e6e9f5';
      const grid = isDark() ? 'rgba(77,127,230,.06)' : 'rgba(40,85,212,.05)';
      ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = grid; ctx.lineWidth = 0.5;
      for (let i = 0; i <= COLS; i++) { ctx.beginPath(); ctx.moveTo(i*CELL,0); ctx.lineTo(i*CELL,canvas.height); ctx.stroke(); }
      for (let j = 0; j <= ROWS; j++) { ctx.beginPath(); ctx.moveTo(0,j*CELL); ctx.lineTo(canvas.width,j*CELL); ctx.stroke(); }
      const goldCol = isDark() ? '#c49a4a' : '#9a7030';
      ctx.fillStyle = goldCol; ctx.shadowColor = goldCol; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(food.x*CELL+CELL/2, food.y*CELL+CELL/2, CELL/2-2, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      snake.forEach((seg, i) => {
        const t = i / snake.length;
        const r = isDark()
          ? `rgba(77,${Math.floor(127-t*40)},230,${1-t*0.3})`
          : `rgba(40,${Math.floor(85-t*30)},212,${1-t*0.3})`;
        ctx.fillStyle = r;
        ctx.shadowColor = i === 0 ? (isDark() ? '#4d7fe6' : '#2855d4') : 'transparent';
        ctx.shadowBlur  = i === 0 ? 10 : 0;
        ctx.fillRect(seg.x*CELL+1, seg.y*CELL+1, CELL-2, CELL-2);
      });
      ctx.shadowBlur = 0;
    }

    function step() {
      dir = { ...nextDir };
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { gameOver(); return; }
      if (snake.some(s => s.x === head.x && s.y === head.y)) { gameOver(); return; }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('snakeScore').textContent = score;
        if (score > highScore) { highScore = score; localStorage.setItem('snake_hs', highScore); document.getElementById('snakeHigh').textContent = highScore; }
        food = spawnFood();
        if (score % 5 === 0) { level++; speed = Math.max(60, speed-10); document.getElementById('snakeLevel').textContent = level; clearInterval(loop); loop = setInterval(tick, speed); }
      } else { snake.pop(); }
      draw();
    }

    function tick() { if (running) step(); }

    function start() {
      init(); running = true;
      document.getElementById('snakeStartTxt').textContent = 'Restart →';
      clearInterval(loop); loop = setInterval(tick, speed);
    }

    function gameOver() {
      running = false; clearInterval(loop);
      document.getElementById('snakeMsg').innerHTML = `Game Over — Score: <strong style="color:var(--blue)">${score}</strong>`;
      ctx.fillStyle = 'rgba(8,9,17,.65)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = isDark() ? '#e8e4d8' : '#0e1120';
      ctx.font = `300 28px 'Cormorant Garamond',serif`; ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2-10);
      ctx.font = `300 16px 'Space Mono',monospace`; ctx.fillStyle = '#4d7fe6';
      ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2+20);
      ctx.textAlign = 'left';
    }

    const KEY_MAP = {
      ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},
      w:{x:0,y:-1},W:{x:0,y:-1},s:{x:0,y:1},S:{x:0,y:1},
      a:{x:-1,y:0},A:{x:-1,y:0},d:{x:1,y:0},D:{x:1,y:0}
    };

    document.addEventListener('keydown', e => {
      if (e.key === ' ') { e.preventDefault(); if (!running) start(); return; }
      const d = KEY_MAP[e.key]; if (!d) return;
      if (e.key.startsWith('Arrow')) e.preventDefault();
      if (d.x !== -dir.x || d.y !== -dir.y) nextDir = d;
    });

    document.getElementById('snakeStart').addEventListener('click', start);

    const dMap = { dUp:{x:0,y:-1}, dDown:{x:0,y:1}, dLeft:{x:-1,y:0}, dRight:{x:1,y:0} };
    Object.entries(dMap).forEach(([id,d]) => {
      document.getElementById(id)?.addEventListener('click', () => {
        if (d.x !== -dir.x || d.y !== -dir.y) nextDir = d;
      });
    });

    init();
  })();


  /* ================================================================
     GAME 2 — MEMORY MATCH
     ================================================================ */
  (function () {
    const PAIRS = [
      {icon:'⚡',label:'HTML5'},{icon:'🎨',label:'CSS3'},{icon:'✨',label:'JS'},
      {icon:'🐍',label:'Python'},{icon:'☕',label:'Java'},{icon:'🗄️',label:'SQL'},
      {icon:'🔧',label:'Git'},{icon:'🖼️',label:'Figma'}
    ];
    let flipped=[], matched=0, moves=0, seconds=0, timer, locked=false;

    function shuffle(arr) {
      const a = [...arr];
      for (let i = a.length-1; i > 0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
      return a;
    }

    function buildGrid() {
      const grid  = document.getElementById('memGrid');
      const cards = shuffle([...PAIRS,...PAIRS].map((p,i)=>({...p,id:i})));
      grid.innerHTML = '';
      flipped=[]; matched=0; moves=0; seconds=0; locked=false;
      document.getElementById('memMoves').textContent = 0;
      document.getElementById('memTime').textContent  = 0;
      document.getElementById('memPairs').textContent = '0 / 8';
      document.getElementById('memWin').classList.remove('show');
      clearInterval(timer);
      let started = false;

      cards.forEach(card => {
        const el = document.createElement('div');
        el.className = 'mem-card';
        el.dataset.label = card.label; el.dataset.icon = card.icon;
        el.innerHTML = `<div class="mem-card-inner"><div class="mem-front">🂠</div><div class="mem-back"><span>${card.icon}</span><span class="mem-back-label">${card.label}</span></div></div>`;
        el.addEventListener('click', () => {
          if (locked || el.classList.contains('flipped') || el.classList.contains('matched')) return;
          if (!started) { started=true; timer=setInterval(()=>{seconds++; document.getElementById('memTime').textContent=seconds;},1000); }
          el.classList.add('flipped'); flipped.push(el);
          if (flipped.length === 2) {
            moves++; document.getElementById('memMoves').textContent = moves; locked=true;
            if (flipped[0].dataset.label === flipped[1].dataset.label) {
              flipped.forEach(c=>c.classList.add('matched')); flipped=[]; locked=false; matched++;
              document.getElementById('memPairs').textContent = `${matched} / 8`;
              if (matched === 8) {
                clearInterval(timer);
                document.getElementById('memWinMsg').textContent = `${moves} moves · ${seconds}s · All pairs matched! 🎉`;
                document.getElementById('memWin').classList.add('show');
              }
            } else {
              setTimeout(()=>{flipped.forEach(c=>c.classList.remove('flipped')); flipped=[]; locked=false;}, 900);
            }
          }
        });
        grid.appendChild(el);
      });
    }

    buildGrid();
    document.getElementById('memRestart').addEventListener('click', ()=>{clearInterval(timer); buildGrid();});
    document.getElementById('memWinBtn').addEventListener('click', ()=>{clearInterval(timer); buildGrid();});
  })();


  /* ================================================================
     GAME 3 — TYPE SPRINT
     ================================================================ */
  (function () {
    const QUOTES = [
      "first solve the problem then write the code",
      "time is gold every second counts",
      "clean code always looks like it was written by someone who cares",
      "any fool can write code that a computer can understand",
      "simplicity is the soul of efficiency",
      "the best code is no code at all",
      "make it work make it right make it fast",
      "programming is not about typing it is about thinking",
      "code is read more often than it is written",
      "talk is cheap show me the code"
    ];
    let quoteIdx=0, startTime=null, timerInt=null, elapsed=0, totalTyped=0, correctTyped=0;
    document.getElementById('typerTotal').textContent = QUOTES.length;

    function loadQuote(idx) {
      const q = QUOTES[idx];
      document.getElementById('typerNum').textContent = idx + 1;
      const display = document.getElementById('typerDisplay');
      display.innerHTML = q.split('').map((ch,i)=>
        `<span class="typer-char" data-idx="${i}">${ch===' '?'&nbsp;':ch}</span>`
      ).join('');
      display.querySelector('.typer-char')?.classList.add('cursor');
      const input = document.getElementById('typerInput');
      input.value=''; input.disabled=false; input.focus();
      document.getElementById('typerResult').classList.remove('show');
      document.getElementById('typerWPM').textContent  = '—';
      document.getElementById('typerAcc').textContent  = '—';
      document.getElementById('typerTime').textContent = '0s';
      startTime=null; elapsed=0; totalTyped=0; correctTyped=0; clearInterval(timerInt);
    }

    document.getElementById('typerInput').addEventListener('input', e => {
      const input=e.target, typed=input.value, target=QUOTES[quoteIdx];
      const chars=document.querySelectorAll('#typerDisplay .typer-char');
      if (!startTime && typed.length>0) {
        startTime=Date.now();
        timerInt=setInterval(()=>{elapsed=Math.floor((Date.now()-startTime)/1000); document.getElementById('typerTime').textContent=elapsed+'s';},200);
      }
      totalTyped=typed.length; correctTyped=0;
      chars.forEach((ch,i)=>{
        ch.classList.remove('correct','wrong','cursor');
        if (i<typed.length) { if(typed[i]===target[i]){ch.classList.add('correct');correctTyped++;}else{ch.classList.add('wrong');} }
        if (i===typed.length) ch.classList.add('cursor');
      });
      if (startTime && elapsed>0) document.getElementById('typerWPM').textContent=Math.round((correctTyped/5)/(elapsed/60));
      if (totalTyped>0) document.getElementById('typerAcc').textContent=Math.round((correctTyped/totalTyped)*100)+'%';
      if (typed===target) {
        clearInterval(timerInt); input.disabled=true;
        const finalTime=((Date.now()-startTime)/1000).toFixed(1);
        const finalWPM=Math.round((target.length/5)/(finalTime/60));
        const finalAcc=Math.round((correctTyped/totalTyped)*100);
        document.getElementById('typerResultStats').innerHTML=`
          <div class="typer-result-stat"><div class="typer-result-num">${finalWPM}</div><div class="typer-result-label">WPM</div></div>
          <div class="typer-result-stat"><div class="typer-result-num">${finalAcc}%</div><div class="typer-result-label">Accuracy</div></div>
          <div class="typer-result-stat"><div class="typer-result-num">${finalTime}s</div><div class="typer-result-label">Time</div></div>
        `;
        document.getElementById('typerResult').classList.add('show');
        if (finalWPM>=60 && window.showOtepToast) showToast(`🔥 ${finalWPM} WPM! Otep would approve — that's some fast fingers!`,4000);
      }
    });

    function nextQuote() { quoteIdx=(quoteIdx+1)%QUOTES.length; loadQuote(quoteIdx); }
    document.getElementById('typerNext').addEventListener('click', nextQuote);
    document.getElementById('typerSkip').addEventListener('click', nextQuote);
    QUOTES.sort(()=>Math.random()-.5);
    loadQuote(0);
  })();


  /* ================================================================
     GAME 4 — WHACK-A-MOLE
     ================================================================ */
  (function () {
    const grid     = document.getElementById('moleGrid');
    if (!grid) return;
    const scoreEl  = document.getElementById('moleScore');
    const timeEl   = document.getElementById('moleTime');
    const highEl   = document.getElementById('moleHigh');
    const msgEl    = document.getElementById('moleMsg');
    const startBtn = document.getElementById('moleStart');
    const startTxt = document.getElementById('moleStartTxt');

    const HOLES = 9, DURATION = 30;
    let score=0, highScore=+localStorage.getItem('mole_hs')||0;
    let timeLeft=DURATION, running=false, moleTimer, countdown, currentMole=-1;
    highEl.textContent = highScore;

    /* Build holes */
    for (let i=0; i<HOLES; i++) {
      const hole = document.createElement('div');
      hole.className = 'mole-hole';
      hole.dataset.idx = i;
      hole.innerHTML = '<div class="mole-creature">🐹</div>';
      hole.addEventListener('click', ()=>whack(i));
      grid.appendChild(hole);
    }
    const holes = grid.querySelectorAll('.mole-hole');

    function showMole() {
      if (!running) return;
      if (currentMole >= 0) holes[currentMole].classList.remove('has-mole');
      let next;
      do { next = Math.floor(Math.random()*HOLES); } while (next===currentMole);
      currentMole = next;
      holes[currentMole].classList.add('has-mole');
      const speed = Math.max(450, 1200-(DURATION-timeLeft)*25);
      moleTimer = setTimeout(showMole, speed);
    }

    function whack(idx) {
      if (!running || idx!==currentMole) return;
      holes[idx].classList.remove('has-mole');
      holes[idx].classList.add('whacked');
      setTimeout(()=>holes[idx].classList.remove('whacked'), 350);
      score++; scoreEl.textContent=score; currentMole=-1;
      clearTimeout(moleTimer); showMole();
    }

    function startGame() {
      score=0; timeLeft=DURATION;
      scoreEl.textContent=0; timeEl.textContent=DURATION;
      holes.forEach(h=>h.classList.remove('has-mole','whacked'));
      msgEl.textContent='Click the moles before they hide!';
      startTxt.textContent='Restart →'; running=true; currentMole=-1;
      clearTimeout(moleTimer); clearInterval(countdown);
      showMole();
      countdown=setInterval(()=>{
        timeLeft--; timeEl.textContent=timeLeft;
        if (timeLeft<=0) endGame();
      },1000);
    }

    function endGame() {
      running=false; clearTimeout(moleTimer); clearInterval(countdown);
      holes.forEach(h=>h.classList.remove('has-mole')); currentMole=-1;
      if (score>highScore) { highScore=score; localStorage.setItem('mole_hs',highScore); highEl.textContent=highScore; }
      msgEl.innerHTML=`Time's up! Score: <strong style="color:var(--gold)">${score}</strong>${score>=10?' 🏆':score>=5?' 🎉':''}`;
    }

    startBtn.addEventListener('click', startGame);
  })();


  /* ================================================================
     GAME 5 — NUMBER GUESSER
     ================================================================ */
  (function () {
    const input      = document.getElementById('guessInput');
    if (!input) return;
    const btn        = document.getElementById('guessBtn');
    const hint       = document.getElementById('guessHint');
    const attemptsEl = document.getElementById('guessAttempts');
    const bestEl     = document.getElementById('guessBest');
    const meterFill  = document.getElementById('guessMeterFill');
    const historyEl  = document.getElementById('guessHistory');
    const win        = document.getElementById('guessWin');
    const winMsg     = document.getElementById('guessWinMsg');
    const newGameBtn = document.getElementById('guessNewGame');

    let secret, attempts, bestScore=+localStorage.getItem('guess_best')||0;
    if (bestScore) bestEl.textContent=bestScore;

    function newGame() {
      secret=Math.floor(Math.random()*100)+1; attempts=0;
      attemptsEl.textContent=0;
      hint.textContent="I've chosen a number between 1 and 100. Can you find it?";
      hint.style.color='';
      meterFill.style.width='50%';
      meterFill.style.background='linear-gradient(90deg,var(--blue),var(--gold))';
      historyEl.innerHTML=''; input.value=''; input.disabled=false; btn.disabled=false;
      win.classList.remove('show'); input.focus();
    }

    function makeGuess() {
      const raw=input.value.trim();
      const val=parseInt(raw);
      if (!raw || isNaN(val) || val<1 || val>100) {
        hint.textContent='⚠ Enter a number between 1 and 100!';
        hint.style.color='var(--red)'; return;
      }
      attempts++; attemptsEl.textContent=attempts;
      const badge=document.createElement('span');
      badge.className='guess-badge'; badge.textContent=val;

      if (val===secret) {
        badge.classList.add('exact'); historyEl.appendChild(badge);
        input.disabled=true; btn.disabled=true;
        meterFill.style.width='100%';
        meterFill.style.background='var(--green)';
        if (!bestScore || attempts<bestScore) { bestScore=attempts; localStorage.setItem('guess_best',bestScore); bestEl.textContent=bestScore; }
        winMsg.textContent=`You got it in ${attempts} attempt${attempts===1?'':'s'}! The number was ${secret}.`;
        win.classList.add('show'); return;
      }
      if (val<secret) {
        badge.classList.add('low');
        hint.textContent=`↑ Too low! Go higher.`; hint.style.color='var(--blue-lt)';
        meterFill.style.width=((val/100)*100)+'%';
      } else {
        badge.classList.add('high');
        hint.textContent=`↓ Too high! Go lower.`; hint.style.color='var(--gold-lt)';
        meterFill.style.width=((val/100)*100)+'%';
      }
      historyEl.appendChild(badge); input.value=''; input.focus();
    }

    btn.addEventListener('click', makeGuess);
    input.addEventListener('keydown', e=>{ if(e.key==='Enter') makeGuess(); });
    newGameBtn.addEventListener('click', newGame);
    newGame();
  })();

})(); /* end GAMES IIFE */
