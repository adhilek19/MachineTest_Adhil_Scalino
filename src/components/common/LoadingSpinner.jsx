import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', message = 'Loading...', fullScreen = false }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-[#24251F]">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-[#435640] mb-3`} />
      {message && <p className="text-xs uppercase tracking-[0.14em] font-medium text-[#24251F]/60">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24251F]/40 backdrop-blur-sm">
        <div className="bg-[#F6F3EC] p-8 border border-[#DED9CE] shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export default LoadingSpinner;
