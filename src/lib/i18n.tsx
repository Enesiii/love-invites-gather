import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "sq", label: "Shqip", short: "SQ" },
  { code: "sr", label: "Srpski", short: "SR" },
  { code: "tr", label: "Türkçe", short: "TR" },
  { code: "en", label: "English", short: "EN" },
] as const;
export type Lang = (typeof LANGUAGES)[number]["code"];

type StyleText = { category: string; description: string };
export type Dict = {
  location: { heading: string; open: string };
  nav: { collection: string; how: string; pricing: string; faq: string; create: string; open: string; close: string; main: string; mobile: string; language: string; skip: string };
  hero: { eyebrow: string; title: string; line: string; lineEm: string; desc: string; cta: string; see: string; note: string; alt: string; invite: string; date: string };
  promise: [string, string, string, string];
  collection: { eyebrow: string; title: string; em: string; desc: string; bottom: string; find: string; demo: string; details: string; aria: string; alt: string; styles: Record<string, StyleText> };
  how: { eyebrow: string; title: string; em: string; desc: string; steps: [string, string][] };
  compare: { eyebrow: string; title: string; em: string; desc: string; listTitle: string; items: string[]; cta: string };
  premium: { eyebrow: string; title: string; em: string; desc: string; per: string };
  pricing: { premiumName: string; premiumFeatures: string[]; eyebrow: string; title: string; em: string; desc: string; from: string; name: string; per: string; features: string[]; active: string; note: string; cta: string; ask: string };
  faq: { eyebrow: string; title: string; em: string; desc: string; items: [string, string][] };
  final: { title: string; em: string; desc: string; cta: string };
  footer: { tagline: string; top: string };
  whatsapp: { label: string; aria: string; blocked: string };
};

