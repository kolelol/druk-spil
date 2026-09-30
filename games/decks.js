/* Kortspil: Jeg har aldrig, Mest sandsynlig og Hvem drikker. */
(() => {
  const { esc, ui } = App;

  /* ---------- fælles kortmotor ---------- */
  function makeDeck(cfg){
    let D = null;
    App.register({
      id: cfg.id, navn: cfg.navn, farve: cfg.farve, kort: cfg.kort,
      onEnter(){ D = null; App.keepAwake(); },
      render(){
        if (!D) {
          return ui.shell({ title: cfg.navn, color: cfg.farve, body: `
            <div class="card"><div class="label">Sådan spiller I</div><p>${cfg.regler}</p></div>
            <div class="card"><p class="muted">${cfg.cards().length} kort i bunken${App.settings().adult ? ', inklusive frække' : ''}. Slå "Frækt indhold" til på forsiden for flere.</p></div>`,
            footer: `<button class="btn" data-action="${cfg.id}.start">Start</button>` });
        }
        if (D.i >= D.order.length) {
          return ui.shell({ title: cfg.navn, color: cfg.farve, center: true, body: `
            <div class="label">Bunken er tom</div>
            <div class="big">Det var alle kort</div>
            <p class="muted">Bland igen, eller prøv et andet spil.</p>`,
            footer: `<button class="btn" data-action="${cfg.id}.start">Bland igen</button><button class="btn ghost" data-action="go" data-to="home">Til menuen</button>` });
        }
        const card = D.order[D.i];
        return ui.shell({ title: cfg.navn, color: cfg.farve, center: true, body: `
          <div class="deck-card">
            <div class="label">${esc(cfg.prefix)}</div>
            <div class="big">${esc(card)}</div>
            <p class="muted">${esc(cfg.straf)}</p>
          </div>
          <div class="counter">${D.i + 1} af ${D.order.length}</div>`,
          footer: `<button class="btn" data-action="${cfg.id}.next">Næste kort</button>` });
      }
    });
    App.on(cfg.id + '.start', () => { D = { order: App.shuffle(cfg.cards().slice()), i: 0 }; App.render(); });
    App.on(cfg.id + '.next', () => { if (!D) return; D.i++; App.audio.click(); App.render(); });
  }

  makeDeck({
    id: 'jha', navn: 'Jeg har aldrig', farve: '#2ad3a3',
    kort: 'Læs kortet højt. Alle, der har prøvet det, drikker.',
    regler: 'Læs kortet højt. Alle, der HAR prøvet det, drikker en slurk. Har ingen prøvet det, drikker den, der læste. Historier bag er meget velkomne.',
    prefix: 'Jeg har aldrig',
    straf: 'Har du? Så drik.',
    cards: () => App.settings().adult ? JEG_HAR_ALDRIG.concat(JEG_HAR_ALDRIG_ADULT) : JEG_HAR_ALDRIG
  });

  makeDeck({
    id: 'ms', navn: 'Mest sandsynlig', farve: '#ffcc33',
    kort: 'Tæl til tre, og peg på den, det passer bedst på. Flest fingre drikker.',
    regler: 'Læs kortet højt. Tæl til tre, og alle peger på den person, det passer bedst på. Den med flest fingre på sig drikker en slurk for hver finger.',
    prefix: 'Hvem er mest sandsynlig til at',
    straf: 'Tæl til tre, og peg. Flest fingre drikker.',
    cards: () => App.settings().adult ? MEST_SANDSYNLIG.concat(MEST_SANDSYNLIG_ADULT) : MEST_SANDSYNLIG
  });

  /* ---------- Hvem drikker ---------- */
  const HC = '#ff4d7d';
  let H = null;
  let spinId = null;
  App.register({
    id: 'hvem', navn: 'Hvem drikker?', farve: HC,
    kort: 'Kan I ikke blive enige? Lad appen vælge en spiller og en straf.',
    onEnter(){ H = null; App.keepAwake(); },
    onLeave(){ clearInterval(spinId); spinId = null; },
    render(){
      const p = App.players();
      if (p.length < 2) {
        return ui.shell({ title: 'Hvem drikker?', color: HC, center: true, body: `
          <div class="label">Spillere mangler</div>
          <div class="big">Tilføj mindst 2 spillere</div>
          <p class="muted">Appen vælger tilfældigt mellem dem, der er skrevet ind.</p>`,
          footer: `<button class="btn" data-action="go" data-to="players">Tilføj spillere</button>` });
      }
      if (!H) {
        return ui.shell({ title: 'Hvem drikker?', color: HC, center: true, body: `
          <div class="label">${p.length} spillere</div>
          <div class="big">Hvem bliver det?</div>
          <p class="muted">Tryk, og lad skæbnen vælge en spiller og en straf.</p>`,
          footer: `<button class="btn" data-action="hvem.spin">Vælg en</button>` });
      }
      return ui.shell({ title: 'Hvem drikker?', color: HC, center: true, body: `
        <div class="label">${H.spinning ? 'Trommehvirvel' : 'Det blev'}</div>
        <div class="big spin-name ${H.spinning ? 'spinning' : ''}">${esc(H.name)}</div>
        ${H.spinning ? '' : `<p class="muted" style="font-size:19px">${esc(H.name)} ${esc(H.straf)}</p>`}`,
        footer: `<button class="btn" data-action="hvem.spin" ${H.spinning ? 'disabled' : ''}>Igen</button>` });
    }
  });
  App.on('hvem.spin', () => {
    const p = App.players();
    if (p.length < 2 || spinId) return;
    H = { spinning: true, name: App.pick(p), straf: '' };
    App.render();
    const stopAt = performance.now() + 1500;
    let last = H.name;
    spinId = setInterval(() => {
      let n = App.pick(p);
      if (p.length > 1) while (n === last) n = App.pick(p);
      last = n;
      const el = document.querySelector('.spin-name');
      if (el) el.textContent = n;
      App.audio.click();
      if (performance.now() >= stopAt) {
        clearInterval(spinId); spinId = null;
        H = { spinning: false, name: n, straf: App.pick(HVEM_DRIKKER_STRAFFE) };
        App.audio.ding(); App.vibrate(150);
        App.render();
      }
    }, 90);
  });
})();
