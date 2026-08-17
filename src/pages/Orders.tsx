/*
  ==========================================================
  Orders.tsx
  ----------------------------------------------------------
  Orders management page — Dashboard design language
  ----------------------------------------------------------
  مسئولیت این Page:

  - نگهداری Order data (از services/api)
  - مدیریت Search
  - مدیریت Status Filter
  - اتصال Filters به Table
  ==========================================================
*/

import { useMemo, useState } from "react";
import { Activity } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

import OrderTable from "../components/order/OrderTable";
import OrderFilters from "../components/order/OrderFilters";
import OrderFormModal from "../components/order/OrderFormModal";

import { useData } from "../hooks/useData";
import { api, type Order } from "../services/api";

function Orders() {
  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useData(() => api.orders.getAll(), []);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("همه");

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    const searchValue = search.toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue) ||
        order.email.toLowerCase().includes(searchValue);

      const matchesStatus = status === "همه" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  /*
    --------------------------------------------------------
    Edit Modal State
    --------------------------------------------------------
  */

  const [editModal, setEditModal] = useState<{
    open: boolean;
    order: Order | null;
  }>({ open: false, order: null });

  const openEditModal = (order: Order) => {
    setEditModal({ open: true, order });
  };

  const closeEditModal = () => {
    setEditModal({ open: false, order: null });
  };

  const handleEditSubmit = async (data: Partial<Order>) => {
    if (!editModal.order) return;

    await api.orders.update(editModal.order.id, data);
    toast.success(`سفارش #${editModal.order.id} ویرایش شد.`);
    await refetch();
  };

  /*
    --------------------------------------------------------
    Cancel Action
    --------------------------------------------------------
  */

  const handleCancel = async (id: string) => {
    await api.orders.update(id, { status: "cancelled" });
    toast.info(`سفارش #${id} لغو شد.`);
    await refetch();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="سفارش‌ها"
        description="مدیریت و پیگیری سفارش‌های فروشگاه"
        breadcrumbs={[{ label: "سفارش‌ها" }]}
      />

      <Card className="overflow-hidden border-primary-300 p-0">
        {/* Section Header */}
        <div className="flex flex-col gap-3 border-b border-primary-300 px-7 py-5 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <Activity size={19} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-estedad text-lg font-semibold text-text-primary">
                لیست سفارش‌ها
              </h2>
              <p className="mt-1 font-estedad text-xs text-text-secondary">
                جستجو، فیلتر و مدیریت سفارش‌های فروشگاه
              </p>
            </div>
          </div>

          <span className="inline-flex items-center rounded-2xl bg-primary-50 px-3 py-1.5 font-estedad text-xs font-medium text-primary-900">
            {filteredOrders.length} سفارش
          </span>
        </div>

        <OrderFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          resultCount={filteredOrders.length}
        />

        {loading && (
          <div className="flex min-h-72 items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
              <p className="font-estedad text-sm text-text-secondary">
                در حال بارگذاری سفارش‌ها...
              </p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-72 items-center justify-center p-12">
            <div className="text-center">
              <p className="font-estedad text-sm font-medium text-danger">
                خطا در دریافت اطلاعات
              </p>
              <p className="mt-2 font-estedad text-xs text-text-secondary">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {!loading && !error && orders && orders.length === 0 && (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-12 text-center">
            <p className="font-estedad text-sm text-text-secondary">
              هنوز هیچ سفارشی ثبت نشده است.
            </p>
          </div>
        )}

        {!loading && !error && orders && orders.length > 0 && (
          <OrderTable
            orders={filteredOrders}
            onEdit={openEditModal}
            onCancel={handleCancel}
          />
        )}
      </Card>

      {/* Edit Modal */}

      <OrderFormModal
        key={`${editModal.open}-${editModal.order?.id ?? "none"}`}
        open={editModal.open}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        order={editModal.order}
      />
    </div>
  );
}

export default Orders;
