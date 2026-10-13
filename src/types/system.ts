export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'NATIONAL' | 'SHADOW_MONARCH';

export type HunterClass = 'Warrior' | 'Assassin' | 'Mage' | 'Tank';

export interface HunterStats {
  strength: number;
  endurance: number;
  stamina: number;
  agility: number;
  mentalFortitude: number;
  recovery: number;
}

export interface HunterProfile {
  id: string;
  hunterId: string; // e.g. "HUNTER-7942-KR"
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: string;
  rank: HunterRank;
  level: number;
  xp: number;
  nextLevelXp: number;
  hunterClass: HunterClass;
  primaryGoals: string[];
  avatarUrl: string;
  registrationDate: string;
  stats: HunterStats;
  consecutiveStreak: number;
  lastActiveDate: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  category: 'Fitness' | 'Mental' | 'Discipline' | 'Recovery';
  xpReward: number;
  difficulty: number; // 1-5
  completed: boolean;
  statBonus: Partial<HunterStats>;
  icon?: string;
  targetCount?: number;
  unit?: string;
}

export interface MultiDayChallenge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  categoryTag?: 'Physical' | 'Endurance' | 'Cold' | 'Monk' | 'Lore' | 'Esoteric';
  durationDays: number;
  currentDay: number;
  xpReward: number;
  difficultyLabel: 'BRUTAL' | 'EXTREME' | 'LEGENDARY';
  requirements: string[];
  rules: string;
  isAccepted: boolean;
  isCompleted: boolean;
  startDate?: string;
  penaltyWarning: string;
}

export interface Habit {
  id: string;
  name: string;
  category: 'Fitness' | 'Mental' | 'Nutrition' | 'Discipline';
  difficulty: number; // 1-10
  streak: number;
  completedToday: boolean;
  autoEscalate: boolean;
  escalatedNote?: string;
  history: Record<string, boolean>; // 'YYYY-MM-DD': true
}

export interface FallenHabit {
  id: string;
  name: string;
  streakAtDeath: number;
  abandonedDate: string;
  reason: string;
}

export interface FocusSessionLog {
  id: string;
  taskTitle: string;
  durationMinutes: number;
  completedAt: string;
  category: 'Deep Work' | 'Study' | 'Fitness' | 'Meditation' | 'Discipline';
  habitId?: string;
  xpEarned: number;
  mode: 'standard' | 'monarch' | 'crucible' | 'custom';
}

export interface ResearchNote {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  tags?: string[];
}

export interface SystemNotification {
  id: string;
  type: 'QUEST' | 'PENALTY' | 'RANK_UP' | 'RECOVERY' | 'STREAK' | 'AI' | 'FOCUS';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface RecoveryState {
  isActive: boolean;
  startDate: string | null;
  daysInRecovery: number;
  reason: 'Injury' | 'Viral Fever' | 'Overtraining' | 'Mental Burnout' | 'Other';
  dailyLog: string;
}

export interface AppSettings {
  ambientSound: boolean;
  sfxSound: boolean;
  ambientVolume: number;
  sfxVolume: number;
  accentTheme: 'blue' | 'cyan' | 'gold' | 'red';
  reducedMotion: boolean;
  playIntroOnLaunch: boolean;
}
