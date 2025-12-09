
"use client";

import { useState } from "react";
import { Users, DollarSign, Trophy, Search, ArrowUpRight } from "lucide-react";

export default function AdminAffiliatesPage() {
    const [affiliates, setAffiliates] = useState([
        { id: 1, name: "عمر أبو", code: "OMAR2024", referrals: 25, earnings: 1250, status: 'active' },
        { id: 2, name: "أحمد محمد", code: "AHMED99", referrals: 12, earnings: 600, status: 'active' },
        { id: 3, name: "سارة علي", code: "SARA_HUB", referrals: 8, earnings: 400, status: 'inactive' },
    ]);

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold bg-gradient-to-l from-gray-900 to-gray-600 bg-clip-text text-transparent">نظام الشركاء (Affiliates)</h2>
                <p className="text-gray-500 mt-1">متابعة المسوقين وأكواد الخصم والأرباح.</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl flex items-center gap-4 border-b-4 border-[--primary]">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[--primary] flex items-center justify-center">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold text-sm">إجمالي المسوقين</p>
                        <h3 className="text-3xl font-bold">142</h3>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl flex items-center gap-4 border-b-4 border-green-500">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold text-sm">مجموع العمولات</p>
                        <h3 className="text-3xl font-bold">45,200 <span className="text-sm text-gray-400">ج.م</span></h3>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl flex items-center gap-4 border-b-4 border-blue-500">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold text-sm">أعلى مسوق</p>
                        <h3 className="text-xl font-bold">عمر أبو</h3>
                    </div>
                </div>
            </div>

            {/* Affiliates Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">قائمة المسوقين</h3>
                    <div className="relative">
                        <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="بحث بالاسم أو الكود" className="bg-gray-50 rounded-lg pr-9 pl-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[--primary]" />
                    </div>
                </div>
                <table className="w-full text-right">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-gray-600">المسوق</th>
                            <th className="px-6 py-4 text-gray-600">الكود</th>
                            <th className="px-6 py-4 text-gray-600">عدد الدعوات</th>
                            <th className="px-6 py-4 text-gray-600">الأرباح</th>
                            <th className="px-6 py-4 text-gray-600">الحالة</th>
                            <th className="px-6 py-4 text-gray-600"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {affiliates.map(aff => (
                            <tr key={aff.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-bold">{aff.name}</td>
                                <td className="px-6 py-4 font-mono bg-gray-50 w-fit rounded px-2">{aff.code}</td>
                                <td className="px-6 py-4">{aff.referrals}</td>
                                <td className="px-6 py-4 font-bold text-green-600">{aff.earnings} ج.م</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${aff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {aff.status === 'active' ? 'نشط' : 'متوقف'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-gray-400 hover:text-[--primary]">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
