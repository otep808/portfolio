/* terminal.js — OtepCodes interactive shell. Vanilla JS, no dependencies.
   Safe output: everything is added with textContent (no innerHTML). */
(function () {
  const out = document.getElementById('termOut');
  const input = document.getElementById('termInput');
  const chips = document.getElementById('termChips');
  if (!out || !input) return;

  const GAMES = (window.OTEP_GAMES || []).length ? window.OTEP_GAMES : [
    { key: 'snake', label: 'Snake' }, { key: 'memory', label: 'Memory' }, { key: 'typer', label: 'Type Sprint' },
    { key: 'mole', label: 'Whack-a-Mole' }, { key: 'guess', label: 'Number Guesser' }, { key: 'quiz', label: 'Dev Trivia' },
    { key: 'ttt', label: 'Tic-Tac-Toe' }, { key: 'rps', label: 'Rock Paper Scissors' }, { key: 'hang', label: 'Hangman' },
    { key: 'simon', label: 'Simon Says' }, { key: 'pong', label: 'Pong' }, { key: 'math', label: 'Math Sprint' },
    { key: 'scramble', label: 'Word Scramble' }, { key: 'reaction', label: 'Reaction Time' }, { key: 'click', label: 'Click Frenzy' },
    { key: 'odd', label: 'Odd One Out' }, { key: 'dice', label: 'Dice Duel' }
  ];

  const PAGES = { home: 'index.html', about: 'about.html', projects: 'projects.html', skills: 'skills.html', games: 'games.html', contact: 'contact.html' };
  let PROJECTS = [
    'EkSpyRy — Food Expiration Monitor (Python · Tkinter)', 'C.L.E.A.R. Aqua — Portable Water Purifier (Research)',
    'IT Helpdesk Ticketing System (Web · Database)', 'Personal Portfolio Website (HTML/CSS/JS/PHP)',
    'Scrapbook — Personal Portfolio in Figma', 'Mubii — Free Movie Streaming App (Figma)',
    'Online Newsletter, Blog & Magazine (Wix)', 'Astro Cafe — Logo & Brand Identity',
    'Clothing Store — Desktop Ordering System (Linked List)', 'Bank Queue Management System (Priority Queue)',
    'Valenzuela Utility Finder (Graph · Haversine)', 'School Supplies Inventory & Checkout (Stack)',
    'Shoe Material Stack Viewer (Stack)', 'PLV Learning Management System (Figma)',
    'CineReel — Movie Short-Form App (Figma)', 'The Future Times — Privacy & Social Media (HTML/CSS)',
    'Antukin — Cover Music Video (CapCut)'
  ];
  // If the PHP admin database is running, prefer its live project list.
  fetch('api/projects.php').then(r => r.ok ? r.json() : Promise.reject())
    .then(d => { if (Array.isArray(d.projects) && d.projects.length) PROJECTS = d.projects.map(p => p.title + (p.category ? ' (' + p.category + ')' : '')); })
    .catch(() => {});

  function line(text, cls) {
    const d = document.createElement('div');
    if (cls) d.className = cls;
    d.textContent = text;
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }
  function lines(arr, cls) { arr.forEach(t => line(t, cls)); }
  function go(url) { line('→ opening ' + url + ' …', 't-dim'); setTimeout(() => { location.href = url; }, 500); }
  function localScores(g) { try { return JSON.parse(localStorage.getItem('otep_lb_' + g) || '[]'); } catch (e) { return []; } }

  const C = {
    help() {
      lines([
        'Available commands:', '',
        '  about            who is Otep?',
        '  skills           technical + creative skills',
        '  projects         list all projects',
        '  games            list the 17 mini games',
        '  play <game>      open a game (e.g. play snake)',
        '  scores <game>    top 10 saved in this browser (e.g. scores pong)',
        '  open <page>      home | about | projects | skills | games | contact',
        '  theme [dark|light]  switch theme',
        '  time             Manila time',
        '  contact          how to reach me',
        '  motto            life motto',
        '  neofetch         system info, portfolio style',
        '  history | clear  history of commands / clear screen',
        '', '  Hint: there are a couple of hidden commands. 🤫'
      ]);
    },
    about() {
      lines(['Joseph "Otep" Callos — BSIT student @ PLV, Valenzuela City.',
        'Full-Stack Developer · GUI Designer · Problem Solver. Night owl. Guitar, badminton, 3 cats & 2 dogs.'], 't-blue');
    },
    whoami() { C.about(); },
    skills() {
      lines(['Technical : HTML5, CSS3, JavaScript, Python, Java, SQL, PHP, networking (Cisco Packet Tracer)',
        'Design    : Figma, Canva, Photoshop, CapCut',
        'Cloud     : Microsoft Azure, Google Cloud Platform',
        'Learning  : cybersecurity, AI courses, React'], 't-gold');
    },
    projects() { PROJECTS.forEach((p, i) => line(String(i + 1).padStart(2, '0') + '  ' + p)); line('', ''); line('Full cards: open projects', 't-dim'); },
    games() { GAMES.forEach((g, i) => line(String(i + 1).padStart(2, '0') + '  ' + g.key.padEnd(10) + ' ' + g.label)); line('Try: play snake', 't-dim'); },
    play(a) {
      const k = (a[0] || '').toLowerCase();
      const g = GAMES.find(x => x.key === k || x.label.toLowerCase() === a.join(' ').toLowerCase());
      if (!g) return line('play: unknown game "' + (a.join(' ') || '') + '". Type games.', 't-err');
      go('games.html#game-' + g.key);
    },
    scores(a) {
      const k = (a[0] || '').toLowerCase();
      if (!GAMES.some(x => x.key === k)) return line('scores: pick a game key. Type games.', 't-err');
      const l = localScores(k);
      if (!l.length) return line('No scores saved in this browser for ' + k + ' yet.', 't-dim');
      l.slice(0, 10).forEach((r, i) => line((i + 1) + '. ' + String(r.player).slice(0, 30) + ' — ' + r.score));
    },
    open(a) {
      const p = PAGES[(a[0] || '').toLowerCase()];
      if (!p) return line('open: choose one of ' + Object.keys(PAGES).join(', '), 't-err');
      go(p);
    },
    theme(a) {
      const want = (a[0] || '').toLowerCase(), cur = document.documentElement.getAttribute('data-theme');
      if (want && want !== 'dark' && want !== 'light') return line('theme: use dark or light', 't-err');
      if (!want || want !== cur) document.getElementById('navLogoBtn')?.click();
      line('Theme switched.', 't-ok');
    },
    time() { line(new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'full', timeStyle: 'medium' }).format(new Date()) + ' (Asia/Manila)', 't-gold'); },
    contact() {
      lines(['Email    : callosjoseph818@gmail.com', 'GitHub   : github.com/otep808', 'LinkedIn : linkedin.com/in/joseph-callos-329b153b8',
        'Facebook : facebook.com/joseph.callos.8', 'Status   : open to internships & collaborations'], 't-blue');
    },
    motto() { line('"Time is Gold." — Choose your infinite loops wisely.', 't-gold'); },
    neofetch() {
      lines(['otep@plv', '---------', 'OS      : Windows / Android', 'Shell    : portfolio.js', 'School   : PLV — BSIT, 2nd year',
        'Editor   : Notepad++', 'Languages: Python, Java, JavaScript, PHP', 'Hobbies  : guitar · badminton · building blocks',
        'Uptime   : since 2005-11-03'], 't-blue');
    },
    sudo(a) {
      if ((a.join(' ')).toLowerCase() === 'hire otep') {
        lines(['[sudo] permission granted. Excellent decision. 🎉', 'Opening the contact page…'], 't-ok'); setTimeout(() => { location.href = 'contact.html'; }, 1400);
      } else line('otep is not in the sudoers file. This incident will be reported. (to nobody)', 't-err');
    },
    konami() { line('⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ B A — try it on any page.', 't-dim'); },
    history() { hist.forEach((h, i) => line((i + 1) + '  ' + h)); },
    clear() { out.textContent = ''; }
  };

  const hist = []; let hi = 0;
  function run(raw) {
    const cmd = raw.trim(); if (!cmd) return;
    line('otep@plv:~$ ' + cmd, 't-dim');
    hist.push(cmd); hi = hist.length;
    const parts = cmd.split(/\s+/), name = parts[0].toLowerCase(), args = parts.slice(1);
    if (Object.prototype.hasOwnProperty.call(C, name)) C[name](args);
    else line(name + ': command not found. Type help.', 't-err');
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi] || ''; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hi + 1, hist.length); input.value = hist[hi] || ''; }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const v = input.value.toLowerCase(); if (!v || v.includes(' ')) return;
      const m = Object.keys(C).filter(k => k.startsWith(v));
      if (m.length === 1) input.value = m[0] + ' '; else if (m.length > 1) line(m.join('   '), 't-dim');
    }
  });
  document.getElementById('termWin').addEventListener('click', () => input.focus());

  ['help', 'about', 'skills', 'projects', 'games', 'contact', 'neofetch'].forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'term-chip'; b.textContent = c;
    b.addEventListener('click', () => { run(c); input.focus(); });
    chips.appendChild(b);
  });

  lines(['Welcome to OtepCodes OS v2026.', 'Type "help" to see commands.', ''], 't-gold');
  input.focus({ preventScroll: true });
})();
