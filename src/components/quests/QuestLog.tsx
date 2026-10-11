import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  Swords,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  X,
  Search,
  Filter,
  Dumbbell,
  Flame,
  Brain,
  Droplet,
  Footprints,
  Shield,
  Moon,
  Zap,
  Target,
  Skull,
  HeartPulse,
  ShieldAlert,
  Loader2,
  ChevronRight,
  Trophy,
  Book,
  Compass,
  Coffee,
  Timer,
  BatteryCharging,
  Crosshair,
  Award,
  Mountain,
  Crown,
  Axe,
  Calendar,
  AlertOctagon,
  Check
} from 'lucide-react';
import { MultiDayChallenge, DailyQuest } from '../../types/system';

export const ICON_OPTIONS: { id: string; label: string; icon: any }[] = [
  { id: 'swords', label: 'Combat', icon: Swords },
  { id: 'dumbbell', label: 'Strength', icon: Dumbbell },
  { id: 'footprints', label: 'Cadence / Run', icon: Footprints },
  { id: 'flame', label: 'Discipline', icon: Flame },
  { id: 'brain', label: 'Mental', icon: Brain },
  { id: 'droplet', label: 'Hydration / Cold', icon: Droplet },
  { id: 'shield', label: 'Armor / Defense', icon: Shield },
  { id: 'zap', label: 'Power / Burst', icon: Zap },
  { id: 'moon', label: 'Sleep / Circadian', icon: Moon },
  { id: 'target', label: 'Precision Focus', icon: Target },
  { id: 'skull', label: 'Crucible Trial', icon: Skull },
  { id: 'heart', label: 'Recovery / Health', icon: HeartPulse },
  { id: 'trophy', label: 'Milestone', icon: Trophy },
  { id: 'book', label: 'Tactical Reading', icon: Book },
  { id: 'compass', label: 'Outdoor Ruck', icon: Compass },
  { id: 'coffee', label: 'Morning Ritual', icon: Coffee },
  { id: 'timer', label: 'Fasting / Timer', icon: Timer },
  { id: 'battery', label: 'Energy Recharge', icon: BatteryCharging },
  { id: 'crosshair', label: 'Deep Work', icon: Crosshair },
  { id: 'award', label: 'Excellence', icon: Award },
  { id: 'mountain', label: 'Elevation / Ascent', icon: Mountain },
  { id: 'crown', label: 'Monarch Sovereignty', icon: Crown },
  { id: 'axe', label: 'Iron Chopping', icon: Axe },
  { id: 'sparkles', label: 'Mana Awakening', icon: Sparkles },
];

export const ICON_MAP: Record<string, any> = ICON_OPTIONS.reduce((acc, cur) => {
  acc[cur.id] = cur.icon;
  return acc;
}, {} as Record<string, any>);

