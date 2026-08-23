/*
  ==========================================================
  utils/format.ts
  ----------------------------------------------------------
  Centralized formatting functions

  استفاده:
  - formatPrice()
  - formatDate()
  - formatPhone()
  ==========================================================
*/

/**
 * فرمت کردن قیمت به فارسی
 * @example
 * formatPrice(1000000) // "۱٬۰۰۰٬۰۰۰ تومان"
 */
export function formatPrice(price: number, includeCurrency = false): string {
  const formatted = new Intl.NumberFormat("fa-IR").format(price);
  return includeCurrency ? `${formatted} تومان` : formatted;
}

/**
 * فرمت کردن تاریخ به فارسی
 * @example
 * formatDate("2024-01-15") // "۱۴۰۲/۱۰/۲۵"
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options,
  }).format(date);
}

/**
 * فرمت کردن شماره تماس
 * @example
 * formatPhone("09121234567") // "0912 123 45 67"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length !== 11) return phone;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
}
