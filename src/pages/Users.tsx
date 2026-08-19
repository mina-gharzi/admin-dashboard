/*
  ==========================================================
  Users.tsx (Redesigned & UI/UX Enhanced)
  ==========================================================
*/

import { useMemo, useState } from "react";

import { Plus, Users as UsersIcon, AlertCircle } from "lucide-react";
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
import { permissions } from "../utils/permissions";

function Users() {
  const role = useAuthStore((state) => state.user?.role);
  const canCreate = permissions.canCreateUser(role);
  const canEdit = permissions.canEditUser(role);

  const {
    data: users,
    loading,
    error,
    refetch,
  } = useData(() => api.users.getAll(), []);

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

  const [formModal, setFormModal] = useState<{
    open: boolean;
    editingUser: User | null;
  }>({ open: false, editingUser: null });

  const openCreateModal = () => setFormModal({ open: true, editingUser: null });
  const openEditModal = (user: User) =>
    setFormModal({ open: true, editingUser: user });
  const closeFormModal = () => setFormModal({ open: false, editingUser: null });

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

  const handleDelete = async (id: number) => {
    await api.users.delete(id);
    toast.success("کاربر حذف شد.");
    await refetch();
  };

  const handleToggleStatus = async (
    id: number,
    status: "active" | "inactive",
  ) => {
    await api.users.update(id, { status });
    toast.info(status === "active" ? "کاربر فعال شد." : "کاربر غیرفعال شد.");
    await refetch();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="کاربران"
        description="مدیریت کاربران سیستم و مشاهده اطلاعات آن‌ها"
        breadcrumbs={[{ label: "کاربران" }]}
        actions={
          canCreate ? (
            <Button onClick={openCreateModal}>
              <Plus size={18} />
              افزودن کاربر
            </Button>
          ) : undefined
        }
      />

      {/* Users Card */}
      <Card className="overflow-hidden border border-primary-300/60 shadow-sm">
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

        {/* Table */}
        {!loading && !error && users && users.length > 0 && (
          <UserTable
            users={filteredUsers}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </Card>

      {/* Form Modal */}
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
