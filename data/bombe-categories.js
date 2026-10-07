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
