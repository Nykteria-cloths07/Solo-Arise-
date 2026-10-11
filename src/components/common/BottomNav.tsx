import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { LayoutDashboard, Swords, Flame, Sparkles, UserCheck } from 'lucide-react';
import { spaceAudio } from '../../audio/spaceAudio';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, settings } = useSystem();

  const handleTabClick = (tabKey: string) => {
    if (settings.sfxSound) spaceAudio.playTap();
    setActiveTab(tabKey);
  };

  const tabs = [
    { key: 'dashboard', label: 'SYSTEM', icon: LayoutDashboard },
    { key: 'quests', label: 'QUESTS', icon: Swords },
    { key: 'habits', label: 'HABITS', icon: Flame },
    { key: 'gate', label: 'GATE', icon: Sparkles },
    { key: 'license', label: 'HUNTER', icon: UserCheck },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070918]/95 backdrop-blur-lg border-t border-[#1A2548] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] relative transition-colors ${
                isActive ? 'text-[#00E5FF]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[10px] font-mono font-medium tracking-tight mt-1 ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
