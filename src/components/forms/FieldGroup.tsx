import React from 'react';

interface FieldGroupProps {
  label: string;
  unit?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FieldGroup: React.FC<FieldGroupProps> = ({
  label,
  unit,
  hint,
  error,
  required,
  children,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-xs font-semibold text-slate-800">
          {label}
          {required && <span className="text-red-700 ml-0.5">*</span>}
        </label>
        {unit && <span className="font-mono-tech text-xs text-slate-500">{unit}</span>}
      </div>
      {children}
      {hint && !error && <span className="text-[11px] text-slate-500 mt-1">{hint}</span>}
      {error && <span className="text-[11px] font-medium text-red-700 mt-1">{error}</span>}
    </div>
  );
};
