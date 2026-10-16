/* Bombe: kategorier i temaer. Nævn noget, der passer, og giv bomben videre.
   Listen er kopieret fra andres, som ejeren bad om (2026-10-11): den klassiske kategorispilsliste (Scattergories /
   "Stop the bus", 200+ kategorier fra eslvault.com), de generelle "nævn tre ting"-kort fra 5 Second Rule
   (partygamesnight.com) og det danske drukspil "Kategorier" (bilmærker, danske byer). Oversat, ikke opfundet.
   Udeladt fra kilderne: ord-lege ("et ord på 8 bogstaver"), åbne "måder at..."-opgaver og rene paratvidens-lister.
   Temaerne bruges af spillet til at skifte slags hver gang. Hold det danske nede.
   Hver kategori er vurderet af fem testpersoner (sjov 3+, nem 3,4+); resten er fjernet (2026-10-12).
   2026-10-16 valgte ejeren selv: ud med hverdagslisterne (Pålæg, Slik, Morgenmad, Ting i en kuffert, Legetøj, Byer,
   Videospil og flere), Klassikerne (Pige- og drengenavne, Kropsdele, Jobs), Actionfilm, Kendte og alt frækt;
   ind med Urmærker, Hovedstæder i verden, Amerikanske præsidenter, Michael Jackson-sange og Film med Mads Mikkelsen.
   Bombe har ingen frække kategorier, heller ikke med "Frækt indhold" slået til. */
const BOMBE_CATEGORIES = [
  { tema: 'Byen og druk', ord: [
    'Ølmærker', 'Shots', 'Spiritus', 'Natmad'
  ]},
  { tema: 'Mad og drikke', ord: [
    'Drikkevarer', 'Frugter', 'Grøntsager', 'Fastfood', 'Ting i et køleskab'
  ]},
  { tema: 'Dyr', ord: [
    'Dyr i havet', 'Kæledyr', 'Dyr i junglen', 'Farlige dyr'
  ]},
  { tema: 'Sport', ord: [
    'Sportsgrene', 'Sportsstjerner', 'Fodboldspillere', 'Fodboldklubber'
  ]},
  { tema: 'Gaming og internet', ord: [
    'Apps', 'Mobilspil'
  ]},
  { tema: 'Mærker og ting', ord: [
    'Bilmærker', 'Tøjmærker', 'Sneakermærker', 'Urmærker', 'Store firmaer',
    'Transportmidler', 'Ting i et køkken', 'Ting på et badeværelse'
  ]},
  { tema: 'Verden', ord: [
    'Lande', 'Hovedstæder i verden', 'Byer i Danmark', 'Amerikanske præsidenter'
  ]},
  { tema: 'Film, musik og kendte', ord: [
    'Film', 'Film med Mads Mikkelsen', 'Tv-serier', 'Realityprogrammer', 'Tegnefilmsfigurer',
    'Superhelte', 'Sangere', 'Michael Jackson-sange', 'Rappere', 'Danske rappere', 'Kendte danskere',
    'Skuespillere'
  ]}
];
