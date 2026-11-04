import { useEffect, useRef, useState } from "react";
import { Heart, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvitationView } from "@/components/InvitationCard";

export function InvitationOpening({ inv, onOpen }: { inv: InvitationView; onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function open() {
    if (opening) return;
    setOpening(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(onOpen, reduced ? 0 : 1400);
  }

  return (
    <div className={`invitation-opening ${opening ? "is-opening" : ""}`}>
      <p className="opening-dedication">Me dashuri, për ju</p>
      <h1 className="font-display opening-names">{inv.partner_one} <span>&</span> {inv.partner_two}</h1>
      <div className="envelope" aria-hidden="true">
        <div className="envelope-letter"><Heart className="mx-auto h-6 w-6" /><p className="font-display mt-4 text-3xl">Jeni të ftuar</p></div>
        <div className="envelope-pocket" />
        <div className="envelope-flap" />
        <div className="envelope-seal"><Heart className="h-6 w-6" /></div>
      </div>
      <Button size="lg" variant="outline" onClick={open} disabled={opening} className="opening-button">
        <Heart className="h-4 w-4" /> {opening ? "Me shumë dashuri…" : "Hap ftesën"}
      </Button>
    </div>
  );
}

// An original, quiet piano-like waltz. Audio starts only after a guest chooses play.
type MusicVariant = "waltz" | "henna" | "romantic";
const MELODIES: Record<MusicVariant, { notes: number[]; bass: number[]; step: number; wave: OscillatorType }> = {
  waltz: { notes: [72, 76, 79, 76, 74, 72, 71, 74, 77, 74, 72, 71, 69, 72, 76, 72, 71, 69, 67, 71, 74, 71, 69, 67], bass: [48, 47, 45, 43], step: 550, wave: "sine" },
  // Melodi origjinale e qetë në modalitet hixhaz, e frymëzuar nga këngët e kanagjegjit.
  henna: { notes: [69, 70, 73, 74, 76, 74, 73, 70, 69, 70, 73, 70, 69, 67, 69, 70, 73, 74, 73, 70, 69, 67, 65, 69], bass: [45, 45, 43, 45], step: 480, wave: "triangle" },
  romantic: { notes: [67, 71, 74, 79, 78, 74, 71, 72, 76, 79, 76, 72, 71, 74, 78, 74, 71, 67, 69, 72, 76, 72, 69, 67], bass: [43, 48, 47, 43], step: 620, wave: "sine" },
};

export function InvitationMusic({ variant = "waltz", labels }: { variant?: MusicVariant; labels?: { play: string; stop: string; failed: string } } = {}) {
  const l = labels ?? { play: "Luaj muzikën", stop: "Ndalo muzikën", failed: "Muzika nuk u hap — provo sërish" };
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const position = useRef(0);

  function stop() {
    if (interval.current) clearInterval(interval.current);
    interval.current = null;
    const context = audio.current;
    audio.current = null;
    if (context) void context.close();
  }
  useEffect(() => () => stop(), []);

  async function toggle() {
    if (playing) { stop(); setPlaying(false); return; }
    try {
      const context = new AudioContext();
      audio.current = context;
      await context.resume();
      const tune = MELODIES[variant];
      const melody = tune.notes;
      function note(midi: number, time: number, volume: number) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = tune.wave;
        oscillator.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume, time + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 1.8);
        oscillator.connect(gain); gain.connect(context.destination);
        oscillator.start(time); oscillator.stop(time + 2);
      }
      function tick() {
        const i = position.current % melody.length;
        const time = context.currentTime + 0.04;
        note(melody[i] ?? 72, time, 0.085);
        if (i % 3 === 0) note(tune.bass[Math.floor(i / 6)] ?? 48, time, 0.06);
        position.current += 1;
      }
      tick();
      interval.current = setInterval(tick, tune.step);
      setPlaying(true);
      setUnavailable(false);
    } catch { stop(); setPlaying(false); setUnavailable(true); }
  }

  return (
    <Button variant="outline" onClick={toggle} aria-pressed={playing} aria-label={playing ? l.stop : l.play} title={playing ? l.stop : l.play} className="music-control">
      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      <span>{unavailable ? l.failed : playing ? l.stop : l.play}</span>
    </Button>
  );
}