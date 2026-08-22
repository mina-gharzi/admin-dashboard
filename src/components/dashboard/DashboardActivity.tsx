/*
  ==========================================================
  components/dashboard/DashboardActivity.tsx
  ----------------------------------------------------------
  خلاصه‌ی عملکرد (نرخ تکمیل سفارش‌ها، نرخ مشتریان فعال،
  نرخ محصولات فعال). از Dashboard.tsx استخراج شده؛ منطق و
  خروجی بدون تغییر.
  ==========================================================
*/

import { Card } from "../ui/Card";

import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Props
  ==========================================================
*/

interface DashboardActivityProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  DashboardActivity Component
  ==========================================================
*/

function DashboardActivity({ summary }: DashboardActivityProps) {
  const completionRate =
    summary.totalOrders > 0
      ? Math.round(
          (summary.ordersByStatus.completed / summary.totalOrders) * 100,
        )
      : 0;

  const activeCustomerRate =
    summary.totalCustomers > 0
      ? Math.round((summary.activeCustomers / summary.totalCustomers) * 100)
      : 0;

  const activeProductRate =
    summary.totalProducts > 0
      ? Math.round((summary.activeProducts / summary.totalProducts) * 100)
      : 0;

  return (
    <Card className="border border-primary-300/60 p-0 shadow-sm">
      <div className="border-b border-primary-100 px-6 py-4">
        <h2 className="font-estedad text-base font-bold text-text-primary">
          خلاصه عملکرد
        </h2>

        <p className="mt-0.5 font-estedad text-xs text-text-secondary">
          نرخ سلامت و فعال بودن سیستم
        </p>
      </div>

      <div className="space-y-5 p-6">
        {/* Completion */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-estedad text-xs font-medium text-text-secondary">
              نرخ تکمیل سفارش‌ها
            </span>

            <span className="font-inter text-xs font-bold text-text-primary">
              {completionRate}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-primary-50">
            <div
              className="h-full rounded-full bg-primary-900 transition-all ds-transition-emphasis"
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>
        </div>

        {/* Active Customers */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-estedad text-xs font-medium text-text-secondary">
              نرخ مشتریان فعال
            </span>

            <span className="font-inter text-xs font-bold text-text-primary">
              {activeCustomerRate}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-primary-50">
            <div
              className="h-full rounded-full bg-primary-700 transition-all ds-transition-emphasis"
              style={{
                width: `${activeCustomerRate}%`,
              }}
            />
          </div>
        </div>

        {/* Active Products */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-estedad text-xs font-medium text-text-secondary">
              نرخ محصولات فعال
            </span>

            <span className="font-inter text-xs font-bold text-text-primary">
              {activeProductRate}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-primary-50">
            <div
              className="h-full rounded-full bg-primary-300 transition-all ds-transition-emphasis"
              style={{
                width: `${activeProductRate}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DashboardActivity;
