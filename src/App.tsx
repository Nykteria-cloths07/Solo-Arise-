/**
 * Solo Arise — Real-Life Solo Leveling System
 */

import React from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { SpaceBackground } from './components/common/SpaceBackground';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { CinematicIntro } from './components/intro/CinematicIntro';
import { AwakeningFlow } from './components/onboarding/AwakeningFlow';
import { Dashboard } from './components/dashboard/Dashboard';
import { QuestLog } from './components/quests/QuestLog';
import { HabitForge } from './components/habits/HabitForge';
import { AICoach } from './components/ai/AICoach';
import { GateLibrary } from './components/gate/GateLibrary';
import { HunterLicense } from './components/license/HunterLicense';
import { HunterStatus } from './components/stats/HunterStatus';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { NotificationsModal } from './components/notifications/NotificationsModal';
import { RankUpModal } from './components/cinematic/RankUpModal';

const AppContent: React.FC = () => {
  const { isAwakened, showCinematicIntro, activeTab } = useSystem();

  // 1. Cinematic Intro Screen
  if (showCinematicIntro) {
    return <CinematicIntro />;
  }

  // 2. Awakening Onboarding Flow (for first-time hunters)
  if (!isAwakened) {
    return (
      <div className="relative min-h-screen bg-[#05050F] text-[#E8F0FF]">
        <SpaceBackground />
        <AwakeningFlow />
      </div>
    );
  }

  // 3. Main System Interface
  return (
    <div className="relative min-h-screen bg-[#05050F] text-[#E8F0FF] flex flex-col system-scanline">
      {/* Real Space Particle Background */}
      <SpaceBackground />

      {/* Top Bar Header Contract */}
      <Header />

      {/* Dynamic Screen View */}
      <main className="flex-1 relative z-10">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'quests' && <QuestLog />}
        {activeTab === 'habits' && <HabitForge />}
        {activeTab === 'ai-coach' && <AICoach />}
        {activeTab === 'gate' && <GateLibrary />}
        {activeTab === 'license' && <HunterLicense />}
        {activeTab === 'stats' && <HunterStatus />}
        {activeTab === 'settings' && <SettingsScreen />}
        {activeTab === 'notifications' && <NotificationsModal />}
      </main>

      {/* Mobile-Friendly Fixed Bottom Navigation Bar */}
      <BottomNav />

      {/* Rank Up Full Screen Cinematic Animation */}
      <RankUpModal />
    </div>
  );
};

export default function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}
