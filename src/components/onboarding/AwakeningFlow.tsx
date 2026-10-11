import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import { Shield, Swords, Zap, HeartPulse, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { HunterClass } from '../../types/system';
import confetti from 'canvas-confetti';

export const AwakeningFlow: React.FC = () => {
  const { completeOnboarding, settings } = useSystem();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('Sung Jinwoo');
  const [age, setAge] = useState<number>(24);
  const [height, setHeight] = useState<number>(180);
  const [weight, setWeight] = useState<number>(76);
  const [gender, setGender] = useState<string>('Male');

  const [fitnessLevel, setFitnessLevel] = useState<number>(5);
  const [mentalLevel, setMentalLevel] = useState<number>(5);
  const [disciplineLevel, setDisciplineLevel] = useState<number>(5);

  const [selectedClass, setSelectedClass] = useState<HunterClass>('Warrior');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Build Muscle & Iron Strength',
    'Unbreakable Mental Callus',
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [assignedRank, setAssignedRank] = useState<string | null>(null);

  const goalOptions = [
    'Build Muscle & Iron Strength',
    'Cut Body Fat & Razor Definition',
    'Unbreakable Mental Callus',
    'Transform Like Sung Jinwoo',
    'Elite Cardio & 5km/10km Endurance',
    'Master Gateway & Paranormal Research',
    'Zero Excuses Goggins Discipline',
  ];

  const handleNext = () => {
    if (settings.sfxSound) spaceAudio.playTap();
    if (step < 5) {
      setStep(step + 1);
    } else if (step === 5) {
      // Step 6: System Analysis & Initial Rank Assignment
      setStep(6);
      setIsAnalyzing(true);
      if (settings.sfxSound) spaceAudio.playRecoveryPulse();

      setTimeout(() => {
        setIsAnalyzing(false);
        setAssignedRank('E');
        if (settings.sfxSound) spaceAudio.playRankUp();

        // Explosive blue particle burst
        try {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#00E5FF', '#4D9FFF', '#1A2D69', '#FFFFFF'],
          });
        } catch (e) {
          console.warn(e);
        }
      }, 2500);
    }
  };

  const handleBack = () => {
    if (settings.sfxSound) spaceAudio.playTap();
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    // Generate base stats based on assessment sliders & class
    const baseStats = {
      strength: 10 + Math.floor(fitnessLevel * 0.8) + (selectedClass === 'Warrior' ? 4 : 0),
      endurance: 10 + Math.floor(fitnessLevel * 0.7) + (selectedClass === 'Tank' ? 4 : 0),
      stamina: 10 + Math.floor(fitnessLevel * 0.7),
      agility: 10 + Math.floor(fitnessLevel * 0.6) + (selectedClass === 'Assassin' ? 4 : 0),
      mentalFortitude: 10 + Math.floor(mentalLevel * 1.2) + (selectedClass === 'Mage' ? 4 : 0),
      recovery: 10 + Math.floor(disciplineLevel * 0.8),
    };

    completeOnboarding({
      name: name.trim() || 'Hunter',
      age,
      height,
      weight,
      gender,
      hunterClass: selectedClass,
      primaryGoals: selectedGoals,
      stats: baseStats,
    });
  };

  const toggleGoal = (goal: string) => {
    if (settings.sfxSound) spaceAudio.playTap();
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const classes: { id: HunterClass; name: string; desc: string; icon: any; color: string }[] = [
    {
      id: 'Warrior',
      name: 'WARRIOR',
      desc: 'Dominates with raw explosive strength, iron core, and brutal mechanical leverage.',
      icon: Swords,
      color: 'border-red-500/50 text-red-400',
    },
    {
      id: 'Assassin',
      name: 'ASSASSIN',
      desc: 'Blinding speed, agile sprint cadence, stealth reflexes, and rapid cardiovascular recovery.',
      icon: Zap,
      color: 'border-cyan-500/50 text-cyan-400',
    },
    {
      id: 'Mage',
      name: 'MAGE',
      desc: 'Unshakable cognitive focus, deep meditation mastery, and esoteric 4D research comprehension.',
      icon: Shield,
      color: 'border-purple-500/50 text-purple-400',
    },
    {
      id: 'Tank',
      name: 'TANK',
      desc: 'Unbreakable physiological durability, cold endurance, sustained load capacity, and heavy recovery.',
      icon: HeartPulse,
      color: 'border-amber-500/50 text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#07091B]/90 border border-[#1A2548] rounded-2xl p-6 sm:p-10 backdrop-blur-xl glow-blue relative overflow-hidden">
        
        {/* Step Progress dots */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#141B3B]">
          <div>
            <span className="font-mono-system text-xs uppercase tracking-widest text-[#00E5FF]">
              SYSTEM INITIALIZATION PROTOCOL
            </span>
            <h2 className="font-orbitron font-bold text-2xl text-white mt-1">
              HUNTER AWAKENING
            </h2>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#8899BB]">
            <span>STEP {step}</span>
            <span>/</span>
            <span>6</span>
          </div>
        </div>

        {/* STEP 1: Designation */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-[#4D9FFF]/30 bg-[#0A0F2E]/60">
              <p className="font-mono-system text-xs text-[#00E5FF] mb-1 font-semibold">
                [SYSTEM DIRECTIVE 01]
              </p>
              <p className="font-rajdhani font-semibold text-lg text-white">
                &ldquo;A new biological signature has been detected by the World Gate. State your Hunter Designation.&rdquo;
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#8899BB] uppercase tracking-wider mb-2">
                Hunter Designation (Your Real Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full designation"
                className="w-full px-4 py-3 rounded-xl border border-[#1A2548] bg-[#0A0D1F] text-white font-rajdhani text-xl font-bold focus:outline-none focus:border-[#00E5FF] focus:glow-blue transition-all"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Physical Metrics */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-[#4D9FFF]/30 bg-[#0A0F2E]/60">
              <p className="font-mono-system text-xs text-[#00E5FF] mb-1 font-semibold">
                [SYSTEM SCAN: BIOMETRICS]
              </p>
              <p className="font-rajdhani font-semibold text-lg text-white">
                &ldquo;Calibrating vessel dimensions for progressive load scaling.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-[#8899BB] mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1A2548] bg-[#0A0D1F] text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#8899BB] mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1A2548] bg-[#0A0D1F] text-white font-mono"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Unspecified</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#8899BB] mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 175)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1A2548] bg-[#0A0D1F] text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#8899BB] mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value) || 70)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1A2548] bg-[#0A0D1F] text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Current Level Assessment */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-[#4D9FFF]/30 bg-[#0A0F2E]/60">
              <p className="font-mono-system text-xs text-[#00E5FF] mb-1 font-semibold">
                [VESSEL INTEGRITY AUDIT]
              </p>
              <p className="font-rajdhani font-semibold text-lg text-white">
                &ldquo;Self-assess without deception. The System knows when you lie.&rdquo;
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">PHYSICAL FITNESS BASELINE</span>
                  <span className="text-[#00E5FF] font-bold">{fitnessLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(parseInt(e.target.value))}
                  className="w-full accent-[#00E5FF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">MENTAL TOUGHNESS & SUFFERING TOLERANCE</span>
                  <span className="text-[#4D9FFF] font-bold">{mentalLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mentalLevel}
                  onChange={(e) => setMentalLevel(parseInt(e.target.value))}
                  className="w-full accent-[#4D9FFF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">DAILY DISCIPLINE & ROUTINE RIGOR</span>
                  <span className="text-purple-400 font-bold">{disciplineLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={disciplineLevel}
                  onChange={(e) => setDisciplineLevel(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Hunter Class */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-[#4D9FFF]/30 bg-[#0A0F2E]/60">
              <p className="font-mono-system text-xs text-[#00E5FF] mb-1 font-semibold">
                [CLASS DESIGNATION ASSIGNMENT]
              </p>
              <p className="font-rajdhani font-semibold text-lg text-white">
                &ldquo;Select the specialization through which your mana and discipline shall manifest.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classes.map((c) => {
                const Icon = c.icon;
                const isSelected = selectedClass === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (settings.sfxSound) spaceAudio.playTap();
                      setSelectedClass(c.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-[#00E5FF] bg-[#00E5FF]/10 glow-blue'
                        : 'border-[#1A2548] bg-[#0A0D1F] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg border bg-black/40 ${c.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-orbitron font-bold text-white text-base tracking-wide">
                        {c.name}
                      </span>
                    </div>
                    <p className="text-xs text-[#8899BB] leading-relaxed">
                      {c.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Goals */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-[#4D9FFF]/30 bg-[#0A0F2E]/60">
              <p className="font-mono-system text-xs text-[#00E5FF] mb-1 font-semibold">
                [OBJECTIVE CALIBRATION]
              </p>
              <p className="font-rajdhani font-semibold text-lg text-white">
                &ldquo;What does the vessel seek to attain? Select all that apply.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {goalOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-white'
                        : 'border-[#1A2548] bg-[#0A0D1F] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-rajdhani font-semibold text-base">{goal}</span>
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#00E5FF] bg-[#00E5FF] text-black'
                          : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: System Analysis & Awakening Reveal */}
        {step === 6 && (
          <div className="py-8 flex flex-col items-center text-center">
            {isAnalyzing ? (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-t-[#00E5FF] border-r-transparent border-b-[#4D9FFF] border-l-transparent animate-spin flex items-center justify-center" />
                <div>
                  <h3 className="font-orbitron font-bold text-2xl text-white tracking-widest animate-pulse">
                    ANALYZING VESSEL...
                  </h3>
                  <p className="font-mono-system text-xs text-[#8899BB] mt-2">
                    CALCULATING CELLULAR DENSITY · WILLPOWER MATRIX · MANA LATENCY
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-md">
                {/* E-Rank Badge Reveal */}
                <div className="w-28 h-28 mx-auto rounded-2xl border-2 border-[#00E5FF] bg-gradient-to-b from-[#0A163B] to-[#050510] flex flex-col items-center justify-center glow-blue-lg">
                  <span className="font-bebas text-6xl text-[#00E5FF] leading-none">
                    E
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-[#8899BB]">
                    RANK HUNTER
                  </span>
                </div>

                <div>
                  <span className="font-mono-system text-xs text-[#00E5FF] uppercase tracking-widest">
                    [INITIAL DESIGNATION GRANTED]
                  </span>
                  <h3 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-1">
                    E-RANK HUNTER ASSIGNED
                  </h3>
                  <p className="font-rajdhani text-base text-[#8899BB] mt-3 leading-relaxed">
                    &ldquo;You awaken as the weakest hunter. The journey from the bottom begins now. You will suffer, you will adapt, and you will arise.&rdquo;
                  </p>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-black text-base tracking-wider hover:brightness-110 active:scale-[0.98] transition-all glow-blue"
                >
                  ACCEPT YOUR DESTINY & ARISE
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        {step < 6 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#141B3B]">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded-lg border border-[#1A2548] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-black font-orbitron font-bold text-xs tracking-wider hover:bg-cyan-300 flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>{step === 5 ? 'AWAKEN NOW' : 'NEXT PROTOCOL'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
