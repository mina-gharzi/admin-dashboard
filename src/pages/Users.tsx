/*
  ==========================================================
  Users.tsx
  ----------------------------------------------------------
  Users management page.
  ----------------------------------------------------------
  این Page مسئول هماهنگ کردن:

  - UserFilters
  - UserTable
  - User data (از services/api)
  - Search & filtering state
  - افزودن / ویرایش کاربر (UserFormModal)
  ==========================================================
*/

import { useMemo, useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

import UserTable from "../components/user/UserTable";
import UserFilters from "../components/user/UserFilters";
import UserFormModal from "../components/user/UserFormModal";

import { useData } from "../hooks/useData";
import { api, type User } from "../services/api";

/*
  ----------------------------------------------------------
  Users Page
  ----------------------------------------------------------
*/

function Users() {
  /*
    --------------------------------------------------------
    Data Fetching
    --------------------------------------------------------
  */

  const {
    data: users,
    loading,
    error,
    refetch,
  } = useData(() => api.users.getAll(), []);

  /*
    --------------------------------------------------------
    Filters
    --------------------------------------------------------
  */

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

  /*
    --------------------------------------------------------
    Form Modal State (Create / Edit)
    --------------------------------------------------------
  */

  const [formModal, setFormModal] = useState<{
    open: boolean;
    editingUser: User | null;
  }>({ open: false, editingUser: null });

  const openCreateModal = () => {
    setFormModal({ open: true, editingUser: null });
  };

  const openEditModal = (user: User) => {
    setFormModal({ open: true, editingUser: user });
  };

  const closeFormModal = () => {
    setFormModal({ open: false, editingUser: null });
  };

  const handleFormSubmit = async (
    data: Omit<User, "id" | "joinedAt">
  ) => {
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

  /*
    --------------------------------------------------------
    Other Actions
    --------------------------------------------------------
  */

  const handleDelete = async (id: number) => {
    await api.users.delete(id);
    toast.success("کاربر حذف شد.");
    await refetch();
  };

  const handleToggleStatus = async (
    id: number,
    status: "active" | "inactive"
  ) => {
    await api.users.update(id, { status });
    toast.info(
      status === "active" ? "کاربر فعال شد." : "کاربر غیرفعال شد."
    );
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
          <Button onClick={openCreateModal}>
            <Plus size={18} />
            افزودن کاربر
          </Button>
        }
      />

      {/* Users Card */}

      <Card className="overflow-hidden">
        <UserFilters
          search={search}
          role={role}
          onSearchChange={setSearch}
          onRoleChange={setRole}
          resultCount={filteredUsers.length}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-12">
            <p className="font-vazirmatn text-sm text-text-secondary">
              در حال بارگذاری کاربران...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center p-12">
            <p className="font-vazirmatn text-sm text-danger">
              خطا در دریافت اطلاعات: {error.message}
            </p>
          </div>
        )}

        {/* Empty State (کاربری اصلاً ثبت نشده) */}
        {!loading && !error && users && users.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <p className="font-vazirmatn text-sm text-text-secondary">
              هنوز هیچ کاربری ثبت نشده است.
            </p>
            <Button size="sm" onClick={openCreateModal}>
              <Plus size={16} />
              افزودن اولین کاربر
            </Button>
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
      />
    </div>
  );
}

export default Users;
