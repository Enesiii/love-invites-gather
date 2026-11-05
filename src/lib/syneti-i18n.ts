// Tekstet e kategorisë Syneti në katër gjuhë. Përdor gjuhën e zgjedhur te useI18n().
import { useI18n, type Lang } from "@/lib/i18n";
import type { SynetiThemeId } from "@/lib/themes";

type Pair = [string, string];
export type SynetiDict = {
  home: { synetiTitle: string; synetiDesc: string; synetiCta: string; badge: string };
  landing: {
    eyebrow: string; title: string; titleEm: string; desc: string; create: string; see: string; note: string;
    galleryEyebrow: string; galleryTitle: string; galleryDesc: string; preview: string; use: string; tag: string;
    howEyebrow: string; howTitle: string; steps: Pair[];
    pricingEyebrow: string; pricingTitle: string; pricingDesc: string; per: string; active: string; payment: string; choose: string;
    faqEyebrow: string; faqTitle: string; faq: Pair[];
    finalTitle: string; finalDesc: string; home: string; wedding: string;
  };
  templates: Record<SynetiThemeId, { name: string; desc: string }>;
  packages: { name: string; features: string[] };
  creator: {
    title: string; desc: string; step1: string; step2: string; step3: string;
    boy: string; parents: string; parentsHint: string; date: string; time: string; venue: string; address: string; maps: string; mapsHint: string;
    message: string; messageHint: string; music: string; musicOptions: Record<"celebration" | "romantic" | "waltz" | "none", string>;
    photo: string; photoHint: string; summary: string; template: string; total: string; payNote: string; submit: string; busy: string;
    required: string; mapsInvalid: string; preview: string; previewLabel: string;
  };
  invite: {
    title: (name: string) => string; hostedBy: string; on: string; at: string; open: string; opening: string; dedication: string; invited: string;
    rsvpTitle: string; name: string; yes: string; no: string; count: string; note: string; send: string; sending: string; thanks: string; sorry: string;
    enterName: string; chooseAttend: string; memories: string; memoriesDesc: string; upload: string; footer: string; photoHere: string; countdown: string;
  };
  upload: { eyebrow: string; desc: string; pick: string; busy: string; limits: string; tooLarge: string; tooLong: string; photoLimit: string; videoLimit: string; sent: string; back: string };
};