const sq: Dict = {
  location: { heading: "Vendi", open: "Hap vendndodhjen në Google Maps" },
  nav: { collection: "Koleksioni", how: "Si funksionon", pricing: "Çmimet", faq: "Pyetje të shpeshta", create: "Krijo ftesën", open: "Hap menynë", close: "Mbyll menynë", main: "Navigimi kryesor", mobile: "Navigimi në telefon", language: "Gjuha", skip: "Kalo te përmbajtja" },
  hero: { eyebrow: "PËR MOMENTET QË MBETEN", title: "Ftesa Dasme", line: "Dixhitale.", lineEm: "Me dashuri.", desc: "Dita juaj meriton një fillim të bukur. Ftoni njerëzit tuaj me një ftesë elegante, personale dhe të lehtë për t’u ndarë.", cta: "Krijo ftesën tënde", see: "Shiko një ftesë", note: "Një lidhje. Një kujtim. Të gjithë pranë.", alt: "Zarf elegant me vulë zemre dhe ftesë të bardhë", invite: "ME GËZIM JU FTOJMË", date: "19 QERSHOR 2027 · PRISHTINË" },
  promise: ["Zarf që hapet me dashuri", "Përgjigjet në një vend", "Muzikë për momentin", "E bukur në çdo telefon"],
  collection: {
    eyebrow: "KOLEKSIONI I FTESAVE", title: "Një stil për", em: "historinë tuaj.", desc: "Detaje të menduara me kujdes. Elegancë që ndihet që në hapjen e zarfit.", bottom: "Çdo histori dashurie është e veçantë. Edhe ftesa juaj.", find: "Gjeni stilin tuaj", demo: "Hap demon interaktive", details: "Zarf, muzikë, numërim mbrapsht dhe RSVP", aria: "Hap demon e ftesës", alt: "Ftesë dasme me zarf dhe vulë zemre",
    styles: {
      rose: { category: "ROMANTIKE", description: "Tonet e buta dhe detajet botanike për një ditë plot dashuri." },
      sage: { category: "NATYRALE", description: "Gjelbërim i qetë, elegancë e natyrshme dhe një prekje e artë." },
      night: { category: "KLASIKE", description: "Tonet e natës dhe detajet e arta për një festë të paharrueshme." },
      gold: { category: "LUKSUZE", description: "E zezë e thellë me ar të gdhendur, për një mbrëmje madhështore." },
      ivory: { category: "MINIMALE", description: "Letër krem me vizatim të hollë bojëshire, elegancë e qetë." },
      blush: { category: "ROMANTIKE", description: "Nuanca rozë dhe livando si akvarel, plot ëmbëlsi dhe lule." },
      arch: { category: "MODEL I RI", description: "Hark me lule akvarel, emra me shkrim dore dhe data në rresht." },
      "lux-gold": { category: "PREMIUM", description: "Fildish e shampanjë me korniza të arta dhe fotoja juaj në qendër." },
      "floral": { category: "PREMIUM", description: "Krem, rozë e butë dhe sherbelë, me lule rreth fotos suaj." },
      "minimal": { category: "PREMIUM", description: "Foto në gjithë gjerësinë, tipografi moderne, pamje editoriale." },
      "royal": { category: "PREMIUM", description: "Smerald, fildish dhe ar, me portretin tuaj në kornizë." },
    },
  },
  how: { eyebrow: "NGA IDEJA TE FTESA", title: "Pak hapa.", em: "Shumë emocion.", desc: "Më pak organizim, më shumë kohë për ditën tuaj.", steps: [["Zgjidhni stilin", "Një prekje romantike, natyrale apo klasike. Gjeni ftesën që ju përfaqëson."], ["Shtoni detajet", "Emrat tuaj, data, salla dhe një mesazh i veçantë për mysafirët."], ["Ndani dashurinë", "Dërgojeni lidhjen në WhatsApp, Viber ose kudo që janë njerëzit tuaj."], ["Merrni përgjigjet", "Të gjitha konfirmimet dhe numri i të ftuarve, në një vend."]] },
  compare: { eyebrow: "TRADITA TAKON TË SOTMEN", title: "E njëjta ndjenjë.", em: "Një mënyrë e re.", desc: "Bukuria e një ftese tradicionale, me lehtësinë e një lidhjeje dixhitale. Nga Prishtina te familja larg, dashuria arrin menjëherë.", listTitle: "E menduar për ju", items: ["Pa printim, pa pritje për dërgim", "Një lidhje që ndahet menjëherë", "Konfirmime pa telefonata të panumërta", "Drejtimet për në sallë me Google Maps"], cta: "Krijo ftesën tënde" },
  premium: { eyebrow: "KOLEKSIONI PREMIUM", title: "Ftesa me", em: "fotot tuaja.", desc: "Katër dizajne luksoze ku fotoja juaj e çiftit është në qendër të ftesës.", per: "për ftesë" },
  pricing: { premiumName: "Paketa Premium", premiumFeatures: ["Një nga katër dizajnet Premium", "Fotoja juaj e çiftit me prerje dhe pozicionim", "Galeri me fotot që zgjidhni ju", "Zarf, muzikë, numërim mbrapsht dhe RSVP", "Google Maps dhe panel për mysafirët"], eyebrow: "ÇMIMET", title: "E thjeshtë dhe", em: "e qartë.", desc: "Një paketë e plotë për ftesën tuaj, pa kosto të fshehura.", from: "Nga", name: "Paketa Klasike", per: "për një ftesë", features: ["Një nga shtatë dizajnet elegante", "Zarf me animacion hapjeje dhe muzikë", "Numërim mbrapsht deri te dasma", "Google Maps për sallën", "RSVP online dhe panel për mysafirët", "Ngarkim fotosh nga mysafirët", "Shkarkim i ftesës në PDF"], active: "Ftesa mbetet aktive deri {days} ditë pas datës së dasmës.", note: "Pagesa online nuk është ende aktive. Për porosi, na shkruani dhe ju konfirmojmë detajet.", cta: "Krijo ftesën", ask: "Pyesni në WhatsApp" },
  faq: { eyebrow: "ME KËNAQËSI JU PËRGJIGJEMI", title: "Pyetje të", em: "shpeshta.", desc: "Pak qartësi përpara një fillimi të bukur.", items: [["A duhet aplikacion për ta hapur ftesën?", "Jo. Ftesa hapet drejtpërdrejt në shfletuesin e telefonit ose kompjuterit, pa shkarkuar asgjë."], ["A mund ta shoh ftesën para se ta krijoj?", "Po. Hapni demon e çdo stili për të provuar zarfin, muzikën dhe pamjen e ftesës."], ["Si i marr përgjigjet e mysafirëve?", "Mysafirët plotësojnë formularin në ftesë. Ju i shihni përgjigjet në lidhjen private të menaxhimit."], ["A mund ta dërgoj edhe jashtë Kosovës?", "Po. Lidhja mund të ndahet me familjen dhe miqtë kudo që ndodhen."], ["A fillon muzika automatikisht?", "Jo. Mysafirët mund ta luajnë ose ta ndalojnë vetë muzikën."], ["A më duhet një llogari?", "Jo. Pas krijimit merrni një lidhje private. Me llogari mund t’i ruani ftesat që të mos i humbni."]] },
  final: { title: "Le të fillojë me", em: "një ftesë.", desc: "Një ditë e juaja. Një kujtim për të gjithë.", cta: "Krijo ftesën tënde" },
  footer: { tagline: "Me dashuri, në Kosovë.", top: "Në fillim" },
  whatsapp: { label: "Na shkruani", aria: "Na shkruani në WhatsApp", blocked: "Shfletuesi bllokoi hapjen e WhatsApp. Linku u kopjua — hapeni në shfletues." },
};

