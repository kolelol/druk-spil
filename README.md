# Drukspil

Gratis drukspil til telefonen. Ingen abonnement, ingen reklamer, ingen konto. Én telefon går på omgang.

Ren HTML/CSS/JS uden build-trin. Virker som installeret app (PWA) og uden net, når den først er åbnet én gang.

## Spil

| Spil | Kort fortalt |
| --- | --- |
| **Imposter** | Alle får det samme hemmelige ord, undtagen imposteren. Telefonen går på omgang, alle ser deres rolle, I siger ét ord på skift, stemmer og afslører. Varianter: *Klassisk* (imposteren ved det, og kender ikke ordet) og *Undercover* (ingen får det at vide, imposteren får bare et lignende ord). 1 eller flere impostere, valgfri snakketid, kategorier kan slås til og fra. |
| **Bombe** | Telefonen tikker i et hemmeligt antal sekunder. Sig noget, der passer til opgaven, og giv den videre. To slags opgaver: *Kategori* ("Premier League-klubber", "Ting man mister i byen") og *Scenarie* ("Ting man siger til dørmanden, der ikke vil lukke dig ind", "Undskyldninger for at skippe træning"), eller blandet. Den, der holder bomben, når den springer, drikker. Kan holde styr på, hvem der har bomben, hvis I har skrevet spillere ind. |

| **Hitster** | Numre spiller over Spotify, og I gætter dem. Fire spiltyper: *Streams* (højere eller lavere: har den nye sang flere eller færre streams på Spotify end den forrige? Rigtigt giver et point, forkert koster slurke. Virker også uden Spotify, bare uden musik), *Klassisk* (sæt nummeret på rette plads i din tidslinje af årstal. Rigtigt: du beholder kortet. Forkert: du drikker, og kortet er væk. Først til målet vinder. Valgfri tid til at placere og bonus for kunstner og titel), *Kasser* (én gætter titel, kunstner og årstal, mens den næste spiller holder telefonen, ser svarene og sætter kryds. Hvert kryds er et point. Valgfri tid til at gætte) og *Klip* (hør 1, 5, 15 og 30 sekunder. Den, der gætter sangen først, får 4, 3, 2 eller 1 point). I Kasser, Klip og Streams drikker den med færrest point til sidst. Kan begrænses til numre fra 1980, 1990 eller 2000 og frem, og dansk musik kan slås til og fra. Kræver Spotify Premium hos den ene, der styrer telefonen (se nedenfor). |

"Frækt indhold" på forsiden slår voksenkategorier til i alle spil.

## Hitster og Spotify

Appen afspiller ikke musik selv. Den styrer Spotify på en af jeres enheder (telefonens Spotify-app, computeren eller en højttaler), så ét login er nok, og kun den, der logger ind, behøver Premium.

**Opsætning, én gang:**

1. Åbn [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) og din app, og tryk Settings.
2. Læg appens adresse ind under **Redirect URIs** og gem. Adressen vises i Hitster under "Første gang?". Spotify tillader kun `https://...` (fx GitHub Pages) eller `http://127.0.0.1:3002/`, aldrig `localhost` og aldrig almindelig http via wifi.
3. Står din egen Spotify-mail ikke under **User Management**, så læg den ind (en app i Development Mode har højst 5 brugere og kræver, at ejeren har Premium).

**Hver gang:** åbn Spotify-appen og spil et nummer i et par sekunder, så enheden er vågen. Åbn Hitster, tryk "Log ind med Spotify" første gang, vælg enhed under "Find enheder" og tryk "Test lyden".

Er Drukspil installeret som app på hjemmeskærmen og login ikke virker, så log ind fra browseren og brug Hitster derfra.

**Klip og forsinkelse:** Spotify er et øjeblik om at starte og stoppe, så et klip på 1 sekund kan lyde kortere eller længere. Under spiltypen Klip kan du trykke "Test 1 sek klip" og rette med "Justér klip (ms)", til det passer på jeres enhed.

