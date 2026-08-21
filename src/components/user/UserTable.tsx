/*
  ==========================================================
  UserTable.tsx (Final Polished Redesign)
  ==========================================================
*/

import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MoreHorizontal,
  UserRound,
  ShieldAlert,
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

import type { VariantProps } from "class-variance-authority";

import { Badge, badgeVariants } from "../ui/Badge";
import { Dropdown } from "../ui/Dropdown";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";

import type { User } from "../../services/api";
import { useAuthStore } from "../../store";
import { roleLabels, permissions } from "../../utils/permissions";

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number, status: "active" | "inactive") => void;
}

const PAGE_SIZE = 8;

const roleVariants: Record<User["role"], VariantProps<typeof badgeVariants>["variant"]> = {
  system_admin: "primary",
  admin: "info",
  sales_manager: "success",
  salesperson: "warning",
  analyst: "neutral",
};

const statusConfig = {
  active: {
    label: "فعال",
    dot: "bg-success",
    text: "text-success",
    ring: "border-success/25 bg-success/5 hover:bg-success/10",
  },
  inactive: {
    label: "غیرفعال",
    dot: "bg-danger",
    text: "text-danger",
    ring: "border-danger/25 bg-danger/5 hover:bg-danger/10",
  },
} as const;

const columnHelper = createColumnHelper<User>();

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

function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const role = useAuthStore((state) => state.user?.role);
  const canEdit = permissions.canEditUser(role);
  const canDelete = permissions.canDeleteUser(role);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    userId: number | null;
    userName: string;
  }>({ open: false, userId: null, userName: "" });

  const columns = [
    columnHelper.accessor("name", {
      header: "کاربر",
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.name
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
                {user.name}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="truncate font-inter text-xs text-text-secondary">
                  {user.email}
                </span>
                <span className="shrink-0 rounded-md bg-primary-100/60 px-1.5 py-0.5 font-inter text-[10px] font-medium text-primary-900">
                  #{user.id}
                </span>
              </div>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("role", {
      header: "نقش",
      cell: ({ getValue }) => {
        const role = getValue();
        return (
          <Badge variant={roleVariants[role]}>{roleLabels[role]}</Badge>
        );
      },
    }),

    columnHelper.accessor("status", {
      header: "وضعیت",
      cell: ({ getValue, row }) => {
        const status = getValue();
        const config = statusConfig[status];

        return (
          <button
            type="button"
            title={canEdit ? "کلیک برای تغییر وضعیت" : "وضعیت"}
            aria-label={canEdit ? `تغییر وضعیت ${user.name} به ${config.label === "فعال" ? "غیرفعال" : "فعال"}` : `وضعیت ${config.label}`}
            disabled={!canEdit}
            onClick={() =>
              onToggleStatus?.(
                row.original.id,
                status === "active" ? "inactive" : "active",
              )
            }
            className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 transition-all active:scale-95 disabled:cursor-default disabled:active:scale-100 ${config.ring}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            <span
              className={`font-estedad text-[11px] font-medium ${config.text}`}
            >
              {config.label}
            </span>
          </button>
        );
      },
    }),

    columnHelper.accessor("joinedAt", {
      header: "تاریخ عضویت",
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
                aria-label={`عملیات ${row.original.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-primary-100 hover:text-primary-900"
              >
                <MoreHorizontal size={18} />
              </button>
            }
            items={[
              {
                label: canEdit ? "مشاهده و ویرایش" : "مشاهده",
                onClick: () => onEdit?.(row.original),
              },
              ...(canEdit
                ? [
                    {
                      label:
                        row.original.status === "active"
                          ? "غیرفعال کردن"
                          : "فعال کردن",
                      onClick: () =>
                        onToggleStatus?.(
                          row.original.id,
                          row.original.status === "active"
                            ? "inactive"
                            : "active",
                        ),
                    },
                  ]
                : []),
              ...(canDelete
                ? [
                    {
                      label: "حذف کاربر",
                      onClick: () =>
                        setDeleteModal({
                          open: true,
                          userId: row.original.id,
                          userName: row.original.name,
                        }),
                      danger: true,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const handleDeleteConfirm = () => {
    if (deleteModal.userId !== null) {
      onDelete?.(deleteModal.userId);
      setDeleteModal({ open: false, userId: null, userName: "" });
    }
  };

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;

  return (
    <>
      <div className="overflow-x-auto">
        <table aria-label="جدول کاربران" className="w-full min-w-175">
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
                    <th
                      key={header.id}
                      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"}
                      className="px-6 py-3 text-right"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          disabled={!canSort}
                          aria-label={`مرتب‌سازی بر اساس ${typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : "این ستون"}`}
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
            کاربری یافت نشد
          </p>
          <p className="mt-1 max-w-xs font-estedad text-xs leading-6 text-text-secondary">
            جستجو یا فیلترهای خود را تغییر دهید، یا کاربر جدیدی اضافه کنید.
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

            {/* Page Numbers */}
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
                  aria-label={`صفحه ${page + 1}`}
                  aria-current={isActive ? "page" : undefined}
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, userId: null, userName: "" })
        }
        title="حذف کاربر"
        description={`آیا از حذف «${deleteModal.userName}» اطمینان دارید؟`}
        footer={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteModal({ open: false, userId: null, userName: "" })
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
        <div className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <ShieldAlert size={18} />
          </div>
          <p className="font-estedad text-xs leading-6 text-text-secondary">
            این عمل غیرقابل بازگشت است. تمام اطلاعات این کاربر به‌صورت دائمی از
            سیستم حذف خواهد شد.
          </p>
        </div>
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

export default UserTable;
