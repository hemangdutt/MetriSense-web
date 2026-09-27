import React from 'react';
import { useI18n } from '../../i18n';

interface StatusIndicatorProps {
  status: string;
}

/**
 * Restrained textual status indicator for government departmental registers.
 * Uses localized status strings and clear semantic text colors without decorative checkboxes or pills.
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const { t } = useI18n();
  const normalized = status.toUpperCase();
  const label = t.status[normalized] || status;

  if (
    normalized === 'PASS' ||
    normalized === 'COMPLIANT' ||
    normalized === 'APPROVED'
  ) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 whitespace-nowrap">
        <span aria-hidden="true" className="text-[10px]">●</span>
        <span>{label}</span>
      </span>
    );
  }

  if (
    normalized === 'FAIL' ||
    normalized === 'NON-COMPLIANT' ||
    normalized === 'REJECTED'
  ) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-800 whitespace-nowrap">
        <span aria-hidden="true" className="text-[10px]">■</span>
        <span>{label}</span>
      </span>
    );
  }

  if (
    normalized === 'IN PROGRESS' ||
    normalized === 'UNDER REVIEW' ||
    normalized === 'INCOMPLETE' ||
    normalized === 'PENDING'
  ) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 whitespace-nowrap">
        <span aria-hidden="true" className="text-[10px]">▲</span>
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 whitespace-nowrap">
      <span>{label}</span>
    </span>
  );
};
