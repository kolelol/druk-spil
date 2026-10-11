/* Spygame: alle får det samme ord i en kategori, undtagen spionen, der kun kender kategorien.
   Telefonen går på omgang, så stiller man spørgsmål til hinanden på skift, og til sidst stemmer man. Hurtigt og enkelt. */
(() => {
  const ID = 'spygame';
  const C = '#22c9a5';
  const DEF = { spies: 1, rounds: 1, cats: {} };
  const { esc, ui } = App;
  let S = null;     // gemte indstillinger
  let R = null;     // igangværende runde
  const used = new Set();
  /* Agent med hat og solbriller */
  const IKON = `<svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M9 61c2-13 11-19 23-19s21 6 23 19z" fill="#3b4a6b" stroke="#0d1b3e" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="32" cy="36" r="13" fill="#ffd9a8" stroke="#0d1b3e" stroke-width="3"/>
    <path d="M16 34h32" fill="none" stroke="#0d1b3e" stroke-width="3" stroke-linecap="round"/>
    <rect x="19" y="32" width="11" height="8" rx="3" fill="#1a0c33" stroke="#0d1b3e" stroke-width="2.5"/>
    <rect x="34" y="32" width="11" height="8" rx="3" fill="#1a0c33" stroke="#0d1b3e" stroke-width="2.5"/>
    <ellipse cx="32" cy="26" rx="23" ry="5" fill="#22303f" stroke="#0d1b3e" stroke-width="3"/>
    <path d="M18 26c1-10 5-17 14-17s13 7 14 17z" fill="#2e3f55" stroke="#0d1b3e" stroke-width="3" stroke-linejoin="round"/>
    <path d="M19 22h26" fill="none" stroke="${C}" stroke-width="4"/>
  </svg>`;

  App.register({
    id: ID, navn: 'Spygame', farve: C, ikon: IKON,
    kort: 'Alle får det samme ord, spionen får kun kategorien. Stil spørgsmål på skift, og find spionen.',
    onEnter(){ S = App.gameSettings(ID, DEF); R = null; App.keepAwake(); },
    render
  });

  function allCats(){ return SPYGAME_WORDS.filter(c => !c.adult || App.settings().adult); }
  function enabledCats(){ return allCats().filter(c => S.cats[c.id] !== false); }
  function maxSpies(n){ return Math.max(1, Math.floor((n - 1) / 2)); }
  function spiesLeft(){ return [...R.spies].filter(n => R.alive.has(n)).length; }
  function othersLeft(){ return [...R.alive].filter(n => !R.spies.has(n)).length; }

  function render(){
    if (!R) return renderSetup();
    return PHASES[R.phase]();
  }

  function renderSetup(){
    const p = App.players();
    const n = p.length;
    const maxS = maxSpies(n);
    if (S.spies > maxS) S.spies = maxS;
    const ok = n >= 3 && enabledCats().length > 0;
    const body = `
      <div class="card">
        <div class="row-between">
          <div><div class="label">Spillere</div><div class="strong">${n ? esc(p.join(', ')) : 'Ingen endnu'}</div></div>
          <button class="btn sm ghost" data-action="go" data-to="players">Ret</button>
        </div>
        ${n < 3 ? '<p class="warn">Du skal bruge mindst 3 spillere.</p>' : ''}
      </div>
      <div class="card">
        <div class="label">Sådan spiller I</div>
        <p>Alle får det samme ord. Spionen får kun kategorien. Stil et spørgsmål til en anden på skift, og svar, så det passer til dit ord, men uden at gøre det for let for spionen. Så stemmer I. Rammer I spionen, drikker spionen. Rammer I forkert, drikker den, I ramte.</p>
      </div>
      <div class="card">
        ${ui.stepper('Antal spioner', 'spy.step', S.spies, 'spies', n >= 3 ? 'Højst ' + maxS + ' med ' + n + ' spillere' : '')}
        <div class="field">
          <div class="label">Spørgerunder før afstemning</div>
          ${ui.seg('spy.seg', [{ v: 1, l: '1 runde' }, { v: 2, l: '2 runder' }, { v: 3, l: '3 runder' }], S.rounds, 'rounds')}
          <p class="hint">I én runde når alle at stille ét spørgsmål.</p>
        </div>
      </div>
      <div class="card">
        <div class="label">Kategorier</div>
        <div class="chips">${allCats().map(c => `<button class="chip ${S.cats[c.id] === false ? '' : 'on'}" data-action="spy.cat" data-id="${c.id}">${esc(c.navn)}</button>`).join('')}</div>
        ${enabledCats().length ? '' : '<p class="warn">Vælg mindst én kategori.</p>'}
      </div>`;
    return ui.shell({ title: 'Spygame', color: C, body, footer: `<button class="btn" data-action="spy.start" ${ok ? '' : 'disabled'}>Start runde</button>` });
  }

  const wordList = () => `<details class="wordlist"><summary>Se alle ord i ${esc(R.cat)}</summary><div class="chips">${R.words.map(w => `<span class="chip">${esc(w)}</span>`).join('')}</div></details>`;

  const PHASES = {
    pass(){
      const name = R.order[R.idx];
      const first = R.idx === 0;
      return ui.shell({ title: 'Spygame', color: C, center: true, backAction: 'spy.setup', body: `
        <div class="label">Spiller ${R.idx + 1} af ${R.order.length}</div>
        <p class="muted">${first ? 'Telefonen starter hos' : 'Giv telefonen videre til'}</p>
        <div class="big">${esc(name)}</div>
        ${ui.table(R.order, { sm: true, cur: name, done: R.order.slice(0, R.idx), pick: first ? 'spy.from' : '' })}
        <p class="muted small">${first ? 'Har en anden telefonen? Tryk på dem.' : 'Kun ' + esc(name) + ' må se den næste skærm.'}</p>`,
        footer: `<button class="btn" data-action="spy.reveal">Vis min rolle</button>` });
    },
    reveal(){
      const name = R.order[R.idx];
      const isSpy = R.spies.has(name);
      /* Begge kort har samme opbygning, så ingen kan se forskel på afstand */
      const inner = isSpy
        ? `<div class="reveal-box same"><div class="label">${esc(name)}</div><div class="big accent">Du er spionen</div>
            <p class="muted">Kategori: <b>${esc(R.cat)}</b></p>
            <p class="muted">Du kender ikke ordet. Spørg og svar, som om du gør. Ordlisten står på næste skærm.</p></div>`
        : `<div class="reveal-box same"><div class="label">${esc(name)}, dit ord er</div><div class="big">${esc(R.word)}</div>
            <p class="muted">Kategori: <b>${esc(R.cat)}</b></p>
            <p class="muted">Hold det for dig selv. Svar, så det passer, men ikke for tydeligt.</p></div>`;
      const last = R.idx === R.order.length - 1;
      return ui.shell({ title: 'Spygame', color: C, center: true, backAction: 'spy.setup', body: inner,
        footer: `<button class="btn" data-action="spy.hide">${last ? 'Skjul. Alle har set' : 'Skjul og giv videre'}</button>` });
    },
    ask(){
      const q = R.q;
      const name = q.list[q.i];
      const lastQ = q.i >= q.list.length - 1;
      return ui.shell({ title: 'Spygame', color: C, center: true, backAction: 'spy.setup', body: `
        <div class="label">${q.title ? q.title + '. ' : ''}Spørgsmål ${q.i + 1} af ${q.list.length}</div>
        <div class="big">${esc(name)} spørger</div>
        ${ui.table(R.order, { sm: true, cur: name, done: R.order.filter(x => !R.alive.has(x)) })}
        <p class="muted">Vælg en, og stil ét spørgsmål om ordet. Den, der svarer, må ikke sige ordet.</p>
        ${wordList()}`,
        footer: lastQ
          ? `<button class="btn" data-action="spy.tovote">Gå til afstemning</button>`
          : `<button class="btn" data-action="spy.nextq">Næste spørgsmål</button><button class="link" data-action="spy.tovote">Spring til afstemning</button>` });
    },
    vote(){
      const alive = R.order.filter(n => R.alive.has(n));
      return ui.shell({ title: 'Spygame', color: C, backAction: 'spy.setup', body: `
        <div class="label">Afstemning</div>
        <h2>Hvem er spionen?</h2>
        <p class="muted">Tal sammen, bliv enige, og tryk på navnet.</p>
        <div class="vote-grid">${alive.map(n => `<button class="btn ghost" data-action="spy.voteout" data-name="${esc(n)}">${esc(n)}</button>`).join('')}</div>` });
    },
    result(){
      const r = R.result;
      if (!r.over) {
        return ui.shell({ title: 'Spygame', color: C, center: true, backAction: 'spy.setup', body: `
          <div class="big">${esc(r.name)} var ikke spionen</div>
          <p class="muted">${esc(r.name)} drikker 2 slurke og er ude. Spionen er stadig iblandt jer, så spørg videre.</p>`,
          footer: `<button class="btn" data-action="spy.again">Spørg videre</button><button class="link" data-action="spy.tovote">Direkte til afstemning</button>` });
      }
      const spies = [...R.spies];
      return ui.shell({ title: 'Spygame', color: C, center: true, backAction: 'spy.setup', body: `
        <div class="big ${r.caught ? 'accent' : ''}">${esc(r.title)}</div>
        <p class="muted">${esc(r.text)}</p>
        <div class="reveal-box"><div class="label">Ordet var</div><div class="big">${esc(R.word)}</div>
          <p class="muted">Kategori: <b>${esc(R.cat)}</b></p>
          <p class="muted">Spion${spies.length > 1 ? 'er' : ''}: <b>${esc(spies.join(', '))}</b></p></div>`,
        footer: `<button class="btn" data-action="spy.start">Ny runde</button><button class="btn ghost" data-action="spy.setup">Indstillinger</button>` });
    }
  };

  /* ---------- runde ---------- */
  function start(){
    const pool = enabledCats();
    const players = App.players();
    if (!pool.length || players.length < 3) { R = null; App.render(); return; }
    const cat = App.pick(pool);
    let words = cat.ord.filter(w => !used.has(cat.id + ':' + w));
    if (!words.length) { cat.ord.forEach(w => used.delete(cat.id + ':' + w)); words = cat.ord; }
    const word = App.pick(words);
    used.add(cat.id + ':' + word);
    const order = App.fromHolder();
    const spies = new Set(App.shuffle(order.slice()).slice(0, Math.min(S.spies, maxSpies(order.length))));
    R = { phase: 'pass', idx: 0, order, round: 1, word, cat: cat.navn, words: cat.ord, spies, alive: new Set(order), q: null, result: null };
    App.render();
  }
  /* Spørgerækkefølge: tilfældig start, så rundt om bordet. Kun dem, der stadig er med. */
  function newQuestions(rounds, title){
    const alive = R.order.filter(n => R.alive.has(n));
    const startAt = App.rand(0, alive.length - 1);
    const list = [];
    for (let r = 0; r < rounds; r++) for (let i = 0; i < alive.length; i++) list.push(alive[(startAt + i) % alive.length]);
    R.q = { list, i: 0, title };
    R.phase = 'ask';
  }

  /* ---------- knapper ---------- */
  App.on('spy.step', el => {
    const maxS = maxSpies(App.players().length);
    S.spies = Math.min(maxS, Math.max(1, S.spies + Number(el.dataset.d)));
    App.save(); App.render();
  });
  App.on('spy.seg', el => { S[el.dataset.key] = Number(el.dataset.v); App.save(); App.render(); });
  App.on('spy.cat', el => {
    const id = el.dataset.id;
    S.cats[id] = S.cats[id] === false;
    App.save(); App.render();
  });
  App.on('spy.start', start);
  App.on('spy.setup', () => { R = null; App.render(); });
  App.on('spy.reveal', () => { R.phase = 'reveal'; App.render(); });
  App.on('spy.from', el => {
    if (!R || R.phase !== 'pass' || R.idx !== 0) return;
    App.setHolder(el.dataset.name); R.order = App.fromHolder(); R.alive = new Set(R.order); App.render();
  });
  App.on('spy.hide', () => {
    if (R.idx >= R.order.length - 1) { App.setHolder(R.order[R.idx]); newQuestions(S.rounds, ''); }
    else { R.idx++; R.phase = 'pass'; }
    App.render();
  });
  App.on('spy.nextq', () => { if (R.q.i < R.q.list.length - 1) R.q.i++; App.render(); });
  App.on('spy.tovote', () => { R.phase = 'vote'; App.render(); });
  App.on('spy.again', () => { R.round++; newQuestions(1, 'Runde ' + R.round); App.render(); });
  App.on('spy.voteout', el => {
    const name = el.dataset.name;
    if (!R.alive.has(name)) return;
    R.alive.delete(name);
    const caught = R.spies.has(name);
    const sl = spiesLeft(), ol = othersLeft();
    let r;
    if (caught && sl > 0) r = { over: true, caught, title: `${name} var spionen`, text: `${name} drikker 4 slurke. Men der er stadig ${sl} spion iblandt jer, der slap. Alle andre drikker 2.` };
    else if (caught) r = { over: true, caught, title: `${name} var spionen`, text: `Afsløret. ${name} drikker 4 slurke.` };
    else if (sl >= ol) r = { over: true, caught, title: `${name} var ikke spionen`, text: `Spionerne er nu lige så mange som jer andre, så de har vundet. Alle andre end spionerne drikker 4 slurke.` };
    else r = { over: false, name };
    R.result = r;
    R.phase = 'result';
    App.vibrate(caught ? [80, 60, 80] : 120);
    if (caught) App.audio.ding();
    App.render();
  });
})();
