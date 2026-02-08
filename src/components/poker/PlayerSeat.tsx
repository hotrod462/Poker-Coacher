'use client';

/**
 * Player Seat Component - Shows player info, chips, and cards
 */

import React from 'react';
import { Player } from '@/lib/poker/types';
import { CardHand } from './PlayingCard';

interface PlayerSeatProps {
    player: Player;
    isActive: boolean;
    isDealer: boolean;
    showCards?: boolean;
}

export function PlayerSeat({ player, isActive, isDealer, showCards = false }: PlayerSeatProps) {
    const { name, avatar, stack, currentBet, folded, allIn, isUser, holeCards } = player;

    return (
        <div
            className={`
        relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300
        ${isActive ? 'ring-2 ring-yellow-400 bg-yellow-900/20' : 'bg-gray-800/50'}
        ${folded ? 'opacity-50' : ''}
        ${isUser ? 'bg-blue-900/30' : ''}
      `}
        >
            {/* Dealer button */}
            {isDealer && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    D
                </div>
            )}

            {/* Avatar and name */}
            <div className="flex items-center gap-2">
                <span className="text-2xl">{avatar}</span>
                <div className="flex flex-col">
                    <span className={`text-sm font-semibold ${isUser ? 'text-blue-300' : 'text-white'}`}>
                        {name}
                    </span>
                    <span className="text-xs text-green-400">${stack}</span>
                </div>
            </div>

            {/* Cards */}
            <div className="min-h-[44px]">
                {holeCards.length > 0 && !folded && (
                    <CardHand
                        cards={holeCards}
                        faceDown={!showCards && !isUser}
                        size="sm"
                        overlap={true}
                    />
                )}
                {folded && (
                    <span className="text-red-400 text-xs font-semibold">FOLDED</span>
                )}
            </div>

            {/* Current bet */}
            {currentBet > 0 && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                    <div className="px-2 py-1 bg-green-700 rounded-full text-xs font-bold text-white shadow-lg">
                        ${currentBet}
                    </div>
                </div>
            )}

            {/* All-in indicator */}
            {allIn && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                        ALL IN
                    </span>
                </div>
            )}
        </div>
    );
}
