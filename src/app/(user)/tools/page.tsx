
"use client";

import Link from "next/link";
import { Clock, Zap, Sticker, ArrowLeft } from "lucide-react";

export default function ToolsPage() {
    const tools = [
        {
            name: "Pomodoro Timer",
            desc: "ركز في شغلك وقسم وقتك صح",
            icon: Clock,
            href: "/tools/timer",
            color: "text-red-500",
            bg: "bg-red-50"
        },
        {
            name: "صميدة AI",
            desc: "مساعدك الشخصي الصعيدي الذكي",
            icon: Zap,
            href: "/tools/ai",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            name: "ملاحظات",
            desc: "سجل أفكارك وملاحظاتك بسرعة",
            icon: Sticker,
            href: "/tools/notes",
            color: "text-yellow-500",
            bg: "bg-yellow-50"
        }
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/home" className="w-10 h-10 rounded-full glass flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h2 className="text-2xl font-bold">الأدوات الذكية</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {tools.map((tool, i) => {
                    const Icon = tool.icon;
                    return (
                        <Link key={i} href={tool.href} className="glass p-6 rounded-3xl flex items-center gap-6 hover:scale-[1.02] transition-transform group">
                            <div className={`w-16 h-16 rounded-2xl ${tool.bg} ${tool.color} flex items-center justify-center shadow-inner`}>
                                <Icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-[--primary] transition-colors">{tool.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">{tool.desc}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
