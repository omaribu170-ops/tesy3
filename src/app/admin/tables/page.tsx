
"use client";

import { useState, useEffect } from "react";
import { Plus, Users, DollarSign, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Type definition (move to types folder later)
type Table = {
    id: string;
    name: string;
    image_url: string;
    rate_per_hour: number;
    capacity_min: number;
    capacity_max: number;
};

export default function TablesPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        rate: "",
        min: "1",
        max: "4",
        image: ""
    });

    // Fetch Tables
    const fetchTables = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('tables').select('*').order('name');
        if (data) setTables(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTables();
    }, []);

    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = await supabase.from('tables').insert([{
            name: formData.name,
            rate_per_hour: parseFloat(formData.rate),
            capacity_min: parseInt(formData.min),
            capacity_max: parseInt(formData.max),
            image_url: formData.image || 'https://placehold.co/600x400'
        }]);

        if (!error) {
            setShowModal(false);
            setFormData({ name: "", rate: "", min: "1", max: "4", image: "" });
            fetchTables();
        } else {
            alert("Error adding table: " + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-l from-gray-900 to-gray-600 bg-clip-text text-transparent">الترابيزات</h2>
                    <p className="text-gray-500 mt-1">إدارة مساحات العمل والترابيزات المتاحة.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[--primary] to-[--secondary] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة ترابيزة جديدة</span>
                </button>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full h-64 flex items-center justify-center text-gray-400">
                        جاري التحميل...
                    </div>
                ) : tables.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
                        لا توجد ترابيزات مضافة حتى الآن.
                    </div>
                ) : (
                    tables.map((table) => (
                        <div key={table.id} className="glass group overflow-hidden rounded-2xl relative hover:shadow-2xl transition-all duration-300">
                            <div className="h-48 bg-gray-200 w-full relative overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={table.image_url}
                                    alt={table.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    {table.rate_per_hour} ج.م / ساعة
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-bold mb-2">{table.name}</h3>
                                <div className="flex items-center gap-4 text-gray-500 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{table.capacity_min} - {table.capacity_max} فرد</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors">
                                        تعديل
                                    </button>
                                    <button className="flex-1 bg-[--primary] hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors opacity-0 group-hover:opacity-100">
                                        احصائيات
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-2xl font-bold">إضافة ترابيزة جديدة</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الترابيزة</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[--primary] focus:border-transparent outline-none transition-all"
                                    placeholder="مثال: القاعة الرئيسية - A1"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">سعر الساعة (للفرد)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[--primary] outline-none"
                                        value={formData.rate}
                                        onChange={e => setFormData({ ...formData, rate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[--primary] outline-none"
                                        placeholder="https://..."
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">أقل عدد</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                                        value={formData.min}
                                        onChange={e => setFormData({ ...formData, min: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">أقصى عدد</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                                        value={formData.max}
                                        onChange={e => setFormData({ ...formData, max: e.target.value })}
                                    />
                                </div>
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
                                    إضافة
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
