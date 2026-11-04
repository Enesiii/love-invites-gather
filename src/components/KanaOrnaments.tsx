// Ornamente origjinale SVG për Kanagjegjin: tulipanë, trëndafila, arabeska, filigran.
// Ngjyrat vijnë nga currentColor që të ndjekin token-at e temës.

export function Tulip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M30 58 C18 52 14 38 18 22 C22 30 26 30 30 18 C34 30 38 30 42 22 C46 38 42 52 30 58Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M30 18 C28 34 28 46 30 58" />
      <path d="M30 58 C30 72 30 84 30 98" />
      <path d="M30 80 C20 76 12 68 10 60 C20 62 26 70 30 80Z" fill="currentColor" fillOpacity="0.14" />
      <path d="M30 88 C40 84 48 76 50 68 C40 70 34 78 30 88Z" fill="currentColor" fillOpacity="0.14" />
    </svg>
  );
}

export function Rose({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="40" cy="40" r="26" fill="currentColor" fillOpacity="0.12" />
      <path d="M40 22 C52 24 56 36 48 44 C42 50 32 46 34 38 C36 32 44 32 44 38" />
      <path d="M22 40 C22 56 36 64 50 58 C60 54 64 42 58 32" />
      <path d="M26 30 C30 20 44 16 54 22" />
      <path d="M32 62 C36 70 46 72 54 66" />
    </svg>
  );
}

// Kënd arabesk — përdoret katër herë, i rrotulluar, për kornizën e artë.
export function ArabesqueCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M6 114 V40 C6 20 20 6 40 6 H114" />
      <path d="M14 114 V46 C14 28 28 14 46 14 H114" opacity="0.6" />
      <path d="M22 60 C22 38 38 22 60 22 C50 30 46 40 48 52 C36 50 28 54 22 60Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M40 40 C50 46 54 56 52 70 M40 40 C46 50 56 54 70 52" />
      <circle cx="40" cy="40" r="4" fill="currentColor" />
      <path d="M70 52 C80 48 88 52 92 60 C84 62 76 60 70 52Z M52 70 C48 80 52 88 60 92 C62 84 60 76 52 70Z" fill="currentColor" fillOpacity="0.25" />
    </svg>
  );
}

export function FiligreeDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M4 12 H92 M148 12 H236" />
      <path d="M92 12 C100 2 110 2 120 12 C130 2 140 2 148 12 C140 22 130 22 120 12 C110 22 100 22 92 12Z" fill="currentColor" fillOpacity="0.18" />
      <circle cx="120" cy="12" r="3" fill="currentColor" />
      <path d="M60 12 C66 6 72 6 76 12 C72 18 66 18 60 12Z M164 12 C168 6 174 6 180 12 C174 18 168 18 164 12Z" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

// Medalion osman me rozetë me tetë petale.
export function Medallion({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="100" cy="100" r="94" />
      <circle cx="100" cy="100" r="86" strokeDasharray="2 5" />
      {petals.map((a) => (
        <path key={a} transform={`rotate(${a} 100 100)`} d="M100 6 C112 20 112 34 100 46 C88 34 88 20 100 6Z" fill="currentColor" fillOpacity="0.22" />
      ))}
      <circle cx="100" cy="100" r="72" />
    </svg>
  );
}
