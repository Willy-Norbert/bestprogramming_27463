import React from 'react';
import { AfricanTexture } from './AfricanTexture';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-brand-primary-dark text-white py-4 relative">
      <AfricanTexture opacity={0.2} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <p className="text-center text-sm">
          © {currentYear} E-shuri. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

