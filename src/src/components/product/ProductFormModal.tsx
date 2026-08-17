/*
  ==========================================================
  ProductFormModal.tsx
  ----------------------------------------------------------
  مودال افزودن / ویرایش محصول
  ----------------------------------------------------------
  مسئولیت:

  - نمایش فرم با اعتبارسنجی ساده
  - حالت Create (بدون initialProduct) و Edit (با initialProduct)
  ==========================================================
*/

import { useState, type FormEvent } from "react";

import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import Button from "../ui/Button";

import type { Product } from "../../services/api";

/*
  ----------------------------------------------------------
  Props
  ----------------------------------------------------------
*/

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id">) => Promise<void>;
  initialProduct?: Product | null;
}

/*
  ----------------------------------------------------------
  Categories (باید با ProductFilters.tsx هماهنگ باشه)
  ----------------------------------------------------------
*/

const categories = ["موبایل", "لپ‌تاپ", "هدفون", "ساعت هوشمند"];

/*
  ----------------------------------------------------------
  Form State Type
  ----------------------------------------------------------
*/

interface FormState {
  name: string;
  category: string;
  price: string;
  stock: string;
  status: Product["status"];
  description: string;
}

const emptyForm: FormState = {
  name: "",
  category: categories[0],
  price: "",
  stock: "",
  status: "active",
  description: "",
};

const toFormState = (product?: Product | null): FormState =>
  product
    ? {
        name: product.name,
        category: product.category,
        price: String(product.price),
        stock: String(product.stock),
        status: product.status,
        description: product.description ?? "",
      }
    : emptyForm;

/*
  ----------------------------------------------------------
  ProductFormModal Component
  ----------------------------------------------------------
  نکته: state مستقیم از initialProduct ساخته میشه (نه با
  useEffect). صفحه‌ی والد با `key` این کامپوننت رو هر بار که
  مودال باز میشه دوباره mount می‌کنه، پس همیشه state تازه‌ست.
*/

function ProductFormModal({
  open,
  onClose,
  onSubmit,
  initialProduct,
}: ProductFormModalProps) {
  const isEditMode = Boolean(initialProduct);

  const [form, setForm] = useState<FormState>(() =>
    toFormState(initialProduct),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = "نام محصول باید حداقل ۲ حرف باشد";
    }

    const priceNumber = Number(form.price);
    if (!form.price || Number.isNaN(priceNumber) || priceNumber <= 0) {
      nextErrors.price = "قیمت باید یک عدد مثبت باشد";
    }

    const stockNumber = Number(form.stock);
    if (form.stock === "" || Number.isNaN(stockNumber) || stockNumber < 0) {
      nextErrors.stock = "موجودی باید یک عدد معتبر باشد";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        status: form.status,
        description: form.description.trim() || undefined,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditMode ? "ویرایش محصول" : "افزودن محصول جدید"}
      description={
        isEditMode
          ? "اطلاعات محصول را ویرایش کنید"
          : "اطلاعات محصول جدید را وارد کنید"
      }
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
            نام محصول
          </label>

          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="مثلاً: iPhone 16 Pro"
            error={Boolean(errors.name)}
            autoFocus
          />

          {errors.name && (
            <p className="mt-1 font-estedad text-xs text-danger">
              {errors.name}
            </p>
          )}
        </div>

        {/* Category + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
              دسته‌بندی
            </label>

            <Select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
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
                  status: e.target.value as Product["status"],
                }))
              }
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </Select>
          </div>
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
              قیمت (تومان)
            </label>

            <Input
              type="number"
              dir="ltr"
              min={0}
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              placeholder="0"
              error={Boolean(errors.price)}
            />

            {errors.price && (
              <p className="mt-1 font-estedad text-xs text-danger">
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
              موجودی
            </label>

            <Input
              type="number"
              dir="ltr"
              min={0}
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: e.target.value }))
              }
              placeholder="0"
              error={Boolean(errors.stock)}
            />

            {errors.stock && (
              <p className="mt-1 font-estedad text-xs text-danger">
                {errors.stock}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block font-estedad text-xs font-medium text-text-secondary">
            توضیحات (اختیاری)
          </label>

          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="توضیح کوتاهی درباره محصول..."
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>

          <Button type="submit" loading={submitting}>
            {isEditMode ? "ذخیره تغییرات" : "افزودن محصول"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProductFormModal;