const sq: SynetiDict = {
  home: { synetiTitle: "Ftesa Syneti", synetiDesc: "Ftesa elegante blu e bardhë për festën e synetit të djalit tuaj.", synetiCta: "Zbulo Synetin", badge: "E RE" },
  landing: {
    eyebrow: "FESTA E SYNETIT", title: "Ftesa Syneti", titleEm: "në blu mbretërore.", desc: "Ftesa dixhitale elegante për ditën e veçantë të djalit tuaj. Zarf që hapet, muzikë, RSVP dhe kujtime nga mysafirët — të gjitha në një lidhje.", create: "Krijo ftesën e Synetit", see: "Shiko dizajnet", note: "Blu mbretërore, argjend, yje dhe detaje festive.",
    galleryEyebrow: "KOLEKSIONI SYNETI", galleryTitle: "Katër dizajne, katër atmosfera.", galleryDesc: "Çdo dizajn ka strukturën, ornamentet, animacionin dhe tipografinë e vet.", preview: "Hap parapamjen", use: "Përdor këtë dizajn", tag: "SYNETI",
    howEyebrow: "SI FUNKSIONON", howTitle: "Gati në pak minuta.", steps: [["Zgjidhni dizajnin", "Blu mbretërore, qielli, minimal ose princi i vogël."], ["Shtoni detajet", "Emri i djalit, data, ora, salla, adresa dhe lokacioni në Google Maps."], ["Shtoni foton (opsionale)", "Një foto e djalit e bën ftesën ende më personale."], ["Paguani dhe ndani", "Pas konfirmimit të pagesës bankare, ndani lidhjen unike me mysafirët."]],
    pricingEyebrow: "ÇMIMI", pricingTitle: "Një çmim i qartë.", pricingDesc: "Pa kosto të fshehura. Pagesa bëhet me transfertë bankare.", per: "për ftesë", active: "Ftesa mbetet aktive deri 30 ditë pas datës së ngjarjes.", payment: "Pagesa online nuk është aktive. Pas krijimit merrni udhëzimet për transfertë bankare.", choose: "Krijo ftesën",
    faqEyebrow: "PYETJE TË SHPESHTA", faqTitle: "Ju përgjigjemi me kënaqësi.", faq: [["Çfarë është ftesa e Synetit?", "Një ftesë dixhitale për festën e synetit, që mysafirët e hapin në telefon pa aplikacion."], ["A mund të shtoj foton e djalit?", "Po, fotoja është opsionale dhe mund të pritet e pozicionohet."], ["Si paguhet?", "Me transfertë bankare. Ftesa aktivizohet pasi administratori ta konfirmojë pagesën."], ["Sa foto e video mund të ngarkojnë mysafirët?", "Deri në 10 foto dhe 2 video (deri 60 sekonda) për çdo ftesë."], ["Sa kohë mbetet aktive ftesa?", "Deri 30 ditë pas datës së ngjarjes."]],
    finalTitle: "Dita e djalit tuaj meriton një ftesë të veçantë.", finalDesc: "Krijojeni sot dhe ndajeni me njerëzit tuaj.", home: "Faqja kryesore", wedding: "Ftesa Jonë",
  },
  templates: {
    "s-royal": { name: "Blu Mbretërore & e Bardhë", desc: "Sfond blu mbretërore, ornamente të bardha dhe argjendi, pamje tradicionale luksoze." },
    "s-sky": { name: "Qielli Luksoz", desc: "Sfond blu i butë, dekorime lulesh të bardha, pamje elegante dhe moderne." },
    "s-minimal": { name: "Minimal Blu Moderne", desc: "Sfond i pastër i bardhë, tipografi blu dhe elemente minimale dekorative." },
    "s-prince": { name: "Princi i Vogël", desc: "Blu mbretërore me kurorë të artë dhe atmosferë festive mbretërore." },
  },
  packages: { name: "Ftesa Syneti", features: ["Zarf me animacion hapjeje", "Muzikë në sfond", "Numërim mbrapsht", "Google Maps", "RSVP online", "Paneli i mysafirëve", "Foto dhe video nga mysafirët", "Fotoja e djalit (opsionale)", "Shtim në kalendar", "Kodi QR", "Link unik", "Shkarkim PDF"] },
  creator: {
    title: "Krijo ftesën e Synetit", desc: "Tre hapa: dizajni, detajet dhe përmbledhja.", step1: "1. Zgjidhni dizajnin", step2: "2. Plotësoni detajet", step3: "3. Përmbledhja e porosisë",
    boy: "Emri i djalit", parents: "Emrat e prindërve (opsional)", parentsHint: "P.sh. Familja Berisha", date: "Data e ngjarjes", time: "Ora e fillimit", venue: "Emri i sallës", address: "Adresa e sallës", maps: "Lokacioni në Google Maps", mapsHint: "Ngjitni linkun nga Google Maps (Share → Copy link).",
    message: "Mesazhi i mirëseardhjes", messageHint: "Mund ta ndryshoni sipas dëshirës.", music: "Muzika në sfond", musicOptions: { celebration: "Melodi festive", romantic: "Romantike", waltz: "Vals i qetë", none: "Pa muzikë" },
    photo: "Fotoja e djalit (opsionale)", photoHint: "Mund ta prisni dhe poziciononi foton.", summary: "Përmbledhja", template: "Dizajni", total: "Totali", payNote: "Pas ruajtjes do të shihni udhëzimet për pagesë me transfertë bankare. Ftesa aktivizohet pasi pagesa të konfirmohet.", submit: "Ruaj dhe vazhdo te pagesa", busy: "Duke ruajtur…",
    required: "Plotësoni emrin, datën, orën, sallën, adresën dhe lokacionin.", mapsInvalid: "Ngjitni një link të vlefshëm nga Google Maps.", preview: "Pamje paraprake", previewLabel: "Shembull",
  },
  invite: {
    title: (name) => `Mirë se vini në festën e Synetisë së ${name}`, hostedBy: "Ju ftojnë me gëzim", on: "Data", at: "Ora", open: "Hap ftesën", opening: "Duke hapur…", dedication: "Me dashuri, për ju", invited: "Jeni të ftuar",
    rsvpTitle: "A do të jeni me ne?", name: "Emri juaj", yes: "Do të vij", no: "Nuk mund të vij", count: "Sa persona (përfshirë ju)?", note: "Mesazh (opsional)", send: "Dërgo përgjigjen", sending: "Duke dërguar…", thanks: "Faleminderit! Ju presim me shumë gëzim.", sorry: "Faleminderit që na njoftuat.",
    enterName: "Shkruani emrin tuaj.", chooseAttend: "Zgjidhni nëse do të vini.", memories: "Ndani kujtimet", memoriesDesc: "Dërgoni foto ose video nga festa e synetit.", upload: "Ngarko foto ose video", footer: "Ftesa u krijua me dashuri nga Ftesa Jone.", photoHere: "Fotoja e djalit këtu", countdown: "Deri në festë",
  },
  upload: { eyebrow: "Albumi i Synetit", desc: "Dërgoni fotot dhe videot tuaja — vetëm nikoqiri i sheh.", pick: "Zgjidh foto ose video", busy: "Duke dërguar…", limits: "Deri 10 foto dhe 2 video (maks. 60 sekonda) për ftesë · 6 MB secili", tooLarge: "është më i madh se 6 MB.", tooLong: "Videoja duhet të jetë deri 60 sekonda.", photoLimit: "U arrit kufiri prej 10 fotosh.", videoLimit: "U arrit kufiri prej 2 videosh.", sent: "Faleminderit! U dërguan:", back: "Kthehu te ftesa" },
};

