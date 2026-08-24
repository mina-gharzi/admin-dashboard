/*
  ==========================================================
  utils/orderStatus.ts
  ----------------------------------------------------------
  منبع واحد حقیقت برای متادیتای وضعیت سفارش (برچسب فارسی،
  رنگ، و واریانت Badge).

  قبلاً این‌ها تو دو جای جدا تعریف شده بودن:
  - components/dashboard/OrdersOverview.tsx
  - components/analytics/OrdersStatusChart.tsx
  با همون ۴ وضعیت ولی رنگ‌های متفاوت — یعنی مثلاً «تکمیل شده»
  تو Dashboard یه رنگ داشت و تو Analytics رنگ دیگه‌ای، چون هیچ
  ارتباطی بین این دو کپی نبود. این فایل اون دو تا رو یکی کرده؛
  همه‌جای برنامه که وضعیت سفارش رو نشون میده (نمودارها، لیست
  سفارش‌های اخیر تو Dashboard و Analytics) از همینجا می‌خونن.
  ==========================================================
*/

import type { Order } from "../types/order";

export const statusMeta: Record<
  Order["status"],
  { label: string; color: string; badge: "warning" | "info" | "success" | "danger" }
> = {
  pending: {
    label: "در انتظار",
    color: "var(--color-warning)",
    badge: "warning",
  },
  processing: {
    label: "در حال پردازش",
    color: "var(--color-info)",
    badge: "info",
  },
  completed: {
    label: "تکمیل شده",
    color: "var(--color-success)",
    badge: "success",
  },
  cancelled: {
    label: "لغو شده",
    color: "var(--color-danger)",
    badge: "danger",
  },
};
