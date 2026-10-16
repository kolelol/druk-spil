/* Hitster: hør numre over Spotify og gæt dem. Fire spiltyper:
   Klassisk: sæt nummeret på rette plads i din tidslinje. Først til målet vinder.
   Kasser:   gæt titel, kunstner og årstal. Dommeren sætter kryds, hvert kryds er et point.
   Klip:     hver spiller får sin egen sang. Hør et halvt sekund, og søg efter titlen. Skip eller forkert gæt giver mere
             af sangen, men den er mindre værd (som Songspot og Songless, som ejeren pegede på 2026-10-16).
   Streams:  højere eller lavere. Har den nye sang flere eller færre streams end den forrige?
   Musikken afspilles af Spotify på en enhed, appen styrer (se spotify.js). */
(() => {
  const ID = 'hitster';
  const C = '#16c46b';
  const DEF = { mode: 'klassisk', goal: 8, from: 0, musik: 'alle', sips: 2, bonus: true, timer: 0, rounds: 3, ktimer: 0, songs: 10, lag: 0, hrounds: 5, diff: 'mellem', htimer: 0, device: null };
  const RUN_KEY = 'drukspil.hitster.run';
  const BONUS = 2;      // slurke at dele ud for at kunne kunstner og titel (klassisk)
  const END_SIPS = 3;   // slurke: de andre drikker ved sejr i klassisk, taberen i kasser, klip og streams
  const CLIPS = [0.5, 1, 2, 5, 10, 20];          // klip: sekunder man hører på hvert trin
  const WORTH = [1000, 800, 600, 400, 250, 100];  // klip: point for at gætte på hvert trin
  const { esc, ui } = App;
  let S = null;         // gemte indstillinger
  let H = null;         // igangværende spil
  let SAVED = null;     // et afbrudt spil, der kan fortsættes
  let played = false;   // har vi startet musik, som skal stoppes igen
  let tick = null;      // nedtælling
  let clipTimer = null; // stopper et klip
  let shown = -1;       // sidst viste sekund på nedtællingen
  const UI = { busy: '', msg: '', auth: false, loading: false, devices: null, testing: '' };

  const MODES = [{ v: 'klassisk', l: 'Klassisk' }, { v: 'kasser', l: 'Kasser' }, { v: 'klip', l: 'Klip' }, { v: 'streams', l: 'Streams' }];
  const MODE_TEXT = {
    klassisk: 'Sæt nummeret på rette plads i din tidslinje. Rigtigt: du beholder kortet. Forkert: du drikker, og kortet er væk. Først til målet vinder.',
    kasser: 'Gæt titel, kunstner og årstal. Den, der holder telefonen, ser svaret og sætter kryds. Hvert kryds er et point.',
    klip: 'Hver spiller får sin egen sang. Start med et halvt sekund, og gæt ved at søge efter titlen. Skip eller et forkert gæt giver mere af sangen, men den er mindre værd: 1.000, 800, 600, 400, 250 og 100 point.',
    streams: 'Højere eller lavere: har den nye sang flere eller færre streams på Spotify end den forrige? Rigtigt giver et point, forkert koster slurke. Virker også uden Spotify, bare uden musik.'
  };

  /* Vinylplade med node */
  const IKON = `<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="28" cy="36" r="24" fill="#2f3656" stroke="#0d1b3e" stroke-width="3"/>
    <circle cx="28" cy="36" r="17" fill="none" stroke="#4a5280" stroke-width="2"/>
    <circle cx="28" cy="36" r="11.5" fill="none" stroke="#4a5280" stroke-width="1.5"/>
    <path d="M10 28a19 19 0 0 1 12-10" fill="none" stroke="#8b93bd" stroke-width="3" stroke-linecap="round"/>
    <circle cx="28" cy="36" r="8" fill="#ffd23f" stroke="#0d1b3e" stroke-width="3"/>
    <circle cx="28" cy="36" r="2.4" fill="#0d1b3e"/>
    <path d="M53 46V13c0 9 9 6 9 17" fill="none" stroke="#0d1b3e" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M53 46V13c0 9 9 6 9 17" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="46" cy="47" rx="8" ry="6" transform="rotate(-20 46 47)" fill="#fff" stroke="#0d1b3e" stroke-width="3"/>
  </svg>`;
  /* Hak til kasserne */
  const CHECK = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 34l12 12 24-28" fill="none" stroke="#0d1b3e" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 34l12 12 24-28" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  /* Pile til højere og lavere */
  const arrow = d => `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="${d}" fill="none" stroke="#0d1b3e" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const UP = arrow('M32 52V14M15 30l17-17 17 17');
  const DOWN = arrow('M32 12v38M15 34l17 17 17-17');
  const eq = cls => `<div class="eq ${cls || ''}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>`;
  /* Klip: afspil, stop og ringen, der løber rundt, mens klippet spiller */
  const PLAY = '<svg class="ic play" viewBox="0 0 64 64" aria-hidden="true"><path d="M22 14l30 18-30 18z" fill="#fff" stroke="#0d1b3e" stroke-width="5" stroke-linejoin="round"/></svg>';
  const STOP = '<svg class="ic stop" viewBox="0 0 64 64" aria-hidden="true"><rect x="17" y="17" width="30" height="30" rx="5" fill="#fff" stroke="#0d1b3e" stroke-width="5"/></svg>';
  const RING = '<svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" pathLength="100"/></svg>';
  const LUPE = '<svg class="lupe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';

  App.register({
    id: ID, navn: 'Hitster', farve: C, ikon: IKON,
    kort: 'Fire musikspil over Spotify: tidslinje, kasser, klip og højere eller lavere på streams. Kræver Spotify Premium på den ene telefon.',
    onEnter(){
      S = App.gameSettings(ID, DEF); H = null; SAVED = loadRun(); UI.msg = ''; UI.busy = '';
      if ('dk' in S) { if (S.dk === false) S.musik = 'int'; delete S.dk; App.save(); }   // gammel indstilling "Med dansk musik"
      App.keepAwake();
      if (Spotify.loggedIn() && !Spotify.blocked()) { refreshDevices(true); Spotify.silence().catch(() => {}); }   // find det stille nummer, så første pause ikke skal vente
    },
    onLeave(){ stopTimers(); pauseQuiet(); UI.testing = ''; },
    render
  });

  /* ---------- hjælpere ---------- */
  const sl = n => n === 1 ? '1 slurk' : n + ' slurke';
  const pt = n => n === 1 ? '1 point' : n + ' point';
  const fmtP = n => Number(n).toLocaleString('da-DK');        // 1.000
  const fmtSec = s => String(s).replace('.', ',') + ' s';      // 0,5 s
  /* Klip: søgning i alle numre (ikke kun dem i bunken, så listen ikke afslører noget) */
  const norm = s => String(s).toLowerCase().replace(/['’`´]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9æøå]+/g, ' ').trim();
  let INDEX = null;
  function songIndex(){
    if (INDEX) return INDEX;
    const seen = new Set();
    INDEX = HITSTER_SONGS.concat(HITSTER_SONGS_DK).filter(s => { const k = s[0] + '|' + s[1]; if (seen.has(k)) return false; seen.add(k); return true; })
      .map(s => ({ t: s[0], a: s[1], nt: norm(s[0]), na: norm(s[1]) }));
    return INDEX;
  }
  function search(q){
    const n = norm(q);
    if (n.length < 2) return [];
    const words = n.split(' ');
    const hits = [];
    for (const s of songIndex()) {
      const hay = s.nt + ' ' + s.na;
      if (!words.every(w => hay.includes(w))) continue;
      hits.push([s.nt.startsWith(n) ? 0 : s.nt.includes(n) ? 1 : (' ' + s.nt).includes(' ' + words[0]) ? 2 : 3, s]);
    }
    return hits.sort((x, y) => x[0] - y[0] || x[1].t.length - y[1].t.length).slice(0, 5).map(h => h[1]);
  }
  const results = q => {
    if (norm(q).length < 2) return '';
    const r = search(q);
    return r.length ? r.map(s => `<button type="button" class="sr" data-action="hit.pick" data-t="${esc(s.t)}"><b>${esc(s.t)}</b><small>${esc(s.a)}</small></button>`).join('')
      : '<p class="sr-none">Ingen sange fundet. Prøv med titlen.</p>';
  };
  const who = () => H.players[H.idx];
  const judge = () => H.players[(H.idx + 1) % H.players.length];
  const nextName = () => H.players[(H.idx + 1) % H.players.length];
  const dev = () => S.device && S.device.id;
  function pool(){
    const a = S.musik === 'dk' ? HITSTER_SONGS_DK : S.musik === 'int' ? HITSTER_SONGS : HITSTER_SONGS.concat(HITSTER_SONGS_DK);
    return a.filter(s => s[2] >= S.from).map(s => ({ t: s[0], a: s[1], y: s[2] }));
  }
  /* Streams: kun numre, vi har et tal på (data/hitster-streams.js). s er millioner streams. */
  function spool(){
    return pool().map(c => Object.assign(c, { s: HITSTER_STREAMS.mio[c.t + '|' + c.a] || 0 })).filter(c => c.s);
  }
  const fmtS = m => m >= 1000 ? (m / 1000).toFixed(2).replace('.', ',') + ' mia.' : String(m).replace('.', ',') + ' mio.';
  /* Streams, sværhed: hvor mange gange større den ene sang højst må være end den anden */
  const BAND = { mellem: 1.6, svaer: 1.25 };
  const DIFF_TEXT = {
    let: 'Tilfældige sange. Der kan være langt mellem tallene.',
    mellem: 'Sangene ligger tættere på hinanden.',
    svaer: 'Sangene ligger helt tæt. Her skal man vide det.'
  };
  const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
  const streamsDate = () => { const d = HITSTER_STREAMS.dato.split('-'); return Number(d[2]) + '. ' + MONTHS[Number(d[1]) - 1] + ' ' + d[0]; };
  function saveRun(){ try { localStorage.setItem(RUN_KEY, JSON.stringify(H)); } catch (e) {} }
  function clearRun(){ try { localStorage.removeItem(RUN_KEY); } catch (e) {} SAVED = null; }
  function loadRun(){
    try {
      const r = JSON.parse(localStorage.getItem(RUN_KEY));
      if (!r || !r.players || !r.phase || r.phase === 'win' || r.phase === 'end') return null;
      r.mode = r.mode || 'klassisk';   // spil gemt før der var spiltyper
      if (r.mode === 'klip' && !Array.isArray(r.wrong)) return null;   // den gamle Klip med 1, 5, 15 og 30 sek
      return r;
    } catch (e) { return null; }
  }
  /* Næste nummer fra bunken. Er den tom, blandes de numre, der ikke allerede er i spil. */
  function draw(){
    if (!H.deck.length) {
      const taken = new Set();
      Object.values(H.tl || {}).forEach(l => l.forEach(c => taken.add(c.t + '|' + c.a)));
      [H.cur, H.champ].forEach(c => { if (c) taken.add(c.t + '|' + c.a); });
      const all = H.mode === 'streams' ? spool() : pool();
      let rest = all.filter(c => !taken.has(c.t + '|' + c.a));
      if (!rest.length) rest = all;
      H.deck = App.shuffle(rest);
    }
    return H.deck.pop();
  }
  /* Streams: næste udfordrer. Sværhedsgraden bestemmer, hvor tæt dens tal skal ligge på sangen, der skal slås.
     To sange med samme tal giver intet rigtigt svar, så dem vælger vi aldrig. */
  function drawChallenger(){
    const band = BAND[H.diff];
    if (!band) {
      let c = draw();
      for (let i = 0; i < 5 && c.s === H.champ.s; i++) c = draw();
      return c;
    }
    const id = c => c.t + '|' + c.a;
    if (H.deck.length < 25) {   // hold bunken fyldt, så der altid er sange tæt på
      const skip = new Set([H.champ, H.cur].filter(Boolean).map(id).concat(H.deck.map(id)));
      H.deck = H.deck.concat(App.shuffle(spool().filter(c => !skip.has(id(c)))));
    }
    const ratio = c => Math.max(c.s, H.champ.s) / Math.min(c.s, H.champ.s);
    const ok = H.deck.filter(c => c.s !== H.champ.s);
    let near = ok.filter(c => ratio(c) <= band);
    if (near.length < 3) near = ok.slice().sort((x, y) => ratio(x) - ratio(y)).slice(0, 3);   // ingen tæt nok: tag de nærmeste
    if (!near.length) return draw();
    const c = App.pick(near);
    H.deck.splice(H.deck.indexOf(c), 1);
    return c;
  }
  /* Find det nuværende nummer på Spotify. Numre, Spotify ikke har, springes over. */
  async function ensureTrack(){
    if (H.track) return;
    let tr = null;
    for (let i = 0; i < 4 && !tr; i++) {
      tr = await Spotify.findTrack(H.cur);
      if (!tr) H.cur = draw();
    }
    if (!tr) throw new Error('Kunne ikke finde numre på Spotify. Prøv igen om lidt.');
    H.track = { uri: tr.uri, img: tr.img };
    const upcoming = H.deck[H.deck.length - 1];
    if (upcoming) Spotify.findTrack(upcoming).catch(() => {});   // klar til næste gang
  }

  /* "Alt": lige mange danske og internationale numre i bunken. Ellers fylder de 562 danske 60 procent, og det var for meget. */
  function balance(list){
    if (S.musik !== 'alle') return list;
    const dk = new Set(HITSTER_SONGS_DK.map(s => s[0] + '|' + s[1]));
    const d = list.filter(c => dk.has(c.t + '|' + c.a)), i = list.filter(c => !dk.has(c.t + '|' + c.a));
    return i.concat(App.shuffle(d).slice(0, i.length));
  }

  /* ---------- afspilning ---------- */
  /* Rigtig pause: kun når man forlader Hitster. Inde i spillet bruges hush(), så Spotify-appen ikke falder i søvn. */
  function pauseQuiet(){
    if (!played || !S || !Spotify.loggedIn()) return;
    played = false; cur = null;
    Spotify.pause(dev()).catch(() => {});
  }
  /* Stilhed i stedet for pause: sæt et nummer uden lyd på, så enheden bliver ved med at være vågen.
     Findes der ikke et stille nummer, pauses der som før. */
  let cur = null;   // det nummer, der spiller lige nu: { uri, at (Date.now ved start), offset (ms) }
  function hush(){
    if (!played || !S || !Spotify.loggedIn()) return;
    played = false;
    if (cur) cur.paused = Date.now();
    Spotify.silence().then(uri => uri ? Spotify.play(uri, dev()) : Spotify.pause(dev())).catch(() => {});
  }
  /* Afspil på den valgte enhed. Er enheden forsvundet (appen blev lukket), finder vi den igen. */
  async function playOnDevice(uri, positionMs){
    played = true;
    cur = { uri, at: Date.now(), offset: positionMs || 0 };
    try { await Spotify.play(uri, dev(), positionMs); }
    catch (e) {
      if (e.status !== 404 && e.reason !== 'NO_ACTIVE_DEVICE') throw e;
      const list = await Spotify.devices();
      const d = list.find(x => S.device && x.name === S.device.name) || list.find(x => x.is_active) || list[0];
      if (!d) throw e;
      S.device = { id: d.id, name: d.name }; App.save();
      await Spotify.play(uri, d.id, positionMs);
    }
  }
  /* Fortsæt, hvor stilheden blev sat på: samme nummer, samme sted */
  async function resumePlayback(){
    if (!H || !H.track) return;
    const pos = cur && cur.uri === H.track.uri && cur.paused ? cur.offset + (cur.paused - cur.at) : 0;
    await playOnDevice(H.track.uri, pos);
  }
  async function togglePause(){
    if (!H || !H.track) return;
    UI.msg = '';
    if (H.paused) {
      H.paused = false; App.render();
      try { await resumePlayback(); }
      catch (e) { H.paused = true; UI.msg = Spotify.explain(e); App.render(); }
    } else {
      H.paused = true; App.render();
      hush();
    }
  }
  /* Streams: spil udfordreren, hvis Spotify er klar. Spillet kører videre uden musik, hvis det ikke lykkes. */
  function playChallenger(){
    H.track = null; H.paused = false;
    if (!Spotify.loggedIn() || Spotify.blocked() || !S.device) return;
    const c = H.cur;
    const same = () => H && H.phase === 'hl' && H.cur === c;
    Spotify.findTrack(c).then(async tr => {
      if (!tr || !same()) return;
      await playOnDevice(tr.uri);
      if (!same()) return;
      H.track = { uri: tr.uri, img: tr.img };
      saveRun(); App.render();
    }).catch(e => { if (same()) { UI.msg = Spotify.explain(e); App.render(); } });
  }
  async function refreshDevices(auto){
    if (UI.loading) return;
    UI.loading = true; UI.msg = '';
    if (!auto) App.render();
    try {
      const list = await Spotify.devices();
      UI.devices = list;
      const cur = S.device && (list.find(d => d.id === S.device.id) || list.find(d => d.name === S.device.name));
      const pick = cur || list.find(d => d.is_active) || (list.length === 1 ? list[0] : null);
      if (pick) { S.device = { id: pick.id, name: pick.name }; App.save(); }
    } catch (e) { UI.devices = null; UI.msg = Spotify.explain(e); }
    UI.loading = false; App.render();
  }

  /* ---------- nedtælling ---------- */
  function stopTimers(){
    clearInterval(tick); tick = null;
    clearTimeout(clipTimer); clipTimer = null;
  }
  function startTimer(){
    if (!H || !H.timer) return;
    H.deadline = Date.now() + H.timer * 1000;
    saveRun();
    runTimer();
  }
  function runTimer(){
    clearInterval(tick); tick = null;
    if (!H || !H.deadline || H.timeUp) return;
    shown = -1;
    tick = setInterval(onTick, 250);
    onTick();
  }
  const left = () => Math.max(0, Math.ceil((H.deadline - Date.now()) / 1000));
  function onTick(){
    const hl = H && H.phase === 'hl' && !H.res;
    if (!H || !H.deadline || (H.phase !== 'place' && H.phase !== 'judge' && !hl)) { clearInterval(tick); tick = null; return; }
    const s = left(), warn = hl ? 3 : 5;
    const el = document.querySelector('.timer, .hl-time');
    if (el) { el.textContent = s; el.classList.toggle('done', s <= warn); }
    if (s !== shown) { shown = s; if (s > 0 && s <= warn) { App.audio.tick(); App.vibrate(30); } }
    if (s <= 0) { clearInterval(tick); tick = null; timeUp(); }
  }
  function timeUp(){
    if (H.phase === 'place') { lock(true); return; }
    if (H.phase === 'hl') { answer(null); return; }
    H.timeUp = true;
    App.audio.buzz(); App.vibrate([200, 100, 200]);
    saveRun(); App.render();
  }
  const timerHtml = () => H.timer && H.deadline ? `<div class="timer ${left() <= 5 ? 'done' : ''}">${left()}</div>` : '';

  /* ---------- skærme ---------- */
  function render(){
    if (!H) return renderSetup();
    return ({ turn: renderTurn, place: renderPlace, judge: renderJudge, clip: renderClip, hl: renderHL, reveal: renderReveal, win: renderWin, end: renderEnd })[H.phase]();
  }

  const DEV_TYPE = { Smartphone: 'Telefon', Computer: 'Computer', Speaker: 'Højttaler', TV: 'TV', CastAudio: 'Cast', CastVideo: 'Cast' };

  function spotifyCard(){
    const bl = Spotify.blocked();
    if (bl) {
      return `<div class="card"><div class="label">Spotify</div><p class="warn">${bl === 'localhost'
        ? 'Spotify tillader ikke localhost. Åbn siden på http://127.0.0.1:3002 i stedet.'
        : 'Spotify-login kræver https. Brug adressen på GitHub Pages, eller åbn http://127.0.0.1:3002 på computeren.'}</p></div>`;
    }
    if (UI.auth) return `<div class="card"><div class="label">Spotify</div><p>Logger ind...</p></div>`;
    if (!Spotify.loggedIn()) {
      return `<div class="card"><div class="label">Spotify</div>
        <p>Musikken spilles over Spotify. Kun den, der styrer telefonen, skal have Premium og logge ind. De andre behøver ingenting.</p>
        ${UI.msg ? `<p class="warn">${esc(UI.msg)}</p>` : ''}
        <button class="btn light" style="margin-top:10px" data-action="hit.login">Log ind med Spotify</button>
        <details class="how"><summary>Første gang? Sådan sætter du det op</summary>
          <p>1. Åbn <b>developer.spotify.com/dashboard</b> og din app, og tryk Settings.</p>
          <p>2. Læg denne adresse ind under <b>Redirect URIs</b>, og gem:</p>
          <div class="uri">${esc(Spotify.redirectUri())}</div>
          <button class="btn sm ghost" data-action="hit.copy">Kopiér adressen</button>
          <p>3. Giver Spotify en fejl om adgang, så læg din Spotify-mail ind under <b>User Management</b>.</p>
        </details></div>`;
    }
    const list = UI.devices;
    let devs = '';
    if (list && list.length) {
      devs = `<div class="devices">${list.map(d => `<button class="btn sm ${S.device && S.device.id === d.id ? 'light' : 'ghost'}" data-action="hit.dev" data-id="${esc(d.id)}" data-name="${esc(d.name)}"><span>${esc(d.name)}</span><small>${esc(DEV_TYPE[d.type] || d.type)}</small></button>`).join('')}</div>`;
    } else if (list) {
      devs = '<p class="hint">Ingen enheder fundet. Åbn Spotify-appen på telefonen, tryk play på et nummer i et par sekunder, og tryk Find enheder.</p>';
    }
    return `<div class="card"><div class="label">Spotify</div>
      <div class="row-between">
        <div><div class="strong">Forbundet</div><small>${S.device ? 'Afspiller på: ' + esc(S.device.name) : 'Vælg, hvor musikken skal spille'}</small></div>
        <button class="btn sm ghost" data-action="hit.devices" ${UI.loading ? 'disabled' : ''}>${UI.loading ? 'Leder...' : 'Find enheder'}</button>
      </div>
      ${UI.msg ? `<p class="warn">${esc(UI.msg)}</p>` : ''}
      ${devs}
      ${S.device ? `<div class="btn-row"><button class="btn sm light" data-action="hit.test" ${UI.busy ? 'disabled' : ''}>${UI.busy === 'test' ? 'Henter...' : 'Test lyden'}</button><button class="btn sm ghost" data-action="hit.stop">Stop</button></div>` : ''}
      ${UI.testing ? `<p class="hint">Spiller: ${esc(UI.testing)}</p>` : ''}
      <button class="link" data-action="hit.logout">Log ud af Spotify</button>
    </div>`;
  }

  function resumeText(r){
    if (r.mode === 'kasser' || r.mode === 'streams' || r.mode === 'klip') return `${App.gen(r.players[r.idx])} tur, runde ${r.round} af ${r.rounds}.`;
    return `${App.gen(r.players[r.idx])} tur i runde ${r.round}.`;
  }

  function renderSetup(){
    const p = App.players();
    const n = p.length;
    const src = S.mode === 'streams' ? spool() : pool();
    const enough = src.length >= n + 10;
    const ready = n >= 2 && enough && (S.mode === 'streams' || (Spotify.loggedIn() && !!S.device));
    const few = enough ? '' : `<p class="warn">${S.mode === 'streams'
      ? 'Der er kun streams-tal for ' + src.length + ' af de valgte numre. Vælg mere musik eller en anden spiltype.'
      : 'For få numre med de valg. Vælg mere musik eller flere år.'}</p>`;
    const resume = SAVED ? `<div class="card"><div class="label">Spil i gang</div>
        <p>${esc(resumeText(SAVED))}</p>
        <button class="btn light" style="margin-top:10px" data-action="hit.resume">Fortsæt spillet</button></div>` : '';
    let rules = '';
    if (S.mode === 'klassisk') {
      rules = ui.stepper('Kort for at vinde', 'hit.step', S.goal, 'goal', 'Alle starter med 1 kort')
        + ui.stepper('Slurke ved forkert svar', 'hit.step', S.sips, 'sips')
        + ui.toggle('Bonus for kunstner og titel', 'hit.toggle', S.bonus, 'bonus', 'Sig dem før afsløringen og del ' + sl(BONUS) + ' ud')
        + `<div class="field"><div class="label">Tid til at placere</div>${ui.seg('hit.seg', [{ v: 0, l: 'Ingen' }, { v: 15, l: '15 sek' }, { v: 30, l: '30 sek' }, { v: 60, l: '60 sek' }], S.timer, 'timer')}
           ${S.timer ? '<p class="hint">Løber tiden ud, tæller det valgte felt. Er der ikke valgt noget, er svaret forkert.</p>' : ''}</div>`;
    } else if (S.mode === 'kasser') {
      rules = ui.stepper('Runder', 'hit.step', S.rounds, 'rounds', 'Hver spiller gætter ' + S.rounds + (S.rounds === 1 ? ' gang' : ' gange'))
        + `<div class="field"><div class="label">Tid til at gætte</div>${ui.seg('hit.seg', [{ v: 0, l: 'Ingen' }, { v: 30, l: '30 sek' }, { v: 60, l: '60 sek' }, { v: 90, l: '90 sek' }], S.ktimer, 'ktimer')}</div>`;
    } else if (S.mode === 'streams') {
      rules = ui.stepper('Runder', 'hit.step', S.hrounds, 'hrounds', 'Hver spiller gætter ' + S.hrounds + (S.hrounds === 1 ? ' gang' : ' gange'))
        + ui.stepper('Slurke ved forkert svar', 'hit.step', S.sips, 'sips')
        + `<div class="field"><div class="label">Sværhed</div>${ui.seg('hit.seg', [{ v: 'let', l: 'Let' }, { v: 'mellem', l: 'Mellem' }, { v: 'svaer', l: 'Svær' }], S.diff, 'diff')}
           <p class="hint">${DIFF_TEXT[S.diff]}</p></div>`
        + `<div class="field"><div class="label">Tid til at svare</div>${ui.seg('hit.seg', [{ v: 0, l: 'Ingen' }, { v: 5, l: '5 sek' }, { v: 10, l: '10 sek' }], S.htimer, 'htimer')}</div>`;
    } else {
      rules = ui.stepper('Runder', 'hit.step', S.rounds, 'rounds', 'Hver spiller får ' + S.rounds + (S.rounds === 1 ? ' sang' : ' sange'))
        + ui.stepper('Slurke, hvis man ikke gætter den', 'hit.step', S.sips, 'sips')
        + ui.stepper('Justér klip (ms)', 'hit.step', S.lag, 'lag', 'Hører I for lidt eller for meget af et halvt sekund, så ret her')
        + `<div class="btn-row" style="margin:6px 0 4px"><button class="btn sm light" data-action="hit.testclip" ${UI.busy || !S.device ? 'disabled' : ''}>Test et halvt sekund</button></div>`;
    }
    return ui.shell({ title: 'Hitster', color: C, body: `
      ${resume}
      <div class="card"><div class="label">Spiltype</div>
        ${ui.seg('hit.seg', MODES, S.mode, 'mode')}
        <p class="hint">${MODE_TEXT[S.mode]}</p>
      </div>
      ${spotifyCard()}
      <div class="card">
        <div class="row-between">
          <div><div class="label">Spillere</div><div class="strong">${n ? esc(p.join(', ')) : 'Ingen endnu'}</div></div>
          <button class="btn sm ghost" data-action="go" data-to="players">Ret</button>
        </div>
        ${n < 2 ? '<p class="warn">Du skal bruge mindst 2 spillere.</p>' : ''}
      </div>
      <div class="card">
        ${rules}
        <div class="field">
          <div class="label">Numre fra</div>
          ${ui.seg('hit.seg', [{ v: 0, l: 'Alle år' }, { v: 1980, l: '1980+' }, { v: 1990, l: '1990+' }, { v: 2000, l: '2000+' }], S.from, 'from')}
        </div>
        <div class="field">
          <div class="label">Musik</div>
          ${ui.seg('hit.seg', [{ v: 'alle', l: 'Alt' }, { v: 'dk', l: 'Kun dansk' }, { v: 'int', l: 'Uden dansk' }], S.musik, 'musik')}
          <p class="hint">${src.length} numre med de valg.</p>
          ${few}
        </div>
        ${S.mode === 'streams' ? `<p class="hint">Streams-tal fra kworb.net, hentet ${streamsDate()}. De stiger hele tiden, så de er cirka. Numre uden tal er ikke med.</p>` : ''}
      </div>`,
      footer: `<button class="btn" data-action="hit.start" ${ready ? '' : 'disabled'}>Start spillet</button>` });
  }

  /* Tidslinjen: kort med årstal, evt. med knapper imellem, hvor nummeret kan placeres.
     Mellem to kort med samme år er der ingen knap, for det er ligegyldigt, hvilken side man vælger. */
  function timeline(cards, o){
    let h = '';
    for (let i = 0; i <= cards.length; i++) {
      const same = i > 0 && i < cards.length && cards[i - 1].y === cards[i].y;
      if (o.slots && !same) h += `<button class="tl-slot ${o.sel === i ? 'sel' : ''}" data-action="hit.slot" data-i="${i}" aria-label="Placér her">${o.sel === i ? '?' : '+'}</button>`;
      if (i < cards.length) h += `<div class="tl-card ${o.hi === i ? 'hi' : ''}"><b>${cards[i].y}</b><small>${esc(cards[i].t)}</small></div>`;
    }
    return `<div class="tl">${h}</div>`;
  }
  function scoreboard(){
    const val = n => H.mode === 'klassisk' ? H.tl[n].length : fmtP(H.score[n]);
    const cur = H.idx;
    return `<div class="chips" style="justify-content:center">${H.players.map((n, i) => `<span class="chip ${i === cur ? 'on' : ''}">${esc(n)} <b>${val(n)}</b></span>`).join('')}</div>`;
  }
  const controls = () => `<div class="btn-row"><button class="btn sm ghost" data-action="hit.replay">Hør igen</button><button class="btn sm ghost" data-action="hit.pause">${H.paused ? 'Afspil' : 'Pause'}</button></div>`;
  const msg = () => UI.msg ? `<p class="warn">${esc(UI.msg)}</p>` : '';

  /* Før nummeret spilles (klassisk og kasser) */
  function renderTurn(){
    const name = who();
    const busy = UI.busy === 'play';
    let body;
    if (H.mode === 'kasser') {
      body = `
        <div class="label">Runde ${H.round} af ${H.rounds}</div>
        ${H.last ? `<p class="muted">${esc(H.last.name)} fik ${pt(H.last.pts)}.</p>` : ''}
        ${ui.avatar(name, true)}
        <div class="big">${esc(name)} gætter</div>
        <p class="muted">Giv telefonen til <b>${esc(judge())}</b>, som dømmer.</p>
        ${scoreboard()}${msg()}`;
    } else {
      body = `
        <div class="label">Runde ${H.round}</div>
        ${ui.avatar(name, true)}
        <div class="big">${esc(App.gen(name))} tur</div>
        <p class="muted">Din tidslinje. Mål: ${H.goal} kort.</p>
        ${timeline(H.tl[name], {})}
        ${scoreboard()}${msg()}`;
    }
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body,
      footer: `<button class="btn" data-action="hit.play" ${busy ? 'disabled' : ''}>${busy ? 'Henter sangen...' : UI.msg ? 'Prøv igen' : 'Afspil sang'}</button>${UI.msg ? '<button class="link" data-action="hit.setup">Skift enhed</button>' : ''}` });
  }

  /* Klassisk: placér nummeret i tidslinjen */
  function renderPlace(){
    const name = who();
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">${esc(App.gen(name))} tur</div>
      ${eq((H.paused ? 'off ' : '') + (H.timer ? 'sm' : ''))}
      ${timerHtml()}
      ${timeline(H.tl[name], { slots: true, sel: H.slot })}
      ${controls()}${msg()}`,
      footer: `<button class="btn" data-action="hit.lock" ${H.slot === null ? 'disabled' : ''}>Lås svar</button>` });
  }

  /* Kasser: dommeren ser svarene og sætter kryds */
  function renderJudge(){
    const name = who();
    const rows = [['Titel', H.cur.t], ['Kunstner', H.cur.a], ['Årstal', H.cur.y]];
    const n = H.marks.filter(Boolean).length;
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">${esc(name)} gætter</div>
      ${eq('sm ' + (H.paused ? 'off' : ''))}
      ${timerHtml()}
      ${H.timeUp ? '<p class="warn">Tiden er gået</p>' : ''}
      <div class="kasser">${rows.map((r, i) => `<button class="kasse ${H.marks[i] ? 'on' : ''}" data-action="hit.mark" data-i="${i}"><span class="k-l">${r[0]}</span><span class="k-v">${esc(r[1])}</span><span class="k-c">${CHECK}</span></button>`).join('')}</div>
      ${controls()}${msg()}`,
      footer: `<button class="btn" data-action="hit.award">${n ? 'Giv ' + pt(n) : 'Ingen point'}</button>` });
  }

  /* Klip: stor afspilknap, bjælke med det, man har låst op, og søgning efter sangen nederst.
     Mens et klip spiller, tegnes kun knappen og bjælken om (paintClip), så tastaturet ikke lukker midt i en søgning. */
  const cpos = t => Math.sqrt(t / CLIPS[CLIPS.length - 1]) * 100;   // kvadratrod, så de korte klip kan ses på bjælken
  function renderClip(){
    const name = who(), st = H.stage, len = CLIPS[st], lastStage = st === CLIPS.length - 1;
    const marks = CLIPS.slice(0, -1).map(t => `<i style="left:${cpos(t)}%"></i>`).join('');
    const cs = H.cstate === 'playing' || H.cstate === 'loading' ? H.cstate : '';
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">${esc(App.gen(name))} tur · sang ${H.round} af ${H.rounds}</div>
      <div class="worth"><small>Værd nu</small><b>${fmtP(WORTH[st])}</b></div>
      <div class="cbar-wrap">
        <div class="cbar ${cs === 'playing' ? 'run' : ''}" style="--to:${cpos(len)}%;--dur:${len}s">${marks}<span class="cfill"></span><span class="crun"></span></div>
        <span class="cnow" style="left:${cpos(len)}%">${fmtSec(len)}</span><span class="cend">${fmtSec(CLIPS[CLIPS.length - 1])}</span>
      </div>
      <div class="cplay-row">
        <button class="cplay ${cs}" style="--dur:${len}s" data-action="hit.cplay" aria-label="Spil klippet">${PLAY}${STOP}${RING}</button>
        <span class="clen">${fmtSec(len)}</span>
      </div>
      ${H.wrong.length ? `<div class="cwrong">${H.wrong.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : `<p class="muted">Kun ${esc(name)} gætter. Resten holder kæft.</p>`}
      ${msg()}`,
      footer: `<div class="csearch">
        <div class="sr-list">${results(H.q || '')}</div>
        <form class="input-row" data-form="hit.searchgo" autocomplete="off">
          <label class="csq">${LUPE}<input id="clip-q" data-input="hit.search" value="${esc(H.q || '')}" placeholder="Gæt sangen" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></label>
          <button type="button" class="btn sm ghost cskip" data-action="hit.skip">${lastStage ? 'Giv op' : 'Skip<small>' + fmtSec(CLIPS[st + 1]) + '</small>'}</button>
        </form>
      </div>` });
  }


  /* Streams: den forrige sang med tal øverst, udfordreren nederst. Efter gættet vises tallet på samme skærm. */
  function renderHL(){
    const name = who(), a = H.champ, b = H.cur, r = H.res;
    const card = (c, val, cls) => `<div class="hl-card ${cls}"><div class="hl-t">${esc(c.t)}</div><div class="hl-a">${esc(c.a)}</div><div class="hl-n">${val}</div></div>`;
    const num = c => fmtS(c.s) + ' <small>streams</small>';
    const top = card(a, num(a), '');
    if (!r) {
      return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
        <div class="label">${esc(App.gen(name))} tur · ${H.round}/${H.rounds}</div>
        ${top}
        ${H.timer && H.deadline ? `<div class="hl-vs hl-time ${left() <= 3 ? 'done' : ''}">${left()}</div>` : '<div class="hl-vs">VS</div>'}
        ${card(b, '?', 'q')}
        <p class="muted">Flere eller færre streams?</p>
        ${H.track ? controls() : ''}${msg()}`,
        footer: `<div class="hl-btns"><button class="btn light" data-action="hit.hl" data-v="1">${UP}Flere</button><button class="btn danger" data-action="hit.hl" data-v="0">${DOWN}Færre</button></div>` });
    }
    const last = H.turn + 1 >= H.players.length * H.rounds;
    const text = r.ok ? `${name} får et point.` : (r.timeout ? 'Tiden løb ud. ' : '') + (H.sips ? `${name} drikker ${sl(H.sips)}.` : 'Ingen point.');
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">${r.ok ? 'Rigtigt' : 'Forkert'}</div>
      ${top}
      <div class="hl-vs">${b.s > a.s ? 'Flere' : b.s < a.s ? 'Færre' : 'Lige mange'}</div>
      ${card(b, num(b), r.ok ? 'ok' : 'no')}
      <p class="strong">${esc(text)}</p>
      ${scoreboard()}${msg()}`,
      footer: `<button class="btn" data-action="hit.hlnext">${last ? 'Se resultatet' : 'Giv videre til ' + esc(nextName())}</button>` });
  }

  function renderReveal(){
    const r = H.res, c = r.card;
    if (H.mode === 'klip') {
      const name = who();
      const text = r.ok ? `${name} tog den på ${fmtSec(CLIPS[r.stage])} og får ${fmtP(r.pts)} point.`
        : `${name} kunne ikke tage den.` + (H.sips ? ` ${name} drikker ${sl(H.sips)}.` : '');
      const last = H.turn + 1 >= H.players.length * H.rounds;
      return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
        <div class="reveal-box" style="--accent:${r.ok ? '#2fae57' : '#e0453a'}">
          <div class="label">${r.ok ? '+' + fmtP(r.pts) + ' point' : 'Ikke gættet'}</div>
          ${r.img ? `<img class="cover" src="${esc(r.img)}" alt="">` : ''}
          <div class="big accent">${c.y}</div>
          <div class="strong">${esc(c.t)}</div>
          <p class="muted">${esc(c.a)}</p>
        </div>
        <p class="strong">${esc(text)}</p>
        ${scoreboard()}${controls()}${msg()}`,
        footer: `<button class="btn" data-action="hit.next">${last ? 'Se resultatet' : 'Giv videre til ' + esc(nextName())}</button>` });
    }
    const name = who(), n = H.tl[name].length;
    const lost = (r.timeout ? 'Tiden løb ud. ' : '') + (H.sips ? `${name} drikker ${sl(H.sips)}. Kortet er væk.` : 'Kortet er væk.');
    const text = r.ok
      ? (r.won ? `${name} har ${H.goal} kort og vinder!` : `${name} beholder kortet og har nu ${n} af ${H.goal}.`)
      : lost;
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="reveal-box" style="--accent:${r.ok ? '#2fae57' : '#e0453a'}">
        <div class="label">${r.ok ? 'Rigtigt' : 'Forkert'}</div>
        ${r.img ? `<img class="cover" src="${esc(r.img)}" alt="">` : ''}
        <div class="big accent">${c.y}</div>
        <div class="strong">${esc(c.t)}</div>
        <p class="muted">${esc(c.a)}</p>
      </div>
      <p class="strong">${esc(text)}</p>
      ${H.bonus ? `<p class="hint">Bonus: Sagde ${esc(name)} både kunstner og titel, før I afslørede det, så deler ${esc(name)} ${sl(BONUS)} ud.</p>` : ''}
      ${timeline(H.tl[name], { hi: r.ok ? r.at : null })}`,
      footer: `<button class="btn" data-action="hit.next">${r.won ? 'Se vinderen' : 'Giv videre til ' + esc(nextName())}</button>` });
  }

  function renderWin(){
    const name = who();
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">Vinder</div>
      ${ui.avatar(name, true)}
      <div class="big">${esc(name)} vinder</div>
      <p class="muted">${esc(name)} nåede ${H.goal} kort først. De andre drikker ${sl(END_SIPS)}.</p>
      ${timeline(H.tl[name], {})}`,
      footer: `<button class="btn" data-action="hit.start">Nyt spil</button><button class="btn ghost" data-action="hit.setup">Indstillinger</button>` });
  }

  /* Slutstilling i kasser og klip */
  function renderEnd(){
    const rank = H.players.slice().sort((a, b) => H.score[b] - H.score[a]);
    const top = H.score[rank[0]], low = H.score[rank[rank.length - 1]];
    const winners = rank.filter(n => H.score[n] === top);
    const losers = rank.filter(n => H.score[n] === low);
    const tie = top === low;
    const list = (a, sep) => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + sep + a[a.length - 1];
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">Resultat</div>
      ${winners.length === 1 ? ui.avatar(winners[0], true) : ''}
      <div class="big ${winners.length > 2 ? 'long' : ''}">${tie ? 'Uafgjort' : esc(list(winners, ' og ')) + (winners.length === 1 ? ' vinder' : ' deler sejren')}</div>
      ${tie ? '' : `<p class="muted">${esc(list(losers, ' og '))} ${losers.length === 1 ? 'drikker' : 'drikker hver'} ${sl(END_SIPS)}.</p>`}
      <div class="players" style="width:100%">${rank.map(n => `<div class="player-row">${ui.avatar(n)}<span class="name">${esc(n)}</span><b class="pts">${fmtP(H.score[n])}</b></div>`).join('')}</div>`,
      footer: `<button class="btn" data-action="hit.start">Nyt spil</button><button class="btn ghost" data-action="hit.setup">Indstillinger</button>` });
  }

  /* ---------- spil ---------- */
  function start(){
    const p = App.players();
    const src = balance(S.mode === 'streams' ? spool() : pool());
    if (p.length < 2 || src.length < p.length + 10) return;
    clearRun(); stopTimers(); hush();
    H = {
      mode: S.mode, phase: 'turn', players: p.slice(), idx: 0, round: 1, turn: 0, song: 1,
      goal: S.goal, sips: S.sips, bonus: S.bonus, rounds: S.mode === 'streams' ? S.hrounds : S.rounds,
      timer: S.mode === 'kasser' ? S.ktimer : S.mode === 'klassisk' ? S.timer : S.mode === 'streams' ? S.htimer : 0,
      diff: S.diff, tl: {}, score: {}, deck: App.shuffle(src), cur: null, champ: null, track: null, res: null, last: null,
      slot: null, marks: [false, false, false], stage: 0, cstate: 'idle', wrong: [], q: '', paused: false, deadline: 0, timeUp: false
    };
    p.forEach(n => { H.score[n] = 0; });
    if (H.mode === 'klassisk') p.forEach(n => { H.tl[n] = [draw()]; });
    if (H.mode === 'streams') { H.champ = draw(); H.cur = drawChallenger(); H.phase = 'hl'; }
    else H.cur = draw();
    if (H.mode === 'klip') H.phase = 'clip';
    UI.msg = ''; UI.busy = '';
    saveRun();
    if (H.mode === 'streams') startTimer();
    App.render();
    if (H.mode === 'streams') playChallenger();
  }

  /* Klassisk og kasser: find nummeret, spil det og gå videre til gættefasen */
  async function playTurn(){
    if (UI.busy) return;
    UI.busy = 'play'; UI.msg = ''; App.render();
    try {
      await ensureTrack();
      await playOnDevice(H.track.uri);
      if (!H) { UI.busy = ''; return; }
      H.paused = false; H.slot = null; H.timeUp = false;
      H.phase = H.mode === 'kasser' ? 'judge' : 'place';
      saveRun(); startTimer();
    } catch (e) { UI.msg = Spotify.explain(e); }
    UI.busy = '';
    App.render();
  }

  /* Klip: spil nummeret fra starten i den længde, trinnet tillader, og stop så */
  async function playClip(){
    if (!H || H.phase !== 'clip' || H.cstate === 'playing' || H.cstate === 'loading') return;
    const song = H.cur;
    UI.msg = ''; H.cstate = 'loading'; paintClip();
    try {
      await ensureTrack();
      await playOnDevice(H.track.uri, 0);
      if (!H || H.phase !== 'clip' || H.cur !== song || H.cstate !== 'loading') return;
      const len = CLIPS[H.stage];
      H.cstate = 'playing'; paintClip();
      clearTimeout(clipTimer);
      clipTimer = setTimeout(() => {
        clipTimer = null;
        if (!H || H.cstate !== 'playing') return;
        hush(); H.cstate = 'idle'; paintClip();
      }, Math.max(200, len * 1000 + S.lag));
    } catch (e) {
      if (H) { H.cstate = 'idle'; UI.msg = Spotify.explain(e); App.render(); }
    }
  }
  function stopClip(){
    clearTimeout(clipTimer); clipTimer = null;
    if (H && H.cstate === 'playing') hush();
    if (H) H.cstate = 'idle';
  }
  /* Tegn kun knappen og bjælken om. Klassen sættes på igen, så ringen og bjælken starter forfra. */
  function paintClip(){
    const b = document.querySelector('.cplay'), bar = document.querySelector('.cbar');
    if (!b || !H) return;
    b.classList.remove('loading', 'playing');
    if (bar) bar.classList.remove('run');
    void b.offsetWidth;
    if (H.cstate === 'loading' || H.cstate === 'playing') b.classList.add(H.cstate);
    if (H.cstate === 'playing' && bar) bar.classList.add('run');
    b.setAttribute('aria-label', H.cstate === 'idle' ? 'Spil klippet' : 'Stop');
  }

  /* Klassisk: lås svaret. Ved timeout tæller det valgte felt, og er intet valgt, er svaret forkert. */
  function lock(timeout){
    if (!H || H.phase !== 'place') return;
    stopTimers();
    const name = who(), tl = H.tl[name], c = H.cur, s = H.slot;
    const placed = s !== null;
    /* Samme år som nabokortet tæller som rigtigt, uanset hvilken side */
    const ok = placed && (s === 0 || tl[s - 1].y <= c.y) && (s === tl.length || c.y <= tl[s].y);
    if (ok) tl.splice(s, 0, c);
    H.res = { ok, card: c, at: placed ? s : null, img: H.track ? H.track.img : '', won: ok && tl.length >= H.goal, timeout: !!timeout && !placed };
    H.phase = 'reveal';
    if (ok) { App.audio.ding(); App.vibrate(80); } else { App.audio.buzz(); App.vibrate([120, 60, 120]); }
    saveRun(); App.render();
  }

  /* ---------- knapper ---------- */
  App.on('hit.login', async () => {
    try { await Spotify.login(); }
    catch (e) { UI.msg = 'Kunne ikke starte login: ' + e.message; App.render(); }
  });
  App.on('hit.logout', () => { Spotify.logout(); UI.devices = null; UI.msg = ''; UI.testing = ''; App.render(); });
  App.on('hit.copy', el => {
    try { navigator.clipboard.writeText(Spotify.redirectUri()); el.textContent = 'Kopieret'; } catch (e) { el.textContent = 'Markér og kopiér selv'; }
  });
  App.on('hit.devices', () => refreshDevices(false));
  App.on('hit.dev', el => { S.device = { id: el.dataset.id, name: el.dataset.name }; App.save(); App.render(); });
  App.on('hit.test', async () => {
    if (UI.busy) return;
    UI.busy = 'test'; UI.msg = ''; App.render();
    try {
      let tr = null;
      for (let i = 0; i < 5 && !tr; i++) tr = await Spotify.findTrack(App.pick(pool()));
      if (!tr) throw new Error('Fandt ingen numre på Spotify.');
      await playOnDevice(tr.uri);
      UI.testing = tr.name;
    } catch (e) { UI.msg = Spotify.explain(e); UI.testing = ''; }
    UI.busy = '';
    App.render();
  });
  /* Prøv et 1 sek klip, så man kan finjustere, hvor meget man hører */
  App.on('hit.testclip', async () => {
    if (UI.busy) return;
    UI.busy = 'test'; UI.msg = ''; UI.testing = ''; App.render();
    try {
      let tr = null;
      for (let i = 0; i < 5 && !tr; i++) tr = await Spotify.findTrack(App.pick(pool()));
      if (!tr) throw new Error('Fandt ingen numre på Spotify.');
      await playOnDevice(tr.uri);
      setTimeout(() => { played = true; hush(); }, Math.max(200, CLIPS[0] * 1000 + S.lag));
    } catch (e) { UI.msg = Spotify.explain(e); }
    UI.busy = '';
    App.render();
  });
  App.on('hit.stop', () => { UI.testing = ''; played = true; pauseQuiet(); App.render(); });

  App.on('hit.step', el => {
    const k = el.dataset.key, d = Number(el.dataset.d);
    const lim = { goal: [3, 15, 1], sips: [0, 5, 1], rounds: [1, 10, 1], songs: [3, 30, 1], lag: [-600, 1000, 100], hrounds: [1, 15, 1] }[k];
    S[k] = Math.min(lim[1], Math.max(lim[0], S[k] + d * lim[2]));
    App.save(); App.render();
  });
  App.on('hit.seg', el => { const k = el.dataset.key; S[k] = k === 'mode' || k === 'musik' || k === 'diff' ? el.dataset.v : Number(el.dataset.v); App.save(); App.render(); });
  App.on('hit.toggle', el => { S[el.dataset.key] = el.checked; App.save(); App.render(); });

  App.on('hit.start', start);
  App.on('hit.resume', () => {
    H = SAVED; SAVED = null; UI.msg = ''; UI.busy = '';
    H.paused = false;
    if (H.cstate === 'playing' || H.cstate === 'loading') H.cstate = 'idle';
    if (H.phase === 'place' || H.phase === 'judge' || (H.phase === 'hl' && !H.res)) runTimer();
    App.render();
  });
  App.on('hit.setup', () => { stopTimers(); hush(); H = null; SAVED = loadRun(); UI.msg = ''; UI.busy = ''; App.render(); });
  App.on('hit.play', playTurn);
  App.on('hit.slot', el => {
    if (!H || H.phase !== 'place') return;
    H.slot = Number(el.dataset.i);
    App.audio.click(); saveRun(); App.render();
  });
  App.on('hit.replay', async () => {
    if (!H || !H.track) return;
    UI.msg = ''; H.paused = false; App.render();
    try { await playOnDevice(H.track.uri); } catch (e) { UI.msg = Spotify.explain(e); App.render(); }
  });
  App.on('hit.pause', togglePause);
  App.on('hit.lock', () => lock(false));

  App.on('hit.mark', el => {
    if (!H || H.phase !== 'judge') return;
    const i = Number(el.dataset.i);
    H.marks[i] = !H.marks[i];
    App.audio.click(); saveRun(); App.render();
  });
  App.on('hit.award', () => {
    if (!H || H.phase !== 'judge') return;
    stopTimers(); hush();
    const n = H.marks.filter(Boolean).length, name = who();
    H.score[name] += n;
    H.last = { name, pts: n };
    if (n) { App.audio.ding(); App.vibrate(60); }
    H.turn++;
    if (H.turn >= H.players.length * H.rounds) { H.phase = 'end'; clearRun(); App.audio.ding(); App.render(); return; }
    H.idx = H.turn % H.players.length;
    H.round = Math.floor(H.turn / H.players.length) + 1;
    H.cur = draw(); H.track = null; H.marks = [false, false, false]; H.timeUp = false; H.deadline = 0; H.phase = 'turn';
    UI.msg = '';
    saveRun(); App.render();
  });

  /* Streams: gæt på flere eller færre. Samme tal tæller som rigtigt begge veje. up === null: tiden løb ud. */
  function answer(up){
    if (!H || H.phase !== 'hl' || H.res) return;
    clearInterval(tick); tick = null;
    const a = H.champ, b = H.cur;
    const ok = up !== null && (b.s === a.s || up === (b.s > a.s));
    if (ok) H.score[who()]++;
    H.res = { ok, up, timeout: up === null };
    H.deadline = 0;
    if (ok) { App.audio.ding(); App.vibrate(80); } else { App.audio.buzz(); App.vibrate([120, 60, 120]); }
    saveRun(); App.render(true);
  }
  App.on('hit.hl', el => answer(el.dataset.v === '1'));
  /* Udfordreren bliver den nye sang at slå, og turen går videre */
  App.on('hit.hlnext', () => {
    if (!H || H.phase !== 'hl' || !H.res) return;
    H.turn++;
    if (H.turn >= H.players.length * H.rounds) { hush(); H.phase = 'end'; clearRun(); App.audio.ding(); App.render(); return; }
    H.idx = H.turn % H.players.length;
    H.round = Math.floor(H.turn / H.players.length) + 1;
    H.champ = H.cur; H.cur = drawChallenger(); H.res = null; H.deadline = 0;
    UI.msg = '';
    saveRun(); startTimer(); App.render();
    playChallenger();
  });

  /* Klip: den store knap spiller klippet, eller stopper det, hvis det spiller */
  App.on('hit.cplay', () => {
    if (!H || H.phase !== 'clip') return;
    if (H.cstate === 'playing' || H.cstate === 'loading') { stopClip(); paintClip(); return; }
    playClip();
  });
  /* Søgning: kun listen tegnes om, så tastaturet bliver oppe */
  App.on('hit.search', el => {
    if (!H || H.phase !== 'clip') return;
    H.q = el.value;
    const box = document.querySelector('.sr-list');
    if (box) box.innerHTML = results(H.q);
  });
  App.on('hit.searchgo', f => { const i = f.querySelector('input'); if (i) i.blur(); });
  /* Et gæt: rigtigt er samme titel (et cover med samme titel tæller også). Forkert giver næste klip med det samme. */
  App.on('hit.pick', el => {
    if (!H || H.phase !== 'clip') return;
    const t = el.dataset.t;
    if (norm(t) === norm(H.cur.t)) { revealClip(true); return; }
    if (!H.wrong.includes(t)) H.wrong.push(t);
    App.audio.buzz(); App.vibrate([120, 60, 120]);
    App.toast('Forkert: ' + t);
    nextStage();
  });
  App.on('hit.skip', () => { if (H && H.phase === 'clip') nextStage(); });
  /* Mere af sangen, men den er mindre værd. Efter sidste trin er det slut. */
  function nextStage(){
    stopClip();
    if (H.stage >= CLIPS.length - 1) { revealClip(false); return; }
    H.stage++; H.q = '';
    saveRun(); App.render(true);
    playClip();
  }
  /* Klip: giv point og vis svaret, og spil hele nummeret */
  function revealClip(ok){
    stopClip();
    const pts = ok ? WORTH[H.stage] : 0;
    H.score[who()] += pts;
    if (ok) { App.audio.ding(); App.vibrate([80, 40, 80]); } else { App.audio.buzz(); App.vibrate([120, 60, 120]); }
    H.res = { ok, pts, stage: H.stage, card: H.cur, img: H.track ? H.track.img : '' };
    H.phase = 'reveal'; H.paused = false; H.q = '';
    saveRun(); App.render();
    const go = () => H && H.phase === 'reveal' && H.track && playOnDevice(H.track.uri);
    (H.track ? Promise.resolve() : ensureTrack()).then(() => {
      if (H && H.res && !H.res.img && H.track) { H.res.img = H.track.img; saveRun(); App.render(); }
      return go();
    }).catch(e => { UI.msg = Spotify.explain(e); App.render(); });
  }
  /* Tryk i resultatlisten må ikke tage fokus fra søgefeltet først (så flytter listen sig, før trykket lander) */
  document.addEventListener('mousedown', e => { if (e.target.closest && e.target.closest('.sr')) e.preventDefault(); });

  App.on('hit.next', () => {
    if (!H || H.phase !== 'reveal') return;
    stopTimers(); hush();
    if (H.mode === 'klip') {
      H.turn++;
      if (H.turn >= H.players.length * H.rounds) { H.phase = 'end'; clearRun(); App.audio.ding(); App.render(); return; }
      H.idx = H.turn % H.players.length;
      H.round = Math.floor(H.turn / H.players.length) + 1;
      H.cur = draw(); H.track = null; H.res = null; H.stage = 0; H.cstate = 'idle'; H.wrong = []; H.q = ''; H.paused = false;
      H.phase = 'clip'; UI.msg = '';
      saveRun(); App.render();
      return;
    }
    if (H.res.won) {
      H.phase = 'win'; clearRun();
      App.audio.ding(); App.vibrate([100, 60, 100, 60, 300]);
      App.render(); return;
    }
    H.idx = (H.idx + 1) % H.players.length;
    if (H.idx === 0) H.round++;
    H.cur = draw(); H.slot = null; H.res = null; H.track = null; H.deadline = 0; H.paused = false; H.phase = 'turn';
    UI.msg = '';
    saveRun(); App.render();
  });

  /* Er siden åbnet igen efter login hos Spotify, så afslut login og vis Hitster */
  document.addEventListener('DOMContentLoaded', () => {
    if (!Spotify.hasCallback()) return;
    UI.auth = true;
    App.go(ID);
    Spotify.callback().then(r => {
      UI.auth = false;
      UI.msg = r === 'ok' ? '' : r;
      if (r === 'ok') refreshDevices(true); else App.render();
    });
  });
})();
