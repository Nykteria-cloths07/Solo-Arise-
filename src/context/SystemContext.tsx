import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  handleFirestoreError,
  OperationType,
  User,
} from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import {
  HunterProfile,
  HunterRank,
  HunterClass,
  DailyQuest,
  MultiDayChallenge,
  Habit,
  FallenHabit,
  ResearchNote,
  SystemNotification,
  RecoveryState,
  AppSettings,
  FocusSessionLog,
} from '../types/system';
import { spaceAudio } from '../audio/spaceAudio';
import { initialChallengesCatalog } from '../data/challengesData';

export interface RankProgressInfo {
  currentRank: HunterRank;
  nextRank: HunterRank | 'MAX';
  currentLevel: number;
  nextRankLevel: number;
  progressPercent: number;
  currentXp: number;
  nextLevelXp: number;
  percentileLabel: string;
}

interface SystemContextType {
  hunter: HunterProfile;
  dailyQuests: DailyQuest[];
  challenges: MultiDayChallenge[];
  habits: Habit[];
  fallenHabits: FallenHabit[];
  focusSessions: FocusSessionLog[];
  researchNotes: ResearchNote[];
  researchCategories: string[];
  recovery: RecoveryState;
  notifications: SystemNotification[];
  settings: AppSettings;
  isAwakened: boolean;
  showCinematicIntro: boolean;
  activeTab: string;
  rankUpEvent: { oldRank: HunterRank; newRank: HunterRank } | null;
  penaltyAlert: { xpDeducted: number; reason: string } | null;
  rankProgress: RankProgressInfo;

  // Cloud Vault & Auth
  currentUser: User | null;
  isAuthReady: boolean;
  cloudSyncStatus: 'idle' | 'syncing' | 'saved' | 'error';
  lastCloudSync: Date | null;
  loginWithGoogle: () => Promise<void>;
  logoutHunter: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;

  // Actions
  setActiveTab: (tab: string) => void;
  setShowCinematicIntro: (show: boolean) => void;
  completeOnboarding: (data: Partial<HunterProfile>) => void;
  completeQuest: (questId: string) => void;
  deleteQuest: (questId: string) => void;
  updateQuest: (questId: string, updated: Partial<DailyQuest>) => void;
  acceptChallenge: (challengeId: string) => void;
  completeChallengeDay: (challengeId: string) => void;
  toggleHabitToday: (habitId: string) => void;
  addHabit: (name: string, category: Habit['category'], difficulty: number, autoEscalate: boolean) => void;
  abandonHabit: (habitId: string, reason: string) => void;
  logFocusSession: (session: Omit<FocusSessionLog, 'id' | 'completedAt'>) => void;
  addResearchNote: (note: Omit<ResearchNote, 'id' | 'date'>) => void;
  deleteResearchNote: (id: string) => void;
  addResearchCategory: (cat: string) => void;
  enterRecoveryMode: (reason: RecoveryState['reason'], initialLog: string) => void;
  ariseFromRecovery: () => void;
  updateHunterProfile: (data: Partial<HunterProfile>) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  clearRankUpEvent: () => void;
  clearPenaltyAlert: () => void;
  markNotificationsRead: () => void;
  addCustomQuest: (quest: Omit<DailyQuest, 'id' | 'completed'>) => void;
  resetAllSystemData: () => void;

  // Anime Awakening Intro System (Play-Once Persistence & Character Selection)
  selectedAwakeningCharacter: string;
  setSelectedAwakeningCharacter: (charId: string) => void;
  completeAwakeningIntro: () => void;
  replayAwakeningIntro: () => void;
}

const STORAGE_KEY = 'SOLO_ARISE_SYSTEM_STATE_V1';

