
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Save, Search } from "lucide-react";
import Link from "next/link";

type Note = {
    id: string;
    title: string;
    content: string;
    date: string;
};

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [view, setView] = useState<'list' | 'editor'>('list');

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('hub_notes');
        if (saved) setNotes(JSON.parse(saved));
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('hub_notes', JSON.stringify(notes));
    }, [notes]);

    const createNote = () => {
        const newNote = {
            id: Date.now().toString(),
            title: "",
            content: "",
            date: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
        setActiveNote(newNote);
        setView('editor');
    };

    const updateNote = (field: 'title' | 'content', value: string) => {
        if (!activeNote) return;
        const updated = { ...activeNote, [field]: value, date: new Date().toISOString() };
        setActiveNote(updated);
        setNotes(notes.map(n => n.id === updated.id ? updated : n));
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
        if (activeNote?.id === id) {
            setActiveNote(null);
            setView('list');
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F2F7] flex flex-col">

            {view === 'list' && (
                <>
                    <div className="p-6 pb-2">
                        <div className="flex items-center justify-between mb-6">
                            <Link href="/tools" className="flex items-center gap-1 text-[--primary]">
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-bold">رجوع</span>
                            </Link>
                            <h2 className="text-3xl font-bold">الملاحظات</h2>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                            <input type="text" placeholder="بحث" className="w-full bg-[#E3E3E8] rounded-xl py-2 pr-10 pl-4 text-center focus:text-right outline-none placeholder:text-gray-500" />
                        </div>
                    </div>

                    <div className="flex-1 px-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100">
                            {notes.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">لا توجد ملاحظات بعد</div>
                            ) : notes.map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => { setActiveNote(note); setView('editor'); }}
                                    className="p-4 hover:bg-gray-50 cursor-pointer"
                                >
                                    <h3 className="font-bold text-gray-900 mb-1">{note.title || 'بدون عنوان'}</h3>
                                    <div className="flex gap-2 text-sm text-gray-500">
                                        <span>{new Date(note.date).toLocaleDateString('ar-EG')}</span>
                                        <span>{note.content.substring(0, 30)}...</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 flex justify-between items-center text-[--primary] bg-[#F2F2F7] border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-500">{notes.length} ملاحظة</span>
                        <button onClick={createNote}>
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </>
            )}

            {view === 'editor' && activeNote && (
                <div className="flex-1 flex flex-col h-screen bg-white">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <button onClick={() => setView('list')} className="flex items-center gap-1 text-[--primary] font-bold">
                            <ArrowLeft className="w-5 h-5" />
                            الملاحظات
                        </button>
                        <div className="flex gap-4">
                            <button onClick={() => deleteNote(activeNote.id)} className="text-red-500">
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => setView('list')} className="text-[--primary]">
                                تم
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col">
                        <input
                            type="text"
                            placeholder="العنوان"
                            className="text-3xl font-bold mb-4 outline-none placeholder:text-gray-300"
                            value={activeNote.title}
                            onChange={e => updateNote('title', e.target.value)}
                        />
                        <div className="text-xs text-gray-400 mb-6 text-center">
                            {new Date(activeNote.date).toLocaleString('ar-EG')}
                        </div>
                        <textarea
                            className="flex-1 w-full resize-none outline-none text-lg leading-relaxed placeholder:text-gray-300"
                            placeholder="ابدأ الكتابة هنا..."
                            value={activeNote.content}
                            onChange={e => updateNote('content', e.target.value)}
                        ></textarea>
                    </div>
                </div>
            )}

        </div>
    );
}