## Kør den

**På computeren:** dobbeltklik `start.bat` (serverer mappen på port 3002 og åbner `http://127.0.0.1:3002`). Brug 127.0.0.1 og ikke localhost, ellers kan Hitster ikke logge ind på Spotify. Manuelt:

```
python -m http.server 3002 --bind 0.0.0.0
```

**På telefonen, samme wifi:** åbn `http://<din-pc-ip>:3002` i telefonens browser.

**Gratis på nettet (anbefalet):** læg mappen på GitHub Pages (Settings, Pages, deploy from branch). Så har alle en URL, der virker overalt. Vælg derefter "Føj til hjemmeskærm" i telefonens browser, så ligger den som en app, og den virker også uden net.

Service worker og "Føj til hjemmeskærm" kræver https eller localhost. Over almindelig http på wifi virker spillene stadig, bare uden installation og offline.

## Opbygning

```
index.html                 skallen, loader scripts med ?v=N
style.css                  spil-look: mørk blomme med bobler, tykke knapper, tekst med kant. Mobil først
fonts/                     Lilita One (SIL Open Font License), så skriften også virker offline
app.js                     kerne: navigation, spillere, indstillinger, lyd (Web Audio), vibration, wake lock, ikoner
spotify.js                 Spotify-klient til Hitster: login (PKCE), enheder, afspil/pause, find nummer
games/imposter.js          Imposter
games/bombe.js             Bombe
games/hitster.js           Hitster
data/imposter-words.js     ordpar pr. kategori: [ord, lignende ord]
data/bombe-categories.js   kategorier og scenarier
data/hitster-songs.js      numre: ['Titel', 'Kunstner', år], dansk musik i en separat liste
data/hitster-streams.js    antal streams i millioner pr. nummer (laves af tools/update-streams.js)
tools/update-streams.js    henter friske tal fra kworb.net: node tools/update-streams.js
manifest.webmanifest, sw.js, icons/   PWA
```

Hvert spil registrerer sig med `App.register({ id, navn, kort, farve, ikon, render, onEnter, onLeave })` og sine knapper med `App.on('navn', fn)`. `ikon` er en SVG-streng (64x64) med mørk kant, som vises på forsiden. Knapper i HTML bruger `data-action="navn"`. Spillere og indstillinger gemmes i `localStorage`.

## Tilføj indhold

- **Nye Imposter-ord:** tilføj `['Ord', 'Lignende ord']` i den rigtige kategori i `data/imposter-words.js`. Ny kategori: nyt objekt med `id`, `navn`, `ord` (og `adult: true` hvis den kun skal vises med frækt indhold slået til).
- **Nye Bombe-opgaver:** kategorier i `BOMBE_CATEGORIES`, scenarier i `BOMBE_SCENARIER` (og `*_ADULT`-listerne til frækt indhold) i `data/bombe-categories.js`.
- **Nye Hitster-numre:** tilføj `['Titel', 'Kunstner', år]` i `data/hitster-songs.js` (`HITSTER_SONGS_DK` til dansk). Året er det år, nummeret først udkom. Stav titel og kunstner som på Spotify, for appen finder nummeret ved at søge på dem. Numre, Spotify ikke har, springes over under spillet; se konsollen for "ingen match".
- **Streams-tal:** Spotify udleverer ikke antal streams, så tallene er et øjebliksbillede fra kworb.net (de 2500 mest streamede sange). Kør `node tools/update-streams.js` for at hente friske tal, også efter du har tilføjet nye numre. Scriptet skriver, hvilke numre der ikke er på listen; de er bare ikke med i spiltypen Streams.

## Når du ændrer filer

Bump `?v=N` på alle script/style-tags i `index.html` og `CACHE`/`V` i `sw.js`, ellers kan telefoner vise en gammel version.
