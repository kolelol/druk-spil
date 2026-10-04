/* Henter antal streams fra kworb.net og skriver data/hitster-streams.js (bruges af spiltypen Streams i Hitster).
   Spotifys eget API udleverer ikke streams, så tallene er et øjebliksbillede fra den dag, scriptet køres.
   Kør fra projektmappen:  node tools/update-streams.js      (tager et par minutter)
   Husk bagefter at bumpe ?v=N i index.html og CACHE/V i sw.js.

   Sådan findes tallene:
   1. Den globale topliste (de 2500 mest streamede sange).
   2. For resten: kunstnerens egen side på kworb, som viser alle kunstnerens sange. Siden kræver kunstnerens
      Spotify-ID. Det findes på kworbs danske hitliste eller i Wikidata og gemmes i tools/artist-ids.json.
      Mangler en kunstner, kan ID'et lægges ind i den fil i hånden (det er koden sidst i kunstnerens Spotify-link). */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'hitster-streams.js');
const IDS = path.join(__dirname, 'artist-ids.json');
const TOP = 'https://kworb.net/spotify/songs.html';
const DK = 'https://kworb.net/spotify/country/dk_weekly_totals.html';
const artistPage = id => 'https://kworb.net/spotify/artist/' + id + '_songs.html';
const UA = { 'User-Agent': 'drukspil-hitster/1.0 (https://kolelol.github.io/druk-spil/)' };

