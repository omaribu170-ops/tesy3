
"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, Trophy, Users, Clock, ArrowRight, History } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { formatDistanceStrict, format } from "date-fns";
import { arEG } from "date-fns/locale";

type GameNight = {
    id: string;
    name: string;
    date: string;
    status: string;
};

export default function EntertainmentPage() {
    const [upcomingGameNight, setUpcomingGameNight] = useState<GameNight | null>(null);
    const [pastGameNights, setPastGameNights] = useState<GameNight[]>([]);
    const [loading, setLoading] = useState(true);

    // Countdown State
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

    const fetchGameNights = async () => {
        setLoading(true);
        const now = new Date().toISOString();

        // Fetch Upcoming (First one after now)
        const { data: upcoming } = await supabase
            .from('game_nights')
            .select('*')
            .gte('date', now)
            .order('date', { ascending: true })
            .limit(1)
            .single();

        if (upcoming) setUpcomingGameNight(upcoming);

        // Fetch Past
        const { data: past } = await supabase
            .from('game_nights')
            .select('*')
            .lt('date', now)
            .order('date', { ascending: false });

        if (past) setPastGameNights(past);
        setLoading(false);
    };

    useEffect(() => {
        fetchGameNights();
    }, []);

    // Countdown Timer
    useEffect(() => {
        if (!upcomingGameNight) return;

        const interval = setInterval(() => {
            const target = new Date(upcomingGameNight.date).getTime();
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft(null); // Event started or passed
            } else {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [upcomingGameNight]);

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-l from-gray-900 to-gray-600 bg-clip-text text-transparent">منصة الترفيه</h2>
                    <p className="text-gray-500 mt-1">إدارة ليالي الألعاب والبطولات والجوائز.</p>
                </div>
                <Link
                    href="/admin/entertainment/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-[--primary] to-[--secondary] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>إضافة ليلة ألعاب جديدة</span>
                </Link>
            </header>

            {/* Upcoming Game Night / Countdown */}
            {upcomingGameNight ? (
                <div className="relative overflow-hidden glass p-8 rounded-3xl border border-[--primary]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[--primary] opacity-10 rounded-bl-full"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-right">
                            <div className="inline-flex items-center gap-2 bg-orange-100 text-[--primary] px-3 py-1 rounded-full text-xs font-bold mb-4 animate-pulse">
                                <Calendar className="w-3 h-3" />
                                <span>الحدث القادم</span>
                            </div>
                            <h3 className="text-4xl font-bold mb-2">{upcomingGameNight.name}</h3>
                            <p className="text-xl text-gray-500 flex items-center gap-2 justify-center md:justify-start">
                                <Clock className="w-5 h-5" />
                                {new Date(upcomingGameNight.date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
                                {' - '}
                                {new Date(upcomingGameNight.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>

                        {timeLeft && (
                            <div className="flex gap-4">
                                {[
                                    { label: 'يوم', val: timeLeft.days },
                                    { label: 'ساعة', val: timeLeft.hours },
                                    { label: 'دقيقة', val: timeLeft.minutes },
                                    { label: 'ثانية', val: timeLeft.seconds }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="w-20 h-20 glass flex items-center justify-center text-3xl font-bold text-[--primary] rounded-2xl shadow-sm border border-orange-100">
                                            {item.val}
                                        </div>
                                        <span className="text-sm font-bold text-gray-400 mt-2">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Link href={`/admin/entertainment/${upcomingGameNight.id}`} className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2">
                            <span>إدارة البطولة</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="glass p-12 rounded-3xl text-center text-gray-400 flex flex-col items-center">
                    <Trophy className="w-16 h-16 mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">لا توجد ليالي ألعاب قادمة</h3>
                    <p>قم بإضافة ليلة ألعاب جديدة لبدء العد التنازلي.</p>
                </div>
            )}

            {/* History Table */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <History className="w-6 h-6 text-gray-400" />
                    <span>سجل ليالي الألعاب السابقة</span>
                </h3>

                <div className="glass rounded-2xl overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-gray-600">اسم الليلة</th>
                                <th className="px-6 py-4 text-gray-600">التاريخ</th>
                                <th className="px-6 py-4 text-gray-600">الحالة</th>
                                <th className="px-6 py-4 text-gray-600">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-8">جاري التحميل...</td></tr>
                            ) : pastGameNights.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-400">لا يوجد سجل سابق</td></tr>
                            ) : pastGameNights.map(night => (
                                <tr key={night.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-bold">{night.name}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(night.date).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">منتهي</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/entertainment/${night.id}`} className="text-[--primary] font-bold text-sm hover:underline">
                                            عرض التفاصيل
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
