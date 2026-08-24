/*
  ==========================================================
  utils/format.ts
  ----------------------------------------------------------
  Centralized formatting functions

  استفاده:
  - formatPrice()
  - formatPhone()

  نکته: formatDate() قبلاً اینجا بود ولی حذف شد — چون تاریخ
  تو کل پروژه (order.date، user.joinedAt، customer.lastOrderDate)
  همون لحظه‌ی ساخت به‌صورت رشته‌ی فارسیِ آماده ذخیره میشه
  (نه یه رشته‌ی قابل‌پارس مثل ISO)، formatDate هیچ‌وقت واقعاً
  چیزی رو فرمت نمی‌کرد و فقط رشته‌ی ورودی رو بی‌تغییر پس
  می‌داد. صفحاتی که این تاریخ‌ها رو نشون می‌دن (OrderTable،
  CustomerTable، OrderDetails، CustomerDetails و ...) مستقیم
  همون رشته رو رندر می‌کنن.
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
 * فرمت کردن شماره تماس
 * @example
 * formatPhone("09121234567") // "0912 123 45 67"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length !== 11) return phone;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
}