const sr: SynetiDict = {
  home: { synetiTitle: "Pozivnice za sunet", synetiDesc: "Elegantne plavo-bele pozivnice za sunet vašeg sina.", synetiCta: "Otkrij sunet", badge: "NOVO" },
  landing: {
    eyebrow: "PROSLAVA SUNETA", title: "Pozivnice za sunet", titleEm: "u kraljevskoj plavoj.", desc: "Elegantne digitalne pozivnice za poseban dan vašeg sina. Koverta koja se otvara, muzika, RSVP i uspomene gostiju — sve u jednom linku.", create: "Napravi pozivnicu za sunet", see: "Pogledaj dizajne", note: "Kraljevska plava, srebro, zvezde i svečani detalji.",
    galleryEyebrow: "KOLEKCIJA SUNET", galleryTitle: "Četiri dizajna, četiri atmosfere.", galleryDesc: "Svaki dizajn ima svoj raspored, ornamente, animaciju i tipografiju.", preview: "Otvori pregled", use: "Koristi ovaj dizajn", tag: "SUNET",
    howEyebrow: "KAKO FUNKCIONIŠE", howTitle: "Spremno za nekoliko minuta.", steps: [["Izaberite dizajn", "Kraljevska plava, nebo, minimalni ili mali princ."], ["Dodajte detalje", "Ime dečaka, datum, vreme, sala, adresa i lokacija na Google Maps."], ["Dodajte fotografiju (opciono)", "Fotografija dečaka čini pozivnicu još ličnijom."], ["Platite i podelite", "Nakon potvrde bankovne uplate podelite jedinstveni link sa gostima."]],
    pricingEyebrow: "CENA", pricingTitle: "Jedna jasna cena.", pricingDesc: "Bez skrivenih troškova. Plaćanje bankovnim transferom.", per: "po pozivnici", active: "Pozivnica ostaje aktivna do 30 dana nakon datuma događaja.", payment: "Online plaćanje nije aktivno. Nakon kreiranja dobijate uputstva za bankovni transfer.", choose: "Napravi pozivnicu",
    faqEyebrow: "ČESTA PITANJA", faqTitle: "Rado odgovaramo.", faq: [["Šta je pozivnica za sunet?", "Digitalna pozivnica za proslavu suneta koju gosti otvaraju na telefonu bez aplikacije."], ["Mogu li dodati fotografiju dečaka?", "Da, fotografija je opciona i može se iseći i pozicionirati."], ["Kako se plaća?", "Bankovnim transferom. Pozivnica se aktivira kada administrator potvrdi uplatu."], ["Koliko fotografija i videa gosti mogu poslati?", "Do 10 fotografija i 2 videa (do 60 sekundi) po pozivnici."], ["Koliko dugo je pozivnica aktivna?", "Do 30 dana nakon datuma događaja."]],
    finalTitle: "Dan vašeg sina zaslužuje posebnu pozivnicu.", finalDesc: "Napravite je danas i podelite sa svojima.", home: "Početna", wedding: "Pozivnice za venčanje",
  },
  templates: {
    "s-royal": { name: "Kraljevska plava & bela", desc: "Kraljevsko plava pozadina, beli i srebrni ornamenti, luksuzan tradicionalan izgled." },
    "s-sky": { name: "Luksuzno nebo", desc: "Nežno plava pozadina, bele cvetne dekoracije, elegantan i moderan izgled." },
    "s-minimal": { name: "Moderna minimalna plava", desc: "Čista bela pozadina, plava tipografija i minimalni dekorativni elementi." },
    "s-prince": { name: "Mali princ", desc: "Kraljevska plava sa zlatnom krunom i svečanom kraljevskom atmosferom." },
  },
  packages: { name: "Pozivnica za sunet", features: ["Animirano otvaranje koverte", "Muzika u pozadini", "Odbrojavanje", "Google Maps", "Online RSVP", "Panel za goste", "Fotografije i video od gostiju", "Fotografija dečaka (opciono)", "Dodavanje u kalendar", "QR kod", "Jedinstveni link", "Preuzimanje PDF-a"] },
  creator: {
    title: "Napravi pozivnicu za sunet", desc: "Tri koraka: dizajn, detalji i pregled.", step1: "1. Izaberite dizajn", step2: "2. Popunite detalje", step3: "3. Pregled porudžbine",
    boy: "Ime dečaka", parents: "Imena roditelja (opciono)", parentsHint: "Npr. Porodica Berisha", date: "Datum događaja", time: "Vreme početka", venue: "Naziv sale", address: "Adresa sale", maps: "Lokacija na Google Maps", mapsHint: "Nalepite link iz Google Maps (Share → Copy link).",
    message: "Poruka dobrodošlice", messageHint: "Možete je promeniti po želji.", music: "Muzika u pozadini", musicOptions: { celebration: "Svečana melodija", romantic: "Romantična", waltz: "Tihi valcer", none: "Bez muzike" },
    photo: "Fotografija dečaka (opciono)", photoHint: "Možete je iseći i pozicionirati.", summary: "Pregled", template: "Dizajn", total: "Ukupno", payNote: "Nakon čuvanja videćete uputstva za bankovni transfer. Pozivnica se aktivira nakon potvrde uplate.", submit: "Sačuvaj i nastavi na plaćanje", busy: "Čuvanje…",
    required: "Popunite ime, datum, vreme, salu, adresu i lokaciju.", mapsInvalid: "Nalepite važeći Google Maps link.", preview: "Pregled", previewLabel: "Primer",
  },
  invite: {
    title: (name) => `Dobro došli na sunet ${name}`, hostedBy: "Sa radošću vas pozivaju", on: "Datum", at: "Vreme", open: "Otvori pozivnicu", opening: "Otvaranje…", dedication: "Sa ljubavlju, za vas", invited: "Pozvani ste",
    rsvpTitle: "Da li ćete biti sa nama?", name: "Vaše ime", yes: "Dolazim", no: "Ne mogu doći", count: "Koliko osoba (uključujući vas)?", note: "Poruka (opciono)", send: "Pošalji odgovor", sending: "Slanje…", thanks: "Hvala! Radujemo se vašem dolasku.", sorry: "Hvala što ste nas obavestili.",
    enterName: "Upišite svoje ime.", chooseAttend: "Izaberite da li dolazite.", memories: "Podelite uspomene", memoriesDesc: "Pošaljite fotografije ili video sa proslave suneta.", upload: "Otpremi foto ili video", footer: "Pozivnicu je s ljubavlju napravila Ftesa Jone.", photoHere: "Fotografija dečaka ovde", countdown: "Do proslave",
  },
  upload: { eyebrow: "Album suneta", desc: "Pošaljite svoje fotografije i video — vidi ih samo domaćin.", pick: "Izaberi foto ili video", busy: "Slanje…", limits: "Do 10 fotografija i 2 videa (maks. 60 sekundi) po pozivnici · 6 MB svaki", tooLarge: "je veći od 6 MB.", tooLong: "Video mora biti do 60 sekundi.", photoLimit: "Dostignuto je ograničenje od 10 fotografija.", videoLimit: "Dostignuto je ograničenje od 2 videa.", sent: "Hvala! Poslato:", back: "Nazad na pozivnicu" },
};

