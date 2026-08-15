/*
  ==========================================================
  App.tsx
  ----------------------------------------------------------
  Root component of the Admin Dashboard.
  فعلاً فقط برای تست Typography و Design System استفاده می‌شود.
  ==========================================================
*/

function App() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* Persian Typography */}
        <h1 className="font-vazirmatn text-3xl font-bold text-text-primary">
          داشبورد مدیریت
        </h1>

        <p className="mt-3 font-vazirmatn text-text-secondary">
          این متن با فونت وزیرمتن نمایش داده می‌شود.
        </p>

        {/* English Typography */}
        <h2 className="mt-8 font-inter text-2xl font-bold text-text-primary">
          Admin Dashboard
        </h2>

        <p className="mt-3 font-inter text-text-secondary">
          This text is using the English typography system.
        </p>
      </div>
    </main>
  );
}

export default App;