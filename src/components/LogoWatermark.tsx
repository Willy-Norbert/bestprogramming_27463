import React from 'react';

export const LogoWatermark: React.FC = () => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }}
    >
      <img 
        src="/logo.png" 
        alt="E-shuri Logo Watermark" 
        className="w-full h-full object-contain max-w-[90vw] max-h-[90vh]"
        style={{ filter: 'grayscale(100%) brightness(0.3)' }}
      />
    </div>
  );
};

