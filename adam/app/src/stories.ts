// Bedtime stories for Adam. 6 stories, 6 paragraphs each.
// Narration chunking happens elsewhere; here we keep only the raw content.

export type Story = {
  id: number
  // Shown on the story-picker button
  emoji: string
  paragraphs: string[]
}

export const STORIES: Story[] = [
  {
    id: 1,
    emoji: '⭐',
    paragraphs: [
      'A fost odată, ca niciodată, o luminiță mică, ce a coborât din cer într-o seară liniștită, când luna se vedea la geam. Bebe Adam s-a trezit, a clipit încet, iar luminița stătea chiar pe păturica lui, de parcă o stea venise în camera lui.',
      'Luminița s-a rostogolit încet până lângă mânuța lui și a clipit de două ori. Din ușă a venit mama, zâmbind. „Uite, Adam, avem un musafir mic.”',
      'Luminița părea obosită după drumul lung de pe cer. Mama a adus puțină apă și a pus un strop lângă ea, ca și cum ar fi ajutat o stea să-și recapete puterea.',
      'După ce luminița s-a făcut mai strălucitoare, a început să urce spre geam. Dar Adam a scos un sunet mic, de parcă spunea: „nu”. Atunci luminița s-a întors lângă el.',
      'Mama a râs încet și i-a dat lui Adam papa. Luminița a stat cuminte pe păturică, iar Adam o privea cu ochii mari, ca pe o prietenă mică venită din cer.',
      'Când lui Adam i s-au închis ochișorii, luminița s-a așezat pe marginea ferestrei. Mama a șoptit „nani, bebe”, iar steaua a clipit o dată, ca și cum făcea „pa” și promitea că se întoarce și mâine. Iar stelele au clipit încet, ca și cum le-ar fi spus: noapte bună.',
    ],
  },
  {
    id: 2,
    emoji: '💧',
    paragraphs: [
      'A fost odată, ca niciodată, o picătură mică de apă, ce s-a așezat pe geam într-o dimineață liniștită. Bebe Adam stătea în pătuț și se uita la ea. Picătura cobora încet pe sticlă, ca și cum mergea la plimbare.',
      'Picătura s-a oprit la mijlocul geamului și a strălucit puțin. A venit mama și a zâmbit. „Uite, Adam, e o picătură curioasă.”',
      'Apoi a venit tata cu un pahar mic de apă. A pus paharul lângă pătuț, iar lumina din cameră s-a oglindit în el. Adam a privit apa cum tremura ușor, ca o mică mare într-un pahar.',
      'Picătura de pe geam părea că vrea să intre la Adam. Dar vântul a mișcat perdeaua, iar Adam a scos un sunet mic, de parcă spunea: „nu”. Tata a închis geamul încet, ca să fie bine și cald.',
      'După papa, mama i-a șters gurița lui Adam cu grijă. Picătura de pe geam a coborât până jos și a dispărut, dar în pahar apa încă sclipea liniștit lângă el.',
      'Când a venit vremea de nani, tata a făcut „pa” cu mâna spre geam, iar mama l-a ținut pe Adam aproape. Bebe a închis ochișorii, iar apa din pahar a rămas acolo cuminte, păzind camera în tăcere. Iar în casă s-a făcut liniște, cald și bine.',
    ],
  },
  {
    id: 3,
    emoji: '🍼',
    paragraphs: [
      'A fost odată, ca niciodată, un băiețel pe nume Adam, care stătea în pătuț într-o seară liniștită și privea spre ușă. Din bucătărie se auzea un sunet mic, ca un pahar pus încet pe masă.',
      'A venit tata și s-a așezat lângă el. În cameră mirosea curat și cald, iar Adam știa că undeva aproape se pregătea ceva bun. Tata a zâmbit: „Uite, Adam, vine imediat.”',
      'Pe noptieră era un pahar cu apă, iar lângă el stătea o sticluță cu lapte. Laptele era alb și liniștit, ca o lună mică prinsă într-un biberon.',
      'Adam a mișcat mânuța spre biberon, dar când tata l-a ridicat prea repede, bebe a scos un sunet mic, de parcă spunea: „nu”. Tata a înțeles și l-a ținut mai aproape, fără grabă.',
      'Apoi a venit papa. Laptele curgea încet, iar Adam s-a liniștit tot mai mult. Dinspre ușă se vedea o umbră blândă, care a stat puțin și apoi s-a retras, ca să nu tulbure somnul.',
      'Când biberonul s-a golit, tata l-a ținut pe Adam la piept și i-a șoptit: „nani, bebe.” Lumina din cameră s-a făcut mică, ușa a făcut încet „pa”, iar Adam a adormit cu gust de lapte și liniște. Iar luna le-a păzit somnul până dimineață.',
    ],
  },
  {
    // Jack și vrejul de fasole (Joseph Jacobs), retold gently for bedtime
    id: 4,
    emoji: '🌱',
    paragraphs: [
      'A fost odată, ca niciodată, un băiețel pe nume Jack, care locuia cu mama lui într-o căsuță mică de la marginea satului. Nu aveau prea multe: o masă, două scaune și o vatră în care focul ardea încet. În curte pășea o văcuță blândă, pe nume Alba, care le dădea în fiecare dimineață lapte cald. Dar într-o zi laptele s-a împuținat, cămara a rămas goală, iar mama s-a așezat lângă Jack și i-a spus încet: „Puiul meu, trebuie să vindem văcuța noastră la târg, ca să avem ce mânca.” Jack a mângâiat văcuța pe frunte, i-a șoptit „pa, Alba”, apoi a pornit cu ea la drum, pe cărarea care șerpuia printre dealuri verzi.',
      'Pe drum, Jack a întâlnit un om bătrân cu barbă albă, care ținea în palmă o punguță cu boabe de fasole colorate: unele roșii, unele aurii, unele verzi ca frunza. „Sunt boabe fermecate”, a spus omul zâmbind. „Dacă le sădești seara, până dimineața cresc până la cer.” Lui Jack i-au sclipit ochii de bucurie: a dat văcuța pe boabe și a fugit repede acasă, să i le arate mamei. Dar mama s-a întristat: „Of, Jack, ce ne facem noi cu cinci boabe de fasole?” Și le-a aruncat pe fereastră, în grădină. În seara aceea s-au culcat devreme, iar afară o ploaie caldă a picurat încet peste grădina în care dormeau boabele fermecate.',
      'Dimineața, camera lui Jack era plină de o lumină verde și blândă. În fața geamului se înălța un vrej uriaș de fasole, gros cât un copac, cu frunze late ca niște trepte moi, care urca sus, tot mai sus, până deasupra norilor. Jack s-a cățărat pe el ca pe o scară, treaptă cu treaptă, iar vântul îi gâdila obrajii. Când a ajuns deasupra, a pășit într-o țară din cer, unde norii erau albi și pufoși ca niște perne. La capătul unui drum lung, a găsit un castel mare cât un munte, cu o ușă cât zece case. Jack a bătut încet, iar o uriașă blândă i-a deschis, l-a poftit înăuntru și i-a dat o cană cu lapte cald și o felie mare de pâine.',
      'Deodată, podeaua a început să se cutremure ușor: bum, bum, bum. Venea uriașul acasă. „Repede, ascunde-te!”, a șoptit uriașa, iar Jack s-a făcut mic de tot în spatele unei căni cât un butoi. Uriașul a adulmecat aerul: „Hmm, parcă miroase a ceva nou pe aici.” „E doar supa de pe foc”, a răspuns uriașa liniștită, și i-a pus în față un castron aburind. După ce a mâncat, uriașul a scos o punguță cu bănuți de aur, i-a numărat pe toți, unul câte unul, și a adormit cu capul pe masă, sforăind ca un tunet blând. Atunci Jack a ieșit tiptil, a luat punguța, a coborât pe vrej și i-a dat-o mamei. Multă vreme au avut ce mânca și au fost fericiți.',
      'Dar într-o zi bănuții s-au terminat, iar Jack s-a cățărat din nou pe vrej, tot mai sus, până la castelul din nori. De data aceasta, uriașul a adus la masă o găinușă fermecată, care făcea ouă de aur, și o harpă de aur, care cânta singură cântece de leagăn. Când uriașul a adormit, Jack a luat găinușa sub un braț și harpa sub celălalt. Dar harpa a sunat încetișor „ding!”, iar uriașul s-a trezit și a pornit greoi după el: bum, bum, bum. Jack a coborât pe vrej repede, repede, ca o veveriță. Jos, a luat toporul cel mic și a tăiat vrejul, iar acesta s-a lăsat încet la pământ, ca o funie moale. Uriașul a rămas sus, în țara lui din nori, și de atunci nu a mai coborât niciodată.',
      'De atunci, în căsuța de la marginea satului a fost mereu cald și bine. Găinușa făcea în fiecare zi câte un ou de aur, mama cocea plăcinte cu mere, iar toată casa mirosea a dulce. Sus, în țara lui, uriașul s-a împăcat cu gândul și dormea liniștit pe norii pufoși, ca pe niște perne mari. Seara, harpa de aur cânta singură cântece de leagăn, încetișor, ca o mămică ce fredonează. Jack se cuibărea în pătuțul lui, mama îi șoptea „nani”, iar deasupra căsuței stelele clipeau încet, ca și cum le-ar fi spus: noapte bună.',
    ],
  },
  {
    // Punguța cu doi bani (Ion Creangă), retold gently for bedtime
    id: 5,
    emoji: '🐓',
    paragraphs: [
      'A fost odată, ca niciodată, un moș și o babă care locuiau într-o căsuță mică, cu gard de nuiele și o curte plină de flori. Baba avea o găinușă harnică, ce făcea în fiecare zi câte două ouă, iar moșul avea un cocoș falnic, cu pene arămii și creastă roșie. Într-o zi, moșul i-a cerut babei un ou, ca să-și potolească foamea, dar baba nu a vrut să-i dea niciunul. Atunci moșul a oftat și i-a spus cocoșului său: „Cocoșule, du-te și tu în lumea largă și adu-ne ceva, că tare săraci mai suntem.” Cocoșul a bătut o dată din aripi, a cântat „cucurigu!” și a pornit la drum, pe cărarea dintre dealuri.',
      'Cum mergea el așa, cocoșul a găsit pe drum o punguță mică de catifea, în care sunau vesel doi bănuți: cling, cling. A luat-o în cioc și a pornit mândru spre casă. Dar tocmai atunci a trecut pe acolo o caleașcă frumoasă, trasă de patru cai albi, în care stătea un boier mare. Boierul a văzut punguța sclipind și i-a spus vizitiului: „Ia punguța de la cocoș, că unui cocoș nu-i trebuie bănuți!” Și caleașca a plecat mai departe, cu punguță cu tot. Cocoșul nu s-a lăsat: a alergat după ea cât l-au ținut piciorușele, dând din aripi și strigând: „Cucurigu, boieri mari, dați punguța cu doi bani!”',
      'Boierul s-a încruntat și a poruncit: „Aruncați cocoșul acesta gălăgios în fântână!” Dar cocoșul nu s-a speriat deloc: a început să bea apa, gâl, gâl, gâl, până a băut fântâna toată, apoi a zburat afară ușor ca un fulg și a alergat iar după caleașcă: „Cucurigu, boieri mari, dați punguța cu doi bani!” Boierul a poruncit atunci să fie închis în cuptorul cu jar. Cocoșul însă a lăsat să curgă din gușă toată apa din fântână, iar jarul s-a stins încetișor, ca o lumânare suflată de vânt. Apoi a ieșit din cuptor nevătămat, și-a scuturat penele de cenușă și a strigat iar, de afară: „Cucurigu, boieri mari, dați punguța cu doi bani!”',
      'Boierul nu mai știa ce să facă. „Aruncați-l în mijlocul cirezii de vite, să vedem ce mai face acolo!” Dar cocoșul, care acum era voinic și fermecat de-a binelea, a înghițit pe nerăsuflate toate vitele boierului: văcuțe, boi și viței, și s-a făcut mare cât o căpiță de fân. Apoi a strigat din nou, cu glas voios: „Cucurigu, boieri mari, dați punguța cu doi bani!” Boierul l-a închis atunci în cămara cu bani, dar cocoșul a înghițit și bănuții, până la ultimul. Văzând că nimic nu-l oprește, boierul a deschis fereastra și i-a întins punguța: „Ține-ți punguța, cocoșule fermecat, numai du-te cu bine la casa ta!” Cocoșul a luat-o frumos în cioc și a pornit spre casă.',
      'Moșul îl aștepta în poartă, iar când l-a văzut venind, nu-i venea să-și creadă ochilor. „Întinde, moșule, un țol mare în mijlocul curții!”, a cântat cocoșul. Moșul a întins țolul, iar cocoșul a bătut o dată din aripi: din gușa lui au ieșit, una câte una, toate văcuțele, care au început să pască liniștite prin curte, iar bănuții de aur au curs grămadă strălucitoare pe țol, sunând ca niște clopoței. La urmă, cocoșul a așezat deasupra și punguța cu doi bani, cea mai de preț dintre toate. Moșul l-a mângâiat pe creastă: „Bravo, cocoșelul moșului, ce comoară de cocoș îmi ești!” Și din ziua aceea nu au mai dus lipsă de nimic.',
      'Baba, văzând atâta bogăție, și-a trimis și ea găinușa în lume, să aducă comori. Găinușa s-a plimbat puțin prin iarbă și s-a întors cu o mărgică mică de sticlă, albastră ca cerul de vară. Baba a oftat, dar moșul a zâmbit blând: „Hai la masă, babo, că este loc și bucate pentru toți.” Și au mâncat împreună plăcinte calde, iar mărgica albastră au pus-o la fereastră, unde prindea lumina ca o steluță. Seara, cocoșul s-a cuibărit în cuibarul lui de paie, cu găinușa alături, moșul și baba au adormit liniștiți, iar deasupra căsuței stelele au clipit încet, ca și cum le-ar fi spus: noapte bună.',
    ],
  },
  {
    // Albă ca Zăpada și cei șapte pitici (Frații Grimm), retold gently for bedtime
    id: 6,
    emoji: '❄️',
    paragraphs: [
      'A fost odată, ca niciodată, o fetiță frumoasă pe nume Albă ca Zăpada, cu pielea albă ca zăpada proaspătă, cu părul negru ca pana corbului și cu obrajii rumeni ca merele coapte. Ea locuia într-un castel mare, unde regina, mama ei vitregă, avea o oglindă fermecată. În fiecare dimineață, regina o întreba: „Oglindă, oglinjoară, cine e cea mai frumoasă din țară?”, iar oglinda îi răspundea: „Tu, regina mea.” Dar într-o zi, oglinda a spus cu glas limpede: „Frumoasă ești, regină, dar Albă ca Zăpada e de o mie de ori mai frumoasă.” Regina s-a încruntat și s-a supărat atât de tare, încât inima ei s-a făcut rece ca gheața.',
      'Regina a chemat un vânător și i-a poruncit să o ducă pe Albă ca Zăpada departe, în adâncul pădurii. Dar vânătorul avea inimă bună: când au ajuns între copaci, i-a șoptit fetiței: „Fugi, copilă, și găsește-ți un loc unde să fii în siguranță.” Albă ca Zăpada a mers prin pădure toată ziua, printre brazi înalți și ferigi moi. Păsărelele îi cântau de sus, o căprioară blândă a condus-o pe cărare, iar veverițele îi arătau drumul sărind din creangă în creangă. Când soarele cobora spre asfințit, fetița a zărit într-o poiană o căsuță mică de tot, cu acoperiș roșu și ferestre cât palma. A bătut încet la ușă, dar nu a răspuns nimeni, așa că a intrat tiptil.',
      'Înăuntru, totul era mic și rânduit cu grijă: o masă micuță cu șapte farfurioare și șapte lingurițe, șapte scăunele și, lângă perete, șapte pătuțuri cu plăpumioare colorate. Albă ca Zăpada a gustat câte puțin din fiecare farfurioară, ca să nu se cunoască prea tare, apoi, obosită de drum, s-a întins peste pătuțuri și a adormit. Seara au venit acasă stăpânii căsuței: șapte pitici cu bărbi lungi și scufii colorate, care munceau toată ziua în mina din munte, căutând pietre strălucitoare. Când au aprins lumânările, au văzut fetița dormind. „Ce copilă frumoasă!”, au șoptit ei și au lăsat-o să doarmă până dimineața.',
      'Dimineața, Albă ca Zăpada le-a povestit piticilor tot ce pățise, iar ei i-au spus: „Rămâi la noi, fetițo! Tu vei avea grijă de căsuță, iar noi vom avea grijă de tine.” Și așa au trăit frumos împreună: piticii plecau dimineața la mină, fluierând un cântecel, iar Albă ca Zăpada gătea supă caldă și făcea căsuța lună. „Să nu deschizi ușa la nimeni!”, îi spuneau piticii în fiecare zi. Dar regina a aflat de la oglindă că Albă ca Zăpada trăiește în căsuța din pădure. S-a îmbrăcat ca o bătrânică, a luat un coș cu mere și a bătut la ușă: „Mere dulci, fetițo, ia un măr rumen!” Albă ca Zăpada a mușcat din mărul cel roșu și, deodată, a căzut într-un somn adânc, adânc.',
      'Când piticii au venit acasă și au găsit-o dormind atât de adânc, s-au întristat tare. Au așezat-o cu grijă pe un pat de cristal, în poiana cu flori, iar păsărelele și căprioarele stăteau în jurul ei și o păzeau zi și noapte. Într-o zi, prin pădure a trecut un prinț tânăr, călare pe un cal alb. Când a văzut-o pe Albă ca Zăpada, i s-a părut cea mai frumoasă ființă din lume. A ridicat-o ușor, iar atunci bucățica de măr fermecat i-a alunecat fetiței din gură. Albă ca Zăpada a deschis ochii, a zâmbit și a întrebat încet: „Unde mă aflu?” „Cu mine și cu prietenii tăi”, i-a răspuns prințul, iar piticii au dansat de bucurie în jurul lor.',
      'Albă ca Zăpada a plecat cu prințul la castelul lui, dar nu i-a uitat niciodată pe cei șapte pitici: în fiecare duminică, ei veneau în vizită, iar la castel se coceau plăcinte cu mere dulci, din care mâncau toți cu poftă. Oglinda fermecată a spus de atunci mereu adevărul: „Cea mai frumoasă este cea cu inima bună.” Seara, când se lăsa liniștea, Albă ca Zăpada se așeza la fereastră și privea spre pădurea unde licăreau, mici și calde, luminițele din căsuța piticilor. „Nani, prieteni dragi”, șoptea ea, iar deasupra castelului și deasupra pădurii stelele clipeau încet, ca și cum le-ar fi spus: noapte bună.',
    ],
  },
]