/* Imposter: ord pr. kategori. Alle får det samme ord, imposteren får intet.
   Ordene er de samme slags, som de kendte Imposter-apps bruger (imposter.app, findtheimposter.com,
   impostergamegenerator.fun): konkrete ting, alle kender, og som kan beskrives med ét ord ad gangen.
   Abstrakte ord (SU, kassekredit, friendzone) er fjernet: ejeren og vennerne kaldte dem ubeskriveligt dårlige.
   Hold det danske nede: ejeren fandt listen "for meget dansk", så kun de allermest kendte danske navne og steder er med.
   Kategorier med adult: true vises kun med "Frækt indhold" slået til. */
const IMPOSTER_WORDS = [
  { id: 'mad', navn: 'Mad og drikke', ord: [
    'Pizza', 'Burger', 'Is', 'Kaffe', 'Spaghetti', 'Sandwich', 'Chokolade', 'Pandekager', 'Sushi', 'Tacos', 'Popcorn', 'Banan',
    'Appelsinjuice', 'Småkager', 'Pommes frites', 'Æble', 'Pasta', 'Ramen', 'Ost', 'Jordbær', 'Guacamole', 'Croissant', 'Hummus',
    'Falafel', 'Durum', 'Kebab', 'Hotdog', 'Lasagne', 'Nachos', 'Burrito', 'Vaffel', 'Cappuccino', 'Bøf', 'Spareribs', 'Lagkage',
    'Mælk', 'Spejlæg', 'Rugbrød', 'Flæskesteg', 'Frikadeller', 'Smørrebrød', 'Red Bull', 'Cola', 'Chips',
    'Øl', 'Rødvin', 'Vodka', 'Jägerbomb', 'Gin og tonic', 'Mojito', 'Fadøl', 'Vandmelon', 'Avocado', 'Bacon',
    'Toast', 'Müsli', 'Havregrød', 'Suppe', 'Salat', 'Kylling', 'Rejer', 'Laks', 'Tun'
  ]},
  { id: 'dyr', navn: 'Dyr', ord: [
    'Hund', 'Kat', 'Elefant', 'Løve', 'Pingvin', 'Delfin', 'Abe', 'Giraf', 'Kanin', 'Hest', 'Haj', 'Sommerfugl', 'Ugle', 'Bjørn',
    'Kænguru', 'Tiger', 'Zebra', 'Panda', 'Ørn', 'Krokodille', 'Skildpadde', 'Slange', 'Flamingo', 'Kamæleon', 'Hval', 'Ko', 'Gris',
    'Får', 'Høne', 'Ræv', 'Ulv', 'Mus', 'Rotte', 'Edderkop', 'Myg', 'Bi', 'Hvalros', 'Isbjørn', 'Gorilla', 'Papegøje', 'Hamster',
    'Guldfisk', 'Blæksprutte', 'Måge', 'Due', 'Frø', 'Snegl', 'Hjort', 'Næsehorn', 'Flodhest', 'Kamel', 'Æsel', 'Gås', 'Krabbe'
  ]},
  { id: 'ting', navn: 'Ting i hverdagen', ord: [
    'Telefon', 'Stol', 'Tandbørste', 'Paraply', 'Solbriller', 'Pude', 'Nøgler', 'Pung', 'Spejl', 'Ur', 'Lampe', 'Rygsæk',
    'Høretelefoner', 'Dyne', 'Saks', 'Cykel', 'Hammer', 'Bærbar', 'Kompas', 'Kamera', 'Blyant', 'Kuglepen', 'Bog', 'Fjernbetjening',
    'Kaffemaskine', 'Mikroovn', 'Køleskab', 'Vaskemaskine', 'Støvsuger', 'Toiletpapir', 'Håndklæde', 'Sofa', 'Seng', 'Tv',
    'Airfryer', 'Flaskeåbner', 'Lighter', 'Tændstikker', 'Trampolin', 'Skateboard', 'Guitar', 'Klaver', 'Trommer', 'Mikrofon',
    'Kuffert', 'Termokande', 'Gryde', 'Stegepande', 'Kniv', 'Gaffel', 'Tallerken', 'Glas', 'Flaske', 'Dåse', 'Skraldespand',
    'Vindue', 'Dør', 'Trappe', 'Elevator', 'Badekar', 'Bruser', 'Toilet', 'Stearinlys', 'Balloner', 'Gavepapir', 'Legetøj'
  ]},
  { id: 'steder', navn: 'Steder', ord: [
    'Stranden', 'Lufthavnen', 'Biblioteket', 'Hospitalet', 'Fitnesscentret', 'Museet', 'Kasinoet', 'Akvariet', 'Tivoli', 'Supermarkedet',
    'Bageren', 'Møntvasken', 'Parkeringspladsen', 'Tagterrassen', 'Skolen', 'Kirken', 'Fængslet', 'Stadion', 'Biografen', 'Natklubben',
    'Baren', 'Svømmehallen', 'Zoologisk Have', 'Festivalen', 'Campingpladsen', 'Skiliften', 'Hotellet', 'Hostellet', 'Toget', 'Færgen',
    'Tankstationen', 'McDonald\'s', 'Ikea', 'Legoland', 'Roskilde Festival', 'Christiania',
    'Aarhus', 'København', 'Sommerhuset', 'Tandlægen',
    'Skadestuen'
  ]},
  { id: 'aktiviteter', navn: 'Aktiviteter', ord: [
    'Camping', 'Yoga', 'Fiskeri', 'Karaoke', 'Bowling', 'Havearbejde', 'Fotografering', 'Skateboarding', 'Surfing', 'Skak', 'Poker',
    'Vandring', 'Dans', 'Madlavning', 'Beerpong', 'Padel', 'Golf', 'Jagt', 'Gaming', 'Shopping', 'Tatovering', 'Paintball', 'Gokart',
    'Bungeejump', 'Faldskærmsudspring', 'Dykning', 'Ridning', 'Spinning', 'Boksetræning', 'Fodboldkamp', 'Koncert', 'Biograftur',
    'Date', 'Bytur', 'Forfest', 'Efterfest', 'Drengetur', 'Skiferie', 'Sydtur', 'Grillaften', 'Brætspil',
    'Netflix og chill', 'Løbetur', 'Svømning', 'Sauna', 'Massage', 'Frisøren', 'Bilvask', 'Flyttedag', 'Eksamen', 'Jobsamtale',
    'Bryllup', 'Fødselsdag', 'Nytårsaften', 'Juleaften', 'Halloween', 'Festival', 'Blind date', 'Tinder-date'
  ]},
  { id: 'jobs', navn: 'Jobs', ord: [
    'Læge', 'Brandmand', 'Kok', 'Pilot', 'Lærer', 'Blikkenslager', 'Astronaut', 'Tryllekunstner', 'Livredder', 'Bartender',
    'Blomsterhandler', 'Detektiv', 'Dyrlæge', 'Elektriker', 'Turistguide', 'Politibetjent', 'Dørmand', 'Sygeplejerske', 'Tandlæge',
    'Advokat', 'Dommer', 'Præst', 'Landmand', 'Fisker', 'Tømrer', 'Murer', 'Mekaniker', 'Frisør', 'Tatovør', 'Stripper', 'Youtuber',
    'Influencer', 'Fodboldspiller', 'Soldat', 'Buschauffør', 'Taxachauffør', 'Postbud', 'Skraldemand', 'Pædagog', 'Psykolog', 'Kirurg',
    'Statsminister', 'Konge', 'Pizzabager', 'Tjener', 'Kassedame', 'Rapper', 'DJ', 'Skuespiller', 'Model', 'Personlig træner',
    'Ejendomsmægler', 'Revisor', 'Programmør', 'Pædagogmedhjælper', 'Jordemoder', 'Bedemand', 'Dyrepasser', 'Klovn', 'Spion', 'Pirat'
  ]},
  { id: 'sport', navn: 'Sport', ord: [
    'Fodbold', 'Basketball', 'Tennis', 'Svømning', 'Maraton', 'OL', 'Straffespark', 'Guldmedalje', 'VM', 'Håndbold', 'Badminton',
    'Boksning', 'Brydning', 'Ski', 'Snowboard', 'Golf', 'Bordtennis', 'Baseball', 'Formel 1', 'Tour de France', 'Padel', 'Squash',
    'MMA', 'Darts', 'Billard', 'Bowling', 'E-sport', 'Crossfit', 'Bænkpres', 'Ishockey', 'Rugby', 'Amerikansk fodbold', 'Volleyball',
    'Beachvolley', 'Champions League', 'Premier League', 'Målmand', 'Rødt kort', 'Offside', 'Hjørnespark',
    'Hattrick', 'Dommeren', 'Ølbong', 'Beerpong', 'Flip cup', 'Armlægning', 'Bordfodbold'
  ]},
  { id: 'film', navn: 'Film og serier', ord: [
    'Star Wars', 'Harry Potter', 'Løvernes Konge', 'Friends', 'The Office', 'Titanic', 'Jurassic Park', 'Batman', 'Frost',
    'Game of Thrones', 'Breaking Bad', 'Stranger Things', 'Spider-Man', 'Find Nemo', 'The Simpsons', 'Avatar', 'Avengers', 'Inception',
    'Interstellar', 'The Godfather', 'Alene hjemme', 'Forrest Gump', 'Toy Story', 'Dødens Gab', 'Gladiator', 'The Matrix',
    'Fast & Furious', 'James Bond', 'Ringenes Herre', 'Shrek', 'Squid Game', 'Peaky Blinders', 'Narcos', 'Prison Break', 'Klovn',
    'Paradise Hotel',
    'Top Gun', 'Rocky', 'Terminator', 'Joker', 'Oppenheimer', 'Barbie', 'Minions', 'South Park', 'Family Guy',
    'Rick and Morty', 'Wednesday', 'The Walking Dead', 'Suits', 'Vikings', 'Bridgerton', 'Emily in Paris'
  ]},
  { id: 'lande', navn: 'Lande og byer', ord: [
    'Paris', 'New York', 'Tokyo', 'London', 'Italien', 'Australien', 'Brasilien', 'Egypten', 'Hawaii', 'Las Vegas', 'Hollywood',
    'Dubai', 'Rom', 'Berlin', 'Amsterdam', 'Barcelona', 'Mallorca', 'Sunny Beach', 'Prag', 'Budapest', 'Sverige', 'Norge', 'Tyskland',
    'Spanien', 'Grækenland', 'Tyrkiet', 'Thailand', 'USA', 'Kina', 'Japan', 'Rusland', 'Grønland', 'Island', 'Nordkorea',
    'Aarhus', 'København', 'Bornholm', 'Malmø', 'Hamborg', 'Flensborg', 'Oslo',
    'Stockholm', 'Ibiza', 'Kreta', 'Rhodos', 'Tenerife', 'Marokko', 'Mexico', 'Indien', 'Canada', 'Sydafrika', 'Antarktis', 'Månen'
  ]},
  { id: 'tech', navn: 'Teknologi og internet', ord: [
    'Smartphone', 'Selfie', 'Emoji', 'Adgangskode', 'Wifi', 'Notifikation', 'Screenshot', 'Oplader', 'Flytilstand', 'Videoopkald',
    'Smartwatch', 'Siri', 'ChatGPT', 'Robot', 'Drone', 'Bitcoin', 'iPhone', 'Instagram', 'TikTok', 'Snapchat', 'Netflix', 'Spotify',
    'YouTube', 'Google', 'Facebook', 'Tinder', 'MobilePay', 'Playstation', 'Xbox', 'Nintendo Switch', 'Minecraft',
    'Fortnite', 'FIFA', 'GTA', 'Call of Duty', 'Counter-Strike', 'Pokémon', 'Mario', 'Among Us', 'Roblox', 'Candy Crush',
    'Zalando', 'Amazon', 'Temu', 'Tesla', 'Powerbank', 'AirPods', 'Bluetooth', 'Podcast', 'Meme', 'Gruppechat',
    'Discord', 'Twitch', 'OnlyFans', 'Reddit', 'Wikipedia', 'E-mail', 'Spam'
  ]},
  { id: 'toej', navn: 'Tøj og mærker', ord: [
    'Jeans', 'Sneakers', 'Solbriller', 'Håndtaske', 'Smykker', 'Makeup', 'Hættetrøje', 'Kasket', 'Bikini', 'Badebukser', 'Jakkesæt',
    'Slips', 'Stiletter', 'Crocs', 'Nike', 'Adidas', 'Gucci', 'Louis Vuitton', 'Zara', 'H&M', 'Rolex', 'Ralph Lauren', 'Moncler',
    'Canada Goose', 'Fodboldtrøje', 'Træningstøj', 'Underbukser', 'Sokker', 'Vinterjakke', 'Regnjakke', 'Hue', 'Vanter', 'Tørklæde',
    'Bælte', 'Ur', 'Ørering', 'Piercing', 'Tatovering', 'Parfume', 'Deodorant', 'Hårvoks', 'Barbermaskine', 'Nøgenbilleder',
    'McDonald\'s', 'Coca-Cola', 'Pepsi', 'Carlsberg', 'Apple', 'Samsung', 'Lego', 'Ikea',
    'Burger King', 'Starbucks', 'Red Bull', 'Monster', 'Marlboro'
  ]},
  { id: 'transport', navn: 'Transport', ord: [
    'Fly', 'Metro', 'Taxa', 'Cykel', 'Motorcykel', 'Krydstogtskib', 'Luftballon', 'Helikopter', 'Roadtrip', 'Trafikprop',
    'Tankstation', 'Punktering', 'Elløbehjul', 'Bus', 'Tog', 'Færge', 'Tesla', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota',
    'Porsche', 'Ferrari', 'Lamborghini', 'Traktor', 'Knallert', 'Ambulance', 'Politibil', 'Brandbil', 'Lastbil', 'Autocamper',
    'Jetski', 'Speedbåd', 'Kajak', 'Rulleskøjter', 'Segway', 'Skib', 'Ubåd', 'Raket', 'Rumskib', 'Storebæltsbroen',
    'Fartkontrol', 'Parkeringsbøde', 'Kørekort', 'Benzin', 'Elbil', 'Natbus', 'Fartbump', 'Rundkørsel', 'Lyskryds'
  ]},
  { id: 'kendte', navn: 'Kendte', ord: [
    'Messi', 'Ronaldo', 'Mbappé', 'Neymar', 'Haaland', 'Beckham', 'Zlatan', 'Christian Eriksen',
    'Taylor Swift', 'Beyoncé', 'Drake', 'Ed Sheeran', 'Billie Eilish', 'Justin Bieber', 'Rihanna', 'Kanye West',
    'Eminem', 'Snoop Dogg', 'MrBeast', 'PewDiePie', 'Elon Musk', 'Donald Trump', 'Putin', 'Kim Kardashian', 'The Rock', 'Tom Cruise',
    'Leonardo DiCaprio', 'Mads Mikkelsen', 'Medina', 'Gilli',
    'Kong Frederik', 'Mette Frederiksen', 'Casper Christensen',
    'Jonas Vingegaard', 'Michael Jordan',
    'LeBron James', 'Mike Tyson', 'Conor McGregor', 'Max Verstappen', 'Lionel Richie', 'Ariana Grande', 'Dua Lipa',
    'The Weeknd', 'Travis Scott', 'Bad Bunny', 'Adele', 'Shakira', 'Jennifer Lopez', 'Brad Pitt', 'Will Smith', 'Keanu Reeves',
    'Ryan Reynolds', 'Margot Robbie', 'Zendaya', 'Harry Styles', 'Olivia Rodrigo', 'Kylie Jenner', 'Jeff Bezos', 'Mark Zuckerberg',
    'Bill Gates', 'Barack Obama', 'Joe Biden', 'Zelenskyj', 'Paven', 'Dalai Lama', 'Greta Thunberg'
  ]},
  { id: 'figurer', navn: 'Figurer fra film og spil', ord: [
    'Batman', 'Iron Man', 'Joker', 'Thanos', 'Darth Vader', 'Voldemort', 'Hulk', 'Thor', 'Spider-Man', 'Deadpool', 'Superman',
    'Captain America', 'Wonder Woman', 'Black Panther', 'Shrek', 'Mickey Mouse', 'Anders And', 'Pikachu', 'Mario', 'Luigi', 'Sonic',
    'Homer Simpson', 'SvampeBob', 'Peter Plys', 'Harry Potter', 'Hermione', 'Gandalf', 'Gollum', 'Jack Sparrow', 'James Bond', 'Rambo',
    'Terminator', 'Walter White', 'Jon Snow', 'Elsa', 'Simba', 'Nemo', 'Buzz Lightyear', 'Woody', 'Yoda', 'Chewbacca', 'Pingu',
    'Garfield', 'Scooby-Doo', 'Tom og Jerry', 'Bugs Bunny', 'Minions', 'Barbie', 'Ken', 'Godzilla', 'King Kong', 'Dracula',
    'Frankenstein', 'Zombie', 'Julemanden', 'Tandfeen', 'Påskeharen', 'Pippi Langstrømpe', 'Emil fra Lønneberg',
    'Ronja Røverdatter', 'Asterix', 'Tintin', 'Lucky Luke', 'Super Mario', 'Lara Croft', 'Master Chief', 'Kratos', 'Steve', 'Creeper'
  ]},
  { id: 'fraekt', navn: 'Frækt', adult: true, ord: [
    'Tinder', 'Håndjern', 'Bind for øjnene', 'Onenightstand', 'Kondom', 'P-pille', 'Stripklub', 'Swingerklub', 'Dildo', 'Vibrator',
    'Pornhub', 'OnlyFans', 'Sexlegetøj', 'Lingeri', 'Sugemærke', 'Morgenstiv', 'Trekant', 'Missionær', 'Doggy', '69', 'Cowgirl',
    'Sexting', 'Nudes', 'Blowjob', 'Pik', 'Bryster', 'Bagdel', 'Fetich', 'Piskeris', 'Glidecreme', 'Morgenbolle', 'Tungekys',
    'Bolleven', 'Pornostjerne', 'Orgasme', 'Onani', 'Striptease', 'Lapdance', 'Bordelet', 'Hotelværelse', 'Bagsædet', 'Brusebad',
    'Walk of shame', 'Sugardaddy', 'Milf', 'Fuckboy', 'Dickpic', 'Nøgenbadning', 'Kyssesygen', 'Klamydia', 'G-punktet', 'Erotik',
    'Sexdukke', 'Latex', 'Fodfetich', 'Spanking', 'Fifty Shades of Grey', 'Kamasutra', 'Strip-poker', 'Flaskehalsen', 'Sandhed eller konsekvens'
  ]}
];
