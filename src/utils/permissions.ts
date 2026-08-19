/*
  ==========================================================
  permissions.ts
  ----------------------------------------------------------
  تعریف مرکزی دسترسی‌ها بر اساس نقش (RBAC)
  ----------------------------------------------------------
  قبلاً فیلد role تو authStore تعریف شده بود ولی هیچ‌جا واقعاً
  استفاده نمی‌شد — یعنی هر کاربر لاگین‌شده‌ای (حتی customer)
  می‌تونست به صفحات مدیریتی و اکشن‌های حساس دسترسی داشته باشه.

  این فایل تک‌منبع حقیقتِ دسترسی‌هاست، هم برای:
  - محافظت از route ها (RequireRole)
  - مخفی/غیرفعال کردن آیتم‌های Sidebar
  - مخفی/غیرفعال کردن دکمه‌های حساس داخل صفحات (حذف کاربر،
    پاک‌سازی داده‌ها و ...)

  نکته: چون این پروژه بک‌اند واقعی نداره، این فقط یه لایه‌ی
  UI/UX هست، نه یه مکانیزم امنیتی واقعی — جلوی کاربر مخرب رو
  با بازکردن Devtools نمی‌گیره. برای امنیت واقعی باید سرور هم
  همین قوانین رو enforce کنه.
  ==========================================================
*/

import type { AuthUser } from "../store/authStore";

export type Role = AuthUser["role"];

/*
  ----------------------------------------------------------
  برچسب فارسی نقش‌ها (یک‌جا، به‌جای تکرار تو چند فایل)
  ----------------------------------------------------------
*/

export const roleLabels: Record<Role, string> = {
  admin: "مدیر سیستم",
  manager: "مدیر فروش",
  customer: "مشتری",
};

/*
  ----------------------------------------------------------
  دسترسی به صفحات
  ----------------------------------------------------------
  کلید = مسیر (همون path که تو routes.tsx و Sidebar استفاده
  میشه)، مقدار = نقش‌هایی که اجازه‌ی ورود دارن.

  مسیرهایی که اینجا تعریف نشدن (مثل صفحات جزئیات) پیش‌فرض
  برای همه‌ی کاربرهای لاگین‌شده باز هستن.
  ----------------------------------------------------------
*/

const PAGE_ACCESS: Record<string, Role[]> = {
  "/dashboard": ["admin", "manager", "customer"],
  "/dashboard/users": ["admin", "manager"],
  "/dashboard/products": ["admin", "manager", "customer"],
  "/dashboard/orders": ["admin", "manager", "customer"],
  "/dashboard/analytics": ["admin", "manager"],
  "/dashboard/settings": ["admin", "manager", "customer"],
};

export function canAccessPath(role: Role | undefined, path: string): boolean {
  if (!role) return false;

  const allowedRoles = PAGE_ACCESS[path];

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
  /** پاک‌سازی کامل / بازنشانی داده‌های سیستم (Settings) */
  canManageSystemData: (role?: Role) => role === "admin",

  /** افزودن کاربر جدید */
  canCreateUser: (role?: Role) => role === "admin" || role === "manager",

  /** ویرایش کاربر */
  canEditUser: (role?: Role) => role === "admin" || role === "manager",

  /** حذف کاربر — حساس‌ترین اکشن، فقط ادمین */
  canDeleteUser: (role?: Role) => role === "admin",
} as const;
