/* Bombe: kategorier og scenarier. Sig noget, der passer, og giv bomben videre.
   Kategorier: nævn ting i en gruppe. Skal have 20+ mulige svar, som alle kan finde på under pres.
   Scenarier: kom med et svar på en situation, jo dummere jo bedre. Svaret skal kunne siges på to sekunder.
   *_ADULT vises kun med "Frækt indhold" slået til. */
const BOMBE_CATEGORIES = [
  /* Fodbold og sport */
  'Premier League-klubber', 'Superliga-klubber', 'Champions League-vindere', 'Danske landsholdsspillere',
  'Spillere der har spillet i Real Madrid', 'Spillere der har vundet Ballon d\'Or', 'Fodboldtrænere', 'Fodboldstadions',
  'Lande der har vundet VM', 'Fodboldspillere med skæg', 'Målmænd', 'Klubber med røde trøjer',
  'Ting en fodboldkommentator siger', 'Ting man råber ad dommeren', 'Danske sportsstjerner', 'Sportsgrene med bold',
  'Sportsgrene uden bold', 'OL-discipliner', 'Formel 1-kørere', 'UFC-kæmpere', 'NBA-hold', 'Tennisspillere',
  /* Gaming og internet */
  'Playstation-spil', 'Mobilspil', 'Spil man spillede som barn', 'Figurer fra videospil', 'Ting man gør i GTA',
  'Youtubere', 'Danske Youtubere', 'Streamere', 'Apps på din telefon', 'Sociale medier', 'Hjemmesider',
  'Ting man ikke må google på arbejdet', 'Ting man ser på YouTube klokken 3 om natten', 'Podcasts',
  /* Byen og druk */
  'Ølmærker', 'Shots', 'Cocktails', 'Spiritus', 'Drukspil', 'Ting man kan blande vodka med', 'Ting man kan købe i en kiosk',
  'Natmad', 'Ord for at være fuld', 'Ord for at kaste op', 'Ting man mister i byen', 'Danske festivaler',
  'Ting en dørmand siger', 'Ting en fuld mand siger', 'Ting man gør med tømmermænd',
  'Steder man kan sove, når man ikke kan komme hjem', 'Ting man finder i lommen dagen efter', 'Ting man kan bunde',
  'Ting man kan drikke af', 'Ting man kan åbne en øl med', 'Ting man har i en bar', 'Sange der får alle op at danse',
  'Sange alle kan synge med på', 'Grunde til at tage en øl', 'Byer man kan gå i byen i', 'Ting man tager med på festival',
  'Ting man finder i teltet efter Roskilde', 'Ting man kan stjæle fra en bar', 'Ting man kan lave med en tom øldåse',
  /* Mad og drikke */
  'Fastfoodkæder', 'Pizza-toppings', 'Energidrikke', 'Chips-smage', 'Slik', 'Is', 'Sodavand', 'Morgenmad', 'Tømmermandsmad',
  'Ting man kan grille', 'Ting i et køleskab', 'Ting på en durum', 'Ting man kan komme på en burger',
  'Ting man kan dyppe i ketchup', 'Ting man kan lave i en airfryer', 'Retter man kan lave på under 10 minutter',
  'Ting i et kollegiekøkken', 'Ting man kan købe i 7-Eleven', 'Ting på et julefrokostbord', 'Mad man ikke gider spise',
  /* Krop og træning */
  'Øvelser i fitness', 'Ting i et fitnesscenter', 'Proteinkilder', 'Kropsdele', 'Muskler', 'Ting man kan brække',
  'Typer man møder i fitness', 'Undskyldninger for ikke at træne',
  /* Hverdag, penge og studie */
  'Bilmærker', 'Sneakermærker', 'Tøjmærker', 'Supermarkeder', 'Butikker i et storcenter', 'Ting i Ikea', 'Ting i en bil',
  'Ting man kan bruge SU på', 'Jobs hvor man tjener kassen', 'Jobs man ikke gider have', 'Uddannelser', 'Fag i skolen',
  'Ting der er forbudt i Danmark', 'Ting man kan få en bøde for', 'Ting man kan blive fyret for', 'Ting man kan blive smidt ud for',
  'Ting man lyver om', 'Ting man kan købe i Bilka', 'Ting i en drengs værelse', 'Ting man glemmer derhjemme',
  'Ting der koster under 20 kr', 'Ting der koster over en million', 'Ting der lugter', 'Ting der larmer',
  'Ting man kan komme for sent til', 'Ting man gør på toilettet', 'Ting man gør, når ingen kigger', 'Ting man kan gøre med én hånd',
  'Ting din mor siger', 'Ting din far siger', 'Ting en lærer siger', 'Ting man kan være bange for',
  'Ting man kan være afhængig af', 'Ting man kan samle på', 'Ting man kan sidde på', 'Ting man kan gemme sig i',
  'Ting man kan kaste med',
  /* Steder */
  'Danske byer', 'Byer i Jylland', 'Danske øer', 'Lande i Europa', 'Hovedstæder', 'Amerikanske stater', 'Byer i USA',
  'Lande i Afrika', 'Lande i Asien', 'Lande i Sydamerika', 'Steder man tager på sydtur', 'Steder man tager på skiferie',
  'Steder man ikke gider på ferie', 'Ting i en lufthavn', 'Flyselskaber',
  /* Film, musik og kendte */
  'Netflix-serier', 'Actionfilm', 'Gyserfilm', 'Disney-film', 'Danske film', 'Film med biler', 'Realityprogrammer',
  'Superhelte', 'Skurke i film', 'Tegnefilmsfigurer', 'Harry Potter-figurer', 'Marvel-figurer', 'Star Wars-figurer',
  'Rappere', 'Danske rappere', 'Bands', 'Kunstnere der har spillet på Roskilde', 'Kendte danskere', 'Danske politikere',
  'Danske komikere', 'Tv-værter', 'Skuespillere', 'Kongelige', 'Kendte der er døde', 'Kendte par',
  'Kendte man gerne ville drikke en øl med', 'Kendte man ikke gider sidde ved siden af i et fly',
  /* Klassikere der bare virker */
  'Farlige dyr', 'Dyr i havet', 'Ting der kan eksplodere', 'Ting med hjul', 'Ting der flyver', 'Ting der er større end en bil',
  'Våben', 'Bandeord', 'Drengenavne', 'Pigenavne', 'Ord der rimer på "øl"', 'Ord der rimer på "fuld"', 'Kortspil', 'Brætspil',
  'Lyde man kan lave med munden'
];

