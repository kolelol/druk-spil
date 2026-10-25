/* Imposter (hed Spygame indtil 2026-10-25; filen, id'et 'spygame', SPYGAME_WORDS og spy.*-handlerne har beholdt navnet,
   så gemte indstillinger overlever): alle får det samme ord i en kategori, undtagen imposteren, der kun kender kategorien.
   Er der flere impostere, ser hver af dem på sit kort, hvem de andre er.
   Telefonen går rundt om bordet, så stiller man spørgsmål til hinanden på skift, og til sidst stemmer man.
   Så få tryk som muligt: spørgsmålene foregår på én skærm (ingen "næste spørgsmål" pr. person), og indstillingerne
   ligger foldet sammen, så man bare trykker start. */
(() => {
  const ID = 'spygame';
  const C = '#22c9a5';
  const DEF = { spies: 1, cats: {} };
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
    id: ID, navn: 'Imposter', farve: C, ikon: IKON,
    kort: 'Alle får det samme ord, imposteren får kun kategorien. Stil spørgsmål rundt om bordet, og find imposteren.',
    onEnter(){ S = App.gameSettings(ID, DEF); if ('rounds' in S) { delete S.rounds; App.save(); } R = null; App.keepAwake(); },
    render
  });

  function allCats(){ return SPYGAME_WORDS.filter(c => !c.adult || App.settings().adult); }
  function enabledCats(){ return allCats().filter(c => S.cats[c.id] !== false); }
  function maxSpies(n){ return Math.max(1, Math.floor((n - 1) / 2)); }
  function spiesLeft(){ return [...R.spies].filter(n => R.alive.has(n)).length; }
  function othersLeft(){ return [...R.alive].filter(n => !R.spies.has(n)).length; }
  /* "Bo", "Bo og Clement", "Anders, Bo og Clement" */
  function og(names){ return names.length > 1 ? names.slice(0, -1).join(', ') + ' og ' + names[names.length - 1] : names.join(''); }

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
    const off = allCats().filter(c => S.cats[c.id] === false).length;
    const body = `
      <div class="card">
        <div class="label">Bordplan</div>
        ${n >= 3 ? ui.table(p, { sm: true, start: App.holder() }) : '<p class="warn">Du skal bruge mindst 3 spillere.</p>'}
        <div class="btn-row"><button class="btn sm ghost" data-action="go" data-to="players">Spillere</button>${n >= 3 ? '<button class="btn sm ghost" data-action="seats.open">Sæt pladser</button>' : ''}</div>
      </div>
      <div class="card">
        <div class="label">Sådan spiller I</div>
        <p>Alle får det samme ord. Imposteren får kun kategorien. Stil et spørgsmål til en anden rundt om bordet, og svar, så det passer til ordet, men uden at gøre det for let for imposteren. Så stemmer I. Rammer I imposteren, må imposteren gætte ordet: rigtigt, og alle andre drikker 2. Forkert, og imposteren drikker 4. Rammer I forkert, drikker den, I ramte, 2 og er ude, og I spørger videre.</p>
        <p>Er I flere impostere, kan de se hinanden på deres kort.</p>
      </div>
      <details class="card how">
        <summary>Indstillinger: ${S.spies} imposter${S.spies > 1 ? 'e' : ''}, ${off ? (allCats().length - off) + ' kategorier' : 'alle kategorier'}</summary>
        ${ui.stepper('Antal impostere', 'spy.step', S.spies, 'spies', n >= 3 ? 'Højst ' + maxS + ' med ' + n + ' spillere' : '')}
        <div class="chips" style="margin-top:8px">${allCats().map(c => `<button class="chip ${S.cats[c.id] === false ? '' : 'on'}" data-action="spy.cat" data-id="${c.id}">${esc(c.navn)}</button>`).join('')}</div>
        ${enabledCats().length ? '' : '<p class="warn">Vælg mindst én kategori.</p>'}
      </details>`;
    return ui.shell({ title: 'Imposter', color: C, body, footer: `<button class="btn" data-action="spy.start" ${ok ? '' : 'disabled'}>Start runde</button>` });
  }

  const wordList = () => `<details class="wordlist"><summary>Se alle ord i ${esc(R.cat)}</summary><div class="chips">${R.words.map(w => `<span class="chip">${esc(w)}</span>`).join('')}</div></details>`;

  const PHASES = {
    pass(){
      const name = R.order[R.idx];
      const first = R.idx === 0;
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'spy.setup', body: `
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
      /* Er der flere impostere, ser hver af dem de andres navne (ejeren 2026-10-25). Teksten er kortere, så kortet ikke bliver højere end et ordkort. */
      const mates = R.order.filter(n => n !== name && R.spies.has(n));
      const spyText = mates.length
        ? `<p class="muted">${mates.length > 1 ? 'De andre impostere er' : 'Den anden imposter er'} <b>${esc(og(mates))}</b>. Spil med, som om I kender ordet.</p>`
        :'<p class="muted">Du kender ikke ordet. Spørg og svar, som om du gør. Når alle har set deres rolle, kan du se ordlisten.</p>';
      /* Begge kort har samme opbygning, så ingen kan se forskel på afstand */
      const inner = isSpy
        ? `<div class="reveal-box same"><div class="label">${esc(name)}</div><div class="big">Du er imposter</div>
            <p class="muted">Kategori: <b>${esc(R.cat)}</b></p>
            ${spyText}</div>`
        : `<div class="reveal-box same"><div class="label">${esc(name)}</div><div class="big">${esc(R.word)}</div>
            <p class="muted">Kategori: <b>${esc(R.cat)}</b></p>
            <p class="muted">Hold det for dig selv. Svar, så det passer, men ikke for tydeligt.</p></div>`;
      const last = R.idx === R.order.length - 1;
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'spy.setup', body: inner,
        footer: `<button class="btn" data-action="spy.hide">${last ? 'Skjul. Alle har set' : 'Skjul og giv videre'}</button>` });
    },
    /* Spørgsmålene: én skærm. Starteren spørger en anden, den svarer og spørger videre, rundt om bordet. */
    ask(){
      const alive = R.order.filter(n => R.alive.has(n));
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'spy.setup', body: `
        <div class="label">${R.round > 1 ? 'Runde ' + R.round + '. ' + alive.length + ' tilbage' : 'Kategori: ' + esc(R.cat)}</div>
        <div class="big">${esc(R.starter)} starter</div>
        ${ui.table(R.order, { sm: true, start: R.starter, cur: R.starter, done: R.order.filter(x => !R.alive.has(x)) })}
        <p class="muted">Stil ét spørgsmål om ordet til en anden. Den, der svarer, spørger videre. Tag en runde eller to, og stem så.</p>
        ${wordList()}`,
        footer: `<button class="btn" data-action="spy.tovote">Gå til afstemning</button>` });
    },
    vote(){
      const alive = R.order.filter(n => R.alive.has(n));
      return ui.shell({ title: 'Imposter', color: C, backAction: 'spy.setup', body: `
        <div class="label">Afstemning</div>
        <h2>Hvem er imposter?</h2>
        <p class="muted">Tal sammen, bliv enige, og tryk på navnet. Tryk igen for at stemme ud.</p>
        <div class="vote-grid">${alive.map(n => `<button class="btn ${R.pick === n ? 'danger' : 'ghost'}" data-action="spy.voteout" data-name="${esc(n)}">${R.pick === n ? 'Ud med ' + esc(n) + '?' : esc(n)}</button>`).join('')}</div>` });
    },
    /* Imposteren er taget: ét gæt på ordet. Imposteren kan se ordlisten, så det er et reelt gæt. */
    caught(){
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'spy.setup', body: `
        <div class="big">${esc(R.caughtName)} var imposter</div>
        <p class="muted">Sidste chance: ${esc(R.caughtName)} gætter ordet højt. Rigtigt: alle andre drikker 2. Forkert: ${esc(R.caughtName)} drikker 4.</p>
        ${wordList()}`,
        footer: `<button class="btn" data-action="spy.guess" data-ok="1">Rigtigt gæt</button><button class="btn ghost" data-action="spy.guess" data-ok="0">Forkert gæt</button>` });
    },
    result(){
      const r = R.result;
      if (!r.over) {
        return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'spy.setup', body: `
          <div class="big">${esc(r.name)} var ikke imposter</div>
          <p class="muted">${esc(r.name)} drikker 2 slurke og er ude. ${spiesLeft() > 1 ? 'Imposterne er' : 'Imposteren er'} stadig iblandt jer, så spørg videre.</p>`,
          footer: `<button class="btn" data-action="spy.again">Spørg videre</button><button class="link" data-action="spy.tovote">Direkte til afstemning</button>` });
      }
      const spies = R.order.filter(n => R.spies.has(n));
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'spy.setup', body: `
        <div class="big ${r.caught ? 'accent' : ''}">${esc(r.title)}</div>
        <p class="muted">${esc(r.text)}</p>
        <div class="reveal-box"><div class="label">Ordet var</div><div class="big">${esc(R.word)}</div>
          <p class="muted">Kategori: <b>${esc(R.cat)}</b></p>
          <p class="muted">Imposter${spies.length > 1 ? 'e' : ''}: <b>${esc(og(spies))}</b></p></div>`,
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
    R = { phase: 'pass', idx: 0, order, round: 1, word, cat: cat.navn, words: cat.ord, spies, alive: new Set(order), starter: null, result: null };
    App.render();
  }
  /* Tilfældig starter blandt dem, der stadig er med */
  function toAsk(){ R.starter = App.pick(R.order.filter(n => R.alive.has(n))); R.phase = 'ask'; }

  /* ---------- knapper ---------- */
  App.on('spy.step', el => {
    const maxS = maxSpies(App.players().length);
    S.spies = Math.min(maxS, Math.max(1, S.spies + Number(el.dataset.d)));
    App.save(); App.render();
    const d = document.querySelector('details.how'); if (d) d.open = true;
  });
  App.on('spy.cat', el => {
    const id = el.dataset.id;
    S.cats[id] = S.cats[id] === false;
    App.save(); App.render();
    const d = document.querySelector('details.how'); if (d) d.open = true;
  });
  App.on('spy.start', start);
  /* Midt i en runde kræver tilbage-pilen to tryk */
  let backArmed = 0;
  App.on('spy.setup', () => {
    const live = R && !(R.phase === 'result' && R.result && R.result.over);
    if (live && Date.now() - backArmed > 2500) { backArmed = Date.now(); App.toast('Tryk igen for at afbryde runden'); return; }
    backArmed = 0; R = null; App.render();
  });
  App.on('spy.guess', el => {
    if (!R || R.phase !== 'caught') return;
    const ok = el.dataset.ok === '1', name = R.caughtName;
    const rem = R.order.filter(n => R.spies.has(n) && R.alive.has(n));
    const rest = rem.length ?` ${og(rem)} var også imposter${rem.length > 1 ? 'e' : ''} og slap væk.` : '';
    R.result = ok
      ? { over: true, caught: false, title: `${name} gættede ordet`, text: `Imposteren reddede sig. Alle andre drikker 2 slurke.${rest}` }
      : { over: true, caught: true, title: `${name} gættede forkert`, text: `${name} drikker 4 slurke.${rest}` };
    R.phase = 'result';
    if (ok) App.audio.ding();
    App.render();
  });
  App.on('spy.reveal', () => { R.phase = 'reveal'; App.render(); });
  App.on('spy.from', el => {
    if (!R || R.phase !== 'pass' || R.idx !== 0) return;
    App.setHolder(el.dataset.name); R.order = App.fromHolder(); R.alive = new Set(R.order); App.render();
  });
  App.on('spy.hide', () => {
    if (R.idx >= R.order.length - 1) { App.setHolder(R.order[R.idx]); toAsk(); }
    else { R.idx++; R.phase = 'pass'; }
    App.render();
  });
  App.on('spy.tovote', () => { R.phase = 'vote'; R.pick = null; App.render(); });
  App.on('spy.again', () => { R.round++; toAsk(); App.render(); });
  App.on('spy.voteout', el => {
    const name = el.dataset.name;
    if (!R.alive.has(name)) return;
    if (R.pick !== name) { R.pick = name; App.render(); return; }   // første tryk vælger, andet tryk stemmer ud
    R.pick = null;
    R.alive.delete(name);
    const caught = R.spies.has(name);
    const sl = spiesLeft(), ol = othersLeft();
    let r;
    if (caught) { R.caughtName = name; R.phase = 'caught'; App.vibrate([80, 60, 80]); App.audio.ding(); App.render(); return; }
    else if (sl >= ol) r = { over: true, caught, title: `${name} var ikke imposter`, text: sl > 1 ? 'Imposterne er nu lige så mange som jer andre, så de har vundet. Alle andre end imposterne drikker 4 slurke.' : 'Nu er der kun én tilbage ud over imposteren, så imposteren har vundet. Alle andre end imposteren drikker 4 slurke.' };
    else r = { over: false, name };
    R.result = r;
    R.phase = 'result';
    App.vibrate(caught ? [80, 60, 80] : 120);
    if (caught) App.audio.ding();
    App.render();
  });
})();
