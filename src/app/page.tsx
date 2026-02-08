import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      {/* Navigation */}
      <nav className="w-full flex justify-center border-b border-gray-800 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <span className="text-xl">🃏 Poker Coach</span>
          </div>
          <div className="flex items-center gap-4">
            <Suspense>
              <AuthButton />
            </Suspense>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8 max-w-4xl text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Learn Poker from AI
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Play Texas Hold&apos;em against AI opponents while an expert coach explains every hand.
            Perfect for complete beginners.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full">
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-3xl mb-3">🎮</div>
            <h3 className="font-semibold mb-2">Play & Learn</h3>
            <p className="text-sm text-gray-400">
              Play real hands against 4 AI opponents with distinct styles
            </p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="font-semibold mb-2">AI Coach</h3>
            <p className="text-sm text-gray-400">
              Real-time analysis at every decision point - hand strength, odds, strategy
            </p>
          </div>
          <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-3xl mb-3">🤔</div>
            <h3 className="font-semibold mb-2">Ask Questions</h3>
            <p className="text-sm text-gray-400">
              Ask the coach anything about poker strategy, odds, or terminology
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/game"
          className="mt-8 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-xl font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          🎯 Start Playing
        </Link>

        {/* Bot Personalities */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Play against 4 unique opponents:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
              🧔 <span className="text-gray-300">Tight Tim</span>
              <span className="text-gray-500 text-xs block">Passive & careful</span>
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
              😤 <span className="text-gray-300">Aggro Andy</span>
              <span className="text-gray-500 text-xs block">Tight & aggressive</span>
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
              💃 <span className="text-gray-300">Loose Lucy</span>
              <span className="text-gray-500 text-xs block">Plays many hands</span>
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">
              🤠 <span className="text-gray-300">Wild Wes</span>
              <span className="text-gray-500 text-xs block">Aggressive & unpredictable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center border-t border-gray-800 text-center text-xs gap-8 py-8 text-gray-500">
        <p>Powered by Groq (Kimi K2) • Supabase • Next.js</p>
      </footer>
    </main>
  );
}