const defaultHunter: HunterProfile = {
  id: 'hunter_default',
  hunterId: 'HUNTER-7942-KR',
  name: 'Sung Jinwoo',
  age: 24,
  height: 181,
  weight: 78,
  gender: 'Male',
  rank: 'E',
  level: 1,
  xp: 45,
  nextLevelXp: 100,
  hunterClass: 'Warrior',
  primaryGoals: ['Build Unbreakable Discipline', 'Transform Physical Vessel', 'Master Mental Toughness'],
  avatarUrl: '',
  registrationDate: '2026-10-11',
  stats: {
    strength: 14,
    endurance: 12,
    stamina: 15,
    agility: 13,
    mentalFortitude: 18,
    recovery: 11,
  },
  consecutiveStreak: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const defaultDailyQuests: DailyQuest[] = [
  {
    id: 'quest_pushups',
    title: 'Crucible: 100 System Pushups',
    description: 'Break the chest muscles down into iron fibers. Execute strict form in sets of 25.',
    category: 'Fitness',
    xpReward: 80,
    difficulty: 3,
    completed: false,
    statBonus: { strength: 2, endurance: 1 },
  },
  {
    id: 'quest_run',
    title: 'Void March: 5km Rapid Cadence',
    description: 'No stopping, no bargaining with weakness. Maintain an unbroken pace through the rain or cold.',
    category: 'Fitness',
    xpReward: 120,
    difficulty: 4,
    completed: false,
    statBonus: { stamina: 3, agility: 2 },
  },
  {
    id: 'quest_mind',
    title: 'Stillness Protocol: 20-Min Dark Meditation',
    description: 'Sit in pitch darkness. Silence inner chatter and embrace the void of the Shadow Monarch.',
    category: 'Mental',
    xpReward: 70,
    difficulty: 2,
    completed: false,
    statBonus: { mentalFortitude: 3 },
  },
  {
    id: 'quest_cold',
    title: 'Sub-Zero Immersion: 3-Min Cold Shower',
    description: 'Immediate blast of icy water. Do not flinch. Control breathing through the shockwave.',
    category: 'Discipline',
    xpReward: 60,
    difficulty: 3,
    completed: false,
    statBonus: { mentalFortitude: 2, recovery: 1 },
    icon: 'droplet',
  },
];

const defaultChallenges: MultiDayChallenge[] = initialChallengesCatalog;

const defaultHabits: Habit[] = [
  {
    id: 'habit_1',
    name: '5:00 AM Awakening & Cold Water',
    category: 'Discipline',
    difficulty: 6,
    streak: 8,
    completedToday: true,
    autoEscalate: true,
    escalatedNote: 'Upgraded from 6:00 AM after 7-day streak.',
    history: { '2026-10-10': true, '2026-10-09': true, '2026-10-08': true, '2026-10-07': true },
  },
  {
    id: 'habit_2',
    name: 'Gallon of Clean Water (3.8 Liters)',
    category: 'Nutrition',
    difficulty: 4,
    streak: 12,
    completedToday: false,
    autoEscalate: true,
    history: { '2026-10-10': true, '2026-10-09': true, '2026-10-08': true },
  },
  {
    id: 'habit_3',
    name: 'Zero Sugar & Whole Foods Only',
    category: 'Nutrition',
    difficulty: 8,
    streak: 6,
    completedToday: true,
    autoEscalate: true,
    history: { '2026-10-10': true, '2026-10-09': true },
  },
  {
    id: 'habit_4',
    name: '30-Minute Tactical Deep Reading',
    category: 'Mental',
    difficulty: 5,
    streak: 14,
    completedToday: false,
    autoEscalate: true,
    escalatedNote: 'Upgraded from 15 mins to 30 mins by System Overload Engine.',
    history: { '2026-10-10': true, '2026-10-09': true, '2026-10-08': true },
  },
];

const defaultFallenHabits: FallenHabit[] = [
  {
    id: 'fallen_1',
    name: 'Nighttime Phone Ban at 9:00 PM',
    streakAtDeath: 5,
    abandonedDate: '2026-09-28',
    reason: 'Surrendered to late-night dopamine browsing. Weakness documented.',
  },
];

const defaultResearchCategories = [
  '👻 Paranormal & Entities',
  '⚡ Supernatural Powers & Qi',
  '🌀 4D Dimensions & Space',
  '🧠 Consciousness & Brainwaves',
  '🔭 Quantum Entanglement',
  '🌌 Astral Projection Protocols',
  '🔮 Remote Viewing & Espionage',
];

const defaultResearchNotes: ResearchNote[] = [
  {
    id: 'note_1',
    title: 'The Tesseract Gateway & 4-Dimensional Spatial Perception',
    category: '🌀 4D Dimensions & Space',
    content: `Investigation into spatial curvature beyond 3 Euclidean dimensions. In theoretical physics, a 4D hypersphere or hypercube casts a 3D shadow into our reality, directly analogous to how Gates manifest across city coordinates in Solo Leveling. Discipline in spatial visualization forces neural plasticity.`,
    date: '2026-10-08',
    tags: ['4D', 'Quantum Space', 'Geometry'],
  },
  {
    id: 'note_2',
    title: 'Astral Projection: The Monroe Technique & Binaural Frequency 4Hz',
    category: '🌌 Astral Projection Protocols',
    content: `Robert Monroe and CIA Gateway Experience documents declassified in 2003 confirm hemispheric synchronization (Hemi-Sync). Achieving the hypnagogic state where the physical body sleeps while the observer consciousness remains fully hyper-vigilant requires extreme mental fortitude and zero panic.`,
    date: '2026-10-09',
    tags: ['CIA Gateway', 'Astral', 'Theta Waves'],
  },
];

const defaultNotifications: SystemNotification[] = [
  {
    id: 'notif_1',
    type: 'QUEST',
    title: 'SYSTEM DIRECTIVE ACTIVE',
    description: 'Your Daily System Quests have manifested. Execution mandatory before midnight.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif_2',
    type: 'STREAK',
    title: 'HABIT FORGE OVERLOAD DETECTED',
    description: '7-day streak achieved on 5:00 AM Awakening. System escalating difficulty.',
    timestamp: 'Yesterday',
    read: false,
  },
];

const SystemContext = createContext<SystemContextType | null>(null);

export function getRankPercentileLabel(rank: HunterRank): string {
  switch (rank) {
    case 'E':
      return 'BOTTOM 90% (THE WEAKEST HUNTER CRUCIBLE)';
    case 'D':
      return 'TOP 35% DISCIPLINE THRESHOLD';
    case 'C':
      return 'TOP 15% HARDENED HUNTER';
    case 'B':
      return 'TOP 5.0% HIGH-TIER AWAKENED';
    case 'A':
      return 'TOP 2.0% ELITE SLAYER';
    case 'S':
      return 'TOP 1.0% SUPERHUMAN ANOMALY (EXTREME HARD)';
    case 'NATIONAL':
      return 'TOP 0.1% PLANETARY SOVEREIGN';
    case 'SHADOW_MONARCH':
      return 'TOP 0.001% TRANSCENDENT MONARCH';
  }
}

function calculateRankFromLevel(lvl: number): HunterRank {
  if (lvl >= 600) return 'SHADOW_MONARCH'; // Top 0.001%
  if (lvl >= 450) return 'NATIONAL';       // Top 0.1%
  if (lvl >= 300) return 'S';              // Top 1.0% (Extreme Hard struggle!)
  if (lvl >= 180) return 'A';              // Top 2.0%
  if (lvl >= 100) return 'B';              // Top 5.0%
  if (lvl >= 50) return 'C';               // Top 15.0%
  if (lvl >= 20) return 'D';               // Top 35.0%
  return 'E';                              // Bottom 90%
}

function calculateNextLevelXp(lvl: number): number {
  // Extreme Discipline Overload curve: leveling up requires relentless daily consistency
  return Math.floor(280 + 65 * Math.pow(lvl, 1.65));
}

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [hunter, setHunter] = useState<HunterProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_HUNTER`);
      return saved ? JSON.parse(saved) : defaultHunter;
    } catch {
      return defaultHunter;
    }
  });

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_QUESTS`);
      return saved ? JSON.parse(saved) : defaultDailyQuests;
    } catch {
      return defaultDailyQuests;
    }
  });

  const [challenges, setChallenges] = useState<MultiDayChallenge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CHALLENGES`);
      if (saved) {
        const parsed: MultiDayChallenge[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((c) => c.id));
        const newCatalogItems = initialChallengesCatalog.filter((c) => !existingIds.has(c.id));
        return [...parsed, ...newCatalogItems];
      }
      return defaultChallenges;
    } catch {
      return defaultChallenges;
    }
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_HABITS`);
      return saved ? JSON.parse(saved) : defaultHabits;
    } catch {
      return defaultHabits;
    }
  });

  const [fallenHabits, setFallenHabits] = useState<FallenHabit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_FALLEN_HABITS`);
      return saved ? JSON.parse(saved) : defaultFallenHabits;
    } catch {
      return defaultFallenHabits;
    }
  });

  const [focusSessions, setFocusSessions] = useState<FocusSessionLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_FOCUS_SESSIONS`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_NOTES`);
      return saved ? JSON.parse(saved) : defaultResearchNotes;
    } catch {
      return defaultResearchNotes;
    }
  });

  const [researchCategories, setResearchCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CATEGORIES`);
      return saved ? JSON.parse(saved) : defaultResearchCategories;
    } catch {
      return defaultResearchCategories;
    }
  });

  const [recovery, setRecovery] = useState<RecoveryState>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_RECOVERY`);
      return saved ? JSON.parse(saved) : {
        isActive: false,
        startDate: null,
        daysInRecovery: 0,
        reason: 'Overtraining',
        dailyLog: '',
      };
    } catch {
      return { isActive: false, startDate: null, daysInRecovery: 0, reason: 'Overtraining', dailyLog: '' };
    }
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_NOTIFS`);
      return saved ? JSON.parse(saved) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_SETTINGS`);
      return saved ? JSON.parse(saved) : {
        ambientSound: true,
        sfxSound: true,
        ambientVolume: 0.35,
        sfxVolume: 0.6,
        accentTheme: 'blue',
        reducedMotion: false,
        playIntroOnLaunch: true,
      };
    } catch {
      return {
        ambientSound: true,
        sfxSound: true,
        ambientVolume: 0.35,
        sfxVolume: 0.6,
        accentTheme: 'blue',
        reducedMotion: false,
        playIntroOnLaunch: true,
      };
    }
  });

  const [isAwakened, setIsAwakened] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_AWAKENED`) === 'true';
  });

  const [selectedAwakeningCharacter, setSelectedAwakeningCharacterState] = useState<string>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_AWAKENING_CHAR`) || 'shadow_hunter';
    } catch {
      return 'shadow_hunter';
    }
  });

  const [showCinematicIntro, setShowCinematicIntro] = useState<boolean>(() => {
    try {
      // REQUIREMENT 9: INTRO MUST PLAY ONLY ONCE on first visit
      const introCompleted = localStorage.getItem(`${STORAGE_KEY}_INTRO_COMPLETED`);
      if (introCompleted === 'true') {
        return false; // Subsequent visits: immediately open normal dashboard!
      }
    } catch {}
    return true; // First visit: display awakening intro
  });

  const setSelectedAwakeningCharacter = (charId: string) => {
    setSelectedAwakeningCharacterState(charId);
    try {
      localStorage.setItem(`${STORAGE_KEY}_AWAKENING_CHAR`, charId);
    } catch {}
  };

  const completeAwakeningIntro = () => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_INTRO_COMPLETED`, 'true');
    } catch {}
    setShowCinematicIntro(false);
  };

  const replayAwakeningIntro = () => {
    setShowCinematicIntro(true);
  };

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [rankUpEvent, setRankUpEvent] = useState<{ oldRank: HunterRank; newRank: HunterRank } | null>(null);
  const [penaltyAlert, setPenaltyAlert] = useState<{ xpDeducted: number; reason: string } | null>(null);

  // Auth & Cloud Vault State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'error'>('idle');
  const [lastCloudSync, setLastCloudSync] = useState<Date | null>(null);

  // Firestore Sync Helper: persist state to /users/{uid}/system_data/state
  const persistStateToCloud = async (user: User) => {
    try {
      setCloudSyncStatus('syncing');
      const stateDocRef = doc(db, 'users', user.uid, 'system_data', 'state');
      const payload = {
        userId: user.uid,
        hunter,
        dailyQuests,
        challenges,
        habits,
        fallenHabits,
        focusSessions,
        researchNotes,
        settings,
        recovery,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(stateDocRef, payload);
      setLastCloudSync(new Date());
      setCloudSyncStatus('saved');
    } catch (err: unknown) {
      setCloudSyncStatus('error');
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/system_data/state`);
    }
  };

  // Firestore Hydration Helper: load state from cloud
  const hydrateFromCloudVault = async (user: User) => {
    try {
      setCloudSyncStatus('syncing');
      const userDocRef = doc(db, 'users', user.uid);
      const stateDocRef = doc(db, 'users', user.uid, 'system_data', 'state');

      // Ensure user profile doc exists
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            userId: user.uid,
            email: user.email || '',
            displayName: user.displayName || hunter.name || 'Hunter',
            photoUrl: user.photoURL || hunter.avatarUrl || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err: unknown) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      // Read remote hunter system data
      try {
        const stateSnap = await getDoc(stateDocRef);
        if (stateSnap.exists()) {
          const cloudData = stateSnap.data();
          if (cloudData.hunter) setHunter(cloudData.hunter);
          if (Array.isArray(cloudData.dailyQuests)) setDailyQuests(cloudData.dailyQuests);
          if (Array.isArray(cloudData.challenges)) setChallenges(cloudData.challenges);
          if (Array.isArray(cloudData.habits)) setHabits(cloudData.habits);
          if (Array.isArray(cloudData.fallenHabits)) setFallenHabits(cloudData.fallenHabits);
          if (Array.isArray(cloudData.focusSessions)) setFocusSessions(cloudData.focusSessions);
          if (Array.isArray(cloudData.researchNotes)) setResearchNotes(cloudData.researchNotes);
          if (cloudData.settings) setSettings(cloudData.settings);
          if (cloudData.recovery) setRecovery(cloudData.recovery);
          setLastCloudSync(new Date());
          setCloudSyncStatus('saved');
        } else {
          // Cloud empty: upload current state
          await persistStateToCloud(user);
        }
      } catch (err: unknown) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}/system_data/state`);
      }
    } catch (err: unknown) {
      console.error('Failed to hydrate from cloud vault:', err);
      setCloudSyncStatus('error');
    }
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
      if (user) {
        await hydrateFromCloudVault(user);
      } else {
        setCloudSyncStatus('idle');
      }
    });
    return () => unsubscribe();
  }, []);

  // Debounced Auto-Sync when user is authenticated
  useEffect(() => {
    if (!currentUser || !isAuthReady) return;

    const timer = setTimeout(() => {
      persistStateToCloud(currentUser);
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    currentUser,
    isAuthReady,
    hunter,
    dailyQuests,
    challenges,
    habits,
    fallenHabits,
    focusSessions,
    researchNotes,
    settings,
    recovery,
  ]);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setCurrentUser(result.user);
        if (result.user.displayName && (!hunter.name || hunter.name === 'Sung Jinwoo')) {
          setHunter((prev) => ({
            ...prev,
            name: result.user.displayName || prev.name,
            avatarUrl: prev.avatarUrl || result.user.photoURL || '',
          }));
        }
        await hydrateFromCloudVault(result.user);
      }
    } catch (err: unknown) {
      console.error('Google login error:', err);
      throw err;
    }
  };

  const logoutHunter = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCloudSyncStatus('idle');
    } catch (err: unknown) {
      console.error('Sign out error:', err);
      throw err;
    }
  };

  const syncToCloud = async () => {
    if (!currentUser) throw new Error('No authenticated hunter connected');
    await persistStateToCloud(currentUser);
  };

  const loadFromCloud = async () => {
    if (!currentUser) throw new Error('No authenticated hunter connected');
    await hydrateFromCloudVault(currentUser);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_HUNTER`, JSON.stringify(hunter));
  }, [hunter]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_QUESTS`, JSON.stringify(dailyQuests));
  }, [dailyQuests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_CHALLENGES`, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_HABITS`, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_FALLEN_HABITS`, JSON.stringify(fallenHabits));
  }, [fallenHabits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_FOCUS_SESSIONS`, JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_NOTES`, JSON.stringify(researchNotes));
  }, [researchNotes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_CATEGORIES`, JSON.stringify(researchCategories));
  }, [researchCategories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_RECOVERY`, JSON.stringify(recovery));
  }, [recovery]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_NOTIFS`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_SETTINGS`, JSON.stringify(settings));
    spaceAudio.setAmbientVolume(settings.ambientVolume);
    spaceAudio.setSfxVolume(settings.sfxVolume);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_AWAKENED`, isAwakened ? 'true' : 'false');
  }, [isAwakened]);

  // Audio start on first click helper
  useEffect(() => {
    const handleFirstTouch = () => {
      if (settings.ambientSound && !spaceAudio.getIsAmbientPlaying()) {
        spaceAudio.startSpaceAmbient();
      }
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
    window.addEventListener('click', handleFirstTouch, { once: true });
    window.addEventListener('keydown', handleFirstTouch, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };
  }, [settings.ambientSound]);

  // XP & Level-up engine
  const awardXp = (amount: number, statBonus?: Partial<HunterProfile['stats']>) => {
    setHunter((prev) => {
      let currentXp = prev.xp + amount;
      let currentLevel = prev.level;
      let nextXp = prev.nextLevelXp;
      const oldRank = prev.rank;
      let leveledUp = false;

      while (currentXp >= nextXp) {
        currentXp -= nextXp;
        currentLevel += 1;
        nextXp = calculateNextLevelXp(currentLevel);
        leveledUp = true;
      }

      const newRank = calculateRankFromLevel(currentLevel);

      if (newRank !== oldRank) {
        setRankUpEvent({ oldRank, newRank });
        if (settings.sfxSound) spaceAudio.playRankUp();
      } else if (leveledUp && settings.sfxSound) {
        spaceAudio.playQuestComplete();
      }

      const updatedStats = { ...prev.stats };
      if (statBonus) {
        Object.entries(statBonus).forEach(([key, val]) => {
          if (val && key in updatedStats) {
            (updatedStats as any)[key] += val;
          }
        });
      }
      if (leveledUp) {
        // Automatic baseline boost to all stats on level up
        updatedStats.strength += 1;
        updatedStats.endurance += 1;
        updatedStats.stamina += 1;
        updatedStats.agility += 1;
        updatedStats.mentalFortitude += 1;
      }

      return {
        ...prev,
        xp: currentXp,
        level: currentLevel,
        nextLevelXp: nextXp,
        rank: newRank,
        stats: updatedStats,
      };
    });
  };

  // Complete Quest
  const completeQuest = (questId: string) => {
    const target = dailyQuests.find((q) => q.id === questId);
    if (!target || target.completed) return;

    if (settings.sfxSound) spaceAudio.playQuestComplete();

    setDailyQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
    );

    awardXp(target.xpReward, target.statBonus);

    // Add notification
    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      type: 'QUEST',
      title: 'QUEST COMPLETED',
      description: `${target.title} verified by System. +${target.xpReward} XP awarded.`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Accept Challenge
  const acceptChallenge = (challengeId: string) => {
    if (settings.sfxSound) spaceAudio.playTap();
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              isAccepted: true,
              startDate: new Date().toISOString().split('T')[0],
              currentDay: 1,
            }
          : c
      )
    );
  };

  // Complete Challenge Day
  const completeChallengeDay = (challengeId: string) => {
    const target = challenges.find((c) => c.id === challengeId);
    if (!target || !target.isAccepted || target.isCompleted) return;

    const nextDay = target.currentDay + 1;
    const isDone = nextDay > target.durationDays;

    if (isDone) {
      if (settings.sfxSound) spaceAudio.playRankUp();
      awardXp(target.xpReward, {
        strength: 5,
        endurance: 5,
        mentalFortitude: 5,
      });
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === challengeId ? { ...c, currentDay: c.durationDays, isCompleted: true } : c
        )
      );
    } else {
      if (settings.sfxSound) spaceAudio.playQuestComplete();
      awardXp(Math.floor(target.xpReward / target.durationDays));
      setChallenges((prev) =>
        prev.map((c) => (c.id === challengeId ? { ...c, currentDay: nextDay } : c))
      );
    }
  };

  // Toggle Habit
  const toggleHabitToday = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const newCompleted = !h.completedToday;
        const newStreak = newCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
        const todayStr = new Date().toISOString().split('T')[0];
        const newHistory = { ...h.history, [todayStr]: newCompleted };

        if (newCompleted && settings.sfxSound) {
          spaceAudio.playQuestComplete();
          awardXp(h.difficulty * 10);
        }

        // Progressive Overload Engine check: 7-day milestone
        let escalatedNote = h.escalatedNote;
        if (newCompleted && newStreak % 7 === 0 && h.autoEscalate) {
          escalatedNote = `The System escalated this habit at Day ${newStreak} streak. +25% intensity required.`;
          const alertNotif: SystemNotification = {
            id: `escalate_${Date.now()}`,
            type: 'STREAK',
            title: 'SYSTEM PROGRESSIVE OVERLOAD',
            description: `${h.name} reached streak ${newStreak}. The System has detected adaptation and upgraded difficulty.`,
            timestamp: 'Just now',
            read: false,
          };
          setNotifications((n) => [alertNotif, ...n]);
        }

        return {
          ...h,
          completedToday: newCompleted,
          streak: newStreak,
          escalatedNote,
          history: newHistory,
        };
      })
    );
  };

  const addHabit = (name: string, category: Habit['category'], difficulty: number, autoEscalate: boolean) => {
    const newH: Habit = {
      id: `habit_${Date.now()}`,
      name,
      category,
      difficulty,
      streak: 0,
      completedToday: false,
      autoEscalate,
      history: {},
    };
    setHabits((prev) => [newH, ...prev]);
    if (settings.sfxSound) spaceAudio.playTap();
  };

  const abandonHabit = (habitId: string, reason: string) => {
    const target = habits.find((h) => h.id === habitId);
    if (!target) return;

    if (settings.sfxSound) spaceAudio.playPenalty();

    const fallen: FallenHabit = {
      id: `fallen_${Date.now()}`,
      name: target.name,
      streakAtDeath: target.streak,
      abandonedDate: new Date().toISOString().split('T')[0],
      reason: reason || 'Hunter failed to sustain the discipline.',
    };

    setFallenHabits((prev) => [fallen, ...prev]);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Recovery Mode
  const enterRecoveryMode = (reason: RecoveryState['reason'], initialLog: string) => {
    if (settings.sfxSound) spaceAudio.playRecoveryPulse();
    setRecovery({
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      daysInRecovery: 1,
      reason,
      dailyLog: initialLog,
    });
    setNotifications((prev) => [
      {
        id: `rec_${Date.now()}`,
        type: 'RECOVERY',
        title: 'RECOVERY PROTOCOL ENGAGED',
        description: 'Penalties paused. System focusing on biological cellular repair and mental visualization.',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  // ARISE from Recovery
  const ariseFromRecovery = () => {
    if (settings.sfxSound) spaceAudio.playArise();
    setRecovery({
      isActive: false,
      startDate: null,
      daysInRecovery: 0,
      reason: 'Overtraining',
      dailyLog: '',
    });
    // Award 500 Recovery Bonus XP
    awardXp(500, { recovery: 4, mentalFortitude: 3 });
    setNotifications((prev) => [
      {
        id: `arise_${Date.now()}`,
        type: 'RANK_UP',
        title: 'THE HUNTER HAS AWAKENED',
        description: 'Recovery protocol concluded. +500 Recovery Bonus XP awarded. Welcome back to the hunt.',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const addResearchNote = (note: Omit<ResearchNote, 'id' | 'date'>) => {
    const newNote: ResearchNote = {
      ...note,
      id: `note_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setResearchNotes((prev) => [newNote, ...prev]);
    if (settings.sfxSound) spaceAudio.playTap();
  };

  const deleteResearchNote = (id: string) => {
    setResearchNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const addResearchCategory = (cat: string) => {
    if (!cat.trim() || researchCategories.includes(cat)) return;
    setResearchCategories((prev) => [...prev, cat.trim()]);
    if (settings.sfxSound) spaceAudio.playTap();
  };

  const updateHunterProfile = (data: Partial<HunterProfile>) => {
    setHunter((prev) => ({ ...prev, ...data }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if ('ambientSound' in newSettings) {
        if (newSettings.ambientSound) {
          spaceAudio.startSpaceAmbient();
        } else {
          spaceAudio.stopSpaceAmbient();
        }
      }
      return updated;
    });
  };

  const completeOnboarding = (data: Partial<HunterProfile>) => {
    setHunter((prev) => ({
      ...prev,
      ...data,
      rank: 'E',
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      registrationDate: new Date().toISOString().split('T')[0],
    }));
    setIsAwakened(true);
    setShowCinematicIntro(false);
    setActiveTab('dashboard');
    if (settings.sfxSound) spaceAudio.playRankUp();
  };

  const clearRankUpEvent = () => setRankUpEvent(null);
  const clearPenaltyAlert = () => setPenaltyAlert(null);

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteQuest = (questId: string) => {
    setDailyQuests((prev) => prev.filter((q) => q.id !== questId));
    if (settings.sfxSound) spaceAudio.playTap();
  };

  const updateQuest = (questId: string, updated: Partial<DailyQuest>) => {
    setDailyQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, ...updated } : q))
    );
    if (settings.sfxSound) spaceAudio.playTap();
  };

  // Log Focus Session & Integrate with HabitForge
  const logFocusSession = (sessionData: Omit<FocusSessionLog, 'id' | 'completedAt'>) => {
    const newSession: FocusSessionLog = {
      ...sessionData,
      id: `focus_${Date.now()}`,
      completedAt: new Date().toISOString(),
    };

    setFocusSessions((prev) => [newSession, ...prev]);

    // Award XP
    awardXp(sessionData.xpEarned, {
      mentalFortitude: Math.max(1, Math.round(sessionData.durationMinutes / 15)),
      stamina: Math.max(1, Math.round(sessionData.durationMinutes / 25)),
    });

    // If attached to a Habit, mark it done in HabitForge!
    if (sessionData.habitId) {
      toggleHabitToday(sessionData.habitId);
    }

    // Add Notification
    const notif: SystemNotification = {
      id: `focus_notif_${Date.now()}`,
      type: 'FOCUS',
      title: 'FOCUS CRUCIBLE CONCLUDED',
      description: `${sessionData.taskTitle} (${sessionData.durationMinutes} min void focus). +${sessionData.xpEarned} XP harvested.`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Smooth rank progress calculator with Top 1% Extreme Discipline Curves
  const rankProgress = useMemo<RankProgressInfo>(() => {
    const lvl = hunter.level;
    const rank = hunter.rank;

    let minLvl = 1;
    let nextLvl = 20;
    let nextR: HunterRank | 'MAX' = 'D';

    if (rank === 'E') {
      minLvl = 1;
      nextLvl = 20;
      nextR = 'D';
    } else if (rank === 'D') {
      minLvl = 20;
      nextLvl = 50;
      nextR = 'C';
    } else if (rank === 'C') {
      minLvl = 50;
      nextLvl = 100;
      nextR = 'B';
    } else if (rank === 'B') {
      minLvl = 100;
      nextLvl = 180;
      nextR = 'A';
    } else if (rank === 'A') {
      minLvl = 180;
      nextLvl = 300;
      nextR = 'S';
    } else if (rank === 'S') {
      minLvl = 300;
      nextLvl = 450;
      nextR = 'NATIONAL';
    } else if (rank === 'NATIONAL') {
      minLvl = 450;
      nextLvl = 600;
      nextR = 'SHADOW_MONARCH';
    } else {
      minLvl = 600;
      nextLvl = 600;
      nextR = 'MAX';
    }

    const totalLevelsInSpan = Math.max(1, nextLvl - minLvl);
    const levelsCompleted = Math.max(0, lvl - minLvl);
    const fractionalProgress = levelsCompleted + Math.min(1, hunter.xp / Math.max(1, hunter.nextLevelXp));
    const progressPercent =
      nextR === 'MAX'
        ? 100
        : Math.min(100, Math.round((fractionalProgress / totalLevelsInSpan) * 100));

    return {
      currentRank: rank,
      nextRank: nextR,
      currentLevel: lvl,
      nextRankLevel: nextLvl,
      progressPercent,
      currentXp: hunter.xp,
      nextLevelXp: hunter.nextLevelXp,
      percentileLabel: getRankPercentileLabel(rank),
    };
  }, [hunter.level, hunter.rank, hunter.xp, hunter.nextLevelXp]);

  const addCustomQuest = (quest: Omit<DailyQuest, 'id' | 'completed'>) => {
    const newQ: DailyQuest = {
      ...quest,
      id: `custom_q_${Date.now()}`,
      completed: false,
    };
    setDailyQuests((prev) => [newQ, ...prev]);
    if (settings.sfxSound) spaceAudio.playTap();
  };

  const resetAllSystemData = () => {
    localStorage.clear();
    setHunter(defaultHunter);
    setDailyQuests(defaultDailyQuests);
    setChallenges(defaultChallenges);
    setHabits(defaultHabits);
    setFallenHabits(defaultFallenHabits);
    setFocusSessions([]);
    setResearchNotes(defaultResearchNotes);
    setResearchCategories(defaultResearchCategories);
    setRecovery({ isActive: false, startDate: null, daysInRecovery: 0, reason: 'Overtraining', dailyLog: '' });
    setNotifications(defaultNotifications);
    setIsAwakened(false);
    setShowCinematicIntro(true);
    setActiveTab('dashboard');
  };

  return (
    <SystemContext.Provider
      value={{
        hunter,
        dailyQuests,
        challenges,
        habits,
        fallenHabits,
        focusSessions,
        researchNotes,
        researchCategories,
        recovery,
        notifications,
        settings,
        isAwakened,
        showCinematicIntro,
        activeTab,
        rankUpEvent,
        penaltyAlert,
        rankProgress,
        currentUser,
        isAuthReady,
        cloudSyncStatus,
        lastCloudSync,
        loginWithGoogle,
        logoutHunter,
        syncToCloud,
        loadFromCloud,
        setActiveTab,
        setShowCinematicIntro,
        completeOnboarding,
        completeQuest,
        deleteQuest,
        updateQuest,
        acceptChallenge,
        completeChallengeDay,
        toggleHabitToday,
        addHabit,
        abandonHabit,
        logFocusSession,
        addResearchNote,
        deleteResearchNote,
        addResearchCategory,
        enterRecoveryMode,
        ariseFromRecovery,
        updateHunterProfile,
        updateSettings,
        clearRankUpEvent,
        clearPenaltyAlert,
        markNotificationsRead,
        addCustomQuest,
        resetAllSystemData,
        selectedAwakeningCharacter,
        setSelectedAwakeningCharacter,
        completeAwakeningIntro,
        replayAwakeningIntro,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