const sr: Dict = {
  location: { heading: "Lokacija", open: "Otvori lokaciju u Google Maps" },
  nav: { collection: "Kolekcija", how: "Kako funkcioniše", pricing: "Cene", faq: "Česta pitanja", create: "Napravi pozivnicu", open: "Otvori meni", close: "Zatvori meni", main: "Glavna navigacija", mobile: "Navigacija na telefonu", language: "Jezik", skip: "Pređi na sadržaj" },
  hero: { eyebrow: "ZA TRENUTKE KOJI OSTAJU", title: "Pozivnice za venčanje", line: "Digitalne.", lineEm: "Sa ljubavlju.", desc: "Vaš dan zaslužuje lep početak. Pozovite svoje drage elegantnom, ličnom pozivnicom koju je lako podeliti.", cta: "Napravi svoju pozivnicu", see: "Pogledaj pozivnicu", note: "Jedan link. Jedna uspomena. Svi zajedno.", alt: "Elegantna koverta sa pečatom u obliku srca i belom pozivnicom", invite: "SA RADOŠĆU VAS POZIVAMO", date: "19. JUN 2027 · PRIŠTINA" },
  promise: ["Koverta koja se otvara s ljubavlju", "Odgovori na jednom mestu", "Muzika za trenutak", "Lepa na svakom telefonu"],
  collection: {
    eyebrow: "KOLEKCIJA POZIVNICA", title: "Stil za", em: "vašu priču.", desc: "Pažljivo osmišljeni detalji. Elegancija od samog otvaranja koverte.", bottom: "Svaka ljubavna priča je posebna. I vaša pozivnica.", find: "Pronađite svoj stil", demo: "Otvori interaktivni demo", details: "Koverta, muzika, odbrojavanje i RSVP", aria: "Otvori demo pozivnice", alt: "Pozivnica za venčanje sa kovertom i pečatom srca",
    styles: {
      rose: { category: "ROMANTIČNA", description: "Nežni tonovi i botanički detalji za dan pun ljubavi." },
      sage: { category: "PRIRODNA", description: "Mirno zelenilo, prirodna elegancija i zlatni dodir." },
      night: { category: "KLASIČNA", description: "Noćni tonovi i zlatni detalji za nezaboravno slavlje." },
      gold: { category: "LUKSUZNA", description: "Duboka crna sa graviranim zlatom za veličanstveno veče." },
      ivory: { category: "MINIMALNA", description: "Krem papir sa tankim crtežom, tiha elegancija." },
      blush: { category: "ROMANTIČNA", description: "Roze i lavanda nijanse poput akvarela, pune cveća." },
      arch: { category: "NOVI MODEL", description: "Luk od akvarel cveća, rukom pisana imena i datum u nizu." },
      "lux-gold": { category: "PREMIUM", description: "Slonovača i šampanj sa zlatnim okvirima i vašom fotografijom u središtu." },
      "floral": { category: "PREMIUM", description: "Krem, nežno roze i žalfija, sa cvećem oko vaše fotografije." },
      "minimal": { category: "PREMIUM", description: "Fotografija preko cele širine, moderna tipografija, editorijalni izgled." },
      "royal": { category: "PREMIUM", description: "Smaragd, slonovača i zlato, sa vašim portretom u okviru." },
    },
  },
  how: { eyebrow: "OD IDEJE DO POZIVNICE", title: "Nekoliko koraka.", em: "Mnogo emocija.", desc: "Manje organizacije, više vremena za vaš dan.", steps: [["Izaberite stil", "Romantičan, prirodan ili klasičan dodir. Pronađite pozivnicu koja vas predstavlja."], ["Dodajte detalje", "Vaša imena, datum, sala i posebna poruka za goste."], ["Podelite ljubav", "Pošaljite link preko WhatsApp-a, Vibera ili bilo gde."], ["Primite odgovore", "Sve potvrde i broj gostiju na jednom mestu."]] },
  compare: { eyebrow: "TRADICIJA SUSREĆE SADAŠNJOST", title: "Isti osećaj.", em: "Novi način.", desc: "Lepota tradicionalne pozivnice uz lakoću digitalnog linka. Od Prištine do porodice daleko, ljubav stiže odmah.", listTitle: "Osmišljeno za vas", items: ["Bez štampe i čekanja na dostavu", "Link koji se deli odmah", "Potvrde bez bezbroj poziva", "Put do sale preko Google Maps"], cta: "Napravi svoju pozivnicu" },
  premium: { eyebrow: "PREMIUM KOLEKCIJA", title: "Pozivnice sa", em: "vašim fotografijama.", desc: "Četiri luksuzna dizajna u kojima je vaša zajednička fotografija u središtu.", per: "po pozivnici" },
  pricing: { premiumName: "Premium paket", premiumFeatures: ["Jedan od četiri Premium dizajna", "Vaša fotografija sa isecanjem i pozicioniranjem", "Galerija fotografija koje vi izaberete", "Koverta, muzika, odbrojavanje i RSVP", "Google Maps i panel za goste"], eyebrow: "CENE", title: "Jednostavno i", em: "jasno.", desc: "Kompletan paket za vašu pozivnicu, bez skrivenih troškova.", from: "Od", name: "Klasični paket", per: "po pozivnici", features: ["Jedan od sedam elegantnih dizajna", "Animirana koverta i muzika", "Odbrojavanje do venčanja", "Google Maps za salu", "Online RSVP i panel za goste", "Otpremanje fotografija od gostiju", "Preuzimanje pozivnice u PDF-u"], active: "Pozivnica ostaje aktivna do {days} dana nakon datuma venčanja.", note: "Online plaćanje još nije aktivno. Za porudžbinu nam pišite i potvrdićemo detalje.", cta: "Napravi pozivnicu", ask: "Pitajte na WhatsApp-u" },
  faq: { eyebrow: "RADO ODGOVARAMO", title: "Česta", em: "pitanja.", desc: "Malo jasnoće pre lepog početka.", items: [["Da li je potrebna aplikacija?", "Ne. Pozivnica se otvara direktno u pregledaču telefona ili računara."], ["Mogu li da vidim pozivnicu pre pravljenja?", "Da. Otvorite demo bilo kog stila da isprobate kovertu, muziku i izgled."], ["Kako dobijam odgovore gostiju?", "Gosti popunjavaju formular u pozivnici, a vi ih vidite na privatnom linku za upravljanje."], ["Mogu li da je pošaljem van Kosova?", "Da. Link možete podeliti sa porodicom i prijateljima bilo gde."], ["Da li muzika počinje automatski?", "Ne. Gosti sami puštaju ili zaustavljaju muziku."], ["Da li mi treba nalog?", "Ne. Posle pravljenja dobijate privatni link. Sa nalogom čuvate pozivnice da ih ne izgubite."]] },
  final: { title: "Neka počne", em: "pozivnicom.", desc: "Vaš dan. Uspomena za sve.", cta: "Napravi svoju pozivnicu" },
  footer: { tagline: "Sa ljubavlju, sa Kosova.", top: "Na vrh" },
  whatsapp: { label: "Pišite nam", aria: "Pišite nam na WhatsApp", blocked: "Pregledač je blokirao WhatsApp. Link je kopiran — otvorite ga u pregledaču." },
};

