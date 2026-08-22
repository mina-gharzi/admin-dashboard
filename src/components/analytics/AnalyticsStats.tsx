/*
  ==========================================================
  components/analytics/AnalyticsStats.tsx
  ----------------------------------------------------------
  کارت‌های خلاصه‌ی گزارشات (درآمد، میانگین ارزش سفارش، نرخ
  تکمیل، محصولات کم‌موجود). از Analytics.tsx استخراج شده؛
  منطق و خروجی بدون تغییر.
  ==========================================================
*/

import { DollarSign, TrendingUp, ShoppingCart, AlertTriangle } from "lucide-react";

import { Card } from "../ui/Card";

import { formatPrice } from "../../utils/format";
import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Props
  ==========================================================
*/

interface AnalyticsStatsProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  AnalyticsStats Component
  ==========================================================
*/

function AnalyticsStats({ summary }: AnalyticsStatsProps) {
  const completionRate =
    summary.totalOrders > 0
      ? Math.round(
          (summary.ordersByStatus.completed / summary.totalOrders) * 100,
        )
      : 0;

  const summaryCards = [
    {
      title: "درآمد کل (تکمیل‌شده)",
      value: formatPrice(summary.totalRevenue),
      unit: "تومان",
      subTitle: `مجموع ${summary.ordersByStatus.completed.toLocaleString("fa-IR")} سفارش موفق`,
      icon: DollarSign,
      bg: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "میانگین ارزش سفارش",
      value: formatPrice(summary.averageOrderValue),
      unit: "تومان",
      subTitle: "ارزش هر سبد خرید",
      icon: TrendingUp,
      bg: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "نرخ تکمیل سفارش‌ها",
      value: `${completionRate}%`,
      unit: "موفقیت",
      subTitle: `${summary.ordersByStatus.completed} از ${summary.totalOrders} سفارش`,
      icon: ShoppingCart,
      bg: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "محصولات کم‌موجود",
      value: summary.lowStockProducts.length.toLocaleString("fa-IR"),
      unit: "محصول",
      subTitle: "نیازمند تامین موجودی انبار",
      icon: AlertTriangle,
      bg: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <section className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="group relative overflow-hidden border border-primary-300/60 p-5 transition-all ds-transition-slow hover:-translate-y-1 hover:border-primary-700/40 hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-estedad text-xs font-medium text-text-secondary">
                  {card.title}
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-inter text-2xl font-black tracking-tight text-text-primary">
                    {card.value}
                  </span>
                  <span className="font-estedad text-xs font-semibold text-text-secondary">
                    {card.unit}
                  </span>
                </div>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg} transition-transform ds-transition-slow group-hover:scale-110 shadow-sm`}
              >
                <Icon size={21} strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-4 border-t border-primary-100/60 pt-3">
              <span className="font-estedad text-[11px] font-semibold text-text-secondary">
                {card.subTitle}
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}

export default AnalyticsStats;
