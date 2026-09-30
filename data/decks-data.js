/* Kortspil: Jeg har aldrig, Mest sandsynlig og straffe til Hvem drikker. */
const JEG_HAR_ALDRIG = [
  'kastet op på en bytur', 'sovet på en bænk udenfor', 'pjækket fra arbejde på grund af tømmermænd',
  'sendt en besked, jeg fortrød dagen efter', 'stjålet noget fra en butik', 'snydt i et brætspil', 'løjet om min alder',
  'tabt min telefon i toilettet', 'ghostet nogen', 'glemt navnet på en, jeg talte med', 'grædt til en film',
  'sunget karaoke foran fremmede', 'badet nøgen i havet', 'kørt for stærkt med vilje', 'sovet over mig til noget vigtigt',
  'spist mad, der havde ligget på gulvet', 'fortrudt en tatovering', 'skrevet til en eks, mens jeg var fuld',
  'vågnet et sted, jeg ikke kunne genkende', 'mistet min pung på en bytur', 'sneget mig ind et sted uden at betale',
  'løjet for mine forældre om, hvor jeg var', 'fået en bøde', 'blevet smidt ud af et sted', 'drukket alene',
  'taget en sygedag uden at være syg', 'stalket en eks på sociale medier', 'læst en andens beskeder i smug',
  'brugt over 1.000 kr på én bytur', 'glemt, hvor jeg havde parkeret', 'råbt ad en fremmed', 'lavet en falsk profil',
  'faldet i søvn til en fest', 'tisset i havet', 'forladt en date før tid', 'bestilt mad klokken 4 om natten',
  'grinet så meget, at jeg tissede i bukserne', 'bundet en øl på under 5 sekunder', 'brugt en andens tandbørste',
  'klippet mit eget hår', 'kysset en af dem, der sidder her', 'været i slagsmål', 'talt med accent for at imponere nogen',
  'sovet i en lufthavn', 'løbet fra regningen', 'kastet op i en taxa', 'set en hel serie på én dag',
  'brugt en død bedstemor som undskyldning', 'glemt en tæt vens fødselsdag', 'danset på et bord',
  'vundet noget i lotto eller på et skrabelod', 'været i tv', 'snydt til en eksamen', 'spist en hel pizza alene',
  'fået noget stjålet på en festival', 'sendt en besked til den forkerte person', 'kastet op af at grine',
  'givet en fremmed mit nummer', 'stået op med tømmermænd og drukket videre', 'løjet om at have læst en bog'
];

const JEG_HAR_ALDRIG_ADULT = [
  'haft et onenightstand', 'sendt et nøgenbillede', 'haft sex et offentligt sted', 'været på Tinder-date',
  'gået i seng med en ven', 'fået en date via Instagram', 'løjet om antallet af partnere', 'haft sex på et toilet',
  'været på stripklub', 'brugt sexlegetøj', 'kysset to forskellige på samme aften', 'vågnet ved siden af en, jeg ikke kendte',
  'haft sex i en bil', 'fortrudt, hvem jeg gik hjem med', 'fået et sugemærke', 'set porno sammen med en anden'
];

const MEST_SANDSYNLIG = [
  'blive smidt ud af en bar', 'glemme sin egen fødselsdag', 'blive rig', 'gifte sig i Las Vegas', 'falde i søvn til en fest',
  'blive kendt', 'ende i fængsel', 'grine på et upassende tidspunkt', 'købe et kæledyr i fuldskab', 'ringe til sin mor, når de er fulde',
  'blive statsminister', 'flytte til udlandet', 'få en tatovering i morgen', 'vinde en spisekonkurrence', 'blive stoppet i lufthavnen',
  'tage tøj på med vrangen ud', 'sende en pinlig besked til chefen', 'miste sin telefon i aften', 'starte en podcast', 'komme i tv',
  'blive influencer', 'spise mad, som andre har efterladt', 'danse på bordet i aften', 'græde i aften', 'bunde en øl først',
  'glemme, hvor de bor', 'komme for sent til sit eget bryllup', 'have tømmermænd i morgen', 'lave en dårlig investering',
  'blive smidt ud af Paradise Hotel på dag ét', 'snyde i det her spil', 'tage på McDonald\'s efter byen', 'melde sig til Robinson',
  'lyve om at have set en film', 'falde ned ad trappen i aften', 'blive gift først', 'få flest børn', 'blive skaldet',
  'få en fartbøde', 'holde sig vågen længst i aften', 'give en fremmed sit telefonnummer', 'stjæle et vejskilt på vej hjem',
  'blive DJ', 'glemme sit kodeord', 'starte en diskussion om politik', 'kaste op først', 'sove i tøjet i nat',
  'vinde Vild med dans', 'blive fyret for at komme for sent', 'drikke en øl til morgenmad', 'bo hos sine forældre som 40-årig',
  'få en bøde for at tisse offentligt', 'bestille en Uber til 500 meter', 'overleve en zombieapokalypse', 'blive vegetar',
  'råbe ad tjeneren', 'miste sit kørekort', 'sende en besked til den forkerte gruppechat', 'købe noget dyrt i fuldskab',
  'ende på skadestuen i aften', 'blive kendt for noget pinligt'
];

const MEST_SANDSYNLIG_ADULT = [
  'have et onenightstand i aften', 'have haft flest partnere', 'sende et nøgenbillede til den forkerte',
  'gå hjem med en fremmed i aften', 'date to på samme tid', 'have sex et offentligt sted', 'blive taget i at have sex',
  'matche med sin eks på Tinder', 'have en hemmelig OnlyFans'
];

const HVEM_DRIKKER_STRAFFE = [
  'drikker 2 slurke', 'drikker 3 slurke', 'bunder sin øl', 'vælger en, der skal drikke 3 slurke', 'giver 2 slurke væk',
  'drikker sammen med personen til venstre', 'drikker sammen med personen til højre', 'slipper. Alle andre drikker 1 slurk',
  'tager en shot (eller 5 slurke)', 'udbringer en skål. Alle drikker', 'drikker 1 slurk for hvert år over 20',
  'laver en regel, der gælder resten af aftenen', 'drikker 4 slurke uden at bruge hænderne', 'vælger to, der skal drikke sammen',
  'fortæller en pinlig historie eller drikker 5 slurke', 'drikker 3 slurke med lukkede øjne', 'danser i 10 sekunder eller bunder',
  'bytter drink med en anden', 'må ikke sige "ja" resten af runden. Bryder man reglen, drikker man', 'drikker 2 slurke og vælger næste spil'
];
