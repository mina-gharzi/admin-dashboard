/*
  ==========================================================
  utils/format.ts
  ----------------------------------------------------------
  Centralized formatting functions
  
  استفاده:
  - formatPrice()
  - formatDate()
  - formatPhone()
  - capitalizeFirstLetter()
  - truncateText()
  ==========================================================
*/

/**
 * فرمت کردن قیمت به فارسی
 * @example
 * formatPrice(1000000) // "۱٬۰۰۰٬۰۰۰ تومان"
 */
export function formatPrice(
  price: number,
  includeCurrency = false
): string {
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
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);
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

/**
 * حذف فاصله‌ای از متن
 * @example
 * truncateText("سلام دنیا", 5) // "سلام..."
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix = "..."
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
}

/**
 * بزرگ کردن حرف اول
 * @example
 * capitalizeFirstLetter("سلام") // "سلام"
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * تبدیل حالت (مثل slug)
 * @example
 * toKebabCase("Hello World") // "hello-world"
 */
export function toKebabCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

/**
 * تبدیل متن به Persian Numbers
 * @example
 * toPersianNumber("123") // "۱۲۳"
 */
export function toPersianNumber(text: string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return text.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

/**
 * تبدیل Persian Numbers به English
 * @example
 * toEnglishNumber("۱۲۳") // "123"
 */
export function toEnglishNumber(text: string): string {
  const englishDigits = "0123456789";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  let result = text;
  
  for (let i = 0; i < 10; i++) {
    result = result.replace(
      new RegExp(persianDigits[i], "g"),
      englishDigits[i]
    );
  }
  
  return result;
}

/**
 * حساب کردن درصد
 * @example
 * calculatePercentage(50, 100) // 50
 */
export function calculatePercentage(
  value: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * تبدیل Bytes به Human Readable Format
 * @example
 * formatBytes(1024) // "1 KB"
 */
export function formatBytes(
  bytes: number,
  decimals = 2
): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * تبدیل Duration به Human Readable Format
 * @example
 * formatDuration(3661) // "1h 1m 1s"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.length > 0 ? parts.join(" ") : "0s";
}