/*
  ==========================================================
  OrderDetails.tsx
  ----------------------------------------------------------
  صفحه‌ی جزئیات یک سفارش.

  نکته: قبلاً دکمه‌های «ویرایش» و «لغو» بدون توجه به نقش
  کاربر همیشه نمایش داده می‌شدن — همون باگی که تو
  ProductDetails بود. الان از همون permissions.canManageOrders
  استفاده می‌کنه که OrderTable ازش استفاده می‌کنه، تا رفتار
  همه‌جا یکسان باشه.

  «حذف سفارش» هم اضافه شد (فقط برای سفارش‌های لغوشده، چون
  حذف یه سفارش فعال بی‌معنیه — باید اول لغو بشه).
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
  RefreshCw,
  Trash2,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import OrderFormModal from "../components/order/OrderFormModal";

import { useData } from "../hooks/useData";
import { api, type Order } from "../services/api";
import { formatPrice } from "../utils/format";
import { useAuthStore } from "../store";
import { permissions } from "../utils/permissions";

const statusConfig = {
  pending: { label: "در انتظار", variant: "warning" as const, icon: Clock3 },
  processing: { label: "در حال پردازش", variant: "info" as const, icon: Truck },
  completed: { label: "تکمیل شده", variant: "success" as const, icon: CheckCircle2 },
  cancelled: { label: "لغو شده", variant: "danger" as const, icon: XCircle },
};

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const role = useAuthStore((state) => state.user?.role);
  const canManage = permissions.canManageOrders(role);

  const {
    data: order,
    loading,
    error,
    refetch,
  } = useData(() => api.orders.getById(id ?? ""), [id]);

  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /*
    --------------------------------------------------------
    Loading State
    --------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
          <p className="font-estedad text-sm text-text-secondary">
            در حال بارگذاری سفارش...
          </p>
        </div>
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
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
          <Package size={25} />
        </div>
        <p className="font-estedad text-sm font-semibold text-text-primary">
          سفارش مورد نظر پیدا نشد
        </p>
        <p className="font-estedad text-xs text-text-secondary">
          ممکن است سفارش حذف شده یا شناسه اشتباه باشد.
        </p>

        <div className="mt-2 flex items-center gap-2">
          {error && (
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw size={16} />
              تلاش مجدد
            </Button>
          )}
          <Button onClick={() => navigate("/dashboard/orders")}>
            <ArrowRight size={17} />
            بازگشت به سفارش‌ها
          </Button>
        </div>
      </div>
    );
  }

  /*
    --------------------------------------------------------
    Derived Values
    --------------------------------------------------------
  */

  const currentStatus = statusConfig[order.status];
  const StatusIcon = currentStatus.icon;
  const items = order.items ?? [];
  const canCancel = order.status !== "completed" && order.status !== "cancelled";
  const canDelete = order.status === "cancelled";

  /*
    --------------------------------------------------------
    Handlers
    --------------------------------------------------------
  */

  const handleEditSubmit = async (data: Partial<Order>) => {
    try {
      await api.orders.update(order.id, data);
      toast.success(`سفارش #${order.id} ویرایش شد.`);
      await refetch();
    } catch (err) {
      toast.error("خطا در ذخیره‌سازی سفارش. دوباره تلاش کنید.");
      throw err;
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.orders.update(order.id, { status: "cancelled" });
      toast.info(`سفارش #${order.id} لغو شد.`);
      await refetch();
      setCancelOpen(false);
    } catch {
      toast.error("خطا در لغو سفارش. دوباره تلاش کنید.");
    } finally {
      setCancelling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.orders.delete(order.id);
      toast.success(`سفارش #${order.id} حذف شد.`);
      navigate("/dashboard/orders");
    } catch {
      toast.error("خطا در حذف سفارش. دوباره تلاش کنید.");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="جزئیات سفارش"
        description={`Order #${order.id}`}
        breadcrumbs={[
          { label: "سفارش‌ها", href: "/dashboard/orders" },
          { label: "جزئیات سفارش" },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate("/dashboard/orders")}>
            <ArrowRight size={17} />
            بازگشت به سفارش‌ها
          </Button>
        }
      />

      {/* Status Banner */}
      <Card className="overflow-hidden border border-primary-300/60 p-0">
        <div className="flex flex-col gap-4 px-6 py-5 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-900">
              <StatusIcon size={21} />
            </div>
            <div>
              <p className="font-estedad text-[11px] text-text-secondary">
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

      {/* Customer + Items */}
      <div className="grid gap-6 desktop:grid-cols-3">
        <Card className="overflow-hidden border border-primary-300/60 p-0">
          <div className="border-b border-primary-100/70 px-6 py-4">
            <h2 className="font-estedad text-sm font-bold text-text-primary">
              اطلاعات مشتری
            </h2>
          </div>
          <div className="space-y-4 px-6 py-5">
            {[
              { label: "نام", value: order.customer },
              { label: "ایمیل", value: order.email },
              { label: "شماره تماس", value: order.phone || "ثبت نشده" },
              { label: "آدرس", value: order.address || "ثبت نشده" },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-estedad text-[11px] text-text-secondary">
                  {item.label}
                </p>
                <p className="mt-1.5 break-words font-estedad text-sm font-medium text-text-primary">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden border border-primary-300/60 p-0 desktop:col-span-2">
          <div className="flex items-center justify-between border-b border-primary-100/70 px-6 py-4">
            <h2 className="font-estedad text-sm font-bold text-text-primary">
              محصولات سفارش
            </h2>
            <span className="font-estedad text-[11px] text-text-secondary">
              {items.length.toLocaleString("fa-IR")} محصول
            </span>
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
                className="flex flex-col gap-3 border-b border-primary-100/60 px-6 py-4 last:border-0 tablet:flex-row tablet:items-center tablet:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-900">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="font-estedad text-sm font-semibold text-text-primary">
                      {item.name}
                    </p>
                    <p className="mt-1 font-estedad text-[11px] text-text-secondary">
                      تعداد: {item.quantity.toLocaleString("fa-IR")}
                    </p>
                  </div>
                </div>

                <p className="font-estedad text-sm font-semibold text-text-primary">
                  {formatPrice(item.price)}{" "}
                  <span className="text-[10px] font-normal text-text-secondary">
                    تومان
                  </span>
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary */}
      <Card className="overflow-hidden border border-primary-300/60 p-0">
        <div className="border-b border-primary-100/70 px-6 py-4">
          <h2 className="font-estedad text-sm font-bold text-text-primary">
            خلاصه سفارش
          </h2>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="font-estedad text-sm text-text-secondary">
              شماره سفارش
            </span>
            <span className="font-inter text-sm font-semibold text-text-primary">
              #{order.id}
            </span>
          </div>
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
              {items.length.toLocaleString("fa-IR")} محصول
            </span>
          </div>
          <div className="border-t border-primary-100/70 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-estedad text-sm font-semibold text-text-primary">
                مبلغ نهایی
              </span>
              <span className="font-estedad text-xl font-bold text-primary-900">
                {formatPrice(order.amount)}{" "}
                <span className="text-[10px] font-normal text-text-secondary">
                  تومان
                </span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions — فقط برای نقش‌هایی که اجازه‌ی مدیریت سفارش دارن */}
      {canManage && (
        <div className="flex flex-col gap-2 tablet:flex-row tablet:justify-end">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Edit size={16} />
            ویرایش سفارش
          </Button>

          {canCancel && (
            <Button variant="danger" onClick={() => setCancelOpen(true)}>
              <XCircle size={16} />
              لغو سفارش
            </Button>
          )}

          {canDelete && (
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={16} />
              حذف سفارش
            </Button>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {canManage && (
        <OrderFormModal
          key={`${editOpen}-${order.id}`}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={handleEditSubmit}
          order={order}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {canManage && (
        <Modal
          open={cancelOpen}
          onClose={cancelling ? () => {} : () => setCancelOpen(false)}
          title="لغو سفارش"
          description={`آیا از لغو سفارش #${order.id} اطمینان دارید؟`}
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setCancelOpen(false)}
                disabled={cancelling}
              >
                انصراف
              </Button>
              <Button variant="danger" loading={cancelling} onClick={handleCancel}>
                لغو سفارش
              </Button>
            </>
          }
        >
          <p className="font-estedad text-sm leading-6 text-text-secondary">
            پس از لغو، وضعیت سفارش تغییر می‌کند.
          </p>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {canManage && (
        <Modal
          open={deleteOpen}
          onClose={deleting ? () => {} : () => setDeleteOpen(false)}
          title="حذف سفارش"
          description={`آیا از حذف کامل سفارش #${order.id} اطمینان دارید؟`}
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                انصراف
              </Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>
                حذف سفارش
              </Button>
            </>
          }
        >
          <p className="font-estedad text-sm leading-6 text-text-secondary">
            این عمل قابل برگشت نیست و سفارش برای همیشه از سیستم حذف خواهد شد.
          </p>
        </Modal>
      )}
    </div>
  );
}

export default OrderDetails;
