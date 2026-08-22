/*
  ==========================================================
  components/analytics/LowStockProducts.tsx
  ----------------------------------------------------------
  لیست محصولات کم‌موجود انبار. از Analytics.tsx استخراج
  شده؛ منطق و خروجی بدون تغییر.
  ==========================================================
*/

import { useNavigate } from "react-router-dom";

import { AlertTriangle, Package, ArrowUpLeft } from "lucide-react";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

import type { DashboardSummary } from "../../types/dashboard";

/*
  ==========================================================
  Props
  ==========================================================
*/

interface LowStockProductsProps {
  summary: DashboardSummary;
}

/*
  ==========================================================
  LowStockProducts Component
  ==========================================================
*/

function LowStockProducts({ summary }: LowStockProductsProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-primary-300/60 px-6 py-4">
        <div>
          <h2 className="font-estedad text-base font-bold text-text-primary">
            محصولات کم‌موجود انبار
          </h2>
          <p className="mt-0.5 font-estedad text-xs text-text-secondary">
            موجودی ۵ عدد یا کمتر
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <AlertTriangle size={18} />
        </div>
      </div>

      <div className="divide-y divide-primary-100/60">
        {summary.lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-10 text-center font-estedad text-xs text-text-secondary">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
              <Package size={20} />
            </div>
            <p className="mt-2 font-bold text-text-primary">
              موجودی انبار ایده‌آل است!
            </p>
            <p>هیچ محصولی با کمبود موجودی مواجه نیست.</p>
          </div>
        ) : (
          summary.lowStockProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => navigate(`/dashboard/products/${product.id}`)}
              className="group flex w-full items-center justify-between px-6 py-4 text-right transition-colors hover:bg-primary-100/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger">
                  <Package size={16} />
                </div>
                <div>
                  <p className="font-estedad text-xs font-bold text-text-primary group-hover:text-primary-900 transition-colors">
                    {product.name}
                  </p>
                  <p className="mt-0.5 font-inter text-[11px] text-text-secondary">
                    شناسه: #{product.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={product.stock === 0 ? "danger" : "warning"}>
                  {product.stock === 0 ? "ناموجود" : `${product.stock} عدد`}
                </Badge>
                <ArrowUpLeft
                  size={15}
                  className="text-text-secondary opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}

export default LowStockProducts;
