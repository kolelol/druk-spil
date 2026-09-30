# Drukspil

Gratis drukspil til telefonen. Ingen abonnement, ingen reklamer, ingen konto. Én telefon går på omgang.

Ren HTML/CSS/JS uden build-trin. Virker som installeret app (PWA) og uden net, når den først er åbnet én gang.

## Spil

| Spil | Kort fortalt |
| --- | --- |
| **Imposter** | Alle får det samme hemmelige ord, undtagen imposteren. Telefonen går på omgang, alle ser deres rolle, I snakker, stemmer og afslører. Varianter: *Klassisk* (imposteren ved det, og kender ikke ordet) og *Undercover* (ingen får det at vide, imposteren får bare et lignende ord). 1 eller flere impostere, valgfri snakketid, kategorier kan slås til og fra. |
| **Bombe** | Telefonen tikker i et hemmeligt antal sekunder. Sig et ord i kategorien (eller et ord med et bestemt forbogstav), og giv den videre. Den, der holder bomben, når den springer, drikker. Kan holde styr på, hvem der har bomben, hvis I har skrevet spillere ind. |
| **Jeg har aldrig** | Klassisk kortbunke. Har du prøvet det, drikker du. |
| **Mest sandsynlig** | Tæl til tre og peg. Flest fingre drikker. |
| **Hvem drikker?** | Kan I ikke blive enige, vælger appen en spiller og en straf. |

"Frækt indhold" på forsiden slår voksenkategorier og -kort til i alle spil.

## Kør den

**På computeren:** dobbeltklik `start.bat` (serverer mappen på port 3002 og åbner browseren). Manuelt:

```
python -m http.server 3002 --bind 0.0.0.0
```

**På telefonen, samme wifi:** åbn `http://<din-pc-ip>:3002` i telefonens browser.

**Gratis på nettet (anbefalet):** læg mappen på GitHub Pages (Settings, Pages, deploy from branch). Så har alle en URL, der virker overalt. Vælg derefter "Føj til hjemmeskærm" i telefonens browser, så ligger den som en app, og den virker også uden net.

Service worker og "Føj til hjemmeskærm" kræver https eller localhost. Over almindelig http på wifi virker spillene stadig, bare uden installation og offline.

## Opbygning

```
index.html                 skallen, loader scripts med ?v=N
style.css                  mørkt, stort og tydeligt, mobil først
app.js                     kerne: navigation, spillere, indstillinger, lyd (Web Audio), vibration, wake lock
games/imposter.js          Imposter
games/bombe.js             Bombe
games/decks.js             Jeg har aldrig, Mest sandsynlig, Hvem drikker
data/imposter-words.js     ordpar pr. kategori: [ord, lignende ord]
data/bombe-categories.js   kategorier + bogstaver
data/decks-data.js         kort og straffe
manifest.webmanifest, sw.js, icons/   PWA
```

Hvert spil registrerer sig med `App.register({ id, navn, kort, farve, render, onEnter, onLeave })` og sine knapper med `App.on('navn', fn)`. Knapper i HTML bruger `data-action="navn"`. Spillere og indstillinger gemmes i `localStorage`.

## Tilføj indhold

- **Nye Imposter-ord:** tilføj `['Ord', 'Lignende ord']` i den rigtige kategori i `data/imposter-words.js`. Ny kategori: nyt objekt med `id`, `navn`, `ord` (og `adult: true` hvis den kun skal vises med frækt indhold slået til).
- **Nye Bombe-kategorier:** tilføj en streng i `BOMBE_CATEGORIES` (eller `BOMBE_CATEGORIES_ADULT`).
- **Nye kort:** tilføj strenge i `JEG_HAR_ALDRIG`, `MEST_SANDSYNLIG` eller `HVEM_DRIKKER_STRAFFE` i `data/decks-data.js`.

## Når du ændrer filer

Bump `?v=N` på alle script/style-tags i `index.html` og `CACHE`/`V` i `sw.js`, ellers kan telefoner vise en gammel version.