const tr: SynetiDict = {
  home: { synetiTitle: "Sünnet Davetiyesi", synetiDesc: "Oğlunuzun sünnet töreni için zarif mavi-beyaz davetiyeler.", synetiCta: "Sünnet'i keşfet", badge: "YENİ" },
  landing: {
    eyebrow: "SÜNNET TÖRENİ", title: "Sünnet Davetiyesi", titleEm: "kraliyet mavisi.", desc: "Oğlunuzun özel günü için zarif dijital davetiyeler. Açılan zarf, müzik, LCV ve misafir anıları — hepsi tek bir bağlantıda.", create: "Sünnet davetiyesi oluştur", see: "Tasarımları gör", note: "Kraliyet mavisi, gümüş, yıldızlar ve şık detaylar.",
    galleryEyebrow: "SÜNNET KOLEKSİYONU", galleryTitle: "Dört tasarım, dört atmosfer.", galleryDesc: "Her tasarımın kendi düzeni, süslemeleri, animasyonu ve tipografisi vardır.", preview: "Önizlemeyi aç", use: "Bu tasarımı kullan", tag: "SÜNNET",
    howEyebrow: "NASIL ÇALIŞIR", howTitle: "Birkaç dakikada hazır.", steps: [["Tasarımı seçin", "Kraliyet mavisi, gökyüzü, minimal veya küçük prens."], ["Ayrıntıları ekleyin", "Çocuğun adı, tarih, saat, salon, adres ve Google Maps konumu."], ["Fotoğraf ekleyin (isteğe bağlı)", "Çocuğun fotoğrafı davetiyeyi daha da kişisel yapar."], ["Ödeyin ve paylaşın", "Banka havalesi onaylandıktan sonra benzersiz bağlantıyı misafirlerle paylaşın."]],
    pricingEyebrow: "FİYAT", pricingTitle: "Tek net fiyat.", pricingDesc: "Gizli ücret yok. Ödeme banka havalesi ile yapılır.", per: "davetiye başına", active: "Davetiye etkinlik tarihinden sonra 30 gün aktif kalır.", payment: "Online ödeme aktif değil. Oluşturduktan sonra banka havalesi talimatlarını alırsınız.", choose: "Davetiye oluştur",
    faqEyebrow: "SIK SORULANLAR", faqTitle: "Memnuniyetle yanıtlıyoruz.", faq: [["Sünnet davetiyesi nedir?", "Misafirlerin uygulama olmadan telefonda açtığı sünnet töreni dijital davetiyesi."], ["Çocuğun fotoğrafını ekleyebilir miyim?", "Evet, fotoğraf isteğe bağlıdır ve kırpılıp konumlandırılabilir."], ["Ödeme nasıl yapılır?", "Banka havalesi ile. Yönetici ödemeyi onayladığında davetiye etkinleşir."], ["Misafirler kaç fotoğraf ve video yükleyebilir?", "Davetiye başına 10 fotoğraf ve 2 video (60 saniyeye kadar)."], ["Davetiye ne kadar aktif kalır?", "Etkinlik tarihinden sonra 30 güne kadar."]],
    finalTitle: "Oğlunuzun günü özel bir davetiyeyi hak ediyor.", finalDesc: "Bugün oluşturun ve sevdiklerinizle paylaşın.", home: "Ana sayfa", wedding: "Düğün Davetiyesi",
  },
  templates: {
    "s-royal": { name: "Kraliyet Mavisi & Beyaz", desc: "Kraliyet mavisi zemin, beyaz ve gümüş süslemeler, lüks geleneksel görünüm." },
    "s-sky": { name: "Lüks Gökyüzü", desc: "Yumuşak mavi zemin, beyaz çiçek süslemeleri, zarif ve modern görünüm." },
    "s-minimal": { name: "Modern Minimal Mavi", desc: "Temiz beyaz zemin, mavi tipografi ve minimal dekoratif öğeler." },
    "s-prince": { name: "Küçük Prens", desc: "Altın taç ve şık kraliyet atmosferiyle kraliyet mavisi." },
  },
  packages: { name: "Sünnet Davetiyesi", features: ["Animasyonlu zarf açılışı", "Arka plan müziği", "Geri sayım", "Google Maps", "Online LCV", "Misafir paneli", "Misafirlerden fotoğraf ve video", "Çocuğun fotoğrafı (isteğe bağlı)", "Takvime ekleme", "QR kod", "Benzersiz bağlantı", "PDF indirme"] },
  creator: {
    title: "Sünnet davetiyesi oluştur", desc: "Üç adım: tasarım, ayrıntılar ve özet.", step1: "1. Tasarımı seçin", step2: "2. Ayrıntıları doldurun", step3: "3. Sipariş özeti",
    boy: "Çocuğun adı", parents: "Ebeveyn adları (isteğe bağlı)", parentsHint: "Örn. Berisha Ailesi", date: "Etkinlik tarihi", time: "Başlangıç saati", venue: "Salon adı", address: "Salon adresi", maps: "Google Maps konumu", mapsHint: "Google Maps bağlantısını yapıştırın (Paylaş → Bağlantıyı kopyala).",
    message: "Hoş geldiniz mesajı", messageHint: "İstediğiniz gibi değiştirebilirsiniz.", music: "Arka plan müziği", musicOptions: { celebration: "Kutlama ezgisi", romantic: "Romantik", waltz: "Sakin vals", none: "Müzik yok" },
    photo: "Çocuğun fotoğrafı (isteğe bağlı)", photoHint: "Kırpıp konumlandırabilirsiniz.", summary: "Özet", template: "Tasarım", total: "Toplam", payNote: "Kaydettikten sonra banka havalesi talimatlarını göreceksiniz. Ödeme onaylanınca davetiye etkinleşir.", submit: "Kaydet ve ödemeye geç", busy: "Kaydediliyor…",
    required: "Ad, tarih, saat, salon, adres ve konumu doldurun.", mapsInvalid: "Geçerli bir Google Maps bağlantısı yapıştırın.", preview: "Önizleme", previewLabel: "Örnek",
  },
  invite: {
    title: (name) => `${name} adına sünnet törenine hoş geldiniz`, hostedBy: "Sevinçle davet ederler", on: "Tarih", at: "Saat", open: "Davetiyeyi aç", opening: "Açılıyor…", dedication: "Sevgiyle, sizin için", invited: "Davetlisiniz",
    rsvpTitle: "Bizimle olacak mısınız?", name: "Adınız", yes: "Geleceğim", no: "Gelemeyeceğim", count: "Kaç kişi (siz dahil)?", note: "Mesaj (isteğe bağlı)", send: "Yanıtı gönder", sending: "Gönderiliyor…", thanks: "Teşekkürler! Sizi sevinçle bekliyoruz.", sorry: "Bildirdiğiniz için teşekkürler.",
    enterName: "Adınızı yazın.", chooseAttend: "Gelip gelmeyeceğinizi seçin.", memories: "Anıları paylaşın", memoriesDesc: "Sünnet töreninden fotoğraf veya video gönderin.", upload: "Fotoğraf veya video yükle", footer: "Davetiye Ftesa Jone ile sevgiyle hazırlandı.", photoHere: "Çocuğun fotoğrafı burada", countdown: "Törene kalan",
  },
  upload: { eyebrow: "Sünnet albümü", desc: "Fotoğraf ve videolarınızı gönderin — yalnızca ev sahibi görür.", pick: "Fotoğraf veya video seç", busy: "Gönderiliyor…", limits: "Davetiye başına 10 fotoğraf ve 2 video (en fazla 60 saniye) · her biri 6 MB", tooLarge: "6 MB'tan büyük.", tooLong: "Video en fazla 60 saniye olmalı.", photoLimit: "10 fotoğraf sınırına ulaşıldı.", videoLimit: "2 video sınırına ulaşıldı.", sent: "Teşekkürler! Gönderilen:", back: "Davetiyeye dön" },
};

