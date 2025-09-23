import React, { ReactNode } from 'react';

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'terminal';
  hover?: boolean;
}

export default function CyberCard({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true 
}: CyberCardProps) {
  const baseClasses = 'glass-card transition-all duration-300';
  
  const variantClasses = {
    default: 'p-6',
    terminal: 'terminal p-0 overflow-hidden'
  };

  const hoverClasses = hover ? 'hover:scale-[1.02]' : '';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}