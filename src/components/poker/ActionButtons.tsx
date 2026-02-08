'use client';

/**
 * Action Buttons Component - Fold, Check, Call, Raise controls
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { PlayerAction } from '@/lib/poker/types';

export function ActionButtons() {
    const { validActions, isUsersTurn, playerAction, gameState, userPlayer } = useGame();
    const [raiseAmount, setRaiseAmount] = useState<number>(0);
    const [showRaiseSlider, setShowRaiseSlider] = useState(false);

    // Initialize raise amount when it becomes available
    const raiseAction = validActions.find(a => a.action === 'raise' || a.action === 'bet');
    useEffect(() => {
        if (raiseAction && raiseAmount === 0) {
            setRaiseAmount(raiseAction.minAmount || gameState.bigBlind * 2);
        }
    }, [raiseAction, raiseAmount, gameState.bigBlind]);

    if (!isUsersTurn || validActions.length === 0) {
        return (
            <div className="flex items-center justify-center gap-2 px-6 py-4 bg-black/40 border border-white/5 rounded-full backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-gray-300 text-sm font-medium tracking-wide shadow-black drop-shadow-md">
                    Waiting for action...
                </span>
            </div>
        );
    }

    const handleAction = (action: PlayerAction, amount?: number) => {
        playerAction(action, amount);
        setShowRaiseSlider(false);
        setRaiseAmount(0);
    };

    const callAction = validActions.find(a => a.action === 'call');
    const canCheck = validActions.some(a => a.action === 'check');
    const canFold = validActions.some(a => a.action === 'fold');

    // Calculate call amount
    const currentBet = userPlayer?.currentBet || 0;
    const callAmount = gameState.currentBet - currentBet;

    return (
        <div className="flex flex-col gap-4 p-5 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
            {/* Main actions row */}
            <div className="flex items-center justify-center gap-4">
                {canFold && (
                    <button
                        onClick={() => handleAction('fold')}
                        className="flex-1 px-8 py-4 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-lg rounded-xl shadow-lg border border-red-500/30 transition-all active:scale-95 uppercase tracking-wider"
                    >
                        Fold
                    </button>
                )}

                {canCheck && (
                    <button
                        onClick={() => handleAction('check')}
                        className="flex-1 px-8 py-4 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold text-lg rounded-xl shadow-lg border border-gray-500/30 transition-all active:scale-95 uppercase tracking-wider"
                    >
                        Check
                    </button>
                )}

                {callAction && (
                    <button
                        onClick={() => handleAction('call')}
                        className="flex-1 px-8 py-4 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg border border-emerald-500/30 transition-all active:scale-95 uppercase tracking-wider flex flex-col items-center leading-none gap-1"
                    >
                        <span>Call</span>
                        <span className="text-xs text-emerald-200 opacity-80">${callAmount}</span>
                    </button>
                )}

                {raiseAction && (
                    <button
                        onClick={() => setShowRaiseSlider(!showRaiseSlider)}
                        className={`flex-1 px-8 py-4 font-bold text-lg rounded-xl shadow-lg border transition-all active:scale-95 uppercase tracking-wider
                            ${showRaiseSlider
                                ? 'bg-yellow-500 text-black border-yellow-400'
                                : 'bg-gradient-to-br from-yellow-600 to-orange-700 hover:from-yellow-500 hover:to-orange-600 text-white border-yellow-500/30'
                            }`}
                    >
                        {raiseAction.action === 'bet' ? 'Bet' : 'Raise'}
                    </button>
                )}
            </div>

            {/* Raise slider panel */}
            {showRaiseSlider && raiseAction && (
                <div className="flex flex-col gap-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between text-sm text-gray-400 font-mono">
                        <span>Min: ${raiseAction.minAmount}</span>
                        <span>Max: ${raiseAction.maxAmount}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min={raiseAction.minAmount}
                            max={raiseAction.maxAmount}
                            step={gameState.bigBlind}
                            value={raiseAmount}
                            onChange={(e) => setRaiseAmount(Number(e.target.value))}
                            className="flex-1 h-3 bg-gray-700 rounded-full appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400"
                        />
                        <div className="min-w-[80px] text-center bg-black/40 rounded-lg py-2 border border-white/10">
                            <span className="text-xl font-bold text-yellow-400">${raiseAmount}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <button
                            onClick={() => setRaiseAmount(raiseAction.minAmount || 0)}
                            className="px-2 py-2 text-xs font-bold bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors border border-gray-600"
                        >
                            Min
                        </button>
                        <button
                            onClick={() => setRaiseAmount(Math.min(raiseAction.maxAmount || 0, Math.floor(gameState.pot / 2 + gameState.currentBet)))}
                            className="px-2 py-2 text-xs font-bold bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors border border-gray-600"
                        >
                            1/2 Pot
                        </button>
                        <button
                            onClick={() => setRaiseAmount(Math.min(raiseAction.maxAmount || 0, gameState.pot + gameState.currentBet))}
                            className="px-2 py-2 text-xs font-bold bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors border border-gray-600"
                        >
                            Pot
                        </button>
                        <button
                            onClick={() => setRaiseAmount(raiseAction.maxAmount || 0)}
                            className="px-2 py-2 text-xs font-bold bg-red-900/50 hover:bg-red-800/50 text-red-200 rounded-lg transition-colors border border-red-800/50"
                        >
                            Max
                        </button>
                    </div>

                    <button
                        onClick={() => handleAction(raiseAction.action as PlayerAction, raiseAmount)}
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl shadow-lg transition-colors mt-2 uppercase tracking-wide"
                    >
                        Confirm {raiseAction.action === 'bet' ? 'Bet' : 'Raise'}
                    </button>
                </div>
            )}
        </div>
    );
}
