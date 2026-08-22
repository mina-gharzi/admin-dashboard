/*
  ==========================================================
  Users.tsx (Redesigned & UI/UX Enhanced)
  ==========================================================
*/

import { useMemo, useState } from "react";

import { Download, Plus, Users as UsersIcon } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import ResourceState from "../components/ui/ResourceState";

import UserTable from "../components/user/UserTable";
import UserFilters from "../components/user/UserFilters";
import UserFormModal from "../components/user/UserFormModal";

import { useData } from "../hooks/useData";
import { useEditModal } from "../hooks/useEditModal";
import { api, type User } from "../services/api";
import { useAuthStore } from "../store";
import { permissions, roleLabels } from "../utils/permissions";
import { exportToCsv, getFileDateStamp } from "../utils/exportToCsv";
import { runWithToast } from "../utils/toastAction";

function Users() {
  // ----------------------------------------------------------
  // Current authenticated user's role
  // ----------------------------------------------------------
  const currentUserRole = useAuthStore((state) => state.user?.role);

  const canCreate = permissions.canCreateUser(currentUserRole);
  const canEdit = permissions.canEditUser(currentUserRole);

  // ----------------------------------------------------------
  // Users data
  // ----------------------------------------------------------
  const {
    data: users,
    loading,
    error,
    refetch,
  } = useData(() => api.users.getAll(), []);

  // ----------------------------------------------------------
  // Filters
  // ----------------------------------------------------------
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("همه");

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);

      const matchesRole = role === "همه" || user.role === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  // ----------------------------------------------------------
  // User form modal
  // ----------------------------------------------------------
  const formModal = useEditModal<User>();

  // ----------------------------------------------------------
  // Create / Edit user
  // ----------------------------------------------------------
  const handleFormSubmit = async (data: Omit<User, "id" | "joinedAt">) => {
    const editingUser = formModal.editingItem;

    await runWithToast(
      () =>
        editingUser
          ? api.users.update(editingUser.id, data)
          : api.users.create({
              ...data,
              joinedAt: new Date().toLocaleDateString("fa-IR"),
            }),
      {
        success: editingUser
          ? `کاربر «${data.name}» ویرایش شد.`
          : `کاربر «${data.name}» با موفقیت اضافه شد.`,
        error: "خطا در ذخیره‌سازی کاربر. دوباره تلاش کنید.",
      },
    );

    await refetch();
  };

  // ----------------------------------------------------------
  // Delete user
  // ----------------------------------------------------------
  const handleDelete = async (id: number) => {
    await runWithToast(() => api.users.delete(id), {
      success: "کاربر حذف شد.",
      error: "خطا در حذف کاربر. دوباره تلاش کنید.",
    });

    await refetch();
  };

  // ----------------------------------------------------------
  // Toggle user status
  // ----------------------------------------------------------
  const handleToggleStatus = async (
    id: number,
    status: "active" | "inactive",
  ) => {
    await runWithToast(() => api.users.update(id, { status }), {
      error: "خطا در تغییر وضعیت کاربر. دوباره تلاش کنید.",
    });

    toast.info(status === "active" ? "کاربر فعال شد." : "کاربر غیرفعال شد.");

    await refetch();
  };

  // ----------------------------------------------------------
  // Export (خروجی CSV از کاربران فیلترشده)
  // ----------------------------------------------------------
  const handleExport = () => {
    if (filteredUsers.length === 0) {
      toast.info("موردی برای خروجی گرفتن وجود ندارد.");
      return;
    }

    exportToCsv(
      filteredUsers,
      [
        { header: "نام", accessor: (user) => user.name },
        { header: "ایمیل", accessor: (user) => user.email },
        { header: "نقش", accessor: (user) => roleLabels[user.role] },
        {
          header: "وضعیت",
          accessor: (user) => (user.status === "active" ? "فعال" : "غیرفعال"),
        },
        { header: "تاریخ عضویت", accessor: (user) => user.joinedAt },
      ],
      `کاربران-${getFileDateStamp()}`,
    );

    toast.success(`خروجی ${filteredUsers.length} کاربر با موفقیت دانلود شد.`);
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="کاربران"
        description="مدیریت کاربران سیستم و مشاهده اطلاعات آن‌ها"
        breadcrumbs={[{ label: "کاربران" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={filteredUsers.length === 0}
            >
              <Download size={17} />
              خروجی CSV
            </Button>

            {canCreate && (
              <Button onClick={formModal.openCreate}>
                <Plus size={18} />
                افزودن کاربر
              </Button>
            )}
          </div>
        }
      />

      {/* Users Card */}
      <Card className="overflow-hidden border border-primary-300/60 shadow-sm">
        {/* Filters */}
        <UserFilters
          search={search}
          role={role}
          onSearchChange={setSearch}
          onRoleChange={setRole}
          resultCount={filteredUsers.length}
        />

        <ResourceState
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingText="در حال بارگذاری کاربران..."
          isEmpty={!!users && users.length === 0}
          emptyIcon={UsersIcon}
          emptyTitle="هنوز هیچ کاربری ثبت نشده است"
          emptyDescription="برای شروع، اولین کاربر خود را اضافه کنید."
          emptyAction={
            canCreate && (
              <Button size="sm" onClick={formModal.openCreate} className="mt-2">
                <Plus size={16} />
                افزودن اولین کاربر
              </Button>
            )
          }
        >
          <UserTable
            users={filteredUsers}
            onEdit={formModal.openEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </ResourceState>
      </Card>

      {/* User Form Modal */}
      <UserFormModal
        key={`${formModal.open}-${formModal.editingItem?.id ?? "create"}`}
        open={formModal.open}
        onClose={formModal.close}
        onSubmit={handleFormSubmit}
        initialUser={formModal.editingItem}
        readOnly={Boolean(formModal.editingItem) && !canEdit}
      />
    </div>
  );
}

export default Users;
