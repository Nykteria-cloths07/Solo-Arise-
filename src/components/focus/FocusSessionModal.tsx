import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Radio,
  Sliders,
  ChevronRight,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusPreset {
  id: 'standard' | 'monarch' | 'crucible' | 'custom';
  name: string;
  focusMinutes: number;
  breakMinutes: number;
  totalIntervals: number;
  xpReward: number;
  badge: string;
}

const PRESETS: FocusPreset[] = [
  {
    id: 'standard',
    name: '25m Standard Pomodoro',
    focusMinutes: 25,
    breakMinutes: 5,
    totalIntervals: 4,
    xpReward: 120,
    badge: '4 CYCLES · 100M TOTAL',
  },
  {
    id: 'monarch',
    name: '50m Monarch Crucible',
    focusMinutes: 50,
    breakMinutes: 10,
    totalIntervals: 2,
    xpReward: 250,
    badge: '2 CYCLES · HIGH DENSITY',
  },
  {
    id: 'crucible',
    name: '90m Void Deep Work',
    focusMinutes: 90,
    breakMinutes: 15,
    totalIntervals: 1,
    xpReward: 420,
    badge: 'ULTRA-ENDURANCE VOID',
  },
];

interface FocusSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusSessionModal: React.FC<FocusSessionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    habits,
    logFocusSession,
    focusSessions,
    settings,
    updateSettings,
  } = useSystem();

  const [selectedPreset, setSelectedPreset] = useState<FocusPreset['id']>('standard');
  const [customFocusMin, setCustomFocusMin] = useState<number>(30);
  const [customBreakMin, setCustomBreakMin] = useState<number>(5);

  const [taskTitle, setTaskTitle] = useState<string>('Deep Work & Cognitive Mastery');
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');

  // Timer states
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [currentInterval, setCurrentInterval] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFullscreenVoid, setIsFullscreenVoid] = useState<boolean>(false);

  // Audio ambient controls inside timer
  const [spaceAudioActive, setSpaceAudioActive] = useState<boolean>(settings.ambientSound);

  const activePreset = PRESETS.find((p) => p.id === selectedPreset) || PRESETS[0];
  const targetFocusSeconds =
    selectedPreset === 'custom' ? customFocusMin * 60 : activePreset.focusMinutes * 60;
  const targetBreakSeconds =
    selectedPreset === 'custom' ? customBreakMin * 60 : activePreset.breakMinutes * 60;
  const maxIntervals = selectedPreset === 'custom' ? 1 : activePreset.totalIntervals;

  const totalCycleSeconds = isBreak ? targetBreakSeconds : targetFocusSeconds;
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round(((totalCycleSeconds - timeLeft) / totalCycleSeconds) * 100))
  );

  // Sync preset changes
  useEffect(() => {
    setIsActive(false);
    setIsBreak(false);
    setCurrentInterval(1);
    if (selectedPreset === 'custom') {
      setTimeLeft(customFocusMin * 60);
    } else {
      const p = PRESETS.find((item) => item.id === selectedPreset);
      if (p) setTimeLeft(p.focusMinutes * 60);
    }
  }, [selectedPreset, customFocusMin]);

  // Main countdown tick
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Interval completed!
      handleIntervalComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Start space ambient automatically when user starts focusing
  const handleToggleTimer = () => {
    if (!isActive) {
      // Starting session
      setIsActive(true);
      if (settings.sfxSound) spaceAudio.playSystemChime();
      if (spaceAudioActive && !spaceAudio.getIsAmbientPlaying()) {
        spaceAudio.startSpaceAmbient();
      }
    } else {
      // Pausing session
      setIsActive(false);
      if (settings.sfxSound) spaceAudio.playTap();
    }
  };

  const handleIntervalComplete = () => {
    if (!isBreak) {
      // Focus interval just ended!
      if (settings.sfxSound) spaceAudio.playSystemChime();

      if (currentInterval >= maxIntervals) {
        // Entire Session is complete!
        handleFullSessionFinish();
      } else {
        // Move to break
        setIsBreak(true);
        setTimeLeft(targetBreakSeconds);
      }
    } else {
      // Break interval ended, move to next focus interval
      setIsBreak(false);
      setCurrentInterval((prev) => prev + 1);
      setTimeLeft(targetFocusSeconds);
      if (settings.sfxSound) spaceAudio.playSystemChime();
    }
  };

  const handleFullSessionFinish = () => {
    setIsActive(false);
    if (settings.sfxSound) spaceAudio.playQuestComplete();

    const duration =
      selectedPreset === 'custom'
        ? customFocusMin
        : activePreset.focusMinutes * activePreset.totalIntervals;
    const xp =
      selectedPreset === 'custom'
        ? Math.max(50, customFocusMin * 4)
        : activePreset.xpReward;

    logFocusSession({
      taskTitle: taskTitle.trim() || 'Deep Void Focus Session',
      durationMinutes: duration,
      category: 'Deep Work',
      habitId: selectedHabitId || undefined,
      xpEarned: xp,
      mode: selectedPreset,
    });

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#3B82F6', '#FFD700'],
      });
    } catch {}

    // Reset timer
    setIsBreak(false);
    setCurrentInterval(1);
    setTimeLeft(targetFocusSeconds);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setCurrentInterval(1);
    setTimeLeft(targetFocusSeconds);
    if (settings.sfxSound) spaceAudio.playTap();
  };

  const handleSkipToBreak = () => {
    setIsBreak(true);
    setTimeLeft(targetBreakSeconds);
    if (settings.sfxSound) spaceAudio.playTap();
  };

  const toggleSoundInsideTimer = () => {
    const next = !spaceAudioActive;
    setSpaceAudioActive(next);
    updateSettings({ ambientSound: next });
    if (next) spaceAudio.startSpaceAmbient();
    else spaceAudio.stopSpaceAmbient();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center font-mono select-none overflow-y-auto ${
        isFullscreenVoid
          ? 'bg-[#020208] p-4 sm:p-8'
          : 'bg-black/85 backdrop-blur-md p-4 sm:p-6'
      }`}
    >
      <div
        className={`relative w-full rounded-2xl border-2 border-[#00E5FF]/70 bg-[#06091E]/95 glow-blue-lg shadow-2xl p-6 sm:p-8 space-y-6 my-auto transition-all ${
          isFullscreenVoid ? 'max-w-4xl min-h-[85vh] flex flex-col justify-between' : 'max-w-2xl'
        }`}
      >
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between border-b border-[#1A2548] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-[#00E5FF] bg-[#00E5FF]/15 flex items-center justify-center glow-blue text-[#00E5FF]">
              <Target className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-mono-system uppercase tracking-widest text-[#00E5FF] font-bold">
                [ SYSTEM PROTOCOL: DEEP WORK VOID ]
              </span>
              <h2 className="font-orbitron font-extrabold text-lg sm:text-2xl text-white tracking-wide">
                FOCUS SESSION CRUCIBLE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Void Toggle */}
            <button
              onClick={() => setIsFullscreenVoid(!isFullscreenVoid)}
              className="p-2 rounded-lg border border-slate-800 bg-[#0A0D22] text-slate-300 hover:text-white hover:border-[#00E5FF]"
              title={isFullscreenVoid ? 'Exit Fullscreen' : 'Enter Fullscreen Void Mode'}
            >
              {isFullscreenVoid ? (
                <Minimize2 className="w-4 h-4 text-[#00E5FF]" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Space Audio Toggle */}
            <button
              onClick={toggleSoundInsideTimer}
              className={`p-2 rounded-lg border transition-all ${
                spaceAudioActive
                  ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-[#00E5FF]'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
              title="Toggle Real Space Ambient Vacuum Sound"
            >
              {spaceAudioActive ? (
                <Volume2 className="w-4 h-4 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPreset(p.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#00E5FF] bg-[#00E5FF]/15 glow-blue'
                    : 'border-[#1A2548] bg-[#050716] text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-orbitron font-bold text-xs text-white block truncate">
                  {p.name}
                </span>
                <span className="text-[9px] font-mono text-[#00E5FF] block mt-0.5 truncate">
                  {p.badge}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setSelectedPreset('custom')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedPreset === 'custom'
                ? 'border-[#00E5FF] bg-[#00E5FF]/15 glow-blue'
                : 'border-[#1A2548] bg-[#050716] text-slate-400 hover:text-white'
            }`}
          >
            <span className="font-orbitron font-bold text-xs text-white block">
              Custom Minutes
            </span>
            <span className="text-[9px] font-mono text-[#4D9FFF] block mt-0.5">
              FLEXIBLE CALIBRATION
            </span>
          </button>
        </div>

        {/* Task Title & HabitForge Integration Input Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-[#1A2548] bg-[#050716]/90">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8899BB] uppercase font-bold">
              Focus Objective / Task:
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Deep Study / Tactical Reading"
              className="w-full px-3 py-1.5 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono focus:border-[#00E5FF]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#8899BB] uppercase font-bold flex items-center justify-between">
              <span>Link with Habit Forge:</span>
              <span className="text-emerald-400">Updates Streak ✓</span>
            </label>
            <select
              value={selectedHabitId}
              onChange={(e) => setSelectedHabitId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono focus:border-[#00E5FF]"
            >
              <option value="">-- Standalone Focus Session --</option>
              {habits.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} (Streak {h.streak}D)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Minutes Settings (when custom selected) */}
        {selectedPreset === 'custom' && (
          <div className="flex items-center gap-4 p-3 rounded-xl border border-[#1A2548] bg-[#050716] text-xs">
            <div className="flex-1 space-y-1">
              <span className="text-[#8899BB] block">Focus Duration:</span>
              <input
                type="number"
                min={5}
                max={180}
                step={5}
                value={customFocusMin}
                onChange={(e) => setCustomFocusMin(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-[#0A0D22] text-white font-mono"
              />
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-[#8899BB] block">Break Duration:</span>
              <input
                type="number"
                min={1}
                max={45}
                step={1}
                value={customBreakMin}
                onChange={(e) => setCustomBreakMin(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-700 bg-[#0A0D22] text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* Circular Countdown Ring HUD */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#0E1638"
                strokeWidth="5"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={isBreak ? '#10B981' : '#00E5FF'}
                strokeWidth="5"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-widest ${
                  isBreak
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    : 'bg-cyan-950 text-[#00E5FF] border border-[#00E5FF]/40'
                }`}
              >
                {isBreak ? 'REST / BREAK PHASE' : 'DEEP WORK VOID'}
              </span>

              {/* Time Display */}
              <h3 className="font-orbitron font-black text-4xl sm:text-5xl text-white tracking-widest tabular-nums drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]">
                {formatTime(timeLeft)}
              </h3>

              {/* Interval Dots Indicator */}
              <div className="flex items-center gap-1.5 pt-1">
                {Array.from({ length: maxIntervals }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < currentInterval
                        ? 'bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]'
                        : 'bg-[#152044]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Cycle {currentInterval} of {maxIntervals}
              </span>
            </div>
          </div>
        </div>

        {/* Controls: Play/Pause, Reset, Skip */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleResetTimer}
            className="p-3 rounded-xl border border-slate-700 bg-[#0A0D22] text-slate-400 hover:text-white hover:border-[#00E5FF] transition-all"
            title="Reset Session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-orbitron font-black text-sm tracking-wider flex items-center gap-2.5 transition-all shadow-xl active:scale-95 ${
              isActive
                ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-950'
                : 'bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#00E5FF] text-black hover:brightness-110 shadow-cyan-950 glow-blue'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-black" />
                <span>PAUSE SESSION</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-black" />
                <span>START VOID FOCUS</span>
              </>
            )}
          </button>

          {!isBreak && (
            <button
              onClick={handleSkipToBreak}
              className="p-3 rounded-xl border border-slate-700 bg-[#0A0D22] text-slate-400 hover:text-white hover:border-[#00E5FF] transition-all"
              title="Skip to Rest Break"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Motivational Discipline Quote Footer */}
        <div className="p-3 rounded-xl border border-[#141B3B] bg-[#050716] text-center">
          <p className="text-xs font-mono text-[#8899BB]">
            &ldquo;In the deep work void, distraction is voluntary weakness. Lock in and harvest the mana.&rdquo;
          </p>
        </div>

        {/* Recent Focus Sessions History */}
        {focusSessions.length > 0 && !isFullscreenVoid && (
          <div className="pt-2 border-t border-[#1A2548] space-y-2">
            <span className="text-[11px] font-mono text-[#8899BB] uppercase">
              Recent Void Cleared Sessions ({focusSessions.length})
            </span>
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 text-xs font-mono">
              {focusSessions.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="p-2 rounded-lg border border-[#141B3B] bg-[#040614] flex items-center justify-between text-slate-300"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{s.taskTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-cyan-300 font-bold">{s.durationMinutes}m</span>
                    <span className="text-amber-400 font-bold">+{s.xpEarned} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
