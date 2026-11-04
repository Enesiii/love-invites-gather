// Tekstet e kategorisë Kanagjegji në katër gjuhë. Përdor gjuhën e zgjedhur te useI18n().
import { useI18n, type Lang } from "@/lib/i18n";
import type { KanagjegjiThemeId } from "@/lib/themes";

type Pair = [string, string];
export type KanaDict = {
  home: { eyebrow: string; title: string; desc: string; weddingTitle: string; weddingDesc: string; weddingCta: string; kanaTitle: string; kanaDesc: string; kanaCta: string; badge: string };
  landing: {
    eyebrow: string; title: string; titleEm: string; desc: string; create: string; see: string; note: string;
    galleryEyebrow: string; galleryTitle: string; galleryDesc: string; preview: string; use: string; classicTag: string; premiumTag: string;
    howEyebrow: string; howTitle: string; steps: Pair[];
    pricingEyebrow: string; pricingTitle: string; pricingDesc: string; per: string; recommended: string; active: string; payment: string; choose: string;
    faqEyebrow: string; faqTitle: string; faq: Pair[];
    finalTitle: string; finalDesc: string; home: string; wedding: string;
  };
  templates: Record<KanagjegjiThemeId, { name: string; desc: string }>;
  packages: { classic: string; premium: string; classicFeatures: string[]; premiumIncludes: string; premiumFeatures: string[]; noPhoto: string; withPhoto: string };
  creator: {
    title: string; desc: string; step1: string; step2: string; step3: string; step4: string;
    bride: string; parents: string; parentsHint: string; date: string; time: string; venue: string; address: string; maps: string; mapsHint: string;
    message: string; messageHint: string; music: string; musicOptions: Record<"henna" | "romantic" | "waltz" | "none", string>;
    photo: string; photoHint: string; summary: string; package: string; template: string; total: string; payNote: string; submit: string; busy: string;
    required: string; mapsInvalid: string; preview: string; previewLabel: string;
  };
  invite: {
    title: string; hostedBy: string; on: string; at: string; open: string; opening: string; dedication: string; invited: string;
    rsvpTitle: string; name: string; yes: string; no: string; count: string; note: string; send: string; sending: string; thanks: string; sorry: string;
    enterName: string; chooseAttend: string; memories: string; memoriesDesc: string; upload: string; footer: string; photoHere: string; countdown: string;
  };
  upload: { eyebrow: string; desc: string; pick: string; busy: string; limits: string; tooLarge: string; tooLong: string; photoLimit: string; videoLimit: string; sent: string; back: string };
};

