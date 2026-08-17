/*
  ==========================================================
  ProductTable.tsx (FIXED)
  ----------------------------------------------------------
  اصلاحات:
  - Navigate to product details ✓
  - Functional actions ✓
  - Modal support ✓
  - Delete confirmation ✓
  ==========================================================
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import { ChevronDown, ChevronUp, MoreHorizontal, Package } from "lucide-react";

import { Badge } from "../ui/Badge";
import { Dropdown } from "../ui/Dropdown";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";

import type { Product } from "../../services/api";
import { formatPrice } from "../../utils/format";

/*
  ----------------------------------------------------------
  Props
  ----------------------------------------------------------
*/

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

/*
  ----------------------------------------------------------
  Column Helper
  ----------------------------------------------------------
*/

const columnHelper = createColumnHelper<Product>();

/*
  ----------------------------------------------------------
  Product Table
  ----------------------------------------------------------
*/

function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const navigate = useNavigate();

  /*
    Sorting State
  */
  const [sorting, setSorting] = useState<SortingState>([]);

  /*
    Delete Confirmation Modal
  */
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    productId: number | null;
    productName: string;
  }>({
    open: false,
    productId: null,
    productName: "",
  });

  /*
    Columns
  */
  const columns = [
    columnHelper.accessor("name", {
      header: "محصول",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <button
            type="button"
            onClick={() => navigate(`/products/${product.id}`)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-75 transition-opacity"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-900">
              <Package size={19} />
            </div>

            <div className="text-left">
              <p className="font-estedad text-sm font-medium text-text-primary">
                {product.name}
              </p>

              <p className="mt-0.5 font-inter text-xs text-text-secondary">
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
        <span className="font-estedad text-sm text-text-secondary">
          {getValue()}
        </span>
      ),
    }),

    columnHelper.accessor("price", {
      header: "قیمت",
      cell: ({ getValue }) => (
        <div>
          <span className="font-estedad text-sm font-medium text-text-primary">
            {formatPrice(getValue())}
          </span>

          <span className="mr-1 font-estedad text-xs text-text-secondary">
            تومان
          </span>
        </div>
      ),
    }),

    columnHelper.accessor("stock", {
      header: "موجودی",
      cell: ({ getValue }) => {
        const stock = getValue();

        return (
          <span
            className={
              stock === 0
                ? "font-estedad text-sm text-danger font-medium"
                : "font-estedad text-sm text-text-primary"
            }
          >
            {stock === 0 ? "موجود نیست" : `${stock} عدد`}
          </span>
        );
      },
    }),

    columnHelper.accessor("status", {
      header: "وضعیت",
      cell: ({ getValue }) => {
        const status = getValue();

        return (
          <Badge variant={status === "active" ? "success" : "danger"}>
            {status === "active" ? "فعال" : "غیرفعال"}
          </Badge>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "عملیات",
      enableSorting: false,
      cell: ({ row }) => (
        <Dropdown
          trigger={<MoreHorizontal size={18} />}
          items={[
            {
              label: "مشاهده",
              onClick: () => navigate(`/products/${row.original.id}`),
            },
            {
              label: "ویرایش",
              onClick: () => onEdit?.(row.original),
            },
            {
              label: "حذف",
              onClick: () => {
                setDeleteModal({
                  open: true,
                  productId: row.original.id,
                  productName: row.original.name,
                });
              },
              danger: true,
            },
          ]}
        />
      ),
    }),
  ];

  /*
    Table Instance
  */
  const table = useReactTable({
    data: products,
    columns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  /*
    Sort Icon
  */
  const SortIcon = ({ sorted }: { sorted: false | "asc" | "desc" }) => {
    if (sorted === "asc") return <ChevronUp size={14} />;
    if (sorted === "desc") return <ChevronDown size={14} />;
    return null;
  };

  /*
    Handle Delete
  */
  const handleDeleteConfirm = () => {
    if (deleteModal.productId !== null) {
      onDelete?.(deleteModal.productId);
      setDeleteModal({ open: false, productId: null, productName: "" });
    }
  };

  return (
    <>
      {/* ==================================================
          Table
          ================================================== */}

      <div>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-border bg-background text-right"
                >
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className="px-5 py-3 font-estedad text-xs font-medium text-text-secondary"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            disabled={!canSort}
                            onClick={header.column.getToggleSortingHandler()}
                            className={[
                              "inline-flex items-center gap-1",
                              canSort
                                ? "cursor-pointer hover:text-text-primary"
                                : "cursor-default",
                            ].join(" ")}
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

            {/* Body */}
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 hover:bg-background"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {table.getRowModel().rows.length === 0 && (
          <div className="p-12 text-center">
            <Package size={32} className="mx-auto text-text-secondary" />

            <p className="mt-3 font-estedad text-sm text-text-secondary">
              محصولی پیدا نشد.
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-border px-5 py-4 tablet:flex-row tablet:items-center tablet:justify-between">
          <p className="font-estedad text-xs text-text-secondary">
            صفحه{" "}
            <span className="font-medium text-text-primary">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            از{" "}
            <span className="font-medium text-text-primary">
              {table.getPageCount() || 1}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-md border border-border px-3 py-2 font-estedad text-xs text-text-secondary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              قبلی
            </button>

            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-md border border-border px-3 py-2 font-estedad text-xs text-text-secondary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          Delete Confirmation Modal
          ================================================== */}

      <Modal
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({
            open: false,
            productId: null,
            productName: "",
          })
        }
        title="حذف محصول"
        description={`آیا می‌خواهید محصول "${deleteModal.productName}" را حذف کنید؟`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteModal({
                  open: false,
                  productId: null,
                  productName: "",
                })
              }
            >
              لغو
            </Button>

            <Button variant="danger" onClick={handleDeleteConfirm}>
              حذف
            </Button>
          </>
        }
      >
        <p className="font-estedad text-sm text-text-secondary">
          این عمل قابل برگشت نیست. تمام داده‌های محصول حذف خواهد شد.
        </p>
      </Modal>
    </>
  );
}

export default ProductTable;
