import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      name,
      options = [],
      placeholder = 'Select an option',
      className = '',
      containerClassName = '',
      required = false,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || name;

    return (
      <div className={`flex flex-col space-y-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={selectId} className="text-[11px] uppercase tracking-[0.12em] font-medium text-[#24251F]/80">
            {label} {required && <span className="text-[#BD8856]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            name={name}
            className={`w-full px-4 py-3 text-base sm:text-sm bg-white/70 border transition-colors focus:outline-none focus:bg-white appearance-none cursor-pointer pr-10 ${
              error
                ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600 text-rose-900'
                : 'border-[#DED9CE] focus:border-[#435640] focus:ring-1 focus:ring-[#435640] text-[#24251F]'
            } ${className}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {children ||
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#24251F]/50">
            <ChevronDown className="w-4 h-4 stroke-[1.5]" />
          </div>
        </div>
        {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#24251F]/50 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
