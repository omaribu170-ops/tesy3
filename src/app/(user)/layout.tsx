
import BottomNav from "@/components/user/BottomNav";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
            <main className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative">
                {/* Top Decoration */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
