/* ================================================================
   main.js — Joseph S. Callos · OtepCodes
   "Wired for problems. Built for solutions."
   ================================================================ */

/* ── THEME TOGGLE ─────────────────────────────────────────────── */
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
    if (!document.startViewTransition) { root.setAttribute('data-theme', next); updateLogos(next); return; }
    const t = document.startViewTransition(() => { root.setAttribute('data-theme', next); updateLogos(next); });
    const maxR = Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y));
    t.ready.then(() => document.documentElement.animate(
      { clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${maxR}px at ${x}px ${y}px)`] },
      { duration:620, easing:'cubic-bezier(0.4,0,0.2,1)', pseudoElement:'::view-transition-new(root)' }
    ));
  }
  document.getElementById('navLogoBtn')?.addEventListener('click', e => {
    const cur = root.getAttribute('data-theme'), r = e.currentTarget.getBoundingClientRect();
    applyTheme(cur === 'dark' ? 'light' : 'dark', r.left+r.width/2, r.top+r.height/2);
  });
})();

/* ── PROGRESS BAR ─────────────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');
if (progressBar) window.addEventListener('scroll', () => {
  progressBar.style.width = Math.min(scrollY/(document.body.scrollHeight-innerHeight)*100,100)+'%';
});

document.querySelectorAll('img:not(.site-logo):not([fetchpriority="high"])').forEach(img=>{
  if(!img.hasAttribute('loading'))img.setAttribute('loading','lazy');
  if(!img.hasAttribute('decoding'))img.setAttribute('decoding','async');
});

/* ── CUSTOM CURSOR ────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
if (cursor && matchMedia('(pointer:fine)').matches) {
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop(){cx+=(mx-cx)*.16;cy+=(my-cy)*.16;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button,.project-card,.highlight-box,.tool-card,.fact-card,.cert-card,.game-tab-btn,.quiz-opt').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('grow'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('grow'));
  });
  document.addEventListener('mouseleave',()=>cursor.classList.add('hide'));
  document.addEventListener('mouseenter',()=>cursor.classList.remove('hide'));
} else if (cursor) cursor.style.display='none';

/* ── STICKY NAV ───────────────────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60));

/* ── ACTIVE NAV LINK ──────────────────────────────────────────── */
(function(){const p=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===p)a.classList.add('active');});})();

/* ── MOBILE NAV ───────────────────────────────────────────────── */
const hamburger=document.getElementById('hamburger'),mobileNav=document.getElementById('mobileNav');
function toggleMobile(){if(!hamburger||!mobileNav)return;const o=mobileNav.classList.toggle('open');hamburger.classList.toggle('open',o);hamburger.setAttribute('aria-expanded',String(o));hamburger.setAttribute('aria-label',o?'Close navigation':'Open navigation');mobileNav.setAttribute('aria-hidden',String(!o));document.body.style.overflow=o?'hidden':'';}
function closeMobile(){if(!hamburger||!mobileNav)return;mobileNav.classList.remove('open');hamburger.classList.remove('open');hamburger.setAttribute('aria-expanded','false');hamburger.setAttribute('aria-label','Open navigation');mobileNav.setAttribute('aria-hidden','true');document.body.style.overflow='';}
if(hamburger)hamburger.addEventListener('click',toggleMobile);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMobile();});

/* ── PAGE TRANSITION ──────────────────────────────────────────── */
const cover=document.getElementById('page-cover');
if(cover){
  cover.style.cssText='transition:transform .55s cubic-bezier(.76,0,.24,1);transform:scaleY(1);transform-origin:bottom';
  requestAnimationFrame(()=>requestAnimationFrame(()=>cover.style.transform='scaleY(0)'));
  document.querySelectorAll('a[href]').forEach(link=>{
    const h=link.getAttribute('href');
    if(!h||h.startsWith('#')||h.startsWith('http')||h.startsWith('mailto')||h.startsWith('tel')||link.hasAttribute('target'))return;
    link.addEventListener('click',e=>{e.preventDefault();cover.style.transformOrigin='top';cover.style.transform='scaleY(1)';setTimeout(()=>location.href=h,480);});
  });
}

/* ── SCROLL REVEAL ────────────────────────────────────────────── */
const revealEls=document.querySelectorAll('.reveal');
if(revealEls.length){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}}),{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  revealEls.forEach(el=>obs.observe(el));
}

/* ── SKILL BAR ANIMATION ──────────────────────────────────────── */
const skillFills=document.querySelectorAll('.skill-fill');
if(skillFills.length){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('animated');obs.unobserve(e.target);}}),{threshold:.3});
  skillFills.forEach(el=>obs.observe(el));
}

/* ── TOAST ────────────────────────────────────────────────────── */
function showToast(msg,duration=3000){
  document.querySelectorAll('.otep-toast').forEach(t=>t.remove());
  const t=document.createElement('div');t.className='otep-toast';t.textContent=msg;
  document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),400);},duration);
}
window.showOtepToast=showToast;

/* ================================================================
   EASTER EGGS  (5 total)
   ================================================================
   EE1: Console — loads automatically on every page
   EE2: Konami Code — ⬆⬆⬇⬇⬅➡⬅➡BA
   EE3: Logo ×7 — click the nav logo 7 times fast
   EE4: Type "otep" — anywhere on page (not in a text field)
   EE5: Triple-click footer copyright "Joseph S. Callos"
   ================================================================ */

/* EE1 — CONSOLE ART */
(function(){
  const art=' ██████╗ ████████╗███████╗██████╗ \n██╔═══██╗╚══██╔══╝██╔════╝██╔══██╗\n██║   ██║   ██║   █████╗  ██████╔╝\n██║   ██║   ██║   ██╔══╝  ██╔═══╝ \n╚██████╔╝   ██║   ███████╗██║     \n ╚═════╝    ╚═╝   ╚══════╝╚═╝     \n         C O D E S  ·  2026       ';
  console.log(`%c${art}`,'color:#4d7fe6;font-family:monospace;font-size:10px;line-height:1.4');
  console.log('%c👋  Hey there, fellow developer!','color:#c49a4a;font-size:14px;font-weight:bold');
  console.log('%c🔧  Wired for problems. Built for solutions.','color:#e8e4d8;font-size:12px');
  console.log('%c🎮  5 Easter eggs hidden. Konami code · Logo×7 · Type "otep" · Triple-click footer · One more...','color:#7aa3f0;font-size:11px;font-style:italic');
})();

/* EE2 — KONAMI CODE */
(function(){
  const SEQ=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx=0;
  document.addEventListener('keydown',e=>{
    const tgt=e.target;
    if(tgt&&(tgt.tagName==='INPUT'||tgt.tagName==='TEXTAREA'||tgt.isContentEditable))return;
    if(e.key===SEQ[idx]){idx++;if(idx===SEQ.length){idx=0;launch();}}else{idx=e.key===SEQ[0]?1:0;}
  });
  function launch(){
    if(document.getElementById('konami-overlay'))return;
    const stars=Array.from({length:30},(_,i)=>{const s=document.createElement('div');s.className='konami-star';s.style.setProperty('--angle',(i/30*360)+'deg');s.style.setProperty('--dist',(80+Math.random()*180)+'px');s.style.setProperty('--delay',(Math.random()*.4)+'s');s.style.setProperty('--col',Math.random()>.5?'var(--blue)':'var(--gold)');return s.outerHTML;}).join('');
    const el=document.createElement('div');el.id='konami-overlay';
    el.innerHTML=`<div class="konami-bg"></div><div class="konami-inner"><div class="konami-burst">${stars}</div><p class="konami-badge">🕹️ SECRET UNLOCKED</p><h2 class="konami-title">You Found <em>Otep's</em><br>Easter Egg!</h2><p class="konami-seq">⬆ ⬆ ⬇ ⬇ ⬅ ➡ ⬅ ➡ 🅱 🅰</p><p class="konami-quote"><em>"Wired for problems. Built for solutions.<br>Also: built for Konami codes. <strong>Respect.</strong>"</em></p><p class="konami-sig">— Joseph "Otep" Callos</p><div style="display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;margin-top:2rem;"><button class="btn btn-primary konami-close"><span>← Back to Portfolio</span></button><a href="games.html" class="btn btn-outline">🎮 Play Mini Games</a></div></div>`;
    document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));
    el.querySelector('.konami-close').addEventListener('click',()=>{el.classList.remove('show');setTimeout(()=>el.remove(),500);});
    el.addEventListener('click',e=>{if(e.target===el){el.classList.remove('show');setTimeout(()=>el.remove(),500);}});
  }
})();

/* EE3 — LOGO ×7 */
(function(){
  let clicks=0,timer;
  document.getElementById('navLogoBtn')?.addEventListener('click',()=>{
    clicks++;clearTimeout(timer);timer=setTimeout(()=>{clicks=0;},2200);
    if(clicks>=7){clicks=0;showToast('🎸  Otep\'s top 2: The Beatles & Jim Croce. Debugging goes smoother with good strings. 🎵',5000);}
  });
})();

/* EE4 — TYPE "otep" ANYWHERE */
/*
 * HOW TO TRIGGER: While NOT focused on an input/textarea,
 * type the 4 letters O-T-E-P in sequence on your keyboard.
 * A blue screen flash and surprise toast appear.
 */
(function(){
  let buf='';
  document.addEventListener('keydown',e=>{
    const tag=document.activeElement?.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA')return;
    buf+=e.key.toLowerCase();
    if(buf.length>4)buf=buf.slice(-4);
    if(buf==='otep'){
      buf='';
      const flash=document.createElement('div');
      flash.style.cssText='position:fixed;inset:0;background:var(--blue);opacity:.15;z-index:9995;pointer-events:none;transition:opacity .6s';
      document.body.appendChild(flash);
      requestAnimationFrame(()=>{flash.style.opacity='0';});
      setTimeout(()=>flash.remove(),700);
      showToast('🎸  OTEP unlocked! Fun fact: the nickname came from nowhere and stuck everywhere. Like a memory leak, but the good kind.',5500);
    }
  });
})();

/* EE5 — TRIPLE-CLICK FOOTER COPYRIGHT */
/*
 * HOW TO TRIGGER: Triple-click (3 rapid clicks within ~650ms)
 * on the "Joseph S. Callos" text inside the footer.
 * A hidden "dev notes" panel slides in.
 */
(function(){
  let n=0,t;
  document.addEventListener('click',e=>{
    if(!e.target.closest('.footer-copy'))return;
    n++;clearTimeout(t);t=setTimeout(()=>{n=0;},650);
    if(n>=3){n=0;showDevNotes();}
  });
  function showDevNotes(){
    if(document.getElementById('dev-notes-overlay'))return;
    const el=document.createElement('div');el.id='dev-notes-overlay';
    el.innerHTML=`<div class="dev-notes-bg"></div><div class="dev-notes-inner"><p class="dev-notes-label">// hidden dev notes</p><h3>Behind the <em>Build</em></h3><ul><li>Zero Bootstrap. Zero frameworks. Just HTML, CSS, vanilla JS, and mild sleep deprivation.</li><li>The particle canvas recalculates on every animation frame. It's an intentional infinite loop.</li><li>Dark mode uses CSS custom properties. The circular reveal is the View Transitions API.</li><li>There are 5 Easter eggs across this portfolio. You just found the sneakiest one.</li><li>Most commits were pushed after midnight. Night owl is not a label — it's a lifestyle.</li><li>The brand tagline "Wired for problems. Built for solutions." took approximately 47 rewrites. Worth it.</li></ul><button class="btn btn-primary" id="devNotesClose"><span>Close — back to snooping 🔍</span></button></div>`;
    document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));
    el.querySelector('#devNotesClose').addEventListener('click',()=>{el.classList.remove('show');setTimeout(()=>el.remove(),500);});
    el.querySelector('.dev-notes-bg').addEventListener('click',()=>{el.classList.remove('show');setTimeout(()=>el.remove(),500);});
  }
})();


/* ================================================================
   PAGE: INDEX — Canvas · Typewriter · Counters · Play btn
   ================================================================ */
