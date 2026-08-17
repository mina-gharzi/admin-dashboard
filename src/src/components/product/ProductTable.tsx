/*
  ==========================================================
  ProductTable.tsx
  ----------------------------------------------------------
  Product management table — Dashboard design language
  ----------------------------------------------------------
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

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  MoreHorizontal,
  Package,
  PackageOpen,
  Pencil,
  ShieldAlert,
} from "lucide-react";

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
  Constants
  ----------------------------------------------------------
*/

const PAGE_SIZE = 8;

const columnHelper = createColumnHelper<Product>();

/*
  ----------------------------------------------------------
  Sort Icon
  ----------------------------------------------------------
*/

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded bg-primary-900/10 text-primary-900">
        <ChevronUp size={12} />
      </span>
    );
  }

  if (sorted === "desc") {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded bg-primary-900/10 text-primary-900">
        <ChevronDown size={12} />
      </span>
    );
  }

  return (
    <span className="flex h-4 w-4 items-center justify-center rounded opacity-0 transition-opacity group-hover/th:opacity-40">
      <ChevronUp size={12} />
    </span>
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
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        inline-flex h-8 items-center gap-1.5 rounded-lg
        border border-primary-300/70 bg-surface px-2.5
        font-estedad text-[11px] font-medium text-text-secondary
        transition-all active:scale-95
        hover:border-primary-900 hover:text-primary-900
        disabled:cursor-not-allowed disabled:opacity-35
      "
    >
      {children}
    </button>
  );
}

/*
  ----------------------------------------------------------
  Product Table
  ----------------------------------------------------------
*/

