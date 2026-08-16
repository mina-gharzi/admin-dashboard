/*
  ==========================================================
  Products.tsx
  ----------------------------------------------------------
  Products management page.
  ----------------------------------------------------------
  این صفحه مسئول هماهنگ کردن:

  - Product Filters
  - Product Table
  - Product data (از services/api)
  - افزودن / ویرایش محصول (ProductFormModal)
  ==========================================================
*/

import { useMemo, useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

import ProductTable from "../components/product/ProductTable";
import ProductFilters from "../components/product/ProductFilters";
import ProductFormModal from "../components/product/ProductFormModal";

import { useData } from "../hooks/useData";
import { api, type Product } from "../services/api";

/*
  ----------------------------------------------------------
  Products Page
  ----------------------------------------------------------
*/

function Products() {
  /*
    --------------------------------------------------------
    Data Fetching
    --------------------------------------------------------
  */

  const {
    data: products,
    loading,
    error,
    refetch,
  } = useData(() => api.products.getAll(), []);

  /*
    --------------------------------------------------------
    Filters
    --------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("همه");

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "همه" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  /*
    --------------------------------------------------------
    Form Modal State (Create / Edit)
    --------------------------------------------------------
  */

  const [formModal, setFormModal] = useState<{
    open: boolean;
    editingProduct: Product | null;
  }>({ open: false, editingProduct: null });

  const openCreateModal = () => {
    setFormModal({ open: true, editingProduct: null });
  };

  const openEditModal = (product: Product) => {
    setFormModal({ open: true, editingProduct: product });
  };

  const closeFormModal = () => {
    setFormModal({ open: false, editingProduct: null });
  };

  const handleFormSubmit = async (data: Omit<Product, "id">) => {
    if (formModal.editingProduct) {
      await api.products.update(formModal.editingProduct.id, data);
      toast.success(`محصول «${data.name}» ویرایش شد.`);
    } else {
      await api.products.create(data);
      toast.success(`محصول «${data.name}» با موفقیت اضافه شد.`);
    }

    await refetch();
  };

  /*
    --------------------------------------------------------
    Other Actions
    --------------------------------------------------------
  */

  const handleDelete = async (id: number) => {
    await api.products.delete(id);
    toast.success("محصول حذف شد.");
    await refetch();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <PageHeader
        title="محصولات"
        description="مدیریت محصولات فروشگاه"
        breadcrumbs={[{ label: "محصولات" }]}
        actions={
          <Button onClick={openCreateModal}>
            <Plus size={18} />
            افزودن محصول
          </Button>
        }
      />

      {/* Products Card */}

      <Card className="overflow-hidden">
        <ProductFilters
          search={search}
          category={category}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          resultCount={filteredProducts.length}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-12">
            <p className="font-vazirmatn text-sm text-text-secondary">
              در حال بارگذاری محصولات...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center p-12">
            <p className="font-vazirmatn text-sm text-danger">
              خطا در دریافت اطلاعات: {error.message}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products && products.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <p className="font-vazirmatn text-sm text-text-secondary">
              هنوز هیچ محصولی ثبت نشده است.
            </p>
            <Button size="sm" onClick={openCreateModal}>
              <Plus size={16} />
              افزودن اولین محصول
            </Button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && products && products.length > 0 && (
          <ProductTable
            products={filteredProducts}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {/* Form Modal */}

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
