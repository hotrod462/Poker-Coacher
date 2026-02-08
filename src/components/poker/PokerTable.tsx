'use client';

/**
 * Poker Table Component - Main game table layout
 */

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { PlayerSeat } from './PlayerSeat';
import { CardHand } from './PlayingCard';
import { ActionButtons } from './ActionButtons';

export function PokerTable() {
    const { gameState, newHand, startGame } = useGame();
    const { players, communityCards, pot, street, dealerIndex, activePlayerIndex, winners, handNumber, isComplete } = gameState;

    // Position players around the table (5 players)
    // Layout: Top row (3 players), Bottom row (user center, 1 player each side)
    const topPlayers = players.slice(1, 4);  // Bots 1-3
    const bottomLeftPlayer = players[4];      // Bot 4
    const userPlayer = players[0];            // User

    const streetNames: Record<string, string> = {
        preflop: 'Pre-Flop',
        flop: 'Flop',
        turn: 'Turn',
        river: 'River',
        showdown: 'Showdown',
        complete: 'Complete',
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-950 p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white">🃏 Poker Coach</h2>
                    <span className="text-sm text-gray-400">Hand #{handNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-semibold">
                        {streetNames[street] || street}
                    </span>
                    <span className="px-3 py-1 bg-green-600 rounded-full text-sm font-semibold">
                        Pot: ${pot}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                {/* Top row - 3 bots */}
                <div className="flex items-end justify-center gap-6 mb-6">
                    {topPlayers.map((player) => (
                        <PlayerSeat
                            key={player.id}
                            player={player}
                            isActive={activePlayerIndex === player.seatIndex}
                            isDealer={dealerIndex === player.seatIndex}
                            showCards={isComplete}
                        />
                    ))}
                </div>

                {/* Center - Community cards */}
                <div className="relative flex flex-col items-center gap-4 py-6 px-12 bg-green-800/40 rounded-[100px] border-4 border-green-700/50 shadow-xl mb-6">
                    {/* Community cards */}
                    <div className="flex gap-2 min-h-[64px] items-center">
                        {communityCards.length > 0 ? (
                            <CardHand cards={communityCards} size="md" overlap={false} />
                        ) : (
                            <span className="text-green-400/50 text-sm">Community Cards</span>
                        )}
                    </div>

                    {/* Winners display */}
                    {winners && winners.length > 0 && (
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <div className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg shadow-lg text-sm">
                                🏆 {winners.map(w => `${w.playerName} wins $${w.amount}`).join(', ')}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom row - Bot 4, User, empty space */}
                <div className="flex items-start justify-center gap-6">
                    {bottomLeftPlayer && (
                        <PlayerSeat
                            player={bottomLeftPlayer}
                            isActive={activePlayerIndex === bottomLeftPlayer.seatIndex}
                            isDealer={dealerIndex === bottomLeftPlayer.seatIndex}
                            showCards={isComplete}
                        />
                    )}

                    {userPlayer && (
                        <div className="flex flex-col items-center gap-3">
                            <PlayerSeat
                                player={userPlayer}
                                isActive={activePlayerIndex === userPlayer.seatIndex}
                                isDealer={dealerIndex === userPlayer.seatIndex}
                                showCards={true}
                            />
                        </div>
                    )}

                    {/* Empty space for balance */}
                    <div className="w-[140px]" />
                </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4">
                {handNumber === 0 ? (
                    <div className="flex justify-center">
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-lg font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
                        >
                            🎮 Start Game
                        </button>
                    </div>
                ) : isComplete ? (
                    <div className="flex justify-center">
                        <button
                            onClick={newHand}
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-lg font-bold rounded-xl shadow-lg transition-all"
                        >
                            Deal Next Hand →
                        </button>
                    </div>
                ) : (
                    <ActionButtons />
                )}
            </div>
        </div>
    );
}
