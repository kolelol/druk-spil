/* Bombe: telefonen tikker. Nævn noget i kategorien, og giv den videre. Den, der holder den, når den springer, drikker.
   Jo længere lunten brænder, jo mere ryster bomben, og skærmen gløder rødt (klasserne heat1-3 på skærmen). */
(() => {
  const ID = 'bombe';
  const C = '#ff6a2a';
  const DEF = { min: 10, max: 45, turns: true, accel: true };
  const { esc, ui } = App;
  let S = null;
  let B = null;
  const used = new Set();
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
    kort: 'Nævn noget i kategorien, og giv bomben videre. Den, der holder den, når den springer, drikker.',
    onEnter(){ S = App.gameSettings(ID, DEF); B = null; App.keepAwake(); },
    onLeave(){ stop(); },
    render
  });

  function pool(){
    const a = BOMBE_CATEGORIES.slice();
    if (App.settings().adult) a.push(...BOMBE_CATEGORIES_ADULT);
    return a;
  }
  /* Samme kategori kommer ikke igen, før alle i puljen har været brugt */
  function newPrompt(){
    const all = pool();
    let left = all.filter(c => !used.has(c));
    if (!left.length) { all.forEach(c => used.delete(c)); left = all; }
    const c = App.pick(left); used.add(c);
    return c;
  }
  function holder(){ return B.turns ? B.players[B.idx % B.players.length] : null; }
  /* Hvor langt lunten er brændt, 0 til 1 */
  const burnt = () => Math.min(1, (performance.now() - B.t0) / B.dur);
  const heatClass = f => f < 0.45 ? '' : f < 0.7 ? 'heat1' : f < 0.88 ? 'heat2' : 'heat3';

  function render(){
    if (!B) return renderSetup();
    return B.phase === 'boom' ? renderBoom() : renderArmed();
  }

  function renderSetup(){
    const p = App.players();
    if ('mode' in S) { delete S.mode; App.save(); }   // gammel indstilling fra dengang der var scenarier
    return ui.shell({ title: 'Bombe', color: C, body: `
      <div class="card"><p>Bomben tikker, men ingen ved hvor længe. Nævn noget, der passer til kategorien, og giv telefonen videre. Ingen gentagelser. Den, der holder bomben, når den springer, drikker.</p></div>
      <div class="card">
        ${ui.range('Kortest tid', 'bomb.range', S.min, 'min', 5, 90, 'sek')}
        ${ui.range('Længst tid', 'bomb.range', S.max, 'max', 5, 120, 'sek')}
        ${ui.toggle('Tikker hurtigere til sidst', 'bomb.toggle', S.accel, 'accel')}
        ${ui.toggle('Brug spillerrækkefølge', 'bomb.toggle', S.turns, 'turns', p.length >= 2 ? 'Appen holder styr på, hvem der holder bomben' : 'Tilføj mindst 2 spillere for at bruge dette')}
      </div>`,
      footer: `<button class="btn" data-action="bomb.start">Tænd lunten</button>` });
  }

  function renderArmed(){
    const who = holder();
    const html = ui.shell({ title: 'Bombe', color: C, center: true, backAction: 'bomb.setup', body: `
      ${STAGE}
      <div class="label">Kategori</div>
      <div class="big ${B.prompt.length > 24 ? 'long' : ''}">${esc(B.prompt)}</div>
      ${who ? `<p class="muted">Det er <b>${esc(App.gen(who))}</b> tur</p>` : '<p class="muted">Sig noget, og giv telefonen videre</p>'}
      <p class="muted small">Svar indtil nu: ${B.count}</p>`,
      footer: `<button class="btn" data-action="bomb.next">Sagt! Giv videre</button><button class="link" data-action="bomb.swap">Ny kategori (bomben tikker videre)</button>` });
    return html.replace('class="screen"', `class="screen armed ${heatClass(burnt())}"`);
  }

  /* Eksplosionen: lysglimt, trykbølge, stumper af bomben, der flyver ud, og gløder, der falder */
  function renderBoom(){
    const who = holder();
    const shards = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const d = 150 + Math.random() * 220;
      return `<i style="--x:${Math.round(Math.cos(a) * d)}px;--y:${Math.round(Math.sin(a) * d + 70)}px;--r:${Math.round(360 + Math.random() * 540)}deg;--s:${(0.6 + Math.random()).toFixed(2)};--t:${(Math.random() * 0.08).toFixed(2)}s"></i>`;
    }).join('');
    const embers = Array.from({ length: 22 }, () => {
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 260;
      return `<i style="--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d * 0.7 + 180)}px;--dl:${(Math.random() * 0.25).toFixed(2)}s;--dur:${(0.9 + Math.random() * 0.9).toFixed(2)}s"></i>`;
    }).join('');
    return `<div class="screen boom" style="--accent:${C}">
      <div class="flash"></div><div class="wave"></div><div class="wave w2"></div>
      <div class="shards">${shards}</div><div class="embers">${embers}</div>
      <main class="center">
        <div class="huge word">BOOM</div>
        <div class="big">${who ? esc(who) + ' drikker' : 'Den, der holder bomben, drikker'}</div>
        <p class="muted">Kategori: ${esc(B.prompt)}. Svar: ${B.count}.</p>
      </main>
      <div class="footer">
        <button class="btn light" data-action="bomb.again">Ny runde</button>
        <button class="btn ghost-light" data-action="bomb.setup">Indstillinger</button>
      </div>
    </div>`;
  }

  /* ---------- tid ---------- */
  function start(startIdx){
    stop();
    const p = App.players();
    const dur = App.rand(S.min * 1000, S.max * 1000);
    B = { phase: 'armed', prompt: newPrompt(), turns: S.turns && p.length >= 2, players: p.slice(), idx: startIdx || 0, count: 0, t0: performance.now(), dur, boomId: null, tickId: null };
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
  App.on('bomb.start', () => start(0));
  App.on('bomb.again', () => start(B ? B.idx % Math.max(1, B.players.length) : 0));
  App.on('bomb.setup', () => { stop(); B = null; App.render(); });
  App.on('bomb.next', () => {
    if (!B || B.phase !== 'armed') return;
    B.count++;
    if (B.turns) B.idx = (B.idx + 1) % B.players.length;
    App.audio.click();
    App.render();
  });
  App.on('bomb.swap', () => {
    if (!B || B.phase !== 'armed') return;
    B.prompt = newPrompt();
    App.render();
  });
})();
