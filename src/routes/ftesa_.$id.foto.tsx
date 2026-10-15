import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, CheckCircle2, Heart } from "lucide-react";
import { ClosedInvitation } from "@/components/ClosedInvitation";
import { Button } from "@/components/ui/button";
import { getInvitation, uploadGuestMedia } from "@/lib/invitations.functions";

const MAX = 6 * 1024 * 1024;

export const Route = createFileRoute("/ftesa_/$id/foto")({
  loader: async ({ params }) => {
    const inv = await getInvitation({ data: { id: params.id } });
    if (!inv) throw notFound();
    return inv;
  },
  head: ({ loaderData }) => {
    const names = loaderData ? `${loaderData.partner_one} & ${loaderData.partner_two}` : "çiftit";
    const title = `Ndani fotot me ${names}`;
    const desc = `Ngarkoni fotot dhe videot tuaja nga dasma e ${names}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: GuestUploadPage,
});

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function GuestUploadPage() {
  const inv = Route.useLoaderData();
  const upload = useServerFn(uploadGuestMedia);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(0);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    let ok = 0;
    for (const f of Array.from(files)) {
      if (f.size > MAX) {
        toast.error(`${f.name} është më i madh se 6 MB.`);
        continue;
      }
      try {
        await upload({ data: { invitation_id: inv.id, type: f.type as "image/jpeg", base64: await toBase64(f) } });
        ok++;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : `${f.name} nuk u ngarkua.`);
      }
    }
    setBusy(false);
    if (input.current) input.current.value = "";
    if (ok) {
      setSent((s) => s + ok);
      toast.success(ok === 1 ? "U dërgua te çifti." : `${ok} skedarë u dërguan te çifti.`);
    }
  }

  if (inv.closed_at) {
    return <ClosedInvitation partnerOne={inv.partner_one} partnerTwo={inv.partner_two} theme={inv.theme} />;
  }

  return (
    <div className={`theme-${inv.theme} guest-invitation min-h-screen bg-background text-foreground`}>
      <main className="mx-auto max-w-xl px-4 py-12 text-center sm:px-6">
        <Heart className="mx-auto mb-3 h-5 w-5 text-accent" strokeWidth={1} />
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Albumi i dasmës</p>
        <h1 className="font-display mt-2 text-4xl sm:text-5xl">
          {inv.partner_one} & {inv.partner_two}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Keni bërë një foto ose video të bukur? Dërgojani çiftit — vetëm ata e shohin.
        </p>
        <section className="rsvp-section mt-8 px-4 py-8">
          <input
            ref={input}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <Button size="lg" className="min-h-12 w-full" disabled={busy} onClick={() => input.current?.click()}>
            <Camera className="h-5 w-5" /> {busy ? "Duke dërguar…" : "Zgjidh foto ose video"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">JPG, PNG, WEBP, MP4 ose MOV · deri në 6 MB secili</p>
          {sent ? (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" /> Faleminderit! {sent} u dërguan.
            </p>
          ) : null}
        </section>
        <Link to="/ftesa/$id" params={{ id: inv.id }} className="mt-8 inline-block text-sm underline">
          Kthehu te ftesa
        </Link>
      </main>
    </div>
  );
}
