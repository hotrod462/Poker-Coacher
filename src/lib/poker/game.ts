/**
 * Poker Game Engine - Client-side state machine for Texas Hold'em
 * Adapted from OpenClaw Poker patterns
 */

import {
    GameState,
    Player,
    PlayerAction,
    ValidAction,
    Card,
    Street,
    GameAction
} from './types';
import {
    createDeck,
    shuffleDeck,
    dealCards,
    evaluateHand,
    compareHands,
    formatHand
} from './cards';
import { BOTS, getBotDecision } from './bots';

// Default game settings
const DEFAULT_SMALL_BLIND = 10;
const DEFAULT_BIG_BLIND = 20;
const DEFAULT_STARTING_STACK = 1000;

/**
 * Create initial game state with user and 4 bots
 */
export function createInitialGameState(userName: string = 'You'): GameState {
    const players: Player[] = [
        // User at seat 0
        {
            id: 'user',
            name: userName,
            avatar: '👤',
            isBot: false,
            isUser: true,
            seatIndex: 0,
            stack: DEFAULT_STARTING_STACK,
            holeCards: [],
            currentBet: 0,
            totalBet: 0,
            folded: false,
            allIn: false,
            hasActed: false,
        },
        // 4 Bots at seats 1-4
        ...BOTS.map((bot, index) => ({
            id: bot.id,
            name: bot.name,
            avatar: bot.avatar,
            isBot: true,
            isUser: false,
            seatIndex: index + 1,
            stack: DEFAULT_STARTING_STACK,
            holeCards: [],
            currentBet: 0,
            totalBet: 0,
            folded: false,
            allIn: false,
            hasActed: false,
            personality: bot,
        })),
    ];

    return {
        handNumber: 0,
        street: 'preflop',
        deck: [],
        communityCards: [],
        players,
        dealerIndex: 0,
        activePlayerIndex: null,
        pot: 0,
        currentBet: 0,
        minRaise: DEFAULT_BIG_BLIND,
        smallBlind: DEFAULT_SMALL_BLIND,
        bigBlind: DEFAULT_BIG_BLIND,
        actionHistory: [],
        isComplete: false,
    };
}

/**
 * Start a new hand
 */
export function startNewHand(state: GameState): GameState {
    // Move dealer button
    const numPlayers = state.players.length;
    const newDealerIndex = (state.dealerIndex + 1) % numPlayers;

    // Create and shuffle deck
    const deck = shuffleDeck(createDeck());

    // Reset players for new hand
    const activePlayers = state.players.filter(p => p.stack > 0);
    if (activePlayers.length < 2) {
        return { ...state, isComplete: true };
    }

    // Deal hole cards
    let remainingDeck = deck;
    const players = state.players.map(player => {
        if (player.stack <= 0) {
            return { ...player, folded: true, holeCards: [] };
        }
        const { cards, remaining } = dealCards(remainingDeck, 2);
        remainingDeck = remaining;
        return {
            ...player,
            holeCards: cards,
            currentBet: 0,
            totalBet: 0,
            folded: false,
            allIn: false,
            hasActed: false,
        };
    });

    // Find positions for blinds
    const activeIndices = players
        .map((p, i) => ({ player: p, index: i }))
        .filter(x => !x.player.folded && x.player.stack > 0)
        .map(x => x.index);

    const sbIndex = findNextActiveIndex(newDealerIndex, activeIndices, numPlayers);
    const bbIndex = findNextActiveIndex(sbIndex, activeIndices, numPlayers);
    const firstToActIndex = findNextActiveIndex(bbIndex, activeIndices, numPlayers);

    // Post blinds
    let pot = 0;
    const sbAmount = Math.min(state.smallBlind, players[sbIndex].stack);
    players[sbIndex] = {
        ...players[sbIndex],
        currentBet: sbAmount,
        totalBet: sbAmount,
        stack: players[sbIndex].stack - sbAmount,
        allIn: players[sbIndex].stack - sbAmount === 0,
    };
    pot += sbAmount;

    const bbAmount = Math.min(state.bigBlind, players[bbIndex].stack);
    players[bbIndex] = {
        ...players[bbIndex],
        currentBet: bbAmount,
        totalBet: bbAmount,
        stack: players[bbIndex].stack - bbAmount,
        allIn: players[bbIndex].stack - bbAmount === 0,
    };
    pot += bbAmount;

    return {
        ...state,
        handNumber: state.handNumber + 1,
        street: 'preflop',
        deck: remainingDeck,
        communityCards: [],
        players,
        dealerIndex: newDealerIndex,
        activePlayerIndex: firstToActIndex,
        pot,
        currentBet: bbAmount,
        minRaise: state.bigBlind,
        actionHistory: [],
        winners: undefined,
        isComplete: false,
    };
}

