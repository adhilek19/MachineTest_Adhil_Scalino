import React from 'react';
import { Coffee } from 'lucide-react';
import Button from './Button';

export function EmptyState({
  icon: Icon = Coffee,
  title = 'No items available',
  description = 'There are currently no records to present.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#DED7CB] bg-[#F6F3EC] my-6">
      <div className="w-12 h-12 flex items-center justify-center text-[#435640] mb-3">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="font-serif text-xl text-[#24251F]">{title}</h3>
      <p className="mt-1.5 text-xs text-[#24251F]/60 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
