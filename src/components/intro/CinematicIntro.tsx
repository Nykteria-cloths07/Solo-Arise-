import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';
import { phonkAudio } from '../../audio/phonkAudioEngine';
import { SystemLogo } from '../common/SystemLogo';
import {
  Zap,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  ChevronRight,
  Shield,
  Eye,
  Crosshair,
  Sparkles,
  Flame,
  Swords,
  FastForward,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface AwakeningCharacterConfig {
  id: string;
  name: string;
  archetypeTitle: string;
  subTitle: string;
  imageSrc: string;
  eyeGlowType: 'cyan' | 'silver' | 'purple' | 'amber';
  eyeColorHex: string;
  auraGradient: string;
  borderColor: string;
  badgeBg: string;
  dialogueText: string;
  dialogueSub: string;
  voiceAudioUrl: string;
  musicTrackUrl: string;
  styleKey: string;
}

export const AWAKENING_CHARACTERS: AwakeningCharacterConfig[] = [
  {
    id: 'shadow_hunter',
    name: 'SHADOW MONARCH',
    archetypeTitle: 'Shadow Hunter Style',
    subTitle: 'The Weakest Hunter Crawls from the Ashes',
    imageSrc: '/src/assets/images/jinwoo_shadow_monarch_1791873442926.jpg',
    eyeGlowType: 'cyan',
    eyeColorHex: '#00E5FF',
    auraGradient: 'from-cyan-500/40 via-purple-900/30 to-black',
    borderColor: 'border-cyan-400',
    badgeBg: 'bg-cyan-950/80 border-cyan-400/80 text-cyan-300',
    dialogueText: 'THE SHADOWS ANSWER TO ME. ARISE.',
    dialogueSub: 'I was never finished. From the ashes of weakness, I conquer.',
    voiceAudioUrl: '/assets/awakening/voices/shadow_hunter_roar.mp3',
    musicTrackUrl: '/assets/awakening/music/dark_phonk_awakening.mp3',
    styleKey: 'shadow',
  },
  {
    id: 'saiyan_warrior',
    name: 'CELESTIAL SAIYAN',
    archetypeTitle: 'Saiyan Warrior Style',
    subTitle: 'Ultra Instinct Divine Ki & Limit Shattering',
    imageSrc: '/src/assets/images/goku_ultra_instinct_1791873441276.jpg',
    eyeGlowType: 'silver',
    eyeColorHex: '#E2E8F0',
    auraGradient: 'from-blue-400/35 via-slate-100/25 to-blue-950/50',
    borderColor: 'border-blue-300',
    badgeBg: 'bg-blue-950/80 border-blue-400/80 text-blue-200',
    dialogueText: 'EVERY LIMIT IS A CHALLENGE TO BREAK.',
    dialogueSub: 'Surpass the gods. Push through every biological wall.',
    voiceAudioUrl: '/assets/awakening/voices/saiyan_warrior_roar.mp3',
    musicTrackUrl: '/assets/awakening/music/dark_phonk_awakening.mp3',
    styleKey: 'saiyan',
  },
  {
    id: 'cursed_king',
    name: 'THE HONORED ONE',
    archetypeTitle: 'Cursed King / Six Eyes Style',
    subTitle: 'Unlimited Void Spatial Divide & Controlled Rage',
    imageSrc: '/src/assets/images/gojo_satoru_infinity_1791873441456.jpg',
    eyeGlowType: 'purple',
    eyeColorHex: '#60A5FA',
    auraGradient: 'from-purple-600/40 via-cyan-500/20 to-indigo-950/50',
    borderColor: 'border-purple-400',
    badgeBg: 'bg-purple-950/80 border-purple-500/80 text-purple-300',
    dialogueText: 'THROUGHOUT HEAVEN AND EARTH... POWER IS CLAIMED.',
    dialogueSub: 'Controlled aggression. The domain of absolute discipline.',
    voiceAudioUrl: '/assets/awakening/voices/cursed_king_roar.mp3',
    musicTrackUrl: '/assets/awakening/music/dark_phonk_awakening.mp3',
    styleKey: 'cursed',
  },
  {
    id: 'iron_discipline',
    name: 'THE BROKEN LIMITER',
    archetypeTitle: 'Iron Discipline Warrior Style',
    subTitle: '100 Pushups Daily Crucible & Unbending Will',
    imageSrc: '/src/assets/images/saitama_one_punch_1791873442741.jpg',
    eyeGlowType: 'amber',
    eyeColorHex: '#F59E0B',
    auraGradient: 'from-amber-500/40 via-yellow-600/20 to-black',
    borderColor: 'border-amber-400',
    badgeBg: 'bg-amber-950/80 border-amber-400/80 text-amber-300',
    dialogueText: 'DAY BY DAY. THE IRON WILL NEVER BENDS.',
    dialogueSub: '100 pushups. 100 squats. The daily grind never lies.',
    voiceAudioUrl: '/assets/awakening/voices/iron_discipline_roar.mp3',
    musicTrackUrl: '/assets/awakening/music/dark_phonk_awakening.mp3',
    styleKey: 'iron',
  },
];

type CinematicScene =
  | 'shot_a_darkness'
  | 'shot_b_reveal'
  | 'shot_c_buildup'
  | 'shot_d_roar'
  | 'shot_e_dialogue'
  | 'shot_f_arise';

export const CinematicIntro: React.FC = () => {
  const {
    completeAwakeningIntro,
    selectedAwakeningCharacter,
    setSelectedAwakeningCharacter,
    isAwakened,
    setActiveTab,
  } = useSystem();

  // Mode: 'selection' (Launcher) vs 'cinematic' (Live Animation)
  const [mode, setMode] = useState<'selection' | 'cinematic'>('selection');
  const [currentScene, setCurrentScene] = useState<CinematicScene>('shot_a_darkness');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFastForward, setIsFastForward] = useState<boolean>(false);

  // Active Selected Character Configuration
  const selectedChar =
    AWAKENING_CHARACTERS.find((c) => c.id === selectedAwakeningCharacter) || AWAKENING_CHARACTERS[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneTimerRef = useRef<number[]>([]);

  // Cleanup timers & audio on unmount
  const clearAllSceneTimers = () => {
    sceneTimerRef.current.forEach((t) => window.clearTimeout(t));
    sceneTimerRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearAllSceneTimers();
      phonkAudio.stopAll();
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    phonkAudio.setMuted(nextMuted);
  };

  /**
   * START THE 7-SHOT CINEMATIC ANIME AWAKENING SEQUENCE
   */
  const startAwakeningSequence = async () => {
    // Unlock browser audio context on user gesture
    await phonkAudio.unlockAudio();
    phonkAudio.setMuted(isMuted);

    // Attempt to load custom music track asset if available
    phonkAudio.playCustomAudioTrack(selectedChar.musicTrackUrl);

    clearAllSceneTimers();
    setMode('cinematic');
    setCurrentScene('shot_a_darkness');

    // SCENE 1 (SHOT A): Darkness & Heartbeat (0 - 1800ms)
    phonkAudio.startAtmosphericTension();
    phonkAudio.playHeartbeatImpact();

    const speedMultiplier = isFastForward ? 0.6 : 1.0;

    // Shot A part 2: Eye opening glint
    const tEye = window.setTimeout(() => {
      phonkAudio.playHeartbeatImpact();
      phonkAudio.playEyeOpenGlint(selectedChar.eyeGlowType);
    }, 900 * speedMultiplier);
    sceneTimerRef.current.push(tEye);

    // SCENE 2 (SHOT B): Full-Body Reveal & Camera Pullback (1800ms - 4200ms)
    const tShotB = window.setTimeout(() => {
      setCurrentScene('shot_b_reveal');
    }, 1800 * speedMultiplier);
    sceneTimerRef.current.push(tShotB);

    // SCENE 3 (SHOT C): Power Buildup & Manga Speed Lines (4200ms - 7000ms)
    const tShotC = window.setTimeout(() => {
      setCurrentScene('shot_c_buildup');
      phonkAudio.playEnergyRiser();
    }, 4200 * speedMultiplier);
    sceneTimerRef.current.push(tShotC);

    // SCENE 4 (SHOT D): The Power Release & 808 Bass Drop / Battle Roar (7000ms - 9400ms)
    const tShotD = window.setTimeout(() => {
      setCurrentScene('shot_d_roar');
      // Attempt custom voice roar or play synthesized audio
      phonkAudio.playCustomAudioTrack(selectedChar.voiceAudioUrl);
      phonkAudio.playBattleRoarAnd808Drop(selectedChar.styleKey);
    }, 7000 * speedMultiplier);
    sceneTimerRef.current.push(tShotD);

    // SCENE 5 (SHOT E): Signature Dialogue & Final Awakened Stance (9400ms - 12000ms)
    const tShotE = window.setTimeout(() => {
      setCurrentScene('shot_e_dialogue');
    }, 9400 * speedMultiplier);
    sceneTimerRef.current.push(tShotE);

    // SCENE 6 (SHOT F): System Mandate & Arise (12000ms+)
    const tShotF = window.setTimeout(() => {
      setCurrentScene('shot_f_arise');
      phonkAudio.playAwakenedSystemChime();
      try {
        confetti({
          particleCount: 140,
          spread: 120,
          origin: { y: 0.55 },
          colors: [selectedChar.eyeColorHex, '#00E5FF', '#3B82F6', '#FFFFFF', '#60A5FA', '#FFD700'],
        });
      } catch {}
    }, 12000 * speedMultiplier);
    sceneTimerRef.current.push(tShotF);
  };

  /**
   * Final transition into the application dashboard
   */
  const handleEnterApplication = () => {
    phonkAudio.stopAll();
    clearAllSceneTimers();
    completeAwakeningIntro(); // Marks persistent introCompleted = true!
    if (!isAwakened) {
      setActiveTab('onboarding');
    } else {
      setActiveTab('dashboard');
    }
  };

  /**
   * CANVAS PARTICLES & SPEED LINES ENGINE
   */
  useEffect(() => {
    if (mode !== 'cinematic') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1,
      speedY: -(Math.random() * 2.5 + 1.2),
      speedX: (Math.random() - 0.5) * 1.5,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    // Manga speed lines radiating outward
    const speedLineCount = 36;
    let lineAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Drifting Energy Ember Particles (Shots B, C, D, E)
      if (currentScene !== 'shot_a_darkness') {
        const particleColor = selectedChar.eyeColorHex;
        particles.forEach((p) => {
          p.y += p.speedY * (currentScene === 'shot_c_buildup' || currentScene === 'shot_d_roar' ? 2.5 : 1);
          p.x += p.speedX;
          if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.globalAlpha = p.opacity;
          ctx.shadowBlur = 8;
          ctx.shadowColor = particleColor;
          ctx.fill();
        });
      }

      // 2. Manga Speed Lines during Buildup and Roar
      if (currentScene === 'shot_c_buildup' || currentScene === 'shot_d_roar') {
        ctx.save();
        const centerX = width / 2;
        const centerY = height / 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = currentScene === 'shot_d_roar' ? 2.5 : 1.2;
        lineAngle += 0.02;

        for (let i = 0; i < speedLineCount; i++) {
          const angle = (i * (Math.PI * 2)) / speedLineCount + lineAngle;
          const innerDist = Math.min(width, height) * 0.22;
          const outerDist = Math.max(width, height) * 0.85;

          const startX = centerX + Math.cos(angle) * (innerDist + Math.random() * 40);
          const startY = centerY + Math.sin(angle) * (innerDist + Math.random() * 40);
          const endX = centerX + Math.cos(angle) * outerDist;
          const endY = centerY + Math.sin(angle) * outerDist;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.globalAlpha = Math.random() * 0.45 + 0.15;
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [mode, currentScene, selectedChar]);

  // =========================================================================
  // VIEW A: LAUNCHER & CHARACTER SELECTION (Displayed before awakening)
  // =========================================================================
  if (mode === 'selection') {
    return (
      <div className="fixed inset-0 z-50 bg-[#020208] flex flex-col justify-between p-3 sm:p-6 select-none overflow-y-auto font-mono text-[#E8F0FF]">
        {/* Background Deep Space Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A143A]/40 via-[#030514] to-black pointer-events-none" />
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#00e5ff15_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

        {/* TOP BAR */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#141B3B] pb-3">
          <div className="flex items-center gap-2.5">
            <SystemLogo size={28} glow={true} />
            <div>
              <span className="text-xs font-orbitron font-black text-white tracking-widest block leading-none">
                SOLO ARISE
              </span>
              <span className="text-[9px] text-[#00E5FF] font-mono tracking-widest uppercase">
                ANIME AWAKENING ENGINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mute Button */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                !isMuted
                  ? 'border-cyan-500/70 bg-cyan-950/60 text-[#00E5FF]'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
              title="Toggle Audio"
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fast Pace Mode Toggle */}
            <button
              onClick={() => setIsFastForward((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                isFastForward
                  ? 'border-amber-400 bg-amber-950/80 text-amber-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400'
              }`}
              title="Toggle Fast Timeline Pace"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{isFastForward ? 'FAST 1.6X' : 'NORMAL'}</span>
            </button>

            {/* Skip Direct to Dashboard */}
            <button
              onClick={handleEnterApplication}
              className="px-3 py-1.5 rounded-xl border border-[#1A2548] bg-[#0A0D22]/90 text-xs font-mono text-slate-300 hover:text-white hover:border-[#00E5FF] transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>SKIP INTRO</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CENTER CONTENT: CHARACTER EXPERIENCE SELECTION */}
        <div className="relative z-10 max-w-4xl w-full mx-auto my-4 space-y-4 text-center">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#00E5FF] font-bold">
              [ CHOOSE YOUR AWAKENING VESSEL ]
            </span>
            <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-wider">
              SELECT YOUR WARRIOR ARCHETYPE
            </h1>
            <p className="font-rajdhani text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
              Every day begins with a choice: remain in weakness or awaken the inner crucible.
            </p>
          </div>

          {/* 4 CHARACTER SELECTION CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {AWAKENING_CHARACTERS.map((char) => {
              const isSelected = char.id === selectedChar.id;
              return (
                <div
                  key={char.id}
                  onClick={() => setSelectedAwakeningCharacter(char.id)}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? `${char.borderColor} shadow-[0_0_25px_rgba(0,229,255,0.4)] scale-[1.02] bg-[#080D26]`
                      : 'border-slate-800/80 bg-[#050716]/80 hover:border-slate-600 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Top Character Artwork Preview */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                    <img
                      src={char.imageSrc}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050716] via-transparent to-transparent" />

                    {/* Active Selected Check Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#00E5FF] text-black text-[9px] font-bold font-mono tracking-wider">
                        ACTIVE
                      </div>
                    )}
                  </div>

                  {/* Bottom Info Card */}
                  <div className="p-3 space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                      {char.archetypeTitle}
                    </span>
                    <h3 className="font-orbitron font-extrabold text-sm sm:text-base text-white leading-tight">
                      {char.name}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-300 italic line-clamp-2 pt-0.5">
                      &ldquo;{char.dialogueText}&rdquo;
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTION BAR: START AWAKENING vs SKIP */}
        <div className="relative z-10 max-w-xl w-full mx-auto flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={startAwakeningSequence}
            className="w-full sm:flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#00E5FF] text-black font-orbitron font-black text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,229,255,0.6)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>START AWAKENING</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={handleEnterApplication}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-700 bg-black/60 text-slate-300 font-orbitron font-bold text-xs hover:text-white hover:border-[#00E5FF] active:scale-95 transition-all cursor-pointer"
          >
            SKIP TO SYSTEM
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: LIVE CINEMATIC ANIME POWER-AWAKENING EXPERIENCE (SHOT A - F)
  // =========================================================================
  return (
    <div
      className={`fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center select-none overflow-hidden font-mono text-white ${
        currentScene === 'shot_d_roar' ? 'anime-shake-intense' : ''
      }`}
    >
      {/* Dynamic Background Particle & Manga Speed Lines Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" />

      {/* TOP OVERLAY HUD: Scene tracker, Mute, Replay, Skip */}
      <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-40 gap-2">
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
          <span className="text-[10px] font-orbitron font-bold tracking-widest text-[#00E5FF]">
            {currentScene === 'shot_a_darkness' && 'SHOT A · THE AWAKENING'}
            {currentScene === 'shot_b_reveal' && 'SHOT B · FULL-BODY REVEAL'}
            {currentScene === 'shot_c_buildup' && 'SHOT C · POWER BUILDUP'}
            {currentScene === 'shot_d_roar' && 'SHOT D · ROAR & 808 IMPACT'}
            {currentScene === 'shot_e_dialogue' && 'SHOT E · SIGNATURE LINE'}
            {currentScene === 'shot_f_arise' && 'SHOT F · SYSTEM MANDATE'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl border text-xs backdrop-blur-md transition-all cursor-pointer ${
              !isMuted
                ? 'border-cyan-500/70 bg-black/80 text-[#00E5FF]'
                : 'border-slate-800 bg-black/80 text-slate-500'
            }`}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Replay */}
          <button
            onClick={startAwakeningSequence}
            className="p-2 rounded-xl border border-slate-700 bg-black/80 backdrop-blur-md text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Restart Sequence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Skip Direct to Dashboard */}
          <button
            onClick={handleEnterApplication}
            className="px-3 py-1.5 rounded-xl border border-white/20 bg-black/80 backdrop-blur-md text-xs font-mono text-slate-200 hover:text-white hover:border-[#00E5FF] transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>SKIP ›</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          CINEMATIC STAGE: FULL-BODY CHARACTER RENDER WITH CAMERA ZOOM
          ===================================================================== */}
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* SHOT A: TOTAL VOID DARKNESS & CLOSE-UP EYE IGNITION */}
        {currentScene === 'shot_a_darkness' && (
          <div className="relative z-30 w-full h-full flex flex-col items-center justify-center bg-black animate-in fade-in duration-300">
            {/* Eye close-up container */}
            <div className="relative w-64 h-32 overflow-hidden rounded-2xl flex items-center justify-center">
              {/* Intense Glowing Eye Spark */}
              <div
                className="w-16 h-16 rounded-full anime-eye-glint shadow-[0_0_60px_#00E5FF]"
                style={{
                  backgroundColor: selectedChar.eyeColorHex,
                  boxShadow: `0 0 60px ${selectedChar.eyeColorHex}, 0 0 100px ${selectedChar.eyeColorHex}`,
                }}
              />
            </div>
            <div className="text-center pt-6 space-y-1">
              <span className="text-[11px] font-mono tracking-widest text-slate-500 block uppercase">
                [ VESSEL HEARTBEAT DETECTED ]
              </span>
              <h2 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white tracking-widest">
                DEEP WITHIN THE VOID...
              </h2>
            </div>
          </div>
        )}

        {/* SHOT B to SHOT F: FULL-BODY CHARACTER IN CINEMATIC ENVIRONMENT */}
        {currentScene !== 'shot_a_darkness' && (
          <div
            className={`relative flex items-center justify-center w-full h-full transition-transform duration-700 ease-out ${
              currentScene === 'shot_b_reveal'
                ? 'scale-100'
                : currentScene === 'shot_c_buildup'
                ? 'scale-110'
                : currentScene === 'shot_d_roar'
                ? 'scale-115'
                : 'scale-105'
            }`}
          >
            {/* Deep Atmospheric Shadow & Rim Lighting Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-black to-black pointer-events-none" />

            {/* FULL-BODY CHARACTER FRAME */}
            <div className="relative z-10 h-[82vh] max-h-[820px] aspect-[3/4] rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl flex items-center justify-center bg-[#03040C]">
              <img
                src={selectedChar.imageSrc}
                alt={selectedChar.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-top filter transition-all duration-500 ${
                  currentScene === 'shot_d_roar'
                    ? 'brightness-125 contrast-125 saturate-125'
                    : 'brightness-105 contrast-110'
                }`}
              />

              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

              {/* Dynamic Aura Glow Rim */}
              <div
                className={`absolute inset-0 opacity-60 pointer-events-none transition-opacity duration-300 ${
                  currentScene === 'shot_d_roar' ? 'opacity-90' : 'opacity-40'
                }`}
                style={{
                  boxShadow: `inset 0 0 80px ${selectedChar.eyeColorHex}`,
                }}
              />

              {/* Lightning flash cut in Shot D */}
              {currentScene === 'shot_d_roar' && (
                <div className="absolute inset-0 bg-white/40 anime-lightning-flash pointer-events-none" />
              )}

              {/* Expanding Shockwave Ring in Shot D */}
              {currentScene === 'shot_d_roar' && (
                <div
                  className="absolute w-48 h-48 rounded-full border-4 anime-shockwave-ring pointer-events-none"
                  style={{ borderColor: selectedChar.eyeColorHex }}
                />
              )}
            </div>
          </div>
        )}

        {/* SHOT B: FULL-BODY REVEAL TITLE BADGE */}
        {currentScene === 'shot_b_reveal' && (
          <div className="absolute bottom-10 inset-x-4 z-30 max-w-lg mx-auto text-center space-y-1.5 animate-in fade-in slide-in-from-bottom-6 duration-400">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest border border-white/20 bg-black/70 backdrop-blur-md text-[#00E5FF]">
              [ FULL-BODY REVEAL: {selectedChar.name} ]
            </span>
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-widest drop-shadow-lg">
              VESSEL AWAKENING INITIATED
            </h2>
          </div>
        )}

        {/* SHOT C: POWER BUILDUP HUD */}
        {currentScene === 'shot_c_buildup' && (
          <div className="absolute bottom-10 inset-x-4 z-30 max-w-lg mx-auto text-center space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest border border-cyan-400 bg-cyan-950/80 text-cyan-300 animate-pulse">
              [ POWER SURGE REACHING 100% ]
            </span>
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-widest drop-shadow-lg">
              BREAKING THE LIMITER...
            </h2>
          </div>
        )}

        {/* SHOT D: POWER RELEASE & ROAR TITLE */}
        {currentScene === 'shot_d_roar' && (
          <div className="absolute bottom-10 inset-x-4 z-30 max-w-lg mx-auto text-center space-y-1.5 animate-in zoom-in-105 duration-200">
            <span className="px-4 py-1.5 rounded-full text-xs font-mono font-black tracking-widest border-2 border-white bg-red-600 text-white animate-bounce shadow-2xl">
              [ MAXIMUM POWER UNLEASHED ]
            </span>
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white tracking-widest drop-shadow-[0_0_20px_#00E5FF]">
              ARISE & CONQUER!
            </h2>
          </div>
        )}

        {/* SHOT E: SIGNATURE DIALOGUE TYPOGRAPHY */}
        {currentScene === 'shot_e_dialogue' && (
          <div className="absolute bottom-8 inset-x-4 z-30 max-w-xl mx-auto text-center p-4 rounded-2xl bg-black/85 backdrop-blur-xl border-2 border-white/20 space-y-1.5 animate-in fade-in slide-in-from-bottom-8 duration-400 shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
              [ {selectedChar.name} · SIGNATURE MANDATE ]
            </span>
            <h2
              className="font-orbitron font-black text-xl sm:text-2xl text-white tracking-wide leading-tight"
              style={{ textShadow: `0 0 20px ${selectedChar.eyeColorHex}` }}
            >
              &ldquo;{selectedChar.dialogueText}&rdquo;
            </h2>
            <p className="text-xs sm:text-sm font-rajdhani text-slate-300 italic font-semibold">
              {selectedChar.dialogueSub}
            </p>
          </div>
        )}

        {/* SHOT F: SYSTEM QUEST MANDATE & ENTER APPLICATION */}
        {currentScene === 'shot_f_arise' && (
          <div className="absolute inset-x-4 bottom-8 z-30 max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-[#060D2E]/95 border-2 border-[#00E5FF] backdrop-blur-xl space-y-3 shadow-[0_0_50px_rgba(0,229,255,0.6)] animate-in zoom-in-95 duration-400 text-left">
            <div className="flex items-center justify-between border-b border-[#00E5FF]/40 pb-2 text-[10px] font-mono">
              <span className="text-[#00E5FF] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                [ SYSTEM NOTIFICATION: PLAYER AWAKENED ]
              </span>
              <span className="text-cyan-300 font-bold">MANDATE CONFIRMED</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-orbitron font-black text-base sm:text-lg text-white leading-tight">
                THIS IS YOUR SYSTEM.
              </h3>
              <p className="font-rajdhani text-sm text-slate-300 leading-snug">
                Every day, you become stronger. Your daily quests and personal crucible await.
              </p>
            </div>

            <button
              onClick={handleEnterApplication}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#4D9FFF] to-[#00E5FF] text-black font-orbitron font-black text-xs sm:text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ENTER THE SYSTEM</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM SHOT TIMELINE TRACKER DOTS */}
      <div className="absolute bottom-3 inset-x-0 z-40 flex items-center justify-center gap-1.5 pointer-events-none">
        {(
          [
            'shot_a_darkness',
            'shot_b_reveal',
            'shot_c_buildup',
            'shot_d_roar',
            'shot_e_dialogue',
            'shot_f_arise',
          ] as CinematicScene[]
        ).map((s) => (
          <span
            key={s}
            className={`h-1 rounded-full transition-all duration-300 ${
              s === currentScene ? 'w-6 bg-[#00E5FF]' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
