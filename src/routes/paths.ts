/*
  ==========================================================
  routes/paths.ts
  ----------------------------------------------------------
  منبع واحد برای مسیرهای زیر /dashboard.

  چرا این فایل لازم بود؟
  قبلاً `PAGE_ACCESS` تو utils/permissions.ts مسیرها رو به‌شکل
  string literal دستی تکرار می‌کرد ("/dashboard/team" و...) —
  کاملاً جدا از segment هایی که واقعاً تو routes.tsx تعریف
  می‌شدن. اگه یه مسیر تو routes.tsx تغییر نام می‌داد (مثلاً
  "team" → "staff")، هیچ ارتباط type-level ای بین اون دو
  وجود نداشت که خطا بده — کنترل دسترسی بی‌صدا از کار می‌افتاد.

  حالا routes.tsx، permissions.ts (PAGE_ACCESS) و
  Sidebar.tsx/RequireRole.tsx همه از همین چند ثابت می‌خونن؛
  تغییر یه مسیر فقط تو همین فایل انجام میشه و همه‌جا خودش رو
  به‌روز می‌کنه.
  ==========================================================
*/

/** segment های نسبی — دقیقاً همون‌هایی که تو routes.tsx به‌عنوان `path` استفاده میشن */
export const DASHBOARD_SEGMENTS = {
  customers: "customers",
  customerDetails: "customers/:email",
  products: "products",
  productDetails: "products/:id",
  orders: "orders",
  orderDetails: "orders/:id",
  analytics: "analytics",
  team: "team",
  settings: "settings",
  forbidden: "forbidden",
} as const;

const DASHBOARD_ROOT = "/dashboard";

/** مسیرهای مطلق — برای PAGE_ACCESS، لینک‌های Sidebar، و ریدایرکت‌های RequireRole/RequireAuth */
export const dashboardPath = {
  root: DASHBOARD_ROOT,
  customers: `${DASHBOARD_ROOT}/${DASHBOARD_SEGMENTS.customers}`,
  products: `${DASHBOARD_ROOT}/${DASHBOARD_SEGMENTS.products}`,
  orders: `${DASHBOARD_ROOT}/${DASHBOARD_SEGMENTS.orders}`,
  analytics: `${DASHBOARD_ROOT}/${DASHBOARD_SEGMENTS.analytics}`,
  team: `${DASHBOARD_ROOT}/${DASHBOARD_SEGMENTS.team}`,
  settings: `${DASHBOARD_ROOT}/${DASHBOARD_SEGMENTS.settings}`,
  forbidden: `${DASHBOARD_ROOT}/${DASHBOARD_SEGMENTS.forbidden}`,
} as const;

export type DashboardPath = (typeof dashboardPath)[keyof typeof dashboardPath];
