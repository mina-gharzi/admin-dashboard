/*
  ==========================================================
  Settings.tsx
  ----------------------------------------------------------
  Settings page — Dashboard design language
  ----------------------------------------------------------
  مسئولیت این صفحه:

  - نمایش اطلاعات پروفایل کاربر
  - مدیریت تنظیمات ظاهری (ダーک مود)
  - بازنشانی/پاک‌سازی داده‌های نمونه
  ==========================================================
*/

import { useState } from "react";

import {
  Moon,
  Sun,
  User as UserIcon,
  RefreshCw,
  Trash2,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { Modal } from "../components/ui/Modal";

import { useAuthStore, useUIStore } from "../store";
import { api } from "../services/api";
import { roleLabels, permissions } from "../utils/permissions";

function Settings() {
  const user = useAuthStore((state) => state.user);
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const canManageSystemData = permissions.canManageSystemData(user?.role);

  const [resetOpen, setResetOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await api.system.resetToSampleData();
      toast.success("داده‌ها با موفقیت بازنشانی شد.");
      setResetOpen(false);
    } finally {
      setResetting(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await api.system.clearAllData();
      toast.info("تمام داده‌ها پاک شد.");
      setClearOpen(false);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="تنظیمات"
        description="مدیریت تنظیمات پروفایل و سیستم"
        breadcrumbs={[{ label: "تنظیمات" }]}
      />

      <div className="grid gap-6 desktop:grid-cols-3">
        {/* Profile */}
        <Card className="overflow-hidden border-primary-300/60 p-0 desktop:col-span-2">
          <div className="border-b border-primary-300/60 px-6 py-4">
            <h2 className="font-estedad text-base font-bold text-text-primary">
              اطلاعات پروفایل
            </h2>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr from-primary-900 to-primary-700 text-white shadow-sm">
                <UserIcon size={28} strokeWidth={2} />
              </div>
              <div>
                <p className="font-estedad text-lg font-bold text-text-primary">
                  {user?.name ?? "کاربر سیستم"}
                </p>
                <p className="mt-0.5 font-inter text-sm text-text-secondary">
                  {user?.email ?? "admin@example.com"}
                </p>
              </div>
            </div>

            <div className="grid gap-5 border-t border-primary-100/60 pt-5 tablet:grid-cols-2">
              <div>
                <p className="font-estedad text-xs text-text-secondary">نام</p>
                <p className="mt-1.5 font-estedad text-sm font-medium text-text-primary">
                  {user?.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-estedad text-xs text-text-secondary">
                  ایمیل
                </p>
                <p className="mt-1.5 font-inter text-sm text-text-primary">
                  {user?.email ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-estedad text-xs text-text-secondary">نقش</p>
                <p className="mt-1.5 font-estedad text-sm font-medium text-text-primary">
                  {roleLabels[user?.role ?? "admin"]}
                </p>
              </div>
              <div>
                <p className="font-estedad text-xs text-text-secondary">
                  وضعیت حساب
                </p>
                <p className="mt-1.5 font-estedad text-sm font-medium text-success">
                  فعال
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="overflow-hidden border-primary-300/60 p-0">
          <div className="border-b border-primary-300/60 px-6 py-4">
            <h2 className="font-estedad text-base font-bold text-text-primary">
              ظاهر
            </h2>
          </div>

          <div className="p-6">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex w-full items-center justify-between rounded-xl border border-primary-300/60 px-4 py-3 transition-all hover:border-primary-900 hover:bg-primary-50"
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Sun size={18} className="text-amber-500" />
                ) : (
                  <Moon size={18} className="text-primary-900" />
                )}
                <div className="text-right">
                  <p className="font-estedad text-sm font-medium text-text-primary">
                    حالت {isDarkMode ? "روشن" : "تاریک"}
                  </p>
                  <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">
                    تغییر به حالت {isDarkMode ? "روشن" : "تاریک"}
                  </p>
                </div>
              </div>

              <div
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isDarkMode ? "bg-primary-900" : "bg-primary-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                    isDarkMode ? "left-5.5" : "left-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* System Management — فقط برای ادمین */}
      {canManageSystemData && (
        <Card className="overflow-hidden border-primary-300/60 p-0">
          <div className="border-b border-primary-300/60 px-6 py-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-text-secondary" />
              <h2 className="font-estedad text-base font-bold text-text-primary">
                مدیریت داده‌ها
              </h2>
            </div>
            <p className="mt-0.5 font-estedad text-xs text-text-secondary">
              عملیات مدیریتی روی داده‌های نمونه سیستم
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6 tablet:flex-row">
            <div className="flex-1 rounded-xl border border-primary-100/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-900">
                  <RefreshCw size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-estedad text-sm font-bold text-text-primary">
                    بازنشانی داده‌ها
                  </p>
                  <p className="mt-1 font-estedad text-xs leading-5 text-text-secondary">
                    تمام داده‌ها به حالت اولیه نمونه بازمی‌گردند.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => setResetOpen(true)}
                  >
                    <RefreshCw size={14} />
                    بازنشانی
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 rounded-xl border border-danger/20 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                  <Trash2 size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-estedad text-sm font-bold text-text-primary">
                    پاک‌سازی کامل
                  </p>
                  <p className="mt-1 font-estedad text-xs leading-5 text-text-secondary">
                    تمام کاربران، محصولات و سفارش‌ها حذف می‌شوند.
                  </p>
                  <Button
                    size="sm"
                    variant="danger"
                    className="mt-3"
                    onClick={() => setClearOpen(true)}
                  >
                    <Trash2 size={14} />
                    پاک‌سازی
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Reset Confirmation Modal */}
      {canManageSystemData && (
        <Modal
          open={resetOpen}
          onClose={() => setResetOpen(false)}
          title="بازنشانی داده‌ها"
          description="آیا از بازنشانی داده‌ها اطمینان دارید؟"
          footer={
            <>
              <Button variant="outline" onClick={() => setResetOpen(false)}>
                انصراف
              </Button>
              <Button loading={resetting} onClick={handleReset}>
                بازنشانی
              </Button>
            </>
          }
        >
          <p className="font-estedad text-sm text-text-secondary">
            تمام تغییرات شما بازگردانده می‌شود و داده‌های اولیه نمونه جایگزین
            می‌شوند.
          </p>
        </Modal>
      )}

      {/* Clear Confirmation Modal */}
      {canManageSystemData && (
        <Modal
          open={clearOpen}
          onClose={() => setClearOpen(false)}
          title="پاک‌سازی کامل داده‌ها"
          description="آیا از پاک‌سازی تمام داده‌ها اطمینان دارید؟"
          footer={
            <>
              <Button variant="outline" onClick={() => setClearOpen(false)}>
                انصراف
              </Button>
              <Button variant="danger" loading={clearing} onClick={handleClear}>
                پاک‌سازی
              </Button>
            </>
          }
        >
          <p className="font-estedad text-sm text-text-secondary">
            این عمل قابل برگشت نیست. تمام کاربران، محصولات و سفارش‌ها به‌صورت
            دائمی حذف خواهند شد.
          </p>
        </Modal>
      )}
    </div>
  );
}

export default Settings;
