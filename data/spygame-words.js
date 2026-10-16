/* Spygame: ord pr. kategori. Alle får det samme ord, spionen får kun kategorien.
   Kategorierne er store med vilje: kategorien alene må ikke hjælpe spionen.
   Ordene skal give et "nåå!"-øjeblik, når de bliver afsløret. Kategorier med adult: true kræver "Frækt indhold".
   Hvert ord er vurderet af fem testpersoner (sjov og nem, 1-5); kun ord med 3+ i begge er med (2026-10-12). */
const SPYGAME_WORDS = [
  { id: 'steder', navn: 'Steder', ord: [
    'Ubåden', 'Rumstationen', 'Stripklubben', 'Fængslet', 'Kasinoet', 'Nordpolen',
    'Pyramiderne', 'Det Hvide Hus', 'Christiania', 'Roskilde Festival',
    'Legoland', 'Bakken', 'Skadestuen', 'Militærbasen',
    'Titanic', 'Månen',
    'Fitness World',
    'Zoologisk Have', 'Oktoberfest', 'Ibiza', 'Sunny Beach', 'Mallorca', 'Prag', 'Amsterdam', 'Las Vegas',
    'Forfesten'
  ]},
  { id: 'jobs', navn: 'Jobs', ord: [
    'Stripper', 'Dørmand', 'Astronaut', 'Influencer',
    'Statsminister', 'Kongen', 'Dommer', 'Fængselsbetjent', 'Bartender', 'Tatovør',
    'Livredder', 'Brandmand', 'Landmand', 'Sygeplejerske',
    'Tandlæge', 'Pilot', 'Stewardesse', 'Soldat', 'Politibetjent', 'Advokat', 'Youtuber',
    'Rapper', 'DJ', 'Skuespiller', 'Klovn', 'Folkeskolelærer', 'Pædagog',
    'Personlig træner', 'Kok', 'Pizzabager', 'Bager',
    'Bodyguard', 'Ambulanceredder',
    'Parkeringsvagt',
    'Tv-vært', 'Professionel gamer'
  ]},
  { id: 'figurer', navn: 'Figurer fra film og spil', ord: [
    'Batman', 'Joker', 'Thanos', 'Darth Vader', 'Voldemort', 'Hulk', 'Thor', 'Superman', 'Spider-Man', 'Deadpool',
    'Wolverine', 'Iron Man', 'Captain America', 'Harley Quinn', 'Loki', 'Venom', 'Groot', 'Aquaman', 'Wonder Woman',
    'Gollum', 'Gandalf', 'Dumbledore', 'Snape', 'Hermione', 'Yoda', 'Han Solo', 'Chewbacca', 'Pennywise',
    'Chucky', 'Terminator', 'John Wick', 'James Bond',
    'Jack Sparrow', 'Shrek', 'Homer Simpson', 'Bart Simpson', 'Peter Griffin', 'Rick Sanchez',
    'Cartman', 'SvampeBob', 'Pikachu', 'Mario', 'Luigi', 'Sonic', 'Walter White',
    'Minions', 'Buzz Lightyear',
    'Woody', 'Simba', 'Scar', 'Olaf', 'Mufasa', 'Aladdin', 'Dracula', 'King Kong',
    'Godzilla', 'Forrest Gump', 'Ted', 'Borat', 'Mr. Bean', 'Frank fra Klovn'
  ]},
  { id: 'kendte', navn: 'Kendte danskere', ord: [
    'Mette Frederiksen', 'Kong Frederik', 'Dronning Mary', 'Casper Christensen',
    'Frank Hvam', 'Anders Matthesen', 'Mick Øgendahl', 'Sofie Linde', 'Mads Mikkelsen',
    'Lukas Graham', 'Gilli', 'Kesi', 'Tobias Rahim',
    'Jonas Vingegaard',
    'Caroline Wozniacki', 'Christian Eriksen',
    'Nicklas Bendtner'
  ]},
  { id: 'verden', navn: 'Kendte i verden', ord: [
    'Elon Musk', 'Donald Trump', 'Obama', 'Taylor Swift', 'Kanye West', 'Cristiano Ronaldo',
    'Messi', 'Kim Kardashian', 'Kylie Jenner', 'MrBeast', 'The Rock', 'Tom Cruise', 'Leonardo DiCaprio',
    'Brad Pitt', 'Johnny Depp', 'Will Smith', 'Snoop Dogg', 'Eminem', 'Drake', 'Justin Bieber',
    'Harry Styles', 'Zlatan', 'Mike Tyson', 'Conor McGregor', 'Logan Paul', 'Jeff Bezos', 'Mark Zuckerberg',
    'Bill Gates', 'Greta Thunberg', 'Gordon Ramsay',
    'Jackie Chan', 'Keanu Reeves', 'Arnold Schwarzenegger', 'Sylvester Stallone', 'Adam Sandler', 'Jim Carrey',
    'Michael Jordan', 'Usain Bolt',
    'Lewis Hamilton', 'Shakira', 'Billie Eilish', 'Ed Sheeran', 'Adele', 'Lady Gaga',
    'Michael Jackson'
  ]},
  { id: 'fodbold', navn: 'Fodboldspillere', ord: [
    'Messi', 'Ronaldo', 'Haaland', 'Mbappé', 'Neymar', 'Zlatan', 'Salah', 'De Bruyne', 'Bellingham', 'Vinicius',
    'Lewandowski', 'Kane', 'Rashford', 'Ødegaard', 'Modric', 'Sergio Ramos',
    'Benzema', 'Suárez', 'Pogba', 'Grealish', 'Lamine Yamal',
    'Van Dijk', 'Beckham', 'Zidane', 'Ronaldinho', 'Rooney',
    'Eriksen', 'Højlund', 'Simon Kjær', 'Kasper Schmeichel', 'Bendtner',
    'Griezmann'
  ]},
  { id: 'klubber', navn: 'Fodboldklubber', ord: [
    'Real Madrid', 'Barcelona', 'Atlético Madrid', 'Manchester United', 'Manchester City', 'Liverpool', 'Arsenal',
    'Chelsea', 'Tottenham', 'Newcastle',
    'Bayern München', 'Dortmund', 'PSG', 'Juventus',
    'AC Milan', 'Ajax',
    'Al-Nassr', 'Inter Miami', 'FCK', 'Brøndby'
  ]},
  { id: 'gaming', navn: 'Gaming', ord: [
    'FIFA', 'GTA', 'Minecraft', 'Fortnite', 'Counter-Strike', 'Valorant', 'League of Legends', 'Call of Duty',
    'Rocket League', 'Mario Kart', 'Pokémon', 'Among Us', 'Fall Guys',
    'Clash Royale', 'Clash of Clans', 'Brawl Stars', 'Candy Crush',
    'Tetris', 'The Sims', 'Roblox', 'Red Dead Redemption',
    'God of War', 'Subway Surfers',
    'Assassin\'s Creed', 'Wii Sports',
    'Just Dance', 'Angry Birds', 'Flappy Bird',
    'Hogwarts Legacy',
    'Tekken', 'Street Fighter'
  ]},
  { id: 'film', navn: 'Film og serier', ord: [
    'Titanic', 'Avatar', 'Star Wars', 'Harry Potter', 'Ringenes Herre', 'Batman', 'Spider-Man', 'Iron Man',
    'Avengers', 'Deadpool', 'Joker', 'Fast and Furious', 'James Bond', 'Mission Impossible', 'John Wick',
    'Jurassic Park', 'Matrix', 'Inception', 'Interstellar', 'Barbie', 'Toy Story',
    'Løvernes Konge', 'Shrek', 'Minions', 'Klovn', 'Druk',
    'Breaking Bad', 'Game of Thrones', 'Stranger Things', 'Squid Game', 'The Office', 'Peaky Blinders',
    'Narcos', 'Money Heist', 'Vikings', 'The Walking Dead', 'The Boys',
    'Paradise Hotel', 'Ex on the Beach', 'Love Island', 'Robinson', 'X Factor',
    'Gladiator', 'Top Gun', 'Forrest Gump',
    'Alene hjemme', 'Hangover', 'Wolf of Wall Street',
    'Twilight', 'Hunger Games', 'Bad Boys', 'Ted'
  ]},
  { id: 'mad', navn: 'Mad og drikke', ord: [
    'Sushi', 'Kebab', 'Durum', 'Shawarma', 'Flæskesteg',
    'Nutella',
    'Bacon', 'Proteinshake', 'Monster', 'Red Bull', 'Rødvin', 'Fadøl',
    'Tuborg Classic', 'Carlsberg', 'Faxe Kondi', 'Cocio', 'Softice', 'Chips', 'Popcorn',
    'Haribo', 'Lakrids', 'Røde pølser', 'Fransk hotdog', 'Pommes frites', 'Nachos', 'Tacos',
    'Falafel', 'Ramen', 'Kanelsnegl',
    'Jägerbomb', 'Tequila', 'Sambuca', 'Gin og tonic', 'Mojito', 'Champagne',
    'Mokai', 'Somersby'
  ]},
  { id: 'dyr', navn: 'Dyr', ord: [
    'T-Rex', 'Haj', 'Løve', 'Tiger', 'Panda', 'Dovendyr', 'Kakerlak',
    'Blæksprutte', 'Vandmand',
    'Kobra', 'Krokodille', 'Gorilla', 'Hval', 'Delfin', 'Pingvin', 'Isbjørn', 'Kamel',
    'Elg', 'Vildsvin', 'Ulv', 'Ræv', 'Pindsvin', 'Hamster', 'Guldfisk', 'Papegøje', 'Struds',
    'Måge', 'Due', 'Ugle', 'Ørn', 'Flagermus', 'Rotte', 'Skildpadde', 'Kamæleon',
    'Edderkop', 'Skorpion', 'Hveps',
    'Gris', 'Ged', 'Hest', 'Æsel', 'Hund', 'Kat', 'Kanin',
    'Giraf', 'Elefant', 'Kænguru', 'Koala', 'Sæl'
  ]},
  { id: 'sport', navn: 'Sport', ord: [
    'Fodbold', 'Håndbold', 'Basketball', 'Bordtennis', 'Padel',
    'Cykling', 'Maraton', 'Svømning', 'Boksning', 'MMA', 'Karate',
    'Crossfit', 'Yoga', 'Ski', 'Skateboard', 'Surfing',
    'Dart', 'Billard', 'Bowling', 'E-sport', 'Formel 1', 'Motocross', 'Volleyball',
    'Beachvolley', 'Baseball',
    'Klatring',
    'Poker', 'Wrestling', 'Bodybuilding',
    'Beerpong'
  ]},
  { id: 'lande', navn: 'Lande', ord: [
    'Sverige', 'Norge', 'Tyskland', 'Holland', 'Frankrig', 'Spanien', 'Portugal',
    'Italien', 'Grækenland', 'Tyrkiet', 'Kroatien', 'England',
    'USA', 'Canada', 'Mexico', 'Brasilien', 'Argentina', 'Cuba', 'Australien',
    'Japan', 'Kina', 'Sydkorea', 'Thailand', 'Indien',
    'Egypten', 'Marokko', 'Grønland',
    'Qatar', 'Jamaica'
  ]},
  { id: 'superkraefter', navn: 'Superkræfter', ord: [
    'Flyve', 'Blive usynlig', 'Læse tanker', 'Rejse i tiden', 'Teleportere', 'Superstyrke', 'Røntgensyn',
    'Udødelighed', 'Tale med dyr', 'Stoppe tiden', 'Trække vejret under vand', 'Skyde laser fra øjnene',
    'Kontrollere ild', 'Kontrollere vejret', 'Skifte form', 'Superfart',
    'Klone sig selv', 'Gå gennem vægge',
    'Blive kæmpestor',
    'Klatre på vægge', 'Kaste lyn', 'Fryse alt til is'
  ]},
  { id: 'fraekt', navn: 'Frækt', adult: true, ord: [
    'Missionærstilling', 'Doggystyle', 'Cowgirl', '69', 'Blowjob', 'Onenightstand', 'Trekant', 'Bollevenner',
    'Morgensex', 'Quickie',
    'Kondom', 'Glidecreme', 'Dildo', 'Vibrator', 'Håndjern', 'Bind for øjnene',
    'Sexet undertøj', 'Sugemærke', 'Dick pic', 'Porno', 'OnlyFans', 'Stripklub',
    'Strip poker', 'Lapdance',
    'Sextape'
  ]}
];
