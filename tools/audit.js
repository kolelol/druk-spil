/* Statisk gennemgang af hele appen. Køres fra projektmappen:
     node --expose-internals tools/audit.js
   1. Ukendte navne: identifikatorer, der bruges, men aldrig erklæres nogen steder (glemte/omdøbte funktioner).
   2. Døde navne: funktioner og konstanter, der erklæres, men aldrig bruges.
   3. Knapper uden handler (data-action/-change/-input/-form i skabeloner) og handlere uden knap. */
const fs = require('fs');
const path = require('path');
const acorn = require('internal/deps/acorn/acorn/dist/acorn');
const walk = require('internal/deps/acorn/acorn-walk/dist/walk');

const FILES = process.env.AUDIT_FILES ? process.env.AUDIT_FILES.split(',') : ['app.js', 'spotify.js', 'games/bombe.js', 'games/spygame.js', 'games/hitster.js'];
const GLOBALS = new Set(('Object Array String Number Boolean Math JSON Date Promise Map Set WeakMap Symbol Error TypeError RegExp parseInt parseFloat isNaN isFinite ' +
  'undefined NaN Infinity console window document navigator localStorage sessionStorage location history performance fetch URL URLSearchParams ' +
  'setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame AbortController Audio AudioContext webkitAudioContext ' +
  'Uint8Array Uint32Array Float32Array ArrayBuffer DataView btoa atob encodeURIComponent decodeURIComponent TextEncoder crypto Event CustomEvent ' +
  'Intl alert arguments require module exports process HTMLElement Element Node screen self top globalThis queueMicrotask structuredClone ' +
  // data- og app-globaler, der er defineret i andre filer
  'App Spotify HITSTER_SONGS HITSTER_SONGS_DK HITSTER_STREAMS SPYGAME_WORDS BOMBE_CATEGORIES BOMBE_CATEGORIES_ADULT').split(/\s+/));

const declared = new Map();   // navn -> [filer]
const used = new Map();       // navn -> antal
const perFile = {};
const reportUnknown = [];

function patternNames(p, out){
  if (!p) return;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') p.properties.forEach(x => patternNames(x.value || x.argument, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach(x => patternNames(x, out));
  else if (p.type === 'AssignmentPattern') patternNames(p.left, out);
  else if (p.type === 'RestElement') patternNames(p.argument, out);
}

