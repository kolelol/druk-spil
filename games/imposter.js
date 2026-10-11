/* Imposter, den rene udgave: alle får det samme ord, imposteren får intet. Telefonen går på omgang,
   alle siger ét ord på skift, I stemmer én gang, og imposteren får ét gæt, hvis han bliver taget.
   Ingen indstillinger: ejeren og vennerne vil have den version, alle kender. */
(() => {
  const ID = 'imposter';
  const C = '#b14cff';
  const { esc, ui } = App;
  let R = null;     // igangværende runde
  const used = new Set();
  /* Hætteklædt skikkelse med lysende øjne */
  const IKON = `<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 4C19 4 10 15 10 30c0 9 3 17 7 29h30c4-12 7-20 7-29C54 15 45 4 32 4z" fill="#a057ff" stroke="#0d1b3e" stroke-width="3" stroke-linejoin="round"/>
    <path d="M32 16c-8 0-14 7-14 16 0 9 6 16 14 16s14-7 14-16c0-9-6-16-14-16z" fill="#1a0c33" stroke="#0d1b3e" stroke-width="2.5"/>
    <path d="M17 27c1-8 6-14 13-16" fill="none" stroke="#dcbfff" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M22 30l9 3-1 4-8-2z" fill="#ffe14d"/><path d="M42 30l-9 3 1 4 8-2z" fill="#ffe14d"/>
  </svg>`;

  App.register({
    id: ID, navn: 'Imposter', farve: C, ikon: IKON,
    kort: 'Alle får det samme hemmelige ord, undtagen én. Sig ét ord på skift, og find imposteren.',
    onEnter(){ R = null; App.keepAwake(); },
    render
  });

  /* Alle ord fra alle kategorier (frække kun med "Frækt indhold" slået til) */
  function words(){
    const out = new Set();
    IMPOSTER_WORDS.filter(c => !c.adult || App.settings().adult).forEach(c => c.ord.forEach(w => out.add(w)));
    return [...out];
  }

  function render(){
    if (!R) return renderSetup();
    return PHASES[R.phase]();
  }

  function renderSetup(){
    const p = App.players();
    const n = p.length;
    return ui.shell({ title: 'Imposter', color: C, body: `
      <div class="card">
        <div class="label">Bordplan</div>
        ${n >= 3 ? ui.table(p, { sm: true, start: App.holder() }) : '<p class="warn">Du skal bruge mindst 3 spillere.</p>'}
        <div class="btn-row"><button class="btn sm ghost" data-action="go" data-to="players">Spillere</button>${n >= 3 ? '<button class="btn sm ghost" data-action="seats.open">Sæt pladser</button>' : ''}</div>
        ${n >= 3 ? `<p class="hint" style="text-align:center">Telefonen går rundt om bordet. ${esc(App.holder())} starter med at se sit ord.</p>` : ''}
      </div>
      <div class="card">
        <div class="label">Sådan spiller I</div>
        <p>Alle ser det samme ord på skift. Én af jer er imposter og får ikke ordet. Sig ét ord, der passer til jeres ord, rundt om bordet. Vær ikke for tydelig, imposteren lytter med. Så stemmer I.</p>
        <p>Rammer I imposteren, må imposteren gætte ordet: rigtigt, og alle andre drikker. Forkert, og imposteren drikker. Rammer I forkert, drikker den, I ramte, og imposteren slap.</p>
      </div>`,
      footer: `<button class="btn" data-action="imp.start" ${n >= 3 ? '' : 'disabled'}>Start runde</button>` });
  }

  const PHASES = {
    pass(){
      const name = R.order[R.idx];
      const first = R.idx === 0;
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: `
        <div class="label">Spiller ${R.idx + 1} af ${R.order.length}</div>
        <p class="muted">${first ? 'Telefonen starter hos' : 'Giv telefonen videre til'}</p>
        <div class="big">${esc(name)}</div>
        ${ui.table(R.order, { sm: true, cur: name, done: R.order.slice(0, R.idx), pick: first ? 'imp.from' : '' })}
        <p class="muted small">${first ? 'Har en anden telefonen? Tryk på dem.' : 'Kun ' + esc(name) + ' må se den næste skærm.'}</p>`,
        footer: `<button class="btn" data-action="imp.reveal">Vis mit ord</button>` });
    },
    reveal(){
      const name = R.order[R.idx];
      /* Begge kort har samme form og farve, så ingen kan se forskel på afstand */
      const inner = name === R.imposter
        ? `<div class="reveal-box same"><div class="label">${esc(name)}</div><div class="big accent">Du er imposter</div>
            <p class="muted">Du kender ikke ordet. Lyt godt efter, og lad som om du gør.</p></div>`
        : `<div class="reveal-box same"><div class="label">${esc(name)}, dit ord er</div><div class="big">${esc(R.word)}</div>
            <p class="muted">Husk det, og hold det for dig selv.</p></div>`;
      const last = R.idx === R.order.length - 1;
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: inner,
        footer: `<button class="btn" data-action="imp.hide">${last ? 'Skjul. Alle har set' : 'Skjul og giv videre'}</button>` });
    },
    discuss(){
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: `
        <div class="label">Alle har set deres ord</div>
        <div class="big">${esc(R.starter)} starter</div>
        ${ui.table(R.order, { sm: true, start: R.starter, cur: R.starter })}
        <p class="muted">Sig ét ord på skift, samme vej rundt som telefonen gik. Tag en runde eller to, og stem så.</p>`,
        footer: `<button class="btn" data-action="imp.tovote">Gå til afstemning</button>` });
    },
    vote(){
      return ui.shell({ title: 'Imposter', color: C, backAction: 'imp.setup', body: `
        <div class="label">Afstemning</div>
        <h2>Hvem er imposteren?</h2>
        <p class="muted">Tal sammen, peg, og tryk på navnet.</p>
        <div class="vote-grid">${R.order.map(n => `<button class="btn ghost" data-action="imp.voteout" data-name="${esc(n)}">${esc(n)}</button>`).join('')}</div>` });
    },
    caught(){
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: `
        <div class="big accent">${esc(R.imposter)} var imposter</div>
        <p class="muted">Sidste chance: ${esc(R.imposter)} gætter ordet højt. Rigtigt: alle andre drikker 2 slurke. Forkert: ${esc(R.imposter)} drikker 4.</p>`,
        footer: `<button class="btn" data-action="imp.guess" data-ok="1">Rigtigt gæt</button><button class="btn ghost" data-action="imp.guess" data-ok="0">Forkert gæt</button>` });
    },
    end(){
      const r = R.result;
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: `
        <div class="big ${r.impWon ? '' : 'accent'}">${esc(r.title)}</div>
        <p class="muted">${esc(r.text)}</p>
        <div class="reveal-box same"><div class="label">Ordet var</div><div class="big">${esc(R.word)}</div>
          <p class="muted">Imposter: <b>${esc(R.imposter)}</b></p></div>`,
        footer: `<button class="btn" data-action="imp.start">Ny runde</button><button class="btn ghost" data-action="imp.setup">Spillere</button>` });
    }
  };

  /* ---------- runde ---------- */
  function start(){
    const players = App.players();
    if (players.length < 3) { R = null; App.render(); return; }
    const all = words();
    let left = all.filter(w => !used.has(w));
    if (!left.length) { all.forEach(w => used.delete(w)); left = all; }
    const word = App.pick(left);
    used.add(word);
    const order = App.fromHolder();
    R = { phase: 'pass', idx: 0, order, word, imposter: App.pick(order), starter: App.pick(order), result: null };
    App.render();
  }
  function finish(r){ R.result = r; R.phase = 'end'; App.render(); }

  /* ---------- knapper ---------- */
  App.on('imp.start', start);
  App.on('imp.setup', () => { R = null; App.render(); });
  App.on('imp.reveal', () => { R.phase = 'reveal'; App.render(); });
  /* Første skærm: den, der faktisk har telefonen, trykker på sig selv, og rækkefølgen starter derfra */
  App.on('imp.from', el => {
    if (!R || R.phase !== 'pass' || R.idx !== 0) return;
    App.setHolder(el.dataset.name); R.order = App.fromHolder(); App.render();
  });
  App.on('imp.hide', () => {
    if (R.idx >= R.order.length - 1) { R.phase = 'discuss'; App.setHolder(R.order[R.idx]); }
    else { R.idx++; R.phase = 'pass'; }
    App.render();
  });
  App.on('imp.tovote', () => { R.phase = 'vote'; App.render(); });
  App.on('imp.voteout', el => {
    const name = el.dataset.name;
    if (name === R.imposter) { R.phase = 'caught'; App.vibrate([80, 60, 80]); App.audio.ding(); App.render(); }
    else { App.vibrate(120); finish({ impWon: true, title: `${name} var ikke imposter`, text: `${name} drikker 2 slurke, og imposteren slap. Alle andre end imposteren drikker 2.` }); }
  });
  App.on('imp.guess', el => {
    const ok = el.dataset.ok === '1';
    if (ok) App.audio.ding();
    finish(ok
      ? { impWon: true, title: `${R.imposter} gættede ordet`, text: 'Imposteren reddede sig. Alle andre drikker 2 slurke.' }
      : { impWon: false, title: `${R.imposter} gættede forkert`, text: `${R.imposter} drikker 4 slurke.` });
  });
})();
