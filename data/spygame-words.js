/* Spygame: ord pr. kategori. Alle får det samme ord, spionen får kun kategorien.
   Kategorierne er store med vilje: kategorien alene må ikke hjælpe spionen.
   Ordene skal give et "nåå!"-øjeblik, når de bliver afsløret. Kategorier med adult: true kræver "Frækt indhold".
   Hvert ord er vurderet af fem testpersoner (sjov og nem, 1-5); kun ord med 3+ i begge er med (2026-10-12). */
const SPYGAME_WORDS = [
  { id: 'steder', navn: 'Steder', ord: [
    'Ubåden', 'Rumstationen', 'Piratskibet', 'Stripklubben', 'Fængslet', 'Kasinoet', 'Nordpolen', 'Den Kinesiske Mur',
    'Pyramiderne', 'Area 51', 'Det Hvide Hus', 'Christiania', 'Jomfru Ane Gade', 'Roskilde Festival',
    'Legoland', 'Bakken', 'Skadestuen', 'Militærbasen',
    'Titanic', 'Månen',
    'Fitness World',
    'Zoologisk Have', 'Cirkus', 'Oktoberfest', 'Ibiza', 'Sunny Beach', 'Mallorca', 'Prag', 'Amsterdam', 'Las Vegas',
    'Dubai', 'Nordkorea',


    'Efterfesten', 'Forfesten'
  ]},
  { id: 'jobs', navn: 'Jobs', ord: [
    'Stripper', 'Dørmand', 'Lejemorder', 'Astronaut', 'Influencer',
    'Statsminister', 'Kongen', 'Dommer', 'Fængselsbetjent', 'Spion', 'Pirat', 'Pusher', 'Bartender', 'Tatovør',
    'Fodbolddommer', 'Livredder', 'Brandmand', 'Landmand', 'Sygeplejerske',
    'Tandlæge', 'Pilot', 'Stewardesse', 'Soldat', 'Politibetjent', 'Advokat', 'Youtuber',
    'Rapper', 'DJ', 'Skuespiller', 'Klovn', 'Tryllekunstner', 'Folkeskolelærer', 'Pædagog',
    'Personlig træner', 'Kok', 'Pizzabager', 'Bager', 'Slagter', 'Fisker',
    'Bodyguard', 'Ambulanceredder',
    'Parkeringsvagt',
    'Rocker', 'Tv-vært', 'Professionel gamer'
  ]},
  { id: 'figurer', navn: 'Figurer fra film og spil', ord: [
    'Batman', 'Joker', 'Thanos', 'Darth Vader', 'Voldemort', 'Hulk', 'Thor', 'Superman', 'Spider-Man', 'Deadpool',
    'Wolverine', 'Iron Man', 'Captain America', 'Harley Quinn', 'Loki', 'Venom', 'Groot', 'Aquaman', 'Wonder Woman',
    'Gollum', 'Gandalf', 'Dumbledore', 'Snape', 'Hermione', 'Yoda', 'Han Solo', 'Chewbacca', 'Pennywise',
    'Freddy Krueger', 'Chucky', 'Terminator', 'John Wick', 'James Bond', 'Indiana Jones',
    'Jack Sparrow', 'Shrek', 'Æslet fra Shrek', 'Homer Simpson', 'Bart Simpson', 'Peter Griffin', 'Rick Sanchez',
    'Cartman', 'SvampeBob', 'Pikachu', 'Mario', 'Luigi', 'Sonic', 'Walter White', 'Pablo Escobar',
    'Lara Croft', 'Minions', 'Buzz Lightyear',
    'Woody', 'Simba', 'Scar', 'Olaf', 'Mufasa', 'Aladdin', 'Tarzan', 'Dracula', 'Frankenstein', 'King Kong',
    'Godzilla', 'Rocky Balboa', 'Forrest Gump', 'Ted', 'Borat', 'Mr. Bean', 'Frank fra Klovn'
  ]},
  { id: 'kendte', navn: 'Kendte danskere', ord: [
    'Mette Frederiksen', 'Lars Løkke', 'Kong Frederik', 'Dronning Mary', 'Casper Christensen',
    'Frank Hvam', 'Anders Matthesen', 'Mick Øgendahl', 'Sofie Linde', 'Mads Mikkelsen',
    'Kim Larsen', 'Lukas Graham', 'Gilli', 'Kesi', 'Tobias Rahim',
    'Rasmus Seebach', 'Burhan G', 'Nik & Jay', 'Jonas Vingegaard',
    'Caroline Wozniacki', 'Peter Schmeichel', 'Michael Laudrup', 'Christian Eriksen',
    'Nicklas Bendtner',



    'Pilou Asbæk', 'Suspekt'
  ]},
  { id: 'verden', navn: 'Kendte i verden', ord: [
    'Elon Musk', 'Donald Trump', 'Putin', 'Kim Jong-un', 'Obama', 'Taylor Swift', 'Kanye West', 'Cristiano Ronaldo',
    'Messi', 'Kim Kardashian', 'Kylie Jenner', 'MrBeast', 'The Rock', 'Tom Cruise', 'Leonardo DiCaprio',
    'Brad Pitt', 'Johnny Depp', 'Will Smith', 'Snoop Dogg', 'Eminem', 'Drake', 'Justin Bieber',
    'Harry Styles', 'Zlatan', 'Mike Tyson', 'Conor McGregor', 'Logan Paul', 'Jeff Bezos', 'Mark Zuckerberg',
    'Bill Gates', 'Greta Thunberg', 'Gordon Ramsay',
    'Jackie Chan', 'Keanu Reeves', 'Arnold Schwarzenegger', 'Sylvester Stallone', 'Adam Sandler', 'Jim Carrey',
    'Michael Jordan', 'Usain Bolt',
    'Lewis Hamilton', 'Shakira', 'Billie Eilish', 'Ed Sheeran', 'Adele', 'Lady Gaga',
    'Michael Jackson', 'Jesus'
  ]},
  { id: 'fodbold', navn: 'Fodboldspillere', ord: [
    'Messi', 'Ronaldo', 'Haaland', 'Mbappé', 'Neymar', 'Zlatan', 'Salah', 'De Bruyne', 'Bellingham', 'Vinicius',
    'Lewandowski', 'Kane', 'Rashford', 'Ødegaard', 'Modric', 'Sergio Ramos',
    'Benzema', 'Suárez', 'Pogba', 'Grealish', 'Lamine Yamal',
    'Van Dijk', 'Beckham', 'Zidane', 'Ronaldinho', 'Maradona', 'Pelé', 'Henry', 'Gerrard', 'Rooney',
    'Eriksen', 'Højlund', 'Simon Kjær', 'Kasper Schmeichel', 'Peter Schmeichel', 'Laudrup', 'Bendtner',
    'Griezmann',
    'Balotelli', 'Piqué',
    'Drogba', 'Agüero'
  ]},
  { id: 'klubber', navn: 'Fodboldklubber', ord: [
    'Real Madrid', 'Barcelona', 'Atlético Madrid', 'Manchester United', 'Manchester City', 'Liverpool', 'Arsenal',
    'Chelsea', 'Tottenham', 'Newcastle',
    'Bayern München', 'Dortmund', 'PSG', 'Marseille', 'Juventus',
    'AC Milan', 'Ajax',
    'Al-Nassr', 'Inter Miami', 'FCK', 'Brøndby',
    'FC Midtjylland', 'AGF', 'OB'
  ]},
  { id: 'gaming', navn: 'Gaming', ord: [
    'FIFA', 'GTA', 'Minecraft', 'Fortnite', 'Counter-Strike', 'Valorant', 'League of Legends', 'Call of Duty',
    'Warzone', 'Rocket League', 'Mario Kart', 'Zelda', 'Pokémon', 'Among Us', 'Fall Guys',
    'Clash Royale', 'Clash of Clans', 'Brawl Stars', 'Candy Crush',
    'Tetris', 'The Sims', 'Roblox', 'Red Dead Redemption', 'Skyrim',
    'God of War', 'World of Warcraft', 'Subway Surfers', 'PUBG',
    'Assassin\'s Creed', 'Super Mario', 'Wii Sports',
    'Just Dance', 'Guitar Hero', 'Pac-Man', 'Angry Birds', 'Flappy Bird',
    'Hogwarts Legacy', 'Football Manager',
    'Tekken', 'Street Fighter', 'Smash Bros'
  ]},
  { id: 'film', navn: 'Film og serier', ord: [
    'Titanic', 'Avatar', 'Star Wars', 'Harry Potter', 'Ringenes Herre', 'Batman', 'Spider-Man', 'Iron Man',
    'Avengers', 'Deadpool', 'Joker', 'Fast and Furious', 'James Bond', 'Mission Impossible', 'John Wick',
    'Jurassic Park', 'Matrix', 'Inception', 'Interstellar', 'Barbie', 'Toy Story',
    'Løvernes Konge', 'Shrek', 'Minions', 'Klovn', 'Druk',
    'Breaking Bad', 'Game of Thrones', 'Stranger Things', 'Squid Game', 'The Office', 'Peaky Blinders',
    'Narcos', 'Money Heist', 'Prison Break', 'Vikings', 'The Walking Dead', 'The Boys',
    'Paradise Hotel', 'Ex on the Beach', 'Love Island', 'Robinson', 'X Factor',
    'Rocky', 'Gladiator', 'Top Gun', 'Forrest Gump',
    'Alene hjemme', 'Scary Movie', 'Hangover', 'Superbad', 'Wolf of Wall Street',
    'Scarface', 'Fifty Shades of Grey', 'Twilight', 'Hunger Games', 'Bad Boys', 'Ted'
  ]},
  { id: 'mad', navn: 'Mad og drikke', ord: [
    'Sushi', 'Kebab', 'Durum', 'Shawarma', 'Flæskesteg',
    'Nutella',
    'Bacon', 'Proteinshake', 'Monster', 'Red Bull', 'Rødvin', 'Fadøl',
    'Tuborg Classic', 'Carlsberg', 'Faxe Kondi', 'Cocio', 'Kakaomælk', 'Softice', 'Chips', 'Popcorn',
    'Haribo', 'Lakrids', 'Røde pølser', 'Fransk hotdog', 'Pommes frites', 'Nachos', 'Tacos',
    'Falafel', 'Ramen', 'Risalamande', 'Kanelsnegl',
    'Snaps', 'Jägerbomb', 'Tequila', 'Sambuca', 'Gin og tonic', 'Mojito', 'Champagne',
    'Mokai', 'Breezer', 'Somersby', 'Bubble tea'
  ]},
  { id: 'dyr', navn: 'Dyr', ord: [
    'T-Rex', 'Haj', 'Løve', 'Tiger', 'Panda', 'Dovendyr', 'Kakerlak',
    'Blæksprutte', 'Vandmand',
    'Kobra', 'Krokodille', 'Gorilla', 'Hval', 'Delfin', 'Pingvin', 'Isbjørn', 'Kamel',
    'Elg', 'Vildsvin', 'Ulv', 'Ræv', 'Pindsvin', 'Hamster', 'Guldfisk', 'Papegøje', 'Struds',
    'Måge', 'Due', 'Ugle', 'Ørn', 'Flagermus', 'Rotte', 'Skildpadde', 'Kamæleon',
    'Edderkop', 'Skorpion', 'Hveps',
    'Gris', 'Ged', 'Høne', 'Hest', 'Æsel', 'Hund', 'Kat', 'Kanin',
    'Giraf', 'Elefant', 'Kænguru', 'Koala', 'Sæl'
  ]},
  { id: 'sport', navn: 'Sport', ord: [
    'Fodbold', 'Håndbold', 'Basketball', 'Bordtennis', 'Padel',
    'Cykling', 'Maraton', 'Svømning', 'Boksning', 'MMA', 'Brydning', 'Karate',
    'Crossfit', 'Yoga', 'Ski', 'Skateboard', 'Surfing',
    'Dart', 'Billard', 'Bowling', 'E-sport', 'Formel 1', 'Motocross', 'Volleyball',
    'Beachvolley', 'Baseball',
    'Klatring',
    'Minigolf', 'Poker', 'Wrestling', 'Bodybuilding',
    'Beerpong'
  ]},
  { id: 'lande', navn: 'Lande', ord: [
    'Sverige', 'Norge', 'Tyskland', 'Holland', 'Frankrig', 'Spanien', 'Portugal',
    'Italien', 'Grækenland', 'Tyrkiet', 'Kroatien', 'England',
    'USA', 'Canada', 'Mexico', 'Brasilien', 'Argentina', 'Cuba', 'Australien',
    'Japan', 'Kina', 'Sydkorea', 'Nordkorea', 'Thailand', 'Indien',
    'Dubai', 'Egypten', 'Marokko', 'Rusland', 'Grønland',

    'Qatar', 'Jamaica'
  ]},
  { id: 'superkraefter', navn: 'Superkræfter', ord: [
    'Flyve', 'Blive usynlig', 'Læse tanker', 'Rejse i tiden', 'Teleportere', 'Superstyrke', 'Røntgensyn',
    'Udødelighed', 'Tale med dyr', 'Stoppe tiden', 'Trække vejret under vand', 'Skyde laser fra øjnene',
    'Strække sig som gummi', 'Kontrollere ild', 'Kontrollere vejret', 'Skifte form', 'Superfart',
    'Flytte ting med tankerne',
    'Se ind i fremtiden', 'Klone sig selv', 'Gå gennem vægge', 'Tale alle sprog',
    'Blive kæmpestor',


    'Klatre på vægge', 'Kaste lyn', 'Fryse alt til is'
  ]},
  { id: 'fraekt', navn: 'Frækt', adult: true, ord: [
    'Missionærstilling', 'Doggystyle', 'Cowgirl', '69', 'Blowjob', 'Onenightstand', 'Trekant', 'Bollevenner',
    'Morgensex', 'Quickie',
    'Kondom', 'Glidecreme', 'Dildo', 'Vibrator', 'Håndjern', 'Bind for øjnene',
    'Sexet undertøj', 'Sugemærke', 'Dick pic', 'Sexting', 'Porno', 'OnlyFans', 'Stripklub',
    'Strip poker', 'Lapdance',
    'Swingerklub', 'Sidespring', 'Sextape'
  ]}
];