const sq: KanaDict = {
  home: { eyebrow: "ZGJIDHNI KATEGORINË", title: "Çfarë po festoni?", desc: "Dy produkte të veçanta, e njëjta kujdesje për çdo detaj.", weddingTitle: "Ftesa Dasma", weddingDesc: "Ftesa elegante për ditën tuaj të madhe — zarf, muzikë, RSVP dhe galeri.", weddingCta: "Shiko ftesat e dasmës", kanaTitle: "Ftesa Kanagjegji", kanaDesc: "Ftesa luksoze në të kuqe dhe ar për natën e kanagjegjit.", kanaCta: "Zbulo Kanagjegjin", badge: "E RE" },
  landing: {
    eyebrow: "NATA E KANAGJEGJIT", title: "Ftesa Kanagjegji", titleEm: "në të kuqe dhe ar.", desc: "Ftesa dixhitale luksoze për natën më të ngrohtë para dasmës. Zarf që hapet, muzikë, RSVP dhe kujtime nga mysafirët — të gjitha në një lidhje.", create: "Krijo ftesën e Kanagjegjit", see: "Shiko dizajnet", note: "Kadife e kuqe, filigran i artë, tulipanë dhe trëndafila.",
    galleryEyebrow: "KOLEKSIONI KANAGJEGJI", galleryTitle: "Katër dizajne, katër atmosfera.", galleryDesc: "Çdo dizajn ka strukturën, ornamentet, animacionin dhe tipografinë e vet.", preview: "Hap parapamjen", use: "Përdor këtë dizajn", classicTag: "KLASIKE", premiumTag: "PREMIUM · ME FOTO",
    howEyebrow: "SI FUNKSIONON", howTitle: "Gati në pak minuta.", steps: [["Zgjidhni paketën", "Klasike pa foto ose Premium me foton tuaj."], ["Zgjidhni dizajnin", "Tradicional, modern, burgundy ose osman mbretëror."], ["Shtoni detajet", "Emri, data, ora, salla, adresa dhe lokacioni në Google Maps."], ["Paguani dhe ndani", "Pas konfirmimit të pagesës bankare, ndani lidhjen unike me mysafirët."]],
    pricingEyebrow: "ÇMIMET", pricingTitle: "Dy paketa të qarta.", pricingDesc: "Pa kosto të fshehura. Pagesa bëhet me transfertë bankare.", per: "për ftesë", recommended: "Rekomandohet", active: "Ftesa mbetet aktive deri 30 ditë pas datës së ngjarjes.", payment: "Pagesa online nuk është aktive. Pas krijimit merrni udhëzimet për transfertë bankare.", choose: "Zgjidh paketën",
    faqEyebrow: "PYETJE TË SHPESHTA", faqTitle: "Ju përgjigjemi me kënaqësi.", faq: [["Çfarë është ftesa e Kanagjegjit?", "Një ftesë dixhitale për natën e kanagjegjit, që mysafirët e hapin në telefon pa aplikacion."], ["A mund të shtoj foton time?", "Po, me paketën Premium. Fotoja mund të pritet dhe pozicionohet."], ["Si paguhet?", "Me transfertë bankare. Ftesa aktivizohet pasi administratori ta konfirmojë pagesën."], ["Sa foto e video mund të ngarkojnë mysafirët?", "Deri në 10 foto dhe 2 video (deri 60 sekonda) për çdo ftesë."], ["Sa kohë mbetet aktive ftesa?", "Deri 30 ditë pas datës së ngjarjes."]],
    finalTitle: "Nata juaj meriton një ftesë të veçantë.", finalDesc: "Krijojeni sot dhe ndajeni me njerëzit tuaj.", home: "Faqja kryesore", wedding: "Ftesa Jonë",
  },
  templates: {
    "k-traditional": { name: "Tradicionale Kuq & Ar", desc: "Kadife e kuqe, kornizë e artë arabeske dhe tulipanë simetrikë." },
    "k-modern": { name: "Moderne Minimal e Kuqe", desc: "Hapësirë e pastër, vija të holla ari dhe tipografi elegante." },
    "k-burgundy": { name: "Burgundy Luksoze", desc: "Burgundy i thellë, dantellë e butë dhe fotoja juaj në hark." },
    "k-ottoman": { name: "Osmane Mbretërore e Artë", desc: "Medalion i artë, filigran mbretëror dhe portreti juaj në qendër." },
  },
  packages: { classic: "Kanagjegji Klasike", premium: "Kanagjegji Premium", classicFeatures: ["Zarf me animacion hapjeje", "Muzikë në sfond", "Numërim mbrapsht", "Google Maps", "RSVP online", "Paneli i mysafirëve", "Foto dhe video nga mysafirët", "Shtim në kalendar", "Kodi QR", "Link unik", "Shkarkim PDF"], premiumIncludes: "Gjithçka nga Klasike, plus:", premiumFeatures: ["Fotoja juaj personale", "Prerje dhe pozicionim i fotos", "Dy dizajne ekskluzive Premium", "Detaje vizuale më luksoze"], noPhoto: "Pa foto personale", withPhoto: "Me foto personale" },
  creator: {
    title: "Krijo ftesën e Kanagjegjit", desc: "Katër hapa: paketa, dizajni, detajet dhe përmbledhja.", step1: "1. Zgjidhni paketën", step2: "2. Zgjidhni dizajnin", step3: "3. Plotësoni detajet", step4: "4. Përmbledhja e porosisë",
    bride: "Emri i nuses", parents: "Emrat e prindërve (opsional)", parentsHint: "P.sh. Familja Krasniqi", date: "Data e ngjarjes", time: "Ora e fillimit", venue: "Emri i sallës", address: "Adresa e sallës", maps: "Lokacioni në Google Maps", mapsHint: "Ngjitni linkun nga Google Maps (Share → Copy link).",
    message: "Mesazhi i mirëseardhjes", messageHint: "Mund ta ndryshoni sipas dëshirës.", music: "Muzika në sfond", musicOptions: { henna: "Melodi e kanagjegjit", romantic: "Romantike", waltz: "Vals i qetë", none: "Pa muzikë" },
    photo: "Fotoja juaj", photoHint: "Vetëm për paketën Premium. Mund ta prisni dhe poziciononi.", summary: "Përmbledhja", package: "Paketa", template: "Dizajni", total: "Totali", payNote: "Pas ruajtjes do të shihni udhëzimet për pagesë me transfertë bankare. Ftesa aktivizohet pasi pagesa të konfirmohet.", submit: "Ruaj dhe vazhdo te pagesa", busy: "Duke ruajtur…",
    required: "Plotësoni emrin, datën, orën, sallën, adresën dhe lokacionin.", mapsInvalid: "Ngjitni një link të vlefshëm nga Google Maps.", preview: "Pamje paraprake", previewLabel: "Shembull",
  },
  invite: {
    title: "Mirë se vini në Kanagjegjin tim", hostedBy: "Ju ftojnë me gëzim", on: "Data", at: "Ora", open: "Hap ftesën", opening: "Duke hapur…", dedication: "Me dashuri, për ju", invited: "Jeni të ftuar",
    rsvpTitle: "A do të jeni me ne?", name: "Emri juaj", yes: "Do të vij", no: "Nuk mund të vij", count: "Sa persona (përfshirë ju)?", note: "Mesazh (opsional)", send: "Dërgo përgjigjen", sending: "Duke dërguar…", thanks: "Faleminderit! Ju presim me shumë gëzim.", sorry: "Faleminderit që na njoftuat.",
    enterName: "Shkruani emrin tuaj.", chooseAttend: "Zgjidhni nëse do të vini.", memories: "Ndani kujtimet", memoriesDesc: "Dërgoni foto ose video nga nata e kanagjegjit.", upload: "Ngarko foto ose video", footer: "Ftesa u krijua me dashuri nga Ftesa Jone.", photoHere: "Fotoja juaj këtu", countdown: "Deri në kanagjegj",
  },
  upload: { eyebrow: "Albumi i Kanagjegjit", desc: "Dërgoni fotot dhe videot tuaja — vetëm nikoqiri i sheh.", pick: "Zgjidh foto ose video", busy: "Duke dërguar…", limits: "Deri 10 foto dhe 2 video (maks. 60 sekonda) për ftesë · 6 MB secili", tooLarge: "është më i madh se 6 MB.", tooLong: "Videoja duhet të jetë deri 60 sekonda.", photoLimit: "U arrit kufiri prej 10 fotosh.", videoLimit: "U arrit kufiri prej 2 videosh.", sent: "Faleminderit! U dërguan:", back: "Kthehu te ftesa" },
};

