/*
  ==========================================================
  TeamMemberFormModal.tsx
  ----------------------------------------------------------
  فرم افزودن/ویرایش عضو تیم (کارمند) — این فقط داخل
  Settings → مدیریت تیم استفاده میشه و فقط مدیر کل سیستم
  بهش دسترسی داره؛ برای همین readOnly نداره (هرکی بازش کنه
  یعنی از قبل اجازه‌ی کامل داشته).
  ==========================================================
*/

import { useState, type FormEvent } from "react";

import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import Button from "../ui/Button";

import type { User } from "../../services/api";
import { roleLabels } from "../../utils/permissions";

interface TeamMemberFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, "id" | "joinedAt">) => Promise<void>;
  initialMember?: User | null;
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

const toFormState = (member?: User | null): FormState =>
  member
    ? {
        name: member.name,
        email: member.email,
        role: member.role,
        status: member.status,
      }
    : emptyForm;

function TeamMemberFormModal({
  open,
  onClose,
  onSubmit,
  initialMember,
}: TeamMemberFormModalProps) {
  const isEditMode = Boolean(initialMember);

  const [form, setForm] = useState<FormState>(() => toFormState(initialMember));
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
      title={isEditMode ? "ویرایش عضو تیم" : "افزودن عضو تیم"}
      description={
        isEditMode
          ? "اطلاعات این کارمند را ویرایش کنید"
          : "اطلاعات کارمند جدید را وارد کنید"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="team-name" className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
            نام و نام خانوادگی
          </label>
          <Input
            id="team-name"
            value={form.name}
            aria-describedby={errors.name ? "team-name-error" : undefined}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="مثلاً: مینا احمدی"
            error={Boolean(errors.name)}
            autoFocus
          />
          {errors.name && (
            <p id="team-name-error" role="alert" className="mt-1.5 font-estedad text-[11px] text-danger">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="team-email" className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
            ایمیل
          </label>
          <Input
            id="team-email"
            type="email"
            aria-describedby={errors.email ? "team-email-error" : undefined}
            dir="ltr"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="name@shopino.ir"
            error={Boolean(errors.email)}
          />
          {errors.email && (
            <p id="team-email-error" role="alert" className="mt-1.5 font-estedad text-[11px] text-danger">
              {errors.email}
            </p>
          )}
        </div>

        {/* Role + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="team-role" className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
              نقش
            </label>
            <Select
              id="team-role"
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
            <label htmlFor="team-status" className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
              وضعیت
            </label>
            <Select
              id="team-status"
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

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-primary-300/60 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" loading={submitting}>
            {isEditMode ? "ذخیره تغییرات" : "افزودن عضو تیم"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default TeamMemberFormModal;
