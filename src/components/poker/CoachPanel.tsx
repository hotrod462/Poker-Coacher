'use client';

/**
 * AI Coach Panel - Provides real-time poker coaching via Groq
 */

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { useGame } from '@/contexts/GameContext';
import {
    GraduationCap,
    Bot,
    MessageSquare,
    History,
    Trophy,
    Info,
    ChevronDown,
    Settings2,
    SendHorizontal,
    Sparkles,
    HandIcon,
    Zap,
    BrainCircuit,
    Layers
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PlayingCard } from './PlayingCard';

const HAND_RANKINGS = [
    { rank: "Royal Flush", cards: "A-K-Q-J-10 (Same Suit)", desc: "The ultimate unbeatable hand.", exampleCards: ["As", "Ks", "Qs", "Js", "Ts"] },
    { rank: "Straight Flush", cards: "5-6-7-8-9 (Same Suit)", desc: "Five consecutive cards of the same suit.", exampleCards: ["9h", "8h", "7h", "6h", "5h"] },
    { rank: "Four of a Kind", cards: "Four Cards of Same Rank", desc: "Four of the same rank + a kicker.", exampleCards: ["Ad", "Ah", "As", "Ac", "Kh"] },
    { rank: "Full House", cards: "Three of a Kind + Pair", desc: "A triple and a duo combined.", exampleCards: ["Kc", "Kh", "Ks", "Td", "Th"] },
    { rank: "Flush", cards: "Five Cards (Same Suit)", desc: "Five cards of any rank, all same suit.", exampleCards: ["Ah", "Th", "7h", "4h", "2h"] },
    { rank: "Straight", cards: "Five Consecutive Cards", desc: "Sequence of five cards of mixed suits.", exampleCards: ["8s", "7d", "6h", "5c", "4s"] },
    { rank: "Three of a Kind", cards: "Three Cards of Same Rank", desc: "Three matching ranks + two kickers.", exampleCards: ["Qd", "Qh", "Qs", "9d", "2c"] },
    { rank: "Two Pair", cards: "Two Different Pairs", desc: "Two pairs of ranks + one kicker.", exampleCards: ["Jc", "Jh", "8s", "8d", "4h"] },
    { rank: "One Pair", cards: "Two Cards of Same Rank", desc: "Two matched ranks + three kickers.", exampleCards: ["Tc", "Th", "Ad", "Qd", "3h"] },
    { rank: "High Card", cards: "Highest Rank Wins", desc: "When you have none of the above.", exampleCards: ["As", "Kd", "8h", "5s", "2c"] },
];

