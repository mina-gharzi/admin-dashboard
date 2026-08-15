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
  ==========================================================
*/

import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

import ProductTable from "../components/product/ProductTable";
import ProductFilters from "../components/product/ProductFilters";

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
    Actions
    --------------------------------------------------------
  */

  const handleDelete = async (id: number) => {
    await api.products.delete(id);
    await refetch();
  };

  const handleEdit = (product: Product) => {
    // TODO: باز کردن مودال ویرایش محصول
    console.log("Edit product:", product);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <PageHeader
        title="محصولات"
        description="مدیریت محصولات فروشگاه"
        breadcrumbs={[{ label: "محصولات" }]}
        actions={
          <Button>
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

        {/* Table */}
        {!loading && !error && (
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </div>
  );
}

export default Products;
