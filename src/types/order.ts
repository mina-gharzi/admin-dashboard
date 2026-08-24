import type { OrderItem } from "./orderItem";

/*
  آرایه‌ی کانونیِ وضعیت‌های معتبر سفارش — تنها منبع حقیقت.
  خودِ union (`OrderStatus`) از همین آرایه مشتق میشه، پس
  هیچ‌جای دیگه‌ی پروژه این لیست رو جدا و به‌شکل دستی تکرار
  نمی‌کنه (نه تو validation، نه تو فرم‌ها).
*/
export const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items?: OrderItem[];
}

/*
  ----------------------------------------------------------
  Update Payload
  ----------------------------------------------------------
  برای api.orders.update — همون منطق UpdateUser/UpdateProduct:
  id از فیلدهای قابل‌تغییر حذف شده.
  ----------------------------------------------------------
*/
export type UpdateOrder = Partial<Omit<Order, "id">>;
