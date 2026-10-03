/* Imposter: ordpar pr. kategori. Hvert par er [ord, lignende ord].
   Appen vælger tilfældigt, hvilket af de to der er det rigtige ord,
   og det andet bruges som "undercover"-ord til imposteren.
   Et godt par ligger tæt: de samme stikord skal kunne passe på begge, ellers bliver Undercover for let. */
const IMPOSTER_WORDS = [
  { id: 'fest', navn: 'Byen og druk', ord: [
    ['Ølbong', 'Beerpong'], ['Tømmermænd', 'Blackout'], ['Shots', 'Jägerbomb'], ['Fredagsbar', 'Julefrokost'],
    ['Bytur', 'Hjemmefest'], ['Roskilde', 'Distortion'], ['Karaoke', 'Dansegulvet'], ['Cigaret', 'Snus'], ['Uber', 'Natbus'],
    ['Natmad', 'Morgenmad på McDonald\'s'], ['Forfest', 'Efterfest'], ['Sidste omgang', 'Sidste dans'],
    ['Studenterkørsel', 'Polterabend'], ['Konfirmation', 'Bryllup'], ['Nytårsaften', 'Sankthans'], ['Kongens kop', 'Meyer'],
    ['DJ\'en', 'Bartenderen'], ['Dørmanden', 'Garderobedamen'], ['Shotglas', 'Ølkrus'], ['Rusturen', 'Studieturen'],
    ['Tømmermandsmad', 'Reparationsbajer'], ['Kapsejlads', 'Ølstafet'], ['Fuldemandssnak', 'Fuldemandsbesked'],
    ['Toiletkøen', 'Barkøen'], ['Rygepause', 'Frisk luft'], ['VIP-bord', 'Flaskebord'], ['Bodega', 'Cocktailbar'],
    ['Happy hour', 'Fri bar'], ['Den ædru chauffør', 'Ham der altid går tidligt'], ['Opkast', 'Hikke'],
    ['Walk of shame', 'Taxa hjem alene'], ['Glemt jakke', 'Mistet telefon'], ['Slåskamp', 'Skænderi'], ['Scoring', 'Kurv'],
    ['Havefest', 'Gårdfest'], ['Druktur', 'Pubcrawl'], ['Ølkasse', 'Ramme dåser'], ['Hjemmebrændt', 'Billig vodka'],
    ['Fadøl', 'Dåseøl'], ['Tequila', 'Sambuca']
  ]},
  { id: 'fodbold', navn: 'Fodbold', ord: [
    ['Messi', 'Ronaldo'], ['Haaland', 'Mbappé'], ['FCK', 'Brøndby'], ['Liverpool', 'Manchester United'], ['Real Madrid', 'Barcelona'],
    ['Premier League', 'Champions League'], ['Straffespark', 'Frispark'], ['Offside', 'Hands'], ['VAR', 'Linjedommeren'],
    ['Målmand', 'Midterforsvarer'], ['Angriber', 'Kantspiller'], ['Rødt kort', 'Gult kort'], ['Parken', 'Brøndby Stadion'],
    ['Eriksen', 'Højlund'], ['Zlatan', 'Neymar'], ['Bellingham', 'Vinicius'], ['Arsenal', 'Tottenham'], ['Bayern München', 'Dortmund'],
    ['AGF', 'FC Midtjylland'], ['VM', 'EM'], ['Fantasy Premier League', 'Oddset'], ['Saka', 'Foden'], ['Superliga', 'Bundesliga'],
    ['Fodboldstøvler', 'Benskinner'], ['Ronaldinho', 'Zidane'], ['Hooligans', 'Roligans'], ['Hjulmand', 'Morten Olsen'],
    ['Salah', 'Son'], ['Kasper Schmeichel', 'Peter Schmeichel'], ['Hattrick', 'Selvmål'], ['Hjørnespark', 'Indkast'],
    ['Transfervindue', 'Kontraktforlængelse'], ['Guardiola', 'Klopp'], ['Mourinho', 'Ferguson'], ['Manchester City', 'Chelsea'],
    ['Bendtner', 'Balotelli'], ['Old Trafford', 'Anfield'], ['Camp Nou', 'Bernabéu'], ['Anførerbind', 'Trøje nummer 10'],
    ['Straffesparkskonkurrence', 'Forlænget spilletid'], ['Filmning', 'Tidsudtræk'], ['Udebanefans', 'Hjemmebanefans'],
    ['Lamine Yamal', 'Musiala'], ['Maradona', 'Pelé']
  ]},
  { id: 'gaming', navn: 'Gaming', ord: [
    ['FIFA', 'Rocket League'], ['GTA', 'Red Dead Redemption'], ['Counter-Strike', 'Valorant'], ['Minecraft', 'Roblox'],
    ['Playstation', 'Xbox'], ['Fortnite', 'PUBG'], ['League of Legends', 'Dota'], ['Call of Duty', 'Battlefield'],
    ['Mario Kart', 'Wii Sports'], ['Elden Ring', 'Dark Souls'], ['Pokémon', 'Zelda'], ['Among Us', 'Fall Guys'],
    ['Clash Royale', 'Clash of Clans'], ['Brawl Stars', 'Candy Crush'], ['Wordfeud', 'Tetris'], ['The Sims', 'Animal Crossing'],
    ['Gamerstol', 'Kontorstol'], ['Gaming-pc', 'Gaming-laptop'], ['Headset', 'Mikrofon'], ['Twitch', 'YouTube'],
    ['Steam', 'Epic Games'], ['Controller', 'Tastatur og mus'], ['Discord', 'TeamSpeak'], ['Nintendo Switch', 'Gameboy'],
    ['Skyrim', 'The Witcher'], ['God of War', 'Assassin\'s Creed'], ['Football Manager', 'NBA 2K'], ['Geoguessr', 'Kahoot'],
    ['Subway Surfers', 'Flappy Bird'], ['Lag', 'Ragequit'], ['Noob', 'Tryhard'], ['Battle pass', 'Loot box'],
    ['Respawn', 'Game over'], ['Ultimate Team', 'Karrieremode'], ['Zombies', 'Battle royale'], ['Streamer', 'Youtuber'],
    ['LAN-party', 'Gamerweekend'], ['Snydekoder', 'Hacks']
  ]},
  { id: 'dating', navn: 'Dating og forhold', ord: [
    ['Første date', 'Blind date'], ['Ghosting', 'Blokeret'], ['Eksen', 'Crushet'], ['Kæreste', 'Flirt'], ['Svigermor', 'Svigerfar'],
    ['Friendzone', 'Situationship'], ['Match', 'Superlike'], ['Jalousi', 'Forelskelse'], ['Bryllup', 'Forlovelse'],
    ['Utroskab', 'Brud'], ['Kys', 'Kram'], ['Tinder-bio', 'Instagram-bio'], ['Dobbeltdate', 'Tredje hjul'],
    ['Langdistanceforhold', 'Sambo'], ['Biografdate', 'Kaffedate'], ['Scorereplik', 'Kompliment'], ['Wingman', 'Bedste ven'],
    ['Kærestesorg', 'Tømmermænd'], ['Årsdag', 'Valentinsdag'], ['Parterapi', 'Pause'], ['Skilsmisse', 'Forlovelsesfest'],
    ['Polterabend', 'Bryllupsnat'], ['Eksens nye', 'Eksens mor'], ['Seen-zonet', 'Venter på svar'], ['Blomster', 'Chokolade'],
    ['Kælenavn', 'Øgenavn'], ['Parforhold', 'Bollevenner'], ['Singlelivet', 'Ungkarlelivet'], ['Morgenkys', 'Godnatbesked'],
    ['Jaloux eks', 'Skør eks'], ['Første kys', 'Første skænderi'], ['Datingapp', 'Byens bar'], ['Bryllupstale', 'Scoretale'],
    ['Kærlighed ved første blik', 'Fuldemandsforelskelse']
  ]},
  { id: 'maerker', navn: 'Mærker', ord: [
    ['Nike', 'Adidas'], ['McDonald\'s', 'Burger King'], ['Coca-Cola', 'Pepsi'], ['Carlsberg', 'Tuborg'], ['Netto', 'Rema 1000'],
    ['Ikea', 'Jysk'], ['Apple', 'Samsung'], ['Red Bull', 'Monster'], ['Lego', 'Playmobil'], ['Gucci', 'Louis Vuitton'],
    ['Rolex', 'Apple Watch'], ['Bilka', 'Føtex'], ['7-Eleven', 'Circle K'], ['Sunset Boulevard', 'Subway'], ['H&M', 'Zara'],
    ['Jack & Jones', 'Selected'], ['Matas', 'Normal'], ['Elgiganten', 'Power'], ['Faxe Kondi', 'Sprite'], ['Cocio', 'Matilde'],
    ['Haribo', 'Katjes'], ['Kims', 'Pringles'], ['Toms', 'Marabou'], ['Ray-Ban', 'Oakley'], ['The North Face', 'Canada Goose'],
    ['Stone Island', 'Moncler'], ['New Balance', 'Asics'], ['Jordan', 'Yeezy'], ['Somersby', 'Breezer'], ['Jägermeister', 'Fisk'],
    ['Smirnoff', 'Absolut'], ['Heineken', 'Corona'], ['Playstation', 'Nintendo'], ['Spotify', 'Apple Music'], ['Tesla', 'BMW'],
    ['Ferrari', 'Lamborghini'], ['Gillette', 'Axe'], ['Durex', 'RFSU'], ['Royal', 'Harboe'], ['Lidl', 'Aldi']
  ]},
  { id: 'musik', navn: 'Musik', ord: [
    ['Drake', 'Travis Scott'], ['Kanye West', 'Jay-Z'], ['Kendrick Lamar', 'J. Cole'], ['The Weeknd', 'Post Malone'],
    ['Taylor Swift', 'Ariana Grande'], ['Ed Sheeran', 'Coldplay'], ['Queen', 'The Beatles'], ['Metallica', 'AC/DC'],
    ['Avicii', 'Martin Garrix'], ['David Guetta', 'Calvin Harris'], ['Gilli', 'Sivas'], ['Kesi', 'Benny Jamz'], ['Branco', 'Lamin'],
    ['Tobias Rahim', 'Hans Philip'], ['Suspekt', 'Malk de Koijn'], ['Nik & Jay', 'Rasmus Seebach'], ['Kim Larsen', 'Gasolin'],
    ['TV-2', 'Shu-bi-dua'], ['D-A-D', 'Volbeat'], ['Aqua', 'Infernal'], ['Medina', 'Jada'], ['Andreas Odbjerg', 'Blæst'],
    ['Artigeardit', 'Ukendt Kunstner'], ['Rap', 'Trap'], ['Techno', 'House'], ['Dansktop', 'Julemusik'], ['Guitar', 'Bas'],
    ['Trommer', 'Klaver'], ['Koncert', 'Festival'], ['Spotify Wrapped', 'Playliste'], ['Karaoke', 'Fællessang'], ['Vinyl', 'CD'],
    ['Autotune', 'Playback'], ['DJ', 'Producer'], ['Tinderbox', 'Smukfest'], ['Michael Jackson', 'Elvis'], ['Bad Bunny', 'Shakira'],
    ['Rihanna', 'Beyoncé'], ['Eminem', 'Snoop Dogg'], ['Fodboldsang', 'Nationalsang']
  ]},
  { id: 'penge', navn: 'Penge og arbejde', ord: [
    ['SU', 'Løn'], ['Kassekredit', 'Opsparing'], ['Aktier', 'Krypto'], ['Bitcoin', 'Lottokupon'], ['Lønseddel', 'Årsopgørelse'],
    ['Skat', 'Moms'], ['Chef', 'Kollega'], ['Fyret', 'Sagt op'], ['Jobsamtale', 'Lønforhandling'], ['Studiejob', 'Fritidsjob'],
    ['Vikar', 'Praktikant'], ['Overarbejde', 'Ferie'], ['Hjemmearbejde', 'Kontor'], ['MobilePay', 'Kontanter'], ['Lån', 'Gæld'],
    ['Lotto', 'Oddset'], ['Kasino', 'Poker'], ['Husleje', 'Depositum'], ['Forsikring', 'A-kasse'], ['Millionær', 'Milliardær'],
    ['Restskat', 'Fartbøde'], ['Julefrokost', 'Sommerfest'], ['Kantine', 'Madpakke'], ['Mandag morgen', 'Fredag eftermiddag'],
    ['Lønforhøjelse', 'Bonus'], ['Sygemelding', 'Fridag'], ['Pant', 'Lommepenge'], ['Pensionsopsparing', 'Børneopsparing'],
    ['Rykker', 'Inkasso'], ['Firmabil', 'Firmatelefon'], ['Iværksætter', 'Direktør'], ['Nattevagt', 'Weekendvagt'],
    ['Drikkepenge', 'Rabatkode'], ['Black Friday', 'Udsalg']
  ]},
  { id: 'ferie', navn: 'Ferie og drengetur', ord: [
    ['Sunny Beach', 'Mallorca'], ['Ibiza', 'Magaluf'], ['Prag', 'Budapest'], ['Skiferie', 'Sydtur'], ['All inclusive', 'Hostel'],
    ['Flyforsinkelse', 'Mistet kuffert'], ['Pas', 'Boardingkort'], ['Solcreme', 'Solskoldning'], ['Pool', 'Strand'],
    ['Jetski', 'Bananbåd'], ['Barcrawl', 'Bådfest'], ['Afterski', 'Sort pist'], ['Interrail', 'Roadtrip'], ['Camping', 'Sommerhus'],
    ['Hotelmorgenmad', 'Roomservice'], ['Lufthavnsøl', 'Taxfree'], ['Amsterdam', 'Berlin'], ['Las Vegas', 'Dubai'],
    ['Thailand', 'Bali'], ['Charterferie', 'Backpacking'], ['Ryanair', 'SAS'], ['Vinduesplads', 'Midtersæde'],
    ['Lejebil', 'Scooter'], ['Turistfælde', 'Lokal bodega'], ['Madforgiftning', 'Hedeslag'], ['Souvenir', 'Feriebillede'],
    ['Rejseforsikring', 'Det gule kort'], ['Liftkort', 'Skileje'], ['Vandland', 'Forlystelsespark'], ['Færge', 'Natbus'],
    ['Flyskræk', 'Turbulens'], ['Minibar', 'Hotelbar'], ['Drengetur', 'Parferie'], ['Hjemve', 'Feriekærlighed']
  ]},
  { id: 'mad', navn: 'Mad og drikke', ord: [
    ['Pizza', 'Durum'], ['Burger', 'Sandwich'], ['Sushi', 'Poké bowl'], ['Kebab', 'Shawarma'], ['Pommes frites', 'Kartoffelbåde'],
    ['Hotdog', 'Fransk hotdog'], ['Flæskesteg', 'Stegt flæsk'], ['Frikadeller', 'Hakkebøf'], ['Rugbrød', 'Toastbrød'],
    ['Leverpostej', 'Makrel i tomat'], ['Smørrebrød', 'Tapas'], ['Pasta', 'Nudler'], ['Lasagne', 'Spaghetti bolognese'],
    ['Tacos', 'Burrito'], ['Nachos', 'Chips'], ['Popcorn', 'Peanuts'], ['Kanelsnegl', 'Tebirkes'], ['Pandekager', 'Vafler'],
    ['Softice', 'Milkshake'], ['Nutella', 'Peanutbutter'], ['Havregryn', 'Cornflakes'], ['Æg og bacon', 'Brunch'],
    ['Chokolade', 'Lakrids'], ['Vingummi', 'Skumfiduser'], ['Kaffe', 'Energidrik'], ['Cola', 'Faxe Kondi'],
    ['Kakaomælk', 'Proteinshake'], ['Øl', 'Cider'], ['Rødvin', 'Hvidvin'], ['Snaps', 'Gammel Dansk'], ['Vodka', 'Gin'],
    ['Jägerbomb', 'Vodka Red Bull'], ['Mojito', 'Gin og tonic'], ['Champagne', 'Asti'], ['Ketchup', 'Remoulade'],
    ['Kylling og ris', 'Pasta med ketchup'], ['Frysepizza', 'Kopnudler'], ['Risengrød', 'Risalamande'], ['Æbleskiver', 'Pebernødder']
  ]},
  { id: 'steder', navn: 'Steder', ord: [
    ['Stranden', 'Svømmehallen'], ['Tivoli', 'Bakken'], ['Lufthavnen', 'Banegården'], ['Skadestuen', 'Tandlægen'],
    ['Biografen', 'Teatret'], ['Fitnesscentret', 'Idrætshallen'], ['Gymnasiet', 'Universitetet'], ['Netto', 'Bilka'],
    ['Roskilde Festival', 'Smukfest'], ['Bauhaus', 'Silvan'], ['Fængslet', 'Politistationen'], ['Legoland', 'Djurs Sommerland'],
    ['Bodegaen', 'Natklubben'], ['Campingpladsen', 'Sommerhuset'], ['Zoo', 'Den Blå Planet'], ['Kolonihaven', 'Altanen'],
    ['Kirken', 'Rådhuset'], ['Tankstationen', 'Kiosken'], ['Strøget', 'Jomfru Ane Gade'], ['Lalandia', 'Badeland'],
    ['Bornholm', 'Samsø'], ['København', 'Aarhus'], ['Odense', 'Aalborg'], ['Christiania', 'Nørrebro'], ['Parken', 'Royal Arena'],
    ['Kollegiet', 'Forældrenes kælder'], ['Venteværelset', 'Jobcentret'], ['Pizzeriaet', 'Grillbaren'],
    ['Toilettet i byen', 'Garderoben'], ['Rygeområdet', 'Dansegulvet'], ['Taxaen', 'Natbussen'], ['Elevatoren', 'Rulletrappen'],
    ['Fodboldbanen', 'Padelbanen'], ['Saunaen', 'Solcentret'], ['Bilvasken', 'Værkstedet'], ['Biblioteket', 'Læsesalen']
  ]},
  { id: 'verden', navn: 'Ude i verden', ord: [
    ['Paris', 'Rom'], ['New York', 'Los Angeles'], ['Kreta', 'Rhodos'], ['Hamborg', 'Flensborg'], ['Sverige', 'Norge'],
    ['London', 'Dublin'], ['Barcelona', 'Madrid'], ['Grønland', 'Island'], ['Tokyo', 'Seoul'], ['Australien', 'New Zealand'],
    ['Egypten', 'Marokko'], ['Sydpolen', 'Nordpolen'], ['Månen', 'Mars'], ['Alperne', 'Himalaya'], ['Ørkenen', 'Junglen'],
    ['Tyrkiet', 'Grækenland'], ['Polen', 'Tjekkiet'], ['USA', 'Canada'], ['Brasilien', 'Argentina'], ['Kina', 'Japan'],
    ['Nordkorea', 'Rusland'], ['Eiffeltårnet', 'Big Ben'], ['Pyramiderne', 'Den Kinesiske Mur'],
    ['Frihedsgudinden', 'Det Hvide Hus'], ['Vatikanet', 'Mekka'], ['Monaco', 'Schweiz'], ['Mexico', 'Spanien'],
    ['Oktoberfest', 'Karneval i Rio'], ['Disneyland', 'Universal Studios'], ['Hawaii', 'Maldiverne'], ['Venedig', 'Amsterdam'],
    ['Skotland', 'Irland'], ['Indien', 'Pakistan'], ['Sydafrika', 'Kenya'], ['Cuba', 'Jamaica'], ['Bermudatrekanten', 'Area 51']
  ]},
  { id: 'ting', navn: 'Hverdagsting', ord: [
    ['Telefon', 'Tablet'], ['Tandbørste', 'Barbermaskine'], ['Paraply', 'Regnjakke'], ['Cykel', 'Elløbehjul'], ['Sofa', 'Seng'],
    ['Pung', 'Kortholder'], ['Solbriller', 'Briller'], ['Ur', 'Armbånd'], ['Kaffemaskine', 'Elkedel'], ['Stige', 'Skammel'],
    ['Kniv', 'Saks'], ['Vaskemaskine', 'Opvaskemaskine'], ['Fjernsyn', 'Projektor'], ['Lighter', 'Tændstikker'],
    ['Nøgle', 'Adgangskort'], ['Støvsuger', 'Kost'], ['Pude', 'Dyne'], ['AirPods', 'Høretelefoner'], ['Toiletpapir', 'Køkkenrulle'],
    ['Grill', 'Bålfad'], ['Drikkedunk', 'Termokop'], ['Rygsæk', 'Sportstaske'], ['Kuffert', 'Weekendtaske'],
    ['Oplader', 'Powerbank'], ['Vækkeur', 'Røgalarm'], ['Deodorant', 'Parfume'], ['Kondom', 'Plaster'], ['Skraldespand', 'Pantpose'],
    ['Spejl', 'Vindue'], ['Stearinlys', 'Lommelygte'], ['Tæppe', 'Dørmåtte'], ['Krus', 'Glas'], ['Gaffel', 'Spisepinde'],
    ['Bold', 'Frisbee'], ['Kortspil', 'Terninger'], ['Øloplukker', 'Proptrækker']
  ]},
  { id: 'sport', navn: 'Sport', ord: [
    ['Fodbold', 'Håndbold'], ['Tennis', 'Badminton'], ['Padel', 'Squash'], ['Ski', 'Snowboard'], ['Svømning', 'Vandpolo'],
    ['Boksning', 'MMA'], ['Golf', 'Minigolf'], ['Skak', 'Poker'], ['Fiskeri', 'Jagt'], ['Løb', 'Cykling'], ['Bowling', 'Dart'],
    ['Billard', 'Bordfodbold'], ['Surfing', 'Kitesurfing'], ['Ridning', 'Rodeo'], ['Formel 1', 'Rally'],
    ['Basketball', 'Volleyball'], ['Ishockey', 'Curling'], ['Beerpong', 'Flip cup'], ['Skateboard', 'Rulleskøjter'],
    ['Maraton', 'Triatlon'], ['Tour de France', 'OL'], ['Amerikansk fodbold', 'Rugby'], ['Bordtennis', 'Stangtennis'],
    ['Armlægning', 'Tovtrækning'], ['Wrestling', 'Sumo'], ['E-sport', 'Fantasy Premier League'], ['Crossfit', 'Bodybuilding'],
    ['Klatring', 'Parkour'], ['Dykning', 'Snorkling'], ['Kajak', 'Roning'], ['Gymnastik', 'Yoga'], ['Speedway', 'Motocross'],
    ['Petanque', 'Kongespil'], ['Rundbold', 'Baseball'], ['Faldskærmsudspring', 'Bungyjump']
  ]},
  { id: 'fitness', navn: 'Krop og træning', ord: [
    ['Bænkpres', 'Squat'], ['Dødløft', 'Rows'], ['Biceps', 'Triceps'], ['Proteinshake', 'Kreatin'], ['Løbebånd', 'Romaskine'],
    ['Fitness World', 'SATS'], ['Pull-ups', 'Armbøjninger'], ['Mavebøjninger', 'Planke'], ['Håndvægte', 'Vægtstang'],
    ['Cardio', 'Styrketræning'], ['Bulk', 'Cut'], ['Leg day', 'Push day'], ['Sixpack', 'Ølmave'], ['Pre-workout', 'Energidrik'],
    ['Sauna', 'Isbad'], ['Fysioterapeut', 'Kiropraktor'], ['Løbetur', 'Gåtur'], ['Crossfit', 'Bootcamp'], ['Yoga', 'Udstrækning'],
    ['Spejlselfie', 'Flex'], ['Skulder', 'Ryg'], ['Kalorier', 'Protein'], ['Vandflaske', 'Shaker'],
    ['Træningshandsker', 'Løftebælte'], ['Muskelømhed', 'Forstrækning'], ['Personlig træner', 'Youtube-program'],
    ['Havregryn', 'Kylling og ris'], ['Steroider', 'Kosttilskud'], ['Gymbro', 'Træningsmakker'], ['Benpres', 'Lunges'],
    ['Motionscykel', 'Trappemaskine'], ['Gainer', 'Proteinbar'], ['Maxløft', 'Opvarmning'], ['Omklædningsrum', 'Fællesbad']
  ]},
  { id: 'jobs', navn: 'Jobs', ord: [
    ['Læge', 'Sygeplejerske'], ['Politibetjent', 'Dørmand'], ['Pilot', 'Stewardesse'], ['Kok', 'Tjener'], ['Lærer', 'Pædagog'],
    ['Advokat', 'Dommer'], ['Frisør', 'Tatovør'], ['Landmand', 'Gartner'], ['Brandmand', 'Ambulanceredder'], ['Tømrer', 'Murer'],
    ['Influencer', 'Model'], ['Bartender', 'DJ'], ['Præst', 'Bedemand'], ['Taxachauffør', 'Buschauffør'],
    ['Astronaut', 'Ubådskaptajn'], ['Skuespiller', 'Sanger'], ['Ejendomsmægler', 'Bilsælger'], ['Elektriker', 'VVS\'er'],
    ['Spion', 'Detektiv'], ['Postbud', 'Skraldemand'], ['Tandlæge', 'Kiropraktor'], ['Fodboldspiller', 'Fodbolddommer'],
    ['Statsminister', 'Borgmester'], ['Kongen', 'Paven'], ['Soldat', 'Fængselsbetjent'], ['Pusher', 'Pantelåner'],
    ['Lejemorder', 'Bodyguard'], ['Klovn', 'Tryllekunstner'], ['Livredder', 'Skiinstruktør'], ['Programmør', 'Hacker'],
    ['Bankrådgiver', 'Revisor'], ['Telefonsælger', 'Parkeringsvagt'], ['Pizzabud', 'Wolt-bud'], ['Kassedame', 'Flaskedreng'],
    ['Rapper', 'Standupkomiker'], ['Professionel gamer', 'Fuldtids-streamer']
  ]},
  { id: 'studie', navn: 'Skole og studie', ord: [
    ['Eksamen', 'Aflevering'], ['Gymnasiet', 'Efterskolen'], ['Fredagsbar', 'Rustur'], ['Læsesal', 'Kantine'],
    ['Kollegie', 'Lejlighed'], ['Matematik', 'Fysik'], ['Dansk', 'Engelsk'], ['Gruppearbejde', 'Solo-opgave'],
    ['Pjæk', 'Sygemelding'], ['Reeksamen', 'Dumpet'], ['12-tal', '02'], ['Studiestart', 'Dimission'],
    ['Studenterhue', 'Studentervogn'], ['Erhvervsskole', 'Handelsskole'], ['Sabbatår', 'Højskole'], ['Læreplads', 'Praktik'],
    ['Forelæsning', 'Holdtime'], ['Idrætstime', 'Frikvarter'], ['Klasselærer', 'Vikar'], ['Lommeregner', 'ChatGPT'],
    ['Studiegruppe', 'Drukgruppe'], ['SU-lån', 'Kassekredit'], ['Online-time', 'Lektiecafé'], ['Eksamensangst', 'Præstationsangst'],
    ['Karakterblad', 'Fraværsprocent'], ['Bachelor', 'Kandidat'], ['Skolefest', 'Galla'], ['Lejrskole', 'Studietur'],
    ['Mundtlig eksamen', 'Skriftlig eksamen'], ['Rektor', 'Pedel'], ['Madpakke', 'Skolebod'], ['Speciale', 'SRP']
  ]},
  { id: 'biler', navn: 'Biler og transport', ord: [
    ['BMW', 'Mercedes'], ['Audi', 'Volkswagen'], ['Tesla', 'Polestar'], ['Toyota', 'Honda'], ['Porsche', 'Maserati'],
    ['Volvo', 'Saab'], ['Skoda', 'Seat'], ['Peugeot', 'Citroën'], ['Ford', 'Opel'], ['Elbil', 'Hybrid'],
    ['Automatgear', 'Manuelt gear'], ['Kørekort', 'Knallertkørekort'], ['Fartbøde', 'Parkeringsbøde'], ['Motorvej', 'Landevej'],
    ['Benzin', 'Diesel'], ['Sommerdæk', 'Vinterdæk'], ['Køreprøve', 'Teoriprøve'], ['S-tog', 'Metro'], ['Bus', 'Taxa'],
    ['Knallert', 'Motorcykel'], ['Rejsekort', 'Pendlerkort'], ['Bilvask', 'Dækskifte'], ['Kabinescooter', 'Golfbil'],
    ['Flyver', 'Færge'], ['Førersæde', 'Bagsæde'], ['Rundkørsel', 'Lyskryds'], ['Parallelparkering', 'Bakke ud'],
    ['Sikkerhedssele', 'Airbag'], ['Punktering', 'Tom tank'], ['Blitzer', 'Færdselsbetjent'], ['Klippekort', 'Frakendelse'],
    ['Trailer', 'Campingvogn'], ['Lastbil', 'Traktor'], ['Limousine', 'Partybus']
  ]},
  { id: 'apps', navn: 'Apps og internet', ord: [
    ['TikTok', 'Instagram'], ['Snapchat', 'Messenger'], ['Netflix', 'HBO'], ['iPhone', 'Android'], ['ChatGPT', 'Google'],
    ['Wolt', 'Just Eat'], ['MobilePay', 'Dankort'], ['Facebook', 'LinkedIn'], ['Reddit', 'X'], ['Uber', 'Bolt'],
    ['Airbnb', 'Hotels.com'], ['Rejseplanen', 'Google Maps'], ['Vinted', 'DBA'], ['Zalando', 'Boozt'], ['Temu', 'Wish'],
    ['Wordle', 'Wordfeud'], ['Strava', 'Skridttæller'], ['Podcast', 'Lydbog'], ['Wifi', 'Mobildata'], ['Selfie', 'Spejlbillede'],
    ['BeReal', 'Snap-streak'], ['Screenshot', 'Skærmoptagelse'], ['Emoji', 'GIF'], ['Meme', 'Reel'], ['Wikipedia', 'Lex'],
    ['E-Boks', 'MitID'], ['Nemlig', 'Bilka to go'], ['Gruppechat', 'Privatbesked'], ['Voice note', 'Opkald'],
    ['Password', 'Pinkode'], ['Flytilstand', 'Forstyr ikke'], ['Skærmtid', 'Batteriprocent'], ['Spam', 'Phishing'],
    ['Inkognito-fane', 'Slettet historik']
  ]},
  { id: 'film', navn: 'Film og serier', ord: [
    ['Harry Potter', 'Ringenes Herre'], ['Star Wars', 'Star Trek'], ['Titanic', 'Avatar'], ['Friends', 'How I Met Your Mother'],
    ['Game of Thrones', 'Vikings'], ['Frost', 'Løvernes Konge'], ['Olsen-banden', 'Far til fire'], ['Matador', 'Badehotellet'],
    ['Klovn', 'Langt fra Las Vegas'], ['Paradise Hotel', 'Ex on the Beach'], ['X Factor', 'Vild med dans'],
    ['James Bond', 'Mission Impossible'], ['Shrek', 'Toy Story'], ['Stranger Things', 'The Walking Dead'],
    ['Breaking Bad', 'Narcos'], ['Fast and Furious', 'Top Gun'], ['Rejseholdet', 'Broen'], ['The Office', 'Brooklyn Nine-Nine'],
    ['Squid Game', 'Hunger Games'], ['Barbie', 'Oppenheimer'], ['Druk', 'Jagten'], ['Peaky Blinders', 'Sopranos'],
    ['Prison Break', 'Money Heist'], ['John Wick', 'Taken'], ['Hangover', 'Superbad'], ['Wolf of Wall Street', 'The Big Short'],
    ['Scarface', 'The Godfather'], ['Jurassic Park', 'King Kong'], ['Inception', 'Interstellar'], ['Matrix', 'Terminator'],
    ['Rocky', 'Creed'], ['Alene hjemme', 'Grinchen'], ['Love Island', 'Gift ved første blik'], ['Robinson', 'Alene i vildmarken'],
    ['South Park', 'Family Guy'], ['Simpsons', 'Rick and Morty'], ['Gladiator', '300'], ['Scary Movie', 'American Pie']
  ]},
  { id: 'figurer', navn: 'Figurer fra film og spil', ord: [
    ['Batman', 'Iron Man'], ['Joker', 'Thanos'], ['Darth Vader', 'Voldemort'], ['Hulk', 'Thor'], ['Spider-Man', 'Deadpool'],
    ['Superman', 'Captain America'], ['Harley Quinn', 'Catwoman'], ['Loki', 'Venom'], ['Gollum', 'Dobby'], ['Gandalf', 'Dumbledore'],
    ['Yoda', 'Baby Yoda'], ['Han Solo', 'Indiana Jones'], ['Pennywise', 'Chucky'], ['Terminator', 'Rambo'], ['John Wick', 'James Bond'],
    ['Jack Sparrow', 'Kaptajn Klo'], ['Shrek', 'Æslet'], ['Homer Simpson', 'Peter Griffin'], ['Rick', 'Morty'], ['Cartman', 'Kenny'],
    ['SvampeBob', 'Patrick'], ['Pikachu', 'Charizard'], ['Mario', 'Luigi'], ['Sonic', 'Crash Bandicoot'],
    ['Walter White', 'Jesse Pinkman'], ['Tony Soprano', 'Pablo Escobar'], ['Jon Snow', 'Tyrion'], ['Kratos', 'Master Chief'],
    ['Minions', 'Gru'], ['Buzz Lightyear', 'Woody'], ['Simba', 'Scar'], ['Elsa', 'Olaf'], ['Rocky', 'Ivan Drago'],
    ['Borat', 'Mr. Bean'], ['Frank fra Klovn', 'Casper fra Klovn'], ['Egon Olsen', 'Benny'], ['Godzilla', 'King Kong'],
    ['Dracula', 'Frankenstein'], ['Ted', 'Paddington'], ['Lara Croft', 'Nathan Drake']
  ]},
  { id: 'kendte', navn: 'Kendte danskere', ord: [
    ['Mads Mikkelsen', 'Nikolaj Coster-Waldau'], ['Christian Eriksen', 'Rasmus Højlund'], ['Medina', 'MØ'],
    ['Lukas Graham', 'Christopher'], ['Kong Frederik', 'Prins Joachim'], ['Mette Frederiksen', 'Lars Løkke'],
    ['Caroline Wozniacki', 'Holger Rune'], ['Casper Christensen', 'Frank Hvam'], ['Kim Larsen', 'Thomas Helmig'],
    ['Anders Matthesen', 'Mick Øgendahl'], ['Nikolaj Lie Kaas', 'Pilou Asbæk'], ['Peter Schmeichel', 'Michael Laudrup'],
    ['Dronning Margrethe', 'Dronning Mary'], ['Suspekt', 'L.O.C.'], ['Tobias Rahim', 'Andreas Odbjerg'], ['Gilli', 'Kesi'],
    ['Jonas Vingegaard', 'Mads Pedersen'], ['Mikkel Hansen', 'Niklas Landin'], ['Kevin Magnussen', 'Tom Kristensen'],
    ['Nicklas Bendtner', 'Simon Kjær'], ['Viktor Axelsen', 'Anders Antonsen'], ['Linse Kessler', 'Gustav Salinas'],
    ['Sidney Lee', 'Amalie Szigethy'], ['Thomas Blachman', 'Remee'], ['Bubber', 'Sigurd Barrett'], ['Nik & Jay', 'Burhan G'],
    ['Lars Ulrich', 'Volbeat'], ['Pia Kjærsgaard', 'Inger Støjberg'], ['Anders Fogh', 'Helle Thorning'],
    ['Jonatan Spang', 'Simon Talbot'], ['Alexander Husum', 'Morten Münster'], ['Sofie Linde', 'Mads Steffensen'],
    ['Bjarne Riis', 'Michael Rasmussen'], ['Brian Nielsen', 'Mikkel Kessler'], ['H.C. Andersen', 'Niels Bohr']
  ]},
  { id: 'verdenskendte', navn: 'Kendte i verden', ord: [
    ['Elon Musk', 'Jeff Bezos'], ['Trump', 'Putin'], ['Kim Kardashian', 'Kylie Jenner'], ['MrBeast', 'PewDiePie'],
    ['The Rock', 'Vin Diesel'], ['Justin Bieber', 'Harry Styles'], ['Tom Cruise', 'Brad Pitt'],
    ['Leonardo DiCaprio', 'Johnny Depp'], ['Conor McGregor', 'Mike Tyson'], ['Logan Paul', 'Jake Paul'],
    ['Zuckerberg', 'Bill Gates'], ['Obama', 'Biden'], ['Kong Charles', 'Prins Harry'], ['Gordon Ramsay', 'Jamie Oliver'],
    ['Michael Jordan', 'LeBron James'], ['Usain Bolt', 'Mo Farah'], ['Lewis Hamilton', 'Max Verstappen'], ['Federer', 'Nadal'],
    ['Arnold Schwarzenegger', 'Sylvester Stallone'], ['Keanu Reeves', 'Nicolas Cage'], ['Adam Sandler', 'Jim Carrey'],
    ['Greta Thunberg', 'Malala'], ['Paven', 'Dalai Lama'], ['IShowSpeed', 'Kai Cenat'], ['Tiger Woods', 'Rory McIlroy'],
    ['Khabib', 'Jon Jones'], ['Einstein', 'Stephen Hawking'], ['Napoleon', 'Julius Cæsar'], ['Jesus', 'Julemanden'],
    ['Will Smith', 'Chris Rock'], ['Kevin Hart', 'Eddie Murphy'], ['Ryan Reynolds', 'Hugh Jackman'],
    ['Jackie Chan', 'Bruce Lee'], ['Oprah', 'Ellen DeGeneres'], ['Steve Jobs', 'Tim Cook']
  ]},
  { id: 'lejlighed', navn: 'Drengelejligheden', ord: [
    ['Gamerstol', 'Sofa'], ['Proteinpulver', 'Kreatin'], ['Tom pizzabakke', 'Tom ølkasse'], ['Airfryer', 'Mikroovn'],
    ['Snusdåse', 'Cigaretpakke'], ['Scarface-plakat', 'Zlatan-plakat'], ['Beerpong-bord', 'Bordfodbold'],
    ['Den døde plante', 'Kaktus'], ['Tørrestativ', 'Vasketøjskurv'], ['Whiteboard', 'Kalender'], ['Ølbong', 'Shotglas'],
    ['Madras på gulvet', 'Boxmadras'], ['Playstation', 'Fladskærm'], ['Soundbar', 'Bluetooth-højttaler'],
    ['Hårtrimmer', 'Barbermaskine'], ['Sneakers', 'Badesandaler'], ['Kasket', 'Hue'], ['Poser med pant', 'Skraldeposer'],
    ['Gaming-headset', 'AirPods'], ['Terningbæger', 'Kortspil'], ['Håndvægte', 'Elastikker'], ['Oplader', 'Forlængerledning'],
    ['Neonlys', 'Lyskæde'], ['Flag på væggen', 'Spejl på væggen'], ['Halvtom vodka', 'Halvtom Jägermeister'],
    ['Chips i sengen', 'Krummer i sofaen'], ['Opvask fra i tirsdags', 'Vasketøj fra sidste uge'], ['Tomt køleskab', 'Tom fryser'],
    ['Roomie', 'Underbo'], ['Stegepande', 'Toastmaskine'], ['Brusebad', 'Toilet uden papir'], ['Dørtelefon', 'Postkasse']
  ]},
  { id: 'dyr', navn: 'Dyr', ord: [
    ['Hund', 'Ulv'], ['Kat', 'Ræv'], ['Løve', 'Tiger'], ['Hest', 'Æsel'], ['Ko', 'Tyr'], ['Gris', 'Vildsvin'],
    ['Haj', 'Spækhugger'], ['Delfin', 'Sæl'], ['Slange', 'Ål'], ['Elefant', 'Næsehorn'], ['Pingvin', 'Isbjørn'], ['Bi', 'Hveps'],
    ['Kanin', 'Hare'], ['Hamster', 'Marsvin'], ['Krokodille', 'Komodovaran'], ['Ugle', 'Ørn'], ['Abe', 'Gorilla'],
    ['Giraf', 'Kamel'], ['Mus', 'Rotte'], ['Frø', 'Tudse'], ['Sommerfugl', 'Møl'], ['Blæksprutte', 'Vandmand'], ['Høne', 'And'],
    ['Edderkop', 'Skorpion'], ['Panda', 'Koala'], ['Får', 'Ged'], ['Måge', 'Due'], ['Myg', 'Flue'], ['Dovendyr', 'Skildpadde'],
    ['Papegøje', 'Undulat'], ['Kænguru', 'Lama'], ['Dinosaur', 'Drage'], ['Guldfisk', 'Piratfisk'], ['Hummer', 'Krabbe']
  ]},
  { id: 'fraekt', navn: 'Frækt', adult: true, ord: [
    ['Tinder', 'Bumble'], ['Håndjern', 'Bind for øjnene'], ['Onenightstand', 'Fast bolleven'], ['Kondom', 'P-pille'],
    ['Stripklub', 'Swingerklub'], ['Dildo', 'Vibrator'], ['Tungekys', 'Sugemærke'], ['G-streng', 'Boxershorts'],
    ['Porno', 'OnlyFans'], ['Sexet undertøj', 'Nøgen'], ['Første gang', 'Bedste gang'], ['Skinny dipping', 'Nudiststrand'],
    ['Friends with benefits', 'Sidespring'], ['Nøgenbillede', 'Dick pic'], ['Bad sammen', 'Massage'],
    ['Fifty Shades', 'Kama Sutra'], ['Strip poker', 'Flaskehalsen peger på'], ['Missionær', 'Doggystyle'],
    ['Trekant', 'Swingerfest'], ['Morgensex', 'Fuldesex'], ['Quickie', 'Forspil'], ['Sex i bilen', 'Sex på stranden'],
    ['Booty call', 'Sexting'], ['Lapdance', 'Striptease'], ['Glidecreme', 'Massageolie'], ['Sextape', 'Spejl i loftet'],
    ['Hævnsex', 'Forsoningssex'], ['Blowjob', '69'], ['Sugardaddy', 'Milf'], ['Sex på toilettet', 'Sex i et telt']
  ]}
];
