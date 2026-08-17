/*
  ==========================================================
  OrderTable.tsx
  ----------------------------------------------------------
  Orders data table.
  ----------------------------------------------------------
  مسئولیت این Component:

  - نمایش سفارش‌ها
  - نمایش شماره سفارش
  - نمایش مشتری
  - نمایش مبلغ
  - نمایش وضعیت سفارش
  - نمایش تاریخ
  - Sorting
  - Pagination
  - Actionهای سفارش (مشاهده / ویرایش / لغو)
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

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  MoreHorizontal,
  PackageOpen,
  Pencil,
  ShieldAlert,
  ShoppingBag,
  XCircle,
} from "lucide-react";

import { Dropdown } from "../ui/Dropdown";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";

import type { Order } from "../../services/api";
import { formatPrice } from "../../utils/format";

/*
  ----------------------------------------------------------
  Types & Constants
  ----------------------------------------------------------
*/

interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
  onEdit?: (order: Order) => void;
  onCancel?: (id: string) => void;
}

const PAGE_SIZE = 8;

const statusConfig = {
  pending: {
    label: "در انتظار",
    variant: "warning",
    dot: "bg-warning",
    ring: "border-warning/25 bg-warning/5",
  },
  processing: {
    label: "در حال پردازش",
    variant: "info",
    dot: "bg-info",
    ring: "border-info/25 bg-info/5",
  },
  completed: {
    label: "تکمیل شده",
    variant: "success",
    dot: "bg-success",
    ring: "border-success/25 bg-success/5",
  },
  cancelled: {
    label: "لغو شده",
    variant: "danger",
    dot: "bg-danger",
    ring: "border-danger/25 bg-danger/5",
  },
} as const;

const columnHelper = createColumnHelper<Order>();

/*
  ----------------------------------------------------------
  Loading Skeleton
  ----------------------------------------------------------
*/

