'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PokerTablePreviewProps {
    isHovered: boolean; // This now means "isLoaded" or "startSimulation"
}

export function PokerTablePreview({ isHovered }: PokerTablePreviewProps) {
    const [street, setStreet] = useState<'dealing' | 'flop' | 'turn' | 'river' | 'showdown' | 'clearing'>('dealing');
    const [roundCount, setRoundCount] = useState(0);

    useEffect(() => {
        if (!isHovered) return;

        // Reset to dealing immediately at start of round
        setStreet('dealing');

        const timers = [
            setTimeout(() => setStreet('flop'), 3500),
            setTimeout(() => setStreet('turn'), 5500),
            setTimeout(() => setStreet('river'), 7500),
            setTimeout(() => setStreet('showdown'), 9500),
            setTimeout(() => setStreet('clearing'), 12500),
            setTimeout(() => {
                setRoundCount(prev => prev + 1); // Trigger re-run
            }, 15000),
        ];

        return () => timers.forEach(clearTimeout);
    }, [isHovered, roundCount]);

    const players = [
        { name: "Tight Tim", icon: "🧔", cards: ["A♠", "K♠"], pos: { bottom: '0', left: '50%', transform: 'translate(-50%, 50%)' } },
        { name: "Aggro Andy", icon: "😤", cards: ["Q♣", "Q♦"], pos: { top: '50%', left: '0', transform: 'translate(-50%, -50%)' } },
        { name: "Loose Lucy", icon: "💃", cards: ["J♥", "10♥"], pos: { top: '0', left: '50%', transform: 'translate(-50%, -50%)' } },
        { name: "Wild Wes", icon: "🤠", cards: ["7♣", "7♦"], pos: { top: '50%', right: '0', transform: 'translate(50%, -50%)' } }
    ];

    const communityCards = [
        { val: "J♠", street: 'flop' },
        { val: "Q♠", street: 'flop' },
        { val: "2♦", street: 'flop' },
        { val: "10♠", street: 'turn' },
        { val: "3♠", street: 'river' }
    ];

    const shouldShow = (cardStreet: string) => {
        if (street === 'dealing') return false;
        if (street === 'flop') return cardStreet === 'flop';
        if (street === 'turn') return cardStreet === 'flop' || cardStreet === 'turn';
        if (street === 'clearing') return false;
        return true;
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden p-8 md:p-24">
            {/* The Table - Scaled to fit viewport height and width */}
            <div className={cn(
                "relative w-full max-w-[1200px] aspect-[2/1] bg-[#1a472a] rounded-[min(20vw,240px)] border-[12px] md:border-[16px] border-[#2d3436] shadow-2xl transition-all duration-1000 flex items-center justify-center",
                isHovered ? "scale-100 md:scale-105 blur-none" : "blur-[8px]"
            )} style={{ maxHeight: 'min(70vh, 600px)' }}>
                {/* Felt Texture */}
                <div className="absolute inset-0 rounded-[min(19vw,224px)] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-700/20 via-transparent to-black/40" />

                {/* Current Pot / Status info */}
                <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center z-20">
                    <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-xl">
                        <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.2em]">
                            {street === 'dealing' ? 'Dealing...' : street === 'clearing' ? 'CLEANING UP...' : street.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Pot */}
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-opacity duration-500" style={{ opacity: street === 'clearing' || street === 'dealing' ? 0 : 1 }}>
                    <div className="px-4 py-2 rounded-full bg-black/80 border border-white/10 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                        <span className="text-emerald-400 font-black text-xl md:text-2xl">$2,450</span>
                    </div>
                </div>

                {/* Community Cards */}
                <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 md:gap-4 h-24 items-center z-20">
                    {communityCards.map((card, i) => (
                        <div
                            key={`${roundCount}-comm-${i}`}
                            className={cn(
                                "w-12 h-18 md:w-16 md:h-24 bg-white rounded-lg md:rounded-xl border-2 border-zinc-200 shadow-2xl flex flex-col items-center justify-center transition-all duration-700 transform",
                                shouldShow(card.street) ? `opacity-100 translate-y-0 rotate-0 scale-100` : "opacity-0 translate-y-10 rotate-12 scale-90",
                                street === 'clearing' && "animate-exit"
                            )}
                            style={{
                                transitionDelay: shouldShow(card.street) ? `${i * 100}ms` : '0ms',
                                transform: shouldShow(card.street) && street !== 'clearing' ? `rotate(${(i - 2) * 2}deg)` : undefined,
                                animationDelay: street === 'clearing' ? `${i * 100}ms` : '0ms'
                            } as any}
                        >
                            <span className={cn(
                                "text-lg md:text-2xl font-black italic tracking-tighter",
                                card.val.includes('♠') || card.val.includes('♣') ? "text-zinc-900" : "text-red-600"
                            )}>
                                {card.val}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Players */}
                {players.map((p, i) => (
                    <div
                        key={i}
                        className="absolute w-20 h-20 md:w-28 md:h-28 bg-zinc-900 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center p-2 shadow-2xl z-20"
                        style={p.pos}
                    >
                        <span className="text-3xl md:text-4xl mb-1">{p.icon}</span>
                        <span className="text-[8px] md:text-[10px] font-black uppercase text-zinc-500 tracking-wider ">{p.name}</span>

                        {/* Player Hole Cards */}
                        {isHovered && (
                            <div className="absolute -top-12 md:-top-16 flex gap-1 z-50">
                                {p.cards.map((val, ci) => (
                                    <div
                                        key={`${roundCount}-p${i}-c${ci}`}
                                        className={cn(
                                            "w-10 h-14 md:w-12 md:h-18 bg-white rounded-lg border-2 border-zinc-200 shadow-xl flex flex-col items-center justify-center p-1 opacity-0",
                                            street !== 'clearing' ? "animate-deal" : "animate-exit"
                                        )}
                                        style={{
                                            '--deal-from-y': '-300px',
                                            '--deal-from-x': '150px',
                                            '--exit-to-y': '400px',
                                            '--exit-to-x': `${(i - 1.5) * 100}px`,
                                            animationDelay: street === 'clearing'
                                                ? `${(3 - i) * 200 + (1 - ci) * 100}ms`
                                                : `${i * 250 + ci * 150 + 400}ms`
                                        } as any}
                                    >
                                        <span className={cn(
                                            "text-xs md:text-sm font-black italic",
                                            val.includes('♠') || val.includes('♣') ? "text-zinc-900" : "text-red-600"
                                        )}>
                                            {val}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Winner Highlight */}
                        {street === 'showdown' && i === 0 && (
                            <div className="absolute inset-[-6px] md:inset-[-8px] border-4 border-yellow-400 rounded-full animate-pulse shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
