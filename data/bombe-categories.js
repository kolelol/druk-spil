/* Bombe: kategorier i temaer. Nævn noget, der passer, og giv bomben videre.
   Reglen (fra ejeren, 2026-10-11): det skal være ting, man kan sige med det samme. Hver kategori skal have 30+ svar,
   som en fuld 21-årig har klar uden at tænke: Frugter, Bilmærker, Ølmærker, Fodboldklubber, Dyr.
   Alt, der kræver betænkningstid, er ude: "Ting der er klistrede", "Spillere der har vundet Ballon d'Or", scenarier, paratviden.
   Temaerne bruges af spillet til at skifte slags hver gang, så to kategorier i træk ikke ligner hinanden.
   Hold det danske nede: ejeren fandt listen "for meget dansk". Et par stykker er nok.
   BOMBE_CATEGORIES_ADULT vises kun med "Frækt indhold" slået til. */
const BOMBE_CATEGORIES = [
  { tema: 'Byen og druk', ord: [
    'Ølmærker', 'Shots', 'Cocktails', 'Spiritus', 'Vodkamærker', 'Drukspil', 'Natmad', 'Tømmermandsmad', 'Energidrikke',
    'Ting man mister i byen', 'Ting man finder i lommen dagen efter', 'Festivaler', 'Ting man tager med på festival',
    'Ting man kan bunde', 'Ting man kan drikke af', 'Ting man kan åbne en øl med', 'Ting i en bar', 'Snacks til en forfest',
    'Ord for at være fuld', 'Ord for at kaste op', 'Steder man tager på sydtur', 'Ting man kan ryge', 'Ting man kan være afhængig af',
    'Ting man kan få en bøde for', 'Ting man kan købe i en kiosk', 'Ting man kan blande vodka med'
  ]},
  { tema: 'Mad og drikke', ord: [
    'Frugter', 'Grøntsager', 'Slik', 'Chips-smage', 'Sodavand', 'Is-smage', 'Fastfoodkæder', 'Pizza-toppings', 'Morgenmad', 'Pålæg',
    'Kager', 'Fisk', 'Mad man kan grille', 'Mad fra Italien', 'Ting på en durum', 'Ting man kan komme på en burger', 'Ting i et køleskab',
    'Ting man kan dyppe i ketchup', 'Krydderier', 'Ting man kan drikke', 'Juice-smage', 'Kaffedrikke'
  ]},
  { tema: 'Dyr', ord: [
    'Dyr', 'Farlige dyr', 'Dyr i Afrika', 'Dyr i havet', 'Fugle', 'Insekter', 'Kæledyr', 'Dyr på en bondegård', 'Dyr i zoo',
    'Hunderacer', 'Dyr i skoven'
  ]},
  { tema: 'Sport', ord: [
    'Fodboldspillere', 'Fodboldklubber', 'Premier League-klubber', 'Superliga-klubber', 'Klubber med røde trøjer', 'Fodboldtrænere',
    'Sportsgrene', 'Vintersportsgrene', 'Øvelser i fitness', 'NBA-spillere', 'Ting man kan spille med en bold', 'Sportsmærker'
  ]},
  { tema: 'Gaming og internet', ord: [
    'Playstation-spil', 'Nintendo-spil', 'Mobilspil', 'Spil man spillede som barn', 'Pokémon', 'Ting man gør i GTA', 'Youtubere',
    'Streamere', 'Sociale medier', 'Apps på din telefon', 'Emojis', 'Ting man kan google'
  ]},
  { tema: 'Mærker og ting', ord: [
    'Bilmærker', 'Sneakermærker', 'Tøjmærker', 'Supermarkeder', 'Butikker i et storcenter', 'Telefonmærker', 'Tøj', 'Sko', 'Møbler',
    'Elektronik', 'Legetøj', 'Værktøj', 'Instrumenter', 'Våben', 'Ting med hjul', 'Ting der flyver', 'Ting der kan eksplodere',
    'Ting i et køkken', 'Ting på et badeværelse', 'Ting i en bil', 'Ting i et klasselokale', 'Ting i et penalhus',
    'Ting man finder på en strand', 'Ting man tager med på camping', 'Ting i en lufthavn'
  ]},
  { tema: 'Verden', ord: [
    'Lande', 'Lande i Europa', 'Byer i Europa', 'Byer i USA', 'Byer i Danmark', 'Steder man tager på ferie', 'Sprog', 'Flyselskaber'
  ]},
  { tema: 'Film, musik og kendte', ord: [
    'Film', 'Netflix-serier', 'Actionfilm', 'Gyserfilm', 'Disney-film', 'Tegnefilm', 'Superhelte', 'Harry Potter-figurer',
    'Realityprogrammer', 'Rappere', 'Danske rappere', 'Sangere', 'Bands', 'Musikgenrer', 'Skuespillere', 'Kendte', 'Kendte danskere',
    'Politikere', 'Influencere', 'Julesange'
  ]},
  { tema: 'Klassikere', ord: [
    'Farver', 'Kropsdele', 'Drengenavne', 'Pigenavne', 'Bandeord', 'Brætspil', 'Blomster', 'Jobs', 'Ting der er røde', 'Ting der er runde'
  ]}
];

const BOMBE_CATEGORIES_ADULT = [
  'Sexstillinger', 'Kaldenavne for penis', 'Kaldenavne for bryster', 'Kaldenavne for bagdelen', 'Ord for at have sex',
  'Steder man kan have sex', 'Datingapps', 'Frække ord', 'Pornokategorier', 'Pornostjerner', 'Sexlegetøj', 'Ting man finder i et natbord'
];
