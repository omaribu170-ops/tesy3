
"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function PomodoroPage() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound here
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus') setTimeLeft(25 * 60);
        if (mode === 'short') setTimeLeft(5 * 60);
        if (mode === 'long') setTimeLeft(15 * 60);
    };

    const changeMode = (newMode: 'focus' | 'short' | 'long') => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'focus') setTimeLeft(25 * 60);
        if (newMode === 'short') setTimeLeft(5 * 60);
        if (newMode === 'long') setTimeLeft(15 * 60);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = ((mode === 'focus' ? 1500 : mode === 'short' ? 300 : 900) - timeLeft) / (mode === 'focus' ? 1500 : mode === 'short' ? 300 : 900) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col p-6 items-center">
            <div className="w-full flex items-center justify-between mb-8">
                <Link href="/tools" className="w-10 h-10 rounded-full glass flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h2 className="text-xl font-bold">Pomodoro Focus</h2>
                <div className="w-10" />
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-gray-200 p-1 rounded-2xl mb-12 w-full max-w-xs">
                <button
                    onClick={() => changeMode('focus')}
                    className={clsx("flex-1 py-3 text-sm font-bold rounded-xl transition-all", mode === 'focus' ? "bg-white text-[--primary] shadow-sm" : "text-gray-500")}
                >
                    Focus
                </button>
                <button
                    onClick={() => changeMode('short')}
                    className={clsx("flex-1 py-3 text-sm font-bold rounded-xl transition-all", mode === 'short' ? "bg-white text-[--primary] shadow-sm" : "text-gray-500")}
                >
                    Short Break
                </button>
                <button
                    onClick={() => changeMode('long')}
                    className={clsx("flex-1 py-3 text-sm font-bold rounded-xl transition-all", mode === 'long' ? "bg-white text-[--primary] shadow-sm" : "text-gray-500")}
                >
                    Long Break
                </button>
            </div>

            {/* Timer Circle */}
            <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="144"
                        cy="144"
                        r="130"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    <circle
                        cx="144"
                        cy="144"
                        r="130"
                        stroke="var(--primary)"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 130}
                        strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-bold font-mono text-gray-800">{formatTime(timeLeft)}</span>
                    <span className="text-gray-400 mt-2 font-medium">
                        {isActive ? 'جاري التركيز...' : 'جاهز للبدء'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleTimer}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-[--primary] to-[--secondary] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-14 h-14 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
}
