/* Spotify: log ind (PKCE, ingen hemmelighed), find enheder, styr afspilning og find numre.
   Bruges af Hitster. Den, der logger ind, skal have Spotify Premium. Client ID er offentligt og må ligge her;
   et client secret må aldrig lægges i appen. */
'use strict';
const Spotify = (() => {
  const CLIENT_ID = '45ec69ab55bb426bad340dbb6f481009';
  const SCOPES = 'user-read-playback-state user-modify-playback-state';
  const API = 'https://api.spotify.com/v1';
  const ACCOUNTS = 'https://accounts.spotify.com';
  const TOKEN_KEY = 'drukspil.spotify.token';
  const AUTH_KEY = 'drukspil.spotify.auth';
  const TRACK_KEY = 'drukspil.spotify.tracks';

  class SpotifyError extends Error {
    constructor(message, status, reason){ super(message); this.status = status || 0; this.reason = reason || ''; }
  }

  const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const put = (k, v) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* ---------- login (Authorization Code med PKCE) ---------- */
  const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const rnd = n => b64url(crypto.getRandomValues(new Uint8Array(n)));
  const challenge = async v => b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)));
  /* Adressen skal stå præcis sådan i Spotify Dashboard under Redirect URIs */
  const redirectUri = () => location.origin + location.pathname.replace(/index\.html$/, '');

  /* Spotify tillader kun https eller 127.0.0.1 som redirect, aldrig localhost eller almindelig http */
  function blocked(){
    const h = location.hostname;
    if (h === 'localhost') return 'localhost';
    if (location.protocol !== 'https:' && h !== '127.0.0.1' && h !== '[::1]') return 'http';
    if (!window.crypto || !crypto.subtle) return 'http';
    return '';
  }

  async function login(){
    const verifier = rnd(48), state = rnd(16);
    put(AUTH_KEY, { v: verifier, s: state, r: redirectUri() });
    const q = new URLSearchParams({
      response_type: 'code', client_id: CLIENT_ID, scope: SCOPES, redirect_uri: redirectUri(),
      state, code_challenge_method: 'S256', code_challenge: await challenge(verifier)
    });
    location.href = ACCOUNTS + '/authorize?' + q;
  }

  const hasCallback = () => !!get(AUTH_KEY) && /[?&](code|error)=/.test(location.search);

  /* Kaldes, når siden er åbnet igen efter login. Giver 'ok', en fejltekst eller null (intet login i gang). */
  async function callback(){
    if (!hasCallback()) return null;
    const auth = get(AUTH_KEY);
    put(AUTH_KEY, null);
    const p = new URLSearchParams(location.search);
    history.replaceState(null, '', redirectUri());
    if (p.get('state') !== auth.s) return 'Svaret fra Spotify passede ikke til dit login. Prøv igen.';
    if (p.get('error')) return p.get('error') === 'access_denied' ? 'Du afviste login hos Spotify.' : 'Spotify afviste login: ' + p.get('error');
    try {
      await tokenRequest({ grant_type: 'authorization_code', code: p.get('code'), redirect_uri: auth.r, code_verifier: auth.v });
      return 'ok';
    } catch (e) { return explain(e); }
  }

  async function tokenRequest(params){
    let res;
    try {
      res = await fetch(ACCOUNTS + '/api/token', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(Object.assign({ client_id: CLIENT_ID }, params))
      });
    } catch (e) { throw new SpotifyError('Ingen forbindelse til Spotify.', 0, 'NETWORK'); }
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new SpotifyError(d.error_description || d.error || 'Login mislykkedes', res.status, d.error || 'TOKEN');
    const old = get(TOKEN_KEY) || {};
    put(TOKEN_KEY, { access: d.access_token, refresh: d.refresh_token || old.refresh, exp: Date.now() + (d.expires_in - 30) * 1000 });
  }

  let refreshing = null;
  async function token(){
    const t = get(TOKEN_KEY);
    if (!t) throw new SpotifyError('Ikke logget ind', 401, 'NO_TOKEN');
    if (Date.now() < t.exp) return t.access;
    if (!t.refresh) { put(TOKEN_KEY, null); throw new SpotifyError('Ikke logget ind', 401, 'NO_TOKEN'); }
    refreshing = refreshing || tokenRequest({ grant_type: 'refresh_token', refresh_token: t.refresh }).finally(() => { refreshing = null; });
    try { await refreshing; }
    catch (e) { if (e.reason === 'invalid_grant') put(TOKEN_KEY, null); throw e; }
    return get(TOKEN_KEY).access;
  }

  const loggedIn = () => !!get(TOKEN_KEY);
  const logout = () => put(TOKEN_KEY, null);

  /* ---------- web-API ---------- */
  async function raw(method, path, body){
    const tok = await token();
    try {
      return await fetch(API + path, {
        method, body: body ? JSON.stringify(body) : undefined,
        headers: Object.assign({ Authorization: 'Bearer ' + tok }, body ? { 'Content-Type': 'application/json' } : {})
      });
    } catch (e) { throw new SpotifyError('Ingen forbindelse til Spotify.', 0, 'NETWORK'); }
  }
  async function api(method, path, body){
    let res = await raw(method, path, body);
    if (res.status === 401) {   // nøglen var udløbet alligevel: tving en ny og prøv én gang til
      const t = get(TOKEN_KEY);
      if (t) { t.exp = 0; put(TOKEN_KEY, t); }
      res = await raw(method, path, body);
    }
    if (res.status === 204 || res.status === 202) return null;
    const d = await res.json().catch(() => null);
    if (!res.ok) {
      const er = (d && d.error) || {};
      throw new SpotifyError(er.message || 'Spotify svarede ' + res.status, res.status, er.reason || '');
    }
    return d;
  }

  const devices = async () => ((await api('GET', '/me/player/devices')).devices || []).filter(d => !d.is_restricted);
  const dev = id => id ? '?device_id=' + encodeURIComponent(id) : '';
  const play = (uri, deviceId) => api('PUT', '/me/player/play' + dev(deviceId), { uris: [uri], position_ms: 0 });
  const pause = deviceId => api('PUT', '/me/player/pause' + dev(deviceId));
  const resume = deviceId => api('PUT', '/me/player/play' + dev(deviceId));   // uden nummer: fortsætter, hvor pausen var

  /* ---------- find nummeret på Spotify ---------- */
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const has = (hay, needle) => (' ' + norm(hay) + ' ').includes(' ' + norm(needle) + ' ');
  const BAD = /\b(live|remix|karaoke|instrumental|acoustic|tribute|cover|version|edit|sped up|slowed|nightcore)\b/i;
  const tracks = get(TRACK_KEY) || {};
  const pending = {};

  async function search(q){
    const d = await api('GET', '/search?' + new URLSearchParams({ q, type: 'track', limit: '10', market: 'DK' }));
    return (d && d.tracks && d.tracks.items) || [];
  }
  /* Titel og kunstner skal passe. Blandt dem vælges den udgave, hvis album ligger tættest på det rigtige år,
     så vi får originalen og ikke en live-version eller et samlealbum. */
  function pickBest(items, song){
    let best = null, bs = -Infinity;
    for (const it of items) {
      if (!has(it.name, song.t) || !it.artists.some(a => has(a.name, song.a))) continue;
      const y = parseInt(it.album && it.album.release_date, 10);
      let s = y ? -Math.min(20, Math.abs(y - song.y)) : -10;
      if (BAD.test(it.name + ' ' + (it.album ? it.album.name : '')) && !BAD.test(song.t)) s -= 15;
      if (it.album && it.album.album_type === 'compilation') s -= 4;
      if (norm(it.name) === norm(song.t)) s += 3;
      if (s > bs) { bs = s; best = it; }
    }
    return best;
  }
  const clean = s => s.replace(/"/g, '');

  /* Giver { uri, name, img } eller null, hvis Spotify ikke har det rigtige nummer */
  function findTrack(song){
    const key = song.t + '|' + song.a;
    if (tracks[key]) return Promise.resolve(tracks[key]);
    if (pending[key]) return pending[key];
    pending[key] = (async () => {
      let best = pickBest(await search(`track:"${clean(song.t)}" artist:"${clean(song.a)}"`), song);
      if (!best) best = pickBest(await search(clean(song.t) + ' ' + clean(song.a)), song);
      if (!best) { console.warn('Hitster: ingen match på Spotify for', song.t, song.a); return null; }
      const im = (best.album && best.album.images) || [];
      const out = { uri: best.uri, name: best.name + ' af ' + best.artists[0].name, img: (im[1] || im[0] || {}).url || '' };
      tracks[key] = out;
      const keys = Object.keys(tracks);
      if (keys.length > 800) delete tracks[keys[0]];
      put(TRACK_KEY, tracks);
      return out;
    })().finally(() => { delete pending[key]; });
    return pending[key];
  }

  /* Fejl på dansk, så de kan vises direkte på skærmen */
  function explain(e){
    const r = e && e.reason, s = e && e.status;
    if (r === 'NETWORK') return 'Ingen forbindelse til Spotify. Tjek nettet og prøv igen.';
    if (r === 'NO_TOKEN' || r === 'invalid_grant' || s === 401) return 'Du er logget ud af Spotify. Log ind igen.';
    if (r === 'PREMIUM_REQUIRED') return 'Spotify kræver Premium for at styre afspilning.';
    if (r === 'NO_ACTIVE_DEVICE' || s === 404) return 'Ingen afspiller fundet. Åbn Spotify-appen, tryk play på et nummer, og vælg enheden igen.';
    if (r === 'invalid_client' || r === 'invalid_request') return 'Spotify afviste loginet: ' + (e.message || r) + '. Tjek, at adressen er tilføjet som Redirect URI i Spotify Dashboard.';
    if (s === 403) return 'Spotify sagde nej. Står din Spotify-mail under User Management i Dashboard, og har du Premium?';
    if (s === 429) return 'Spotify beder os vente lidt. Prøv igen om et øjeblik.';
    return (e && e.message) || 'Noget gik galt med Spotify.';
  }

  return { SpotifyError, blocked, redirectUri, login, hasCallback, callback, loggedIn, logout, devices, play, pause, resume, findTrack, explain };
})();
