/*
  ==========================================================
  UserTable.tsx (FIXED)
  ----------------------------------------------------------
  اصلاحات:
  - Functional onClick handlers ✓
  - Edit modal support ✓
  - Delete confirmation ✓
  - Status toggle ✓
  ==========================================================
*/

/*
  ==========================================================
  UserTable.tsx
  ----------------------------------------------------------
  Matched to Dashboard visual language
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
import { Dropdown } from "../ui/Dropdown";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";

import type { User } from "../../services/api";

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number, status: "active" | "inactive") => void;
}

const columnHelper = createColumnHelper<User>();

function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    userId: number | null;
    userName: string;
  }>({
    open: false,
    userId: null,
    userName: "",
  });

  const roleLabels = {
    admin: "مدیر",
    manager: "مدیر فروش",
    customer: "مشتری",
  };

  const roleVariants = {
    admin: "primary",
    manager: "info",
    customer: "neutral",
  } as const;

  const columns = [
    columnHelper.accessor("name", {
      header: "کاربر",
      cell: ({ row }) => {
        const user = row.original;

        const initials = user.name
          .trim()
          .split(" ")
          .slice(0, 2)
          .map((name) => name.charAt(0))
          .join("")
          .toUpperCase();

        return (
          <div className="flex min-w-52 items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-100 font-inter text-xs font-semibold text-primary-900">
              {initials || <UserRound size={18} />}
            </div>

            <div className="min-w-0">
              <p className="truncate font-vazirmatn text-sm font-semibold text-text-primary">
                {user.name}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="truncate font-inter text-xs text-text-secondary">
                  {user.email}
                </span>
                <span className="shrink-0 rounded-md bg-primary-50 px-1.5 py-0.5 font-inter text-[10px] text-primary-900">
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

        return (
          <button
            type="button"
            onClick={() =>
              onToggleStatus?.(
                row.original.id,
                status === "active" ? "inactive" : "active"
              )
            }
            className="group inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-primary-50"
          >
            <span
              className={[
                "h-2 w-2 rounded-full",
                status === "active" ? "bg-success" : "bg-danger",
              ].join(" ")}
            />
            <span
              className={[
                "font-vazirmatn text-xs font-medium",
                status === "active" ? "text-success" : "text-danger",
              ].join(" ")}
            >
              {status === "active" ? "فعال" : "غیرفعال"}
            </span>
          </button>
        );
      },
    }),

    columnHelper.accessor("joinedAt", {
      header: "تاریخ عضویت",
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
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Dropdown
            trigger={<MoreHorizontal size={18} />}
            items={[
              {
                label: "مشاهده",
                onClick: () => console.log("View user:", row.original.id),
              },
              {
                label: "ویرایش",
                onClick: () => onEdit?.(row.original),
              },
              {
                label:
                  row.original.status === "active"
                    ? "غیرفعال کردن"
                    : "فعال کردن",
                onClick: () =>
                  onToggleStatus?.(
                    row.original.id,
                    row.original.status === "active" ? "inactive" : "active"
                  ),
              },
              {
                label: "حذف",
                onClick: () => {
                  setDeleteModal({
                    open: true,
                    userId: row.original.id,
                    userName: row.original.name,
                  });
                },
                danger: true,
              },
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
    initialState: {
      pagination: { pageSize: 6 },
    },
  });

  const SortIcon = ({
    sorted,
  }: {
    sorted: false | "asc" | "desc";
  }) => {
    if (sorted === "asc") return <ChevronUp size={14} />;
    if (sorted === "desc") return <ChevronDown size={14} />;
    return null;
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.userId !== null) {
      onDelete?.(deleteModal.userId);
      setDeleteModal({ open: false, userId: null, userName: "" });
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
                              "font-vazirmatn text-xs font-medium",
                              "text-text-secondary",
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
              <UserRound size={24} />
            </div>
            <p className="mt-5 font-vazirmatn text-sm font-semibold text-text-primary">
              کاربری پیدا نشد
            </p>
            <p className="mt-2 font-vazirmatn text-xs text-text-secondary">
              جستجو یا فیلترهای خود را تغییر دهید.
            </p>
          </div>
        )}

        {/* Pagination */}
        {users.length > 0 && (
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

      {/* Delete Modal */}
      <Modal
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, userId: null, userName: "" })
        }
        title="حذف کاربر"
        description={`آیا می‌خواهید کاربر "${deleteModal.userName}" را حذف کنید؟`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteModal({ open: false, userId: null, userName: "" })
              }
            >
              لغو
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              حذف کاربر
            </Button>
          </>
        }
      >
        <p className="font-vazirmatn text-sm leading-6 text-text-secondary">
          این عمل قابل بازگشت نیست. اطلاعات این کاربر از سیستم حذف خواهد شد.
        </p>
      </Modal>
    </>
  );
}

export default UserTable;