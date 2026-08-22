/*
  ==========================================================
  components/dashboard/TopProducts.tsx
  ----------------------------------------------------------
  لیست محصولات پرفروش. از Dashboard.tsx استخراج شده؛ منطق
  و خروجی بدون تغییر.
  ==========================================================
*/

import { ArrowUpLeft, Crown } from "lucide-react";

import { Card } from "../ui/Card";

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
      <div className="border-b border-primary-100 px-6 py-4">
        <h2 className="font-estedad text-base font-bold text-text-primary">
          محصولات پرفروش
        </h2>

        <p className="mt-0.5 font-estedad text-xs text-text-secondary">
          برترین محصولات بر اساس حجم فروش
        </p>
      </div>

      <div className="divide-y divide-primary-50">
        {summary.topProducts.length === 0 ? (
          <p className="px-6 py-10 text-center font-estedad text-xs text-text-secondary">
            هنوز فروشی ثبت نشده است.
          </p>
        ) : (
          summary.topProducts.map((product, index) => (
            <div
              key={product.name}
              className="group flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-primary-50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl font-inter text-xs font-bold ${
                    index === 0
                      ? "bg-primary-200 text-primary-900"
                      : index === 1
                        ? "bg-primary-100 text-primary-900"
                        : "bg-primary-50 text-primary-900"
                  }`}
                >
                  {index === 0 ? <Crown size={14} /> : index + 1}
                </span>

                <div>
                  <p className="font-estedad text-xs font-bold text-text-primary transition-colors group-hover:text-primary-900">
                    {product.name}
                  </p>

                  <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                    {product.quantity.toLocaleString("fa-IR")} عدد فروخته شده
                  </p>
                </div>
              </div>

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-900 opacity-0 transition-all group-hover:opacity-100">
                <ArrowUpLeft size={15} />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default TopProducts;
