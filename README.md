# Drukspil

Gratis drukspil til telefonen. Ingen abonnement, ingen reklamer, ingen konto. Én telefon går på omgang.

Ren HTML/CSS/JS uden build-trin. Virker som installeret app (PWA) og uden net, når den først er åbnet én gang.

## Spil

| Spil | Kort fortalt |
| --- | --- |
| **Imposter** | Den rene udgave, alle kender: alle får det samme hemmelige ord, imposteren får intet. Telefonen går på omgang, I siger ét ord på skift, stemmer én gang og afslører. Imposteren starter aldrig. Afstemningen kræver to tryk (tryk på et navn, tryk igen for "Ud med X?"). Bliver imposteren taget, får imposteren ét gæt på ordet. Ingen indstillinger. Ordene er de samme slags, som de kendte Imposter-apps bruger: 450 konkrete ting, dyr, steder, kendte og figurer. Hvert ord er vurderet af fem testpersoner for, hvor sjovt det er, og hvor nemt det er at sige noget om, og kun dem med mindst 3 i begge er med. Før den store spilleaften (2026-10-16) gennemgik fire testpersoner alt igen, og alt, som bare én af dem stejlede over, røg ud. |
| **Bombe** | Tryk på Bombe, og den tikker med det samme i et hemmeligt antal sekunder. Nævn noget i kategorien ("Bilmærker", "Hovedstæder i verden", "Michael Jackson-sange"), og giv telefonen fysisk videre, ingen knapper undervejs. Når den springer, drikker den, der holder den, og et tryk hvor som helst starter næste runde. Kategorierne er kopieret fra den klassiske kategorispilsliste (Scattergories / Stop the bus) og 5 Second Rule-kortene, oversat og vurderet af fem testpersoner (43 er tilbage efter ejerens egen gennemgang 2026-10-16, hvor hverdagslisterne røg ud, og Urmærker, Hovedstæder i verden, Amerikanske præsidenter, Michael Jackson-sange og Film med Mads Mikkelsen kom ind; ingen frække), og de skifter tema hver gang, så to ens ikke kommer i træk. En kategori, der har været vist, kommer ikke igen, før appen har været lukket helt. Først når alle har været vist, kommer de ældste tilbage. Man kan skifte kategori én gang pr. runde. Mens den tikker, kræver tilbage-pilen to tryk, så den, der holder bomben, ikke kan stikke af. Indstillinger (tid) ligger bag et link på eksplosionsskærmen. |

