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
 * یک مقدار رو برای قرارگیری امن داخل یک سلول CSV آماده می‌کنه:
 * اگه شامل کاما، دابل‌کوت یا خط جدید باشه، داخل دابل‌کوت
 * می‌ذارتش و دابل‌کوت‌های داخلش رو escape می‌کنه.
 */
function escapeCsvCell(value: string | number | null | undefined): string {
  const stringValue = value === null || value === undefined ? "" : String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
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
  const headerRow = columns.map((column) => escapeCsvCell(column.header));

  const dataRows = data.map((row) =>
    columns.map((column) => escapeCsvCell(column.accessor(row))),
  );

  const csvContent = [headerRow, ...dataRows]
    .map((row) => row.join(","))
    .join("\r\n");

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
