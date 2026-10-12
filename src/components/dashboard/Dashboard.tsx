import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import { DisciplineConsistencyChart } from './DisciplineConsistencyChart';
import { DisciplineStreakCard } from './DisciplineStreakCard';
import { AvatarCustomizerModal } from '../common/AvatarCustomizerModal';
import { FocusSessionModal } from '../focus/FocusSessionModal';
import { AuthModal } from '../auth/AuthModal';
import { ICON_MAP } from '../quests/QuestLog';
import {
  Swords,
  Flame,
  Sparkles,
  Bot,
  HeartPulse,
  Zap,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Activity,
  AlertTriangle,
  Plus,
  Camera,
  Edit3,
  Timer,
  Play,
  Cloud,
  Lock,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    hunter,
    dailyQuests,
    challenges,
    recovery,
    focusSessions,
    completeQuest,
    enterRecoveryMode,
    ariseFromRecovery,
    setActiveTab,
    settings,
    currentUser,
    cloudSyncStatus,
  } = useSystem();

  const [statsExpanded, setStatsExpanded] = useState<boolean>(true);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showFocusModal, setShowFocusModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Active challenge
  const activeChallenge = challenges.find((c) => c.isAccepted && !c.isCompleted);

  // Today's completed quest count
  const completedQuestCount = dailyQuests.filter((q) => q.completed).length;
  const questProgressPercent = Math.round((completedQuestCount / Math.max(1, dailyQuests.length)) * 100);

  // Rotating quotes
  const disciplineQuotes = [
    '“The System does not care about your feelings. It only measures your discipline.” — Sung Jinwoo Protocol',
    '“Don’t stop when you’re tired. Stop when you’re done.” — David Goggins',
    '“You must be willing to suffer the pain of discipline or suffer the pain of regret.” — Hunter Association Mandate',
    '“The only easy day was yesterday. Arise and conquer the crucible.” — Shadow Monarch Doctrine',
    '“You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.” — Goggins',
  ];

  const [quoteIndex] = useState<number>(() => Math.floor(Math.random() * disciplineQuotes.length));

  const statsList = [
    { key: 'strength', label: 'STR · Strength', val: hunter.stats.strength, max: 100, color: 'bg-red-500' },
    { key: 'endurance', label: 'END · Endurance', val: hunter.stats.endurance, max: 100, color: 'bg-amber-500' },
    { key: 'stamina', label: 'STM · Stamina', val: hunter.stats.stamina, max: 100, color: 'bg-emerald-500' },
    { key: 'agility', label: 'AGI · Agility', val: hunter.stats.agility, max: 100, color: 'bg-cyan-500' },
    { key: 'mentalFortitude', label: 'MNT · Mental Fortitude', val: hunter.stats.mentalFortitude, max: 100, color: 'bg-indigo-500' },
    { key: 'recovery', label: 'REC · Cellular Recovery', val: hunter.stats.recovery, max: 100, color: 'bg-purple-500' },
  ];

  const handleQuestCheck = (id: string) => {
    completeQuest(id);
  };

  const renderIcon = (iconName?: string) => {
    const IconComp = (iconName && ICON_MAP[iconName]) || Swords;
    return <IconComp className="w-4 h-4 text-[#00E5FF]" />;
  };

  const xpPercent = Math.min(100, Math.round((hunter.xp / hunter.nextLevelXp) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">

      {/* 1. TOP HUNTER STATUS CARD & XP BAR */}
      <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden glow-blue">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            {/* Clickable Hunter Avatar with Edit trigger */}
            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                setShowAvatarModal(true);
              }}
              className="relative group shrink-0 focus:outline-none"
              title="Click to customize avatar photo and name"
            >
              <div className="w-16 h-16 rounded-2xl border-2 border-[#00E5FF] overflow-hidden bg-gradient-to-br from-[#00E5FF]/20 via-[#1A2D69] to-black flex items-center justify-center glow-blue text-white shadow-lg">
                {hunter.avatarUrl ? (
                  <img
                    src={hunter.avatarUrl}
                    alt={hunter.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="font-bebas text-3xl text-[#00E5FF]">{hunter.rank}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-[#00E5FF] text-black flex items-center justify-center shadow-md">
                <Edit3 className="w-3 h-3 stroke-[3]" />
              </div>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white tracking-wide">
                  {hunter.name}
                </h1>
                <span className="text-xs font-mono text-[#8899BB]">
                  [{hunter.hunterClass.toUpperCase()}]
                </span>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="text-[10px] text-[#00E5FF] font-mono hover:underline hidden sm:inline-block"
                >
                  [EDIT PROFILE]
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#8899BB] mt-0.5">
                <span className="text-white font-bold">LEVEL {hunter.level}</span>
                <span>·</span>
                <span>ID: {hunter.hunterId}</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">{hunter.consecutiveStreak} DAY STREAK</span>
              </div>
            </div>
          </div>

          {/* System & Cloud Vault Status Indicators */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Cloud Vault Link / Safe Badge */}
            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                setShowAuthModal(true);
              }}
              className={`px-3 py-1 rounded-full border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentUser
                  ? 'border-emerald-500/60 bg-emerald-950/70 text-emerald-300 hover:border-emerald-400'
                  : 'border-cyan-400/60 bg-gradient-to-r from-blue-950 to-cyan-950 text-[#00E5FF] hover:border-[#00E5FF] shadow-sm shadow-cyan-950'
              }`}
              title={currentUser ? 'Cloud Vault Active • Click to manage' : 'Data stored locally • Click to link Google Account'}
            >
              <Cloud className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
              <span>{currentUser ? (cloudSyncStatus === 'syncing' ? 'VAULT SYNCING...' : 'VAULT SAFE') : 'LINK ACCOUNT'}</span>
            </button>

            {recovery.isActive ? (
              <div className="px-3 py-1 rounded-full border border-purple-500/80 bg-purple-950/80 text-purple-300 font-mono text-xs flex items-center gap-1.5 glow-violet">
                <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
                <span>RECOVERY MODE ACTIVE</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full border border-emerald-500/80 bg-emerald-950/60 text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SYSTEM ACTIVE</span>
              </div>
            )}
          </div>
        </div>

        {/* XP PROGRESS BAR */}
        <div className="space-y-1.5 pt-2 border-t border-[#141B3B]">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#8899BB]">SYSTEM MANA & XP PROGRESS</span>
            <span className="text-white font-bold tabular-nums">
              {hunter.xp} / {hunter.nextLevelXp} XP ({xpPercent}%)
            </span>
          </div>
          <div className="h-3 w-full bg-[#050611] rounded-full overflow-hidden border border-[#1A2548] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#8899BB] rounded-full transition-all duration-500 shadow-[0_0_12px_#00E5FF]"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. RECOVERY ALERT / CALL TO ARISE (Prominent CTA) */}
      {recovery.isActive && (
        <div className="p-6 rounded-2xl border-2 border-purple-500/70 bg-gradient-to-r from-purple-950/60 via-[#0B0A1E] to-purple-950/60 backdrop-blur-md glow-violet flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-purple-400 font-mono text-xs uppercase font-bold tracking-wider">
              <HeartPulse className="w-4 h-4 animate-pulse" />
              <span>BIOLOGICAL REGENERATION IN PROGRESS</span>
            </div>
            <h3 className="font-orbitron font-bold text-xl text-white">
              RECOVERING FROM {recovery.reason.toUpperCase()} (DAY {recovery.daysInRecovery})
            </h3>
            <p className="text-xs text-purple-200/80 font-rajdhani">
              Penalties are locked. Ready to return to the crucible? Re-awaken for +500 Recovery Bonus XP.
            </p>
          </div>

          <button
            onClick={ariseFromRecovery}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-purple-600 text-white font-orbitron font-extrabold text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all glow-blue shrink-0"
          >
            ARISE & RESUME THE HUNT
          </button>
        </div>
      )}

      {/* DISCIPLINE STREAK COUNTER & MILESTONES */}
      <DisciplineStreakCard />

      {/* 3. QUICK STATS CARDS & SHORTCUTS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => {
            if (settings.sfxSound) spaceAudio.playTap();
            setActiveTab('ai-coach');
          }}
          className="p-4 rounded-xl border border-[#1A2548] bg-[#0A0D22] hover:border-[#00E5FF]/80 hover:glow-blue transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400 mb-2.5 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-[#00E5FF] transition-colors">
            GOGGINS AI
          </h4>
          <p className="text-[11px] font-mono text-[#8899BB] mt-0.5">
            Brutal Accountability
          </p>
        </button>

        <button
          onClick={() => {
            if (settings.sfxSound) spaceAudio.playTap();
            setActiveTab('quests');
          }}
          className="p-4 rounded-xl border border-[#1A2548] bg-[#0A0D22] hover:border-[#4D9FFF]/80 hover:glow-blue transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-cyan-400 mb-2.5 group-hover:scale-105 transition-transform">
            <Swords className="w-5 h-5" />
          </div>
          <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-[#4D9FFF] transition-colors">
            QUEST LOG
          </h4>
          <p className="text-[11px] font-mono text-[#8899BB] mt-0.5">
            {dailyQuests.filter((q) => !q.completed).length} Active Quests
          </p>
        </button>

        <button
          onClick={() => {
            if (settings.sfxSound) spaceAudio.playTap();
            setActiveTab('habits');
          }}
          className="p-4 rounded-xl border border-[#1A2548] bg-[#0A0D22] hover:border-amber-500/80 hover:glow-gold transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/80 flex items-center justify-center text-amber-400 mb-2.5 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
            HABIT FORGE
          </h4>
          <p className="text-[11px] font-mono text-[#8899BB] mt-0.5">
            Overload Streaks
          </p>
        </button>

        <button
          onClick={() => {
            if (settings.sfxSound) spaceAudio.playTap();
            setActiveTab('gate');
          }}
          className="p-4 rounded-xl border border-[#1A2548] bg-[#0A0D22] hover:border-purple-500/80 hover:glow-violet transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-800/80 flex items-center justify-center text-purple-400 mb-2.5 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-purple-400 transition-colors">
            GATE ARCHIVE
          </h4>
          <p className="text-[11px] font-mono text-[#8899BB] mt-0.5">
            Paranormal & 4D
          </p>
        </button>
      </div>

      {/* 4. ACTIVE MULTI-DAY CHALLENGE BANNER */}
      {activeChallenge ? (
        <div className="p-5 rounded-2xl border border-[#4D9FFF]/40 bg-gradient-to-r from-[#0C1236] to-[#07091B] backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-red-500/80 bg-red-950/60 text-red-300">
                {activeChallenge.difficultyLabel}
              </span>
              <span className="font-mono text-xs text-[#00E5FF]">
                DAY {activeChallenge.currentDay} OF {activeChallenge.durationDays}
              </span>
            </div>
            <h3 className="font-orbitron font-bold text-lg text-white">
              {activeChallenge.title}
            </h3>
            <p className="text-xs text-[#8899BB] max-w-xl font-rajdhani">
              {activeChallenge.description}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('quests')}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl border border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] font-orbitron font-bold text-xs hover:bg-[#00E5FF]/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>VIEW IN QUEST LOG</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-[#1A2548] bg-[#080B1E]/40 flex items-center justify-between">
          <div className="text-xs font-mono text-[#8899BB]">
            No brutal multi-day challenge accepted yet. Ready to push your limits?
          </div>
          <button
            onClick={() => setActiveTab('quests')}
            className="px-3 py-1.5 rounded-lg border border-[#00E5FF] text-[#00E5FF] text-xs font-mono hover:bg-[#00E5FF]/10"
          >
            BROWSE 35+ CHALLENGES
          </button>
        </div>
      )}

      {/* 5. DEEP WORK FOCUS CRUCIBLE BANNER (POMODORO) */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#00E5FF]/60 bg-gradient-to-r from-[#070F2E] via-[#05081C] to-[#0A1636] flex flex-col sm:flex-row sm:items-center justify-between gap-4 glow-blue">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl border border-[#00E5FF] bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0">
            <Timer className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-bold uppercase">
                POMODORO VOID
              </span>
              <span className="text-xs font-mono text-slate-400">
                HabitForge Linked · Real Space Audio
              </span>
            </div>
            <h3 className="font-orbitron font-extrabold text-base sm:text-lg text-white mt-0.5">
              DEEP WORK FOCUS SESSION TIMER
            </h3>
            <p className="text-xs font-mono text-[#8899BB]">
              {focusSessions.length} sessions completed · {focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0)}m logged in the void
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (settings.sfxSound) spaceAudio.playTap();
            setShowFocusModal(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-black text-xs tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>START FOCUS SESSION</span>
        </button>
      </div>

      {/* 6. DATA VISUALIZATION: WEEKLY DISCIPLINE CONSISTENCY (RECHARTS) */}
      <DisciplineConsistencyChart />

      {/* 6. TODAY'S SYSTEM QUESTS & CUSTOMIZATION LINK */}
      <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-5 sm:p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#141B3B]">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-[#00E5FF]" />
              <h3 className="font-orbitron font-bold text-base text-white tracking-wide">
                TODAY&apos;S SYSTEM MANDATES (DAILY QUOTAS)
              </h3>
            </div>
            <p className="text-xs font-mono text-[#8899BB] mt-0.5">
              Completion Rate: {completedQuestCount}/{dailyQuests.length} ({questProgressPercent}%)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('quests')}
              className="text-xs font-mono font-bold text-[#00E5FF] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>CUSTOMIZE QUESTS / HABITS</span>
            </button>

            <button
              onClick={() => setActiveTab('quests')}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>FULL LOG</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {dailyQuests.slice(0, 5).map((quest) => (
            <div
              key={quest.id}
              onClick={() => handleQuestCheck(quest.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                quest.completed
                  ? 'border-emerald-500/40 bg-emerald-950/20 opacity-70'
                  : 'border-[#1A2548] bg-[#0A0D22] hover:border-[#00E5FF]/60 hover:glow-blue'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  aria-label={quest.completed ? "Mark incomplete" : "Complete quest"}
                  className="shrink-0"
                >
                  {quest.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-[#00E5FF]" />
                  )}
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0E1535] border border-[#1E2D60] flex items-center justify-center shrink-0">
                    {renderIcon(quest.icon)}
                  </div>
                  <div>
                    <h4
                      className={`font-rajdhani font-bold text-base ${
                        quest.completed ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {quest.title}
                    </h4>
                    <p className="text-xs text-[#8899BB] line-clamp-1">
                      {quest.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-xs font-bold text-[#00E5FF] tabular-nums">
                  +{quest.xpReward} XP
                </span>
                <div className="text-[10px] font-mono text-slate-500 uppercase">
                  {quest.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. STATS HUD PANEL (Collapsible) */}
      <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-5 sm:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-[#141B3B]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="font-orbitron font-bold text-base text-white tracking-wide">
              HUNTER STATS & VESSEL CALIBRATION
            </h3>
          </div>

          <button
            onClick={() => setStatsExpanded(!statsExpanded)}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
          >
            <span>{statsExpanded ? 'COLLAPSE' : 'EXPAND'}</span>
            {statsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {statsExpanded && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            {statsList.map((st) => (
              <div key={st.key} className="p-3.5 rounded-xl border border-[#141B3B] bg-[#050716]/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#8899BB]">{st.label}</span>
                  <span className="text-white font-bold tabular-nums">{st.val}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${st.color} rounded-full`}
                    style={{ width: `${Math.min(100, (st.val / st.max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. ROTATING DISCIPLINE QUOTE FOOTER */}
      <div className="p-4 rounded-xl border border-[#141B3B] bg-[#050612]/70 text-center">
        <p className="font-mono-system text-xs text-[#8899BB] leading-relaxed">
          {disciplineQuotes[quoteIndex]}
        </p>
      </div>

      {/* Avatar Modal */}
      <AvatarCustomizerModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />

      {/* Focus Session Modal */}
      <FocusSessionModal
        isOpen={showFocusModal}
        onClose={() => setShowFocusModal(false)}
      />

      {/* Cloud Vault & Google Login Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

    </div>
  );
};
