import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  Activity,
  Zap,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Scale,
  ShieldAlert
} from 'lucide-react';

export const HunterStatus: React.FC = () => {
  const { hunter, dailyQuests, challenges, settings } = useSystem();

  // Manual body metrics log state
  const [logWeight, setLogWeight] = useState<number>(hunter.weight);
  const [bodyNotes, setBodyNotes] = useState<string>('Lean and vascular adaptation continuing.');
  const [metricSaved, setMetricSaved] = useState<boolean>(false);

  const stats = [
    { name: 'Strength', val: hunter.stats.strength, max: 100 },
    { name: 'Endurance', val: hunter.stats.endurance, max: 100 },
    { name: 'Stamina', val: hunter.stats.stamina, max: 100 },
    { name: 'Agility', val: hunter.stats.agility, max: 100 },
    { name: 'Mental Fortitude', val: hunter.stats.mentalFortitude, max: 100 },
    { name: 'Recovery', val: hunter.stats.recovery, max: 100 },
  ];

  // Radar polygon math (6 points, center 150, 150, radius 100)
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 110;

  const points = stats.map((s, i) => {
    const angle = (Math.PI * 2 / stats.length) * i - Math.PI / 2;
    const r = (s.val / s.max) * maxRadius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridCircles = [0.25, 0.5, 0.75, 1.0];

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.sfxSound) spaceAudio.playTap();
    setMetricSaved(true);
    setTimeout(() => setMetricSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2548]">
        <div>
          <span className="font-mono-system text-xs uppercase tracking-widest text-[#00E5FF]">
            VESSEL CALIBRATION & TELEMETRY
          </span>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-0.5 tracking-wider">
            HUNTER STATUS RADAR
          </h1>
        </div>
      </div>

      {/* RADAR CHART & SUMMARY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* SVG RADAR CHART */}
        <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-6 backdrop-blur-md flex flex-col items-center justify-center glow-blue">
          <h3 className="font-orbitron font-bold text-sm text-white mb-2 tracking-wider">
            6-AXIS CAPABILITY RADAR
          </h3>

          <div className="relative w-[300px] h-[300px]">
            <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
              {/* Background Concentric Hexagons */}
              {gridCircles.map((frac, idx) => {
                const hexPoints = stats.map((_, i) => {
                  const angle = (Math.PI * 2 / stats.length) * i - Math.PI / 2;
                  const r = frac * maxRadius;
                  return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
                }).join(' ');

                return (
                  <polygon
                    key={idx}
                    points={hexPoints}
                    fill="none"
                    stroke="#1A2548"
                    strokeWidth="1.5"
                    strokeDasharray={frac === 1 ? 'none' : '3 3'}
                  />
                );
              })}

              {/* Axis lines */}
              {stats.map((s, i) => {
                const angle = (Math.PI * 2 / stats.length) * i - Math.PI / 2;
                const x = centerX + maxRadius * Math.cos(angle);
                const y = centerY + maxRadius * Math.sin(angle);
                const labelX = centerX + (maxRadius + 24) * Math.cos(angle);
                const labelY = centerY + (maxRadius + 24) * Math.sin(angle);

                return (
                  <g key={i}>
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={x}
                      y2={y}
                      stroke="#1A2548"
                      strokeWidth="1"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      fill="#8899BB"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {s.name} ({s.val})
                    </text>
                  </g>
                );
              })}

              {/* Stat Polygon Area */}
              <polygon
                points={points}
                fill="rgba(0, 229, 255, 0.25)"
                stroke="#00E5FF"
                strokeWidth="2.5"
                filter="drop-shadow(0 0 8px rgba(0, 229, 255, 0.6))"
              />
            </svg>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 gap-3.5">
          {stats.map((s) => (
            <div
              key={s.name}
              className="p-4 rounded-xl border border-[#1A2548] bg-[#0A0D22] space-y-1"
            >
              <span className="text-[11px] font-mono text-[#8899BB] uppercase">
                {s.name}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-orbitron font-extrabold text-2xl text-white tabular-nums">
                  {s.val}
                </span>
                <span className="text-xs font-mono text-[#00E5FF]">
                  CAP: {s.max}
                </span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-[#141B3B] mt-1">
                <div
                  className="h-full bg-[#00E5FF] rounded-full"
                  style={{ width: `${(s.val / s.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BODY METRICS LOG */}
      <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#00E5FF]" />
          <h3 className="font-orbitron font-bold text-base text-white tracking-wide">
            VESSEL MASS & BODY COMPOSITION LOG
          </h3>
        </div>

        <form onSubmit={handleSaveMetrics} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={logWeight}
                onChange={(e) => setLogWeight(parseFloat(e.target.value) || 70)}
                className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Conditioning Notes
              </label>
              <input
                type="text"
                value={bodyNotes}
                onChange={(e) => setBodyNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#0A0D22] text-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {metricSaved ? (
              <span className="text-xs font-mono text-emerald-400 font-bold">
                ✓ BIOMETRICS LOGGED TO REGISTRY
              </span>
            ) : (
              <span className="text-xs font-mono text-slate-500">
                Logged daily to observe cellular adaptation.
              </span>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#00E5FF] text-black font-orbitron font-bold text-xs hover:bg-cyan-300"
            >
              LOG BIOMETRICS
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
