import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
import { HeroSection } from "@/components/poker/HeroSection";
import {
  BrainCircuit,
  Trophy,
  Target,
  MessageSquare,
  Zap,
  Gamepad2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white dark:bg-[#050508] text-zinc-900 dark:text-white selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 dark:bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 dark:bg-emerald-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-600/5 dark:bg-blue-600/10 blur-[80px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav id="main-nav" className="w-full flex justify-center border-b border-zinc-200 dark:border-white/5 backdrop-blur-xl bg-white/80 dark:bg-black/20 sticky top-0 z-50 transition-colors">
        <div className="w-full max-w-7xl flex justify-between items-center p-4 px-6">
          <Link href="/" className="flex gap-2.5 items-center group">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg ring-1 ring-indigo-500/30 group-hover:ring-indigo-500/50 transition-all">
              <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">Poker Coach</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              <Link href="#features" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Tactics</Link>
              <Link href="#coach" className="hover:text-indigo-600 dark:hover:text-white transition-colors">The Coach</Link>
              <Link href="#opponents" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Rivals</Link>
            </div>
            <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 hidden md:block" />
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Container (Client Side for Interactivity) */}
      <HeroSection />



      {/* Features Grid */}
      <section id="features" className="w-full max-w-7xl px-6 py-32 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group p-8 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-[2.5rem] hover:bg-white dark:hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-500 shadow-sm hover:shadow-xl">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 ring-1 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all">
              <Gamepad2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase italic">Live Fire Drill</h3>
            <p className="text-zinc-600 dark:text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-400 transition-colors">
              Play full rounds against 4 AI rivals. Experience the pressure of the blinds and the tension of the river in a safe, simulated environment.
            </p>
          </div>

          <div className="group p-8 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-[2.5rem] hover:bg-white dark:hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all duration-500 shadow-sm hover:shadow-xl">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all">
              <Zap className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase italic">Neural Insight</h3>
            <p className="text-zinc-600 dark:text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-400 transition-colors">
              Get sub-second analysis on your hand strength and pot odds. Nick watches every move, calculating the math so you don&apos;t have to.
            </p>
          </div>

          <div className="group p-8 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-[2.5rem] hover:bg-white dark:hover:bg-white/[0.04] hover:border-teal-500/20 transition-all duration-500 shadow-sm hover:shadow-xl">
            <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-8 ring-1 ring-teal-500/20 group-hover:ring-teal-500/40 transition-all">
              <MessageSquare className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase italic">Strategic Q&A</h3>
            <p className="text-zinc-600 dark:text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-400 transition-colors">
              Don&apos;t just follow advice—understand it. Ask Nick about specific ranges, why you should raise, or how to read a dry board.
            </p>
          </div>
        </div>
      </section>

      {/* The Coach Section */}
      <section id="coach" className="w-full max-w-7xl px-6 py-32 z-10 border-t border-zinc-200 dark:border-white/5">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Meet Your Mentor
            </div>
            <h2 className="text-5xl md:text-6xl font-black uppercase italic leading-none tracking-tighter">
              Nick the Groq:<br />
              <span className="text-zinc-400 dark:text-zinc-600">The Vet In Your Ear.</span>
            </h2>
            <div className="space-y-6 text-zinc-600 dark:text-zinc-400 text-lg font-medium leading-relaxed">
              <p>
                &ldquo;I&apos;ve spent thirty years in the smokey backrooms of Vegas and the high-stakes pits of Macau. I&apos;ve seen every tell, every bluff, and every bad beat there is.&rdquo;
              </p>
              <p>
                Nick isn't just an algorithm; he&apos;s a persona built on decades of simulated poker logic. He doesn't just tell you what to do—he explains the <span className="text-zinc-900 dark:text-white">narrative</span> of the hand.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="p-6 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl">
                <div className="text-3xl font-black mb-1 text-zinc-900 dark:text-white uppercase italic tracking-tighter">0.5s</div>
                <div className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Inference Speed</div>
              </div>
              <div className="p-6 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl">
                <div className="text-3xl font-black mb-1 text-zinc-900 dark:text-white uppercase italic tracking-tighter">∞</div>
                <div className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Hand Situations</div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative group w-full max-w-md aspect-square">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] group-hover:bg-indigo-500/30 transition-all rounded-full" />
            <div className="relative w-full h-full bg-white dark:bg-[#11111a] border border-zinc-200 dark:border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 overflow-hidden shadow-2xl transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 dark:via-indigo-500 to-transparent opacity-50" />
              <div className="p-8 bg-zinc-50 dark:bg-black rounded-full ring-1 ring-zinc-200 dark:ring-white/10 shadow-inner">
                <BrainCircuit className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-black uppercase italic mb-2 tracking-tight">Nick.exe</h4>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">ONLINE & ANALYZING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rivals Section */}
      <section id="opponents" className="w-full bg-zinc-50 dark:bg-white/[0.01] border-y border-zinc-200 dark:border-white/5 py-32 z-10 overflow-hidden transition-colors">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4">The Rival Roster</h2>
          <p className="text-zinc-500 font-medium">Four distinct personalities. Four ways to lose your stack.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
          {[
            { name: "Tight Tim", style: "The Sentinel", mood: "Passive & careful", icon: "🧔", color: "blue" },
            { name: "Aggro Andy", style: "The Hammer", mood: "Tight & aggressive", icon: "😤", color: "red" },
            { name: "Loose Lucy", style: "The Gambler", mood: "Plays many hands", icon: "💃", color: "amber" },
            { name: "Wild Wes", style: "The Chaos", mood: "Aggressive & unpredictable", icon: "🤠", color: "purple" }
          ].map((bot) => (
            <div key={bot.name} className="p-10 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-[3rem] hover:translate-y-[-8px] transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none group">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">{bot.icon}</div>
              <div className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-2">{bot.style}</div>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase italic mb-4 tracking-tight">{bot.name}</h3>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed">{bot.mood}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl px-6 py-20 z-10 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-12 border-t border-zinc-200 dark:border-white/5">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex gap-2.5 items-center">
              <div className="p-1 bg-indigo-500/10 rounded-lg ring-1 ring-indigo-500/30">
                <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase italic">Poker Coach</span>
            </Link>
            <p className="text-xs font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest max-w-[200px] text-center md:text-left leading-loose">
              Mastering the art of the deal, one hand at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.25em]">Product</h5>
              <div className="flex flex-col gap-2.5 text-xs font-black text-zinc-500 uppercase tracking-widest">
                <Link href="/game" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Simulator</Link>
                <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Strategy Guide</span>
                <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Changelog</span>
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-indigo-600 dark:text-indigo-500 uppercase tracking-[0.25em]">Coach</h5>
              <div className="flex flex-col gap-2.5 text-xs font-black text-zinc-500 uppercase tracking-widest">
                <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Inference Engine</span>
                <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Hand Logic</span>
                <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Persona Core</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-zinc-400 dark:text-zinc-700 uppercase tracking-[0.3em] transition-colors">
          <p>© 2026 Poker Coach AI. No Real Money Involved.</p>
          <div className="flex items-center gap-6">
            <span className="text-emerald-600 dark:text-emerald-500/50">Status: All Systems Operational</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