for (const f of FILES) {
  const src = fs.readFileSync(f, 'utf8');
  let ast;
  try { ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script', locations: true }); }
  catch (e) { console.log('PARSEFEJL', f, e.message); continue; }
  const decl = new Set(), refs = [];
  const dec = (n, where) => { decl.add(n); (declared.get(n) || declared.set(n, []).get(n)).push(f); perFile[f] = perFile[f] || {}; perFile[f][n] = where; };
  walk.full(ast, node => {
    switch (node.type) {
      case 'FunctionDeclaration': dec(node.id.name, node.loc.start.line); node.params.forEach(p => { const o = []; patternNames(p, o); o.forEach(n => decl.add(n)); }); break;
      case 'FunctionExpression': case 'ArrowFunctionExpression': node.params.forEach(p => { const o = []; patternNames(p, o); o.forEach(n => decl.add(n)); }); if (node.id) decl.add(node.id.name); break;
      case 'VariableDeclarator': { const o = []; patternNames(node.id, o); o.forEach(n => dec(n, node.loc.start.line)); break; }
      case 'CatchClause': if (node.param) { const o = []; patternNames(node.param, o); o.forEach(n => decl.add(n)); } break;
      case 'ClassDeclaration': if (node.id) dec(node.id.name, node.loc.start.line); break;
    }
  });
  // referencer: Identifier, der ikke er egenskabsnavn, nøgle eller label
  walk.ancestor(ast, { Identifier(node, state, anc) {
    const p = anc[anc.length - 2];
    if (p) {
      if (p.type === 'MemberExpression' && p.property === node && !p.computed) return;
      if ((p.type === 'Property' || p.type === 'MethodDefinition') && p.key === node && !p.computed && !p.shorthand) return;
      if (p.type === 'LabeledStatement' || p.type === 'BreakStatement' || p.type === 'ContinueStatement') return;
      if (p.type === 'FunctionDeclaration' && p.id === node) return;
      if (p.type === 'VariableDeclarator' && p.id === node) return;
    }
    refs.push(node);
  } });
  for (const r of refs) { used.set(r.name, (used.get(r.name) || 0) + 1); }
  perFile[f] = Object.assign(perFile[f] || {}, { __refs: refs, __decl: decl });
}
const allDecl = new Set([...declared.keys()]);
for (const f of FILES) {
  const x = perFile[f]; if (!x) continue;
  for (const r of x.__refs) {
    if (x.__decl.has(r.name) || allDecl.has(r.name) || GLOBALS.has(r.name)) continue;
    reportUnknown.push(f + ':' + r.loc.start.line + ' ' + r.name);
  }
}
console.log('=== 1. UKENDTE NAVNE (bruges, men erklæres ikke) ===');
console.log(reportUnknown.length ? [...new Set(reportUnknown)].join('\n') : 'ingen');

console.log('\n=== 2. DØDE NAVNE (erklæres, men bruges ikke andre steder end ved erklæringen) ===');
const dead = [];
for (const [n, files] of declared) {
  // et navn tæller som brugt, hvis der findes mindst én reference (erklæringer tæller ikke som reference)
  if (!(used.get(n) > 0)) dead.push(n + '  (' + [...new Set(files)].join(', ') + ' linje ' + files.map(f => perFile[f][n]).join('/') + ')');
}
console.log(dead.length ? dead.join('\n') : 'ingen');

console.log('\n=== 3. KNAPPER OG HANDLERE ===');
const html = FILES.map(f => fs.readFileSync(f, 'utf8')).join('\n') + fs.readFileSync('index.html', 'utf8');
const used3 = new Set();
for (const m of html.matchAll(/data-(?:action|change|input|form)=\\?"([a-zA-Z0-9_.]+)\\?"/g)) used3.add(m[1]);
for (const m of html.matchAll(/data-(?:action|change|input|form)=\$\{[^}]*\}/g)) { /* dynamiske: tjekkes ikke */ }
const regd = new Set();
for (const f of FILES) for (const m of fs.readFileSync(f, 'utf8').matchAll(/\bon\(\s*'([a-zA-Z0-9_.]+)'/g)) regd.add(m[1]);
for (const f of FILES) for (const m of fs.readFileSync(f, 'utf8').matchAll(/App\.on\(\s*'([a-zA-Z0-9_.]+)'/g)) regd.add(m[1]);
const dyn = new Set();
for (const f of FILES) for (const m of fs.readFileSync(f, 'utf8').matchAll(/(?:pick|backAction|action):\s*'([a-zA-Z0-9_.]+)'/g)) used3.add(m[1]);
for (const f of FILES) for (const m of fs.readFileSync(f, 'utf8').matchAll(/ui\.(?:toggle|seg|stepper|range)\([^)]*?'([a-z]+\.[a-zA-Z0-9_]+)'/g)) used3.add(m[1]);
for (const f of FILES) for (const m of fs.readFileSync(f, 'utf8').matchAll(/'((?:hit|imp|spy|bomb|seats|players|set|go)\.?[a-zA-Z0-9_]*)'/g)) used3.add(m[1]);
const noHandler = [...used3].filter(a => /^[a-z]+\.[a-zA-Z0-9_]+$|^go$/.test(a) && !regd.has(a));
const noButton = [...regd].filter(a => !used3.has(a));
console.log('knapper uden handler: ' + (noHandler.length ? noHandler.join(', ') : 'ingen'));
console.log('handlere uden knap:   ' + (noButton.length ? noButton.join(', ') : 'ingen'));
console.log('(handlere: ' + regd.size + ', knapper: ' + used3.size + ')');
