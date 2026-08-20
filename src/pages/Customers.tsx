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
import { AlertCircle, Download, Users as UsersIcon } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

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

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 p-16">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
            <p className="font-estedad text-sm text-text-secondary">
              در حال بارگذاری مشتریان...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertCircle size={24} />
            </div>
            <p className="font-estedad text-sm font-medium text-text-primary">
              خطا در دریافت اطلاعات
            </p>
            <p className="font-estedad text-xs text-text-secondary">
              {error.message}
            </p>
          </div>
        )}

        {!loading && !error && customers && customers.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <UsersIcon size={24} />
            </div>
            <p className="font-estedad text-sm font-bold text-text-primary">
              هنوز هیچ مشتری‌ای ثبت نشده است
            </p>
            <p className="font-estedad text-xs text-text-secondary">
              با ثبت اولین سفارش، مشتری خودکار به این لیست اضافه می‌شود.
            </p>
          </div>
        )}

        {!loading && !error && customers && customers.length > 0 && (
          <CustomerTable customers={filteredCustomers} />
        )}
      </Card>
    </div>
  );
}

export default Customers;
