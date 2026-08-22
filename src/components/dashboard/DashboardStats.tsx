/*
  ==========================================================
  components/dashboard/DashboardStats.tsx
  ----------------------------------------------------------
  کارت‌های آمار کلی داشبورد (مشتریان، سفارش‌ها، درآمد،
  تنوع محصولات). از Dashboard.tsx استخراج شده؛ منطق و
  خروجی بدون تغییر.
  ==========================================================
*/

import { Users, ShoppingCart, DollarSign, Package } from "lucide-react";

import { Card } from "../ui/Card";

import { formatPrice } from "../../utils/format";
import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Props
  ==========================================================
*/

interface DashboardStatsProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  DashboardStats Component
  ==========================================================
*/

function DashboardStats({ summary }: DashboardStatsProps) {
  const statistics = [
    {
      title: "کل مشتریان",
      value: summary.totalCustomers.toLocaleString("fa-IR"),
      subLabel: `${summary.activeCustomers.toLocaleString("fa-IR")} مشتری فعال`,
      icon: Users,
      badgeText: "مشتریان",
    },

    {
      title: "سفارش‌ها",
      value: summary.totalOrders.toLocaleString("fa-IR"),
      subLabel: `${summary.ordersByStatus.pending.toLocaleString("fa-IR")} در انتظار پردازش`,
      icon: ShoppingCart,
      badgeText: "سفارش‌ها",
    },

    {
      title: "درآمد کل",
      value: formatPrice(summary.totalRevenue),
      unit: "تومان",
      subLabel: `میانگین سفارش: ${formatPrice(summary.averageOrderValue)}`,
      icon: DollarSign,
      badgeText: "مالی",
    },

    {
      title: "تنوع محصولات",
      value: summary.totalProducts.toLocaleString("fa-IR"),
      subLabel: `${summary.lowStockProducts.length.toLocaleString("fa-IR")} محصول کم‌موجود`,
      icon: Package,
      badgeText: "انبار",
    },
  ];

  return (
    <section className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
      {statistics.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border border-primary-300/60 p-5 shadow-sm transition-all ds-transition-slow hover:-translate-y-1 hover:border-primary-700/50 hover:shadow-md"
          >
            <div className="absolute -left-8 -top-8 h-20 w-20 rounded-full bg-primary-100/30 opacity-0 blur-2xl transition-opacity ds-transition-slow group-hover:opacity-100" />

            <div className="relative flex items-start justify-between">
              <div>
                <span className="font-estedad text-xs text-text-secondary">
                  {stat.title}
                </span>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-inter text-2xl font-black tracking-tight text-text-primary">
                    {stat.value}
                  </span>

                  {stat.unit && (
                    <span className="font-estedad text-xs text-text-secondary">
                      {stat.unit}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-900 transition-all ds-transition-slow group-hover:bg-primary-900 group-hover:text-white">
                <Icon size={20} strokeWidth={2} />
              </div>
            </div>

            <div className="relative mt-4 flex items-center justify-between border-t border-primary-100/60 pt-3">
              <span className="font-estedad text-[11px] font-medium text-text-secondary">
                {stat.subLabel}
              </span>

              <span className="rounded-md bg-primary-50 px-2 py-0.5 font-estedad text-[10px] text-primary-900">
                {stat.badgeText}
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}

export default DashboardStats;
