'use client';

/**
 * Action Buttons Component - Fold, Check, Call, Raise controls
 */

import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { PlayerAction } from '@/lib/poker/types';

export function ActionButtons() {
    const { validActions, isUsersTurn, playerAction, gameState } = useGame();
    const [raiseAmount, setRaiseAmount] = useState<number>(0);
    const [showRaiseSlider, setShowRaiseSlider] = useState(false);

    if (!isUsersTurn || validActions.length === 0) {
        return (
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                <span className="text-gray-400 text-sm">
                    {gameState.isComplete ? '🏆 Hand complete' : '⏳ Waiting for other players...'}
                </span>
            </div>
        );
    }

    const handleAction = (action: PlayerAction, amount?: number) => {
        playerAction(action, amount);
        setShowRaiseSlider(false);
    };

    const raiseAction = validActions.find(a => a.action === 'raise' || a.action === 'bet');
    const callAction = validActions.find(a => a.action === 'call');
    const canCheck = validActions.some(a => a.action === 'check');
    const canFold = validActions.some(a => a.action === 'fold');

    return (
        <div className="flex flex-col gap-3 p-4 bg-gray-800/80 rounded-xl backdrop-blur-sm">
            {/* Main actions */}
            <div className="flex items-center justify-center gap-3">
                {canFold && (
                    <button
                        onClick={() => handleAction('fold')}
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
                    >
                        Fold
                    </button>
                )}

                {canCheck && (
                    <button
                        onClick={() => handleAction('check')}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
                    >
                        Check
                    </button>
                )}

                {callAction && (
                    <button
                        onClick={() => handleAction('call')}
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
                    >
                        Call ${gameState.currentBet - (gameState.players.find(p => p.isUser)?.currentBet || 0)}
                    </button>
                )}

                {raiseAction && (
                    <button
                        onClick={() => {
                            setShowRaiseSlider(!showRaiseSlider);
                            setRaiseAmount(raiseAction.minAmount || gameState.bigBlind * 2);
                        }}
                        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
                    >
                        {raiseAction.action === 'bet' ? 'Bet' : 'Raise'}
                    </button>
                )}
            </div>

            {/* Raise slider */}
            {showRaiseSlider && raiseAction && (
                <div className="flex flex-col gap-2 p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                        <span>Min: ${raiseAction.minAmount}</span>
                        <span className="text-lg font-bold text-yellow-400">${raiseAmount}</span>
                        <span>Max: ${raiseAction.maxAmount}</span>
                    </div>
                    <input
                        type="range"
                        min={raiseAction.minAmount}
                        max={raiseAction.maxAmount}
                        step={gameState.bigBlind}
                        value={raiseAmount}
                        onChange={(e) => setRaiseAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => setRaiseAmount(raiseAction.minAmount || 0)}
                            className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                        >
                            Min
                        </button>
                        <button
                            onClick={() => setRaiseAmount(Math.floor(gameState.pot / 2 + gameState.currentBet))}
                            className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                        >
                            1/2 Pot
                        </button>
                        <button
                            onClick={() => setRaiseAmount(gameState.pot + gameState.currentBet)}
                            className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                        >
                            Pot
                        </button>
                        <button
                            onClick={() => setRaiseAmount(raiseAction.maxAmount || 0)}
                            className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                        >
                            All-In
                        </button>
                    </div>
                    <button
                        onClick={() => handleAction(raiseAction.action as PlayerAction, raiseAmount)}
                        className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors"
                    >
                        {raiseAction.action === 'bet' ? 'Bet' : 'Raise'} ${raiseAmount}
                    </button>
                </div>
            )}
        </div>
    );
}
