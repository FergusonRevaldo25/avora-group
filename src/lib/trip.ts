export const toUTC = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

export const isRealDate = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return new Date(toUTC(iso)).toISOString().slice(0, 10) === iso;
};

export const nightsBetween = (checkIn: string, checkOut: string) =>
  Math.round((toUTC(checkOut) - toUTC(checkIn)) / 86_400_000);

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const stayQuote = (rate: number, cleaning: number, nights: number) => ({
  nights,
  subtotal: rate * nights,
  cleaning,
  total: rate * nights + cleaning,
});

export const formatZAR = (n: number) =>
  "R" + Math.round(n).toLocaleString("en-ZA").replace(/\s/g, ",");
