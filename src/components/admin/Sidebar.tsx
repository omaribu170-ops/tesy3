
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Armchair,
    Clock,
    Gamepad2,
    Wallet,
    ClipboardList,
    Settings,
    LogOut
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
    { name: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
    { name: "الترابيزات", href: "/admin/tables", icon: Armchair },
    { name: "الاعضاء", href: "/admin/members", icon: Users },
    { name: "الجلسات", href: "/admin/sessions", icon: Clock },
    { name: "المخزن والطلبات", href: "/admin/inventory", icon: ClipboardList },
    { name: "الترفيه", href: "/admin/entertainment", icon: Gamepad2 },
    { name: "الحسابات", href: "/admin/finance", icon: Wallet },
    { name: "الاعدادات", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-white/80 backdrop-blur-md border-l border-white/20 fixed right-0 top-0 z-50 shadow-lg flex flex-col transition-all duration-300">
            <div className="p-6 border-b border-gray-100/50 flex items-center justify-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[--primary] to-[--secondary] bg-clip-text text-transparent">
                    The Hub
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-gradient-to-r from-[--primary] to-[--secondary] text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-[--primary]"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-[--primary]")} strokeWidth={2} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100/50">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
}
