export const formattedDate = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDate(date) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatCurrency(code, number) {
  const currency_format = new Intl.NumberFormat(undefined, {
    currency: code ? code : "NGN",
    style: "currency",
  });
  return currency_format.format(number);
}
