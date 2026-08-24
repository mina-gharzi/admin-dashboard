import type { Order } from "./order";
import type { Product } from "./product";
import type { User } from "./user";

/*
  ----------------------------------------------------------
  Dashboard Summary
  ----------------------------------------------------------
  شکل خروجیِ api.analytics.getSummary() اینجا به‌صورت مستقل
  تعریف میشه (نه با Awaited<ReturnType<...>> از services/api).
  types/ باید منبع حقیقتِ شکل داده باشه؛ services/api.ts این
  type رو import می‌کنه و به‌عنوان return type استفاده می‌کنه،
  نه برعکس.
  ----------------------------------------------------------
*/

export interface DashboardSummary {
  totalUsers: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<Order["status"], number>;
  usersByRole: Record<User["role"], number>;
  usersByStatus: Record<User["status"], number>;
  totalCustomers: number;
  activeCustomers: number;
  productsByCategory: { category: string; count: number }[];
  lowStockProducts: Product[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  recentOrders: Order[];
}
