/* Drukspil: appens kerne. Navigation, spillere, indstillinger, lyd og vibration.
   Hvert spil registrerer sig selv via App.register() og sine knapper via App.on(). */
'use strict';
const App = (() => {
  const STORE_KEY = 'drukspil.v1';
  const DEFAULTS = { players: [], settings: { sound: true, vibrate: true, adult: false }, game: {} };

  let store = load();
  let screen = 'home';
  let root = null;
  const GAMES = [];
  const ACTIONS = {};

  /* ---------- lager ---------- */
  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function load(){
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return clone(DEFAULTS);
      const s = JSON.parse(raw);
      return {
        players: Array.isArray(s.players) ? s.players.filter(p => typeof p === 'string') : [],
        settings: Object.assign({}, DEFAULTS.settings, s.settings || {}),
        game: (s.game && typeof s.game === 'object') ? s.game : {}
      };
    } catch (e) { return clone(DEFAULTS); }
  }
  function save(){ try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {} }
  function gameSettings(id, defaults){
    const merged = Object.assign({}, clone(defaults), store.game[id] || {});
    store.game[id] = merged;
    return merged;
  }

  /* ---------- små hjælpere ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  function shuffle(arr){
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }
  /* Ejefald: "Mads' tur", "Annas tur" */
  const gen = name => /[sxz]$/i.test(name) ? name + "'" : name + 's';

  /* ---------- lyd (Web Audio, ingen filer) ---------- */
  let ctx = null;
  function ac(){
    if (!store.settings.sound) return null;
    try {
      /* iPhone på lydløs: "playback" gør, at bomben stadig kan høres (Safari 17+) */
      if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback';
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) { return null; }
  }
  function tone(freq, dur, type, vol, delay){
    const c = ac(); if (!c) return;
    const t = c.currentTime + (delay || 0);
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type || 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.03);
  }
  const audio = {
    tick(){ tone(1000, 0.05, 'square', 0.1); },
    ding(){ tone(660, 0.35, 'sine', 0.3); tone(880, 0.55, 'sine', 0.3, 0.13); },
    click(){ tone(520, 0.03, 'triangle', 0.08); },
    buzz(){ tone(160, 0.28, 'sawtooth', 0.2); tone(110, 0.4, 'sawtooth', 0.2, 0.14); },
    boom(){
      const c = ac(); if (!c) return;
      const t = c.currentTime;
      const len = Math.floor(c.sampleRate * 1.5);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
      const src = c.createBufferSource(); src.buffer = buf;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(3500, t); lp.frequency.exponentialRampToValueAtTime(150, t + 1.3);
      const g = c.createGain(); g.gain.value = 0.9;
      src.connect(lp).connect(g).connect(c.destination); src.start(t);
      const o = c.createOscillator(); const og = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(28, t + 1.1);
      og.gain.setValueAtTime(0.9, t); og.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      o.connect(og).connect(c.destination); o.start(t); o.stop(t + 1.3);
    }
  };
  function vibrate(pattern){
    if (!store.settings.vibrate || !navigator.vibrate) return;
    try { navigator.vibrate(pattern); } catch (e) {}
  }

  /* Kort besked øverst på skærmen, fx "Tryk igen for at afbryde runden" */
  let toastId = null;
  function toast(msg){
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(toastId); toastId = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ---------- hold skærmen tændt under spil ---------- */
  let wl = null;
  async function keepAwake(){
    try {
      if ('wakeLock' in navigator && !wl) {
        wl = await navigator.wakeLock.request('screen');
        wl.addEventListener('release', () => { wl = null; });
      }
    } catch (e) {}
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && screen !== 'home') keepAwake();
  });

  /* ---------- registrering og navigation ---------- */
  function register(g){ GAMES.push(g); }
  function on(name, fn){ ACTIONS[name] = fn; }
  function game(id){ return GAMES.find(g => g.id === id); }
  function go(next){
    const cur = game(screen); if (cur && cur.onLeave) cur.onLeave();
    screen = next;
    const g = game(screen); if (g && g.onEnter) g.onEnter();
    render();
    window.scrollTo(0, 0);
  }

  /* ---------- ikoner (SVG med mørk kant, så de matcher knapperne) ---------- */
  const svg = inner => `<svg viewBox="0 0 64 64" aria-hidden="true">${inner}</svg>`;
  /* Hvid streg med mørk kant: tegnes to gange */
  const stroke = (d, w) => `<path d="${d}" fill="none" stroke="#0d1b3e" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const icons = {
    back: svg(stroke('M38 12L18 32l20 20', 8)),
    plus: svg(stroke('M32 13v38M13 32h38', 9)),
    x: svg(stroke('M17 17l30 30M47 17L17 47', 8)),
    player: svg('<circle cx="32" cy="21" r="12" fill="#ffd9a8" stroke="#0d1b3e" stroke-width="3"/><path d="M9 58c2-15 11-22 23-22s21 7 23 22z" fill="#62c6ff" stroke="#0d1b3e" stroke-width="3" stroke-linejoin="round"/>')
  };
  const LOGO = `<svg class="logo-svg" viewBox="0 0 280 62" aria-hidden="true">
    <defs><linearGradient id="logo-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset=".45" stop-color="#ffd23f"/><stop offset=".55" stop-color="#ffb400"/><stop offset="1" stop-color="#ff9500"/></linearGradient></defs>
    <g font-family="Lilita One, Arial Rounded MT Bold, Arial Black, sans-serif" font-size="46" text-anchor="middle" transform="rotate(-3 140 34)">
      <text x="140" y="52" textLength="250" lengthAdjust="spacingAndGlyphs" fill="#0d1b3e" stroke="#0d1b3e" stroke-width="9" stroke-linejoin="round" paint-order="stroke">DRUKSPIL</text>
      <text x="140" y="48" textLength="250" lengthAdjust="spacingAndGlyphs" fill="url(#logo-gold)" stroke="#0d1b3e" stroke-width="7" stroke-linejoin="round" paint-order="stroke">DRUKSPIL</text>
    </g>
  </svg>`;
  const AVATAR_COLORS = ['#ff5a4d', '#ffb628', '#43c76a', '#3aa0ff', '#b14cff', '#ff4d7d', '#2ad3a3', '#ff6a2a'];
  /* Farvet cirkel med forbogstav. Farven følger spillerens plads i listen. */
  function avatar(name, xl){
    const i = Math.max(0, store.players.indexOf(name));
    return `<span class="avatar ${xl ? 'xl' : ''}" style="--c:${AVATAR_COLORS[i % AVATAR_COLORS.length]}">${esc(Array.from(name)[0].toUpperCase())}</span>`;
  }

  /* ---------- bordplan ----------
     Spillerlisten er pladserne rundt om bordet, og telefonen går i den rækkefølge. holderName er den, der har
     telefonen lige nu (huskes på tværs af runder og spil, ikke gemt): næste runde starter hos dem. */
  let holderName = null;
  function holder(){ const p = store.players; return p.includes(holderName) ? holderName : p[0]; }
  function setHolder(name){ holderName = name; }
  /* Pladserne i rækkefølge, startende hos den, der har telefonen (eller hos start) */
  function fromHolder(start){
    const p = store.players.slice();
    const i = Math.max(0, p.indexOf(start || holder()));
    return p.slice(i).concat(p.slice(0, i));
  }
  /* Pil i bordets midte: den vej går telefonen */
  const ARROW = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M50 36a19 19 0 1 1-6-18" fill="none" stroke="#0d1b3e" stroke-width="11" stroke-linecap="round"/><path d="M50 36a19 19 0 1 1-6-18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M36 10l12 7-10 9z" fill="#fff" stroke="#0d1b3e" stroke-width="3" stroke-linejoin="round"/></svg>`;
  /* Bordet set oppefra. names er pladserne i rækkefølge, plads 0 nederst, derefter med uret.
     o: { cur, done: [navne], start, pick: action ved tryk på en plads, empty: antal tomme pladser, sm } */
  function table(names, o){
    o = o || {};
    const done = new Set(o.done || []);
    const n = names.length + (o.empty || 0);
    let seats = '';
    for (let i = 0; i < n; i++) {
      const a = Math.PI / 2 + i * 2 * Math.PI / n;
      const pos = `left:${(50 + 41 * Math.cos(a)).toFixed(1)}%;top:${(50 + 39 * Math.sin(a)).toFixed(1)}%`;
      const name = names[i];
      if (name === undefined) { seats += `<div class="seat empty" style="${pos}"><span class="avatar"></span><span>?</span></div>`; continue; }
      const cls = ['seat', name === o.cur ? 'cur' : '', done.has(name) ? 'done' : '', name === o.start ? 'start' : ''].join(' ');
      const tag = o.pick ? 'button' : 'div';
      seats += `<${tag} class="${cls}" style="${pos}" ${o.pick ? `data-action="${o.pick}" data-name="${esc(name)}"` : ''}>${avatar(name)}<span>${esc(name)}</span></${tag}>`;
    }
    return `<div class="seat-table ${o.sm ? 'sm' : ''}"><div class="table-top">${ARROW}</div>${seats}</div>`;
  }

  /* ---------- UI-byggeklodser ---------- */
  function shell(o){
    return `<div class="screen" style="--accent:${o.color || 'var(--brand)'}">
      <header class="topbar">
        <button class="back" data-action="${o.backAction || 'go'}" data-to="${o.back || 'home'}" aria-label="Tilbage">${icons.back}</button>
        <h1>${esc(o.title)}</h1>
        ${o.right || ''}
      </header>
      <main class="${o.center ? 'center' : ''}">${o.body}</main>
      ${o.footer ? `<div class="footer">${o.footer}</div>` : ''}
    </div>`;
  }
  function toggle(label, action, checked, key, sub){
    return `<label class="toggle"><span>${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ''}</span><input type="checkbox" data-change="${action}" data-key="${key || ''}" ${checked ? 'checked' : ''}><i></i></label>`;
  }
  function seg(action, opts, value, key){
    return `<div class="seg">${opts.map(o => `<button class="${String(o.v) === String(value) ? 'on' : ''}" data-action="${action}" data-key="${key || ''}" data-v="${esc(o.v)}">${esc(o.l)}</button>`).join('')}</div>`;
  }
  function stepper(label, action, value, key, sub){
    return `<div class="stepper"><span>${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ''}</span><div class="ctl"><button data-action="${action}" data-key="${key}" data-d="-1" aria-label="Færre">-</button><b>${value}</b><button data-action="${action}" data-key="${key}" data-d="1" aria-label="Flere">+</button></div></div>`;
  }
  function range(label, action, value, key, min, max, unit){
    return `<div class="range"><div class="range-head"><span>${esc(label)}</span><b>${value} ${unit || ''}</b></div><input type="range" min="${min}" max="${max}" value="${value}" data-input="${action}" data-key="${key}" style="--p:${rangePct(value, min, max)}%"></div>`;
  }
  function rangePct(v, min, max){ return Math.round(((v - min) / (max - min)) * 1000) / 10; }
  /* Opdaterer den fyldte del af en skyder efter dens værdi */
  function syncRange(inp){ inp.style.setProperty('--p', rangePct(Number(inp.value), Number(inp.min), Number(inp.max)) + '%'); }

  /* ---------- skærme i kernen ---------- */
  function renderHome(){
    const n = store.players.length;
    return `<div class="screen">
      <header class="topbar"><h1 class="logo" aria-label="Drukspil">${LOGO}</h1><button class="pill ${n ? 'on' : ''}" data-action="go" data-to="players"><span class="ic">${icons.player}</span><span class="txt">${n ? n + ' spillere' : 'Tilføj spillere'}</span><span class="plus">${icons.plus}</span></button></header>
      <main>
        <p class="tagline">Gratis. Ingen abonnement, ingen reklamer. Bare drik.</p>
        <div class="game-grid ${GAMES.length <= 2 ? 'single' : ''}">${GAMES.map((g, i) => `<button class="game-card ${GAMES.length > 2 && i === GAMES.length - 1 && GAMES.length % 2 ? 'wide' : ''}" style="--c:${g.farve}" data-action="go" data-to="${g.id}"><span class="gc-art">${g.ikon || ''}</span><span class="gc-title">${esc(g.navn)}</span><span class="gc-desc">${esc(g.kort)}</span></button>`).join('')}</div>
        <section class="card">
          <div class="label">Indstillinger</div>
          ${toggle('Lyd', 'set', store.settings.sound, 'sound')}
          ${toggle('Vibration', 'set', store.settings.vibrate, 'vibrate')}
          ${toggle('Frækt indhold', 'set', store.settings.adult, 'adult', 'Slår kategorier og kort for voksne til')}
        </section>
        <p class="fine">Tip: Åbn siden i telefonens browser og vælg "Føj til hjemmeskærm", så virker den som en app, også uden net.</p>
        <p class="fine">Kør aldrig bil, når du har drukket. Pas på hinanden.</p>
      </main>
    </div>`;
  }

  function renderPlayers(){
    const list = store.players.map((p, i) => `<div class="player-row">${avatar(p)}<span class="name">${esc(p)}</span><button class="x" data-action="players.remove" data-i="${i}" aria-label="Fjern ${esc(p)}">${icons.x}</button></div>`).join('');
    return shell({ title: 'Spillere', back: playersBack, body: `
      <p class="hint" style="text-align:center;margin-top:0">Skriv navnene i den rækkefølge, I sidder rundt om bordet. Så er bordplanen klar.</p>
      <form class="input-row" data-form="players.add" autocomplete="off">
        <input id="player-input" maxlength="16" placeholder="${store.players.length ? 'Nr. ' + (store.players.length + 1) + ' ved bordet' : 'Den, der har telefonen'}" autocomplete="off" autocapitalize="words" enterkeyhint="done">
        <button class="btn sm" type="submit">Tilføj</button>
      </form>
      <div class="players">${list || '<p class="muted">Ingen spillere endnu. Imposter kræver mindst 3.</p>'}</div>
      ${store.players.length >= 3 ? `<div class="card"><div class="label">Bordplan</div>
        <p>Telefonen går rundt om bordet i den her rækkefølge. Sid I anderledes, så sæt pladserne.</p>
        ${table(store.players, { sm: true })}
        <button class="btn sm ghost" style="align-self:center" data-action="seats.open">Sæt pladser</button></div>` : ''}
      ${store.players.length ? '<button class="link" data-action="players.clear">Fjern alle</button>' : ''}`,
      footer: `<button class="btn" data-action="go" data-to="${playersBack}">Færdig</button>` });
  }

  let seatDraft = [], seatBack = 'players';
  function renderSeats(){
    const rest = store.players.filter(p => !seatDraft.includes(p));
    const done = !rest.length;
    return shell({ title: 'Bordplan', back: seatBack, body: `
      <p class="hint" style="text-align:center">${seatDraft.length
        ? (done ? 'Alle sidder. Tjek, at det passer.' : 'Tryk på den, der sidder ved siden af, og fortsæt rundt.')
        : 'Tryk på navnene i den rækkefølge, I sidder rundt om bordet. Start med den, der har telefonen, og gå samme vej rundt hele tiden.'}</p>
      ${table(seatDraft, { empty: rest.length })}
      <div class="chips" style="justify-content:center">${rest.map(p => `<button class="chip on" data-action="seats.pick" data-name="${esc(p)}">${esc(p)}</button>`).join('')}</div>
      ${seatDraft.length ? '<div class="btn-row"><button class="link" data-action="seats.undo">Fortryd sidste</button><button class="link" data-action="seats.reset">Start forfra</button></div>' : ''}`,
      footer: `<button class="btn" data-action="seats.done" ${done ? '' : 'disabled'}>Gem bordplan</button>` });
  }

  /* Indgangsanimationer kører kun, når et tryk tegner skærmen igen (ikke ved timer-ticks).
     Spil kan tvinge dem med App.render(true). */
  let pendingAnim = false;
  function render(anim){
    let html;
    if (screen === 'home') html = renderHome();
    else if (screen === 'players') html = renderPlayers();
    else if (screen === 'seats') html = renderSeats();
    else { const g = game(screen); html = g ? g.render() : renderHome(); }
    root.innerHTML = html;
    root.classList.toggle('anim', anim === true || pendingAnim);
    /* Lange enkeltord i den store skrift gøres mindre, så de ikke deles midt i ordet på små telefoner */
    root.querySelectorAll('.big').forEach(b => {
      const len = Math.max(...b.textContent.trim().split(/\s+/).map(t => t.length));
      if (len >= 10) { b.classList.add('fitw'); b.style.setProperty('--len', len); }
    });
    /* Skifter skærmens hovedknap (fx "Vis mit ord" til "Skjul og giv videre", der sidder samme sted), så ignoreres tryk
       et øjeblik. Ellers kan et fuldt dobbelttryk vise og skjule et ord, før man når at se det, eller vise næste spillers ord. */
    const k = root.querySelector('.footer .btn, .screen[data-action], .vote-grid');
    const key = screen + ':' + (k ? (k.dataset.action || k.className) : '');
    /* Kun inde i samme spil (eller på eksplosionen, hvor hele skærmen er en knap), ikke ved åbning eller på forsiden */
    if (key !== lastKey) {
      /* Eksplosionen får længere spærring: den, der griber telefonen, skal ikke starte en ny bombe ved et uheld */
      if (k && k.matches('.screen[data-action]')) guardUntil = performance.now() + 1200;
      else if (screen === lastScreen) guardUntil = performance.now() + 500;
      lastKey = key; lastScreen = screen;
    }
  }
  let lastKey = '', lastScreen = '', guardUntil = 0;

  /* ---------- kernens knapper ---------- */
  /* Spillerskærmen husker, hvor man kom fra, så Færdig og Tilbage fører tilbage til spillet */
  let playersBack = 'home';
  on('go', el => { if (el.dataset.to === 'players' && screen !== 'players' && screen !== 'seats') playersBack = screen; go(el.dataset.to); });
  on('set', el => { store.settings[el.dataset.key] = el.checked; if (el.dataset.key === 'sound' && el.checked) ac(); save(); });
  on('players.add', form => {
    const input = form.querySelector('input');
    const name = input.value.trim().replace(/\s+/g, ' ');
    const dup = name && store.players.some(p => p.toLowerCase() === name.toLowerCase());
    if (name && !dup && store.players.length < 30) {
      store.players.push(name); save(); render();
    }
    const again = document.getElementById('player-input');
    if (again) { again.value = ''; again.focus(); }
    if (dup) toast(name + ' er der allerede');
  });
  on('players.remove', el => { store.players.splice(Number(el.dataset.i), 1); save(); render(); });
  /* "Fjern alle" kræver to tryk, så et fejltryk ikke sletter hele bordet */
  let clearArmed = 0;
  on('players.clear', el => {
    if (Date.now() - clearArmed > 3000) { clearArmed = Date.now(); el.textContent = 'Tryk igen for at fjerne alle'; return; }
    clearArmed = 0; store.players = []; save(); render();
  });
  on('seats.open', el => { seatBack = el.dataset.back || screen; seatDraft = []; go('seats'); });
  on('seats.pick', el => { const n = el.dataset.name; if (!seatDraft.includes(n)) seatDraft.push(n); render(); });
  on('seats.reset', () => { seatDraft = []; render(); });
  on('seats.undo', () => { seatDraft.pop(); render(); });
  on('seats.done', () => {
    if (seatDraft.length !== store.players.length) return;
    store.players = seatDraft.slice(); holderName = seatDraft[0]; save(); go(seatBack);
  });

  /* ---------- events (delegering) ---------- */
  function bind(){
    root.addEventListener('click', e => {
      const el = e.target.closest('[data-action]');
      if (!el || el.disabled) return;
      if (performance.now() < guardUntil) { e.preventDefault(); return; }   // dobbelttryk lige efter skærmskift
      ac();
      const fn = ACTIONS[el.dataset.action];
      if (!fn) return;
      e.preventDefault();
      pendingAnim = true;
      try { fn(el, e); } finally { pendingAnim = false; }
    });
    root.addEventListener('change', e => {
      const el = e.target.closest('[data-change]'); if (!el) return;
      const fn = ACTIONS[el.dataset.change]; if (fn) fn(el, e);
    });
    root.addEventListener('input', e => {
      if (e.target.type === 'range') syncRange(e.target);
      const el = e.target.closest('[data-input]'); if (!el) return;
      const fn = ACTIONS[el.dataset.input]; if (fn) fn(el, e);
    });
    root.addEventListener('submit', e => {
      const f = e.target.closest('[data-form]'); if (!f) return;
      e.preventDefault();
      const fn = ACTIONS[f.dataset.form]; if (fn) fn(f, e);
    });
  }

  function init(){
    root = document.getElementById('app');
    bind();
    render();
    if ('serviceWorker' in navigator) {
      try { navigator.serviceWorker.register('sw.js').catch(() => {}); } catch (e) {}
    }
  }

  return {
    init, register, on, go, render, save,
    esc, rand, pick, shuffle, gen, gameSettings,
    players: () => store.players,
    holder, setHolder, fromHolder,
    settings: () => store.settings,
    audio, vibrate, keepAwake, icons,
    toast,
    ui: { shell, toggle, seg, stepper, range, syncRange, avatar, table }
  };
})();
