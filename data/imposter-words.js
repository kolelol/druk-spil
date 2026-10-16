/* Imposter: ord pr. kategori. Alle får det samme ord, imposteren får intet.
   Ordene er de samme slags, som de kendte Imposter-apps bruger (imposter.app, findtheimposter.com,
   impostergamegenerator.fun): konkrete ting, alle kender, og som kan beskrives med ét ord ad gangen.
   Abstrakte ord (SU, kassekredit, friendzone) er fjernet: ejeren og vennerne kaldte dem ubeskriveligt dårlige.
   Hvert ord er vurderet af fem testpersoner (sjov og hvor nemt det er at sige noget om); alle med en sjov-karakter under 3 er fjernet.
   Hold det danske nede: ejeren fandt listen "for meget dansk", så kun de allermest kendte danske navne og steder er med.
   Kategorier med adult: true vises kun med "Frækt indhold" slået til. */
const IMPOSTER_WORDS = [
  { id: 'mad', navn: 'Mad og drikke', ord: [
    'Pizza', 'Burger', 'Spaghetti', 'Chokolade', 'Pandekager', 'Sushi', 'Tacos', 'Popcorn', 'Banan',
    'Pommes frites', 'Ramen', 'Jordbær',
    'Durum', 'Kebab', 'Hotdog', 'Nachos', 'Bøf', 'Spareribs',
    'Flæskesteg', 'Frikadeller', 'Red Bull', 'Chips',
    'Øl', 'Rødvin', 'Vodka', 'Jägerbomb', 'Gin og tonic', 'Mojito', 'Vandmelon', 'Bacon'
  ]},
  { id: 'dyr', navn: 'Dyr', ord: [
    'Hund', 'Kat', 'Elefant', 'Løve', 'Pingvin', 'Delfin', 'Abe', 'Giraf', 'Kanin', 'Hest', 'Haj', 'Bjørn',
    'Kænguru', 'Tiger', 'Panda', 'Krokodille', 'Skildpadde', 'Slange', 'Hval', 'Gris',
    'Ræv', 'Ulv', 'Rotte', 'Edderkop', 'Isbjørn', 'Gorilla', 'Papegøje',
    'Blæksprutte', 'Måge', 'Kamel', 'Æsel'
  ]},
  { id: 'ting', navn: 'Ting i hverdagen', ord: [
    'Telefon', 'Solbriller',
    'Cykel',
    'Toiletpapir',
    'Flaskeåbner', 'Lighter', 'Trampolin', 'Skateboard', 'Guitar', 'Mikrofon',
    'Toilet'
  ]},
  { id: 'steder', navn: 'Steder', ord: [
    'Stranden', 'Lufthavnen', 'Fitnesscentret', 'Kasinoet', 'Tivoli',
    'Fængslet', 'Stadion', 'Biografen', 'Natklubben',
    'Baren', 'Svømmehallen', 'Zoologisk Have', 'Hotellet', 'Færgen',
    'Tankstationen', 'McDonald\'s', 'Ikea', 'Legoland', 'Roskilde Festival', 'Christiania',
    'Aarhus', 'København',
    'Skadestuen'
  ]},
  { id: 'aktiviteter', navn: 'Aktiviteter', ord: [
    'Karaoke', 'Bowling', 'Surfing', 'Poker',
    'Beerpong', 'Padel', 'Gaming', 'Tatovering', 'Paintball', 'Gokart',
    'Bungeejump', 'Faldskærmsudspring', 'Koncert',
    'Date', 'Bytur', 'Forfest', 'Efterfest', 'Drengetur', 'Skiferie', 'Sydtur',
    'Bryllup', 'Nytårsaften', 'Juleaften', 'Halloween'
  ]},
  { id: 'jobs', navn: 'Jobs', ord: [
    'Læge', 'Brandmand', 'Kok', 'Pilot', 'Blikkenslager', 'Astronaut', 'Livredder', 'Bartender',
    'Detektiv', 'Politibetjent', 'Dørmand', 'Sygeplejerske',
    'Advokat', 'Dommer', 'Landmand', 'Stripper', 'Youtuber',
    'Influencer', 'Fodboldspiller', 'Soldat', 'Pædagog',
    'Statsminister', 'Pizzabager', 'Rapper', 'DJ', 'Skuespiller', 'Model', 'Personlig træner',
    'Spion'
  ]},
  { id: 'sport', navn: 'Sport', ord: [
    'Fodbold', 'Basketball', 'OL', 'Straffespark', 'VM', 'Håndbold',
    'Boksning', 'Ski', 'Bordtennis', 'Formel 1', 'Padel',
    'MMA', 'Darts', 'Billard', 'Bowling', 'Crossfit', 'Bænkpres',
    'Beachvolley', 'Champions League', 'Premier League', 'Målmand', 'Rødt kort', 'Offside',
    'Hattrick', 'Ølbong', 'Beerpong', 'Armlægning', 'Bordfodbold'
  ]},
  { id: 'film', navn: 'Film og serier', ord: [
    'Star Wars', 'Harry Potter', 'Løvernes Konge', 'The Office', 'Titanic', 'Jurassic Park', 'Batman',
    'Game of Thrones', 'Breaking Bad', 'Stranger Things', 'Spider-Man', 'Find Nemo', 'The Simpsons', 'Avatar', 'Avengers',
    'Alene hjemme', 'Forrest Gump', 'Toy Story', 'Gladiator', 'The Matrix',
    'Fast & Furious', 'James Bond', 'Ringenes Herre', 'Shrek', 'Squid Game', 'Peaky Blinders', 'Narcos',
    'Paradise Hotel',
    'Top Gun', 'Terminator', 'Joker', 'Barbie', 'Minions', 'South Park', 'Family Guy',
    'Rick and Morty', 'The Walking Dead', 'Vikings'
  ]},
  { id: 'lande', navn: 'Lande og byer', ord: [
    'Paris', 'New York', 'Tokyo', 'London', 'Italien', 'Australien', 'Brasilien', 'Egypten', 'Hawaii', 'Las Vegas', 'Hollywood',
    'Dubai', 'Rom', 'Berlin', 'Amsterdam', 'Barcelona', 'Mallorca', 'Sunny Beach', 'Prag', 'Sverige', 'Norge', 'Tyskland',
    'Spanien', 'Grækenland', 'Tyrkiet', 'Thailand', 'USA', 'Kina', 'Japan', 'Grønland',
    'Aarhus', 'København',
    'Ibiza', 'Marokko', 'Mexico', 'Indien'
  ]},
  { id: 'tech', navn: 'Teknologi og internet', ord: [
    'Emoji',
    'Siri', 'ChatGPT', 'Robot', 'Drone', 'Bitcoin', 'iPhone', 'Instagram', 'TikTok', 'Snapchat', 'Netflix', 'Spotify',
    'YouTube', 'Tinder', 'MobilePay', 'Playstation', 'Xbox', 'Nintendo Switch', 'Minecraft',
    'Fortnite', 'FIFA', 'GTA', 'Call of Duty', 'Counter-Strike', 'Pokémon', 'Mario', 'Among Us',
    'Temu', 'Tesla',
    'Discord', 'Twitch', 'OnlyFans'
  ]},
  { id: 'toej', navn: 'Tøj og mærker', ord: [
    'Sneakers', 'Solbriller', 'Kasket', 'Bikini', 'Jakkesæt',
    'Crocs', 'Nike', 'Adidas', 'Gucci', 'Louis Vuitton', 'Rolex', 'Moncler',
    'Canada Goose', 'Fodboldtrøje', 'Underbukser',
    'Piercing', 'Tatovering',
    'McDonald\'s', 'Coca-Cola', 'Carlsberg', 'Apple', 'Lego', 'Ikea',
    'Burger King', 'Starbucks', 'Red Bull', 'Monster', 'Marlboro'
  ]},
  { id: 'transport', navn: 'Transport', ord: [
    'Fly', 'Taxa', 'Cykel', 'Motorcykel', 'Helikopter',
    'Elløbehjul', 'Tesla', 'BMW', 'Mercedes', 'Audi',
    'Porsche', 'Ferrari', 'Lamborghini', 'Traktor', 'Knallert', 'Politibil',
    'Jetski', 'Speedbåd', 'Ubåd', 'Raket',
    'Kørekort', 'Natbus'
  ]},
  { id: 'kendte', navn: 'Kendte', ord: [
    'Messi', 'Ronaldo', 'Mbappé', 'Neymar', 'Haaland', 'Beckham', 'Zlatan', 'Christian Eriksen',
    'Taylor Swift', 'Drake', 'Ed Sheeran', 'Justin Bieber', 'Kanye West',
    'Eminem', 'Snoop Dogg', 'MrBeast', 'Elon Musk', 'Donald Trump', 'Kim Kardashian', 'The Rock', 'Tom Cruise',
    'Leonardo DiCaprio', 'Mads Mikkelsen', 'Gilli',
    'Kong Frederik', 'Mette Frederiksen', 'Casper Christensen',
    'Michael Jordan',
    'Mike Tyson', 'Conor McGregor',
    'Travis Scott', 'Shakira', 'Brad Pitt', 'Will Smith', 'Keanu Reeves',
    'Jeff Bezos', 'Mark Zuckerberg',
    'Barack Obama', 'Greta Thunberg'
  ]},
  { id: 'figurer', navn: 'Figurer fra film og spil', ord: [
    'Batman', 'Iron Man', 'Joker', 'Thanos', 'Darth Vader', 'Voldemort', 'Hulk', 'Thor', 'Spider-Man', 'Deadpool', 'Superman',
    'Captain America', 'Shrek', 'Mickey Mouse', 'Anders And', 'Pikachu', 'Mario', 'Luigi', 'Sonic',
    'Homer Simpson', 'SvampeBob', 'Peter Plys', 'Harry Potter', 'Gandalf', 'Gollum', 'Jack Sparrow', 'James Bond',
    'Terminator', 'Walter White', 'Simba', 'Buzz Lightyear', 'Woody', 'Yoda', 'Chewbacca',
    'Garfield', 'Scooby-Doo', 'Tom og Jerry', 'Minions', 'Barbie', 'Ken', 'Godzilla', 'King Kong', 'Dracula',
    'Zombie', 'Julemanden'
  ]},
  { id: 'fraekt', navn: 'Frækt', adult: true, ord: [
    'Tinder', 'Håndjern', 'Bind for øjnene', 'Onenightstand', 'Kondom', 'Stripklub', 'Dildo', 'Vibrator',
    'Pornhub', 'OnlyFans', 'Lingeri', 'Sugemærke', 'Trekant', 'Missionær', 'Doggy', '69', 'Cowgirl',
    'Nudes', 'Blowjob', 'Pik', 'Bryster', 'Glidecreme',
    'Bolleven', 'Pornostjerne', 'Orgasme', 'Onani', 'Striptease', 'Lapdance',
    'Dickpic',
    'Sexdukke', 'Fodfetich', 'Spanking', 'Strip-poker'
  ]}
];
