/* Bombe: kategorier og bogstaver. Sig noget, der passer, og giv bomben videre. */
const BOMBE_CATEGORIES = [
  'Bilmærker', 'Ølmærker', 'Danske byer', 'Lande i Europa', 'Hovedstæder', 'Fodboldklubber', 'Frugter', 'Grøntsager',
  'Dyr med fire ben', 'Fugle', 'Ting i et køleskab', 'Ting på et badeværelse', 'Kendte danskere', 'Danske sangere',
  'Danske film', 'Superhelte', 'Disney-film', 'Tv-serier', 'Ting der er gule', 'Ting der er runde', 'Ting man kan drikke',
  'Cocktails', 'Pizza-toppings', 'Bandeord', 'Kropsdele', 'Sportsgrene', 'Skolefag', 'Jobs med uniform',
  'Ting i en værktøjskasse', 'Ting man tager med på ferie', 'Drengenavne der starter med M', 'Pigenavne der starter med A',
  'Ting der er større end en bil', 'Ting der lugter', 'Undskyldninger for at komme for sent', 'Ting man gør på en date',
  'Grunde til at tage en øl', 'Ting i en håndtaske', 'Slik', 'Chips-smage', 'Fastfoodkæder', 'Tøjmærker', 'Apps på din telefon',
  'Sociale medier', 'Musikinstrumenter', 'Sange med "love" i titlen', 'Forlystelser i Tivoli', 'Danske rappere',
  'Ting man siger, når man er fuld', 'Ord for at være fuld', 'Lufthavne', 'Kortspil', 'Brætspil', 'Videospil', 'Youtubere',
  'Ting der kan eksplodere', 'Ting i en bil', 'Ting man kan grille', 'Krydderier', 'Oste', 'Kendte par', 'Ting med hjul',
  'Ting i havet', 'Lande i Afrika', 'Amerikanske stater', 'Ting i en park', 'Danske politikere', 'Ting man finder på en festival',
  'Rockbands', 'Popsangere', 'Ting der er kolde', 'Ting der er varme', 'Ting man kan spise med hænderne', 'Morgenmad',
  'Ting man gør i weekenden', 'Dyr i Zoo', 'Blomster', 'Træer', 'Farver', 'Ting der flyver', 'Ting i et klasseværelse',
  'Ord der rimer på "øl"', 'Ting med striber', 'Ting der hører til jul', 'Ting der hører til sommer', 'Kendte bygninger',
  'Ting i en bar', 'Vintersport', 'Danske øer', 'Streamingtjenester', 'Harry Potter-karakterer', 'Star Wars-karakterer',
  'Kendte fodboldspillere', 'Danske håndboldspillere', 'Tegnefilm', 'Ting der er klistrede', 'Ting man har i lommen',
  'Ting man kan tabe', 'Is-varianter', 'Sodavandssmage', 'Dansk slik', 'Kendte tv-værter', 'Dyr med hale', 'Ting der er blå',
  'Ting man kan råbe til en fodboldkamp', 'Drukspil', 'Ting der er dyre', 'Ting man kan købe i en kiosk', 'Danske ord for penge'
];

const BOMBE_CATEGORIES_ADULT = [
  'Sexstillinger', 'Kaldenavne for bryster', 'Kaldenavne for penis', 'Steder man kan have sex', 'Ting man kan gøre i sengen',
  'Datingapps', 'Frække ord', 'Ting der er lange', 'Ting man kan smøre på en krop', 'Pornonavne'
];

const BOMBE_LETTERS = 'ABDEFGHIJKLMNOPRSTUV'.split('');
