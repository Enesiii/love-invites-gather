import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Link2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvitationCard } from "@/components/InvitationCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ftesa Dasme — krijo ftesën tënde dhe mblidh RSVP" },
      {
        name: "description",
        content:
          "Krijo një ftesë dasme elegante në pak minuta, ndaje me një lidhje dhe shiko sa të ftuar do të vijnë.",
      },
      { property: "og:title", content: "Ftesa Dasme — krijo ftesën tënde" },
      {
        property: "og:description",
        content: "Ftesa dasme online me formular RSVP dhe numërim të të ftuarve.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const sample = {
  partner_one: "Arta",
  partner_two: "Besnik",
  event_date: "2027-06-19",
  event_time: "17:00",
  venue: "Vila e Lumit",
  address: "Tiranë",
  message: "Gëzimi ynë është më i plotë me ju pranë.",
  theme: "rose",
};

function Index() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display flex items-center gap-2 text-2xl text-primary">
          <Heart className="h-5 w-5 fill-primary" /> Ftesa Dasme
        </span>
        <Button asChild>
          <Link to="/krijo">Krijo ftesën</Link>
        </Button>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Dasma juaj, e thjeshtë për t'u ftuar
            </p>
            <h1 className="font-display mt-5 text-5xl font-medium leading-[1.05] sm:text-7xl">
              Një ftesë që <em className="text-primary">ndihet</em> si dasma juaj.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Shkruani emrat, datën dhe vendin. Merrni një lidhje për t'ua dërguar të ftuarve dhe
              shihni menjëherë sa persona konfirmojnë pjesëmarrjen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/krijo">Fillo tani</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <InvitationCard inv={sample} />
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
          {[
            { icon: Heart, t: "1. Krijoni ftesën", d: "Plotësoni detajet dhe zgjidhni një stil." },
            { icon: Link2, t: "2. Ndani lidhjen", d: "Dërgojeni në WhatsApp, Viber ose email." },
            { icon: Users, t: "3. Numëroni të ftuarit", d: "RSVP-të ruhen dhe totali i të ftuarve shfaqet automatikisht." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-sm border border-border bg-card p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="font-display mt-4 text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
