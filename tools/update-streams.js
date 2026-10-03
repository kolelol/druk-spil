/* Henter antal streams fra kworb.net og skriver data/hitster-streams.js (bruges af spiltypen Streams i Hitster).
   Spotifys eget API udleverer ikke streams, så tallene er et øjebliksbillede fra den dag, scriptet køres.
   Kør fra projektmappen:  node tools/update-streams.js
   Husk bagefter at bumpe ?v=N i index.html og CACHE/V i sw.js. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const URL = 'https://kworb.net/spotify/songs.html';
const OUT = path.join(ROOT, 'data', 'hitster-streams.js');

const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]+/g, ' ').trim();
const has = (hay, needle) => (' ' + norm(hay) + ' ').includes(' ' + norm(needle) + ' ');
/* "Titel (feat. X) - Remastered 2011" -> "Titel" */
const base = t => t.replace(/\s*[\(\[].*$/, '').replace(/\s+-\s.*$/, '').trim() || t;
const unesc = s => s.replace(/&amp;/g, '&').replace(/&#0?39;/g, "'").replace(/&quot;/g, '"');
const BAD = /\b(live|remix|karaoke|instrumental|acoustic|sped up|slowed)\b/i;
/* Numre, som kworb fører under en anden kunstner end hitster-songs.js */
const ALIAS = { 'We Found Love|Rihanna': 'Calvin Harris' };

function songs(){
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', 'hitster-songs.js'), 'utf8') + '\nthis.A = HITSTER_SONGS.concat(HITSTER_SONGS_DK);', ctx);
  return ctx.A;
}

(async () => {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('kworb svarede ' + res.status);
  const html = await res.text();
  const rows = [];
  const re = /<tr><td class="text"><div>(.*?)<\/div><\/td><td>([\d,]+)<\/td>/g;
  let m;
  while ((m = re.exec(html))) {
    const txt = unesc(m[1].replace(/<[^>]+>/g, ''));
    const i = txt.indexOf(' - ');
    if (i < 0) continue;
    rows.push({ a: txt.slice(0, i), t: txt.slice(i + 3), n: Number(m[2].replace(/,/g, '')) });
  }
  if (rows.length < 500) throw new Error('Fandt kun ' + rows.length + ' rækker. Har siden ændret format?');

  const out = {}, missing = [];
  for (const [t, artist] of songs()) {
    const a = ALIAS[t + '|' + artist] || artist;
    const cand = rows.filter(r => (has(r.a, a) || has(a, r.a)) && (has(r.t, t) || has(r.t, base(t))) && (!BAD.test(r.t) || BAD.test(t)));
    const exact = cand.filter(r => norm(base(r.t)) === norm(base(t)) || norm(r.t) === norm(t));
    const best = (exact.length ? exact : cand).sort((x, y) => y.n - x.n)[0];
    if (best) out[t + '|' + artist] = { mio: Math.round(best.n / 1e6), row: best.a + ' - ' + best.t };
    else missing.push(t + ' (' + artist + ')');
  }

  const keys = Object.keys(out).sort((x, y) => out[y].mio - out[x].mio);
  const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  const dato = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(OUT,
`/* Antal streams på Spotify i millioner, hentet fra kworb.net. Laves af tools/update-streams.js, ret ikke i hånden.
   Nøglen er 'Titel|Kunstner' som i hitster-songs.js. Numre uden tal her er ikke med i spiltypen Streams
   (kworbs liste stopper ved de 2500 mest streamede). */
const HITSTER_STREAMS = {
  dato: '${dato}',
  mio: {
${keys.map(k => '    ' + q(k) + ': ' + out[k].mio).join(',\n')}
  }
};
`);
  console.log('Skrev ' + keys.length + ' numre til data/hitster-streams.js (' + rows.length + ' rækker hentet, ' + dato + ').');
  if (process.argv.includes('--vis')) keys.forEach(k => console.log(String(out[k].mio).padStart(5) + '  ' + k + '   <-   ' + out[k].row));
  if (missing.length) console.log('\nIkke på listen (' + missing.length + '): ' + missing.join('; '));
})().catch(e => { console.error('Fejl: ' + e.message); process.exit(1); });
