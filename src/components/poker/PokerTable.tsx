'use client';

/**
 * Poker Table Component - Main game table layout
 */

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { PlayerSeat } from './PlayerSeat';
import { CardHand } from './PlayingCard';
import { ActionButtons } from './ActionButtons';
import { ChipStack } from './PokerChip';
import { AnimatedChips } from './AnimatedChips';

export function PokerTable() {
    const { gameState, newHand, startGame } = useGame();
    const { players, communityCards, pot, street, dealerIndex, activePlayerIndex, winners, handNumber, isComplete } = gameState;

    const streetNames: Record<string, string> = {
        preflop: 'Pre-Flop',
        flop: 'Flop',
        turn: 'Turn',
        river: 'River',
        showdown: 'Showdown',
        complete: 'Complete',
    };

    // Helper to get position based on index (0 is user)
    const getPositionStyle = (index: number) => {
        // 5 Players: 0 (User), 1 (Left), 2 (Top Left), 3 (Top Right), 4 (Right)
        switch (index) {
            case 0: // User - Bottom Center
                return { bottom: '-80px', left: '50%', transform: 'translateX(-50%)' };
            case 1: // Bot 1 - Left
                return { top: '55%', left: '-60px', transform: 'translateY(-50%)' };
            case 2: // Bot 2 - Top Left
                return { top: '-80px', left: '25%', transform: 'translateX(-50%)' };
            case 3: // Bot 3 - Top Right
                return { top: '-80px', right: '25%', transform: 'translateX(50%)' };
            case 4: // Bot 4 - Right
                return { top: '55%', right: '-60px', transform: 'translateY(-50%)' };
            default:
                return {};
        }
    };

    const getSeatPosition = (index: number) => {
        switch (index) {
            case 0: return 'bottom';
            case 1: return 'left';
            case 2: return 'top-left';
            case 3: return 'top-right';
            case 4: return 'right';
            default: return 'bottom';
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] p-4 overflow-hidden relative">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black opacity-80 pointer-events-none" />

            {/* Header Info - Floating */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/5">
                    <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        Poker Coach
                    </span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-sm text-gray-400 font-mono">Hand #{handNumber}</span>
                </div>
            </div>

            {/* Main Table Area */}
            <div className="flex-1 flex items-center justify-center relative min-h-[300px] w-full max-w-[1200px] mx-auto perspective-[1000px] py-4">

                {/* The Green Felt Table */}
                <div className="relative w-[90%] md:w-[85%] aspect-[2/1] max-h-[50vh] min-h-[300px] bg-[#1a472a] rounded-[200px] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_100px_rgba(0,0,0,0.5)] border-[16px] border-[#2d3436] flex items-center justify-center">

                    {/* Felt Texture/Gradient */}
                    <div className="absolute inset-0 rounded-[180px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-700/20 via-transparent to-black/40 pointer-events-none" />

                    {/* Center Ring/Logo Area */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <div className="w-64 h-32 border-4 border-yellow-500/20 rounded-full" />
                    </div>

                    {/* Community Cards Area */}
                    <div className="relative z-10 flex flex-col items-center justify-center min-h-[220px]">
                        {/* Pot Display - Now more integrated */}
                        <div className={`mb-6 flex flex-col items-center transition-all duration-500 ${pot > 0 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
                            <div className="relative mb-2">
                                <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
                                <ChipStack amount={pot} size="md" maxChips={12} className="relative z-10" />
                            </div>
                            <div className="bg-black/60 backdrop-blur-xl px-6 py-2 rounded-2xl border border-white/10 flex flex-col items-center shadow-2xl">
                                <span className="text-[10px] text-green-400 uppercase tracking-[0.2em] font-black mb-0.5">Total Pot</span>
                                <span className="text-2xl text-white font-black tracking-tight">${pot.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Cards Area - Fixed height to prevent jumping */}
                        <div className="flex items-center justify-center h-[120px] transition-all duration-500">
                            {communityCards.length > 0 ? (
                                <div className="p-3 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 shadow-inner">
                                    <CardHand cards={communityCards} size="xl" overlap={false} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 opacity-30">
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="w-16 h-24 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
                                                <div className="w-8 h-12 bg-white/5 rounded-md" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-white font-black tracking-[0.3em] text-[10px] uppercase mt-2">
                                        {street === 'preflop' ? 'Waiting for Action' : 'Community Cards'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Street Name Indicator */}
                        <div className={`mt-6 transition-all duration-500 ${gameState.handNumber > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                            <span className="px-4 py-1.5 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 border border-white/5 shadow-lg">
                                {streetNames[street] || street}
                            </span>
                        </div>
                    </div>


                    {/* Players positioned absolutely around the table */}
                    {players.map((player, index) => {
                        // Sequential dealing order: Small Blind (dealer + 1) gets first card
                        const dealingOrder = (index - (dealerIndex + 1) % players.length + players.length) % players.length;

                        return (
                            <div
                                key={player.id}
                                className="absolute z-20"
                                style={getPositionStyle(index)}
                            >
                                <PlayerSeat
                                    player={player}
                                    isActive={activePlayerIndex === player.seatIndex}
                                    isDealer={dealerIndex === player.seatIndex}
                                    showCards={isComplete}
                                    seatPosition={getSeatPosition(index) as any}
                                    handNumber={handNumber}
                                    dealingOrder={dealingOrder}
                                    totalPlayers={players.length}
                                />
                            </div>
                        );
                    })}

                    <AnimatedChips />
                </div>
            </div>

            {/* Action Buttons Area (Fixed Bottom) */}
            <div className="min-h-[100px] w-full flex items-center justify-center z-30 pb-4 pt-2">
                {handNumber === 0 ? (
                    <button
                        onClick={startGame}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white text-lg font-bold rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all transform hover:scale-105 active:scale-95 border border-green-400/30"
                    >
                        Start Game
                    </button>
                ) : winners && winners.length > 0 ? (
                    <div className="w-full max-w-5xl px-4">
                        <div className="flex flex-row items-center justify-between gap-6 p-6 bg-black/60 border border-yellow-500/30 rounded-2xl backdrop-blur-xl shadow-2xl w-full animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20 shrink-0">
                                    <span className="text-3xl">🏆</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {winners.length > 1 ? 'Winners!' : 'Winner!'}
                                    </h3>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                                        {winners.map((w, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className="text-gray-300 font-medium">{w.playerName}</span>
                                                <span className="text-yellow-400 font-bold text-lg">${w.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={newHand}
                                className="px-10 py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] active:scale-95 uppercase tracking-wider border border-yellow-400/30 whitespace-nowrap"
                            >
                                Next Hand
                            </button>
                        </div>
                    </div>
                ) : isComplete && (!winners || winners.length === 0) ? (
                    <button
                        onClick={newHand}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-full shadow-lg transition-all"
                    >
                        Deal Next Hand
                    </button>
                ) : (
                    <div className="w-full max-w-5xl px-4">
                        <ActionButtons />
                    </div>
                )}
            </div>
        </div>
    );
}
