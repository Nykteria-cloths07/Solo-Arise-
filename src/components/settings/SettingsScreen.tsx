import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import { AvatarCustomizerModal } from '../common/AvatarCustomizerModal';
import { AuthModal } from '../auth/AuthModal';
import {
  Settings,
  Volume2,
  VolumeX,
  Play,
  Download,
  Trash2,
  Smartphone,
  Shield,
  Palette,
  Sparkles,
  User,
  Radio,
  RotateCcw,
  Cloud,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    hunter,
    settings,
    updateSettings,
    setShowCinematicIntro,
    resetAllSystemData,
    dailyQuests,
    challenges,
    habits,
    researchNotes,
    currentUser,
    cloudSyncStatus,
    lastCloudSync,
    selectedAwakeningCharacter,
    setSelectedAwakeningCharacter,
    replayAwakeningIntro,
  } = useSystem();

  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
  };

  const handleExportData = () => {
    if (settings.sfxSound) spaceAudio.playTap();
    const fullBackup = {
      hunter,
      dailyQuests,
      challenges,
      habits,
      researchNotes,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOLO_ARISE_${hunter.hunterId}_BACKUP.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetConfirmation = () => {
    if (confirm('CRITICAL: Purge all hunter progress, rank, quests, and habits? This cannot be undone.')) {
      resetAllSystemData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">

      {/* HEADER */}
      <div className="pb-4 border-b border-[#1A2548]">
        <span className="font-mono-system text-xs uppercase tracking-widest text-[#00E5FF] font-bold">
          [ CONTROL MATRIX ]
        </span>
        <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-0.5 tracking-wider">
          SYSTEM SETTINGS
        </h1>
      </div>

      {/* CLOUD VAULT & GOOGLE AUTHENTICATION */}
      <div className="bg-[#080B1F]/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md space-y-4 glow-blue">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#141B3B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5 text-[#00E5FF] animate-pulse" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-base text-white tracking-wide">
                MONARCH CLOUD VAULT (FIREBASE)
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Encrypted cloud persistence, rank security, and multi-device account sync.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              setShowAuthModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-950 via-[#0C1940] to-cyan-950 border border-cyan-400 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-orbitron font-bold text-xs tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
          >
            {currentUser ? 'MANAGE CLOUD VAULT' : 'SIGN IN WITH GOOGLE'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono bg-[#0A0E26]/80 p-3.5 rounded-xl border border-cyan-950">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${currentUser ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-300">
              SECURITY STATUS:{' '}
              <strong className={currentUser ? 'text-emerald-400' : 'text-amber-400'}>
                {currentUser ? `ONLINE & PROTECTED (${currentUser.email})` : 'GUEST / UNPROTECTED CACHE'}
              </strong>
            </span>
          </div>

          {currentUser && lastCloudSync && (
            <div className="text-slate-400 text-[11px]">
              Last Vault Sync:{' '}
              <span className="text-cyan-300 font-bold">
                {lastCloudSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 1. HUNTER PROFILE & AVATAR CUSTOMIZER */}
      <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#141B3B]">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="font-orbitron font-bold text-base text-white tracking-wide">
              HUNTER IDENTITY & AVATAR
            </h3>
          </div>
          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              setShowAvatarModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-bold text-xs hover:brightness-110 shadow-md"
          >
            CUSTOMIZE AVATAR & NAME
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-[#00E5FF] overflow-hidden bg-black glow-blue shrink-0 flex items-center justify-center">
            {hunter.avatarUrl ? (
              <img
                src={hunter.avatarUrl}
                alt={hunter.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <Shield className="w-8 h-8 text-[#00E5FF]" />
            )}
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-lg text-white">
              {hunter.name}
            </h4>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8899BB]">
              <span>{hunter.rank}-RANK</span>
              <span>·</span>
              <span>Level {hunter.level}</span>
              <span>·</span>
              <span>{hunter.hunterClass}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SOUND & REAL SPACE AUDIO ENGINE */}
      <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-6 backdrop-blur-md space-y-5">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#00E5FF]" />
          <h3 className="font-orbitron font-bold text-base text-white tracking-wide">
            REAL SPACE ACOUSTICS & SYSTEM SYNTHESIS
          </h3>
        </div>

        {/* Ambient Real Space Frequencies */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-white block">
                Planetary Magnetosphere & Cosmic Vacuum Drone (41.2 Hz)
              </span>
              <span className="text-[11px] font-mono text-[#8899BB]">
                Astrophysical plasma waves (Voyager / Cassini / Juno), resonant vacuum cavity drone, pulsar clicks.
              </span>
            </div>
            <button
              onClick={() => {
                const nextVal = !settings.ambientSound;
                updateSettings({ ambientSound: nextVal });
                if (nextVal) spaceAudio.startSpaceAmbient();
                else spaceAudio.stopSpaceAmbient();
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                settings.ambientSound
                  ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              {settings.ambientSound ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Ambient Volume</span>
              <span>{Math.round(settings.ambientVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.ambientVolume}
              onChange={(e) => updateSettings({ ambientVolume: parseFloat(e.target.value) })}
              className="w-full accent-[#00E5FF]"
            />
          </div>
        </div>

        {/* Sound Effects */}
        <div className="space-y-2 pt-3 border-t border-[#141B3B]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-white block">
                Tactical System Sound Effects (Solo Leveling Anime)
              </span>
              <span className="text-[11px] font-mono text-[#8899BB]">
                Iconic holographic system chime, ARISE subterranean boom, dread penalty alarm.
              </span>
            </div>
            <button
              onClick={() => updateSettings({ sfxSound: !settings.sfxSound })}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                settings.sfxSound
                  ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              {settings.sfxSound ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>SFX Volume</span>
              <span>{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => updateSettings({ sfxVolume: parseFloat(e.target.value) })}
              className="w-full accent-[#00E5FF]"
            />
          </div>

          {/* Test Sound Triggers */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => spaceAudio.playSoloLevelingNotificationChime()}
              className="px-3 py-1.5 rounded-lg border border-cyan-500/80 bg-cyan-950/60 text-xs font-mono text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all cursor-pointer shadow-sm"
            >
              🔔 Solo Leveling Bell Chime
            </button>
            <button
              onClick={() => spaceAudio.playSystemChime()}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#0A0D22] text-xs font-mono text-cyan-300 hover:text-white hover:border-[#00E5FF] cursor-pointer"
            >
              🔊 System Chime
            </button>
            <button
              onClick={() => spaceAudio.playArise()}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#0A0D22] text-xs font-mono text-amber-300 hover:text-white hover:border-amber-500 cursor-pointer"
            >
              ⚡ ARISE Boom
            </button>
            <button
              onClick={() => spaceAudio.playPenalty()}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#0A0D22] text-xs font-mono text-red-300 hover:text-white hover:border-red-500 cursor-pointer"
            >
              ⚠️ Void Pulse
            </button>
          </div>
        </div>
      </div>

      {/* 3. ANIME AWAKENING CINEMATIC EXPERIENCE */}
      <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-6 backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#141B3B]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="font-orbitron font-bold text-base text-white tracking-wide">
              ANIME AWAKENING CINEMATIC INTRO
            </h3>
          </div>

          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              replayAwakeningIntro();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>REPLAY AWAKENING INTRO</span>
          </button>
        </div>

        {/* Character Archetype Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white block">
              Active Awakening Warrior Archetype
            </span>
            <span className="text-[11px] font-mono text-[#00E5FF]">
              Selects custom visuals, aura, and battle cry roar
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { id: 'shadow_hunter', name: 'Shadow Monarch', style: 'Sung Jinwoo' },
              { id: 'saiyan_warrior', name: 'Celestial Saiyan', style: 'Goku UI' },
              { id: 'cursed_king', name: 'The Honored One', style: 'Gojo Satoru' },
              { id: 'iron_discipline', name: 'Broken Limiter', style: 'Saitama' },
            ].map((char) => {
              const isActive = selectedAwakeningCharacter === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    if (settings.sfxSound) spaceAudio.playTap();
                    setSelectedAwakeningCharacter(char.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-orbitron font-bold text-white leading-tight">
                    {char.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 pt-0.5">
                    {char.style}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-slate-800 bg-[#06081A] text-left text-xs font-mono text-slate-400">
          <p>
            ℹ️ <strong>Once-Only Intro Policy:</strong> The awakening sequence is designed to play automatically on first entry to welcome you into your personal system. You can change your warrior archetype or replay the 7-shot power release sequence here anytime.
          </p>
        </div>
      </div>

      {/* 4. DATA BACKUP & PURGE */}
      <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-[#00E5FF]" />
          <h3 className="font-orbitron font-bold text-base text-white tracking-wide">
            VESSEL DATA STORAGE & BACKUP
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportData}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-[#0A0D22] text-xs font-mono text-slate-200 hover:border-[#00E5FF] flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-[#00E5FF]" />
            <span>EXPORT SYSTEM STATE (JSON)</span>
          </button>

          <button
            onClick={handleResetConfirmation}
            className="py-3 px-4 rounded-xl border border-red-500/40 bg-red-950/20 text-xs font-mono text-red-400 hover:bg-red-950/40 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>PURGE DATA & RE-AWAKEN</span>
          </button>
        </div>
      </div>

      {/* Avatar Modal */}
      <AvatarCustomizerModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />

      {/* Cloud Vault & Google Login Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

    </div>
  );
};
