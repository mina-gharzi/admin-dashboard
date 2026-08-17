/*
  ==========================================================
  ProductDetails.tsx
  ----------------------------------------------------------
  Product details page.
  ----------------------------------------------------------
  مسئولیت این صفحه:

  - دریافت محصول واقعی بر اساس :id از URL
  - نمایش اطلاعات کامل محصول
  - نمایش وضعیت و موجودی
  - نمایش قیمت
  - ویرایش محصول (ProductFormModal)
  - حذف محصول (با تأیید + بازگشت به لیست)
  - نمایش حالت «پیدا نشد» برای idهای نامعتبر
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

import ProductFormModal from "../components/product/ProductFormModal";

import { useData } from "../hooks/useData";
import { api, type Product } from "../services/api";
import { formatPrice } from "../utils/format";

/*
  ----------------------------------------------------------
  Product Details Page
  ----------------------------------------------------------
*/

function ProductDetails() {
  const navigate = useNavigate();

  /*
    Product ID از URL
  */
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  /*
    Data Fetching
  */
  const {
    data: product,
    loading,
    error,
    refetch,
  } = useData(() => api.products.getById(productId), [productId]);

  /*
    Edit Modal State
  */
  const [editOpen, setEditOpen] = useState(false);

  const handleEditSubmit = async (data: Omit<Product, "id">) => {
    if (!product) return;
    await api.products.update(product.id, data);
    toast.success(`محصول «${data.name}» ویرایش شد.`);
    await refetch();
  };

  /*
    Delete Confirmation State
  */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!product) return;

    setDeleting(true);
    try {
      await api.products.delete(product.id);
      toast.success(`محصول «${product.name}» حذف شد.`);
      navigate("/products");
    } finally {
      setDeleting(false);
    }
  };

  /*
    Loading State
  */
  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <p className="font-estedad text-sm text-text-secondary">
          در حال بارگذاری محصول...
        </p>
      </div>
    );
  }

  /*
    Error / Not Found State
  */
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <Package size={40} className="text-text-secondary" />

        <p className="font-estedad text-sm text-text-secondary">
          محصول مورد نظر پیدا نشد.
        </p>

        <Button variant="outline" onClick={() => navigate("/products")}>
          <ArrowRight size={17} />
          بازگشت به محصولات
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
          aria-label="بازگشت"
        >
          <ArrowRight size={18} />
        </button>

        <div>
          <h1 className="font-estedad text-2xl font-bold text-text-primary">
            جزئیات محصول
          </h1>

          <p className="mt-1 font-estedad text-sm text-text-secondary">
            مشاهده اطلاعات محصول
          </p>
        </div>
      </div>

      {/* Product Content */}

      <div className="grid gap-6 desktop:grid-cols-3">
        {/* Product Preview */}

        <Card className="desktop:col-span-1">
          <div className="flex min-h-80 items-center justify-center bg-background p-8">
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <Package size={72} strokeWidth={1.5} />
            </div>
          </div>
        </Card>

        {/* Product Information */}

        <Card className="desktop:col-span-2">
          <div className="border-b border-border p-5">
            <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
              <div>
                <p className="font-inter text-xs text-text-secondary">
                  Product #{product.id}
                </p>

                <h2 className="mt-1 font-estedad text-xl font-bold text-text-primary">
                  {product.name}
                </h2>
              </div>

              <Badge
                variant={product.status === "active" ? "success" : "danger"}
              >
                {product.status === "active" ? "فعال" : "غیرفعال"}
              </Badge>
            </div>
          </div>

          {/* Information Grid */}

          <div className="grid gap-5 p-5 tablet:grid-cols-2">
            <div>
              <p className="font-estedad text-xs text-text-secondary">
                دسته‌بندی
              </p>
              <p className="mt-1 font-estedad text-sm font-medium text-text-primary">
                {product.category}
              </p>
            </div>

            <div>
              <p className="font-estedad text-xs text-text-secondary">موجودی</p>
              <p className="mt-1 font-estedad text-sm font-medium text-text-primary">
                {product.stock} عدد
              </p>
            </div>

            <div>
              <p className="font-estedad text-xs text-text-secondary">قیمت</p>
              <p className="mt-1 font-estedad text-lg font-bold text-text-primary">
                {formatPrice(product.price)}
                <span className="mr-1 text-xs font-normal text-text-secondary">
                  تومان
                </span>
              </p>
            </div>

            <div>
              <p className="font-estedad text-xs text-text-secondary">
                شناسه محصول
              </p>
              <p className="mt-1 font-inter text-sm font-medium text-text-primary">
                #{product.id}
              </p>
            </div>
          </div>

          {/* Description */}

          {product.description && (
            <div className="border-t border-border p-5">
              <p className="font-estedad text-xs text-text-secondary">
                توضیحات
              </p>
              <p className="mt-2 font-estedad text-sm leading-7 text-text-secondary">
                {product.description}
              </p>
            </div>
          )}

          {/* Actions */}

          <div className="flex flex-col gap-3 border-t border-border p-5 tablet:flex-row">
            <Button onClick={() => setEditOpen(true)}>
              <Edit size={17} />
              ویرایش محصول
            </Button>

            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={17} />
              حذف محصول
            </Button>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}

      <ProductFormModal
        key={`${editOpen}-${product.id}`}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialProduct={product}
      />

      {/* Delete Confirmation Modal */}

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="حذف محصول"
        description={`آیا می‌خواهید محصول «${product.name}» را حذف کنید؟`}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              انصراف
            </Button>

            <Button
              variant="danger"
              loading={deleting}
              onClick={handleDeleteConfirm}
            >
              حذف
            </Button>
          </>
        }
      >
        <p className="font-estedad text-sm text-text-secondary">
          این عمل قابل برگشت نیست.
        </p>
      </Modal>
    </div>
  );
}

export default ProductDetails;
