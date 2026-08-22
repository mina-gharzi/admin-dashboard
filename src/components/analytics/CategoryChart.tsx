/*
  ==========================================================
  components/analytics/CategoryChart.tsx
  ----------------------------------------------------------
  نمودار ستونی «تنوع محصولات به تفکیک دسته‌بندی». از
  Analytics.tsx استخراج شده؛ منطق و خروجی بدون تغییر.
  ==========================================================
*/

import { BarChart3 } from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Card } from "../ui/Card";

import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Custom Tooltip
  ==========================================================
*/

const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-primary-300/70 bg-surface/95 p-3 shadow-[var(--shadow-card-hover)] backdrop-blur-md">
        <span className="font-estedad text-xs font-bold text-text-primary">
          {data.payload.category}
        </span>
        <p className="mt-1 font-inter text-sm font-black text-primary-900">
          {data.value.toLocaleString("fa-IR")}{" "}
          <span className="font-estedad text-xs font-normal text-text-secondary">
            محصول
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

interface CategoryChartProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  CategoryChart Component
  ==========================================================
*/

function CategoryChart({ summary }: CategoryChartProps) {
  const categoryBarData = summary.productsByCategory;

  return (
    <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
        <div>
          <h2 className="font-estedad text-base font-bold text-text-primary">
            تنوع محصولات به تفکیک دسته‌بندی
          </h2>
          <p className="mt-0.5 font-estedad text-xs text-text-secondary">
            مجموع {summary.totalProducts.toLocaleString("fa-IR")} محصول در
            انبار
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/70 text-primary-900">
          <BarChart3 size={18} />
        </div>
      </div>

      {categoryBarData.length === 0 ? (
        <div className="flex h-64 items-center justify-center font-estedad text-xs text-text-secondary">
          هنوز محصولی ثبت نشده است.
        </div>
      ) : (
        <div className="h-80 p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryBarData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="var(--color-primary-50)"
              />
              <XAxis
                dataKey="category"
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
                tick={{ fontSize: 10, fill: "var(--color-text-secondary)", fontFamily: "Inter" }}
              />
              <Tooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: "var(--color-primary-900)" }}
              />
              <Bar
                dataKey="count"
                fill="var(--color-primary-900)"
                radius={[10, 10, 0, 0]}
                barSize={42}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export default CategoryChart;
