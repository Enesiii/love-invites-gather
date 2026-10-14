import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

export function Countdown({ eventDate, eventTime }: { eventDate: string; eventTime: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!eventDate) return;
    const target = new Date(`${eventDate}T${eventTime || "00:00"}:00`).getTime();
    if (Number.isNaN(target)) return;
    const tick = () => setLeft(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [eventDate, eventTime]);

  // Renderohet vetëm pas montimit që SSR dhe shfletuesi të japin të njëjtin HTML.
  if (left === null) return null;
  if (left <= 0) return null;
  const { d, h, m, s } = parts(left);
  const cells: Array<[string, string]> = [
    [String(d), "Ditë"],
    [pad(h), "Orë"],
    [pad(m), "Minuta"],
    [pad(s), "Sekonda"],
  ];
  return (
    <div className="countdown" role="timer" aria-label="Koha deri në dasmë">
      <p className="countdown-label">Deri në dasmën tonë</p>
      <div className="countdown-grid">
        {cells.map(([value, label]) => (
          <div key={label} className="countdown-cell">
            <span className="countdown-value">{value}</span>
            <span className="countdown-unit">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
