const MONTHS = ["janar","shkurt","mars","prill","maj","qershor","korrik","gusht","shtator","tetor","nëntor","dhjetor"];
const DAYS = ["e diel","e hënë","e martë","e mërkurë","e enjte","e premte","e shtunë"];

export function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d + "T12:00:00");
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

