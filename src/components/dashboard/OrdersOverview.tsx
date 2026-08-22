/*
  ==========================================================
  components/dashboard/OrdersOverview.tsx
  ----------------------------------------------------------
  نمودار توزیع وضعیت سفارش‌ها (Bar Chart). از Dashboard.tsx
  استخراج شده؛ منطق و خروجی بدون تغییر.

  statusMeta از همین‌جا export میشه چون RecentOrders.tsx هم
  برای رنگ/برچسبِ Badge بهش نیاز داره.
  ==========================================================
*/

import { useNavigate } from "react-router-dom";

import { ShoppingCart, BarChart3 } from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { Card } from "../ui/Card";

import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Order Status
  ==========================================================
*/

export const statusMeta = {
  pending: {
    label: "در انتظار",
    color: "var(--color-primary-200)",
    badge: "warning" as const,
  },

  processing: {
    label: "در حال پردازش",
    color: "var(--color-primary-300)",
    badge: "info" as const,
  },

  completed: {
    label: "تکمیل شده",
    color: "var(--color-primary-700)",
    badge: "success" as const,
  },

  cancelled: {
    label: "لغو شده",
    color: "var(--color-primary-900)",
    badge: "danger" as const,
  },
};

/*
  ==========================================================
  Custom Tooltip
  ==========================================================
*/

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-2xl border border-primary-300/30 bg-primary-900 px-4 py-2.5 text-white shadow-lg">
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: data.color }}
        />

        <span className="font-estedad text-xs font-medium text-primary-50">
          {data.label}
        </span>
      </div>

      <div className="mt-1 font-inter text-lg font-bold tracking-tight">
        {data.count.toLocaleString("fa-IR")}
      </div>

      <span className="font-estedad text-[10px] text-primary-100">سفارش</span>
    </div>
  );
};

/*
  ==========================================================
  Props
  ==========================================================
*/

interface OrdersOverviewProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  OrdersOverview Component
  ==========================================================
*/

function OrdersOverview({ summary }: OrdersOverviewProps) {
  const navigate = useNavigate();

  const statusChartData = (
    Object.keys(statusMeta) as Array<keyof typeof statusMeta>
  ).map((key) => ({
    key,
    label: statusMeta[key].label,
    count: summary.ordersByStatus[key],
    color: statusMeta[key].color,
  }));

  return (
    <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm desktop:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 px-6 py-4">
        <div>
          <h2 className="font-estedad text-base font-bold text-text-primary">
            توزیع وضعیت سفارش‌ها
          </h2>

          <p className="mt-0.5 font-estedad text-xs text-text-secondary">
            تحلیل آماری سفارش‌ها بر اساس آخرین داده‌ها
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/analytics")}
          className="group inline-flex items-center gap-1.5 rounded-xl border border-primary-300 bg-primary-50 px-3 py-1.5 font-estedad text-xs font-medium text-primary-900 transition-all hover:border-primary-700 hover:bg-primary-100"
        >
          <span>گزارش کامل</span>

          <BarChart3
            size={14}
            className="transition-transform group-hover:scale-110"
          />
        </button>
      </div>

      {summary.totalOrders === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-900">
            <ShoppingCart size={22} />
          </div>

          <p className="font-estedad text-xs text-text-secondary">
            هنوز هیچ سفارشی ثبت نشده است.
          </p>
        </div>
      ) : (
        <div className="h-80 px-4 py-6 tablet:px-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusChartData}
              margin={{
                top: 20,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="var(--color-primary-50)"
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-text-secondary)",
                  fontFamily: "Estedad",
                }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tick={{
                  fontSize: 10,
                  fill: "var(--color-text-secondary)",
                  fontFamily: "Inter",
                }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "var(--color-primary-900)",
                }}
              />

              <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={38}>
                {statusChartData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={entry.color}
                    className="transition-opacity ds-transition-slow hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export default OrdersOverview;
