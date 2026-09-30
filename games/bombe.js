/* Bombe: telefonen tikker. Sig et ord, der passer, og giv den videre. Den, der holder den, når den springer, drikker. */
(() => {
  const ID = 'bombe';
  const C = '#ff6a2a';
  const DEF = { mode: 'kategori', min: 10, max: 45, turns: true, accel: true };
  const { esc, ui } = App;
  let S = null;
  let B = null;
  const used = new Set();

  App.register({
    id: ID, navn: 'Bombe', farve: C,
    kort: 'Sig et ord i kategorien, og giv bomben videre. Den, der holder den, når den springer, drikker.',
    onEnter(){ S = App.gameSettings(ID, DEF); B = null; App.keepAwake(); },
    onLeave(){ stop(); },
    render
  });

  function cats(){
    const a = BOMBE_CATEGORIES.slice();
    if (App.settings().adult) a.push(...BOMBE_CATEGORIES_ADULT);
    return a;
  }
  function newPrompt(){
    let mode = S.mode;
    if (mode === 'blandet') mode = Math.random() < 0.5 ? 'kategori' : 'bogstav';
    if (mode === 'bogstav') return { mode, text: App.pick(BOMBE_LETTERS) };
    let pool = cats().filter(c => !used.has(c));
    if (!pool.length) { used.clear(); pool = cats(); }
    const c = App.pick(pool); used.add(c);
    return { mode, text: c };
  }
  function holder(){ return B.turns ? B.players[B.idx % B.players.length] : null; }

  function render(){
    if (!B) return renderSetup();
    return B.phase === 'boom' ? renderBoom() : renderArmed();
  }

  function renderSetup(){
    const p = App.players();
    const hint = S.mode === 'bogstav' ? 'Sig et ord, der starter med bogstavet.'
      : S.mode === 'kategori' ? 'Sig noget, der passer til kategorien. Ingen gentagelser.'
      : 'Skiftevis kategori og bogstav.';
    return ui.shell({ title: 'Bombe', color: C, body: `
      <div class="card"><p>Bomben tikker, men ingen ved hvor længe. Sig et ord, der passer til opgaven, og giv telefonen videre. Den, der holder bomben, når den springer, drikker.</p></div>
      <div class="card">
        <div class="field">
          <div class="label">Opgave</div>
          ${ui.seg('bomb.seg', [{ v: 'kategori', l: 'Kategori' }, { v: 'bogstav', l: 'Bogstav' }, { v: 'blandet', l: 'Blandet' }], S.mode, 'mode')}
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
      <div class="bomb"><i></i></div>
      <div class="label">${pr.mode === 'bogstav' ? 'Ord der starter med' : 'Kategori'}</div>
      <div class="${pr.mode === 'bogstav' ? 'huge' : 'big'}">${esc(pr.text)}</div>
      ${who ? `<p class="muted">Det er <b>${esc(App.gen(who))}</b> tur</p>` : '<p class="muted">Sig et ord, og giv telefonen videre</p>'}
      <p class="muted small">Ord sagt: ${B.count}</p>`,
      footer: `<button class="btn" data-action="bomb.next">Sagt! Giv videre</button><button class="link" data-action="bomb.swap">Ny opgave (bomben tikker videre)</button>` });
  }

  function renderBoom(){
    const pr = B.prompt;
    const who = holder();
    return `<div class="screen boom" style="--accent:${C}">
      <main class="center">
        <div class="huge word">BOOM</div>
        <div class="big">${who ? esc(who) + ' drikker' : 'Den, der holder bomben, drikker'}</div>
        <p class="muted">${pr.mode === 'bogstav' ? 'Bogstav' : 'Kategori'}: ${esc(pr.text)}. Ord sagt: ${B.count}.</p>
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
      if (inp !== el) inp.value = S[key];
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
