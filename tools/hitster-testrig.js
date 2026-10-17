/* Testrig til Hitster: falsk lyd (Web Audio med gestuslås som på iPhone), falsk Deezer (links udløber efter 15 minutter),
   falsk Spotify. Indsættes én gang pr. sideindlæsning. Alt ligger på window.__T / window.__L. */
(() => {
  const T = window.__T = { log: [], jump: 0, gesture: false, blockResume: true, failJsonp: 0, failFetch: 0, http403: 0, failDecode: 0, noPrev: new Set(), noPrevAll: false,
    fetches: 0, jsonps: 0, decodes: 0, expired: 0, ctxs: [], srcs: [], timers: [], errs: [], spot: [], spotFail: 0, nextId: 1000 };
  const realNow = Date.now.bind(Date);
  Date.now = () => realNow() + T.jump;
  /* langsomme intervaller (Spotify vedligeholdelse) fanges, så de kan udløses med et tidsspring */
  const rsi = window.setInterval.bind(window), rci = window.clearInterval.bind(window);
  window.setInterval = (fn, ms, ...a) => { if (ms >= 60000) { const id = 'fi' + (++T.nextId); T.timers.push({ id, fn, ms }); return id; } return rsi(fn, ms, ...a); };
  window.clearInterval = id => { const i = T.timers.findIndex(t => t.id === id); if (i >= 0) { T.timers.splice(i, 1); return; } rci(id); };
  window.addEventListener('error', e => T.errs.push('error: ' + e.message));
  window.addEventListener('unhandledrejection', e => T.errs.push('rejection: ' + ((e.reason && e.reason.message) || e.reason)));
  const ce = console.error.bind(console); console.error = (...a) => { if (!/vibrate/.test(String(a[0]))) T.errs.push('console: ' + a.join(' ')); ce(...a); };

  class Param {
    constructor(){ this.ev = []; }
    setValueAtTime(v, t){ this.ev.push({ k: 'set', t: +t.toFixed(3), v }); return this; }
    linearRampToValueAtTime(v, t){ this.ev.push({ k: 'ramp', t: +t.toFixed(3), v }); return this; }
    cancelScheduledValues(t){ this.ev = this.ev.filter(e => e.t < t); return this; }
    /* hvilken lydstyrke gælder til tiden t (sidste hændelse før t, ramper regnes som nået) */
    at(t){ let v = 1; for (const e of this.ev) if (e.t <= t + 1e-6) v = e.v; return v; }
  }
  class Src {
    constructor(c){ this.c = c; this.buffer = null; this.onended = null; this.stopped = false; this.started = false; }
    connect(){} disconnect(){}
    start(when, off){ this.started = true; this.off = off || 0; this.t0 = this.c.currentTime; T.log.push('start@' + this.off.toFixed(2)); this.endTimer = setTimeout(() => { if (!this.stopped && this.c.state === 'running') { this.stopped = true; T.log.push('end'); this.onended && this.onended(); } }, Math.max(0, (this.buffer.duration - this.off) * 1000)); }
    stop(){ if (this.stopped) return; this.stopped = true; clearTimeout(this.endTimer); T.log.push('stop'); }
  }
  class Ctx {
    constructor(){ this.state = 'suspended'; this._t = 0; this._since = null; this.destination = {}; this.sampleRate = 44100; T.ctxs.push(this); }
    get currentTime(){ return this._t + (this._since !== null ? (performance.now() - this._since) / 1000 : 0); }
    resume(){
      if (this.state === 'running') return Promise.resolve();
      if (T.blockResume && !T.gesture) { T.log.push('resume AFVIST (ingen tryk)'); return Promise.resolve(); }
      this.state = 'running'; this._since = performance.now(); T.log.push('resume ok'); return Promise.resolve();
    }
    suspend(){ this._t = this.currentTime; this._since = null; this.state = 'suspended'; T.log.push('suspend'); return Promise.resolve(); }
    createGain(){ const g = { gain: new Param(), connect(){} }; T.gain = g; return g; }
    createBufferSource(){ const s = new Src(this); T.srcs.push(s); return s; }
    decodeAudioData(arr, ok, bad){
      return new Promise((res, rej) => { T.decodes++; if (T.failDecode > 0) { T.failDecode--; rej(new Error('decode')); } else res({ duration: 30, numberOfChannels: 2, length: 1323000 }); })
        .then(b => { ok && ok(b); return b; }, e => { bad && bad(e); throw e; });
    }
    /* iOS afbryder lyden (opkald, Siri): ingen tryk, intet vågner */
    interrupt(){ this._t = this.currentTime; this._since = null; this.state = 'interrupted'; }
  }
  window.AudioContext = Ctx; window.webkitAudioContext = Ctx;

  const nowSec = () => Math.floor(Date.now() / 1000);
  const songBy = (a, t) => [...HITSTER_SONGS, ...HITSTER_SONGS_DK].find(s => s[1] + ' ' + s[0] === a + ' ' + t);
  const mk = (s, id) => ({ id, title: s[0], artist: { name: s[1] }, preview: 'https://cdnt-preview.dzcdn.net/api/1/1/x/' + id + '.mp3?hdnea=exp=' + (nowSec() + 900) + '~acl=/*~hmac=ab', album: { cover_medium: 'https://img/' + id + '.jpg' } });
  const byId = {};
  const oa = document.head.appendChild.bind(document.head);
  document.head.appendChild = el => {
    if (!(el.tagName === 'SCRIPT' && /api\.deezer\.com/.test(el.src))) return oa(el);
    T.jsonps++;
    const u = new URL(el.src), cb = u.searchParams.get('callback');
    setTimeout(() => {
      if (T.failJsonp > 0) { T.failJsonp--; el.onerror && el.onerror(); return; }
      let data;
      if (u.pathname === '/search') {
        const q = u.searchParams.get('q');
        const s = [...HITSTER_SONGS, ...HITSTER_SONGS_DK].find(x => x[1] + ' ' + x[0] === q);
        if (!s || T.noPrevAll || T.noPrev.has(s[0])) data = { data: [] };
        else { const id = ++T.nextId; byId[id] = s; data = { data: [mk(s, id)] }; }
      } else {
        const id = Number(u.pathname.split('/').pop()), s = byId[id];
        data = s ? mk(s, id) : { error: { code: 800, message: 'no data' } };
      }
      window[cb] && window[cb](data);
    }, 5);
  };
  const of = window.fetch.bind(window);
  window.fetch = (url, o) => {
    if (!/dzcdn\.net/.test(String(url))) return of(url, o);
    T.fetches++;
    if (T.failFetch > 0) { T.failFetch--; return Promise.reject(new TypeError('Failed to fetch')); }
    if (T.http403 > 0) { T.http403--; return Promise.resolve(new Response('', { status: 403 })); }
    const exp = Number((String(url).match(/exp=(\d+)/) || [])[1] || 0);
    if (exp < nowSec()) { T.expired++; return Promise.resolve(new Response('', { status: 403 })); }
    return new Promise(r => setTimeout(() => r(new Response(new ArrayBuffer(4000))), 20));
  };

  /* falsk Spotify */
  window.__fakeSpotify = () => {
    localStorage.setItem('drukspil.spotify.token', JSON.stringify({ access: 'f', refresh: 'f', exp: Date.now() + 36e5 }));
    localStorage.setItem('drukspil.spotify.silence', JSON.stringify({ uri: 'spotify:track:STILLE', name: 'stille' }));
    Spotify.devices = async () => { T.spot.push('devices'); return [{ id: T.devId || 'd1', name: 'Test-telefon', type: 'Smartphone', is_active: true }]; };
    Spotify.play = async (uri, dev, pos, tail) => {
      T.spot.push('play:' + uri.split(':').pop() + '@' + (pos || 0) + (tail && tail.length ? '+' + tail.length + 'x' + tail[0].split(':').pop() : '') + ' on ' + dev);
      if (T.spotFail > 0) { T.spotFail--; const e = new Error('Device not found'); e.status = 404; throw e; }
    };
    Spotify.pause = async () => { T.spot.push('PAUSE'); };
    Spotify.findTrack = async c => ({ uri: 'spotify:track:' + c.t.replace(/\W+/g, ''), img: '', name: c.t });
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const q = s => document.querySelector(s);
  const txt = () => q('.screen').innerText.replace(/\s+/g, ' ');
  const tap = async (sel, w) => {
    const el = typeof sel === 'string' ? q(sel) : sel;
    if (!el) throw new Error('MANGLER ' + sel + ' på: ' + txt().slice(0, 110));
    T.gesture = true; el.click(); T.gesture = false; await sleep(w || 650);
  };
  const run = () => JSON.parse(localStorage.getItem('drukspil.hitster.run') || 'null');
  const waitFor = async (f, ms) => { const t = Date.now(); const rt = performance.now(); while (!f() && performance.now() - rt < (ms || 5000)) await sleep(50); return !!f(); };
  const setGame = o => { const st = JSON.parse(localStorage.getItem('drukspil.v1')); st.game = st.game || {}; st.game.hitster = Object.assign({}, st.game.hitster, o); localStorage.setItem('drukspil.v1', JSON.stringify(st)); };
  const starts = () => T.log.filter(x => x.startsWith('start@')).length;
  const lastSrc = () => T.srcs[T.srcs.length - 1];
  const live = () => T.srcs.filter(s => s.started && !s.stopped).length;
  window.__L = { sleep, q, txt, tap, run, waitFor, setGame, starts, lastSrc, live };
  return 'testrig klar';
})();