| **Hitster** | Numre spiller over Spotify, og I gætter dem. Fire spiltyper: *Streams* (højere eller lavere: har den nye sang flere eller færre streams på Spotify end den forrige? Rigtigt giver et point, forkert koster slurke. Sværheden stiger undervejs: de første sange ligger langt fra hinanden, så man kommer i gang, og så rykker de tættere og tættere på. Let, Mellem og Svær bestemmer, hvor tæt de ender, og hvor hurtigt det går. Der kan sættes 5 eller 10 sekunder til at svare. Virker også uden Spotify, bare uden musik), *Klassisk* (sæt nummeret på rette plads i din tidslinje af årstal. Rigtigt: du beholder kortet. Forkert: du drikker, og kortet er væk. Først til målet vinder. Valgfri tid til at placere og bonus for kunstner og titel), *Kasser* (én gætter titel, kunstner og årstal, mens den næste spiller holder telefonen, ser svarene og sætter kryds. Hvert kryds er et point. Valgfri tid til at gætte) og *Klip* (som Songless og Songspot: hver spiller får sin egen sang og hører først et halvt sekund. Gæt ved at søge efter titlen. Skip eller et forkert gæt skubber muren et stykke ud (1, 1,5, 2, 3, 4, 5, 7, 10, 15, 20 og 30 sekunder), og sangen kører videre, hvor den var. Din tid er, hvor langt muren stod, da du gættede. Får du den ikke, tæller den 40 sekunder, og du drikker. Laveste samlede tid vinder. Fem sværhedsgrader efter, hvor kendt sangen er: Let, Mellem, Svær, Ekspert og Umulig). I Kasser og Streams drikker den med færrest point til sidst, i Klip den med den længste tid. **Streams og Klip kan spilles alene** (vælg Alene under spiltypen): i Streams spiller du, til du svarer forkert, og rekorden er din længste streak; i Klip får du 10 sange, og rekorden er din korteste samlede tid. Hver kombination af sværhed, musik og år har sin egen rekord, og appen siger til, når du slår den. Sværheden kan skiftes inde i spillet (alene starter det en ny runde, sammen gælder det fra næste sang), og en sang, der har været spillet, kommer ikke igen, før appen har været lukket helt. Kan begrænses til numre fra 1980, 1990 eller 2000 og frem, og musikken vælges som "Alt", "Kun dansk" eller "Uden dansk" (366 internationale og 562 danske numre; "Alt" blander lige mange af hver, fra Gasolin' og Bamses Venner til Gilli og D1MA). Streams har tal for 364 internationale og 290 danske numre og kan også spilles som Kun dansk. Kræver Spotify Premium hos den ene, der styrer telefonen (se nedenfor). |

| **Spygame** | Alle får det samme ord i en kategori, spionen får kun kategorien. Stil spørgsmål til hinanden rundt om bordet på én skærm, svar uden at sige ordet, og stem på, hvem spionen er (to tryk på navnet). Spionen kan se alle ordene i kategorien, og bliver spionen taget, får spionen ét gæt på ordet ligesom i Imposter. Antal spioner og kategorier ligger under Indstillinger. Knap 500 ord, kun rigtige og velkendte navne og ting. |

Midt i en runde kræver tilbage-pilen i Imposter og Spygame to tryk ("Tryk igen for at afbryde runden"), og "Fjern alle" på spillerskærmen kræver også to tryk. Begge dele er der, fordi testpersonerne ellers mistede hele runden på ét fejltryk.

**Bordplan:** under Spillere (og i Imposter) kan I sætte pladserne: tryk på navnene i den rækkefølge, I sidder rundt om bordet. Telefonen går så rundt i den rækkefølge i Imposter, Spygame og Hitster, i stedet for hen over bordet. Næste runde starter hos den, der har telefonen, og har en anden den, trykker man bare på dem på bordet.

"Frækt indhold" på forsiden slår voksenkategorier til i Imposter og Spygame. Bombe har ingen.

## Hitster og Spotify

Appen afspiller ikke musik selv. Den styrer Spotify på en af jeres enheder (telefonens Spotify-app, computeren eller en højttaler), så ét login er nok, og kun den, der logger ind, behøver Premium.

**Opsætning, én gang:**

1. Åbn [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) og din app, og tryk Settings.
2. Læg appens adresse ind under **Redirect URIs** og gem. Adressen vises i Hitster under "Første gang?". Spotify tillader kun `https://...` (fx GitHub Pages) eller `http://127.0.0.1:3002/`, aldrig `localhost` og aldrig almindelig http via wifi.
3. Står din egen Spotify-mail ikke under **User Management**, så læg den ind (en app i Development Mode har højst 5 brugere og kræver, at ejeren har Premium).

**Hver gang:** åbn Spotify-appen og spil et nummer i et par sekunder, så enheden er vågen. Under spillet holder appen selv Spotify vågen: når musikken skal stoppe (pause, efter et klip, mellem ture), sætter den et nummer uden lyd på i stedet for at pause, for en pauset Spotify-app på iPhone bliver ellers lukket ned af systemet, og så skal man ind i Spotify og trykke play igen. Åbn Hitster, tryk "Log ind med Spotify" første gang, vælg enhed under "Find enheder" og tryk "Test lyden".

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
games/spygame.js           Spygame
games/hitster.js           Hitster
data/imposter-words.js     ord pr. kategori
data/bombe-categories.js   kategorier
data/spygame-words.js      ord pr. kategori til Spygame
data/hitster-songs.js      numre: ['Titel', 'Kunstner', år], dansk musik i en separat liste
data/hitster-streams.js    antal streams i millioner pr. nummer (laves af tools/update-streams.js)
tools/update-streams.js    henter friske tal fra kworb.net: node tools/update-streams.js
tools/artist-ids.json      kunstnernes Spotify-ID, som scriptet bruger til at finde deres side
manifest.webmanifest, sw.js, icons/   PWA
```

Hvert spil registrerer sig med `App.register({ id, navn, kort, farve, ikon, render, onEnter, onLeave })` og sine knapper med `App.on('navn', fn)`. `ikon` er en SVG-streng (64x64) med mørk kant, som vises på forsiden. Knapper i HTML bruger `data-action="navn"`. Spillere og indstillinger gemmes i `localStorage`.

## Tilføj indhold

Ejeren har bedt om, at der ikke bliver tilføjet ord til Imposter, Spygame og Bombe, kun fjernet. Opfundne ting, citater og ting, en udenforstående tror, unge synes er sjove, er netop det, der er blevet kaldt "cringe". Er man i tvivl om et ord, skal det ud.

- **Nye Imposter-ord:** tilføj ordet i den rigtige kategori i `data/imposter-words.js`. Konkrete ting, alle kender, og som kan beskrives med ét ord. Ny kategori: nyt objekt med `id`, `navn`, `ord` (og `adult: true` hvis den kun skal vises med frækt indhold slået til).
- **Nye Bombe-kategorier:** læg dem i det rigtige tema i `BOMBE_CATEGORIES` i `data/bombe-categories.js`. Tag dem fra kendte kategorispil (Scattergories, 5 Second Rule, Tick Tack Bumm) i stedet for at opfinde dem: ejeren vil have lister, der beviseligt virker. Spillet skifter tema hver gang, så temaerne skal være forskellige i slags.
- **Nye Spygame-ord:** i den rigtige kategori i `data/spygame-words.js`. Kategorien alene må ikke hjælpe spionen, så hold kategorierne brede.
- **Nye Hitster-numre:** tilføj `['Titel', 'Kunstner', år]` i `data/hitster-songs.js` (`HITSTER_SONGS_DK` til dansk). Året er det år, nummeret først udkom. Slå det op, og stol ikke på én kilde: streamingtjenester viser ofte genudgivelsens år. Den danske liste er lavet ved kun at tage numre, hvor to kilder (MusicBrainz, Deezer, iTunes) var enige. Stav titel og kunstner som på Spotify, for appen finder nummeret ved at søge på dem. Numre, Spotify ikke har, springes over under spillet; se konsollen for "ingen match".
- **Streams-tal:** Spotify udleverer ikke antal streams, så tallene er et øjebliksbillede fra kworb.net: først den globale topliste, derefter kunstnerens egen side for resten. Kør `node tools/update-streams.js` (et par minutter) for at hente friske tal, også efter du har tilføjet nye numre. Kunstnere, kworb ikke har en side for, får ingen tal og er ikke med i spiltypen Streams. Kunstnernes Spotify-ID gemmes i `tools/artist-ids.json`.

## Når du ændrer filer

Bump `?v=N` på alle script/style-tags i `index.html` og `CACHE`/`V` i `sw.js`, ellers kan telefoner vise en gammel version.
