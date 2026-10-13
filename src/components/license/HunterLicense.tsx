import React, { useState, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  Shield,
  Share2,
  Edit3,
  Award,
  Calendar,
  CheckCircle2,
  Sparkles,
  QrCode,
  RotateCcw,
  Upload,
  Camera,
  User,
  Check
} from 'lucide-react';
import { HunterClass } from '../../types/system';
import { MONARCH_AVATAR_PRESETS } from '../../data/monarchAvatars';

export const HunterLicense: React.FC = () => {
  const { hunter, updateHunterProfile, challenges, settings } = useSystem();

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(hunter.name);
  const [editClass, setEditClass] = useState<HunterClass>(hunter.hunterClass);
  const [customAvatar, setCustomAvatar] = useState<string>(hunter.avatarUrl || '');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFlip = () => {
    if (settings.sfxSound) spaceAudio.playTap();
    setIsFlipped(!isFlipped);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHunterProfile({
      name: editName.trim() || hunter.name,
      hunterClass: editClass,
      avatarUrl: customAvatar,
    });
    setIsEditing(false);
    if (settings.sfxSound) spaceAudio.playQuestComplete();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomAvatar(reader.result);
        if (settings.sfxSound) spaceAudio.playTap();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleShare = async () => {
    if (settings.sfxSound) spaceAudio.playTap();

    const shareData = {
      title: `Solo Arise — ${hunter.name}'s Hunter License`,
      text: `Hunter ${hunter.name} is ${hunter.rank}-Rank (Level ${hunter.level} ${hunter.hunterClass}) in the Solo Leveling System!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.warn('Share cancelled', err);
      }
    } else {
      navigator.clipboard.writeText(
        `[SOLO ARISE HUNTER LICENSE]\nHunter: ${hunter.name}\nRank: ${hunter.rank}-Rank\nLevel: ${hunter.level}\nClass: ${hunter.hunterClass}\nID: ${hunter.hunterId}`
      );
      alert('Hunter License details copied to clipboard!');
    }
  };

  const rankTimeline = [
    { rank: 'E', label: 'E-Rank', achieved: true, percentile: 'Bottom 90% (Crucible of the Weak)' },
    { rank: 'D', label: 'D-Rank', achieved: hunter.level >= 20, percentile: 'Top 35% Breakthrough (Level 20)' },
    { rank: 'C', label: 'C-Rank', achieved: hunter.level >= 50, percentile: 'Top 15% Hardened (Level 50)' },
    { rank: 'B', label: 'B-Rank', achieved: hunter.level >= 100, percentile: 'Top 5.0% Crucible Veteran (Level 100)' },
    { rank: 'A', label: 'A-Rank', achieved: hunter.level >= 180, percentile: 'Top 2.0% Elite Slayer (Level 180)' },
    { rank: 'S', label: 'S-Rank', achieved: hunter.level >= 300, percentile: 'Top 1.0% Superhuman Anomaly (Level 300 — EXTREME HARD)' },
    { rank: 'NATIONAL', label: 'National', achieved: hunter.level >= 450, percentile: 'Top 0.1% Planetary Apex (Level 450)' },
    { rank: 'SHADOW_MONARCH', label: 'Shadow Monarch', achieved: hunter.level >= 600, percentile: 'Top 0.001% Transcendent Sovereign (Level 600)' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2548]">
        <div>
          <span className="font-mono-system text-xs uppercase tracking-widest text-[#00E5FF]">
            GLOBAL HUNTERS ASSOCIATION ARCHIVE
          </span>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-0.5 tracking-wider">
            OFFICIAL HUNTER LICENSE
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl border border-[#1A2548] bg-[#0A0D22] text-slate-300 font-mono text-xs hover:border-[#00E5FF] hover:text-white transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'CLOSE EDITOR' : 'CUSTOMIZE PROFILE & AVATAR'}</span>
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-cyan-950"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE LICENSE</span>
          </button>
        </div>
      </div>

      {/* CUSTOMIZE AVATAR & PROFILE DRAWER/MODAL */}
      {isEditing && (
        <form
          onSubmit={handleSaveEdit}
          className="p-6 rounded-2xl border border-[#00E5FF]/70 bg-[#090D26] space-y-5 glow-blue"
        >
          <div className="flex items-center justify-between border-b border-[#141B3B] pb-3">
            <h3 className="font-orbitron font-bold text-white text-base">
              CUSTOMIZE HUNTER DOSSIER & AVATAR
            </h3>
            <span className="text-xs font-mono text-[#00E5FF]">SYSTEM REGISTRY V4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Hunter Designation (Name)
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#050716] text-white text-xs font-mono focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Hunter Class Specialization
              </label>
              <select
                value={editClass}
                onChange={(e) => setEditClass(e.target.value as HunterClass)}
                className="w-full px-3 py-2 rounded-lg border border-[#1A2548] bg-[#050716] text-white text-xs font-mono"
              >
                <option value="Warrior">Warrior</option>
                <option value="Assassin">Assassin</option>
                <option value="Mage">Mage</option>
                <option value="Tank">Tank</option>
              </select>
            </div>
          </div>

          {/* AVATAR CUSTOMIZER SECTION */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-mono text-slate-300">
              Hunter Photo / Avatar Inscription
            </label>

            {/* Upload or Camera Option */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl border border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] font-mono text-xs hover:bg-[#00E5FF]/20 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>UPLOAD PHOTO FROM DEVICE / CAMERA</span>
              </button>

              {customAvatar && (
                <button
                  type="button"
                  onClick={() => setCustomAvatar('')}
                  className="text-xs font-mono text-slate-400 hover:text-red-400"
                >
                  Reset Avatar
                </button>
              )}
            </div>

            {/* PRESET SOLO LEVELING MONARCH AVATARS */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                Or choose an official Solo Leveling anime preset:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MONARCH_AVATAR_PRESETS.map((preset) => {
                  const isSelected = customAvatar === preset.dataUrl;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setCustomAvatar(preset.dataUrl)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'border-[#00E5FF] bg-[#00E5FF]/20 glow-blue'
                          : 'border-[#1A2548] bg-[#050716] hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={preset.dataUrl}
                        alt={preset.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#00E5FF]/40 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="font-orbitron font-bold text-xs text-white block truncate">
                          {preset.name}
                        </span>
                        <span className="text-[9px] font-mono text-[#8899BB] block truncate">
                          {preset.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#141B3B]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-mono text-slate-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#00E5FF] text-black font-orbitron font-bold text-xs hover:bg-cyan-300"
            >
              SAVE PROFILE
            </button>
          </div>
        </form>
      )}

      {/* 3D FLIPPABLE HUNTER LICENSE CARD */}
      <div className="flex flex-col items-center">
        <div className="text-xs font-mono text-slate-500 mb-2 flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>TAP CARD TO FLIP (FRONT / BACK)</span>
        </div>

        <div
          onClick={handleFlip}
          className="w-full max-w-md h-[270px] cursor-pointer perspective-[1000px] select-none"
        >
          <div
            className={`w-full h-full relative rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            {/* FRONT FACE */}
            <div className="absolute inset-0 w-full h-full rounded-2xl border-2 border-[#00E5FF]/70 bg-gradient-to-br from-[#0C1236] via-[#060818] to-[#0A071E] p-6 flex flex-col justify-between [backface-visibility:hidden] shadow-2xl glow-blue-lg overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#00E5FF]/30 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#00E5FF] text-black flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <span className="font-orbitron font-black text-xs tracking-wider text-white">
                      KOREAN HUNTERS ASSOCIATION
                    </span>
                    <span className="block font-mono text-[9px] text-[#00E5FF]">
                      GLOBAL RANKING CLEARANCE
                    </span>
                  </div>
                </div>

                <div className="w-11 h-11 rounded-xl border border-[#00E5FF] bg-black/60 flex items-center justify-center glow-blue">
                  <span className="font-bebas text-2xl text-[#00E5FF]">
                    {hunter.rank}
                  </span>
                </div>
              </div>

              {/* Avatar and Info */}
              <div className="flex items-center gap-4 py-2">
                {hunter.avatarUrl ? (
                  <img
                    src={hunter.avatarUrl}
                    alt={hunter.name}
                    className="w-20 h-20 rounded-xl border-2 border-[#00E5FF] object-cover glow-blue shadow-lg shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl border-2 border-[#00E5FF] bg-gradient-to-br from-[#101F52] to-[#040612] flex items-center justify-center text-white glow-blue shrink-0">
                    <span className="font-orbitron font-extrabold text-2xl text-[#00E5FF]">
                      {hunter.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-slate-400 block tracking-widest uppercase">
                    HUNTER ID: {hunter.hunterId}
                  </span>
                  <h2 className="font-orbitron font-black text-xl text-white tracking-wide">
                    {hunter.name}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
                    <span className="font-bold">CLASS: {hunter.hunterClass}</span>
                    <span>·</span>
                    <span className="text-white">LEVEL {hunter.level}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#141B3B] text-[10px] font-mono text-slate-400">
                <span>ISSUED: {hunter.registrationDate}</span>
                <span className="text-[#00E5FF] font-bold tracking-widest">
                  AUTHORIZATION: VERIFIED
                </span>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="absolute inset-0 w-full h-full rounded-2xl border-2 border-[#4D9FFF]/70 bg-gradient-to-bl from-[#0A071E] via-[#060818] to-[#0C1236] p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-2xl glow-blue overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#141B3B] pb-2">
                <span className="font-mono text-xs font-bold text-[#00E5FF]">
                  VESSEL CALIBRATION RECORD
                </span>
                <QrCode className="w-5 h-5 text-slate-400" />
              </div>

              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="p-2 rounded bg-black/40 border border-[#141B3B] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">STR</span>
                  <span className="font-mono font-bold text-sm text-red-400">{hunter.stats.strength}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-[#141B3B] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">END</span>
                  <span className="font-mono font-bold text-sm text-amber-400">{hunter.stats.endurance}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-[#141B3B] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">STM</span>
                  <span className="font-mono font-bold text-sm text-emerald-400">{hunter.stats.stamina}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-[#141B3B] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">AGI</span>
                  <span className="font-mono font-bold text-sm text-cyan-400">{hunter.stats.agility}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-[#141B3B] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">MNT</span>
                  <span className="font-mono font-bold text-sm text-indigo-400">{hunter.stats.mentalFortitude}</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-[#141B3B] text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">REC</span>
                  <span className="font-mono font-bold text-sm text-purple-400">{hunter.stats.recovery}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 text-center border-t border-[#141B3B] pt-2">
                SYSTEM REGISTERED CODE: {hunter.hunterId}-KR-SHADOW
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RANK ADVANCEMENT TIMELINE */}
      <div className="bg-[#080B1F]/90 border border-[#1A2548] rounded-2xl p-6 backdrop-blur-md space-y-4">
        <h3 className="font-orbitron font-bold text-base text-white tracking-wide">
          HUNTER RANK ADVANCEMENT PATH
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {rankTimeline.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center transition-all ${
                item.achieved
                  ? 'border-[#00E5FF]/70 bg-[#00E5FF]/10 glow-blue text-white'
                  : 'border-[#141B3B] bg-[#050716] opacity-40 text-slate-500'
              }`}
            >
              <div className="font-bebas text-2xl text-[#00E5FF]">
                {item.rank}
              </div>
              <div className="font-mono text-[10px] mt-0.5 font-bold">
                {item.label}
              </div>
              <div className="text-[8px] font-mono text-cyan-300 truncate font-semibold mt-0.5">
                {item.percentile}
              </div>
              <div className="text-[9px] font-mono mt-0.5 text-slate-400">
                {item.achieved ? 'CLEARED ✓' : 'LOCKED'}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