const sr: KanaDict = {
  home: { eyebrow: "IZABERITE KATEGORIJU", title: "Šta slavite?", desc: "Dva posebna proizvoda, ista pažnja za svaki detalj.", weddingTitle: "Pozivnice za venčanje", weddingDesc: "Elegantne pozivnice za vaš veliki dan — koverta, muzika, RSVP i galerija.", weddingCta: "Pogledaj pozivnice za venčanje", kanaTitle: "Pozivnice za kanu", kanaDesc: "Luksuzne pozivnice u crvenoj i zlatnoj boji za veče kane.", kanaCta: "Otkrij kanu", badge: "NOVO" },
  landing: {
    eyebrow: "VEČE KANE", title: "Pozivnice za kanu", titleEm: "u crvenoj i zlatnoj.", desc: "Luksuzne digitalne pozivnice za najtopliju noć pred venčanje. Koverta koja se otvara, muzika, RSVP i uspomene gostiju — sve u jednom linku.", create: "Napravi pozivnicu za kanu", see: "Pogledaj dizajne", note: "Crveni somot, zlatni filigran, lale i ruže.",
    galleryEyebrow: "KOLEKCIJA KANA", galleryTitle: "Četiri dizajna, četiri atmosfere.", galleryDesc: "Svaki dizajn ima svoj raspored, ornamente, animaciju i tipografiju.", preview: "Otvori pregled", use: "Koristi ovaj dizajn", classicTag: "KLASIČNI", premiumTag: "PREMIUM · SA FOTOGRAFIJOM",
    howEyebrow: "KAKO FUNKCIONIŠE", howTitle: "Spremno za nekoliko minuta.", steps: [["Izaberite paket", "Klasični bez fotografije ili Premium sa vašom fotografijom."], ["Izaberite dizajn", "Tradicionalni, moderni, burgundy ili otomanski kraljevski."], ["Dodajte detalje", "Ime, datum, vreme, sala, adresa i lokacija na Google Maps."], ["Platite i podelite", "Nakon potvrde bankovne uplate podelite jedinstveni link sa gostima."]],
    pricingEyebrow: "CENE", pricingTitle: "Dva jasna paketa.", pricingDesc: "Bez skrivenih troškova. Plaćanje bankovnim transferom.", per: "po pozivnici", recommended: "Preporučeno", active: "Pozivnica ostaje aktivna do 30 dana nakon datuma događaja.", payment: "Online plaćanje nije aktivno. Nakon kreiranja dobijate uputstva za bankovni transfer.", choose: "Izaberi paket",
    faqEyebrow: "ČESTA PITANJA", faqTitle: "Rado odgovaramo.", faq: [["Šta je pozivnica za kanu?", "Digitalna pozivnica za veče kane koju gosti otvaraju na telefonu bez aplikacije."], ["Mogu li dodati svoju fotografiju?", "Da, uz Premium paket. Fotografiju možete iseći i pozicionirati."], ["Kako se plaća?", "Bankovnim transferom. Pozivnica se aktivira kada administrator potvrdi uplatu."], ["Koliko fotografija i videa gosti mogu poslati?", "Do 10 fotografija i 2 videa (do 60 sekundi) po pozivnici."], ["Koliko dugo je pozivnica aktivna?", "Do 30 dana nakon datuma događaja."]],
    finalTitle: "Vaše veče zaslužuje posebnu pozivnicu.", finalDesc: "Napravite je danas i podelite sa svojima.", home: "Početna", wedding: "Pozivnice za venčanje",
  },
  templates: {
    "k-traditional": { name: "Tradicionalna crveno-zlatna", desc: "Crveni somot, zlatni arabeskni okvir i simetrične lale." },
    "k-modern": { name: "Moderna minimalna crvena", desc: "Čist prostor, tanke zlatne linije i elegantna tipografija." },
    "k-burgundy": { name: "Luksuzni burgundy", desc: "Duboki burgundy, nežna čipka i vaša fotografija u luku." },
    "k-ottoman": { name: "Otomanska kraljevska zlatna", desc: "Zlatni medaljon, kraljevski filigran i vaš portret u centru." },
  },
  packages: { classic: "Kana Klasični", premium: "Kana Premium", classicFeatures: ["Animirano otvaranje koverte", "Muzika u pozadini", "Odbrojavanje", "Google Maps", "Online RSVP", "Panel za goste", "Fotografije i video od gostiju", "Dodavanje u kalendar", "QR kod", "Jedinstveni link", "Preuzimanje PDF-a"], premiumIncludes: "Sve iz Klasičnog, plus:", premiumFeatures: ["Vaša lična fotografija", "Isecanje i pozicioniranje fotografije", "Dva ekskluzivna Premium dizajna", "Luksuzniji vizuelni detalji"], noPhoto: "Bez lične fotografije", withPhoto: "Sa ličnom fotografijom" },
  creator: {
    title: "Napravi pozivnicu za kanu", desc: "Četiri koraka: paket, dizajn, detalji i pregled.", step1: "1. Izaberite paket", step2: "2. Izaberite dizajn", step3: "3. Popunite detalje", step4: "4. Pregled porudžbine",
    bride: "Ime mlade", parents: "Imena roditelja (opciono)", parentsHint: "Npr. Porodica Krasniqi", date: "Datum događaja", time: "Vreme početka", venue: "Naziv sale", address: "Adresa sale", maps: "Lokacija na Google Maps", mapsHint: "Nalepite link iz Google Maps (Share → Copy link).",
    message: "Poruka dobrodošlice", messageHint: "Možete je promeniti po želji.", music: "Muzika u pozadini", musicOptions: { henna: "Melodija kane", romantic: "Romantična", waltz: "Tihi valcer", none: "Bez muzike" },
    photo: "Vaša fotografija", photoHint: "Samo za Premium paket. Možete je iseći i pozicionirati.", summary: "Pregled", package: "Paket", template: "Dizajn", total: "Ukupno", payNote: "Nakon čuvanja videćete uputstva za bankovni transfer. Pozivnica se aktivira nakon potvrde uplate.", submit: "Sačuvaj i nastavi na plaćanje", busy: "Čuvanje…",
    required: "Popunite ime, datum, vreme, salu, adresu i lokaciju.", mapsInvalid: "Nalepite važeći Google Maps link.", preview: "Pregled", previewLabel: "Primer",
  },
  invite: {
    title: "Dobro došli na moju kanu", hostedBy: "Sa radošću vas pozivaju", on: "Datum", at: "Vreme", open: "Otvori pozivnicu", opening: "Otvaranje…", dedication: "Sa ljubavlju, za vas", invited: "Pozvani ste",
    rsvpTitle: "Da li ćete biti sa nama?", name: "Vaše ime", yes: "Dolazim", no: "Ne mogu doći", count: "Koliko osoba (uključujući vas)?", note: "Poruka (opciono)", send: "Pošalji odgovor", sending: "Slanje…", thanks: "Hvala! Radujemo se vašem dolasku.", sorry: "Hvala što ste nas obavestili.",
    enterName: "Upišite svoje ime.", chooseAttend: "Izaberite da li dolazite.", memories: "Podelite uspomene", memoriesDesc: "Pošaljite fotografije ili video sa večeri kane.", upload: "Otpremi foto ili video", footer: "Pozivnicu je s ljubavlju napravila Ftesa Jone.", photoHere: "Vaša fotografija ovde", countdown: "Do kane",
  },
  upload: { eyebrow: "Album kane", desc: "Pošaljite svoje fotografije i video — vidi ih samo domaćin.", pick: "Izaberi foto ili video", busy: "Slanje…", limits: "Do 10 fotografija i 2 videa (maks. 60 sekundi) po pozivnici · 6 MB svaki", tooLarge: "je veći od 6 MB.", tooLong: "Video mora biti do 60 sekundi.", photoLimit: "Dostignuto je ograničenje od 10 fotografija.", videoLimit: "Dostignuto je ograničenje od 2 videa.", sent: "Hvala! Poslato:", back: "Nazad na pozivnicu" },
};