function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-187.5">
        <thead>
          <tr className="border-b border-primary-300/60 bg-primary-100/25">
            {["سفارش", "مشتری", "مبلغ", "وضعیت", "تاریخ", ""].map((h) => (
              <th key={h} className="px-6 py-3 text-right first:pr-6 last:pl-6">
                <span className="inline-block h-3 w-16 animate-pulse rounded bg-primary-200/60" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 5 }, (_, i) => (
            <tr key={i} className="border-b border-primary-100/40">
              <td className="px-6 py-4">
                <div className="h-3.5 w-14 animate-pulse rounded bg-primary-100" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-primary-100" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-24 animate-pulse rounded bg-primary-100" />
                    <div className="h-2.5 w-32 animate-pulse rounded bg-primary-50" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 animate-pulse rounded bg-primary-100" />
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-18 animate-pulse rounded-lg bg-primary-100" />
              </td>
              <td className="px-6 py-4">
                <div className="h-3 w-20 animate-pulse rounded bg-primary-100" />
              </td>
              <td className="px-6 py-4 last:pl-6">
                <div className="flex justify-end">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-primary-100" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
  OrderTable Component
  ----------------------------------------------------------
*/

function OrderTable({
  orders,
  loading = false,
  onEdit,
  onCancel,
}: OrderTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [cancelModal, setCancelModal] = useState<{
    open: boolean;
    orderId: string | null;
  }>({ open: false, orderId: null });

  const isFinal = (status: Order["status"]) =>
    status === "completed" || status === "cancelled";

  /*
    Columns
  */
  const columns = [
    columnHelper.accessor("id", {
      header: "سفارش",
      cell: ({ getValue, row }) => (
        <button
          type="button"
          onClick={() => navigate(`/orders/${row.original.id}`)}
          className="
            font-inter text-sm font-bold text-text-primary
            transition-colors hover:text-primary-900
          "
        >
          #{getValue()}
        </button>
      ),
    }),

    columnHelper.accessor("customer", {
      header: "مشتری",
      cell: ({ row }) => {
        const order = row.original;

        const initials = order.customer
          .trim()
          .split(" ")
          .slice(0, 2)
          .map((part) => part.charAt(0))
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3 py-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-primary-900 to-primary-700 font-inter text-xs font-bold text-white shadow-sm ring-2 ring-primary-100/60">
              {initials || <ShoppingBag size={16} strokeWidth={1.8} />}
            </div>

            <div className="min-w-0">
              <p className="truncate font-estedad text-sm font-bold text-text-primary">
                {order.customer}
              </p>
              <p className="mt-0.5 truncate font-inter text-[11px] text-text-secondary">
                {order.email}
              </p>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("amount", {
      header: "مبلغ",
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

    columnHelper.accessor("status", {
      header: "وضعیت",
      cell: ({ getValue }) => {
        const status = getValue();
        const config = statusConfig[status];

        return (
          <span
            className={`
              inline-flex items-center gap-2 rounded-lg
              border px-2.5 py-1.5
              ${config.ring}
            `}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            <span className="font-estedad text-[11px] font-medium text-text-primary">
              {config.label}
            </span>
          </span>
        );
      },
    }),

    columnHelper.accessor("date", {
      header: "تاریخ",
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap font-estedad text-xs text-text-secondary">
          {getValue()}
        </span>
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const order = row.original;
        const disabled = isFinal(order.status);

        return (
          <Dropdown
            trigger={
              <button
                type="button"
                className={`
                  flex h-8 w-8 items-center justify-center
                  rounded-lg transition-all duration-150
                  ${
                    disabled
                      ? "cursor-not-allowed text-text-secondary/30"
                      : "text-text-secondary hover:bg-primary-100 hover:text-primary-900"
                  }
                `}
                disabled={disabled}
              >
                <MoreHorizontal size={18} />
              </button>
            }
            items={[
              {
                label: "مشاهده جزئیات",
                icon: <Eye size={14} />,
                onClick: () => navigate(`/orders/${order.id}`),
              },
              {
                label: "ویرایش",
                icon: <Pencil size={14} />,
                onClick: () => onEdit?.(order),
                disabled,
              },
              {
                label: "لغو سفارش",
                icon: <XCircle size={14} />,
                danger: true,
                onClick: () =>
                  setCancelModal({
                    open: true,
                    orderId: order.id,
                  }),
                disabled,
              },
            ]}
          />
        );
      },
    }),
  ];

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const handleCancelConfirm = () => {
    if (cancelModal.orderId !== null) {
      onCancel?.(cancelModal.orderId);
      setCancelModal({ open: false, orderId: null });
    }
  };

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;

  const pageNumbers = Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
    if (pageCount <= 5) return i;
    if (currentPage <= 3) return i;
    if (currentPage >= pageCount - 2) return pageCount - 5 + i;
    return currentPage - 3 + i;
  });

  /*
    Loading
  */
  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-187.5">
          {/* Header */}
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                className="border-b border-primary-300/60 bg-primary-100/25"
              >
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-right first:pr-6 last:pl-6"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          disabled={!canSort}
                          onClick={header.column.getToggleSortingHandler()}
                          className={`
                            group/th inline-flex items-center gap-1.5
                            font-estedad text-[11px] font-bold
                            uppercase tracking-wider
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

          {/* Body */}
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="
                  group border-b border-primary-100/60
                  transition-colors last:border-0
                  hover:bg-primary-100/20
                "
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-3 first:pr-6 last:pl-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
            <PackageOpen size={24} strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-estedad text-sm font-bold text-text-primary">
            سفارشی یافت نشد
          </p>
          <p className="mt-1 max-w-xs font-estedad text-xs leading-6 text-text-secondary">
            جستجو یا فیلتر وضعیت را تغییر دهید تا نتایج نمایش داده شود.
          </p>
        </div>
      )}

      {/* Pagination */}
      {rows.length > 0 && pageCount > 1 && (
        <div className="flex flex-col gap-3 border-t border-primary-300/60 px-6 py-3.5 tablet:flex-row tablet:items-center tablet:justify-between">
          <p className="font-estedad text-[11px] text-text-secondary">
            صفحه{" "}
            <span className="font-bold text-primary-900">
              {currentPage.toLocaleString("fa-IR")}
            </span>{" "}
            از{" "}
            <span className="font-bold text-primary-900">
              {pageCount.toLocaleString("fa-IR")}
            </span>
          </p>

          <div className="flex items-center gap-1.5">
            <PageBtn
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronRight size={14} />
              قبلی
            </PageBtn>

            {pageNumbers[0] > 0 && (
              <span className="px-1 font-estedad text-xs text-text-secondary">
                ...
              </span>
            )}

            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => table.setPageIndex(page)}
                className={`
                  h-8 min-w-8 rounded-lg px-2
                  font-inter text-xs font-bold
                  transition-all active:scale-95
                  ${
                    currentPage === page + 1
                      ? "bg-primary-900 text-white shadow-sm shadow-primary-900/20"
                      : "text-text-secondary hover:bg-primary-100 hover:text-primary-900"
                  }
                `}
              >
                {(page + 1).toLocaleString("fa-IR")}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < pageCount - 1 && (
              <span className="px-1 font-estedad text-xs text-text-secondary">
                ...
              </span>
            )}

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

      {/* Cancel Confirmation Modal */}
      <Modal
        open={cancelModal.open}
        onClose={() => setCancelModal({ open: false, orderId: null })}
        title="لغو سفارش"
        description={`آیا از لغو سفارش «#${cancelModal.orderId}» اطمینان دارید؟`}
        footer={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setCancelModal({ open: false, orderId: null })}
            >
              انصراف
            </Button>
            <Button variant="danger" onClick={handleCancelConfirm}>
              بله، لغو شود
            </Button>
          </div>
        }
      >
        <div className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <ShieldAlert size={18} />
          </div>
          <p className="font-estedad text-xs leading-6 text-text-secondary">
            این عمل غیرقابل بازگشت است. سفارش به‌صورت دائمی لغو خواهد شد و امکان
            بازیابی آن وجود ندارد.
          </p>
        </div>
      </Modal>
    </>
  );
}

export default OrderTable;
