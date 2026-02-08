'use client';

/**
 * Game Context - Global state management for poker game
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import {
    GameState,
    PlayerAction,
    createInitialGameState,
    startNewHand,
    processAction,
    executeBotTurn,
    getValidActions,
    isUserTurn,
    getUserPlayer,
    ValidAction,
    Player
} from '@/lib/poker';

interface GameContextValue {
    gameState: GameState;
    validActions: ValidAction[];
    userPlayer: Player | undefined;
    isUsersTurn: boolean;
    startGame: () => void;
    newHand: () => void;
    playerAction: (action: PlayerAction, amount?: number) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

type GameStateAction =
    | { type: 'START_GAME' }
    | { type: 'NEW_HAND' }
    | { type: 'PLAYER_ACTION'; action: PlayerAction; amount?: number }
    | { type: 'BOT_TURN' }
    | { type: 'FINISH_DEALING' }
    | { type: 'SET_STATE'; state: GameState };

function gameReducer(state: GameState, action: GameStateAction): GameState {
    switch (action.type) {
        case 'START_GAME':
            return createInitialGameState('You');
        case 'NEW_HAND':
            return startNewHand(state);
        case 'PLAYER_ACTION':
            return processAction(state, action.action, action.amount);
        case 'BOT_TURN':
            return executeBotTurn(state);
        case 'FINISH_DEALING':
            return { ...state, isDealing: false };
        case 'SET_STATE':
            return action.state;
        default:
            return state;
    }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [gameState, dispatch] = useReducer(gameReducer, createInitialGameState('You'));
    const botTurnTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const validActions = getValidActions(gameState);
    const userPlayer = getUserPlayer(gameState);
    const isUsersTurn = isUserTurn(gameState);

    // Handle bot turns automatically
    useEffect(() => {
        // Clear any existing timeout
        if (botTurnTimeoutRef.current) {
            clearTimeout(botTurnTimeoutRef.current);
        }

        // If it's a bot's turn and game is active and NOT currently dealing
        if (
            gameState.activePlayerIndex !== null &&
            !gameState.isComplete &&
            !isUsersTurn &&
            !gameState.isDealing
        ) {
            // Add delay for realism
            botTurnTimeoutRef.current = setTimeout(() => {
                dispatch({ type: 'BOT_TURN' });
            }, 1500 + Math.random() * 1000); // 1.5-2.5s delay
        }

        return () => {
            if (botTurnTimeoutRef.current) {
                clearTimeout(botTurnTimeoutRef.current);
            }
        };
    }, [gameState.activePlayerIndex, gameState.isComplete, isUsersTurn, gameState.street, gameState.isDealing]);

    // Handle finishing dealing animation
    useEffect(() => {
        if (gameState.isDealing) {
            // Calculate dealing duration based on street to match CardHand animations
            // Pre-flop: 2 cards * 5 players -> last card starts at 3.6s, finishes at 5.1s
            // Flop: 3rd card starts at 4.0s, finishes at 5.5s
            // Turn: 4th card starts at 6.0s, finishes at 7.5s
            // River: 5th card starts at 8.0s, finishes at 9.5s
            let duration = 6000; // Default for Pre-flop/Flop
            if (gameState.street === 'turn') duration = 8000;
            if (gameState.street === 'river') duration = 10000;
            if (gameState.street === 'showdown') duration = 11000;

            const timer = setTimeout(() => {
                dispatch({ type: 'FINISH_DEALING' });
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [gameState.isDealing, gameState.street]);

    const startGame = useCallback(() => {
        dispatch({ type: 'START_GAME' });
        // Immediately start first hand with a delay
        setTimeout(() => dispatch({ type: 'NEW_HAND' }), 1000);
    }, []);

    const newHand = useCallback(() => {
        // Add a small delay before dealing to clear the board visually if needed
        dispatch({ type: 'NEW_HAND' });
    }, []);

    const playerAction = useCallback((action: PlayerAction, amount?: number) => {
        if (!isUsersTurn) return;
        dispatch({ type: 'PLAYER_ACTION', action, amount });
    }, [isUsersTurn]);

    return (
        <GameContext.Provider value={{
            gameState,
            validActions,
            userPlayer,
            isUsersTurn,
            startGame,
            newHand,
            playerAction,
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
