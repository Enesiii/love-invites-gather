import rose from "@/assets/gallery-rose.webp";
import roseSmall from "@/assets/gallery-rose-small.webp";
import sage from "@/assets/gallery-sage.webp";
import sageSmall from "@/assets/gallery-sage-small.webp";
import night from "@/assets/gallery-night.webp";
import nightSmall from "@/assets/gallery-night-small.webp";
import gold from "@/assets/gallery-gold.webp";
import goldSmall from "@/assets/gallery-gold-small.webp";
import ivory from "@/assets/gallery-ivory.webp";
import ivorySmall from "@/assets/gallery-ivory-small.webp";
import blush from "@/assets/gallery-blush.webp";
import blushSmall from "@/assets/gallery-blush-small.webp";
import arch from "@/assets/arch-floral.webp";
import archSmall from "@/assets/arch-floral-small.webp";
import pgold from "@/assets/premium-gold.webp";
import pgoldSmall from "@/assets/premium-gold-small.webp";
import pfloral from "@/assets/premium-floral.webp";
import pfloralSmall from "@/assets/premium-floral-small.webp";
import pminimal from "@/assets/premium-minimal.webp";
import pminimalSmall from "@/assets/premium-minimal-small.webp";
import proyal from "@/assets/premium-royal.webp";
import proyalSmall from "@/assets/premium-royal-small.webp";

export const invitationCollection = [
  {
    id: "rose",
    name: "Romancë në trëndafil",
    category: "ROMANTIKE",
    image: rose,
    small: roseSmall,
    description: "Tonet e buta dhe detajet botanike për një ditë plot dashuri.",
  },
  {
    id: "sage",
    name: "Kopshti i dashurisë",
    category: "NATYRALE",
    image: sage,
    small: sageSmall,
    description: "Gjelbërim i qetë, elegancë e natyrshme dhe një prekje e artë.",
  },
  {
    id: "night",
    name: "Elegancë mbretërore",
    category: "KLASIKE",
    image: night,
    small: nightSmall,
    description: "Tonet e natës dhe detajet e arta për një festë të paharrueshme.",
  },
  {
    id: "gold",
    name: "Natë e artë",
    category: "LUKSUZE",
    image: gold,
    small: goldSmall,
    description: "E zezë e thellë me ar të gdhendur, për një mbrëmje madhështore.",
  },
  {
    id: "ivory",
    name: "Fildiš i pastër",
    category: "MINIMALE",
    image: ivory,
    small: ivorySmall,
    description: "Letër krem me vizatim të hollë bojëshire, elegancë e qetë.",
  },
  {
    id: "blush",
    name: "Ëndrra rozë",
    category: "ROMANTIKE",
    image: blush,
    small: blushSmall,
    description: "Nuanca rozë dhe livando si akvarel, plot ëmbëlsi dhe lule.",
  },
  {
    id: "arch",
    name: "Harku i luleve",
    category: "MODEL I RI",
    image: arch,
    small: archSmall,
    description: "Model krejt ndryshe: hark me lule akvarel, emra me shkrim dore dhe data në rresht.",
  },
  { id: "lux-gold", premium: true, name: "Ari Luksoz", category: "PREMIUM", image: pgold, small: pgoldSmall, description: "Fildish dhe shampanjë, korniza të arta dhe fotoja juaj në qendër." },
  { id: "floral", premium: true, name: "Lule Romantike", category: "PREMIUM", image: pfloral, small: pfloralSmall, description: "Krem, rozë e butë dhe sherbelë, me lule rreth fotos suaj." },
  { id: "minimal", premium: true, name: "Minimal Modern", category: "PREMIUM", image: pminimal, small: pminimalSmall, description: "Foto në gjithë gjerësinë, tipografi moderne dhe pamje editoriale." },
  { id: "royal", premium: true, name: "Dasmë Mbretërore", category: "PREMIUM", image: proyal, small: proyalSmall, description: "Smerald i thellë, fildish dhe ar, me portretin tuaj në kornizë." },
] as const;

export function findInvitationStyle(id: string) {
  return invitationCollection.find((item) => item.id === id);
}

export function previewInvitation(theme: string) {
  const item = findInvitationStyle(theme);
  return {
    cover_url: item && "premium" in item ? item.image : null,
    partner_one: "Arta",
    partner_two: "Besnik",
    event_date: "2027-06-19",
    event_time: "18:00",
    venue: "Salla e dasmës",
    address: "Prishtinë, Kosovë",
    message: "Gëzimi ynë është më i plotë me ju pranë.",
    theme,
  };
}