function findNextActiveIndex(current: number, activeIndices: number[], total: number): number {
    for (let i = 1; i <= total; i++) {
        const next = (current + i) % total;
        if (activeIndices.includes(next)) return next;
    }
    return activeIndices[0];
}

/**
 * Get valid actions for current player
 */
export function getValidActions(state: GameState): ValidAction[] {
    if (state.activePlayerIndex === null) return [];

    const player = state.players[state.activePlayerIndex];
    if (!player || player.folded || player.allIn) return [];

    const actions: ValidAction[] = [];
    const toCall = state.currentBet - player.currentBet;

    // Can always fold
    actions.push({ action: 'fold' });

    // Check if can check (no bet to call)
    if (toCall === 0) {
        actions.push({ action: 'check' });
    }

    // Call if there's a bet to match
    if (toCall > 0 && player.stack >= toCall) {
        actions.push({ action: 'call' });
    }

    // Raise/Bet
    const minRaiseTotal = state.currentBet + state.minRaise;
    if (player.stack > toCall) {
        if (state.currentBet === 0) {
            actions.push({
                action: 'bet',
                minAmount: state.bigBlind,
                maxAmount: player.stack
            });
        } else {
            actions.push({
                action: 'raise',
                minAmount: minRaiseTotal,
                maxAmount: player.stack + player.currentBet
            });
        }
    }

    // All-in
    if (player.stack > 0) {
        actions.push({
            action: 'all-in',
            minAmount: player.stack + player.currentBet,
            maxAmount: player.stack + player.currentBet
        });
    }

    return actions;
}

/**
 * Process a player action
 */
