/*
  ==========================================================
  OrderDetails.tsx
  ----------------------------------------------------------
  Order details page.
  ----------------------------------------------------------
  مسئولیت این صفحه:

  - دریافت سفارش واقعی بر اساس :id از URL
  - نمایش اطلاعات سفارش و مشتری
  - نمایش محصولات سفارش
  - نمایش مبلغ و وضعیت سفارش
  - امکان لغو سفارش (متصل به API)
  ==========================================================
*/

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import Button from "../components/ui/Button";

import { useData } from "../hooks/useData";
import { api } from "../services/api";
import { formatPrice } from "../utils/format";

/*
  ----------------------------------------------------------
  Status Configuration
  ----------------------------------------------------------
*/

const statusConfig = {
  pending: {
    label: "در انتظار",
    variant: "warning" as const,
    icon: Clock3,
  },
  processing: {
    label: "در حال پردازش",
    variant: "info" as const,
    icon: Truck,
  },
  completed: {
    label: "تکمیل شده",
    variant: "success" as const,
    icon: CheckCircle2,
  },
  cancelled: {
    label: "لغو شده",
    variant: "danger" as const,
    icon: XCircle,
  },
};

/*
  ----------------------------------------------------------
  Order Details Page
  ----------------------------------------------------------
*/

function OrderDetails() {
  const navigate = useNavigate();

  /*
    --------------------------------------------------------
    Order ID از URL
    --------------------------------------------------------
  */

  const { id } = useParams<{ id: string }>();

  /*
    --------------------------------------------------------
    Data Fetching
    --------------------------------------------------------
  */

  const {
    data: order,
    loading,
    error,
    refetch,
  } = useData(() => api.orders.getById(id ?? ""), [id]);

  /*
    --------------------------------------------------------
    Loading State
    --------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <p className="font-vazirmatn text-sm text-text-secondary">
          در حال بارگذاری سفارش...
        </p>
      </div>
    );
  }

  /*
    --------------------------------------------------------
    Error / Not Found State
    --------------------------------------------------------
  */

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <Package size={40} className="text-text-secondary" />

        <p className="font-vazirmatn text-sm text-text-secondary">
          سفارش مورد نظر پیدا نشد.
        </p>

        <Button variant="outline" onClick={() => navigate("/orders")}>
          <ArrowRight size={17} />
          بازگشت به سفارش‌ها
        </Button>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status];
  const StatusIcon = currentStatus.icon;
  const items = order.items ?? [];

  /*
    --------------------------------------------------------
    Actions
    --------------------------------------------------------
  */

  const handleCancelOrder = async () => {
    await api.orders.update(order.id, { status: "cancelled" });
    await refetch();
  };

  return (
    <div className="space-y-6">
      {/* ==================================================
          Page Header
          ================================================== */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
          aria-label="بازگشت"
        >
          <ArrowRight size={18} />
        </button>

        <div>
          <p className="font-inter text-xs text-text-secondary">
            Order #{order.id}
          </p>

          <h1 className="mt-1 font-vazirmatn text-2xl font-bold text-text-primary">
            جزئیات سفارش
          </h1>
        </div>
      </div>

      {/* ==================================================
          Status
          ================================================== */}

      <Card>
        <div className="flex flex-col gap-4 p-5 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-900">
              <StatusIcon size={21} />
            </div>

            <div>
              <p className="font-vazirmatn text-xs text-text-secondary">
                وضعیت سفارش
              </p>

              <p className="mt-1 font-vazirmatn text-sm font-medium text-text-primary">
                {currentStatus.label}
              </p>
            </div>
          </div>

          <Badge variant={currentStatus.variant}>{currentStatus.label}</Badge>
        </div>
      </Card>

      {/* ==================================================
          Main Content
          ================================================== */}

      <div className="grid gap-6 desktop:grid-cols-3">
        {/* Customer */}

        <Card>
          <div className="border-b border-border p-5">
            <h2 className="font-vazirmatn text-base font-bold text-text-primary">
              اطلاعات مشتری
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="font-vazirmatn text-xs text-text-secondary">نام</p>
              <p className="mt-1 font-vazirmatn text-sm font-medium text-text-primary">
                {order.customer}
              </p>
            </div>

            <div>
              <p className="font-vazirmatn text-xs text-text-secondary">
                ایمیل
              </p>
              <p className="mt-1 font-inter text-sm text-text-primary">
                {order.email}
              </p>
            </div>

            <div>
              <p className="font-vazirmatn text-xs text-text-secondary">
                شماره تماس
              </p>
              <p className="mt-1 font-inter text-sm text-text-primary">
                {order.phone || "ثبت نشده"}
              </p>
            </div>

            <div>
              <p className="font-vazirmatn text-xs text-text-secondary">
                آدرس
              </p>
              <p className="mt-1 font-vazirmatn text-sm leading-6 text-text-secondary">
                {order.address || "ثبت نشده"}
              </p>
            </div>
          </div>
        </Card>

        {/* Order Items */}

        <Card className="desktop:col-span-2">
          <div className="border-b border-border p-5">
            <h2 className="font-vazirmatn text-base font-bold text-text-primary">
              محصولات سفارش
            </h2>
          </div>

          <div>
            {items.length === 0 && (
              <p className="p-5 font-vazirmatn text-sm text-text-secondary">
                محصولی برای این سفارش ثبت نشده است.
              </p>
            )}

            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 border-b border-border p-5 last:border-0 tablet:flex-row tablet:items-center tablet:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background text-text-secondary">
                    <Package size={20} />
                  </div>

                  <div>
                    <p className="font-vazirmatn text-sm font-medium text-text-primary">
                      {item.name}
                    </p>

                    <p className="mt-1 font-vazirmatn text-xs text-text-secondary">
                      تعداد: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-vazirmatn text-sm font-medium text-text-primary">
                  {formatPrice(item.price)}{" "}
                  <span className="text-xs font-normal text-text-secondary">
                    تومان
                  </span>
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ==================================================
          Order Summary
          ================================================== */}

      <Card>
        <div className="border-b border-border p-5">
          <h2 className="font-vazirmatn text-base font-bold text-text-primary">
            خلاصه سفارش
          </h2>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span className="font-vazirmatn text-sm text-text-secondary">
              تاریخ سفارش
            </span>
            <span className="font-vazirmatn text-sm text-text-primary">
              {order.date}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-vazirmatn text-sm text-text-secondary">
              تعداد محصولات
            </span>
            <span className="font-vazirmatn text-sm text-text-primary">
              {items.length} محصول
            </span>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="font-vazirmatn text-sm font-medium text-text-primary">
                مبلغ نهایی
              </span>
              <span className="font-vazirmatn text-lg font-bold text-text-primary">
                {formatPrice(order.amount)}{" "}
                <span className="text-xs font-normal text-text-secondary">
                  تومان
                </span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ==================================================
          Actions
          ================================================== */}

      <div className="flex flex-col gap-3 tablet:flex-row tablet:justify-end">
        <Button variant="secondary" onClick={() => navigate("/orders")}>
          بازگشت به سفارش‌ها
        </Button>

        {order.status !== "completed" && order.status !== "cancelled" && (
          <Button variant="danger" onClick={handleCancelOrder}>
            لغو سفارش
          </Button>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
