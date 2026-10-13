import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import { Terminal, Cpu, ShieldAlert, Wifi } from 'lucide-react';

interface TerminalScreenTransitionProps {
  activeTab: string;
  children: React.ReactNode;
}

const TAB_LABELS: Record<string, string> = {
  dashboard: 'HUD CORE // SECTOR ALPHA',
  quests: 'MANDATE VAULT // DAILY QUOTAS',
  habits: 'HABIT FORGE // OVERLOAD REACTOR',
  'ai-coach': 'GOGGINS TACTICAL // ACCOUNTABILITY ENGINE',
  gate: 'GATE ARCHIVE // 4D PARANORMAL MATRIX',
  license: 'HUNTER LICENSE // ASSOCIATION DATABASE',
  stats: '6-AXIS TELEMETRY // RADAR CALIBRATION',
  settings: 'SYSTEM CORE // MONARCH PROTOCOL CONFIG',
  notifications: 'ALERT COMMS // ENCRYPTED DISPATCH',
};

export const TerminalScreenTransition: React.FC<TerminalScreenTransitionProps> = ({
  activeTab,
  children,
}) => {
  const { settings } = useSystem();
  const [transitionKey, setTransitionKey] = useState<number>(0);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  useEffect(() => {
    // Increment key to re-trigger CSS keyframes
    setTransitionKey((prev) => prev + 1);
    setIsGlitching(true);

    if (settings.sfxSound) {
      spaceAudio.playTap();
    }

    const timer = setTimeout(() => {
      setIsGlitching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const activeLabel = TAB_LABELS[activeTab] || `SECTOR // ${activeTab.toUpperCase()}`;

  return (
    <div key={transitionKey} className="relative w-full flex-1 min-h-[calc(100vh-8rem)]">
      
      {/* Military HUD Terminal Corner Brackets */}
      {isGlitching && (
        <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
          {/* Top-Left Corner Bracket */}
          <div className="absolute top-16 left-3 sm:left-6 flex items-center gap-1 text-[9px] font-mono text-[#00E5FF]/70">
            <span className="w-3 h-3 border-t-2 border-l-2 border-[#00E5FF] inline-block" />
            <span className="tracking-widest uppercase">SYS.TERM // 0x4F</span>
          </div>

          {/* Top-Right Corner Bracket */}
          <div className="absolute top-16 right-3 sm:right-6 flex items-center gap-1 text-[9px] font-mono text-[#00E5FF]/70">
            <span className="tracking-widest uppercase">SEC.LEVEL: S-CLASS</span>
            <span className="w-3 h-3 border-t-2 border-r-2 border-[#00E5FF] inline-block" />
          </div>

          {/* Bottom-Left Corner Bracket */}
          <div className="absolute bottom-20 left-3 sm:left-6 flex items-center gap-1 text-[9px] font-mono text-[#00E5FF]/70">
            <span className="w-3 h-3 border-b-2 border-l-2 border-[#00E5FF] inline-block" />
            <span className="tracking-widest uppercase">ENCRYPT: 4096-BIT</span>
          </div>

          {/* Bottom-Right Corner Bracket */}
          <div className="absolute bottom-20 right-3 sm:right-6 flex items-center gap-1 text-[9px] font-mono text-[#00E5FF]/70">
            <span className="tracking-widest uppercase">ONLINE</span>
            <span className="w-3 h-3 border-b-2 border-r-2 border-[#00E5FF] inline-block" />
          </div>

          {/* Holographic Laser Scan Sweep Beam */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent shadow-[0_0_15px_#00E5FF] terminal-scan-beam" />

          {/* Military Terminal Telemetry Flash Badge */}
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-40 terminal-telemetry-badge">
            <div className="px-3 py-1 rounded-md border border-[#00E5FF] bg-[#050B20]/95 backdrop-blur-md text-[#00E5FF] font-mono text-[10px] sm:text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/80">
              <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-bold tracking-wider">{activeLabel}</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400 font-bold">ACK OK</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Screen Content with Holographic CSS Glitch Animation */}
      <div className="w-full holo-terminal-glitch">
        {children}
      </div>
    </div>
  );
};
