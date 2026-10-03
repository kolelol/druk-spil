/* Bombe: telefonen tikker. Sig et ord, der passer, og giv den videre. Den, der holder den, når den springer, drikker. */
(() => {
  const ID = 'bombe';
  const C = '#ff6a2a';
  const DEF = { mode: 'blandet', min: 10, max: 45, turns: true, accel: true };
  const { esc, ui } = App;
  let S = null;
  let B = null;
  const used = new Set();
  /* Bomben: bruges både som ikon på forsiden og stor på spilleskærmen (gnisten animeres i CSS) */
  const BOMB = `<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M31 13c1-6 6-8 10-5s6 1 6-2" fill="none" stroke="#0d1b3e" stroke-width="7" stroke-linecap="round"/>
    <path d="M31 13c1-6 6-8 10-5s6 1 6-2" fill="none" stroke="#e8c79a" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="30" cy="40" r="19" fill="#2f3656" stroke="#0d1b3e" stroke-width="3"/>
    <ellipse cx="23" cy="33" rx="6" ry="4" fill="#8b93bd" opacity=".9" transform="rotate(-35 23 33)"/>
    <rect x="24" y="12" width="14" height="11" rx="3" fill="#7c8299" stroke="#0d1b3e" stroke-width="3"/>
    <path class="spark" d="M47 0l2 4.2 4.6.6-3.4 3.2.9 4.6L47 10.4l-4.1 2.2.9-4.6-3.4-3.2 4.6-.6z" fill="#ffe14d" stroke="#ff8a1f" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`;

  App.register({
    id: ID, navn: 'Bombe', farve: C, ikon: BOMB,
    kort: 'Kategori eller scenarie: sig noget, der passer, og giv bomben videre. Den, der holder den, når den springer, drikker.',
    onEnter(){ S = App.gameSettings(ID, DEF); B = null; App.keepAwake(); },
    onLeave(){ stop(); },
    render
  });

  function pool(mode){
    const a = mode === 'scenarie' ? BOMBE_SCENARIER.slice() : BOMBE_CATEGORIES.slice();
    if (App.settings().adult) a.push(...(mode === 'scenarie' ? BOMBE_SCENARIER_ADULT : BOMBE_CATEGORIES_ADULT));
    return a;
  }
  /* Samme opgave kommer ikke igen, før alle i puljen har været brugt */
  function newPrompt(){
    let mode = S.mode;
    if (mode === 'blandet') mode = Math.random() < 0.5 ? 'kategori' : 'scenarie';
    const all = pool(mode);
    let left = all.filter(c => !used.has(c));
    if (!left.length) { all.forEach(c => used.delete(c)); left = all; }
    const c = App.pick(left); used.add(c);
    return { mode, text: c };
  }
  function holder(){ return B.turns ? B.players[B.idx % B.players.length] : null; }

  function render(){
    if (!B) return renderSetup();
    return B.phase === 'boom' ? renderBoom() : renderArmed();
  }

  function renderSetup(){
    const p = App.players();
    if (S.mode === 'bogstav') S.mode = 'blandet';   // gammel indstilling, bogstaver findes ikke længere
    const hint = S.mode === 'scenarie' ? 'Kom med et svar, der passer til situationen. Jo dummere, jo bedre. Ingen gentagelser.'
      : S.mode === 'kategori' ? 'Nævn noget, der passer til kategorien. Ingen gentagelser.'
      : 'Skiftevis kategorier og scenarier.';
    return ui.shell({ title: 'Bombe', color: C, body: `
      <div class="card"><p>Bomben tikker, men ingen ved hvor længe. Sig noget, der passer til opgaven, og giv telefonen videre. Den, der holder bomben, når den springer, drikker.</p></div>
      <div class="card">
        <div class="field">
          <div class="label">Opgave</div>
          ${ui.seg('bomb.seg', [{ v: 'kategori', l: 'Kategori' }, { v: 'scenarie', l: 'Scenarie' }, { v: 'blandet', l: 'Blandet' }], S.mode, 'mode')}
          <p class="hint">${hint}</p>
        </div>
        ${ui.range('Kortest tid', 'bomb.range', S.min, 'min', 5, 90, 'sek')}
        ${ui.range('Længst tid', 'bomb.range', S.max, 'max', 5, 120, 'sek')}
        ${ui.toggle('Tikker hurtigere til sidst', 'bomb.toggle', S.accel, 'accel')}
        ${ui.toggle('Brug spillerrækkefølge', 'bomb.toggle', S.turns, 'turns', p.length >= 2 ? 'Appen holder styr på, hvem der holder bomben' : 'Tilføj mindst 2 spillere for at bruge dette')}
      </div>`,
      footer: `<button class="btn" data-action="bomb.start">Tænd lunten</button>` });
  }

  function renderArmed(){
    const pr = B.prompt;
    const who = holder();
    return ui.shell({ title: 'Bombe', color: C, center: true, backAction: 'bomb.setup', body: `
      <div class="bomb">${BOMB}</div>
      <div class="label">${pr.mode === 'scenarie' ? 'Scenarie' : 'Kategori'}</div>
      <div class="big ${pr.text.length > 24 ? 'long' : ''}">${esc(pr.text)}</div>
      ${who ? `<p class="muted">Det er <b>${esc(App.gen(who))}</b> tur</p>` : '<p class="muted">Sig noget, og giv telefonen videre</p>'}
      <p class="muted small">Svar indtil nu: ${B.count}</p>`,
      footer: `<button class="btn" data-action="bomb.next">Sagt! Giv videre</button><button class="link" data-action="bomb.swap">Ny opgave (bomben tikker videre)</button>` });
  }

  function renderBoom(){
    const pr = B.prompt;
    const who = holder();
    return `<div class="screen boom" style="--accent:${C}">
      <main class="center">
        <div class="huge word">BOOM</div>
        <div class="big">${who ? esc(who) + ' drikker' : 'Den, der holder bomben, drikker'}</div>
        <p class="muted">${pr.mode === 'scenarie' ? 'Scenarie' : 'Kategori'}: ${esc(pr.text)}. Svar: ${B.count}.</p>
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
    App.render();
  }
  function scheduleTick(){
    if (!B || B.phase !== 'armed') return;
    const f = Math.min(1, (performance.now() - B.t0) / B.dur);
    const ms = S.accel ? 760 - 600 * f * f : 600;
    B.tickId = setTimeout(() => { App.audio.tick(); flash(); scheduleTick(); }, ms);
  }
  function flash(){
    const el = document.querySelector('.bomb');
    if (!el) return;
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
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
  App.on('bomb.seg', el => { S.mode = el.dataset.v; App.save(); App.render(); });
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
