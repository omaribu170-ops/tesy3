
"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Plus, AlertCircle, TrendingDown, CheckSquare, Search } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [cleaningLogs, setCleaningLogs] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Tab State
    const [activeTab, setActiveTab] = useState<'inventory' | 'cleaning' | 'requests'>('inventory');

    const fetchData = async () => {
        setLoading(true);
        // Fetch Products (Inventory)
        const { data: prods } = await supabase.from('products').select('*');
        if (prods) setItems(prods);

        // Fetch Cleaning Logs (Today)
        const today = new Date().toISOString().split('T')[0];
        const { data: logs } = await supabase
            .from('cleaning_logs')
            .select('*')
            .gte('created_at', today)
            .order('created_at', { ascending: false });
        if (logs) setCleaningLogs(logs);

        // Fetch Requests (Expenses with is_request=true) - simplified for now
        const { data: reqs } = await supabase
            .from('expenses')
            .select('*')
            .eq('is_request', true)
            .order('created_at', { ascending: false });
        if (reqs) setRequests(reqs);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-l from-gray-900 to-gray-600 bg-clip-text text-transparent">المخزن والعمليات</h2>
                    <p className="text-gray-500 mt-1">إدارة المنتجات، قوائم النظافة، وطلبات النواقص.</p>
                </div>
                <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-100 w-fit">
                    <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'inventory' ? 'bg-[--primary] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>المخزن</button>
                    <button onClick={() => setActiveTab('cleaning')} className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'cleaning' ? 'bg-[--primary] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>النظافة</button>
                    <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'requests' ? 'bg-[--primary] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>الطلبات</button>
                </div>
            </header>

            {activeTab === 'inventory' && (
                <div className="glass rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    {/* Simplified Inventory Table */}
                    <div className="p-4 border-b border-gray-100 flex justify-between">
                        <h3 className="font-bold flex items-center gap-2"><ClipboardList className="w-5 h-5 text-[--primary]" /> المنتجات الحالية</h3>
                        <button className="text-sm font-bold text-[--primary] flex items-center gap-1"><Plus className="w-4 h-4" /> منتج جديد</button>
                    </div>
                    <table className="w-full text-right">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4">المنتج</th>
                                <th className="px-6 py-4">القسم</th>
                                <th className="px-6 py-4">السعر</th>
                                <th className="px-6 py-4">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-bold">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.category}</td>
                                    <td className="px-6 py-4 font-mono">{item.price} ج.م</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.is_available ? 'متوفر' : 'غير متوفر'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-400">لا توجد منتجات</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'cleaning' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass p-6 rounded-3xl border-l-4 border-[--primary]">
                            <h3 className="text-xl font-bold mb-4">قائمة التحقق الحالية</h3>
                            <div className="space-y-3">
                                {['تنظيف الحمامات', 'ترتيب القاعة الرئيسية', 'مسح الطاولات', 'إفراغ السلات'].map((task, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer">
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:bg-green-500"></div>
                                        <span className="font-medium text-gray-700">{task}</span>
                                        <span className="mr-auto text-xs text-gray-400 bg-white px-2 py-1 rounded">كل 30 دقيقة</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 bg-[--primary] text-white rounded-xl font-bold">تسجيل إتمام المهام</button>
                        </div>

                        <div className="glass p-6 rounded-3xl">
                            <h3 className="text-xl font-bold mb-4">سجل اليوم</h3>
                            <div className="space-y-4 max-h-80 overflow-y-auto">
                                {cleaningLogs.map(log => (
                                    <div key={log.id} className="flex items-center gap-3 border-b border-gray-100 pb-2">
                                        <CheckSquare className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="font-bold text-sm">{log.area}</p>
                                            <p className="text-xs text-gray-400">{new Date(log.checked_at).toLocaleTimeString('ar-EG')}</p>
                                        </div>
                                        <span className="mr-auto text-xs px-2 py-1 bg-green-50 text-green-700 rounded font-bold">تم</span>
                                    </div>
                                ))}
                                {cleaningLogs.length === 0 && <p className="text-gray-400 text-center py-4">لم يتم تسجيل أي نشاط اليوم</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="glass rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">طلبات النواقص والصيانة</h3>
                        <button className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm">أضف طلب جديد</button>
                    </div>

                    <div className="space-y-4">
                        {requests.length === 0 ? (
                            <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-100 rounded-xl">لا توجد طلبات معلقة</div>
                        ) : requests.map(req => (
                            <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-100 text-red-500 rounded-lg">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{req.title}</p>
                                        <p className="text-sm text-gray-500">{req.description}</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg">{req.amount} ج.م</p>
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">قيد المراجعة</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
