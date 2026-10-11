import React from 'react';

interface SystemLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
  withText?: boolean;
}

export const SystemLogo: React.FC<SystemLogoProps> = ({
  className = '',
  size = 36,
  glow = true,
  withText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`relative flex items-center justify-center shrink-0 transition-all ${
          glow ? 'glow-blue' : ''
        }`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]"
        >
          {/* Background Outer Rune Diamond */}
          <polygon
            points="50,4 96,50 50,96 4,50"
            fill="#060919"
            stroke="#192850"
            strokeWidth="2"
          />

          {/* Glowing Inner System Diamond Border */}
          <polygon
            points="50,11 89,50 50,89 11,50"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          />

          {/* Geometric Tech Brackets (Solo Leveling System UI Style) */}
          <path
            d="M26,36 L18,50 L26,64"
            stroke="#00E5FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M74,36 L82,50 L74,64"
            stroke="#00E5FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Shadow Monarch Dagger & Monarch Rune Core */}
          <path
            d="M50,18 L57,48 L50,82 L43,48 Z"
            fill="url(#monarchCoreGrad)"
            stroke="#00E5FF"
            strokeWidth="1.2"
          />

          {/* Twin Glowing Monarch Eyes */}
          <ellipse
            cx="40"
            cy="46"
            rx="5.5"
            ry="2.2"
            transform="rotate(-18 40 46)"
            fill="#00E5FF"
          />
          <ellipse
            cx="60"
            cy="46"
            rx="5.5"
            ry="2.2"
            transform="rotate(18 60 46)"
            fill="#00E5FF"
          />
          <circle cx="40" cy="46" r="1.2" fill="#FFFFFF" />
          <circle cx="60" cy="46" r="1.2" fill="#FFFFFF" />

          {/* Central Awakening Mana Spark */}
          <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
          <line x1="50" y1="26" x2="50" y2="74" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />

          {/* Gradients */}
          <defs>
            <linearGradient id="monarchCoreGrad" x1="50" y1="18" x2="50" y2="82" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00E5FF" />
              <stop offset="0.4" stopColor="#3070FF" />
              <stop offset="0.8" stopColor="#142050" />
              <stop offset="1" stopColor="#050716" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-orbitron font-black text-base sm:text-lg tracking-widest text-white">
              SOLO ARISE
            </span>
            <span className="text-[10px] font-mono-system text-[#00E5FF] px-1 py-0.2 rounded border border-[#00E5FF]/40 bg-[#00E5FF]/10 font-bold">
              SYSTEM
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#8899BB] tracking-wider mt-0.5">
            PLAYER INTERFACE · V4.2
          </span>
        </div>
      )}
    </div>
  );
};
