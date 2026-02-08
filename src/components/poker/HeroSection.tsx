"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import { PokerTablePreview } from "./PokerTablePreview";
import { SignUpForm } from "../sign-up-form";

export function HeroSection() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
            {/* Interactive Background Table */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <PokerTablePreview isHovered={isLoaded} />

                {/* General Viewport Overlays */}
                <div className="absolute inset-0 bg-white/5 dark:bg-black/20 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-white dark:from-black/70 dark:via-transparent dark:to-[#050508]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-white dark:to-[#050508] opacity-80" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-7xl w-full">

                {/* Headline Block with Localized Blur */}
                <div className="relative group">
                    {/* Precision Blur Filter behind text */}
                    <div className="absolute -inset-x-12 -inset-y-6 -z-10 bg-white/5 dark:bg-black/10 backdrop-blur-[32px] rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="absolute -inset-x-8 -inset-y-4 -z-10 bg-white/20 dark:bg-black/30 backdrop-blur-xl rounded-[2rem] opacity-100" />

                    <h1 className="text-5xl sm:text-7xl md:text-[6.5rem] font-black tracking-tighter leading-[0.85] mb-8 uppercase italic animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Your Personal<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-emerald-500 to-teal-500 whitespace-nowrap">AI Poker Teacher.</span>
                    </h1>
                </div>

                {/* Paragraph Block with Localized Blur */}
                <div className="relative mt-4 mb-12 group">
                    <div className="absolute -inset-x-10 -inset-y-4 -z-10 bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl opacity-100" />

                    <p className="text-lg md:text-2xl text-zinc-900 dark:text-zinc-300 max-w-3xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 px-4">
                        Master the table without the stakes. Get real-time wisdom and deep strategy analysis from <span className="text-zinc-900 dark:text-white font-bold italic underline decoration-indigo-500/50 underline-offset-4">Nick the Groq.</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                    <button
                        onClick={() => setShowSignup(true)}
                        id="cta-start-playing"
                        className="group px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black text-lg font-black rounded-2xl shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-2xl dark:hover:shadow-[0_0_60px_rgba(99,102,241,0.3)] transition-all transform hover:scale-105 flex items-center gap-3 uppercase tracking-tight"
                    >
                        Play your first hand
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Simple Signup Modal Overlay */}
            {showSignup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowSignup(false)}
                    />
                    <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowSignup(false)}
                            className="absolute -top-12 right-0 text-white hover:text-indigo-400 transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <SignUpForm className="shadow-2xl" />
                    </div>
                </div>
            )}
        </section>
    );
}
