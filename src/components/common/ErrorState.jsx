import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export function ErrorState({
  title = 'Information unavailable',
  message = 'We encountered an error loading this section.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-6 text-center bg-[#EDE8DE]/40 border border-[#DED7CB] max-w-lg mx-auto">
      <div className="w-10 h-10 rounded-full bg-[#BD8856]/10 flex items-center justify-center text-[#BD8856] mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="font-serif text-lg text-[#24251F]">{title}</h3>
      <p className="mt-1 text-xs text-[#24251F]/70 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            icon={RefreshCw}
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
