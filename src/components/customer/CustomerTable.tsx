/*
  ==========================================================
  CustomerTable.tsx
  ----------------------------------------------------------
  جدول مشتری‌ها — این جدول فقط برای مشاهده‌ست (بدون افزودن/
  ویرایش/حذف)، چون مشتری‌ها رکورد مستقل نیستن؛ از روی سفارش‌ها
  محاسبه میشن. تنها اکشن، مشاهده‌ی سفارش‌های هر مشتریه.
  ==========================================================
*/

import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  Package,
  UserRound,
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

import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";

import type { Customer, Order } from "../../services/api";
import { api } from "../../services/api";
import { formatPrice } from "../../utils/format";

interface CustomerTableProps {
  customers: Customer[];
}

const PAGE_SIZE = 8;

const statusConfig = {
  active: { label: "فعال", dot: "bg-success", text: "text-success", ring: "border-success/25 bg-success/5" },
  inactive: { label: "غیرفعال", dot: "bg-danger", text: "text-danger", ring: "border-danger/25 bg-danger/5" },
} as const;

const orderStatusLabels: Record<Order["status"], { label: string; variant: "success" | "info" | "warning" | "danger" }> = {
  pending: { label: "در انتظار", variant: "warning" },
  processing: { label: "در حال پردازش", variant: "info" },
  completed: { label: "تکمیل شده", variant: "success" },
  cancelled: { label: "لغو شده", variant: "danger" },
};

const columnHelper = createColumnHelper<Customer>();

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

function CustomerTable({ customers }: CustomerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [ordersModal, setOrdersModal] = useState<{
    open: boolean;
    customer: Customer | null;
    orders: Order[];
    loading: boolean;
  }>({ open: false, customer: null, orders: [], loading: false });

  const openOrdersModal = async (customer: Customer) => {
    setOrdersModal({ open: true, customer, orders: [], loading: true });
    const orders = await api.customers.getOrdersByEmail(customer.email);
    setOrdersModal({ open: true, customer, orders, loading: false });
  };

  const closeOrdersModal = () => {
    setOrdersModal({ open: false, customer: null, orders: [], loading: false });
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "مشتری",
      cell: ({ row }) => {
        const customer = row.original;
        const initials = customer.name
          .trim()
          .split(" ")
          .slice(0, 2)
          .map((part) => part.charAt(0))
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3 py-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-primary-900 to-primary-700 font-inter text-xs font-bold text-white shadow-sm ring-2 ring-primary-100/60">
              {initials || <UserRound size={16} strokeWidth={1.8} />}
            </div>

            <div className="min-w-0">
              <p className="truncate font-estedad text-sm font-bold text-text-primary">
                {customer.name}
              </p>
              <span dir="ltr" className="block truncate text-right font-inter text-xs text-text-secondary">
                {customer.email}
              </span>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("ordersCount", {
      header: "تعداد سفارش",
      cell: ({ getValue }) => (
        <span className="font-inter text-sm font-bold text-text-primary">
          {getValue().toLocaleString("fa-IR")}
        </span>
      ),
    }),

    columnHelper.accessor("totalSpent", {
      header: "مجموع خرید",
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap font-estedad text-xs font-medium text-text-primary">
          {formatPrice(getValue())}
        </span>
      ),
    }),

    columnHelper.accessor("lastOrderDate", {
      header: "آخرین سفارش",
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap font-estedad text-xs text-text-secondary">
          {getValue()}
        </span>
      ),
    }),

    columnHelper.accessor("status", {
      header: "وضعیت",
      cell: ({ getValue }) => {
        const config = statusConfig[getValue()];
        return (
          <span className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 ${config.ring}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            <span className={`font-estedad text-[11px] font-medium ${config.text}`}>
              {config.label}
            </span>
          </span>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => openOrdersModal(row.original)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 font-estedad text-[11px] font-medium text-primary-900 transition hover:bg-primary-100"
          >
            <Eye size={14} />
            مشاهده سفارش‌ها
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: customers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-175">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-primary-300/60 bg-primary-100/25"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th key={header.id} className="px-6 py-3 text-right">
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          disabled={!canSort}
                          onClick={header.column.getToggleSortingHandler()}
                          className={`group/th inline-flex items-center gap-1 font-estedad text-[11px] font-bold uppercase tracking-wider ${
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
                className="group border-b border-primary-100/60 transition-colors last:border-0 hover:bg-primary-100/20"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-3">
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
            <UserRound size={24} strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-estedad text-sm font-bold text-text-primary">
            مشتری‌ای یافت نشد
          </p>
          <p className="mt-1 max-w-xs font-estedad text-xs leading-6 text-text-secondary">
            جستجو یا فیلترهای خود را تغییر دهید.
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
            <PaginationBtn
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              label="قبلی"
              icon={<ChevronRight size={14} />}
            />

            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
              let page: number;

              if (pageCount <= 5) {
                page = i;
              } else if (currentPage <= 3) {
                page = i;
              } else if (currentPage >= pageCount - 2) {
                page = pageCount - 5 + i;
              } else {
                page = currentPage - 3 + i;
              }

              const isActive = currentPage === page + 1;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => table.setPageIndex(page)}
                  className={`h-8 min-w-8 rounded-lg px-2 font-inter text-xs font-bold transition-all active:scale-95 ${
                    isActive
                      ? "bg-primary-900 text-white shadow-sm shadow-primary-900/20"
                      : "text-text-secondary hover:bg-primary-100 hover:text-primary-900"
                  }`}
                >
                  {(page + 1).toLocaleString("fa-IR")}
                </button>
              );
            })}

            <PaginationBtn
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              label="بعدی"
              icon={<ChevronLeft size={14} />}
            />
          </div>
        </div>
      )}

      {/* Customer Orders Modal */}
      <Modal
        open={ordersModal.open}
        onClose={closeOrdersModal}
        title={ordersModal.customer ? `سفارش‌های ${ordersModal.customer.name}` : ""}
        description={ordersModal.customer?.email}
        className="max-w-xl"
      >
        {ordersModal.loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
          </div>
        )}

        {!ordersModal.loading && ordersModal.orders.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Package size={26} className="text-text-secondary" />
            <p className="font-estedad text-xs text-text-secondary">سفارشی یافت نشد.</p>
          </div>
        )}

        {!ordersModal.loading && ordersModal.orders.length > 0 && (
          <div className="max-h-100 space-y-2 overflow-y-auto">
            {ordersModal.orders.map((order) => {
              const statusMeta = orderStatusLabels[order.status];
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-primary-300/60 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-inter text-xs font-bold text-text-primary">{order.id}</p>
                    <p className="mt-0.5 font-estedad text-[11px] text-text-secondary">{order.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap font-estedad text-xs font-medium text-text-primary">
                      {formatPrice(order.amount)}
                    </span>
                    <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </>
  );
}

function PaginationBtn({
  onClick,
  disabled,
  label,
  icon,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 items-center gap-1 rounded-lg border border-primary-300/70 bg-surface px-2.5 font-estedad text-[11px] font-medium text-text-secondary transition-all hover:border-primary-900 hover:text-primary-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {icon}
      {label}
    </button>
  );
}

export default CustomerTable;