(function(){
  const canvas=document.getElementById('hero-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,particles=[],mouseX=-9999,mouseY=-9999;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
  if(!reduceMotion){
    resize();window.addEventListener('resize',()=>{resize();init();});
    function Particle(){this.x=Math.random()*W;this.y=Math.random()*H;this.r=Math.random()*1.3+.3;this.vx=(Math.random()-.5)*.4;this.vy=(Math.random()-.5)*.4;this.a=Math.random()*.4+.06;this.blue=Math.random()>.5;}
    function init(){const n=Math.min(Math.floor(W*H/8500),130);particles=Array.from({length:n},()=>new Particle());}
    init();
    document.getElementById('hero')?.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top;});
    const isDark=()=>document.documentElement.getAttribute('data-theme')!=='light';
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<130){ctx.beginPath();ctx.lineWidth=.5;ctx.strokeStyle=isDark()?`rgba(77,127,230,${.14*(1-d/130)})`:`rgba(40,85,212,${.09*(1-d/130)})`;ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();}}
      particles.forEach(p=>{
        const mdx=p.x-mouseX,mdy=p.y-mouseY,md=Math.sqrt(mdx*mdx+mdy*mdy);
        if(md<100){p.vx+=(mdx/md)*.08;p.vy+=(mdy/md)*.08;}
        const sp=Math.sqrt(p.vx*p.vx+p.vy*p.vy);if(sp>1.2){p.vx=(p.vx/sp)*1.2;p.vy=(p.vy/sp)*1.2;}
        p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.blue?(isDark()?`rgba(77,127,230,${p.a})`:`rgba(40,85,212,${p.a*.7})`):(isDark()?`rgba(196,154,74,${p.a*.7})`:`rgba(154,112,48,${p.a*.6})`);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }else{
    canvas.setAttribute('aria-hidden','true');
  }

  /* Typewriter */
  const twEl=document.getElementById('typewriter');
  if(twEl){
    const phrases=['Full-Stack Developer','GUI Designer','Problem Solver','BSIT Student @ PLV','Night Owl Coder','Otep Codes'];
    if(reduceMotion){
      twEl.textContent=phrases[0];
    }else{
      let pi=0,ci=0,del=false;
      function tick(){const p=phrases[pi];if(!del){twEl.textContent=p.slice(0,++ci);if(ci===p.length){del=true;setTimeout(tick,1900);return;}setTimeout(tick,82);}else{twEl.textContent=p.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(tick,380);return;}setTimeout(tick,46);}}
      setTimeout(tick,700);
    }
  }

  /* Counters */
  document.querySelectorAll('.count').forEach(el=>{
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const target=+e.target.dataset.target,step=target/40;let cur=0;const t=setInterval(()=>{cur=Math.min(cur+step,target);e.target.textContent=Math.ceil(cur);if(cur>=target)clearInterval(t);},35);obs.unobserve(e.target);});},{threshold:.5});
    obs.observe(el);
  });

  /* Play button */
  /* Demo Reel — inline video */
  (function(){
    const video      = document.getElementById('reelVideo');
    const playBtn    = document.getElementById('playBtn');
    const watchBtn   = document.getElementById('watchReelBtn');
    const player     = document.getElementById('reelPlayer');
    const durationEl = document.getElementById('reelDuration');
    if(!video) return;

    function fmt(s){
      const m=Math.floor(s/60),sec=Math.floor(s%60);
      return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
    }

    // Update duration label once metadata loads
    video.addEventListener('loadedmetadata',()=>{
      if(durationEl) durationEl.textContent='00:'+fmt(video.duration);
    });

    function startPlay(){
      video.style.opacity='1';
      player.classList.add('is-playing');
      video.play();
    }

    function togglePlay(){
      if(video.paused){
        video.style.opacity='1';
        player.classList.add('is-playing');
        video.play();
      }else{
        video.pause();
        player.classList.remove('is-playing');
      }
    }

    // Clicking the player area (outside overlay) toggles play/pause
    player.addEventListener('click', e=>{
      if(e.target===playBtn||playBtn.contains(e.target)){startPlay();return;}
      if(video.style.opacity==='1') togglePlay();
    });

    playBtn?.addEventListener('click', startPlay);
    watchBtn?.addEventListener('click', ()=>{
      player.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(startPlay, 400);
    });

    // When video ends, reset to poster/overlay state
    video.addEventListener('ended',()=>{
      player.classList.remove('is-playing');
      video.style.opacity='0';
      video.currentTime=0;
    });
  })();
})();


/* ================================================================
   PAGE: PROJECTS — Filter Tabs
   ================================================================ */
(function(){
  const tabs=document.querySelectorAll('.filter-btn');if(!tabs.length)return;
  const cards=document.querySelectorAll('#projectsGrid .project-card');
  const dividers=document.querySelectorAll('#projectsGrid .section-divider');
  const counter=document.getElementById('proj-count');
  const search=document.getElementById('projectSearch');
  const clearSearch=document.getElementById('projectSearchClear');
  const empty=document.getElementById('projectEmpty');
  let activeFilter='all';

  function applyFilters(){
    const q=(search?.value||'').trim().toLowerCase();
    search?.closest('.project-search-wrap')?.classList.toggle('has-value',q.length>0);
    let visible=0;
    dividers.forEach(d=>{d.style.display=(activeFilter==='all'&&!q)?'':'none';});
    cards.forEach(c=>{
      const cats=(c.dataset.cat||'').split(' ');
      const matchesCategory=activeFilter==='all'||cats.includes(activeFilter);
      const matchesSearch=!q||c.textContent.toLowerCase().includes(q);
      const show=matchesCategory&&matchesSearch;
      if(show){c.classList.remove('hidden');c.style.animation='filterIn .4s var(--ease-out) both';visible++;}
      else{c.classList.add('hidden');}
    });
    if(counter)counter.textContent=visible;
    if(empty)empty.hidden=visible>0;
  }

  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      tabs.forEach(t=>{t.classList.remove('active');t.setAttribute('aria-pressed','false');});
      tab.classList.add('active');
      tab.setAttribute('aria-pressed','true');
      activeFilter=tab.dataset.filter||'all';
      applyFilters();
    });
  });
  search?.addEventListener('input',applyFilters);
  clearSearch?.addEventListener('click',()=>{
    search.value='';
    search.focus();
    applyFilters();
  });
  applyFilters();
})();


/* ================================================================
   PAGE: CONTACT — Validation + EmailJS
   ================================================================ */
(function(){
  const textarea=document.getElementById('fmsg');if(!textarea)return;
  const counter=document.getElementById('charCount');
  const copyEmailBtn=document.getElementById('copyEmailBtn');

  copyEmailBtn?.addEventListener('click',async()=>{
    const email='callosjoseph818@gmail.com';
    try{
      await navigator.clipboard.writeText(email);
      showToast('Email copied: '+email,3500);
    }catch{
      showToast('Email: '+email,5000);
    }
  });

  textarea.addEventListener('input',()=>{
    if(textarea.value.length>500)textarea.value=textarea.value.slice(0,500);
    const l=textarea.value.length;counter.textContent=l;counter.style.color=l>480?'var(--red)':'var(--text-faint)';
  });
  function validate(id,errId,check){const input=document.getElementById(id),err=document.getElementById(errId);const ok=check(input.value.trim());input.classList.toggle('error',!ok);err.classList.toggle('show',!ok);return ok;}
  ['fname','femail','fsubject','fmsg'].forEach(id=>{
    document.getElementById(id)?.addEventListener('input',e=>{
      e.currentTarget.classList.remove('error');
      document.getElementById('err-'+id)?.classList.remove('show');
    });
  });
  document.getElementById('contactForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const ok=[
      validate('fname','err-fname',v=>v.length>0),
      validate('femail','err-femail',v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
      validate('fsubject','err-fsubject',v=>v.length>0),
      validate('fmsg','err-fmsg',v=>v.length>=10),
    ].every(Boolean);
    if(!ok)return;
    const btn=document.getElementById('submitBtn'),txt=document.getElementById('btnText');
    btn.disabled=true;txt.textContent='Opening email…';
    const params={from_name:document.getElementById('fname').value.trim(),reply_to:document.getElementById('femail').value.trim(),subject:document.getElementById('fsubject').value.trim(),message:document.getElementById('fmsg').value.trim()};

    /* ── EmailJS Setup ──────────────────────────────────────────
     * 1. Sign up free at https://emailjs.com (200 emails/month free)
     * 2. Add Service (Gmail) → note your SERVICE_ID
     * 3. Create Template with vars: {{from_name}} {{reply_to}} {{subject}} {{message}} → note TEMPLATE_ID
     * 4. Account → API Keys → note PUBLIC_KEY
     * 5. In contact.html <head> add:
     *    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
     *    <script>emailjs.init('YOUR_PUBLIC_KEY');</script>
     * 6. Replace the two strings below with your actual IDs
     * ─────────────────────────────────────────────────────── */
    const SVC = 'YOUR_SERVICE_ID';
    const TPL = 'YOUR_TEMPLATE_ID';

    function onSuccess(){
      btn.disabled=false;txt.textContent='Send Message →';
      document.getElementById('formSuccess').classList.add('show');
      document.getElementById('contactForm').reset();counter.textContent='0';
      setTimeout(()=>document.getElementById('formSuccess').classList.remove('show'),4500);
    }
    function onError(err){
      btn.disabled=false;txt.textContent='Send Message →';
      console.error('EmailJS:',err);
      showToast('Send failed. Email me directly at callosjoseph818@gmail.com.',5000);
    }

    if(typeof emailjs!=='undefined'&&SVC!=='YOUR_SERVICE_ID'){
      emailjs.send(SVC,TPL,params).then(onSuccess,onError);
    }else{
      // Fallback: open native mail client
      const sub=encodeURIComponent(params.subject),body=encodeURIComponent(`From: ${params.from_name} (${params.reply_to})\n\n${params.message}`);
      window.location.href=`mailto:callosjoseph818@gmail.com?subject=${sub}&body=${body}`;
      setTimeout(onSuccess,600);
    }
  });
})();


/* ================================================================
   PAGE: GAMES — All 10 Games
   ================================================================ */
