/*
  ==========================================================
  ProductTable.tsx
  ----------------------------------------------------------
  جدول محصولات — جستجو/فیلتر از بیرون (ProductFilters) میاد،
  این کامپوننت فقط مسئول نمایش، مرتب‌سازی، صفحه‌بندی و
  اکشن‌های هر ردیفه.

  Responsive:
  از desktop:sm به بالا جدول واقعی نمایش داده میشه؛ زیر اون
  (موبایل) به یه لیست کارتی تبدیل میشه تا اسکرول افقی لازم
  نباشه و لمس‌کردن دکمه‌ها راحت‌تر باشه.
  ==========================================================
*/

import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  MoreHorizontal,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import { Dropdown } from "../ui/Dropdown";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";

import type { Product } from "../../services/api";
import { formatPrice } from "../../utils/format";
import { useAuthStore } from "../../store";
import { permissions } from "../../utils/permissions";

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void | Promise<void>;
}

const PAGE_SIZE = 8;
const columnHelper = createColumnHelper<Product>();

/*
  ----------------------------------------------------------
  Sort Icon
  ----------------------------------------------------------
*/

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") {
    return <ChevronUp size={13} className="text-primary-900" />;
  }
  if (sorted === "desc") {
    return <ChevronDown size={13} className="text-primary-900" />;
  }
  return (
    <ChevronUp size={13} className="opacity-0 transition-opacity group-hover/th:opacity-40" />
  );
}

/*
  ----------------------------------------------------------
  Pagination Button
  ----------------------------------------------------------
*/

function PageBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary-300/60 bg-surface px-2.5 font-estedad text-[11px] font-medium text-text-secondary transition hover:border-primary-900 hover:text-primary-900 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

/*
  ----------------------------------------------------------
  Status Badge (shared between table row & mobile card)
  ----------------------------------------------------------
*/

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-estedad text-[11px] font-medium ${
        active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-success" : "bg-danger"}`} />
      {active ? "فعال" : "غیرفعال"}
    </span>
  );
}

/*
  ----------------------------------------------------------
  Stock Label
  ----------------------------------------------------------
*/

function stockTone(stock: number) {
  if (stock === 0) return "text-danger";
  if (stock <= 10) return "text-warning";
  return "text-text-primary";
}

function stockLabel(stock: number) {
  return stock === 0 ? "ناموجود" : `${stock.toLocaleString("fa-IR")} عدد`;
}

