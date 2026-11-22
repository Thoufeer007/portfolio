/* Option B · The Drawing Set, in motion */
(() => {
  const P = window.PROJECTS || [], ROLES = window.ROLES || [], EDU = window.EDU || [];
  const BASE = window.ASSET_BASE || '';
  const CODE = window.CODE || '';
  const SECTIONS = window.SECTIONS || [];
  const SHORT = ['Information and AI', 'Saudi giga‑projects', 'Buildings and workplaces', 'Transport and infrastructure', 'Design practice'];
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesk = () => innerWidth > 820;
  const hasGsap = typeof window.gsap !== 'undefined';
  const motion = hasGsap && !reduce;
  const src = p => (p.startsWith('data:') || p.startsWith('http')) ? p : BASE + p;
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  document.documentElement.classList.add('js');
  if (hasGsap) { gsap.registerPlugin(ScrollTrigger); if (window.Flip) gsap.registerPlugin(Flip); }

  /* ---------- record + education ---------- */
  $('.tl__list').innerHTML = ROLES.map(([d, t, o, x]) =>
    `<li><p class="tl__d">${d}</p><div><p class="tl__t">${t}</p><p class="tl__o">${o}</p><p class="tl__x">${x}</p></div></li>`).join('');
  $('.edu').innerHTML = EDU.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b.replace('(IL3) + Zigurat', '(IL3) · Zigurat Institute of Technology'))}</span></li>`).join('');

  /* ---------- register: keys + cards ---------- */
  const kindOf = p => p.kind || 'photo';
  $('.keys__row').innerHTML = `<button class="key" aria-pressed="true" data-k="-1">All</button>` +
    SECTIONS.map((s, i) => `<button class="key" aria-pressed="false" data-k="${i}" title="${esc(s)}"><b>${i + 1}</b><span>${esc(SHORT[i])}</span></button>`).join('');
  const track = $('.reel__track');
  track.innerHTML = P.map((p, i) => {
    const nums = (p.nums || []).slice(0, 3);
    return `<li class="card" data-i="${i}" data-sec="${p.sec}">
      <div class="card__strip"><span>Sheet <b>P${pad(p.no)}</b></span><span>${p.sec + 1} · ${esc(SHORT[p.sec])}</span></div>
      <div class="card__img is-${kindOf(p)}"><img src="${src(p.cover)}" alt="" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async"></div>
      <div class="card__body"><h3 class="card__t">${esc(p.title)} <i>${esc(p.it)}</i></h3><p class="card__kick">${esc(p.kick)}</p></div>
      <dl class="card__nums">${nums.map(([a, b]) => `<div><dt data-num="${esc(a)}">${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
      <button class="card__open" aria-label="Open project sheet: ${esc(p.title + ' ' + p.it)}"><span>Open sheet →</span></button>
    </li>`;
  }).join('') + `<li class="card card--end"><p class="k">End of register</p><p class="big">Twenty projects and the current role. <i>One way of working:</i> model it, check it twice, sign it.</p><a class="btn" style="border-color:#F1EDE4;color:#F1EDE4" href="#contact">Talk about a project →</a></li>`;
  const cards = $$('.card[data-i]');

  /* ---------- number count-up ---------- */
  const countUp = el => {
    const raw = el.dataset.num || el.textContent;
    const m = raw.match(/^([^\d]*?)(\d[\d,]*(?:\.\d+)?)([^\d]*)$/);
    if (!m || !motion || el.dataset.done) return;
    if (/^0\d/.test(m[2]) || /[A-Za-z]-$/.test(m[1]) || (+m[2] >= 1900 && +m[2] <= 2100 && !el.hasAttribute('data-plain'))) return;
    el.dataset.done = 1;
    const [, pre, num, post] = m, dec = (num.split('.')[1] || '').length, comma = num.includes(','), target = parseFloat(num.replace(/,/g, ''));
    if (el.hasAttribute('data-plain')) { const o = { v: target - 40 }; gsap.to(o, { v: target, duration: 1.4, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v) }); return; }
    const o = { v: 0 };
    gsap.to(o, { v: target, duration: 1.5, ease: 'power3.out', onUpdate: () => {
      let s = o.v.toFixed(dec); if (comma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      el.textContent = pre + s + post; } });
  };

  /* ---------- card reveal (IntersectionObserver works with transformed reels) ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const c = e.target; io.unobserve(c);
    if (!motion) return;
    const box = $('.card__img', c), img = $('img', box);
    gsap.fromTo(box, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.inOut' });
    gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out' });
    gsap.from($$('.card__body > *, .card__nums > div', c), { y: 18, opacity: 0, duration: .8, stagger: .06, ease: 'power3.out', delay: .25 });
    $$('[data-num]', c).forEach(countUp);
  }), { threshold: .25 });
  cards.forEach(c => io.observe(c));

  /* ---------- split helpers ---------- */
  const splitChars = el => { const t = el.textContent; el.innerHTML = [...t].map(ch => `<span class="ch"><span>${ch === ' ' ? '&nbsp;' : esc(ch)}</span></span>`).join(''); el.setAttribute('aria-hidden', 'true'); };
  const splitWords = el => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
          const o = document.createElement('span'); o.className = 'w'; const i = document.createElement('span'); i.textContent = w; o.appendChild(i); frag.appendChild(o);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(el);
  };

  /* ---------- code panel (types itself) ---------- */
  const codeEl = $('#code');
  const hl = s => esc(s).replace(/\b(def|return|max|float)\b/g, '<span class="kw">$1</span>').replace(/(Rebar\.CreateFromRebarShape|GetShapeDrivenAccessor|ScaleToBox)/g, '<span class="kw">$1</span>');
  const lines = CODE.split('\n');
  const renderCode = (k, caret) => {
    if (!codeEl) return;
    let left = k, out = '';
    lines.forEach((l, i) => {
      if (left < 0) return;
      const part = l.slice(0, Math.max(0, left)); left -= l.length + 1;
      out += `<span class="ln">${i + 59}</span>${hl(part)}${caret && left < 0 ? '<span class="caret"></span>' : ''}\n`;
    });
    codeEl.innerHTML = out;
  };
  renderCode(CODE.length, false);

  /* ---------- title block ---------- */
  const sheets = $$('[data-sheet]');
  const tbKeys = $$('.tb__keys i');
  const setSheet = (n, name) => {
    $('.tb__sheet').textContent = name;
    $('.tb__dwg b').textContent = 'TN-W-' + pad(n);
    $('.tb__n b').textContent = pad(n);
    tbKeys.forEach((k, i) => { k.classList.toggle('on', i === n - 1); k.classList.toggle('done', i < n - 1); });
  };
  setSheet(1, sheets[0].dataset.name);

  /* ---------- hero construction lines ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const heroSvg = $('.hero__lines');
  const buildLines = () => {
    const body = $('.hero__body').getBoundingClientRect();
    const [l1, l2] = $$('.hero__line').map(l => {
      const r = document.createRange(); r.selectNodeContents(l); const b = r.getBoundingClientRect();
      return { x: b.left - body.left, y: b.top - body.top, w: b.width, h: b.height };
    });
    const W = body.width, H = body.height;
    heroSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const cap1 = l1.y + l1.h * .2, base1 = l1.y + l1.h * .80, base2 = l2.y + l2.h * .80;
    const d1 = l1.y - 6, d2 = Math.min(H - 4, base2 + l2.h * .14);
    const items = [
      ['path', { class: 'faint', d: `M0 ${cap1} H${W}` }],
      ['path', { class: 'faint', d: `M0 ${base1} H${W}` }],
      ['path', { class: 'faint', d: `M0 ${base2} H${W}` }],
      ['path', { class: 'faint', d: `M${l1.x + 4} 0 V${H}` }],
      ['path', { d: `M${l1.x + 4} ${d1} H${l1.x + l1.w} M${l1.x + 4} ${d1 - 6} v12 M${l1.x + l1.w} ${d1 - 6} v12` }],
      ['text', { x: l1.x + 10, y: d1 - 8 }, 'Architect · SPA New Delhi · 2017'],
      ['path', { d: `M${l2.x + l2.w * .08} ${d2} H${l2.x + l2.w} M${l2.x + l2.w * .08} ${d2 - 6} v12 M${l2.x + l2.w} ${d2 - 6} v12` }],
      ['text', { x: l2.x + l2.w * .08 + 6, y: d2 + 16 }, W < 600 ? 'Delivery lead · Barcelona · 2025 –' : 'Digital delivery lead · Barcelona · 2025 –'],
    ];
    if (l2.x + l2.w + 200 < W) items.push(
      ['circle', { cx: l2.x + l2.w + 14, cy: base2 - l2.h * .25, r: 6 }],
      ['path', { d: `M${l2.x + l2.w + 20} ${base2 - l2.h * .25} L${l2.x + l2.w + 60} ${base2 - l2.h * .55} H${Math.min(W - 4, l2.x + l2.w + 175)}` }],
      ['text', { x: l2.x + l2.w + 64, y: base2 - l2.h * .55 - 7 }, 'BIM · CDE · AI']);
    heroSvg.innerHTML = '';
    items.forEach(([tag, at, txt]) => {
      const el = document.createElementNS(NS, tag);
      Object.entries(at).forEach(([k, v]) => el.setAttribute(k, v));
      if (txt) el.textContent = txt;
      heroSvg.appendChild(el);
    });
  };
  const drawPaths = (paths, opt = {}) => {
    paths.forEach(p => { const L = p.getTotalLength ? p.getTotalLength() : 300; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    return gsap.to(paths, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: .06, ...opt });
  };

  const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => {
    buildLines();
    $$('.hero__line').forEach(splitChars);
    $$('[data-split-words]').forEach(splitWords);
    if (!motion) { if (hasGsap) ScrollTrigger.refresh(); return; }
    initMotion();
  });

  function initMotion() {
    /* hero intro */
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.grid-bg', { opacity: 0, duration: 1.2, ease: 'power1.out' }, 0)
      .from('.hero__line .ch > span', { yPercent: 115, duration: 1.3, stagger: .035 }, .1)
      .add(drawPaths($$('path', heroSvg), { duration: 1.2, stagger: .08 }), .5)
      .from($$('text, circle', heroSvg), { opacity: 0, duration: .6, stagger: .08, ease: 'power1.out' }, 1.2)
      .add(drawPaths($$('.cut .draw'), { duration: 1.3, stagger: .05 }), .7)
      .from('.cut .fillin', { opacity: 0, duration: .8, stagger: .03, ease: 'power1.out' }, 2.0)
      .to('.hero [data-reveal]', { opacity: 1, y: 0, duration: 1, stagger: .1 }, 1.0)
      .from('.hero__top', { opacity: 0, y: -10, duration: .8 }, .3);

    /* reveals */
    $$('[data-reveal]').filter(el => !el.closest('.hero')).forEach(el =>
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
    $$('[data-split-words]').forEach(el =>
      gsap.from($$('.w > span', el), { yPercent: 110, duration: 1.1, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));
    /* picture reveal: laptops only. Phones and in-app viewers show every picture at once (never an empty box). */
    const SMALL = matchMedia('(max-width: 820px)').matches;
    if (!SMALL) $$('.sheet .mask').forEach(m => {
      gsap.fromTo(m, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: m, start: 'top 85%', once: true } });
      gsap.fromTo($('img', m), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: m, start: 'top 85%', once: true } });
    });
    /* safety net: any picture on screen that is still clipped after 1.2 s is shown */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(en => {
        if (!en.isIntersecting) return; const m = en.target; io.unobserve(m);
        setTimeout(() => { if (getComputedStyle(m).clipPath.indexOf('100%') > -1) { gsap.set(m, { clipPath: 'none' }); gsap.set($('img', m), { scale: 1 }); } }, 1200);
      }), { threshold: 0.05 });
      $$('.mask').forEach(m => io.observe(m));
    }
    addEventListener('load', () => ScrollTrigger.refresh());
    $$('.sheet [data-count]').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => { el.dataset.num = el.textContent; countUp(el); } }));

    /* code types itself */
    renderCode(0, true);
    if (codeEl) ScrollTrigger.create({ trigger: codeEl, start: 'top 80%', once: true, onEnter: () => {
      const o = { k: 0 };
      gsap.to(o, { k: CODE.length, duration: 3.4, ease: 'none', onUpdate: () => renderCode(Math.round(o.k), true), onComplete: () => { renderCode(CODE.length, true); if (window.ScrollTrigger) ScrollTrigger.refresh(); } });
    } });

    /* marquee, pushed by scroll speed */
    const mq = gsap.to('.marquee__track', { xPercent: -50, repeat: -1, duration: 34, ease: 'none' });
    let skew = gsap.quickTo('.marquee__track', 'skewX', { duration: .5, ease: 'power3' });
    ScrollTrigger.create({ onUpdate: s => {
      const v = s.getVelocity();
      gsap.to(mq, { timeScale: 1 + Math.min(6, Math.abs(v) / 300) * Math.sign(v || 1), duration: .2, overwrite: true, onComplete: () => gsap.to(mq, { timeScale: 1, duration: 1.2 }) });
      skew(gsap.utils.clamp(-8, 8, -v / 220));
    } });

    /* models band: two rows drift against each other with the scroll */
    gsap.fromTo('.mband__row--a', { xPercent: 0 }, { xPercent: -28, ease: 'none', scrollTrigger: { trigger: '.mband', start: 'top bottom', end: 'bottom top', scrub: .6 } });
    gsap.fromTo('.mband__row--b', { xPercent: -22 }, { xPercent: 4, ease: 'none', scrollTrigger: { trigger: '.mband', start: 'top bottom', end: 'bottom top', scrub: .6 } });
    gsap.from('.mb__m', { y: 40, opacity: 0, duration: 1, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: '.mband', start: 'top 80%' } });

    /* timeline rail */
    gsap.to('.tl__rail i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 70%', scrub: .6 } });
    $$('.tl__list li').forEach(li => ScrollTrigger.create({ trigger: li, start: 'top 70%', onEnter: () => li.classList.add('on'), onLeaveBack: () => li.classList.remove('on') }));
    gsap.from('.tl__list li', { opacity: 0, x: 24, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.tl', start: 'top 80%' } });

    /* parallax */
    if (!SMALL) $$('.community .mask img').forEach(img => gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.closest('figure'), start: 'top bottom', end: 'bottom top', scrub: true } }));
    gsap.fromTo('.contact__model img', { yPercent: 18, rotate: -3, scale: .92 }, { yPercent: -6, rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    /* desktop: sheets stack + horizontal register */
    const mm = gsap.matchMedia();
    mm.add('(min-width: 821px)', () => {
      const order = $$('#hero, #model, #profile, #record, #credentials, #models, #featured, #work, #community, #contact');
      order.forEach((s, i) => s.style.zIndex = i + 1);
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const bar = $('.reel__bar i'), cnt = $('.reel__count');
      let st;
      const pinned = ['hero', 'profile', 'record'];   // community scrolls: five photos are taller than a screen
      order.forEach(s => {
        if (s.id === 'work') {
          const tw = gsap.to(track, { x: () => -dist(), ease: 'none' });
          st = ScrollTrigger.create({
            trigger: '#work', start: 'top top', end: () => '+=' + dist() * .6, pin: true, scrub: .8, animation: tw, invalidateOnRefresh: true,
            onUpdate: self => {
              bar.style.setProperty('--p', self.progress.toFixed(4));
              const vis = $$('.card[data-i]', track);
              const idx = Math.min(vis.length - 1, Math.round(self.progress * (vis.length - 1)));
              const p = P[+vis[idx].dataset.i];
              cnt.textContent = pad(idx + 1) + ' / ' + pad(vis.length);
              if (self.isActive) $('.tb__sheet').textContent = 'Register · ' + p.title + ' ' + p.it;
            }
          });
          return;
        }
        if (s.id === 'model') {
          ScrollTrigger.create({ trigger: s, start: 'top top', end: () => '+=' + innerHeight * 2.4, pin: true,
            onUpdate: self => setStep(Math.min(5, Math.floor(self.progress * 6.2))) });
          return;
        }
        if (!pinned.includes(s.id)) return;
        const next = order[order.indexOf(s) + 1];
        const shade = document.createElement('i'); shade.className = 'shade';
        Object.assign(shade.style, { position: 'absolute', inset: 0, background: '#16181D', opacity: 0, pointerEvents: 'none', zIndex: 9 });
        s.appendChild(shade);
        ScrollTrigger.create({ trigger: s, start: () => s.offsetHeight > innerHeight ? 'bottom bottom' : 'top top', endTrigger: next, end: 'top top', pin: true, pinSpacing: false });
        gsap.to(shade, { opacity: .38, ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } });
      });
      window.__reelStart = () => st.start;
      return () => { order.forEach(s => s.style.zIndex = ''); $$('.shade').forEach(x => x.remove()); };
    });
    mm.add('(max-width: 820px)', () => {
      const reel = $('.reel'), bar = $('.reel__bar i'), cnt = $('.reel__count');
      const on = () => {
        const max = reel.scrollWidth - reel.clientWidth, p = max > 0 ? reel.scrollLeft / max : 0;
        bar.style.setProperty('--p', p.toFixed(4));
        const n = $$('.card[data-i]').length; cnt.textContent = pad(Math.round(p * (n - 1)) + 1) + ' / ' + pad(n);
      };
      reel.addEventListener('scroll', on, { passive: true });
      window.__reelStart = null;
      return () => reel.removeEventListener('scroll', on);
    });

    /* title block follows the sheets */
    sheets.forEach((s, i) => ScrollTrigger.create({ trigger: s, start: 'top 50%', onEnter: () => setSheet(i + 1, s.dataset.name), onLeaveBack: () => i && setSheet(i, sheets[i - 1].dataset.name) }));
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => $('.tb__prog').style.transform = `scaleX(${s.progress})` });

    /* smooth scroll on desktop */
    if (isDesk() && window.Lenis) {
      const lenis = new Lenis({ lerp: .11, wheelMultiplier: 1 });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- the model: a precast frame in three.js, re-lit for paper ---------- */
  let model = null, step = -1;
  const stepLis = $$('.steps li');
  function setStep(n) {
    if (n === step) return; step = n;
    stepLis.forEach((li, i) => li.classList.toggle('is-on', i === n));
    $('.model__step').textContent = `Step ${pad(n + 1)} / 06`;
    $('.model__stamp').classList.toggle('on', n === 5);
    if (model) model.setStep(n);
  }
  function makeModel() {
    const stage = $('.model__stage'), canvas = $('.model__cv');
    if (!window.THREE) { stage.classList.add('no-3d'); return null; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { stage.classList.add('no-3d'); return null; }
    renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, .1, 300), cam0 = [24, 16, 27];
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8cfbd, .8));
    const sun = new THREE.DirectionalLight(0xffffff, .7); sun.position.set(18, 30, 12); scene.add(sun);
    const fill = new THREE.DirectionalLight(0xdfe6ff, .3); fill.position.set(-20, 10, -14); scene.add(fill);
    const root = new THREE.Group(); scene.add(root);
    const M = {
      concrete: new THREE.MeshStandardMaterial({ color: 0xEDE8DC, roughness: .92, metalness: 0 }),
      slab: new THREE.MeshStandardMaterial({ color: 0xDCE2EF, roughness: .95, transparent: true, opacity: .95 }),
      rebar: new THREE.MeshStandardMaterial({ color: 0x1D3BC9, roughness: .45, metalness: .15 }),
      edge: new THREE.LineBasicMaterial({ color: 0x16181D, transparent: true, opacity: .55 }),
      ghost: new THREE.LineBasicMaterial({ color: 0x1D3BC9, transparent: true, opacity: .2 }),
      clash: new THREE.MeshBasicMaterial({ color: 0xE5484D, transparent: true, opacity: 0, depthTest: false })
    };
    const grid = new THREE.GridHelper(32, 32, 0x1D3BC9, 0x1D3BC9); grid.material.transparent = true; grid.material.opacity = .16; root.add(grid);
    const parts = [];
    const add = (geo, mat, x, y, z, kind, delay) => {
      const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); root.add(m);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), M.edge); e.position.copy(m.position); root.add(e);
      const g = new THREE.LineSegments(e.geometry, M.ghost); g.position.copy(m.position); root.add(g);
      parts.push({ m, e, g, y, kind, delay, k: 0 });
    };
    const bay = 5, h = 3.4, storeys = 3, n = 4, off = (n - 1) * bay / 2; let d = 0;
    for (let st = 0; st < storeys; st++) {
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if (st === 0 && i === 0 && j === n - 1) continue; add(new THREE.BoxGeometry(.5, h, .5), M.concrete, i * bay - off, st * h + h / 2, j * bay - off, 'col', d += .012); }
      for (let i = 0; i < n; i++) for (let j = 0; j < n - 1; j++) {
        add(new THREE.BoxGeometry(.45, .6, bay - .5), M.concrete, i * bay - off, (st + 1) * h - .3, j * bay - off + bay / 2, 'beam', d += .008);
        add(new THREE.BoxGeometry(bay - .5, .6, .45), M.concrete, j * bay - off + bay / 2, (st + 1) * h - .3, i * bay - off, 'beam', d += .008);
      }
      for (let i = 0; i < n - 1; i++) for (let j = 0; j < n - 1; j++) { if (st === storeys - 1 && (i + j) % 2 === 0) continue; add(new THREE.BoxGeometry(bay - .1, .22, bay - .1), M.slab, i * bay - off + bay / 2, (st + 1) * h + .11, j * bay - off + bay / 2, 'slab', d += .012); }
    }
    // two rebar cages where a column is left out: the automated draft
    [[-off, (n - 1) * bay - off], [bay - off, (n - 1) * bay - off + .0001]].forEach(([cx, cz], ci) => {
      const cage = new THREE.Group(); cage.position.set(cx, 0, cz); root.add(cage);
      const H = ci ? h * 2 : h;
      [[-.18, -.18], [.18, -.18], [-.18, .18], [.18, .18], [0, -.18], [0, .18], [-.18, 0], [.18, 0]].forEach(([x, z]) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, H, 6), M.rebar); b.position.set(x + (ci ? 1.2 : 0), H / 2, z - (ci ? 1.4 : 0)); cage.add(b); });
      for (let k = 0; k < (ci ? 30 : 16); k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.27, .014, 4, 4), M.rebar); r.rotation.set(Math.PI / 2, 0, Math.PI / 4); r.position.set(ci ? 1.2 : 0, .15 + k * (H - .3) / ((ci ? 30 : 16) - 1), ci ? -1.4 : 0); cage.add(r); }
      parts.push({ m: cage, e: null, g: null, y: 0, kind: 'cage', delay: ci * .2, k: 0 });
    });
    const clash = new THREE.Mesh(new THREE.SphereGeometry(.9, 20, 14), M.clash); clash.position.set(bay / 2 - off, 2 * h - .3, -off); root.add(clash);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.33, 48), new THREE.MeshBasicMaterial({ color: 0xE5484D, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false }));
    ring.position.copy(clash.position); root.add(ring);

    let target = reduce ? 5 : 0, rotY = -.4, rotX = 0, dragging = false, lx = 0, ly = 0, mx = 0, my = 0;
    const want = p => ({ col: target >= 1, beam: target >= 2, slab: target >= 2, cage: target >= 3 }[p.kind]);
    canvas.addEventListener('pointerdown', e => { dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', e => { if (!dragging) return; rotY += (e.clientX - lx) * .008; rotX = Math.max(-.3, Math.min(.3, rotX + (e.clientY - ly) * .004)); lx = e.clientX; ly = e.clientY; });
    addEventListener('pointerup', () => { dragging = false; });
    addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
    canvas.addEventListener('keydown', e => { const k = { ArrowLeft: -.15, ArrowRight: .15 }[e.key]; if (k) { e.preventDefault(); rotY += k; } });
    const size = () => { const r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return; renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height;
      const back = Math.min(1.7, Math.max(.92, 1.25 / camera.aspect)); camera.position.set(cam0[0] * back, cam0[1] * back, cam0[2] * back); camera.lookAt(0, 4.4, 0); camera.updateProjectionMatrix(); };
    new ResizeObserver(size).observe(canvas); size();
    let visible = true; new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);
    const t0 = performance.now(); let last = t0;
    const ink = new THREE.Color(0x16181D), cob = new THREE.Color(0x1D3BC9);
    const frame = now => {
      requestAnimationFrame(frame); if (!visible) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now; const t = (now - t0) / 1000;
      parts.forEach(p => {
        const on = want(p);
        p.k += ((on ? 1 : 0) - p.k) * Math.min(1, reduce ? 1 : dt * 4.5);
        const k = 1 - Math.pow(1 - Math.max(0, Math.min(1, p.k)), 3), y = p.y + (1 - k) * 7;
        p.m.position.y = y; p.m.visible = p.k > .01;
        if (p.e) { p.e.position.y = y; p.e.visible = p.k > .01; }
        if (p.g) p.g.visible = p.k < .98;
      });
      const signed = target === 5, check = target === 4;
      M.clash.opacity = check ? .32 + .22 * Math.sin(t * 6) : Math.max(0, M.clash.opacity - dt * 2);
      ring.material.opacity = check ? .7 : Math.max(0, ring.material.opacity - dt * 2);
      ring.scale.setScalar(1 + (check ? .25 * (.5 + .5 * Math.sin(t * 3)) : 0)); ring.lookAt(camera.position);
      M.edge.color.lerp(signed ? cob : ink, Math.min(1, dt * 4)); M.edge.opacity += ((signed ? .95 : .55) - M.edge.opacity) * Math.min(1, dt * 4);
      M.ghost.opacity = target === 0 ? .26 + .12 * Math.sin(t * 2.4) : .14;
      grid.material.opacity = .16 + (target === 0 ? .14 * (.5 + .5 * Math.sin(t * 3)) : 0);
      if (!dragging && !reduce) rotY += .0016;
      root.rotation.y = rotY + mx * .35; root.rotation.x = rotX + my * .08;
      renderer.render(scene, camera);
    };
    requestAnimationFrame(frame); stage.classList.add('has-3d');
    return { setStep(n) { target = n; } };
  }
  model = makeModel();
  setStep(reduce ? 5 : 0);
  // phone (no pin): the steps play while the model is on screen
  if (!reduce) {
    let timer = null;
    const auto = () => { if (isDesk()) return; setStep((step + 1) % 6); };
    new IntersectionObserver(es => { if (isDesk()) return; clearInterval(timer); if (es[0].isIntersecting) timer = setInterval(auto, 2400); }, { threshold: .35 }).observe($('.model__stage'));
  }

  /* ---------- peel the pump station ---------- */
  const peelBtns = $$('.peel__btns button'), peelImgs = $$('.contact__model .peel__view img');
  let peelN = 0, peelUser = false;
  const peel = n => { peelN = n; peelBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === n))); peelImgs.forEach((im, i) => im.classList.toggle('is-on', i === n)); };
  peelBtns.forEach((b, i) => b.addEventListener('click', () => { peelUser = true; peel(i); }));
  if (!reduce) setInterval(() => { if (!peelUser && document.visibilityState === 'visible') { const r = $('.contact__model').getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) peel((peelN + 1) % 3); } }, 2800);

  /* ---------- hover tilt on the models ---------- */
  if (matchMedia('(pointer: fine)').matches && !reduce) $$('.tilt').forEach(el => {
    el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateY(-4px)`; });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* ---------- anchor links ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); const t = id === '#top' ? document.body : $(id); if (!t) return;
    e.preventDefault(); if ($('#ov').hidden === false) closeOv();
    let y = id === '#work' && window.__reelStart ? window.__reelStart() : (id === '#top' ? 0 : null);
    if (window.__lenis) window.__lenis.scrollTo(y ?? t, { duration: 1.4 });
    else window.scrollTo({ top: y ?? (t.getBoundingClientRect().top + scrollY), behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- live thing: section keys re-sort the register ---------- */
  $('.keys__row').addEventListener('click', e => {
    const b = e.target.closest('.key'); if (!b) return;
    const k = +b.dataset.k;
    $$('.key').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    const end = $('.card--end');
    const state = hasGsap && window.Flip && !reduce ? Flip.getState(cards) : null;
    const sorted = [...cards].sort((a, c) => {
      const fa = k < 0 || +a.dataset.sec === k ? 0 : 1, fc = k < 0 || +c.dataset.sec === k ? 0 : 1;
      return fa - fc || a.dataset.i - c.dataset.i;
    });
    sorted.forEach(c => { track.insertBefore(c, end); c.classList.toggle('dim', k >= 0 && +c.dataset.sec !== k); });
    sorted.forEach((c, i) => $('.card__strip b', c).textContent = 'P' + pad(P[+c.dataset.i].no));
    if (state) Flip.from(state, { duration: .9, ease: 'power3.inOut', stagger: .015, absolute: false });
    // bring the start of the register into view
    if (window.__reelStart) { const y = window.__reelStart(); if (Math.abs(scrollY - y) > 4) (window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' })); }
    else $('.reel').scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
    // reveal any card not yet revealed
    cards.forEach(c => { $$('[data-num]', c).forEach(el => { if (!el.dataset.done) io.observe(c); }); });
  });

  /* ---------- project sheet overlay ---------- */
  const ov = $('#ov'), paper = $('.ov__paper'), body = $('.ov__body');
  let cur = -1, opener = null;
  const fill = i => {
    const p = P[i]; cur = i;
    $('.ov__kick').textContent = `Sheet P${pad(p.no)} · ${SHORT[p.sec]}`;
    const coverPhoto = kindOf(p) === 'photo';
    body.innerHTML = `
      <header class="ov__head">
        <div><p class="k">${esc(p.kick)}</p><h2 id="ov-title">${esc(p.title)} <i>${esc(p.it)}</i></h2><p class="lead" style="margin-top:18px">${esc(p.brief)}</p></div>
        <figure class="ov__cover ${coverPhoto ? 'is-photo' : ''}"><img src="${src(p.cover)}" alt="${esc(p.title + ' ' + p.it)}"></figure>
      </header>
      <aside class="ov__side">
        <div><p class="k">Project data</p><dl class="facts">${(p.facts || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${a === 'Papers' ? '<a href="https://ijcrt.org/papers/IJCRT2007352.pdf" target="_blank" rel="noopener">IJCRT 2020</a> · <a href="https://ijmir.org/2022-v2n3/" target="_blank" rel="noopener">IJMIR 2022</a>' : esc(b)}</dd></div>`).join('')}</dl></div>
        ${(p.nums || []).length ? `<div><p class="k">In numbers</p><dl class="nums">${p.nums.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></div>` : ''}
      </aside>
      <ol class="moves">${(p.moves || []).map((m, j) => `
        <li class="mv"><div class="mv__img ${m[3] === 'photo' ? 'is-photo' : ''}"><img src="${src(m[2])}" alt="${esc(m[4])}" loading="lazy"></div>
        <h3><span>${pad(j + 1)}</span>${esc(m[0])}</h3><p>${esc(m[1])}</p><figcaption><span>Fig. ${pad(p.no)}.${j + 1}</span>${esc(m[4])}</figcaption></li>`).join('')}</ol>`;
    $('.ov__scroll').scrollTop = 0;
  };
  window.__openOv = (slug, el) => { const i = P.findIndex(p => p.slug === slug); if (i >= 0) openOv(i, el); };
  const openOv = (i, fromEl) => {
    opener = fromEl; fill(i); ov.hidden = false;
    document.documentElement.style.overflow = 'hidden'; if (window.__lenis) window.__lenis.stop();
    $('.xhair') && document.body.classList.remove('xh');
    if (motion && fromEl) {
      const r = (fromEl.closest('.card') || fromEl.closest('.spread') || fromEl).getBoundingClientRect(), pr = paper.getBoundingClientRect();
      gsap.fromTo(paper, { clipPath: `inset(${r.top - pr.top}px ${pr.right - r.right}px ${pr.bottom - r.bottom}px ${r.left - pr.left}px)` }, { clipPath: 'inset(0px 0px 0px 0px)', duration: .85, ease: 'expo.inOut' });
      gsap.from(ov, { backgroundColor: 'rgba(22,24,29,0)', duration: .6 });
      gsap.from($$('.ov__head > *, .ov__side, .mv', body), { y: 30, opacity: 0, duration: .9, stagger: .07, ease: 'expo.out', delay: .45 });
    }
    $('.ov__close').focus();
  };
  function closeOv() {
    const done = () => { ov.hidden = true; document.documentElement.style.overflow = ''; if (window.__lenis) window.__lenis.start(); if (opener) opener.focus({ preventScroll: true }); };
    if (motion) gsap.to(paper, { clipPath: 'inset(0px 0px 100% 0px)', duration: .6, ease: 'expo.inOut', onComplete: () => { gsap.set(paper, { clipPath: 'none' }); done(); } });
    else done();
  }
  /* featured spreads open their project sheet */
  $$('.spread__open').forEach(b => b.addEventListener('click', () => { const i = P.findIndex(p => p.slug === b.dataset.slug); if (i > -1) openOv(i, b); }));
  /* peel the pump station: buttons everywhere, scroll-driven on laptops */
  const peelEl = $('.peel');
  if (peelEl) {
    const imgs = $$('.peel__view img', peelEl), keys = $$('.peel__keys button', peelEl);
    const setLayer = n => { imgs.forEach((im, k) => im.classList.toggle('is-on', k === n)); keys.forEach((kb, k) => kb.setAttribute('aria-pressed', k === n ? 'true' : 'false')); };
    keys.forEach(kb => kb.addEventListener('click', () => setLayer(+kb.dataset.layer)));
    if (window.ScrollTrigger && matchMedia('(min-width: 821px)').matches)
      ScrollTrigger.create({ trigger: peelEl, start: 'top 70%', end: 'bottom 30%', onUpdate: self => setLayer(Math.min(2, Math.floor(self.progress * 3))) });
  }
  track.addEventListener('click', e => { const b = e.target.closest('.card__open'); if (b) openOv(+b.closest('.card').dataset.i, b); });
  $('.ov__close').addEventListener('click', closeOv);
  ov.addEventListener('click', e => { if (e.target === ov) closeOv(); });
  $$('.ov__nav').forEach(b => b.addEventListener('click', () => {
    const n = (cur + +b.dataset.dir + P.length) % P.length;
    if (motion) gsap.to(body, { opacity: 0, y: 12, duration: .25, onComplete: () => { fill(n); gsap.to(body, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' }); } });
    else fill(n);
  }));
  document.addEventListener('keydown', e => {
    if (ov.hidden) return;
    if (e.key === 'Escape') closeOv();
    if (e.key === 'ArrowRight') $('.ov__nav[data-dir="1"]').click();
    if (e.key === 'ArrowLeft') $('.ov__nav[data-dir="-1"]').click();
    if (e.key === 'Tab') { const f = $$('button, a[href]', ov); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });

  /* ---------- drafting crosshair ---------- */
  if (matchMedia('(pointer: fine)').matches && !reduce) {
    const h = $('.xhair__h'), v = $('.xhair__v'), t = $('.xhair__t');
    addEventListener('mousemove', e => {
      document.body.classList.toggle('xh', ov.hidden);
      h.style.transform = `translateY(${e.clientY}px)`; v.style.transform = `translateX(${e.clientX}px)`;
      t.style.transform = `translate(${e.clientX + 12}px, ${e.clientY + 10}px)`;
      t.textContent = `X ${String(Math.round(e.clientX * 10)).padStart(5, '0')} · Y ${String(Math.round((e.clientY + scrollY) * 10)).padStart(5, '0')}`;
    }, { passive: true });
    document.addEventListener('mouseleave', () => document.body.classList.remove('xh'));
  }

  /* rebuild construction lines on resize */
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { buildLines(); $$('path', heroSvg).forEach(p => p.style.strokeDashoffset = 0); }, 200); });
})();

/* ===== 2026-11-22 upgrade: footer links, certificate viewer, key plan, download form ===== */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const stopScroll = on => { if (window.__lenis) on ? window.__lenis.stop() : window.__lenis.start(); document.documentElement.style.overflow = on ? 'hidden' : ''; };

  /* ---------- footer quick links (popover below 1100 px) ---------- */
  const tb = $('.tb'), more = $('.tb__more');
  if (more) {
    more.addEventListener('click', () => { const o = tb.classList.toggle('is-open'); more.setAttribute('aria-expanded', o); });
    $('#tb-links').addEventListener('click', e => { if (e.target.closest('a')) { tb.classList.remove('is-open'); more.setAttribute('aria-expanded', false); } });
    document.addEventListener('click', e => { if (!e.target.closest('.tb')) { tb.classList.remove('is-open'); more.setAttribute('aria-expanded', false); } });
  }

  /* ---------- certificate viewer ---------- */
  const lb = $('.lb');
  if (lb) {
    let opener = null;
    const open = (img, cap, el) => {
      opener = el; $('img', lb).src = img.currentSrc || img.src; $('img', lb).alt = img.alt;
      $('figcaption', lb).innerHTML = cap; stopScroll(true);
      if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
    };
    const close = () => { if (lb.close) lb.close(); else lb.removeAttribute('open'); };
    lb.addEventListener('close', () => { stopScroll(false); if (opener) opener.focus({ preventScroll: true }); });
    $('.lb__x', lb).addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    const items = [...$$('.creds__paper').map(p => [p, p.querySelector('img'), p.closest('figure').querySelector('figcaption').innerHTML]),
                   ...$$('.living img').map(i => [i, i, i.closest('li').querySelector('p').innerHTML])];
    items.forEach(([el, img, cap]) => {
      el.setAttribute('role', 'button'); el.tabIndex = 0; el.setAttribute('aria-label', 'Enlarge: ' + img.alt); el.classList.add('zoomable');
      el.addEventListener('click', () => open(img, cap, el));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img, cap, el); } });
    });
  }

  /* ---------- key plan: a globe in drawing style (Journey / Projects / Education); flat SVG map if no WebGL ---------- */
  const map = $('#map');
  if (map) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const P = window.PROJECTS || [];
    const title = slug => { const p = P.find(q => q.slug === slug); return p ? `${p.title} ${p.it}`.trim() : slug; };
    const LAYERS = {
      journey: [
        { n: 'Kerala', s: 'India · where it starts', lat: 9.93, lon: 76.27, e: ['Home, and the family design-and-build practice (Novacasa)', 'Site project manager, Built Well: eight retail fit-outs · 2017 – 19'], p: ['nova-casa', 'future-group-retail'] },
        { n: 'New Delhi', s: 'India · 2012 – 2024', lat: 28.6, lon: 77.2, e: ['SPA New Delhi: B.Arch 2017, M.BEM 2021', 'Techture: BIM Coordinator · 2021 – 24', 'CBRE: Project Manager · 2024'], p: ['delhi-metro', 'jubail-digital-twin', 'misk-city', 'stryker-lab'] },
        { n: 'Barcelona', s: 'Spain · now', lat: 41.39, lon: 2.17, e: ["Master's in Global BIM Management · 9.16 / 10", 'Scruffy Dog: Qiddiya · 2025', 'Current role: precast, BIM automation and AI'], p: ['elastic-potential', 'qiddiya', 'wezig'] },
      ],
      proj: [
        { n: 'Barcelona', s: 'Spain', lat: 41.39, lon: 2.17, p: ['elastic-potential', 'automation-ai', 'wezig', 'strategy-audit'], note: 'Current role: precast, Barcelona' },
        { n: 'Riyadh and Qiddiya', s: 'Saudi Arabia', lat: 24.7, lon: 46.7, p: ['qiddiya', 'misk-city', 'bim-scoping'] },
        { n: 'Jubail', s: 'Saudi Arabia', lat: 27.0, lon: 49.66, p: ['jubail-digital-twin'] },
        { n: 'Abu Dhabi and Hatta', s: 'UAE', lat: 24.6, lon: 55.4, p: ['e12-bridges', 'hatta-water-tank'] },
        { n: 'Delhi and Gurugram', s: 'India', lat: 28.6, lon: 77.2, p: ['delhi-metro', 'stryker-lab', 'bim-standards', 'google-hq', 'international-models'] },
        { n: 'Vijayawada', s: 'India', lat: 16.51, lon: 80.65, p: ['vijayawada-airport'] },
        { n: 'Kerala and South India', s: 'India', lat: 9.93, lon: 76.27, p: ['nova-casa', 'kaizen-gym-facade', 'city-centre', 'homes', 'future-group-retail'] },
        { n: 'Singapore', s: 'Singapore', lat: 1.35, lon: 103.82, p: [], note: 'Earlier project work, not in this register.' },
        { n: 'Texas', s: 'USA', lat: 32.35, lon: -97.39, p: ['international-models'] },
        { n: 'Maryland', s: 'USA', lat: 38.98, lon: -76.49, p: ['international-models'] },
        { n: 'Canada', s: 'Canada', lat: 50, lon: -97, p: ['international-models'] },
      ],
      edu: [
        { n: 'Barcelona', s: 'Spain', lat: 41.39, lon: 2.17, e: ["Master's in Global BIM Management · Universitat de Barcelona (IL3) · Zigurat Institute of Technology · 2025 – 26 · 9.16 / 10", 'AI Applied to Construction Engineering · UPC · 2025 · 9.8 / 10', 'Spanish B1 course, Cervantes-accredited · 2025'] },
        { n: 'Geneva', s: 'Switzerland', lat: 46.2, lon: 6.14, e: ['Postgraduate Diploma (Level 7), Strategic Management and Leadership · SSBM · 2024 – 25'] },
        { n: 'New Delhi', s: 'India', lat: 28.6, lon: 77.2, e: ['Bachelor of Architecture · SPA New Delhi · 2017 · First Class', 'Master of Building Engineering and Management · SPA New Delhi · 2021 · Distinction', 'Project Management: Theory and Practice · IIT Delhi · 2023 – 24'] },
      ],
    };
    const ROUTES = { journey: [[0, 1, '2012'], [1, 2, '2024 – 25']], proj: [], edu: [] };
    const SPOKES = { journey: [[1, 24.7, 46.7], [1, 27.0, 49.66], [1, 24.6, 55.4], [1, 32.35, -97.39], [1, 38.98, -76.49], [1, 50, -97], [1, 16.51, 80.65], [2, 24.7, 46.7]] };
    const stage = $('.map__stage', map), card = $('.map__card', map);
    let layer = 'journey', active = -1, focusTo = null;
    const show = k => {
      active = k; const pl = LAYERS[layer][k];
      $$('.map__pinb', map).forEach((el, i) => el.classList.toggle('on', i === k));
      $$('.map__pin', map).forEach((el, i) => el.classList.toggle('on', i === k));
      if (!pl) { card.hidden = true; return; }
      card.hidden = false;
      const links = (pl.p || []).length ? `<ul>${pl.p.map(s => `<li><button type="button" data-slug="${s}">${esc(title(s))} <span>→</span></button></li>`).join('')}</ul>` : '';
      card.innerHTML = `<button type="button" class="map__x" aria-label="Close">✕</button><p class="k">${esc(pl.s)}</p><h3>${esc(pl.n)}</h3>` +
        (pl.note ? `<p class="map__hint">${esc(pl.note)}</p>` : '') + (pl.e ? `<ul class="map__edu">${pl.e.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '') + (layer !== 'edu' ? links : '');
      if (focusTo) focusTo(pl);
    };
    map.addEventListener('click', e => {
      const t = e.target.closest('[data-layer]');
      if (t) { layer = t.dataset.layer; $$('[data-layer]', map).forEach(b => b.setAttribute('aria-pressed', b === t)); draw(); return; }
      if (e.target.closest('.map__x')) { show(-1); return; }
      const k = e.target.closest('[data-k]'); if (k) { show(+k.dataset.k); return; }
      const s = e.target.closest('[data-slug]'); if (s && window.__openOv) window.__openOv(s.dataset.slug, s);
    });
    const label = (pl) => `${pl.n}, ${pl.s}` + (pl.p && pl.p.length ? `, ${pl.p.length} project${pl.p.length > 1 ? 's' : ''}` : '');
    let draw = () => {};
    const gl = (() => { try { const c = document.createElement('canvas'); return !!(window.THREE && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (_) { return false; } })();

    if (gl) {
      /* ----- globe ----- */
      const T = THREE, D = Math.PI / 180;
      const v3 = (lat, lon, r = 1) => { const ph = (90 - lat) * D, th = (lon + 180) * D; return new T.Vector3(-Math.sin(ph) * Math.cos(th) * r, Math.cos(ph) * r, Math.sin(ph) * Math.sin(th) * r); };
      stage.classList.add('is-globe');
      const wrap = document.createElement('div'); wrap.className = 'globe';
      const cv = document.createElement('canvas'); cv.setAttribute('aria-label', 'Globe: where he studied, worked and moved. Drag to turn it.'); cv.setAttribute('role', 'img');
      const pinLayer = document.createElement('div'); pinLayer.className = 'globe__pins';
      const legend = document.createElement('p'); legend.className = 'globe__leg';
      const LEGEND = { journey: 'Kerala → New Delhi, 2012 → Barcelona, 2024 – 25 · thin lines: project work from each base', proj: 'Twenty projects, seven countries · tap a pin to open its sheets', edu: 'Where each degree and course was taken' };
      wrap.append(cv, pinLayer, legend); stage.prepend(wrap);
      const R = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
      R.setPixelRatio(Math.min(2, devicePixelRatio || 1));
      const scene = new T.Scene(), cam = new T.PerspectiveCamera(28, 1, .1, 50); cam.position.set(0, 0, 4.4);
      const globe = new T.Group(); scene.add(globe);
      globe.add(new T.Mesh(new T.SphereGeometry(.995, 64, 48), new T.MeshBasicMaterial({ color: 0xFAF8F2 })));
      const lineMat = (c, o) => new T.LineBasicMaterial({ color: c, transparent: true, opacity: o });
      const grat = new T.Group(); globe.add(grat);
      for (let lat = -75; lat <= 75; lat += 15) { const pts = []; for (let lon = -180; lon <= 180; lon += 4) pts.push(v3(lat, lon, 1.001)); grat.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), lineMat(0x1D3BC9, lat === 0 ? .22 : .1))); }
      for (let lon = -180; lon < 180; lon += 15) { const pts = []; for (let lat = -90; lat <= 90; lat += 4) pts.push(v3(lat, lon, 1.001)); grat.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), lineMat(0x1D3BC9, .1))); }
      // rim (silhouette line, drawing style)
      const rim = new T.Mesh(new T.RingGeometry(1.0, 1.012, 128), new T.MeshBasicMaterial({ color: 0x16181D })); scene.add(rim);
      const dyn = new T.Group(); globe.add(dyn);
      let arcs = [];
      const arc = (a, b, lift, opts) => {
        const d = a.distanceTo(b), mid = a.clone().add(b).normalize().multiplyScalar(1 + lift * d);
        const curve = new T.QuadraticBezierCurve3(a, mid, b);
        const geo = opts.tube ? new T.TubeGeometry(curve, 64, .006, 6, false) : new T.BufferGeometry().setFromPoints(curve.getPoints(64));
        const mat = opts.tube ? new T.MeshBasicMaterial({ color: 0x1D3BC9 }) : lineMat(0x1D3BC9, .45);
        const m = opts.tube ? new T.Mesh(geo, mat) : new T.Line(geo, mat); dyn.add(m);
        const total = opts.tube ? geo.index.count : 65; geo.setDrawRange(0, reduce ? total : 0);
        arcs.push({ geo, total, t0: opts.delay || 0, dur: opts.dur || 1.2, mid: curve.getPoint(.5), text: opts.text });
      };
      let start = performance.now();
      const pinEls = [];
      draw = () => {
        while (dyn.children.length) { const c = dyn.children.pop(); c.geometry.dispose(); }
        arcs = []; pinLayer.innerHTML = ''; pinEls.length = 0;
        const L = LAYERS[layer];
        L.forEach((pl, i) => {
          const pos = v3(pl.lat, pl.lon, 1.003);
          const dot = new T.Mesh(new T.CircleGeometry(.014, 20), new T.MeshBasicMaterial({ color: 0x1D3BC9 }));
          dot.position.copy(pos); dot.lookAt(pos.clone().multiplyScalar(2)); dyn.add(dot);
          const b = document.createElement('button'); b.type = 'button'; b.className = 'map__pinb'; b.dataset.k = i;
          b.setAttribute('aria-label', label(pl)); b.innerHTML = `<i></i><span>${esc(pl.n)}</span>`; if (layer === 'journey') b.classList.add('lab');
          pinLayer.append(b); pinEls.push({ el: b, pos });
        });
        (ROUTES[layer] || []).forEach(([a, b, yr], j) => arc(v3(L[a].lat, L[a].lon, 1.003), v3(L[b].lat, L[b].lon, 1.003), .45, { tube: true, delay: .3 + j * 1.3, dur: 1.2, text: yr }));
        (SPOKES[layer] || []).forEach(([a, lat, lon], j) => arc(v3(L[a].lat, L[a].lon, 1.003), v3(lat, lon, 1.003), .25, { delay: 2.8 + j * .12, dur: .9 }));
        if (layer === 'proj') L.forEach((pl, i) => { if (i && pl.p.length) arc(v3(41.39, 2.17, 1.003), v3(pl.lat, pl.lon, 1.003), .2, { delay: .2 + i * .1, dur: .8 }); });
        legend.textContent = LEGEND[layer];
        start = performance.now(); show(-1);
        if (layer === 'journey') { rotY = targetY = Math.atan2(-v3(28.6, 50).x, v3(28.6, 50).z); }
      };
      // land outline (Natural Earth 110 m, public domain), loaded with the globe
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then(r => r.json()).then(t => {
        const [sx, sy] = t.transform.scale, [tx, ty] = t.transform.translate;
        const arcsT = t.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => (x += dx, y += dy, [x * sx + tx, y * sy + ty])); });
        const ring = ids => { const pts = []; ids.forEach(i => { const a = i < 0 ? arcsT[~i].slice().reverse() : arcsT[i]; pts.push(...(pts.length ? a.slice(1) : a)); }); return pts; };
        const o = t.objects.land, geoms = o.type === 'GeometryCollection' ? o.geometries : [o];
        const pos = [];
        geoms.forEach(g => (g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : []).forEach(poly => poly.forEach(r => {
          const pts = ring(r); for (let i = 1; i < pts.length; i++) { const a = v3(pts[i - 1][1], pts[i - 1][0], 1.002), b = v3(pts[i][1], pts[i][0], 1.002); pos.push(a.x, a.y, a.z, b.x, b.y, b.z); }
        })));
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
        globe.add(new T.LineSegments(g, lineMat(0x16181D, .7)));
      }).catch(() => {});
      // turning: drag (horizontal on touch, so the page still scrolls), slow idle spin, glide to a picked place
      let rotY = 0, rotX = .32, targetY = 0, targetX = .32, drag = false, lx = 0, ly = 0, idle = 0;
      focusTo = pl => { const p = v3(pl.lat, pl.lon); let ty = Math.atan2(-p.x, p.z); while (ty - rotY > Math.PI) ty -= 2 * Math.PI; while (rotY - ty > Math.PI) ty += 2 * Math.PI; targetY = ty; targetX = Math.max(-.6, Math.min(.6, Math.atan2(p.y, Math.hypot(p.x, p.z)))); idle = -6; };
      cv.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; idle = -4; cv.setPointerCapture(e.pointerId); });
      cv.addEventListener('pointermove', e => { if (!drag) return; targetY += (e.clientX - lx) * .008; if (e.pointerType === 'mouse') targetX = Math.max(-.6, Math.min(.6, targetX + (e.clientY - ly) * .005)); lx = e.clientX; ly = e.clientY; });
      cv.addEventListener('pointerup', () => { drag = false; }); cv.addEventListener('pointercancel', () => { drag = false; });
      const size = () => { const w = wrap.clientWidth, h = wrap.clientHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.position.z = w / h < 1 ? 4.6 / Math.max(.62, w / h) * .8 : 4.9; cam.updateProjectionMatrix(); };
      addEventListener('resize', size); size();
      let run = false, last = performance.now();
      const tmp = new T.Vector3(), camDir = new T.Vector3();
      const frame = now => {
        if (!run) return; requestAnimationFrame(frame);
        const dt = Math.min(.05, (now - last) / 1000); last = now; idle += dt;
        if (!drag && idle > 0 && !reduce) targetY += dt * .06;
        rotY += (targetY - rotY) * Math.min(1, dt * 4); rotX += (targetX - rotX) * Math.min(1, dt * 4);
        globe.rotation.set(rotX, rotY, 0);
        const el = (now - start) / 1000;
        arcs.forEach(a => { const k = reduce ? 1 : Math.max(0, Math.min(1, (el - a.t0) / a.dur)); a.geo.setDrawRange(0, Math.floor(a.total * (1 - Math.pow(1 - k, 3)))); });
        globe.updateMatrixWorld(); camDir.copy(cam.position).normalize();
        const w = wrap.clientWidth, h = wrap.clientHeight;
        pinEls.forEach(({ el: b, pos }) => {
          tmp.copy(pos).applyMatrix4(globe.matrixWorld); const facing = tmp.clone().normalize().dot(camDir);
          tmp.project(cam); b.style.transform = `translate(${(tmp.x * .5 + .5) * w}px, ${(-tmp.y * .5 + .5) * h}px)`;
          b.classList.toggle('back', facing < .15); b.tabIndex = facing < .15 ? -1 : 0;
        });
        R.render(scene, cam);
      };
      new IntersectionObserver(es => { const on = es.some(e => e.isIntersecting); if (on && !run) { run = true; last = performance.now(); size(); requestAnimationFrame(frame); } else if (!on) run = false; }, { rootMargin: '100px 0px' }).observe(map);
      draw();
    } else {
      /* ----- fallback: flat key plan ----- */
      const LON0 = -128, LON1 = 108, LAT1 = 66, LAT0 = -2, W = 1000, H = 290;
      const X = lon => (lon - LON0) / (LON1 - LON0) * W, Y = lat => (LAT1 - lat) / (LAT1 - LAT0) * H;
      const svg = $('.map__svg', map); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      let g = ''; for (let lon = -120; lon <= 105; lon += 15) g += `<line x1="${X(lon)}" y1="0" x2="${X(lon)}" y2="${H}"/>`; for (let lat = 0; lat <= 60; lat += 15) g += `<line x1="0" y1="${Y(lat)}" x2="${W}" y2="${Y(lat)}"/>`;
      $('.map__grid', map).innerHTML = g;
      draw = () => { $('.map__pins', map).innerHTML = LAYERS[layer].map((pl, i) => `<g class="map__pin" data-k="${i}" transform="translate(${X(pl.lon).toFixed(1)} ${Y(pl.lat).toFixed(1)})" tabindex="0" role="button" aria-label="${esc(label(pl))}"><circle r="16" class="hit"/><circle r="9" class="ring"/><circle r="4" class="dot"/></g>`).join(''); show(-1); };
      $('.map__pins', map).addEventListener('keydown', e => { const k = e.target.closest('[data-k]'); if (k && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); show(+k.dataset.k); } });
      draw();
    }
  }
})();

/* ===== 2026-11-22 round 2: View-CV dialog (view only), LinkedIn posts strip, footer project links ===== */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lock = on => { if (window.__lenis) on ? window.__lenis.stop() : window.__lenis.start(); document.documentElement.style.overflow = on ? 'hidden' : ''; };

  /* posts: swap a url here when PC-LEGION sends the exact post links */
  const FEED = 'https://www.linkedin.com/in/thoufeer/recent-activity/all/';
  const POSTS = [
    { d: 'Oct 2026', t: "Master's in Global BIM Management: 1,500 hours, 9.16 / 10", url: FEED },
    { d: 'Nov 2026', t: 'Smart City Expo World Congress 2026: who builds the city AI runs?', url: FEED },
    { d: 'Oct 2026', t: 'An AI-generated BIM edit can look correct, and still break the model.', url: FEED },
    { d: 'Oct 2026', t: 'AI says the clash is fixed. Has anyone checked the model?', url: FEED },
    { d: 'Oct 2026', t: 'One wall. Two asset codes. Which one should you trust?', url: FEED },
  ];
  const row = $('.posts__row');
  if (row) row.innerHTML = POSTS.map(p => `<li><a class="pc" href="${esc(p.url)}" target="_blank" rel="noopener"><span class="pc__d">Post · ${esc(p.d)}</span><span class="pc__t">${esc(p.t)}</span><span class="pc__o">Open on LinkedIn →</span></a></li>`).join('');

  /* footer: project buttons open their sheet */
  $$('[data-open]').forEach(b => b.addEventListener('click', () => window.__openOv && window.__openOv(b.dataset.open, b)));

  /* View CV: details -> view-only page in a frame (backend: PC-LEGION's worker; no file is ever downloaded) */
  const dlg = $('.cvd');
  if (!dlg) return;
  const form = $('.cvd__form', dlg), msg = $('.cvd__msg', dlg), view = $('.cvd__view', dlg), frame = $('iframe', dlg);
  let opener = null;
  const open = el => {
    opener = el; $('.tb')?.classList.remove('is-open'); lock(true);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    (view.hidden ? form.name : $('.cvd__x', dlg)).focus();
  };
  const close = () => { if (dlg.close) dlg.close(); else { dlg.removeAttribute('open'); dlg.dispatchEvent(new Event('close')); } };
  dlg.addEventListener('close', () => { lock(false); if (opener) opener.focus({ preventScroll: true }); });
  $('.cvd__x', dlg).addEventListener('click', close);
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  document.addEventListener('click', e => { const b = e.target.closest('.cv-open'); if (b) { e.preventDefault(); open(b); } });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(form), v = k => String(f.get(k) || '').trim();
    const name = v('name'), email = v('email'), company = v('company');
    const err = t => { msg.textContent = t; msg.className = 'cvd__msg is-err'; };
    if (!name || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err('Please fill in your name, a valid email and your company.');
    msg.textContent = 'Opening the CV…'; msg.className = 'cvd__msg'; form.classList.add('is-busy');
    try {
      const r = await fetch('https://portfolio-leads.thoufeer-noushad.workers.dev/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, file: 'cv', consent: true, website: v('website'), source: new URLSearchParams(location.search).get('src') || 'site' })
      });
      const d = await r.json().catch(() => ({}));
      if (d.ok && d.url) {
        msg.textContent = '';
        try { frame.src = d.url; form.hidden = true; view.hidden = false; dlg.classList.add('is-view'); }
        catch (_) { window.open(d.url, '_blank', 'noopener'); }
      } else err(d.error || 'That did not work. Please try again, or email thoufeer.work@gmail.com.');
    } catch (_) { err('No connection right now. Please try again, or email thoufeer.work@gmail.com.'); }
    form.classList.remove('is-busy');
  });
})();

/* ===== 2026-11-23 hero: a building that assembles itself, discipline by discipline (WIP > Shared > Published) ===== */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fig = $('.hero__cut'); if (!fig || !window.THREE) return;
  try { const c = document.createElement('canvas'); if (!(c.getContext('webgl') || c.getContext('experimental-webgl'))) return; } catch (_) { return; }
  const T = THREE, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, phone = innerWidth <= 820;
  const box = document.createElement('div'); box.className = 'h3d';
  box.innerHTML = `<canvas aria-label="Animated model: structure, architecture and MEP assembling" role="img"></canvas>
    <p class="h3d__chip" aria-live="off"><span>ISO 19650</span><b>WIP</b></p>
    <div class="h3d__tags" aria-hidden="true"></div>
    <div class="h3d__tg" role="group" aria-label="Show disciplines"><button type="button" aria-pressed="true" data-l="s">Structure</button><button type="button" aria-pressed="true" data-l="a">Architecture</button><button type="button" aria-pressed="true" data-l="m">MEP</button></div>`;
  fig.classList.add('is-3d'); fig.removeAttribute('aria-hidden'); fig.prepend(box);
  const cap = $('figcaption', fig); if (cap) cap.textContent = phone ? 'Model · structure, architecture, MEP' : 'Model · structure, architecture, MEP · drag to turn';
  const cv = $('canvas', box), chip = $('.h3d__chip b', box), tagLayer = $('.h3d__tags', box);
  const R = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); R.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  const scene = new T.Scene();
  const cam = new T.OrthographicCamera(-1, 1, 1, -1, -50, 50);
  scene.add(new T.AmbientLight(0xffffff, .78)); const sun = new T.DirectionalLight(0xffffff, .5); sun.position.set(4, 8, 5); scene.add(sun);
  const root = new T.Group(); scene.add(root);
  const L = { s: new T.Group(), a: new T.Group(), m: new T.Group() }; Object.values(L).forEach(g => root.add(g));
  const INK = 0x16181D, items = [];
  const mat = (c, o) => new T.MeshLambertMaterial({ color: c, transparent: o < 1, opacity: o });
  const M = { conc: mat(0xB9B2A6, .95), slab: mat(0xCFC8BC, .92), pad: mat(0xA59E92, 1), glass: mat(0xFAF8F2, .26), roof: mat(0xE8E3D7, .9), pipe: new T.MeshBasicMaterial({ color: 0x1D3BC9 }), duct: mat(0x9C4A32, .9) };
  const edge = (mesh, o = .75) => { const e = new T.LineSegments(new T.EdgesGeometry(mesh.geometry), new T.LineBasicMaterial({ color: INK, transparent: true, opacity: o })); mesh.add(e); return mesh; };
  // item: mesh, layer, start time, kind of entrance
  const add = (geo, m, x, y, z, layer, t, kind, o) => {
    const mesh = edge(new T.Mesh(geo, m), o); mesh.position.set(x, y, z); L[layer].add(mesh);
    items.push({ mesh, t, kind, y, x, z }); return mesh;
  };
  const BX = 3, BZ = 2, bay = 1.6, H = 1.05, ST = phone ? 2 : 3, W = BX * bay, Dp = BZ * bay;
  let t = .9;
  // structure: pads, columns, slabs, core
  for (let i = 0; i <= BX; i++) for (let j = 0; j <= BZ; j++) add(new T.BoxGeometry(.42, .14, .42), M.pad, i * bay, .07, j * bay, 's', t + (i + j) * .025, 'drop');
  t += .35;
  for (let s = 0; s < ST; s++) {
    for (let i = 0; i <= BX; i++) for (let j = 0; j <= BZ; j++) add(new T.BoxGeometry(.14, H, .14), M.conc, i * bay, s * H + H / 2 + .14, j * bay, 's', t + (i * 3 + j) * .015, 'rise');
    t += .22;
    add(new T.BoxGeometry(W + .3, .1, Dp + .3), M.slab, W / 2, (s + 1) * H + .14, Dp / 2, 's', t, 'drop'); t += .2;
  }
  add(new T.BoxGeometry(.9, ST * H + .5, .9), M.conc, .55, (ST * H + .5) / 2 + .14, Dp - .55, 's', 1.4, 'rise', .9);
  // architecture: facade panels on the two visible faces, roof upstand
  t = 2.6;
  for (let s = 0; s < ST; s++) {
    for (let i = 0; i < BX; i++) add(new T.BoxGeometry(bay - .12, H - .22, .05), M.glass, i * bay + bay / 2, s * H + H / 2 + .2, Dp + .12, 'a', t + (s * BX + i) * .05, 'slideZ', .5);
    for (let j = 0; j < BZ; j++) add(new T.BoxGeometry(.05, H - .22, bay - .12), M.glass, W + .12, s * H + H / 2 + .2, j * bay + bay / 2, 'a', t + .1 + (s * BZ + j) * .05, 'slideX', .5);
  }
  [[W + .3, .05, W / 2, -.12], [W + .3, .05, W / 2, Dp + .12]].forEach(([l, d, x, z], k) => add(new T.BoxGeometry(l, .3, d), M.roof, x, ST * H + .34, z, 'a', t + .9 + k * .05, 'drop', .6));
  [[-.12], [W + .12]].forEach(([x], k) => add(new T.BoxGeometry(.05, .3, Dp + .3), M.roof, x, ST * H + .34, Dp / 2, 'a', t + 1 + k * .05, 'drop', .6));
  // site outline + setting-out grid, drawn first
  const site = []; [[-.9, -.9], [W + .9, -.9], [W + .9, Dp + .9], [-.9, Dp + .9], [-.9, -.9]].forEach(([x, z]) => site.push(new T.Vector3(x, 0, z)));
  const sg = new T.BufferGeometry().setFromPoints(site); const sl = new T.Line(sg, new T.LineBasicMaterial({ color: 0x1D3BC9 })); L.s.add(sl); sg.setDrawRange(0, 0); items.push({ mesh: sl, t: .1, kind: 'line', total: 5 });
  for (let i = 0; i <= BX; i++) { const g = new T.BufferGeometry().setFromPoints([new T.Vector3(i * bay, 0, -1.3), new T.Vector3(i * bay, 0, Dp + 1.3)]); const l = new T.Line(g, new T.LineDashedMaterial({ color: 0x1D3BC9, dashSize: .12, gapSize: .1, transparent: true, opacity: .45 })); l.computeLineDistances(); L.s.add(l); items.push({ mesh: l, t: .3 + i * .08, kind: 'fade' }); }
  for (let j = 0; j <= BZ; j++) { const g = new T.BufferGeometry().setFromPoints([new T.Vector3(-1.3, 0, j * bay), new T.Vector3(W + 1.3, 0, j * bay)]); const l = new T.Line(g, new T.LineDashedMaterial({ color: 0x1D3BC9, dashSize: .12, gapSize: .1, transparent: true, opacity: .45 })); l.computeLineDistances(); L.s.add(l); items.push({ mesh: l, t: .4 + j * .08, kind: 'fade' }); }
  // MEP: pipes and a duct, drawn along their routes
  const tube = (pts, r, m, t0) => {
    const curve = new T.CatmullRomCurve3(pts.map(p => new T.Vector3(...p)), false, 'catmullrom', .02);
    const geo = new T.TubeGeometry(curve, 80, r, 8, false); const mesh = new T.Mesh(geo, m); L.m.add(mesh);
    geo.setDrawRange(0, 0); items.push({ mesh, t: t0, kind: 'draw', total: geo.index.count }); return mesh;
  };
  const yC = s => (s + 1) * H - .12;
  const zf = Dp - .22, xf = W - .22;
  tube([[xf, .25, zf], [xf, yC(ST - 1), zf], [.4, yC(ST - 1), zf]], .09, M.pipe, 4.0);
  tube([[.4, yC(0), zf], [xf, yC(0), zf], [xf, yC(0), .35]], .08, M.pipe, 4.25);
  if (ST > 2) tube([[.4, yC(1), zf - .05], [xf - .2, yC(1), zf - .05]], .05, M.pipe, 4.5);
  add(new T.BoxGeometry(.3, .18, Dp - .8), M.duct, xf - .05, yC(ST - 1) - .3, Dp / 2 - .1, 'm', 4.6, 'growZ', .7);
  // data tags
  const TAGS = [
    { at: new T.Vector3(W, ST * H * .55, Dp), text: 'IfcColumn · S2 · Shared', t: 5.0 },
    { at: new T.Vector3(W * .55, yC(ST - 1), Dp - .22), text: 'Pipe DN150 · A1 · Published', t: 5.4 },
  ];
  TAGS.forEach(g => { g.el = document.createElement('p'); g.el.className = 'h3d__tag'; g.el.innerHTML = `<i></i><span>${g.text}</span>`; tagLayer.append(g.el); });
  root.position.set(-W / 2, -(ST * H) / 2 - .2, -Dp / 2);
  // camera: axonometric, drawing style
  const VIEW = phone ? 3.7 : 3.55;
  const size = () => { const w = box.clientWidth, h = box.clientHeight; R.setSize(w, h, false); const a = w / h; cam.left = -VIEW * a; cam.right = VIEW * a; cam.top = VIEW; cam.bottom = -VIEW; cam.updateProjectionMatrix(); };
  const pivot = new T.Group(); scene.add(pivot); pivot.add(root);
  cam.position.set(8, 6.4, 8); cam.lookAt(0, 0, 0);
  // layer toggles
  $('.h3d__tg', box).addEventListener('click', e => { const b = e.target.closest('[data-l]'); if (!b) return; const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); L[b.dataset.l].visible = on; });
  // tilt + limited orbit (no drag on phones, it fights scrolling)
  let yaw = 0, pitch = 0, ty = 0, tp = 0, drag = false, lx = 0, ly = 0;
  if (!phone) {
    addEventListener('pointermove', e => { if (drag) return; const r = box.getBoundingClientRect(); ty = ((e.clientX - r.left) / r.width - .5) * .35; tp = ((e.clientY - r.top) / r.height - .5) * .12; }, { passive: true });
    cv.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (!drag) return; ty = Math.max(-.44, Math.min(.44, ty + (e.clientX - lx) * .006)); tp = Math.max(-.2, Math.min(.2, tp + (e.clientY - ly) * .003)); lx = e.clientX; ly = e.clientY; });
    addEventListener('pointerup', () => { drag = false; });
  }
  const ease = k => 1 - Math.pow(1 - k, 3), back = k => { const c = 1.6; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
  const hero = $('#hero'); let t0 = performance.now(), run = false, explode = 0;
  const STATUS = [[0, 'WIP'], [3.0, 'Shared'], [5.4, 'Published']];
  const tmp = new T.Vector3();
  const frame = now => {
    if (!run) return; requestAnimationFrame(frame);
    const el = reduce ? 99 : (now - t0) / 1000;
    items.forEach(it => {
      const k = Math.max(0, Math.min(1, (el - it.t) / .55)); const m = it.mesh;
      if (it.kind === 'line') { m.geometry.setDrawRange(0, Math.ceil(it.total * Math.max(0, Math.min(1, (el - it.t) / .8)))); return; }
      if (it.kind === 'fade') { m.visible = el > it.t; return; }
      if (it.kind === 'draw') { m.geometry.setDrawRange(0, Math.floor(it.total * ease(Math.max(0, Math.min(1, (el - it.t) / 1.1))))); return; }
      m.visible = k > 0;
      if (it.kind === 'rise') { m.scale.y = Math.max(.001, ease(k)); m.position.y = (it.y - (m.geometry.parameters.height / 2)) + m.geometry.parameters.height / 2 * m.scale.y; }
      else if (it.kind === 'drop') m.position.y = it.y + (1 - back(k)) * 1.2;
      else if (it.kind === 'slideZ') m.position.z = it.z + (1 - ease(k)) * .9;
      else if (it.kind === 'slideX') m.position.x = it.x + (1 - ease(k)) * .9;
      else if (it.kind === 'growX') m.scale.x = Math.max(.001, ease(k));
      else if (it.kind === 'growZ') m.scale.z = Math.max(.001, ease(k));
    });
    chip.textContent = STATUS.filter(s => el >= s[0]).pop()[1];
    chip.parentElement.dataset.s = chip.textContent;
    // scroll: exploded axonometric, then fade
    const r = hero.getBoundingClientRect(); explode = Math.max(0, Math.min(1, -r.top / (r.height * .8)));
    L.a.position.y = explode * 1.4; L.m.position.y = explode * 2.8;
    const sway = reduce ? 0 : Math.sin(now / 4000) * .1;
    yaw += (ty + sway - yaw) * .08; pitch += (tp - pitch) * .08; pivot.rotation.set(pitch, yaw, 0);
    box.style.opacity = 1 - explode * .55;
    // tags follow their points
    const w = box.clientWidth, h = box.clientHeight;
    TAGS.forEach(g => {
      tmp.copy(g.at); root.localToWorld(tmp); if (g.at === TAGS[1].at) tmp.y += L.m.position.y; tmp.project(cam);
      g.el.style.transform = `translate(${(tmp.x * .5 + .5) * w}px, ${(-tmp.y * .5 + .5) * h}px)`;
      g.el.classList.toggle('left', tmp.x > .1);
      g.el.classList.toggle('on', el > g.t && L[g === TAGS[0] ? 's' : 'm'].visible && explode < .3);
    });
    R.render(scene, cam);
  };
  addEventListener('resize', size); size();
  new IntersectionObserver(es => { const on = es.some(e => e.isIntersecting); if (on && !run) { run = true; requestAnimationFrame(frame); } else if (!on) run = false; }).observe(hero);
})();
