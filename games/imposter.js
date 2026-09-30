/* Imposter: alle får det samme ord, undtagen imposteren. Telefonen går på omgang. */
(() => {
  const ID = 'imposter';
  const C = '#b14cff';
  const DEF = { imposters: 1, variant: 'klassisk', showCategory: true, guessRule: true, timer: 2, cats: {} };
  const { esc, ui } = App;
  let S = null;     // gemte indstillinger
  let R = null;     // igangværende runde
  const used = new Set();

  App.register({
    id: ID, navn: 'Imposter', farve: C,
    kort: 'Alle får det samme hemmelige ord, undtagen én. Find imposteren, før imposteren finder ordet.',
    onEnter(){ S = App.gameSettings(ID, DEF); R = null; App.keepAwake(); },
    onLeave(){ stopTimer(); },
    render
  });

  function allCats(){ return IMPOSTER_WORDS.filter(c => !c.adult || App.settings().adult); }
  function enabledCats(){ return allCats().filter(c => S.cats[c.id] !== false); }
  function maxImposters(n){ return Math.max(1, Math.floor((n - 1) / 2)); }
  function fmt(s){ return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function impLeft(){ return [...R.imposters].filter(n => R.alive.has(n)).length; }
  function innoLeft(){ return [...R.alive].filter(n => !R.imposters.has(n)).length; }

  function render(){
    if (!R) return renderSetup();
    return PHASES[R.phase]();
  }

  function renderSetup(){
    const p = App.players();
    const n = p.length;
    const maxI = maxImposters(n);
    if (S.imposters > maxI) S.imposters = maxI;
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
        ${ui.stepper('Antal impostere', 'imp.step', S.imposters, 'imposters', n >= 3 ? 'Højst ' + maxI + ' med ' + n + ' spillere' : '')}
        <div class="field">
          <div class="label">Variant</div>
          ${ui.seg('imp.seg', [{ v: 'klassisk', l: 'Klassisk' }, { v: 'undercover', l: 'Undercover' }], S.variant, 'variant')}
          <p class="hint">${S.variant === 'klassisk'
            ? 'Imposteren får at vide, at de er imposter, og kender ikke ordet. De skal bluffe sig igennem.'
            : 'Ingen får at vide, hvem der er imposter. Imposteren får bare et ord, der ligner de andres.'}</p>
        </div>
        ${ui.toggle('Vis kategorien til alle', 'imp.toggle', S.showCategory, 'showCategory', 'Gør det lettere for imposteren at bluffe')}
        ${S.variant === 'klassisk' ? ui.toggle('Imposteren må gætte ordet', 'imp.toggle', S.guessRule, 'guessRule', 'Bliver imposteren afsløret, kan et rigtigt gæt vende straffen') : ''}
        <div class="field">
          <div class="label">Snakketid</div>
          ${ui.seg('imp.seg', [{ v: 0, l: 'Ingen' }, { v: 1, l: '1 min' }, { v: 2, l: '2 min' }, { v: 3, l: '3 min' }], S.timer, 'timer')}
        </div>
      </div>
      <div class="card">
        <div class="label">Kategorier</div>
        <div class="chips">${allCats().map(c => `<button class="chip ${S.cats[c.id] === false ? '' : 'on'}" data-action="imp.cat" data-id="${c.id}">${esc(c.navn)}</button>`).join('')}</div>
        ${enabledCats().length ? '' : '<p class="warn">Vælg mindst én kategori.</p>'}
      </div>`;
    return ui.shell({ title: 'Imposter', color: C, body, footer: `<button class="btn" data-action="imp.start" ${ok ? '' : 'disabled'}>Start runde</button>` });
  }

  const PHASES = {
    pass(){
      const name = R.order[R.idx];
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: `
        <div class="label">Spiller ${R.idx + 1} af ${R.order.length}</div>
        <p class="muted">Giv telefonen til</p>
        <div class="big">${esc(name)}</div>
        <p class="muted">Kun ${esc(name)} må se den næste skærm.</p>`,
        footer: `<button class="btn" data-action="imp.reveal">Vis min rolle</button>` });
    },
    reveal(){
      const name = R.order[R.idx];
      const isImp = R.imposters.has(name);
      const cat = S.showCategory ? `<p class="muted">Kategori: <b>${esc(R.cat)}</b></p>` : '';
      let inner;
      if (isImp && S.variant === 'klassisk') {
        inner = `<div class="reveal-box"><div class="label">${esc(name)}</div><div class="big accent">Du er imposter</div>${cat}
          <p class="muted">Du kender ikke ordet. Lad som om du gør, og lyt godt efter de andre.</p></div>`;
      } else {
        const w = isImp ? R.decoy : R.word;
        inner = `<div class="reveal-box"><div class="label">${esc(name)}, dit ord er</div><div class="big">${esc(w)}</div>${cat}
          <p class="muted">Husk det, og hold det for dig selv.</p></div>`;
      }
      const last = R.idx === R.order.length - 1;
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: inner,
        footer: `<button class="btn" data-action="imp.hide">${last ? 'Skjul. Alle har set' : 'Skjul og giv videre'}</button>` });
    },
    discuss(){
      const t = R.timer;
      let timerHtml = '';
      if (S.timer) {
        timerHtml = `<div class="timer ${t.left === 0 ? 'done' : ''}">${fmt(t.left)}</div>`;
        if (!t.running && t.left === S.timer * 60) timerHtml += `<button class="btn sm ghost" data-action="imp.timer">Start tiden</button>`;
        else if (t.left === 0) timerHtml += `<p class="muted">Tiden er gået. Stem!</p>`;
      }
      const intro = S.variant === 'klassisk'
        ? 'Sig på skift ét ord, der passer til jeres hemmelige ord. Vær ikke for tydelig, imposteren lytter med.'
        : 'En af jer har et andet ord end de andre. Sig på skift ét ord, der passer til dit, og find ud af hvem.';
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: `
        <div class="label">${R.round > 1 ? 'Runde ' + R.round + '. ' + R.alive.size + ' tilbage' : 'Alle har set deres rolle'}</div>
        <div class="big">${esc(R.starter)} starter</div>
        <p class="muted">${intro}</p>
        ${timerHtml}`,
        footer: `<button class="btn" data-action="imp.tovote">Gå til afstemning</button>` });
    },
    vote(){
      const alive = R.order.filter(n => R.alive.has(n));
      return ui.shell({ title: 'Imposter', color: C, backAction: 'imp.setup', body: `
        <div class="label">Afstemning</div>
        <h2>Hvem stemmer I ud?</h2>
        <p class="muted">Tal sammen, peg, og tryk på navnet.</p>
        <div class="vote-grid">${alive.map(n => `<button class="btn ghost" data-action="imp.voteout" data-name="${esc(n)}">${esc(n)}</button>`).join('')}</div>` });
    },
    result(){
      const r = R.result;
      let title, text, btn, action;
      if (r.guessed) {
        title = r.ok ? `${r.name} gættede rigtigt` : `${r.name} gættede forkert`;
        text = r.ok ? 'Imposteren reddede sig. Alle andre drikker 3 slurke.' : `${r.name} drikker 5 slurke.`;
        if (r.next === 'vote') { text += ` Der er stadig ${r.impLeft} imposter tilbage. Snak videre, og stem igen.`; btn = 'Stem igen'; action = 'imp.tovote'; }
        else { btn = 'Se ordet'; action = 'imp.toend'; }
      } else if (r.caught) {
        title = `${r.name} var imposter`;
        if (r.next === 'guess') { text = `Sidste chance: ${r.name} må gætte ordet højt. Rigtigt gæt: alle andre drikker 3 slurke. Forkert: ${r.name} drikker 5.`; btn = 'Lad os høre gættet'; action = 'imp.toguess'; }
        else if (r.next === 'vote') { text = `${r.name} drikker 3 slurke. Der er stadig ${r.impLeft} imposter tilbage. Snak videre, og stem igen.`; btn = 'Stem igen'; action = 'imp.tovote'; }
        else { text = `${r.name} drikker 3 slurke. Alle impostere er fundet.`; btn = 'Se ordet'; action = 'imp.toend'; }
      } else {
        title = `${r.name} var ikke imposter`;
        if (r.impWin) { text = `${r.name} drikker 2 slurke. Imposterne er nu lige så mange som resten, så de har vundet. Alle andre drikker 4 slurke.`; btn = 'Afslør imposterne'; action = 'imp.toend'; }
        else { text = `${r.name} drikker 2 slurke og er ude af runden. Imposteren er stadig iblandt jer. Snak videre, og stem igen.`; btn = 'Stem igen'; action = 'imp.tovote'; }
      }
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: `
        <div class="big ${r.caught || (r.guessed && !r.ok) ? 'accent' : ''}">${esc(title)}</div>
        <p class="muted">${esc(text)}</p>`,
        footer: `<button class="btn" data-action="${action}">${btn}</button>` });
    },
    guess(){
      const name = R.result.name;
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: `
        <div class="label">Sidste chance</div>
        <div class="big">${esc(name)} gætter</div>
        <p class="muted">Sig dit bud på ordet højt. De andre afgør, om det er rigtigt.</p>`,
        footer: `<button class="btn" data-action="imp.guess" data-ok="1">Rigtigt gæt</button><button class="btn ghost" data-action="imp.guess" data-ok="0">Forkert gæt</button>` });
    },
    end(){
      const imps = [...R.imposters];
      return ui.shell({ title: 'Imposter', color: C, center: true, backAction: 'imp.setup', body: `
        <div class="label">Ordet var</div>
        <div class="big">${esc(R.word)}</div>
        ${S.variant === 'undercover' ? `<p class="muted">Imposterens ord var <b>${esc(R.decoy)}</b></p>` : ''}
        <p class="muted">Kategori: ${esc(R.cat)}</p>
        <div class="card" style="width:100%"><div class="label">Imposter${imps.length > 1 ? 'e' : ''}</div><div class="strong">${esc(imps.join(', '))}</div></div>`,
        footer: `<button class="btn" data-action="imp.start">Ny runde</button><button class="btn ghost" data-action="imp.setup">Indstillinger</button>` });
    }
  };

  /* ---------- runde ---------- */
  function start(){
    stopTimer();
    const pool = enabledCats();
    const players = App.players();
    if (!pool.length || players.length < 3) { R = null; App.render(); return; }
    const cat = App.pick(pool);
    let pairs = cat.ord.filter(pr => !used.has(cat.id + ':' + pr[0]));
    if (!pairs.length) { cat.ord.forEach(pr => used.delete(cat.id + ':' + pr[0])); pairs = cat.ord; }
    const pair = App.pick(pairs);
    used.add(cat.id + ':' + pair[0]);
    const flip = Math.random() < 0.5;
    const order = players.slice();
    const imposters = new Set(App.shuffle(order.slice()).slice(0, Math.min(S.imposters, maxImposters(order.length))));
    R = {
      phase: 'pass', idx: 0, order, round: 1,
      word: flip ? pair[1] : pair[0], decoy: flip ? pair[0] : pair[1], cat: cat.navn,
      imposters, alive: new Set(order), starter: App.pick(order),
      timer: { left: S.timer * 60, running: false, id: null }, result: null
    };
    App.render();
  }
  function stopTimer(){ if (R && R.timer.id) { clearInterval(R.timer.id); R.timer.id = null; R.timer.running = false; } }

  /* ---------- knapper ---------- */
  App.on('imp.step', el => {
    const maxI = maxImposters(App.players().length);
    S.imposters = Math.min(maxI, Math.max(1, S.imposters + Number(el.dataset.d)));
    App.save(); App.render();
  });
  App.on('imp.seg', el => {
    const k = el.dataset.key;
    S[k] = k === 'timer' ? Number(el.dataset.v) : el.dataset.v;
    App.save(); App.render();
  });
  App.on('imp.toggle', el => { S[el.dataset.key] = el.checked; App.save(); });
  App.on('imp.cat', el => {
    const id = el.dataset.id;
    S.cats[id] = S.cats[id] === false;
    App.save(); App.render();
  });
  App.on('imp.start', start);
  App.on('imp.setup', () => { stopTimer(); R = null; App.render(); });
  App.on('imp.reveal', () => { R.phase = 'reveal'; App.render(); });
  App.on('imp.hide', () => {
    if (R.idx >= R.order.length - 1) { R.phase = 'discuss'; }
    else { R.idx++; R.phase = 'pass'; }
    App.render();
  });
  App.on('imp.timer', () => {
    const t = R.timer;
    if (t.running) return;
    t.running = true;
    t.id = setInterval(() => {
      t.left--;
      if (t.left <= 0) { t.left = 0; stopTimer(); App.audio.ding(); App.vibrate([200, 100, 200]); }
      if (R && R.phase === 'discuss') App.render();
    }, 1000);
    App.render();
  });
  App.on('imp.tovote', () => { stopTimer(); if (R.phase !== 'discuss') R.round++; R.phase = 'vote'; App.render(); });
  App.on('imp.voteout', el => {
    const name = el.dataset.name;
    if (!R.alive.has(name)) return;
    R.alive.delete(name);
    const caught = R.imposters.has(name);
    const il = impLeft(), nl = innoLeft();
    let next;
    if (caught && S.variant === 'klassisk' && S.guessRule) next = 'guess';
    else if (caught) next = il > 0 ? 'vote' : 'end';
    else next = il >= nl ? 'end' : 'vote';
    R.result = { name, caught, impLeft: il, innoLeft: nl, next, impWin: !caught && il >= nl };
    R.phase = 'result';
    App.vibrate(caught ? [80, 60, 80] : 120);
    App.render();
  });
  App.on('imp.toguess', () => { R.phase = 'guess'; App.render(); });
  App.on('imp.guess', el => {
    const ok = el.dataset.ok === '1';
    const il = impLeft();
    R.result = { guessed: true, ok, name: R.result.name, impLeft: il, next: il > 0 ? 'vote' : 'end' };
    R.phase = 'result';
    if (ok) App.audio.ding();
    App.render();
  });
  App.on('imp.toend', () => { R.phase = 'end'; App.render(); });
})();
