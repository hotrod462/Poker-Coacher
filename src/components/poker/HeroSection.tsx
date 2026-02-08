"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";
import { PokerTablePreview } from "./PokerTablePreview";
import { SignUpForm } from "../sign-up-form";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function HeroSection() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);

        const supabase = createClient();
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        return () => clearTimeout(timer);
    }, []);

    const handleCtaClick = () => {
        if (user) {
            router.push("/game");
        } else {
            setShowSignup(true);
        }
    };

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
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl w-full">

                {/* Headline Block with Localized Blur */}
                <div className="relative px-8 py-10 md:px-16 md:py-14 mb-8">
                    {/* YT-Style Subtitle Blur Effect */}
                    <div className="absolute inset-0 -z-10 bg-black/40 dark:bg-black/60 backdrop-blur-3xl rounded-[3rem] border border-white/10" />

                    <h1 className="text-4xl sm:text-6xl md:text-[5.5rem] font-black tracking-tighter leading-[1] uppercase italic animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        <span className="text-white">Your Personal</span><br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-emerald-400 to-teal-400 whitespace-nowrap">AI Poker Teacher.</span>
                    </h1>

                    <p className="mt-8 text-lg md:text-xl text-zinc-100 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Master the table without the stakes. Get real-time wisdom and deep strategy analysis from <span className="text-white font-bold italic underline decoration-indigo-500/50 underline-offset-4">Nick the Groq.</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                    <button
                        onClick={handleCtaClick}
                        id="cta-start-playing"
                        className="group px-10 py-5 bg-white text-black text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 uppercase tracking-tight"
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
