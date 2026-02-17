import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = false, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-background hover:bg-primary/90',
      secondary: 'bg-secondary text-foreground hover:bg-secondary/90',
      outline: 'border border-primary text-primary hover:bg-primary/10',
      ghost: 'hover:bg-primary/10 text-primary',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg font-bold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-sm font-mono uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group',
          variants[variant],
          sizes[size],
          glow && 'glow-primary',
          className
        )}
        {...props}
      >
        <span className="relative z-10">{props.children}</span>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -bottom-full -left-full w-full h-full bg-primary/20 transition-all duration-500 group-hover:bottom-0 group-hover:left-0" />
      </button>
    );
  }
);

Button.displayName = 'Button';
