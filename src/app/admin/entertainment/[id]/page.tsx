
"use client";

import { useState, useEffect, use } from "react";
import { Plus, Trophy, Users, CheckCircle, Clock, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function GameNightDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using use() for Next.js 15+ compatibility
    const { id } = use(params);

    const [gameNight, setGameNight] = useState<any>(null);
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTournamentModal, setShowTournamentModal] = useState(false);

    // Tournament Form Data
    const [tData, setTData] = useState<{ name: string, prizes: any }>({ name: "", prizes: { first: "", second: "", third: "" } });

    const fetchData = async () => {
        setLoading(true);
        // Fetch Event Details
        const { data: gn } = await supabase.from('game_nights').select('*').eq('id', id).single();
        if (gn) setGameNight(gn);

        // Fetch Tournaments
        const { data: t } = await supabase.from('tournaments').select('*').eq('game_night_id', id);
        if (t) setTournaments(t);

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const addTournament = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tData.name) return;

        const { error } = await supabase.from('tournaments').insert([{
            game_night_id: id,
            game_name: tData.name,
            prizes_structure: tData.prizes
        }]);

        if (!error) {
            setShowTournamentModal(false);
            setTData({ name: "", prizes: { first: "", second: "", third: "" } });
            fetchData();
        }
    };

    // Mock function to finish event (would involve selecting winners)
    const finishEvent = async () => {
        if (!confirm("هل أنت متأكد من إنهاء الحدث وتوزيع الجوائز؟")) return;
        const { error } = await supabase.from('game_nights').update({ status: 'completed' }).eq('id', id);
        if (!error) fetchData();
    };

    if (!gameNight) return <div className="p-10 text-center">جاري التحميل...</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${gameNight.status === 'scheduled' ? 'bg-orange-100 text-[--primary]' : 'bg-green-100 text-green-700'}`}>
                            {gameNight.status === 'scheduled' ? 'مجدول' : 'منتهي'}
                        </span>
                        <span className="text-gray-400 text-sm">{new Date(gameNight.date).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-l from-gray-900 to-gray-600 bg-clip-text text-transparent">{gameNight.name}</h2>
                </div>

                <div className="flex gap-3">
                    {gameNight.status !== 'completed' && (
                        <>
                            <button
                                onClick={() => setShowTournamentModal(true)}
                                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                <span>بطولة جديدة</span>
                            </button>
                            <button
                                onClick={finishEvent}
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
                            >
                                <CheckCircle className="w-5 h-5" />
                                <span>إنهاء الحدث</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Tournaments List */}
            <div className="grid grid-cols-1 gap-6">
                {tournaments.length === 0 ? (
                    <div className="glass p-12 rounded-3xl text-center text-gray-400 border border-dashed border-gray-300">
                        لا توجد بطولات مضافة في هذا الحدث بعد.
                    </div>
                ) : tournaments.map(t => (
                    <div key={t.id} className="glass p-6 rounded-3xl flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-[--primary] mb-4">{t.game_name}</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl">
                                    <p className="text-xs text-yellow-600 font-bold mb-1">المركز الأول</p>
                                    <p className="font-bold">{t.prizes_structure?.first || '0'} ج.م</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                                    <p className="text-xs text-gray-500 font-bold mb-1">المركز الثاني</p>
                                    <p className="font-bold">{t.prizes_structure?.second || '0'} ج.م</p>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl">
                                    <p className="text-xs text-orange-600 font-bold mb-1">المركز الثالث</p>
                                    <p className="font-bold">{t.prizes_structure?.third || '0'} ج.م</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 justify-center border-r border-gray-100 pr-6">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-[--primary] font-medium">
                                <Users className="w-5 h-5" />
                                <span>المشاركين (0)</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-[--primary] font-medium">
                                <Trophy className="w-5 h-5" />
                                <span>تحديد الفائزين</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Tournament Modal */}
            {showTournamentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-2xl font-bold">إضافة بطولة جديدة</h3>
                        </div>
                        <form onSubmit={addTournament} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم اللعبة</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[--primary]"
                                    value={tData.name}
                                    onChange={e => setTData({ ...tData, name: e.target.value })}
                                    placeholder="مثال: FIFA 24"
                                />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <p className="font-bold text-sm text-gray-500">الجوائز المالية</p>
                                <div className="flex gap-2 items-center">
                                    <span className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold">1</span>
                                    <input
                                        type="number"
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200"
                                        placeholder="جائزة المركز الأول"
                                        value={tData.prizes.first}
                                        onChange={e => setTData({ ...tData, prizes: { ...tData.prizes, first: e.target.value } })}
                                    />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold">2</span>
                                    <input
                                        type="number"
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200"
                                        placeholder="جائزة المركز الثاني"
                                        value={tData.prizes.second}
                                        onChange={e => setTData({ ...tData, prizes: { ...tData.prizes, second: e.target.value } })}
                                    />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold">3</span>
                                    <input
                                        type="number"
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200"
                                        placeholder="جائزة المركز الثالث"
                                        value={tData.prizes.third}
                                        onChange={e => setTData({ ...tData, prizes: { ...tData.prizes, third: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowTournamentModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-600"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-[--primary] to-[--secondary] text-white hover:shadow-lg"
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
