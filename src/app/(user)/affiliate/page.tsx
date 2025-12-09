
"use client";

import { useState } from "react";
import { Copy, Share2, Users, DollarSign, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AffiliatePage() {
    const [copied, setCopied] = useState(false);
    const affiliateCode = "OMAR2024"; // Mock code

    const copyCode = () => {
        navigator.clipboard.writeText(affiliateCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/profile" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h2 className="text-2xl font-bold">برنامج الشركاء</h2>
            </div>

            {/* Hero Card */}
            <div className="glass p-8 rounded-3xl text-center mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[--primary] opacity-10 rounded-bl-full transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                    <p className="text-gray-500 font-bold mb-2">كود الخصم الخاص بك</p>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <h3 className="text-4xl font-mono font-bold tracking-wider text-[--primary]">{affiliateCode}</h3>
                        <button onClick={copyCode} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            {copied ? <span className="text-green-500 text-xs font-bold">تم النسخ</span> : <Copy className="w-5 h-5 text-gray-400" />}
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 max-w-xs mx-auto">شارك الكود مع صحابك وهما يحصلوا على 10% خصم وأنت تكسب 50 جنيه رصيد.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass p-6 rounded-3xl">
                    <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 text-xs font-bold mb-1">الأرباح</p>
                    <h4 className="text-2xl font-bold">1,250 <span className="text-xs font-normal">ج.م</span></h4>
                </div>
                <div className="glass p-6 rounded-3xl">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 text-xs font-bold mb-1">المسجلين</p>
                    <h4 className="text-2xl font-bold">25 <span className="text-xs font-normal">شخص</span></h4>
                </div>
            </div>

            {/* Referrals List */}
            <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <span>أحدث النشاطات</span>
                </h3>
                <div className="glass rounded-3xl overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                                    {['A', 'M', 'S', 'H'][i - 1]}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">صديق جديد</p>
                                    <p className="text-xs text-gray-400">انضم باستخدام كودك</p>
                                </div>
                            </div>
                            <span className="font-bold text-green-600 text-sm">+50 ج.م</span>
                        </div>
                    ))}
                </div>
            </div>

            <button className="fixed bottom-6 left-6 right-6 bg-gray-900 text-white py-4 rounded-xl font-bold shadow-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5" />
                <span>مشاركة الكود</span>
            </button>
        </div>
    );
}
