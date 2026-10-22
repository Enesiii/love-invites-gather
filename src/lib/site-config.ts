// Cilësimet e biznesit — ndryshoni vlerat këtu pa prekur pjesën tjetër të faqes.

// Numri i WhatsApp-it vetëm me shifra, me prefiksin e shtetit (pa + dhe pa hapësira).
// Lëreni bosh ("") për ta fshehur butonin.
export const WHATSAPP_NUMBER = "38349706192";

export function whatsappUrl() {
  return WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : null;
}

// Paketat e çmimeve. Tekstet (emri, përfshirjet) janë te përkthimet në src/lib/i18n.tsx.
export const PRICING = {
  currency: "€",
  // Sa ditë mbetet aktive ftesa pas datës së dasmës.
  activeDaysAfterEvent: 30,
  packages: [
    { id: "premium", price: 15, featured: true },
    { id: "classic", price: 10, featured: false },
  ],
} as const;
