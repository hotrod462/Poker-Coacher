'use client';

/**
 * AI Coach Panel - Provides real-time poker coaching via Groq
 */

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { useGame } from '@/contexts/GameContext';

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
        <div className="flex flex-col h-full bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    <h2 className="text-lg font-bold text-white">AI Coach</h2>
                </div>
                <button
                    onClick={() => setAutoAnalyze(!autoAnalyze)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${autoAnalyze
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                        }`}
                >
                    {autoAnalyze ? '🤖 Auto-Coach ON' : '🤖 Auto-Coach OFF'}
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && gameState.handNumber === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        <p className="text-4xl mb-4">🃏</p>
                        <p className="text-lg font-semibold mb-2">Welcome to Poker Coach!</p>
                        <p className="text-sm">
                            Click &quot;Start Game&quot; to begin playing.<br />
                            I&apos;ll analyze every hand and help you make the best decisions.
                        </p>
                    </div>
                )}

                {messages.length === 0 && gameState.handNumber > 0 && !isLoading && (
                    <div className="text-center text-gray-400 py-4">
                        <p className="text-sm">
                            Waiting for the right moment to analyze...
                        </p>
                    </div>
                )}

                {messages.map((message: any) => (
                    <div
                        key={message.id}
                        className={`p-3 rounded-lg ${message.role === 'user'
                            ? 'bg-blue-600/20 border border-blue-500/30 ml-4'
                            : 'bg-gray-800 border border-gray-700'
                            }`}
                    >
                        <div className="prose prose-invert prose-sm max-w-none">
                            <div className={`${message.role === 'assistant' ? 'text-gray-200' : 'text-blue-300'} whitespace-pre-wrap text-sm leading-relaxed`}>
                                {(message.parts || []).map((part: any, i: number) => {
                                    if (part.type === 'text') return <span key={i}>{part.text}</span>;
                                    if (part.type === 'reasoning') return <div key={i} className="text-gray-500 italic mb-2 border-b border-gray-800 pb-2">{part.reasoning || part.text}</div>;
                                    return <span key={i}>{part.text || ''}</span>;
                                })}
                                {!message.parts && message.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-400 py-2">
                        <div className="animate-pulse flex gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm">Analyzing...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Question input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userQuestion.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                    >
                        Ask
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    💡 Ask about hand strength, odds, position, or strategy
                </p>
            </form>
        </div>
    );
}
