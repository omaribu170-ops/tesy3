
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { Search, Monitor, Users, Check } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function NewSessionPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [tables, setTables] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [searchMember, setSearchMember] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const { data: t } = await supabase.from('tables').select('*');
            const { data: m } = await supabase.from('members').select('*');
            if (t) setTables(t);
            if (m) setMembers(m);
        };
        fetchData();
    }, []);

    const handleStartSession = async () => {
        if (!selectedTable || selectedMembers.length === 0) return;

        // 1. Create Session
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .insert([{
                table_id: selectedTable,
                start_time: new Date().toISOString(),
                status: 'active'
            }])
            .select()
            .single();

        if (sessionError || !session) {
            alert("Error starting session");
            return;
        }

        // 2. Add Members
        const membersData = selectedMembers.map(mid => ({
            session_id: session.id,
            member_id: mid
        }));

        const { error: membersError } = await supabase
            .from('session_members')
            .insert(membersData);

        if (membersError) {
            alert("Error adding members");
        } else {
            router.push('/admin/sessions');
        }
    };

    const filteredMembers = members.filter(m =>
        m.full_name.toLowerCase().includes(searchMember.toLowerCase()) ||
        m.phone.includes(searchMember)
    );

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">بدء جلسة جديدة</h2>

            {/* Progress */}
            <div className="flex items-center mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[--primary] text-white' : 'bg-gray-200'}`}>1</div>
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-[--primary]' : 'bg-gray-200'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[--primary] text-white' : 'bg-gray-200'}`}>2</div>
            </div>

            {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <h3 className="text-xl font-bold">اختر الترابيزة</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {tables.map(table => (
                            <button
                                key={table.id}
                                onClick={() => setSelectedTable(table.id)}
                                className={`p-6 rounded-2xl border-2 transition-all text-right ${selectedTable === table.id ? 'border-[--primary] bg-orange-50' : 'border-transparent bg-white shadow-sm hover:shadow-md'}`}
                            >
                                <Monitor className={`w-8 h-8 mb-4 ${selectedTable === table.id ? 'text-[--primary]' : 'text-gray-400'}`} />
                                <h4 className="font-bold text-lg">{table.name}</h4>
                                <p className="text-gray-500 text-sm mt-1">{table.capacity_min}-{table.capacity_max} فرد</p>
                                <p className="text-[--primary] font-bold mt-2">{table.rate_per_hour} ج.م/س</p>
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end mt-8">
                        <button
                            disabled={!selectedTable}
                            onClick={() => setStep(2)}
                            className="bg-[--primary] text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            التالي
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <h3 className="text-xl font-bold">اختر الأعضاء</h3>

                    <div className="glass p-4 rounded-xl flex items-center gap-3">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ابحث عن عضو..."
                            className="bg-transparent outline-none w-full"
                            value={searchMember}
                            onChange={e => setSearchMember(e.target.value)}
                        />
                    </div>

                    <div className="h-96 overflow-y-auto space-y-2 pr-2">
                        {filteredMembers.map(member => {
                            const isSelected = selectedMembers.includes(member.id);
                            return (
                                <button
                                    key={member.id}
                                    onClick={() => {
                                        if (isSelected) setSelectedMembers(prev => prev.filter(id => id !== member.id));
                                        else setSelectedMembers(prev => [...prev, member.id]);
                                    }}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${isSelected ? 'border-[--primary] bg-orange-50' : 'border-gray-100 bg-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                            {member.full_name.charAt(0)}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{member.full_name}</p>
                                            <p className="text-xs text-gray-500">{member.phone}</p>
                                        </div>
                                    </div>
                                    {isSelected && <Check className="w-6 h-6 text-[--primary]" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setStep(1)}
                            className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold"
                        >
                            سابق
                        </button>
                        <button
                            disabled={selectedMembers.length === 0}
                            onClick={handleStartSession}
                            className="bg-gradient-to-r from-[--primary] to-[--secondary] text-white px-8 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50"
                        >
                            بدء الجلسة ({selectedMembers.length})
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
