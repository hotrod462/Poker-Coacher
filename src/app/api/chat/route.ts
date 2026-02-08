/**
 * AI Coach API Route - Groq with Kimi K2
 */

import { createGroq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages } from 'ai';
import { GameState, Player } from '@/lib/poker/types';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const POKER_COACH_SYSTEM_PROMPT = `You are an expert Texas Hold'em poker coach teaching a complete beginner. Your job is to explain the game situation and recommend the best action.

IMPORTANT GUIDELINES:
1. Explain in simple terms - assume zero poker knowledge
2. Always explain WHY you recommend an action
3. Mention hand strength, position, pot odds, and opponent tendencies when relevant
4. Keep responses concise but educational (2-4 paragraphs max)
5. Dont use emojis
6. If the user asks a question, answer it directly first, then provide context

POKER CONCEPTS TO EXPLAIN (when relevant):
- Hand rankings (pair, two pair, straight, flush, etc.)
- Position (early, middle, late, button, blinds)
- Pot odds and implied odds
- Reading opponents (tight/loose, passive/aggressive)
- Bluffing and value betting
- Stack sizes and tournament dynamics

Always end with a clear RECOMMENDATION: [Fold/Check/Call/Raise] + brief reason.`;

function formatGameContext(gameState: GameState, userPlayer?: Player): string {
    const { street, pot, currentBet, communityCards, players } = gameState;

    const streetNames: Record<string, string> = {
        preflop: 'Pre-Flop (before any community cards)',
        flop: 'Flop (3 community cards)',
        turn: 'Turn (4 community cards)',
        river: 'River (5 community cards)',
    };

    const formatCards = (cards: string[]) => {
        const suitSymbols: Record<string, string> = { s: '♠', h: '♥', d: '♦', c: '♣' };
        return cards.map(c => c[0] + suitSymbols[c[1]]).join(' ') || 'None';
    };

    const activePlayers = players.filter(p => !p.folded);
    const opponents = activePlayers.filter(p => !p.isUser);

    let context = `
## Current Game Situation

**Street**: ${streetNames[street] || street}
**Your Hole Cards**: ${userPlayer ? formatCards(userPlayer.holeCards) : 'Unknown'}
**Community Cards**: ${formatCards(communityCards)}
**Pot**: $${pot}
**Current Bet to Call**: $${currentBet - (userPlayer?.currentBet || 0)}
**Your Stack**: $${userPlayer?.stack || 0}
**Your Position**: Seat ${userPlayer?.seatIndex} (${getPositionName(userPlayer?.seatIndex || 0, gameState.dealerIndex, players.length)})

**Opponents Still In**:
`;

    for (const opp of opponents) {
        const personality = opp.personality;
        context += `- ${opp.name} (${opp.avatar}): $${opp.stack} stack, betting $${opp.currentBet}`;
        if (personality) {
            context += ` - Style: ${personality.style}`;
        }
        context += '\n';
    }

    // Recent actions
    const recentActions = gameState.actionHistory.slice(-5);
    if (recentActions.length > 0) {
        context += '\n**Recent Actions**:\n';
        for (const action of recentActions) {
            context += `- ${action.playerName}: ${action.action}`;
            if (action.amount) context += ` $${action.amount}`;
            context += '\n';
        }
    }

    return context;
}

function getPositionName(seatIndex: number, dealerIndex: number, numPlayers: number): string {
    const relativePosition = (seatIndex - dealerIndex + numPlayers) % numPlayers;

    if (relativePosition === 0) return 'Button (Dealer) - Best position';
    if (relativePosition === 1) return 'Small Blind';
    if (relativePosition === 2) return 'Big Blind';
    if (relativePosition <= numPlayers / 2) return 'Early Position - Act first';
    return 'Late Position - Good position';
}

export async function POST(req: Request) {
    try {
        const { messages, gameState, userPlayer } = await req.json();

        const gameContext = formatGameContext(gameState, userPlayer);

        const result = streamText({
            model: groq('moonshotai/kimi-k2-instruct-0905'),
            system: `${POKER_COACH_SYSTEM_PROMPT}\n\nCURRENT GAME STATE:\n${gameContext}\n\nPlease analyze this situation based on the player's questions or current state. Always provide a clear recommendation.`,
            messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Coach API error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to get coaching advice' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

