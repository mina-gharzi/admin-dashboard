/*
  ==========================================================
  components/analytics/OrdersStatusChart.tsx
  ----------------------------------------------------------
  نمودار دایره‌ای توزیع وضعیت سفارش‌ها. از Analytics.tsx
  استخراج شده؛ منطق و خروجی بدون تغییر.

  statusMeta از همین‌جا export میشه چون RecentOrdersList.tsx
  هم برای رنگ/برچسبِ Badge بهش نیاز داره.

  توجه: نمودار «توزیع نقش اعضای تیم» که قبلاً کنار این
  نمودار بود، عمداً حذف شده (طبق درخواست).
  ==========================================================
*/

import { PieChart as PieIcon } from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import { Card } from "../ui/Card";

import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Meta / Labels
  ==========================================================
*/

export const statusMeta = {
  pending: { label: "در انتظار", color: "var(--color-warning)", badge: "warning" as const },
  processing: {
    label: "در حال پردازش",
    color: "var(--color-info)",
    badge: "info" as const,
  },
  completed: {
    label: "تکمیل شده",
    color: "var(--color-success)",
    badge: "success" as const,
  },
  cancelled: { label: "لغو شده", color: "var(--color-danger)", badge: "danger" as const },
};

/*
  ==========================================================
  Custom Tooltip
  ==========================================================
*/

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-primary-300/70 bg-surface/95 p-3 shadow-[var(--shadow-card-hover)] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="font-estedad text-xs font-bold text-text-primary">
            {data.name}
          </span>
        </div>
        <p className="mt-1 font-inter text-sm font-black text-text-primary">
          {data.value.toLocaleString("fa-IR")}{" "}
          <span className="font-estedad text-xs font-normal text-text-secondary">
            مورد
          </span>
        </p>
      </div>
    );
  }
  return null;
};

/*
  ==========================================================
  Props
  ==========================================================
*/

interface OrdersStatusChartProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  OrdersStatusChart Component
  ==========================================================
*/

function OrdersStatusChart({ summary }: OrdersStatusChartProps) {
  const ordersPieData = (
    Object.keys(statusMeta) as Array<keyof typeof statusMeta>
  )
    .map((key) => ({
      key,
      name: statusMeta[key].label,
      value: summary.ordersByStatus[key],
      color: statusMeta[key].color,
    }))
    .filter((d) => d.value > 0);

  return (
    <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
        <div>
          <h2 className="font-estedad text-base font-bold text-text-primary">
            توزیع وضعیت سفارش‌ها
          </h2>
          <p className="mt-0.5 font-estedad text-xs text-text-secondary">
            مجموع {summary.totalOrders.toLocaleString("fa-IR")} سفارش
            ثبت‌شده
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/70 text-primary-900">
          <PieIcon size={18} />
        </div>
      </div>

      {ordersPieData.length === 0 ? (
        <div className="flex h-72 items-center justify-center font-estedad text-xs text-text-secondary">
          هنوز سفارشی ثبت نشده است.
        </div>
      ) : (
        <div className="p-6">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ordersPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {ordersPieData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={entry.color}
                      className="transition-all ds-transition-slow hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-primary-100/60 pt-4">
            {ordersPieData.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-estedad text-xs font-semibold text-text-primary">
                  {item.name}
                </span>
                <span className="font-inter text-xs text-text-secondary">
                  ({item.value.toLocaleString("fa-IR")})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default OrdersStatusChart;
