import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import { SystemLogo } from '../common/SystemLogo';
import {
  ChevronRight,
  HeartPulse,
  Zap,
  AlertTriangle,
  Swords,
  Radio,
  Volume2,
  VolumeX,
  Crosshair,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  FastForward,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Full Body Anime Character Showcase Data
export interface FullBodyAnimeCharacter {
  id: string;
  name: string;
  animeTitle: string;
  alias: string;
  dimensionCode: string;
  imageSrc: string;
  glowColor: string;
  accentBorder: string;
  badgeBg: string;
  rejectionReason: string;
  jinwooDubScript: string;
}

export const ANIME_TITANS_ROSTER: FullBodyAnimeCharacter[] = [
  {
    id: 'goku',
    name: 'Son Goku',
    animeTitle: 'Dragon Ball Super',
    alias: 'Ultra Instinct God Ki',
    dimensionCode: 'UNIVERSE 07',
    imageSrc: '/src/assets/images/goku_ultra_instinct_1791873441276.jpg',
    glowColor: 'shadow-[0_0_35px_rgba(0,229,255,0.45)]',
    accentBorder: 'border-cyan-400',
    badgeBg: 'bg-cyan-950/80 border-cyan-400/80 text-cyan-300',
    rejectionReason: 'BORN SAIYAN GOD · REJECTED',
    jinwooDubScript:
      'Son Goku. Ultra Instinct. Born with divine Saiyan blood and limitless god ki. But the System rejected him. Because a god born with divine biology never experienced the crucible of human weakness.',
  },
  {
    id: 'gojo',
    name: 'Satoru Gojo',
    animeTitle: 'Jujutsu Kaisen',
    alias: 'The Honored One',
    dimensionCode: 'SHIBUYA REALM',
    imageSrc: '/src/assets/images/gojo_satoru_infinity_1791873441456.jpg',
    glowColor: 'shadow-[0_0_35px_rgba(168,85,247,0.45)]',
    accentBorder: 'border-purple-400',
    badgeBg: 'bg-purple-950/80 border-purple-400/80 text-purple-300',
    rejectionReason: 'NATURAL GENIUS · REJECTED',
    jinwooDubScript:
      'Satoru Gojo. The Honored One. Six Eyes and spatial Infinity. Rejected. Bound by natural hereditary genius from birth. The System refuses those who never had to crawl from the bottom.',
  },
  {
    id: 'saitama',
    name: 'Saitama',
    animeTitle: 'One Punch Man',
    alias: 'The Caped Baldy',
    dimensionCode: 'CITY Z WASTELAND',
    imageSrc: '/src/assets/images/saitama_one_punch_1791873442741.jpg',
    glowColor: 'shadow-[0_0_35px_rgba(245,158,11,0.45)]',
    accentBorder: 'border-amber-400',
    badgeBg: 'bg-amber-950/80 border-amber-400/80 text-amber-300',
    rejectionReason: 'CEILING REACHED · REJECTED',
    jinwooDubScript:
      'Saitama. He broke his limiter through relentless physical repetition. But he already reached the absolute apex. The System rejected him... because there was no more suffering left to harvest.',
  },
  {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    animeTitle: 'One Piece',
    alias: 'Sun God Nika (Gear 5)',
    dimensionCode: 'GRAND LINE',
    imageSrc: '/src/assets/images/luffy_gear_five_1791873444005.jpg',
    glowColor: 'shadow-[0_0_35px_rgba(234,179,8,0.45)]',
    accentBorder: 'border-yellow-400',
    badgeBg: 'bg-yellow-950/80 border-yellow-400/80 text-yellow-300',
    rejectionReason: 'INHERITED WILL · REJECTED',
    jinwooDubScript:
      'Monkey D. Luffy. Sun God Nika and the Drums of Liberation. Rejected. Guided by inherited destiny and the Will of D. Not forged through the ashes of sheer despair.',
  },
];

const JINWOO_HERO_IMAGE = '/src/assets/images/jinwoo_shadow_monarch_1791873442926.jpg';

export const CinematicIntro: React.FC = () => {
  const { setShowCinematicIntro, isAwakened, setActiveTab, settings } = useSystem();

  // Phases: 'multiverse_scan' -> 'weak_detection' -> 'system_prompt' -> 'awakened'
  const [phase, setPhase] = useState<'multiverse_scan' | 'weak_detection' | 'system_prompt' | 'awakened'>(
    'multiverse_scan'
  );

  const [scanIndex, setScanIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isFastPaced, setIsFastPaced] = useState<boolean>(false);
  const [audioEngaged, setAudioEngaged] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const currentCharacter = ANIME_TITANS_ROSTER[scanIndex];
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fast, crisp timing: 3.8s normal, 2.2s fast (No Lag!)
  const scanDuration = isFastPaced ? 2200 : 3800;

  // Initialize and load browser voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) setAvailableVoices(v);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Find deep, resolute, charismatic male voice for Sung Jinwoo's dub
  const getJinwooVoice = (): SpeechSynthesisVoice | null => {
    if (!availableVoices || availableVoices.length === 0) return null;
    const preferred = ['Google US English', 'Daniel', 'Alex', 'David', 'Oliver', 'Natural', 'en-US'];
    for (const name of preferred) {
      const match = availableVoices.find(
        (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }
    const enMale = availableVoices.find(
      (v) => v.lang.startsWith('en') && !/female|zira|samantha|victoria/i.test(v.name)
    );
    return enMale || availableVoices.find((v) => v.lang.startsWith('en')) || availableVoices[0] || null;
  };

  /**
   * Speak as SUNG JINWOO DUB (Fast, resolute, charismatic hunter monologue)
   */
  const speakJinwooDub = (text: string) => {
    setCurrentSubtitle(text);
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop immediately - eliminates voice queue lag!

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.88; // Deep, focused, intense hunter tone
      utterance.rate = isFastPaced ? 1.16 : 1.08; // Fast, decisive, crisp cadence
      utterance.volume = 1.0;

      const voice = getJinwooVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Sound unlock helper
  const activateIntroSound = async () => {
    try {
      await spaceAudio.unlockAudio();
      setAudioEngaged(true);
      if (settings.ambientSound) {
        spaceAudio.startSpaceAmbient();
      }
      if (settings.sfxSound) {
        spaceAudio.playSoloLevelingNotificationChime();
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
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Phase 1: Sung Jinwoo Voice Dub for active anime titan
  useEffect(() => {
    if (phase === 'multiverse_scan') {
      if (settings.sfxSound) {
        spaceAudio.playAnimeCharacterVoiceBurst(currentCharacter.id);
      }
      speakJinwooDub(currentCharacter.jinwooDubScript);
    }
  }, [scanIndex, phase, voiceEnabled, isFastPaced]);

  // Fast Automatic Progression for Multiverse Scan (No Lag)
  useEffect(() => {
    if (phase !== 'multiverse_scan' || isPaused) return;

    setScanProgress(0);
    const intervalMs = 40;
    const step = (intervalMs / scanDuration) * 100;

    const progressTimer = setInterval(() => {
      setScanProgress((prev) => Math.min(100, prev + step));
    }, intervalMs);

    const stepTimer = setTimeout(() => {
      if (scanIndex < ANIME_TITANS_ROSTER.length - 1) {
        setScanIndex((prev) => prev + 1);
      } else {
        // Conclude Titans Scan -> Trigger Sung Jinwoo Weak Hunter Revelation!
        setPhase('weak_detection');
      }
    }, scanDuration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [phase, scanIndex, isPaused, scanDuration]);

  // Phase 2: Weak Hunter Revelation (Sung Jinwoo's own voice dub)
  useEffect(() => {
    if (phase === 'weak_detection') {
      if (settings.sfxSound) spaceAudio.playSoloLevelingNotificationChime();
      speakJinwooDub(
        'Then... in the darkest depths of the Double Dungeon, bleeding out on the stone altar with only zero point zero two percent of my life remaining... the System found me. Sung Jinwoo. The weakest hunter of all mankind.'
      );

      const timer = setTimeout(() => {
        setPhase('system_prompt');
      }, isFastPaced ? 3200 : 5400);

      return () => clearTimeout(timer);
    }
  }, [phase, isFastPaced]);

  // Phase 3: Quest Prompt Revelation (Sung Jinwoo's own voice dub)
  useEffect(() => {
    if (phase === 'system_prompt') {
      if (settings.sfxSound) spaceAudio.playSoloLevelingNotificationChime();
      speakJinwooDub(
        "A floating blue window appeared before my eyes: 'You have qualified to become a Player.' If my heart stopped, I was dead. I had to choose: die as a weakling... or Level Up."
      );
    }
  }, [phase]);

  const handleAccept = () => {
    setPhase('awakened');
    if (settings.sfxSound) spaceAudio.playArise();
    speakJinwooDub(
      "I accepted. That day, I took my first step from the weakest E-Rank hunter into the Shadow Monarch. Welcome, Player. It's time to Arise."
    );

    try {
      confetti({
        particleCount: 160,
        spread: 120,
        origin: { y: 0.55 },
        colors: ['#00E5FF', '#3B82F6', '#8B5CF6', '#FFFFFF', '#60A5FA', '#FFD700'],
      });
    } catch {}
  };

  const handleComplete = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (settings.sfxSound) spaceAudio.playTap();
    setShowCinematicIntro(false);
    if (!isAwakened) {
      setActiveTab('onboarding');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleReplayCurrent = () => {
    if (phase === 'multiverse_scan') {
      speakJinwooDub(currentCharacter.jinwooDubScript);
    } else if (phase === 'weak_detection') {
      speakJinwooDub(
        'Then... in the darkest depths of the Double Dungeon, bleeding out on the stone altar with only zero point zero two percent of my life remaining... the System found me. Sung Jinwoo. The weakest hunter of all mankind.'
      );
    } else if (phase === 'system_prompt') {
      speakJinwooDub(
        "A floating blue window appeared before my eyes: 'You have qualified to become a Player.' If my heart stopped, I was dead. I had to choose: die as a weakling... or Level Up."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020208] flex flex-col items-center justify-between p-2 sm:p-5 select-none overflow-hidden font-mono">
      {/* Background Deep Cosmic Grids & Nebular Shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A143A]/40 via-[#030514] to-black pointer-events-none" />
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#00e5ff15_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

      {/* TOP HEADER: Branding, Speed Mode, Jinwoo Voice Dub Toggle, Skip */}
      <div className="w-full max-w-2xl flex items-center justify-between z-40 gap-2 shrink-0 pt-1">
        <div className="flex items-center gap-2">
          <SystemLogo size={26} glow={true} />
          <div>
            <span className="text-[11px] font-orbitron font-extrabold text-white tracking-wider block leading-none">
              SOLO ARISE
            </span>
            <span className="text-[8px] sm:text-[9px] text-[#00E5FF] font-mono tracking-widest uppercase">
              JINWOO MONOLOGUE DUB
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Fast Pace Toggle */}
          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              setIsFastPaced((prev) => !prev);
            }}
            className={`px-2 py-1 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
              isFastPaced
                ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:text-white'
            }`}
            title="Toggle Fast Pace (No Waiting)"
          >
            <FastForward className="w-3 h-3" />
            <span className="hidden xs:inline">{isFastPaced ? 'FAST' : 'NORMAL'}</span>
          </button>

          {/* Jinwoo Voice Dub Toggle */}
          <button
            onClick={() => {
              if (voiceEnabled) {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setVoiceEnabled(false);
              } else {
                setVoiceEnabled(true);
              }
            }}
            className={`px-2.5 py-1 rounded-lg border text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              voiceEnabled
                ? 'border-[#00E5FF]/70 bg-[#00E5FF]/15 text-[#00E5FF] shadow-cyan-950'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}
            title="Toggle Sung Jinwoo Voice Dub"
          >
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
            <span>{voiceEnabled ? 'JINWOO DUB' : 'MUTED'}</span>
          </button>

          {/* Sound Synthesizer Unlocker */}
          <button
            onClick={activateIntroSound}
            className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
              audioEngaged
                ? 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300'
                : 'border-amber-500 bg-amber-950/70 text-amber-300 animate-pulse'
            }`}
            title="Sound SFX Status"
          >
            {audioEngaged ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Direct Skip Button */}
          <button
            onClick={handleComplete}
            className="px-2.5 py-1 rounded-lg border border-[#1A2548] bg-[#0A0D22]/90 text-[11px] text-slate-300 hover:text-white hover:border-[#00E5FF] transition-all flex items-center gap-1 shadow-md cursor-pointer"
          >
            <span>SKIP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN VISUAL STAGE: FULL BODY ANIME CHARACTER PHOTO SHOWCASE
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg flex-1 flex flex-col items-center justify-center my-1 sm:my-2">
        {/* PHASE 1: MULTIVERSE APEX TITANS FULL BODY PHOTO */}
        {phase === 'multiverse_scan' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            {/* Top Micro Progress Bar */}
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-[#1A2548] mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-[#00E5FF] to-cyan-300 transition-all duration-75"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            {/* FULL BODY CHARACTER PHOTO CONTAINER */}
            <div
              className={`relative w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4] rounded-2xl overflow-hidden border-2 ${currentCharacter.accentBorder} ${currentCharacter.glowColor} bg-[#040614] shadow-2xl transition-all duration-300`}
            >
              {/* Full Body Artwork Image */}
              <img
                src={currentCharacter.imageSrc}
                alt={currentCharacter.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter brightness-105 contrast-105"
              />

              {/* Cinematic Vignette & Bottom Gradient for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#02030B] via-transparent to-black/40 pointer-events-none" />

              {/* Top Banner: Dimension Code & Rejection Badge */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[#00E5FF] flex items-center gap-1">
                  <Crosshair className="w-3 h-3 text-[#00E5FF]" />
                  {currentCharacter.dimensionCode}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-950/80 backdrop-blur-md border border-red-500/80 text-red-300">
                  {currentCharacter.rejectionReason}
                </span>
              </div>

              {/* Bottom Character Identity Nameplate */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 space-y-0.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {currentCharacter.animeTitle}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-orbitron font-black text-xl sm:text-2xl text-white tracking-wide leading-none">
                    {currentCharacter.name}
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/50">
                    {currentCharacter.alias}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Character Thumb Switcher */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {ANIME_TITANS_ROSTER.map((char, idx) => (
                <button
                  key={char.id}
                  onClick={() => {
                    setScanIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border cursor-pointer ${
                    idx === scanIndex
                      ? 'border-[#00E5FF] bg-[#00E5FF] text-black shadow-[0_0_12px_#00E5FF]'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {char.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PHASE 2: WEAK HUNTER REVELATION (SUNG JINWOO FULL BODY) */}
        {phase === 'weak_detection' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] bg-[#040614]">
              <img
                src={JINWOO_HERO_IMAGE}
                alt="Sung Jinwoo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0204] via-transparent to-black/50 pointer-events-none" />

              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="px-2 py-0.5 rounded-md bg-red-950/90 border border-red-500 text-red-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 animate-bounce" />
                  CARTENON TEMPLE DOUBLE DUNGEON
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-white animate-pulse">
                  HP: 0.02%
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left p-3 rounded-xl bg-black/85 backdrop-blur-md border border-red-500/60 space-y-0.5">
                <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                  [VESSEL SELECTED BY THE SYSTEM]
                </div>
                <h3 className="font-orbitron font-black text-xl sm:text-2xl text-white tracking-wide leading-none">
                  SUNG JINWOO
                </h3>
                <div className="text-xs font-rajdhani font-bold text-red-200">
                  The Weakest Hunter of All Mankind · E-Rank
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: THE PLAYER QUALIFICATION QUEST PROMPT */}
        {phase === 'system_prompt' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#00E5FF] shadow-[0_0_40px_rgba(0,229,255,0.5)] bg-[#040614]">
              <img
                src={JINWOO_HERO_IMAGE}
                alt="Sung Jinwoo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020517] via-[#020517]/70 to-transparent pointer-events-none" />

              {/* Floating Holographic Quest Notification */}
              <div className="absolute inset-x-3 bottom-3 p-3.5 rounded-xl bg-[#060D2E]/95 border-2 border-[#00E5FF] backdrop-blur-md space-y-2.5 shadow-2xl text-left">
                <div className="flex items-center justify-between border-b border-[#00E5FF]/40 pb-1.5 text-[10px] font-mono">
                  <span className="text-[#00E5FF] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                    [ SYSTEM NOTIFICATION ]
                  </span>
                  <span className="text-red-400 font-bold">MANDATORY</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-orbitron font-black text-sm sm:text-base text-white leading-tight">
                    YOU HAVE QUALIFIED TO BECOME A &ldquo;PLAYER&rdquo;.
                  </h4>
                  <p className="text-[11px] font-rajdhani text-slate-300 leading-snug">
                    Will you accept the crucible and begin leveling up in reality?
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleAccept}
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#00E5FF] text-black font-orbitron font-black text-xs tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black" />
                    <span>[ ACCEPT QUEST ]</span>
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-3 py-2.5 rounded-lg border border-red-500/50 bg-red-950/40 text-red-400 font-orbitron font-bold text-[10px] hover:bg-red-950 cursor-pointer"
                  >
                    [ ARISE ]
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 4: WELCOME PLAYER AWAKENED */}
        {phase === 'awakened' && (
          <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#00E5FF] shadow-[0_0_50px_rgba(0,229,255,0.7)] bg-[#040614]">
              <img
                src={JINWOO_HERO_IMAGE}
                alt="Sung Jinwoo Awakened"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top filter brightness-115 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020517] via-transparent to-black/30 pointer-events-none" />

              <div className="absolute inset-x-3 bottom-3 p-3.5 rounded-xl bg-[#060D2E]/95 border-2 border-[#00E5FF] backdrop-blur-md space-y-2 text-center shadow-2xl">
                <span className="text-[10px] uppercase tracking-widest text-[#00E5FF] font-bold block">
                  [ THE SHADOW MONARCH AWAKENS ]
                </span>
                <h3 className="font-orbitron font-black text-lg sm:text-xl text-white tracking-widest leading-none">
                  WELCOME, PLAYER.
                </h3>
                <p className="text-[11px] font-rajdhani text-slate-300 leading-snug">
                  You are no longer the weakest hunter. Daily discipline begins now.
                </p>

                <button
                  onClick={handleComplete}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#00E5FF] text-black font-orbitron font-black text-xs tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>ENTER THE SYSTEM</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          BOTTOM DUB SUBTITLE TAPE & NAVIGATION (JINWOO DUB VOICE MONOLOGUE)
          ========================================================================= */}
      <div className="w-full max-w-2xl shrink-0 space-y-2">
        {/* Sung Jinwoo Dub Subtitles Card */}
        <div className="p-3 rounded-xl border border-cyan-500/50 bg-[#060A1F]/95 backdrop-blur-md text-left flex items-start gap-2.5 shadow-xl">
          <div className="p-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shrink-0 mt-0.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="flex-1 min-h-[36px]">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#00E5FF] mb-0.5">
              <span className="font-bold flex items-center gap-1">
                SUNG JINWOO (ANIME DUB MONOLOGUE):
              </span>
              <button
                onClick={handleReplayCurrent}
                className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden xs:inline">REPLAY DUB</span>
              </button>
            </div>
            <p className="text-xs sm:text-[13px] font-mono text-slate-100 font-semibold leading-snug italic">
              &ldquo;{currentSubtitle}&rdquo;
            </p>
          </div>
        </div>

        {/* Navigation Buttons for Manual Control */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              setScanIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={phase !== 'multiverse_scan' || scanIndex === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
          >
            ‹ PREV
          </button>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg border border-cyan-700/60 bg-cyan-950/40 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            {isPaused ? <Play className="w-3 h-3 fill-cyan-400" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              if (phase === 'multiverse_scan') {
                if (scanIndex < ANIME_TITANS_ROSTER.length - 1) {
                  setScanIndex((prev) => prev + 1);
                } else {
                  setPhase('weak_detection');
                }
              } else if (phase === 'weak_detection') {
                setPhase('system_prompt');
              } else if (phase === 'system_prompt') {
                handleAccept();
              } else {
                handleComplete();
              }
            }}
            className="px-4 py-1.5 rounded-lg border border-[#00E5FF] bg-gradient-to-r from-cyan-950 to-[#0A1A40] text-xs font-mono font-bold text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all cursor-pointer shadow-md"
          >
            {phase === 'awakened' ? 'ARISE ›' : 'NEXT ›'}
          </button>
        </div>
      </div>
    </div>
  );
};
