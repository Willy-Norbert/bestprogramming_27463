import React from 'react';

interface AfricanTextureProps {
  className?: string;
  opacity?: number;
}

export const AfricanTexture: React.FC<AfricanTextureProps> = ({ 
  className = '', 
  opacity = 0.15 
}) => {
  // African geometric pattern (imgongo-inspired design)
  const africanPattern = `data:image/svg+xml,${encodeURIComponent(`
    <svg width='150' height='150' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='africanPattern' x='0' y='0' width='150' height='150' patternUnits='userSpaceOnUse'>
          <!-- Geometric diamond shapes -->
          <path d='M30 30 L45 20 L60 30 L45 40 Z' fill='%23ffffff' opacity='${opacity}'/>
          <path d='M90 30 L105 20 L120 30 L105 40 Z' fill='%23ffffff' opacity='${opacity}'/>
          <!-- Triangle patterns -->
          <path d='M20 60 L30 50 L40 60 L30 70 Z' fill='%23ffffff' opacity='${opacity}'/>
          <path d='M80 60 L90 50 L100 60 L90 70 Z' fill='%23ffffff' opacity='${opacity}'/>
          <path d='M110 60 L120 50 L130 60 L120 70 Z' fill='%23ffffff' opacity='${opacity}'/>
          <!-- Zigzag lines -->
          <path d='M10 90 L25 85 L40 90 L55 85 L70 90' stroke='%23ffffff' stroke-width='1' fill='none' opacity='${opacity}'/>
          <path d='M80 90 L95 85 L110 90 L125 85 L140 90' stroke='%23ffffff' stroke-width='1' fill='none' opacity='${opacity}'/>
          <!-- Small dots/circles -->
          <circle cx='15' cy='110' r='2' fill='%23ffffff' opacity='${opacity}'/>
          <circle cx='35' cy='110' r='2' fill='%23ffffff' opacity='${opacity}'/>
          <circle cx='55' cy='110' r='2' fill='%23ffffff' opacity='${opacity}'/>
          <circle cx='75' cy='110' r='2' fill='%23ffffff' opacity='${opacity}'/>
          <circle cx='95' cy='110' r='2' fill='%23ffffff' opacity='${opacity}'/>
          <circle cx='115' cy='110' r='2' fill='%23ffffff' opacity='${opacity}'/>
          <circle cx='135' cy='110' r='2' fill='%23ffffff' opacity='${opacity}'/>
          <!-- Cross patterns -->
          <line x1='20' y1='125' x2='30' y2='135' stroke='%23ffffff' stroke-width='1' opacity='${opacity}'/>
          <line x1='30' y1='125' x2='20' y2='135' stroke='%23ffffff' stroke-width='1' opacity='${opacity}'/>
          <line x1='50' y1='125' x2='60' y2='135' stroke='%23ffffff' stroke-width='1' opacity='${opacity}'/>
          <line x1='60' y1='125' x2='50' y2='135' stroke='%23ffffff' stroke-width='1' opacity='${opacity}'/>
          <line x1='100' y1='125' x2='110' y2='135' stroke='%23ffffff' stroke-width='1' opacity='${opacity}'/>
          <line x1='110' y1='125' x2='100' y2='135' stroke='%23ffffff' stroke-width='1' opacity='${opacity}'/>
          <line x1='130' y1='125' x2='140' y2='135' stroke='%23ffffff' stroke-width='1' opacity='${opacity}'/>
          <line x1='140' y1='125' x2='130' y2='135' stroke='%23ffffff' stroke-width='1' opacity='${opacity}'/>
        </pattern>
      </defs>
      <rect width='150' height='150' fill='url(%23africanPattern)'/>
    </svg>
  `)}`;

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        backgroundImage: `url("${africanPattern}")`,
        backgroundRepeat: 'repeat',
      }}
      aria-hidden="true"
    />
  );
};

