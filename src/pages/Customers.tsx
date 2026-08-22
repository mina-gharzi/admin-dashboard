/*
  ==========================================================
  Customers.tsx
  ----------------------------------------------------------
  صفحه‌ی مشتریان — لیست کسانی که از فروشگاه خرید کرده‌ن، به
  همراه تعداد و مجموع سفارش‌هاشون. این صفحه فقط نمایشیه:
  مشتری با ثبت اولین سفارشش به این لیست اضافه میشه (نه با
  فرم افزودن دستی) — دقیقاً شبیه یه فروشگاه واقعی.

  مدیریت اعضای تیم (کارکنان) از اینجا جدا شده و به
  Settings → مدیریت تیم منتقل شده.
  ==========================================================
*/

import { useMemo, useState } from "react";
import { Download, Users as UsersIcon } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import ResourceState from "../components/ui/ResourceState";

import CustomerTable from "../components/customer/CustomerTable";
import CustomerFilters from "../components/customer/CustomerFilters";

import { useData } from "../hooks/useData";
import { api } from "../services/api";
import { exportToCsv, getFileDateStamp } from "../utils/exportToCsv";

function Customers() {
  const {
    data: customers,
    loading,
    error,
    refetch,
  } = useData(() => api.customers.getAll(), []);

  // ----------------------------------------------------------
  // Filters
  // ----------------------------------------------------------
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("همه");

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];

    return customers.filter((customer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(searchValue) ||
        customer.email.toLowerCase().includes(searchValue);

      const matchesStatus = status === "همه" || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, status]);

  // ----------------------------------------------------------
  // Export (خروجی CSV از مشتریان فیلترشده)
  // ----------------------------------------------------------
  const handleExport = () => {
    if (filteredCustomers.length === 0) {
      toast.info("موردی برای خروجی گرفتن وجود ندارد.");
      return;
    }

    exportToCsv(
      filteredCustomers,
      [
        { header: "نام", accessor: (c) => c.name },
        { header: "ایمیل", accessor: (c) => c.email },
        { header: "تلفن", accessor: (c) => c.phone ?? "" },
        { header: "تعداد سفارش", accessor: (c) => c.ordersCount },
        { header: "مجموع خرید (تومان)", accessor: (c) => c.totalSpent },
        { header: "آخرین سفارش", accessor: (c) => c.lastOrderDate },
        {
          header: "وضعیت",
          accessor: (c) => (c.status === "active" ? "فعال" : "غیرفعال"),
        },
      ],
      `مشتریان-${getFileDateStamp()}`,
    );

    toast.success(`خروجی ${filteredCustomers.length} مشتری با موفقیت دانلود شد.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="مشتریان"
        description="مشاهده‌ی مشتریان فروشگاه و سفارش‌هایی که ثبت کرده‌اند"
        breadcrumbs={[{ label: "مشتریان" }]}
        actions={
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredCustomers.length === 0}
          >
            <Download size={17} />
            خروجی CSV
          </Button>
        }
      />

      <Card className="overflow-hidden border border-primary-300/60 shadow-sm">
        <CustomerFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          resultCount={filteredCustomers.length}
        />

        <ResourceState
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingText="در حال بارگذاری مشتریان..."
          isEmpty={!!customers && customers.length === 0}
          emptyIcon={UsersIcon}
          emptyTitle="هنوز هیچ مشتری‌ای ثبت نشده است"
          emptyDescription="با ثبت اولین سفارش، مشتری خودکار به این لیست اضافه می‌شود."
        >
          <CustomerTable customers={filteredCustomers} />
        </ResourceState>
      </Card>
    </div>
  );
}

export default Customers;
