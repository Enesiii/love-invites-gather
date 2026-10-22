import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Crown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CoverPhotoEditor, checkCoverFile, fileToBase64, type CoverPosition } from "@/components/CoverPhotoEditor";
import { OrderDialog } from "@/components/OrderDialog";
import { removeCover, setCoverPosition, uploadCover } from "@/lib/invitations.functions";
import { PRICING } from "@/lib/site-config";
import { THEME_LABELS, type ThemeId } from "@/lib/themes";

export function PremiumCoverPanel({
  token,
  theme,
  coverUrl,
  initial,
}: {
  token: string;
  theme: ThemeId;
  coverUrl: string | null;
  initial: CoverPosition;
}) {
  const router = useRouter();
  const upload = useServerFn(uploadCover);
  const savePos = useServerFn(setCoverPosition);
  const remove = useServerFn(removeCover);
  const [pos, setPos] = useState(initial);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = localUrl ?? coverUrl;
  const dirty = pos.pos_x !== initial.pos_x || pos.pos_y !== initial.pos_y || pos.zoom !== initial.zoom;
  const premium = PRICING.packages.find((p) => p.id === "premium");

  async function onFile(file: File) {
    const err = checkCoverFile(file);
    if (err) return setError(err);
    setError(null);
    setBusy(true);
    const preview = URL.createObjectURL(file);
    try {
      await upload({ data: { token, base64: await fileToBase64(file), ...pos } });
      setLocalUrl(preview);
      toast.success("Fotoja u ruajt.");
      router.invalidate();
    } catch (e) {
      URL.revokeObjectURL(preview);
      setError(e instanceof Error ? e.message : "Fotoja nuk u ngarkua.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Crown className="h-4 w-4" /> Fotoja e çiftit · Premium
      </h2>
      <p className="mt-1 mb-3 text-xs text-muted-foreground">
        Shfaqet në dizajnin “{THEME_LABELS[theme]}”. Ruhet privatisht dhe hapet vetëm përmes ftesës suaj.
      </p>
      <CoverPhotoEditor
        url={url}
        pos={pos}
        onPos={setPos}
        onFile={onFile}
        busy={busy}
        error={error}
        onRemove={async () => {
          if (!window.confirm("Ta heqim foton e çiftit?")) return;
          setBusy(true);
          try {
            await remove({ data: { token } });
            setLocalUrl(null);
            toast.success("Fotoja u hoq.");
            router.invalidate();
          } catch {
            setError("Fotoja nuk u hoq. Provoni përsëri.");
          } finally {
            setBusy(false);
          }
        }}
      />
      {url && dirty ? (
        <Button
          size="sm"
          className="mt-3 w-full"
          disabled={busy}
          onClick={async () => {
            try {
              await savePos({ data: { token, ...pos } });
              toast.success("Pozicioni u ruajt.");
              router.invalidate();
            } catch {
              toast.error("Pozicioni nuk u ruajt.");
            }
          }}
        >
          Ruaj pozicionin
        </Button>
      ) : null}
      {premium ? (
        <div className="mt-4 rounded-lg bg-muted p-3 text-xs">
          <p className="font-medium">
            Paketa Premium · {PRICING.currency}
            {premium.price} për ftesë
          </p>
          <p className="mt-1 text-muted-foreground">
            Pagesa online nuk është ende aktive. Dërgoni kërkesën dhe ju kontaktojmë për konfirmim.
          </p>
          <div className="mt-2">
            <OrderDialog style={theme} styleName={THEME_LABELS[theme]} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
