// Ornamente origjinale SVG për Synetin: yje, kurorë, kënde gjeometrike, ndarës me shkëndija.
// Ngjyrat vijnë nga currentColor që të ndjekin token-at e temës.

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M30 4 L36.5 22.5 L56 23.5 L40.5 36 L46 55 L30 44 L14 55 L19.5 36 L4 23.5 L23.5 22.5 Z" fill="currentColor" fillOpacity="0.22" />
      <path d="M30 14 L33.5 25 L45 25.5 L36 32.5 L39 44 L30 37.5 L21 44 L24 32.5 L15 25.5 L26.5 25 Z" fill="currentColor" fillOpacity="0.35" />
    </svg>
  );
}

// Kurorë elegante për temën "Princi i Vogël".
export function Crown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 62 L8 26 L34 44 L60 12 L86 44 L112 26 L108 62 Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 62 H108" />
      <path d="M16 70 H104" />
      <circle cx="8" cy="22" r="4" fill="currentColor" />
      <circle cx="60" cy="8" r="5" fill="currentColor" />
      <circle cx="112" cy="22" r="4" fill="currentColor" />
      <circle cx="34" cy="52" r="3" fill="currentColor" fillOpacity="0.6" />
      <circle cx="60" cy="52" r="3.5" fill="currentColor" fillOpacity="0.6" />
      <circle cx="86" cy="52" r="3" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

// Kënd gjeometrik me yll — përdoret katër herë, i rrotulluar, për kornizën.
export function GeoCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M6 114 V50 C6 26 26 6 50 6 H114" />
      <path d="M16 114 V56 C16 34 34 16 56 16 H114" opacity="0.55" />
      <path d="M46 46 L50 56 L60 60 L50 64 L46 74 L42 64 L32 60 L42 56 Z" fill="currentColor" fillOpacity="0.5" />
      <circle cx="46" cy="46" r="0" />
      <path d="M70 30 C78 34 82 42 80 52 M30 70 C34 78 42 82 52 80" opacity="0.7" />
      <circle cx="90" cy="16" r="2.5" fill="currentColor" fillOpacity="0.7" />
      <circle cx="16" cy="90" r="2.5" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

// Ndarës me yll qendror dhe shkëndija.
export function SparkleDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M4 12 H96 M144 12 H236" />
      <path d="M120 2 L123 9 L130 12 L123 15 L120 22 L117 15 L110 12 L117 9 Z" fill="currentColor" fillOpacity="0.55" />
      <path d="M84 8 L86 11 L89 12 L86 13 L84 16 L82 13 L79 12 L82 11 Z" fill="currentColor" fillOpacity="0.4" />
      <path d="M156 8 L158 11 L161 12 L158 13 L156 16 L154 13 L151 12 L154 11 Z" fill="currentColor" fillOpacity="0.4" />
      <circle cx="60" cy="12" r="1.8" fill="currentColor" fillOpacity="0.5" />
      <circle cx="180" cy="12" r="1.8" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

// Kumonë festore me yje të vegjël (për temën e qiellit).
export function Bunting({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 60" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M4 6 C80 34 240 34 316 6" />
      {[40, 100, 160, 220, 280].map((x, i) => (
        <path key={x} d={`M${x - 14} ${20 + (i % 2) * 4} L${x + 14} ${20 + (i % 2) * 4} L${x} ${44 + (i % 2) * 4} Z`} fill="currentColor" fillOpacity={i % 2 ? 0.3 : 0.16} />
      ))}
      <path d="M160 8 L161.8 11.5 L165.5 12 L161.8 12.5 L160 16 L158.2 12.5 L154.5 12 L158.2 11.5 Z" fill="currentColor" fillOpacity="0.6" stroke="none" />
    </svg>
  );
}
