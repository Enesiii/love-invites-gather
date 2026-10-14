const MONTHS = ["janar","shkurt","mars","prill","maj","qershor","korrik","gusht","shtator","tetor","nëntor","dhjetor"];
const DAYS = ["e diel","e hënë","e martë","e mërkurë","e enjte","e premte","e shtunë"];

export function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d + "T12:00:00");
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

// Data e përgjigjes, e formatuar në mënyrë deterministe (pa locale) që SSR dhe
// shfletuesi të japin të njëjtin tekst — pa gabim hidratimi.
export function formatDateTime(d: string) {
  if (!d) return "";
  const date = new Date(d);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}
