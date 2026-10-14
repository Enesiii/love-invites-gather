import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateInvitationText, TONES } from "@/lib/ai-text.functions";

type Tone = keyof typeof TONES;
const TONE_LABELS: Record<Tone, string> = { classic: "Klasik", warm: "I ngrohtë", modern: "Modern", poetic: "Poetik" };

export function AiWriter({
  details,
  onText,
}: {
  details: { partner_one: string; partner_two: string; event_date: string; event_time: string; venue: string };
  onText: (text: string) => void;
}) {
  const generate = useServerFn(generateInvitationText);
  const [tone, setTone] = useState<Tone>("classic");
  const [extra, setExtra] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!details.partner_one.trim() || !details.partner_two.trim()) {
      setError("Shkruani së pari emrat e çiftit.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await generate({ data: { ...details, tone, details: extra } });
      onText(res.text);
      toast.success("Teksti u krijua. Mund ta ndryshoni sipas dëshirës.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Teksti nuk u krijua.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="h-4 w-4 text-primary" /> Shkruaje me AI
      </p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
          <Button key={t} type="button" size="sm" variant={tone === t ? "default" : "outline"} onClick={() => setTone(t)}>
            {TONE_LABELS[t]}
          </Button>
        ))}
      </div>
      <Input
        aria-label="Detaje për ju"
        placeholder="P.sh. u njohëm në Prizren, duam të festojmë me familjen"
        value={extra}
        maxLength={300}
        onChange={(e) => setExtra(e.target.value)}
      />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="button" variant="outline" onClick={run} disabled={busy}>
        <Sparkles className="h-4 w-4" /> {busy ? "Duke shkruar…" : "Krijo tekstin"}
      </Button>
    </div>
  );
}
