/*
  ==========================================================
  utils/toastAction.ts
  ----------------------------------------------------------
  الگوی تکراری try/catch + toast.success/toast.error + throw
  که تو هندلرهای create/update/delete صفحات Products، Orders،
  Users و Team عیناً تکرار شده بود.

  چرا throw می‌کنیم:
  فرم‌مودال‌ها (مثل ProductFormModal) به throw شدنِ خطا
  نیاز دارن تا خودشون رو نبندن (کاربر بتونه دوباره تلاش کنه).
  این رفتار قبلی دقیقاً حفظ شده.

  استفاده:

  const handleDelete = async (id: number) => {
    await runWithToast(() => api.products.delete(id), {
      success: "محصول حذف شد.",
      error: "خطا در حذف محصول. دوباره تلاش کنید.",
    });
    await refetch();
  };
  ==========================================================
*/

import { toast } from "react-toastify";

interface ToastActionMessages {
  /** اگه ندی، بعد از موفقیت toast نمایش داده نمیشه (مثلاً وقتی خودِ caller مسئول پیامه) */
  success?: string;
  error: string;
}

export async function runWithToast<T>(
  action: () => Promise<T>,
  messages: ToastActionMessages,
): Promise<T> {
  try {
    const result = await action();

    if (messages.success) {
      toast.success(messages.success);
    }

    return result;
  } catch (err) {
    toast.error(messages.error);
    throw err;
  }
}