export const QuestLog: React.FC = () => {
  const {
    hunter,
    dailyQuests,
    challenges,
    habits,
    completeQuest,
    deleteQuest,
    updateQuest,
    addCustomQuest,
    acceptChallenge,
    completeChallengeDay,
    settings,
  } = useSystem();

  const [activeTab, setActiveTab] = useState<'active' | 'challenges' | 'completed'>('active');

  // Challenge Category Filter & Search
  const [challengeCategory, setChallengeCategory] = useState<string>('All');
  const [challengeSearch, setChallengeSearch] = useState<string>('');

  // Customize / Add Quest Modal State
  const [showAddQuestModal, setShowAddQuestModal] = useState<boolean>(false);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [questTitle, setQuestTitle] = useState<string>('');
  const [questDesc, setQuestDesc] = useState<string>('');
  const [questCategory, setQuestCategory] = useState<DailyQuest['category']>('Fitness');
  const [questXp, setQuestXp] = useState<number>(100);
  const [questDifficulty, setQuestDifficulty] = useState<number>(3);
  const [selectedIcon, setSelectedIcon] = useState<string>('swords');
  const [selectedHabitImport, setSelectedHabitImport] = useState<string>('');

  // AI Quest Generator Modal State
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiWeakness, setAiWeakness] = useState<string>('Endurance under physical exhaustion');
  const [aiDomain, setAiDomain] = useState<string>('Physical conditioning & breath control');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedQuest, setGeneratedQuest] = useState<any | null>(null);

  const activeDaily = dailyQuests.filter((q) => !q.completed);
  const completedDaily = dailyQuests.filter((q) => q.completed);

  // Filter 35+ challenges across categories
  const filteredChallenges = challenges.filter((c) => {
    const matchesCategory =
      challengeCategory === 'All' || c.categoryTag === challengeCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(challengeSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(challengeSearch.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(challengeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAddModal = (editId?: string) => {
    if (editId) {
      const q = dailyQuests.find((item) => item.id === editId);
      if (q) {
        setEditingQuestId(q.id);
        setQuestTitle(q.title);
        setQuestDesc(q.description);
        setQuestCategory(q.category);
        setQuestXp(q.xpReward);
        setQuestDifficulty(q.difficulty);
        setSelectedIcon(q.icon || 'swords');
      }
    } else {
      setEditingQuestId(null);
      setQuestTitle('');
      setQuestDesc('');
      setQuestCategory('Fitness');
      setQuestXp(100);
      setQuestDifficulty(3);
      setSelectedIcon('swords');
      setSelectedHabitImport('');
    }
    if (settings.sfxSound) spaceAudio.playTap();
    setShowAddQuestModal(true);
  };

  const handleImportHabit = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;
    setQuestTitle(`Daily Habit: ${habit.name}`);
    setQuestDesc(`Execute today's forged habit streak (${habit.streak} days active).`);
    setQuestCategory(habit.category === 'Nutrition' ? 'Discipline' : habit.category);
    setQuestXp(80 + habit.difficulty * 10);
    setQuestDifficulty(Math.min(5, Math.max(1, Math.round(habit.difficulty / 2))));
    setSelectedIcon(
      habit.category === 'Fitness' ? 'dumbbell' :
      habit.category === 'Nutrition' ? 'droplet' :
      habit.category === 'Mental' ? 'brain' : 'flame'
    );
  };

  const handleSaveCustomQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questTitle.trim()) return;

    if (editingQuestId) {
      updateQuest(editingQuestId, {
        title: questTitle.trim(),
        description: questDesc.trim() || 'Daily custom discipline habit executed for vessel growth.',
        category: questCategory,
        xpReward: questXp,
        difficulty: questDifficulty,
        icon: selectedIcon,
      });
    } else {
      addCustomQuest({
        title: questTitle.trim(),
        description: questDesc.trim() || 'Daily custom discipline habit executed for vessel growth.',
        category: questCategory,
        xpReward: questXp,
        difficulty: questDifficulty,
        icon: selectedIcon,
        statBonus: {
          strength: questCategory === 'Fitness' ? 2 : 1,
          mentalFortitude: questCategory === 'Mental' ? 3 : 1,
        },
      });
    }

    setShowAddQuestModal(false);
  };

  const handleGenerateQuest = async () => {
    setIsGenerating(true);
    setGeneratedQuest(null);
    try {
      const res = await fetch('/api/ai/generate-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weakness: aiWeakness,
          domain: aiDomain,
          hunterRank: hunter.rank,
        }),
      });
      const data = await res.json();
      setGeneratedQuest(data);
      if (settings.sfxSound) spaceAudio.playSystemChime();
    } catch {
      setGeneratedQuest({
        title: 'Crucible: 100 Cold Air Pushups',
        description: 'Execute in freezing morning atmosphere. Zero flinching.',
        xpReward: 160,
        difficulty: 4,
        category: 'Fitness',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptGenerated = () => {
    if (!generatedQuest) return;
    addCustomQuest({
      title: generatedQuest.title,
      description: generatedQuest.description,
      category: generatedQuest.category || 'Fitness',
      xpReward: generatedQuest.xpReward || 150,
      difficulty: generatedQuest.difficulty || 3,
      icon: 'swords',
      statBonus: { strength: 2, endurance: 2 },
    });
    setShowAiModal(false);
    setGeneratedQuest(null);
  };

  const renderQuestIcon = (iconName?: string) => {
    const IconComponent = (iconName && ICON_MAP[iconName]) || Swords;
    return <IconComponent className="w-5 h-5 text-[#00E5FF]" />;
  };

  const challengeCategories = ['All', 'Physical', 'Endurance', 'Cold', 'Monk', 'Lore', 'Esoteric'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2548]">
        <div>
          <span className="font-mono-system text-xs uppercase tracking-widest text-[#00E5FF] font-bold">
            [ HUNTERS ASSOCIATION BOARD ]
          </span>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-0.5 tracking-wider">
            QUEST LOG & TRIALS
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => openAddModal()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-black text-xs tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-cyan-950 glow-blue"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>CUSTOMIZE DAILY QUEST + ICON</span>
          </button>

          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              setShowAiModal(true);
            }}
            className="px-3.5 py-2.5 rounded-xl border border-[#1A2548] bg-[#0A0D22] text-slate-300 font-orbitron font-bold text-xs hover:border-[#00E5FF] hover:text-white transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI SYNTHESIS</span>
          </button>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-[#080B1E] border border-[#1A2548] max-w-lg">
        <button
          onClick={() => {
            if (settings.sfxSound) spaceAudio.playTap();
            setActiveTab('active');
          }}
          className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
            activeTab === 'active'
              ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ACTIVE QUESTS ({activeDaily.length})
        </button>
        <button
          onClick={() => {
            if (settings.sfxSound) spaceAudio.playTap();
            setActiveTab('challenges');
          }}
          className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
            activeTab === 'challenges'
              ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          35+ TRIALS ({challenges.length})
        </button>
        <button
          onClick={() => {
            if (settings.sfxSound) spaceAudio.playTap();
            setActiveTab('completed');
          }}
          className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
            activeTab === 'completed'
              ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CLEARED ({completedDaily.length})
        </button>
      </div>

      {/* =========================================================================
          TAB 1: ACTIVE DAILY QUESTS
          ========================================================================= */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8899BB] uppercase">
              Current Daily Discipline Quotas (Replaces default habits with your custom protocols)
            </span>
            <button
              onClick={() => openAddModal()}
              className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Habit As Quest</span>
            </button>
          </div>

          {activeDaily.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-[#1A2548] text-center space-y-3 bg-[#080B1F]/60">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-orbitron font-bold text-lg text-white">
                ALL DAILY QUESTS CLEARED
              </h3>
              <p className="text-xs font-mono text-[#8899BB] max-w-md mx-auto">
                No active trials remain for today. Add custom daily habits or accept an epic multi-day challenge.
              </p>
              <button
                onClick={() => openAddModal()}
                className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-orbitron font-bold text-xs"
              >
                + CREATE CUSTOM QUEST
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDaily.map((quest) => (
                <div
                  key={quest.id}
                  className="p-5 rounded-2xl border border-[#1A2548] bg-[#080B1F]/90 backdrop-blur-md relative overflow-hidden flex flex-col justify-between hover:border-[#00E5FF]/60 transition-all glow-blue group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 flex items-center justify-center shrink-0">
                          {renderQuestIcon(quest.icon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10193E] text-[#4D9FFF] border border-[#1E3066] uppercase font-bold">
                              {quest.category}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {'★'.repeat(quest.difficulty)}
                            </span>
                          </div>
                          <h3 className="font-orbitron font-bold text-base sm:text-lg text-white mt-1 group-hover:text-[#00E5FF] transition-colors">
                            {quest.title}
                          </h3>
                        </div>
                      </div>

                      {/* Edit / Delete Actions */}
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openAddModal(quest.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
                          title="Edit Quest"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteQuest(quest.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/60"
                          title="Delete Quest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-[#8899BB] leading-relaxed">
                      {quest.description}
                    </p>
                  </div>

                  {/* Completion and Reward Strip */}
                  <div className="pt-4 mt-3 border-t border-[#141B3B] flex items-center justify-between">
                    <span className="font-orbitron font-extrabold text-sm text-[#00E5FF] tabular-nums">
                      +{quest.xpReward} XP REWARD
                    </span>

                    <button
                      onClick={() => completeQuest(quest.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Circle className="w-3.5 h-3.5" />
                      <span>MARK COMPLETED</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: 35+ EPIC MULTI-DAY CHALLENGES
          ========================================================================= */}
      {activeTab === 'challenges' && (
        <div className="space-y-5">
          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-[#080B1E] border border-[#1A2548]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {challengeCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (settings.sfxSound) spaceAudio.playTap();
                    setChallengeCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                    challengeCategory === cat
                      ? 'bg-[#00E5FF] text-black shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={challengeSearch}
                onChange={(e) => setChallengeSearch(e.target.value)}
                placeholder="Search 35+ trials..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#1A2548] bg-[#050716] text-white text-xs font-mono focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((chal) => {
              const isAccepted = chal.isAccepted;
              const isCompleted = chal.isCompleted;

              return (
                <div
                  key={chal.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                    isCompleted
                      ? 'border-emerald-600/70 bg-[#06141B]/90'
                      : isAccepted
                      ? 'border-[#00E5FF] bg-[#080E2E]/95 glow-blue'
                      : 'border-[#1A2548] bg-[#080B1F]/90 hover:border-[#4D9FFF]/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A102E] text-[#4D9FFF] border border-[#1A2548] uppercase font-bold">
                        {chal.categoryTag || 'Physical'} · {chal.durationDays} DAYS
                      </span>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-black tracking-wider ${
                          chal.difficultyLabel === 'LEGENDARY'
                            ? 'bg-amber-950 text-amber-300 border border-amber-600'
                            : chal.difficultyLabel === 'EXTREME'
                            ? 'bg-red-950 text-red-300 border border-red-600'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-600'
                        }`}
                      >
                        {chal.difficultyLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-orbitron font-extrabold text-base text-white">
                        {chal.title}
                      </h3>
                      <span className="text-xs font-mono text-[#00E5FF]">
                        {chal.subtitle}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-300 leading-relaxed line-clamp-3">
                      {chal.description}
                    </p>

                    {/* Requirements snippet */}
                    <div className="space-y-1 text-[11px] font-mono text-slate-400">
                      {chal.requirements.slice(0, 2).map((req, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-[#00E5FF]">›</span>
                          <span className="truncate">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 mt-3 border-t border-[#141B3B] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold tabular-nums">
                        +{chal.xpReward} XP
                      </span>
                      {isAccepted && (
                        <span className="text-cyan-300 font-bold">
                          DAY {chal.currentDay} / {chal.durationDays}
                        </span>
                      )}
                    </div>

                    {isCompleted ? (
                      <div className="py-2 text-center text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 rounded-xl border border-emerald-600/60 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>TRIAL COMPLETED</span>
                      </div>
                    ) : isAccepted ? (
                      <button
                        onClick={() => completeChallengeDay(chal.id)}
                        className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-black font-orbitron font-black text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>COMPLETE TODAY (DAY {chal.currentDay})</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => acceptChallenge(chal.id)}
                        className="w-full py-2.5 rounded-xl border border-[#00E5FF]/60 bg-[#00E5FF]/15 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-orbitron font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>ACCEPT THIS TRIAL</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CLEARED QUESTS
          ========================================================================= */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          <span className="text-xs font-mono text-[#8899BB] uppercase">
            Completed Trials Logged by the System
          </span>

          {completedDaily.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-[#1A2548] text-center font-mono text-xs text-slate-400">
              No completed daily quests yet today. Mark active quests to log them here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedDaily.map((quest) => (
                <div
                  key={quest.id}
                  className="p-4 rounded-2xl border border-emerald-800/60 bg-[#061218]/90 flex items-center justify-between gap-3 opacity-90"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-orbitron font-bold text-white text-sm line-through">
                        {quest.title}
                      </h4>
                      <span className="text-[11px] font-mono text-emerald-300">
                        Cleared · +{quest.xpReward} XP Harvested
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          CUSTOMIZE DAILY QUEST + ICON MODAL
          ========================================================================= */}
      {showAddQuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono select-none overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#070A1E]/95 border-2 border-[#00E5FF]/80 rounded-2xl p-6 sm:p-7 glow-blue-lg shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#1A2548] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#00E5FF] bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono-system uppercase tracking-widest text-[#00E5FF] font-bold">
                    [ SYSTEM CUSTOM PROTOCOL ]
                  </span>
                  <h2 className="font-orbitron font-extrabold text-xl text-white">
                    {editingQuestId ? 'EDIT DAILY QUEST' : 'FORGE CUSTOM QUEST / HABIT'}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setShowAddQuestModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Habit Import option */}
            {habits.length > 0 && !editingQuestId && (
              <div className="p-3.5 rounded-xl border border-[#1A2548] bg-[#050716] space-y-1.5">
                <label className="text-xs font-mono text-[#00E5FF] font-bold uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Quick Import Existing Habit into Daily Quests:
                </label>
                <select
                  value={selectedHabitImport}
                  onChange={(e) => {
                    setSelectedHabitImport(e.target.value);
                    if (e.target.value) handleImportHabit(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono focus:border-[#00E5FF]"
                >
                  <option value="">-- Choose one of your habits to autofill --</option>
                  {habits.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.category} · Streak {h.streak}D)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={handleSaveCustomQuest} className="space-y-4">
              {/* Quest Title */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-[#8899BB] uppercase font-bold">
                  Quest / Habit Title *
                </label>
                <input
                  type="text"
                  required
                  value={questTitle}
                  onChange={(e) => setQuestTitle(e.target.value)}
                  placeholder="e.g. 5:00 AM Cold Awakening or 100 Pullups"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A2548] bg-[#050716] text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-[#8899BB] uppercase font-bold">
                  Execution Protocol / Instructions
                </label>
                <textarea
                  rows={2}
                  value={questDesc}
                  onChange={(e) => setQuestDesc(e.target.value)}
                  placeholder="Specific form rules, sets, distance, or non-negotiable standards..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1A2548] bg-[#050716] text-white font-mono text-xs focus:border-[#00E5FF] focus:outline-none"
                />
              </div>

              {/* 24+ ICON PICKER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#00E5FF] font-bold uppercase">
                    Select Tactical Quest Icon (24 Options):
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Selected: <strong className="text-white">{selectedIcon}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 border border-[#1A2548] bg-[#040614] rounded-xl">
                  {ICON_OPTIONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = selectedIcon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedIcon(item.id)}
                        className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-[#00E5FF] text-black shadow-md font-bold scale-105'
                            : 'border border-slate-800 text-slate-400 hover:text-white hover:border-[#00E5FF]'
                        }`}
                        title={item.label}
                      >
                        <IconComp className="w-5 h-5 shrink-0" />
                        <span className="text-[8px] truncate w-full text-center">
                          {item.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category, Difficulty, XP reward */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#8899BB] uppercase">Category</label>
                  <select
                    value={questCategory}
                    onChange={(e) => setQuestCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#1A2548] bg-[#050716] text-white text-xs font-mono focus:border-[#00E5FF]"
                  >
                    <option value="Fitness">Fitness</option>
                    <option value="Mental">Mental</option>
                    <option value="Discipline">Discipline</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#8899BB] uppercase">Difficulty Stars (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={questDifficulty}
                    onChange={(e) => setQuestDifficulty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#1A2548] bg-[#050716] text-white text-xs font-mono focus:border-[#00E5FF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#8899BB] uppercase">XP Reward</label>
                  <input
                    type="number"
                    step={10}
                    min={20}
                    max={500}
                    value={questXp}
                    onChange={(e) => setQuestXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#1A2548] bg-[#050716] text-white text-xs font-mono focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1A2548]">
                <button
                  type="button"
                  onClick={() => setShowAddQuestModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#1A2548] text-slate-400 font-mono text-xs hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md glow-blue"
                >
                  {editingQuestId ? 'SAVE CHANGES' : 'INCORPORATE TO DAILY QUESTS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          AI QUEST SYNTHESIS MODAL
          ========================================================================= */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono select-none">
          <div className="relative w-full max-w-lg bg-[#070A1E]/95 border-2 border-[#00E5FF]/80 rounded-2xl p-6 sm:p-7 glow-blue-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A2548] pb-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-lg text-white">
                  GOGGINS AI QUEST SYNTHESIS
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-slate-300">
              The AI will evaluate your current weaknesses and forge a brutal custom quest tailored to your Hunter rank.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#8899BB] font-mono block mb-1">
                  Target Weakness / Flaw:
                </label>
                <input
                  type="text"
                  value={aiWeakness}
                  onChange={(e) => setAiWeakness(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#1A2548] bg-[#050716] text-white text-xs font-mono focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8899BB] font-mono block mb-1">
                  Training Domain:
                </label>
                <input
                  type="text"
                  value={aiDomain}
                  onChange={(e) => setAiDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#1A2548] bg-[#050716] text-white text-xs font-mono focus:border-[#00E5FF]"
                />
              </div>

              <button
                onClick={handleGenerateQuest}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SYNTHESIZING CRUCIBLE...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>GENERATE BRUTAL TRIAL</span>
                  </>
                )}
              </button>
            </div>

            {generatedQuest && (
              <div className="p-4 rounded-xl border border-[#00E5FF] bg-[#050920] space-y-2 mt-2 glow-blue">
                <span className="text-[10px] font-mono uppercase text-[#00E5FF] font-bold">
                  [GENERATED TRIAL: {generatedQuest.category}]
                </span>
                <h4 className="font-orbitron font-bold text-base text-white">
                  {generatedQuest.title}
                </h4>
                <p className="text-xs font-mono text-slate-300">
                  {generatedQuest.description}
                </p>
                <div className="flex items-center justify-between pt-2 text-xs font-mono">
                  <span className="text-amber-400 font-bold">
                    +{generatedQuest.xpReward} XP
                  </span>
                  <button
                    onClick={handleAcceptGenerated}
                    className="px-4 py-1.5 rounded-lg bg-[#00E5FF] text-black font-orbitron font-bold text-xs"
                  >
                    ADD TO DAILY LOG
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
