/*
  ==========================================================
  Products.tsx
  ----------------------------------------------------------
  Products management page — polished Dashboard language
  ==========================================================
*/

import { useMemo, useState } from "react";
import { AlertCircle, Download, Package, Plus } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import ProductTable from "../components/product/ProductTable";
import ProductFilters from "../components/product/ProductFilters";
import ProductFormModal from "../components/product/ProductFormModal";

import { useData } from "../hooks/useData";
import { api, type Product } from "../services/api";
import { formatPrice } from "../utils/format";
import { exportToCsv, getFileDateStamp } from "../utils/exportToCsv";
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
  const [formModal, setFormModal] = useState<{
    open: boolean;
    editingProduct: Product | null;
  }>({ open: false, editingProduct: null });

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

  const openCreateModal = () => setFormModal({ open: true, editingProduct: null });
  const openEditModal = (product: Product) => setFormModal({ open: true, editingProduct: product });
  const closeFormModal = () => setFormModal({ open: false, editingProduct: null });

  const handleFormSubmit = async (data: Omit<Product, "id">) => {
    try {
      if (formModal.editingProduct) {
        await api.products.update(formModal.editingProduct.id, data);
        toast.success(`محصول «${data.name}» ویرایش شد.`);
      } else {
        await api.products.create(data);
        toast.success(`محصول «${data.name}» با موفقیت اضافه شد.`);
      }
      await refetch();
    } catch (err) {
      toast.error("خطا در ذخیره‌سازی محصول. دوباره تلاش کنید.");
      // دوباره throw می‌کنیم تا ProductFormModal مودال رو نبنده
      // (چون موفقیت‌آمیز نبوده) و کاربر بتونه دوباره تلاش کنه
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.products.delete(id);
      toast.success("محصول حذف شد.");
      await refetch();
    } catch (err) {
      toast.error("خطا در حذف محصول. دوباره تلاش کنید.");
      throw err;
    }
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
              <Button onClick={openCreateModal}>
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

        {loading && (
          <div className="flex min-h-72 items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
              <p className="font-estedad text-sm text-text-secondary">در حال بارگذاری محصولات...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertCircle size={24} />
            </div>
            <p className="font-estedad text-sm font-medium text-text-primary">خطا در دریافت اطلاعات</p>
            <p className="font-estedad text-xs text-text-secondary">{error.message}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-1">
              تلاش مجدد
            </Button>
          </div>
        )}

        {!loading && !error && products && products.length === 0 && (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <Package size={24} />
            </div>
            <p className="font-estedad text-sm font-semibold text-text-primary">هنوز محصولی ثبت نشده است</p>
            <p className="font-estedad text-xs text-text-secondary">برای شروع، اولین محصول فروشگاه را اضافه کنید.</p>
            {canManage && (
              <Button size="sm" onClick={openCreateModal} className="mt-1">
                <Plus size={16} />
                افزودن اولین محصول
              </Button>
            )}
          </div>
        )}

        {!loading && !error && products && products.length > 0 && filteredProducts.length === 0 && (
          <div className="flex min-h-56 flex-col items-center justify-center gap-2 p-10 text-center">
            <p className="font-estedad text-sm font-medium text-text-primary">محصولی با این فیلتر پیدا نشد</p>
            <p className="font-estedad text-xs text-text-secondary">جستجو، دسته‌بندی یا وضعیت انتخاب‌شده را تغییر دهید.</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <ProductTable products={filteredProducts} onEdit={openEditModal} onDelete={handleDelete} />
        )}
      </Card>

      <ProductFormModal
        key={`${formModal.open}-${formModal.editingProduct?.id ?? "create"}`}
        open={formModal.open}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        initialProduct={formModal.editingProduct}
      />
    </div>
  );
}

export default Products;
