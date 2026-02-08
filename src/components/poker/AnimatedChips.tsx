'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PokerChip } from './PokerChip';
import { useGame } from '@/contexts/GameContext';

/**
 * AnimatedChips - Handles the visual movement of chips across the table
 */

interface ChipAnimation {
    id: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
    color: 'red' | 'blue' | 'green' | 'black' | 'gold';
    value?: number;
}

export function AnimatedChips() {
    const { gameState } = useGame();
    const { players, pot, street, winners } = gameState;
    const [animations, setAnimations] = useState<ChipAnimation[]>([]);

    // Refs to track previous states to detect changes
    const prevBets = useRef<Record<string, number>>({});
    const prevPot = useRef(0);
    const prevStreet = useRef(street);
    const prevWinners = useRef<any[] | null>(null);

    // Refs for table layout to calculate coordinates
    // In a real app, we'd use element refs, but for now we'll estimate based on seat index
    const getSeatCoords = (index: number) => {
        // These are percentage-based or relative offsets consistent with getPositionStyle in PokerTable.tsx
        // 5 Players: 0 (User), 1 (Left), 2 (Top Left), 3 (Top Right), 4 (Right)
        switch (index) {
            case 0: return { x: 0, y: 150 }; // Bottom
            case 1: return { x: -350, y: 50 }; // Left
            case 2: return { x: -250, y: -150 }; // Top Left
            case 3: return { x: 250, y: -150 }; // Top Right
            case 4: return { x: 350, y: 50 }; // Right
            default: return { x: 0, y: 0 };
        }
    };

    const getBetCoords = (index: number) => {
        const seat = getSeatCoords(index);
        // Bet is closer to center than the seat
        return { x: seat.x * 0.6, y: seat.y * 0.5 };
    };

    const potCoords = { x: 0, y: -40 };

    useEffect(() => {
        const newAnims: ChipAnimation[] = [];

        // 1. Detect new bets
        players.forEach((player, idx) => {
            const prevBet = prevBets.current[player.id] || 0;
            if (player.currentBet > prevBet) {
                // Player bet more - move chips from seat directly to pot
                newAnims.push({
                    id: `bet-${player.id}-${Date.now()}`,
                    from: getSeatCoords(idx),
                    to: potCoords,
                    color: player.currentBet >= 100 ? 'black' : player.currentBet >= 20 ? 'blue' : 'red',
                    value: player.currentBet - prevBet
                });
            }
            prevBets.current[player.id] = player.currentBet;
        });
        prevStreet.current = street;

        // 2. Detect winners (chips move to winners)
        if (winners && winners.length > 0 && !prevWinners.current) {
            winners.forEach((winner, idx) => {
                // Find player index
                const playerIdx = players.findIndex(p => p.name === winner.playerName);
                if (playerIdx !== -1) {
                    // Multiple chips for the win
                    for (let i = 0; i < 3; i++) {
                        newAnims.push({
                            id: `win-${winner.playerName}-${i}-${Date.now()}`,
                            from: potCoords,
                            to: getSeatCoords(playerIdx),
                            color: 'gold',
                        });
                    }
                }
            });
        }
        prevWinners.current = winners || null;

        if (newAnims.length > 0) {
            setAnimations(prev => [...prev, ...newAnims]);

            // Cleanup animations after they finish
            setTimeout(() => {
                setAnimations(prev => prev.filter(a => !newAnims.find(na => na.id === a.id)));
            }, 1000);
        }
    }, [players, street, winners]);

    return (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {animations.map(anim => (
                    <motion.div
                        key={anim.id}
                        initial={{ x: anim.from.x, y: anim.from.y, scale: 0.5, opacity: 0 }}
                        animate={{ x: anim.to.x, y: anim.to.y, scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            duration: 0.6
                        }}
                        className="absolute"
                    >
                        <PokerChip color={anim.color} size="sm" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