(function(){
  if(!document.getElementById('gameTabs'))return;

  /* Tab switcher */
  document.querySelectorAll('.game-tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.game-tab-btn').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.game-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('game-'+btn.dataset.game).classList.add('active');
    });
  });

  /* ==== GAME 1: SNAKE ==== */
  (function(){
    const canvas=document.getElementById('snakeCanvas');if(!canvas)return;
    const ctx=canvas.getContext('2d'),CELL=20,COLS=canvas.width/CELL,ROWS=canvas.height/CELL;
    let snake,dir,nextDir,food,score,highScore=+localStorage.getItem('snake_hs')||0,level,speed,running,loop;
    document.getElementById('snakeHigh').textContent=highScore;
    const rand=n=>Math.floor(Math.random()*n);
    const isDark=()=>document.documentElement.getAttribute('data-theme')!=='light';
    function spawnFood(){let p;do{p={x:rand(COLS),y:rand(ROWS)};}while(snake.some(s=>s.x===p.x&&s.y===p.y));return p;}
    function init(){const mx=Math.floor(COLS/2),my=Math.floor(ROWS/2);snake=[{x:mx,y:my},{x:mx-1,y:my},{x:mx-2,y:my}];dir={x:1,y:0};nextDir={x:1,y:0};food=spawnFood();score=0;level=1;speed=140;running=false;document.getElementById('snakeScore').textContent=0;document.getElementById('snakeLevel').textContent=1;document.getElementById('snakeMsg').textContent='';draw();}
    function draw(){
      ctx.fillStyle=isDark()?'#0d0e18':'#e6e9f5';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle=isDark()?'rgba(77,127,230,.06)':'rgba(40,85,212,.05)';ctx.lineWidth=.5;
      for(let i=0;i<=COLS;i++){ctx.beginPath();ctx.moveTo(i*CELL,0);ctx.lineTo(i*CELL,canvas.height);ctx.stroke();}
      for(let j=0;j<=ROWS;j++){ctx.beginPath();ctx.moveTo(0,j*CELL);ctx.lineTo(canvas.width,j*CELL);ctx.stroke();}
      const gc=isDark()?'#c49a4a':'#9a7030';ctx.fillStyle=gc;ctx.shadowColor=gc;ctx.shadowBlur=8;
      ctx.beginPath();ctx.arc(food.x*CELL+CELL/2,food.y*CELL+CELL/2,CELL/2-2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      snake.forEach((seg,i)=>{const t=i/snake.length;ctx.fillStyle=isDark()?`rgba(77,${Math.floor(127-t*40)},230,${1-t*.3})`:`rgba(40,${Math.floor(85-t*30)},212,${1-t*.3})`;ctx.shadowColor=i===0?(isDark()?'#4d7fe6':'#2855d4'):'transparent';ctx.shadowBlur=i===0?10:0;ctx.fillRect(seg.x*CELL+1,seg.y*CELL+1,CELL-2,CELL-2);});ctx.shadowBlur=0;
    }
    function step(){
      dir={...nextDir};const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
      if(head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||snake.some(s=>s.x===head.x&&s.y===head.y)){gameOver();return;}
      snake.unshift(head);
      if(head.x===food.x&&head.y===food.y){score++;document.getElementById('snakeScore').textContent=score;if(score>highScore){highScore=score;localStorage.setItem('snake_hs',highScore);document.getElementById('snakeHigh').textContent=highScore;}food=spawnFood();if(score%5===0){level++;speed=Math.max(60,speed-10);document.getElementById('snakeLevel').textContent=level;clearInterval(loop);loop=setInterval(tick,speed);}}else{snake.pop();}
      draw();
    }
    function tick(){if(running)step();}
    function start(){init();running=true;document.getElementById('snakeStartTxt').textContent='Restart →';clearInterval(loop);loop=setInterval(tick,speed);}
    function gameOver(){running=false;clearInterval(loop);if(window.otepSaveScore)window.otepSaveScore('snake',score);document.getElementById('snakeMsg').innerHTML=`Game Over — Score: <strong style="color:var(--blue)">${score}</strong>`;ctx.fillStyle='rgba(8,9,17,.65)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=isDark()?'#e8e4d8':'#0e1120';ctx.font=`300 28px 'Cormorant Garamond',serif`;ctx.textAlign='center';ctx.fillText('GAME OVER',canvas.width/2,canvas.height/2-10);ctx.font=`300 16px 'Space Mono',monospace`;ctx.fillStyle='#4d7fe6';ctx.fillText(`Score: ${score}`,canvas.width/2,canvas.height/2+20);ctx.textAlign='left';}
    const KM={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},w:{x:0,y:-1},W:{x:0,y:-1},s:{x:0,y:1},S:{x:0,y:1},a:{x:-1,y:0},A:{x:-1,y:0},d:{x:1,y:0},D:{x:1,y:0}};
    document.addEventListener('keydown',e=>{
      // TYPING FIX: never steal keys from a text field, and only run while
      // the Snake panel is the active game. Previously this handler ran on
      // every page/panel and preventDefault()ed Space, so the Type Sprint
      // textarea could never receive a space.
      const tgt=e.target;
      if(tgt&&(tgt.tagName==='INPUT'||tgt.tagName==='TEXTAREA'||tgt.isContentEditable))return;
      if(!document.getElementById('game-snake')?.classList.contains('active'))return;
      if(e.key===' '){e.preventDefault();if(!running)start();return;}
      const d=KM[e.key];if(!d)return;if(e.key.startsWith('Arrow'))e.preventDefault();if(d.x!==-dir.x||d.y!==-dir.y)nextDir=d;});
    document.getElementById('snakeStart').addEventListener('click',start);
    [{id:'dUp',d:{x:0,y:-1}},{id:'dDown',d:{x:0,y:1}},{id:'dLeft',d:{x:-1,y:0}},{id:'dRight',d:{x:1,y:0}}].forEach(({id,d})=>document.getElementById(id)?.addEventListener('click',()=>{if(d.x!==-dir.x||d.y!==-dir.y)nextDir=d;}));
    init();
  })();

  /* ==== GAME 2: MEMORY MATCH ==== */
  (function(){
    const PAIRS=[{icon:'html.png',label:'HTML5'},{icon:'css.png',label:'CSS3'},{icon:'js.png',label:'JS'},{icon:'python.png',label:'Python'},{icon:'java.png',label:'Java'},{icon:'sql.png',label:'SQL'},{icon:'git.png',label:'Git'},{icon:'figma.png',label:'Figma'}];
    let flipped=[],matched=0,moves=0,seconds=0,timer,locked=false;
    function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
    function buildGrid(){
      const grid=document.getElementById('memGrid');const cards=shuffle([...PAIRS,...PAIRS].map((p,i)=>({...p,id:i})));
      grid.innerHTML='';flipped=[];matched=0;moves=0;seconds=0;locked=false;
      ['memMoves','memTime'].forEach(id=>document.getElementById(id).textContent=0);
      document.getElementById('memPairs').textContent='0 / 8';document.getElementById('memWin').classList.remove('show');
      clearInterval(timer);let started=false;
      cards.forEach(card=>{
        const el=document.createElement('div');el.className='mem-card';el.dataset.label=card.label;el.dataset.icon=card.icon;
        el.innerHTML=`<div class="mem-card-inner"><div class="mem-front">🂠</div><div class="mem-back"><img class="mem-icon-img" src="images/icons/${card.icon}" alt="${card.label}" onerror="this.style.display='none'"/><span class="mem-back-label">${card.label}</span></div></div>`;
        el.addEventListener('click',()=>{
          if(locked||el.classList.contains('flipped')||el.classList.contains('matched'))return;
          if(!started){started=true;timer=setInterval(()=>{seconds++;document.getElementById('memTime').textContent=seconds;},1000);}
          el.classList.add('flipped');flipped.push(el);
          if(flipped.length===2){moves++;document.getElementById('memMoves').textContent=moves;locked=true;
            if(flipped[0].dataset.label===flipped[1].dataset.label){flipped.forEach(c=>c.classList.add('matched'));flipped=[];locked=false;matched++;document.getElementById('memPairs').textContent=`${matched} / 8`;
              if(matched===8){clearInterval(timer);document.getElementById('memWinMsg').textContent=`${moves} moves · ${seconds}s · All matched! Your RAM is clearly running fine. 🧠`;if(window.otepSaveScore)window.otepSaveScore('memory',Math.max(1,1000-moves*5-seconds));document.getElementById('memWin').classList.add('show');}}
            else{setTimeout(()=>{flipped.forEach(c=>c.classList.remove('flipped'));flipped=[];locked=false;},900);}
          }
        });
        grid.appendChild(el);
      });
    }
    buildGrid();
    document.getElementById('memRestart').addEventListener('click',()=>{clearInterval(timer);buildGrid();});
    document.getElementById('memWinBtn').addEventListener('click',()=>{clearInterval(timer);buildGrid();});
  })();

  /* ==== GAME 3: TYPE SPRINT ==== */
  (function(){
    const QUOTES=["first solve the problem then write the code","wired for problems built for solutions","clean code always looks like it was written by someone who cares","any fool can write code that a computer can understand","simplicity is the soul of efficiency","the best code is no code at all","make it work make it right make it fast","programming is not about typing it is about thinking","code is read more often than it is written","talk is cheap show me the code"];
    let quoteIdx=0,startTime=null,timerInt=null,elapsed=0,totalTyped=0,correctTyped=0;
    document.getElementById('typerTotal').textContent=QUOTES.length;
    function loadQuote(idx){
      const q=QUOTES[idx];document.getElementById('typerNum').textContent=idx+1;
      const display=document.getElementById('typerDisplay');
      display.innerHTML=q.split('').map((ch,i)=>`<span class="typer-char" data-idx="${i}">${ch===' '?'&nbsp;':ch}</span>`).join('');
      display.querySelector('.typer-char')?.classList.add('cursor');
      const input=document.getElementById('typerInput');input.value='';input.disabled=false;input.focus();
      document.getElementById('typerResult').classList.remove('show');
      ['typerWPM','typerAcc'].forEach(id=>document.getElementById(id).textContent='—');
      document.getElementById('typerTime').textContent='0s';
      startTime=null;elapsed=0;totalTyped=0;correctTyped=0;clearInterval(timerInt);
    }
    document.getElementById('typerInput')?.addEventListener('input',e=>{
      const input=e.target,typed=input.value,target=QUOTES[quoteIdx];
      const chars=document.querySelectorAll('#typerDisplay .typer-char');
      if(!startTime&&typed.length>0){startTime=Date.now();timerInt=setInterval(()=>{elapsed=Math.floor((Date.now()-startTime)/1000);document.getElementById('typerTime').textContent=elapsed+'s';},200);}
      totalTyped=typed.length;correctTyped=0;
      chars.forEach((ch,i)=>{ch.classList.remove('correct','wrong','cursor');if(i<typed.length){if(typed[i]===target[i]){ch.classList.add('correct');correctTyped++;}else{ch.classList.add('wrong');}}if(i===typed.length)ch.classList.add('cursor');});
      if(startTime&&elapsed>0)document.getElementById('typerWPM').textContent=Math.round((correctTyped/5)/(elapsed/60));
      if(totalTyped>0)document.getElementById('typerAcc').textContent=Math.round((correctTyped/totalTyped)*100)+'%';
      if(typed===target){
        clearInterval(timerInt);input.disabled=true;
        const ft=((Date.now()-startTime)/1000).toFixed(1),fw=Math.round((target.length/5)/(ft/60)),fa=Math.round((correctTyped/totalTyped)*100);
        if(window.otepSaveScore)window.otepSaveScore('typer',fw);document.getElementById('typerResultStats').innerHTML=`<div class="typer-result-stat"><div class="typer-result-num">${fw}</div><div class="typer-result-label">WPM</div></div><div class="typer-result-stat"><div class="typer-result-num">${fa}%</div><div class="typer-result-label">Accuracy</div></div><div class="typer-result-stat"><div class="typer-result-num">${ft}s</div><div class="typer-result-label">Time</div></div>`;
        document.getElementById('typerResult').classList.add('show');
        if(fw>=60)showToast(`🔥 ${fw} WPM! That's not typing — that's debugging at the speed of thought.`,4000);
      }
    });
    function nextQuote(){quoteIdx=(quoteIdx+1)%QUOTES.length;loadQuote(quoteIdx);}
    document.getElementById('typerNext')?.addEventListener('click',nextQuote);
    document.getElementById('typerSkip')?.addEventListener('click',nextQuote);
    QUOTES.sort(()=>Math.random()-.5);loadQuote(0);
  })();

  /* ==== GAME 4: WHACK-A-MOLE ==== */
  (function(){
    const grid=document.getElementById('moleGrid');if(!grid)return;
    const scoreEl=document.getElementById('moleScore'),timeEl=document.getElementById('moleTime'),highEl=document.getElementById('moleHigh'),msgEl=document.getElementById('moleMsg');
    const startBtn=document.getElementById('moleStart'),startTxt=document.getElementById('moleStartTxt');
    const HOLES=9,DURATION=30;let score=0,highScore=+localStorage.getItem('mole_hs')||0,timeLeft=DURATION,running=false,moleTimer,countdown,currentMole=-1;
    highEl.textContent=highScore;
    for(let i=0;i<HOLES;i++){const h=document.createElement('div');h.className='mole-hole';h.dataset.idx=i;h.innerHTML='<div class="mole-creature">🐹</div>';h.addEventListener('click',()=>whack(i));grid.appendChild(h);}
    const holes=grid.querySelectorAll('.mole-hole');
    function showMole(){if(!running)return;if(currentMole>=0)holes[currentMole].classList.remove('has-mole');let next;do{next=Math.floor(Math.random()*HOLES);}while(next===currentMole);currentMole=next;holes[currentMole].classList.add('has-mole');moleTimer=setTimeout(showMole,Math.max(450,1200-(DURATION-timeLeft)*25));}
    function whack(idx){if(!running||idx!==currentMole)return;holes[idx].classList.remove('has-mole');holes[idx].classList.add('whacked');setTimeout(()=>holes[idx].classList.remove('whacked'),350);score++;scoreEl.textContent=score;currentMole=-1;clearTimeout(moleTimer);showMole();}
    function startGame(){score=0;timeLeft=DURATION;scoreEl.textContent=0;timeEl.textContent=DURATION;holes.forEach(h=>h.classList.remove('has-mole','whacked'));msgEl.textContent='Whack those pesky hamsters!';startTxt.textContent='Restart →';running=true;currentMole=-1;clearTimeout(moleTimer);clearInterval(countdown);showMole();countdown=setInterval(()=>{timeLeft--;timeEl.textContent=timeLeft;if(timeLeft<=0)endGame();},1000);}
    function endGame(){running=false;if(window.otepSaveScore)window.otepSaveScore('mole',score);clearTimeout(moleTimer);clearInterval(countdown);holes.forEach(h=>h.classList.remove('has-mole'));currentMole=-1;if(score>highScore){highScore=score;localStorage.setItem('mole_hs',highScore);highEl.textContent=highScore;}msgEl.innerHTML=`Time's up! Score: <strong style="color:var(--gold)">${score}</strong>${score>=15?' 🏆 Hamster hunter!':score>=8?' 🎉 Solid reflexes!':' — The hamsters send their regards.'}` ;}
    startBtn.addEventListener('click',startGame);
  })();

  /* ==== GAME 5: NUMBER GUESSER ==== */
  (function(){
    const input=document.getElementById('guessInput');if(!input)return;
    const btn=document.getElementById('guessBtn'),hint=document.getElementById('guessHint'),attemptsEl=document.getElementById('guessAttempts'),bestEl=document.getElementById('guessBest'),meterFill=document.getElementById('guessMeterFill'),historyEl=document.getElementById('guessHistory'),win=document.getElementById('guessWin'),winMsg=document.getElementById('guessWinMsg'),newGameBtn=document.getElementById('guessNewGame');
    let secret,attempts,bestScore=+localStorage.getItem('guess_best')||0;if(bestScore)bestEl.textContent=bestScore;
    function newGame(){secret=Math.floor(Math.random()*100)+1;attempts=0;attemptsEl.textContent=0;hint.textContent="I'm thinking of a number between 1 and 100. No hints. Okay, one hint: it exists.";hint.style.color='';meterFill.style.width='50%';meterFill.style.background='linear-gradient(90deg,var(--blue),var(--gold))';historyEl.innerHTML='';input.value='';input.disabled=false;btn.disabled=false;win.classList.remove('show');input.focus();}
    function makeGuess(){const val=parseInt(input.value.trim());if(!input.value.trim()||isNaN(val)||val<1||val>100){hint.textContent='⚠ A number between 1 and 100. Not a philosophy, an actual number.';hint.style.color='var(--red)';return;}attempts++;attemptsEl.textContent=attempts;const badge=document.createElement('span');badge.className='guess-badge';badge.textContent=val;if(val===secret){badge.classList.add('exact');historyEl.appendChild(badge);if(window.otepSaveScore)window.otepSaveScore('guess',Math.max(1,101-attempts));input.disabled=true;btn.disabled=true;meterFill.style.width='100%';meterFill.style.background='var(--green)';if(!bestScore||attempts<bestScore){bestScore=attempts;localStorage.setItem('guess_best',bestScore);bestEl.textContent=bestScore;}winMsg.textContent=`Got it in ${attempts} attempt${attempts===1?'':'s'}! The number was ${secret}. ${attempts<=3?'🔥 Binary search energy!':attempts<=6?'💪 Solid!':'🎯 Persistence is a feature, not a bug.'}`;win.classList.add('show');return;}if(val<secret){badge.classList.add('low');hint.textContent='↑  Higher';hint.style.color='var(--blue-lt)';}else{badge.classList.add('high');hint.textContent='↓  Lower';hint.style.color='var(--gold-lt)';}meterFill.style.width=(val/100*100)+'%';historyEl.appendChild(badge);input.value='';input.focus();}
    btn.addEventListener('click',makeGuess);input.addEventListener('keydown',e=>{if(e.key==='Enter')makeGuess();});newGameBtn.addEventListener('click',newGame);newGame();
  })();


  /* ==== GAME 10: DEV TRIVIA ==== */
  (function(){
    const questionEl=document.getElementById('quizQuestion');if(!questionEl)return;
    const optionsEl=document.getElementById('quizOptions'),feedbackEl=document.getElementById('quizFeedback'),progressFill=document.getElementById('quizProgressFill'),labelEl=document.getElementById('quizQLabel');
    const scoreBoard=document.getElementById('quizScoreBoard'),finalScore=document.getElementById('quizFinalScore'),nextBtn=document.getElementById('quizNext'),restartBtn=document.getElementById('quizRestart');
    const statScore=document.getElementById('quizStatScore'),statTotal=document.getElementById('quizStatTotal');
    const QS=[
      {q:"What does HTML stand for?",a:1,opts:["HyperText Machine Language","HyperText Markup Language","HyperLink Text Markup Language","HyperText Making Language"]},
      {q:"Which of these is a Python GUI toolkit?",a:2,opts:["Bootstrap","Swing","Tkinter","React"]},
      {q:"What data structure operates on FIFO (First In, First Out)?",a:0,opts:["Queue","Stack","Heap","Binary Tree"]},
      {q:"What does CSS stand for?",a:3,opts:["Computer Style Sheets","Creative Styling System","Coded Style Script","Cascading Style Sheets"]},
      {q:"What is Otep's brand tagline?",a:1,opts:["Code first, ask later","Wired for problems. Built for solutions.","No Bootstrap, no problem.","Time is Gold"]},
      {q:"Which tool does Otep use for UI/UX design?",a:2,opts:["Sketch","Adobe XD","Figma","InVision"]},
      {q:"What does JSON stand for?",a:0,opts:["JavaScript Object Notation","Java Syntax Object Node","Just Simple Object Naming","JavaScript Organized Nodes"]},
      {q:"A Stack data structure follows which order?",a:3,opts:["FIFO","LILO","FILO","LIFO"]},
      {q:"What framework does Otep use for this portfolio?",a:2,opts:["Bootstrap","React","None — pure HTML/CSS/JS","Vue"]},
      {q:"What is Otep's school?",a:0,opts:["PLV — Pamantasan ng Lungsod ng Valenzuela","PLM — Pamantasan ng Lungsod ng Maynila","PUP — Polytechnic University","PLN — Pamantasan ng Lungsod ng Navotas"]},
    ];
    let current=0,score=0;
    function loadQ(){
      const q=QS[current];labelEl.textContent=`Question ${current+1} of ${QS.length}`;questionEl.textContent=q.q;feedbackEl.textContent='';progressFill.style.width=(current/QS.length*100)+'%';
      optionsEl.innerHTML='';q.opts.forEach((opt,i)=>{const b=document.createElement('button');b.className='quiz-opt';b.textContent=opt;b.addEventListener('click',()=>answer(i,b,q.a));optionsEl.appendChild(b);});
      nextBtn.style.display='none';
    }
    function answer(chosen,btn,correct){
      document.querySelectorAll('.quiz-opt').forEach(b=>b.disabled=true);
      document.querySelectorAll('.quiz-opt')[correct].classList.add('correct');
      if(chosen===correct){score++;feedbackEl.textContent=['✅ Correct!','✅ Nailed it!','✅ You know your stuff!','✅ Solid!'][Math.floor(Math.random()*4)];feedbackEl.style.color='var(--green)';}
      else{btn.classList.add('wrong');feedbackEl.textContent='❌ Not quite. Correct answer is highlighted.';feedbackEl.style.color='var(--red)';}
      nextBtn.style.display='inline-flex';
    }
    nextBtn?.addEventListener('click',()=>{current++;if(current<QS.length){loadQ();}else{progressFill.style.width='100%';if(window.otepSaveScore)window.otepSaveScore('quiz',score);scoreBoard.classList.add('show');finalScore.textContent=`${score}/${QS.length}`;statScore.textContent=score;statTotal.textContent=QS.length;nextBtn.style.display='none';if(score===QS.length)showToast('🏆 Perfect score! Did you write the quiz? ...wait.',4500);else if(score>=7)showToast('🎉 Great score! You\'ve clearly been paying attention.',3500);}});
    restartBtn?.addEventListener('click',()=>{current=0;score=0;scoreBoard.classList.remove('show');QS.sort(()=>Math.random()-.5);loadQ();});
    QS.sort(()=>Math.random()-.5);loadQ();
  })();


  /* ==== GAME 7: TIC-TAC-TOE ==== */
  (function(){
    const gridEl=document.getElementById('tttGrid');if(!gridEl)return;
    const statusEl=document.getElementById('tttStatus');
    const scoreXEl=document.getElementById('tttScoreX'),scoreOEl=document.getElementById('tttScoreO'),scoreDrawEl=document.getElementById('tttScoreDraw');
    const WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let board,running,scores={X:0,O:0,D:0};
    const cells=Array.from({length:9},(_,i)=>{
      const c=document.createElement('button');c.className='ttt-cell';
      c.addEventListener('click',()=>playerMove(i));gridEl.appendChild(c);return c;
    });
    function checkWin(b,p){return WINS.find(w=>w.every(i=>b[i]===p));}
    function bestMove(b,p){for(const w of WINS){const v=w.map(i=>b[i]);if(v.filter(x=>x===p).length===2&&v.includes('')){return w[v.indexOf('')];}}return -1;}
    function initGame(){board=Array(9).fill('');running=true;cells.forEach(c=>{c.textContent='';c.className='ttt-cell';});statusEl.textContent="Your turn — you're X. Choose wisely.";}
    function playerMove(idx){if(!running||board[idx])return;place(idx,'X');const w=checkWin(board,'X');if(w){highlight(w);end('X');}else if(board.every(v=>v)){end(null);}else{statusEl.textContent='AI thinking…';setTimeout(aiMove,380);}}
    function aiMove(){if(!running)return;let m=bestMove(board,'O');if(m<0)m=bestMove(board,'X');if(m<0&&!board[4])m=4;if(m<0){const c=[0,2,6,8].filter(i=>!board[i]);if(c.length)m=c[Math.floor(Math.random()*c.length)];}if(m<0){const e=board.map((v,i)=>v?-1:i).filter(i=>i>=0);if(e.length)m=e[Math.floor(Math.random()*e.length)];}place(m,'O');const w=checkWin(board,'O');if(w){highlight(w);end('O');}else if(board.every(v=>v)){end(null);}else{statusEl.textContent='Your turn.';}}
    function place(idx,p){board[idx]=p;cells[idx].textContent=p;cells[idx].classList.add(p.toLowerCase(),'taken');}
    function highlight(w){w.forEach(i=>cells[i].classList.add('win'));}
    function end(winner){running=false;if(winner==='X'){scores.X++;scoreXEl.textContent=scores.X;if(window.otepSaveScore)window.otepSaveScore('ttt',scores.X);statusEl.textContent='You win! The AI is reconsidering its life choices.';}else if(winner==='O'){scores.O++;scoreOEl.textContent=scores.O;statusEl.textContent='AI wins. Programmed to succeed. Unlike some commits.';}else{scores.D++;scoreDrawEl.textContent=scores.D;statusEl.textContent="Draw. Perfectly balanced, as all things should be.";}}
    document.getElementById('tttStart')?.addEventListener('click',initGame);
    initGame();
  })();

  /* ==== GAME 8: ROCK PAPER SCISSORS ==== */
  (function(){
    const pChoice=document.getElementById('rpsPlayerChoice'),aChoice=document.getElementById('rpsAiChoice');if(!pChoice)return;
    const resultEl=document.getElementById('rpsResult'),pScoreEl=document.getElementById('rpsPScore'),aScoreEl=document.getElementById('rpsAScore'),roundEl=document.getElementById('rpsRound');
    const EMOJIS=['✊','✋','✌️'],NAMES=['Rock','Paper','Scissors'],BEATS={0:2,1:0,2:1};
    let pS=0,aS=0,round=0;
    document.querySelectorAll('.rps-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const p=+btn.dataset.choice,a=Math.floor(Math.random()*3);
        pChoice.textContent=EMOJIS[p];aChoice.textContent=EMOJIS[a];
        [pChoice,aChoice].forEach(el=>{el.classList.add('pop');setTimeout(()=>el.classList.remove('pop'),400);});
        round++;roundEl.textContent=round;
        if(p===a){resultEl.textContent="Tie! Even randomness couldn't decide.";}
        else if(BEATS[p]===a){pS++;pScoreEl.textContent=pS;resultEl.textContent=`${NAMES[p]} beats ${NAMES[a]}. Point yours!`;}
        else{aS++;aScoreEl.textContent=aS;resultEl.textContent=`${NAMES[a]} beats ${NAMES[p]}. The AI is not sorry.`;}
        if(pS===3){if(window.otepSaveScore)window.otepSaveScore('rps',pS);resultEl.textContent='You win the set! 🏆';document.querySelectorAll('.rps-btn').forEach(b=>b.disabled=true);}
        else if(aS===3){resultEl.textContent='AI wins the set. 🤖';document.querySelectorAll('.rps-btn').forEach(b=>b.disabled=true);}
      });
    });
    document.getElementById('rpsReset')?.addEventListener('click',()=>{pS=0;aS=0;round=0;[pScoreEl,aScoreEl,roundEl].forEach(el=>el.textContent=0);pChoice.textContent='❓';aChoice.textContent='❓';resultEl.textContent='Pick your weapon. No pressure.';document.querySelectorAll('.rps-btn').forEach(b=>b.disabled=false);});
  })();

  /* ==== GAME 9: HANGMAN ==== */
  (function(){
    const wordEl=document.getElementById('hangWord');if(!wordEl)return;
    const livesEl=document.getElementById('hangLives'),keysEl=document.getElementById('hangKeys'),msgEl=document.getElementById('hangMsg'),hintEl=document.getElementById('hangHint'),figEl=document.getElementById('hangFigure');
    const WORDS=[{w:'javascript',h:'Language of the web (and of regrets)'},{w:'python',h:'Named after Monty Python, not the snake'},{w:'algorithm',h:'A recipe that never tastes the same twice'},{w:'debugging',h:'Removing bugs you added yesterday'},{w:'recursion',h:'See: recursion'},{w:'repository',h:'Where code lives and PRs go to die'},{w:'frontend',h:'The part users see and complain about'},{w:'iteration',h:'Doing the same thing, but better. Allegedly.'},{w:'boolean',h:'True or false. No "maybe" in prod.'},{w:'otepcode',h:"Otep's personal brand. You should know this."},{w:'variable',h:'A box you forget to name properly'},{w:'function',h:'Reusable logic. Or 200 lines of chaos.'},{w:'framework',h:'Something Otep deliberately did NOT use'},{w:'database',h:'Where the data lives and sometimes dies'},{w:'network',h:'Very important tubes'}];
    const STAGES=['😃','😅','😬','😰','😱','😵','💀'];
    let word,guessed,wrong,running;
    function newGame(){const pick=WORDS[Math.floor(Math.random()*WORDS.length)];word=pick.w;guessed=new Set();wrong=0;running=true;figEl.textContent=STAGES[0];hintEl.textContent='Hint: '+pick.h;msgEl.textContent='';render();buildKeys();}
    function render(){wordEl.innerHTML=word.split('').map(l=>`<div class="hang-letter">${guessed.has(l)?l:''}</div>`).join('');livesEl.textContent='❤️'.repeat(6-wrong)+'🖤'.repeat(wrong);figEl.textContent=STAGES[Math.min(wrong,6)];}
    function buildKeys(){keysEl.innerHTML='';'abcdefghijklmnopqrstuvwxyz'.split('').forEach(l=>{const b=document.createElement('button');b.className='hang-key';b.textContent=l;b.addEventListener('click',()=>guess(l,b));keysEl.appendChild(b);});}
    function guess(l,btn){if(!running||guessed.has(l))return;guessed.add(l);if(word.includes(l)){btn.classList.add('used-right');}else{wrong++;btn.classList.add('used-wrong');}btn.disabled=true;render();if(word.split('').every(c=>guessed.has(c))){running=false;if(window.otepSaveScore)window.otepSaveScore('hang',(6-wrong)*100);msgEl.textContent=`"${word.toUpperCase()}" — nailed it! Your inner dev is showing.`;}else if(wrong>=6){running=false;msgEl.textContent=`It was "${word.toUpperCase()}". The bugs win today.`;wordEl.querySelectorAll('.hang-letter').forEach((el,i)=>{el.textContent=word[i];el.classList.add('wrong');});}}
    document.getElementById('hangStart')?.addEventListener('click',newGame);
    newGame();
  })();

  /* ==== GAME 10: SIMON SAYS ==== */
  (function(){
    const levelEl=document.getElementById('simonLevel'),msgEl=document.getElementById('simonMsg');if(!levelEl)return;
    const highEl=document.getElementById('simonHigh');
    const COLORS=['blue','gold','green','red'];
    let sequence=[],playerIdx,level,running,accepting,highScore=+localStorage.getItem('simon_hs')||0;
    highEl.textContent=highScore;
    const btns={};COLORS.forEach(c=>{btns[c]=document.querySelector(`.simon-btn[data-color="${c}"]`);});
    function flash(c,dur=400){return new Promise(res=>{btns[c]?.classList.add('lit');setTimeout(()=>{btns[c]?.classList.remove('lit');setTimeout(res,100);},dur);});}
    async function playSeq(){accepting=false;msgEl.textContent='Watch the pattern…';for(const c of sequence){await flash(c,Math.max(250,450-level*15));await new Promise(r=>setTimeout(r,80));}accepting=true;playerIdx=0;msgEl.textContent='Your turn — repeat it!';}
    function startGame(){sequence=[];level=0;running=true;nextRound();}
    function nextRound(){level++;levelEl.textContent=level;sequence.push(COLORS[Math.floor(Math.random()*4)]);setTimeout(playSeq,600);}
    COLORS.forEach(c=>{btns[c]?.addEventListener('click',()=>{if(!running||!accepting)return;btns[c].classList.add('lit');setTimeout(()=>btns[c].classList.remove('lit'),150);if(c===sequence[playerIdx]){playerIdx++;if(playerIdx===sequence.length){if(level>highScore){highScore=level;localStorage.setItem('simon_hs',highScore);highEl.textContent=highScore;}msgEl.textContent=`Level ${level} done! ${level>=10?'RAM chip energy! 🔥':level>=5?'Great memory!':'Keep going!'}`;setTimeout(nextRound,1100);}}else{accepting=false;running=false;if(window.otepSaveScore)window.otepSaveScore('simon',level);msgEl.textContent=`Wrong at level ${level}! ${level>=10?'Elite run 🏆':level>=5?'Not bad!':'The colors were buffering.'}`;}});});
    document.getElementById('simonStart')?.addEventListener('click',startGame);
  })();

  /* ==== GAME 11: PONG ==== */
  (function(){
    const canvas=document.getElementById('pongCanvas');if(!canvas)return;
    const ctx=canvas.getContext('2d');
    const W=canvas.width,H=canvas.height;
    const PAD_H=64,PAD_W=10,BALL_R=8,WIN_SCORE=7;
    let ball,playerPad,aiPad,pScore,aScore,running,animId,speed;
    const isDark=()=>document.documentElement.getAttribute('data-theme')!=='light';
    function col(){return isDark()?{bg:'#0d0e18',accent:'#4d7fe6',gold:'#c49a4a',text:'#e8e4d8',dim:'rgba(232,228,216,.15)'}:{bg:'#e6e9f5',accent:'#2855d4',gold:'#9a7030',text:'#0e1120',dim:'rgba(14,17,32,.1)'};}
    function init(){ball={x:W/2,y:H/2,vx:(Math.random()>.5?1:-1)*4.5,vy:(Math.random()-.5)*4};playerPad={y:H/2-PAD_H/2,dy:0};aiPad={y:H/2-PAD_H/2};pScore=0;aScore=0;speed=1;document.getElementById('pongPlayerScore').textContent=0;document.getElementById('pongAiScore').textContent=0;}
    function reset(dir){ball={x:W/2,y:H/2,vx:dir*4.5*speed,vy:(Math.random()-.5)*4};speed=Math.min(speed+.05,1.8);}
    function draw(){
      const c=col();ctx.fillStyle=c.bg;ctx.fillRect(0,0,W,H);
      // Center line
      ctx.setLineDash([8,8]);ctx.strokeStyle=c.dim;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();ctx.setLineDash([]);
      // Paddles
      ctx.fillStyle=c.accent;roundRect(ctx,12,playerPad.y,PAD_W,PAD_H,4);ctx.fill();
      ctx.fillStyle=c.gold;roundRect(ctx,W-12-PAD_W,aiPad.y,PAD_W,PAD_H,4);ctx.fill();
      // Ball
      ctx.shadowColor=c.accent;ctx.shadowBlur=14;
      ctx.fillStyle=c.text;ctx.beginPath();ctx.arc(ball.x,ball.y,BALL_R,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      // Scores
      ctx.font=`300 40px 'Cormorant Garamond',serif`;ctx.fillStyle=c.text;ctx.textAlign='center';
      ctx.fillText(pScore,W/4,52);ctx.fillText(aScore,3*W/4,52);ctx.textAlign='left';
    }
    function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}
    function update(){
      ball.x+=ball.vx;ball.y+=ball.vy;
      if(ball.y-BALL_R<0){ball.y=BALL_R;ball.vy*=-1;}
      if(ball.y+BALL_R>H){ball.y=H-BALL_R;ball.vy*=-1;}
      // Player paddle collision
      if(ball.x-BALL_R<12+PAD_W&&ball.x-BALL_R>12&&ball.y>playerPad.y&&ball.y<playerPad.y+PAD_H){ball.vx=Math.abs(ball.vx);const rel=(ball.y-(playerPad.y+PAD_H/2))/(PAD_H/2);ball.vy=rel*5;}
      // AI paddle collision
      if(ball.x+BALL_R>W-12-PAD_W&&ball.x+BALL_R<W-12&&ball.y>aiPad.y&&ball.y<aiPad.y+PAD_H){ball.vx=-Math.abs(ball.vx);const rel=(ball.y-(aiPad.y+PAD_H/2))/(PAD_H/2);ball.vy=rel*5;}
      // Score
      if(ball.x<0){aScore++;document.getElementById('pongAiScore').textContent=aScore;if(aScore>=WIN_SCORE){endGame('AI');return;}reset(1);}
      if(ball.x>W){pScore++;document.getElementById('pongPlayerScore').textContent=pScore;if(pScore>=WIN_SCORE){endGame('You');return;}reset(-1);}
      // AI movement - imperfect tracking for fairness
      const aiCenter=aiPad.y+PAD_H/2;const diff=ball.y-aiCenter;const aiSpeed=Math.min(Math.abs(diff),3.8);aiPad.y+=diff>0?aiSpeed:-aiSpeed;aiPad.y=Math.max(0,Math.min(H-PAD_H,aiPad.y));
    }
    function endGame(winner){running=false;if(winner==='You'&&window.otepSaveScore)window.otepSaveScore('pong',pScore);cancelAnimationFrame(animId);document.getElementById('pongStartTxt').textContent='Play Again →';const c=col();ctx.fillStyle='rgba(8,9,17,.7)';ctx.fillRect(0,0,W,H);ctx.font=`300 32px 'Cormorant Garamond',serif`;ctx.fillStyle=winner==='You'?'#4d7fe6':'#c49a4a';ctx.textAlign='center';ctx.fillText(`${winner} win${winner==='You'?'!':'. The AI says thanks.'}`,W/2,H/2);ctx.textAlign='left';}
    function loop(){if(!running)return;update();draw();animId=requestAnimationFrame(loop);}
    // Mouse/touch control
    canvas.addEventListener('mousemove',e=>{if(!running)return;const r=canvas.getBoundingClientRect();const sy=canvas.height/r.height;const y=(e.clientY-r.top)*sy;playerPad.y=Math.max(0,Math.min(H-PAD_H,y-PAD_H/2));});
    canvas.addEventListener('touchmove',e=>{e.preventDefault();if(!running)return;const r=canvas.getBoundingClientRect();const sy=canvas.height/r.height;const y=(e.touches[0].clientY-r.top)*sy;playerPad.y=Math.max(0,Math.min(H-PAD_H,y-PAD_H/2));},{passive:false});
    document.getElementById('pongStart').addEventListener('click',()=>{cancelAnimationFrame(animId);init();running=true;document.getElementById('pongStartTxt').textContent='Restart →';loop();});
    init();draw();
  })();

  /* ==== GAME 12: MATH SPRINT ==== */
  (function(){
    const problemEl=document.getElementById('mathProblem');if(!problemEl)return;
    const inputEl=document.getElementById('mathInput'),feedbackEl=document.getElementById('mathFeedback');
    const scoreEl=document.getElementById('mathScore'),timeEl=document.getElementById('mathTime');
    const streakEl=document.getElementById('mathStreak'),bestEl=document.getElementById('mathBest');
    const progressEl=document.getElementById('mathProgressFill'),startBtn=document.getElementById('mathStart'),startTxt=document.getElementById('mathStartTxt');
    const submitBtn=document.getElementById('mathSubmit');
    const DURATION=60;
    let score,streak,best=+localStorage.getItem('math_best')||0,timeLeft,running,timer,answer;
    bestEl.textContent=best;
    function genProblem(){
      const ops=['+','-','×','÷'];const op=ops[Math.floor(Math.random()*ops.length)];let a,b,ans;
      if(op==='+'){a=Math.floor(Math.random()*50)+1;b=Math.floor(Math.random()*50)+1;ans=a+b;}
      else if(op==='-'){a=Math.floor(Math.random()*50)+10;b=Math.floor(Math.random()*(a-1))+1;ans=a-b;}
      else if(op==='×'){a=Math.floor(Math.random()*12)+1;b=Math.floor(Math.random()*12)+1;ans=a*b;}
      else{b=Math.floor(Math.random()*10)+1;ans=Math.floor(Math.random()*10)+1;a=b*ans;}
      answer=ans;problemEl.textContent=`${a} ${op} ${b} = ?`;
    }
    function startGame(){score=0;streak=0;timeLeft=DURATION;running=true;[scoreEl,streakEl].forEach(el=>el.textContent=0);timeEl.textContent=DURATION;progressEl.style.width='100%';feedbackEl.textContent='';startTxt.textContent='Restart →';inputEl.disabled=false;submitBtn.disabled=false;inputEl.value='';genProblem();inputEl.focus();clearInterval(timer);timer=setInterval(()=>{timeLeft--;timeEl.textContent=timeLeft;progressEl.style.width=(timeLeft/DURATION*100)+'%';if(timeLeft<=0)endGame();},1000);}
    function endGame(){running=false;clearInterval(timer);if(window.otepSaveScore)window.otepSaveScore('math',score);inputEl.disabled=true;submitBtn.disabled=true;if(score>best){best=score;localStorage.setItem('math_best',best);bestEl.textContent=best;}problemEl.textContent=`Time's up! Score: ${score}`;feedbackEl.textContent=score>=20?'🏆 Math genius!':score>=10?'💪 Solid!':'🔢 Keep practicing!';feedbackEl.style.color='var(--gold-lt)';}
    function checkAnswer(){if(!running)return;const val=parseInt(inputEl.value.trim());if(isNaN(val)){feedbackEl.textContent='Enter a number!';feedbackEl.style.color='var(--red)';return;}if(val===answer){score++;streak++;scoreEl.textContent=score;streakEl.textContent=streak;feedbackEl.textContent=streak>=3?`🔥 ${streak} streak! `:'✅ Correct!';feedbackEl.style.color='var(--green)';}else{feedbackEl.textContent=`✗ Was ${answer}`;feedbackEl.style.color='var(--red)';streak=0;streakEl.textContent=0;}inputEl.value='';genProblem();inputEl.focus();}
    submitBtn?.addEventListener('click',checkAnswer);
    inputEl?.addEventListener('keydown',e=>{if(e.key==='Enter')checkAnswer();});
    startBtn?.addEventListener('click',startGame);
  })();

  /* ==== GAME 13: WORD SCRAMBLE ==== */
  (function(){
    const wordEl=document.getElementById('scrambleWord');if(!wordEl)return;
    const hintEl=document.getElementById('scrambleHint'),inputEl=document.getElementById('scrambleInput');
    const msgEl=document.getElementById('scrambleMsg'),scoreEl=document.getElementById('scrambleScore');
    const streakEl=document.getElementById('scrambleStreak'),skipsEl=document.getElementById('scrambleSkips');
    const submitBtn=document.getElementById('scrambleSubmit'),skipBtn=document.getElementById('scrambleSkip');
    const startBtn=document.getElementById('scrambleStart'),startTxt=document.getElementById('scrambleStartTxt');
    const WORDS=[{w:'python',h:'Otep\'s strongest language'},{'w':'javascript',h:'Runs in the browser'},{'w':'database',h:'Structured data storage'},{'w':'network',h:'Connected computers'},{'w':'frontend',h:'What the user sees'},{'w':'backend',h:'The hidden machinery'},{'w':'function',h:'A named block of code'},{'w':'variable',h:'A named memory slot'},{'w':'boolean',h:'True or false only'},{'w':'algorithm',h:'Step-by-step solution'},{'w':'interface',h:'Contract between components'},{'w':'protocol',h:'Rules for communication'},{'w':'debugging',h:'Finding and fixing errors'},{'w':'compiler',h:'Code to machine translator'},{'w':'framework',h:'Structured development kit'},{'w':'recursive',h:'Calls itself'},{'w':'iteration',h:'Repeating a process'},{'w':'syntax',h:'Grammar of a language'},{'w':'runtime',h:'When code actually runs'},{'w':'library',h:'Reusable code collection'}];
    let current,score,streak,skips,running=false;
    function scramble(w){const a=[...w];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.join('')===w?scramble(w):a.join('');}
    function loadWord(){current=WORDS[Math.floor(Math.random()*WORDS.length)];wordEl.textContent=scramble(current.w).toUpperCase();hintEl.textContent='Hint: '+current.h;inputEl.value='';msgEl.textContent='';inputEl.focus();}
    function startGame(){score=0;streak=0;skips=3;running=true;[scoreEl,streakEl].forEach(el=>el.textContent=0);skipsEl.textContent=3;startTxt.textContent='Restart →';inputEl.disabled=false;submitBtn.disabled=false;loadWord();}
    function check(){if(!running)return;const val=inputEl.value.trim().toLowerCase();if(val===current.w){score++;streak++;scoreEl.textContent=score;streakEl.textContent=streak;msgEl.textContent=streak>=3?`🔥 ${streak} in a row!`:'✅ Correct!';msgEl.style.color='var(--green)';setTimeout(loadWord,800);}else{streak=0;streakEl.textContent=0;msgEl.textContent='✗ Not quite — try again!';msgEl.style.color='var(--red)';}}
    function skip(){if(!running||skips<=0)return;skips--;skipsEl.textContent=skips;msgEl.textContent=`The word was: ${current.w.toUpperCase()}`;msgEl.style.color='var(--text-faint)';streak=0;streakEl.textContent=0;setTimeout(loadWord,1000);}
    submitBtn?.addEventListener('click',check);
    inputEl?.addEventListener('keydown',e=>{if(e.key==='Enter')check();});
    skipBtn?.addEventListener('click',skip);
    startBtn?.addEventListener('click',startGame);
  })();

  /* ==== GAME 14: REACTION TIME ==== */
  (function(){
    const targetEl=document.getElementById('reactionTarget');if(!targetEl)return;
    const labelEl=document.getElementById('reactionLabel'),lastEl=document.getElementById('reactionLast');
    const bestEl=document.getElementById('reactionBest'),avgEl=document.getElementById('reactionAvg'),roundEl=document.getElementById('reactionRound');
    const startBtn=document.getElementById('reactionStart'),startTxt=document.getElementById('reactionStartTxt');
    const ROUNDS=5,MSGS_FAST=['⚡ Superhuman!','🔥 Blazing!','💻 GPU-level!'],MSGS_MED=['💪 Sharp!','✅ Solid!','👍 Good reflexes!'],MSGS_SLOW=['🐢 A bit slow...','☕ Maybe need coffee?','🧠 Still loading?'];
    let waiting=false,startTime=null,round=0,times=[],best=+localStorage.getItem('reaction_best')||Infinity,timeout;
    if(best<Infinity)bestEl.textContent=best;
    function reset(){waiting=false;startTime=null;round=0;times=[];targetEl.className='reaction-target wait';labelEl.textContent='Click Start below';roundEl.textContent='0/'+ROUNDS;lastEl.textContent='—';avgEl.textContent='—';}
    function startRound(){if(round>=ROUNDS){endGame();return;}round++;roundEl.textContent=`${round}/${ROUNDS}`;targetEl.className='reaction-target wait';labelEl.textContent='Wait for green…';const delay=1200+Math.random()*2800;timeout=setTimeout(()=>{targetEl.className='reaction-target ready';labelEl.textContent='CLICK NOW!';startTime=Date.now();waiting=true;},delay);}
    function endGame(){targetEl.className='reaction-target wait';const avg=Math.round(times.reduce((a,b)=>a+b,0)/times.length);avgEl.textContent=avg;if(window.otepSaveScore)window.otepSaveScore('reaction',Math.max(1,1000-avg));const bestTime=Math.min(...times);if(bestTime<best){best=bestTime;localStorage.setItem('reaction_best',best);bestEl.textContent=best;}const msg=avg<220?MSGS_FAST:avg<350?MSGS_MED:MSGS_SLOW;labelEl.textContent=`${msg[Math.floor(Math.random()*msg.length)]} Avg: ${avg}ms`;startTxt.textContent='Play Again →';}
    targetEl.addEventListener('click',()=>{
      if(!waiting&&startTime===null){return;}
      if(!waiting&&startTime===null){clearTimeout(timeout);targetEl.className='reaction-target too-early';labelEl.textContent='Too early! Wait for green.';setTimeout(startRound,1200);return;}
      if(!waiting){clearTimeout(timeout);targetEl.className='reaction-target too-early';labelEl.textContent='Too early! Wait for green.';setTimeout(startRound,1200);return;}
      const rt=Date.now()-startTime;times.push(rt);lastEl.textContent=rt;if(rt<(best===Infinity?Infinity:best))bestEl.textContent=rt;waiting=false;startTime=null;
      const msg=rt<220?MSGS_FAST:rt<350?MSGS_MED:MSGS_SLOW;
      targetEl.className='reaction-target wait';labelEl.textContent=`${rt}ms — ${msg[Math.floor(Math.random()*msg.length)]}`;
      if(round<ROUNDS){setTimeout(startRound,900);}else{endGame();}
    });
    startBtn?.addEventListener('click',()=>{clearTimeout(timeout);reset();startTxt.textContent='Restart →';setTimeout(startRound,400);});
    reset();
  })();


})(); /* end GAMES IIFE */

