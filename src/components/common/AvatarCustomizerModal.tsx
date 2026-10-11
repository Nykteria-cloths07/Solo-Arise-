import React, { useState, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  X,
  Upload,
  Link,
  Check,
  Shield,
  Sparkles,
  Camera,
  RefreshCw,
  User,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { HunterClass } from '../../types/system';

interface AvatarPreset {
  id: string;
  name: string;
  title: string;
  url: string;
  badge: string;
}

const SOLO_LEVELING_PRESETS: AvatarPreset[] = [
  {
    id: 'jinwoo_monarch',
    name: 'Sung Jinwoo',
    title: 'Shadow Monarch (Awakened)',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    badge: 'SHADOW MONARCH',
  },
  {
    id: 'jinwoo_erank',
    name: 'Sung Jinwoo',
    title: 'The Weakest E-Rank Hunter',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    badge: 'E-RANK',
  },
  {
    id: 'igris',
    name: 'Commander Igris',
    title: 'Blood-Red Knight Marshal',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    badge: 'MARSHAL',
  },
  {
    id: 'cha_haein',
    name: 'Cha Hae-In',
    title: 'The Sword Saint (S-Rank)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    badge: 'S-RANK',
  },
  {
    id: 'beru',
    name: 'Ant King Beru',
    title: 'Predator of Jeju Island',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    badge: 'SHADOW GENERAL',
  },
  {
    id: 'thomas_andre',
    name: 'Thomas Andre',
    title: 'The Goliath (National Rank)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    badge: 'NATIONAL',
  },
  {
    id: 'baek_yoonho',
    name: 'Baek Yoonho',
    title: 'White Tiger Guild Master',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    badge: 'S-RANK',
  },
  {
    id: 'choi_jongin',
    name: 'Choi Jong-In',
    title: 'Ultimate Soldier (Flame Mage)',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    badge: 'S-RANK',
  },
  {
    id: 'dark_hunter',
    name: 'Shadow Vessel',
    title: 'Dark Neon Cyber-Hunter',
    url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=500&auto=format&fit=crop&q=80',
    badge: 'TACTICAL',
  },
];

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { hunter, updateHunterProfile, settings } = useSystem();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>(hunter.avatarUrl || '');
  const [hunterName, setHunterName] = useState<string>(hunter.name);
  const [hunterClass, setHunterClass] = useState<HunterClass>(hunter.hunterClass);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Selected file must be an image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        if (settings.sfxSound) spaceAudio.playSystemChime();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateHunterProfile({
      avatarUrl: avatarUrl.trim(),
      name: hunterName.trim() || hunter.name,
      hunterClass,
    });
    if (settings.sfxSound) spaceAudio.playQuestComplete();
    onClose();
  };

  const handleSelectPreset = (preset: AvatarPreset) => {
    setAvatarUrl(preset.url);
    if (settings.sfxSound) spaceAudio.playTap();
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setCustomUrlInput('');
    if (settings.sfxSound) spaceAudio.playSystemChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono select-none overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#070A1E]/95 border-2 border-[#00E5FF]/80 rounded-2xl p-6 sm:p-7 glow-blue-lg shadow-2xl space-y-6 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A2548] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-[#00E5FF] bg-[#00E5FF]/10 flex items-center justify-center glow-blue text-[#00E5FF]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono-system uppercase tracking-widest text-[#00E5FF] font-bold">
                [ HUNTERS ASSOCIATION CREDENTIALS ]
              </span>
              <h2 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white tracking-wide">
                CUSTOMIZE HUNTER AVATAR & IDENTITY
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Card Preview */}
        <div className="p-4 rounded-xl border border-[#1A2548] bg-gradient-to-r from-[#050716] via-[#090E2A] to-[#050716] flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-2xl border-2 border-[#00E5FF] overflow-hidden bg-black glow-blue shadow-lg flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Hunter Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Shield className="w-10 h-10 text-[#00E5FF]/60" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 rounded-lg bg-[#00E5FF] text-black hover:brightness-110 shadow-md transition-transform active:scale-95"
              title="Upload Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
                {hunter.rank}-RANK PLAYER
              </span>
              <span className="text-xs text-slate-400 font-mono">
                LV.{hunter.level} · {hunter.hunterId}
              </span>
            </div>
            <h3 className="font-orbitron font-extrabold text-xl text-white truncate">
              {hunterName || 'Designate Name'}
            </h3>
            <p className="text-xs font-mono text-[#8899BB]">
              Class: <strong className="text-white">{hunterClass.toUpperCase()}</strong> · Unbroken Streak: <span className="text-emerald-400">{hunter.consecutiveStreak} Days</span>
            </p>
          </div>
        </div>

        {/* Hunter Identity Input Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[#8899BB] uppercase font-bold">
              Hunter Designation Name
            </label>
            <input
              type="text"
              value={hunterName}
              onChange={(e) => setHunterName(e.target.value)}
              placeholder="e.g. Sung Jinwoo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A2548] bg-[#050716] text-white font-mono text-sm focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#8899BB] uppercase font-bold">
              Combat Specialization Class
            </label>
            <select
              value={hunterClass}
              onChange={(e) => setHunterClass(e.target.value as HunterClass)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A2548] bg-[#050716] text-white font-mono text-sm focus:outline-none focus:border-[#00E5FF]"
            >
              <option value="Warrior">Warrior (STR & Kinetic Overload)</option>
              <option value="Assassin">Assassin (AGI & High-Cadence Strikes)</option>
              <option value="Mage">Mage (MNT & Mana Channeling)</option>
              <option value="Tank">Tank (END & Unbroken Isometric Armor)</option>
            </select>
          </div>
        </div>

        {/* Tab selection for avatar source */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[#1A2548] pb-2 text-xs font-mono font-bold">
            <button
              onClick={() => setActiveTab('presets')}
              className={`pb-1 px-2 transition-colors ${
                activeTab === 'presets'
                  ? 'text-[#00E5FF] border-b-2 border-[#00E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SOLO LEVELING PRESETS
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-1 px-2 transition-colors ${
                activeTab === 'upload'
                  ? 'text-[#00E5FF] border-b-2 border-[#00E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UPLOAD PHOTO FROM DEVICE
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`pb-1 px-2 transition-colors ${
                activeTab === 'url'
                  ? 'text-[#00E5FF] border-b-2 border-[#00E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PASTE IMAGE LINK (URL)
            </button>
          </div>

          {/* TAB 1: SOLO LEVELING PRESETS */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
              {SOLO_LEVELING_PRESETS.map((p) => {
                const isSelected = avatarUrl === p.url;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2 rounded-xl border text-left transition-all relative flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-[#00E5FF] bg-[#00E5FF]/10 glow-blue'
                        : 'border-[#1A2548] bg-[#050716] hover:border-[#4D9FFF]/60'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-700 bg-black">
                      <img
                        src={p.url}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center w-full">
                      <span className="text-[11px] font-bold text-white block truncate">
                        {p.name}
                      </span>
                      <span className="text-[9px] text-[#00E5FF] font-mono block truncate">
                        {p.badge}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#00E5FF] text-black flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: UPLOAD PHOTO */}
          {activeTab === 'upload' && (
            <div className="p-6 rounded-xl border border-dashed border-[#1A2548] bg-[#050716] text-center space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 mx-auto flex items-center justify-center text-[#00E5FF]">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white font-bold">
                  Select a photo or avatar from your device
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG, WEBP up to 5MB. Stored privately and persisted locally in your vessel profile.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                CHOOSE PHOTO FILE
              </button>
              {uploadError && (
                <p className="text-xs text-red-400 font-mono mt-2">{uploadError}</p>
              )}
            </div>
          )}

          {/* TAB 3: IMAGE LINK */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-3 p-4 rounded-xl border border-[#1A2548] bg-[#050716]">
              <label className="text-xs text-[#8899BB] font-mono block">
                Direct Web Image URL (HTTPS)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/my-hunter-avatar.jpg"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#1A2548] bg-[#0A0E2A] text-white text-xs font-mono focus:outline-none focus:border-[#00E5FF]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-orbitron font-bold text-xs hover:brightness-110 shrink-0"
                >
                  LOAD
                </button>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Tip: Paste any profile picture or anime image URL.
              </p>
            </form>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1A2548]">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#1A2548] bg-transparent text-slate-300 font-mono text-xs hover:text-white hover:bg-slate-800/40"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#4D9FFF] text-black font-orbitron font-black text-xs tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md glow-blue flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>CONFIRM HUNTER VESSEL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
