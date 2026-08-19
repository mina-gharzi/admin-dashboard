/*
  ==========================================================
  UserFormModal.tsx (Redesigned & UI/UX Enhanced)
  ==========================================================
*/

import { useState, type FormEvent } from "react";

import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import Button from "../ui/Button";

import type { User } from "../../services/api";
import { roleLabels } from "../../utils/permissions";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, "id" | "joinedAt">) => Promise<void>;
  initialUser?: User | null;
  /** حالت فقط‌مشاهده — برای نقش‌هایی که اجازه‌ی ویرایش کاربر رو ندارن (RBAC) */
  readOnly?: boolean;
}

interface FormState {
  name: string;
  email: string;
  role: User["role"];
  status: User["status"];
}

const emptyForm: FormState = {
  name: "",
  email: "",
  role: "salesperson",
  status: "active",
};

const toFormState = (user?: User | null): FormState =>
  user
    ? {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      }
    : emptyForm;

function UserFormModal({
  open,
  onClose,
  onSubmit,
  initialUser,
  readOnly = false,
}: UserFormModalProps) {
  const isEditMode = Boolean(initialUser);

  const [form, setForm] = useState<FormState>(() => toFormState(initialUser));
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = "نام باید حداقل ۲ حرف باشد";
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        readOnly
          ? "مشاهده کاربر"
          : isEditMode
            ? "ویرایش کاربر"
            : "افزودن کاربر جدید"
      }
      description={
        readOnly
          ? "شما فقط اجازه‌ی مشاهده‌ی این کاربر رو دارید"
          : isEditMode
            ? "اطلاعات کاربر را ویرایش کنید"
            : "اطلاعات کاربر جدید را وارد کنید"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset disabled={readOnly} className="space-y-5 border-0 p-0">
        {/* Name */}
        <div>
          <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
            نام و نام خانوادگی
          </label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="مثلاً: مینا احمدی"
            error={Boolean(errors.name)}
            autoFocus
          />
          {errors.name && (
            <p className="mt-1.5 font-estedad text-[11px] text-danger">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
            ایمیل
          </label>
          <Input
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="user@example.com"
            error={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="mt-1.5 font-estedad text-[11px] text-danger">
              {errors.email}
            </p>
          )}
        </div>

        {/* Role + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
              نقش
            </label>
            <Select
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  role: e.target.value as User["role"],
                }))
              }
            >
              <option value="system_admin">{roleLabels.system_admin}</option>
              <option value="admin">{roleLabels.admin}</option>
              <option value="sales_manager">{roleLabels.sales_manager}</option>
              <option value="salesperson">{roleLabels.salesperson}</option>
              <option value="analyst">{roleLabels.analyst}</option>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
              وضعیت
            </label>
            <Select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as User["status"],
                }))
              }
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </Select>
          </div>
        </div>
        </fieldset>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-primary-300/60 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {readOnly ? "بستن" : "انصراف"}
          </Button>
          {!readOnly && (
            <Button type="submit" loading={submitting}>
              {isEditMode ? "ذخیره تغییرات" : "افزودن کاربر"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default UserFormModal;
