import type { ButtonHTMLAttributes } from 'react';
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'black';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-900/5",
    secondary: "bg-white/20 hover:bg-white/30 text-white border border-white/10 backdrop-blur-sm shadow-lg",
    black: "bg-[#000000CC] text-white hover:bg-black shadow-lg"
  };

  return (
    <button 
      className={cn(
        "px-6 py-4 rounded-3xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props} 
    />
  );
}
