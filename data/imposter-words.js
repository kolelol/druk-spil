/* Imposter: ord pr. kategori. Alle får det samme ord, imposteren får intet.
   Ordene er de samme slags, som de kendte Imposter-apps bruger (imposter.app, findtheimposter.com,
   impostergamegenerator.fun): konkrete ting, alle kender, og som kan beskrives med ét ord ad gangen.
   Abstrakte ord (SU, kassekredit, friendzone) er fjernet: ejeren og vennerne kaldte dem ubeskriveligt dårlige.
   Hvert ord er vurderet af fem testpersoner (sjov og hvor nemt det er at sige noget om); de dårligste er fjernet.
   Hold det danske nede: ejeren fandt listen "for meget dansk", så kun de allermest kendte danske navne og steder er med.
   Kategorier med adult: true vises kun med "Frækt indhold" slået til. */
const IMPOSTER_WORDS = [
  { id: 'mad', navn: 'Mad og drikke', ord: [
    'Pizza', 'Burger', 'Is', 'Kaffe', 'Spaghetti', 'Chokolade', 'Pandekager', 'Sushi', 'Tacos', 'Popcorn', 'Banan',
    'Pommes frites', 'Ramen', 'Jordbær', 'Croissant',
    'Durum', 'Kebab', 'Hotdog', 'Lasagne', 'Nachos', 'Burrito', 'Bøf', 'Spareribs',
    'Rugbrød', 'Flæskesteg', 'Frikadeller', 'Red Bull', 'Cola', 'Chips',
    'Øl', 'Rødvin', 'Vodka', 'Jägerbomb', 'Gin og tonic', 'Mojito', 'Fadøl', 'Vandmelon', 'Avocado', 'Bacon',
    'Kylling'
  ]},
  { id: 'dyr', navn: 'Dyr', ord: [
    'Hund', 'Kat', 'Elefant', 'Løve', 'Pingvin', 'Delfin', 'Abe', 'Giraf', 'Kanin', 'Hest', 'Haj', 'Bjørn',
    'Kænguru', 'Tiger', 'Zebra', 'Panda', 'Krokodille', 'Skildpadde', 'Slange', 'Flamingo', 'Hval', 'Ko', 'Gris',
    'Får', 'Ræv', 'Ulv', 'Mus', 'Rotte', 'Edderkop', 'Myg', 'Bi', 'Isbjørn', 'Gorilla', 'Papegøje',
    'Blæksprutte', 'Måge', 'Frø', 'Næsehorn', 'Flodhest', 'Kamel', 'Æsel', 'Krabbe'
  ]},
  { id: 'ting', navn: 'Ting i hverdagen', ord: [
    'Telefon', 'Solbriller', 'Nøgler', 'Pung',
    'Høretelefoner', 'Cykel', 'Hammer', 'Kamera', 'Fjernbetjening',
    'Mikroovn', 'Køleskab', 'Toiletpapir', 'Seng', 'Tv',
    'Airfryer', 'Flaskeåbner', 'Lighter', 'Trampolin', 'Skateboard', 'Guitar', 'Trommer', 'Mikrofon',
    'Kniv', 'Flaske',
    'Elevator', 'Toilet', 'Balloner'
  ]},
  { id: 'steder', navn: 'Steder', ord: [
    'Stranden', 'Lufthavnen', 'Hospitalet', 'Fitnesscentret', 'Kasinoet', 'Tivoli', 'Supermarkedet',
    'Skolen', 'Fængslet', 'Stadion', 'Biografen', 'Natklubben',
    'Baren', 'Svømmehallen', 'Zoologisk Have', 'Festivalen', 'Campingpladsen', 'Skiliften', 'Hotellet', 'Toget', 'Færgen',
    'Tankstationen', 'McDonald\'s', 'Ikea', 'Legoland', 'Roskilde Festival', 'Christiania',
    'Aarhus', 'København', 'Sommerhuset',
    'Skadestuen'
  ]},
  { id: 'aktiviteter', navn: 'Aktiviteter', ord: [
    'Camping', 'Karaoke', 'Bowling', 'Skateboarding', 'Surfing', 'Skak', 'Poker',
    'Dans', 'Beerpong', 'Padel', 'Golf', 'Gaming', 'Tatovering', 'Paintball', 'Gokart',
    'Bungeejump', 'Faldskærmsudspring', 'Dykning', 'Boksetræning', 'Fodboldkamp', 'Koncert', 'Biograftur',
    'Date', 'Bytur', 'Forfest', 'Efterfest', 'Drengetur', 'Skiferie', 'Sydtur', 'Grillaften', 'Brætspil',
    'Netflix og chill', 'Sauna', 'Massage', 'Frisøren', 'Eksamen', 'Jobsamtale',
    'Bryllup', 'Fødselsdag', 'Nytårsaften', 'Juleaften', 'Halloween', 'Festival', 'Blind date', 'Tinder-date'
  ]},
  { id: 'jobs', navn: 'Jobs', ord: [
    'Læge', 'Brandmand', 'Kok', 'Pilot', 'Lærer', 'Blikkenslager', 'Astronaut', 'Tryllekunstner', 'Livredder', 'Bartender',
    'Detektiv', 'Politibetjent', 'Dørmand', 'Sygeplejerske',
    'Advokat', 'Dommer', 'Præst', 'Landmand', 'Murer', 'Mekaniker', 'Frisør', 'Tatovør', 'Stripper', 'Youtuber',
    'Influencer', 'Fodboldspiller', 'Soldat', 'Buschauffør', 'Taxachauffør', 'Postbud', 'Skraldemand', 'Pædagog', 'Psykolog', 'Kirurg',
    'Statsminister', 'Konge', 'Pizzabager', 'Tjener', 'Kassedame', 'Rapper', 'DJ', 'Skuespiller', 'Model', 'Personlig træner',
    'Jordemoder', 'Bedemand', 'Klovn', 'Spion', 'Pirat'
  ]},
  { id: 'sport', navn: 'Sport', ord: [
    'Fodbold', 'Basketball', 'Tennis', 'OL', 'Straffespark', 'Guldmedalje', 'VM', 'Håndbold',
    'Boksning', 'Brydning', 'Ski', 'Snowboard', 'Golf', 'Bordtennis', 'Formel 1', 'Tour de France', 'Padel',
    'MMA', 'Darts', 'Billard', 'Bowling', 'E-sport', 'Crossfit', 'Bænkpres', 'Ishockey', 'Rugby', 'Amerikansk fodbold',
    'Beachvolley', 'Champions League', 'Premier League', 'Målmand', 'Rødt kort', 'Offside',
    'Hattrick', 'Dommeren', 'Ølbong', 'Beerpong', 'Flip cup', 'Armlægning', 'Bordfodbold'
  ]},
  { id: 'film', navn: 'Film og serier', ord: [
    'Star Wars', 'Harry Potter', 'Løvernes Konge', 'Friends', 'The Office', 'Titanic', 'Jurassic Park', 'Batman', 'Frost',
    'Game of Thrones', 'Breaking Bad', 'Stranger Things', 'Spider-Man', 'Find Nemo', 'The Simpsons', 'Avatar', 'Avengers',
    'Alene hjemme', 'Forrest Gump', 'Toy Story', 'Gladiator', 'The Matrix',
    'Fast & Furious', 'James Bond', 'Ringenes Herre', 'Shrek', 'Squid Game', 'Peaky Blinders', 'Narcos', 'Prison Break', 'Klovn',
    'Paradise Hotel',
    'Top Gun', 'Rocky', 'Terminator', 'Joker', 'Barbie', 'Minions', 'South Park', 'Family Guy',
    'Rick and Morty', 'The Walking Dead', 'Vikings'
  ]},
  { id: 'lande', navn: 'Lande og byer', ord: [
    'Paris', 'New York', 'Tokyo', 'London', 'Italien', 'Australien', 'Brasilien', 'Egypten', 'Hawaii', 'Las Vegas', 'Hollywood',
    'Dubai', 'Rom', 'Berlin', 'Amsterdam', 'Barcelona', 'Mallorca', 'Sunny Beach', 'Prag', 'Budapest', 'Sverige', 'Norge', 'Tyskland',
    'Spanien', 'Grækenland', 'Tyrkiet', 'Thailand', 'USA', 'Kina', 'Japan', 'Rusland', 'Grønland', 'Island', 'Nordkorea',
    'Aarhus', 'København', 'Malmø', 'Hamborg', 'Flensborg',
    'Ibiza', 'Tenerife', 'Marokko', 'Mexico', 'Indien', 'Månen'
  ]},
  { id: 'tech', navn: 'Teknologi og internet', ord: [
    'Selfie', 'Emoji', 'Screenshot',
    'Siri', 'ChatGPT', 'Robot', 'Drone', 'Bitcoin', 'iPhone', 'Instagram', 'TikTok', 'Snapchat', 'Netflix', 'Spotify',
    'YouTube', 'Facebook', 'Tinder', 'MobilePay', 'Playstation', 'Xbox', 'Nintendo Switch', 'Minecraft',
    'Fortnite', 'FIFA', 'GTA', 'Call of Duty', 'Counter-Strike', 'Pokémon', 'Mario', 'Among Us',
    'Amazon', 'Temu', 'Tesla', 'AirPods', 'Meme', 'Gruppechat',
    'Discord', 'Twitch', 'OnlyFans', 'Reddit'
  ]},
  { id: 'toej', navn: 'Tøj og mærker', ord: [
    'Sneakers', 'Solbriller', 'Kasket', 'Bikini', 'Badebukser', 'Jakkesæt',
    'Stiletter', 'Crocs', 'Nike', 'Adidas', 'Gucci', 'Louis Vuitton', 'Rolex', 'Ralph Lauren', 'Moncler',
    'Canada Goose', 'Fodboldtrøje', 'Underbukser',
    'Piercing', 'Tatovering', 'Parfume', 'Deodorant', 'Hårvoks', 'Barbermaskine', 
    'McDonald\'s', 'Coca-Cola', 'Carlsberg', 'Apple', 'Samsung', 'Lego', 'Ikea',
    'Burger King', 'Starbucks', 'Red Bull', 'Monster', 'Marlboro'
  ]},
  { id: 'transport', navn: 'Transport', ord: [
    'Fly', 'Taxa', 'Cykel', 'Motorcykel', 'Helikopter', 'Roadtrip',
    'Tankstation', 'Elløbehjul', 'Tog', 'Færge', 'Tesla', 'BMW', 'Mercedes', 'Audi',
    'Porsche', 'Ferrari', 'Lamborghini', 'Traktor', 'Knallert', 'Ambulance', 'Politibil', 'Brandbil',
    'Jetski', 'Speedbåd', 'Segway', 'Ubåd', 'Raket',
    'Fartkontrol', 'Parkeringsbøde', 'Kørekort', 'Natbus'
  ]},
  { id: 'kendte', navn: 'Kendte', ord: [
    'Messi', 'Ronaldo', 'Mbappé', 'Neymar', 'Haaland', 'Beckham', 'Zlatan', 'Christian Eriksen',
    'Taylor Swift', 'Beyoncé', 'Drake', 'Ed Sheeran', 'Justin Bieber', 'Rihanna', 'Kanye West',
    'Eminem', 'Snoop Dogg', 'MrBeast', 'PewDiePie', 'Elon Musk', 'Donald Trump', 'Putin', 'Kim Kardashian', 'The Rock', 'Tom Cruise',
    'Leonardo DiCaprio', 'Mads Mikkelsen', 'Medina', 'Gilli',
    'Kong Frederik', 'Mette Frederiksen', 'Casper Christensen',
    'Michael Jordan',
    'LeBron James', 'Mike Tyson', 'Conor McGregor', 'Max Verstappen', 'Ariana Grande', 'Dua Lipa',
    'The Weeknd', 'Travis Scott', 'Shakira', 'Jennifer Lopez', 'Brad Pitt', 'Will Smith', 'Keanu Reeves',
    'Ryan Reynolds', 'Margot Robbie', 'Jeff Bezos', 'Mark Zuckerberg',
    'Bill Gates', 'Barack Obama', 'Joe Biden', 'Paven', 'Greta Thunberg'
  ]},
  { id: 'figurer', navn: 'Figurer fra film og spil', ord: [
    'Batman', 'Iron Man', 'Joker', 'Thanos', 'Darth Vader', 'Voldemort', 'Hulk', 'Thor', 'Spider-Man', 'Deadpool', 'Superman',
    'Captain America', 'Shrek', 'Mickey Mouse', 'Anders And', 'Pikachu', 'Mario', 'Luigi', 'Sonic',
    'Homer Simpson', 'SvampeBob', 'Peter Plys', 'Harry Potter', 'Gandalf', 'Gollum', 'Jack Sparrow', 'James Bond', 'Rambo',
    'Terminator', 'Walter White', 'Jon Snow', 'Elsa', 'Simba', 'Nemo', 'Buzz Lightyear', 'Woody', 'Yoda', 'Chewbacca', 'Pingu',
    'Garfield', 'Scooby-Doo', 'Tom og Jerry', 'Bugs Bunny', 'Minions', 'Barbie', 'Ken', 'Godzilla', 'King Kong', 'Dracula',
    'Zombie', 'Julemanden', 'Pippi Langstrømpe',
    'Creeper'
  ]},
  { id: 'fraekt', navn: 'Frækt', adult: true, ord: [
    'Tinder', 'Håndjern', 'Bind for øjnene', 'Onenightstand', 'Kondom', 'P-pille', 'Stripklub', 'Swingerklub', 'Dildo', 'Vibrator',
    'Pornhub', 'OnlyFans', 'Lingeri', 'Sugemærke', 'Morgenstiv', 'Trekant', 'Missionær', 'Doggy', '69', 'Cowgirl',
    'Sexting', 'Nudes', 'Blowjob', 'Pik', 'Bryster', 'Bagdel', 'Glidecreme', 'Morgenbolle', 'Tungekys',
    'Bolleven', 'Pornostjerne', 'Orgasme', 'Onani', 'Striptease', 'Lapdance', 'Bordelet', 'Bagsædet',
    'Walk of shame', 'Sugardaddy', 'Milf', 'Fuckboy', 'Dickpic', 'Nøgenbadning', 'Kyssesygen', 'Klamydia',
    'Sexdukke', 'Latex', 'Fodfetich', 'Spanking', 'Fifty Shades of Grey', 'Kamasutra', 'Strip-poker', 'Flaskehalsen', 'Sandhed eller konsekvens'
  ]}
];
