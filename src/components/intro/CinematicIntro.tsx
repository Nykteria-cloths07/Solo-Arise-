import React, { useState, useEffect } from 'react';
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
  Globe,
  Radio,
  Sparkles,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnimeDimensionScan {
  dimension: string;
  universe: string;
  character: string;
  status: string;
  evaluation: string;
}

const MULTIVERSE_SCANS: AnimeDimensionScan[] = [
  {
    dimension: 'DIMENSION 07-DB',
    universe: 'Dragon Ball Multiverse',
    character: 'Goku (Ultra Instinct)',
    status: 'GOD KI DETECTED',
    evaluation: 'ALREADY BORN WITH CELESTIAL PROWESS · REJECTED',
  },
  {
    dimension: 'DIMENSION 12-OP',
    universe: 'Grand Line / New World',
    character: 'Emperors of the Sea',
    status: 'CONQUEROR HAKI MAX',
    evaluation: 'NATURAL KINGLY WILL · REJECTED',
  },
  {
    dimension: 'DIMENSION 23-JJK',
    universe: 'Jujutsu Sorcery Realm',
    character: 'Satoru Gojo (Limitless)',
    status: 'SIX EYES DOMAIN ACTIVE',
    evaluation: 'BOUND BY NATURAL TALENT · REJECTED',
  },
  {
    dimension: 'DIMENSION 04-BLEACH',
    universe: 'Soul Society & Hueco Mundo',
    character: 'Soul King Candidates',
    status: 'SPIRITUAL REIARTERY MAX',
    evaluation: 'STATIC HEREDITARY VESSEL · REJECTED',
  },
  {
    dimension: 'DIMENSION 01-OPM',
    universe: 'City Z Wasteland',
    character: 'Saitama (Broken Limiter)',
    status: 'LIMITER REMOVED',
    evaluation: 'CANNOT HARVEST DISCIPLINE MANA · REJECTED',
  },
];