const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => String(s).toLowerCase().replace(/ø/g, 'o').replace(/æ/g, 'ae').normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, ' ').trim();
const has = (hay, needle) => (' ' + norm(hay) + ' ').includes(' ' + norm(needle) + ' ');
/* "Titel (feat. X) - Remastered 2011" -> "Titel" */
const base = t => t.replace(/\s*[\(\[].*$/, '').replace(/\s+-\s.*$/, '').trim() || t;
const unesc = s => s.replace(/&amp;/g, '&').replace(/&#0?39;/g, "'").replace(/&quot;/g, '"');
const BAD = /\b(live|remix|karaoke|instrumental|acoustic|akustisk|sped up|slowed|demo)\b/i;
/* Lighed mellem to titler (Dice på bogstavpar), så små staveforskelle ikke vælter et match */
function sim(a, b){
  a = norm(a).replace(/ /g, ''); b = norm(b).replace(/ /g, '');
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const m = new Map(); for (let i = 0; i < a.length - 1; i++) { const g = a.substr(i, 2); m.set(g, (m.get(g) || 0) + 1); }
  let hit = 0; for (let i = 0; i < b.length - 1; i++) { const g = b.substr(i, 2); const n = m.get(g) || 0; if (n > 0) { m.set(g, n - 1); hit++; } }
  return 2 * hit / (a.length + b.length - 2);
}
const sameTitle = (x, t) => (!BAD.test(x) || BAD.test(t)) && (norm(x) === norm(t) || norm(base(x)) === norm(base(t)) || sim(base(x), base(t)) >= 0.9);
/* Numre, som kworb fører under en anden kunstner end hitster-songs.js */
const ALIAS = { 'We Found Love|Rihanna': 'Calvin Harris' };

function songs(){
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', 'hitster-songs.js'), 'utf8') + '\nthis.I = HITSTER_SONGS; this.D = HITSTER_SONGS_DK;', ctx);
  return ctx.I.map(s => ({ t: s[0], a: s[1], dk: false })).concat(ctx.D.map(s => ({ t: s[0], a: s[1], dk: true })));
}

let last = 0;
async function get(url, gap){
  for (let i = 0; i < 4; i++) {
    const wait = (gap || 250) - (Date.now() - last); if (wait > 0) await sleep(wait); last = Date.now();
    try {
      const r = await fetch(url, { headers: UA });
      if (r.status === 404) return null;
      if (r.ok) return r;
      await sleep(2000);
    } catch (e) { await sleep(2000); }
  }
  return null;
}

/* En kunstners sange med samlede streams, fra kunstnerens side på kworb */
const pages = {};
async function artistSongs(id){
  if (id in pages) return pages[id];
  const r = await get(artistPage(id));
  const rows = [];
  if (r) {
    const html = await r.text();
    const re = /<tr><td class="text"><div>(.*?)<\/div><\/td><td>([\d,]+)<\/td>/g;
    let m;
    while ((m = re.exec(html))) rows.push({ t: unesc(m[1].replace(/<[^>]+>/g, '')).replace(/^\*\s*/, ''), n: Number(m[2].replace(/,/g, '')) });
  }
  return (pages[id] = rows);
}
const bestRow = (rows, t) => rows.filter(r => sameTitle(r.t, t)).sort((x, y) => y.n - x.n)[0];

/* Mulige Spotify-ID'er for et kunstnernavn fra Wikidata (egenskaben P1902) */
async function wikidataIds(name){
  const s = await get('https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=da&uselang=da&type=item&limit=6&search=' + encodeURIComponent(name), 120);
  const hits = s ? ((await s.json()).search || []).map(x => x.id) : [];
  if (!hits.length) return [];
  const e = await get('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=' + hits.join('|'), 120);
  const ent = e ? (await e.json()).entities || {} : {};
  const out = [];
  for (const q of hits) for (const c of ((ent[q] || {}).claims || {}).P1902 || []) { const v = c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value; if (v && !out.includes(v)) out.push(v); }
  return out;
}

(async () => {
  const all = songs();
  const key = s => s.t + '|' + s.a;
  const out = {};

  /* 1. Den globale topliste */
  const res = await get(TOP);
  if (!res) throw new Error('kworb svarede ikke');
  const rows = [];
  const re = /<tr><td class="text"><div>(.*?)<\/div><\/td><td>([\d,]+)<\/td>/g;
  const html = await res.text();
  let m;
  while ((m = re.exec(html))) {
    const txt = unesc(m[1].replace(/<[^>]+>/g, ''));
    const i = txt.indexOf(' - ');
    if (i > 0) rows.push({ a: txt.slice(0, i), t: txt.slice(i + 3), n: Number(m[2].replace(/,/g, '')) });
  }
  if (rows.length < 500) throw new Error('Fandt kun ' + rows.length + ' rækker på toplisten. Har siden ændret format?');
  for (const s of all) {
    const a = ALIAS[key(s)] || s.a;
    const cand = rows.filter(r => (has(r.a, a) || has(a, r.a)) && (has(r.t, s.t) || has(r.t, base(s.t))) && (!BAD.test(r.t) || BAD.test(s.t)));
    const exact = cand.filter(r => norm(base(r.t)) === norm(base(s.t)) || norm(r.t) === norm(s.t));
    const best = (exact.length ? exact : cand).sort((x, y) => y.n - x.n)[0];
    if (best) out[key(s)] = best.n;
  }
  console.log('Toplisten: ' + Object.keys(out).length + ' numre.');

  /* 2. Kunstnernes egne sider for resten */
  const ids = fs.existsSync(IDS) ? JSON.parse(fs.readFileSync(IDS, 'utf8')) : {};
  const need = {};
  all.filter(s => !(key(s) in out)).forEach(s => { (need[s.a] = need[s.a] || []).push(s); });
  const dkRes = await get(DK);
  const chart = {};
  if (dkRes) for (const x of (await dkRes.text()).matchAll(/artist\/([A-Za-z0-9]{22})\.html">([^<]+)<\/a>/g)) { const n = norm(unesc(x[2])); chart[n] = chart[n] || {}; chart[n][x[1]] = (chart[n][x[1]] || 0) + 1; }
  const noId = [];
  let done = 0;
  for (const a of Object.keys(need)) {
    let cands = ids[a] ? [ids[a]] : Object.keys(chart[norm(a)] || {}).sort((x, y) => chart[norm(a)][y] - chart[norm(a)][x]).slice(0, 3);
    if (!cands.length) cands = (await wikidataIds(a)).slice(0, 3);
    /* vælg det ID, hvis side kender flest af vores titler: det sikrer, at det er den rigtige kunstner */
    let pick = null, score = 0;
    for (const id of cands) {
      const sc = need[a].filter(s => bestRow((pages[id] || []).length ? pages[id] : [], s.t)).length;
      const list = await artistSongs(id);
      const n = need[a].filter(s => bestRow(list, s.t)).length;
      if (n > score || (!pick && sc)) { pick = id; score = n; }
    }
    if (!pick || !score) { noId.push(a); continue; }
    ids[a] = pick;
    for (const s of need[a]) { const r = bestRow(pages[pick], s.t); if (r) out[key(s)] = r.n; }
    if (++done % 40 === 0) console.log('  kunstnersider: ' + done + ' af ' + Object.keys(need).length);
  }
  fs.writeFileSync(IDS, JSON.stringify(Object.fromEntries(Object.entries(ids).sort((x, y) => x[0].localeCompare(y[0], 'da'))), null, 1) + '\n');

  /* Tal i millioner: én decimal under 100 mio., så små danske numre kan skelnes */
  const mio = n => n >= 1e8 ? Math.round(n / 1e6) : Math.round(n / 1e5) / 10;
  const keys = Object.keys(out).filter(k => out[k] >= 1e6)   // under 1 mio. er det oftest en anden udgave af sangen.sort((x, y) => out[y] - out[x]);
  const q = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  const dato = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(OUT,
`/* Antal streams på Spotify i millioner, hentet fra kworb.net. Laves af tools/update-streams.js, ret ikke i hånden.
   Nøglen er 'Titel|Kunstner' som i hitster-songs.js. Numre uden tal her er ikke med i spiltypen Streams. */
const HITSTER_STREAMS = {
  dato: '${dato}',
  mio: {
${keys.map(k => '    ' + q(k) + ': ' + mio(out[k])).join(',\n')}
  }
};
`);
  const have = new Set(keys);
  const dk = all.filter(s => s.dk), intl = all.filter(s => !s.dk);
  console.log('Skrev ' + keys.length + ' numre til data/hitster-streams.js (' + dato + ').');
  console.log('Internationale: ' + intl.filter(s => have.has(key(s))).length + ' af ' + intl.length + '. Danske: ' + dk.filter(s => have.has(key(s))).length + ' af ' + dk.length + '.');
  if (noId.length) console.log('\nKunstnere uden side (' + noId.length + '): ' + noId.join('; '));
  const miss = all.filter(s => !have.has(key(s)) && !noId.includes(s.a));
  if (miss.length && process.argv.includes('--vis')) console.log('\nNumre, der ikke blev fundet på kunstnerens side (' + miss.length + '): ' + miss.map(s => s.t + ' (' + s.a + ')').join('; '));
})().catch(e => { console.error('Fejl: ' + e.message); process.exit(1); });
