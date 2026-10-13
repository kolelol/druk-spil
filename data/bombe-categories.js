/* Bombe: kategorier i temaer. Nævn noget, der passer, og giv bomben videre.
   Listen er kopieret fra andres, som ejeren bad om (2026-10-11): den klassiske kategorispilsliste (Scattergories /
   "Stop the bus", 200+ kategorier fra eslvault.com), de generelle "nævn tre ting"-kort fra 5 Second Rule
   (partygamesnight.com) og det danske drukspil "Kategorier" (bilmærker, danske byer). Oversat, ikke opfundet.
   Udeladt fra kilderne: ord-lege ("et ord på 8 bogstaver"), åbne "måder at..."-opgaver og rene paratvidens-lister.
   Temaerne bruges af spillet til at skifte slags hver gang. Hold det danske nede.
   BOMBE_CATEGORIES_ADULT vises kun med "Frækt indhold" slået til.
   Hver kategori er vurderet af fem testpersoner (sjov 3+, nem 3,4+); resten er fjernet (2026-10-12). */
const BOMBE_CATEGORIES = [
  { tema: 'Byen og druk', ord: [
    'Ølmærker', 'Shots', 'Cocktails', 'Spiritus', 'Drukspil', 'Festsange alle kender',

    'Natmad',
    'Ting man mister i byen',
    'Festivaler'
  ]},
  { tema: 'Mad og drikke', ord: [
    'Mad', 'Drikkevarer', 'Morgenmad', 'Frugter', 'Grøntsager', 'Noget på en pizza', 'Usund mad', 'Desserter',
    'Udenlandsk mad', 'Saucer', 'Noget i en sandwich',
    'Fastfood', 'Is-smage', 'Slik', 'Sodavand', 'Kager',
    'Ting i et køleskab', 'Ting man kan grille', 'Pålæg'
  ]},
  { tema: 'Dyr', ord: [
    'Dyr', 'Dyr i havet', 'Kæledyr', 'Dyr på en bondegård', 'Hunderacer', 'Dyr i junglen',
    'Dyr i zoo', 'Farlige dyr', 'Dyr der bider', 'Dyrelyde'
  ]},
  { tema: 'Sport', ord: [
    'Sportsgrene', 'Sportshold', 'Sportsstjerner', 'Sportsudstyr', 'Slags bolde', 'Ting på et stadion', 'Fodboldspillere',
    'Fodboldklubber', 'Premier League-klubber', 'Øvelser i fitness', 'Sportsmærker', 'Ting man kan ride på'
  ]},
  { tema: 'Gaming og internet', ord: [
    'Videospil', 'Apps', 'Sociale medier', 'Streamingtjenester', 'Computerspil', 'Playstation-spil', 'Mobilspil', 'Pokémon',
    'Spil man spillede som barn', 'Youtubere', 'Emojis', 'Hjemmesider'
  ]},
  { tema: 'Mærker og ting', ord: [
    'Bilmærker', 'Tøjmærker', 'Sneakermærker', 'Store firmaer', 'Supermarkeder',
    'Tøj', 'Sko', 'Ting på hovedet', 'Legetøj',
    'Værktøj',
    'Våben', 'Instrumenter', 'Transportmidler', 'Ting med hjul', 'Ting der flyver',
    'Ting i en kuffert', 'Ting i et køkken', 'Ting på et badeværelse', 'Ting i et soveværelse', 'Ting i en bil', 'Ting i en lufthavn',
    'Ting på en strand', 'Ting man tager med på camping',
    'Ting der kan eksplodere'
  ]},
  { tema: 'Verden', ord: [
    'Lande', 'Byer', 'Byer i Danmark', 'Byer i USA',
    'Halloween-kostumer'
  ]},
  { tema: 'Film, musik og kendte', ord: [
    'Film', 'Actionfilm', 'Komedier', 'Gyserfilm', 'Tv-serier', 'Netflix-serier', 'Realityprogrammer', 'Tegnefilm', 'Tegnefilmsfigurer',
    'Superhelte', 'Skurke i film', 'Sange', 'Sangere', 'Rappere', 'Danske rappere', 'Kendte', 'Kendte danskere',
    'Skuespillere'
  ]},
  { tema: 'Klassikere', ord: [
    'Pigenavne', 'Drengenavne', 'Kropsdele', 'Jobs', 'Forbrydelser'
  ]}
];

const BOMBE_CATEGORIES_ADULT = [
  'Sexstillinger', 'Kaldenavne for penis', 'Kaldenavne for bryster', 'Kaldenavne for bagdelen', 'Ord for at have sex',
  'Steder man kan have sex', 'Pornokategorier', 'Sexlegetøj'

];
