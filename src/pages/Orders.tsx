/*
  ==========================================================
  Orders.tsx
  ----------------------------------------------------------
  Orders management page.
  ----------------------------------------------------------
  مسئولیت این Page:

  - نگهداری Order data (از services/api)
  - مدیریت Search
  - مدیریت Status Filter
  - اتصال Filters به Table
  ==========================================================
*/

import { useMemo, useState } from "react";

import { Card } from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

import OrderTable from "../components/order/OrderTable";
import OrderFilters from "../components/order/OrderFilters";

import { useData } from "../hooks/useData";
import { api, type Order } from "../services/api";

/*
  ----------------------------------------------------------
  Orders Page
  ----------------------------------------------------------
*/

function Orders() {
  /*
    --------------------------------------------------------
    Data Fetching
    --------------------------------------------------------
  */

  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useData(() => api.orders.getAll(), []);

  /*
    --------------------------------------------------------
    Filters
    --------------------------------------------------------
  */

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
    Actions
    --------------------------------------------------------
  */

  const handleCancel = async (id: string) => {
    await api.orders.update(id, { status: "cancelled" });
    await refetch();
  };

  const handleEdit = (order: Order) => {
    // TODO: باز کردن مودال ویرایش سفارش
    console.log("Edit order:", order);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <PageHeader
        title="سفارش‌ها"
        description="مدیریت و پیگیری سفارش‌های فروشگاه"
        breadcrumbs={[{ label: "سفارش‌ها" }]}
      />

      {/* Orders Card */}

      <Card className="overflow-hidden">
        <OrderFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          resultCount={filteredOrders.length}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-12">
            <p className="font-vazirmatn text-sm text-text-secondary">
              در حال بارگذاری سفارش‌ها...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center p-12">
            <p className="font-vazirmatn text-sm text-danger">
              خطا در دریافت اطلاعات: {error.message}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <OrderTable
            orders={filteredOrders}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        )}
      </Card>
    </div>
  );
}

export default Orders;
