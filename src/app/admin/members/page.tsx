
"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileDown, User, Clock, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

type Member = {
    id: string;
    full_name: string;
    phone: string;
    email: string | null;
    gender: string;
    wallet_balance: number;
    created_at: string;
};

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        email: "",
        gender: "male"
    });

    const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setMembers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = await supabase.from('members').insert([{
            full_name: formData.full_name,
            phone: formData.phone,
            email: formData.email,
            gender: formData.gender,
            wallet_balance: 0
        }]);

        if (!error) {
            setShowModal(false);
            setFormData({ full_name: "", phone: "", email: "", gender: "male" });
            fetchMembers();
        } else {
            alert("Error adding member: " + error.message);
        }
    };

    const exportToCSV = () => {
        // Basic CSV implementation
        const headers = ["الاسم", "رقم التليفون", "الايميل", "النوع", "الرصيد", "تاريخ الانضمام"];
        const csvContent = [
            headers.join(","),
            ...members.map(m => [
                `"${m.full_name}"`,
                `"${m.phone}"`,
                `"${m.email || ''}"`,
                m.gender,
                m.wallet_balance,
                new Date(m.created_at).toLocaleDateString('ar-EG')
            ].join(","))
        ].join("\n");

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "members_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredMembers = members.filter(m =>
        m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-l from-gray-900 to-gray-600 bg-clip-text text-transparent">الأعضاء</h2>
                    <p className="text-gray-500 mt-1">إدارة بيانات العملاء والأعضاء.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 glass px-4 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        <FileDown className="w-5 h-5" />
                        <span>تصدير CSV</span>
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-[--primary] to-[--secondary] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>عضو جديد</span>
                    </button>
                </div>
            </header>

            {/* Search & Filters */}
            <div className="glass p-4 rounded-2xl flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ابحث بالاسم أو رقم التليفون..."
                        className="w-full pr-12 pl-4 py-3 rounded-xl bg-gray-50/50 border-transparent focus:bg-white focus:ring-2 focus:ring-[--primary] outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Members Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-600">الاسم</th>
                                <th className="px-6 py-4 font-bold text-gray-600">رقم التليفون</th>
                                <th className="px-6 py-4 font-bold text-gray-600">الرصيد</th>
                                <th className="px-6 py-4 font-bold text-gray-600">تاريخ الانضمام</th>
                                <th className="px-6 py-4 font-bold text-gray-600">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">جاري التحميل...</td>
                                </tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">لا يوجد أعضاء مطابقين للبحث.</td>
                                </tr>
                            ) : (
                                filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                                    {member.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{member.full_name}</p>
                                                    <p className="text-xs text-gray-400">{member.email || 'لا يوجد بريد'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono">{member.phone}</td>
                                        <td className="px-6 py-4 font-bold text-[--primary]">{member.wallet_balance} ج.م</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(member.created_at).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-sm font-bold text-gray-500 hover:text-[--primary] transition-colors">
                                                عرض التفاصيل
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Member Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-2xl font-bold">إضافة عضو جديد</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالكامل</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[--primary] outline-none"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم التليفون</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[--primary] outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[--primary] outline-none bg-white"
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="male">ذكر</option>
                                        <option value="female">أنثى</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني (اختياري)</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[--primary] outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-[--primary] to-[--secondary] text-white hover:shadow-lg transition-all"
                                >
                                    حفظ البيانات
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
