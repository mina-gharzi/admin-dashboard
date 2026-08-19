/*
  ==========================================================
  Users.tsx (Redesigned & UI/UX Enhanced)
  ==========================================================
*/

import { useMemo, useState } from "react";

import { Download, Plus, Users as UsersIcon, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

import UserTable from "../components/user/UserTable";
import UserFilters from "../components/user/UserFilters";
import UserFormModal from "../components/user/UserFormModal";

import { useData } from "../hooks/useData";
import { api, type User } from "../services/api";
import { useAuthStore } from "../store";
import { permissions, roleLabels } from "../utils/permissions";
import { exportToCsv, getFileDateStamp } from "../utils/exportToCsv";

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
  const [formModal, setFormModal] = useState<{
    open: boolean;
    editingUser: User | null;
  }>({
    open: false,
    editingUser: null,
  });

  const openCreateModal = () => {
    setFormModal({
      open: true,
      editingUser: null,
    });
  };

  const openEditModal = (user: User) => {
    setFormModal({
      open: true,
      editingUser: user,
    });
  };

  const closeFormModal = () => {
    setFormModal({
      open: false,
      editingUser: null,
    });
  };

  // ----------------------------------------------------------
  // Create / Edit user
  // ----------------------------------------------------------
  const handleFormSubmit = async (data: Omit<User, "id" | "joinedAt">) => {
    if (formModal.editingUser) {
      await api.users.update(formModal.editingUser.id, data);

      toast.success(`کاربر «${data.name}» ویرایش شد.`);
    } else {
      await api.users.create({
        ...data,
        joinedAt: new Date().toLocaleDateString("fa-IR"),
      });

      toast.success(`کاربر «${data.name}» با موفقیت اضافه شد.`);
    }

    await refetch();
  };

  // ----------------------------------------------------------
  // Delete user
  // ----------------------------------------------------------
  const handleDelete = async (id: number) => {
    await api.users.delete(id);

    toast.success("کاربر حذف شد.");

    await refetch();
  };

  // ----------------------------------------------------------
  // Toggle user status
  // ----------------------------------------------------------
  const handleToggleStatus = async (
    id: number,
    status: "active" | "inactive",
  ) => {
    await api.users.update(id, { status });

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
              <Button onClick={openCreateModal}>
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 p-16">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />

            <p className="font-estedad text-sm text-text-secondary">
              در حال بارگذاری کاربران...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertCircle size={24} />
            </div>

            <p className="font-estedad text-sm font-medium text-text-primary">
              خطا در دریافت اطلاعات
            </p>

            <p className="font-estedad text-xs text-text-secondary">
              {error.message}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && users && users.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <UsersIcon size={24} />
            </div>

            <p className="font-estedad text-sm font-bold text-text-primary">
              هنوز هیچ کاربری ثبت نشده است
            </p>

            <p className="font-estedad text-xs text-text-secondary">
              برای شروع، اولین کاربر خود را اضافه کنید.
            </p>

            {canCreate && (
              <Button size="sm" onClick={openCreateModal} className="mt-2">
                <Plus size={16} />
                افزودن اولین کاربر
              </Button>
            )}
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && users && users.length > 0 && (
          <UserTable
            users={filteredUsers}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </Card>

      {/* User Form Modal */}
      <UserFormModal
        key={`${formModal.open}-${formModal.editingUser?.id ?? "create"}`}
        open={formModal.open}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        initialUser={formModal.editingUser}
        readOnly={Boolean(formModal.editingUser) && !canEdit}
      />
    </div>
  );
}

export default Users;
