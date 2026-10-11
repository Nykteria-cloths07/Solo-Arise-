import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import {
  Volume2,
  VolumeX,
  Bell,
  Shield,
  Sparkles,
  Activity,
  User,
  Edit3,
  Target,
  Timer,
  Cloud,
  Lock,
} from 'lucide-react';
import { spaceAudio } from '../../audio/spaceAudio';
import { SystemLogo } from './SystemLogo';
import { AvatarCustomizerModal } from './AvatarCustomizerModal';
import { FocusSessionModal } from '../focus/FocusSessionModal';
import { AuthModal } from '../auth/AuthModal';

export const Header: React.FC = () => {
  const {
    hunter,
    recovery,
    notifications,
    settings,
    updateSettings,
    activeTab,
    setActiveTab,
    rankProgress,
    currentUser,
    cloudSyncStatus,
  } = useSystem();

  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showFocusModal, setShowFocusModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleSound = () => {
    const isPlaying = spaceAudio.toggleAmbient();
    updateSettings({ ambientSound: isPlaying });
  };

  const rankColorMap: Record<string, string> = {
    E: 'text-slate-400 border-slate-600 bg-slate-900/60',
    D: 'text-emerald-400 border-emerald-600 bg-emerald-950/60',
    C: 'text-sky-400 border-sky-600 bg-sky-950/60',
    B: 'text-indigo-400 border-indigo-600 bg-indigo-950/60',
    A: 'text-purple-400 border-purple-600 bg-purple-950/60',
    S: 'text-amber-400 border-amber-500 bg-amber-950/60 text-glow-gold',
    NATIONAL: 'text-rose-400 border-rose-500 bg-rose-950/60 text-glow-red',
    SHADOW_MONARCH: 'text-cyan-300 border-cyan-400 bg-cyan-950/70 text-glow-blue',
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1A2548]/80 bg-[#050510]/95 backdrop-blur-md transition-colors shadow-lg shadow-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Zone 1: Solo Leveling Logo & Hunter Avatar / Identity Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* System Logo with wordmark */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
              title="System Interface Home"
            >
              <SystemLogo size={34} glow={true} />
              <div>
                <span className="font-orbitron font-extrabold text-base sm:text-lg tracking-wider text-white group-hover:text-[#00E5FF] transition-colors whitespace-nowrap">
                  SOLO ARISE
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono-system text-[#00E5FF] uppercase tracking-widest font-bold">
                  [SYSTEM]
                </span>
              </div>
            </button>

            {/* Hunter Avatar with Click-to-Customize */}
            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                setShowAvatarModal(true);
              }}
              className="relative group p-0.5 rounded-xl border border-[#1A2548] hover:border-[#00E5FF] transition-all bg-[#0A0E26]"
              title="Customize Hunter Avatar & Designation"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                {hunter.avatarUrl ? (
                  <img
                    src={hunter.avatarUrl}
                    alt={hunter.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Shield className="w-4 h-4 text-[#00E5FF]" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00E5FF] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </button>

            {/* Rank Badge */}
            <div
              className={`px-2 py-0.5 text-xs font-mono font-bold rounded border ${rankColorMap[hunter.rank] || rankColorMap.E} flex items-center gap-1 shrink-0`}
            >
              <span>{hunter.rank}-RANK</span>
              <span className="text-[10px] opacity-70">LV.{hunter.level}</span>
            </div>

            {recovery.isActive && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded border border-purple-500/70 bg-purple-950/70 text-purple-300 shrink-0">
                RECOVERY
              </span>
            )}
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-rajdhani font-semibold tracking-wide text-slate-300">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-[#00E5FF] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'dashboard' ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] pb-0.5' : ''
              }`}
            >
              SYSTEM HUD
            </button>
            <button
              onClick={() => setActiveTab('quests')}
              className={`hover:text-[#00E5FF] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'quests' ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] pb-0.5' : ''
              }`}
            >
              QUEST LOG
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`hover:text-[#00E5FF] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'habits' ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] pb-0.5' : ''
              }`}
            >
              HABIT FORGE
            </button>
            <button
              onClick={() => setActiveTab('ai-coach')}
              className={`hover:text-[#00E5FF] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                activeTab === 'ai-coach' ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] pb-0.5' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              GOGGINS AI
            </button>
            <button
              onClick={() => setActiveTab('gate')}
              className={`hover:text-[#00E5FF] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'gate' ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] pb-0.5' : ''
              }`}
            >
              GATE ARCHIVE
            </button>
            <button
              onClick={() => setActiveTab('license')}
              className={`hover:text-[#00E5FF] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'license' ? 'text-[#00E5FF] border-b-2 border-[#00E5FF] pb-0.5' : ''
              }`}
            >
              HUNTER LICENSE
            </button>
          </nav>

          {/* Zone 3: Audio & Control Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* CLOUD VAULT / HUNTER LOGIN BUTTON */}
            {currentUser ? (
              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playTap();
                  setShowAuthModal(true);
                }}
                className="px-2.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 hover:border-emerald-400 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-950"
                title={`Hunter Account: ${currentUser.email} • Click to inspect Cloud Vault`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden xl:inline font-orbitron text-[10px] tracking-wider text-emerald-400">
                  {cloudSyncStatus === 'syncing' ? 'SYNCING...' : 'VAULT SAFE'}
                </span>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Hunter avatar"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full border border-emerald-400/60 object-cover"
                  />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playTap();
                  setShowAuthModal(true);
                }}
                className="px-3 py-1.5 rounded-xl border border-cyan-400/80 bg-gradient-to-r from-blue-950 via-[#0E1A40] to-cyan-950 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-orbitron font-extrabold text-xs tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-cyan-950 hover:shadow-cyan-400/40 cursor-pointer group"
                title="Sign in with Google to securely store all hunter progress in the cloud vault"
              >
                <Cloud className="w-3.5 h-3.5 animate-pulse text-[#00E5FF] group-hover:text-black" />
                <span className="hidden sm:inline">LOGIN / SYNC</span>
                <span className="sm:hidden">LOGIN</span>
              </button>
            )}

            {/* FOCUS TIMER TRIGGER BUTTON */}
            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                setShowFocusModal(true);
              }}
              className="px-3 py-1.5 rounded-xl border border-[#00E5FF]/60 bg-[#00E5FF]/15 text-[#00E5FF] font-mono font-bold text-xs hover:bg-[#00E5FF] hover:text-black transition-all flex items-center gap-1.5 shadow-sm glow-blue"
              title="Open Pomodoro Deep Work Focus Session"
            >
              <Timer className="w-4 h-4 animate-spin-slow" />
              <span className="hidden sm:inline">FOCUS VOID</span>
            </button>

            {/* Ambient Real Space Sound Toggle */}
            <button
              onClick={toggleSound}
              aria-label="Toggle Real Space Ambience"
              title={settings.ambientSound ? 'Mute Deep Space Frequencies' : 'Activate Real NASA Space Ambience'}
              className={`p-2 rounded-lg border transition-all ${
                settings.ambientSound
                  ? 'border-[#00E5FF]/60 bg-[#00E5FF]/15 text-[#00E5FF] shadow-sm shadow-cyan-900'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {settings.ambientSound ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Hunter Radar Stats */}
            <button
              onClick={() => setActiveTab('stats')}
              aria-label="Hunter Statistics"
              title="Hunter Status Radar"
              className={`p-2 rounded-lg border transition-all ${
                activeTab === 'stats'
                  ? 'border-[#4D9FFF] bg-[#4D9FFF]/20 text-[#4D9FFF]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setActiveTab('notifications')}
              aria-label="System Notifications"
              title="System Alerts"
              className={`relative p-2 rounded-lg border transition-all ${
                activeTab === 'notifications'
                  ? 'border-[#4D9FFF] bg-[#4D9FFF]/20 text-[#4D9FFF]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium tracking-wide transition-all ${
                activeTab === 'settings'
                  ? 'border-[#4D9FFF] bg-[#4D9FFF] text-black font-bold'
                  : 'border-[#1A2548] bg-[#0E152E]/80 text-[#8899BB] hover:text-white hover:border-[#4D9FFF]/50'
              }`}
            >
              SETTINGS
            </button>
          </div>

        </div>

        {/* VISUAL XP PROGRESS BAR BENEATH HEADER (Displays Top 1% Discipline Percentile) */}
        <div className="w-full bg-[#03040C]/95 border-t border-[#121936] px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#00E5FF] font-bold tracking-wider">
                DISCIPLINE TIER:
              </span>
              <span className="text-white font-semibold">
                {rankProgress.currentRank}-RANK (LV.{rankProgress.currentLevel})
              </span>
              <span className="text-slate-500">→</span>
              <span className="text-amber-400 font-bold">
                {rankProgress.nextRank === 'MAX' ? 'SHADOW MONARCH' : `${rankProgress.nextRank}-RANK`}
              </span>
              <span className="text-cyan-400 font-bold text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/80">
                [{rankProgress.percentileLabel}]
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400">
                Mana: <strong className="text-[#00E5FF] tabular-nums">{hunter.xp}</strong> / <span className="tabular-nums">{hunter.nextLevelXp} XP</span>
              </span>
              <span className="text-cyan-300 font-bold tabular-nums">
                {rankProgress.progressPercent}% Toward Rank Promotion
              </span>
            </div>
          </div>

          {/* Animated Glow Progress Bar */}
          <div className="max-w-7xl mx-auto h-2.5 w-full bg-[#010207] rounded-full overflow-hidden mt-1.5 border border-[#141B3B] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#FFD700] rounded-full transition-all duration-500 shadow-[0_0_12px_#00E5FF]"
              style={{ width: `${Math.min(100, Math.max(2, rankProgress.progressPercent))}%` }}
            />
          </div>
        </div>
      </header>

      {/* Avatar Customization Modal */}
      <AvatarCustomizerModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />

      {/* Focus Session Pomodoro Modal */}
      <FocusSessionModal
        isOpen={showFocusModal}
        onClose={() => setShowFocusModal(false)}
      />

      {/* Hunter Cloud Login & Vault Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
