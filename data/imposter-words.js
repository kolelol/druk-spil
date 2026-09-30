/* Imposter: ordpar pr. kategori. Hvert par er [ord, lignende ord].
   Appen vælger tilfældigt, hvilket af de to der er det rigtige ord,
   og det andet bruges som "undercover"-ord til imposteren. */
const IMPOSTER_WORDS = [
  { id: 'mad', navn: 'Mad og drikke', ord: [
    ['Pizza', 'Burger'], ['Sushi', 'Tapas'], ['Rugbrød', 'Franskbrød'], ['Kaffe', 'Te'],
    ['Øl', 'Cider'], ['Rødvin', 'Champagne'], ['Is', 'Kage'], ['Pandekager', 'Vafler'],
    ['Hotdog', 'Pølsehorn'], ['Smørrebrød', 'Sandwich'], ['Pasta', 'Ris'], ['Chokolade', 'Lakrids'],
    ['Æble', 'Pære'], ['Banan', 'Mango'], ['Kartoffel', 'Gulerod'], ['Frikadeller', 'Kødboller'],
    ['Snaps', 'Vodka'], ['Gin og tonic', 'Mojito'], ['Cola', 'Fanta'], ['Flæskesteg', 'Stegt flæsk'],
    ['Popcorn', 'Chips'], ['Æggekage', 'Omelet'], ['Leverpostej', 'Spegepølse'], ['Kanelsnegl', 'Wienerbrød'],
    ['Tacos', 'Burrito'], ['Energidrik', 'Iskaffe'], ['Nutella', 'Peanutbutter'], ['Grillpølse', 'Kebab']
  ]},
  { id: 'dyr', navn: 'Dyr', ord: [
    ['Hund', 'Kat'], ['Løve', 'Tiger'], ['Hest', 'Æsel'], ['Ko', 'Gris'], ['Papegøje', 'Kanariefugl'],
    ['Haj', 'Delfin'], ['Slange', 'Firben'], ['Elefant', 'Næsehorn'], ['Pingvin', 'Sæl'], ['Bi', 'Hveps'],
    ['Ræv', 'Ulv'], ['Kanin', 'Hamster'], ['Krokodille', 'Alligator'], ['Ugle', 'Ørn'], ['Abe', 'Gorilla'],
    ['Giraf', 'Kamel'], ['Mus', 'Rotte'], ['Frø', 'Tudse'], ['Sommerfugl', 'Møl'], ['Hval', 'Blæksprutte'],
    ['Høne', 'And'], ['Edderkop', 'Skorpion'], ['Isbjørn', 'Panda'], ['Får', 'Ged']
  ]},
  { id: 'steder', navn: 'Steder i Danmark', ord: [
    ['Stranden', 'Svømmehallen'], ['Tivoli', 'Bakken'], ['Biblioteket', 'Boghandlen'], ['Lufthavnen', 'Banegården'],
    ['Hospitalet', 'Tandlægen'], ['Biografen', 'Teatret'], ['Fitnesscentret', 'Yogastudiet'], ['Gymnasiet', 'Universitetet'],
    ['Netto', 'Føtex'], ['Roskilde Festival', 'Smukfest'], ['Ikea', 'Jysk'], ['Fængslet', 'Politistationen'],
    ['Legoland', 'Djurs Sommerland'], ['Baren', 'Natklubben'], ['Campingpladsen', 'Sommerhuset'], ['Zoo', 'Den Blå Planet'],
    ['Kolonihaven', 'Altanen'], ['Kirken', 'Rådhuset'], ['Tankstationen', 'Vaskehallen'], ['Strøget', 'Fisketorvet'],
    ['Lalandia', 'Badeland'], ['Bornholm', 'Samsø'], ['Aarhus', 'Aalborg'], ['Nørrebro', 'Vesterbro'], ['Odense', 'Esbjerg']
  ]},
  { id: 'verden', navn: 'Ude i verden', ord: [
    ['Paris', 'Rom'], ['New York', 'Los Angeles'], ['Mallorca', 'Kreta'], ['Berlin', 'Hamborg'], ['Thailand', 'Bali'],
    ['Sverige', 'Norge'], ['London', 'Dublin'], ['Barcelona', 'Madrid'], ['Dubai', 'Las Vegas'], ['Grønland', 'Island'],
    ['Tokyo', 'Seoul'], ['Australien', 'New Zealand'], ['Egypten', 'Marokko'], ['Amsterdam', 'Bruxelles'],
    ['Sydpolen', 'Nordpolen'], ['Månen', 'Mars'], ['Alperne', 'Pyrenæerne'], ['Sahara', 'Amazonas'], ['Prag', 'Budapest']
  ]},
  { id: 'ting', navn: 'Ting', ord: [
    ['Telefon', 'Tablet'], ['Tandbørste', 'Barbermaskine'], ['Paraply', 'Regnjakke'], ['Cykel', 'Løbehjul'],
    ['Sofa', 'Seng'], ['Pung', 'Rygsæk'], ['Solbriller', 'Briller'], ['Ur', 'Armbånd'], ['Kaffemaskine', 'Elkedel'],
    ['Stige', 'Trappe'], ['Kniv', 'Saks'], ['Vaskemaskine', 'Opvaskemaskine'], ['Guitar', 'Klaver'], ['Fjernsyn', 'Projektor'],
    ['Hængekøje', 'Liggestol'], ['Lighter', 'Tændstikker'], ['Nøgle', 'Kodelås'], ['Støvsuger', 'Kost'], ['Pude', 'Dyne'],
    ['Hovedtelefoner', 'Højttaler'], ['Kamera', 'Kikkert'], ['Toiletpapir', 'Køkkenrulle'], ['Grill', 'Bålplads'], ['Termokande', 'Drikkedunk']
  ]},
  { id: 'sport', navn: 'Sport og fritid', ord: [
    ['Fodbold', 'Håndbold'], ['Tennis', 'Badminton'], ['Ski', 'Snowboard'], ['Svømning', 'Dykning'], ['Boksning', 'Karate'],
    ['Golf', 'Minigolf'], ['Yoga', 'Pilates'], ['Skak', 'Backgammon'], ['Fiskeri', 'Jagt'], ['Løb', 'Cykling'],
    ['Bowling', 'Dart'], ['Padel', 'Squash'], ['Crossfit', 'Styrketræning'], ['Surfing', 'Kitesurfing'], ['Ridning', 'Rodeo'],
    ['Formel 1', 'Motocross'], ['Basketball', 'Volleyball'], ['Ishockey', 'Curling'], ['Beer pong', 'Flunkyball'], ['Skateboard', 'Rulleskøjter']
  ]},
  { id: 'jobs', navn: 'Jobs', ord: [
    ['Læge', 'Sygeplejerske'], ['Politibetjent', 'Dørmand'], ['Pilot', 'Stewardesse'], ['Kok', 'Tjener'], ['Lærer', 'Pædagog'],
    ['Advokat', 'Dommer'], ['Frisør', 'Tatovør'], ['Landmand', 'Gartner'], ['Brandmand', 'Ambulanceredder'], ['Tømrer', 'Murer'],
    ['Youtuber', 'Influencer'], ['Bartender', 'DJ'], ['Præst', 'Bedemand'], ['Taxachauffør', 'Buschauffør'], ['Astronaut', 'Ubådskaptajn'],
    ['Skuespiller', 'Sanger'], ['Ejendomsmægler', 'Bankrådgiver'], ['Elektriker', 'VVS-mand'], ['Spion', 'Detektiv'],
    ['Postbud', 'Skraldemand'], ['Tandlæge', 'Kiropraktor'], ['Fodboldspiller', 'Håndboldspiller']
  ]},
  { id: 'film', navn: 'Film og serier', ord: [
    ['Harry Potter', 'Ringenes Herre'], ['Star Wars', 'Star Trek'], ['Batman', 'Superman'], ['Titanic', 'Jaws'],
    ['Friends', 'How I Met Your Mother'], ['Game of Thrones', 'Vikings'], ['Frost', 'Løvernes Konge'], ['Olsen Banden', 'Far til fire'],
    ['Matador', 'Badehotellet'], ['Klovn', 'Casper og Mandrilaftalen'], ['Paradise Hotel', 'Ex on the Beach'], ['X Factor', 'Vild med dans'],
    ['James Bond', 'Mission Impossible'], ['Shrek', 'Toy Story'], ['Stranger Things', 'The Walking Dead'], ['Breaking Bad', 'Narcos'],
    ['Fast and Furious', 'Top Gun'], ['Rejseholdet', 'Broen'], ['The Office', 'Parks and Recreation'], ['Squid Game', 'Hunger Games'],
    ['Barbie', 'Oppenheimer'], ['Den eneste ene', 'Italiensk for begyndere']
  ]},
  { id: 'kendte', navn: 'Kendte danskere', ord: [
    ['Mads Mikkelsen', 'Nikolaj Lie Kaas'], ['Christian Eriksen', 'Kasper Schmeichel'], ['Medina', 'MØ'], ['Lukas Graham', 'Rasmus Seebach'],
    ['Kong Frederik', 'Prins Joachim'], ['Mette Frederiksen', 'Lars Løkke'], ['Caroline Wozniacki', 'Viktor Axelsen'],
    ['Casper Christensen', 'Frank Hvam'], ['Kim Larsen', 'Thomas Helmig'], ['Anders Matthesen', 'Jonatan Spang'],
    ['Nikolaj Coster-Waldau', 'Pilou Asbæk'], ['Peter Schmeichel', 'Michael Laudrup'], ['Dronning Margrethe', 'Dronning Mary'],
    ['Suspekt', 'L.O.C.'], ['Tobias Rahim', 'Jada'], ['Gilli', 'Kesi'], ['Jonas Vingegaard', 'Mads Pedersen'],
    ['Søren Pilmark', 'Ulf Pilgaard'], ['Mikkel Hansen', 'Nikolaj Jacobsen'], ['Kevin Magnussen', 'Tom Kristensen'],
    ['Nicklas Bendtner', 'Simon Kjær'], ['Simon Talbot', 'Thomas Warberg'], ['Nikolaj Stokholm', 'Andreas Bo']
  ]},
  { id: 'fest', navn: 'Fest og druk', ord: [
    ['Ølbong', 'Beer pong'], ['Tømmermænd', 'Blackout'], ['Shots', 'Jägerbomb'], ['Fadøl', 'Dåseøl'], ['Fredagsbar', 'Julefrokost'],
    ['Bytur', 'Hjemmefest'], ['Roskilde', 'Distortion'], ['Karaoke', 'Stand-up'], ['Tequila', 'Sambuca'], ['Cigaret', 'Snus'],
    ['Uber', 'Natbus'], ['Kebab', 'Durum'], ['Forfest', 'Efterfest'], ['Sidste dans', 'Sidste øl'], ['Vodka Redbull', 'Mokai'],
    ['Studenterkørsel', 'Polterabend'], ['Konfirmation', 'Bryllup'], ['Nytårsaften', 'Sankt Hans'], ['Kings', 'Jeg har aldrig'],
    ['DJ\'en', 'Bartenderen'], ['Klippekort', 'Bøde'], ['Shotglas', 'Ølkrus'], ['Rusturen', 'Studieturen'], ['Tømmermandsmad', 'Morgenøl']
  ]},
  { id: 'fraekt', navn: 'Frækt', adult: true, ord: [
    ['Tinder', 'Bumble'], ['Håndjern', 'Bind for øjnene'], ['Onenightstand', 'Kæreste'], ['Kondom', 'P-pille'],
    ['Stripklub', 'Swingerklub'], ['Sexlegetøj', 'Massageolie'], ['Kys', 'Sugemærke'], ['G-streng', 'Boxershorts'],
    ['Porno', 'Erotisk roman'], ['Sexet undertøj', 'Nattøj'], ['Første date', 'Første kys'], ['Skinny dipping', 'Sauna'],
    ['Friends with benefits', 'Sidespring'], ['Nøgenbillede', 'Fræk sms'], ['Bad sammen', 'Massage'], ['Fifty Shades', 'Kama Sutra'],
    ['OnlyFans', 'Pornhub'], ['Strip poker', 'Flaskehalsen peger på']
  ]}
];
