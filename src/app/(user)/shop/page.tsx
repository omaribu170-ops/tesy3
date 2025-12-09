
"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<{ [key: string]: number }>({});
    const [activeCategory, setActiveCategory] = useState("all");

    // Fake data for initial loading if DB empty
    const initialProducts = [
        { id: '1', name: 'قهوة اسبريسو', price: 45, category: 'drinks', image: '☕' },
        { id: '2', name: 'شاي كشري', price: 20, category: 'drinks', image: '🍵' },
        { id: '3', name: 'بيتزا مارجريتا', price: 120, category: 'food', image: '🍕' },
        { id: '4', name: 'ساندوتش دجاج', price: 85, category: 'food', image: '🥪' },
        { id: '5', name: 'بيبسي', price: 25, category: 'drinks', image: '🥤' },
    ];

    useEffect(() => {
        // Ideally fetch from DB
        setProducts(initialProducts);
    }, []);

    const addToCart = (id: string) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[id] > 1) newCart[id]--;
            else delete newCart[id];
            return newCart;
        });
    };

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = Object.entries(cart).reduce((total, [id, count]) => {
        const product = products.find(p => p.id === id);
        return total + (product ? product.price * count : 0);
    }, 0);

    const categories = [
        { id: 'all', label: 'الكل' },
        { id: 'drinks', label: 'مشروبات' },
        { id: 'food', label: 'مأكولات' },
        { id: 'snacks', label: 'سناكس' },
    ];

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
            {/* Header */}
            <div className="p-6 sticky top-0 bg-white/80 backdrop-blur-xl z-20 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/home" className="w-10 h-10 rounded-full glass flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <h2 className="text-2xl font-bold">المتجر</h2>
                    </div>
                    <div className="relative">
                        <ShoppingBag className="w-6 h-6 text-gray-600" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                                {totalItems}
                            </span>
                        )}
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${activeCategory === cat.id
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'bg-white text-gray-500 border border-gray-100'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="p-6 grid grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                    <div key={product.id} className="glass p-4 rounded-3xl flex flex-col gap-3 group">
                        <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-6xl shadow-inner group-hover:scale-105 transition-transform">
                            {product.image}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">{product.name}</h3>
                            <p className="text-[--primary] font-bold text-lg">{product.price} ج.م</p>
                        </div>

                        {cart[product.id] ? (
                            <div className="flex items-center justify-between bg-gray-900 text-white rounded-xl p-1">
                                <button onClick={() => removeFromCart(product.id)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"><Minus className="w-4 h-4" /></button>
                                <span className="font-bold w-6 text-center">{cart[product.id]}</span>
                                <button onClick={() => addToCart(product.id)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                            </div>
                        ) : (
                            <button
                                onClick={() => addToCart(product.id)}
                                className="w-full py-2 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-[--primary] hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                أضف
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Checkout Floating Bar */}
            {totalItems > 0 && (
                <div className="fixed bottom-24 left-6 right-6 z-30 animate-in slide-in-from-bottom duration-300">
                    <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-bold">
                                {totalItems}
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">الإجمالي</p>
                                <p className="font-bold text-xl">{totalPrice} ج.م</p>
                            </div>
                        </div>
                        <button className="bg-[--primary] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">
                            إتمام الطلب
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
