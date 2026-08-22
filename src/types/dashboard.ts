import type { api } from "../services/api";

/*
  ----------------------------------------------------------
  Dashboard Summary
  ----------------------------------------------------------
  همون تایپ خروجی api.analytics.getSummary()؛ فقط به یه
  نام مشخص export میشه تا کامپوننت‌های src/components/dashboard
  بتونن تایپ summary رو بدون تکرار import کنن.
  ----------------------------------------------------------
*/

export type DashboardSummary = Awaited<
  ReturnType<typeof api.analytics.getSummary>
>;
