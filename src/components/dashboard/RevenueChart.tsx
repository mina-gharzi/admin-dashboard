/*
  ==========================================================
  components/dashboard/RevenueChart.tsx
  ----------------------------------------------------------
  کارت برجسته‌ی درآمد کل (تکمیل‌شده). از Dashboard.tsx
  استخراج شده؛ منطق و خروجی بدون تغییر.
  ==========================================================
*/

import { CheckCircle2, DollarSign } from "lucide-react";

import { Card } from "../ui/Card";

import { formatPrice } from "../../utils/format";
import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Props
  ==========================================================
*/

interface RevenueChartProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  RevenueChart Component
  ==========================================================
*/

function RevenueChart({ summary }: RevenueChartProps) {
  return (
    <Card className="relative overflow-hidden border border-primary-200/60 bg-linear-to-br from-primary-50 via-primary-100/70 to-primary-200/50 p-6 shadow-sm tablet:col-span-2 desktop:col-span-1">
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-primary-300/30 blur-2xl" />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-primary-900 shadow-sm">
              <DollarSign size={24} strokeWidth={2.2} />
            </div>

            <span className="rounded-full bg-surface/80 px-3 py-1 font-estedad text-[11px] font-semibold text-primary-900 shadow-sm">
              تکمیل‌شده
            </span>
          </div>

          <span className="mt-6 block font-estedad text-xs font-medium text-primary-900/80">
            مجموع درآمد حاصله
          </span>

          <div className="mt-1 flex items-baseline gap-1">
            <p className="font-inter text-3xl font-black tracking-tight text-primary-900">
              {formatPrice(summary.totalRevenue)}
            </p>

            <span className="font-estedad text-xs font-bold text-primary-900">
              تومان
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-primary-900/10 pt-4">
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-surface/80 px-3 py-1.5 font-estedad text-xs font-semibold text-primary-900 shadow-sm">
            <CheckCircle2 size={14} className="text-primary-700" />

            <span>
              {summary.ordersByStatus.completed.toLocaleString("fa-IR")} سفارش
              موفق
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default RevenueChart;
