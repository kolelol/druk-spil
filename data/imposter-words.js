/* Imposter: ord pr. kategori. Alle får det samme ord, imposteren får intet.
   Ordene er de samme slags, som de kendte Imposter-apps bruger (imposter.app, findtheimposter.com,
   impostergamegenerator.fun): konkrete ting, alle kender, og som kan beskrives med ét ord ad gangen.
   Abstrakte ord (SU, kassekredit, friendzone) er fjernet: ejeren og vennerne kaldte dem ubeskriveligt dårlige.
   Hvert ord er vurderet af fem testpersoner (sjov og hvor nemt det er at sige noget om); alle med en sjov-karakter under 3 er fjernet.
   Hold det danske nede: ejeren fandt listen "for meget dansk", så kun de allermest kendte danske navne og steder er med.
   Kategorier med adult: true vises kun med "Frækt indhold" slået til. */
const IMPOSTER_WORDS = [
  { id: 'mad', navn: 'Mad og drikke', ord: [
    'Pizza', 'Burger', 'Is', 'Spaghetti', 'Chokolade', 'Pandekager', 'Sushi', 'Tacos', 'Popcorn', 'Banan',
    'Pommes frites', 'Ramen', 'Jordbær',
    'Durum', 'Kebab', 'Hotdog', 'Nachos', 'Bøf', 'Spareribs',
    'Flæskesteg', 'Frikadeller', 'Red Bull', 'Cola', 'Chips',
    'Øl', 'Rødvin', 'Vodka', 'Jägerbomb', 'Gin og tonic', 'Mojito', 'Fadøl', 'Vandmelon', 'Bacon'
  ]},
  { id: 'dyr', navn: 'Dyr', ord: [
    'Hund', 'Kat', 'Elefant', 'Løve', 'Pingvin', 'Delfin', 'Abe', 'Giraf', 'Kanin', 'Hest', 'Haj', 'Bjørn',
    'Kænguru', 'Tiger', 'Panda', 'Krokodille', 'Skildpadde', 'Slange', 'Hval', 'Gris',
    'Ræv', 'Ulv', 'Rotte', 'Edderkop', 'Isbjørn', 'Gorilla', 'Papegøje',
    'Blæksprutte', 'Måge', 'Kamel', 'Æsel'
  ]},
  { id: 'ting', navn: 'Ting i hverdagen', ord: [
    'Telefon', 'Solbriller', 'Pung',
    'Cykel', 'Hammer', 'Fjernbetjening',
    'Toiletpapir', 'Seng',
    'Airfryer', 'Flaskeåbner', 'Lighter', 'Trampolin', 'Skateboard', 'Guitar', 'Mikrofon',

    'Toilet'
  ]},
  { id: 'steder', navn: 'Steder', ord: [
    'Stranden', 'Lufthavnen', 'Fitnesscentret', 'Kasinoet', 'Tivoli',
    'Fængslet', 'Stadion', 'Biografen', 'Natklubben',
    'Baren', 'Svømmehallen', 'Zoologisk Have', 'Festivalen', 'Hotellet', 'Færgen',
    'Tankstationen', 'McDonald\'s', 'Ikea', 'Legoland', 'Roskilde Festival', 'Christiania',
    'Aarhus', 'København', 'Sommerhuset',
    'Skadestuen'
  ]},
  { id: 'aktiviteter', navn: 'Aktiviteter', ord: [
    'Karaoke', 'Bowling', 'Skateboarding', 'Surfing', 'Poker',
    'Dans', 'Beerpong', 'Padel', 'Gaming', 'Tatovering', 'Paintball', 'Gokart',
    'Bungeejump', 'Faldskærmsudspring', 'Boksetræning', 'Fodboldkamp', 'Koncert',
    'Date', 'Bytur', 'Forfest', 'Efterfest', 'Drengetur', 'Skiferie', 'Sydtur', 'Grillaften',
    'Sauna', 'Massage',
    'Bryllup', 'Nytårsaften', 'Juleaften', 'Halloween', 'Festival', 'Blind date'
  ]},
  { id: 'jobs', navn: 'Jobs', ord: [
    'Læge', 'Brandmand', 'Kok', 'Pilot', 'Blikkenslager', 'Astronaut', 'Tryllekunstner', 'Livredder', 'Bartender',
    'Detektiv', 'Politibetjent', 'Dørmand', 'Sygeplejerske',
    'Advokat', 'Dommer', 'Landmand', 'Tatovør', 'Stripper', 'Youtuber',
    'Influencer', 'Fodboldspiller', 'Soldat', 'Taxachauffør', 'Pædagog',
    'Statsminister', 'Konge', 'Pizzabager', 'Kassedame', 'Rapper', 'DJ', 'Skuespiller', 'Model', 'Personlig træner',
    'Klovn', 'Spion', 'Pirat'
  ]},
  { id: 'sport', navn: 'Sport', ord: [
    'Fodbold', 'Basketball', 'OL', 'Straffespark', 'VM', 'Håndbold',
    'Boksning', 'Brydning', 'Ski', 'Bordtennis', 'Formel 1', 'Padel',
    'MMA', 'Darts', 'Billard', 'Bowling', 'E-sport', 'Crossfit', 'Bænkpres',
    'Beachvolley', 'Champions League', 'Premier League', 'Målmand', 'Rødt kort', 'Offside',
    'Hattrick', 'Dommeren', 'Ølbong', 'Beerpong', 'Flip cup', 'Armlægning', 'Bordfodbold'
  ]},
  { id: 'film', navn: 'Film og serier', ord: [
    'Star Wars', 'Harry Potter', 'Løvernes Konge', 'The Office', 'Titanic', 'Jurassic Park', 'Batman',
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
    'Spanien', 'Grækenland', 'Tyrkiet', 'Thailand', 'USA', 'Kina', 'Japan', 'Rusland', 'Grønland', 'Nordkorea',
    'Aarhus', 'København', 'Flensborg',
    'Ibiza', 'Marokko', 'Mexico', 'Indien', 'Månen'
  ]},
  { id: 'tech', navn: 'Teknologi og internet', ord: [
    'Selfie', 'Emoji', 'Screenshot',
    'Siri', 'ChatGPT', 'Robot', 'Drone', 'Bitcoin', 'iPhone', 'Instagram', 'TikTok', 'Snapchat', 'Netflix', 'Spotify',
    'YouTube', 'Facebook', 'Tinder', 'MobilePay', 'Playstation', 'Xbox', 'Nintendo Switch', 'Minecraft',
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
    'Fly', 'Taxa', 'Cykel', 'Motorcykel', 'Helikopter', 'Roadtrip',
    'Elløbehjul', 'Færge', 'Tesla', 'BMW', 'Mercedes', 'Audi',
    'Porsche', 'Ferrari', 'Lamborghini', 'Traktor', 'Knallert', 'Politibil',
    'Jetski', 'Speedbåd', 'Segway', 'Ubåd', 'Raket',
    'Fartkontrol', 'Parkeringsbøde', 'Kørekort', 'Natbus'
  ]},
  { id: 'kendte', navn: 'Kendte', ord: [
    'Messi', 'Ronaldo', 'Mbappé', 'Neymar', 'Haaland', 'Beckham', 'Zlatan', 'Christian Eriksen',
    'Taylor Swift', 'Drake', 'Ed Sheeran', 'Justin Bieber', 'Kanye West',
    'Eminem', 'Snoop Dogg', 'MrBeast', 'Elon Musk', 'Donald Trump', 'Putin', 'Kim Kardashian', 'The Rock', 'Tom Cruise',
    'Leonardo DiCaprio', 'Mads Mikkelsen', 'Gilli',
    'Kong Frederik', 'Mette Frederiksen', 'Casper Christensen',
    'Michael Jordan',
    'Mike Tyson', 'Conor McGregor',
    'Travis Scott', 'Shakira', 'Brad Pitt', 'Will Smith', 'Keanu Reeves',
    'Jeff Bezos', 'Mark Zuckerberg',
    'Bill Gates', 'Barack Obama', 'Joe Biden', 'Greta Thunberg'
  ]},
  { id: 'figurer', navn: 'Figurer fra film og spil', ord: [
    'Batman', 'Iron Man', 'Joker', 'Thanos', 'Darth Vader', 'Voldemort', 'Hulk', 'Thor', 'Spider-Man', 'Deadpool', 'Superman',
    'Captain America', 'Shrek', 'Mickey Mouse', 'Anders And', 'Pikachu', 'Mario', 'Luigi', 'Sonic',
    'Homer Simpson', 'SvampeBob', 'Peter Plys', 'Harry Potter', 'Gandalf', 'Gollum', 'Jack Sparrow', 'James Bond',
    'Terminator', 'Walter White', 'Simba', 'Nemo', 'Buzz Lightyear', 'Woody', 'Yoda', 'Chewbacca', 'Pingu',
    'Garfield', 'Scooby-Doo', 'Tom og Jerry', 'Minions', 'Barbie', 'Ken', 'Godzilla', 'King Kong', 'Dracula',
    'Zombie', 'Julemanden', 'Pippi Langstrømpe',
    'Creeper'
  ]},
  { id: 'fraekt', navn: 'Frækt', adult: true, ord: [
    'Tinder', 'Håndjern', 'Bind for øjnene', 'Onenightstand', 'Kondom', 'Stripklub', 'Swingerklub', 'Dildo', 'Vibrator',
    'Pornhub', 'OnlyFans', 'Lingeri', 'Sugemærke', 'Trekant', 'Missionær', 'Doggy', '69', 'Cowgirl',
    'Sexting', 'Nudes', 'Blowjob', 'Pik', 'Bryster', 'Bagdel', 'Glidecreme', 'Tungekys',
    'Bolleven', 'Pornostjerne', 'Orgasme', 'Onani', 'Striptease', 'Lapdance',
    'Dickpic', 'Nøgenbadning',
    'Sexdukke', 'Latex', 'Fodfetich', 'Spanking', 'Fifty Shades of Grey', 'Kamasutra', 'Strip-poker', 'Flaskehalsen', 'Sandhed eller konsekvens'
  ]}
];
