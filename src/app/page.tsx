
export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibm-arabic)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-right w-full max-w-4xl mx-auto">

        <div className="glass p-12 w-full flex flex-col items-center justify-center gap-6">
          <h1 className="text-5xl font-bold text-gradient">
            أهلاً بك في ذا هب
          </h1>
          <p className="text-xl text-gray-600">
            نظام إدارة مساحات العمل والترفيه المتكامل
          </p>

          <div className="flex gap-4 mt-4">
            <button className="glass px-6 py-3 font-bold hover:bg-white/50 transition-all text-primary-600" style={{ color: 'var(--primary)' }}>
              تسجيل الدخول
            </button>
            <button className="glass px-6 py-3 font-bold hover:bg-white/50 transition-all">
              لوحة التحكم
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[--primary] to-[--accent]"
                style={{ background: 'var(--primary-gradient)' }}></div>
              <h3 className="text-xl font-bold">ميزة {i}</h3>
              <p className="text-gray-500">وصف مختصر للميزة يظهر هنا بتصميم زجاجي أنيق.</p>
            </div>
          ))}
        </div>

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-20 text-gray-400">
        <p>جميع الحقوق محفوظة © 2025 ذا هب</p>
      </footer>
    </div>
  );
}
