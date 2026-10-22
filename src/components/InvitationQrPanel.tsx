import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, ExternalLink, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = { url: string; defaultNames: string };

// QR opsionet: korrigjim i lartë gabimesh + zonë e qetë 4 module (standardi).
const QR_OPTS = { errorCorrectionLevel: "M" as const, margin: 4, color: { dark: "#000000", light: "#ffffff" } };

function download(canvas: HTMLCanvasElement, name: string) {
  canvas.toBlob((b) => {
    if (!b) return;
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 30_000);
  }, "image/png");
}

async function plainCanvas(url: string) {
  const c = document.createElement("canvas");
  await QRCode.toCanvas(c, url, { ...QR_OPTS, width: 1024 });
  return c;
}

async function elegantCanvas(url: string, names: string) {
  const W = 1200, H = 1600;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fbf7ef"; // ivory
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#b8945a"; // gold
  ctx.lineWidth = 6; ctx.strokeRect(50, 50, W - 100, H - 100);
  ctx.lineWidth = 2; ctx.strokeRect(75, 75, W - 150, H - 150);
  ctx.textAlign = "center";
  ctx.fillStyle = "#3a2f25";
  ctx.font = "italic 84px Georgia, 'Times New Roman', serif";
  ctx.fillText(names || " ", W / 2, 260, W - 200);
  ctx.fillStyle = "#b8945a";
  ctx.fillRect(W / 2 - 80, 310, 160, 3);
  const qr = await plainCanvas(url);
  const size = 760, x = (W - size) / 2, y = 400;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(x - 20, y - 20, size + 40, size + 40);
  ctx.strokeStyle = "#b8945a"; ctx.lineWidth = 2; ctx.strokeRect(x - 20, y - 20, size + 40, size + 40);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qr, x, y, size, size);
  ctx.fillStyle = "#3a2f25";
  ctx.font = "48px Georgia, 'Times New Roman', serif";
  ctx.fillText("Skanoni për të parë ftesën", W / 2, y + size + 130, W - 200);
  return c;
}

export function InvitationQrPanel({ url, defaultNames }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [names, setNames] = useState(defaultNames);
  const [elegant, setElegant] = useState(true);
  const ready = /^https?:\/\//.test(url);

  useEffect(() => {
    if (ready && ref.current) QRCode.toCanvas(ref.current, url, { ...QR_OPTS, width: 220 });
  }, [url, ready]);

  const onDownload = async () => {
    const c = elegant ? await elegantCanvas(url, names) : await plainCanvas(url);
    download(c, elegant ? "ftesa-qr-elegant.png" : "ftesa-qr.png");
  };

  return (
    <section className="rounded-xl border border-border bg-card p-4 text-sm sm:p-5">
      <h2 className="flex items-center gap-2 font-semibold">
        <QrCode className="h-4 w-4" /> QR Kodi i Ftesës
      </h2>
      <div
        className={`mt-3 flex flex-col items-center rounded-lg p-4 ${
          elegant ? "border-2 border-primary/40 bg-secondary/40" : "border border-border bg-background"
        }`}
      >
        {elegant ? <p className="mb-2 font-serif text-lg italic">{names}</p> : null}
        <canvas ref={ref} aria-label="QR kodi i ftesës" className="h-[180px] w-[180px] bg-background" />
        {elegant ? <p className="mt-2 text-xs text-muted-foreground">Skanoni për të parë ftesën</p> : null}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-md bg-muted p-1 text-xs">
        <button type="button" onClick={() => setElegant(true)} className={`rounded px-2 py-1.5 ${elegant ? "bg-card font-semibold shadow-sm" : ""}`}>Elegant</button>
        <button type="button" onClick={() => setElegant(false)} className={`rounded px-2 py-1.5 ${!elegant ? "bg-card font-semibold shadow-sm" : ""}`}>Bardh e zi</button>
      </div>
      {elegant ? (
        <label className="mt-3 block text-xs text-muted-foreground">
          Emrat e çiftit
          <Input value={names} maxLength={60} onChange={(e) => setNames(e.target.value)} className="mt-1" />
        </label>
      ) : null}
      <div className="mt-3 grid gap-2">
        <Button size="sm" className="w-full" disabled={!ready} onClick={onDownload}>
          <Download className="mr-1.5 h-4 w-4" /> Shkarko QR Kodin
        </Button>
        <Button size="sm" variant="outline" className="w-full" onClick={() => { navigator.clipboard.writeText(url); toast.success("Lidhja u kopjua."); }}>
          <Copy className="mr-1.5 h-4 w-4" /> Kopjo Linkun
        </Button>
        <Button size="sm" variant="outline" className="w-full" onClick={() => window.open(url, "_blank", "noopener")}>
          <ExternalLink className="mr-1.5 h-4 w-4" /> Shiko Ftesën
        </Button>
      </div>
    </section>
  );
}
