import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#F6F3EC]';

  const variants = {
    primary: 'bg-[#435640] hover:bg-[#364634] text-[#F6F3EC] focus:ring-[#435640]',
    secondary: 'bg-[#24251F] hover:bg-[#383a31] text-[#F6F3EC] focus:ring-[#24251F]',
    accent: 'bg-[#BD8856] hover:bg-[#A67444] text-white focus:ring-[#BD8856]',
    outline: 'border border-[#24251F]/30 bg-transparent hover:bg-[#24251F] hover:text-[#F6F3EC] text-[#24251F] focus:ring-[#24251F]',
    outlineLight: 'border border-[#F6F3EC]/40 bg-transparent hover:bg-[#F6F3EC] hover:text-[#24251F] text-[#F6F3EC] focus:ring-[#F6F3EC]',
    ghost: 'text-[#24251F] hover:bg-[#24251F]/5 focus:ring-[#24251F]',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white focus:ring-rose-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs uppercase tracking-[0.1em]',
    md: 'px-6 py-3 text-xs uppercase tracking-[0.12em]',
    lg: 'px-8 py-3.5 text-xs sm:text-sm uppercase tracking-[0.14em]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {Icon && iconPosition === 'left' && <Icon className="w-3.5 h-3.5" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-3.5 h-3.5" />}
        </span>
      )}
    </button>
  );
}

export default Button;
