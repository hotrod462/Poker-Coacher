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
                <div className={`w-2 h-2 rounded-full ${gameState.isDealing ? 'bg-blue-500' : 'bg-yellow-500'} animate-pulse`} />
                <span className="text-gray-300 text-sm font-medium tracking-wide shadow-black drop-shadow-md">
                    {gameState.isDealing ? 'Dealing cards...' : 'Waiting for action...'}
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
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300 w-full max-w-5xl mx-auto">
            {/* Essential Actions Group */}
            <div className="flex gap-3 w-full md:w-auto">
                {canFold && (
                    <button
                        onClick={() => handleAction('fold')}
                        className="flex-1 md:flex-none min-w-[140px] px-8 py-4 bg-gradient-to-br from-red-600/90 to-red-800/90 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl shadow-lg border border-red-500/30 transition-all active:scale-95 uppercase tracking-wider text-base whitespace-nowrap"
                    >
                        Fold
                    </button>
                )}

                {(canCheck || callAction) && (
                    <button
                        onClick={() => handleAction(canCheck ? 'check' : 'call')}
                        className={`flex-1 md:flex-none min-w-[140px] px-8 py-4 bg-gradient-to-br ${canCheck ? 'from-gray-600 to-gray-700' : 'from-emerald-600 to-emerald-800'} hover:opacity-90 text-white font-bold rounded-xl shadow-lg border border-white/10 transition-all active:scale-95 uppercase tracking-wider text-base flex flex-col items-center justify-center leading-none gap-1 whitespace-nowrap`}
                    >
                        <span>{canCheck ? 'Check' : 'Call'}</span>
                        {callAction && <span className="text-xs opacity-80 font-mono font-medium">${callAmount}</span>}
                    </button>
                )}
            </div>

            {/* Slider & Confirm Action */}
            {raiseAction && (
                <div className="flex-1 flex items-center gap-6 w-full">
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-gray-500 font-mono px-2">
                            <span>MIN: ${raiseAction.minAmount}</span>
                            <span>MAX: ${raiseAction.maxAmount}</span>
                        </div>
                        <input
                            type="range"
                            min={raiseAction.minAmount}
                            max={raiseAction.maxAmount}
                            step={gameState.bigBlind}
                            value={raiseAmount}
                            onChange={(e) => setRaiseAmount(Number(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400 shadow-inner"
                        />
                    </div>

                    <button
                        onClick={() => handleAction(raiseAction.action as PlayerAction, raiseAmount)}
                        className="flex-1 md:flex-none min-w-[160px] px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wider whitespace-nowrap flex flex-col items-center justify-center leading-none border-t border-white/20"
                    >
                        <span className="text-[10px] opacity-70 mb-0.5 tracking-[0.1em]">{raiseAction.action === 'bet' ? 'Bet' : 'Raise'}</span>
                        <span className="text-xl font-mono">${raiseAmount}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