const BOMBE_CATEGORIES_ADULT = [
  'Sexstillinger', 'Kaldenavne for bryster', 'Kaldenavne for penis', 'Steder man kan have sex', 'Steder man ikke må have sex',
  'Ting man kan gøre i sengen', 'Datingapps', 'Frække ord', 'Ting der er lange', 'Ting man kan smøre på en krop',
  'Pornonavne', 'Pornokategorier', 'Ting man siger under sex', 'Ting man ikke må sige under sex',
  'Ting man kan bruge som sexlegetøj', 'Ord for at have sex', 'Ting der dræber stemningen', 'Ting man finder i et natbord',
  'Tøj man kan tage af', 'Ting man kan blive tændt af'
];

/* Scenarier: kom med et svar, der passer til situationen. Rundt om bordet, indtil den springer. */
const BOMBE_SCENARIER = [
  /* Byen */
  'Ting man siger til dørmanden, der ikke vil lukke dig ind', 'Ting man aldrig skal sige til en dørmand',
  'Ting man skriver til sin eks klokken 3 om natten', 'Ting man siger, når nogen spørger, om man er fuld',
  'Ting man gør for at se ædru ud', 'Ting man siger, når man har blackout og skal lade som om, man husker det',
  'Ting man siger, når man bliver bedt om at bunde', 'Grunde til, at man ikke kan bunde', 'Måder at få en gratis øl',
  'Måder at komme gratis ind på en natklub', 'Ting man siger, når regningen kommer', 'Ting man siger, når nogen tager den sidste øl',
  'Ting man gør, når man ikke kan finde sin telefon i byen', 'Måder at slippe for at drikke i et drukspil',
  'Ting man siger, når nogen spilder øl på dig', 'Ting man gør, når taxaen kører forbi', 'Ting man gør, når kebabmanden har lukket',
  'Ting man siger til en fremmed i taxakøen', 'Ting man siger til bartenderen for at blive serveret først',
  'Ting man siger for at komme foran i køen', 'Ting man siger, når nogen foreslår "bare én øl"', 'Ting der sker efter "bare én øl"',
  'Ting man lover sig selv med tømmermænd', 'Ting man googler med tømmermænd', 'Ting man fortryder dagen efter',
  'Ting man siger, når man er den eneste ædru', 'Ting man siger for at slippe for at være chauffør',
  'Ting man siger, når man vågner på en fremmed sofa', 'Ting man gør, når der ikke er mere øl', 'Ting man siger til en, der ikke vil bunde',
  'Ting man siger, når man har bundet på 4 sekunder', 'Ting man siger, når man har tabt i beerpong', 'Måder at ødelægge en forfest',
  'Grunde til at gå hjem klokken 23', 'Ting man siger for at få lov at blive længere i byen',
  'Ting man gør på Roskilde klokken 6 om morgenen', 'Ting man siger, når man er kommet ind på det forkerte toilet',
  'Ting man siger til sin mor søndag morgen', 'Ting man siger, når man møder sin gamle lærer i byen',
  'Ting man gør, når man ser sin chef i byen', 'Sidste ord før en dårlig beslutning', 'Ting din ven siger, lige før han gør noget dumt',
  'Ting man siger i taxaen for at virke ædru', 'Ting man siger, når man har kastet op til en fest', 'Ting man råber på et dansegulv',
  'Ting man siger, når man har mistet de andre i byen', 'Ting man siger til en, der er alt for fuld',
  /* Dating */
  'Grunde til at du er single', 'Ting man ikke må sige på en første date', 'Ting man gør, når man er blevet dumpet',
  'Ting man gør, når man møder sin eks i byen', 'Ting man siger for at få en date', 'Ting man siger for at miste en date',
  'Ting man siger på en date, man ikke gider', 'Ting man siger, når man møder eksens nye', 'Ting man gør for at imponere en date',
  'Grunde til at ringe til sin eks', 'Ting man ikke fortæller kæresten fra drengeturen',
  'Ting man ikke må sige, når man møder svigerfar første gang', 'Ting man ikke må sige til sin svigermor', 'Dårlige scorereplikker',
  'Ting der står i en dårlig Tinder-bio', 'Dårlige grunde til at slå op', 'Ting man siger, når man ikke kan lide sin vens nye kæreste',
  'Undskyldninger for ikke at svare på en besked i tre dage', 'Ting man siger, når man er blevet ghostet', 'Røde flag på en første date',
  'Ting man svarer, når kæresten spørger "hvad tænker du på?"', 'Ting man gør, når kæresten er sur, og man ikke ved hvorfor',
  'Dårlige steder at tage en date med hen', 'Ting man siger, når man har glemt årsdagen', 'Dårlige gaver til kæresten',
  /* Fodbold og gaming */
  'Ting man siger, når man har tabt i FIFA', 'Ting man skriver i FIFA-chatten', 'Grunde til at dit hold tabte',
  'Ting man råber, når Danmark scorer', 'Grunde til at spille FIFA klokken 3 om natten', 'Ting man aldrig hører en fodboldfan sige',
  'Ting man gør, når ens hold rykker ned', 'Undskyldninger for at tabe i padel', 'Undskyldninger for at brænde et straffespark',
  'Ting man siger, når ens makker er dårlig', 'Undskyldninger for at tabe i et spil', 'Ting man råber ind i et headset',
  'Grunde til at ragequitte', 'Ting en træner råber fra sidelinjen',
  /* Studie, job og penge */
  'Undskyldninger for at komme for sent på arbejde', 'Måder at snyde til en eksamen', 'Ting man bruger sin SU på i uge 1',
  'Ting man tænker på til en eksamen', 'Ting man gør i stedet for at læse', 'Grunde til at pjække',
  'Ting man siger, når læreren spørger, hvorfor afleveringen mangler', 'Ting man gør med 50 kr tilbage på kontoen',
  'Det første du gør, når du vinder en million', 'Måder at blive rig uden at arbejde', 'Undskyldninger for ikke at betale sin del',
  'Ting man siger, når man skylder penge på MobilePay', 'Ting man ikke må sige til en jobsamtale', 'Ting man ikke må sige til sin chef',
  'Beskeder man ikke vil have fra sin chef en søndag', 'Ting man laver på arbejdet, når chefen ikke kigger',
  'Undskyldninger for at melde sig syg', 'Ting man siger for at få udsat en aflevering', 'Dårlige ting at skrive i en ansøgning',
  'Ting man køber, når man lige har fået løn',
  /* Hverdag og familie */
  'Løgne man fortæller sin mor', 'Ting man siger til sin far, når man har smadret bilen',
  'Ting man siger til sin mor, når hun ringer klokken 2 om natten', 'Ting man laver, når internettet er nede',
  'Ting man gør, når man er låst ude af sin lejlighed', 'Ting man siger for at slippe for opvasken',
  'Måder at få sin roomie til at vaske op', 'Undskyldninger for at aflyse en aftale', 'Ting man siger, når man har glemt en fødselsdag',
  'Måder at miste sit kørekort på', 'Ting man siger til en betjent for at slippe', 'Ting man siger, når man har ramt en parkeret bil',
  'Ting man gør, når man har glemt sin pung', 'Ting man gør, når naboen klager over musikken',
  'Ting man siger, når nogen har taget din plads i sofaen', 'Ting man gør på en flyvetur på 8 timer', 'Undskyldninger for at skippe træning',
  'Ting man gør, når man har 2 procent strøm', 'Ting man siger, når man taber sin telefon i toilettet',
  'Ting man siger, når man har glemt en vens navn', 'Ting man skriver i en gruppechat og fortryder', 'Ting man siger til tjeneren, når maden er kold',
  'Ting man siger, når man bliver taget i at snyde', 'Ting man siger, når man har tabt et væddemål', 'Ting man gør på en sydtur',
  'Ting der sker på en drengetur', 'Ting man aldrig gør igen på en drengetur',
  /* Dårlige idéer og forbudte sætninger */
  'Dårlige tatoveringer', 'Dårlige grunde til at få en tatovering', 'Ting man ikke må sige til en tatovør', 'Dårlige navne til en hund',
  'Dårlige navne til en bar', 'Dårlige ting at sige i en bryllupstale', 'Dårlige julegaver', 'Dårlige superkræfter',
  'Dårlige navne til et fodboldhold', 'Ting man ikke må råbe i en lufthavn', 'Ting man ikke må sige til en begravelse',
  'Ting man ikke må sige til en frisør', 'Ting man ikke må sige til en læge', 'Ting man aldrig hører en mand sige',
  'Ting man aldrig hører en bartender sige', 'Ting man aldrig hører en lærer sige', 'Måder at blive smidt ud af Tivoli',
  'Måder at blive smidt ud af en biograf', 'Måder at blive smidt ud af et fly', 'Måder at blive smidt ud af Ikea',
  /* Hvad nu hvis */
  'Ting man ville gøre, hvis man var usynlig', 'Ting man ville gøre som statsminister', 'Ting man ville gøre, hvis man var konge for en dag',
  'Ting man tager med til en øde ø', 'Ting man gør under en zombieapokalypse', 'Ting man siger, når man møder en kendt',
  'Ting man gør, når man sidder fast i en elevator', 'Ting man ville gøre med en tidsmaskine', 'Ting man ville gøre på sin sidste dag',
  'Ting man gør, hvis man vågner op som sin far'
];

const BOMBE_SCENARIER_ADULT = [
  'Ting man siger efter et onenightstand', 'Ting man ikke må sige i sengen', 'Undskyldninger for ikke at have lyst',
  'Ting man skriver på Tinder for at score', 'Ting man aldrig skriver på Tinder', 'Ting man gør, når forældrene kommer hjem for tidligt',
  'Ting man siger, når kondomet sprang', 'Måder at blive taget på fersk gerning', 'Ting man siger, når man ikke kan huske navnet dagen efter',
  'Ting man gør, når roomien har besøg', 'Steder man ikke vil tages i det', 'Ting man siger, når det gik for hurtigt',
  'Ting man gør, når man har set for meget porno', 'Ting man siger for at få nogen med hjem', 'Ting man siger for at få nogen til at gå igen',
  'Ting man ikke må sige, når man ser nogen nøgen første gang', 'Dårlige steder at få et sugemærke', 'Ting man fortryder at have sendt',
  'Ting man siger, når nogen kommer ind uden at banke på', 'Dårlige sange at have sex til'
];