const tr: KanaDict = {
  home: { eyebrow: "KATEGORİ SEÇİN", title: "Ne kutluyorsunuz?", desc: "İki özel ürün, her ayrıntıda aynı özen.", weddingTitle: "Düğün Davetiyesi", weddingDesc: "Büyük gününüz için zarif davetiyeler — zarf, müzik, LCV ve galeri.", weddingCta: "Düğün davetiyelerini gör", kanaTitle: "Kına Davetiyesi", kanaDesc: "Kına gecesi için kırmızı ve altın renkli lüks davetiyeler.", kanaCta: "Kına'yı keşfet", badge: "YENİ" },
  landing: {
    eyebrow: "KINA GECESİ", title: "Kına Davetiyesi", titleEm: "kırmızı ve altın.", desc: "Düğün öncesinin en sıcak gecesi için lüks dijital davetiyeler. Açılan zarf, müzik, LCV ve misafir anıları — hepsi tek bir bağlantıda.", create: "Kına davetiyesi oluştur", see: "Tasarımları gör", note: "Kırmızı kadife, altın telkari, laleler ve güller.",
    galleryEyebrow: "KINA KOLEKSİYONU", galleryTitle: "Dört tasarım, dört atmosfer.", galleryDesc: "Her tasarımın kendi düzeni, süslemeleri, animasyonu ve tipografisi vardır.", preview: "Önizlemeyi aç", use: "Bu tasarımı kullan", classicTag: "KLASİK", premiumTag: "PREMIUM · FOTOĞRAFLI",
    howEyebrow: "NASIL ÇALIŞIR", howTitle: "Birkaç dakikada hazır.", steps: [["Paketi seçin", "Fotoğrafsız Klasik veya fotoğraflı Premium."], ["Tasarımı seçin", "Geleneksel, modern, bordo veya Osmanlı saray."], ["Ayrıntıları ekleyin", "İsim, tarih, saat, salon, adres ve Google Maps konumu."], ["Ödeyin ve paylaşın", "Banka havalesi onaylandıktan sonra benzersiz bağlantıyı misafirlerle paylaşın."]],
    pricingEyebrow: "FİYATLAR", pricingTitle: "İki net paket.", pricingDesc: "Gizli ücret yok. Ödeme banka havalesi ile yapılır.", per: "davetiye başına", recommended: "Önerilen", active: "Davetiye etkinlik tarihinden sonra 30 gün aktif kalır.", payment: "Online ödeme aktif değil. Oluşturduktan sonra banka havalesi talimatlarını alırsınız.", choose: "Paketi seç",
    faqEyebrow: "SIK SORULANLAR", faqTitle: "Memnuniyetle yanıtlıyoruz.", faq: [["Kına davetiyesi nedir?", "Misafirlerin uygulama olmadan telefonda açtığı kına gecesi dijital davetiyesi."], ["Kendi fotoğrafımı ekleyebilir miyim?", "Evet, Premium paketle. Fotoğraf kırpılabilir ve konumlandırılabilir."], ["Ödeme nasıl yapılır?", "Banka havalesi ile. Yönetici ödemeyi onayladığında davetiye etkinleşir."], ["Misafirler kaç fotoğraf ve video yükleyebilir?", "Davetiye başına 10 fotoğraf ve 2 video (60 saniyeye kadar)."], ["Davetiye ne kadar aktif kalır?", "Etkinlik tarihinden sonra 30 güne kadar."]],
    finalTitle: "Geceniz özel bir davetiyeyi hak ediyor.", finalDesc: "Bugün oluşturun ve sevdiklerinizle paylaşın.", home: "Ana sayfa", wedding: "Düğün Davetiyesi",
  },
  templates: {
    "k-traditional": { name: "Geleneksel Kırmızı & Altın", desc: "Kırmızı kadife, altın arabesk çerçeve ve simetrik laleler." },
    "k-modern": { name: "Modern Minimal Kırmızı", desc: "Sade alan, ince altın çizgiler ve zarif tipografi." },
    "k-burgundy": { name: "Lüks Bordo", desc: "Koyu bordo, yumuşak dantel ve kemer içinde fotoğrafınız." },
    "k-ottoman": { name: "Osmanlı Saray Altını", desc: "Altın madalyon, saray telkarisi ve ortada portreniz." },
  },
  packages: { classic: "Kına Klasik", premium: "Kına Premium", classicFeatures: ["Animasyonlu zarf açılışı", "Arka plan müziği", "Geri sayım", "Google Maps", "Online LCV", "Misafir paneli", "Misafirlerden fotoğraf ve video", "Takvime ekleme", "QR kod", "Benzersiz bağlantı", "PDF indirme"], premiumIncludes: "Klasik'teki her şey, artı:", premiumFeatures: ["Kişisel fotoğrafınız", "Fotoğraf kırpma ve konumlandırma", "İki özel Premium tasarım", "Daha lüks görsel ayrıntılar"], noPhoto: "Kişisel fotoğraf yok", withPhoto: "Kişisel fotoğraflı" },
  creator: {
    title: "Kına davetiyesi oluştur", desc: "Dört adım: paket, tasarım, ayrıntılar ve özet.", step1: "1. Paketi seçin", step2: "2. Tasarımı seçin", step3: "3. Ayrıntıları doldurun", step4: "4. Sipariş özeti",
    bride: "Gelinin adı", parents: "Ebeveyn adları (isteğe bağlı)", parentsHint: "Örn. Krasniqi Ailesi", date: "Etkinlik tarihi", time: "Başlangıç saati", venue: "Salon adı", address: "Salon adresi", maps: "Google Maps konumu", mapsHint: "Google Maps bağlantısını yapıştırın (Paylaş → Bağlantıyı kopyala).",
    message: "Hoş geldiniz mesajı", messageHint: "İstediğiniz gibi değiştirebilirsiniz.", music: "Arka plan müziği", musicOptions: { henna: "Kına ezgisi", romantic: "Romantik", waltz: "Sakin vals", none: "Müzik yok" },
    photo: "Fotoğrafınız", photoHint: "Sadece Premium paket için. Kırpıp konumlandırabilirsiniz.", summary: "Özet", package: "Paket", template: "Tasarım", total: "Toplam", payNote: "Kaydettikten sonra banka havalesi talimatlarını göreceksiniz. Ödeme onaylanınca davetiye etkinleşir.", submit: "Kaydet ve ödemeye geç", busy: "Kaydediliyor…",
    required: "Ad, tarih, saat, salon, adres ve konumu doldurun.", mapsInvalid: "Geçerli bir Google Maps bağlantısı yapıştırın.", preview: "Önizleme", previewLabel: "Örnek",
  },
  invite: {
    title: "Kınama hoş geldiniz", hostedBy: "Sevinçle davet ederler", on: "Tarih", at: "Saat", open: "Davetiyeyi aç", opening: "Açılıyor…", dedication: "Sevgiyle, sizin için", invited: "Davetlisiniz",
    rsvpTitle: "Bizimle olacak mısınız?", name: "Adınız", yes: "Geleceğim", no: "Gelemeyeceğim", count: "Kaç kişi (siz dahil)?", note: "Mesaj (isteğe bağlı)", send: "Yanıtı gönder", sending: "Gönderiliyor…", thanks: "Teşekkürler! Sizi sevinçle bekliyoruz.", sorry: "Bildirdiğiniz için teşekkürler.",
    enterName: "Adınızı yazın.", chooseAttend: "Gelip gelmeyeceğinizi seçin.", memories: "Anıları paylaşın", memoriesDesc: "Kına gecesinden fotoğraf veya video gönderin.", upload: "Fotoğraf veya video yükle", footer: "Davetiye Ftesa Jone ile sevgiyle hazırlandı.", photoHere: "Fotoğrafınız burada", countdown: "Kınaya kalan",
  },
  upload: { eyebrow: "Kına albümü", desc: "Fotoğraf ve videolarınızı gönderin — yalnızca ev sahibi görür.", pick: "Fotoğraf veya video seç", busy: "Gönderiliyor…", limits: "Davetiye başına 10 fotoğraf ve 2 video (en fazla 60 saniye) · her biri 6 MB", tooLarge: "6 MB'tan büyük.", tooLong: "Video en fazla 60 saniye olmalı.", photoLimit: "10 fotoğraf sınırına ulaşıldı.", videoLimit: "2 video sınırına ulaşıldı.", sent: "Teşekkürler! Gönderilen:", back: "Davetiyeye dön" },
};

