import React from 'react';

/**
 * High-fidelity vector illustrations and icons matching the SETO design aesthetic
 */

// SETO 4-lobed geometric logo mark
export const SetoLogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 26, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 28 28" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M14 2C15.1046 2 16 2.89543 16 4V10.2C16 11.1941 16.8059 12 17.8 12H24C25.1046 12 26 12.8954 26 14C26 15.1046 25.1046 16 24 16H17.8C16.8059 16 16 16.8059 16 17.8V24C16 25.1046 15.1046 26 14 26C12.8954 26 12 25.1046 12 24V17.8C12 16.8059 11.1941 16 10.2 16H4C2.89543 16 2 15.1046 2 14C2 12.8954 2.89543 12 4 12H10.2C11.1941 12 12 11.1941 12 10.2V4C12 2.89543 12.8954 2 14 2Z" 
      fill="currentColor"
    />
  </svg>
);

// Central Iridescent Chromatic 8-Pointed Crystal Star
export const IridescentCrystalStar: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <div className="seto-crystal-wrapper" style={{ width: size, height: size }}>
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="seto-crystal-svg"
    >
      <defs>
        {/* Soft background ambient radial glow */}
        <radialGradient id="crystalAmbientGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F9A8D4" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#FDE68A" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#C4B5FD" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        {/* Primary Vertical/Horizontal Diamond Gradient */}
        <linearGradient id="starGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
          <stop offset="25%" stopColor="#F472B6" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.9" />
          <stop offset="75%" stopColor="#60A5FA" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.9" />
        </linearGradient>

        {/* Diagonal Cross Gradient with Iridescent Hue */}
        <linearGradient id="starGradDiag" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#FB7185" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.75" />
        </linearGradient>

        {/* Center Bright Highlight */}
        <radialGradient id="centerHighlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="40%" stopColor="#FFF1F2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
        </radialGradient>
        
        <filter id="crystalBlurGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Atmospheric Glow Circle */}
      <circle cx="60" cy="60" r="54" fill="url(#crystalAmbientGlow)" />

      {/* Diagonal 4-Point Star Rays */}
      <path 
        d="M60 26 C60 48 48 60 26 60 C48 60 60 72 60 94 C60 72 72 60 94 60 C72 60 60 48 60 26 Z" 
        fill="url(#starGradDiag)" 
        transform="rotate(45 60 60)" 
        opacity="0.8"
      />

      {/* Main 4-Point Elongated Star Ray */}
      <path 
        d="M60 12 C60 46 46 60 12 60 C46 60 60 74 60 108 C60 74 74 60 108 60 C74 60 60 46 60 12 Z" 
        fill="url(#starGradMain)"
        filter="url(#crystalBlurGlow)"
      />

      {/* Inner sharp refraction facets */}
      <path 
        d="M60 22 C60 48 48 60 22 60 C48 60 60 72 60 98 C60 72 72 60 98 60 C72 60 60 48 60 22 Z" 
        fill="rgba(255, 255, 255, 0.4)" 
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* Central Radiant Diamond core */}
      <circle cx="60" cy="60" r="14" fill="url(#centerHighlight)" />
      <circle cx="60" cy="60" r="6" fill="#FFFFFF" opacity="0.95" />
    </svg>
  </div>
);

// 3D Pastel Star Icon for "Generate visual"
export const PastelStar3DIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pastelStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="50%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
      <filter id="softShadow3D" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#C084FC" floodOpacity="0.25" />
      </filter>
    </defs>
    <path 
      d="M24 6L28.8 17.2L40.8 18.5L31.8 26.6L34.3 38.5L24 32.5L13.7 38.5L16.2 26.6L7.2 18.5L19.2 17.2L24 6Z" 
      fill="url(#pastelStarGrad)" 
      filter="url(#softShadow3D)"
    />
    <path 
      d="M24 9L27.6 17.4L36.6 18.4L29.8 24.5L31.7 33.5L24 29L16.3 33.5L18.2 24.5L11.4 18.4L20.4 17.4L24 9Z" 
      fill="#FFFFFF" 
      opacity="0.3" 
    />
  </svg>
);

// 3D Pastel Pencil Icon for "Improve prompt"
export const PastelPencil3DIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pencilBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E879F9" />
      </linearGradient>
      <linearGradient id="pencilTipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <g transform="rotate(-45 24 24)">
      {/* Pencil Barrel */}
      <rect x="20" y="8" width="8" height="24" rx="2" fill="url(#pencilBodyGrad)" />
      {/* Eraser / Top */}
      <path d="M20 8C20 6 22 4 24 4C26 4 28 6 28 8H20Z" fill="#F472B6" />
      {/* Metal band */}
      <rect x="20" y="8" width="8" height="3" fill="#E2E8F0" />
      {/* Wood tip */}
      <polygon points="20,32 28,32 24,40" fill="#FED7AA" />
      {/* Graphite point */}
      <polygon points="22.5,37 25.5,37 24,40" fill="url(#pencilTipGrad)" />
      {/* Subtle shine line */}
      <line x1="22" y1="12" x2="22" y2="30" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

// 3D Pastel Palette Icon for "Explore styles"
export const PastelPalette3DIcon: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="paletteBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EDE9FE" />
        <stop offset="60%" stopColor="#DDD6FE" />
        <stop offset="100%" stopColor="#C4B5FD" />
      </linearGradient>
    </defs>
    {/* Palette shape */}
    <path 
      d="M24 6C13.5 6 6 13.5 6 24C6 31 11 36.5 17.5 36.5C19 36.5 20.2 35.3 20.2 33.8C20.2 33.1 19.9 32.5 19.5 31.9C19 31.3 18.7 30.5 18.7 29.6C18.7 27.6 20.3 26 22.3 26H26C34.8 26 42 20.8 42 14.5C42 9.8 34 6 24 6Z" 
      fill="url(#paletteBodyGrad)" 
    />
    {/* Colored paint wells */}
    <circle cx="16" cy="15" r="3.2" fill="#F87171" />
    <circle cx="25" cy="13" r="3.2" fill="#FBBF24" />
    <circle cx="34" cy="16" r="3.2" fill="#34D399" />
    <circle cx="14" cy="24" r="3.2" fill="#60A5FA" />
    <circle cx="30" cy="30" r="3" fill="#A78BFA" opacity="0.8" />
  </svg>
);
