import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { Bell, Check, Shield, AlertOctagon, Flame, HeartPulse, Bot } from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const { notifications, markNotificationsRead } = useSystem();

  const getIcon = (type: string) => {
    switch (type) {
      case 'QUEST':
        return <Shield className="w-4 h-4 text-[#00E5FF]" />;
      case 'PENALTY':
        return <AlertOctagon className="w-4 h-4 text-red-400" />;
      case 'RANK_UP':
        return <span className="font-bebas text-sm text-amber-400">RANK</span>;
      case 'RECOVERY':
        return <HeartPulse className="w-4 h-4 text-purple-400" />;
      case 'STREAK':
        return <Flame className="w-4 h-4 text-amber-500" />;
      default:
        return <Bot className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1A2548]">
        <div>
          <span className="font-mono-system text-xs uppercase tracking-widest text-[#00E5FF]">
            TELEMETRY DISPATCH
          </span>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-0.5 tracking-wider">
            SYSTEM ALERTS
          </h1>
        </div>

        <button
          onClick={markNotificationsRead}
          className="px-3.5 py-1.5 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          <span>MARK ALL READ</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
              !n.read
                ? 'border-[#00E5FF]/50 bg-[#091129]'
                : 'border-[#141B3B] bg-[#07091B]/80 opacity-75'
            }`}
          >
            <div className="p-2 rounded-lg bg-black/60 border border-slate-800 shrink-0 mt-0.5">
              {getIcon(n.type)}
            </div>

            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-orbitron font-bold text-sm text-white">
                  {n.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500">
                  {n.timestamp}
                </span>
              </div>
              <p className="text-xs font-mono text-[#8899BB] leading-relaxed">
                {n.description}
              </p>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="py-16 text-center text-xs font-mono text-slate-500">
            No system alerts dispatched.
          </div>
        )}
      </div>
    </div>
  );
};
