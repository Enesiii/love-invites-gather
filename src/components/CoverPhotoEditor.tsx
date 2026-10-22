import { useRef } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { coverStyle } from "@/components/PremiumInvitation";

export type CoverPosition = { pos_x: number; pos_y: number; zoom: number };
export const COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const COVER_MAX = 6 * 1024 * 1024;

export function checkCoverFile(file: File): string | null {
  if (!COVER_TYPES.includes(file.type)) return "Zgjidhni një foto JPEG, PNG ose WebP.";
  if (file.size > COVER_MAX) return "Fotoja është më e madhe se 6 MB.";
  return null;
}

export async function fileToBase64(file: File) {
  const buf = new Uint8Array(await file.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

export function CoverPhotoEditor({
  url,
  pos,
  onPos,
  onFile,
  onRemove,
  busy = false,
  error,
}: {
  url: string | null;
  pos: CoverPosition;
  onPos: (p: CoverPosition) => void;
  onFile: (file: File) => void;
  onRemove: () => void;
  busy?: boolean;
  error?: string | null;
}) {
  const input = useRef<HTMLInputElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!url) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.pos_x, py: pos.pos_y };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const s = drag.current;
    if (!s) return;
    const r = e.currentTarget.getBoundingClientRect();
    const clamp = (v: number) => Math.round(Math.min(100, Math.max(0, v)));
    onPos({ ...pos, pos_x: clamp(s.px - ((e.clientX - s.x) / r.width) * 100), pos_y: clamp(s.py - ((e.clientY - s.y) / r.height) * 100) });
  }

  return (
    <div className="cover-editor space-y-3">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Zgjidhni foton e çiftit"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) onFile(f);
        }}
      />
      <div
        className={`cover-frame ${url ? "has-photo" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        {url ? (
          <img src={url} alt="Pamja paraprake e fotos së çiftit" draggable={false} style={coverStyle(pos.pos_x, pos.pos_y, pos.zoom)} />
        ) : (
          <button type="button" className="cover-empty" onClick={() => input.current?.click()} disabled={busy}>
            <ImagePlus className="h-7 w-7" aria-hidden="true" />
            <span>Ngarkoni foton e çiftit</span>
            <small>JPEG, PNG ose WebP · deri 6 MB</small>
          </button>
        )}
        {busy ? (
          <div className="cover-busy" role="status">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" /> Duke ngarkuar…
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {url ? (
        <>
          <p className="text-xs text-muted-foreground">Tërhiqeni foton për ta pozicionuar, ose përdorni rrëshqitësit.</p>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>Zmadhimi</Label>
              <Slider min={100} max={300} step={5} value={[pos.zoom]} onValueChange={([v]) => onPos({ ...pos, zoom: v ?? 100 })} aria-label="Zmadhimi" />
            </div>
            <div className="space-y-1.5">
              <Label>Majtas – djathtas</Label>
              <Slider min={0} max={100} value={[pos.pos_x]} onValueChange={([v]) => onPos({ ...pos, pos_x: v ?? 50 })} aria-label="Pozicioni horizontal" />
            </div>
            <div className="space-y-1.5">
              <Label>Lart – poshtë</Label>
              <Slider min={0} max={100} value={[pos.pos_y]} onValueChange={([v]) => onPos({ ...pos, pos_y: v ?? 50 })} aria-label="Pozicioni vertikal" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()} disabled={busy}>
              <RefreshCw className="h-4 w-4" /> Zëvendëso foton
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onRemove} disabled={busy}>
              <Trash2 className="h-4 w-4" /> Hiqe
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
