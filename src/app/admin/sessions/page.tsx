
"use client";

import { useState, useEffect } from "react";
import { Plus, Clock, Users, Ban, CheckCircle, CreditCard, Banknote, Wallet, History, FileDown, Search, Eye } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { formatDistanceStrict } from "date-fns";
import { arEG } from "date-fns/locale";

type Session = {
    id: string;
    table: { name: string; rate_per_hour: number };
    start_time: string;
    end_time: string | null;
    total_amount: number;
    status: string;
    session_members: { member: { full_name: string; phone: string } }[];
};

export default function SessionsPage() {
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [activeSessions, setActiveSessions] = useState<Session[]>([]);
    const [historySessions, setHistorySessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    // Payment Modal State
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [paymentStep, setPaymentStep] = useState<'confirm_stop' | 'summary' | 'payment'>('confirm_stop');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'visa' | 'wallet'>('cash');
    const [paymentDetails, setPaymentDetails] = useState('');

    const fetchSessions = async () => {
        setLoading(true);

        // Fetch Active
        const { data: active } = await supabase
            .from('sessions')
            .select(`
        id,
        start_time,
        status,
        table:tables (name, rate_per_hour),
        session_members (
          member:members (full_name)
        )
      `)
            .eq('status', 'active')
            .order('start_time', { ascending: false });

        if (active) setActiveSessions(active as any);

        // Fetch History (Completed)
        const { data: history } = await supabase
            .from('sessions')
            .select(`
        id,
        start_time,
        end_time,
        total_amount,
        status,
        table:tables (name),
        session_members (
          member:members (full_name, phone)
        )
      `)
            .in('status', ['completed', 'cancelled'])
            .order('end_time', { ascending: false })
            .limit(50); // Limit for performance

        if (history) setHistorySessions(history as any);

        setLoading(false);
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 30000);
        return () => clearInterval(interval);
    }, []);

    // Timer Component
    const SessionTimer = ({ startTime }: { startTime: string }) => {
        const [elapsed, setElapsed] = useState("");
        useEffect(() => {
            const update = () => {
                const start = new Date(startTime);
                const now = new Date();
                setElapsed(formatDistanceStrict(start, now, { locale: arEG, addSuffix: false }));
            };
            update();
            const i = setInterval(update, 60000);
            return () => clearInterval(i);
        }, [startTime]);
        return <span className="font-mono font-bold text-lg">{elapsed}</span>;
    };

    const calculateTotal = (session: Session) => {
        const start = new Date(session.start_time).getTime();
        const now = new Date().getTime();
        const hours = (now - start) / (1000 * 60 * 60);
        const rate = session.table.rate_per_hour;
        const memberCount = session.session_members.length;
        return Math.ceil(hours * rate * memberCount);
    };

    const confirmPayment = async () => {
        if (!selectedSession) return;
        const total = calculateTotal(selectedSession);
        const { error } = await supabase.from('sessions').update({
            end_time: new Date().toISOString(),
            status: 'completed',
            total_amount: total,
            payment_method: paymentMethod,
            payment_details: paymentDetails ? { details: paymentDetails } : null
        }).eq('id', selectedSession.id);
        if (!error) {
            setSelectedSession(null);
            fetchSessions();
        } else {
            alert("Error saving payment");
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-l from-gray-900 to-gray-600 bg-clip-text text-transparent">إدارة الجلسات</h2>
                    <p className="text-gray-500 mt-1">متابعة الجلسات الحالية وسجل الزيارات السابق.</p>
                </div>
                <Link
                    href="/admin/sessions/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-[--primary] to-[--secondary] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>بدء جلسة جديدة</span>
                </Link>
            </header>

            {/* Tabs */}
            <div className="flex p-1 bg-white rounded-xl shadow-sm w-fit border border-gray-100">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'active' ? 'bg-[--primary] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Clock className="w-4 h-4" />
                    <span>الجلسات النشطة</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{activeSessions.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-[--primary] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <History className="w-4 h-4" />
                    <span>السجل (History)</span>
                </button>
            </div>

            {/* Content */}
            {activeTab === 'active' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {loading && activeSessions.length === 0 ? <p className="text-gray-400">جاري التحميل...</p> : activeSessions.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
                            لا توجد جلسات نشطة حالياً. اضغط على "بدء جلسة جديدة".
                        </div>
                    ) : activeSessions.map(session => (
                        <div key={session.id} className="glass p-6 rounded-3xl border-2 border-transparent hover:border-[--primary] transition-all relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-[--primary] mb-1">{session.table.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Users className="w-4 h-4" />
                                        <span>{session.session_members.map(m => m.member.full_name).join(', ')}</span>
                                    </div>
                                </div>
                                <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 animate-pulse">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    مفتوح
                                </div>
                            </div>

                            <div className="flex items-center justify-center py-6 bg-gray-50 rounded-2xl mb-6">
                                <Clock className="w-8 h-8 text-gray-400 ml-3" />
                                <SessionTimer startTime={session.start_time} />
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => { setSelectedSession(session); setPaymentStep('confirm_stop'); }} className="flex-1 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-xl font-bold transition-all">
                                    إنهاء الوقت
                                </button>
                                <button className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 py-3 rounded-xl font-bold transition-all">
                                    استعراض
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-gray-600">التاريخ</th>
                                    <th className="px-6 py-4 text-gray-600">القاعة / الطاولة</th>
                                    <th className="px-6 py-4 text-gray-600">الأعضاء</th>
                                    <th className="px-6 py-4 text-gray-600">المدة</th>
                                    <th className="px-6 py-4 text-gray-600">المبلغ</th>
                                    <th className="px-6 py-4 text-gray-600"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {historySessions.map(session => (
                                    <tr key={session.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-mono text-gray-500 text-sm">
                                            {new Date(session.start_time).toLocaleDateString('ar-EG')} <br />
                                            {new Date(session.start_time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 font-bold">{session.table.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {session.session_members.map(m => m.member.full_name).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {session.end_time && formatDistanceStrict(new Date(session.start_time), new Date(session.end_time), { locale: arEG })}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-600">{session.total_amount} ج.م</td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-400 hover:text-[--primary]">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {historySessions.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-8 text-gray-400">لا يوجد سجل جلسات سابق</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Payment Modal (Same as before) */}
            {selectedSession && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in run-in duration-200">
                        {paymentStep === 'confirm_stop' && (
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                    <Ban className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">إنهاء الجلسة؟</h3>
                                <p className="text-gray-500 mb-8">سيتم إيقاف العداد.</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setSelectedSession(null)} className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-600">تراجع</button>
                                    <button onClick={() => setPaymentStep('summary')} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white">نعم</button>
                                </div>
                            </div>
                        )}
                        {paymentStep === 'summary' && (
                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-6 text-center">ملخص الحساب</h3>
                                <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl">
                                    <div className="flex justify-between text-xl font-bold text-[--primary]">
                                        <span>الإجمالي</span>
                                        <span>{calculateTotal(selectedSession)} ج.م</span>
                                    </div>
                                </div>
                                <button onClick={() => setPaymentStep('payment')} className="w-full py-4 rounded-xl font-bold bg-[--primary] text-white">
                                    الدفع
                                </button>
                            </div>
                        )}
                        {paymentStep === 'payment' && (
                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-6 text-center">وسيلة الدفع</h3>
                                <div className="flex gap-2 mb-6">
                                    <button onClick={() => setPaymentMethod('cash')} className="flex-1 p-3 border rounded text-center font-bold hover:bg-orange-50">كاش</button>
                                    <button onClick={() => setPaymentMethod('visa')} className="flex-1 p-3 border rounded text-center font-bold hover:bg-orange-50">فيزا</button>
                                </div>
                                <button onClick={confirmPayment} className="w-full py-4 rounded-xl font-bold bg-green-600 text-white">
                                    تأكيد
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
