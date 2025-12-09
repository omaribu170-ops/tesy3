
"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Users, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function ReservePage() {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleBook = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3); // Success
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-24">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/home" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h2 className="text-2xl font-bold">حجز طاولة</h2>
            </div>

            {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                    <div className="glass p-6 rounded-3xl">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[--primary]" />
                            اختر الموعد
                        </h3>
                        <input
                            type="date"
                            className="w-full p-4 mb-4 rounded-xl bg-gray-50 border border-gray-100 outline-none font-bold"
                            onChange={e => setDate(e.target.value)}
                        />
                        <div className="grid grid-cols-3 gap-2">
                            {['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTime(t)}
                                    className={clsx(
                                        "py-3 rounded-xl text-sm font-bold border border-gray-100 transition-all",
                                        time === t ? "bg-[--primary] text-white shadow-lg border-transparent" : "bg-white text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[--primary]" />
                            عدد الأفراد
                        </h3>
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
                            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-12 h-12 bg-white rounded-lg shadow-sm font-bold text-xl text-gray-600">-</button>
                            <span className="font-bold text-xl">{guests}</span>
                            <button onClick={() => setGuests(guests + 1)} className="w-12 h-12 bg-white rounded-lg shadow-sm font-bold text-xl text-[--primary]">+</button>
                        </div>
                    </div>

                    <div className="glass p-4 rounded-2xl flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-red-500" />
                        <div>
                            <p className="font-bold text-sm">الفرع الرئيسي</p>
                            <p className="text-xs text-gray-400">شارع التسعين، التجمع الخامس</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        disabled={!date || !time}
                        className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-[--primary] to-[--secondary] text-white shadow-lg disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
                    >
                        <span>متابعة</span>
                        <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                    <div className="glass p-8 rounded-3xl text-center">
                        <h3 className="text-xl font-bold mb-6">ملخص الحجز</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="text-gray-500">التاريخ</span>
                                <span className="font-bold">{date}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="text-gray-500">الوقت</span>
                                <span className="font-bold">{time}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="text-gray-500">الأفراد</span>
                                <span className="font-bold">{guests}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 rounded-xl border border-[--primary]/20">
                                <span className="text-gray-500">العربون</span>
                                <span className="font-bold text-[--primary]">50.00 ج.م</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleBook}
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold bg-green-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="loader"></span> : <span>تأكيد ودفع العربون</span>}
                    </button>

                    <button onClick={() => setStep(1)} className="w-full py-3 font-bold text-gray-500">تعديل البيانات</button>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center justify-center pt-20 animate-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-green-200 shadow-xl">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">تم الحجز بنجاح!</h3>
                    <p className="text-gray-500 text-center max-w-xs mb-8">رقم الحجز #HUB-2024-89<br />في انتظارك يا فنان.</p>

                    <Link href="/home" className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold hover:scale-105 transition-transform">
                        العودة للرئيسية
                    </Link>
                </div>
            )}
        </div>
    );
}
