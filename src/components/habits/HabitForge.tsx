import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  Flame,
  Plus,
  Skull,
  TrendingUp,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Habit } from '../../types/system';

export const HabitForge: React.FC = () => {
  const {
    habits,
    fallenHabits,
    toggleHabitToday,
    addHabit,
    abandonHabit,
    addCustomQuest,
    settings,
  } = useSystem();

  const [exportedHabitId, setExportedHabitId] = useState<string | null>(null);

  const handleExportToQuest = (h: Habit) => {
    addCustomQuest({
      title: `Daily Habit: ${h.name}`,
      description: `Maintain forged habit streak (${h.streak} days unbroken).`,
      category: h.category === 'Nutrition' ? 'Discipline' : h.category,
      xpReward: 80 + h.difficulty * 10,
      difficulty: Math.min(5, Math.max(1, Math.round(h.difficulty / 2))),
      icon: h.category === 'Fitness' ? 'dumbbell' : h.category === 'Nutrition' ? 'droplet' : h.category === 'Mental' ? 'brain' : 'flame',
      statBonus: {
        strength: h.category === 'Fitness' ? 2 : 1,
        mentalFortitude: h.category === 'Mental' ? 3 : 1,
      },
    });
    setExportedHabitId(h.id);
    if (settings.sfxSound) spaceAudio.playSystemChime();
    setTimeout(() => setExportedHabitId(null), 2500);
  };

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [habitName, setHabitName] = useState<string>('');
  const [habitCategory, setHabitCategory] = useState<Habit['category']>('Discipline');
  const [habitDifficulty, setHabitDifficulty] = useState<number>(5);
  const [autoEscalate, setAutoEscalate] = useState<boolean>(true);

  const [abandonId, setAbandonId] = useState<string | null>(null);
  const [abandonReason, setAbandonReason] = useState<string>('');

  const [showGraveyard, setShowGraveyard] = useState<boolean>(false);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    addHabit(habitName.trim(), habitCategory, habitDifficulty, autoEscalate);
    setHabitName('');
    setShowAddModal(false);
  };

  const confirmAbandon = () => {
    if (!abandonId) return;
    abandonHabit(abandonId, abandonReason.trim() || 'Surrendered to discomfort.');
    setAbandonId(null);
    setAbandonReason('');
  };

  // Generate last 14 days dates for dot visualizer
  const recentDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2548]">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="font-mono-system text-xs uppercase tracking-widest text-amber-400">
              PROGRESSIVE OVERLOAD REPOSITORIUM
            </span>
          </div>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-0.5 tracking-wider">
            HABIT FORGE
          </h1>
        </div>

        <button
          onClick={() => {
            if (settings.sfxSound) spaceAudio.playTap();
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-orange-950"
        >
          <Plus className="w-4 h-4" />
          <span>FORGE NEW HABIT</span>
        </button>
      </div>

      {/* PROGRESSIVE OVERLOAD NOTICE */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/15 flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-slate-300">
          <span className="text-amber-400 font-bold block mb-0.5">
            [PROGRESSIVE OVERLOAD CALIBRATION]
          </span>
          The System monitors your unbroken streaks. Upon 7 consecutive completions, the Auto-Escalate engine automatically raises difficulty by 25%. Adaptation is forced.
        </div>
      </div>

      {/* ACTIVE HABITS LIST */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const isFlameIntense = habit.streak >= 7;

          return (
            <div
              key={habit.id}
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                habit.completedToday
                  ? 'border-emerald-500/50 bg-[#09151F]/90 glow-blue'
                  : 'border-[#1A2548] bg-[#0A0D24] hover:border-slate-700'
              }`}
            >
              {/* Flame aura backdrop for high streak */}
              {isFlameIntense && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700 bg-slate-900 text-slate-300 uppercase">
                      {habit.category}
                    </span>
                    <span className="text-xs font-mono text-[#8899BB]">
                      DIFFICULTY: {habit.difficulty}/10
                    </span>
                    {habit.autoEscalate && (
                      <span className="text-[10px] font-mono text-cyan-400">
                        ⚡ AUTO-ESCALATE
                      </span>
                    )}
                  </div>

                  <h3 className="font-rajdhani font-bold text-xl text-white">
                    {habit.name}
                  </h3>

                  {habit.escalatedNote && (
                    <p className="text-xs font-mono text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{habit.escalatedNote}</span>
                    </p>
                  )}

                  {/* 14-day history dot strip */}
                  <div className="pt-2 flex items-center gap-1.5">
                    {recentDays.map((d) => {
                      const done = habit.history[d];
                      return (
                        <div
                          key={d}
                          title={`${d}: ${done ? 'Completed' : 'Missed'}`}
                          className={`w-3.5 h-3.5 rounded-sm transition-all ${
                            done
                              ? 'bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]'
                              : 'bg-[#141B3B] border border-slate-800'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Right side: Streak & Complete button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-[#141B3B]">
                  {/* Streak Flame */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-950/40 text-amber-400">
                    <Flame className={`w-4 h-4 ${isFlameIntense ? 'text-orange-400 animate-bounce' : ''}`} />
                    <span className="font-orbitron font-bold text-sm tabular-nums">
                      {habit.streak}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">DAYS</span>
                  </div>

                  <button
                    onClick={() => handleExportToQuest(habit)}
                    title="Export habit as Daily Quest with custom icon"
                    className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      exportedHabitId === habit.id
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-[#1E3066] bg-[#0A102E] text-slate-300 hover:text-white hover:border-[#00E5FF]'
                    }`}
                  >
                    <span>{exportedHabitId === habit.id ? '✓ IN QUEST LOG' : '+ TO QUESTS'}</span>
                  </button>

                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`px-4 py-2 rounded-xl font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 transition-all ${
                      habit.completedToday
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-950'
                        : 'border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/20'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{habit.completedToday ? 'EXECUTED' : 'CHECK IN'}</span>
                  </button>

                  {/* Drop/Abandon */}
                  <button
                    onClick={() => setAbandonId(habit.id)}
                    title="Abandon Habit (Sent to Graveyard)"
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Skull className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FALLEN HABITS GRAVEYARD (The Discipline Mirror) */}
      <div className="pt-6 border-t border-[#1A2548]">
        <button
          onClick={() => setShowGraveyard(!showGraveyard)}
          className="flex items-center justify-between w-full p-4 rounded-xl border border-red-500/30 bg-red-950/10 hover:bg-red-950/20 text-red-400 transition-colors"
        >
          <div className="flex items-center gap-2 font-orbitron text-sm font-bold tracking-wider">
            <Skull className="w-4 h-4" />
            <span>FALLEN HABITS GRAVEYARD ({fallenHabits.length})</span>
          </div>
          {showGraveyard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showGraveyard && (
          <div className="mt-3 space-y-3">
            {fallenHabits.map((fallen) => (
              <div
                key={fallen.id}
                className="p-4 rounded-xl border border-red-900/50 bg-[#0A050B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <h4 className="text-red-300 font-bold font-rajdhani text-base">
                    {fallen.name}
                  </h4>
                  <p className="text-slate-400 mt-0.5">
                    Surrendered on: {fallen.abandonedDate} · Final Streak: {fallen.streakAtDeath} days
                  </p>
                  <p className="text-red-400/90 italic mt-1">
                    &ldquo;{fallen.reason}&rdquo;
                  </p>
                </div>
                <span className="px-2 py-1 rounded border border-red-800 text-[10px] text-red-400 uppercase tracking-widest self-start sm:self-auto">
                  DISCIPLINE BREACH
                </span>
              </div>
            ))}

            {fallenHabits.length === 0 && (
              <div className="py-6 text-center text-xs font-mono text-[#8899BB]">
                The graveyard is empty. Zero habits surrendered so far.
              </div>
            )}
          </div>
        )}
      </div>

      {/* FORGE HABIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateHabit}
            className="w-full max-w-lg bg-[#070A1E] border border-amber-500/80 rounded-2xl p-6 glow-gold relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-xs text-amber-400 uppercase font-bold tracking-wider">
                [NEW DISCIPLINE INSCRIPTION]
              </span>
              <h3 className="font-orbitron font-bold text-xl text-white mt-0.5">
                FORGE DAILY HABIT
              </h3>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Habit Designation
              </label>
              <input
                type="text"
                required
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="e.g., 50 Pushups upon waking"
                className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono"
                >
                  <option value="Discipline">Discipline</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Mental">Mental Focus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Starting Difficulty (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={habitDifficulty}
                  onChange={(e) => setHabitDifficulty(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-800 bg-[#050716]">
              <input
                type="checkbox"
                id="autoEsc"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="accent-amber-500 w-4 h-4"
              />
              <label htmlFor="autoEsc" className="text-xs font-mono text-slate-300 cursor-pointer">
                Enable Progressive Overload Engine (System will escalate demand on 7-day streaks)
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#141B3B]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-mono text-slate-300"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-500 text-black font-orbitron font-bold text-xs hover:bg-amber-400"
              >
                BIND HABIT
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABANDON CONFIRMATION MODAL */}
      {abandonId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D0509] border border-red-500 rounded-2xl p-6 glow-red relative space-y-4">
            <span className="font-mono text-xs text-red-500 uppercase font-bold tracking-wider">
              [DISCIPLINE SURRENDER NOTICE]
            </span>
            <h3 className="font-orbitron font-bold text-lg text-white">
              ABANDON TO HABIT GRAVEYARD?
            </h3>
            <p className="text-xs text-slate-300 font-rajdhani">
              Abandoning a habit records permanent failure in your Hunter registry. State your reason for surrendering:
            </p>

            <textarea
              rows={3}
              value={abandonReason}
              onChange={(e) => setAbandonReason(e.target.value)}
              placeholder="e.g., Lacked discipline to wake up on time..."
              className="w-full p-2.5 rounded-lg border border-red-900 bg-[#060205] text-white text-xs font-mono focus:border-red-500 focus:outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAbandonId(null)}
                className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-mono text-slate-300"
              >
                NEVER SURRENDER
              </button>
              <button
                onClick={confirmAbandon}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-orbitron font-bold text-xs hover:bg-red-700"
              >
                CONFIRM DEFEAT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
