import { Globe } from "lucide-react";
import { LANGUAGES, useI18n, type Lang } from "@/lib/i18n";

export function LanguageSelector() {
  const { lang, setLang, t } = useI18n();
  return (
    <label className="lang-select">
      <Globe className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{t.nav.language}</span>
      <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label={t.nav.language}>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.short} · {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
