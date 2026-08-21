/*
  ==========================================================
  OrderTable.tsx
  ----------------------------------------------------------
  جدول سفارش‌ها — جستجو/فیلتر از بیرون (OrderFilters) میاد،
  این کامپوننت فقط مسئول نمایش، مرتب‌سازی، صفحه‌بندی و
  اکشن‌های هر ردیفه.

  دو اکشن مخرب داریم:
  - «لغو سفارش»: فقط وضعیت رو به cancelled تغییر می‌ده
    (soft) — تا سفارش تکمیل/لغو نشده در دسترسه.
  - «حذف سفارش»: رکورد رو کامل حذف می‌کنه (hard) — به‌عنوان
    یه محافظ، فقط برای سفارش‌های از قبل لغوشده فعاله؛ اول
    باید لغو کنی، بعد بتونی حذفش کنی.

  Responsive:
  از desktop:sm به بالا جدول واقعی؛ زیرش لیست کارتی.
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
  Pencil,
  ShieldAlert,
  ShoppingBag,
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

import type { Order } from "../../services/api";
import { formatPrice } from "../../utils/format";
import { useAuthStore } from "../../store";
import { permissions } from "../../utils/permissions";

interface OrderTableProps {
  orders: Order[];
  onEdit?: (order: Order) => void;
  onCancel?: (id: string) => void | Promise<void>;
  onDelete?: (id: string) => void | Promise<void>;
}

const PAGE_SIZE = 8;
const columnHelper = createColumnHelper<Order>();

const statusConfig = {
  pending: { label: "در انتظار", tone: "bg-warning/10 text-warning", dot: "bg-warning" },
  processing: { label: "در حال پردازش", tone: "bg-info/10 text-info", dot: "bg-info" },
  completed: { label: "تکمیل شده", tone: "bg-success/10 text-success", dot: "bg-success" },
  cancelled: { label: "لغو شده", tone: "bg-danger/10 text-danger", dot: "bg-danger" },
} as const;

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

function StatusBadge({ status }: { status: Order["status"] }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-estedad text-[11px] font-medium ${config.tone}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function OrderTable({ orders, onEdit, onCancel, onDelete }: OrderTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const role = useAuthStore((state) => state.user?.role);
  const canManage = permissions.canManageOrders(role);

  const [cancelModal, setCancelModal] = useState<{
    open: boolean;
    orderId: string | null;
  }>({ open: false, orderId: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    orderId: string | null;
  }>({ open: false, orderId: null });

  const [processing, setProcessing] = useState(false);

  const buildActionItems = (order: Order) => {
    const isFinal = order.status === "completed" || order.status === "cancelled";
    const isCancelled = order.status === "cancelled";

    return [
      {
        label: "مشاهده",
        icon: <Eye size={14} />,
        onClick: () => navigate(`/dashboard/orders/${order.id}`),
      },
      ...(canManage
        ? [
            {
              label: "ویرایش",
              icon: <Pencil size={14} />,
              onClick: () => onEdit?.(order),
            },
            ...(isFinal
              ? []
              : [
                  {
                    label: "لغو سفارش",
                    icon: <ShieldAlert size={14} />,
                    danger: true,
                    onClick: () =>
                      setCancelModal({ open: true, orderId: order.id }),
                  },
                ]),
            ...(isCancelled
              ? [
                  {
                    label: "حذف سفارش",
                    icon: <Trash2 size={14} />,
                    danger: true,
                    onClick: () =>
                      setDeleteModal({ open: true, orderId: order.id }),
                  },
                ]
              : []),
          ]
        : []),
    ];
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "سفارش",
      cell: ({ getValue, row }) => (
        <button
          type="button"
          onClick={() => navigate(`/dashboard/orders/${row.original.id}`)}
          className="font-inter text-sm font-bold text-text-primary hover:text-primary-900"
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
          .join("");

        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 font-estedad text-xs font-bold text-primary-900">
              {initials || <ShoppingBag size={16} />}
            </div>
            <div className="min-w-0">
              <p className="truncate font-estedad text-sm font-semibold text-text-primary">
                {order.customer}
              </p>
              <p className="mt-0.5 truncate font-inter text-[10px] text-text-secondary">
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
        <span className="whitespace-nowrap font-estedad text-sm font-semibold text-text-primary">
          {formatPrice(getValue())}
          <span className="mr-1 text-[10px] font-normal text-text-secondary">
            تومان
          </span>
        </span>
      ),
    }),

    columnHelper.accessor("status", {
      header: "وضعیت",
      cell: ({ getValue }) => <StatusBadge status={getValue()} />,
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
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Dropdown
            trigger={
              <button
                type="button"
                aria-label="عملیات سفارش"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-primary-50 hover:text-primary-900"
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
    data: orders,
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

  const closeCancelModal = () => setCancelModal({ open: false, orderId: null });
  const closeDeleteModal = () => setDeleteModal({ open: false, orderId: null });

  const confirmCancel = async () => {
    if (!cancelModal.orderId) return;

    setProcessing(true);
    try {
      await onCancel?.(cancelModal.orderId);
      closeCancelModal();
    } catch {
      // خطا با toast از سمت صفحه‌ی والد نمایش داده میشه؛
      // مودال رو باز نگه می‌داریم تا کاربر دوباره تلاش کنه
    } finally {
      setProcessing(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.orderId) return;

    setProcessing(true);
    try {
      await onDelete?.(deleteModal.orderId);
      closeDeleteModal();
    } catch {
      // مشابه بالا
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* ==================================================
          Desktop / Tablet Table
          ================================================== */}

      <div className="hidden tablet:block">
        <div className="overflow-x-auto">
          <table aria-label="جدول سفارش‌ها" className="w-full min-w-190">
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
          ================================================== */}

      <div className="divide-y divide-primary-100/60 tablet:hidden">
        {rows.map((row) => {
          const order = row.original;
          const initials = order.customer
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join("");

          return (
            <div key={row.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  className="flex min-w-0 items-center gap-3 text-right"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 font-estedad text-xs font-bold text-primary-900">
                    {initials || <ShoppingBag size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-inter text-sm font-bold text-text-primary">
                      #{order.id}
                    </p>
                    <p className="mt-0.5 truncate font-estedad text-xs text-text-secondary">
                      {order.customer}
                    </p>
                  </div>
                </button>

                <Dropdown
                  trigger={
                    <button
                      type="button"
                      aria-label="عملیات سفارش"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-primary-50 hover:text-primary-900"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  }
                  items={buildActionItems(order)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-estedad text-sm font-semibold text-text-primary">
                  {formatPrice(order.amount)}
                  <span className="mr-1 text-[10px] font-normal text-text-secondary">
                    تومان
                  </span>
                </span>
                <span className="font-estedad text-xs text-text-secondary">
                  {order.date}
                </span>
              </div>

              <StatusBadge status={order.status} />
            </div>
          );
        })}
      </div>

      {/* ==================================================
          Empty State (دفاعی)
          ================================================== */}

      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
            <ShoppingBag size={22} strokeWidth={1.6} />
          </div>
          <p className="font-estedad text-sm font-medium text-text-primary">
            سفارشی یافت نشد
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
          Cancel Confirmation Modal
          ================================================== */}

      <Modal
        open={cancelModal.open}
        onClose={processing ? () => {} : closeCancelModal}
        title="لغو سفارش"
        description={`آیا از لغو سفارش «#${cancelModal.orderId}» اطمینان دارید؟`}
        footer={
          <>
            <Button variant="outline" onClick={closeCancelModal} disabled={processing}>
              انصراف
            </Button>
            <Button variant="danger" loading={processing} onClick={confirmCancel}>
              لغو سفارش
            </Button>
          </>
        }
      >
        <p className="font-estedad text-sm leading-6 text-text-secondary">
          پس از لغو، وضعیت سفارش به «لغو شده» تغییر می‌کند.
        </p>
      </Modal>

      {/* ==================================================
          Delete Confirmation Modal
          ================================================== */}

      <Modal
        open={deleteModal.open}
        onClose={processing ? () => {} : closeDeleteModal}
        title="حذف سفارش"
        description={`آیا از حذف کامل سفارش «#${deleteModal.orderId}» اطمینان دارید؟`}
        footer={
          <>
            <Button variant="outline" onClick={closeDeleteModal} disabled={processing}>
              انصراف
            </Button>
            <Button variant="danger" loading={processing} onClick={confirmDelete}>
              حذف سفارش
            </Button>
          </>
        }
      >
        <p className="font-estedad text-sm leading-6 text-text-secondary">
          این عمل قابل برگشت نیست و سفارش برای همیشه از سیستم حذف خواهد شد.
        </p>
      </Modal>
    </>
  );
}

export default OrderTable;
