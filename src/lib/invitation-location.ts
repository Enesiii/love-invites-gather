export function locationQuery(venue?: string | null, address?: string | null) {
  return [venue?.trim(), address?.trim()].filter(Boolean).join(", ");
}

// Existing invitations sometimes save a shared Maps link in the venue field.
// Accept only HTTPS Google Maps destinations, never arbitrary external URLs.
export function savedMapsHref(value?: string | null) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    const shared = url.hostname === "maps.app.goo.gl" || url.hostname === "goo.gl" && url.pathname.startsWith("/maps/");
    const maps = url.hostname === "maps.google.com" || (url.hostname === "www.google.com" || url.hostname === "google.com") && /^\/maps(?:\/|$)/.test(url.pathname);
    return shared || maps ? url.href : null;
  } catch {
    return null;
  }
}

export function locationHref(venue?: string | null, address?: string | null) {
  const saved = savedMapsHref(venue) ?? savedMapsHref(address);
  if (saved) return saved;
  const query = locationQuery(venue, address);
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
}

export function directionsHref(venue?: string | null, address?: string | null) {
  const saved = savedMapsHref(venue) ?? savedMapsHref(address);
  if (saved) return saved;
  const query = locationQuery(venue, address);
  return query ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}` : null;
}