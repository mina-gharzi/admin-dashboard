/*
  ==========================================================
  Orders.tsx
  ----------------------------------------------------------
  Orders management page — polished Dashboard language
  ==========================================================
*/

import { useMemo, useState } from "react";
import { AlertCircle, Clock3, Download, PackageCheck, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import OrderTable from "../components/order/OrderTable";
import OrderFilters from "../components/order/OrderFilters";
import OrderFormModal from "../components/order/OrderFormModal";

import { useData } from "../hooks/useData";
import { api, type Order } from "../services/api";
import { formatPrice } from "../utils/format";
import { exportToCsv, getFileDateStamp } from "../utils/exportToCsv";

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

  const [editModal, setEditModal] = useState<{
    open: boolean;
    order: Order | null;
  }>({ open: false, order: null });

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
    if (!editModal.order) return;

    try {
      await api.orders.update(editModal.order.id, data);
      toast.success(`سفارش #${editModal.order.id} ویرایش شد.`);
      await refetch();
    } catch (err) {
      toast.error("خطا در ذخیره‌سازی سفارش. دوباره تلاش کنید.");
      throw err;
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.orders.update(id, { status: "cancelled" });
      toast.info(`سفارش #${id} لغو شد.`);
      await refetch();
    } catch (err) {
      toast.error("خطا در لغو سفارش. دوباره تلاش کنید.");
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.orders.delete(id);
      toast.success(`سفارش #${id} حذف شد.`);
      await refetch();
    } catch (err) {
      toast.error("خطا در حذف سفارش. دوباره تلاش کنید.");
      throw err;
    }
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

        {loading && (
          <div className="flex min-h-72 items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
              <p className="font-estedad text-sm text-text-secondary">
                در حال بارگذاری سفارش‌ها...
              </p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertCircle size={24} />
            </div>
            <p className="font-estedad text-sm font-medium text-text-primary">
              خطا در دریافت اطلاعات
            </p>
            <p className="font-estedad text-xs text-text-secondary">
              {error.message}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-1">
              تلاش مجدد
            </Button>
          </div>
        )}

        {!loading && !error && orders && orders.length === 0 && (
          <div className="flex min-h-72 flex-col items-center justify-center gap-2 p-12 text-center">
            <p className="font-estedad text-sm font-semibold text-text-primary">
              هنوز سفارشی ثبت نشده است
            </p>
            <p className="font-estedad text-xs text-text-secondary">
              با ثبت اولین سفارش، اطلاعات آن در این بخش نمایش داده می‌شود.
            </p>
          </div>
        )}

        {!loading && !error && orders && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="flex min-h-56 flex-col items-center justify-center gap-2 p-10 text-center">
            <p className="font-estedad text-sm font-medium text-text-primary">
              سفارشی با این فیلتر پیدا نشد
            </p>
            <p className="font-estedad text-xs text-text-secondary">
              عبارت جستجو یا وضعیت انتخاب‌شده را تغییر دهید.
            </p>
          </div>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <OrderTable
            orders={filteredOrders}
            onEdit={(order) => setEditModal({ open: true, order })}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <OrderFormModal
        key={`${editModal.open}-${editModal.order?.id ?? "none"}`}
        open={editModal.open}
        onClose={() => setEditModal({ open: false, order: null })}
        onSubmit={handleEditSubmit}
        order={editModal.order}
      />
    </div>
  );
}

export default Orders;
