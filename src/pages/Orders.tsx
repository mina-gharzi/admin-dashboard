/*
  ==========================================================
  Orders.tsx
  ----------------------------------------------------------
  Orders management page — polished Dashboard language
  ==========================================================
*/

import { useMemo, useState } from "react";
import { Clock3, Download, PackageCheck, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import ResourceState from "../components/ui/ResourceState";
import OrderTable from "../components/order/OrderTable";
import OrderFilters from "../components/order/OrderFilters";
import OrderFormModal from "../components/order/OrderFormModal";

import { useData } from "../hooks/useData";
import { useEditModal } from "../hooks/useEditModal";
import { api, type Order } from "../services/api";
import { formatPrice } from "../utils/format";
import { exportToCsv, getFileDateStamp } from "../utils/exportToCsv";
import { runWithToast } from "../utils/toastAction";

const orderStatusLabels: Record<Order["status"], string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

function Orders() {
  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useData(() => api.orders.getAll(), []);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("همه");

  const editModal = useEditModal<Order>();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    const value = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(value) ||
        order.customer.toLowerCase().includes(value) ||
        order.email.toLowerCase().includes(value);

      const matchesStatus = status === "همه" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const handleEditSubmit = async (data: Partial<Order>) => {
    const editingOrder = editModal.editingItem;
    if (!editingOrder) return;

    await runWithToast(() => api.orders.update(editingOrder.id, data), {
      success: `سفارش #${editingOrder.id} ویرایش شد.`,
      error: "خطا در ذخیره‌سازی سفارش. دوباره تلاش کنید.",
    });
    await refetch();
  };

  const handleCancel = async (id: string) => {
    await runWithToast(
      () => api.orders.update(id, { status: "cancelled" }),
      { error: "خطا در لغو سفارش. دوباره تلاش کنید." },
    );
    toast.info(`سفارش #${id} لغو شد.`);
    await refetch();
  };

  const handleDelete = async (id: string) => {
    await runWithToast(() => api.orders.delete(id), {
      success: `سفارش #${id} حذف شد.`,
      error: "خطا در حذف سفارش. دوباره تلاش کنید.",
    });
    await refetch();
  };

  const pending = orders?.filter((item) => item.status === "pending").length ?? 0;
  const processing = orders?.filter((item) => item.status === "processing").length ?? 0;
  const completed = orders?.filter((item) => item.status === "completed").length ?? 0;

  // خروجی CSV از سفارش‌های فیلترشده
  const handleExport = () => {
    if (filteredOrders.length === 0) {
      toast.info("موردی برای خروجی گرفتن وجود ندارد.");
      return;
    }

    exportToCsv(
      filteredOrders,
      [
        { header: "شماره سفارش", accessor: (order) => order.id },
        { header: "مشتری", accessor: (order) => order.customer },
        { header: "ایمیل", accessor: (order) => order.email },
        { header: "مبلغ (تومان)", accessor: (order) => formatPrice(order.amount) },
        { header: "وضعیت", accessor: (order) => orderStatusLabels[order.status] },
        { header: "تاریخ", accessor: (order) => order.date },
      ],
      `سفارش‌ها-${getFileDateStamp()}`,
    );

    toast.success(`خروجی ${filteredOrders.length} سفارش با موفقیت دانلود شد.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="سفارش‌ها"
        description="مدیریت و پیگیری سفارش‌های فروشگاه"
        breadcrumbs={[{ label: "سفارش‌ها" }]}
        actions={
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredOrders.length === 0}
          >
            <Download size={17} />
            خروجی CSV
          </Button>
        }
      />

      {/* Stat Cards */}
      <div className="grid gap-4 tablet:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <Clock3 size={18} />
          </div>
          <div>
            <p className="font-estedad text-xs text-text-secondary">در انتظار</p>
            <p className="mt-1 font-estedad text-lg font-bold text-text-primary">
              {pending.toLocaleString("fa-IR")}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
            <ShoppingBag size={18} />
          </div>
          <div>
            <p className="font-estedad text-xs text-text-secondary">در حال پردازش</p>
            <p className="mt-1 font-estedad text-lg font-bold text-text-primary">
              {processing.toLocaleString("fa-IR")}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
            <PackageCheck size={18} />
          </div>
          <div>
            <p className="font-estedad text-xs text-text-secondary">تکمیل شده</p>
            <p className="mt-1 font-estedad text-lg font-bold text-text-primary">
              {completed.toLocaleString("fa-IR")}
            </p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border border-primary-300/60 p-0">
        <OrderFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          resultCount={filteredOrders.length}
        />

        <ResourceState
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingText="در حال بارگذاری سفارش‌ها..."
          isEmpty={!!orders && orders.length === 0}
          emptyTitle="هنوز سفارشی ثبت نشده است"
          emptyDescription="با ثبت اولین سفارش، اطلاعات آن در این بخش نمایش داده می‌شود."
        >
          {filteredOrders.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-2 p-10 text-center">
              <p className="font-estedad text-sm font-medium text-text-primary">
                سفارشی با این فیلتر پیدا نشد
              </p>
              <p className="font-estedad text-xs text-text-secondary">
                عبارت جستجو یا وضعیت انتخاب‌شده را تغییر دهید.
              </p>
            </div>
          ) : (
            <OrderTable
              orders={filteredOrders}
              onEdit={editModal.openEdit}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          )}
        </ResourceState>
      </Card>

      <OrderFormModal
        key={`${editModal.open}-${editModal.editingItem?.id ?? "none"}`}
        open={editModal.open}
        onClose={editModal.close}
        onSubmit={handleEditSubmit}
        order={editModal.editingItem}
      />
    </div>
  );
}

export default Orders;
