const wardDateFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "America/Argentina/Buenos_Aires",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getWardToday(): string {
  return wardDateFormatter.format(new Date());
}

export function getUpcomingSunday(today = getWardToday()): string {
  const sunday = new Date(`${today}T00:00:00Z`);
  const daysUntilSunday = (7 - sunday.getUTCDay()) % 7;

  sunday.setUTCDate(sunday.getUTCDate() + daysUntilSunday);
  return sunday.toISOString().slice(0, 10);
}