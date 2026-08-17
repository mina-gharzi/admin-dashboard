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

/*
  ==========================================================
  OrderDetails.tsx
  ----------------------------------------------------------
  Order details page — Dashboard design language
  ==========================================================
*/

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Edit,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import Button from "../components/ui/Button";

import OrderFormModal from "../components/order/OrderFormModal";

import { useData } from "../hooks/useData";
import { api, type Order } from "../services/api";
import { formatPrice } from "../utils/format";

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

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: order,
    loading,
    error,
    refetch,
  } = useData(() => api.orders.getById(id ?? ""), [id]);

  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-16">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
          <p className="font-estedad text-sm text-text-secondary">
            در حال بارگذاری سفارش...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 p-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
          <Package size={28} />
        </div>
        <div>
          <p className="font-estedad text-sm font-semibold text-text-primary">
            سفارش مورد نظر پیدا نشد
          </p>
          <p className="mt-1.5 font-estedad text-xs text-text-secondary">
            ممکن است سفارش حذف شده یا شناسه اشتباه باشد.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/dashboard/orders")}>
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
    Edit Modal
  */
  const handleEditSubmit = async (data: Partial<Order>) => {
    await api.orders.update(order.id, data);
    toast.success(`سفارش #${order.id} ویرایش شد.`);
    await refetch();
  };

  /*
    Cancel Confirmation
  */
  const handleCancelConfirm = async () => {
    setCancelling(true);
    try {
      await api.orders.update(order.id, { status: "cancelled" });
      toast.info(`سفارش #${order.id} لغو شد.`);
      await refetch();
      setCancelOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/orders")}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-2xl border border-primary-300
            text-text-secondary transition-all
            hover:border-primary-900 hover:bg-primary-50 hover:text-primary-900
            active:scale-95
          "
          aria-label="بازگشت"
        >
          <ArrowRight size={18} />
        </button>

        <div>
          <p className="font-inter text-xs text-text-secondary">
            Order #{order.id}
          </p>
          <h1 className="mt-1 font-estedad text-2xl font-bold tracking-tight text-text-primary">
            جزئیات سفارش
          </h1>
        </div>
      </div>

      {/* Status Card */}
      <Card className="overflow-hidden border-primary-300 p-0">
        <div className="flex flex-col gap-4 px-6 py-5 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <StatusIcon size={22} strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-estedad text-xs text-text-secondary">
                وضعیت سفارش
              </p>
              <p className="mt-1 font-estedad text-sm font-semibold text-text-primary">
                {currentStatus.label}
              </p>
            </div>
          </div>

          <Badge variant={currentStatus.variant}>{currentStatus.label}</Badge>
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid gap-6 desktop:grid-cols-3">
        {/* Customer Info */}
        <Card className="overflow-hidden border-primary-300 p-0">
          <div className="border-b border-primary-300 px-6 py-4">
            <h2 className="font-estedad text-base font-semibold text-text-primary">
              اطلاعات مشتری
            </h2>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div>
              <p className="font-estedad text-xs text-text-secondary">نام</p>
              <p className="mt-1.5 font-estedad text-sm font-medium text-text-primary">
                {order.customer}
              </p>
            </div>
            <div>
              <p className="font-estedad text-xs text-text-secondary">ایمیل</p>
              <p className="mt-1.5 font-inter text-sm text-text-primary">
                {order.email}
              </p>
            </div>
            <div>
              <p className="font-estedad text-xs text-text-secondary">
                شماره تماس
              </p>
              <p className="mt-1.5 font-inter text-sm text-text-primary">
                {order.phone || "ثبت نشده"}
              </p>
            </div>
            <div>
              <p className="font-estedad text-xs text-text-secondary">آدرس</p>
              <p className="mt-1.5 font-estedad text-sm leading-6 text-text-secondary">
                {order.address || "ثبت نشده"}
              </p>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="overflow-hidden border-primary-300 p-0 desktop:col-span-2">
          <div className="border-b border-primary-300 px-6 py-4">
            <h2 className="font-estedad text-base font-semibold text-text-primary">
              محصولات سفارش
            </h2>
          </div>

          <div>
            {items.length === 0 && (
              <p className="px-6 py-8 font-estedad text-sm text-text-secondary">
                محصولی برای این سفارش ثبت نشده است.
              </p>
            )}

            {items.map((item) => (
              <div
                key={item.id}
                className="
                  flex flex-col gap-4 border-b border-border/80 px-6 py-4
                  last:border-0
                  tablet:flex-row tablet:items-center tablet:justify-between
                "
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-900">
                    <Package size={19} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-estedad text-sm font-semibold text-text-primary">
                      {item.name}
                    </p>
                    <p className="mt-1 font-estedad text-xs text-text-secondary">
                      تعداد: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-estedad text-sm font-semibold text-text-primary">
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

      {/* Summary */}
      <Card className="overflow-hidden border-primary-300 p-0">
        <div className="border-b border-primary-300 px-6 py-4">
          <h2 className="font-estedad text-base font-semibold text-text-primary">
            خلاصه سفارش
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="font-estedad text-sm text-text-secondary">
              تاریخ سفارش
            </span>
            <span className="font-estedad text-sm text-text-primary">
              {order.date}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-estedad text-sm text-text-secondary">
              تعداد محصولات
            </span>
            <span className="font-estedad text-sm text-text-primary">
              {items.length} محصول
            </span>
          </div>

          <div className="border-t border-primary-300 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-estedad text-sm font-medium text-text-primary">
                مبلغ نهایی
              </span>
              <span className="font-estedad text-xl font-bold text-primary-900">
                {formatPrice(order.amount)}{" "}
                <span className="text-xs font-normal text-text-secondary">
                  تومان
                </span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 tablet:flex-row tablet:justify-end">
        <Button variant="secondary" onClick={() => navigate("/dashboard/orders")}>
          بازگشت به سفارش‌ها
        </Button>

        <Button variant="outline" onClick={() => setEditOpen(true)}>
          <Edit size={17} />
          ویرایش سفارش
        </Button>

        {order.status !== "completed" && order.status !== "cancelled" && (
          <Button variant="danger" onClick={() => setCancelOpen(true)}>
            لغو سفارش
          </Button>
        )}
      </div>

      {/* Edit Modal */}

      <OrderFormModal
        key={`${editOpen}-${order.id}`}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        order={order}
      />

      {/* Cancel Confirmation Modal */}

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="لغو سفارش"
        description={`آیا می‌خواهید سفارش #${order.id} را لغو کنید؟`}
        footer={
          <>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              انصراف
            </Button>

            <Button
              variant="danger"
              loading={cancelling}
              onClick={handleCancelConfirm}
            >
              لغو سفارش
            </Button>
          </>
        }
      >
        <p className="font-estedad text-sm text-text-secondary">
          این عمل قابل برگشت نیست.
        </p>
      </Modal>
    </div>
  );
}

export default OrderDetails;
