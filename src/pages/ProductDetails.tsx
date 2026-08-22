/*
  ==========================================================
  ProductDetails.tsx
  ----------------------------------------------------------
  صفحه‌ی جزئیات یک محصول — مشاهده‌ی کامل اطلاعات محصول با
  امکان ویرایش/حذف مستقیم از همین صفحه.

  نکته: قبلاً دکمه‌های «ویرایش» و «حذف» بدون توجه به نقش
  کاربر همیشه نمایش داده می‌شدن؛ یعنی کاربری مثل «تحلیل‌گر»
  که تو جدول اصلی محصولات اجازه‌ی این کارها رو نداره، اگه
  مستقیم آدرس این صفحه رو باز می‌کرد می‌تونست محصول رو حذف
  کنه. الان این صفحه هم از همون permissions.canManageProducts
  استفاده می‌کنه که ProductTable ازش استفاده می‌کنه.
  ==========================================================
*/

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Edit, Package, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { DetailLoadingState, DetailMissingState } from "../components/ui/DetailState";
import ProductFormModal from "../components/product/ProductFormModal";

import { useData } from "../hooks/useData";
import { api, type Product } from "../services/api";
import { formatPrice } from "../utils/format";
import { useAuthStore } from "../store";
import { permissions } from "../utils/permissions";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const role = useAuthStore((state) => state.user?.role);
  const canManage = permissions.canManageProducts(role);

  const {
    data: product,
    loading,
    error,
    refetch,
  } = useData(() => api.products.getById(productId), [productId]);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /*
    --------------------------------------------------------
    Loading State
    --------------------------------------------------------
  */

  if (loading) {
    return <DetailLoadingState text="در حال بارگذاری محصول..." />;
  }

  /*
    --------------------------------------------------------
    Error / Not Found State
    --------------------------------------------------------
  */

  if (error || !product) {
    return (
      <DetailMissingState
        icon={Package}
        title="محصول مورد نظر پیدا نشد"
        description="ممکن است محصول حذف شده یا شناسه واردشده اشتباه باشد."
        error={error}
        onRetry={refetch}
        backLabel="بازگشت به محصولات"
        onBack={() => navigate("/dashboard/products")}
      />
    );
  }

  /*
    --------------------------------------------------------
    Handlers
    --------------------------------------------------------
  */

  const handleEditSubmit = async (data: Omit<Product, "id">) => {
    try {
      await api.products.update(product.id, data);
      toast.success(`محصول «${data.name}» ویرایش شد.`);
      await refetch();
    } catch (err) {
      toast.error("خطا در ذخیره‌سازی محصول. دوباره تلاش کنید.");
      throw err;
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.products.delete(product.id);
      toast.success(`محصول «${product.name}» حذف شد.`);
      navigate("/dashboard/products");
    } catch {
      toast.error("خطا در حذف محصول. دوباره تلاش کنید.");
      setDeleting(false);
    }
  };

  const stockTone =
    product.stock === 0
      ? "text-danger"
      : product.stock <= 10
        ? "text-warning"
        : "text-success";

  const stockLabel =
    product.stock === 0
      ? "ناموجود"
      : product.stock <= 10
        ? "موجودی کم"
        : "موجود";

  return (
    <div className="space-y-6">
      <PageHeader
        title="جزئیات محصول"
        description={`مشاهده و مدیریت ${product.name}`}
        breadcrumbs={[
          { label: "محصولات", href: "/dashboard/products" },
          { label: "جزئیات محصول" },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate("/dashboard/products")}>
            <ArrowRight size={17} />
            بازگشت به محصولات
          </Button>
        }
      />

      <Card className="overflow-hidden border border-primary-300/60 p-0">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-primary-100/70 bg-primary-50/30 px-6 py-5 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <Package size={26} strokeWidth={1.7} />
            </div>
            <div className="min-w-0">
              <p className="font-inter text-[11px] text-text-secondary">
                Product #{product.id}
              </p>
              <h2 className="mt-1 truncate font-estedad text-lg font-bold text-text-primary">
                {product.name}
              </h2>
            </div>
          </div>

          <Badge variant={product.status === "active" ? "success" : "danger"}>
            {product.status === "active" ? "فعال" : "غیرفعال"}
          </Badge>
        </div>

        {/* Body */}
        <div className="grid gap-6 p-6 desktop:grid-cols-[280px_1fr]">
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-primary-100/70 bg-primary-50/30">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <Package size={58} strokeWidth={1.4} />
            </div>
          </div>

          <div>
            <div className="grid gap-3 tablet:grid-cols-2">
              {[
                { label: "دسته‌بندی", value: product.category },
                { label: "شناسه محصول", value: `#${product.id}` },
                {
                  label: "موجودی",
                  value: `${product.stock.toLocaleString("fa-IR")} عدد`,
                  className: stockTone,
                },
                { label: "وضعیت موجودی", value: stockLabel, className: stockTone },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-primary-100/70 p-4">
                  <p className="font-estedad text-[11px] text-text-secondary">
                    {item.label}
                  </p>
                  <p className={`mt-2 font-estedad text-sm font-semibold ${item.className ?? "text-text-primary"}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-primary-100/70 p-4">
              <p className="font-estedad text-[11px] text-text-secondary">قیمت</p>
              <p className="mt-2 font-estedad text-xl font-bold text-primary-900">
                {formatPrice(product.price)}{" "}
                <span className="text-xs font-normal text-text-secondary">تومان</span>
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="border-t border-primary-100/70 px-6 py-5">
            <p className="font-estedad text-[11px] text-text-secondary">
              توضیحات محصول
            </p>
            <p className="mt-2 max-w-4xl font-estedad text-sm leading-7 text-text-secondary">
              {product.description}
            </p>
          </div>
        )}

        {/* Actions — فقط برای نقش‌هایی که اجازه‌ی مدیریت محصول دارن */}
        {canManage && (
          <div className="flex flex-col gap-2 border-t border-primary-100/70 px-6 py-4 tablet:flex-row tablet:justify-end">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Edit size={16} />
              ویرایش محصول
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={16} />
              حذف محصول
            </Button>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      {canManage && (
        <ProductFormModal
          key={`${editOpen}-${product.id}`}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={handleEditSubmit}
          initialProduct={product}
        />
      )}

      {/* Delete Confirmation Modal */}
      {canManage && (
        <Modal
          open={deleteOpen}
          onClose={deleting ? () => {} : () => setDeleteOpen(false)}
          title="حذف محصول"
          description={`آیا از حذف «${product.name}» اطمینان دارید؟`}
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                انصراف
              </Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>
                حذف محصول
              </Button>
            </>
          }
        >
          <p className="font-estedad text-sm leading-6 text-text-secondary">
            این عمل قابل برگشت نیست و محصول از فهرست فروشگاه حذف خواهد شد.
          </p>
        </Modal>
      )}
    </div>
  );
}

export default ProductDetails;