function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);

  /*
    --------------------------------------------------------
    Delete Modal
    --------------------------------------------------------
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
    --------------------------------------------------------
    Columns
    --------------------------------------------------------
  */

  const columns = [
    /*
      Product
    */

    columnHelper.accessor("name", {
      header: "محصول",

      cell: ({ row }) => {
        const product = row.original;

        return (
          <button
            type="button"
            onClick={() => navigate(`/dashboard/products/${product.id}`)}
            className="
              flex items-center gap-3
              text-right
              transition-opacity
              hover:opacity-75
            "
          >
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-linear-to-tr
                from-primary-900
                to-primary-700
                text-white
                shadow-sm
                ring-2 ring-primary-100/60
              "
            >
              <Package size={18} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="truncate font-estedad text-sm font-bold text-text-primary">
                {product.name}
              </p>

              <p className="mt-0.5 font-inter text-[11px] text-text-secondary">
                #{product.id}
              </p>
            </div>
          </button>
        );
      },
    }),

    /*
      Category
    */

    columnHelper.accessor("category", {
      header: "دسته‌بندی",

      cell: ({ getValue }) => (
        <span className="font-estedad text-xs text-text-secondary">
          {getValue()}
        </span>
      ),
    }),

    /*
      Price
    */

    columnHelper.accessor("price", {
      header: "قیمت",

      cell: ({ getValue }) => (
        <div className="whitespace-nowrap">
          <span className="font-estedad text-sm font-bold text-text-primary">
            {formatPrice(getValue())}
          </span>

          <span className="mr-1 font-estedad text-[11px] text-text-secondary">
            تومان
          </span>
        </div>
      ),
    }),

    /*
      Stock
    */

    columnHelper.accessor("stock", {
      header: "موجودی",

      cell: ({ getValue }) => {
        const stock = getValue();

        return (
          <span
            className={
              stock === 0
                ? "font-estedad text-xs font-medium text-danger"
                : "font-estedad text-xs text-text-primary"
            }
          >
            {stock === 0
              ? "موجود نیست"
              : `${stock.toLocaleString("fa-IR")} عدد`}
          </span>
        );
      },
    }),

    /*
      Status
    */

    columnHelper.accessor("status", {
      header: "وضعیت",

      cell: ({ getValue }) => {
        const status = getValue();

        return (
          <span
            className={`
              inline-flex items-center gap-2
              rounded-lg border
              px-2.5 py-1.5
              ${
                status === "active"
                  ? "border-success/25 bg-success/5"
                  : "border-danger/25 bg-danger/5"
              }
            `}
          >
            <span
              className={`
                h-1.5 w-1.5 rounded-full
                ${status === "active" ? "bg-success" : "bg-danger"}
              `}
            />

            <span
              className={`
                font-estedad text-[11px] font-medium
                ${status === "active" ? "text-success" : "text-danger"}
              `}
            >
              {status === "active" ? "فعال" : "غیرفعال"}
            </span>
          </span>
        );
      },
    }),

    /*
      Actions
    */

    columnHelper.display({
      id: "actions",
      header: "",
      enableSorting: false,

      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex justify-end">
            <Dropdown
              trigger={
                <button
                  type="button"
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-lg
                    text-text-secondary
                    transition-all
                    hover:bg-primary-100
                    hover:text-primary-900
                  "
                >
                  <MoreHorizontal size={18} />
                </button>
              }
              items={[
                {
                  label: "مشاهده",
                  icon: <Eye size={14} />,
                  onClick: () => navigate(`/dashboard/products/${product.id}`),
                },

                {
                  label: "ویرایش",
                  icon: <Pencil size={14} />,
                  onClick: () => onEdit?.(product),
                },

                {
                  label: "حذف",
                  icon: <ShieldAlert size={14} />,
                  danger: true,

                  onClick: () =>
                    setDeleteModal({
                      open: true,
                      productId: product.id,
                      productName: product.name,
                    }),
                },
              ]}
            />
          </div>
        );
      },
    }),
  ];

  /*
    --------------------------------------------------------
    React Table
    --------------------------------------------------------
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
        pageSize: PAGE_SIZE,
      },
    },
  });

  /*
    --------------------------------------------------------
    Delete Confirm
    --------------------------------------------------------
  */

  const handleDeleteConfirm = () => {
    if (deleteModal.productId !== null) {
      onDelete?.(deleteModal.productId);

      setDeleteModal({
        open: false,
        productId: null,
        productName: "",
      });
    }
  };

  /*
    --------------------------------------------------------
    Pagination
    --------------------------------------------------------
  */

  const currentPage = table.getState().pagination.pageIndex + 1;

  const pageCount = table.getPageCount();

  const rows = table.getRowModel().rows;

  const pageNumbers = Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
    if (pageCount <= 5) return i;

    if (currentPage <= 3) return i;

    if (currentPage >= pageCount - 2) {
      return pageCount - 5 + i;
    }

    return currentPage - 3 + i;
  });

  /*
    --------------------------------------------------------
    Render
    --------------------------------------------------------
  */

  return (
    <>
      {/* ==================================================
          Table
          ================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-187.5">
          {/* ------------------------------------------------
              Header
          ------------------------------------------------ */}

          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="
                  border-b
                  border-primary-300/60
                  bg-primary-100/25
                "
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();

                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className="
                        px-6 py-3
                        text-right
                        first:pr-6
                        last:pl-6
                      "
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          disabled={!canSort}
                          onClick={header.column.getToggleSortingHandler()}
                          className={`
                            group/th
                            inline-flex
                            items-center
                            gap-1.5
                            font-estedad
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider

                            ${
                              canSort
                                ? "cursor-pointer select-none text-text-secondary transition hover:text-primary-900"
                                : "cursor-default text-text-secondary"
                            }
                          `}
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

          {/* ------------------------------------------------
              Body
          ------------------------------------------------ */}

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="
                  group
                  border-b
                  border-primary-100/60
                  transition-colors
                  last:border-0
                  hover:bg-primary-100/20
                "
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="
                      px-6 py-3
                      first:pr-6
                      last:pl-6
                    "
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==================================================
          Empty State
          ================================================== */}

      {rows.length === 0 && (
        <div
          className="
          flex
          flex-col
          items-center
          justify-center
          px-6
          py-16
          text-center
        "
        >
          <div
            className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-primary-100
            text-primary-900
          "
          >
            <PackageOpen size={24} strokeWidth={1.5} />
          </div>

          <p
            className="
            mt-4
            font-estedad
            text-sm
            font-bold
            text-text-primary
          "
          >
            محصولی یافت نشد
          </p>

          <p
            className="
            mt-1
            max-w-xs
            font-estedad
            text-xs
            leading-6
            text-text-secondary
          "
          >
            جستجو یا فیلترهای خود را تغییر دهید تا محصولات نمایش داده شوند.
          </p>
        </div>
      )}

      {/* ==================================================
          Pagination
          ================================================== */}

      {rows.length > 0 && pageCount > 1 && (
        <div
          className="
          flex
          flex-col
          gap-3
          border-t
          border-primary-300/60
          px-6
          py-3.5
          tablet:flex-row
          tablet:items-center
          tablet:justify-between
        "
        >
          {/* Page Info */}

          <p
            className="
            font-estedad
            text-[11px]
            text-text-secondary
          "
          >
            صفحه{" "}
            <span
              className="
              font-bold
              text-primary-900
            "
            >
              {currentPage.toLocaleString("fa-IR")}
            </span>{" "}
            از{" "}
            <span
              className="
              font-bold
              text-primary-900
            "
            >
              {pageCount.toLocaleString("fa-IR")}
            </span>
          </p>

          {/* Pagination Controls */}

          <div className="flex items-center gap-1.5">
            {/* Previous */}

            <PageBtn
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronRight size={14} />
              قبلی
            </PageBtn>

            {/* Left Ellipsis */}

            {pageNumbers[0] > 0 && (
              <span
                className="
                px-1
                font-estedad
                text-xs
                text-text-secondary
              "
              >
                ...
              </span>
            )}

            {/* Page Numbers */}

            {pageNumbers.map((page) => {
              const isActive = currentPage === page + 1;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => table.setPageIndex(page)}
                  className={`
                    h-8
                    min-w-8
                    rounded-lg
                    px-2
                    font-inter
                    text-xs
                    font-bold
                    transition-all
                    active:scale-95

                    ${
                      isActive
                        ? "bg-primary-900 text-white shadow-sm shadow-primary-900/20"
                        : "text-text-secondary hover:bg-primary-100 hover:text-primary-900"
                    }
                  `}
                >
                  {(page + 1).toLocaleString("fa-IR")}
                </button>
              );
            })}

            {/* Right Ellipsis */}

            {pageNumbers[pageNumbers.length - 1] < pageCount - 1 && (
              <span
                className="
                px-1
                font-estedad
                text-xs
                text-text-secondary
              "
              >
                ...
              </span>
            )}

            {/* Next */}

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
        onClose={() =>
          setDeleteModal({
            open: false,
            productId: null,
            productName: "",
          })
        }
        title="حذف محصول"
        description={`آیا از حذف «${deleteModal.productName}» اطمینان دارید؟`}
        footer={
          <div className="flex items-center gap-3">
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
              انصراف
            </Button>

            <Button variant="danger" onClick={handleDeleteConfirm}>
              بله، حذف شود
            </Button>
          </div>
        }
      >
        <div
          className="
          flex
          items-start
          gap-3
          rounded-xl
          border
          border-danger/20
          bg-danger/5
          p-4
        "
        >
          <div
            className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-danger/10
            text-danger
          "
          >
            <ShieldAlert size={18} />
          </div>

          <p
            className="
            font-estedad
            text-xs
            leading-6
            text-text-secondary
          "
          >
            این عمل غیرقابل بازگشت است. تمام اطلاعات این محصول به‌صورت دائمی حذف
            خواهد شد.
          </p>
        </div>
      </Modal>
    </>
  );
}

export default ProductTable;