const en: KanaDict = {
  home: { eyebrow: "CHOOSE A CATEGORY", title: "What are you celebrating?", desc: "Two distinct products, the same care in every detail.", weddingTitle: "Wedding Invitations", weddingDesc: "Elegant invitations for your big day — envelope, music, RSVP and gallery.", weddingCta: "See wedding invitations", kanaTitle: "Henna Night Invitations", kanaDesc: "Luxury red and gold invitations for the henna night.", kanaCta: "Discover Henna Night", badge: "NEW" },
  landing: {
    eyebrow: "HENNA NIGHT", title: "Henna Night Invitations", titleEm: "in red and gold.", desc: "Luxury digital invitations for the warmest night before the wedding. An opening envelope, music, RSVP and guest memories — all in one link.", create: "Create a henna invitation", see: "See the designs", note: "Red velvet, gold filigree, tulips and roses.",
    galleryEyebrow: "HENNA COLLECTION", galleryTitle: "Four designs, four moods.", galleryDesc: "Each design has its own layout, ornaments, animation and typography.", preview: "Open preview", use: "Use this design", classicTag: "CLASSIC", premiumTag: "PREMIUM · WITH PHOTO",
    howEyebrow: "HOW IT WORKS", howTitle: "Ready in minutes.", steps: [["Choose a package", "Classic without a photo or Premium with your photo."], ["Choose a design", "Traditional, modern, burgundy or Ottoman royal."], ["Add the details", "Name, date, time, venue, address and Google Maps location."], ["Pay and share", "Once the bank transfer is confirmed, share your unique link with guests."]],
    pricingEyebrow: "PRICING", pricingTitle: "Two clear packages.", pricingDesc: "No hidden costs. Payment is by bank transfer.", per: "per invitation", recommended: "Recommended", active: "The invitation stays active until 30 days after the event date.", payment: "Online payment is not active. After creating, you receive bank transfer instructions.", choose: "Choose package",
    faqEyebrow: "FAQ", faqTitle: "Happy to help.", faq: [["What is a henna night invitation?", "A digital invitation for the henna night that guests open on their phone without an app."], ["Can I add my own photo?", "Yes, with the Premium package. The photo can be cropped and positioned."], ["How do I pay?", "By bank transfer. The invitation is activated once the administrator confirms payment."], ["How many photos and videos can guests upload?", "Up to 10 photos and 2 videos (up to 60 seconds) per invitation."], ["How long does the invitation stay active?", "Until 30 days after the event date."]],
    finalTitle: "Your night deserves a special invitation.", finalDesc: "Create it today and share it with your loved ones.", home: "Home", wedding: "Wedding Invitations",
  },
  templates: {
    "k-traditional": { name: "Traditional Red & Gold", desc: "Red velvet, a gold arabesque frame and symmetrical tulips." },
    "k-modern": { name: "Modern Minimal Red", desc: "Clean space, fine gold lines and elegant typography." },
    "k-burgundy": { name: "Luxury Burgundy", desc: "Deep burgundy, soft lace and your photo in an arch." },
    "k-ottoman": { name: "Ottoman Royal Gold", desc: "A gold medallion, royal filigree and your portrait at the centre." },
  },
  packages: { classic: "Henna Classic", premium: "Henna Premium", classicFeatures: ["Animated envelope opening", "Background music", "Countdown", "Google Maps", "Online RSVP", "Guest dashboard", "Guest photo and video uploads", "Add to calendar", "QR code", "Unique link", "PDF download"], premiumIncludes: "Everything in Classic, plus:", premiumFeatures: ["Your personal photo", "Photo cropping and positioning", "Two exclusive Premium designs", "More luxurious visual details"], noPhoto: "No personal photo", withPhoto: "With personal photo" },
  creator: {
    title: "Create a henna night invitation", desc: "Four steps: package, design, details and summary.", step1: "1. Choose a package", step2: "2. Choose a design", step3: "3. Fill in the details", step4: "4. Order summary",
    bride: "Bride's name", parents: "Parents' names (optional)", parentsHint: "E.g. The Krasniqi family", date: "Event date", time: "Start time", venue: "Venue name", address: "Venue address", maps: "Google Maps location", mapsHint: "Paste the link from Google Maps (Share → Copy link).",
    message: "Welcome message", messageHint: "You can change it as you like.", music: "Background music", musicOptions: { henna: "Henna melody", romantic: "Romantic", waltz: "Gentle waltz", none: "No music" },
    photo: "Your photo", photoHint: "Premium package only. You can crop and position it.", summary: "Summary", package: "Package", template: "Design", total: "Total", payNote: "After saving you will see bank transfer instructions. The invitation is activated once payment is confirmed.", submit: "Save and continue to payment", busy: "Saving…",
    required: "Fill in the name, date, time, venue, address and location.", mapsInvalid: "Paste a valid Google Maps link.", preview: "Preview", previewLabel: "Sample",
  },
  invite: {
    title: "Welcome to my henna night", hostedBy: "Joyfully invited by", on: "Date", at: "Time", open: "Open invitation", opening: "Opening…", dedication: "With love, for you", invited: "You are invited",
    rsvpTitle: "Will you join us?", name: "Your name", yes: "I'll be there", no: "I can't come", count: "How many people (including you)?", note: "Message (optional)", send: "Send reply", sending: "Sending…", thanks: "Thank you! We look forward to seeing you.", sorry: "Thank you for letting us know.",
    enterName: "Please enter your name.", chooseAttend: "Please choose whether you'll come.", memories: "Share memories", memoriesDesc: "Send photos or videos from the henna night.", upload: "Upload photo or video", footer: "Invitation made with love by Ftesa Jone.", photoHere: "Your photo here", countdown: "Until the henna night",
  },
  upload: { eyebrow: "Henna night album", desc: "Send your photos and videos — only the host can see them.", pick: "Choose photo or video", busy: "Sending…", limits: "Up to 10 photos and 2 videos (max 60 seconds) per invitation · 6 MB each", tooLarge: "is larger than 6 MB.", tooLong: "Videos must be 60 seconds or shorter.", photoLimit: "The 10-photo limit has been reached.", videoLimit: "The 2-video limit has been reached.", sent: "Thank you! Sent:", back: "Back to invitation" },
};

export const kanaDictionaries: Record<Lang, KanaDict> = { sq, sr, tr, en };

export function useKanaText() {
  const { lang } = useI18n();
  return { lang, k: kanaDictionaries[lang] };
}
