/*
  ==========================================================
  exportToCsv.ts
  ----------------------------------------------------------
  خروجی گرفتن از یک آرایه از داده‌ها به‌صورت فایل CSV، طوری
  که هم مستقیم توی Excel باز بشه و هم متن فارسی توش درست
  نمایش داده بشه (با اضافه کردن UTF-8 BOM در ابتدای فایل —
  بدون این کاراکتر، اکسل فارسی رو به‌صورت کاراکترهای بی‌معنی
  نشون می‌ده).

  استفاده عمومیه (generic) تا برای هر جدولی (کاربران، محصولات،
  سفارش‌ها و ...) با تعریف ستون‌ها قابل استفاده باشه.
  ==========================================================
*/

export interface CsvColumn<T> {
  /** عنوان ستون که تو ردیف اول فایل نمایش داده میشه */
  header: string;
  /** مقداری که برای هر ردیف باید تو این ستون قرار بگیره */
  accessor: (row: T) => string | number | null | undefined;
}

/**
 * جلوگیری از «تزریق فرمول» (CSV injection): اگر متنی که کاربر وارد کرده با
 * = + - @ (یا tab / CR) شروع بشه، Excel و Google Sheets اون رو فرمول اجرا
 * می‌کنن. پیشوند ' باعث می‌شه به‌عنوان متن ساده باز بشه.
 * عددهای واقعی (و شماره‌های مثل +98912…) و خط تیره‌ی تنها (جای خالی) دست
 * نمی‌خورن.
 */
const FORMULA_START = /^[=+\-@\t\r]/;
const PLAIN_NUMBER_OR_DASH = /^([+-]?\d[\d.,]*|-)$/;

function neutralizeFormula(value: string): string {
  if (FORMULA_START.test(value) && !PLAIN_NUMBER_OR_DASH.test(value)) {
    return `'${value}`;
  }
  return value;
}

/**
 * یک مقدار رو برای قرارگیری امن داخل یک سلول CSV آماده می‌کنه:
 * فرمول‌ها خنثی می‌شن، و اگه شامل کاما، دابل‌کوت یا خط جدید باشه، داخل
 * دابل‌کوت می‌ره و دابل‌کوت‌های داخلش escape می‌شن.
 */
export function escapeCsvCell(
  value: string | number | null | undefined,
): string {
  const raw = value === null || value === undefined ? "" : String(value);
  // فقط متن‌ها بررسی می‌شن؛ مقدار number (مثل -5) فرمول نیست
  const stringValue = typeof value === "string" ? neutralizeFormula(raw) : raw;

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/** متن CSV (بدون BOM) برای داده‌ها و ستون‌های داده‌شده. تابع خالص و قابل‌تست. */
export function buildCsv<T>(data: T[], columns: CsvColumn<T>[]): string {
  const headerRow = columns.map((column) => escapeCsvCell(column.header));

  const dataRows = data.map((row) =>
    columns.map((column) => escapeCsvCell(column.accessor(row))),
  );

  return [headerRow, ...dataRows].map((row) => row.join(",")).join("\r\n");
}

/**
 * آرایه‌ای از داده‌ها رو بر اساس ستون‌های داده‌شده به CSV تبدیل
 * می‌کنه و دانلودش رو با نام فایل مشخص‌شده شروع می‌کنه.
 */
export function exportToCsv<T>(
  data: T[],
  columns: CsvColumn<T>[],
  filename: string,
): void {
  const csvContent = buildCsv(data, columns);

  // \uFEFF = UTF-8 BOM، برای نمایش درست فارسی در Excel
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * یک تاریخ ایزو ساده (مناسب برای اسم فایل) برمی‌گردونه،
 * مثل 2026-08-19 — چون تاریخ فارسی با / تو اسم فایل مشکل‌ساز میشه.
 */
export function getFileDateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}
