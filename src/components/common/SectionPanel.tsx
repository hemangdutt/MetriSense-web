import React from 'react';

interface SectionPanelProps {
  title: string;
  clauseRef?: string;
  subtitle?: string;
  rightActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SectionPanel: React.FC<SectionPanelProps> = ({
  title,
  clauseRef,
  subtitle,
  rightActions,
  children,
  className = '',
}) => {
  return (
    <section className={`gov-panel min-w-0 ${className}`}>
      <div className="gov-section-header flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
            <h2 className="text-sm font-bold text-slate-950">{title}</h2>
            {clauseRef && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-xs font-semibold text-[#12355B]">
                  {clauseRef}
                </span>
              </>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {rightActions && (
          <div className="flex flex-wrap items-center gap-2 no-print shrink-0">
            {rightActions}
          </div>
        )}
      </div>
      <div className="p-4 min-w-0">{children}</div>
    </section>
  );
};
