import React, { useEffect } from 'react';
import { useSystem, getRankPercentileLabel } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import confetti from 'canvas-confetti';
import { Shield, Sparkles, ChevronRight, Award } from 'lucide-react';

export const RankUpModal: React.FC = () => {
  const { rankUpEvent, clearRankUpEvent, hunter, settings } = useSystem();

  useEffect(() => {
    if (!rankUpEvent) return;

    if (settings.sfxSound) {
      spaceAudio.playRankUp();
    }

    try {
      // Dual confetti cannons
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { x: 0.2, y: 0.5 },
        colors: ['#00E5FF', '#4D9FFF', '#FFD700', '#FFFFFF'],
      });
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { x: 0.8, y: 0.5 },
        colors: ['#00E5FF', '#4D9FFF', '#FFD700', '#FFFFFF'],
      });
    } catch (e) {
      console.warn(e);
    }
  }, [rankUpEvent]);

  if (!rankUpEvent) return null;

  return (
    <div
      onClick={clearRankUpEvent}
      className="fixed inset-0 z-50 bg-[#02020A]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 cursor-pointer select-none overflow-hidden"
    >
      {/* Background glow pulses */}
      <div className="absolute w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center max-w-lg text-center space-y-6">
        <span className="font-mono-system text-xs uppercase tracking-widest text-[#00E5FF] font-bold">
          [THE SYSTEM ACKNOWLEDGES YOUR EVOLUTION]
        </span>

        {/* Massive Rank Badge Reveal */}
        <div className="w-36 h-36 rounded-3xl border-4 border-[#00E5FF] bg-gradient-to-b from-[#0F1E4F] via-[#080D21] to-[#040612] flex flex-col items-center justify-center glow-blue-lg shadow-2xl animate-bounce">
          <span className="font-bebas text-7xl text-[#00E5FF] leading-none">
            {rankUpEvent.newRank}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-[#8899BB]">
            RANK HUNTER
          </span>
        </div>

        <div>
          <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white tracking-wider">
            RANK ADVANCEMENT ACHIEVED
          </h2>
          <p className="font-rajdhani text-lg sm:text-xl text-[#00E5FF] font-semibold mt-1">
            {rankUpEvent.oldRank}-RANK → {rankUpEvent.newRank}-RANK
          </p>
          <div className="mt-2 inline-block px-3 py-1 rounded-full border border-cyan-500/80 bg-cyan-950/70 text-cyan-300 font-mono text-xs font-bold shadow-sm glow-blue">
            {getRankPercentileLabel(rankUpEvent.newRank)}
          </div>
          <p className="font-rajdhani text-base text-[#8899BB] max-w-md mx-auto mt-3 leading-relaxed">
            &ldquo;You have conquered the crucible that breaks 99% of mankind. The mana density in your blood has increased. All physical stats permanently upgraded.&rdquo;
          </p>
        </div>

        <button
          onClick={clearRankUpEvent}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-black text-sm tracking-wider hover:brightness-110 active:scale-95 transition-all glow-blue"
        >
          CONFIRM SYSTEM ACKNOWLEDGMENT
        </button>

        <span className="font-mono text-[10px] text-slate-500">
          Tap anywhere to resume the hunt
        </span>
      </div>
    </div>
  );
};
