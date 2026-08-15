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

/*
  ----------------------------------------------------------
  Props
  ----------------------------------------------------------
*/

interface OrderTableProps {
  orders: Order[];
  onEdit?: (order: Order) => void;
  onCancel?: (id: string) => void;
}

/*
  ----------------------------------------------------------
  Status Labels
  ----------------------------------------------------------
*/

const statusLabels = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

/*
  ----------------------------------------------------------
  Status Variants
  ----------------------------------------------------------
*/

const statusVariants = {
  pending: "warning",
  processing: "info",
  completed: "success",
  cancelled: "danger",
} as const;

/*
  ----------------------------------------------------------
  Column Helper
  ----------------------------------------------------------
*/

const columnHelper = createColumnHelper<Order>();

/*
  ----------------------------------------------------------
  Order Table
  ----------------------------------------------------------
*/

function OrderTable({ orders, onEdit, onCancel }: OrderTableProps) {
  const navigate = useNavigate();

  /*
    Sorting State
  */
  const [sorting, setSorting] = useState<SortingState>([]);

  /*
    Cancel Confirmation Modal
  */
  const [cancelModal, setCancelModal] = useState<{
    open: boolean;
    orderId: string | null;
  }>({
    open: false,
    orderId: null,
  });

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
          className="font-inter text-sm font-medium text-text-primary hover:text-primary-900"
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
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-900">
              <ShoppingBag size={17} />
            </div>

            <div>
              <p className="font-vazirmatn text-sm font-medium text-text-primary">
                {order.customer}
              </p>

              <p className="mt-0.5 font-inter text-xs text-text-secondary">
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
        <div>
          <span className="font-vazirmatn text-sm font-medium text-text-primary">
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
        <span className="font-vazirmatn text-sm text-text-secondary">
          {getValue()}
        </span>
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "عملیات",
      enableSorting: false,

      cell: ({ row }) => {
        const order = row.original;
        const isFinal =
          order.status === "completed" || order.status === "cancelled";

        return (
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
        );
      },
    }),
  ];

  /*
    Table Instance
  */
  const table = useReactTable({
    data: orders,
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
    Handle Cancel Confirm
  */
  const handleCancelConfirm = () => {
    if (cancelModal.orderId !== null) {
      onCancel?.(cancelModal.orderId);
      setCancelModal({ open: false, orderId: null });
    }
  };

  return (
    <>
      <div>
        {/* Table */}

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
                        className="px-5 py-3 font-vazirmatn text-xs font-medium text-text-secondary"
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
            <ShoppingBag size={32} className="mx-auto text-text-secondary" />

            <p className="mt-3 font-vazirmatn text-sm text-text-secondary">
              سفارشی پیدا نشد.
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-border px-5 py-4 tablet:flex-row tablet:items-center tablet:justify-between">
          <p className="font-vazirmatn text-xs text-text-secondary">
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
              className="rounded-md border border-border px-3 py-2 font-vazirmatn text-xs text-text-secondary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              قبلی
            </button>

            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-md border border-border px-3 py-2 font-vazirmatn text-xs text-text-secondary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          Cancel Confirmation Modal
          ================================================== */}

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
        <p className="font-vazirmatn text-sm text-text-secondary">
          این عمل قابل برگشت نیست.
        </p>
      </Modal>
    </>
  );
}

export default OrderTable;
