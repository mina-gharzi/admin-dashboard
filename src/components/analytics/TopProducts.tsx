/*
  ==========================================================
  components/analytics/TopProducts.tsx
  ----------------------------------------------------------
  لیست محصولات پرفروش (با درآمد هر محصول). از Analytics.tsx
  استخراج شده؛ منطق و خروجی بدون تغییر.
  ==========================================================
*/

import { Crown } from "lucide-react";

import { Card } from "../ui/Card";

import { formatPrice } from "../../utils/format";
import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Props
  ==========================================================
*/

interface TopProductsProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  TopProducts Component
  ==========================================================
*/

function TopProducts({ summary }: TopProductsProps) {
  return (
    <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
        <div>
          <h2 className="font-estedad text-base font-bold text-text-primary">
            محصولات پرفروش
          </h2>
          <p className="mt-0.5 font-estedad text-xs text-text-secondary">
            برترین‌ها بر اساس حجم فروش موفق
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/70 text-primary-900">
          <Crown size={18} />
        </div>
      </div>

      <div className="divide-y divide-primary-100/60">
        {summary.topProducts.length === 0 ? (
          <p className="p-8 text-center font-estedad text-xs text-text-secondary">
            هنوز فروشی ثبت نشده است.
          </p>
        ) : (
          summary.topProducts.map((product, index) => (
            <div
              key={product.name}
              className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-primary-100/20"
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl font-inter text-xs font-bold ${
                    index === 0
                      ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200"
                      : index === 1
                        ? "bg-slate-200 text-slate-700 ring-2 ring-slate-300"
                        : index === 2
                          ? "bg-orange-100 text-orange-800 ring-2 ring-orange-200"
                          : "bg-primary-100 text-primary-900"
                  }`}
                >
                  {index === 0 ? <Crown size={15} /> : index + 1}
                </span>
                <div>
                  <p className="font-estedad text-xs font-bold text-text-primary group-hover:text-primary-900 transition-colors">
                    {product.name}
                  </p>
                  <p className="mt-0.5 font-inter text-[11px] text-text-secondary">
                    {product.quantity.toLocaleString("fa-IR")} فروش موفق
                  </p>
                </div>
              </div>

              <div className="text-left">
                <p className="font-inter text-xs font-bold text-text-primary">
                  {formatPrice(product.revenue)}
                </p>
                <p className="font-estedad text-[10px] text-text-secondary">
                  تومان
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default TopProducts;