const en: SynetiDict = {
  home: { synetiTitle: "Circumcision Invitations", synetiDesc: "Elegant blue and white invitations for your son's circumcision celebration.", synetiCta: "Discover Syneti", badge: "NEW" },
  landing: {
    eyebrow: "CIRCUMCISION CELEBRATION", title: "Syneti Invitations", titleEm: "in royal blue.", desc: "Elegant digital invitations for your son's special day. An opening envelope, music, RSVP and guest memories — all in one link.", create: "Create a Syneti invitation", see: "See the designs", note: "Royal blue, silver, stars and festive details.",
    galleryEyebrow: "SYNETI COLLECTION", galleryTitle: "Four designs, four moods.", galleryDesc: "Each design has its own layout, ornaments, animation and typography.", preview: "Open preview", use: "Use this design", tag: "SYNETI",
    howEyebrow: "HOW IT WORKS", howTitle: "Ready in minutes.", steps: [["Choose a design", "Royal blue, sky, minimal or little prince."], ["Add the details", "Boy's name, date, time, venue, address and Google Maps location."], ["Add a photo (optional)", "A photo of the boy makes the invitation even more personal."], ["Pay and share", "Once the bank transfer is confirmed, share your unique link with guests."]],
    pricingEyebrow: "PRICE", pricingTitle: "One clear price.", pricingDesc: "No hidden costs. Payment is by bank transfer.", per: "per invitation", active: "The invitation stays active until 30 days after the event date.", payment: "Online payment is not active. After creating, you receive bank transfer instructions.", choose: "Create invitation",
    faqEyebrow: "FAQ", faqTitle: "Happy to help.", faq: [["What is a Syneti invitation?", "A digital invitation for the circumcision celebration that guests open on their phone without an app."], ["Can I add a photo of the boy?", "Yes, the photo is optional and can be cropped and positioned."], ["How do I pay?", "By bank transfer. The invitation is activated once the administrator confirms payment."], ["How many photos and videos can guests upload?", "Up to 10 photos and 2 videos (up to 60 seconds) per invitation."], ["How long does the invitation stay active?", "Until 30 days after the event date."]],
    finalTitle: "Your son's day deserves a special invitation.", finalDesc: "Create it today and share it with your loved ones.", home: "Home", wedding: "Wedding Invitations",
  },
  templates: {
    "s-royal": { name: "Royal Blue & White", desc: "Royal blue background, white and silver ornaments, luxurious traditional look." },
    "s-sky": { name: "Luxury Sky Blue", desc: "Soft blue background, white floral decorations, elegant and modern look." },
    "s-minimal": { name: "Modern Minimal Blue", desc: "Clean white background, blue typography and minimal decorative elements." },
    "s-prince": { name: "Little Prince", desc: "Royal blue with a golden crown and a festive royal atmosphere." },
  },
  packages: { name: "Syneti Invitation", features: ["Animated envelope opening", "Background music", "Countdown", "Google Maps", "Online RSVP", "Guest dashboard", "Guest photo and video uploads", "Boy's photo (optional)", "Add to calendar", "QR code", "Unique link", "PDF download"] },
  creator: {
    title: "Create a Syneti invitation", desc: "Three steps: design, details and summary.", step1: "1. Choose a design", step2: "2. Fill in the details", step3: "3. Order summary",
    boy: "Boy's name", parents: "Parents' names (optional)", parentsHint: "E.g. The Berisha family", date: "Event date", time: "Start time", venue: "Venue name", address: "Venue address", maps: "Google Maps location", mapsHint: "Paste the link from Google Maps (Share → Copy link).",
    message: "Welcome message", messageHint: "You can change it as you like.", music: "Background music", musicOptions: { celebration: "Celebration melody", romantic: "Romantic", waltz: "Gentle waltz", none: "No music" },
    photo: "Boy's photo (optional)", photoHint: "You can crop and position it.", summary: "Summary", template: "Design", total: "Total", payNote: "After saving you will see bank transfer instructions. The invitation is activated once payment is confirmed.", submit: "Save and continue to payment", busy: "Saving…",
    required: "Fill in the name, date, time, venue, address and location.", mapsInvalid: "Paste a valid Google Maps link.", preview: "Preview", previewLabel: "Sample",
  },
  invite: {
    title: (name) => `Welcome to the Syneti celebration of ${name}`, hostedBy: "Joyfully invited by", on: "Date", at: "Time", open: "Open invitation", opening: "Opening…", dedication: "With love, for you", invited: "You are invited",
    rsvpTitle: "Will you join us?", name: "Your name", yes: "I'll be there", no: "I can't come", count: "How many people (including you)?", note: "Message (optional)", send: "Send reply", sending: "Sending…", thanks: "Thank you! We look forward to seeing you.", sorry: "Thank you for letting us know.",
    enterName: "Please enter your name.", chooseAttend: "Please choose whether you'll come.", memories: "Share memories", memoriesDesc: "Send photos or videos from the celebration.", upload: "Upload photo or video", footer: "Invitation made with love by Ftesa Jone.", photoHere: "Boy's photo here", countdown: "Until the celebration",
  },
  upload: { eyebrow: "Syneti album", desc: "Send your photos and videos — only the host can see them.", pick: "Choose photo or video", busy: "Sending…", limits: "Up to 10 photos and 2 videos (max 60 seconds) per invitation · 6 MB each", tooLarge: "is larger than 6 MB.", tooLong: "Videos must be 60 seconds or shorter.", photoLimit: "The 10-photo limit has been reached.", videoLimit: "The 2-video limit has been reached.", sent: "Thank you! Sent:", back: "Back to invitation" },
};

export const synetiDictionaries: Record<Lang, SynetiDict> = { sq, sr, tr, en };

export function useSynetiText() {
  const { lang } = useI18n();
  return { lang, s: synetiDictionaries[lang] };
}
