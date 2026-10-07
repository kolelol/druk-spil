/* Bombe: kategorier. Nævn noget, der passer, og giv bomben videre.
   En kategori skal have 20+ mulige svar, som en fuld 21-årig kan finde på under pres, og den skal have kant.
   Skolebogs-kategorier (hovedstæder, fag, muskler) er fjernet med vilje: de er for tamme til en bytur.
   Scenarierne ("Ting man siger, når...") er også fjernet: ejeren og vennerne fandt dem kedelige.
   BOMBE_CATEGORIES_ADULT vises kun med "Frækt indhold" slået til. */
const BOMBE_CATEGORIES = [
  /* Byen og druk */
  'Ølmærker', 'Shots', 'Cocktails', 'Spiritus', 'Drukspil', 'Ting man kan blande vodka med', 'Ting man kan tage et shot af',
  'Ting man kan købe i en kiosk klokken 3', 'Natmad', 'Ord for at være fuld', 'Ord for at kaste op', 'Ting man mister i byen',
  'Danske festivaler', 'Ting en dørmand siger', 'Ting en fuld mand siger', 'Ting man gør, når man er fuld',
  'Ting man gør med tømmermænd', 'Tømmermandskure', 'Steder man kan sove, når man ikke kan komme hjem',
  'Ting man finder i lommen dagen efter', 'Ting man finder på gulvet efter en fest', 'Ting man kan bunde', 'Ting man kan drikke af',
  'Ting man kan åbne en øl med', 'Ting man har i en bar', 'Sange der får alle op at danse', 'Sange alle kan synge med på',
  'Sange man synger i taxaen', 'Grunde til at tage en øl', 'Grunde til at tage én til', 'Byer man kan gå i byen i',
  'Ting man tager med på festival', 'Ting man finder i teltet efter Roskilde', 'Ting man gør på Roskilde', 'Ting man kan stjæle fra en bar',
  'Ting man kan lave med en tom øldåse', 'Måder at blive smidt ud af en bar', 'Måder at få en gratis øl', 'Regler i beerpong',
  'Ting man kan spille beerpong med', 'Steder man kan tisse i byen', 'Ting man råber i en taxa', 'Ting man skriver i gruppechatten klokken 4',
  'Ting man gør på sydtur', 'Ting man gør i Sunny Beach', 'Steder man tager på sydtur', 'Steder man tager på skiferie',
  'Ting der er dyrere i byen end i Netto', 'Ting man kan pante', 'Ting man kan tabe et væddemål om', 'Snacks til en forfest',
  'Ting man gør til en forfest', 'Ting man gør til en efterfest', 'Ting man aldrig gør igen på en drengetur', 'Ting man kan ryge',
  'Ting man kan være afhængig af', 'Ting der er forbudt i Danmark', 'Ting man kan få en bøde for', 'Ting man kan blive smidt ud for',
  'Ting man kan blive fyret for', 'Ting man lyver om', 'Ting man gør, når ingen kigger', 'Ting man kan vågne op med',
  /* Fodbold og sport */
  'Premier League-klubber', 'Superliga-klubber', 'Champions League-vindere', 'Danske landsholdsspillere',
  'Spillere der har spillet i Real Madrid', 'Spillere der har vundet Ballon d\'Or', 'Fodboldtrænere', 'Lande der har vundet VM',
  'Fodboldspillere med skæg', 'Fodboldspillere der er blevet røde', 'Klubber med røde trøjer', 'Ting man råber ad dommeren',
  'Ting en fodboldkommentator siger', 'Fodboldspillere man hader', 'Formel 1-kørere', 'UFC-kæmpere', 'Boksere', 'NBA-hold',
  'Ting man råber ind i et headset', 'Undskyldninger for at tabe i padel', 'Undskyldninger for ikke at træne', 'Typer man møder i fitness',
  'Ting man kan brække',
  /* Gaming og internet */
  'Playstation-spil', 'Spil man spillede som barn', 'Figurer fra videospil', 'Ting man gør i GTA', 'Youtubere', 'Danske Youtubere',
  'Streamere', 'Ting man ikke må google på arbejdet', 'Ting man ser på YouTube klokken 3 om natten', 'Ting man sletter fra sin søgehistorik',
  'Apps man ikke vil have, andre ser på ens telefon', 'Ting man kan blive bannet for',
  /* Mad */
  'Fastfoodkæder', 'Tømmermandsmad', 'Ting på en durum', 'Ting man kan komme på en burger', 'Ting man kan købe i 7-Eleven',
  'Ting på et julefrokostbord', 'Energidrikke', 'Chips-smage', 'Ting man kan dyppe i ketchup', 'Ting man kan lave i en airfryer',
  'Ting i et kollegiekøkken', 'Mad man ikke gider spise', 'Ting man spiser klokken 4 om natten',
  /* Penge, hverdag og dumme idéer */
  'Bilmærker', 'Sneakermærker', 'Ting man kan bruge SU på', 'Ting man køber, når man lige har fået løn', 'Jobs hvor man tjener kassen',
  'Jobs man ikke gider have', 'Ting i en drengs værelse', 'Ting der koster over en million', 'Ting man kan gemme sig i',
  'Ting man kan kaste med', 'Dårlige tatoveringer', 'Dårlige navne til en bar', 'Dårlige navne til en hund', 'Ting man ikke må råbe i en lufthavn',
  'Måder at miste sit kørekort på', 'Ting man kan blive stoppet af politiet for', 'Dårlige undskyldninger', 'Løgne man fortæller sin mor',
  /* Film, musik og kendte */
  'Netflix-serier', 'Actionfilm', 'Gyserfilm', 'Realityprogrammer', 'Deltagere i Paradise Hotel', 'Superhelte', 'Skurke i film',
  'Marvel-figurer', 'Rappere', 'Danske rappere', 'Danske sange alle kender', 'Kunstnere der har spillet på Roskilde', 'Kendte danskere',
  'Danske politikere', 'Danske komikere', 'Kendte der er døde', 'Kendte der har været i fængsel', 'Kendte man gerne ville drikke en øl med',
  'Kendte man ikke gider sidde ved siden af i et fly', 'Kendte par', 'Influencere',
  /* Klassikere der bare virker */
  'Farlige dyr', 'Ting der kan eksplodere', 'Våben', 'Bandeord', 'Ord der rimer på "øl"', 'Ord der rimer på "fuld"',
  'Lyde man kan lave med munden', 'Ting der er større end en bil', 'Ting man kan dø af', 'Ting man kan være bange for'
];

const BOMBE_CATEGORIES_ADULT = [
  'Sexstillinger', 'Kaldenavne for bryster', 'Kaldenavne for penis', 'Steder man kan have sex', 'Steder man ikke må have sex',
  'Ting man kan gøre i sengen', 'Datingapps', 'Frække ord', 'Ting der er lange', 'Ting man kan smøre på en krop',
  'Pornonavne', 'Pornokategorier', 'Ting man siger under sex', 'Ting man ikke må sige under sex',
  'Ting man kan bruge som sexlegetøj', 'Ord for at have sex', 'Ting der dræber stemningen', 'Ting man finder i et natbord',
  'Tøj man kan tage af', 'Ting man kan blive tændt af', 'Dårlige steder at få et sugemærke', 'Ting man fortryder at have sendt',
  'Dårlige sange at have sex til', 'Ting man skriver på Tinder for at score', 'Ting man aldrig skriver på Tinder'
];
