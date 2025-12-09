
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export default function NewGameNightPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        time: "20:00"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.date || !formData.time) return;

        // Combine date and time
        const fullDate = new Date(`${formData.date}T${formData.time}`).toISOString();

        const { error } = await supabase.from('game_nights').insert([{
            name: formData.name,
            date: fullDate,
            status: 'scheduled'
        }]);

        if (!error) {
            router.push('/admin/entertainment');
        } else {
            alert("Error creating game night");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">إضافة ليلة ألعاب جديدة</h2>

            <div className="glass p-8 rounded-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم الحدث</label>
                        <input
                            required
                            type="text"
                            placeholder="مثال: ليلة الفيفا العالمية"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[--primary]"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الحدث</label>
                            <input
                                required
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[--primary]"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">وقت البدء</label>
                            <input
                                required
                                type="time"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[--primary]"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-[--primary] to-[--secondary] text-white shadow-lg hover:shadow-xl"
                        >
                            إضافة الحدث
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
