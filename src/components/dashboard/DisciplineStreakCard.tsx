import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  Flame,
  Award,
  Shield,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Info,
  Calendar,
  X,
  ChevronRight,
} from 'lucide-react';

export interface StreakMilestone {
  days: number;
  id: string;
  title: string;
  rankRequirement: string;
  description: string;
  lore: string;
  xpBonusPercent: number;
  iconColor: string;
  glowClass: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 1,
    id: 'awakened-spark',
    title: 'Awakened Spark',
    rankRequirement: 'E-Rank',
    description: 'Broke inertia. Successfully completed your first daily mandate.',
    lore: 'The darkest night always begins with a single step out of the shadows.',
    xpBonusPercent: 2,
    iconColor: 'text-cyan-400 border-cyan-500 bg-cyan-950/60',
    glowClass: 'glow-blue',
  },
  {
    days: 3,
    id: 'iron-will',
    title: 'Iron Will',
    rankRequirement: 'E-Rank',
    description: '3 consecutive days of unbroken discipline.',
    lore: 'Muscles ache, biology resists, but the Hunter refuses to surrender.',
    xpBonusPercent: 5,
    iconColor: 'text-blue-400 border-blue-500 bg-blue-950/60',
    glowClass: 'glow-blue',
  },
  {
    days: 7,
    id: 'shadow-footman',
    title: 'Shadow Footman',
    rankRequirement: 'D-Rank',
    description: '1 full week of completed system quotas.',
    lore: 'You have entered the ranks of those who honor their word in silence.',
    xpBonusPercent: 10,
    iconColor: 'text-indigo-400 border-indigo-500 bg-indigo-950/60',
    glowClass: 'glow-blue',
  },
  {
    days: 14,
    id: 'dungeon-conqueror',
    title: 'Dungeon Conqueror',
    rankRequirement: 'C-Rank',
    description: '2 unbroken weeks. Habit neural pathways solidified.',
    lore: 'Excuses become meaningless noise before an unstoppable routine.',
    xpBonusPercent: 15,
    iconColor: 'text-purple-400 border-purple-500 bg-purple-950/60',
    glowClass: 'glow-violet',
  },
  {
    days: 30,
    id: 'crucible-survivor',
    title: 'Crucible Survivor',
    rankRequirement: 'B-Rank',
    description: '30 days of steel discipline. Top 10% hunter consistency.',
    lore: 'The body is no longer a cage; it is a weapon forged in daily fire.',
    xpBonusPercent: 20,
    iconColor: 'text-amber-400 border-amber-500 bg-amber-950/60',
    glowClass: 'glow-gold',
  },
  {
    days: 60,
    id: 'commander-of-shadows',
    title: 'Commander of Shadows',
    rankRequirement: 'A-Rank',
    description: '60 days consecutive streak. Unshakable mental fortitude.',
    lore: 'Darkness parts before you. You lead your own shadows into battle.',
    xpBonusPercent: 25,
    iconColor: 'text-rose-400 border-rose-500 bg-rose-950/60',
    glowClass: 'glow-red',
  },
  {
    days: 100,
    id: 'monarch-mandate',
    title: "Monarch's Mandate",
    rankRequirement: 'S-Rank / Sovereign',
    description: '100 days of absolute sovereign discipline. The top 1%.',
    lore: '“I do not fear the storm. I am the calamity that arises.” — Shadow Sovereign',
    xpBonusPercent: 35,
    iconColor: 'text-cyan-300 border-cyan-400 bg-gradient-to-br from-cyan-950 via-[#0A1A40] to-black',
    glowClass: 'glow-blue-lg',
  },
];