function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const role = useAuthStore((state) => state.user?.role);
  const canManage = permissions.canManageProducts(role);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    productId: number | null;
    productName: string;
  }>({ open: false, productId: null, productName: "" });

  const [deleting, setDeleting] = useState(false);

  const buildActionItems = (product: Product) => [
    {
      label: "مشاهده",
      icon: <Eye size={14} />,
      onClick: () => navigate(`/dashboard/products/${product.id}`),
    },
    ...(canManage
      ? [
          {
            label: "ویرایش",
            icon: <Pencil size={14} />,
            onClick: () => onEdit?.(product),
          },
          {
            label: "حذف",
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: () =>
              setDeleteModal({
                open: true,
                productId: product.id,
                productName: product.name,
              }),
          },
        ]
      : []),
  ];

  const columns = [
    columnHelper.accessor("name", {
      header: "محصول",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <button
            type="button"
            onClick={() => navigate(`/dashboard/products/${product.id}`)}
            className="flex min-w-0 items-center gap-3 text-right"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-900 transition group-hover:bg-primary-900 group-hover:text-white">
              <Package size={18} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-estedad text-sm font-semibold text-text-primary transition-colors hover:text-primary-900">
                {product.name}
              </p>
              <p className="mt-0.5 font-inter text-[10px] text-text-secondary">
                #{product.id}
              </p>
            </div>
          </button>
        );
      },
    }),

    columnHelper.accessor("category", {
      header: "دسته‌بندی",
      cell: ({ getValue }) => (
        <span className="font-estedad text-xs text-text-secondary">
          {getValue()}
        </span>
      ),
    }),

    columnHelper.accessor("price", {
      header: "قیمت",
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap font-estedad text-sm font-semibold text-text-primary">
          {formatPrice(getValue())}
          <span className="mr-1 text-[10px] font-normal text-text-secondary">
            تومان
          </span>
        </span>
      ),
    }),

    columnHelper.accessor("stock", {
      header: "موجودی",
      cell: ({ getValue }) => {
        const stock = getValue();
        return (
          <span className={`font-estedad text-xs font-medium ${stockTone(stock)}`}>
            {stockLabel(stock)}
          </span>
        );
      },
    }),

    columnHelper.accessor("status", {
      header: "وضعیت",
      cell: ({ getValue }) => <StatusBadge active={getValue() === "active"} />,
    }),

    columnHelper.display({
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Dropdown
            trigger={
              <button
                type="button"
                aria-label="عملیات محصول"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-primary-50 hover:text-primary-900"
              >
                <MoreHorizontal size={18} />
              </button>
            }
            items={buildActionItems(row.original)}
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const rows = table.getRowModel().rows;

  const pageNumbers = Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
    if (pageCount <= 5) return i;
    if (currentPage <= 3) return i;
    if (currentPage >= pageCount - 2) return pageCount - 5 + i;
    return currentPage - 3 + i;
  });

  const closeDeleteModal = () =>
    setDeleteModal({ open: false, productId: null, productName: "" });

  const confirmDelete = async () => {
    if (deleteModal.productId === null) return;

    setDeleting(true);
    try {
      await onDelete?.(deleteModal.productId);
      closeDeleteModal();
    } catch {
      // خطا از سمت صفحه‌ی والد با toast نمایش داده میشه؛
      // اینجا فقط مودال رو باز نگه می‌داریم تا کاربر دوباره تلاش کنه
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* ==================================================
          Desktop / Tablet Table
          ================================================== */}

      <div className="hidden tablet:block">
        <div className="overflow-x-auto">
          <table aria-label="جدول محصولات" className="w-full min-w-190">
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr
                  key={group.id}
                  className="border-b border-primary-300/60 bg-primary-50/50"
                >
                  {group.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"}
                        className="px-5 py-3 text-right first:pr-6 last:pl-6"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            disabled={!canSort}
                            aria-label={`مرتب‌سازی بر اساس ${typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : "این ستون"}`}
                            onClick={header.column.getToggleSortingHandler()}
                            className={`group/th inline-flex items-center gap-1 font-estedad text-[11px] font-semibold ${
                              canSort
                                ? "cursor-pointer select-none text-text-secondary transition hover:text-primary-900"
                                : "cursor-default text-text-secondary"
                            }`}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {canSort && <SortIcon sorted={sorted} />}
                          </button>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="group border-b border-primary-100/60 transition-colors last:border-0 hover:bg-primary-50/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3.5 first:pr-6 last:pl-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================
          Mobile Card List
          ==================================================
          زیر تبلت، به‌جای جدول با اسکرول افقی، یه لیست کارتی
          نمایش داده میشه تا لمس کردن راحت‌تر باشه.
          ================================================== */}

      <div className="divide-y divide-primary-100/60 tablet:hidden">
        {rows.map((row) => {
          const product = row.original;

          return (
            <div key={row.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/products/${product.id}`)}
                  className="flex min-w-0 items-center gap-3 text-right"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-900">
                    <Package size={18} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-estedad text-sm font-semibold text-text-primary">
                      {product.name}
                    </p>
                    <p className="mt-0.5 font-inter text-[10px] text-text-secondary">
                      #{product.id} · {product.category}
                    </p>
                  </div>
                </button>

                <Dropdown
                  trigger={
                    <button
                      type="button"
                      aria-label="عملیات محصول"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-primary-50 hover:text-primary-900"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  }
                  items={buildActionItems(product)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-estedad text-sm font-semibold text-text-primary">
                  {formatPrice(product.price)}
                  <span className="mr-1 text-[10px] font-normal text-text-secondary">
                    تومان
                  </span>
                </span>

                <span className={`font-estedad text-xs font-medium ${stockTone(product.stock)}`}>
                  {stockLabel(product.stock)}
                </span>
              </div>

              <StatusBadge active={product.status === "active"} />
            </div>
          );
        })}
      </div>

      {/* ==================================================
          Empty State (دفاعی — برای زمانی که این کامپوننت
          بدون گارد بیرونی و با آرایه‌ی خالی رندر بشه)
          ================================================== */}

      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
            <Package size={22} strokeWidth={1.6} />
          </div>
          <p className="font-estedad text-sm font-medium text-text-primary">
            محصولی یافت نشد
          </p>
        </div>
      )}

      {/* ==================================================
          Pagination
          ================================================== */}

      {rows.length > 0 && pageCount > 1 && (
        <div className="flex flex-col gap-3 border-t border-primary-100/70 px-5 py-3.5 tablet:flex-row tablet:items-center tablet:justify-between">
          <span className="text-center font-estedad text-[11px] text-text-secondary">
            صفحه {currentPage.toLocaleString("fa-IR")} از{" "}
            {pageCount.toLocaleString("fa-IR")}
          </span>

          <div className="flex items-center justify-center gap-1.5">
            <PageBtn
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronRight size={14} />
              قبلی
            </PageBtn>

            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                aria-label={`صفحه ${page + 1}`}
                aria-current={page === currentPage - 1 ? "page" : undefined}
                onClick={() => table.setPageIndex(page)}
                className={`h-8 min-w-8 rounded-lg px-2 font-estedad text-[11px] ${
                  page === currentPage - 1
                    ? "bg-primary-900 text-white"
                    : "text-text-secondary hover:bg-primary-50 hover:text-primary-900"
                }`}
              >
                {(page + 1).toLocaleString("fa-IR")}
              </button>
            ))}

            <PageBtn
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              بعدی
              <ChevronLeft size={14} />
            </PageBtn>
          </div>
        </div>
      )}

      {/* ==================================================
          Delete Confirmation Modal
          ================================================== */}

      <Modal
        open={deleteModal.open}
        onClose={deleting ? () => {} : closeDeleteModal}
        title="حذف محصول"
        description={`آیا از حذف «${deleteModal.productName}» اطمینان دارید؟`}
        footer={
          <>
            <Button variant="outline" onClick={closeDeleteModal} disabled={deleting}>
              انصراف
            </Button>
            <Button variant="danger" loading={deleting} onClick={confirmDelete}>
              حذف محصول
            </Button>
          </>
        }
      >
        <p className="font-estedad text-sm leading-6 text-text-secondary">
          این عمل قابل برگشت نیست و محصول از فهرست فروشگاه حذف خواهد شد.
        </p>
      </Modal>
    </>
  );
}

export default ProductTable;
