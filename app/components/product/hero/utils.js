export function truncate(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

export function toCents(amount) {
  if (!amount) return 0;
  const numeric = Number.parseFloat(String(amount));
  if (Number.isNaN(numeric)) return 0;
  return Math.round(numeric * 100);
}

export function formatMoneyNoDecimals(cents, currencyCode) {
  const amount = cents / 100;

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (_error) {
    return String(Math.round(amount));
  }
}

export function parseQuantityDiscounts(rawValue) {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        quantity: item?.quantity ?? '',
        percent: item?.percent ?? '',
      }))
      .filter((item) => item.quantity !== '' && item.percent !== '');
  } catch (_error) {
    return [];
  }
}