const tr: Dict = {
  location: { heading: "Mekân", open: "Konumu Google Maps'te aç" },
  nav: { collection: "Koleksiyon", how: "Nasıl çalışır", pricing: "Fiyatlar", faq: "Sık sorulanlar", create: "Davetiye oluştur", open: "Menüyü aç", close: "Menüyü kapat", main: "Ana menü", mobile: "Mobil menü", language: "Dil", skip: "İçeriğe geç" },
  hero: { eyebrow: "KALICI ANLAR İÇİN", title: "Düğün Davetiyesi", line: "Dijital.", lineEm: "Sevgiyle.", desc: "Gününüz güzel bir başlangıcı hak ediyor. Sevdiklerinizi zarif, kişisel ve kolay paylaşılan bir davetiyeyle davet edin.", cta: "Davetiyeni oluştur", see: "Bir davetiye gör", note: "Tek bağlantı. Tek anı. Herkes yanınızda.", alt: "Kalp mühürlü zarif zarf ve beyaz davetiye", invite: "SİZİ SEVİNÇLE DAVET EDİYORUZ", date: "19 HAZİRAN 2027 · PRİŞTİNE" },
  promise: ["Sevgiyle açılan zarf", "Yanıtlar tek yerde", "Ana özel müzik", "Her telefonda şık"],
  collection: {
    eyebrow: "DAVETİYE KOLEKSİYONU", title: "Hikâyeniz için", em: "bir stil.", desc: "Özenle düşünülmüş detaylar. Zarf açılır açılmaz hissedilen zarafet.", bottom: "Her aşk hikâyesi özeldir. Davetiyeniz de.", find: "Stilinizi bulun", demo: "Etkileşimli demoyu aç", details: "Zarf, müzik, geri sayım ve LCV", aria: "Davetiye demosunu aç", alt: "Zarflı ve kalp mühürlü düğün davetiyesi",
    styles: {
      rose: { category: "ROMANTİK", description: "Sevgi dolu bir gün için yumuşak tonlar ve botanik detaylar." },
      sage: { category: "DOĞAL", description: "Sakin yeşillik, doğal zarafet ve altın dokunuş." },
      night: { category: "KLASİK", description: "Unutulmaz bir kutlama için gece tonları ve altın detaylar." },
      gold: { category: "LÜKS", description: "Görkemli bir akşam için derin siyah ve işlenmiş altın." },
      ivory: { category: "MİNİMAL", description: "İnce çizimli krem kâğıt, sakin bir zarafet." },
      blush: { category: "ROMANTİK", description: "Suluboya pembe ve lavanta tonları, çiçeklerle dolu." },
      arch: { category: "YENİ MODEL", description: "Suluboya çiçek kemeri, el yazısı isimler ve tek satır tarih." },
      "lux-gold": { category: "PREMIUM", description: "Altın çerçeveli fildişi ve şampanya, merkezde sizin fotoğrafınız." },
      "floral": { category: "PREMIUM", description: "Krem, açık pembe ve adaçayı yeşili, fotoğrafınızın çevresinde çiçekler." },
      "minimal": { category: "PREMIUM", description: "Tam genişlikte fotoğraf, modern tipografi, editoryal görünüm." },
      "royal": { category: "PREMIUM", description: "Zümrüt, fildişi ve altın; çerçeve içinde portreniz." },
    },
  },
  how: { eyebrow: "FİKİRDEN DAVETİYEYE", title: "Birkaç adım.", em: "Çok duygu.", desc: "Daha az organizasyon, gününüz için daha çok zaman.", steps: [["Stili seçin", "Romantik, doğal ya da klasik. Sizi yansıtan davetiyeyi bulun."], ["Detayları ekleyin", "İsimleriniz, tarih, salon ve misafirlere özel bir mesaj."], ["Sevgiyi paylaşın", "Bağlantıyı WhatsApp, Viber veya her yerden gönderin."], ["Yanıtları alın", "Tüm onaylar ve misafir sayısı tek yerde."]] },
  compare: { eyebrow: "GELENEK BUGÜNLE BULUŞUYOR", title: "Aynı duygu.", em: "Yeni bir yol.", desc: "Geleneksel davetiyenin güzelliği, dijital bağlantının kolaylığıyla. Priştine'den uzaktaki aileye, sevgi anında ulaşır.", listTitle: "Sizin için tasarlandı", items: ["Baskı yok, gönderim beklemesi yok", "Anında paylaşılan bir bağlantı", "Sayısız telefon olmadan onaylar", "Google Maps ile salona yol tarifi"], cta: "Davetiyeni oluştur" },
  premium: { eyebrow: "PREMIUM KOLEKSİYON", title: "Fotoğraflarınızla", em: "davetiyeler.", desc: "Çift fotoğrafınızın merkezde olduğu dört lüks tasarım.", per: "davetiye başına" },
  pricing: { premiumName: "Premium Paket", premiumFeatures: ["Dört Premium tasarımdan biri", "Kırpma ve konumlandırmalı çift fotoğrafınız", "Seçtiğiniz fotoğraflarla galeri", "Zarf, müzik, geri sayım ve LCV", "Google Maps ve misafir paneli"], eyebrow: "FİYATLAR", title: "Basit ve", em: "net.", desc: "Davetiyeniz için eksiksiz paket, gizli ücret yok.", from: "Başlangıç", name: "Klasik Paket", per: "davetiye başına", features: ["Yedi zarif tasarımdan biri", "Animasyonlu zarf ve müzik", "Düğüne geri sayım", "Salon için Google Maps", "Online LCV ve misafir paneli", "Misafirlerden fotoğraf yükleme", "Davetiyeyi PDF indirme"], active: "Davetiye, düğün tarihinden sonra {days} güne kadar aktif kalır.", note: "Online ödeme henüz aktif değil. Sipariş için bize yazın, detayları onaylayalım.", cta: "Davetiye oluştur", ask: "WhatsApp'tan sorun" },
  faq: { eyebrow: "MEMNUNİYETLE YANITLIYORUZ", title: "Sık sorulan", em: "sorular.", desc: "Güzel bir başlangıç öncesi biraz netlik.", items: [["Davetiyeyi açmak için uygulama gerekir mi?", "Hayır. Davetiye telefon veya bilgisayar tarayıcısında doğrudan açılır."], ["Oluşturmadan önce görebilir miyim?", "Evet. Zarfı, müziği ve görünümü denemek için her stilin demosunu açın."], ["Misafir yanıtlarını nasıl alırım?", "Misafirler davetiyedeki formu doldurur; siz yanıtları özel yönetim bağlantısında görürsünüz."], ["Kosova dışına gönderebilir miyim?", "Evet. Bağlantı her yerdeki aile ve arkadaşlarla paylaşılabilir."], ["Müzik otomatik başlar mı?", "Hayır. Misafirler müziği kendileri açıp kapatır."], ["Hesap gerekir mi?", "Hayır. Oluşturduktan sonra özel bir bağlantı alırsınız. Hesapla davetiyelerinizi kaybetmezsiniz."]] },
  final: { title: "Bir davetiyeyle", em: "başlasın.", desc: "Sizin gününüz. Herkes için bir anı.", cta: "Davetiyeni oluştur" },
  footer: { tagline: "Sevgiyle, Kosova'dan.", top: "Başa dön" },
  whatsapp: { label: "Bize yazın", aria: "WhatsApp'tan bize yazın", blocked: "Tarayıcı WhatsApp'ı engelledi. Bağlantı kopyalandı — tarayıcıda açın." },
};

