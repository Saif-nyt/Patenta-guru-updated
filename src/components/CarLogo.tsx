import React from 'react';

interface CarLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CarLogo: React.FC<CarLogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: 'h-6 sm:h-7 w-auto',
    md: 'h-8 sm:h-10 w-auto',
    lg: 'h-10 sm:h-12 w-auto',
    xl: 'h-12 sm:h-15 w-auto',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}>
      <img
        src="/car-logo.png"
        alt="Patente Guru Logo"
        className={`${dimensions[size]} object-contain rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none`}
        loading="eager"
      />
    </div>
  );
};
