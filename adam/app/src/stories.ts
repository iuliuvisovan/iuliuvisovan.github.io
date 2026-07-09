// Bedtime stories for Adam. 8 stories, 6 paragraphs each.
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
    emoji: '☀️',
    paragraphs: [
      'A fost odată, ca niciodată, o umbră mică și rotundă, care a apărut într-o dimineață liniștită pe marginea perdelei. Bebe Adam stătea în pătuțul lui, iar umbra se legăna ușor, ca un balon care venise să-l salute.',
      'Tata a intrat încet în cameră și s-a uitat și el spre perdea. „Uite, Adam, o văd și eu.” Umbra s-a ascuns o clipă după perdea, apoi a ieșit din nou, ca și cum voia să se joace de-a v-ați ascunselea.',
      'Tata a luat un pahar cu apă și l-a pus pe noptieră. Balonul de umbră s-a oglindit în apă și, deodată, Adam a văzut că nu era o umbră, ci o bulină de lumină rătăcită.',
      'Tata a vrut să deschidă geamul ca bulina să plece afară, dar Adam a scos un sunet mic: „nu”. Tata a zâmbit și a spus: „Bine, mai stă puțin cu noi.”',
      'După papa, Adam s-a liniștit, iar bulina de lumină s-a plimbat pe perete până a ajuns lângă pătuț. Tata i-a arătat-o cu degetul: „Uite, Adam, te păzește.”',
      'Când a venit vremea de nani, tata l-a învelit ușor pe Adam. Bulina s-a ridicat spre perdea, a clipit o dată, ca un „pa” mic, apoi a dispărut în lumina dimineții. Iar bebe a închis ochii și a intrat în vis.',
    ],
  },
  {
    id: 3,
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
    id: 4,
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
    id: 5,
    emoji: '🌙',
    paragraphs: [
      'A fost odată, ca niciodată, o lumină mică și rotundă, care a apărut pe perete într-o seară liniștită. Bebe Adam stătea în pătuț și se uita la ea. Lumina se mișca încet ori de câte ori perdeaua se legăna.',
      'A venit tata și a tras perdeaua puțin mai bine. Lumina nu a dispărut de tot, doar s-a făcut mai mică. „Uite, Adam, încă e aici. Dar și ea se pregătește de nani.”',
      'Pe noptieră era un pahar cu apă, iar lângă pătuț era o păturică așezată frumos. Camera devenea tot mai liniștită, ca și cum toate lucrurile știau că vine somnul.',
      'Adam a deschis ochii mari, de parcă spunea „nu, încă nu.” Tata a zâmbit și l-a ținut puțin mai aproape. Nu era grabă. Nani venea încet, ca un musafir blând.',
      'După papa, bebe Adam a început să clipească tot mai rar. Lumina de pe perete cobora încet, păturica stătea cuminte, iar camera părea că respiră foarte încet.',
      'Când ochișorii lui Adam s-au închis, tata a șoptit: „nani, bebe.” Lumina mică a făcut un ultim semn, ca un „pa”, apoi camera a rămas liniștită până dimineață. Și totul a fost bine.',
    ],
  },
  {
    // Jack și vrejul de fasole (Joseph Jacobs), retold gently for bedtime
    id: 6,
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
    id: 7,
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
    // Punguța cu doi bani (Ion Creangă), the original text, dialogue folded
    // into quotes so each chunk stays a single flowing paragraph
    id: 8,
    emoji: '🐔',
    paragraphs: [
      'Era odată o babă și un moșneag. Baba avea o găină, și moșneagul un cucoș; găina babei se oua de câte două ori pe fiecare zi și baba mânca o mulțime de ouă; iar moșneagului nu-i da nici unul. Moșneagul într-o zi perdu răbdarea și zise: „Măi babă, mănânci ca în târgul lui Cremene. Ia dă-mi și mie niște ouă, ca să-mi prind pofta măcar.” „Da’ cum nu!”, zise baba, care era foarte zgârcită. „Dacă ai poftă de ouă, bate și tu cucoșul tău, să facă ouă, și-i mânca; că eu așa am bătut găina, și iacătă-o cum se ouă.” Moșneagul, pofticios și hapsin, se ia după gura babei și, de ciudă, prinde iute și degrabă cucoșul și-i dă o bataie bună, zicând: „Na! ori te ouă, ori du-te de la casa mea; ca să nu mai strici mâncarea degeaba.”',
      'Cucoșul, cum scăpă din mânile moșneagului, fugi de-acasă și umbla pe drumuri, bezmetec. Și cum mergea el pe-un drum, numai iată găsește o punguță cu doi bani. Și cum o găsește, o și ia în clonț și se întoarnă cu dânsa înapoi către casa moșneagului. Pe drum se întâlnește c-o trăsură c-un boier și cu niște cucoane. Boierul se uită cu băgare de seamă la cucoș, vede în clonțu-i o punguță și zice vezeteului: „Măi! ia dă-te jos și vezi ce are cucoșul cela în plisc.” Vezeteul se dă iute jos din capra trăsurei, și c-un feliu de meșteșug, prinde cucoșul și luându-i punguța din clonț o dă boieriului. Boieriul o ia, fără păsare o pune în buzunar și pornește cu trăsura înainte. Cucoșul, supărat de asta, nu se lasă, ci se ia după trăsură, spuind neîncetat: „Cucurigu! boieri mari, dați punguța cu doi bani!”',
      'Boierul, înciudat, când ajunge în dreptul unei fântâni, zice vezeteului: „Mă! ia cucoșul ist obraznic și-l dă în fântâna ceea.” Vezeteul se dă iarăși jos din capră, prinde cucoșul și-l azvârle în fântână! Cucoșul, văzând această mare primejdie, ce să facă? Începe-a înghiți la apă; și-nghite, și-nghite, până ce-nghite toată apa din fântână. Apoi zboară de-acolo afară și iarăși se ia în urma trăsurei, zicând: „Cucurigu! boieri mari, dați punguța cu doi bani!” Boierul, văzând aceasta, s-a mirat cumplit și a zis: „Mă! da’ al dracului cucoș i-aista! Ei, las’ că ți-oiu da eu ție de cheltuială, măi crestatule și pintenatule!” Și cum ajunge acasă, zice unei babe de la bucătărie să ia cucoșul, să-l azvârle într-un cuptor plin cu jăratic și să pună o lespede la gura cuptorului. Baba, cânoasă la inimă, de cuvânt; face cum i-a zis stăpânu-său. Cucoșul, cum vede și astă mare nedreptate, începe a vărsa la apă; și toarnă el toată apa cea din fântână pe jaratic, până ce stinge focul de tot, și se răcorește cuptoriul; ba încă face ș-o apăraie prin casă, de s-au îndrăcit de ciudă hârca de la bucătărie. Apoi dă o bleandă lespezei de la gura cuptiorului, iesă teafăr și de-acolo, fuga la fereastra boierului și începe a trânti cu ciocul în geamuri și a zice: „Cucurigu! boieri mari, dați punguța cu doi bani!”',
      '„Măi, că mi-am găsit beleaua cu dihania asta de cucoș”, zise boieriul cuprins de mierare. „Vezeteu! Ia-l de pe capul meu și-l zvârle în cireada boilor ș-a vacilor; poate vreun buhaiu înfuriat i-a veni de hac; l-a lua în coarne, și-om scăpa de supărare.” Vezeteul iarăși ia cucoșul și-l zvârle în cireadă! Atunci, bucuria cucoșului! Să-l fi văzut cum înghițea la buhai, la boi, la vaci și la viței; păn-a înghițit el toată cireada, ș-a făcut un pântece mare, mare cât un munte! Apoi iar vine la fereastră, întinde aripele în dreptul soarelui, de întunecă de tot casa boierului, și iarăși începe: „Cucurigu! boieri mari, dați punguța cu doi bani!” Boierul, când mai vede și astă dandanaie, crăpa de ciudă și nu știa ce să mai facă, doar va scăpa de cucoș. Mai stă boierul cât stă pe gânduri, pănă-i vine iarăși în cap una: „Am să-l dau în haznaua cu banii; poate va înghiți la galbeni, i-a sta vreunul în gât, s-a îneca și-oiu scăpa de dânsul.” Și, cum zice, umflă cucoșul de-o aripă și-l zvârle în zahnaua cu banii; căci boieriul acela, de mult bănărit ce avea, nu-i mai știa numărul. Atunci cucoșul înghite cu lăcomie toți banii și lasă toate lăzile pustii. Apoi iesă și de-acolo, el știe cum și pe unde, se duce la fereastra boierului și iar începe: „Cucurigu! boieri mari, dați punguța cu doi bani!”',
      'Acum, după toate cele întâmplate, boierul, văzând că n-are ce-i mai face, i-azvârle punguța. Cucoșul o ia de jos cu bucurie, se duce la treaba lui și lasă pe boier în pace. Atunci toate paserile din ograda boierească, văzând voinicia cucoșului, s-au luat după dânsul, de ți se părea că-i o nuntă, și nu altăceva; iară boierul se uita galiș cum se duceau paserile și zise oftând: „Ducă-se și cobe și tot, numai bine că am scăpat de belea, că nici lucru curat n-a fost aici!” Cucoșul însă mergea țanțoș, iar paserile după dânsul, și merge el cât merge, până ce ajunge acasă la moșneag, și de pe la poartă începe a cânta: „Cucurigu! cucurigu!” Moșneagul, cum aude glasul cucoșului, iesă afară cu bucurie; și, când își aruncă ochii spre poartă, ce să vadă? Cucoșul său era ceva de spăriet! Elefantul ți se părea purice pe lângă acest cucoș; ș-apoi în urma lui veneau cârduri nenumărate de paseri, care de care mai frumoase, mai cucuiete și mai boghete. Moșneagul, văzând pe cucoșul său așa de mare și de greoiu, și încunjurat de-atâta amar de galițe, i-a deschis poarta. Atunci cucoșul i-a zis: „Stăpâne, așterne un țol aici în mijlocul ogrăzii.” Moșneagul, iute ca un prâsnel, așterne țolul. Cucoșul atunci se așază pe țol, scutură puternic din aripi și îndată se umple ograda și livada moșneagului, pe lângă paseri, și de cirezi de vite; iară pe țol toarnă o movilă de galbeni, care strălucea la soare de-ți lua ochii! Moșneagul, văzând aceste mari bogății, nu știa ce să facă de bucurie, sărutând mereu cucoșul și dezmerdându-l. Atunci, iaca și baba vine nu știu de unde; și, când a văzut unele ca aceste, numa-i sclipeau răutăcioasei ochii în cap și plesnea de ciudă.',
      '„Moșnege”, zise ea rușinată, „dă-mi și mie niște galbeni!” „Ba pune-ți pofta-n cuiu, măi babă! Când ți-am cerut ouă, știi ce mi-ai răspuns? Bate acum și tu găina, să-ți aducă galbeni; c-așa am bătut eu cucoșul, știi tu din a cui pricină… și iaca ce mi-a adus!” Atunci baba se duce în poiată, găbuiește găina, o apucă de coadă și o ia la bătaie, de-ți venea să-i plângi de milă! Biata găină, cum scapă din mânile babei, fuge pe drumuri. Și cum mergea pe drum, găsește și ea o mărgică ș-o înghite. Apoi răpede se întoarce acasă la babă și începe de pe la poartă: „Cot, cot, cotcodac!” Baba iesă cu bucurie înaintea găinei. Găina sare peste poartă, trece iute pe lângă babă și se pune pe cuibariu; și, după vrun ceas de ședere, sare de pe cuibariu, cotcodocind. Baba atunci se duce cu fuga, să vadă ce i-a făcut găina… Și, când se uită în cuibariu, ce să vadă? Găina se ouase o mărgică. Baba, când vede că ș-a bătut găina joc de dânsa, o prinde ș-o bate, ș-o bate, păn-o omoară în bătaie! Și așa, baba cea zgârcită și nebună a rămas de tot săracă, lipită pământului. De-acu a mai mânca și răbdări prăjite în loc de ouă; că bine și-a făcut râs de găină și-a ucis-o fără să-i fie vinovată cu nemica, sărmana! Moșneagul însă era foarte bogat; el și-a făcut case mari și grădini frumoase și trăia foarte bine; pe babă, de milă, a pus-o găinăriță, iară pe cucoș îl purta în toate părțile după dânsul, cu salbă de aur la gât și încălțat cu ciuboțele galbene și cu pinteni la călcâie, de ți se părea că-i un irod de cei frumoși, iară nu cucoș de făcut cu borș.',
    ],
  },
]