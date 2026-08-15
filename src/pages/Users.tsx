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
/*
  ==========================================================
  Users.tsx
  ----------------------------------------------------------
  Users management page — matched to Dashboard design language
  ==========================================================
*/
import { useMemo, useState } from "react";
import {
  Activity,
  ShieldCheck,
  UserCheck,
  UserRound,
  Users as UsersIcon,
  UserX,
  TrendingUp,
} from "lucide-react";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";

import UserTable from "../components/user/UserTable";
import UserFilters from "../components/user/UserFilters";

import { useData } from "../hooks/useData";
import { api } from "../services/api";

function Users() {
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

    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        String(user.id).includes(searchValue);

      const matchesRole = role === "همه" || user.role === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  const totalUsers = users?.length ?? 0;
  const activeUsers =
    users?.filter((user) => user.status === "active").length ?? 0;
  const inactiveUsers =
    users?.filter((user) => user.status === "inactive").length ?? 0;
  const adminUsers =
    users?.filter((user) => user.role === "admin").length ?? 0;

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

  const stats = [
    {
      title: "کل کاربران",
      value: totalUsers,
      subtitle: "کاربران ثبت‌شده سیستم",
      icon: UsersIcon,
      accent: "bg-primary-100 text-primary-900",
    },
    {
      title: "کاربران فعال",
      value: activeUsers,
      subtitle: "دارای دسترسی فعال",
      icon: UserCheck,
      accent: "bg-primary-50 text-primary-900",
    },
    {
      title: "کاربران غیرفعال",
      value: inactiveUsers,
      subtitle: "بدون دسترسی فعال",
      icon: UserX,
      accent: "bg-primary-100 text-primary-900",
    },
    {
      title: "مدیران",
      value: adminUsers,
      subtitle: "نقش مدیریت",
      icon: ShieldCheck,
      accent: "bg-primary-50 text-primary-900",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="کاربران"
        description="مدیریت کاربران سیستم و دسترسی‌های آن‌ها"
        breadcrumbs={[{ label: "کاربران" }]}
        actions={
          <Button size="md" leftIcon={<UserRound size={17} />}>
            افزودن کاربر
          </Button>
        }
      />

      {/* Statistics — Dashboard style */}
      <section className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="
                group relative overflow-hidden border-primary-300
                p-5 transition-all duration-200
                hover:-translate-y-1 hover:shadow-sm
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-vazirmatn text-sm text-text-secondary">
                    {stat.title}
                  </p>
                  <p className="mt-3 font-inter text-2xl font-bold tracking-tight text-text-primary">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`
                    flex h-11 w-11 items-center justify-center rounded-2xl
                    transition-transform duration-200 group-hover:scale-110
                    ${stat.accent}
                  `}
                >
                  <Icon size={21} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-900">
                  <TrendingUp size={12} />
                  سیستم
                </span>
                <span className="font-vazirmatn text-[11px] text-text-secondary">
                  {stat.subtitle}
                </span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Main Table Card */}
      <Card className="overflow-hidden border-primary-300 p-0">
        {/* Section Header */}
        <div className="flex flex-col gap-3 border-b border-primary-300 px-7 py-5 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <Activity size={19} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-vazirmatn text-lg font-semibold text-text-primary">
                مدیریت کاربران
              </h2>
              <p className="mt-1 font-vazirmatn text-xs text-text-secondary">
                جستجو، فیلتر و مدیریت کاربران سیستم
              </p>
            </div>
          </div>

          <div className="font-vazirmatn text-xs text-text-secondary">
            <span className="inline-flex items-center rounded-2xl bg-primary-50 px-3 py-1.5 font-medium text-primary-900">
              {filteredUsers.length} کاربر
            </span>
          </div>
        </div>

        {/* Filters */}
        <UserFilters
          search={search}
          role={role}
          onSearchChange={setSearch}
          onRoleChange={setRole}
          resultCount={filteredUsers.length}
        />

        {/* Loading */}
        {loading && (
          <div className="flex min-h-72 items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
              <p className="font-vazirmatn text-sm text-text-secondary">
                در حال بارگذاری کاربران...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-72 items-center justify-center p-12">
            <div className="text-center">
              <p className="font-vazirmatn text-sm font-medium text-danger">
                خطا در دریافت اطلاعات کاربران
              </p>
              <p className="mt-2 font-vazirmatn text-xs text-text-secondary">
                {error.message}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={refetch}
              >
                تلاش مجدد
              </Button>
            </div>
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