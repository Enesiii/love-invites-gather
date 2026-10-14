import rose from "@/assets/gallery-rose.webp";
import roseSmall from "@/assets/gallery-rose-small.webp";
import sage from "@/assets/gallery-sage.webp";
import sageSmall from "@/assets/gallery-sage-small.webp";
import night from "@/assets/gallery-night.webp";
import nightSmall from "@/assets/gallery-night-small.webp";

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
] as const;

export function findInvitationStyle(id: string) {
  return invitationCollection.find((item) => item.id === id);
}

export function previewInvitation(theme: string) {
  return {
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
