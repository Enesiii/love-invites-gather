export function locationQuery(venue?: string | null, address?: string | null) {
  return [venue?.trim(), address?.trim()].filter(Boolean).join(", ");
}

export function locationHref(venue?: string | null, address?: string | null) {
  const query = locationQuery(venue, address);
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null;
}