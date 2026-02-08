/**
 * Bot personalities and decision logic for AI opponents
 */

import { BotPersonality, Card, GameState, Player, PlayerAction, ValidAction } from './types';
import { evaluateHand, getRankValue } from './cards';

// 4 Bot personalities for 5-handed game
export const BOTS: BotPersonality[] = [
    {
        id: 'tight-tim',
        name: 'Tight Tim',
        avatar: '🧔',
        style: 'tight-passive',
        preflopThreshold: 10,  // Only plays premium hands
        aggressionFactor: 0.2, // Rarely raises
    },
    {
        id: 'aggro-andy',
        name: 'Aggro Andy',
        avatar: '😤',
        style: 'tight-aggressive',
        preflopThreshold: 8,
        aggressionFactor: 0.7, // Often raises
    },
    {
        id: 'loose-lucy',
        name: 'Loose Lucy',
        avatar: '💃',
        style: 'loose-passive',
        preflopThreshold: 4,   // Plays many hands
        aggressionFactor: 0.25,
    },
    {
        id: 'wild-wes',
        name: 'Wild Wes',
        avatar: '🤠',
        style: 'loose-aggressive',
        preflopThreshold: 3,
        aggressionFactor: 0.8, // Very aggressive
    },
];

/**
 * Chen Formula for preflop hand strength
 * Returns score 0-20 (higher = stronger)
 */
export function getChenScore(holeCards: Card[]): number {
    if (holeCards.length !== 2) return 0;

    const [card1, card2] = holeCards;
    const rank1 = card1[0];
    const rank2 = card2[0];
    const suit1 = card1[1];
    const suit2 = card2[1];

    const value1 = getRankValue(card1);
    const value2 = getRankValue(card2);

    // Start with highest card value
    let score = 0;
    const highCard = Math.max(value1, value2);

    // Base score from high card
    if (highCard === 14) score = 10;      // Ace
    else if (highCard === 13) score = 8;  // King
    else if (highCard === 12) score = 7;  // Queen
    else if (highCard === 11) score = 6;  // Jack
    else score = highCard / 2;            // Number cards

    // Pair bonus
    if (rank1 === rank2) {
        score = Math.max(score * 2, 5);
    }

    // Suited bonus
    if (suit1 === suit2) {
        score += 2;
    }

    // Gap penalty
    const gap = Math.abs(value1 - value2) - 1;
    if (gap === 1) score -= 1;
    else if (gap === 2) score -= 2;
    else if (gap === 3) score -= 4;
    else if (gap >= 4) score -= 5;

    // Straight potential bonus for small gaps
    if (gap <= 1 && Math.max(value1, value2) <= 12) {
        score += 1;
    }

    return Math.max(0, Math.round(score));
}

/**
 * Calculate hand strength post-flop (0-1)
 */
export function getPostFlopStrength(holeCards: Card[], communityCards: Card[]): number {
    if (communityCards.length === 0) return 0;

    const allCards = [...holeCards, ...communityCards];
    const handRank = evaluateHand(allCards);

    // Normalize to 0-1 (rank 1-10)
    return handRank.rank / 10;
}

/**
 * Get bot decision based on personality and game state
 */
export function getBotDecision(
    player: Player,
    gameState: GameState,
    validActions: ValidAction[]
): { action: PlayerAction; amount?: number } {
    const personality = player.personality;
    if (!personality) {
        // Default: just call or check
        const canCheck = validActions.some(a => a.action === 'check');
        return { action: canCheck ? 'check' : 'call' };
    }

    const { holeCards } = player;
    const { communityCards, currentBet, pot, bigBlind, street } = gameState;

    // Pre-flop decision
    if (street === 'preflop') {
        const chenScore = getChenScore(holeCards);

        // Below threshold: fold (unless can check)
        if (chenScore < personality.preflopThreshold) {
            const canCheck = validActions.some(a => a.action === 'check');
            if (canCheck) return { action: 'check' };
            return { action: 'fold' };
        }

        // Above threshold: play
        const canRaise = validActions.some(a => a.action === 'raise' || a.action === 'bet');
        const shouldRaise = Math.random() < personality.aggressionFactor;

        if (canRaise && shouldRaise) {
            const raiseAction = validActions.find(a => a.action === 'raise' || a.action === 'bet')!;
            // Raise based on hand strength (2-4x big blind)
            const multiplier = 2 + (chenScore / 20) * 2;
            const raiseAmount = Math.min(
                Math.floor(bigBlind * multiplier + currentBet),
                raiseAction.maxAmount || player.stack
            );
            return { action: 'raise', amount: raiseAmount };
        }

        const canCall = validActions.some(a => a.action === 'call');
        if (canCall) return { action: 'call' };

        const canCheck = validActions.some(a => a.action === 'check');
        return { action: canCheck ? 'check' : 'fold' };
    }

    // Post-flop decision
    const handStrength = getPostFlopStrength(holeCards, communityCards);

    // Strong hand (> 0.6): raise or bet
    if (handStrength > 0.6) {
        const canRaise = validActions.some(a => a.action === 'raise' || a.action === 'bet');
        if (canRaise && Math.random() < personality.aggressionFactor) {
            const raiseAction = validActions.find(a => a.action === 'raise' || a.action === 'bet')!;
            const betSize = Math.floor(pot * 0.5 + currentBet);
            return {
                action: raiseAction.action as PlayerAction,
                amount: Math.min(betSize, raiseAction.maxAmount || player.stack)
            };
        }
        const canCall = validActions.some(a => a.action === 'call');
        const canCheck = validActions.some(a => a.action === 'check');
        return { action: canCheck ? 'check' : canCall ? 'call' : 'fold' };
    }

    // Medium hand (0.3-0.6): call or check
    if (handStrength > 0.3) {
        const canCheck = validActions.some(a => a.action === 'check');
        if (canCheck) return { action: 'check' };

        // Pot odds consideration
        const potOdds = currentBet / (pot + currentBet);
        if (potOdds < 0.4) {
            return { action: 'call' };
        }

        // Loose players call more
        if (personality.style.includes('loose')) {
            return { action: 'call' };
        }
        return { action: 'fold' };
    }

    // Weak hand (< 0.3): check or fold
    const canCheck = validActions.some(a => a.action === 'check');
    if (canCheck) return { action: 'check' };

    // Bluff occasionally if aggressive
    if (personality.aggressionFactor > 0.5 && Math.random() < 0.15) {
        const canRaise = validActions.some(a => a.action === 'raise' || a.action === 'bet');
        if (canRaise) {
            const raiseAction = validActions.find(a => a.action === 'raise' || a.action === 'bet')!;
            return { action: raiseAction.action as PlayerAction, amount: raiseAction.minAmount };
        }
    }

    return { action: 'fold' };
}
