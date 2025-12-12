import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = false,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logo.png" 
        alt="E-shuri Logo" 
        className={`${sizeClasses[size]} w-auto`}
      />
      {showText && (
        <span className="font-semibold text-lg hidden sm:inline-block">E-shuri</span>
      )}
    </Link>
  );
};

