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

import { useState } from "react";

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
  UserRound,
} from "lucide-react";

import { Badge } from "../ui/Badge";
import { Dropdown } from "../ui/Dropdown";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";

import type { User } from "../../services/api";

/*
  ----------------------------------------------------------
  Props
  ----------------------------------------------------------
*/

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number, status: "active" | "inactive") => void;
}

/*
  ----------------------------------------------------------
  Column Helper
  ----------------------------------------------------------
*/

const columnHelper = createColumnHelper<User>();

/*
  ----------------------------------------------------------
  User Table
  ----------------------------------------------------------
*/

function UserTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}: UserTableProps) {
  /*
    Sorting State
  */
  const [sorting, setSorting] = useState<SortingState>([]);

  /*
    Delete Confirmation Modal
  */
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    userId: number | null;
    userName: string;
  }>({
    open: false,
    userId: null,
    userName: "",
  });

  /*
    Columns
  */
  const columns = [
    columnHelper.accessor("name", {
      header: "کاربر",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-900">
              <UserRound size={18} />
            </div>

            <div>
              <p className="font-vazirmatn text-sm font-medium text-text-primary">
                {user.name}
              </p>

              <p className="mt-0.5 font-inter text-xs text-text-secondary">
                #{user.id}
              </p>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("email", {
      header: "ایمیل",
      cell: ({ getValue }) => (
        <a
          href={`mailto:${getValue()}`}
          className="font-inter text-sm text-text-secondary hover:text-primary-900"
        >
          {getValue()}
        </a>
      ),
    }),

    columnHelper.accessor("role", {
      header: "نقش",
      cell: ({ getValue }) => {
        const role = getValue();
        const roleLabels = {
          admin: "مدیر",
          manager: "مدیر فروش",
          customer: "مشتری",
        };

        return (
          <span className="font-vazirmatn text-sm text-text-secondary">
            {roleLabels[role]}
          </span>
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
            className="cursor-pointer"
          >
            <Badge
              variant={
                status === "active" ? "success" : "danger"
              }
            >
              {status === "active" ? "فعال" : "غیرفعال"}
            </Badge>
          </button>
        );
      },
    }),

    columnHelper.accessor("joinedAt", {
      header: "تاریخ عضویت",
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
      cell: ({ row }) => (
        <Dropdown
          trigger={<MoreHorizontal size={18} />}
          items={[
            {
              label: "مشاهده",
              onClick: () => {
                // TODO: Open user details modal
                console.log("View user:", row.original.id);
              },
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
                  row.original.status === "active"
                    ? "inactive"
                    : "active"
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
      ),
    }),
  ];

  /*
    Table Instance
  */
  const table = useReactTable({
    data: users,
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
  const SortIcon = ({
    sorted,
  }: {
    sorted: false | "asc" | "desc";
  }) => {
    if (sorted === "asc") return <ChevronUp size={14} />;
    if (sorted === "desc") return <ChevronDown size={14} />;
    return null;
  };

  /*
    Handle Delete
  */
  const handleDeleteConfirm = () => {
    if (deleteModal.userId !== null) {
      onDelete?.(deleteModal.userId);
      setDeleteModal({ open: false, userId: null, userName: "" });
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
          <div className="p-12 text-center">
            <UserRound
              size={32}
              className="mx-auto text-text-secondary"
            />

            <p className="mt-3 font-vazirmatn text-sm text-text-secondary">
              کاربری پیدا نشد.
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
          Delete Confirmation Modal
          ================================================== */}

      <Modal
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({
            open: false,
            userId: null,
            userName: "",
          })
        }
        title="حذف کاربر"
        description={`آیا می‌خواهید کاربر "${deleteModal.userName}" را حذف کنید؟`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteModal({
                  open: false,
                  userId: null,
                  userName: "",
                })
              }
            >
              لغو
            </Button>

            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              حذف
            </Button>
          </>
        }
      >
        <p className="font-vazirmatn text-sm text-text-secondary">
          این عمل قابل برگشت نیست. کاربر و تمام داده‌های مرتبط حذف خواهد شد.
        </p>
      </Modal>
    </>
  );
}

export default UserTable;