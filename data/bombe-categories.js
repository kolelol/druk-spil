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
    'Ølmærker', 'Shots', 'Spiritus',
    'Natmad'
  ]},
  { tema: 'Mad og drikke', ord: [
    'Drikkevarer', 'Morgenmad', 'Frugter', 'Grøntsager', 'Noget på en pizza',
    'Fastfood', 'Slik', 'Sodavand',
    'Ting i et køleskab', 'Ting man kan grille', 'Pålæg'
  ]},
  { tema: 'Dyr', ord: [
    'Dyr i havet', 'Kæledyr', 'Dyr i junglen',
    'Farlige dyr'
  ]},
  { tema: 'Sport', ord: [
    'Sportsgrene', 'Sportsstjerner', 'Sportsudstyr', 'Fodboldspillere',
    'Fodboldklubber', 'Premier League-klubber', 'Øvelser i fitness'
  ]},
  { tema: 'Gaming og internet', ord: [
    'Videospil', 'Apps', 'Mobilspil'
  ]},
  { tema: 'Mærker og ting', ord: [
    'Bilmærker', 'Tøjmærker', 'Sneakermærker', 'Store firmaer', 'Supermarkeder',
    'Tøj', 'Legetøj',
    'Transportmidler',
    'Ting i en kuffert', 'Ting i et køkken', 'Ting på et badeværelse', 'Ting i en bil',
    'Ting på en strand'
  ]},
  { tema: 'Verden', ord: [
    'Lande', 'Byer', 'Byer i Danmark'
  ]},
  { tema: 'Film, musik og kendte', ord: [
    'Film', 'Actionfilm', 'Tv-serier', 'Realityprogrammer', 'Tegnefilmsfigurer',
    'Superhelte', 'Sangere', 'Rappere', 'Danske rappere', 'Kendte', 'Kendte danskere',
    'Skuespillere'
  ]},
  { tema: 'Klassikere', ord: [
    'Pigenavne', 'Drengenavne', 'Kropsdele', 'Jobs'
  ]}
];

const BOMBE_CATEGORIES_ADULT = [
  'Kaldenavne for penis', 'Ord for at have sex',
  'Pornokategorier'

];
