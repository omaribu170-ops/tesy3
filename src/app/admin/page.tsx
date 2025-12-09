
import { Users, Clock, Wallet, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
    // Mock data for now
    const stats = [
        { title: "الجلسات النشطة", value: "12", icon: Clock, color: "text-blue-500", bg: "bg-blue-100" },
        { title: "إجمالي الأعضاء", value: "1,240", icon: Users, color: "text-purple-500", bg: "bg-purple-100" },
        { title: "إيرادات اليوم", value: "15,350 ج.م", icon: Wallet, color: "text-green-500", bg: "bg-green-100" },
        { title: "مهام معلقة", value: "3", icon: AlertCircle, color: "text-red-500", bg: "bg-red-100" },
    ];

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-l from-gray-900 to-gray-600 bg-clip-text text-transparent">لوحة التحكم</h2>
                    <p className="text-gray-500 mt-1">أهلاً بك، إليك ملخص سريع لما يحدث اليوم.</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass px-4 py-2 rounded-lg text-sm font-medium">
                        {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="glass p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">الجلسات الحالية</h3>
                    {/* Placeholder for Sessions Table */}
                    <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                        جاري تحميل البيانات...
                    </div>
                </div>

                <div className="glass rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">تنبيهات المخزن</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">مشروب كولا</p>
                                    <p className="text-xs text-gray-400">الكمية المتبقية: 5</p>
                                </div>
                                <button className="text-xs text-[--primary] font-bold">طلب</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
