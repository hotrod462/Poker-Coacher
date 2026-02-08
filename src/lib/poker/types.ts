/**
 * Poker Game Types
 */

export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export type Card = string; // e.g., "As" for Ace of spades

export type Street = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown' | 'complete';

export type PlayerAction = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'all-in';

export interface BotPersonality {
  id: string;
  name: string;
  avatar: string;
  style: 'tight-passive' | 'tight-aggressive' | 'loose-passive' | 'loose-aggressive';
  preflopThreshold: number;  // Min Chen score to play (2-20)
  aggressionFactor: number;  // 0-1, chance to raise vs call
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isBot: boolean;
  isUser: boolean;
  seatIndex: number;
  stack: number;
  holeCards: Card[];
  currentBet: number;
  totalBet: number;
  folded: boolean;
  allIn: boolean;
  hasActed: boolean;
  personality?: BotPersonality;
}

export interface GameAction {
  playerId: string;
  playerName: string;
  action: PlayerAction;
  amount?: number;
  street: Street;
  timestamp: number;
}

export interface GameState {
  // Hand info
  handNumber: number;
  street: Street;
  
  // Cards
  deck: Card[];
  communityCards: Card[];
  
  // Players
  players: Player[];
  dealerIndex: number;
  activePlayerIndex: number | null;
  
  // Betting
  pot: number;
  currentBet: number;
  minRaise: number;
  smallBlind: number;
  bigBlind: number;
  
  // History
  actionHistory: GameAction[];
  
  // Status
  winners?: { playerId: string; playerName: string; amount: number; hand: string }[];
  isComplete: boolean;
}

export interface ValidAction {
  action: PlayerAction;
  minAmount?: number;
  maxAmount?: number;
}
