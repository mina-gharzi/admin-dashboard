/*
  ==========================================================
  Team.tsx
  ----------------------------------------------------------
  صفحه‌ی «تیم» — مدیریت اعضای تیم (کارکنان پنل).
  ----------------------------------------------------------
  این صفحه از داخل Settings به یه مسیر جدا (/dashboard/team)
  منتقل شد تا ساختار پنل واضح‌تر باشه: مشتریان، محصولات،
  سفارش‌ها و گزارش‌ها یه گروهه؛ تیم و تنظیمات یه گروه جدا و
  مدیریتی‌ان (فقط مدیر کل سیستم می‌بینتشون).
  ==========================================================
*/

import { useState } from "react";
import { MoreHorizontal, Plus, UserRound, UsersRound } from "lucide-react";
import { toast } from "react-toastify";

import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { Dropdown } from "../components/ui/Dropdown";
import TeamMemberFormModal from "../components/settings/TeamMemberFormModal";

import { useData } from "../hooks/useData";
import { api, type User } from "../services/api";
import { roleLabels, roleBadgeVariants } from "../utils/permissions";

function Team() {
  const {
    data: team,
    loading: teamLoading,
    refetch: refetchTeam,
  } = useData(() => api.users.getAll(), []);

  const [memberModal, setMemberModal] = useState<{
    open: boolean;
    editingMember: User | null;
  }>({ open: false, editingMember: null });

  const [deleteMemberModal, setDeleteMemberModal] = useState<{
    open: boolean;
    memberId: number | null;
    memberName: string;
  }>({ open: false, memberId: null, memberName: "" });

  const openCreateMember = () =>
    setMemberModal({ open: true, editingMember: null });

  const openEditMember = (member: User) =>
    setMemberModal({ open: true, editingMember: member });

  const closeMemberModal = () =>
    setMemberModal({ open: false, editingMember: null });

  const handleMemberSubmit = async (data: Omit<User, "id" | "joinedAt">) => {
    if (memberModal.editingMember) {
      await api.users.update(memberModal.editingMember.id, data);
      toast.success(`عضو تیم «${data.name}» ویرایش شد.`);
    } else {
      await api.users.create({
        ...data,
        joinedAt: new Date().toLocaleDateString("fa-IR"),
      });
      toast.success(`«${data.name}» به تیم اضافه شد.`);
    }
    await refetchTeam();
  };

  const handleMemberDelete = async () => {
    if (deleteMemberModal.memberId === null) return;
    await api.users.delete(deleteMemberModal.memberId);
    toast.success("عضو تیم حذف شد.");
    setDeleteMemberModal({ open: false, memberId: null, memberName: "" });
    await refetchTeam();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="تیم"
        description="مدیریت اعضای تیم و دسترسی‌های آن‌ها"
        breadcrumbs={[{ label: "تیم" }]}
        actions={
          <Button onClick={openCreateMember}>
            <Plus size={18} />
            افزودن عضو
          </Button>
        }
      />

      <Card className="overflow-hidden border border-primary-300/60 p-0 shadow-sm">
        {teamLoading && (
          <div className="flex flex-col items-center justify-center gap-3 p-16">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-900" />
            <p className="font-estedad text-sm text-text-secondary">
              در حال بارگذاری اعضای تیم...
            </p>
          </div>
        )}

        {!teamLoading && team && team.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-900">
              <UsersRound size={24} />
            </div>
            <p className="font-estedad text-sm font-bold text-text-primary">
              هنوز عضوی به تیم اضافه نشده است
            </p>
            <p className="font-estedad text-xs text-text-secondary">
              برای شروع، اولین عضو تیم را اضافه کنید.
            </p>
            <Button size="sm" onClick={openCreateMember} className="mt-2">
              <Plus size={16} />
              افزودن اولین عضو
            </Button>
          </div>
        )}

        {!teamLoading && team && team.length > 0 && (
          <div className="divide-y divide-primary-100/60">
            {team.map((member) => {
              const initials = member.name
                .trim()
                .split(" ")
                .slice(0, 2)
                .map((part) => part.charAt(0))
                .join("")
                .toUpperCase();

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 px-6 py-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-primary-900 to-primary-700 font-inter text-xs font-bold text-white shadow-sm ring-2 ring-primary-100/60">
                      {initials || <UserRound size={16} strokeWidth={1.8} />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-estedad text-sm font-bold text-text-primary">
                        {member.name}
                      </p>
                      <span
                        dir="ltr"
                        className="block truncate text-right font-inter text-xs text-text-secondary"
                      >
                        {member.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={roleBadgeVariants[member.role]}>
                      {roleLabels[member.role]}
                    </Badge>

                    <span
                      className={`hidden h-1.5 w-1.5 rounded-full tablet:inline-block ${
                        member.status === "active" ? "bg-success" : "bg-danger"
                      }`}
                      title={member.status === "active" ? "فعال" : "غیرفعال"}
                    />

                    <Dropdown
                      trigger={
                        <button
                          type="button"
                          aria-label={`عملیات ${member.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition hover:bg-primary-100 hover:text-primary-900"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      }
                      items={[
                        {
                          label: "ویرایش",
                          onClick: () => openEditMember(member),
                        },
                        {
                          label: "حذف عضو",
                          danger: true,
                          onClick: () =>
                            setDeleteMemberModal({
                              open: true,
                              memberId: member.id,
                              memberName: member.name,
                            }),
                        },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Team Member Form Modal */}
      <TeamMemberFormModal
        key={`${memberModal.open}-${memberModal.editingMember?.id ?? "create"}`}
        open={memberModal.open}
        onClose={closeMemberModal}
        onSubmit={handleMemberSubmit}
        initialMember={memberModal.editingMember}
      />

      {/* Delete Member Confirmation Modal */}
      <Modal
        open={deleteMemberModal.open}
        onClose={() =>
          setDeleteMemberModal({ open: false, memberId: null, memberName: "" })
        }
        title="حذف عضو تیم"
        description={`آیا از حذف «${deleteMemberModal.memberName}» اطمینان دارید؟`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteMemberModal({
                  open: false,
                  memberId: null,
                  memberName: "",
                })
              }
            >
              انصراف
            </Button>
            <Button variant="danger" onClick={handleMemberDelete}>
              بله، حذف شود
            </Button>
          </>
        }
      >
        <p className="font-estedad text-sm text-text-secondary">
          این عمل غیرقابل بازگشت است و دسترسی این عضو به پنل قطع می‌شود.
        </p>
      </Modal>
    </div>
  );
}

export default Team;
