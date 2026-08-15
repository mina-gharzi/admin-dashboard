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
  ==========================================================
*/

import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

import UserTable from "../components/user/UserTable";
import UserFilters from "../components/user/UserFilters";

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
    Actions
    --------------------------------------------------------
  */

  const handleDelete = async (id: number) => {
    await api.users.delete(id);
    await refetch();
  };

  const handleToggleStatus = async (
    id: number,
    status: "active" | "inactive"
  ) => {
    await api.users.update(id, { status });
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
          <Button>
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

        {/* Table */}
        {!loading && !error && (
          <UserTable
            users={filteredUsers}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </Card>
    </div>
  );
}

export default Users;
