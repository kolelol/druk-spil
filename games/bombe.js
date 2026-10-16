/* Bombe: telefonen tikker. Nævn noget i kategorien, og giv den videre. Den, der holder den, når den springer, drikker.
   Så få tryk som muligt (ejeren: "for mange tryk på skærmen"): et tryk på Bombe på forsiden tænder lunten med det samme,
   der er ingen knapper, mens den tikker, og et tryk hvor som helst på eksplosionen starter næste runde.
   Indstillinger ligger bag et lille link på eksplosionsskærmen.
   Jo længere lunten brænder, jo mere ryster bomben, og skærmen gløder rødt (klasserne heat1-3 på skærmen). */
(() => {
  const ID = 'bombe';
  const C = '#ff6a2a';
  const DEF = { min: 10, max: 45, accel: true };
  const { esc, ui } = App;
  let S = null;
  let B = null;
  /* Kategorier, der har været vist, sover, til appen lukkes helt (ejeren, 2026-10-16). sessionStorage overlever en
     genindlæsning, men ikke en lukket app. Først når alle har været vist, vågner de ældste igen; de 15 seneste sover videre. */
  const SLEEP_KEY = 'drukspil.bombe.vist';
  const KEEP_ASLEEP = 15;
  let shown = [];
  try { shown = JSON.parse(sessionStorage.getItem(SLEEP_KEY)) || []; } catch (e) { shown = []; }
  let lastTema = null;
  /* Bomben: ikon på forsiden og stor på spilleskærmen. Gnisten og røgen animeres i CSS. */
  const BOMB = `<svg viewBox="0 0 64 64" aria-hidden="true">
    <path class="fuse" d="M31 13c1-6 6-8 10-5s6 1 6-2" fill="none" stroke="#0d1b3e" stroke-width="7" stroke-linecap="round"/>
    <path class="fuse" d="M31 13c1-6 6-8 10-5s6 1 6-2" fill="none" stroke="#e8c79a" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="30" cy="40" r="19" fill="#2f3656" stroke="#0d1b3e" stroke-width="3"/>
    <ellipse cx="23" cy="33" rx="6" ry="4" fill="#8b93bd" opacity=".9" transform="rotate(-35 23 33)"/>
    <rect x="24" y="12" width="14" height="11" rx="3" fill="#7c8299" stroke="#0d1b3e" stroke-width="3"/>
    <path class="spark" d="M47 0l2 4.2 4.6.6-3.4 3.2.9 4.6L47 10.4l-4.1 2.2.9-4.6-3.4-3.2 4.6-.6z" fill="#ffe14d" stroke="#ff8a1f" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`;
  const STAGE = `<div class="bomb-stage"><div class="bomb">${BOMB}</div><div class="smoke"><i></i><i></i><i></i><i></i></div></div>`;

  App.register({
    id: ID, navn: 'Bombe', farve: C, ikon: BOMB,
    kort: 'Tryk, og bomben tikker. Nævn noget i kategorien, og giv telefonen videre. Den, der holder den, når den springer, drikker.',
    onEnter(){ S = App.gameSettings(ID, DEF); App.keepAwake(); start(); },
    onLeave(){ stop(); B = null; },
    render
  });

  /* Ingen frække kategorier i Bombe: ejeren tog dem ud (2026-10-16) */
  function themes(){
    return BOMBE_CATEGORIES.filter(g => g.ord.length).map(g => ({ tema: g.tema, ord: g.ord }));
  }
  /* Næste kategori: aldrig én, der sover, og aldrig samme tema to gange i træk.
     Hver vågen kategori har samme chance, så små temaer ikke bliver brugt op først. Har ét tema over halvdelen af de
     vågne tilbage, tages det, så listen ikke ender med kun ét tema, der ville komme flere gange i træk. */
  function newPrompt(){
    const all = themes();
    const valid = new Set(all.flatMap(g => g.ord));
    shown = shown.filter(c => valid.has(c));
    const awake = () => all.flatMap(g => g.ord.filter(c => !shown.includes(c)).map(c => ({ c, tema: g.tema })));
    let free = awake();
    if (!free.length) { shown = shown.slice(-Math.min(KEEP_ASLEEP, valid.size - 1)); free = awake(); }
    const count = {};
    free.forEach(f => { count[f.tema] = (count[f.tema] || 0) + 1; });
    const big = Object.keys(count).find(t => t !== lastTema && count[t] * 2 > free.length);
    const other = free.filter(f => big ? f.tema === big : f.tema !== lastTema);
    const pick = App.pick(other.length ? other : free);
    shown.push(pick.c); lastTema = pick.tema;
    try { sessionStorage.setItem(SLEEP_KEY, JSON.stringify(shown)); } catch (e) {}
    return pick.c;
  }
  /* Hvor langt lunten er brændt, 0 til 1 */
  const burnt = () => Math.min(1, (performance.now() - B.t0) / B.dur);
  const heatClass = f => f < 0.45 ? '' : f < 0.7 ? 'heat1' : f < 0.88 ? 'heat2' : 'heat3';

  function render(){
    if (!B) return renderSetup();
    return B.phase === 'boom' ? renderBoom() : renderArmed();
  }

  function renderSetup(){
    for (const k of ['mode', 'turns']) if (k in S) { delete S[k]; App.save(); }   // gamle indstillinger
    return ui.shell({ title: 'Bombe', color: C, body: `
      <div class="card"><p>Bomben tikker, men ingen ved hvor længe. Nævn noget, der passer til kategorien, og giv telefonen videre. Ingen gentagelser. Den, der holder bomben, når den springer, drikker.</p></div>
      <div class="card">
        ${ui.range('Kortest tid', 'bomb.range', S.min, 'min', 5, 90, 'sek')}
        ${ui.range('Længst tid', 'bomb.range', S.max, 'max', 5, 120, 'sek')}
        ${ui.toggle('Tikker hurtigere til sidst', 'bomb.toggle', S.accel, 'accel')}
      </div>`,
      footer: `<button class="btn" data-action="bomb.again">Tænd lunten</button>` });
  }

  function renderArmed(){
    const html = ui.shell({ title: 'Bombe', color: C, center: true, backAction: 'bomb.back', body: `
      ${STAGE}
      <div class="label">Kategori</div>
      <div class="big ${B.prompt.length > 24 ? 'long' : ''}">${esc(B.prompt)}</div>
      <p class="muted">Sig noget, og giv telefonen videre. Ingen gentagelser.</p>`,
      footer: B.swapped ? '' : `<button class="link" data-action="bomb.swap">Ny kategori (én gang pr. runde)</button>` });
    return html.replace('class="screen"', `class="screen armed ${heatClass(burnt())}"`);
  }

  /* Eksplosionen: lysglimt, trykbølge, stumper af bomben, der flyver ud, og gløder, der falder. Hele skærmen er knappen til næste runde. */
  function renderBoom(){
    const shards = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const d = 150 + Math.random() * 220;
      return `<i style="--x:${Math.round(Math.cos(a) * d)}px;--y:${Math.round(Math.sin(a) * d + 70)}px;--r:${Math.round(360 + Math.random() * 540)}deg;--s:${(0.6 + Math.random()).toFixed(2)};--t:${(Math.random() * 0.08).toFixed(2)}s"></i>`;
    }).join('');
    const embers = Array.from({ length: 22 }, () => {
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 260;
      return `<i style="--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d * 0.7 + 180)}px;--dl:${(Math.random() * 0.25).toFixed(2)}s;--dur:${(0.9 + Math.random() * 0.9).toFixed(2)}s"></i>`;
    }).join('');
    return `<div class="screen boom" style="--accent:${C}" data-action="bomb.again">
      <div class="flash"></div><div class="wave"></div><div class="wave w2"></div>
      <div class="shards">${shards}</div><div class="embers">${embers}</div>
      <button class="back boom-back" data-action="go" data-to="home" aria-label="Til forsiden">${App.icons.back}</button>
      <main class="center">
        <div class="huge word">BOOM</div>
        <div class="big">Den, der holder bomben, drikker</div>
        <p class="muted">Kategori: ${esc(B.prompt)}</p>
      </main>
      <div class="footer">
        <p class="muted tap">Tryk hvor som helst for næste runde</p>
        <button class="link" data-action="bomb.setup">Indstillinger</button>
      </div>
    </div>`;
  }

  /* ---------- tid ---------- */
  function start(){
    stop();
    const dur = App.rand(S.min * 1000, S.max * 1000);
    B = { phase: 'armed', prompt: newPrompt(), t0: performance.now(), dur, boomId: null, tickId: null };
    B.boomId = setTimeout(boom, dur);
    scheduleTick();
    App.render(true);
  }
  function scheduleTick(){
    if (!B || B.phase !== 'armed') return;
    const f = burnt();
    const ms = S.accel ? 760 - 600 * f * f : 600;
    B.tickId = setTimeout(() => { App.audio.tick(); flash(); scheduleTick(); }, ms);
  }
  /* Et tik: bomben hopper, og skærmen får mere varme, jo længere lunten er brændt */
  function flash(){
    const el = document.querySelector('.bomb');
    if (!el) return;
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
    const sc = document.querySelector('.screen.armed');
    if (sc) { sc.classList.remove('heat1', 'heat2', 'heat3'); const h = heatClass(burnt()); if (h) sc.classList.add(h); }
  }
  function boom(){
    if (!B || B.phase !== 'armed') return;
    clearTimeout(B.tickId);
    B.phase = 'boom';
    App.audio.boom();
    App.vibrate([300, 100, 600]);
    App.render();
  }
  function stop(){
    if (!B) return;
    clearTimeout(B.boomId); clearTimeout(B.tickId);
    B.boomId = null; B.tickId = null;
  }

  /* ---------- knapper ---------- */
  App.on('bomb.toggle', el => { S[el.dataset.key] = el.checked; App.save(); });
  App.on('bomb.range', el => {
    const k = el.dataset.key; const v = Number(el.value);
    S[k] = v;
    if (k === 'min' && S.max < v) S.max = v;
    if (k === 'max' && S.min > v) S.min = v;
    App.save();
    document.querySelectorAll('input[data-input="bomb.range"]').forEach(inp => {
      const key = inp.dataset.key;
      if (inp !== el) { inp.value = S[key]; App.ui.syncRange(inp); }
      const b = inp.parentElement.querySelector('.range-head b');
      if (b) b.textContent = S[key] + ' sek';
    });
  });
  App.on('bomb.again', start);
  App.on('bomb.setup', () => { stop(); B = null; App.render(); });
  App.on('bomb.swap', () => {
    if (!B || B.phase !== 'armed' || B.swapped) return;
    B.prompt = newPrompt(); B.swapped = true;
    App.render();
  });
  /* Mens bomben tikker, kræver tilbage-pilen to tryk, så den, der holder bomben, ikke bare kan stikke af */
  let backArmed = 0;
  App.on('bomb.back', () => {
    if (B && B.phase === 'armed' && Date.now() - backArmed > 2500) { backArmed = Date.now(); App.toast('Tryk igen for at stoppe bomben'); return; }
    backArmed = 0; App.go('home');
  });
})();
