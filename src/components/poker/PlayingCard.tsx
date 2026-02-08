'use client';

/**
 * Custom Playing Card Component with CSS styling
 */

import React from 'react';

interface PlayingCardProps {
    card?: string;  // e.g., "As" for Ace of spades
    faceDown?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    animationDelay?: string;
}

const SUIT_SYMBOLS: Record<string, { symbol: string; color: string }> = {
    's': { symbol: '♠', color: '#1e1e1e' },
    'h': { symbol: '♥', color: '#dc2626' },
    'd': { symbol: '♦', color: '#dc2626' },
    'c': { symbol: '♣', color: '#1e1e1e' },
};

const RANK_DISPLAY: Record<string, string> = {
    'A': 'A', '2': '2', '3': '3', '4': '4', '5': '5',
    '6': '6', '7': '7', '8': '8', '9': '9', 'T': '10',
    'J': 'J', 'Q': 'Q', 'K': 'K',
};

const SIZE_CLASSES = {
    sm: { card: 'w-12 h-16', rank: 'text-sm', suit: 'text-lg' },
    md: { card: 'w-16 h-22', rank: 'text-lg', suit: 'text-2xl' },
    lg: { card: 'w-20 h-28', rank: 'text-xl', suit: 'text-3xl' },
    xl: { card: 'w-24 h-36', rank: 'text-2xl', suit: 'text-4xl' },
};

export function PlayingCard({ card, faceDown = false, size = 'md', className = '', animationDelay }: PlayingCardProps) {
    const sizeClass = SIZE_CLASSES[size];

    if (faceDown || !card) {
        return (
            <div
                className={`${sizeClass.card} ${className} rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400 shadow-lg flex items-center justify-center animate-deal opacity-0`}
                style={{ animationDelay: animationDelay }}
            >
                <div className="text-blue-200 opacity-50 text-2xl">🂠</div>
            </div>
        );
    }

    const rank = card[0];
    const suit = card[1];
    const suitInfo = SUIT_SYMBOLS[suit] || SUIT_SYMBOLS['s'];
    const displayRank = RANK_DISPLAY[rank] || rank;

    return (
        <div
            className={`${sizeClass.card} ${className} rounded-lg bg-white border-2 border-gray-300 shadow-lg flex flex-col items-center justify-center relative overflow-hidden animate-deal opacity-0`}
            style={{
                color: suitInfo.color,
                animationDelay: animationDelay
            }}
        >
            {/* Top-left corner */}
            <div className="absolute top-1 left-1 flex flex-col items-center leading-none">
                <span className={`${sizeClass.rank} font-bold`}>{displayRank}</span>
                <span className="text-xs">{suitInfo.symbol}</span>
            </div>

            {/* Center suit */}
            <span className={`${sizeClass.suit}`}>{suitInfo.symbol}</span>

            {/* Bottom-right corner (rotated) */}
            <div className="absolute bottom-1 right-1 flex flex-col items-center leading-none rotate-180">
                <span className={`${sizeClass.rank} font-bold`}>{displayRank}</span>
                <span className="text-xs">{suitInfo.symbol}</span>
            </div>
        </div>
    );
}

interface CardHandProps {
    cards: string[];
    faceDown?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    overlap?: boolean;
    dealingOrder?: number;
    totalPlayers?: number;
}

export function CardHand({
    cards,
    faceDown = false,
    size = 'md',
    overlap = true,
    dealingOrder = 0,
    totalPlayers = 5
}: CardHandProps) {
    return (
        <div className="flex">
            {cards.map((card, index) => {
                // Sequential calculation:
                // Card 1 for all players, then Card 2 for all players
                // delay = (round * totalPlayers + playerPosition) * timePerCard
                const delay = (index * totalPlayers + dealingOrder) * 0.4;

                return (
                    <PlayingCard
                        key={`${card}-${index}`}
                        card={card}
                        faceDown={faceDown}
                        size={size}
                        className={overlap && index > 0 ? '-ml-6' : ''}
                        animationDelay={`${delay}s`}
                    />
                );
            })}
        </div>
    );
}
