/**
 * Authentic Solo Leveling Preset Avatars (Rendered as high-res clean SVG Data URIs)
 * Guaranteed zero broken links, instant load, ultra-crisp anime aesthetic.
 */

const createSvgDataUrl = (svg: string) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export interface AvatarPreset {
  id: string;
  name: string;
  subtitle: string;
  dataUrl: string;
}

export const MONARCH_AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'jinwoo_awakened',
    name: 'Sung Jinwoo',
    subtitle: 'Awakened Shadow Monarch',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <radialGradient id="v1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0E1E4F"/>
            <stop offset="100%" stop-color="#02030A"/>
          </radialGradient>
          <filter id="b1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="200" height="200" rx="30" fill="url(#v1)"/>
        <!-- Face Silhouette -->
        <path d="M100,30 C70,30 60,65 60,95 C60,135 80,165 100,175 C120,165 140,135 140,95 C140,65 130,30 100,30 Z" fill="#0C142E"/>
        <!-- Dark Spiky Hair -->
        <path d="M45,75 L60,40 L78,55 L95,25 L115,50 L135,28 L145,60 L160,85 L145,88 L130,70 L115,100 L95,70 L75,95 L65,80 Z" fill="#050817"/>
        <!-- Glowing Monarch Eyes -->
        <ellipse cx="80" cy="100" rx="12" ry="4" transform="rotate(-10 80 100)" fill="#00E5FF" filter="url(#b1)"/>
        <ellipse cx="120" cy="100" rx="12" ry="4" transform="rotate(10 120 100)" fill="#00E5FF" filter="url(#b1)"/>
        <circle cx="80" cy="100" r="2.5" fill="#FFFFFF"/>
        <circle cx="120" cy="100" r="2.5" fill="#FFFFFF"/>
        <!-- Shadow Aura -->
        <path d="M40,185 C60,150 100,140 100,140 C100,140 140,150 160,185 Z" fill="#00E5FF" opacity="0.3" filter="url(#b1)"/>
      </svg>
    `),
  },
  {
    id: 'commander_igris',
    name: 'Commander Igris',
    subtitle: 'Blood-Red Knight',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <radialGradient id="v2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#3A0812"/>
            <stop offset="100%" stop-color="#060205"/>
          </radialGradient>
          <filter id="b2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="200" height="200" rx="30" fill="url(#v2)"/>
        <!-- Knight Plume -->
        <path d="M100,20 C100,5 140,10 150,45 C150,70 120,60 100,50 Z" fill="#FF2D55" filter="url(#b2)"/>
        <!-- Helmet Silhouette -->
        <polygon points="100,45 135,75 125,145 100,165 75,145 65,75" fill="#180408" stroke="#FF2D55" stroke-width="2"/>
        <!-- Visor Slit (Red Glow) -->
        <line x1="78" y1="95" x2="122" y2="95" stroke="#FF2D55" stroke-width="4" filter="url(#b2)"/>
        <line x1="85" y1="95" x2="115" y2="95" stroke="#FFFFFF" stroke-width="2"/>
      </svg>
    `),
  },
  {
    id: 'ant_king_beru',
    name: 'Marshal Beru',
    subtitle: 'Predatory Ant King',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <radialGradient id="v3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1B0A33"/>
            <stop offset="100%" stop-color="#040108"/>
          </radialGradient>
          <filter id="b3" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="200" height="200" rx="30" fill="url(#v3)"/>
        <!-- Antennae & Exoskeleton -->
        <path d="M85,50 Q60,15 45,25 M115,50 Q140,15 155,25" stroke="#9B5DE5" stroke-width="3" fill="none" filter="url(#b3)"/>
        <polygon points="100,50 140,80 130,150 100,170 70,150 60,80" fill="#0C031A" stroke="#9B5DE5" stroke-width="2"/>
        <!-- Menacing Purple Eyes -->
        <polygon points="75,90 92,95 78,105" fill="#9B5DE5" filter="url(#b3)"/>
        <polygon points="125,90 108,95 122,105" fill="#9B5DE5" filter="url(#b3)"/>
        <circle cx="85" cy="97" r="2" fill="#FFFFFF"/>
        <circle cx="115" cy="97" r="2" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: 'giant_iron',
    name: 'Shieldmaster Iron',
    subtitle: 'Shadow Vanguard Tank',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <radialGradient id="v4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1C2D42"/>
            <stop offset="100%" stop-color="#05080E"/>
          </radialGradient>
          <filter id="b4" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="200" height="200" rx="30" fill="url(#v4)"/>
        <!-- Horned Greathelm -->
        <path d="M60,70 L35,40 L65,55 M140,70 L165,40 L135,55" stroke="#00E5FF" stroke-width="3" fill="#0D1826" filter="url(#b4)"/>
        <polygon points="100,55 145,85 135,160 100,175 65,160 55,85" fill="#070D17" stroke="#4D9FFF" stroke-width="2.5"/>
        <!-- Dual Glowing Slits -->
        <rect x="75" y="98" width="18" height="6" rx="2" fill="#00E5FF" filter="url(#b4)"/>
        <rect x="107" y="98" width="18" height="6" rx="2" fill="#00E5FF" filter="url(#b4)"/>
      </svg>
    `),
  },
];
