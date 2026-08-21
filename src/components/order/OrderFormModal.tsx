/*
  ==========================================================
  OrderFormModal.tsx
  ----------------------------------------------------------
  مودال ویرایش سفارش
  ----------------------------------------------------------
  مسئولیت:

  - ویرایش اطلاعات مشتری، تماس، آدرس و وضعیت سفارش

  نکته: چون سفارش‌ها معمولاً از فرآیند خرید ساخته میشن نه
  دستی، این مودال فقط برای «ویرایش» طراحی شده، نه «افزودن».
  ==========================================================
*/

import { useState, type FormEvent } from "react";

import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import Button from "../ui/Button";

import type { Order } from "../../services/api";

/*
  ----------------------------------------------------------
  Props
  ----------------------------------------------------------
*/

interface OrderFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Order>) => Promise<void>;
  order: Order | null;
}

/*
  ----------------------------------------------------------
  Form State Type
  ----------------------------------------------------------
*/

interface FormState {
  customer: string;
  email: string;
  phone: string;
  address: string;
  status: Order["status"];
}

const toFormState = (order: Order | null): FormState => ({
  customer: order?.customer ?? "",
  email: order?.email ?? "",
  phone: order?.phone ?? "",
  address: order?.address ?? "",
  status: order?.status ?? "pending",
});

/*
  ----------------------------------------------------------
  OrderFormModal Component
  ----------------------------------------------------------
  نکته: state مستقیم از order ساخته میشه (نه با useEffect).
  صفحه‌ی والد با `key` این کامپوننت رو هر بار که مودال باز
  میشه دوباره mount می‌کنه، پس همیشه state تازه‌ست.
*/

function OrderFormModal({
  open,
  onClose,
  onSubmit,
  order,
}: OrderFormModalProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(order));
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (form.customer.trim().length < 2) {
      nextErrors.customer = "نام مشتری باید حداقل ۲ حرف باشد";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      nextErrors.email = "ایمیل معتبر نیست";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!order) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="ویرایش سفارش"
      description={`سفارش #${order.id}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer */}
        <div>
          <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
            نام مشتری
          </label>

          <Input
            value={form.customer}
            onChange={(e) =>
              setForm((f) => ({ ...f, customer: e.target.value }))
            }
            error={Boolean(errors.customer)}
            autoFocus
          />

          {errors.customer && (
            <p className="mt-1.5 font-estedad text-xs text-danger">
              {errors.customer}
            </p>
          )}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
              ایمیل
            </label>

            <Input
              type="email"
              dir="ltr"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              error={Boolean(errors.email)}
            />

            {errors.email && (
              <p className="mt-1.5 font-estedad text-xs text-danger">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
              شماره تماس
            </label>

            <Input
              dir="ltr"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="09xxxxxxxxx"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
            آدرس
          </label>

          <Input
            value={form.address}
            onChange={(e) =>
              setForm((f) => ({ ...f, address: e.target.value }))
            }
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
            وضعیت سفارش
          </label>

          <Select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as Order["status"],
              }))
            }
          >
            <option value="pending">در انتظار</option>
            <option value="processing">در حال پردازش</option>
            <option value="completed">تکمیل شده</option>
            <option value="cancelled">لغو شده</option>
          </Select>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>

          <Button type="submit" loading={submitting}>
            ذخیره تغییرات
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default OrderFormModal;
