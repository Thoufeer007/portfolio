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
  $('.edu').innerHTML = EDU.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('');

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
        <div><p class="k">Project data</p><dl class="facts">${(p.facts || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></div>
        ${(p.nums || []).length ? `<div><p class="k">In numbers</p><dl class="nums">${p.nums.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></div>` : ''}
      </aside>
      <ol class="moves">${(p.moves || []).map((m, j) => `
        <li class="mv"><div class="mv__img ${m[3] === 'photo' ? 'is-photo' : ''}"><img src="${src(m[2])}" alt="${esc(m[4])}" loading="lazy"></div>
        <h3><span>${pad(j + 1)}</span>${esc(m[0])}</h3><p>${esc(m[1])}</p><figcaption><span>Fig. ${pad(p.no)}.${j + 1}</span>${esc(m[4])}</figcaption></li>`).join('')}</ol>`;
    $('.ov__scroll').scrollTop = 0;
  };
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
