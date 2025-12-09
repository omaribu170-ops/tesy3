
"use client";

import { User, Settings, LogOut, History, Award, ChevronLeft, Wallet } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="p-6 space-y-6 pb-24">
            <h2 className="text-2xl font-bold">الملف الشخصي</h2>

            {/* User Info Card */}
            <div className="glass p-6 rounded-3xl flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[--primary] to-[--secondary] p-1">
                    <div className="w-full h-full bg-white rounded-full p-1">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Omar" alt="Profile" className="w-full h-full rounded-full" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">عمر أبو</h3>
                    <p className="text-gray-500 text-sm">omar@example.com</p>
                    <span className="inline-block bg-orange-100 text-[--primary] px-3 py-0.5 rounded-full text-xs font-bold mt-2">عضو ذهبي</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl text-blue-500 flex items-center justify-center mb-3">
                        <History className="w-5 h-5" />
                    </div>
                    <p className="text-gray-400 text-xs font-bold">ساعات العمل</p>
                    <h4 className="text-2xl font-bold">45 <span className="text-sm font-normal text-gray-400">ساعة</span></h4>
                </div>
                <div className="glass p-4 rounded-2xl">
                    <div className="w-10 h-10 bg-green-50 rounded-xl text-green-500 flex items-center justify-center mb-3">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <p className="text-gray-400 text-xs font-bold">إجمالي المصروفات</p>
                    <h4 className="text-2xl font-bold">3,500 <span className="text-sm font-normal text-gray-400">ج.م</span></h4>
                </div>
                <div className="glass p-4 rounded-2xl col-span-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl text-purple-500 flex items-center justify-center">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold">نقاط الولاء</p>
                            <h4 className="text-xl font-bold">1,250 <span className="text-sm font-normal text-gray-400">نقطة</span></h4>
                        </div>
                    </div>
                    <button className="text-sm font-bold text-[--primary]">استبدال</button>
                </div>
            </div>

            {/* Menu List */}
            <div className="glass rounded-3xl overflow-hidden divide-y divide-gray-100">
                {[
                    { icon: Settings, label: "تعديل البيانات", href: "/profile/edit" },
                    { icon: Wallet, label: "سجل المدفوعات", href: "/profile/payments" },
                    { icon: History, label: "سجل الزيارات", href: "/profile/visits" },
                ].map((item, i) => (
                    <Link key={i} href={item.href} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                                <item.icon className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-700">{item.label}</span>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                ))}

                <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-red-500">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <LogOut className="w-4 h-4" />
                        </div>
                        <span className="font-bold">تسجيل الخروج</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
