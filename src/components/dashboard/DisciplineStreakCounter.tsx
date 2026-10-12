import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  Flame,
  Award,
  Shield,
  Zap,
  Lock,
  CheckCircle2,
  Share2,
  Sparkles,
  Trophy,
  ChevronRight,
  X,
  Copy,
  Download,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StreakBadge {
  id: string;
  daysRequired: number;
  title: string;
  tier: 'BRONZE' | 'IRON' | 'EMERALD' | 'COBALT' | 'PURPLE' | 'GOLD' | 'MONARCH';
  iconName: string;
  quote: string;
  buffDescription: string;
}

const STREAK_BADGES: StreakBadge[] = [
  {
    id: 'streak_3',
    daysRequired: 3,
    title: 'Spark of Awakening',
    tier: 'BRONZE',
    iconName: 'flame',
    quote: 'The first embers of an unbreakable vessel.',
    buffDescription: '+5% XP bonus on morning daily quests',
  },
  {
    id: 'streak_7',
    daysRequired: 7,
    title: 'Iron Will',
    tier: 'IRON',
    iconName: 'bicep',
    quote: 'Seven days of refusal to negotiate with weakness.',
    buffDescription: '+10% Focus session mana regeneration',
  },
  {
    id: 'streak_14',
    daysRequired: 14,
    title: 'Habit Crucible',
    tier: 'EMERALD',
    iconName: 'kettlebell',
    quote: 'Two unbroken weeks. Neural rewiring solidified.',
    buffDescription: '+15% Multi-day trial completion reward',
  },
  {
    id: 'streak_21',
    daysRequired: 21,
    title: 'Shadow Discipline',
    tier: 'COBALT',
    iconName: 'skull',
    quote: 'The old lazy identity is completely dead.',
    buffDescription: 'Streak Freeze protection active (1 grace day)',
  },
  {
    id: 'streak_30',
    daysRequired: 30,
    title: 'Monarch Vanguard',
    tier: 'PURPLE',
    iconName: 'rune',
    quote: 'One full solar month of unrelenting consistency.',
    buffDescription: '+20% Global system XP on all tasks',
  },
  {
    id: 'streak_60',
    daysRequired: 60,
    title: 'S-Rank Demigod',
    tier: 'GOLD',
    iconName: 'lightning',
    quote: 'Top 0.5% mental endurance across the human species.',
    buffDescription: '+30% Mana pool & unlocked Legendary Title',
  },
  {
    id: 'streak_90',
    daysRequired: 90,
    title: 'Transcendent Monarch',
    tier: 'MONARCH',
    iconName: 'core',
    quote: 'Complete rebirth. The Shadow Monarch rules supreme.',
    buffDescription: 'Permanent Sovereign Aura & Transcendent License',
  },
];

