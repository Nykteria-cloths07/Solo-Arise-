import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { spaceAudio } from '../../audio/spaceAudio';
import {
  X,
  Shield,
  Cloud,
  CheckCircle2,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Lock,
  Sparkles,
  Database,
  Smartphone,
  Flame,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    cloudSyncStatus,
    lastCloudSync,
    loginWithGoogle,
    logoutHunter,
    syncToCloud,
    loadFromCloud,
    hunter,
    settings,
  } = useSystem();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (settings.sfxSound) spaceAudio.playSystemChime();

    try {
      await loginWithGoogle();
      if (settings.sfxSound) spaceAudio.playArise();
      setSuccessMessage('HUNTER IDENTITY CONFIRMED. Cloud vault synchronization active.');
    } catch (err: unknown) {
      console.error('Login error:', err);
      const msg = err instanceof Error ? err.message : 'Authentication could not be completed';
      if (msg.includes('popup-closed-by-user')) {
        setErrorMessage('Authentication popup closed before sign-in completed. Please try again.');
      } else {
        setErrorMessage('Failed to connect to Google Auth: ' + msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (settings.sfxSound) spaceAudio.playTap();

    try {
      await logoutHunter();
      setSuccessMessage('Hunter disconnected. Session returned to local mode.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign out';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    if (settings.sfxSound) spaceAudio.playChime();

    try {
      await syncToCloud();
      setSuccessMessage('Monarch Vault updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      setErrorMessage('Failed to write to cloud vault: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    if (settings.sfxSound) spaceAudio.playDeepBoom();

    try {
      await loadFromCloud();
      setSuccessMessage('Progress successfully retrieved from Monarch Cloud Vault!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      setErrorMessage('Failed to load from cloud: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#070B1E] border border-[#1A2E66] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 overflow-hidden">
        
        {/* Holographic Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1A2548]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-blue-900/40 border border-[#00E5FF]/50 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-[#00E5FF] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#00E5FF] tracking-widest uppercase font-bold">
                  [SYSTEM SECURITY PROTOCOL]
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-blue-950 text-blue-300 border border-blue-800">
                  FIRESTORE VAULT
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-orbitron font-extrabold text-white tracking-wide">
                HUNTER CLOUD LOGIN
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              if (settings.sfxSound) spaceAudio.playTap();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banners */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl border border-rose-500/60 bg-rose-950/40 text-rose-300 text-xs font-mono flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3.5 rounded-xl border border-emerald-500/60 bg-emerald-950/40 text-emerald-300 text-xs font-mono flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="mt-5 space-y-5">
          {currentUser ? (
            /* Logged In Hunter Profile State */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#0A122E]/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-950/90 border-b border-l border-emerald-500/40 rounded-bl-lg text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  VAULT SYNC ACTIVE
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full border-2 border-[#00E5FF] overflow-hidden bg-black shrink-0 shadow-md shadow-cyan-900/50">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Hunter avatar"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cyan-950 text-[#00E5FF] font-orbitron font-bold text-lg">
                        {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'H'}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-white font-orbitron font-bold text-base truncate">
                      {currentUser.displayName || hunter.name || 'Awakened Hunter'}
                    </div>
                    <div className="text-slate-400 text-xs font-mono truncate">
                      {currentUser.email}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-[#00E5FF]">
                      <span className="truncate">UID: {currentUser.uid.slice(0, 14)}...</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">{hunter.rank}-RANK LV.{hunter.level}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cyan-900/30 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Last Cloud Synchronization:</span>
                  <span className="text-cyan-300 font-bold">
                    {lastCloudSync ? lastCloudSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Continuous Sync Active'}
                  </span>
                </div>
              </div>

              {/* Sync Actions Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleManualSync}
                  disabled={isLoading || cloudSyncStatus === 'syncing'}
                  className="px-4 py-3 rounded-xl border border-cyan-500/50 bg-cyan-950/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>SAVE TO VAULT</span>
                </button>

                <button
                  onClick={handleRestore}
                  disabled={isLoading}
                  className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-500 font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>RESTORE DATA</span>
                </button>
              </div>

              {/* Log Out Button */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-900/50 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>DISCONNECT ACCOUNT (SIGN OUT)</span>
              </button>
            </div>
          ) : (
            /* Not Logged In State */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs font-rajdhani text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-orbitron font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>OFFLINE GUEST SESSION DETECTED</span>
                </div>
                <p className="leading-relaxed">
                  Your hunter progress (Level, S-Rank trials, daily quests, and habit streaks) is currently stored only in this browser's temporary cache. Sign in to link your account securely to the <strong>Google Firebase Monarch Vault</strong>.
                </p>
              </div>

              {/* Benefits Cards */}
              <div className="grid grid-cols-2 gap-2.5 text-[11px] font-rajdhani">
                <div className="p-2.5 rounded-lg border border-[#1A2548] bg-[#0A0F29]/60 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white font-orbitron text-[10px]">ENCRYPTED BACKUP</div>
                    <div className="text-slate-400">Zero data loss on cache clear or phone restart.</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-[#1A2548] bg-[#0A0F29]/60 flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white font-orbitron text-[10px]">MULTI-DEVICE</div>
                    <div className="text-slate-400">Grind on your laptop, check off on mobile.</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-[#1A2548] bg-[#0A0F29]/60 flex items-start gap-2">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white font-orbitron text-[10px]">HABIT STREAK SAFE</div>
                    <div className="text-slate-400">Keep discipline streaks unbreakable forever.</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-[#1A2548] bg-[#0A0F29]/60 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white font-orbitron text-[10px]">MONARCH RECOGNITION</div>
                    <div className="text-slate-400">Certified S-Rank and National title status.</div>
                  </div>
                </div>
              </div>

              {/* Main Google Login Action Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl border-2 border-[#00E5FF] bg-gradient-to-r from-blue-950 via-[#0A1A40] to-cyan-950 text-white hover:text-black hover:bg-[#00E5FF] font-orbitron font-extrabold text-sm tracking-wider transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-cyan-950/80 group hover:shadow-cyan-400/50 cursor-pointer disabled:opacity-50"
              >
                {/* Google G SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.56 0 2.97.54 4.08 1.42l3.05-3.05C17.27 1.62 14.81 1 12 1 7.42 1 3.51 3.61 1.63 7.37l3.71 2.88C6.22 7.42 8.87 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.47-1.14 2.71-2.4 3.55l3.71 2.88c2.16-1.99 3.71-4.93 3.71-8.67z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.34 14.75c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.63 7.31C.59 9.38 0 11.64 0 14.03s.59 4.65 1.63 6.72l3.71-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.95-1.07 7.94-2.91l-3.71-2.88c-1.07.72-2.45 1.16-4.23 1.16-3.13 0-5.78-2.42-6.66-5.25L1.63 16.03C3.51 19.79 7.42 23 12 23z"
                  />
                </svg>
                <span>{isLoading ? 'ESTABLISHING SYSTEM LINK...' : 'SIGN IN WITH GOOGLE'}</span>
                <ArrowRight className="w-4 h-4 text-[#00E5FF] group-hover:text-black group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-4 border-t border-[#1A2548] text-center">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            SOLO ARISE • MONARCH DISCIPLINE ENGINE • AES-256 CLOUD VAULT
          </p>
        </div>

      </div>
    </div>
  );
};
