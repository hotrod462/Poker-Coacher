'use client';

/**
 * Game Page - Main poker game with resizable table and coach panels
 */

import { Suspense } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { PokerTable, CoachPanel } from '@/components/poker';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function GamePage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>}>
            <GameProvider>
                <div className="h-screen w-screen bg-gray-950 overflow-hidden">
                    <ResizablePanelGroup orientation="horizontal" className="h-full">
                        {/* Poker Table Panel */}
                        <ResizablePanel defaultSize={70} minSize={50}>
                            <PokerTable />
                        </ResizablePanel>

                        <ResizableHandle withHandle className="bg-gray-800 hover:bg-gray-700" />

                        {/* AI Coach Panel */}
                        <ResizablePanel defaultSize={30} minSize={20}>
                            <CoachPanel />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </GameProvider>
        </Suspense>
    );
}
