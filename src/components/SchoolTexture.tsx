import React from 'react';

export const SchoolTexture: React.FC = () => {
  // School material icons pattern (pencils, books, rulers, chalkboard)
  const texturePattern = `data:image/svg+xml,${encodeURIComponent(`
    <svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='schoolPattern' x='0' y='0' width='200' height='200' patternUnits='userSpaceOnUse'>
          <!-- Pencil icon -->
          <path d='M20 20 L35 20 L30 35 L15 35 Z' fill='%23000000' opacity='0.03'/>
          <!-- Book icon -->
          <rect x='60' y='15' width='20' height='25' fill='%23000000' opacity='0.03'/>
          <line x1='60' y1='20' x2='80' y2='20' stroke='%23000000' stroke-width='0.5' opacity='0.03'/>
          <!-- Ruler icon -->
          <rect x='110' y='18' width='25' height='3' fill='%23000000' opacity='0.03'/>
          <line x1='115' y1='18' x2='115' y2='21' stroke='%23000000' stroke-width='0.3' opacity='0.03'/>
          <line x1='120' y1='18' x2='120' y2='21' stroke='%23000000' stroke-width='0.3' opacity='0.03'/>
          <!-- Chalkboard icon -->
          <rect x='150' y='12' width='30' height='20' fill='none' stroke='%23000000' stroke-width='0.5' opacity='0.03'/>
          <line x1='155' y1='17' x2='175' y2='17' stroke='%23000000' stroke-width='0.3' opacity='0.03'/>
          <line x1='155' y1='22' x2='170' y2='22' stroke='%23000000' stroke-width='0.3' opacity='0.03'/>
          
          <!-- Repeat pattern -->
          <use href='#schoolPattern' x='0' y='50'/>
          <use href='#schoolPattern' x='0' y='100'/>
          <use href='#schoolPattern' x='0' y='150'/>
        </pattern>
      </defs>
      <rect width='200' height='200' fill='url(%23schoolPattern)'/>
    </svg>
  `)}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-30 z-0"
      style={{
        backgroundImage: `url("${texturePattern}")`,
        backgroundRepeat: 'repeat',
      }}
      aria-hidden="true"
    />
  );
};

