import React from 'react';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'blue' | 'purple' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isSuccess?: boolean;
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'cyan',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5 font-semibold',
  };

  const variantClasses = {
    cyan: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_-3px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_0px_rgba(6,182,212,0.65)] border border-cyan-400/40',
    blue: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_-3px_rgba(37,99,235,0.45)] hover:shadow-[0_0_25px_0px_rgba(37,99,235,0.65)] border border-blue-400/30',
    purple: 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_-3px_rgba(147,51,234,0.45)] hover:shadow-[0_0_25px_0px_rgba(147,51,234,0.65)] border border-purple-400/30',
    outline: 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-slate-700/80 hover:border-cyan-500/50 hover:text-cyan-300 shadow-sm',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_-3px_rgba(225,29,72,0.45)] border border-rose-400/30',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : isSuccess ? (
        <span>Done ✓</span>
      ) : (
        children
      )}
    </button>
  );
};