export function processAction(
    state: GameState,
    action: PlayerAction,
    amount?: number
): GameState {
    if (state.activePlayerIndex === null) return state;

    const playerIndex = state.activePlayerIndex;
    const player = state.players[playerIndex];
    if (!player || player.folded) return state;

    let updatedPlayers = [...state.players];
    let newPot = state.pot;
    let newCurrentBet = state.currentBet;
    let newMinRaise = state.minRaise;

    // Process action
    switch (action) {
        case 'fold':
            updatedPlayers[playerIndex] = { ...player, folded: true, hasActed: true };
            break;

        case 'check':
            updatedPlayers[playerIndex] = { ...player, hasActed: true };
            break;

        case 'call': {
            const callAmount = Math.min(state.currentBet - player.currentBet, player.stack);
            updatedPlayers[playerIndex] = {
                ...player,
                currentBet: player.currentBet + callAmount,
                totalBet: player.totalBet + callAmount,
                stack: player.stack - callAmount,
                allIn: player.stack - callAmount === 0,
                hasActed: true,
            };
            newPot += callAmount;
            break;
        }

        case 'bet':
        case 'raise': {
            const betAmount = amount || (state.currentBet + state.minRaise);
            const additionalAmount = betAmount - player.currentBet;
            const actualAmount = Math.min(additionalAmount, player.stack);

            updatedPlayers[playerIndex] = {
                ...player,
                currentBet: player.currentBet + actualAmount,
                totalBet: player.totalBet + actualAmount,
                stack: player.stack - actualAmount,
                allIn: player.stack - actualAmount === 0,
                hasActed: true,
            };
            newPot += actualAmount;

            const newBet = player.currentBet + actualAmount;
            if (newBet > newCurrentBet) {
                newMinRaise = newBet - newCurrentBet;
                newCurrentBet = newBet;
                // Reset hasActed for others who need to respond
                updatedPlayers = updatedPlayers.map((p, i) =>
                    i !== playerIndex && !p.folded && !p.allIn
                        ? { ...p, hasActed: false }
                        : p
                );
                updatedPlayers[playerIndex].hasActed = true;
            }
            break;
        }

        case 'all-in': {
            const allInAmount = player.stack;
            const newBet = player.currentBet + allInAmount;
            updatedPlayers[playerIndex] = {
                ...player,
                currentBet: newBet,
                totalBet: player.totalBet + allInAmount,
                stack: 0,
                allIn: true,
                hasActed: true,
            };
            newPot += allInAmount;

            if (newBet > newCurrentBet) {
                newMinRaise = newBet - newCurrentBet;
                newCurrentBet = newBet;
                // Reset hasActed for others
                updatedPlayers = updatedPlayers.map((p, i) =>
                    i !== playerIndex && !p.folded && !p.allIn
                        ? { ...p, hasActed: false }
                        : p
                );
                updatedPlayers[playerIndex].hasActed = true;
            }
            break;
        }
    }

    // Log action
    const newAction: GameAction = {
        playerId: player.id,
        playerName: player.name,
        action,
        amount,
        street: state.street,
        timestamp: Date.now(),
    };

    // Check if only one player remains
    const activePlayers = updatedPlayers.filter(p => !p.folded);
    if (activePlayers.length === 1) {
        // Award pot to winner
        const winner = activePlayers[0];
        const winnerIndex = updatedPlayers.findIndex(p => p.id === winner.id);
        updatedPlayers[winnerIndex] = {
            ...updatedPlayers[winnerIndex],
            stack: updatedPlayers[winnerIndex].stack + newPot,
        };

        return {
            ...state,
            players: updatedPlayers,
            pot: 0,
            street: 'complete',
            activePlayerIndex: null,
            actionHistory: [...state.actionHistory, newAction],
            winners: [{
                playerId: winner.id,
                playerName: winner.name,
                amount: newPot,
                hand: 'Others folded'
            }],
            isComplete: true,
        };
    }

    // Find next player or advance street
    const { nextPlayerIndex, roundComplete } = findNextToAct(updatedPlayers, playerIndex, newCurrentBet);

    if (roundComplete) {
        // Advance to next street
        return advanceStreet({
            ...state,
            players: updatedPlayers,
            pot: newPot,
            currentBet: newCurrentBet,
            minRaise: newMinRaise,
            actionHistory: [...state.actionHistory, newAction],
        });
    }

    return {
        ...state,
        players: updatedPlayers,
        pot: newPot,
        currentBet: newCurrentBet,
        minRaise: newMinRaise,
        activePlayerIndex: nextPlayerIndex,
        actionHistory: [...state.actionHistory, newAction],
    };
}

function findNextToAct(
    players: Player[],
    currentIndex: number,
    currentBet: number
): { nextPlayerIndex: number | null; roundComplete: boolean } {
    const numPlayers = players.length;

    for (let i = 1; i <= numPlayers; i++) {
        const nextIndex = (currentIndex + i) % numPlayers;
        const player = players[nextIndex];

        if (player.folded || player.allIn) continue;

        // Player needs to act if they haven't matched bet or haven't acted
        if (player.currentBet < currentBet || !player.hasActed) {
            return { nextPlayerIndex: nextIndex, roundComplete: false };
        }
    }

    return { nextPlayerIndex: null, roundComplete: true };
}

