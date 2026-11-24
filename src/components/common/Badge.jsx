import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
  const variants = {
    neutral: 'bg-[#EDE8DE] text-[#24251F] border-[#DED7CB]',
    primary: 'bg-[#EBF0EA] text-[#435640] border-[#D2DEC1]',
    accent: 'bg-[#F8F1EA] text-[#BD8856] border-[#E8D2BD]',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    dark: 'bg-[#24251F] text-[#F6F3EC] border-[#24251F]',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[9px] tracking-[0.12em]',
    sm: 'px-2.5 py-1 text-[10px] tracking-[0.14em]',
    md: 'px-3 py-1.5 text-xs tracking-[0.12em]',
  };

  return (
    <span
      className={`inline-flex items-center uppercase font-medium border ${variants[variant] || variants.neutral} ${
        sizes[size] || sizes.sm
      } ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
