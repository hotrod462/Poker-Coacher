'use client';

/**
 * Player Seat Component - Shows player info, chips, and cards
 */

import React from 'react';
import { Player } from '@/lib/poker/types';
import { CardHand } from './PlayingCard';
import { ChipStack } from './PokerChip';

interface PlayerSeatProps {
    player: Player;
    isActive: boolean;
    isDealer: boolean;
    showCards?: boolean;
    seatPosition?: 'bottom' | 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    handNumber?: number;
    dealingOrder?: number;
    totalPlayers?: number;
}

export function PlayerSeat({
    player,
    isActive,
    isDealer,
    showCards = false,
    seatPosition = 'bottom',
    handNumber = 0,
    dealingOrder = 0,
    totalPlayers = 5
}: PlayerSeatProps) {
    const { name, avatar, stack, currentBet, folded, allIn, isUser, holeCards } = player;

    // Determine card position based on seat position
    // For bottom seats, cards go on top (closer to center)
    // For top seats, cards go on bottom (closer to center)
    const cardsOnTop = seatPosition.includes('bottom');

    return (
        <div className="relative flex flex-col items-center">
            {/* Bet amount - positioned closer to center of table */}
            {currentBet > 0 && (
                <div className={`
                    absolute z-30
                    ${cardsOnTop ? '-top-14' : '-bottom-14'}
                `}>
                    <ChipStack amount={currentBet} size="sm" />
                </div>
            )}

            <div className={`
                flex flex-col items-center gap-2 transition-all duration-300
                ${cardsOnTop ? 'flex-col-reverse' : 'flex-col'}
            `}>
                <div className={`
                    relative h-[80px] z-10 transition-all duration-300
                    ${folded ? 'opacity-40 grayscale' : ''}
                    ${isActive ? 'scale-110' : ''}
                `}
                    style={{
                        '--deal-from-y': seatPosition.includes('bottom') ? '-200px' : seatPosition.includes('top') ? '200px' : '0px',
                        '--deal-from-x': seatPosition.includes('left') ? '200px' : seatPosition.includes('right') ? '-200px' : '0px',
                    } as React.CSSProperties}>
                    {holeCards.length > 0 ? (
                        <div className={`${folded ? 'opacity-0' : 'opacity-100'}`} key={`hand-${handNumber}`}>
                            <CardHand
                                cards={holeCards}
                                faceDown={!showCards && !isUser}
                                size="lg"
                                overlap={true}
                                dealingOrder={dealingOrder}
                                totalPlayers={totalPlayers}
                            />
                        </div>
                    ) : (
                        <div className="w-[100px] h-28" /> // Placeholder for LG cards (matches h-28)
                    )}

                    {isActive && !isUser && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce flex items-center gap-1">
                            <span className="w-1 h-1 bg-black rounded-full animate-pulse" />
                            <span className="w-1 h-1 bg-black rounded-full animate-pulse delay-75" />
                            <span className="w-1 h-1 bg-black rounded-full animate-pulse delay-150" />
                            THINKING
                        </div>
                    )}

                    {folded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="px-2 py-0.5 bg-gray-900/80 text-gray-400 text-xs font-bold rounded border border-gray-700">
                                FOLD
                            </span>
                        </div>
                    )}

                    {/* Winner indicator or hand strength could go here */}
                </div>

                {/* Player Pill */}
                <div
                    className={`
                        relative flex items-center gap-3 p-2 pr-4 rounded-full border-2 transition-all duration-300 shadow-xl backdrop-blur-md min-w-[160px]
                        ${isActive
                            ? 'bg-gray-800/90 border-yellow-500/80 ring-4 ring-yellow-500/20 z-20'
                            : 'bg-gray-900/80 border-gray-700/50 hover:border-gray-600 z-10'
                        }
                        ${folded ? 'opacity-50 grayscale' : ''}
                        ${isUser ? 'border-blue-500/50' : ''}
                    `}
                >
                    {/* Dealer Button */}
                    {isDealer && (
                        <div className={`
                            absolute w-6 h-6 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-gray-300 z-30
                            ${cardsOnTop ? '-top-2 -right-1' : '-bottom-2 -right-1'}
                        `}>
                            D
                        </div>
                    )}

                    {/* All In Badge */}
                    {allIn && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] uppercase font-bold rounded shadow-lg animate-pulse border border-red-400">
                                All In
                            </span>
                        </div>
                    )}

                    {/* Avatar */}
                    <div className="relative">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br border-2 shadow-inner
                            ${isUser ? 'from-blue-600 to-blue-800 border-blue-400' : 'from-gray-700 to-gray-800 border-gray-600'}
                        `}>
                            {avatar}
                        </div>
                        {isActive && (
                            <div className="absolute -inset-1 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
                        )}

                        {/* Visual stack of chips representing total money */}
                        <div className="absolute -left-5 top-1/2 -translate-y-1/2">
                            <ChipStack amount={stack} size="xs" maxChips={4} showAmount={false} />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className={`text-sm font-bold truncate max-w-[100px] ${isUser ? 'text-blue-200' : 'text-gray-200'}`}>
                            {name}
                        </span>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-xs font-mono font-medium text-green-400">
                                ${stack.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
