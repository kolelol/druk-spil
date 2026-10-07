/* Spygame: ord pr. kategori. Alle får det samme ord, spionen får kun kategorien.
   Kategorierne er store med vilje: kategorien alene må ikke hjælpe spionen.
   Ordene skal give et "nåå!"-øjeblik, når de bliver afsløret. Kategorier med adult: true kræver "Frækt indhold". */
const SPYGAME_WORDS = [
  { id: 'steder', navn: 'Steder', ord: [
    'Ubåden', 'Rumstationen', 'Piratskibet', 'Stripklubben', 'Fængslet', 'Kasinoet', 'Nordpolen', 'Den Kinesiske Mur',
    'Pyramiderne', 'Area 51', 'Det Hvide Hus', 'Vatikanet', 'Christiania', 'Jomfru Ane Gade', 'Roskilde Festival',
    'Legoland', 'Bakken', 'Et bryllup', 'En begravelse', 'Skadestuen', 'Fødegangen', 'Retssalen', 'Militærbasen',
    'Titanic', 'Månen', 'Saunaen', 'Nudiststranden', 'Netto klokken 7.59', 'Kollegiekøkkenet', 'Tandlægestolen',
    'Jobcentret', 'Fitness World', 'McDonald\'s klokken 4', 'Natbussen', 'Dyrehaven', 'Bunkeren', 'Atomkraftværket',
    'Zoologisk Have', 'Cirkus', 'Oktoberfest', 'Ibiza', 'Sunny Beach', 'Mallorca', 'Prag', 'Amsterdam', 'Las Vegas',
    'Dubai', 'Nordkorea', 'Et krydstogtskib', 'Lufthavnens sikkerhedskontrol', 'Et flys toilet', 'Folketinget',
    'Parken under en landskamp', 'Bagsædet i en taxa', 'En elevator der sidder fast', 'Ikeas kantine', 'Kirken juleaften',
    'Lægens venteværelse', 'En bilvask', 'Et fitnesscenter klokken 6', 'Et solcenter', 'En kirkegård om natten',
    'En ø uden internet', 'Efterfesten', 'Forfesten', 'Den lokale bodega'
  ]},
  { id: 'jobs', navn: 'Jobs', ord: [
    'Stripper', 'Dørmand', 'Lejemorder', 'Paven', 'Astronaut', 'Kloakarbejder', 'Bedemand', 'Influencer',
    'Statsminister', 'Kongen', 'Dommer', 'Fængselsbetjent', 'Spion', 'Pirat', 'Pusher', 'Bartender', 'Tatovør',
    'Fodbolddommer', 'Livredder', 'Brandmand', 'Buschauffør', 'Landmand', 'Skraldemand', 'Sygeplejerske', 'Kirurg',
    'Tandlæge', 'Psykolog', 'Pilot', 'Stewardesse', 'Kaptajn', 'Soldat', 'Politibetjent', 'Advokat', 'Youtuber',
    'Rapper', 'DJ', 'Skuespiller', 'Klovn', 'Tryllekunstner', 'Præst', 'Folkeskolelærer', 'Pædagog',
    'Personlig træner', 'Kok', 'Pizzabager', 'Tjener', 'Bager', 'Slagter', 'Fisker', 'Sømand', 'Minearbejder',
    'Vinduespudser', 'Kongens chauffør', 'Paparazzi', 'Bodyguard', 'Ambulanceredder', 'Jordemoder', 'Dyrepasser',
    'Sexolog', 'Parkeringsvagt', 'Skattefar', 'Telefonsælger', 'Pantelåner', 'Ejendomsmægler', 'Skiinstruktør',
    'Krigsfotograf', 'Bjergbestiger', 'Rocker', 'Tv-vært', 'Vejrvært', 'Fodboldagent', 'Professionel gamer'
  ]},
  { id: 'figurer', navn: 'Figurer fra film og spil', ord: [
    'Batman', 'Joker', 'Thanos', 'Darth Vader', 'Voldemort', 'Hulk', 'Thor', 'Superman', 'Spider-Man', 'Deadpool',
    'Wolverine', 'Iron Man', 'Captain America', 'Harley Quinn', 'Loki', 'Venom', 'Groot', 'Aquaman', 'Wonder Woman',
    'Gollum', 'Gandalf', 'Dumbledore', 'Snape', 'Hermione', 'Yoda', 'Han Solo', 'Chewbacca', 'Pennywise',
    'Freddy Krueger', 'Chucky', 'Hannibal Lecter', 'Terminator', 'Rambo', 'John Wick', 'James Bond', 'Indiana Jones',
    'Jack Sparrow', 'Shrek', 'Æslet fra Shrek', 'Homer Simpson', 'Bart Simpson', 'Peter Griffin', 'Rick Sanchez',
    'Cartman', 'SvampeBob', 'Pikachu', 'Mario', 'Luigi', 'Sonic', 'Walter White', 'Tony Soprano', 'Pablo Escobar',
    'Tyrion Lannister', 'Jon Snow', 'Geralt', 'Kratos', 'Master Chief', 'Lara Croft', 'Minions', 'Buzz Lightyear',
    'Woody', 'Simba', 'Scar', 'Elsa', 'Olaf', 'Mufasa', 'Aladdin', 'Tarzan', 'Dracula', 'Frankenstein', 'King Kong',
    'Godzilla', 'Rocky Balboa', 'Forrest Gump', 'Ted', 'Borat', 'Mr. Bean', 'Frank fra Klovn', 'Egon Olsen'
  ]},
  { id: 'kendte', navn: 'Kendte danskere', ord: [
    'Mette Frederiksen', 'Lars Løkke', 'Kong Frederik', 'Dronning Mary', 'Prins Christian', 'Casper Christensen',
    'Frank Hvam', 'Anders Matthesen', 'Mick Øgendahl', 'Sofie Linde', 'Nikolaj Coster-Waldau', 'Mads Mikkelsen',
    'Nikolaj Lie Kaas', 'Lars Ulrich', 'Kim Larsen', 'Medina', 'Lukas Graham', 'MØ', 'Gilli', 'Kesi', 'Tobias Rahim',
    'Christopher', 'Rasmus Seebach', 'Burhan G', 'Thomas Helmig', 'Nik & Jay', 'Jonas Vingegaard',
    'Caroline Wozniacki', 'Viktor Axelsen', 'Peter Schmeichel', 'Michael Laudrup', 'Christian Eriksen',
    'Nicklas Bendtner', 'Kevin Magnussen', 'Holger Rune', 'Mikkel Hansen', 'Bubber', 'Mads Steffensen', 'Jan Gintberg',
    'Sigurd Barrett', 'Andreas Bo', 'Jonatan Spang', 'Peter Falktoft', 'Esben Bjerre', 'Ruben Søltoft', 'Bjarne Riis',
    'Lars von Trier', 'Anders Fogh Rasmussen', 'Pia Kjærsgaard', 'Inger Støjberg', 'Thomas Blachman', 'Remee',
    'Sidney Lee', 'Linse Kessler', 'Gustav Salinas', 'Amalie Szigethy', 'Fie Laursen', 'Rasmus Brohave',
    'Alexander Husum', 'Morten Münster', 'Simon Talbot', 'Thomas Warberg', 'Pilou Asbæk', 'Suspekt', 'Jada'
  ]},
  { id: 'verden', navn: 'Kendte i verden', ord: [
    'Elon Musk', 'Donald Trump', 'Putin', 'Kim Jong-un', 'Obama', 'Taylor Swift', 'Kanye West', 'Cristiano Ronaldo',
    'Messi', 'Kim Kardashian', 'Kylie Jenner', 'MrBeast', 'PewDiePie', 'The Rock', 'Tom Cruise', 'Leonardo DiCaprio',
    'Brad Pitt', 'Johnny Depp', 'Will Smith', 'Snoop Dogg', 'Eminem', 'Drake', 'Beyoncé', 'Rihanna', 'Justin Bieber',
    'Harry Styles', 'Zlatan', 'Mike Tyson', 'Conor McGregor', 'Logan Paul', 'Jeff Bezos', 'Mark Zuckerberg',
    'Bill Gates', 'Greta Thunberg', 'Paven', 'Kong Charles', 'Prins Harry', 'Dalai Lama', 'Oprah', 'Gordon Ramsay',
    'Jackie Chan', 'Keanu Reeves', 'Arnold Schwarzenegger', 'Sylvester Stallone', 'Adam Sandler', 'Jim Carrey',
    'Ryan Reynolds', 'Michael Jordan', 'LeBron James', 'Usain Bolt', 'Tiger Woods', 'Roger Federer', 'Novak Djokovic',
    'Lewis Hamilton', 'Max Verstappen', 'Shakira', 'Bad Bunny', 'Billie Eilish', 'Ed Sheeran', 'Adele', 'Lady Gaga',
    'Madonna', 'Michael Jackson', 'Elvis', 'Jesus', 'Einstein', 'Napoleon', 'Hitler', 'Gandhi', 'Cleopatra'
  ]},
  { id: 'fodbold', navn: 'Fodboldspillere', ord: [
    'Messi', 'Ronaldo', 'Haaland', 'Mbappé', 'Neymar', 'Zlatan', 'Salah', 'De Bruyne', 'Bellingham', 'Vinicius',
    'Lewandowski', 'Kane', 'Son', 'Rashford', 'Saka', 'Ødegaard', 'Rodri', 'Modric', 'Kroos', 'Sergio Ramos',
    'Benzema', 'Suárez', 'Pogba', 'Grealish', 'Foden', 'Lamine Yamal', 'Musiala', 'Kimmich', 'Neuer', 'Courtois',
    'Alisson', 'Van Dijk', 'Beckham', 'Zidane', 'Ronaldinho', 'Maradona', 'Pelé', 'Henry', 'Gerrard', 'Rooney',
    'Eriksen', 'Højlund', 'Simon Kjær', 'Kasper Schmeichel', 'Peter Schmeichel', 'Laudrup', 'Bendtner', 'Tomasson',
    'Delaney', 'Dolberg', 'Damsgaard', 'Mæhle', 'Isak', 'Osimhen', 'Griezmann', 'Dembélé', 'Kvaratskhelia', 'Wirtz',
    'Palmer', 'Rice', 'Casemiro', 'Bruno Fernandes', 'Balotelli', 'Cantona', 'Roy Keane', 'Puyol', 'Piqué',
    'Iniesta', 'Xavi', 'Buffon', 'Cech', 'Drogba', 'Eto\'o', 'Adebayor', 'Agüero', 'Cavani', 'Di María'
  ]},
  { id: 'klubber', navn: 'Fodboldklubber', ord: [
    'Real Madrid', 'Barcelona', 'Atlético Madrid', 'Manchester United', 'Manchester City', 'Liverpool', 'Arsenal',
    'Chelsea', 'Tottenham', 'Newcastle', 'Aston Villa', 'Everton', 'West Ham', 'Leeds', 'Leicester', 'Celtic',
    'Rangers', 'Bayern München', 'Dortmund', 'Leverkusen', 'Schalke', 'PSG', 'Marseille', 'Monaco', 'Juventus',
    'AC Milan', 'Inter', 'Napoli', 'Roma', 'Ajax', 'PSV', 'Feyenoord', 'Benfica', 'Porto', 'Sporting',
    'Galatasaray', 'Fenerbahçe', 'Al-Nassr', 'Inter Miami', 'LA Galaxy', 'Malmö FF', 'Rosenborg', 'FCK', 'Brøndby',
    'FC Midtjylland', 'AGF', 'OB', 'AaB', 'Silkeborg', 'Randers FC', 'Viborg', 'FC Nordsjælland', 'Vejle', 'Lyngby',
    'Esbjerg', 'SønderjyskE', 'Hvidovre', 'Fremad Amager', 'HB Køge', 'Hobro', 'B93', 'Herfølge', 'Næstved'
  ]},
  { id: 'gaming', navn: 'Gaming', ord: [
    'FIFA', 'GTA', 'Minecraft', 'Fortnite', 'Counter-Strike', 'Valorant', 'League of Legends', 'Call of Duty',
    'Warzone', 'Rocket League', 'Mario Kart', 'Zelda', 'Elden Ring', 'Pokémon', 'Among Us', 'Fall Guys',
    'Apex Legends', 'Overwatch', 'Clash Royale', 'Clash of Clans', 'Brawl Stars', 'Candy Crush', 'Wordfeud',
    'Tetris', 'The Sims', 'Roblox', 'Rust', 'Red Dead Redemption', 'The Witcher', 'Skyrim', 'Dark Souls',
    'God of War', 'Halo', 'World of Warcraft', 'Dota', 'Hearthstone', 'Subway Surfers', 'PUBG', 'Battlefield',
    'Assassin\'s Creed', 'NBA 2K', 'F1', 'Gran Turismo', 'Forza', 'Super Mario', 'Animal Crossing', 'Wii Sports',
    'Just Dance', 'Guitar Hero', 'Pac-Man', 'Angry Birds', 'Flappy Bird', 'Geoguessr', 'Hay Day', 'Sea of Thieves',
    'Terraria', 'Cyberpunk', 'Hogwarts Legacy', 'Baldur\'s Gate', 'Diablo', 'Age of Empires', 'Football Manager',
    'Tekken', 'Street Fighter', 'Smash Bros', 'Left 4 Dead', 'Farming Simulator', 'Euro Truck Simulator', 'Goat Simulator'
  ]},
  { id: 'film', navn: 'Film og serier', ord: [
    'Titanic', 'Avatar', 'Star Wars', 'Harry Potter', 'Ringenes Herre', 'Batman', 'Spider-Man', 'Iron Man',
    'Avengers', 'Deadpool', 'Joker', 'Fast and Furious', 'James Bond', 'Mission Impossible', 'John Wick',
    'Jurassic Park', 'Matrix', 'Inception', 'Interstellar', 'Oppenheimer', 'Barbie', 'Toy Story', 'Frost',
    'Løvernes Konge', 'Shrek', 'Minions', 'Klovn', 'Olsen-banden', 'Far til fire', 'Druk', 'Jagten',
    'Breaking Bad', 'Game of Thrones', 'Stranger Things', 'Squid Game', 'Friends', 'The Office', 'Peaky Blinders',
    'Narcos', 'Money Heist', 'Prison Break', 'Vikings', 'The Walking Dead', 'Suits', 'Ted Lasso', 'The Boys',
    'Paradise Hotel', 'Ex on the Beach', 'Love Island', 'Robinson', 'Vild med dans', 'X Factor', 'Bagedysten',
    'Badehotellet', 'Borgen', 'Matador', 'Rejseholdet', 'Rocky', 'Gladiator', 'Top Gun', 'Forrest Gump',
    'Alene hjemme', 'Scary Movie', 'Hangover', 'Superbad', 'Wolf of Wall Street', 'Pulp Fiction', 'The Godfather',
    'Scarface', 'Fifty Shades of Grey', 'Sex and the City', 'Twilight', 'Hunger Games', 'Bad Boys', 'Ted'
  ]},
  { id: 'mad', navn: 'Mad og drikke', ord: [
    'Sushi', 'Kebab', 'Durum', 'Shawarma', 'Flæskesteg', 'Stegt flæsk', 'Rugbrødsmad', 'Leverpostej', 'Sild',
    'Surströmming', 'Snegle', 'Frølår', 'Insekter', 'Østers', 'Kaviar', 'Hummer', 'Pizza klokken 4', 'Nutella',
    'Bacon', 'Havregrød', 'Proteinshake', 'Cola Zero', 'Monster', 'Red Bull', 'Kaffe', 'Te', 'Rødvin', 'Fadøl',
    'Ceres Top', 'Tuborg Classic', 'Carlsberg', 'Faxe Kondi', 'Cocio', 'Kakaomælk', 'Softice', 'Chips', 'Popcorn',
    'Haribo', 'Lakrids', 'Vingummibamser', 'Røde pølser', 'Fransk hotdog', 'Pommes frites', 'Nachos', 'Tacos',
    'Burrito', 'Falafel', 'Ramen', 'Æbleskiver', 'Risalamande', 'Brunsviger', 'Kanelsnegl', 'Romkugle',
    'Snaps', 'Jägerbomb', 'Tequila', 'Sambuca', 'Vodka-juice', 'Gin og tonic', 'Mojito', 'Champagne', 'Hjemmebrændt',
    'Mokai', 'Breezer', 'Somersby', 'Mælk', 'Vand fra hanen', 'Smoothie', 'Bubble tea', 'Frokostbuffet'
  ]},
  { id: 'dyr', navn: 'Dyr', ord: [
    'T-Rex', 'Haj', 'Løve', 'Tiger', 'Panda', 'Dovendyr', 'Piratfisk', 'Anakonda', 'Kakerlak', 'Regnorm',
    'Honninggrævling', 'Blæksprutte', 'Næbdyr', 'Alpaka', 'Vandmand', 'Tasmansk djævel', 'Vaskebjørn', 'Kolibri',
    'Grib', 'Kobra', 'Krokodille', 'Gorilla', 'Orangutang', 'Hval', 'Delfin', 'Pingvin', 'Isbjørn', 'Kamel',
    'Elg', 'Vildsvin', 'Ulv', 'Ræv', 'Pindsvin', 'Hamster', 'Guldfisk', 'Papegøje', 'Struds', 'Flamingo', 'Pelikan',
    'Måge', 'Due', 'Krage', 'Ugle', 'Ørn', 'Flagermus', 'Rotte', 'Mus', 'Muldvarp', 'Skildpadde', 'Kamæleon',
    'Leguan', 'Frø', 'Snegl', 'Edderkop', 'Skorpion', 'Bi', 'Hveps', 'Myg', 'Lus', 'Loppe', 'Igle', 'Krabbe',
    'Torsk', 'Ål', 'Laks', 'Tun', 'Ko', 'Gris', 'Får', 'Ged', 'Høne', 'Hest', 'Æsel', 'Hund', 'Kat', 'Kanin',
    'Giraf', 'Zebra', 'Elefant', 'Næsehorn', 'Flodhest', 'Kænguru', 'Koala', 'Sæl', 'Hvalros'
  ]},
  { id: 'sport', navn: 'Sport', ord: [
    'Fodbold', 'Håndbold', 'Basketball', 'Ishockey', 'Tennis', 'Badminton', 'Bordtennis', 'Padel', 'Squash', 'Golf',
    'Cykling', 'Maraton', 'Svømning', 'Boksning', 'MMA', 'Brydning', 'Judo', 'Karate', 'Taekwondo', 'Sumo',
    'Crossfit', 'Yoga', 'Ski', 'Snowboard', 'Skateboard', 'Surfing', 'Sejlads', 'Roning', 'Kajak', 'Ridning',
    'Dart', 'Billard', 'Bowling', 'Skak', 'E-sport', 'Formel 1', 'Motocross', 'Speedway', 'Rally', 'Volleyball',
    'Beachvolley', 'Rugby', 'Amerikansk fodbold', 'Baseball', 'Cricket', 'Højdespring', 'Spydkast', 'Fægtning',
    'Bueskydning', 'Skydning', 'Curling', 'Gymnastik', 'Parkour', 'Klatring', 'Dykning', 'Triatlon', 'Vandpolo',
    'Floorball', 'Petanque', 'Minigolf', 'Poker', 'Wrestling', 'Bodybuilding', 'Armlægning', 'Tovtrækning',
    'Beerpong', 'Ølstafet', 'Stangtennis', 'Rundbold', 'Dødbold', 'Kongespil', 'Kroket'
  ]},
  { id: 'lande', navn: 'Lande', ord: [
    'Sverige', 'Norge', 'Finland', 'Island', 'Tyskland', 'Holland', 'Belgien', 'Frankrig', 'Spanien', 'Portugal',
    'Italien', 'Grækenland', 'Tyrkiet', 'Kroatien', 'Polen', 'Tjekkiet', 'Østrig', 'Schweiz', 'England', 'Skotland',
    'Irland', 'USA', 'Canada', 'Mexico', 'Brasilien', 'Argentina', 'Colombia', 'Cuba', 'Australien', 'New Zealand',
    'Japan', 'Kina', 'Sydkorea', 'Nordkorea', 'Thailand', 'Vietnam', 'Indien', 'Indonesien', 'Filippinerne',
    'Dubai', 'Egypten', 'Marokko', 'Sydafrika', 'Kenya', 'Nigeria', 'Rusland', 'Ukraine', 'Grønland', 'Færøerne',
    'Saudi-Arabien', 'Israel', 'Iran', 'Afghanistan', 'Pakistan', 'Cypern', 'Malta', 'Bulgarien', 'Rumænien',
    'Ungarn', 'Serbien', 'Litauen', 'Estland', 'Qatar', 'Jamaica', 'Peru', 'Chile', 'Vatikanstaten', 'Monaco',
    'Madagaskar', 'Mongoliet', 'Kasakhstan', 'Syrien', 'Irak', 'Venezuela', 'Somalia'
  ]},
  { id: 'byturen', navn: 'Byturen', ord: [
    'Bunde en øl', 'Kaste op i en taxa', 'Sove på en bænk', 'Ringe til sin eks', 'Score på dansegulvet',
    'Blive smidt ud af dørmanden', 'Miste sin jakke i garderoben', 'Købe shawarma klokken 4', 'Tisse i en port',
    'Stjæle et vejskilt', 'Danse på bordet', 'Kysse en fremmed', 'Glemme sit dankort i baren', 'Skrive til sin eks',
    'Gå hjem alene', 'Tage natbussen', 'Falde i søvn på toilettet', 'Blive uvenner med en ven', 'Synge karaoke',
    'Tage shots med fremmede', 'Miste sin telefon', 'Få blackout', 'Give en omgang til alle', 'Komme op at slås',
    'Blive stoppet af politiet', 'Sove hos en fremmed', 'Græde på toilettet', 'Tabe sin øl', 'Snakke med dørmanden i 20 minutter',
    'Bestille en Uber til 300 meter', 'Ryge selvom man ikke ryger', 'Lyve om sin alder', 'Snige sig ind uden at betale',
    'Lave en dårlig aftale om i morgen', 'Fortælle en fremmed sin livshistorie', 'Blive smidt af taxaen', 'Sove i tøjet',
    'Vågne op med en kebab i sengen', 'Ringe til sin mor', 'Tabe et væddemål', 'Sende en besked man fortryder',
    'Springe i havnen', 'Låne penge af alle', 'Miste sine venner på 30 sekunder', 'Købe en runde Jägerbombs',
    'Skifte bar fire gange', 'Stå i kø i en time', 'Betale 90 kr for en drink', 'Ende på skadestuen', 'Spille beerpong',
    'Sidde fast i en snak om politik', 'Tage hjem klokken 23', 'Være den sidste på dansegulvet', 'Finde en kærlighed for en aften',
    'Falde ned ad en trappe', 'Gå ind på det forkerte toilet'
  ]},
  { id: 'superkraefter', navn: 'Superkræfter', ord: [
    'Flyve', 'Blive usynlig', 'Læse tanker', 'Rejse i tiden', 'Teleportere', 'Superstyrke', 'Røntgensyn',
    'Udødelighed', 'Tale med dyr', 'Stoppe tiden', 'Trække vejret under vand', 'Skyde laser fra øjnene',
    'Strække sig som gummi', 'Kontrollere ild', 'Kontrollere vejret', 'Skifte form', 'Superfart', 'Helbrede andre',
    'Flytte ting med tankerne', 'Genoplive de døde', 'Aldrig få tømmermænd', 'Uendelige penge', 'Være god til alt',
    'Se ind i fremtiden', 'Klone sig selv', 'Gå gennem vægge', 'Tale alle sprog', 'Aldrig skulle sove',
    'Kunne huske alt', 'Kontrollere andres tanker', 'Blive kæmpestor', 'Blive mikroskopisk', 'Lave guld',
    'Snakke med de døde', 'Aldrig blive syg', 'Slette minder', 'Kunne lugte løgne', 'Finde alle tabte ting',
    'Overleve alt', 'Charme alle', 'Være 100 procent heldig', 'Kunne spise uendeligt', 'Have en usynlig ven',
    'Skifte alder', 'Kontrollere drømme', 'Hoppe 50 meter', 'Klatre på vægge', 'Kaste lyn', 'Fryse alt til is',
    'Have et ekstra liv', 'Vinde alle diskussioner'
  ]},
  { id: 'doed', navn: 'Måder at dø på', ord: [
    'Hajangreb', 'Lynnedslag', 'Falde ned fra en stige', 'Blive kvalt i en hotdog', 'Blive kørt over af en bus',
    'Faldskærm der ikke åbner', 'Bjørneangreb', 'Drukne i badekarret', 'Meteornedslag', 'Zombieapokalypsen',
    'For meget tequila', 'Falde ud fra altanen', 'Vulkanudbrud', 'Tsunami', 'Blive spist af en løve', 'Alderdom',
    'Kedsomhed', 'Grine sig ihjel', 'Blive ramt af en kokosnød', 'Springe ud fra en klippe', 'Elektrisk stød',
    'Fryse ihjel på Everest', 'Blive stukket af en vandmand', 'Kvæle sig i en pølse', 'Blive trampet ned til koncert',
    'Selfie på kanten af en klippe', 'Rumskib der styrter', 'Pirater', 'Ubåd der synker', 'Bilulykke i Fast and Furious-stil',
    'Løbe ind i en dør', 'Spise giftige svampe', 'Blive ramt af en golfbold', 'Falde i en kloak', 'Krokodille',
    'Slange i toilettet', 'Fyrværkeri i hånden', 'Elevatoren styrter', 'Lavine', 'Jordskælv', 'Blive kastet ud af et fly',
    'Tørste i ørkenen', 'Fare vild i Ikea', 'Blive ramt af en isterning fra et fly', 'Nys så hårdt at hjertet stopper',
    'Blive begravet i slik', 'Bunde for meget mælk', 'Tabe en diskussion så hårdt', 'Blive en del af Squid Game', 'Roskilde-mudder'
  ]},
  { id: 'lejlighed', navn: 'Drengelejligheden', ord: [
    'Playstation', 'Gamerstol', 'Proteinpulver', 'Bunken af beskidt vasketøj', 'Tom pizzabakke', 'Håndvægte',
    'Skærm nummer to', 'Ølkasser', 'Flag på væggen', 'Neonlys', 'Airfryer', 'Snusdåser', 'Scarface-plakat',
    'Beerpong-bord', 'Den døde plante', 'Tørrestativet', 'Den ubrugte støvsuger', 'Whiteboard med planer',
    'Ølbong', 'Madras på gulvet', 'Sofa fra Facebook Marketplace', 'Ikea-lampe', 'Pengeskab', 'Gasgrill på altanen',
    'Slidt fodbold', 'Fladskærm', 'Soundbar', 'Halvtom flaske vodka', 'Kaffemaskine der aldrig bliver renset',
    'Hårtrimmer', 'Deodorant', 'Parfume fra jul', 'Sneakers ved døren', 'Cykel i gangen', 'Fitness-elastikker',
    'Kondomer i skuffen', 'Chips i sengen', 'Fjernbetjening der er væk', 'Router med tape', 'Tom køleskab med ketchup',
    'Bilnøgler', 'Pung med fem dankort', 'Solbriller indendørs', 'Kasket-samling', 'Poser med pant', 'Lugt af Axe',
    'Blomst fra en date', 'Plakat med Zlatan', 'Sort silkelagen', 'Gaming-headset', 'Terningbæger', 'Kortspil med ølpletter',
    'Klippekort til solariet', 'Gammel Wii', 'Bog man aldrig har læst', 'Pandelampe', 'Bordfodbold', 'Kakerlak'
  ]},
  { id: 'fraekt', navn: 'Frækt', adult: true, ord: [
    'Missionærstilling', 'Doggystyle', 'Cowgirl', '69', 'Blowjob', 'Onenightstand', 'Trekant', 'Bollevenner',
    'Morgensex', 'Fuldesex', 'Hævnsex', 'Quickie', 'Sex på toilettet', 'Sex i bilen', 'Sex på stranden',
    'Sex i brusebadet', 'Kondom', 'P-piller', 'Glidecreme', 'Dildo', 'Vibrator', 'Håndjern', 'Bind for øjnene',
    'Sexet undertøj', 'Sugemærke', 'Dick pic', 'Sexting', 'Nøgenbillede', 'Porno', 'OnlyFans', 'Stripklub',
    'Strip poker', 'Tinder-date', 'Walk of shame', 'Booty call', 'Friends with benefits', 'Body shot', 'Lapdance',
    'Kys med tunge', 'Blind date', 'Swingerklub', 'Sidespring', 'Sex i forældrenes seng', 'Sex i et telt', 'Sextape'
  ]}
];
