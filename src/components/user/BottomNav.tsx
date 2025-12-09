
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, PlusCircle, ShoppingBag, User } from "lucide-react";
import clsx from "clsx";

const navItems = [
    { name: "الرئيسية", href: "/home", icon: Home },
    { name: "الأدوات", href: "/tools", icon: Grid },
    { name: "احجز", href: "/reserve", icon: PlusCircle, isMain: true },
    { name: "المتجر", href: "/shop", icon: ShoppingBag },
    { name: "حسابي", href: "/profile", icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    // Don't show on login page
    if (pathname === '/login') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
            <nav className="glass mx-auto max-w-md w-full rounded-2xl flex items-center justify-between px-2 py-3 pointer-events-auto bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-2xl">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    if (item.isMain) {
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="relative -top-8 bg-gradient-to-r from-[--primary] to-[--secondary] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
                            >
                                <Icon className="w-8 h-8" strokeWidth={2.5} />
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                                isActive ? "text-[--primary]" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <Icon className={clsx("w-6 h-6", isActive && "fill-current/20")} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
