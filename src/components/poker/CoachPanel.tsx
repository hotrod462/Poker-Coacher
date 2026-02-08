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
    Layers,
    BookOpen
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

const POKER_TERMS = [
    { term: "The Hand", definition: "A single round of poker. Players use their private cards and the shared community cards to form the best 5-card hand. The player with the strongest hand at the end wins the pot." },
    { term: "Hole Cards", definition: "The two private cards dealt face-down to you. Only you can see and use these to form your hand." },
    { term: "Community Cards", definition: "The five cards dealt face-up in the middle of the table. Everyone uses these shared cards to make their best hand." },
    { term: "Fold", definition: "Giving up your cards and any chips you've already put in the pot. Sometimes it's the smartest move." },
    { term: "Check", definition: "Passing the action to the next player without betting anything. You can only do this if no one else has bet." },
    { term: "Call", definition: "Matching the current bet or raise to stay in the hand." },
    { term: "Raise", definition: "Increasing the current bet size, forcing others to pay more or fold." },
    { term: "All-In", definition: "Pushing all your remaining chips into the pot. It's time to pray." },
    { term: "Pre-Flop", definition: "Everything that happens before the first three community cards (the Flop) are dealt." },
    { term: "Flop", definition: "The first three community cards dealt simultaneously." },
    { term: "Turn", definition: "The fourth community card dealt. Also known as 'Fourth Street'." },
    { term: "River", definition: "The fifth and final community card dealt face-up on the board." },
    { term: "Blinds", definition: "Forced bets (Small and Big) made by the two players to the left of the dealer before cards are seen." },
    { term: "Button", definition: "The dealer position. This is the best seat because you act last in most betting rounds." },
    { term: "Pot Odds", definition: "The relationship between the size of the pot and the size of the bet you need to call." },
    { term: "The Nuts", definition: "The best possible hand you can have at a specific moment. If you've got 'em, you can't lose." },
    { term: "Kicker", definition: "A card that doesn't make a pair or better but helps determine the winner in a tie." },
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

        // Trigger analysis ONLY when it's user's turn and the game is active, and NOT dealing
        const shouldAnalyze = isUsersTurn && gameState.handNumber > 0 && !gameState.isDealing;

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
        <div className="flex flex-col h-full bg-white/90 dark:bg-zinc-950/80 backdrop-blur-2xl border-l border-zinc-200 dark:border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-none">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200/50 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full animate-pulse" />
                        <div className="relative p-2.5 bg-blue-500/10 rounded-xl ring-1 ring-blue-500/30 shadow-inner">
                            <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight uppercase">Nick the Groq</h2>
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
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/30 hover:bg-blue-500/20"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    )}
                >
                    <Zap className={cn("w-3.5 h-3.5", autoAnalyze ? "fill-blue-600 dark:fill-blue-400" : "fill-none")} />
                    {autoAnalyze ? 'AUTO' : 'MANUAL'}
                </button>
            </div>

            {/* Scrollable Content Area */}
            <ScrollArea className="flex-1 min-h-0">
                <div className="flex flex-col min-h-full">
                    {/* Term Dictionary - First */}
                    <div className="px-4 py-1 border-b border-zinc-200/50 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02]">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="poker-dictionary" className="border-none">
                                <AccordionTrigger className="py-3 hover:no-underline group">
                                    <div className="flex items-center gap-2.5 text-zinc-500 group-data-[state=open]:text-blue-600 dark:group-data-[state=open]:text-blue-400 transition-all duration-300">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="text-sm font-black uppercase tracking-[0.1em]">Term Dictionary</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4">
                                    <div className="grid grid-cols-1 gap-2 mt-1">
                                        {POKER_TERMS.map((item) => (
                                            <div key={item.term} className="group/item p-3 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] hover:bg-white dark:hover:bg-white/[0.05] hover:border-blue-500/20 hover:shadow-lg dark:hover:shadow-none transition-all duration-300">
                                                <h4 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">{item.term}</h4>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{item.definition}</p>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Hand Rankings - Second */}
                            <AccordionItem value="hand-rankings" className="border-none">
                                <AccordionTrigger className="py-3 hover:no-underline group">
                                    <div className="flex items-center gap-2.5 text-zinc-500 group-data-[state=open]:text-blue-600 dark:group-data-[state=open]:text-blue-400 transition-all duration-300">
                                        <Layers className="w-4 h-4" />
                                        <span className="text-sm font-black uppercase tracking-[0.1em]">Hand Hierarchies</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4">
                                    <div className="grid grid-cols-1 gap-3 mt-1">
                                        {HAND_RANKINGS.map((hand, idx) => (
                                            <div key={hand.rank} className="group/item relative overflow-hidden p-3.5 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] hover:bg-white dark:hover:bg-white/[0.05] hover:border-blue-500/20 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 cursor-default">
                                                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <Trophy className="w-4 h-4 text-blue-500/30" />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-base font-bold text-zinc-700 dark:text-zinc-300 group-hover/item:text-zinc-900 dark:group-hover/item:text-white transition-colors">{idx + 1}. {hand.rank}</span>
                                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold tracking-tight px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/10">{hand.cards}</span>
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

                                                    <p className="text-sm text-zinc-500 group-hover/item:text-zinc-600 dark:group-hover/item:text-zinc-400 leading-normal transition-colors">{hand.desc}</p>
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
                                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
                                    <div className="relative p-6 bg-white dark:bg-[#1a1a2e] rounded-[2rem] ring-1 ring-zinc-200 dark:ring-white/10 shadow-2xl">
                                        <Sparkles className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">READY TO PLAY?</h3>
                                <p className="text-base text-zinc-500 leading-relaxed max-w-[300px] font-medium">
                                    Start a <span className="text-blue-600 dark:text-blue-400 font-bold italic">New Hand</span>, kid.
                                    I'll be right here to show you the ropes and help you read the table.
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
                                        <div className="p-1 px-1.5 bg-blue-500/10 rounded-md border border-blue-500/30">
                                            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    ) : (
                                        <div className="p-1 px-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-white/5">
                                            <MessageSquare className="w-4 h-4 text-zinc-500" />
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={cn(
                                        "relative max-w-[95%] p-5 rounded-2xl text-base leading-relaxed shadow-sm dark:shadow-2xl transition-all duration-300",
                                        message.role === 'user'
                                            ? "bg-blue-600 text-white rounded-tr-none border border-white/10"
                                            : "bg-white dark:bg-[#11111a] text-zinc-700 dark:text-zinc-300 rounded-tl-none border border-zinc-200 dark:border-white/[0.03]"
                                    )}
                                >
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap font-medium">
                                            {(message.parts || []).map((part: any, i: number) => {
                                                if (part.type === 'text') return <span key={i}>{part.text}</span>;
                                                if (part.type === 'reasoning') return (
                                                    <div key={i} className="mb-4 p-4 bg-zinc-50/50 dark:bg-black/40 rounded-xl border-l-[4px] border-blue-500/40 text-zinc-500 italic text-sm leading-relaxed shadow-inner">
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
                                    <div className="p-1 bg-blue-500/10 rounded-md border border-blue-500/20">
                                        <Bot className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-[#161621] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl rounded-tl-none w-2/3">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </ScrollArea>

            {/* Question input */}
            <div className="p-4 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-md border-t border-zinc-200/50 dark:border-white/5 mt-auto">
                <form onSubmit={handleSubmit} className="relative group">
                    <div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-colors rounded-2xl" />
                    <input
                        type="text"
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        placeholder="Inquire about strategy or odds..."
                        className="relative w-full pl-6 pr-16 py-5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl text-zinc-900 dark:text-white text-base placeholder-zinc-500 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white dark:focus:bg-zinc-800 transition-all duration-300 shadow-xl"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userQuestion.trim()}
                        className={cn(
                            "absolute right-3 top-3 p-2.5 rounded-xl transition-all duration-300",
                            userQuestion.trim() && !isLoading
                                ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-105 active:scale-95"
                                : "text-zinc-400 dark:text-zinc-700 cursor-not-allowed"
                        )}
                    >
                        <SendHorizontal className="w-6 h-6" />
                    </button>
                </form>
                <div className="mt-5 flex items-center justify-between px-3 text-xs text-zinc-500 dark:text-zinc-600 font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-zinc-100 dark:bg-white/[0.03] rounded-md border border-zinc-200 dark:border-white/[0.05]">
                        <HandIcon className="w-4 h-4 text-blue-500/50" />
                        <span>Odds</span>
                    </div>
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-zinc-100 dark:bg-white/[0.03] rounded-md border border-zinc-200 dark:border-white/[0.05]">
                        <History className="w-4 h-4 text-blue-500/50" />
                        <span>Ranges</span>
                    </div>
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-zinc-100 dark:bg-white/[0.03] rounded-md border border-zinc-200 dark:border-white/[0.05]">
                        <Settings2 className="w-4 h-4 text-blue-500/50" />
                        <span>Theory</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
