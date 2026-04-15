import React from 'react';
import { AllergyValue } from '../types';
import { cn } from './Modal';

interface AllergyToggleProps {
  value?: AllergyValue;
  onChange: (value: AllergyValue) => void;
}

export function AllergyToggle({ value, onChange }: AllergyToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange('NAO')}
        className={cn(
          'h-10 rounded-lg border text-sm font-semibold transition-colors',
          value === 'NAO'
            ? 'border-emerald-300 bg-emerald-100 text-emerald-900'
            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
        )}
      >
        NAO
      </button>
      <button
        type="button"
        onClick={() => onChange('SIM')}
        className={cn(
          'h-10 rounded-lg border text-sm font-semibold transition-colors',
          value === 'SIM'
            ? 'border-rose-300 bg-rose-100 text-rose-900'
            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
        )}
      >
        SIM
      </button>
    </div>
  );
}
