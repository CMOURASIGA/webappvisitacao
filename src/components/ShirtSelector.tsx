import React from 'react';
import { cn } from './Modal';
import { ShirtSize } from '../types';

interface ShirtSelectorProps {
  value?: ShirtSize;
  onChange: (value: ShirtSize) => void;
}

const OPTIONS: ShirtSize[] = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

export function ShirtSelector({ value, onChange }: ShirtSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {OPTIONS.map((item) => {
        const selected = value === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              'h-10 rounded-lg border text-sm font-semibold transition-colors',
              selected
                ? 'bg-[var(--color-brand-dark)] border-[var(--color-brand-dark)] text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50',
            )}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