export const CinematicIntro: React.FC = () => {
  const { setShowCinematicIntro, isAwakened, setActiveTab, settings } = useSystem();
  
  // Phases: 'multiverse_scan' -> 'weak_detection' -> 'system_prompt' -> 'declining' -> 'awakened'
  const [phase, setPhase] = useState<
    'multiverse_scan' | 'weak_detection' | 'system_prompt' | 'declining' | 'awakened'
  >('multiverse_scan');

  const [scanIndex, setScanIndex] = useState<number>(0);
  const [declineCountdown, setDeclineCountdown] = useState<string>('0.02');

  useEffect(() => {
    // Start authentic deep space ambience immediately
    if (settings.ambientSound) {
      spaceAudio.startSpaceAmbient();
    }

    // Step 1: Multiverse anime scanning progression
    const scanInterval = setInterval(() => {
      setScanIndex((prev) => {
        if (prev < MULTIVERSE_SCANS.length - 1) {
          if (settings.sfxSound) spaceAudio.playTap();
          return prev + 1;
        } else {
          clearInterval(scanInterval);
          // Transition to Weak Hunter Detection!
          setTimeout(() => {
            setPhase('weak_detection');
            if (settings.sfxSound) spaceAudio.playPenalty();
          }, 800);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(scanInterval);
  }, [settings.ambientSound, settings.sfxSound]);

  // Transition from Weak Detection to System Window
  useEffect(() => {
    if (phase === 'weak_detection') {
      const timer = setTimeout(() => {
        setPhase('system_prompt');
        if (settings.sfxSound) {
          spaceAudio.playSystemChime();
        }
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [phase, settings.sfxSound]);

  const handleAccept = () => {
    setPhase('awakened');
    if (settings.sfxSound) {
      spaceAudio.playArise();
    }

    try {
      confetti({
        particleCount: 160,
        spread: 130,
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

    // Heartbeat countdown sequence: 0.02 -> 0.01 -> forced emergency awakening
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
    if (settings.sfxSound) spaceAudio.playTap();
    setShowCinematicIntro(false);
    if (!isAwakened) {
      setActiveTab('onboarding');
    } else {
      setActiveTab('dashboard');
    }
  };

  const currentScan = MULTIVERSE_SCANS[scanIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#020208] flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden font-mono">
      {/* Background Deep Cosmic & Void Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A143A]/45 via-[#030514] to-black pointer-events-none" />
      
      {/* Subtle floating blue particle grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#00e5ff15_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

      {/* Top Bar with SKIP Button */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <SystemLogo size={28} glow={false} />
          <span className="text-[10px] text-slate-400 font-mono tracking-widest hidden sm:inline-block">
            [SYS.PROTOCOL // MULTIVERSE APEX SCAN]
          </span>
        </div>

        <button
          onClick={handleComplete}
          className="px-4 py-2 rounded-xl border border-[#1A2548] bg-[#0A0D22]/90 text-xs text-slate-300 hover:text-white hover:border-[#00E5FF] transition-all flex items-center gap-1.5 shadow-md"
        >
          <span>SKIP INTRO</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* =========================================================================
          PHASE 1: MULTIVERSE SCAN (Traveling through strongest anime characters)
          ========================================================================= */}
      {phase === 'multiverse_scan' && (
        <div className="relative z-10 w-full max-w-lg bg-[#06091F]/90 border border-[#1A2548] rounded-2xl p-6 sm:p-7 backdrop-blur-xl glow-blue shadow-2xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl border-2 border-[#00E5FF] bg-[#00E5FF]/10 mx-auto flex items-center justify-center glow-blue text-[#00E5FF]">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00E5FF] font-bold">
              [ DIMENSIONAL VESSEL EVALUATION ]
            </span>
            <h2 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white tracking-wide">
              SCANNING MULTIVERSE FOR THE SOVEREIGN...
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              The System seeks a vessel capable of infinite discipline and growth.
            </p>
          </div>

          {/* Active Dimension Radar Readout */}
          <div className="p-4 rounded-xl border border-[#1A2548] bg-[#030514] text-left space-y-2">
            <div className="flex items-center justify-between border-b border-[#141B3B] pb-1.5 text-xs font-mono">
              <span className="text-[#00E5FF] font-bold">{currentScan.dimension}</span>
              <span className="text-amber-400">{currentScan.status}</span>
            </div>
            <div className="text-sm font-bold text-white font-orbitron">
              Realm: {currentScan.universe}
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Entity: {currentScan.character}
            </div>
            <div className="text-[11px] text-red-400 font-mono pt-1">
              › {currentScan.evaluation}
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {MULTIVERSE_SCANS.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === scanIndex
                    ? 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] scale-125'
                    : i < scanIndex
                    ? 'bg-slate-600'
                    : 'bg-slate-900'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 2: WEAK HUNTER DETECTION (The Sudden Shift to Jinwoo in Cartenon)
          ========================================================================= */}
      {phase === 'weak_detection' && (
        <div className="relative z-10 w-full max-w-lg bg-[#140608]/90 border-2 border-red-500/80 rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-5 text-center animate-pulse">
          <div className="w-16 h-16 rounded-2xl border-2 border-red-500 bg-red-950/60 mx-auto flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
            <AlertTriangle className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full border border-red-500 bg-red-950 text-red-300 text-[11px] font-bold tracking-widest uppercase">
              [ DIMENSIONAL ANOMALY OVERRIDE ]
            </div>
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-widest">
              WEAK HUNTER DETECTED.
            </h2>
            <p className="font-rajdhani text-base sm:text-lg text-red-200 leading-snug">
              &ldquo;The System does not choose the already-strong. The System builds the Monarch from the ashes of the weak.&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-xl border border-red-900/80 bg-[#0A0204] text-left space-y-1.5 font-mono text-xs text-slate-300">
            <div>
              Target: <strong className="text-white">Sung Jinwoo</strong> (The Weakest E-Rank Hunter)
            </div>
            <div>
              Coordinates: <strong className="text-red-400">Double Dungeon · Cartenon Temple Altar</strong>
            </div>
            <div>
              Life Force Remaining: <span className="text-red-400 font-bold">0.02%</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Survival Probability without System Intervention: 0.000%
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 3: THE ICONIC HOLOGRAPHIC SYSTEM WINDOW
          ========================================================================= */}
      {(phase === 'system_prompt' || phase === 'declining') && (
        <div className="relative z-10 w-full max-w-xl bg-[#060A22]/95 border-2 border-[#00E5FF] rounded-2xl p-6 sm:p-8 backdrop-blur-2xl glow-blue-lg shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#00E5FF]/40 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
              <span className="font-orbitron font-extrabold text-xs sm:text-sm tracking-widest text-[#00E5FF]">
                [ SYSTEM NOTIFICATION: QUEST PROMPT ]
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest">
              AUTH: THE SOLE PLAYER
            </span>
          </div>

          {/* Quest Prompt Body */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#4D9FFF] font-mono uppercase tracking-wider block">
                [QUEST: Courage of the Weak]
              </span>
              <h3 className="font-orbitron font-black text-xl sm:text-2xl text-white tracking-wide leading-snug">
                YOU HAVE QUALIFIED TO BECOME A "PLAYER".
              </h3>
            </div>

            <p className="font-rajdhani text-base sm:text-lg text-[#D0E2FF] leading-relaxed">
              If you accept, you will obtain the qualification to Level Up in reality. You will surpass every entity across fiction. Will you accept?
            </p>

            {/* The Famous 0.02s Heart Stopping Warning */}
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
              className="w-full sm:flex-1 py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#00E5FF] text-black font-orbitron font-black text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all glow-blue shadow-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>[ ACCEPT QUEST ]</span>
            </button>

            <button
              onClick={handleDeclineAttempt}
              className="w-full sm:w-auto px-6 py-4 rounded-xl border border-red-500/50 bg-red-950/20 text-red-400 font-orbitron font-bold text-xs tracking-wider hover:bg-red-950/50 active:scale-95 transition-colors"
            >
              [ DECLINE ]
            </button>
          </div>

          <div className="text-center pt-1">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              RECOGNIZE DISCIPLINE. SURPASS ALL GODS AND MONARCHS.
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 4: AWAKENED AS A PLAYER ("ARISE")
          ========================================================================= */}
      {phase === 'awakened' && (
        <div className="relative z-10 w-full max-w-xl bg-[#060A22]/95 border-2 border-[#00E5FF] rounded-2xl p-6 sm:p-8 backdrop-blur-2xl glow-blue-lg shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-500">
          
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

            <p className="text-[10px] text-slate-500 font-mono pt-1">
              *Top 1% discipline ranking threshold unlocked.
            </p>
          </div>

          {/* Complete and Arise Button */}
          <button
            onClick={handleComplete}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#00E5FF] text-black font-orbitron font-black text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all glow-blue shadow-lg flex items-center justify-center gap-2"
          >
            <span>ARISE & ENTER THE SYSTEM</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
