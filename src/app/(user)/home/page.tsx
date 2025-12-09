
"use client";

import { Bell, Search, Star, Clock, Zap, Sticker } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[--primary] to-[--secondary] p-0.5">
                        <div className="w-full h-full bg-white rounded-full p-1">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Omar" alt="Profile" className="w-full h-full rounded-full" />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">أهلاً بك 👋</p>
                        <h2 className="font-bold text-lg">عمر أبو</h2>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-600 hover:text-[--primary]">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-600 hover:text-[--primary] relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </header>

            {/* Wallet Card */}
            <div className="glass p-6 rounded-3xl relative overflow-hidden text-center md:text-right" style={{ background: 'var(--primary-gradient)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full" />
                <div className="relative z-10 text-white">
                    <p className="opacity-80 text-sm font-medium mb-1">الرصيد الحالي</p>
                    <h3 className="text-4xl font-bold mb-4">1,250.00 <span className="text-base font-normal opacity-80">ج.م</span></h3>
                    <button className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/30 transition-all">
                        + إضافة رصيد
                    </button>
                </div>
            </div>

            {/* Quick Tools */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">أدوات ذكية</h3>
                    <Link href="/tools" className="text-sm text-[--primary] font-bold">عرض الكل</Link>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Link href="/tools/timer" className="glass p-4 rounded-2xl flex flex-col items-center gap-3 hover:scale-105 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold">Pomodoro</span>
                    </Link>
                    <Link href="/tools/ai" className="glass p-4 rounded-2xl flex flex-col items-center gap-3 hover:scale-105 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Zap className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold">صميدة AI</span>
                    </Link>
                    <Link href="/tools/notes" className="glass p-4 rounded-2xl flex flex-col items-center gap-3 hover:scale-105 transition-transform">
                        <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center">
                            <Sticker className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold">ملاحظات</span>
                    </Link>
                </div>
            </div>

            {/* Offers Slider */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg">أحدث العروض</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {[1, 2].map((i) => (
                        <div key={i} className="min-w-[85%] h-40 rounded-2xl bg-gray-200 relative overflow-hidden group">
                            {/* Placeholder Image */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                            <div className="absolute bottom-4 right-4 left-4 z-20 text-white">
                                <span className="bg-[--secondary] px-2 py-1 rounded text-[10px] font-bold mb-2 inline-block">خصم 20%</span>
                                <h4 className="font-bold text-lg">ليلة الألعاب الكبرى</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