export const DisciplineStreakCard: React.FC = () => {
  const { hunter, dailyQuests, settings } = useSystem();
  const [selectedBadge, setSelectedBadge] = useState<StreakMilestone | null>(null);

  const streak = Math.max(0, hunter.consecutiveStreak || 0);

  // Determine current unlocked milestones
  const unlockedBadges = STREAK_MILESTONES.filter((m) => streak >= m.days);
  const nextMilestone = STREAK_MILESTONES.find((m) => streak < m.days) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const previousMilestoneDays = STREAK_MILESTONES.filter((m) => streak >= m.days).pop()?.days || 0;

  // Calculate progress toward next milestone
  const range = Math.max(1, nextMilestone.days - previousMilestoneDays);
  const currentProgressInRange = Math.max(0, Math.min(range, streak - previousMilestoneDays));
  const progressPercent = Math.min(100, Math.round((currentProgressInRange / range) * 100));

  // Today's completion status
  const questsCompletedToday = dailyQuests.filter((q) => q.completed).length;
  const isTodaySecured = questsCompletedToday > 0;

  // Active XP Multiplier from highest unlocked badge
  const activeXpBonus = unlockedBadges.length > 0 ? unlockedBadges[unlockedBadges.length - 1].xpBonusPercent : 0;

  // Generate 7-day visual week blocks (Mon to Sun)
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6

  return (
    <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden glow-blue space-y-5">
      
      {/* Background Subtle Flame Gradient Aura */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header: Title and Streak Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141B3B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/70 border border-cyan-500/60 flex items-center justify-center text-[#00E5FF] shadow-sm glow-blue">
              <Flame className="w-4 h-4 animate-pulse fill-cyan-400 text-cyan-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] font-bold block">
                [ PROTOCOL: PERSISTENT EXECUTION ]
              </span>
              <h3 className="font-orbitron font-extrabold text-base sm:text-lg text-white tracking-wide">
                DISCIPLINE STREAK COUNTER
              </h3>
            </div>
          </div>
        </div>

        {/* Big Animated Streak Counter Pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl border border-cyan-400/80 bg-gradient-to-r from-[#0C1B40] via-[#08122E] to-cyan-950 text-white flex items-center gap-2.5 shadow-md shadow-cyan-950/60 glow-blue">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
            <div className="text-left">
              <div className="font-orbitron font-black text-xl sm:text-2xl text-white tracking-wider tabular-nums leading-none">
                {streak} <span className="text-xs font-mono text-[#00E5FF] font-normal">DAYS</span>
              </div>
              <span className="text-[9px] font-mono text-cyan-300 uppercase tracking-widest">
                {streak >= 30 ? 'SOVEREIGN MOMENTUM' : 'UNBROKEN CRUCIBLE'}
              </span>
            </div>
          </div>

          {activeXpBonus > 0 && (
            <div className="px-3 py-1.5 rounded-xl border border-emerald-500/60 bg-emerald-950/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>+{activeXpBonus}% XP BOOST</span>
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Consistency Micro-Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            WEEKLY EXECUTION CADENCE
          </span>
          <span className="text-xs font-bold text-slate-300">
            Today: {isTodaySecured ? (
              <span className="text-emerald-400 font-bold">SECURED ({questsCompletedToday} Quests)</span>
            ) : (
              <span className="text-amber-400 font-bold">MANDATE PENDING</span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayDayIndex;
            const isPastDay = idx < todayDayIndex;
            const isCompleted = isPastDay || (isToday && isTodaySecured);

            return (
              <div
                key={day}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  isToday
                    ? isTodaySecured
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 glow-blue'
                      : 'border-cyan-400/80 bg-cyan-950/40 text-cyan-300 animate-pulse'
                    : isCompleted
                    ? 'border-cyan-800/40 bg-[#0A102E] text-cyan-300'
                    : 'border-[#16203D] bg-[#060818]/60 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-mono font-bold tracking-wider">{day}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className={`w-3.5 h-3.5 rounded-full border ${isToday ? 'border-cyan-400 bg-cyan-400/20' : 'border-slate-700'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Milestone Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Next Milestone: <strong className="text-white">{nextMilestone.title} ({nextMilestone.days} Days)</strong>
          </span>
          <span className="text-[#00E5FF] font-bold tabular-nums">
            {streak >= nextMilestone.days ? 'MAX UNLOCKED' : `${nextMilestone.days - streak} days remaining`}
          </span>
        </div>
        <div className="h-2.5 w-full bg-[#050611] rounded-full overflow-hidden border border-[#1A2548] p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_10px_#00E5FF]"
            style={{ width: `${streak >= nextMilestone.days ? 100 : progressPercent}%` }}
          />
        </div>
      </div>

      {/* Visual Streak Milestones & Unlockable Badges Grid */}
      <div className="space-y-2 pt-2 border-t border-[#141B3B]">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            MONARCH STREAK BADGES ({unlockedBadges.length}/{STREAK_MILESTONES.length} UNLOCKED)
          </span>
          <span className="text-[11px] text-[#00E5FF] hidden sm:inline">
            Click badge to inspect lore & XP passive boost
          </span>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {STREAK_MILESTONES.map((milestone) => {
            const isUnlocked = streak >= milestone.days;

            return (
              <button
                key={milestone.id}
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playTap();
                  setSelectedBadge(milestone);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative group flex flex-col items-center justify-between gap-1.5 focus:outline-none ${
                  isUnlocked
                    ? `${milestone.iconColor} ${milestone.glowClass} hover:scale-105`
                    : 'border-slate-800/80 bg-[#050716]/80 text-slate-500 opacity-60 hover:opacity-90 hover:border-slate-700'
                }`}
              >
                {/* Badge Icon / Lock Indicator */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform">
                  {isUnlocked ? (
                    <Award className="w-5 h-5 drop-shadow-[0_0_6px_currentColor]" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                <div className="w-full">
                  <div className={`font-orbitron font-bold text-[11px] truncate leading-tight ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {milestone.title}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-300 font-semibold mt-0.5">
                    {milestone.days}D · +{milestone.xpBonusPercent}% XP
                  </div>
                </div>

                {isUnlocked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badge Details Modal / Inspector */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#080D26] border-2 border-cyan-400 rounded-2xl p-6 max-w-md w-full glow-blue space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center ${selectedBadge.iconColor} ${selectedBadge.glowClass}`}>
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                  [ STREAK MILESTONE BADGE ]
                </span>
                <h4 className="font-orbitron font-black text-xl text-white">
                  {selectedBadge.title}
                </h4>
                <div className="text-xs font-mono text-slate-300">
                  Requirement: {selectedBadge.days} Consecutive Days ({selectedBadge.rankRequirement})
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#1A2548] bg-[#050716] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Status:</span>
                <span className={streak >= selectedBadge.days ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {streak >= selectedBadge.days ? '✓ UNLOCKED & ACTIVE' : `🔒 LOCKED (${selectedBadge.days - streak} days remaining)`}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Passive XP Boost:</span>
                <span className="text-[#00E5FF] font-bold">+{selectedBadge.xpBonusPercent}% XP Multiplier</span>
              </div>
              <p className="text-slate-300 pt-1 leading-relaxed border-t border-[#141B3B]">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-blue-900/40 bg-blue-950/20 text-xs italic text-blue-200/90 font-rajdhani">
              &ldquo;{selectedBadge.lore}&rdquo;
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl border border-cyan-500 bg-cyan-950/60 text-cyan-300 font-orbitron font-bold text-xs hover:bg-cyan-500 hover:text-black transition-all"
            >
              CLOSE BADGE INSPECTION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