/* ================================================================
   CERT VIEWER — image modal + pdf new-tab
   ================================================================ */
(function(){
  document.querySelectorAll('.cert-view-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const src=btn.dataset.src;
      const ext=src.split('.').pop().toLowerCase();
      if(ext==='pdf'){window.open(src,'_blank');return;}
      // Image lightbox
      const modal=document.createElement('div');
      modal.style.cssText='position:fixed;inset:0;z-index:9998;background:rgba(8,9,17,.96);display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
      modal.innerHTML=`<div style="position:relative;max-width:90vw;max-height:92vh;">
        <img src="${src}" style="max-width:90vw;max-height:88vh;object-fit:contain;display:block;border:1px solid var(--border);"/>
        <button onclick="this.closest('div').parentElement.remove()" style="position:absolute;top:-14px;right:-14px;width:32px;height:32px;background:var(--blue);color:#fff;border:none;cursor:pointer;font-size:1rem;border-radius:50%;line-height:32px;text-align:center;">✕</button>
      </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
    });
  });
})();

/* ================================================================
   main-enhanced.js — OtepCodes Portfolio Upgrade
   Load AFTER main.js on every page:
     <script src="javascript/main-enhanced.js"></script>
   ================================================================ */

(function () {
  'use strict';

  /* ── 1. SCROLL-TO-TOP BUTTON ──────────────────────────────── */
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'scroll-top';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.innerHTML = '↑';
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 2. NAV AVAILABILITY CHIP ─────────────────────────────── */
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    const chip = document.createElement('li');
    chip.innerHTML = '<span class="nav-avail">Open to Internships</span>';
    navLinks.appendChild(chip);
  }

  /* ── 3. HERO TERMINAL ANIMATION ───────────────────────────── */
  const terminalBody = document.getElementById('terminalBody');
  if (terminalBody) {
    const lines = [
      { type: 'cmd',    prompt: '>', text: 'whoami' },
      { type: 'out',    text: '<span class="t-hl">Joseph "Otep" Callos</span> — BSIT @ PLV · Valenzuela, PH' },
      { type: 'cmd',    prompt: '>', text: 'skills --top' },
      { type: 'out',    text: '<span class="t-bl">HTML/CSS</span>  <span class="t-bl">JavaScript</span>  <span class="t-bl">Python</span>  <span class="t-bl">Java</span>  <span class="t-bl">Figma</span>' },
      { type: 'cmd',    prompt: '>', text: 'status --current' },
      { type: 'out',    text: '✅ <span class="t-hl">Open to internships</span> &amp; collaborations' },
      { type: 'cmd',    prompt: '>', text: 'motto --print' },
      { type: 'out',    text: '<span class="t-hl">"Time is Gold."</span>  — Choose your loops wisely.' },
    ];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      terminalBody.innerHTML = lines.map(line => {
        const cls = line.type === 'cmd' ? 't-line visible' : 't-line t-out visible';
        return line.type === 'cmd'
          ? `<div class="${cls}"><span class="t-prompt">${line.prompt}</span><span class="t-cmd">${line.text}</span></div>`
          : `<div class="${cls}">${line.text}</div>`;
      }).join('');
    } else {
    let lineIdx = 0;

    function appendLine(lineData) {
      const div = document.createElement('div');
      div.className = lineData.type === 'cmd' ? 't-line' : 't-line t-out';

      if (lineData.type === 'cmd') {
        div.innerHTML = `<span class="t-prompt">${lineData.prompt}</span><span class="t-cmd"></span>`;
      } else {
        div.innerHTML = lineData.text;
      }

      terminalBody.appendChild(div);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => div.classList.add('visible'));
      });

      return div;
    }

    function typeCmd(div, text, cb) {
      const cmdEl = div.querySelector('.t-cmd');
      if (!cmdEl) { cb && cb(); return; }
      let i = 0;
      const cursor = document.createElement('span');
      cursor.className = 't-cursor-blink';
      cmdEl.appendChild(cursor);

      const iv = setInterval(() => {
        cursor.before(document.createTextNode(text[i++]));
        if (i >= text.length) {
          clearInterval(iv);
          setTimeout(() => { cursor.remove(); cb && cb(); }, 300);
        }
      }, 60);
    }

    function runLine() {
      if (lineIdx >= lines.length) return;
      const data = lines[lineIdx++];

      if (data.type === 'cmd') {
        const div = appendLine(data);
        setTimeout(() => {
          typeCmd(div, data.text, () => {
            setTimeout(runLine, 200);
          });
        }, 80);
      } else {
        // output line — just appear after short delay
        setTimeout(() => {
          appendLine(data);
          setTimeout(runLine, 380);
        }, 160);
      }
    }

    // Start terminal after hero loads
    setTimeout(runLine, 1200);
    }
  }

  /* ── 4. COUNTER FIX  (ensures counters trigger reliably) ──── */
  // The original uses IntersectionObserver which sometimes misses
  // if the element is already in viewport on load.
  // This patch re-checks after a short delay.
  function fixCounters() {
    document.querySelectorAll('.count').forEach(el => {
      if (el.dataset.animated) return; // already done
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.dataset.animated = 'true';
        const target = +el.dataset.target;
        const step   = target / 40;
        let cur = 0;
        const iv = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = Math.ceil(cur);
          if (cur >= target) clearInterval(iv);
        }, 35);
      }
    });
  }
  window.addEventListener('scroll', fixCounters, { passive: true });
  setTimeout(fixCounters, 600); // check on load too

  /* ── 5. PROJECT CARD 3-D TILT (desktop only) ──────────────── */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r   = card.getBoundingClientRect();
        const x   = ((e.clientX - r.left) / r.width  - 0.5) * 10;
        const y   = ((e.clientY - r.top)  / r.height - 0.5) * -10;
        card.style.transform = `translateY(-6px) scale(1.01) rotateX(${y}deg) rotateY(${x}deg)`;
        card.style.transition = 'transform .1s linear, box-shadow .4s';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = '';
      });
    });
  }

  /* ── 6. CURSOR COLOUR SHIFT ON HEADINGS ──────────────────── */
  const cursor = document.getElementById('cursor');
  if (cursor) {
    document.querySelectorAll('h1 em, h2 em, .section-title em').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.background = 'var(--gold)';
        cursor.style.mixBlendMode = 'normal';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.background = '';
        cursor.style.mixBlendMode = '';
      });
    });
  }

  /* ── 7. ACTIVE NAV PAGE INDICATOR (underline current page) ── */
  // Already in main.js — this adds a subtle glow variant
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) {
      a.style.color = 'var(--text)';
    }
  });

  /* ── 8. AVAILABILITY STATUS BADGE IN HERO ─────────────────── */
  // Insert before hero stats if they exist and badge doesn't yet
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats && !document.querySelector('.hero-status')) {
    const badge = document.createElement('div');
    badge.className = 'hero-status';
    badge.textContent = 'Open to Internships & Collaborations';
    heroStats.insertAdjacentElement('beforebegin', badge);
  }

  /* ── 9. SMOOTH LINK HOVER UNDERLINE FOR FOOTER SOCIALS ───── */
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-3px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── 10. KEYBOARD SHORTCUT HINT  ─────────────────────────── */
  // Pressing '?' anywhere (outside inputs) shows a shortcuts toast
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === '?') {
      window.showOtepToast &&
        window.showOtepToast(
          'Shortcuts: [?] this hint · [Alt+G] Games · [Alt+P] Projects · [Alt+A] About · [Alt+C] Contact',
          6000
        );
    }
    // Quick nav shortcuts
    const shortcuts = { g: 'games.html', p: 'projects.html', a: 'about.html', c: 'contact.html' };
    if (e.altKey && shortcuts[e.key.toLowerCase()] && !e.ctrlKey && !e.metaKey) {
      // Only if not typing
      e.preventDefault();
      window.location.href = shortcuts[e.key.toLowerCase()];
    }
  });

})();

/* ================================================================
   2026 UPGRADE — Clock · Widgets · Leaderboards · Projects API ·
   Game of the Day · 3 new games (Click Frenzy / Odd One Out / Dice Duel)
   Every network call is wrapped so a missing PHP backend can never
   break a game or blank a page: failures fall back to localStorage.
   ================================================================ */
(function(){
  /* ---- Shared game catalogue (must match games.html tabs + api/db.php) ---- */
  const GAMES = [
    {key:'snake',label:'Snake',pun:"Sss-litherin' through the grid — this snake never skips leg day, mostly because it has no legs."},
    {key:'memory',label:'Memory',pun:'A match made in RAM — forget-me-not, literally.'},
    {key:'typer',label:'Type Sprint',pun:'Type fast or type furiously — either way, the keyboard is judging you.'},
    {key:'mole',label:'Whack-a-Mole',pun:'Whack-a-Mole: the only job where hitting things at work is encouraged.'},
    {key:'guess',label:'Number Guesser',pun:"It's thinking of a number. Spoiler: it's not 42. Probably."},
    {key:'quiz',label:'Dev Trivia',pun:"Dev trivia: where 'I read the docs' counts as a flex."},
    {key:'ttt',label:'Tic-Tac-Toe',pun:"Tic-Tac-Toe: X marks the spot, O marks the 'oh no'."},
    {key:'rps',label:'Rock Paper Scissors',pun:'Rock beats scissors, paper beats rock, and the AI beats your confidence.'},
    {key:'hang',label:'Hangman',pun:'Hangman: guess the word before your vocabulary hangs by a thread.'},
    {key:'simon',label:'Simon Says',pun:'Simon says: remember the pattern. Simon also says: good luck.'},
    {key:'pong',label:'Pong',pun:"Pong: the original 'just one more round', since before you were born."},
    {key:'math',label:'Math Sprint',pun:'Math Sprint: where 2 + 2 = 4, but under pressure it equals panic.'},
    {key:'scramble',label:'Word Scramble',pun:"Word Scramble: an anagram of 'fun' is 'nuf', which is fun backwards."},
    {key:'reaction',label:'Reaction Time',pun:"Reaction Time: blink and you'll miss it. Don't blink."},
    {key:'click',label:'Click Frenzy',pun:'Click Frenzy: ten seconds, one button, zero mercy for your mouse.'},
    {key:'odd',label:'Odd One Out',pun:'Odd One Out: one of these emojis is not like the others. It knows it.'},
    {key:'dice',label:'Dice Duel',pun:'Dice Duel: roll the dice, blame the dice, love the dice.'}
  ];
  window.OTEP_GAMES = GAMES;

  /* ---- Manila clock (nav + home widget) ---- */
  function tickClock(){
    try{
      const now = new Date();
      const time = new Intl.DateTimeFormat('en-PH',{timeZone:'Asia/Manila',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}).format(now);
      const date = new Intl.DateTimeFormat('en-PH',{timeZone:'Asia/Manila',weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(now);
      document.querySelectorAll('[data-clock-time]').forEach(el=>el.textContent=time);
      document.querySelectorAll('[data-clock-date]').forEach(el=>el.textContent=date);
      const ht=document.getElementById('homeClockTime'); if(ht) ht.textContent=time;
      const hd=document.getElementById('homeClockDate'); if(hd) hd.textContent=date + ' · Asia/Manila';
    }catch(e){ /* clock is decorative; never break the page */ }
  }
  tickClock(); setInterval(tickClock, 1000);

  /* ---- Game of the Day: deterministic by day-of-year ---- */
  function gameOfDay(){
    const now = new Date();
    const start = new Date(now.getFullYear(),0,0);
    const day = Math.floor((now - start) / 86400000);
    return GAMES[day % GAMES.length];
  }
  const gotd = gameOfDay();
  function activateGame(key){
    const btn = document.querySelector('.game-tab-btn[data-game="'+key+'"]');
    if(btn) btn.click();
  }
  [['gotdName','gotdPun','gotdPlay'],['gamesGotdName','gamesGotdPun','gamesGotdPlay']].forEach(ids=>{
    const n=document.getElementById(ids[0]), pu=document.getElementById(ids[1]), pl=document.getElementById(ids[2]);
    if(n) n.textContent = gotd.label;
    if(pu) pu.textContent = gotd.pun;
    if(pl){
      if(pl.tagName==='A'){ pl.href = 'games.html#game-' + gotd.key; }
      else pl.addEventListener('click', ()=>activateGame(gotd.key));
    }
  });
  // Deep-link: games.html#game-click opens that tab on load.
  if(location.hash && location.hash.indexOf('#game-')===0){
    const key = location.hash.replace('#game-','');
    if(GAMES.some(g=>g.key===key)) setTimeout(()=>activateGame(key), 50);
  }

  /* ---- Player name ---- */
  const playerInput = document.getElementById('playerName');
  if(playerInput){
    playerInput.value = localStorage.getItem('otep_player') || '';
    playerInput.placeholder = 'Anonymous';
    playerInput.addEventListener('input', ()=>localStorage.setItem('otep_player', playerInput.value.trim()));
  }
  function playerName(){
    const v = (playerInput ? playerInput.value.trim() : '') || localStorage.getItem('otep_player') || '';
    return v || 'Anonymous';
  }

  /* ---- Leaderboards: server first, localStorage fallback ---- */
  function localScores(game){
    try{ return JSON.parse(localStorage.getItem('otep_lb_'+game) || '[]'); }catch(e){ return []; }
  }
  function saveLocal(game, player, score){
    const list = localScores(game);
    list.push({player:player, score:score, created_at:new Date().toISOString().slice(0,10)});
    list.sort((a,b)=>b.score-a.score);
    localStorage.setItem('otep_lb_'+game, JSON.stringify(list.slice(0,10)));
  }
  window.otepSaveScore = function(game, score){
    if(typeof score !== 'number' || !isFinite(score)) return;
    const player = playerName();
    fetch('api/scores.php', {method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({game:game, player:player, score:Math.round(score)})})
      .then(r=>{ if(!r.ok) throw new Error('api'); return r.json(); })
      .then(()=>{ refreshLeaderboard(); })
      .catch(()=>{ saveLocal(game, player, Math.round(score)); refreshLeaderboard(); });
  };
  function renderLb(list, note){
    const el = document.getElementById('lbList'); if(!el) return;
    const noteEl = document.getElementById('lbNote'); if(noteEl) noteEl.textContent = note;
    if(!list.length){ el.innerHTML = '<li>No scores yet — be the first.</li>'; return; }
    el.innerHTML = list.map((r,i)=>'<li><span class="lb-rank">'+(i+1)+'</span> <strong>'+escapeHtml(r.player)+'</strong> <span class="lb-score">'+escapeHtml(String(r.score))+'</span> <span class="lb-date">'+escapeHtml(String(r.created_at||'').slice(0,10))+'</span></li>').join('');
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  window.otepEscapeHtml = escapeHtml;
  function refreshLeaderboard(){
    const sel = document.getElementById('lbGame'); if(!sel) return;
    const game = sel.value || 'snake';
    fetch('api/scores.php?game='+encodeURIComponent(game))
      .then(r=>{ if(!r.ok) throw new Error('api'); return r.json(); })
      .then(d=>renderLb(d.scores || [], 'Server leaderboard — scores are shared across visits.'))
      .catch(()=>renderLb(localScores(game), 'Showing scores saved in this browser. Start the PHP server (README-PHP.md) to share them.'));
  }
  const lbSel = document.getElementById('lbGame');
  if(lbSel){
    lbSel.innerHTML = GAMES.map(g=>'<option value="'+g.key+'">'+escapeHtml(g.label)+'</option>').join('');
    lbSel.addEventListener('change', refreshLeaderboard);
    refreshLeaderboard();
    // Keep the leaderboard in sync with the active game tab.
    document.querySelectorAll('.game-tab-btn').forEach(btn=>btn.addEventListener('click', ()=>{
      lbSel.value = btn.dataset.game; refreshLeaderboard();
    }));
  }

  /* ---- Home stats widget: best score from this browser ---- */
  (function(){
    const el = document.getElementById('widgetTopScore'); if(!el) return;
    let best = 0;
    ['snake_hs','mole_hs','math_best','simon_hs'].forEach(k=>{ const v = parseInt(localStorage.getItem(k)||'0',10); if(v>best) best=v; });
    GAMES.forEach(g=>localScores(g.key).forEach(r=>{ if(r.score>best) best=r.score; }));
    el.textContent = best > 0 ? String(best) : '—';
    const wp = document.getElementById('widgetProjects');
    if(wp) fetch('api/projects.php').then(r=>r.json()).then(d=>{ if(Array.isArray(d.projects)) wp.textContent = String(d.projects.length); }).catch(()=>{});
  })();

  /* ---- Projects page: live data from API, hard-coded cards as fallback ---- */
  (function(){
    const grid = document.getElementById('projectsGrid'); if(!grid) return;
    fetch('api/projects.php').then(r=>{ if(!r.ok) throw new Error('api'); return r.json(); }).then(data=>{
      const list = data.projects; if(!Array.isArray(list) || !list.length) return;
      const thumbClass = (f)=>{
        const t = (f||'').split(' ')[0];
        return {python:'type-python',web:'type-web',figma:'type-design',research:'type-research',design:'type-design',media:'type-brand',group:'type-net'}[t] || 'type-web';
      };
      grid.innerHTML = list.map(p=>{
        const tags = String(p.tags||'').split(',').map(t=>t.trim()).filter(Boolean);
        const links = [];
        if(p.link) links.push('<a href="'+escapeHtml(p.link)+'" target="_blank" rel="noopener noreferrer" class="project-link">↗ '+escapeHtml(p.link_label||'View')+'</a>');
        if(p.link2) links.push('<a href="'+escapeHtml(p.link2)+'" target="_blank" rel="noopener noreferrer" class="project-link">📄 '+escapeHtml(p.link2_label||'View')+'</a>');
        const img = p.image ? '<span class="thumb-label"><img src="'+escapeHtml(p.image)+'" alt="'+escapeHtml(p.title)+'" loading="lazy" decoding="async"/></span>' : '';
        return '<div class="project-card reveal visible" data-cat="'+escapeHtml(p.filter)+'">'
          + '<div class="project-thumb '+thumbClass(p.filter)+'"><div class="thumb-overlay"></div>'+img+'</div>'
          + '<div class="project-body"><p class="project-cat">'+escapeHtml(p.category)+'</p>'
          + '<h3 class="project-title">'+escapeHtml(p.title)+'</h3>'
          + '<p class="project-desc">'+escapeHtml(p.description)+'</p>'
          + '<div class="project-tags">'+tags.map(t=>'<span class="tag">'+escapeHtml(t)+'</span>').join('')+'</div>'
          + '<div class="project-links">'+links.join('')+'</div></div></div>';
      }).join('');
      // Re-wire filter/search for the new cards. The original listeners still
      // run first (on the old, now-detached cards); these run after and win
      // the count / empty-state, so the visible result is always correct.
      const tabs = document.querySelectorAll('.filter-btn');
      const search = document.getElementById('projectSearch');
      const clearBtn = document.getElementById('projectSearchClear');
      const counter = document.getElementById('proj-count');
      const empty = document.getElementById('projectEmpty');
      let active = 'all';
      function apply(){
        const q = (search ? search.value : '').trim().toLowerCase();
        let visible = 0;
        grid.querySelectorAll('.project-card').forEach(c=>{
          const cats = (c.dataset.cat||'').split(' ');
          const show = (active==='all'||cats.includes(active)) && (!q || c.textContent.toLowerCase().includes(q));
          c.classList.toggle('hidden', !show);
          if(show) visible++;
        });
        if(counter) counter.textContent = visible;
        if(empty) empty.hidden = visible > 0;
      }
      tabs.forEach(tab=>tab.addEventListener('click', ()=>{ active = tab.dataset.filter || 'all'; apply(); }));
      search && search.addEventListener('input', apply);
      clearBtn && clearBtn.addEventListener('click', ()=>{ if(search) search.value=''; apply(); });
      const note = document.createElement('p');
      note.className = 'widget-note'; note.style.marginBottom = '1rem';
      note.textContent = 'Live project data — edit these in admin.php. If the API is unavailable, the original cards below are kept instead.';
      grid.parentNode.insertBefore(note, grid);
      apply();
    }).catch(()=>{ /* keep the hard-coded cards: static hosting fallback */ });
  })();
})();

/* ================================================================
   2026 UPGRADE — 3 new games
   ================================================================ */
(function(){
  if(!document.getElementById('gameTabs')) return;
  const save = (g,s)=>{ if(window.otepSaveScore) window.otepSaveScore(g,s); };

  /* ---- Click Frenzy: clicks in 10 seconds ---- */
  (function(){
    const scoreEl=document.getElementById('clickScore'), timeEl=document.getElementById('clickTime'),
          bestEl=document.getElementById('clickBest'), msgEl=document.getElementById('clickMsg'),
          btn=document.getElementById('clickBtn'), start=document.getElementById('clickStart'),
          startTxt=document.getElementById('clickStartTxt');
    if(!btn) return;
    let score=0, timeLeft=10, running=false, timer=null;
    let best=+(localStorage.getItem('click_best')||0); bestEl.textContent=best;
    function end(){
      running=false; clearInterval(timer); btn.disabled=true;
      if(score>best){ best=score; localStorage.setItem('click_best',best); bestEl.textContent=best; }
      msgEl.textContent = score>=60 ? '🔥 '+score+' clicks! Your mouse is filing a complaint.' : score>=35 ? '💪 '+score+' clicks — solid frenzy!' : score+' clicks. Warm up those fingers and go again.';
      startTxt.textContent='Play Again →'; save('click', score);
    }
    start.addEventListener('click', ()=>{
      score=0; timeLeft=10; running=true;
      scoreEl.textContent=0; timeEl.textContent=10; btn.disabled=false;
      msgEl.textContent='Go! Click as fast as you can!'; startTxt.textContent='Restart →';
      clearInterval(timer);
      timer=setInterval(()=>{ timeLeft--; timeEl.textContent=timeLeft; if(timeLeft<=0) end(); }, 1000);
    });
    btn.addEventListener('click', ()=>{ if(!running) return; score++; scoreEl.textContent=score; });
  })();

  /* ---- Odd One Out: find the different emoji, rounds get harder ---- */
  (function(){
    const grid=document.getElementById('oddGrid'), roundEl=document.getElementById('oddRound'),
          scoreEl=document.getElementById('oddScore'), bestEl=document.getElementById('oddBest'),
          msgEl=document.getElementById('oddMsg'), start=document.getElementById('oddStart'),
          startTxt=document.getElementById('oddStartTxt');
    if(!grid) return;
    const SETS=[['🐶','🐱'],['🍎','🍏'],['⭐','🌟'],['🚗','🚙'],['🐟','🐠'],['🌸','🌺'],['⚽','🏀'],['🍕','🍔']];
    let round=0, score=0, running=false;
    let best=+(localStorage.getItem('odd_best')||0); bestEl.textContent=best;
    function nextRound(){
      round++; roundEl.textContent=round;
      const size = Math.min(3 + Math.floor(round/3), 6); // 3x3 -> up to 6x6
      const pair = SETS[Math.floor(Math.random()*SETS.length)];
      const total = size*size, oddIdx = Math.floor(Math.random()*total);
      grid.innerHTML=''; grid.style.gridTemplateColumns='repeat('+size+', 1fr)';
      for(let i=0;i<total;i++){
        const b=document.createElement('button'); b.className='odd-cell'; b.type='button';
        b.textContent = (i===oddIdx) ? pair[1] : pair[0];
        b.addEventListener('click', ()=>{
          if(!running) return;
          if(i===oddIdx){ score+=10; scoreEl.textContent=score; msgEl.textContent='✅ Found it! Round '+(round+1)+'…'; setTimeout(nextRound, 450); }
          else { msgEl.textContent='✗ Not that one — look closer!'; }
        });
        grid.appendChild(b);
      }
      msgEl.textContent='Find the one emoji that is different!';
    }
    start.addEventListener('click', ()=>{
      round=0; score=0; running=true; scoreEl.textContent=0;
      startTxt.textContent='Restart →'; nextRound();
    });
    // Odd One Out is endless, so (like Scramble) it gets an explicit
    // save button, and the best score is tracked in the HUD.
    grid.addEventListener('click', ()=>{ if(score>best){ best=score; localStorage.setItem('odd_best',best); bestEl.textContent=best; } });
    const saveBtn = document.createElement('button');
    saveBtn.className='btn btn-outline'; saveBtn.type='button'; saveBtn.style.cssText='margin-top:1rem;font-size:.62rem;';
    saveBtn.textContent='💾 Save my Odd One Out score';
    saveBtn.addEventListener('click', ()=>{
      const v = parseInt((document.getElementById('oddScore')||{}).textContent||'0',10) || 0;
      save('odd', v);
      if(window.showOtepToast) window.showOtepToast('Odd One Out score saved: '+v, 3000);
    });
    start.parentNode.insertBefore(saveBtn, start.nextSibling);
  })();

  /* ---- Dice Duel: roll vs AI, first to 5 ---- */
  (function(){
    const pEl=document.getElementById('dicePlayer'), aEl=document.getElementById('diceAi'),
          pS=document.getElementById('dicePScore'), aS=document.getElementById('diceAScore'),
          msg=document.getElementById('diceMsg'), roll=document.getElementById('diceRoll'),
          reset=document.getElementById('diceReset');
    if(!roll) return;
    const FACES=['⚀','⚁','⚂','⚃','⚄','⚅'];
    let ps=0, as=0, over=false;
    function render(){ pS.textContent=ps; aS.textContent=as; }
    function resetGame(){ ps=0; as=0; over=false; pEl.textContent='🎲'; aEl.textContent='🎲'; msg.textContent='Roll against the AI. Higher roll wins the round. First to 5 wins the duel.'; roll.disabled=false; render(); }
    roll.addEventListener('click', ()=>{
      if(over) return;
      const p=Math.floor(Math.random()*6)+1, a=Math.floor(Math.random()*6)+1;
      pEl.textContent=FACES[p-1]; aEl.textContent=FACES[a-1];
      [pEl,aEl].forEach(el=>{ el.classList.add('pop'); setTimeout(()=>el.classList.remove('pop'),400); });
      if(p>a){ ps++; msg.textContent='You rolled '+p+', AI rolled '+a+'. Point yours!'; }
      else if(a>p){ as++; msg.textContent='AI rolled '+a+', you rolled '+p+'. The dice betrayed you.'; }
      else { msg.textContent='Both rolled '+p+'. A tie — the dice refuse to choose.'; }
      render();
      if(ps>=5){ over=true; roll.disabled=true; msg.textContent='🏆 You win the duel, 5-'+as+'! The dice were on your side.'; save('dice', ps); }
      else if(as>=5){ over=true; roll.disabled=true; msg.textContent='🤖 AI wins the duel, 5-'+ps+'. Rematch? The dice are already rolling.'; }
    });
    reset.addEventListener('click', resetGame);
    resetGame();
  })();

  /* ---- Word Scramble: save-score button (no natural end state) ---- */
  (function(){
    const startBtn = document.getElementById('scrambleStart'); if(!startBtn) return;
    const btn = document.createElement('button');
    btn.className='btn btn-outline'; btn.type='button'; btn.style.cssText='margin-top:1rem;font-size:.62rem;';
    btn.textContent='💾 Save my scramble score';
    btn.addEventListener('click', ()=>{
      const v = parseInt((document.getElementById('scrambleScore')||{}).textContent||'0',10) || 0;
      save('scramble', v);
      if(window.showOtepToast) window.showOtepToast('Scramble score saved: '+v, 3000);
    });
    startBtn.parentNode.insertBefore(btn, startBtn.nextSibling);
  })();
})();
