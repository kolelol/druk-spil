/* Bombe: kategorier. Nævn noget, der passer, og giv bomben videre.
   Det, der virker hos ejeren og vennerne: konkrete lister med klare svar (Bilmærker, Premier League-klubber, Rappere)
   og byen/druk/frækt (Shots, Natmad, Ting man mister i byen). Åbne og "kreative" opgaver ("Måder at...", "Ting man siger...",
   "Undskyldninger for...") og paratviden (Hovedstæder, Lande i Europa) er fjernet med vilje: de faldt flade.
   En kategori skal have 20+ svar, en fuld 21-årig kan finde på under pres.
   BOMBE_CATEGORIES_ADULT vises kun med "Frækt indhold" slået til. */
const BOMBE_CATEGORIES = [
  /* Byen og druk */
  'Ølmærker', 'Shots', 'Cocktails', 'Spiritus', 'Vodkamærker', 'Drukspil', 'Ting man kan blande vodka med', 'Natmad',
  'Tømmermandsmad', 'Energidrikke', 'Ting man mister i byen', 'Ting man finder i lommen dagen efter', 'Danske festivaler',
  'Byer man kan gå i byen i', 'Ting man tager med på festival', 'Ting man kan bunde', 'Ting man kan drikke af',
  'Ting man kan åbne en øl med', 'Ting man har i en bar', 'Snacks til en forfest', 'Sange alle kan synge med på',
  'Sange der får alle op at danse', 'Ord for at være fuld', 'Ord for at kaste op', 'Steder man tager på sydtur',
  'Steder man tager på skiferie', 'Ting man kan pante', 'Ting man kan ryge', 'Ting man kan være afhængig af',
  'Ting der er forbudt i Danmark', 'Ting man kan få en bøde for', 'Ting man kan købe i en kiosk', 'Ting man kan købe i 7-Eleven',
  /* Fodbold og sport */
  'Premier League-klubber', 'Premier League-spillere', 'Superliga-klubber', 'Superliga-spillere', 'Champions League-vindere',
  'Danske landsholdsspillere', 'Spillere der har spillet i Real Madrid', 'Spillere der har spillet i Barcelona',
  'Spillere der har spillet i Manchester United', 'Spillere der har vundet Ballon d\'Or', 'Fodboldtrænere', 'Fodboldstadions',
  'Lande der har vundet VM', 'Fodboldspillere med skæg', 'Klubber med røde trøjer', 'Spanske fodboldklubber', 'Italienske fodboldklubber',
  'Tyske fodboldklubber', 'Målmænd', 'Formel 1-kørere', 'UFC-kæmpere', 'Boksere', 'NBA-hold', 'NBA-spillere', 'NFL-hold',
  'Tennisspillere', 'Danske sportsstjerner', 'Sportsgrene med bold', 'Øvelser i fitness',
  /* Gaming og internet */
  'Playstation-spil', 'Nintendo-spil', 'Call of Duty-spil', 'Spil man spillede som barn', 'Figurer fra videospil', 'Pokémon',
  'Figurer fra Mario', 'Hold man vælger i FIFA', 'Ting man gør i GTA', 'Youtubere', 'Danske Youtubere', 'Streamere',
  'Danske influencere', 'Podcasts', 'Sociale medier', 'Apps på din telefon', 'Memes',
  /* Mad */
  'Fastfoodkæder', 'Pizza-toppings', 'Chips-smage', 'Slik', 'Ting på en durum', 'Ting man kan komme på en burger',
  'Ting på et julefrokostbord', 'Ting man kan grille', 'Ting man kan dyppe i ketchup', 'Ting i et kollegiekøkken', 'Sodavand',
  /* Mærker og penge */
  'Bilmærker', 'Sneakermærker', 'Tøjmærker', 'Dyre bilmærker', 'Urmærker', 'Supermarkeder', 'Butikker i et storcenter',
  'Ting i Ikea', 'Ting der koster over en million', 'Jobs hvor man tjener kassen', 'Jobs man ikke gider have', 'Ting man kan bruge SU på',
  /* Film, musik og kendte */
  'Netflix-serier', 'Actionfilm', 'Gyserfilm', 'Marvel-film', 'Fast & Furious-film', 'Film med Leonardo DiCaprio', 'Danske film',
  'Realityprogrammer', 'Deltagere i Paradise Hotel', 'Superhelte', 'Skurke i film', 'Marvel-figurer', 'Star Wars-figurer',
  'Harry Potter-figurer', 'Tegnefilm fra barndommen', 'Rappere', 'Danske rappere', 'Danske sangere', 'DJs', 'Bands',
  'Kunstnere der har spillet på Roskilde', 'Danske sange alle kender', 'Kendte danskere', 'Danske politikere', 'Danske komikere',
  'Tv-værter', 'Skuespillere', 'Kongelige', 'Kendte der er døde', 'Kendte par', 'Influencere',
  /* Fra "5 Second Rule"-kortene: nævn tre ting */
  'Morgenmadsprodukter', 'Is-smage', 'Mad med ost i', 'Grønne grøntsager', 'Pastatyper', 'Frugter',
  'Grøntsager', 'Mad man kan grille', 'Mad man spiser med ske', 'Mad på dåse', 'Slags sandwich', 'Kager',
  'Sød mad', 'Salt mad', 'Sprød mad', 'Mad i biografen', 'Ting man kan komme på toast', 'Mad til en fødselsdag',
  'Krydderier', 'Nødder', 'Brødtyper', 'Oste', 'Supper', 'Mad fra Italien',
  'Mad fra Mexico', 'Mad fra Asien', 'Drikke med kaffe i', 'Juicer', 'Kiks', 'Fisk man kan spise',
  'Pålæg', 'Fugle', 'Insekter', 'Dyr i junglen', 'Dyr der hopper', 'Dyr på en bondegård',
  'Dyr i skoven', 'Dyr med pletter', 'Dyr med striber', 'Krybdyr', 'Kæledyr', 'Dyr i zoo',
  'Dyr der lægger æg', 'Dyr der spiser kød', 'Dyr med lang hale', 'Dyr der kan svømme', 'Hunderacer', 'Ting der er runde',
  'Ting der er klistrede', 'Ting man kan have på hovedet', 'Ting der larmer', 'Ting der lugter', 'Ting man kan puste op', 'Ting der hopper',
  'Ting der er varme', 'Ting der er kolde', 'Ting man kan ride på', 'Ting der kan være i en lomme', 'Ting der flyder', 'Ting der lyser i mørket',
  'Ting der kommer i par', 'Ting der ruller', 'Ting man kan have på fødderne', 'Ting man kan skrive med', 'Ting af metal', 'Ting der er skarpe',
  'Ting der er bløde', 'Ting i et køkken', 'Ting der er glatte', 'Ting der er tunge', 'Ting med knapper', 'Ting man kan skrælle',
  'Ting på et badeværelse', 'Ting man kan klemme', 'Ting man kan sparke til', 'Ting der kommer i en æske', 'Ting der er blå', 'Ting der er grønne',
  'Ting der er røde', 'Ting der er gule', 'Ting der er sorte', 'Ting der er hvide', 'Ting man ser på himlen', 'Ting man kan stable',
  'Ting der er lavet af træ', 'Ting der er lavet af glas', 'Ting man kan folde', 'Ting der har en lynlås', 'Ting man kan låse', 'Ting man kan tænde',
  'Ting der kører på strøm', 'Disney-figurer', 'Figurer der kan flyve', 'Figurer med superkræfter', 'Skurke i tegnefilm', 'Figurer der bor under vandet',
  'Figurer med briller', 'Robotter fra film', 'Film med efterfølgere', 'Animationsfilm', 'Film der har vundet en Oscar', 'Instrumenter i et band',
  'Sange med "love" i titlen', 'Sange fra Disney-film', 'Kendte sangere', 'Film om venskab', 'Film der bygger på bøger', 'Musicals',
  'Julefilm', 'Film med dinosaurer', 'Film med biler', 'Tegnefilm', 'Farver i regnbuen', 'Ting man kan skrive på',
  'Ting i et penalhus', 'Ting man finder i en skuffe', 'Ting man finder i en håndtaske', 'Ting man finder i en bil', 'Ting man finder på en strand', 'Ting man tager med på camping',
  'Ting man tager med i svømmehallen', 'Ting man køber i et byggemarked', 'Ting man køber på et apotek', 'Ting man finder i en garage', 'Ting i et klasselokale', 'Slags vejr',
  'Blomster', 'Træer', 'Planeter', 'Ædelsten', 'Metaller', 'Sprog',
  'Valutaer', 'Religioner', 'Helligdage', 'Måneder', 'Ugedage', 'Kropsdele man har to af',
  'Sygdomme', 'Lægemidler', 'Vitaminer', 'Dansetrin', 'Danse', 'Musikgenrer',
  'Instrumenter',
  /* Klassikere der bare virker */
  'Farlige dyr', 'Dyr i Afrika', 'Dyr i havet', 'Ting der kan eksplodere', 'Våben', 'Bandeord', 'Ord der rimer på "øl"',
  'Ord der rimer på "fuld"', 'Ting der er større end en bil', 'Ting med hjul', 'Ting der flyver', 'Ting i en bil',
  'Ting man kan kaste med', 'Ting man kan gemme sig i', 'Kropsdele', 'Drengenavne', 'Pigenavne', 'Kortspil', 'Brætspil'
];

const BOMBE_CATEGORIES_ADULT = [
  'Sexstillinger', 'Kaldenavne for bryster', 'Kaldenavne for penis', 'Kaldenavne for bagdelen', 'Steder man kan have sex',
  'Steder man ikke må have sex', 'Ting man kan gøre i sengen', 'Datingapps', 'Frække ord', 'Ting der er lange',
  'Ting man kan smøre på en krop', 'Pornonavne', 'Pornokategorier', 'Pornostjerner', 'Sexlegetøj', 'Ting man kan bruge som sexlegetøj',
  'Ord for at have sex', 'Ting man finder i et natbord', 'Tøj man kan tage af', 'Ting man kan blive tændt af', 'Fetisher',
  'Kondommærker', 'Steder på kroppen man kan få en tatovering', 'Ting man kan gøre med tungen'
];
