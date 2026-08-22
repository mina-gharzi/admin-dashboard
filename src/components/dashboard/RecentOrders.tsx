/*
  ==========================================================
  components/dashboard/RecentOrders.tsx
  ----------------------------------------------------------
  لیست آخرین سفارش‌ها. از Dashboard.tsx استخراج شده؛ منطق و
  خروجی بدون تغییر.
  ==========================================================
*/

import { useNavigate } from "react-router-dom";

import { ChevronLeft } from "lucide-react";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

import { statusMeta } from "./OrdersOverview";

import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Props
  ==========================================================
*/

interface RecentOrdersProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  RecentOrders Component
  ==========================================================
*/

function RecentOrders({ summary }: RecentOrdersProps) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col overflow-hidden border border-primary-300/60 p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-primary-100 px-6 py-4">
        <div>
          <h2 className="font-estedad text-base font-bold text-text-primary">
            سفارش‌های اخیر
          </h2>

          <p className="mt-0.5 font-estedad text-xs text-text-secondary">
            آخرین تراکنش‌ها
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/orders")}
          className="inline-flex items-center gap-1 font-estedad text-xs font-semibold text-primary-900 transition-colors hover:text-primary-700 hover:underline"
        >
          <span>مشاهده همه</span>
          <ChevronLeft size={14} />
        </button>
      </div>

      <div className="flex-1 divide-y divide-primary-50 overflow-y-auto">
        {summary.recentOrders.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center font-estedad text-xs text-text-secondary">
            سفارشی ثبت نشده است.
          </div>
        ) : (
          summary.recentOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => navigate(`/dashboard/orders/${order.id}`)}
              className="group flex w-full items-center justify-between px-6 py-3.5 text-right transition-colors hover:bg-primary-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 font-inter text-xs font-bold text-primary-900 transition-colors group-hover:bg-primary-900 group-hover:text-white">
                  #{order.id.toString().slice(-2)}
                </div>

                <div>
                  <p className="font-inter text-xs font-semibold text-text-primary">
                    #{order.id}
                  </p>

                  <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                    {order.customer}
                  </p>
                </div>
              </div>

              <Badge variant={statusMeta[order.status].badge}>
                {statusMeta[order.status].label}
              </Badge>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}

export default RecentOrders;