/**
 * Advance to next street
 */
function advanceStreet(state: GameState): GameState {
    // Reset betting for new street
    const resetPlayers = state.players.map(p => ({
        ...p,
        currentBet: 0,
        hasActed: false
    }));

    let { deck, communityCards, street } = state;
    let cardsToAdd: string[];
    let newStreet: Street;

    switch (street) {
        case 'preflop':
            ({ cards: cardsToAdd, remaining: deck } = dealCards(deck, 3));
            newStreet = 'flop';
            break;
        case 'flop':
            ({ cards: cardsToAdd, remaining: deck } = dealCards(deck, 1));
            newStreet = 'turn';
            break;
        case 'turn':
            ({ cards: cardsToAdd, remaining: deck } = dealCards(deck, 1));
            newStreet = 'river';
            break;
        case 'river':
            return runShowdown({ ...state, players: resetPlayers });
        default:
            return state;
    }

    communityCards = [...communityCards, ...cardsToAdd];

    // Find first active player after dealer
    const activeIndices = resetPlayers
        .map((p, i) => ({ player: p, index: i }))
        .filter(x => !x.player.folded && !x.player.allIn)
        .map(x => x.index);

    // If everyone is all-in, run out the board
    if (activeIndices.length === 0) {
        return advanceStreet({
            ...state,
            deck,
            communityCards,
            street: newStreet,
            players: resetPlayers,
            currentBet: 0,
        });
    }

    const firstToAct = findNextActiveIndex(state.dealerIndex, activeIndices, state.players.length);

    return {
        ...state,
        deck,
        communityCards,
        street: newStreet,
        players: resetPlayers,
        currentBet: 0,
        minRaise: state.bigBlind,
        activePlayerIndex: firstToAct,
    };
}

/**
 * Run showdown and determine winners
 */
function runShowdown(state: GameState): GameState {
    const activePlayers = state.players.filter(p => !p.folded);

    // Evaluate each player's hand
    const evaluated = activePlayers.map(player => {
        const allCards = [...player.holeCards, ...state.communityCards];
        const handRank = evaluateHand(allCards);
        return { player, handRank };
    });

    // Sort by hand strength (best first)
    evaluated.sort((a, b) => compareHands(b.handRank, a.handRank));

    // Find winners (handle ties)
    const bestHand = evaluated[0].handRank;
    const winners = evaluated.filter(e => compareHands(e.handRank, bestHand) === 0);

    // Split pot among winners
    const winAmount = Math.floor(state.pot / winners.length);

    // Update player stacks
    const updatedPlayers = state.players.map(player => {
        const winner = winners.find(w => w.player.id === player.id);
        if (winner) {
            return { ...player, stack: player.stack + winAmount };
        }
        return player;
    });

    const winnerInfo = winners.map(w => ({
        playerId: w.player.id,
        playerName: w.player.name,
        amount: winAmount,
        hand: `${w.handRank.name} (${formatHand(w.player.holeCards)})`,
    }));

    return {
        ...state,
        street: 'showdown',
        players: updatedPlayers,
        pot: 0,
        activePlayerIndex: null,
        winners: winnerInfo,
        isComplete: true,
    };
}

/**
 * Execute bot turn
 */
export function executeBotTurn(state: GameState): GameState {
    if (state.activePlayerIndex === null) return state;

    const player = state.players[state.activePlayerIndex];
    if (!player.isBot) return state;

    const validActions = getValidActions(state);
    const decision = getBotDecision(player, state, validActions);

    return processAction(state, decision.action, decision.amount);
}

/**
 * Check if it's the user's turn
 */
export function isUserTurn(state: GameState): boolean {
    if (state.activePlayerIndex === null) return false;
    return state.players[state.activePlayerIndex].isUser;
}

/**
 * Get the user's player object
 */
export function getUserPlayer(state: GameState): Player | undefined {
    return state.players.find(p => p.isUser);
}
