
"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Sparkles, User, Bot, Trash } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export default function SamidaAiPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'أهلاً يا كبير، أنا صميدة مساعدك الشخصي، آمرني يا باشا؟' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // Mock AI Response (In reality, connect to API here)
        setTimeout(() => {
            const responses = [
                "من عيوني يا ريس، بس كده؟",
                "الموضوع ده عايز قعدة وشاي، بس هقولك المفيد...",
                "يا باشا إحنا تحت أمرك، بص بقى...",
                "صميدة بيحل أي مشكلة، سيبها عليا!"
            ];
            const randomResp = responses[Math.floor(Math.random() * responses.length)];

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `${randomResp} (هنا هيترد عليك من الـ API بجد لما نربطه)`
            };
            setMessages(prev => [...prev, aiMsg]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="p-4 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between sticky top-0 z-10">
                <Link href="/tools" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-gray-800">صميدة AI</span>
                        <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            متصل
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-green-100 overflow-hidden">
                        {/* Placeholder for Samida Avatar */}
                        <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                            <span className="text-xl">👳🏽‍♂️</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setMessages([])} className="w-10 h-10 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors">
                    <Trash className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={clsx("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                        <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'user' ? "bg-gray-200" : "bg-blue-100"
                        )}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className={clsx(
                            "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? "bg-gradient-to-br from-[--primary] to-[--secondary] text-white rounded-tr-none"
                                : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1 items-center">
                            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></span>
                            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-75"></span>
                            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="glass p-2 rounded-2xl flex items-center gap-2 bg-gray-50/50 focus-within:bg-white focus-within:ring-2 ring-[--primary] transition-all">
                    <button className="p-2 text-gray-400 hover:text-[--primary] transition-colors">
                        <Sparkles className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="اكتب رسالتك لصميدة..."
                        className="flex-1 bg-transparent outline-none text-right px-2 py-2"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="p-3 bg-[--primary] text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                        <Send className={clsx("w-5 h-5", loading && "animate-spin")} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-2">
                    صميدة مساعد ذكي وقد يخطئ أحياناً.
                </p>
            </div>
        </div>
    );
}
