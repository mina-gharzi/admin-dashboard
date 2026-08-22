/*
  ==========================================================
  Products.tsx
  ----------------------------------------------------------
  Products management page — polished Dashboard language
  ==========================================================
*/

import { useMemo, useState } from "react";
import { Download, Package, Plus } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import ResourceState from "../components/ui/ResourceState";
import ProductTable from "../components/product/ProductTable";
import ProductFilters from "../components/product/ProductFilters";
import ProductFormModal from "../components/product/ProductFormModal";

import { useData } from "../hooks/useData";
import { useEditModal } from "../hooks/useEditModal";
import { api, type Product } from "../services/api";
import { formatPrice } from "../utils/format";
import { exportToCsv, getFileDateStamp } from "../utils/exportToCsv";
import { runWithToast } from "../utils/toastAction";
import { useAuthStore } from "../store";
import { permissions } from "../utils/permissions";

function Products() {
  const role = useAuthStore((state) => state.user?.role);
  const canManage = permissions.canManageProducts(role);

  const { data: products, loading, error, refetch } = useData(
    () => api.products.getAll(),
    [],
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("همه");
  const [status, setStatus] = useState("همه");

  const formModal = useEditModal<Product>();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const searchValue = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchValue);
      const matchesCategory = category === "همه" || product.category === category;
      const matchesStatus = status === "همه" || product.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const handleFormSubmit = async (data: Omit<Product, "id">) => {
    await runWithToast(
      () =>
        formModal.editingItem
          ? api.products.update(formModal.editingItem.id, data)
          : api.products.create(data),
      {
        success: formModal.editingItem
          ? `محصول «${data.name}» ویرایش شد.`
          : `محصول «${data.name}» با موفقیت اضافه شد.`,
        error: "خطا در ذخیره‌سازی محصول. دوباره تلاش کنید.",
      },
    );
    await refetch();
  };

  const handleDelete = async (id: number) => {
    await runWithToast(() => api.products.delete(id), {
      success: "محصول حذف شد.",
      error: "خطا در حذف محصول. دوباره تلاش کنید.",
    });
    await refetch();
  };

  const activeCount = products?.filter((item) => item.status === "active").length ?? 0;
  const lowStockCount = products?.filter((item) => item.stock > 0 && item.stock <= 10).length ?? 0;

  // خروجی CSV از محصولات فیلترشده
  const handleExport = () => {
    if (filteredProducts.length === 0) {
      toast.info("موردی برای خروجی گرفتن وجود ندارد.");
      return;
    }

    exportToCsv(
      filteredProducts,
      [
        { header: "نام محصول", accessor: (product) => product.name },
        { header: "دسته‌بندی", accessor: (product) => product.category },
        { header: "قیمت (تومان)", accessor: (product) => formatPrice(product.price) },
        { header: "موجودی", accessor: (product) => product.stock },
        {
          header: "وضعیت",
          accessor: (product) =>
            product.status === "active" ? "فعال" : "غیرفعال",
        },
      ],
      `محصولات-${getFileDateStamp()}`,
    );

    toast.success(`خروجی ${filteredProducts.length} محصول با موفقیت دانلود شد.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="محصولات"
        description="مدیریت محصولات، موجودی و اطلاعات فروشگاه"
        breadcrumbs={[{ label: "محصولات" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={filteredProducts.length === 0}
            >
              <Download size={17} />
              خروجی CSV
            </Button>

            {canManage && (
              <Button onClick={formModal.openCreate}>
                <Plus size={18} />
                افزودن محصول
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-4 tablet:grid-cols-3">
        <Card className="p-4">
          <p className="font-estedad text-xs text-text-secondary">کل محصولات</p>
          <p className="mt-1 font-estedad text-xl font-bold text-text-primary">
            {(products?.length ?? 0).toLocaleString("fa-IR")}
          </p>
        </Card>
        <Card className="p-4">
          <p className="font-estedad text-xs text-text-secondary">محصولات فعال</p>
          <p className="mt-1 font-estedad text-xl font-bold text-success">
            {activeCount.toLocaleString("fa-IR")}
          </p>
        </Card>
        <Card className="p-4">
          <p className="font-estedad text-xs text-text-secondary">موجودی رو به اتمام</p>
          <p className="mt-1 font-estedad text-xl font-bold text-text-primary">
            {lowStockCount.toLocaleString("fa-IR")}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden border border-primary-300/60 p-0">
        <ProductFilters
          search={search}
          category={category}
          status={status}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
          resultCount={filteredProducts.length}
        />

        <ResourceState
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingText="در حال بارگذاری محصولات..."
          isEmpty={!!products && products.length === 0}
          emptyIcon={Package}
          emptyTitle="هنوز محصولی ثبت نشده است"
          emptyDescription="برای شروع، اولین محصول فروشگاه را اضافه کنید."
          emptyAction={
            canManage && (
              <Button size="sm" onClick={formModal.openCreate} className="mt-1">
                <Plus size={16} />
                افزودن اولین محصول
              </Button>
            )
          }
        >
          {filteredProducts.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-2 p-10 text-center">
              <p className="font-estedad text-sm font-medium text-text-primary">محصولی با این فیلتر پیدا نشد</p>
              <p className="font-estedad text-xs text-text-secondary">جستجو، دسته‌بندی یا وضعیت انتخاب‌شده را تغییر دهید.</p>
            </div>
          ) : (
            <ProductTable products={filteredProducts} onEdit={formModal.openEdit} onDelete={handleDelete} />
          )}
        </ResourceState>
      </Card>

      <ProductFormModal
        key={`${formModal.open}-${formModal.editingItem?.id ?? "create"}`}
        open={formModal.open}
        onClose={formModal.close}
        onSubmit={handleFormSubmit}
        initialProduct={formModal.editingItem}
      />
    </div>
  );
}

export default Products;
