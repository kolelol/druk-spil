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

  /* ---------- UI-byggeklodser ---------- */
  const BACK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
  function shell(o){
    return `<div class="screen" style="--accent:${o.color || 'var(--brand)'}">
      <header class="topbar">
        <button class="back" data-action="${o.backAction || 'go'}" data-to="${o.back || 'home'}" aria-label="Tilbage">${BACK_ICON}</button>
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
    return `<div class="range"><div class="range-head"><span>${esc(label)}</span><b>${value} ${unit || ''}</b></div><input type="range" min="${min}" max="${max}" value="${value}" data-input="${action}" data-key="${key}"></div>`;
  }

  /* ---------- skærme i kernen ---------- */
  function renderHome(){
    const n = store.players.length;
    return `<div class="screen">
      <header class="topbar"><h1 class="logo">Drukspil</h1><button class="pill ${n ? 'on' : ''}" data-action="go" data-to="players">${n ? n + ' spillere' : 'Tilføj spillere'}</button></header>
      <main>
        <p class="tagline">Gratis. Ingen abonnement, ingen reklamer. Bare drik.</p>
        <div class="game-grid">${GAMES.map((g, i) => `<button class="game-card ${i === GAMES.length - 1 && GAMES.length % 2 ? 'wide' : ''}" style="--c:${g.farve}" data-action="go" data-to="${g.id}"><span class="gc-title">${esc(g.navn)}</span><span class="gc-desc">${esc(g.kort)}</span></button>`).join('')}</div>
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
    const list = store.players.map((p, i) => `<div class="player-row"><span>${esc(p)}</span><button class="x" data-action="players.remove" data-i="${i}" aria-label="Fjern ${esc(p)}">&times;</button></div>`).join('');
    return shell({ title: 'Spillere', body: `
      <form class="input-row" data-form="players.add" autocomplete="off">
        <input id="player-input" maxlength="16" placeholder="Skriv et navn" autocomplete="off" autocapitalize="words" enterkeyhint="done">
        <button class="btn sm" type="submit">Tilføj</button>
      </form>
      <div class="players">${list || '<p class="muted">Ingen spillere endnu. Imposter kræver mindst 3.</p>'}</div>
      ${store.players.length ? '<button class="link" data-action="players.clear">Fjern alle</button>' : ''}`,
      footer: `<button class="btn" data-action="go" data-to="home">Færdig</button>` });
  }

  function render(){
    let html;
    if (screen === 'home') html = renderHome();
    else if (screen === 'players') html = renderPlayers();
    else { const g = game(screen); html = g ? g.render() : renderHome(); }
    root.innerHTML = html;
  }

  /* ---------- kernens knapper ---------- */
  on('go', el => go(el.dataset.to));
  on('set', el => { store.settings[el.dataset.key] = el.checked; if (el.dataset.key === 'sound' && el.checked) ac(); save(); });
  on('players.add', form => {
    const input = form.querySelector('input');
    const name = input.value.trim().replace(/\s+/g, ' ');
    if (name && !store.players.some(p => p.toLowerCase() === name.toLowerCase()) && store.players.length < 30) {
      store.players.push(name); save(); render();
    }
    const again = document.getElementById('player-input');
    if (again) { again.value = ''; again.focus(); }
  });
  on('players.remove', el => { store.players.splice(Number(el.dataset.i), 1); save(); render(); });
  on('players.clear', () => { store.players = []; save(); render(); });

  /* ---------- events (delegering) ---------- */
  function bind(){
    root.addEventListener('click', e => {
      const el = e.target.closest('[data-action]');
      if (!el || el.disabled) return;
      ac();
      const fn = ACTIONS[el.dataset.action];
      if (fn) { e.preventDefault(); fn(el, e); }
    });
    root.addEventListener('change', e => {
      const el = e.target.closest('[data-change]'); if (!el) return;
      const fn = ACTIONS[el.dataset.change]; if (fn) fn(el, e);
    });
    root.addEventListener('input', e => {
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
    settings: () => store.settings,
    audio, vibrate, keepAwake,
    ui: { shell, toggle, seg, stepper, range }
  };
})();
