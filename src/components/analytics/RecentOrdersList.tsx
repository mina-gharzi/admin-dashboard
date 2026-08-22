/*
  ==========================================================
  components/analytics/RecentOrdersList.tsx
  ----------------------------------------------------------
  لیست «آخرین سفارش‌های ثبت‌شده». از Analytics.tsx استخراج
  شده؛ منطق و خروجی بدون تغییر.
  ==========================================================
*/

import { useNavigate } from "react-router-dom";

import { ShoppingBag, ArrowUpLeft } from "lucide-react";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

import { statusMeta } from "./OrdersStatusChart";

import { formatPrice } from "../../utils/format";
import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Props
  ==========================================================
*/

interface RecentOrdersListProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  RecentOrdersList Component
  ==========================================================
*/

function RecentOrdersList({ summary }: RecentOrdersListProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
        <div>
          <h2 className="font-estedad text-base font-bold text-text-primary">
            آخرین سفارش‌های ثبت‌شده
          </h2>
          <p className="mt-0.5 font-estedad text-xs text-text-secondary">
            فعالیت‌های اخیر سیستم
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/orders")}
          className="inline-flex items-center gap-1 font-estedad text-xs font-bold text-primary-900 transition-colors hover:text-primary-700 hover:underline"
        >
          <span>مشاهده همه</span>
          <ArrowUpLeft size={15} />
        </button>
      </div>

      <div className="divide-y divide-primary-100/60">
        {summary.recentOrders.length === 0 ? (
          <p className="p-8 text-center font-estedad text-xs text-text-secondary">
            سفارشی ثبت نشده است.
          </p>
        ) : (
          summary.recentOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => navigate(`/dashboard/orders/${order.id}`)}
              className="group flex w-full items-center justify-between px-6 py-4 text-right transition-colors hover:bg-primary-100/30"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100/80 font-inter text-xs font-bold text-primary-900 transition-colors group-hover:bg-primary-900 group-hover:text-white">
                  <ShoppingBag size={17} />
                </div>
                <div>
                  <p className="font-inter text-xs font-bold text-text-primary">
                    #{order.id}
                  </p>
                  <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                    {order.customer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-left">
                  <p className="font-inter text-xs font-bold text-text-primary">
                    {formatPrice(order.amount)}
                  </p>
                  <p className="font-estedad text-[10px] text-text-secondary">
                    تومان
                  </p>
                </div>
                <Badge variant={statusMeta[order.status].badge}>
                  {statusMeta[order.status].label}
                </Badge>
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}

export default RecentOrdersList;
