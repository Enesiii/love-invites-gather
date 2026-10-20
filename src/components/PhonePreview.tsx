import type { ReactNode } from "react";

// Kornizë telefoni dekorative që paraqet ftesën si në një ekran celulari.
export function PhonePreview({ children }: { children: ReactNode }) {
  return (
    <div className="phone-preview">
      <div className="phone-frame">
        <div className="phone-notch" aria-hidden="true">
          <span className="phone-camera" />
          <span className="phone-speaker" />
        </div>
        <div className="phone-screen">{children}</div>
        <div className="phone-home" aria-hidden="true" />
      </div>
    </div>
  );
}
