/* Hitster: hør et nummer, og sæt det på rette plads i din tidslinje. Først til målet vinder.
   Musikken afspilles af Spotify på en enhed, appen styrer (se spotify.js). */
(() => {
  const ID = 'hitster';
  const C = '#16c46b';
  const DEF = { goal: 8, from: 0, dk: true, sips: 2, bonus: true, device: null };
  const RUN_KEY = 'drukspil.hitster.run';
  const BONUS = 2;      // slurke at dele ud for at kunne kunstner og titel
  const WIN_SIPS = 3;   // slurke de andre drikker, når nogen vinder
  const { esc, ui } = App;
  let S = null;         // gemte indstillinger
  let H = null;         // igangværende spil
  let SAVED = null;     // et afbrudt spil, der kan fortsættes
  let played = false;   // har vi startet musik, som skal stoppes igen
  const UI = { busy: '', msg: '', auth: false, loading: false, devices: null, testing: '' };

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
  const EQ = '<div class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>';

  App.register({
    id: ID, navn: 'Hitster', farve: C, ikon: IKON,
    kort: 'Hør et nummer, og sæt det på rette plads i din tidslinje. Først til målet vinder. Kræver Spotify Premium på den ene telefon.',
    onEnter(){
      S = App.gameSettings(ID, DEF); H = null; SAVED = loadRun(); UI.msg = ''; UI.busy = '';
      App.keepAwake();
      if (Spotify.loggedIn() && !Spotify.blocked()) refreshDevices(true);
    },
    onLeave(){ pauseQuiet(); UI.testing = ''; },
    render
  });

  /* ---------- hjælpere ---------- */
  const sl = n => n === 1 ? '1 slurk' : n + ' slurke';
  const who = () => H.players[H.idx];
  const nextName = () => H.players[(H.idx + 1) % H.players.length];
  function pool(){
    let a = HITSTER_SONGS;
    if (S.dk) a = a.concat(HITSTER_SONGS_DK);
    return a.filter(s => s[2] >= S.from).map(s => ({ t: s[0], a: s[1], y: s[2] }));
  }
  function saveRun(){ try { localStorage.setItem(RUN_KEY, JSON.stringify(H)); } catch (e) {} }
  function clearRun(){ try { localStorage.removeItem(RUN_KEY); } catch (e) {} SAVED = null; }
  function loadRun(){
    try {
      const r = JSON.parse(localStorage.getItem(RUN_KEY));
      return r && r.players && r.tl && r.phase && r.phase !== 'win' ? r : null;
    } catch (e) { return null; }
  }
  /* Næste kort fra bunken. Er den tom, blandes de numre, der ikke allerede er i spil. */
  function draw(){
    if (!H.deck.length) {
      const taken = new Set();
      Object.values(H.tl).forEach(l => l.forEach(c => taken.add(c.t + '|' + c.a)));
      if (H.cur) taken.add(H.cur.t + '|' + H.cur.a);
      let rest = pool().filter(c => !taken.has(c.t + '|' + c.a));
      if (!rest.length) rest = pool();
      H.deck = App.shuffle(rest);
    }
    return H.deck.pop();
  }
  function pauseQuiet(){
    if (!played || !S || !Spotify.loggedIn()) return;
    played = false;
    Spotify.pause(S.device && S.device.id).catch(() => {});
  }
  /* Afspil på den valgte enhed. Er enheden forsvundet (appen blev lukket), finder vi den igen. */
  async function playOnDevice(uri){
    played = true;
    try { await Spotify.play(uri, S.device && S.device.id); }
    catch (e) {
      if (e.status !== 404 && e.reason !== 'NO_ACTIVE_DEVICE') throw e;
      const list = await Spotify.devices();
      const d = list.find(x => S.device && x.name === S.device.name) || list.find(x => x.is_active) || list[0];
      if (!d) throw e;
      S.device = { id: d.id, name: d.name }; App.save();
      await Spotify.play(uri, d.id);
    }
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

  /* ---------- skærme ---------- */
  function render(){
    if (!H) return renderSetup();
    return ({ turn: renderTurn, place: renderPlace, reveal: renderReveal, win: renderWin })[H.phase]();
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

  function renderSetup(){
    const p = App.players();
    const n = p.length;
    const songs = pool().length;
    const ready = n >= 2 && Spotify.loggedIn() && !!S.device && songs >= n + 10;
    const resume = SAVED ? `<div class="card"><div class="label">Spil i gang</div>
        <p>${esc(App.gen(SAVED.players[SAVED.idx]))} tur i runde ${SAVED.round}.</p>
        <button class="btn light" style="margin-top:10px" data-action="hit.resume">Fortsæt spillet</button></div>` : '';
    return ui.shell({ title: 'Hitster', color: C, body: `
      ${resume}
      <div class="card"><p>Et nummer spiller. Gæt, hvornår det udkom, og sæt det på rette plads i din tidslinje. Rigtigt: du beholder kortet. Forkert: du drikker, og kortet er væk. Først til målet vinder.</p></div>
      ${spotifyCard()}
      <div class="card">
        <div class="row-between">
          <div><div class="label">Spillere</div><div class="strong">${n ? esc(p.join(', ')) : 'Ingen endnu'}</div></div>
          <button class="btn sm ghost" data-action="go" data-to="players">Ret</button>
        </div>
        ${n < 2 ? '<p class="warn">Du skal bruge mindst 2 spillere.</p>' : ''}
      </div>
      <div class="card">
        ${ui.stepper('Kort for at vinde', 'hit.step', S.goal, 'goal', 'Alle starter med 1 kort')}
        <div class="field">
          <div class="label">Numre fra</div>
          ${ui.seg('hit.seg', [{ v: 0, l: 'Alle år' }, { v: 1980, l: '1980+' }, { v: 1990, l: '1990+' }, { v: 2000, l: '2000+' }], S.from, 'from')}
        </div>
        ${ui.toggle('Med dansk musik', 'hit.toggle', S.dk, 'dk')}
        ${ui.stepper('Slurke ved forkert svar', 'hit.step', S.sips, 'sips')}
        ${ui.toggle('Bonus for kunstner og titel', 'hit.toggle', S.bonus, 'bonus', 'Sig dem før afsløringen og del ' + sl(BONUS) + ' ud')}
      </div>`,
      footer: `<button class="btn" data-action="hit.start" ${ready ? '' : 'disabled'}>Start spillet</button>` });
  }

  /* Tidslinjen: kort med årstal, evt. med knapper imellem, hvor nummeret kan placeres */
  function timeline(cards, o){
    let h = '';
    for (let i = 0; i <= cards.length; i++) {
      if (o.slots) h += `<button class="tl-slot ${o.sel === i ? 'sel' : ''}" data-action="hit.slot" data-i="${i}" aria-label="Placér her">${o.sel === i ? '?' : '+'}</button>`;
      if (i < cards.length) h += `<div class="tl-card ${o.hi === i ? 'hi' : ''}"><b>${cards[i].y}</b><small>${esc(cards[i].t)}</small></div>`;
    }
    return `<div class="tl">${h}</div>`;
  }
  function scoreboard(){
    return `<div class="chips" style="justify-content:center">${H.players.map((n, i) => `<span class="chip ${i === H.idx ? 'on' : ''}">${esc(n)} <b>${H.tl[n].length}</b></span>`).join('')}</div>`;
  }

  function renderTurn(){
    const name = who();
    const busy = UI.busy === 'play';
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">Runde ${H.round}</div>
      ${ui.avatar(name, true)}
      <div class="big">${esc(App.gen(name))} tur</div>
      <p class="muted">Din tidslinje. Mål: ${H.goal} kort.</p>
      ${timeline(H.tl[name], {})}
      ${scoreboard()}
      ${UI.msg ? `<p class="warn">${esc(UI.msg)}</p>` : ''}`,
      footer: `<button class="btn" data-action="hit.play" ${busy ? 'disabled' : ''}>${busy ? 'Henter sangen...' : UI.msg ? 'Prøv igen' : 'Afspil sang'}</button>${UI.msg ? '<button class="link" data-action="hit.setup">Skift enhed</button>' : ''}` });
  }

  function renderPlace(){
    const name = who();
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">${esc(App.gen(name))} tur</div>
      ${EQ}
      <p class="muted">Hvornår udkom nummeret? Tal sammen, men ${esc(name)} bestemmer. Tryk, hvor det hører hjemme.</p>
      ${timeline(H.tl[name], { slots: true, sel: H.slot })}
      <div class="btn-row"><button class="btn sm ghost" data-action="hit.replay">Hør igen</button><button class="btn sm ghost" data-action="hit.pause">Pause</button></div>
      ${UI.msg ? `<p class="warn">${esc(UI.msg)}</p>` : ''}`,
      footer: `<button class="btn" data-action="hit.lock" ${H.slot === null ? 'disabled' : ''}>Lås svar</button>` });
  }

  function renderReveal(){
    const r = H.res, name = who(), c = r.card, n = H.tl[name].length;
    const text = r.ok
      ? (r.won ? `${name} har ${H.goal} kort og vinder!` : `${name} beholder kortet og har nu ${n} af ${H.goal}.`)
      : (H.sips ? `${name} drikker ${sl(H.sips)}. Kortet er væk.` : 'Kortet er væk.');
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
      <p class="muted">${esc(name)} nåede ${H.goal} kort først. De andre drikker ${sl(WIN_SIPS)}.</p>
      ${timeline(H.tl[name], {})}`,
      footer: `<button class="btn" data-action="hit.start">Nyt spil</button><button class="btn ghost" data-action="hit.setup">Indstillinger</button>` });
  }

  /* ---------- spil ---------- */
  function start(){
    const p = App.players();
    if (p.length < 2 || pool().length < p.length + 10) return;
    clearRun();
    pauseQuiet();
    H = { phase: 'turn', players: p.slice(), idx: 0, round: 1, goal: S.goal, sips: S.sips, bonus: S.bonus, tl: {}, deck: App.shuffle(pool()), cur: null, slot: null, track: null, res: null };
    p.forEach(n => { H.tl[n] = [draw()]; });
    H.cur = draw();
    UI.msg = ''; UI.busy = '';
    saveRun(); App.render();
  }

  async function playTurn(){
    if (UI.busy) return;
    UI.busy = 'play'; UI.msg = ''; App.render();
    try {
      let tr = null;
      for (let i = 0; i < 4 && !tr; i++) {
        tr = await Spotify.findTrack(H.cur);
        if (!tr) H.cur = draw();   // numre, Spotify ikke har, springes over
      }
      if (!tr) throw new Error('Kunne ikke finde numre på Spotify. Prøv igen om lidt.');
      await playOnDevice(tr.uri);
      if (!H) return;
      H.track = { uri: tr.uri, img: tr.img };
      H.phase = 'place'; H.slot = null;
      saveRun();
      const upcoming = H.deck[H.deck.length - 1];
      if (upcoming) Spotify.findTrack(upcoming).catch(() => {});   // klar til næste tur
    } catch (e) { UI.msg = Spotify.explain(e); }
    UI.busy = '';
    App.render();
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
  App.on('hit.stop', () => { UI.testing = ''; played = true; pauseQuiet(); App.render(); });

  App.on('hit.step', el => {
    const k = el.dataset.key, d = Number(el.dataset.d);
    S[k] = k === 'goal' ? Math.min(15, Math.max(3, S[k] + d)) : Math.min(5, Math.max(0, S[k] + d));
    App.save(); App.render();
  });
  App.on('hit.seg', el => { S[el.dataset.key] = Number(el.dataset.v); App.save(); App.render(); });
  App.on('hit.toggle', el => { S[el.dataset.key] = el.checked; App.save(); App.render(); });

  App.on('hit.start', start);
  App.on('hit.resume', () => { H = SAVED; SAVED = null; UI.msg = ''; UI.busy = ''; App.render(); });
  App.on('hit.setup', () => { pauseQuiet(); H = null; SAVED = loadRun(); UI.msg = ''; UI.busy = ''; App.render(); });
  App.on('hit.play', playTurn);
  App.on('hit.slot', el => {
    if (!H || H.phase !== 'place') return;
    H.slot = Number(el.dataset.i);
    App.audio.click(); saveRun(); App.render();
  });
  App.on('hit.replay', async () => {
    if (!H || !H.track) return;
    UI.msg = '';
    try { await playOnDevice(H.track.uri); } catch (e) { UI.msg = Spotify.explain(e); App.render(); }
  });
  App.on('hit.pause', () => { played = true; pauseQuiet(); });
  App.on('hit.lock', () => {
    if (!H || H.phase !== 'place' || H.slot === null) return;
    const name = who(), tl = H.tl[name], c = H.cur, s = H.slot;
    /* Samme år som nabokortet tæller som rigtigt, uanset hvilken side */
    const ok = (s === 0 || tl[s - 1].y <= c.y) && (s === tl.length || c.y <= tl[s].y);
    if (ok) tl.splice(s, 0, c);
    H.res = { ok, card: c, at: s, img: H.track ? H.track.img : '', won: ok && tl.length >= H.goal };
    H.phase = 'reveal';
    if (ok) { App.audio.ding(); App.vibrate(80); } else { App.audio.buzz(); App.vibrate([120, 60, 120]); }
    saveRun(); App.render();
  });
  App.on('hit.next', () => {
    if (!H || H.phase !== 'reveal') return;
    pauseQuiet();
    if (H.res.won) {
      H.phase = 'win'; clearRun();
      App.audio.ding(); App.vibrate([100, 60, 100, 60, 300]);
      App.render(); return;
    }
    H.idx = (H.idx + 1) % H.players.length;
    if (H.idx === 0) H.round++;
    H.cur = draw(); H.slot = null; H.res = null; H.track = null; H.phase = 'turn';
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
