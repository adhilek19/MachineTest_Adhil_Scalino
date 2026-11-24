import React, { forwardRef } from 'react';

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      name,
      rows = 4,
      className = '',
      containerClassName = '',
      required = false,
      ...props
    },
    ref
  ) => {
    const textareaId = id || name;

    return (
      <div className={`flex flex-col space-y-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={textareaId} className="text-[11px] uppercase tracking-[0.12em] font-medium text-[#24251F]/80">
            {label} {required && <span className="text-[#BD8856]">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          className={`w-full px-4 py-3 text-sm bg-white/70 border transition-colors focus:outline-none focus:bg-white resize-y ${
            error
              ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600 text-rose-900 placeholder:text-rose-300'
              : 'border-[#DED9CE] focus:border-[#435640] focus:ring-1 focus:ring-[#435640] text-[#24251F] placeholder:text-[#24251F]/40'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#24251F]/50 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
