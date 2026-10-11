/* Bombe: kategorier i temaer. Nævn noget, der passer, og giv bomben videre.
   Listen er kopieret fra andres, som ejeren bad om (2026-10-11): den klassiske kategorispilsliste (Scattergories /
   "Stop the bus", 200+ kategorier fra eslvault.com), de generelle "nævn tre ting"-kort fra 5 Second Rule
   (partygamesnight.com) og det danske drukspil "Kategorier" (bilmærker, danske byer). Oversat, ikke opfundet.
   Udeladt fra kilderne: ord-lege ("et ord på 8 bogstaver"), åbne "måder at..."-opgaver og rene paratvidens-lister.
   Temaerne bruges af spillet til at skifte slags hver gang. Hold det danske nede.
   BOMBE_CATEGORIES_ADULT vises kun med "Frækt indhold" slået til. */
const BOMBE_CATEGORIES = [
  { tema: 'Byen og druk', ord: [
    'Ølmærker', 'Shots', 'Cocktails', 'Spiritus', 'Vodkamærker', 'Drukspil', 'Festsange alle kender', 'Grunde til at tage et shot',
    'Snacks der forsvinder først til en fest', 'Dansetrin', 'Ting man tager med til en hjemmefest', 'Festtemaer', 'Spil man kan spille uden udstyr',
    'Grunde til at skåle', 'Ting man kan have på til en udklædningsfest', 'Ting der nemt spildes', 'Natmad', 'Ting man glemmer dagen derpå',
    'Ting man siger efter et shot', 'Ting der altid slipper op til en fest', 'Ting der går i stykker til fester', 'Ting man mister i byen',
    'Festivaler', 'Ord for at være fuld', 'Ting man kan bunde', 'Ting man kan drikke af', 'Ting man kan åbne en øl med'
  ]},
  { tema: 'Mad og drikke', ord: [
    'Mad', 'Drikkevarer', 'Morgenmad', 'Frugter', 'Grøntsager', 'Noget på en pizza', 'Sød mad', 'Usund mad', 'Desserter', 'Varme drikke',
    'Udenlandsk mad', 'Krydderier', 'Saucer', 'Mad på dåse', 'Mad man spiser med ske', 'Noget i en sandwich', 'Steder man kan spise',
    'Pastaretter', 'Fastfood', 'Is-smage', 'Kaffedrikke', 'Slik', 'Chips-smage', 'Sodavand', 'Oste', 'Nødder', 'Kager',
    'Ting i et køleskab', 'Ting man kan grille', 'Pålæg', 'Mad man spiser med hænderne'
  ]},
  { tema: 'Dyr', ord: [
    'Dyr', 'Dyr i havet', 'Fugle', 'Insekter', 'Fisk', 'Krybdyr', 'Kæledyr', 'Dyr på en bondegård', 'Hunderacer', 'Dyr i junglen',
    'Dyr i zoo', 'Dyr med striber', 'Farlige dyr', 'Dyr der bider', 'Dyr der ikke spiser kød', 'Dyrelyde', 'Fabeldyr', 'Uhyrer'
  ]},
  { tema: 'Sport', ord: [
    'Sportsgrene', 'Sportshold', 'Sportsstjerner', 'Sportsudstyr', 'Slags bolde', 'Ekstremsport', 'Ting på et stadion', 'Fodboldspillere',
    'Fodboldklubber', 'Premier League-klubber', 'Superliga-klubber', 'Øvelser i fitness', 'Vintersportsgrene', 'Sportsmærker', 'Ting man kan ride på'
  ]},
  { tema: 'Gaming og internet', ord: [
    'Videospil', 'Apps', 'Sociale medier', 'Streamingtjenester', 'Computerspil', 'Playstation-spil', 'Mobilspil', 'Pokémon',
    'Spil man spillede som barn', 'Youtubere', 'Streamere', 'Emojis', 'Computerprogrammer', 'Hjemmesider', 'Elektronik', 'Ting der skal have en ledning'
  ]},
  { tema: 'Mærker og ting', ord: [
    'Bilmærker', 'Bilmodeller', 'Tøjmærker', 'Sneakermærker', 'Store firmaer', 'Supermarkeder', 'Dyre ting', 'Ting rige mennesker køber',
    'Ting man ofte køber', 'Ting man har på sig hver dag', 'Modetilbehør', 'Tøj', 'Sommertøj', 'Sko', 'Ting på hovedet', 'Legetøj',
    'Møbler', 'Værktøj', 'Køkkenredskaber', 'Rengøringsting', 'Byggematerialer', 'Ting af metal', 'Ting af træ', 'Ting af glas', 'Ting af plastik',
    'Våben', 'Instrumenter', 'Transportmidler', 'Slags fly', 'Dele af en bil', 'Ting med hjul', 'Ting der flyver', 'Ting man kan sidde på',
    'Ting i en kuffert', 'Ting i et køkken', 'Ting på et badeværelse', 'Ting i et soveværelse', 'Ting i en bil', 'Ting i en lufthavn',
    'Ting på et kontor', 'Ting i en have', 'Ting på en strand', 'Ting man tager med på camping', 'Ting i et penalhus', 'Ting i et klasselokale',
    'Ting i rummet', 'Ting på en vej', 'Ting der kan eksplodere', 'Ting der larmer', 'Ting der er skarpe', 'Ting der er giftige'
  ]},
  { tema: 'Verden', ord: [
    'Lande', 'Byer', 'Hovedstæder', 'Byer i Danmark', 'Lande i Europa', 'Byer i USA', 'Nationaliteter', 'Sprog', 'Turistmål', 'Seværdigheder',
    'Flyselskaber', 'Ting i en ørken', 'Steder i en by', 'Steder man kan danse', 'Steder man kan sove', 'Højtider', 'Halloween-kostumer'
  ]},
  { tema: 'Film, musik og kendte', ord: [
    'Film', 'Actionfilm', 'Komedier', 'Gyserfilm', 'Tv-serier', 'Netflix-serier', 'Realityprogrammer', 'Tegnefilm', 'Tegnefilmsfigurer',
    'Superhelte', 'Skurke i film', 'Sange', 'Bands', 'Sangere', 'Rappere', 'Danske rappere', 'Musikgenrer', 'Kendte', 'Kendte danskere',
    'Skuespillere', 'Politikere', 'Influencere', 'Kendte fra historien', 'Brætspil'
  ]},
  { tema: 'Klassikere', ord: [
    'Pigenavne', 'Drengenavne', 'Farver', 'Kropsdele', 'Jobs', 'Farlige jobs', 'Jobs med uniform', 'Hobbyer', 'Forbrydelser', 'Dårlige vaner',
    'Sygdomme', 'Medicin', 'Vejr', 'Noget rødt', 'Noget grønt', 'Noget blåt', 'Noget sort', 'Noget rundt', 'Noget varmt', 'Noget koldt',
    'Noget på himlen', 'Noget der lugter', 'Noget uhyggeligt', 'Noget blødt', 'Noget højt', 'Noget vådt', 'Noget gammelt', 'Noget der bider',
    'Noget man kan ride på', 'Noget man kan putte i lommen', 'Ædelsten', 'Blomster', 'Træer', 'Ting i en skuffe', 'Ting man kan samle på'
  ]}
];

const BOMBE_CATEGORIES_ADULT = [
  'Sexstillinger', 'Kaldenavne for penis', 'Kaldenavne for bryster', 'Kaldenavne for bagdelen', 'Ord for at have sex',
  'Steder man kan have sex', 'Datingapps', 'Frække ord', 'Pornokategorier', 'Pornostjerner', 'Sexlegetøj', 'Ting man finder i et natbord',
  'Flirtende komplimenter', 'Dårlige scorereplikker', 'Røde flag på en første date', 'Ting der tænder en', 'Frække beskeder'
];
