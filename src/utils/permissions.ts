/*
  ==========================================================
  permissions.ts
  ----------------------------------------------------------
  تعریف مرکزی دسترسی‌ها بر اساس نقش (RBAC)
  ----------------------------------------------------------
  این پنل فقط مخصوص کارکنانه — «مشتری» اصلاً یکی از نقش‌ها
  نیست و امکان ورود به پنل رو نداره. مشتری‌ها اصلاً کاربر
  این پنل نیستن؛ فقط سفارش ثبت می‌کنن و صرفاً برای مشاهده
  (تو صفحه‌ی «مشتریان») داخل پنل دیده میشن.

  نقش‌های پنل (از بالا به پایین، تقریباً بر اساس سطح دسترسی):
  - system_admin  → مدیر کل سیستم: دسترسی کامل، تنها نقشی که
    می‌تونه داده‌های سیستم رو پاک‌سازی/بازنشانی کنه و اعضای
    تیم (کارکنان) رو مدیریت کنه.
  - admin         → ادمین: مدیریت محصولات/سفارش‌ها، بدون
    دسترسی به پاک‌سازی داده‌ها یا مدیریت تیم.
  - sales_manager → مدیر فروش: مدیریت محصولات و سفارش‌ها،
    مشاهده‌ی گزارش‌ها.
  - salesperson   → فروشنده: مدیریت محصولات و سفارش‌ها،
    بدون دسترسی به گزارش‌های تحلیلی.
  - analyst       → تحلیل‌گر: فقط مشاهده (Read-only) در همه‌جا؛
    برای گزارش‌گیری، نه برای تغییر داده.

  این فایل تک‌منبع حقیقتِ دسترسی‌هاست، هم برای:
  - محافظت از route ها (RequireRole)
  - مخفی/غیرفعال کردن آیتم‌های Sidebar
  - مخفی/غیرفعال کردن دکمه‌های حساس داخل صفحات (پاک‌سازی
    داده‌ها، مدیریت تیم، افزودن/ویرایش محصول و سفارش و ...)

  نکته: چون این پروژه بک‌اند واقعی نداره، این فقط یه لایه‌ی
  UI/UX هست، نه یه مکانیزم امنیتی واقعی — جلوی کاربر مخرب رو
  با بازکردن Devtools نمی‌گیره. برای امنیت واقعی باید سرور هم
  همین قوانین رو enforce کنه.
  ==========================================================
*/

import { ROLES } from "../types/user";
import type { Role } from "../types/user";
import { dashboardPath, type DashboardPath } from "../routes/paths";

export type { Role };

/*
  ----------------------------------------------------------
  برچسب فارسی نقش‌ها (یک‌جا، به‌جای تکرار تو چند فایل)
  ----------------------------------------------------------
*/

export const roleLabels: Record<Role, string> = {
  system_admin: "مدیر کل سیستم",
  admin: "ادمین",
  sales_manager: "مدیر فروش",
  salesperson: "فروشنده",
  analyst: "تحلیل‌گر",
};

/** رنگ بج مناسب هر نقش — برای نمایش یکدست تو هرجا که نقش نشون داده میشه */
export const roleBadgeVariants: Record<
  Role,
  "primary" | "info" | "success" | "warning" | "neutral"
> = {
  system_admin: "primary",
  admin: "info",
  sales_manager: "success",
  salesperson: "warning",
  analyst: "neutral",
};

/*
  ----------------------------------------------------------
  دسترسی به صفحات
  ----------------------------------------------------------
  کلید = مسیر (از routes/paths.ts، همون منبعی که routes.tsx و
  Sidebar هم ازش می‌خونن)، مقدار = نقش‌هایی که اجازه‌ی ورود
  دارن.

  مسیرهایی که اینجا تعریف نشدن (مثل صفحات جزئیات) پیش‌فرض
  برای همه‌ی کاربرهای لاگین‌شده باز هستن.
  ----------------------------------------------------------
*/

const ALL_ROLES: Role[] = [...ROLES];

const PAGE_ACCESS: Partial<Record<DashboardPath, Role[]>> = {
  [dashboardPath.root]: ALL_ROLES,
  [dashboardPath.customers]: ALL_ROLES,
  [dashboardPath.products]: ALL_ROLES,
  [dashboardPath.orders]: ALL_ROLES,
  [dashboardPath.team]: ["system_admin"],
  [dashboardPath.analytics]: [
    "system_admin",
    "admin",
    "sales_manager",
    "analyst",
  ],
  [dashboardPath.settings]: ALL_ROLES,
};

export function canAccessPath(role: Role | undefined, path: string): boolean {
  if (!role) return false;

  /*
    location.pathname یه string خام از react-router هست، نه
    خودِ union `DashboardPath` — پس نمی‌تونیم مستقیم باهاش
    PAGE_ACCESS رو index کنیم. این cast فقط برای رد کردن ایندکس
    از سد type-checker هست، نه یه ادعای «این مسیر معتبره»؛
    اگه path جزو کلیدهای PAGE_ACCESS نباشه، allowedRoles همینجا
    undefined میشه و خط بعدی (مسیرهای تعریف‌نشده پیش‌فرض باز
    هستن) درست همون رو مدیریت می‌کنه.
  */
  const allowedRoles = PAGE_ACCESS[path as DashboardPath];

  // مسیرهای تعریف‌نشده (مثل /dashboard/products/:id) پیش‌فرض باز هستن
  if (!allowedRoles) return true;

  return allowedRoles.includes(role);
}

/*
  ----------------------------------------------------------
  دسترسی به اکشن‌های حساس
  ----------------------------------------------------------
  این‌ها اکشن‌های تکی هستن که حتی داخل یه صفحه‌ی قابل‌مشاهده
  ممکنه فقط برای بعضی نقش‌ها مجاز باشن.
  ----------------------------------------------------------
*/

export const permissions = {
  /** پاک‌سازی کامل / بازنشانی داده‌های سیستم (Settings) — فقط مدیر کل */
  canManageSystemData: (role?: Role) => role === "system_admin",

  /** افزودن/ویرایش/حذف محصول — تحلیل‌گر فقط مشاهده‌گره */
  canManageProducts: (role?: Role) => !!role && role !== "analyst",

  /** ویرایش/لغو سفارش — تحلیل‌گر فقط مشاهده‌گره */
  canManageOrders: (role?: Role) => !!role && role !== "analyst",
} as const;

