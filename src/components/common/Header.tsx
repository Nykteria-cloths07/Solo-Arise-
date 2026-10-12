import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import {
  Volume2,
  VolumeX,
  Bell,
  Shield,
  Sparkles,
  Activity,
  Edit3,
  Timer,
  Cloud,
  Lock,
  Menu,
  X,
  Zap,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleSound = () => {
    const isPlaying = spaceAudio.toggleAmbient();
    updateSettings({ ambientSound: isPlaying });
  };

  const rankColorMap: Record<string, string> = {
    E: 'text-slate-300 border-slate-600 bg-slate-900/80 shadow-slate-900',
    D: 'text-emerald-300 border-emerald-500/80 bg-emerald-950/80 shadow-emerald-950',
    C: 'text-sky-300 border-sky-500/80 bg-sky-950/80 shadow-sky-950',
    B: 'text-indigo-300 border-indigo-500/80 bg-indigo-950/80 shadow-indigo-950',
    A: 'text-purple-300 border-purple-500/80 bg-purple-950/80 shadow-purple-950',
    S: 'text-amber-300 border-amber-400 bg-amber-950/80 text-glow-gold shadow-amber-950',
    NATIONAL: 'text-rose-300 border-rose-500 bg-rose-950/80 text-glow-red shadow-rose-950',
    SHADOW_MONARCH: 'text-cyan-300 border-cyan-400 bg-cyan-950/90 text-glow-blue shadow-cyan-950',
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full max-w-full overflow-hidden border-b border-[#1A2548]/80 bg-[#050510]/95 backdrop-blur-md transition-colors shadow-lg shadow-black/60">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-2 pb-2 flex items-center justify-between gap-1.5 sm:gap-4 overflow-hidden">
          
          {/* Zone 1: Solo Leveling Logo & Brand Wordmark */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1.5 sm:gap-2.5 text-left focus:outline-none group shrink-0"
              title="System Interface Home"
            >
              <SystemLogo size={24} glow={true} className="shrink-0 sm:scale-110" />
              <div className="min-w-0">
                <span className="font-orbitron font-extrabold text-xs xs:text-sm sm:text-base tracking-wider text-white group-hover:text-[#00E5FF] transition-colors whitespace-nowrap block truncate">
                  SOLO ARISE
                </span>
                <span className="hidden md:inline-block text-[9px] font-mono-system text-[#00E5FF] uppercase tracking-widest font-bold">
                  [SYSTEM]
                </span>
              </div>
            </button>

            {recovery.isActive && (
              <span className="hidden lg:inline-flex px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded border border-purple-500/70 bg-purple-950/70 text-purple-300 shrink-0">
                RECOVERY
              </span>
            )}
          </div>

          {/* Zone 2: Navigation Links (Desktop only) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-rajdhani font-semibold tracking-wide text-slate-300">
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

          {/* Zone 3: Top-Right Controls & Responsive Hunter Identity (Guaranteed Zero Mobile Overflow) */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 shrink-0 min-w-0">
            
            {/* Desktop: Cloud Vault Button */}
            {currentUser ? (
              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playTap();
                  setShowAuthModal(true);
                }}
                className="hidden sm:flex px-2.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 font-mono text-xs font-bold transition-all items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                title={`Hunter Account: ${currentUser.email} • Click to inspect Cloud Vault`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden xl:inline font-orbitron text-[10px] tracking-wider text-emerald-400">
                  {cloudSyncStatus === 'syncing' ? 'SYNCING...' : 'VAULT SAFE'}
                </span>
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playTap();
                  setShowAuthModal(true);
                }}
                className="hidden sm:flex px-3 py-1.5 rounded-xl border border-cyan-400/80 bg-gradient-to-r from-blue-950 to-cyan-950 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-orbitron font-extrabold text-xs tracking-wider transition-all items-center gap-1.5 shadow-sm shrink-0 group cursor-pointer"
                title="Sign in with Google to securely store all hunter progress in the cloud vault"
              >
                <Cloud className="w-3.5 h-3.5 animate-pulse text-[#00E5FF] group-hover:text-black" />
                <span>LOGIN / SYNC</span>
              </button>
            )}

            {/* Desktop: Focus Timer Button */}
            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                setShowFocusModal(true);
              }}
              className="hidden sm:flex px-3 py-1.5 rounded-xl border border-[#00E5FF]/60 bg-[#00E5FF]/15 text-[#00E5FF] font-mono font-bold text-xs hover:bg-[#00E5FF] hover:text-black transition-all items-center gap-1.5 shadow-sm glow-blue shrink-0"
              title="Open Pomodoro Deep Work Focus Session"
            >
              <Timer className="w-3.5 h-3.5 animate-spin-slow" />
              <span>FOCUS VOID</span>
            </button>

            {/* Space Ambient Audio Toggle (Available on all screen sizes) */}
            <button
              onClick={toggleSound}
              aria-label="Toggle Real Space Ambience"
              title={settings.ambientSound ? 'Mute Deep Space Frequencies' : 'Activate Real NASA Space Ambience'}
              className={`p-1.5 rounded-lg border transition-all shrink-0 ${
                settings.ambientSound
                  ? 'border-[#00E5FF]/60 bg-[#00E5FF]/20 text-[#00E5FF] shadow-sm shadow-cyan-900'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {settings.ambientSound ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>

            {/* Desktop: Hunter Radar Stats */}
            <button
              onClick={() => setActiveTab('stats')}
              aria-label="Hunter Statistics"
              title="Hunter Status Radar"
              className={`hidden sm:flex p-1.5 rounded-lg border transition-all shrink-0 ${
                activeTab === 'stats'
                  ? 'border-[#4D9FFF] bg-[#4D9FFF]/20 text-[#4D9FFF]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Desktop: Notifications */}
            <button
              onClick={() => setActiveTab('notifications')}
              aria-label="System Notifications"
              title="System Alerts"
              className={`hidden sm:flex relative p-1.5 rounded-lg border transition-all shrink-0 ${
                activeTab === 'notifications'
                  ? 'border-[#4D9FFF] bg-[#4D9FFF]/20 text-[#4D9FFF]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* =========================================================================
                THE TOP-RIGHT HEXAGONAL ICON & E-RANK BADGE (Scales Responsively on Mobile)
                ========================================================================= */}
            <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
              
              {/* Futuristic Hexagonal Hunter Avatar Badge */}
              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playTap();
                  setShowAvatarModal(true);
                }}
                className="relative group shrink-0 focus:outline-none transition-transform active:scale-95 p-0.5"
                title="Hunter Identity & Avatar (Click to edit designation)"
                aria-label="Hunter Profile Customizer"
              >
                {/* Outer Hexagonal Frame with Monarch Cyan Border */}
                <div
                  className="w-7 h-7 xs:w-7.5 xs:h-7.5 sm:w-8 sm:h-8 flex items-center justify-center bg-gradient-to-br from-[#00E5FF] via-[#1A2D69] to-black p-[1.5px] transition-all group-hover:glow-blue"
                  style={{
                    clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                  }}
                >
                  {/* Inner Hexagonal Avatar Image / Rank Icon */}
                  <div
                    className="w-full h-full bg-[#050614] flex items-center justify-center overflow-hidden"
                    style={{
                      clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                    }}
                  >
                    {hunter.avatarUrl ? (
                      <img
                        src={hunter.avatarUrl}
                        alt={hunter.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <span className="font-orbitron font-black text-[10px] sm:text-xs text-[#00E5FF]">
                        {hunter.rank}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cloud Sync Online Indicator Dot */}
                {currentUser && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-black shadow-[0_0_6px_#10B981]"
                    title="Cloud Vault Linked & Synced"
                  />
                )}
              </button>

              {/* Responsively-Scaled Rank Badge (e.g. E-RANK) */}
              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playTap();
                  setActiveTab('stats');
                }}
                className={`px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-xs font-mono font-bold rounded border ${
                  rankColorMap[hunter.rank] || rankColorMap.E
                } flex items-center gap-0.5 xs:gap-1 shrink-0 shadow-sm cursor-pointer hover:brightness-110 transition-all`}
                title={`Rank: ${hunter.rank}-Rank (Level ${hunter.level}) · Click to open Status Radar`}
              >
                <span className="tracking-tight whitespace-nowrap">{hunter.rank}-RANK</span>
                <span className="hidden xs:inline text-[8px] sm:text-[10px] opacity-75 font-normal">
                  LV.{hunter.level}
                </span>
              </button>
            </div>

            {/* Desktop: Settings Button */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`hidden sm:block px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium tracking-wide transition-all shrink-0 ${
                activeTab === 'settings'
                  ? 'border-[#4D9FFF] bg-[#4D9FFF] text-black font-bold'
                  : 'border-[#1A2548] bg-[#0E152E]/80 text-[#8899BB] hover:text-white hover:border-[#4D9FFF]/50'
              }`}
            >
              SETTINGS
            </button>

            {/* Mobile Hamburger Command Menu Trigger */}
            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                setMobileMenuOpen((prev) => !prev);
              }}
              aria-label="Open Mobile Navigation"
              className="p-1.5 rounded-lg border border-[#1A2548] bg-[#0A0E26] text-slate-300 hover:text-white sm:hidden relative shrink-0"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#00E5FF]" /> : <Menu className="w-4 h-4 text-cyan-400" />}
              {unreadCount > 0 && !mobileMenuOpen && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer Overlay (Includes Quick Cloud Vault & Focus Session) */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#1A2548] bg-[#050614]/98 px-3.5 py-3 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
            
            {/* Mobile Cloud Vault / Google Login Row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playTap();
                  setMobileMenuOpen(false);
                  setShowAuthModal(true);
                }}
                className={`flex-1 p-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                  currentUser
                    ? 'border-emerald-500/60 bg-emerald-950/50 text-emerald-300'
                    : 'border-cyan-400/80 bg-gradient-to-r from-blue-950 to-cyan-950 text-[#00E5FF]'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{currentUser ? `VAULT: ${currentUser.email?.split('@')[0]}` : 'LINK CLOUD VAULT'}</span>
              </button>

              <button
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playTap();
                  setMobileMenuOpen(false);
                  setShowFocusModal(true);
                }}
                className="p-2 rounded-xl border border-cyan-500/60 bg-cyan-950/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Timer className="w-3.5 h-3.5" />
                <span>FOCUS VOID</span>
              </button>
            </div>

            {/* Mobile Tab Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-xs font-rajdhani font-bold">
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activeTab === 'dashboard' ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]' : 'border-slate-800 bg-[#090D22] text-slate-300'
                }`}
              >
                SYSTEM HUD
              </button>
              <button
                onClick={() => {
                  setActiveTab('quests');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activeTab === 'quests' ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]' : 'border-slate-800 bg-[#090D22] text-slate-300'
                }`}
              >
                QUEST LOG
              </button>
              <button
                onClick={() => {
                  setActiveTab('habits');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activeTab === 'habits' ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]' : 'border-slate-800 bg-[#090D22] text-slate-300'
                }`}
              >
                HABIT FORGE
              </button>
              <button
                onClick={() => {
                  setActiveTab('ai-coach');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  activeTab === 'ai-coach' ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]' : 'border-slate-800 bg-[#090D22] text-slate-300'
                }`}
              >
                <span>GOGGINS AI</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('gate');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activeTab === 'gate' ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]' : 'border-slate-800 bg-[#090D22] text-slate-300'
                }`}
              >
                GATE ARCHIVE
              </button>
              <button
                onClick={() => {
                  setActiveTab('license');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  activeTab === 'license' ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]' : 'border-slate-800 bg-[#090D22] text-slate-300'
                }`}
              >
                HUNTER LICENSE
              </button>
            </div>

            {/* Mobile Secondary Row: Stats, Notifications, Settings */}
            <div className="flex items-center justify-between pt-2 border-t border-[#141B3B] text-xs font-mono">
              <button
                onClick={() => {
                  setActiveTab('stats');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>RADAR STATS</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('notifications');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white relative"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>ALERTS {unreadCount > 0 && `(${unreadCount})`}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                <span>SETTINGS</span>
              </button>
            </div>
          </div>
        )}

        {/* VISUAL XP PROGRESS BAR BENEATH HEADER (Displays Top 1% Discipline Percentile) */}
        <div className="w-full bg-[#03040C]/95 border-t border-[#121936] px-3 sm:px-6 py-1.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] font-mono">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
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
              <span className="text-cyan-400 font-bold text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/80">
                [{rankProgress.percentileLabel}]
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
              <span className="text-slate-400">
                Mana: <strong className="text-[#00E5FF] tabular-nums">{hunter.xp}</strong> / <span className="tabular-nums">{hunter.nextLevelXp} XP</span>
              </span>
              <span className="text-cyan-300 font-bold tabular-nums">
                {rankProgress.progressPercent}% Toward Rank Promotion
              </span>
            </div>
          </div>

          {/* Animated Glow Progress Bar */}
          <div className="max-w-7xl mx-auto h-2 w-full bg-[#010207] rounded-full overflow-hidden mt-1 border border-[#141B3B] p-0.5">
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
