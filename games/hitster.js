/* Hitster: hør numre over Spotify og gæt dem. Fire spiltyper:
   Klassisk: sæt nummeret på rette plads i din tidslinje. Først til målet vinder.
   Kasser:   gæt titel, kunstner og årstal. Dommeren sætter kryds, hvert kryds er et point.
   Klip:     hver spiller får sin egen sang og hører 0,1 sekund. Søg efter titlen. Skip eller forkert gæt skubber muren,
             og sangen kører videre. Scoren er, hvor mange sekunder man hørte (som Songspot og Songless, ejeren 2026-10-16).
   Streams og Klip kan også spilles alene mod sin egen rekord.
   Streams:  højere eller lavere. Har den nye sang flere eller færre streams end den forrige?
   Musikken afspilles af Spotify på en enhed, appen styrer (se spotify.js). */
(() => {
  const ID = 'hitster';
  const C = '#16c46b';
  const DEF = { mode: 'klassisk', goal: 8, from: 0, musik: 'alle', sips: 2, bonus: true, timer: 0, rounds: 3, ktimer: 0, songs: 10, lag: 0, hrounds: 5, diff: 'mellem', htimer: 0, device: null, kdiff: 'mellem', solo: 0, rec: {} };
  const RUN_KEY = 'drukspil.hitster.run';
  const BONUS = 2;      // slurke at dele ud for at kunne kunstner og titel (klassisk)
  const END_SIPS = 3;   // slurke: de andre drikker ved sejr i klassisk, taberen i kasser, klip og streams
  /* Klip: muren. Man hører sangen fra starten op til muren. Skip eller et forkert gæt skubber den et trin ud, og sangen
     kører videre derfra i stedet for at starte forfra. Scoren er, hvor langt muren stod, da man gættede den. */
  const WALLS = [0.1, 1, 5, 10, 15, 30];   // ejerens kæde (2026-10-17): hvert forkert svar rykker ét led op, efter 30 har man tabt
  const MISS = 40;          // klip: får man den ikke, tæller den som 40 sekunder
  const SOLO_SONGS = 10;    // klip alene: altid 10 sange, så rekorderne kan sammenlignes
  const KDIFF = [{ v: 'let', l: 'Let' }, { v: 'mellem', l: 'Mellem' }, { v: 'svaer', l: 'Svær' }, { v: 'ekspert', l: 'Ekspert' }, { v: 'umulig', l: 'Umulig' }];
  const KDIFF_TEXT = {
    let: 'De mest streamede sange. Dem kan alle.',
    mellem: 'Store hits, men ikke de allerstørste.',
    svaer: 'Kendte sange, man ikke hører hver dag.',
    ekspert: 'Mindre kendte sange. Her skal man kunne sin musik.',
    umulig: 'De mindst kendte sange i appen. Held og lykke.'
  };
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
    klip: 'Hver spiller får sin egen sang og hører 0,1 sekund. Gæt ved at søge efter titlen. Skip eller et forkert gæt skubber muren, og sangen kører videre. Din tid er, hvor meget du hørte. Laveste samlede tid vinder.',
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
      if (S.rec) Object.keys(S.rec).filter(k => k.startsWith('klip|')).forEach(k => { delete S.rec[k]; App.save(); });   // rekorder fra den gamle kæde
      App.keepAwake();
      if (Spotify.loggedIn() && !Spotify.blocked()) { refreshDevices(true); Spotify.silence().catch(() => {}); }   // find det stille nummer, så første pause ikke skal vente
    },
    onLeave(){ stopTimers(); pauseQuiet(); UI.testing = ''; },
    render
  });

  /* ---------- hjælpere ---------- */
  const sl = n => n === 1 ? '1 slurk' : n + ' slurke';
  const pt = n => n === 1 ? '1 point' : n + ' point';
  const r1 = x => Math.round(x * 10) / 10;
  const fmtSec = x => String(r1(x)).replace('.', ',') + ' s';      // 0,5 s
  const fmtScore = (mode, v) => mode === 'klip' ? fmtSec(v) : String(v);
  /* Alene: Streams og Klip kan spilles alene mod sin egen rekord (ejeren, 2026-10-16).
     Rekorden gælder for de valg, der gør spillet lettere eller sværere, så hver kombination har sin egen.
     I Streams er højest bedst (længste streak), i Klip er lavest bedst (kortest samlet tid). */
  const canSolo = m => m === 'streams' || m === 'klip';
  const isSolo = () => !!S.solo && canSolo(S.mode);
  const recKey = () => S.mode === 'streams' ? ['streams', S.diff, S.musik, S.from, S.htimer].join('|') : ['klip2', S.kdiff, S.musik, S.from].join('|');   // klip2: kæden blev ændret 2026-10-17, gamle tider kan ikke sammenlignes
  const recNow = () => { const v = (S.rec || {})[recKey()]; return typeof v === 'number' ? v : null; };
  const MUSIK_L = { alle: 'Alt', dk: 'Kun dansk', int: 'Uden dansk' };
  const DIFF_L = { let: 'Let', mellem: 'Mellem', svaer: 'Svær' };
  const KDIFF_L = Object.fromEntries(KDIFF.map(d => [d.v, d.l]));
  const recWhat = () => [S.mode === 'streams' ? DIFF_L[S.diff] : KDIFF_L[S.kdiff], MUSIK_L[S.musik], S.from ? S.from + '+' : 'alle år']
    .concat(S.mode === 'streams' ? [S.htimer ? S.htimer + ' sek' : 'ingen tid'] : []).join(' · ');
  /* Streams: rekorden gemmes, så snart den er slået (scoren stiger kun). Klip: først når alle sange er spillet. */
  function saveRecord(final){
    if (!H || !H.solo) return;
    const v = H.score[who()], lower = H.mode === 'klip';
    if (lower && !final) return;
    const better = b => b === null || (lower ? v < b : v > b);
    const stored = (S.rec || {})[H.key];
    if ((lower || v > 0) && better(typeof stored === 'number' ? stored : null)) { if (!S.rec) S.rec = {}; S.rec[H.key] = v; App.save(); }
    H.newRec = (lower || v > 0) && better(H.best);
  }
  /* Klip: sværhed efter hvor kendt sangen er (streams fra data/hitster-streams.js), som Songless og Songspot.
     Danske og udenlandske deles hver for sig i fem lige store dele, så de danske ikke alle havner i Umulig.
     Sange uden tal regnes for de mindst kendte, og blandt dem regnes de ældste for de sværeste. */
  function kpool(){
    const all = pool(), band = Math.max(0, KDIFF.findIndex(d => d.v === S.kdiff));
    const dk = new Set(HITSTER_SONGS_DK.map(x => x[0] + '|' + x[1]));
    const mio = c => HITSTER_STREAMS.mio[c.t + '|' + c.a] || 0;
    const part = list => {
      const sorted = list.slice().sort((x, y) => mio(y) - mio(x) || y.y - x.y);
      return sorted.slice(Math.floor(sorted.length * band / 5), Math.floor(sorted.length * (band + 1) / 5));
    };
    return part(all.filter(c => !dk.has(c.t + '|' + c.a))).concat(part(all.filter(c => dk.has(c.t + '|' + c.a))));
  }
  const deckSrc = mode => mode === 'streams' ? spool() : mode === 'klip' ? kpool() : pool();
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
    /* Alle træffere, så en kunstners sange står samlet (ejeren 2026-10-17), bedste først og ellers alfabetisk. Listen ruller. */
    return hits.sort((x, y) => x[0] - y[0] || x[1].t.localeCompare(y[1].t, 'da')).slice(0, 60).map(h => h[1]);
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
  /* Streams: sværheden stiger undervejs (ejeren 2026-10-17: "et hook" i starten, sværere jo længere man kommer).
     Vinduet er, hvor mange gange større den ene sangs tal må være end den andens: først langt fra hinanden, til sidst tæt.
     m0 er mindste afstand i starten, M1 største afstand til sidst. Alene: fuld sværhed efter hz sange. Sammen: i sidste runde. */
  const CURVE = { let: { hz: 16, m0: 3, M1: 1.5 }, mellem: { hz: 12, m0: 2.5, M1: 1.25 }, svaer: { hz: 8, m0: 2, M1: 1.1 } };
  function band(){
    const c = CURVE[H.diff] || CURVE.mellem;
    const p = Math.min(1, H.solo ? H.turn / c.hz : (H.round - 1) / Math.max(1, H.rounds - 1));
    return { lo: 1 + (c.m0 - 1) * Math.pow(1 - p, 1.5), hi: c.M1 * Math.pow(20 / c.M1, 1 - p) };
  }
  const DIFFS = [{ v: 'let', l: 'Let' }, { v: 'mellem', l: 'Mellem' }, { v: 'svaer', l: 'Svær' }];
  const DIFF_TEXT = {
    let: 'Starter nemt og bliver langsomt sværere. Sangene kommer aldrig helt tæt på hinanden.',
    mellem: 'Starter nemt og strammer til. Til sidst ligger sangene tæt.',
    svaer: 'Bliver hurtigt svært. Til sidst ligger sangene helt tæt.'
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
      if (r.mode === 'klip' && r.kv !== 3) return null;   // ældre Klip med point eller en anden kæde
      return r;
    } catch (e) { return null; }
  }
  /* Sange, der har været vist, sover, til appen lukkes helt (ejeren 2026-10-17: "de samme sange kommer meget hyppigt").
     Som Bombe: listen ligger i sessionStorage, som overlever en genindlæsning, men ikke en lukket app.
     Er der ikke flere vågne, bruges de sovende, ældst først. */
  const SEEN_KEY = 'drukspil.hitster.vist';
  let seen = [];
  try { seen = JSON.parse(sessionStorage.getItem(SEEN_KEY)) || []; } catch (e) { seen = []; }
  const sid = c => c.t + '|' + c.a;
  const isAwake = c => !seen.includes(sid(c));
  function markSeen(c){
    if (!c) return;
    const k = sid(c), i = seen.indexOf(k);
    if (i >= 0) seen.splice(i, 1);
    seen.push(k);
    try { sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) {}
  }
  /* Bunken trækkes fra enden: de vågne (blandet) ligger sidst, de sovende først med de ældste nærmest enden */
  function freshDeck(list){
    const rank = new Map(seen.map((k, i) => [k, i]));
    const awake = list.filter(c => !rank.has(sid(c)));
    const asleep = list.filter(c => rank.has(sid(c))).sort((a, b) => rank.get(sid(b)) - rank.get(sid(a)));
    return asleep.concat(App.shuffle(awake));
  }
  /* Næste nummer fra bunken. Er den tom, fyldes den med de numre, der ikke allerede er i spil. */
  function draw(){
    if (!H.deck.length) {
      const taken = new Set();
      Object.values(H.tl || {}).forEach(l => l.forEach(c => taken.add(sid(c))));
      [H.cur, H.champ].forEach(c => { if (c) taken.add(sid(c)); });
      const all = deckSrc(H.mode);
      let rest = all.filter(c => !taken.has(sid(c)));
      if (!rest.length) rest = all;
      H.deck = freshDeck(rest);
    }
    const c = H.deck.pop();
    markSeen(c);
    return c;
  }
  /* Streams: næste udfordrer. Kurven (band) bestemmer, hvor langt dens tal skal ligge fra sangen, der skal slås.
     Vågne sange først. To sange med samme tal giver intet rigtigt svar, så dem vælger vi aldrig. */
  function drawChallenger(){
    const { lo, hi } = band();
    if (H.deck.length < 25) {   // hold bunken fyldt, så der altid er sange i vinduet
      const skip = new Set([H.champ, H.cur].filter(Boolean).map(sid));
      H.deck = freshDeck(spool().filter(c => !skip.has(sid(c))));
    }
    const ratio = c => Math.max(c.s, H.champ.s) / Math.min(c.s, H.champ.s);
    const ok = H.deck.filter(c => c.s !== H.champ.s);
    const awake = ok.filter(isAwake);
    const from = awake.length >= 3 ? awake : ok;
    let near = from.filter(c => { const r = ratio(c); return r >= lo && r <= hi; });
    if (near.length < 3) {   // ingen i vinduet: tag de tre, der ligger nærmest midten af det
      const mid = Math.log(Math.sqrt(lo * hi));
      near = from.slice().sort((x, y) => Math.abs(Math.log(ratio(x)) - mid) - Math.abs(Math.log(ratio(y)) - mid)).slice(0, 3);
    }
    if (!near.length) return draw();
    const c = App.pick(near);
    H.deck.splice(H.deck.indexOf(c), 1);
    markSeen(c);
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
    if (r.solo) return r.mode === 'streams' ? `Alene, streak ${r.score[r.players[0]]}.` : `Alene, sang ${r.round} af ${r.rounds}.`;
    if (r.mode === 'kasser' || r.mode === 'streams' || r.mode === 'klip') return `${App.gen(r.players[r.idx])} tur, runde ${r.round} af ${r.rounds}.`;
    return `${App.gen(r.players[r.idx])} tur i runde ${r.round}.`;
  }

  function renderSetup(){
    const p = App.players();
    const solo = isSolo();
    const n = solo ? 1 : p.length;
    const src = deckSrc(S.mode);
    const enough = src.length >= n + 10;
    const ready = n >= (solo ? 1 : 2) && enough && (S.mode === 'streams' || (Spotify.loggedIn() && !!S.device));
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
      rules = (solo ? '' : ui.stepper('Runder', 'hit.step', S.hrounds, 'hrounds', 'Hver spiller gætter ' + S.hrounds + (S.hrounds === 1 ? ' gang' : ' gange'))
        + ui.stepper('Slurke ved forkert svar', 'hit.step', S.sips, 'sips'))
        + `<div class="field"><div class="label">Sværhed</div>${ui.seg('hit.seg', DIFFS, S.diff, 'diff')}
           <p class="hint">${DIFF_TEXT[S.diff]}</p></div>`
        + `<div class="field"><div class="label">Tid til at svare</div>${ui.seg('hit.seg', [{ v: 0, l: 'Ingen' }, { v: 5, l: '5 sek' }, { v: 10, l: '10 sek' }], S.htimer, 'htimer')}</div>`;
    } else {
      rules = `<div class="field"><div class="label">Sværhed</div>${ui.seg('hit.seg', KDIFF, S.kdiff, 'kdiff')}
           <p class="hint">${KDIFF_TEXT[S.kdiff]}</p></div>`
        + (solo ? '' : ui.stepper('Runder', 'hit.step', S.rounds, 'rounds', 'Hver spiller får ' + S.rounds + (S.rounds === 1 ? ' sang' : ' sange'))
        + ui.stepper('Slurke, hvis man ikke gætter den', 'hit.step', S.sips, 'sips'))
        + ui.stepper('Justér klip (ms)', 'hit.step', S.lag, 'lag', 'Hører I for lidt eller for meget af 0,1 sekund, så ret her. Spotify er lidt langsom, så prøv minus.')
        + `<div class="btn-row" style="margin:6px 0 4px"><button class="btn sm light" data-action="hit.testclip" ${UI.busy || !S.device ? 'disabled' : ''}>Test 0,1 sekund</button></div>`;
    }
    return ui.shell({ title: 'Hitster', color: C, body: `
      ${resume}
      <div class="card"><div class="label">Spiltype</div>
        ${ui.seg('hit.seg', MODES, S.mode, 'mode')}
        <p class="hint">${MODE_TEXT[S.mode]}</p>
        ${canSolo(S.mode) ? `<div style="margin-top:12px">${ui.seg('hit.seg', [{ v: 0, l: 'Sammen' }, { v: 1, l: 'Alene' }], solo ? 1 : 0, 'solo')}</div>` : ''}
      </div>
      ${spotifyCard()}
      ${solo ? soloCard() : `<div class="card">
        <div class="row-between">
          <div><div class="label">Spillere</div><div class="strong">${p.length ? esc(p.join(', ')) : 'Ingen endnu'}</div></div>
          <button class="btn sm ghost" data-action="go" data-to="players">Ret</button>
        </div>
        ${p.length < 2 ? `<p class="warn">Du skal bruge mindst 2 spillere.${canSolo(S.mode) ? ' Eller vælg Alene.' : ''}</p>` : ''}
      </div>`}
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

  /* Sværheden inde i spillet (ejeren 2026-10-17): man skal ikke ud i indstillingerne for at skifte */
  function diffBar(){
    const klip = (H ? H.mode : S.mode) === 'klip';
    return `<div class="diffbar">${ui.seg('hit.diffnow', klip ? KDIFF : DIFFS, klip ? S.kdiff : S.diff, klip ? 'kdiff' : 'diff')}</div>`;
  }
  /* Alene: rekorden for de valg, der er sat lige nu */
  function soloCard(){
    const best = recNow();
    return `<div class="card rec-card"><div class="label">Din rekord</div>
      <div class="rec-num sm">${best === null ? '-' : fmtScore(S.mode, best)}</div>
      <p>${S.mode === 'streams' ? 'Spil, til du svarer forkert. Rekorden er din længste streak.' : SOLO_SONGS + ' sange. Rekorden er din korteste samlede tid. Får du ikke en sang, tæller den ' + fmtSec(MISS) + '.'}</p>
      <p class="hint">Rekord for: ${esc(recWhat())}. Hver kombination har sin egen rekord.</p></div>`;
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
    const val = n => H.mode === 'klassisk' ? H.tl[n].length : fmtScore(H.mode, H.score[n]);
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

  /* Klip: din tid øverst, bjælken med muren, stor afspilknap og søgning nederst.
     Mens et klip spiller, og når muren skubbes, tegnes kun de dele om, der ændrer sig (paintClip, paintWall),
     så tastaturet ikke lukker midt i en søgning, og muren kan glide i stedet for at hoppe. */
  const cpos = t => Math.sqrt(t / WALLS[WALLS.length - 1]) * 100;   // kvadratrod, så de korte klip kan ses på bjælken
  const skipHtml = st => st >= WALLS.length - 1 ? 'Giv op' : 'Skip<small>' + fmtSec(WALLS[st + 1]) + '</small>';
  function noteHtml(){
    const name = who();
    if (H.wrong.length) return `<div class="cnote cwrong">${H.wrong.map(t => `<span>${esc(t)}</span>`).join('')}</div>`;
    return `<p class="cnote muted">${H.solo ? 'Hør så lidt, du tør. I alt: ' + fmtSec(H.score[name]) + '.' : 'Kun ' + esc(name) + ' gætter. Resten holder kæft.'}</p>`;
  }
  function renderClip(){
    const name = who(), st = H.stage, wall = WALLS[st];
    const marks = WALLS.slice(0, -1).map(t => `<i style="left:${cpos(t)}%"></i>`).join('');
    const cs = H.cstate === 'playing' || H.cstate === 'loading' ? H.cstate : '';
    const top = H.solo ? `Sang ${H.round} af ${H.rounds}` + (H.best !== null ? ' · rekord ' + fmtSec(H.best) : '')
      : `${esc(App.gen(name))} tur · sang ${H.round} af ${H.rounds}`;
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">${top}</div>
      ${diffBar()}
      <div class="worth"><small>Din tid</small><b>${fmtSec(wall)}</b></div>
      <div class="cbar-wrap">
        <div class="cbar" style="--to:${cpos(wall)}%">${marks}<span class="cfill"></span><span class="crun" style="width:${cpos(H.heard || 0)}%"></span></div>
        <span class="cwall" style="left:${cpos(wall)}%"></span>
        <span class="cnow" style="left:${cpos(wall)}%">${fmtSec(wall)}</span><span class="cend">${fmtSec(WALLS[WALLS.length - 1])}</span>
      </div>
      <div class="cplay-row">
        <button class="cplay ${cs}" data-action="hit.cplay" aria-label="${cs ? 'Stop' : 'Spil fra starten'}">${PLAY}${STOP}${RING}</button>
      </div>
      ${noteHtml()}
      ${msg()}`,
      footer: `<div class="csearch">
        <div class="sr-list">${results(H.q || '')}</div>
        <form class="input-row" data-form="hit.searchgo" autocomplete="off">
          <label class="csq">${LUPE}<input id="clip-q" data-input="hit.search" value="${esc(H.q || '')}" placeholder="Gæt sangen" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></label>
          <button type="button" class="btn sm ghost cskip" data-action="hit.skip">${skipHtml(st)}</button>
        </form>
      </div>` });
  }
  /* Muren er skubbet: opdatér tid, mur og Skip-knap på stedet */
  function paintWall(){
    const st = H.stage, wall = WALLS[st];
    const w = document.querySelector('.worth b'), bar = document.querySelector('.cbar'), mur = document.querySelector('.cwall'),
      now = document.querySelector('.cnow'), skip = document.querySelector('.cskip'), note = document.querySelector('.cnote');
    if (!w || !bar || !mur || !now || !skip || !note) { App.render(); return; }
    w.textContent = fmtSec(wall);
    w.classList.remove('bump'); void w.offsetWidth; w.classList.add('bump');
    bar.style.setProperty('--to', cpos(wall) + '%');
    mur.style.left = now.style.left = cpos(wall) + '%';
    now.textContent = fmtSec(wall);
    skip.innerHTML = skipHtml(st);
    note.outerHTML = noteHtml();
  }

  /* Streams: den forrige sang med tal øverst, udfordreren nederst. Efter gættet vises tallet på samme skærm. */
  function renderHL(){
    const name = who(), a = H.champ, b = H.cur, r = H.res;
    const card = (c, val, cls) => `<div class="hl-card ${cls}"><div class="hl-t">${esc(c.t)}</div><div class="hl-a">${esc(c.a)}</div><div class="hl-n">${val}</div></div>`;
    const num = c => fmtS(c.s) + ' <small>streams</small>';
    const top = card(a, num(a), '');
    if (!r) {
      return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
        <div class="label">${H.solo ? soloStreak() : `${esc(App.gen(name))} tur · ${H.round}/${H.rounds}`}</div>
        ${top}
        ${H.timer && H.deadline ? `<div class="hl-vs hl-time ${left() <= 3 ? 'done' : ''}">${left()}</div>` : '<div class="hl-vs">VS</div>'}
        ${card(b, '?', 'q')}
        <p class="muted">Flere eller færre streams?</p>
        ${H.track ? controls() : ''}${msg()}`,
        footer: `<div class="hl-btns"><button class="btn light" data-action="hit.hl" data-v="1">${UP}Flere</button><button class="btn danger" data-action="hit.hl" data-v="0">${DOWN}Færre</button></div>` });
    }
    const last = H.solo ? !r.ok : H.turn + 1 >= H.players.length * H.rounds;
    const text = H.solo
      ? (r.ok ? `Streak: ${H.score[name]}.` + (H.newRec && H.best !== null ? ' Ny rekord!' : '') : (r.timeout ? 'Tiden løb ud. ' : '') + `Din streak blev ${H.score[name]}.`)
      : r.ok ? `${name} får et point.` : (r.timeout ? 'Tiden løb ud. ' : '') + (H.sips ? `${name} drikker ${sl(H.sips)}.` : 'Ingen point.');
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">${r.ok ? 'Rigtigt' : 'Forkert'}</div>
      ${top}
      <div class="hl-vs">${b.s > a.s ? 'Flere' : b.s < a.s ? 'Færre' : 'Lige mange'}</div>
      ${card(b, num(b), r.ok ? 'ok' : 'no')}
      <p class="strong">${esc(text)}</p>
      ${H.solo ? '' : scoreboard()}${last ? '' : diffBar()}${msg()}`,
      footer: `<button class="btn" data-action="hit.hlnext">${last ? 'Se resultatet' : H.solo ? 'Næste sang' : 'Giv videre til ' + esc(nextName())}</button>` });
  }
  /* Streams alene: streaken og rekorden i toppen */
  function soloStreak(){
    const v = H.score[who()];
    return `Streak ${v}` + (H.best !== null && H.best > 0 ? (v > H.best ? ' · ny rekord' : ' · rekord ' + H.best) : '');
  }

  function renderReveal(){
    const r = H.res, c = r.card;
    if (H.mode === 'klip') {
      const name = who();
      const text = H.solo
        ? (r.ok ? `Du tog den på ${fmtSec(r.t)}. I alt: ${fmtSec(H.score[name])}.` : `Den fik du ikke, så den tæller ${fmtSec(MISS)}. I alt: ${fmtSec(H.score[name])}.`)
        : r.ok ? `${name} tog den på ${fmtSec(r.t)}.` : `${name} fik den ikke, så den tæller ${fmtSec(MISS)}.` + (H.sips ? ` ${name} drikker ${sl(H.sips)}.` : '');
      const last = H.turn + 1 >= H.players.length * H.rounds;
      return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
        <div class="reveal-box" style="--accent:${r.ok ? '#2fae57' : '#e0453a'}">
          <div class="label">${r.ok ? 'På ' + fmtSec(r.t) : 'Ikke gættet'}</div>
          ${r.img ? `<img class="cover" src="${esc(r.img)}" alt="">` : ''}
          <div class="big accent">${c.y}</div>
          <div class="strong">${esc(c.t)}</div>
          <p class="muted">${esc(c.a)}</p>
        </div>
        <p class="strong">${esc(text)}</p>
        ${H.solo ? '' : scoreboard()}${controls()}${msg()}`,
        footer: `<button class="btn" data-action="hit.next">${last ? 'Se resultatet' : H.solo ? 'Næste sang' : 'Giv videre til ' + esc(nextName())}</button>` });
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

  /* Slutstilling i kasser, klip og streams. I Klip er laveste tid bedst. */
  function renderEnd(){
    if (H.solo) return renderSoloEnd();
    const asc = H.mode === 'klip';
    const rank = H.players.slice().sort((a, b) => asc ? H.score[a] - H.score[b] : H.score[b] - H.score[a]);
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
      <div class="players" style="width:100%">${rank.map(n => `<div class="player-row">${ui.avatar(n)}<span class="name">${esc(n)}</span><b class="pts">${fmtScore(H.mode, H.score[n])}</b></div>`).join('')}</div>
      ${asc ? '<p class="hint">Laveste samlede tid vinder.</p>' : ''}
      ${H.mode === 'kasser' ? '' : diffBar()}`,
      footer: `<button class="btn" data-action="hit.start">Nyt spil</button><button class="btn ghost" data-action="hit.setup">Indstillinger</button>` });
  }

  /* Alene: resultatet mod rekorden */
  function renderSoloEnd(){
    const v = H.score[who()], best = H.best, k = H.mode;
    const unit = k === 'streams' ? (v === 1 ? 'rigtigt i træk' : 'rigtige i træk') : 'samlet tid, ' + H.rounds + ' sange';
    let note;
    if (H.newRec) note = best !== null ? `Den gamle rekord var ${fmtScore(k, best)}.` : 'Din første rekord. Nu skal den slås.';
    else if (best !== null) note = r1(v) === r1(best) ? `Præcis som din rekord på ${fmtScore(k, best)}.`
      : k === 'klip' ? `Din rekord er ${fmtSec(best)}. Du var ${fmtSec(v - best)} for langsom.` : `Din rekord er ${best}. Du manglede ${best - v}.`;
    else note = 'Ingen rekord endnu. Prøv igen.';
    return ui.shell({ title: 'Hitster', color: C, center: true, backAction: 'hit.setup', body: `
      <div class="label">${k === 'streams' ? 'Streams alene' : 'Klip alene'}</div>
      ${H.newRec ? '<div class="newrec">Ny rekord!</div>' : ''}
      <div class="rec-num">${fmtScore(k, v)}</div>
      <div class="rec-unit">${unit}</div>
      <p class="strong">${esc(note)}</p>
      <p class="hint">Rekord for: ${esc(H.what)}</p>
      ${diffBar()}
      ${recKey() !== H.key ? `<p class="hint">Prøv igen på ${esc(recWhat())}. ${recNow() === null ? 'Ingen rekord endnu.' : 'Rekord: ' + fmtScore(k, recNow())}</p>` : ''}`,
      footer: `<button class="btn" data-action="hit.start">Prøv igen</button><button class="btn ghost" data-action="hit.setup">Indstillinger</button>` });
  }

  /* ---------- spil ---------- */
  /* Slut på spillet. Alene: gem og fejr rekorden. */
  function endRun(){
    hush(); H.phase = 'end'; clearRun();
    if (H.solo) { saveRecord(true); if (H.newRec) App.vibrate([100, 60, 100, 60, 300]); }
    App.audio.ding(); App.render();
  }
  function start(){
    const solo = isSolo();
    const p = solo ? ['Du'] : App.players();
    const src = balance(deckSrc(S.mode));
    if (p.length < (solo ? 1 : 2) || src.length < p.length + 10) return;
    clearRun(); stopTimers(); hush();
    H = {
      mode: S.mode, phase: 'turn', players: p.slice(), idx: 0, round: 1, turn: 0, song: 1,
      goal: S.goal, sips: solo ? 0 : S.sips, bonus: S.bonus, rounds: solo ? (S.mode === 'klip' ? SOLO_SONGS : 0) : S.mode === 'streams' ? S.hrounds : S.rounds,
      solo, key: solo ? recKey() : '', best: solo ? recNow() : null, what: solo ? recWhat() : '', newRec: false, kv: 3, heard: 0,
      timer: S.mode === 'kasser' ? S.ktimer : S.mode === 'klassisk' ? S.timer : S.mode === 'streams' ? S.htimer : 0,
      diff: S.diff, tl: {}, score: {}, deck: freshDeck(src), cur: null, champ: null, track: null, res: null, last: null,
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

  /* Klip: spil fra "from" sekunder op til muren. 0 er fra starten; ellers kører sangen videre, hvor den slap. */
  let clipT0 = 0, clipP0 = 0, raf = 0;
  const clipPos = () => Math.min(WALLS[H.stage], clipP0 + (performance.now() - clipT0) / 1000);
  async function playClip(from){
    if (!H || H.phase !== 'clip' || H.cstate === 'playing' || H.cstate === 'loading') return;
    const song = H.cur;
    UI.msg = ''; H.cstate = 'loading'; paintClip();
    try {
      await ensureTrack();
      await playOnDevice(H.track.uri, Math.round((from || 0) * 1000));
      if (!H || H.phase !== 'clip' || H.cur !== song) return;
      if (H.cstate !== 'loading') { hush(); return; }   // stoppet, mens den hentede
      H.cstate = 'playing'; clipP0 = from || 0; clipT0 = performance.now();
      armStop(); paintClip(); loop();
    } catch (e) {
      if (H) { H.cstate = 'idle'; UI.msg = Spotify.explain(e); App.render(); }
    }
  }
  /* Stop ved muren. Skubbes muren, mens sangen spiller, flyttes kun stoppet, og sangen kører bare videre. */
  function armStop(){
    clearTimeout(clipTimer);
    const at = clipT0 + (WALLS[H.stage] - clipP0) * 1000 + S.lag;
    clipTimer = setTimeout(() => {
      clipTimer = null;
      if (!H || H.cstate !== 'playing') return;
      H.heard = Math.max(H.heard || 0, WALLS[H.stage]);
      hush(); H.cstate = 'idle'; saveRun(); paintClip();
    }, Math.max(40, at - performance.now()));
  }
  function stopClip(){
    clearTimeout(clipTimer); clipTimer = null;
    cancelAnimationFrame(raf); raf = 0;
    if (H && H.cstate === 'playing') { H.heard = Math.max(H.heard || 0, clipPos()); hush(); }
    if (H) H.cstate = 'idle';
  }
  /* Bjælken og ringen følger sangen, mens den spiller */
  function loop(){
    cancelAnimationFrame(raf);
    const step = () => {
      if (!H || H.phase !== 'clip' || H.cstate !== 'playing') { raf = 0; return; }
      const pos = clipPos(), wall = WALLS[H.stage];
      const run = document.querySelector('.crun'), ring = document.querySelector('.cplay .ring circle');
      if (run) run.style.width = cpos(Math.max(pos, H.heard || 0)) + '%';
      if (ring) ring.style.strokeDashoffset = String(100 - Math.min(1, pos / wall) * 100);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  /* Tegn kun knappen om, og vis hvor langt man har hørt */
  function paintClip(){
    const b = document.querySelector('.cplay');
    if (!b || !H) return;
    b.classList.remove('loading', 'playing');
    if (H.cstate === 'loading' || H.cstate === 'playing') b.classList.add(H.cstate);
    b.setAttribute('aria-label', H.cstate === 'idle' ? 'Spil fra starten' : 'Stop');
    if (H.cstate !== 'playing') {
      const run = document.querySelector('.crun'), ring = document.querySelector('.cplay .ring circle');
      if (run) run.style.width = cpos(H.heard || 0) + '%';
      if (ring) ring.style.strokeDashoffset = '100';
    }
  }
  /* Skip eller forkert gæt: muren skubbes et trin ud. Spiller sangen, kører den bare videre. Ellers fortsætter den,
     hvor man slap, og har man ikke hørt noget endnu, starter den fra begyndelsen. Efter sidste trin er det slut. */
  function pushWall(){
    if (H.stage >= WALLS.length - 1) { revealClip(false); return; }
    H.stage++; H.q = '';
    saveRun(); paintWall();
    if (H.cstate === 'playing') { armStop(); return; }
    if (H.cstate === 'loading') return;   // stoppet sættes efter den nye mur, når sangen er i gang
    const from = H.heard || 0;
    playClip(from < WALLS[H.stage] ? from : 0);
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
      setTimeout(() => { played = true; hush(); }, Math.max(40, WALLS[0] * 1000 + S.lag));
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
  App.on('hit.seg', el => { const k = el.dataset.key; S[k] = k === 'mode' || k === 'musik' || k === 'diff' || k === 'kdiff' ? el.dataset.v : Number(el.dataset.v); App.save(); App.render(); });
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
    if (ok) { H.score[who()]++; saveRecord(false); }
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
    if (H.solo ? !H.res.ok : H.turn >= H.players.length * H.rounds) { endRun(); return; }
    H.idx = H.turn % H.players.length;
    H.round = Math.floor(H.turn / H.players.length) + 1;
    H.champ = H.cur; H.cur = drawChallenger(); H.res = null; H.deadline = 0;
    UI.msg = '';
    saveRun(); startTimer(); App.render();
    playChallenger();
  });

  /* Sværhed skiftet inde i spillet. Alene: ny runde på den nye sværhed (rekorden er pr. sværhed).
     Sammen: gælder fra næste sang, og pointene bliver. Er den aktuelle Klip-sang urørt, byttes den med det samme. */
  App.on('hit.diffnow', el => {
    const k = el.dataset.key, v = el.dataset.v;
    if (S[k] === v) return;
    S[k] = v; App.save();
    const name = k === 'kdiff' ? KDIFF_L[v] : DIFF_L[v];
    if (!H || H.phase === 'end') { App.render(); return; }
    if (H.solo) { App.toast('Ny runde på ' + name); start(); return; }
    if (k === 'diff') H.diff = v;
    const taken = new Set([H.cur, H.champ].filter(Boolean).map(sid));
    H.deck = freshDeck(balance(deckSrc(H.mode)).filter(c => !taken.has(sid(c))));
    const swap = H.mode === 'klip' && H.phase === 'clip' && H.cstate === 'idle' && !H.heard && !H.wrong.length;
    if (swap) { H.cur = draw(); H.track = null; H.q = ''; }
    App.toast(swap ? 'Sværhed: ' + name : 'Sværhed: ' + name + ' fra næste sang');
    saveRun(); App.render();
  });
  /* Klip: den store knap spiller fra starten op til muren, eller stopper, hvis den spiller */
  App.on('hit.cplay', () => {
    if (!H || H.phase !== 'clip') return;
    if (H.cstate === 'playing' || H.cstate === 'loading') { stopClip(); saveRun(); paintClip(); return; }
    playClip(0);
  });
  /* Søgning: kun listen tegnes om, så tastaturet bliver oppe */
  App.on('hit.search', el => {
    if (!H || H.phase !== 'clip') return;
    H.q = el.value;
    const box = document.querySelector('.sr-list');
    if (box) box.innerHTML = results(H.q);
  });
  App.on('hit.searchgo', f => { const i = f.querySelector('input'); if (i) i.blur(); });
  /* Et gæt: rigtigt er samme titel (et cover med samme titel tæller også). Forkert skubber muren, og sangen kører videre. */
  App.on('hit.pick', el => {
    if (!H || H.phase !== 'clip') return;
    const t = el.dataset.t;
    if (norm(t) === norm(H.cur.t)) { revealClip(true); return; }
    if (!H.wrong.includes(t)) H.wrong.push(t);
    App.audio.buzz(); App.vibrate([120, 60, 120]);
    App.toast('Forkert: ' + t);
    const inp = document.getElementById('clip-q'), box = document.querySelector('.sr-list');
    if (inp) inp.value = '';
    if (box) box.innerHTML = '';
    pushWall();
  });
  App.on('hit.skip', () => { if (H && H.phase === 'clip') pushWall(); });
  /* Klip: tiden er, hvor langt muren stod. Svaret vises, og sangen kører videre, hvor den er (eller fortsætter, hvor man slap). */
  function revealClip(ok){
    const wasPlaying = H.cstate === 'playing';
    const pos = wasPlaying ? clipPos() : (H.heard || 0);
    clearTimeout(clipTimer); clipTimer = null; cancelAnimationFrame(raf); raf = 0;
    H.cstate = 'idle';
    const t = ok ? WALLS[H.stage] : MISS;
    H.score[who()] = r1(H.score[who()] + t);
    if (ok) { App.audio.ding(); App.vibrate([80, 40, 80]); } else { App.audio.buzz(); App.vibrate([120, 60, 120]); }
    H.res = { ok, t, stage: H.stage, card: H.cur, img: H.track ? H.track.img : '' };
    H.phase = 'reveal'; H.paused = false; H.q = '';
    saveRun(); App.render();
    if (wasPlaying) return;   // sangen spiller allerede, den kører bare videre
    (H.track ? Promise.resolve() : ensureTrack()).then(() => {
      if (!H || H.phase !== 'reveal' || !H.track) return;
      if (!H.res.img) { H.res.img = H.track.img; saveRun(); App.render(); }
      return playOnDevice(H.track.uri, Math.round(pos * 1000));
    }).catch(e => { UI.msg = Spotify.explain(e); App.render(); });
  }
  /* Tryk i resultatlisten må ikke tage fokus fra søgefeltet først (så flytter listen sig, før trykket lander) */
  document.addEventListener('mousedown', e => { if (e.target.closest && e.target.closest('.sr')) e.preventDefault(); });

  App.on('hit.next', () => {
    if (!H || H.phase !== 'reveal') return;
    stopTimers(); hush();
    if (H.mode === 'klip') {
      H.turn++;
      if (H.turn >= H.players.length * H.rounds) { endRun(); return; }
      H.idx = H.turn % H.players.length;
      H.round = Math.floor(H.turn / H.players.length) + 1;
      H.cur = draw(); H.track = null; H.res = null; H.stage = 0; H.cstate = 'idle'; H.wrong = []; H.q = ''; H.heard = 0; H.paused = false;
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