export const DisciplineStreakCounter: React.FC = () => {
  const { hunter, dailyQuests, settings } = useSystem();
  const [selectedBadge, setSelectedBadge] = useState<StreakBadge | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const streakDays = Math.max(1, hunter.consecutiveStreak);
  const completedToday = dailyQuests.some((q) => q.completed);

  // Next milestone calculation
  const nextBadge = STREAK_BADGES.find((b) => b.daysRequired > streakDays) || STREAK_BADGES[STREAK_BADGES.length - 1];
  const prevRequired = STREAK_BADGES.filter((b) => b.daysRequired <= streakDays).pop()?.daysRequired || 0;
  const progressToNext = Math.min(
    100,
    Math.max(0, Math.round(((streakDays - prevRequired) / Math.max(1, nextBadge.daysRequired - prevRequired)) * 100))
  );

  const unlockedCount = STREAK_BADGES.filter((b) => streakDays >= b.daysRequired).length;

  const triggerBadgeCelebration = (badge: StreakBadge) => {
    setSelectedBadge(badge);
    if (settings.sfxSound) spaceAudio.playSystemChime();
    if (streakDays >= badge.daysRequired) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00E5FF', '#FFD700', '#A855F7', '#3B82F6'],
        });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const getTierColors = (tier: StreakBadge['tier'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-[#060A1E]/80',
        border: 'border-[#141B3B]',
        text: 'text-slate-600',
        glow: '',
      };
    }
    switch (tier) {
      case 'BRONZE':
        return { bg: 'bg-amber-950/40', border: 'border-amber-600/80', text: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(217,119,6,0.3)]' };
      case 'IRON':
        return { bg: 'bg-slate-900/60', border: 'border-slate-400/80', text: 'text-slate-300', glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]' };
      case 'EMERALD':
        return { bg: 'bg-emerald-950/50', border: 'border-emerald-500/80', text: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' };
      case 'COBALT':
        return { bg: 'bg-sky-950/50', border: 'border-sky-500/80', text: 'text-sky-400', glow: 'shadow-[0_0_15px_rgba(14,165,233,0.3)]' };
      case 'PURPLE':
        return { bg: 'bg-purple-950/50', border: 'border-purple-500/80', text: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]' };
      case 'GOLD':
        return { bg: 'bg-yellow-950/50', border: 'border-yellow-400/90', text: 'text-yellow-300', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]' };
      case 'MONARCH':
        return { bg: 'bg-cyan-950/60', border: 'border-[#00E5FF]', text: 'text-[#00E5FF]', glow: 'shadow-[0_0_25px_rgba(0,229,255,0.6)]' };
    }
  };

  return (
    <div className="bg-[#070B1F]/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden glow-blue shadow-xl space-y-6">
      
      {/* 1. TOP HEADER: CURRENT STREAK COUNTER & STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#141E44]">
        <div className="flex items-center gap-3.5">
          {/* Animated Flame Aura Icon */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-950/40 to-black border-2 border-amber-500/80 flex items-center justify-center shadow-lg shadow-amber-950/50 shrink-0">
            <Flame className="w-8 h-8 text-amber-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                [ DISCIPLINE STREAK MATRIX ]
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-950 border border-amber-700/60 text-amber-300 font-mono text-[9px] font-bold">
                UNBROKEN
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black font-orbitron text-white tracking-wider">
                {streakDays} DAYS
              </span>
              <span className="text-xs font-mono text-[#8899BB]">CONSECUTIVE</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Share Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
          {/* Today's completion status */}
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${
            completedToday
              ? 'border-emerald-500/70 bg-emerald-950/60 text-emerald-400'
              : 'border-amber-500/50 bg-amber-950/30 text-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${completedToday ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <span>{completedToday ? 'TASK COMPLETE TODAY' : 'PENDING CHECK-IN'}</span>
          </div>

          {/* Share Streak Card Trigger */}
          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              setShowShareModal(true);
            }}
            className="px-3 py-1.5 rounded-xl border border-cyan-400/80 bg-cyan-950/60 hover:bg-[#00E5FF] hover:text-black text-[#00E5FF] font-orbitron font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-950"
            title="Generate shareable anime workout & streak proof card"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">SHARE STREAK</span>
          </button>
        </div>
      </div>

      {/* 2. PROGRESS TOWARD NEXT MILESTONE */}
      <div className="p-4 rounded-xl border border-[#142352] bg-[#05081A]/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">
              Next Milestone:{' '}
              <strong className="text-white font-orbitron">{nextBadge.title}</strong>{' '}
              <span className="text-cyan-400 font-bold">({nextBadge.daysRequired} Days)</span>
            </span>
          </div>
          <span className="text-[#8899BB] font-mono text-[11px]">
            {nextBadge.daysRequired > streakDays ? `${nextBadge.daysRequired - streakDays} days remaining` : 'MAX TIER REACHED'}
          </span>
        </div>

        {/* Milestone Bar */}
        <div className="h-2 w-full bg-[#02030A] rounded-full overflow-hidden p-0.5 border border-[#101838]">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-[#4D9FFF] to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_10px_#00E5FF]"
            style={{ width: `${Math.min(100, Math.max(5, progressToNext))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
          <span>{prevRequired} Days Achieved</span>
          <span>Unlocked {unlockedCount} / {STREAK_BADGES.length} Milestones</span>
          <span>Target: {nextBadge.daysRequired} Days</span>
        </div>
      </div>

      {/* 3. HEXAGONAL UNLOCKABLE BADGES LATTICE (Matching User Screenshots 1 & 3) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00E5FF]" />
            <h4 className="font-orbitron font-bold text-xs sm:text-sm text-white tracking-wider">
              UNLOCKABLE DISCIPLINE BADGES & PROVING GROUNDS
            </h4>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold">
            {unlockedCount}/{STREAK_BADGES.length} UNLOCKED
          </span>
        </div>

        {/* Hexagonal Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
          {STREAK_BADGES.map((badge) => {
            const isUnlocked = streakDays >= badge.daysRequired;
            const style = getTierColors(badge.tier, isUnlocked);

            return (
              <button
                key={badge.id}
                onClick={() => triggerBadgeCelebration(badge)}
                className={`group relative p-3 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-between min-h-[125px] ${style.bg} ${style.border} ${style.glow} hover:scale-105 cursor-pointer`}
              >
                {/* Hexagonal Visual Badge Node */}
                <div className="relative w-12 h-12 flex items-center justify-center my-1">
                  {/* Hexagon SVG polygon background */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <polygon
                      points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                      className={`transition-colors ${
                        isUnlocked
                          ? 'fill-[#091538] stroke-current stroke-[4]'
                          : 'fill-[#030614] stroke-slate-800 stroke-[3]'
                      } ${style.text}`}
                    />
                  </svg>

                  {/* Icon or Question mark in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isUnlocked ? (
                      <span className={`text-base font-orbitron font-extrabold ${style.text}`}>
                        {badge.daysRequired}d
                      </span>
                    ) : (
                      <span className="text-slate-600 font-orbitron font-bold text-base">?</span>
                    )}
                  </div>
                </div>

                {/* Badge Label */}
                <div className="space-y-0.5">
                  <span className="font-orbitron font-bold text-[10px] text-white block line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {badge.title}
                  </span>
                  <span className="text-[9px] font-mono text-[#8899BB] block">
                    {badge.daysRequired} Days
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="mt-1">
                  {isUnlocked ? (
                    <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-500 flex items-center justify-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      LOCKED
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. BADGE DETAIL INSPECTOR MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#070B1F] border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-4 glow-blue">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2548]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#00E5FF]" />
                <h3 className="font-orbitron font-extrabold text-base text-white tracking-wide">
                  BADGE ARCHIVE
                </h3>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge Profile Card */}
            <div className="text-center space-y-3 py-2">
              <div className="w-20 h-20 mx-auto relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <polygon
                    points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                    className={`fill-[#0A163D] stroke-[4] ${
                      streakDays >= selectedBadge.daysRequired ? 'stroke-[#00E5FF]' : 'stroke-slate-700'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-orbitron font-black text-white">
                  {selectedBadge.daysRequired}D
                </div>
              </div>

              <div>
                <h4 className="font-orbitron font-black text-lg text-white">
                  {selectedBadge.title}
                </h4>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                  [{selectedBadge.tier} DISCIPLINE MILESTONE]
                </span>
              </div>

              <p className="font-rajdhani text-sm text-slate-300 italic">
                &ldquo;{selectedBadge.quote}&rdquo;
              </p>

              <div className="p-3 rounded-xl border border-cyan-900/60 bg-[#040716] text-left space-y-1 text-xs font-mono">
                <span className="text-[#00E5FF] font-bold block">
                  SYSTEM BUFF & REWARD:
                </span>
                <p className="text-slate-300">{selectedBadge.buffDescription}</p>
                <div className="text-[10px] text-[#8899BB] pt-1">
                  Status: {streakDays >= selectedBadge.daysRequired ? 'CLAIMED AND ACTIVE' : `Locked • Requires ${selectedBadge.daysRequired - streakDays} more consecutive days`}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl border border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-orbitron font-bold text-xs hover:bg-[#00E5FF] hover:text-black transition-all"
            >
              CLOSE INSPECTOR
            </button>
          </div>
        </div>
      )}

      {/* 5. SHARE WORKOUT & STREAK MODAL (Matching User Screenshot 4) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#05081A] border-2 border-[#00E5FF] rounded-3xl p-6 shadow-2xl space-y-5 glow-blue overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#141F48]">
              <span className="text-[11px] font-mono text-[#00E5FF] uppercase font-bold tracking-widest">
                [PROVE YOUR STRENGTH · STORY CARD]
              </span>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* The Holographic Shareable Card matching Screenshot 4 */}
            <div className="relative rounded-2xl border-2 border-cyan-400/80 bg-gradient-to-b from-[#0B1A42] via-[#050A22] to-black p-5 text-center shadow-xl space-y-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Top stats pill network */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded-xl bg-black/60 border border-cyan-900/60">
                  <div className="text-sm font-black font-orbitron text-[#00E5FF]">+{hunter.xp}</div>
                  <div className="text-[9px] text-slate-400">XP GAINED</div>
                </div>
                <div className="p-2 rounded-xl bg-black/60 border border-cyan-900/60">
                  <div className="text-sm font-black font-orbitron text-amber-400">{streakDays}</div>
                  <div className="text-[9px] text-slate-400">STREAK DAYS</div>
                </div>
                <div className="p-2 rounded-xl bg-black/60 border border-cyan-900/60">
                  <div className="text-sm font-black font-orbitron text-purple-400">{hunter.rank}</div>
                  <div className="text-[9px] text-slate-400">HUNTER RANK</div>
                </div>
              </div>

              {/* Main Card Body */}
              <div className="p-4 rounded-xl border border-cyan-500/40 bg-black/70 text-left space-y-3 relative">
                <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
                  <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                    [Daily Quest] - Main Character Training Arc
                  </span>
                  <span className="text-[9px] font-mono text-cyan-300 font-bold">ARISE</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">GOAL TARGETS:</div>
                  <div className="flex justify-between text-slate-300">
                    <span>PUSH-UPS</span>
                    <strong className="text-white font-mono">[100 / 100]</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>SIT-UPS</span>
                    <strong className="text-white font-mono">[100 / 100]</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>SQUATS</span>
                    <strong className="text-white font-mono">[100 / 100]</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>10KM RUN</span>
                    <strong className="text-white font-mono">[10.0 / 10.0 km]</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-cyan-950/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Hunter: {hunter.name}</span>
                  <span className="text-amber-400 font-bold">LVL {hunter.level}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                SOLO ARISE • VERIFIED SYSTEM PLAYER
              </div>
            </div>

            {/* Share action buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playSystemChime();
                  navigator.clipboard.writeText(`Solo Arise — ${streakDays} Day Unbroken Streak | Rank ${hunter.rank} Hunter LV.${hunter.level}! Surpass every weakness.`);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                className="py-3 px-3 rounded-xl border border-cyan-500/60 bg-cyan-950/60 hover:bg-[#00E5FF] hover:text-black text-[#00E5FF] font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'COPIED!' : 'COPY STATS'}</span>
              </button>

              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playArise();
                  alert('Workout card prepared for Instagram Story / Social media export!');
                  setShowShareModal(false);
                }}
                className="py-3 px-3 rounded-xl bg-gradient-to-r from-blue-950 to-cyan-950 border border-cyan-400 text-white font-orbitron font-bold text-xs tracking-wider hover:brightness-125 transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>SAVE STORY</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
