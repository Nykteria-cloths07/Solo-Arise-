import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import { SystemLogo } from '../common/SystemLogo';
import {
  Shield,
  ChevronRight,
  HeartPulse,
  Zap,
  AlertTriangle,
  Flame,
  Swords,
  CheckCircle2,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
  Crosshair,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Skull,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnimeDimensionScan {
  id: string;
  dimensionCode: string;
  universe: string;
  character: string;
  animeTitle: string;
  alias: string;
  powerScale: string;
  status: string;
  auraGradient: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  signatureAbility: string;
  evaluation: string;
  voiceScript: string;
}

const APEX_ANIME_ROSTER: AnimeDimensionScan[] = [
  {
    id: 'goku',
    dimensionCode: 'DIMENSION 07-DB',
    universe: 'Dragon Ball Multiverse / Angel Realm',
    character: 'Son Goku',
    animeTitle: 'Dragon Ball Super',
    alias: 'Mastered Ultra Instinct',
    powerScale: 'GOD KI · TRANSCENDENT CELESTIAL',
    status: 'DIVINE KI SURGE DETECTED',
    auraGradient: 'from-cyan-500/30 via-slate-200/20 to-blue-900/40',
    borderColor: 'border-cyan-400',
    textColor: 'text-cyan-300',
    badgeBg: 'bg-cyan-950/80 border-cyan-500/80',
    signatureAbility: 'AUTONOMOUS ULTRA INSTINCT // GOD KI',
    evaluation: 'BORN WITH NATURAL SAIYAN DIVINE BIOLOGY. NEVER EXPERIENCED MORTAL WEAKNESS. REJECTED.',
    voiceScript: 'Scanning Dimension 07. Son Goku. Ultra Instinct God Ki detected. Verdict: Rejected. Born with celestial Saiyan biology. Cannot harvest the crucible of human weakness.',
  },
  {
    id: 'gojo',
    dimensionCode: 'DIMENSION 23-JJK',
    universe: 'Jujutsu Sorcery Realm / Shibuya',
    character: 'Satoru Gojo',
    animeTitle: 'Jujutsu Kaisen',
    alias: 'The Honored One',
    powerScale: 'INFINITY SPATIAL DIVIDE · MAX',
    status: 'SIX EYES DOMAIN ACTIVE',
    auraGradient: 'from-purple-600/30 via-cyan-500/20 to-indigo-950/40',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-300',
    badgeBg: 'bg-purple-950/80 border-purple-500/80',
    signatureAbility: 'LIMITLESS // SIX EYES // UNLIMITED VOID',
    evaluation: 'HEREDITARY CELLULAR GENETICS FROM BIRTH. BOUND BY NATURAL TALENT. REJECTED.',
    voiceScript: 'Scanning Dimension 23. Satoru Gojo. Six Eyes infinity active. Verdict: Rejected. Bound by natural hereditary genius. System requires a vessel forged from pure discipline.',
  },
  {
    id: 'saitama',
    dimensionCode: 'DIMENSION 01-OPM',
    universe: 'City Z Wasteland / Hero Association',
    character: 'Saitama',
    animeTitle: 'One Punch Man',
    alias: 'The Caped Baldy',
    powerScale: 'LIMITER BROKEN · UNMEASURABLE',
    status: 'ABSOLUTE CEILING REACHED',
    auraGradient: 'from-amber-500/30 via-red-600/20 to-yellow-950/40',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-300',
    badgeBg: 'bg-amber-950/80 border-amber-500/80',
    signatureAbility: 'SERIOUS PUNCH // BROKEN LIMITER',
    evaluation: 'ALREADY COMPLETED PHYSICAL ASCENSION. CANNOT BENEFIT FROM INCREMENTAL SYSTEM LEVELING. REJECTED.',
    voiceScript: 'Scanning Dimension 01. Saitama. Broken limiter detected. Verdict: Rejected. Vessel already reached absolute apex. Incapable of incremental discipline harvesting.',
  },
  {
    id: 'luffy',
    dimensionCode: 'DIMENSION 12-OP',
    universe: 'Grand Line / Onigashima Sky',
    character: 'Monkey D. Luffy',
    animeTitle: 'One Piece',
    alias: 'Sun God Nika (Gear 5)',
    powerScale: 'MYTHICAL ZOAN · CONQUEROR HAKI',
    status: 'WARRIOR OF LIBERATION ACTIVE',
    auraGradient: 'from-yellow-400/30 via-amber-200/20 to-orange-950/40',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-300',
    badgeBg: 'bg-yellow-950/80 border-yellow-500/80',
    signatureAbility: 'GEAR 5 // DRUMS OF LIBERATION',
    evaluation: 'GUIDED BY INHERITED WILL OF D AND DESTINED JOY. NOT FORGED THROUGH ASHES OF SUFFERING. REJECTED.',
    voiceScript: 'Scanning Dimension 12. Sun God Nika. Mythical Zoan awakened. Verdict: Rejected. Inherited destiny, not self-forged crucible.',
  },
  {
    id: 'ichigo',
    dimensionCode: 'DIMENSION 04-BLEACH',
    universe: 'Soul Society & Hueco Mundo',
    character: 'Ichigo Kurosaki',
    animeTitle: 'Bleach: Thousand-Year Blood War',
    alias: 'Horn of Salvation True Bankai',
    powerScale: 'TRI-HYBRID SPIRITUAL REIARTERY',
    status: 'SHINIGAMI · HOLLOW · QUINCY FUSION',
    auraGradient: 'from-red-600/30 via-slate-900/40 to-black',
    borderColor: 'border-red-500',
    textColor: 'text-red-400',
    badgeBg: 'bg-red-950/80 border-red-500/80',
    signatureAbility: 'TRUE BANKAI // GETSUGA JUJISHO',
    evaluation: 'STATIC HEREDITARY TRI-HYBRID BLOODLINE. VESSEL RELIES ON ANCESTRAL INHERITANCE. REJECTED.',
    voiceScript: 'Scanning Dimension 04. Ichigo Kurosaki. Hybrid spiritual vessel detected. Verdict: Rejected. Genetic fusion of ancestral bloodlines. Disqualified.',
  },
  {
    id: 'gilgamesh',
    dimensionCode: 'DIMENSION 09-FATE',
    universe: 'Babylonian Throne / Uruk',
    character: 'Gilgamesh',
    animeTitle: 'Fate Series / Grand Order',
    alias: 'The King of Heroes',
    powerScale: 'TREASURY OF ALL NOBLE PHANTASMS',
    status: 'GATE OF BABYLON OPEN',
    auraGradient: 'from-yellow-500/30 via-amber-300/20 to-yellow-950/40',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-200',
    badgeBg: 'bg-amber-950/80 border-amber-400/80',
    signatureAbility: 'ENUMA ELISH // GATE OF BABYLON',
    evaluation: 'POSSESSES ALL TREASURES WITHOUT PERSONAL TOIL. ARROGANCE PRECLUDES EMBRACING DISCIPLINE CRUCIBLE. REJECTED.',
    voiceScript: 'Scanning Dimension 09. Gilgamesh. Gate of Babylon detected. Verdict: Rejected. Possesses all treasures without labor. Disdains the grind of daily discipline.',
  },
  {
    id: 'rimuru',
    dimensionCode: 'DIMENSION 18-SLIME',
    universe: 'Jura Tempest Federation',
    character: 'Rimuru Tempest',
    animeTitle: 'That Time I Got Reincarnated as a Slime',
    alias: 'Void God Azathoth',
    powerScale: 'ULTIMATE SKILL MANA VOID',
    status: 'GREAT SAGE AUTOMATION ACTIVE',
    auraGradient: 'from-cyan-400/30 via-blue-600/20 to-indigo-950/40',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-200',
    badgeBg: 'bg-cyan-950/80 border-cyan-400/80',
    signatureAbility: 'VOID GOD AZATHOTH // BEELZEBUTH',
    evaluation: 'AUTOMATED AI SKILL EVOLUTION WITH ZERO BIOLOGICAL PAIN. NO CAPACITY FOR TRUE DISCIPLINE. REJECTED.',
    voiceScript: 'Scanning Dimension 18. Rimuru Tempest. Void God synthesis detected. Verdict: Rejected. Automated skill assimilation without human suffering. Criteria unmet.',
  },
];

export const CinematicIntro: React.FC = () => {
  const { setShowCinematicIntro, isAwakened, setActiveTab, settings } = useSystem();

  // Phases: 'multiverse_scan' -> 'weak_detection' -> 'system_prompt' -> 'declining' -> 'awakened'
  const [phase, setPhase] = useState<
    'multiverse_scan' | 'weak_detection' | 'system_prompt' | 'declining' | 'awakened'
  >('multiverse_scan');

  const [scanIndex, setScanIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [audioEngaged, setAudioEngaged] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [declineCountdown, setDeclineCountdown] = useState<string>('0.02');

  const currentScan = APEX_ANIME_ROSTER[scanIndex];
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cold Robotic System Voice Synthesis
  const speakText = (text: string) => {
    setCurrentSubtitle(text);
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.94; // Calculating, emotionless Monarch cadence
      utterance.pitch = 0.84; // Deep resonant robotic tone
      utterance.volume = 0.95;

      // Pick natural or robotic English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Daniel') ||
            v.name.includes('Oliver') ||
            v.name.includes('Arthur'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis warning:', e);
    }
  };

  // Activate authentic pulse star sound and audio hardware
  const activateIntroSound = async () => {
    try {
      await spaceAudio.unlockAudio();
      setAudioEngaged(true);
      if (settings.ambientSound) {
        spaceAudio.startSpaceAmbient();
      }
      if (settings.sfxSound) {
        spaceAudio.playPulseStarArrival();
      }
    } catch (e) {
      console.warn('Audio activation failed:', e);
    }
  };

  useEffect(() => {
    activateIntroSound();

    const handleFirstGesture = () => {
      activateIntroSound();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('pointerdown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('pointerdown', handleFirstGesture);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [settings.ambientSound, settings.sfxSound]);

  // Voice narration for active character scan
  useEffect(() => {
    if (phase === 'multiverse_scan') {
      speakText(currentScan.voiceScript);
    }
  }, [scanIndex, phase, voiceEnabled]);

  // Comfortable scanning progression: 6.2s per apex anime legend
  const scanDuration = 6200;

  useEffect(() => {
    if (phase !== 'multiverse_scan' || isPaused) return;

    setScanProgress(0);
    const intervalMs = 60;
    const step = (intervalMs / scanDuration) * 100;

    const progressTimer = setInterval(() => {
      setScanProgress((prev) => Math.min(100, prev + step));
    }, intervalMs);

    const stepTimer = setTimeout(() => {
      if (scanIndex < APEX_ANIME_ROSTER.length - 1) {
        if (settings.sfxSound) spaceAudio.playSystemChime();
        setScanIndex((prev) => prev + 1);
      } else {
        // Conclude Multiverse Scan -> Trigger Sudden Weak Hunter Detection!
        setPhase('weak_detection');
        if (settings.sfxSound) spaceAudio.playPulseStarArrival();
      }
    }, scanDuration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [phase, scanIndex, isPaused, scanDuration, settings.sfxSound]);

  // Phase 2: Weak Hunter Detection Narration & Window (7.5s)
  useEffect(() => {
    if (phase === 'weak_detection') {
      speakText(
        'Critical warning. Dimensional anomaly detected in Cartenon Temple Double Dungeon. Target: Sung Jinwoo, E-Rank. The weakest hunter of all mankind. Life force remaining: zero point zero two percent. Selection confirmed.'
      );

      const timer = setTimeout(() => {
        setPhase('system_prompt');
        if (settings.sfxSound) spaceAudio.playPulseStarArrival();
      }, 7500);

      return () => clearTimeout(timer);
    }
  }, [phase, settings.sfxSound]);

  // Phase 3: Quest Prompt Narration
  useEffect(() => {
    if (phase === 'system_prompt') {
      speakText(
        'You have qualified to become a Player. If you do not accept within zero point zero two seconds, your heart will cease beating permanently. Will you accept the crucible?'
      );
    }
  }, [phase]);

  const handleAccept = () => {
    setPhase('awakened');
    if (settings.sfxSound) spaceAudio.playArise();

    speakText('Selection verified. Welcome, Player. The Monarch arises from the ashes of the weak.');

    try {
      confetti({
        particleCount: 180,
        spread: 140,
        origin: { y: 0.55 },
        colors: ['#00E5FF', '#3B82F6', '#1E40AF', '#FFFFFF', '#60A5FA', '#FFD700'],
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeclineAttempt = () => {
    setPhase('declining');
    if (settings.sfxSound) {
      spaceAudio.playPenalty();
      spaceAudio.playHeartbeat();
    }
    speakText('Warning. Cardiac shutdown initiated. Heart failure imminent.');

    setTimeout(() => {
      setDeclineCountdown('0.01');
      if (settings.sfxSound) spaceAudio.playHeartbeat();
    }, 1200);

    setTimeout(() => {
      setDeclineCountdown('0.00');
      handleAccept();
    }, 2800);
  };

  const handleComplete = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (settings.sfxSound) spaceAudio.playTap();
    setShowCinematicIntro(false);
    if (!isAwakened) {
      setActiveTab('onboarding');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020208] flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-hidden font-mono">
      {/* Background Cosmic Deep Grid & Energy Flare */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A143A]/50 via-[#030514] to-black pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#00e5ff15_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

      {/* TOP BAR: System Branding, Audio/Voice Controls, and Skip */}
      <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-40 gap-2">
        <div className="flex items-center gap-2">
          <SystemLogo size={28} glow={true} />
          <div className="hidden xs:block">
            <span className="text-[11px] font-orbitron font-extrabold text-white tracking-wider block leading-none">
              SOLO ARISE
            </span>
            <span className="text-[9px] text-[#00E5FF] font-mono tracking-widest uppercase">
              MULTIVERSE APEX PROTOCOL
            </span>
          </div>
        </div>

        {/* Audio, Voice Narration & Skip Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Cold System Voice Toggle with Audio Visualizer */}
          <button
            onClick={() => {
              if (voiceEnabled) {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setVoiceEnabled(false);
              } else {
                setVoiceEnabled(true);
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-sm ${
              voiceEnabled
                ? 'border-[#00E5FF]/70 bg-[#00E5FF]/15 text-[#00E5FF] shadow-cyan-950'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}
            title="Toggle Robotic Monarch System Voice Narration"
          >
            {/* Visualizer Soundwave Bars */}
            <div className="flex items-end gap-0.5 h-3">
              <span
                className={`w-0.5 rounded-full transition-all ${
                  isSpeaking ? 'h-3 bg-[#00E5FF] animate-pulse' : 'h-1.5 bg-slate-500'
                }`}
              />
              <span
                className={`w-0.5 rounded-full transition-all ${
                  isSpeaking ? 'h-2 bg-[#00E5FF] animate-bounce' : 'h-1 bg-slate-500'
                }`}
              />
              <span
                className={`w-0.5 rounded-full transition-all ${
                  isSpeaking ? 'h-3.5 bg-[#00E5FF] animate-pulse' : 'h-2 bg-slate-500'
                }`}
              />
            </div>
            <span>{voiceEnabled ? 'SYSTEM VOICE' : 'VOICE MUTED'}</span>
          </button>

          {/* Sound Synthesizer Unlocker */}
          <button
            onClick={activateIntroSound}
            className={`p-1.5 rounded-xl border text-xs transition-all ${
              audioEngaged
                ? 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300'
                : 'border-amber-500 bg-amber-950/70 text-amber-300 animate-pulse'
            }`}
            title="Acoustic Pulse Star Sound Ready"
          >
            {audioEngaged ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Skip Direct to System */}
          <button
            onClick={handleComplete}
            className="px-3 py-1.5 rounded-xl border border-[#1A2548] bg-[#0A0D22]/90 text-[11px] text-slate-300 hover:text-white hover:border-[#00E5FF] transition-all flex items-center gap-1 shadow-md"
          >
            <span>SKIP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          PHASE 1: MULTIVERSE APEX SCAN (Showcasing all powerful anime legends)
          ========================================================================= */}
      {phase === 'multiverse_scan' && (
        <div className="relative z-10 w-full max-w-xl bg-[#06091F]/95 border-2 border-[#1A2548] rounded-2xl p-4 sm:p-7 backdrop-blur-2xl glow-blue shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-300">
          
          {/* Live Scan Timer Progress Line */}
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-[#1A2548]">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-[#00E5FF] to-cyan-300 transition-all duration-75"
              style={{ width: `${scanProgress}%` }}
            />
          </div>

          {/* Scanning Reticle & Status Banner */}
          <div className="flex items-center justify-between border-b border-[#141B3B] pb-2 text-[11px] font-mono">
            <span className="text-[#00E5FF] font-bold flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 animate-spin-slow" />
              {currentScan.dimensionCode}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold border text-red-300 border-red-500/80 bg-red-950/70">
              STATUS: VESSEL REJECTED
            </span>
          </div>

          {/* Dynamic Anime Character Holographic Power Card */}
          <div className={`p-4 sm:p-5 rounded-2xl border-2 ${currentScan.borderColor} bg-gradient-to-br ${currentScan.auraGradient} relative overflow-hidden text-left space-y-3 glow-blue shadow-xl`}>
            
            {/* Top row: Anime Title and Power scale */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {currentScan.animeTitle} · {currentScan.universe}
              </span>
              <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${currentScan.badgeBg} ${currentScan.textColor}`}>
                {currentScan.status}
              </span>
            </div>

            {/* Main Character Name & Alias */}
            <div className="space-y-0.5">
              <h3 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-wide leading-none">
                {currentScan.character}
              </h3>
              <div className={`font-rajdhani font-bold text-sm sm:text-base ${currentScan.textColor}`}>
                &ldquo;{currentScan.alias}&rdquo;
              </div>
            </div>

            {/* Signature Combat Ability */}
            <div className="p-2.5 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm text-xs font-mono space-y-1">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                CORE ABILITY // CELESTIAL PROWESS:
              </div>
              <div className="font-bold text-white tracking-wide">
                {currentScan.signatureAbility}
              </div>
              <div className="text-[10px] text-cyan-300">
                POWER LEVEL: <strong className="text-white">{currentScan.powerScale}</strong>
              </div>
            </div>

            {/* Cold System Verdict Rejection Stamp */}
            <div className="p-3 rounded-xl border border-red-500/60 bg-red-950/60 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5" />
                SYSTEM EVALUATION VERDICT:
              </div>
              <p className="font-mono text-xs text-red-200 leading-snug">
                › {currentScan.evaluation}
              </p>
            </div>
          </div>

          {/* Character Quick Jump Selector Chips */}
          <div className="flex items-center justify-center gap-1 flex-wrap pt-1">
            {APEX_ANIME_ROSTER.map((char, idx) => (
              <button
                key={char.id}
                onClick={() => {
                  if (settings.sfxSound) spaceAudio.playSystemChime();
                  setScanIndex(idx);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                  idx === scanIndex
                    ? 'border-[#00E5FF] bg-[#00E5FF] text-black shadow-[0_0_10px_#00E5FF]'
                    : idx < scanIndex
                    ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                    : 'border-slate-800/60 bg-black/40 text-slate-600'
                }`}
              >
                {char.character.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Reading & Voice Controls Bar */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#141B3B]">
            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                setScanIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={scanIndex === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-40"
            >
              ‹ PREV
            </button>

            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-lg border border-cyan-700/60 bg-cyan-950/40 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1.5"
            >
              {isPaused ? <Play className="w-3 h-3 fill-cyan-400" /> : <Pause className="w-3 h-3" />}
              <span>{isPaused ? 'RESUME SCAN' : 'PAUSE TO READ'}</span>
            </button>

            <button
              onClick={() => {
                if (settings.sfxSound) spaceAudio.playTap();
                if (scanIndex < APEX_ANIME_ROSTER.length - 1) {
                  setScanIndex((prev) => prev + 1);
                } else {
                  setPhase('weak_detection');
                  if (settings.sfxSound) spaceAudio.playPulseStarArrival();
                }
              }}
              className="px-3.5 py-1.5 rounded-lg border border-cyan-400 bg-cyan-950/80 text-xs font-mono font-bold text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all"
            >
              NEXT ›
            </button>
          </div>

          {/* Live Cold System Voice Subtitles Ticker */}
          <div className="p-2.5 rounded-xl border border-[#1A2548] bg-[#030514]/90 text-left flex items-start gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[11px] font-mono text-slate-300 italic leading-relaxed line-clamp-2">
              &ldquo;{currentSubtitle}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 2: WEAK HUNTER DETECTION (The Sudden Shift to Sung Jinwoo)
          ========================================================================= */}
      {phase === 'weak_detection' && (
        <div className="relative z-10 w-full max-w-xl bg-[#140608]/95 border-2 border-red-500 rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-5 text-center animate-pulse glow-red">
          
          <div className="w-16 h-16 rounded-2xl border-2 border-red-500 bg-red-950/70 mx-auto flex items-center justify-center text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.6)]">
            <AlertTriangle className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full border border-red-500 bg-red-950 text-red-300 text-[11px] font-bold tracking-widest uppercase">
              [ DIMENSIONAL ANOMALY: SEARCH VECTOR COMPLETE ]
            </div>
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-widest">
              WEAK HUNTER DETECTED.
            </h2>
            <p className="font-rajdhani text-lg sm:text-xl text-red-200 font-semibold leading-relaxed">
              &ldquo;The System does not choose the already-strong. The System builds the Monarch from the ashes of the weak.&rdquo;
            </p>
          </div>

          {/* Double Dungeon Altar Telemetry */}
          <div className="p-4 rounded-xl border border-red-900/80 bg-[#0A0204] text-left space-y-2 font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-red-950 pb-1.5">
              <span>Target Identified:</span>
              <strong className="text-white">Sung Jinwoo (The Weakest E-Rank Hunter)</strong>
            </div>
            <div className="flex items-center justify-between border-b border-red-950 pb-1.5">
              <span>Coordinates:</span>
              <span className="text-red-400 font-bold">Double Dungeon · Cartenon Temple Altar</span>
            </div>
            <div className="flex items-center justify-between border-b border-red-950 pb-1.5">
              <span>Life Force Remaining:</span>
              <span className="text-red-400 font-bold text-sm">0.02% (CRITICAL FAILURE)</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-0.5">
              Vessel Selection Reason: Zero innate talent · Infinite capacity for suffering & discipline.
            </div>
          </div>

          <div className="p-2.5 rounded-xl border border-red-900/40 bg-black/60 text-left flex items-start gap-2">
            <Radio className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[11px] font-mono text-red-200 italic leading-snug">
              &ldquo;{currentSubtitle}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 3: THE ICONIC HOLOGRAPHIC SYSTEM WINDOW (Player Qualification)
          ========================================================================= */}
      {(phase === 'system_prompt' || phase === 'declining') && (
        <div className="relative z-10 w-full max-w-xl bg-[#060A22]/98 border-2 border-[#00E5FF] rounded-2xl p-6 sm:p-8 backdrop-blur-2xl glow-blue-lg shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#00E5FF]/40 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
              <span className="font-orbitron font-extrabold text-xs sm:text-sm tracking-widest text-[#00E5FF]">
                [ SYSTEM NOTIFICATION: QUEST PROMPT ]
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest">
              VESSEL: THE SOLE PLAYER
            </span>
          </div>

          {/* Quest Prompt Body */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#4D9FFF] font-mono uppercase tracking-wider block">
                [MANDATORY QUEST: Courage of the Weak]
              </span>
              <h3 className="font-orbitron font-black text-xl sm:text-2xl text-white tracking-wide leading-snug">
                YOU HAVE QUALIFIED TO BECOME A &ldquo;PLAYER&rdquo;.
              </h3>
            </div>

            <p className="font-rajdhani text-base sm:text-lg text-[#D0E2FF] leading-relaxed">
              If you accept, you will obtain the qualification to Level Up in reality. You will surpass every entity across fiction through relentless daily discipline. Will you accept?
            </p>

            {/* Famous 0.02s Heart Stopping Warning */}
            <div className={`p-4 rounded-xl border transition-all ${
              phase === 'declining'
                ? 'border-red-500 bg-red-950/70 text-red-200 animate-pulse'
                : 'border-[#1E3066] bg-[#0A102E]/70 text-[#8899BB]'
            }`}>
              <div className="flex items-start gap-3">
                <HeartPulse className={`w-5 h-5 shrink-0 mt-0.5 ${phase === 'declining' ? 'text-red-400 animate-bounce' : 'text-cyan-400'}`} />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-white block">
                    WARNING: CARDIAC SHUTDOWN CONTINGENCY
                  </span>
                  <p>
                    If you do not accept within{' '}
                    <strong className="text-red-400 font-bold font-mono text-sm">
                      {phase === 'declining' ? `${declineCountdown}s` : '0.02 seconds'}
                    </strong>
                    , your heart will cease beating permanently.
                  </p>
                </div>
              </div>
            </div>

            {phase === 'declining' && (
              <div className="text-center font-mono text-xs text-red-400 font-bold animate-pulse">
                [SYSTEM OVERRIDE: THE SHADOW MONARCH REFUSES TO LET YOU DIE IN WEAKNESS]
              </div>
            )}
          </div>

          {/* Action Buttons: [ ACCEPT ] vs [ DECLINE ] */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleAccept}
              className="w-full sm:flex-1 py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#00E5FF] text-black font-orbitron font-black text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all glow-blue shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>[ ACCEPT QUEST ]</span>
            </button>

            <button
              onClick={handleDeclineAttempt}
              className="w-full sm:w-auto px-6 py-4 rounded-xl border border-red-500/50 bg-red-950/20 text-red-400 font-orbitron font-bold text-xs tracking-wider hover:bg-red-950/50 active:scale-95 transition-colors cursor-pointer"
            >
              [ DECLINE ]
            </button>
          </div>

          {/* Subtitles caption */}
          <div className="p-2.5 rounded-xl border border-[#1A2548] bg-[#030514]/90 text-left flex items-start gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[11px] font-mono text-slate-300 italic leading-snug">
              &ldquo;{currentSubtitle}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 4: AWAKENED AS A PLAYER ("ARISE")
          ========================================================================= */}
      {phase === 'awakened' && (
        <div className="relative z-10 w-full max-w-xl bg-[#060A22]/98 border-2 border-[#00E5FF] rounded-2xl p-6 sm:p-8 backdrop-blur-2xl glow-blue-lg shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-500">
          
          <div className="w-20 h-20 rounded-2xl border-2 border-[#00E5FF] bg-gradient-to-b from-[#0F1E52] to-black mx-auto flex items-center justify-center glow-blue-lg shadow-2xl">
            <SystemLogo size={48} glow={true} />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#00E5FF] font-bold">
              [SELECTION VERIFIED: THE SOLE PLAYER HAS AWAKENED]
            </span>
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-widest">
              WELCOME, PLAYER.
            </h2>
            <p className="font-rajdhani text-base sm:text-lg text-[#8899BB] max-w-md mx-auto leading-relaxed">
              &ldquo;The System has taken hold. You will no longer remain the weakest hunter. The journey to S-Rank and the Shadow Monarch begins now.&rdquo;
            </p>
          </div>

          {/* Daily Quest Mandate Preview */}
          <div className="p-4 rounded-xl border border-[#1A2548] bg-[#050716]/90 text-left space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#141B3B] pb-2">
              <span className="text-xs font-mono font-bold text-[#00E5FF] flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" />
                DAILY MANDATE: PREPARING TO BECOME STRONG
              </span>
              <span className="text-[10px] font-mono text-red-400 font-bold">
                MANDATORY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                <span>[0/100] Push-ups</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                <span>[0/100] Sit-ups</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                <span>[0/100] Squats</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                <span>[0/10km] Running</span>
              </div>
            </div>

            <p className="text-[10px] text-amber-400 font-mono pt-1">
              *EXTREME RANKING ACTIVE: Leveling up to S-Rank requires Level 300+ and unbroken 100-day crucible consistency. Top 1% threshold.
            </p>
          </div>

          {/* Complete and Arise Button */}
          <button
            onClick={handleComplete}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#00E5FF] text-black font-orbitron font-black text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all glow-blue shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ARISE & ENTER THE SYSTEM</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
