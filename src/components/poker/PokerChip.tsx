'use client';

import React from 'react';

/**
 * PokerChip Component - A visually premium poker chip with different colors
 */

interface PokerChipProps {
    color?: 'red' | 'blue' | 'green' | 'black' | 'gold';
    value?: number | string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
    shadow?: boolean;
    style?: React.CSSProperties;
}

const COLOR_MAP = {
    red: {
        primary: '#be123c', // rose-700
        secondary: '#9f1239', // rose-800
        accent: '#fda4af', // rose-300
        text: 'text-rose-100',
    },
    blue: {
        primary: '#1d4ed8', // blue-700
        secondary: '#1e40af', // blue-800
        accent: '#93c5fd', // blue-300
        text: 'text-blue-100',
    },
    green: {
        primary: '#047857', // emerald-700
        secondary: '#065f46', // emerald-800
        accent: '#6ee7b7', // emerald-300
        text: 'text-emerald-100',
    },
    black: {
        primary: '#1f2937', // gray-800
        secondary: '#111827', // gray-900
        accent: '#9ca3af', // gray-400
        text: 'text-gray-100',
    },
    gold: {
        primary: '#b45309', // amber-700
        secondary: '#92400e', // amber-800
        accent: '#fcd34d', // amber-300
        text: 'text-amber-100',
    },
};

const SIZE_MAP = {
    xs: 'w-4 h-4 text-[8px] border-[1px]',
    sm: 'w-6 h-6 text-[10px] border-[1.5px]',
    md: 'w-8 h-8 text-[12px] border-2',
    lg: 'w-10 h-10 text-[14px] border-[2.5px]',
};

export function PokerChip({
    color = 'red',
    value,
    size = 'md',
    className = '',
    shadow = true,
    style,
}: PokerChipProps) {
    const config = COLOR_MAP[color];
    const sizeClass = SIZE_MAP[size];

    return (
        <div
            className={`
                ${sizeClass} ${className}
                relative rounded-full flex items-center justify-center font-bold font-mono
                ${shadow ? 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.3)]' : ''}
                transition-transform hover:scale-110 active:scale-95
                ring-1 ring-black/20
            `}
            style={{
                backgroundColor: config.primary,
                backgroundImage: `radial-gradient(circle at center, ${config.primary} 60%, ${config.secondary} 100%)`,
                borderColor: config.accent,
                borderStyle: 'dashed',
                ...style
            }}
        >
            {/* Edge stripes - typical of poker chips */}
            <div className="absolute inset-0 rounded-full border-[3px] border-white/20 border-dotted" />

            {/* Inner ring */}
            <div
                className="absolute inset-[15%] rounded-full border-[1px] opacity-40 translate-z-0 bg-black/10 shadow-inner"
                style={{ borderColor: config.accent }}
            />

            {/* Value (if provided) */}
            {value !== undefined && (
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <span className={`${config.text} drop-shadow-md leading-none`}>
                        {value}
                    </span>
                </div>
            )}

            {/* Stylized dots/edges */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full border-x border-white/40" />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 h-1.5 w-full border-y border-white/40" />
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>
    );
}

/**
 * ChipStack Component - Represents multiple chips stacked
 */
interface ChipStackProps {
    amount: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
    maxChips?: number;
    showAmount?: boolean;
}

export function ChipStack({ amount, size = 'sm', className = '', maxChips = 5, showAmount = true }: ChipStackProps) {
    // Determine chip counts based on denominations
    const getChips = () => {
        const result: { color: 'red' | 'blue' | 'green' | 'black' | 'gold'; value: number }[] = [];
        let remaining = amount;

        // Denominations
        const denoms = [
            { val: 100, color: 'gold' as const },
            { val: 50, color: 'black' as const },
            { val: 20, color: 'green' as const },
            { val: 10, color: 'blue' as const },
            { val: 1, color: 'red' as const },
        ];

        for (const d of denoms) {
            const count = Math.floor(remaining / d.val);
            for (let i = 0; i < count; i++) {
                if (result.length >= maxChips) break;
                result.push({ color: d.color, value: d.val });
            }
            remaining %= d.val;
            if (result.length >= maxChips) break;
        }

        // Ensure at least one chip if amount > 0
        if (amount > 0 && result.length === 0) {
            result.push({ color: 'red', value: amount });
        }

        return result;
    };

    const displayChips = getChips();

    return (
        <div className={`relative flex items-center h-12 ${className}`}>
            <div className="relative flex items-end gap-1.5 min-h-[48px]">
                {/* Organize chips into columns (stacks) of max 5 chips each */}
                {Array.from({ length: Math.ceil(displayChips.length / 5) }).map((_, colIdx) => (
                    <div key={colIdx} className="relative w-8 h-10">
                        {displayChips.slice(colIdx * 5, (colIdx + 1) * 5).map((chip, i) => (
                            <PokerChip
                                key={i}
                                color={chip.color}
                                size={size}
                                className="absolute left-0"
                                style={{
                                    bottom: `${i * 3}px`, // Vertical stack
                                    zIndex: 10 + i,
                                    transform: `rotate(${((colIdx + i) % 3 - 1) * 2}deg)`, // Subtle randomness
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {amount > 0 && showAmount && (
                <span className="ml-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/20 shadow-lg">
                    ${amount}
                </span>
            )}
        </div>
    );
}