export function CoachPanel() {
    const { gameState, userPlayer, isUsersTurn } = useGame();
    const [userQuestion, setUserQuestion] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [autoAnalyze, setAutoAnalyze] = useState(true);
    const lastAnalyzedRef = useRef<string>('');

    const { messages, sendMessage, status, setMessages } = (useChat as any)({
        api: '/api/chat',
        body: {
            gameState,
            userPlayer,
        },
    });

    const isLoading = status === 'streaming';

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-analyze when it's user's turn
    useEffect(() => {
        if (!autoAnalyze) return;

        // Create a key for this game state
        const stateKey = `${gameState.handNumber}-${gameState.street}-${isUsersTurn}-${gameState.communityCards.length}`;

        // Don't re-analyze the same state
        if (stateKey === lastAnalyzedRef.current) return;

        // Trigger analysis ONLY when it's user's turn and the game is active
        const shouldAnalyze = isUsersTurn && gameState.handNumber > 0;

        // Ensure player HAS cards before analyzing
        const hasHoleCards = userPlayer && userPlayer.holeCards && userPlayer.holeCards.length > 0;

        if (shouldAnalyze && !isLoading && hasHoleCards) {
            lastAnalyzedRef.current = stateKey;

            // Clear previous messages and start new analysis
            setMessages([]);
            sendMessage({
                text: 'Analyze the current situation',
            }, {
                body: { gameState, userPlayer },
            });
        }
    }, [gameState, isUsersTurn, autoAnalyze, userPlayer, isLoading, sendMessage, setMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userQuestion.trim() || isLoading) return;

        sendMessage({
            text: userQuestion,
        }, {
            body: { gameState, userPlayer, question: userQuestion },
        });
        setUserQuestion('');
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0f] border-l border-white/5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-[#12121a] to-[#0a0a0f] shadow-2xl z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full animate-pulse" />
                        <div className="relative p-2.5 bg-indigo-500/10 rounded-xl ring-1 ring-indigo-500/30 shadow-inner">
                            <BrainCircuit className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white tracking-tight uppercase">Coacher Poke</h2>
                        <div className="flex items-center gap-1.5">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                            )} />
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setAutoAnalyze(!autoAnalyze)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs font-black rounded-lg transition-all duration-300 ring-1 uppercase tracking-tighter",
                        autoAnalyze
                            ? "bg-indigo-600/10 text-indigo-400 ring-indigo-500/30 hover:bg-indigo-600/20"
                            : "bg-zinc-800 text-zinc-500 ring-zinc-700 hover:bg-zinc-700"
                    )}
                >
                    <Zap className={cn("w-3.5 h-3.5", autoAnalyze ? "fill-indigo-400" : "fill-none")} />
                    {autoAnalyze ? 'AUTO' : 'MANUAL'}
                </button>
            </div>

            {/* Scrollable Content Area */}
            <ScrollArea className="flex-1 min-h-0">
                <div className="flex flex-col min-h-full">
                    {/* Hand Rankings - Collapsed Tab */}
                    <div className="px-4 py-1 border-b border-white/5 bg-[#0f0f17]">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="hand-rankings" className="border-none">
                                <AccordionTrigger className="py-3 hover:no-underline group">
                                    <div className="flex items-center gap-2.5 text-zinc-500 group-data-[state=open]:text-indigo-400 transition-all duration-300">
                                        <Layers className="w-4 h-4" />
                                        <span className="text-sm font-black uppercase tracking-[0.1em]">Hand Hierarchies</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4">
                                    <div className="grid grid-cols-1 gap-3 mt-1">
                                        {HAND_RANKINGS.map((hand, idx) => (
                                            <div key={hand.rank} className="group/item relative overflow-hidden p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all duration-300 cursor-default">
                                                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <Trophy className="w-4 h-4 text-indigo-500/30" />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-base font-bold text-zinc-300 group-hover/item:text-white transition-colors">{idx + 1}. {hand.rank}</span>
                                                        <span className="text-xs text-indigo-400 font-mono font-bold tracking-tight px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/10">{hand.cards}</span>
                                                    </div>

                                                    {/* Visual Example Cards */}
                                                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                                        {hand.exampleCards.map((c, i) => (
                                                            <PlayingCard
                                                                key={i}
                                                                card={c}
                                                                size="sm"
                                                                animationDelay="0s"
                                                                className="transform scale-90 -ml-1 first:ml-0 hover:scale-100 transition-transform origin-left"
                                                            />
                                                        ))}
                                                    </div>

                                                    <p className="text-sm text-zinc-500 group-hover/item:text-zinc-400 leading-normal transition-colors">{hand.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Messages Area */}
                    <div className="p-4 py-6 space-y-6 flex-1">
                        {messages.length === 0 && gameState.handNumber === 0 && (
                            <div className="flex flex-col items-center text-center px-4 py-16">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
                                    <div className="relative p-6 bg-[#1a1a2e] rounded-[2rem] ring-1 ring-white/10 shadow-2xl">
                                        <Sparkles className="w-16 h-16 text-indigo-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">READY FOR ACTION</h3>
                                <p className="text-base text-zinc-500 leading-relaxed max-w-[300px] font-medium">
                                    Start a <span className="text-indigo-400 font-bold italic">New Hand</span>.
                                    I will provide real-time strategic insights for every move.
                                </p>
                            </div>
                        )}

                        {messages.length === 0 && gameState.handNumber > 0 && !isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <Info className="w-8 h-8 mb-4 text-zinc-500" />
                                <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Awaiting Stimulus...</p>
                            </div>
                        )}

                        {messages.map((message: any) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "group flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                    message.role === 'user' ? "items-end" : "items-start"
                                )}
                            >
                                <div className="flex items-center gap-3 px-1.5">
                                    {message.role === 'assistant' ? (
                                        <div className="p-1 px-1.5 bg-indigo-500/10 rounded-md border border-indigo-500/30">
                                            <Bot className="w-4 h-4 text-indigo-400" />
                                        </div>
                                    ) : (
                                        <div className="p-1 px-1.5 bg-zinc-800 rounded-md border border-white/5">
                                            <MessageSquare className="w-4 h-4 text-zinc-500" />
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={cn(
                                        "relative max-w-[95%] p-5 rounded-2xl text-base leading-relaxed shadow-2xl transition-all duration-300",
                                        message.role === 'user'
                                            ? "bg-indigo-600 text-white rounded-tr-none border border-white/10"
                                            : "bg-[#11111a] text-zinc-300 rounded-tl-none border border-white/[0.03]"
                                    )}
                                >
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap font-medium">
                                            {(message.parts || []).map((part: any, i: number) => {
                                                if (part.type === 'text') return <span key={i}>{part.text}</span>;
                                                if (part.type === 'reasoning') return (
                                                    <div key={i} className="mb-4 p-4 bg-black/40 rounded-xl border-l-[4px] border-indigo-500/40 text-zinc-500 italic text-sm leading-relaxed shadow-inner">
                                                        <div className="flex items-center gap-1.5 mb-2 opacity-60">
                                                            <BrainCircuit className="w-4 h-4" />
                                                            <span className="text-[11px] font-black uppercase tracking-widest not-italic">Neural Process</span>
                                                        </div>
                                                        {part.reasoning || part.text}
                                                    </div>
                                                );
                                                return <span key={i}>{part.text || ''}</span>;
                                            })}
                                            {!message.parts && message.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex flex-col gap-2 animate-pulse">
                                <div className="flex items-center gap-2 mb-1 px-1">
                                    <div className="p-1 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                                        <Bot className="w-3 h-3 text-indigo-400" />
                                    </div>
                                </div>
                                <div className="bg-[#161621] border border-white/5 p-4 rounded-2xl rounded-tl-none w-2/3">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-indigo-500/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-indigo-500/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-indigo-500/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </ScrollArea>

            {/* Question input */}
            <div className="p-4 bg-gradient-to-t from-black via-[#0a0a0f] to-transparent border-t border-white/5 mt-auto">
                <form onSubmit={handleSubmit} className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-colors rounded-2xl" />
                    <input
                        type="text"
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        placeholder="Inquire about strategy or odds..."
                        className="relative w-full pl-6 pr-16 py-5 bg-zinc-900 border border-white/5 rounded-2xl text-white text-base placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-zinc-800 transition-all duration-300 shadow-2xl"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userQuestion.trim()}
                        className={cn(
                            "absolute right-3 top-3 p-2.5 rounded-xl transition-all duration-300",
                            userQuestion.trim() && !isLoading
                                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:scale-105 active:scale-95"
                                : "text-zinc-700 cursor-not-allowed"
                        )}
                    >
                        <SendHorizontal className="w-6 h-6" />
                    </button>
                </form>
                <div className="mt-5 flex items-center justify-between px-3 text-xs text-zinc-600 font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-white/[0.03] rounded-md border border-white/[0.05]">
                        <HandIcon className="w-4 h-4 text-indigo-500/50" />
                        <span>Odds</span>
                    </div>
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-white/[0.03] rounded-md border border-white/[0.05]">
                        <History className="w-4 h-4 text-indigo-500/50" />
                        <span>Ranges</span>
                    </div>
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-white/[0.03] rounded-md border border-white/[0.05]">
                        <Settings2 className="w-4 h-4 text-indigo-500/50" />
                        <span>Theory</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