const en: Dict = {
  location: { heading: "Location", open: "Open location in Google Maps" },
  nav: { collection: "Collection", how: "How it works", pricing: "Pricing", faq: "FAQ", create: "Create invitation", open: "Open menu", close: "Close menu", main: "Main navigation", mobile: "Mobile navigation", language: "Language", skip: "Skip to content" },
  hero: { eyebrow: "FOR MOMENTS THAT STAY", title: "Wedding Invitations", line: "Digital.", lineEm: "With love.", desc: "Your day deserves a beautiful beginning. Invite your loved ones with an elegant, personal invitation that is easy to share.", cta: "Create your invitation", see: "See an invitation", note: "One link. One memory. Everyone close.", alt: "Elegant envelope with a heart seal and a white invitation", invite: "WITH JOY WE INVITE YOU", date: "19 JUNE 2027 · PRISHTINA" },
  promise: ["An envelope that opens with love", "All replies in one place", "Music for the moment", "Beautiful on every phone"],
  collection: {
    eyebrow: "INVITATION COLLECTION", title: "A style for", em: "your story.", desc: "Thoughtful details. Elegance you feel from the moment the envelope opens.", bottom: "Every love story is unique. So is your invitation.", find: "Find your style", demo: "Open interactive demo", details: "Envelope, music, countdown and RSVP", aria: "Open invitation demo", alt: "Wedding invitation with envelope and heart seal",
    styles: {
      rose: { category: "ROMANTIC", description: "Soft tones and botanical details for a day full of love." },
      sage: { category: "NATURAL", description: "Calm greenery, natural elegance and a touch of gold." },
      night: { category: "CLASSIC", description: "Night tones and gold details for an unforgettable celebration." },
      gold: { category: "LUXURY", description: "Deep black with engraved gold for a grand evening." },
      ivory: { category: "MINIMAL", description: "Cream paper with a fine ink drawing, quiet elegance." },
      blush: { category: "ROMANTIC", description: "Watercolour pink and lavender, full of sweetness and flowers." },
      arch: { category: "NEW DESIGN", description: "A watercolour floral arch, handwritten names and a one-line date." },
      "lux-gold": { category: "PREMIUM", description: "Ivory and champagne with gold frames and your photo at the centre." },
      "floral": { category: "PREMIUM", description: "Cream, soft blush and sage, with flowers around your photo." },
      "minimal": { category: "PREMIUM", description: "A full-width photo, modern typography and an editorial look." },
      "royal": { category: "PREMIUM", description: "Emerald, ivory and gold, with your portrait in a refined frame." },
    },
  },
  how: { eyebrow: "FROM IDEA TO INVITATION", title: "A few steps.", em: "So much emotion.", desc: "Less planning, more time for your day.", steps: [["Choose a style", "Romantic, natural or classic. Find the invitation that feels like you."], ["Add the details", "Your names, date, venue and a special message for guests."], ["Share the love", "Send the link on WhatsApp, Viber or anywhere your people are."], ["Get the replies", "Every confirmation and the guest count, in one place."]] },
  compare: { eyebrow: "TRADITION MEETS TODAY", title: "The same feeling.", em: "A new way.", desc: "The beauty of a traditional invitation with the ease of a digital link. From Prishtina to family far away, love arrives instantly.", listTitle: "Designed for you", items: ["No printing, no waiting for delivery", "A link shared instantly", "Confirmations without endless calls", "Directions to the venue with Google Maps"], cta: "Create your invitation" },
  premium: { eyebrow: "PREMIUM COLLECTION", title: "Invitations with", em: "your photos.", desc: "Four luxury designs with your couple photo at the heart of the invitation.", per: "per invitation" },
  pricing: { premiumName: "Premium Package", premiumFeatures: ["One of four Premium designs", "Your couple photo with crop and positioning", "A gallery of photos you choose", "Envelope, music, countdown and RSVP", "Google Maps and guest dashboard"], eyebrow: "PRICING", title: "Simple and", em: "clear.", desc: "A complete package for your invitation, with no hidden costs.", from: "From", name: "Classic Package", per: "per invitation", features: ["One of seven elegant designs", "Animated envelope and music", "Countdown to the wedding", "Google Maps for the venue", "Online RSVP and guest dashboard", "Photo uploads from guests", "Invitation download as PDF"], active: "Your invitation stays active until {days} days after the wedding date.", note: "Online payment is not active yet. To order, message us and we will confirm the details.", cta: "Create invitation", ask: "Ask on WhatsApp" },
  faq: { eyebrow: "HAPPY TO HELP", title: "Frequently asked", em: "questions.", desc: "A little clarity before a beautiful beginning.", items: [["Do guests need an app?", "No. The invitation opens directly in the phone or computer browser."], ["Can I see the invitation before creating it?", "Yes. Open any style's demo to try the envelope, music and design."], ["How do I get guest replies?", "Guests fill in the form on the invitation; you see replies on your private management link."], ["Can I send it outside Kosovo?", "Yes. The link can be shared with family and friends anywhere."], ["Does the music start automatically?", "No. Guests play or pause the music themselves."], ["Do I need an account?", "No. After creating it you get a private link. With an account your invitations are saved so you never lose them."]] },
  final: { title: "Let it begin with", em: "an invitation.", desc: "Your day. A memory for everyone.", cta: "Create your invitation" },
  footer: { tagline: "With love, from Kosovo.", top: "Back to top" },
  whatsapp: { label: "Message us", aria: "Message us on WhatsApp", blocked: "The browser blocked WhatsApp. The link was copied — open it in your browser." },
};

export const dictionaries: Record<Lang, Dict> = { sq, sr, tr, en };

const KEY = "ftesa-lang";
const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({ lang: "sq", t: sq, setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sq");
  useEffect(() => {
    const saved = window.localStorage.getItem(KEY) as Lang | null;
    if (saved && saved in dictionaries) setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(KEY, l);
  };
  return <Ctx.Provider value={{ lang, t: dictionaries[lang], setLang }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
