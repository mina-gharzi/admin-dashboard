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

/*
  ==========================================================
  OrderTable.tsx
  ----------------------------------------------------------
  Orders data table — Dashboard design language
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
  MoreHorizontal,
  ShoppingBag,
} from "lucide-react";

import { Badge } from "../ui/Badge";
import { Dropdown } from "../ui/Dropdown";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";

import type { Order } from "../../services/api";
import { formatPrice } from "../../utils/format";

interface OrderTableProps {
  orders: Order[];
  onEdit?: (order: Order) => void;
  onCancel?: (id: string) => void;
}

const statusLabels = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

const statusVariants = {
  pending: "warning",
  processing: "info",
  completed: "success",
  cancelled: "danger",
} as const;

const columnHelper = createColumnHelper<Order>();

function OrderTable({ orders, onEdit, onCancel }: OrderTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);

  const [cancelModal, setCancelModal] = useState<{
    open: boolean;
    orderId: string | null;
  }>({
    open: false,
    orderId: null,
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "سفارش",
      cell: ({ getValue, row }) => (
        <button
          type="button"
          onClick={() => navigate(`/orders/${row.original.id}`)}
          className="font-inter text-sm font-semibold text-text-primary transition-colors hover:text-primary-900"
        >
          #{getValue()}
        </button>
      ),
    }),

    columnHelper.accessor("customer", {
      header: "مشتری",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <ShoppingBag size={17} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-vazirmatn text-sm font-semibold text-text-primary">
                {order.customer}
              </p>
              <p className="mt-0.5 truncate font-inter text-xs text-text-secondary">
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
          <span className="font-vazirmatn text-sm font-semibold text-text-primary">
            {formatPrice(getValue())}
          </span>
          <span className="mr-1 font-vazirmatn text-xs text-text-secondary">
            تومان
          </span>
        </div>
      ),
    }),

    columnHelper.accessor("status", {
      header: "وضعیت",
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <Badge variant={statusVariants[status]}>
            {statusLabels[status]}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("date", {
      header: "تاریخ",
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap font-vazirmatn text-xs text-text-secondary">
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
        const isFinal =
          order.status === "completed" || order.status === "cancelled";

        return (
          <div className="flex justify-end">
            <Dropdown
              trigger={<MoreHorizontal size={18} />}
              items={[
                {
                  label: "مشاهده سفارش",
                  onClick: () => navigate(`/orders/${order.id}`),
                },
                {
                  label: "ویرایش",
                  onClick: () => onEdit?.(order),
                  disabled: isFinal,
                },
                {
                  label: "لغو سفارش",
                  onClick: () => {
                    setCancelModal({ open: true, orderId: order.id });
                  },
                  danger: true,
                  disabled: isFinal,
                },
              ]}
            />
          </div>
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
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  const SortIcon = ({ sorted }: { sorted: false | "asc" | "desc" }) => {
    if (sorted === "asc") return <ChevronUp size={14} />;
    if (sorted === "desc") return <ChevronDown size={14} />;
    return null;
  };

  const handleCancelConfirm = () => {
    if (cancelModal.orderId !== null) {
      onCancel?.(cancelModal.orderId);
      setCancelModal({ open: false, orderId: null });
    }
  };

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();

  return (
    <>
      <div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-primary-300 bg-primary-50/40"
                >
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();

                    return (
                      <th key={header.id} className="px-6 py-4 text-right">
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            disabled={!canSort}
                            onClick={header.column.getToggleSortingHandler()}
                            className={[
                              "inline-flex items-center gap-1.5",
                              "font-vazirmatn text-xs font-medium text-text-secondary",
                              "transition-colors",
                              canSort
                                ? "cursor-pointer hover:text-primary-900"
                                : "cursor-default",
                            ].join(" ")}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
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
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/80 transition-colors last:border-0 hover:bg-primary-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <ShoppingBag size={24} />
            </div>
            <p className="mt-5 font-vazirmatn text-sm font-semibold text-text-primary">
              سفارشی پیدا نشد
            </p>
            <p className="mt-2 font-vazirmatn text-xs text-text-secondary">
              جستجو یا فیلتر وضعیت را تغییر دهید.
            </p>
          </div>
        )}

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-primary-300 px-6 py-4 tablet:flex-row tablet:items-center tablet:justify-between">
            <p className="font-vazirmatn text-xs text-text-secondary">
              صفحه{" "}
              <span className="font-semibold text-primary-900">
                {currentPage}
              </span>{" "}
              از{" "}
              <span className="font-semibold text-primary-900">
                {pageCount || 1}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="
                  inline-flex h-9 items-center gap-1.5 rounded-xl
                  border border-primary-300 bg-surface px-3.5
                  font-vazirmatn text-xs text-text-secondary
                  transition-all
                  hover:border-primary-900 hover:text-primary-900
                  disabled:cursor-not-allowed disabled:opacity-40
                "
              >
                <ChevronRight size={14} />
                قبلی
              </button>

              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="
                  inline-flex h-9 items-center gap-1.5 rounded-xl
                  border border-primary-300 bg-surface px-3.5
                  font-vazirmatn text-xs text-text-secondary
                  transition-all
                  hover:border-primary-900 hover:text-primary-900
                  disabled:cursor-not-allowed disabled:opacity-40
                "
              >
                بعدی
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        open={cancelModal.open}
        onClose={() => setCancelModal({ open: false, orderId: null })}
        title="لغو سفارش"
        description={`آیا می‌خواهید سفارش «${cancelModal.orderId}» را لغو کنید؟`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setCancelModal({ open: false, orderId: null })}
            >
              انصراف
            </Button>
            <Button variant="danger" onClick={handleCancelConfirm}>
              لغو سفارش
            </Button>
          </>
        }
      >
        <p className="font-vazirmatn text-sm leading-6 text-text-secondary">
          این عمل قابل برگشت نیست.
        </p>
      </Modal>
    </>
  );
}

export default OrderTable;